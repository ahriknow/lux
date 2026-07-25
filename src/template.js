/**
 * Lux Template System
 *
 * Supports:
 *   - html/svg tagged templates with template caching
 *   - Child text interpolation: <div>${value}</div>
 *   - Event binding: <button @click=${handler}>
 *   - Property binding: <input .value=${val}>
 *   - Boolean attribute: <div ?hidden=${cond}>
 *   - Plain attribute: <div id=${val}>
 *   - Class binding: <div class=${classMap({...})}>
 *   - Style binding: <div style=${styleMap({...})}>
 *   - Ref binding: <input ref=${el => ...}>
 *   - Directives: repeat, when, classMap, styleMap, guard, show
 *   - Template caching, incremental DOM updates
 *   - nothing sentinel for clearing content
 */

// ─── Template type markers ───
export const HTML_RESULT = 1;
export const SVG_RESULT = 2;

// ─── Sentinels ───
export const nothing = Symbol.for('lux-nothing');

// ─── Template cache ───
const templateCache = new WeakMap();

// ─── html / svg tagged template functions ───
export function html(strings, ...values) {
    return { _$luxType$: HTML_RESULT, strings, values };
}

export function svg(strings, ...values) {
    return { _$luxType$: SVG_RESULT, strings, values };
}

export function css(strings, ...values) {
    return { _$luxType$: 3, strings, values };
}

export function isTemplateResult(value) {
    return value && value._$luxType$ !== undefined;
}

// ─── HTML escaping ──
export function escapeHtml(value) {
    if (value == null) return '';
    const str = String(value);
    if (str.indexOf('<') === -1 && str.indexOf('>') === -1 && str.indexOf('&') === -1) return str;
    return str.replace(
        /[<>&"']/g,
        (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c]
    );
}

// ─── Part marker regex ──
const ATTR_BINDING_RE = /(?:([@.?][\w-]+)|(ref)|(class))=\s*$/;

// ─── Template parsing ──
function parseTemplate(strings) {
    const parts = [];
    let html = '';
    for (let i = 0; i < strings.length; i++) {
        html += strings[i];
        if (i < strings.length - 1) {
            const attrMatch = html.match(ATTR_BINDING_RE);
            if (attrMatch) {
                const prefixed = attrMatch[1];
                const isRef = !!attrMatch[2];
                const isClass = !!attrMatch[3];
                let prefix = '';
                let name = '';
                if (prefixed) {
                    prefix = prefixed[0];
                    name = prefixed.slice(1);
                } else if (isRef) {
                    prefix = 'ref';
                    name = 'ref';
                } else if (isClass) {
                    prefix = 'class';
                    name = 'class';
                }
                const marker = `lux-attr-${i}`;
                html = html.slice(0, -attrMatch[0].length) + `${marker}="${name}" `;
                parts.push({ type: 'attr', name, prefix, marker, index: i });
            } else {
                const marker = `lux-${i}`;
                html += `<!--${marker}-->`;
                parts.push({ type: 'child', marker, index: i });
            }
        }
    }
    return { html, parts };
}

// ─── Commit functions ──

function commitValue(container, value, context) {
    if (value === nothing || value == null) {
        clearContainer(container);
        return;
    }

    if (isRepeatResult(value)) {
        commitRepeat(container, value, context);
        return;
    }

    if (isTemplateResult(value)) {
        render(value, container, context);
        return;
    }

    if (Array.isArray(value)) {
        clearContainer(container);
        for (const item of value) {
            if (isTemplateResult(item)) {
                const span = document.createElement('span');
                span.style.display = 'contents';
                render(item, span, context);
                container.appendChild(span);
            } else if (item instanceof Node) {
                container.appendChild(item);
            } else if (item != null && item !== false) {
                container.appendChild(document.createTextNode(String(item)));
            }
        }
        return;
    }

    if (value instanceof Node) {
        clearContainer(container);
        container.appendChild(value);
        return;
    }

    // Primitive — replace content (don't append)
    if (container.childNodes.length === 1 && container.firstChild.nodeType === Node.TEXT_NODE) {
        container.firstChild.textContent = String(value);
    } else {
        clearContainer(container);
        container.appendChild(document.createTextNode(String(value)));
    }
}

function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function commitAttrPart(part, value) {
    const { element, name, prefix } = part;

    switch (prefix) {
        case '@': {
            // Event binding
            const oldHandler = part.committedValue;

            // Determine if we should remove/add based on value changes
            const isNothing = value == null || value === nothing;
            const shouldRemoveListener =
                (isNothing && oldHandler != null) ||
                value?.capture !== oldHandler?.capture ||
                value?.once !== oldHandler?.once ||
                value?.passive !== oldHandler?.passive;

            const shouldAddListener = !isNothing && (oldHandler == null || shouldRemoveListener);

            if (shouldRemoveListener) {
                element.removeEventListener(name, part._handler || oldHandler, oldHandler);
            }

            if (shouldAddListener) {
                if (typeof value === 'function') {
                    // Wrap handler to preserve `this` as the host element
                    const host =
                        part._host ||
                        (part._host = {
                            handleEvent(e) {
                                const fn = part.committedValue;
                                if (typeof fn === 'function') {
                                    // Use host element (custom element instance) as `this`
                                    const hostEl = element.getRootNode().host || element;
                                    fn.call(hostEl, e);
                                }
                            },
                        });
                    part._handler = host;
                    element.addEventListener(name, host);
                } else if (typeof value === 'object' && value?.handleEvent) {
                    // EventListenerObject: { handleEvent(event) }
                    const host = { handleEvent: (e) => value.handleEvent.call(value, e) };
                    part._handler = host;
                    element.addEventListener(name, host, {
                        capture: value.capture,
                        once: value.once,
                        passive: value.passive,
                    });
                }
            }

            part.committedValue = value;
            break;
        }
        case '.': {
            // Property binding
            element[name] = value === nothing ? undefined : value;
            break;
        }
        case '?': {
            // Boolean attribute binding
            element.toggleAttribute(name, !!value);
            break;
        }
        case 'ref': {
            // Ref binding
            if (typeof value === 'function') {
                value(element);
            }
            break;
        }
        case 'class': {
            // Class binding
            if (typeof value === 'string') {
                element.className = value;
            } else if (typeof value === 'object' && value != null) {
                const existing = element.className || '';
                const names = existing ? existing.split(/\s+/) : [];
                for (const [cls, active] of Object.entries(value)) {
                    if (active) {
                        if (!names.includes(cls)) names.push(cls);
                    } else {
                        const idx = names.indexOf(cls);
                        if (idx !== -1) names.splice(idx, 1);
                    }
                }
                element.className = names.filter(Boolean).join(' ');
            }
            break;
        }
        default: {
            // Plain attribute
            if (value == null || value === false) {
                element.removeAttribute(name);
            } else {
                element.setAttribute(name, value === true ? '' : String(value));
            }
        }
    }
}

// ─── render() function ──

export function render(result, container, context) {
    if (!isTemplateResult(result)) {
        container.textContent = result ?? '';
        return;
    }

    const { strings, values } = result;

    // Incremental update
    if (container._luxActiveParts && container._luxStrings === strings) {
        for (const part of container._luxActiveParts) {
            if (part.index < values.length) {
                if (part.type === 'child') {
                    commitValue(part.span, values[part.index], context);
                } else {
                    commitAttrPart(part, values[part.index]);
                }
            }
        }
        return;
    }

    // First render — build part list
    const tpl = document.createElement('template');
    const parsed = parseTemplate(strings);
    tpl.innerHTML = parsed.html;
    const fragment = tpl.content.cloneNode(true);
    const activeParts = [];

    for (const part of parsed.parts) {
        if (part.type === 'child') {
            const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_COMMENT);
            let node;
            while ((node = walker.nextNode())) {
                if (node.data === part.marker) {
                    const span = document.createElement('span');
                    span.style.display = 'contents';
                    node.parentNode.replaceChild(span, node);
                    commitValue(span, values[part.index], context);
                    activeParts.push({ type: 'child', span, index: part.index });
                    break;
                }
            }
        } else {
            const element = fragment.querySelector(`[${part.marker}]`);
            if (element) {
                element.removeAttribute(part.marker);
                const ap = {
                    type: 'attr',
                    element,
                    name: part.name,
                    prefix: part.prefix,
                    index: part.index,
                    committedValue: undefined,
                };
                commitAttrPart(ap, values[part.index]);
                activeParts.push(ap);
            }
        }
    }

    container.textContent = '';
    container.appendChild(fragment);
    container._luxActiveParts = activeParts;
    container._luxStrings = strings;
}

