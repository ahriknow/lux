/**
 * LuxElement — Base class for Web Components.
 *
 * Inherits: HTMLElement → LuxElement
 * Features: reactive properties, Shadow DOM, lifecycle, controllers, update batching
 */

import { html, render, isTemplateResult } from './template.js';

// ─── Update scheduling ───
const pendingUpdates = new Set();
let updateScheduled = false;

function scheduleMicroTask(fn) {
    Promise.resolve().then(fn);
}

function enqueueUpdate(element) {
    pendingUpdates.add(element);
    if (!updateScheduled) {
        updateScheduled = true;
        scheduleMicroTask(() => {
            updateScheduled = false;
            const elements = [...pendingUpdates];
            pendingUpdates.clear();
            for (const el of elements) {
                el._$performUpdate();
            }
        });
    }
}

// ─── Default converter (attribute ↔ property) ───
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value ? '' : null;
            case Object:
            case Array:
                return value == null ? null : JSON.stringify(value);
            default:
                return value;
        }
    },
    fromAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value !== null;
            case Number:
                return Number(value);
            case Object:
            case Array:
                try {
                    return JSON.parse(value);
                } catch {
                    return null;
                }
            default:
                return value;
        }
    },
};

// ─── LuxElement ───
export class LuxElement extends HTMLElement {
    // ─── Static: properties declaration ───
    static properties = {};
    static styles = undefined;

    // ─── Static: finalization ───
    static finalized = false;
    static elementProperties = new Map();

    // ─── Static: __prepare() — subclass isolation ───
    static __prepare() {
        if (this.hasOwnProperty('elementProperties')) {
            return;
        }
        // Finalize any superclasses first
        const superCtor = Object.getPrototypeOf(this);
        if (superCtor.finalize) {
            superCtor.finalize();
        }
        // Copy superclass elementProperties into own Map
        this.elementProperties = new Map(superCtor.elementProperties);
    }

    static get observedAttributes() {
        this.finalize();
        return this.__attributeToPropertyMap ? [...this.__attributeToPropertyMap.keys()] : [];
    }

    static finalize() {
        if (this.hasOwnProperty('finalized')) {
            return;
        }
        this.finalized = true;
        this.__prepare();

        // Create properties from the static properties block
        if (this.hasOwnProperty('properties')) {
            const props = this.properties;
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...Object.getOwnPropertySymbols(props),
            ];
            for (const p of propKeys) {
                this.createProperty(p, props[p]);
            }
        }

        // Create the attribute-to-property map
        this.__attributeToPropertyMap = new Map();
        for (const [p, options] of this.elementProperties) {
            const attr = this.__attributeNameForProperty(p, options);
            if (attr !== undefined) {
                this.__attributeToPropertyMap.set(attr, p);
            }
        }

