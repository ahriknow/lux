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
// 顺序敏感：ref/class 是语义绑定（不是普通属性），必须先于普通名匹配；
// 普通属性（id= / placeholder= / href= 等，无 @.? 前缀）也走 attr part——
// 不识别的话 ${} 会落成 child 注释，被浏览器吸进无引号属性值里，
// 还会带着 `>` 提前闭合标签，丢掉后续所有属性（事件监听失效）。
const ATTR_BINDING_RE = /(?:(ref)|(class)|([@.?]?[\w-]+))=\s*$/;

// ─── Template parsing ──
function parseTemplate(strings) {
    const parts = [];
    let html = '';
    for (let i = 0; i < strings.length; i++) {
        html += strings[i];
        if (i < strings.length - 1) {
            const attrMatch = html.match(ATTR_BINDING_RE);
            if (attrMatch) {
                const isRef = !!attrMatch[1];
                const isClass = !!attrMatch[2];
                const rawName = attrMatch[3];
                let prefix = '';
                let name = '';
                if (isRef) {
                    prefix = 'ref';
                    name = 'ref';
                } else if (isClass) {
                    prefix = 'class';
                    name = 'class';
                } else if (rawName) {
                    const c0 = rawName[0];
                    if (c0 === '@' || c0 === '.' || c0 === '?') {
                        prefix = c0;
                        name = rawName.slice(1);
                    } else {
                        prefix = '';
                        name = rawName;
                    }
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
        // DOM 内容已变：失效模板增量标记，避免下次同 strings 模板命中过期 parts
        container._luxActiveParts = undefined;
        container._luxStrings = undefined;
        container._repeatState = undefined;
    } else {
        clearContainer(container);
        container.appendChild(document.createTextNode(String(value)));
    }
}

function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    // DOM 已清空：过期的模板增量标记 / repeat 状态必须一并失效，
    // 否则下次同 strings 模板会走增量路径，把内容提交进已销毁的孤儿节点
    // （表现为 conditional 渲染块切换后内容消失且无报错）
    container._luxActiveParts = undefined;
    container._luxStrings = undefined;
    container._repeatState = undefined;
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
        // 值类型从模板切到纯文本：作废旧的 part/repeat 状态（否则下次
        // 模板渲染会命中脏的 _luxStrings 增量路径 → 残留/空白）
        container._luxActiveParts = undefined;
        container._luxStrings = undefined;
        container._repeatState = undefined;
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
    const prevEntries = state ? state.entries : [];

    const newKeys = items.map((item) => keyFn(item));

    // Fast path: key 序列完全一致 → 不动 DOM 结构，只增量更新每项内容。
    // 全删重建会让内部的 input/焦点随节点移除而丢失（键入即失焦的根因）。
    if (
        prevEntries.length === newKeys.length &&
        prevEntries.every((e, i) => e.key === newKeys[i])
    ) {
        const entries = [];
        for (let i = 0; i < items.length; i++) {
            const entry = prevEntries[i];
            const result = renderFn(items[i]);
            render(result, entry.span, context);
            entries.push({ key: entry.key, result, span: entry.span });
        }
        container._repeatState = { entries };
        return;
    }

    // Diff path: 结构变化——按 key 复用旧 span（保留内部 DOM/输入状态），只增删变化的项
    const prevMap = new Map();
    for (const e of prevEntries) {
        if (e.span && !prevMap.has(e.key)) prevMap.set(e.key, e);
    }

    const frag = document.createDocumentFragment();
    const entries = [];
    const taken = new Set();
    for (let i = 0; i < items.length; i++) {
        const key = newKeys[i];
        const result = renderFn(items[i]);
        const canReuse =
            !taken.has(key) && prevMap.has(key) && prevMap.get(key).span.parentNode === container;
        taken.add(key);

        let span;
        if (canReuse) {
            span = prevMap.get(key).span;
            render(result, span, context);
        } else {
            span = document.createElement('span');
            span.style.display = 'contents';
            if (isTemplateResult(result)) {
                render(result, span, context);
            } else if (result != null && result !== false) {
                span.appendChild(document.createTextNode(String(result)));
            }
        }
        frag.appendChild(span);
        entries.push({ key, result, span });
    }

    // 移除不再使用的旧 span（按 span 身份判断，dup key 也安全）
    const keep = new Set(entries.map((e) => e.span));
    for (const e of prevEntries) {
        if (e.span && !keep.has(e.span) && e.span.parentNode) {
            e.span.parentNode.removeChild(e.span);
        }
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