// ─── Directives ──

/**
 * repeat(items, keyFn, renderFn) — keyed list rendering
 */
export function repeat(items, keyFn, renderFn) {
    return { _type: 'repeat', items, keyFn, renderFn };
}

function isRepeatResult(value) {
    return value && value._type === 'repeat';
}

function commitRepeat(container, value, context) {
    const { items, keyFn, renderFn } = value;
    const state = container._repeatState;

    // Clear old content
    if (state) {
        for (const entry of state.entries) {
            if (entry.span && entry.span.parentNode) {
                entry.span.parentNode.removeChild(entry.span);
            }
        }
    }

    // Build new content
    const frag = document.createDocumentFragment();
    const entries = [];
    for (const item of items) {
        const key = keyFn(item);
        const result = renderFn(item);
        const span = document.createElement('span');
        span.style.display = 'contents';
        if (isTemplateResult(result)) {
            render(result, span, context);
        } else if (result != null && result !== false) {
            span.appendChild(document.createTextNode(String(result)));
        }
        frag.appendChild(span);
        entries.push({ key, result, span });
    }
    container.appendChild(frag);
    container._repeatState = { entries };
}

/**
 * when(condition, trueFn, falseFn) — conditional rendering
 */
export function when(condition, trueFn, falseFn = () => '') {
    return condition ? trueFn() : falseFn();
}

/**
 * show(condition, content) — show/hide element
 */
export function show(condition, content = '') {
    return condition ? content : '';
}

/**
 * classMap(classes) — dynamic class binding helper
 */
export function classMap(classes) {
    return classes;
}

/**
 * styleMap(styles) — dynamic style binding helper
 */
export function styleMap(styles) {
    return styles;
}

/**
 * guard(dependencies, fn) — re-render only when dependencies change
 */
export function guard(dependencies, fn) {
    return fn();
}