        this.elementStyles = this.styles;
    }

    static __attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false
            ? undefined
            : typeof attribute === 'string'
              ? attribute
              : typeof name === 'string'
                ? name.replace(/([A-Z])/g, '-$1').toLowerCase()
                : undefined;
    }

    // ─── Static: createProperty ───
    static createProperty(name, options = {}) {
        this.__prepare();
        if (this.elementProperties.has(name)) return;

        if (options.state) {
            options = { ...options, attribute: false };
        }

        this.elementProperties.set(name, options);

        if (!options.noAccessor) {
            const key = Symbol();
            const descriptor = this.getPropertyDescriptor(name, key, options);
            if (descriptor !== undefined) {
                Object.defineProperty(this.prototype, name, descriptor);
            }
        }
    }

    static getPropertyDescriptor(name, key, options) {
        const { type, reflect, converter } = options;
        const toAttribute = converter?.toAttribute ?? defaultConverter.toAttribute;

        return {
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[key];
                this[key] = value;
                this.requestUpdate(name, oldValue, options);
            },
            configurable: true,
            enumerable: true,
        };
    }

    // ─── Static: addInitializer ───
    static _initializers = [];

    static addInitializer(fn) {
        this._initializers = [...(this._initializers || []), fn];
    }

    // ─── Static: shadowRootOptions ───
    static shadowRootOptions = { mode: 'open' };

    // ─── Constructor ───
    constructor() {
        super();

        this.__updatePending = false;
        this.__hasUpdated = false;
        this.__controllers = new Set();
        this.__reflectingProperty = null;

        // Ensure finalized
        if (!this.constructor.hasOwnProperty('finalized')) {
            this.constructor.finalize();
        }

        // CloneNode support: save any properties set before upgrade
        this.__saveInstanceProperties();

        this.requestUpdate();

        for (const fn of this.constructor._initializers || []) {
            fn(this);
        }
    }

    // ─── Instance properties save/replay (cloneNode support) ───
    __saveInstanceProperties() {
        const elementProperties = this.constructor.elementProperties;
        if (!elementProperties) return;

        for (const [name, options] of elementProperties) {
            if (options.noAccessor) continue;

            if (this.hasOwnProperty(name)) {
                // Plain property set before setter was defined (cloneNode)
                const value = this[name];
                delete this[name];
                // Store via the Symbol key
                this.__instancePropertyValues = this.__instancePropertyValues || new Map();
                this.__instancePropertyValues.set(name, value);
            }
        }
    }

    // ─── Lifecycle callbacks ───
    connectedCallback() {
        this.__controllers.forEach((c) => c.hostConnected?.());

        // Ensure finalized
        if (!this.constructor.hasOwnProperty('finalized')) {
            this.constructor.finalize();
        }

        // Sync existing attributes to properties (upgrade scenario)
        // attributeChangedCallback doesn't fire for pre-existing attributes
        const attrMap = this.constructor.__attributeToPropertyMap;
        if (attrMap) {
            for (const [attrName, propName] of attrMap) {
                const value = this.getAttribute(attrName);
                if (value !== null) {
                    const options = this.constructor.elementProperties.get(propName);
                    if (options) {
                        const fromAttr =
                            options.converter?.fromAttribute ?? defaultConverter.fromAttribute;
                        this[propName] = fromAttr(value, options.type);
                    }
                }
            }
        }

        // Replay instance properties saved by __saveInstanceProperties (cloneNode)
        if (this.__instancePropertyValues) {
            for (const [name, value] of this.__instancePropertyValues) {
                this[name] = value;
            }
            this.__instancePropertyValues = undefined;
        }

        // Ensure renderRoot is created
        this.renderRoot;

        // Trigger first update if not yet done
        if (!this.__hasUpdated) {
            this.requestUpdate();
        }
    }

    disconnectedCallback() {
        this.__controllers.forEach((c) => c.hostDisconnected?.());
    }

    attributeChangedCallback(name, _old, value) {
        const propName = this.constructor.__attributeToPropertyMap?.get(name);
        if (propName !== undefined && this.__reflectingProperty !== propName) {
            const options = this.constructor.elementProperties.get(propName);
            if (options) {
                const converter =
                    typeof options.converter === 'function'
                        ? { fromAttribute: options.converter }
                        : options.converter?.fromAttribute !== undefined
                          ? options.converter
                          : defaultConverter;
                this.__reflectingProperty = propName;
                const convertedValue = converter.fromAttribute(value, options.type);
                this[propName] = convertedValue;
                this.__reflectingProperty = null;
            }
        }
    }

    // ─── RenderRoot & Styles ───
    get renderRoot() {
        if (!this._renderRoot) {
            this._renderRoot = this.createRenderRoot();
            this.__adoptStyles();
        }
        return this._renderRoot;
    }

    createRenderRoot() {
        return this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    }

    __adoptStyles() {
        const styles = this.constructor.elementStyles;
        if (!styles) return;

        const items = Array.isArray(styles) ? styles : [styles];
        const parts = [];
        for (const item of items) {
            if (typeof item === 'string') {
                parts.push(item);
            } else if (isTemplateResult(item)) {
                parts.push(item.strings.join(''));
            }
        }
        if (parts.length === 0) return;

        if (this._renderRoot.adoptedStyleSheets !== undefined) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(parts.join('\n'));
            this._renderRoot.adoptedStyleSheets = [...this._renderRoot.adoptedStyleSheets, sheet];
        } else {
            const tag = document.createElement('style');
            tag.textContent = parts.join('\n');
            this._renderRoot.appendChild(tag);
        }
    }

    // ─── Update lifecycle ───
    enableUpdating(_requestedUpdate) {}

    get updateComplete() {
        return this.__updateCompletePromise ?? Promise.resolve();
    }

    get hasUpdated() {
        return this.__hasUpdated;
    }

    get isUpdatePending() {
        return this.__updatePending;
    }

    requestUpdate(name, oldValue, options) {
        if (name !== undefined) {
            const hasChanged = options?.hasChanged ?? ((v, o) => !Object.is(v, o));
            if (!hasChanged(this[name], oldValue)) return;
        }

        if (!this.__updatePending) {
            this.__updatePending = true;
            enqueueUpdate(this);
        }
    }

    async performUpdate() {
        if (!this.isUpdatePending) return;

        this.__updatePending = false;

        this.willUpdate(new Map());

        this.__controllers.forEach((c) => c.hostUpdate?.());

        this.update(new Map());

        this.__hasUpdated = true;

        // Reflect properties to attributes after update
        for (const [name, options] of this.constructor.elementProperties) {
            if (options.reflect) {
                const value = this[name];
                const toAttribute = options.converter?.toAttribute ?? defaultConverter.toAttribute;
                const attr = this.constructor.__attributeNameForProperty(name, options);
                if (attr !== undefined) {
                    this.__reflectingProperty = name;
                    const attrValue = toAttribute(value, options.type);
                    if (attrValue === null || attrValue === undefined) {
                        this.removeAttribute(attr);
                    } else {
                        this.setAttribute(attr, String(attrValue));
                    }
                    this.__reflectingProperty = null;
                }
            }
        }

        this.__controllers.forEach((c) => c.hostUpdated?.());
        this.firstUpdated(new Map());
        this.updated(new Map());
    }

    _$performUpdate() {
        this.performUpdate();
    }

    // ─── Lifecycle hooks ───
    shouldUpdate(_changedProperties) {
        return true;
    }

    willUpdate(_changedProperties) {}

    update(_changedProperties) {
        const result = this.render();
        if (result) {
            render(result, this.renderRoot, { host: this });
        }
    }

    render() {
        return html``;
    }

    firstUpdated(_changedProperties) {}
    updated(_changedProperties) {}
    propertyChangedCallback(_name, _oldValue, _newValue) {}

    // ─── Controller API ───
    addController(controller) {
        this.__controllers.add(controller);
        if (this.isConnected) {
            controller.hostConnected?.();
        }
    }

    removeController(controller) {
        this.__controllers.delete(controller);
    }

    // ─── Utilities ───
    emit(type, detail, options = {}) {
        return this.dispatchEvent(
            new CustomEvent(type, {
                detail,
                bubbles: true,
                composed: true,
                ...options,
            })
        );
    }

    $(selector) {
        return this.renderRoot.querySelector(selector);
    }

    $$(selector) {
        return this.renderRoot.querySelectorAll(selector);
    }
}

// ─── Register component ───
export function registerComponent(name, component) {
    if (!name.includes('-')) {
        throw new Error(`Component name must contain a hyphen: ${name}`);
    }
    if (!customElements.get(name)) {
        customElements.define(name, component);
    }
}

// ─── createComponent (function-based components) ───
export function createComponent(renderFn, options = {}) {
    const { properties = {} } = options;

    class DynamicComponent extends LuxElement {
        static properties = properties;
        render() {
            return renderFn.call(this, this);
        }
    }

    return DynamicComponent;
}
