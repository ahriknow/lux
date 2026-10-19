/**
 * lux-tree — Hierarchical tree with right-click context menu.
 *
 * Props:
 *   data           — [{ id, label, children?: [], disabled?, icon? }]（无限嵌套）
 *   selected       — selected node id (reflected, bindable)
 *   expanded-keys  — array of expanded ids；缺省全部收起
 *   expand-all     — boolean，初始全部展开（覆盖 expanded-keys）
 *   context-menu   — [{ key, label, icon?, disabled?, danger?, divider? }]
 *                    divider=true 的项渲染为分割线（忽略其余字段）
 *
 * Events:
 *   select      — { id, node }           左键点节点
 *   toggle      — { id, expanded }       展开/收起
 *   contextmenu — { id, node, x, y }     右键（菜单打开前）
 *   menu-select — { key, id, node }      菜单项点击
 */
import { html, css, LuxElement, registerComponent, classMap, when, repeat } from '../../index.js';
import '../lux-icon/index.js';

const styles = css`
    :host {
        display: block;
        position: relative;
        font-size: 14px;
        color: rgb(var(--lux-text, 15 23 42));
        user-select: none;
    }

    .node {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 6px;
        cursor: pointer;
        min-height: 28px;
        transition: background 120ms ease;
    }
    .node:hover {
        background: rgb(var(--lux-hover, 0 0 0 / 4%));
    }
    .node.selected {
        background: rgb(var(--lux-primary-400) / 12%);
        color: rgb(var(--lux-primary-400));
        font-weight: 500;
    }
    .node.disabled {
        opacity: 0.45;
        pointer-events: none;
    }

    .twist {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        color: rgb(var(--lux-text-secondary, 100 116 139));
        transition: transform 150ms ease;
    }
    .twist.open {
        transform: rotate(90deg);
    }
    .twist.leaf {
        visibility: hidden;
    }

    .icon {
        display: inline-flex;
        width: 18px;
        height: 18px;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .label {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .children {
        padding-left: 16px;
    }

    /* ── 右键菜单 ── */
    .menu-mask {
        position: fixed;
        inset: 0;
        z-index: 10000;
    }
    .menu {
        position: fixed;
        z-index: 10001;
        min-width: 140px;
        padding: 4px;
        background: rgb(var(--lux-card, 255 255 255));
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: 8px;
        box-shadow: 0 8px 24px rgb(0 0 0 / 16%);
    }
    .menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 13px;
        color: rgb(var(--lux-text, 15 23 42));
        white-space: nowrap;
    }
    .menu-item:hover {
        background: rgb(var(--lux-hover, 0 0 0 / 4%));
    }
    .menu-item.disabled {
        opacity: 0.4;
        pointer-events: none;
    }
    .menu-item.danger {
        color: rgb(var(--lux-danger, 220 38 38));
    }
    .menu-item.danger:hover {
        background: rgb(var(--lux-danger, 220 38 38) / 10%);
    }
    .menu-divider {
        height: 1px;
        margin: 4px 8px;
        background: rgb(var(--lux-border, 226 232 240));
    }
`;

class LuxTree extends LuxElement {
    static styles = styles;

    static properties = {
        data: { type: Array, attribute: false },
        selected: { type: String, reflect: true },
        expandedKeys: { type: Array, attribute: 'expanded-keys' },
        expandAll: { type: Boolean, attribute: 'expand-all' },
        contextMenu: { type: Array, attribute: false },
    };

    constructor() {
        super();
        this.data = [];
        this.selected = '';
        this.expandedKeys = [];
        this.expandAll = false;
        this.contextMenu = [];
        this._menu = null; // { x, y, id, node }
    }

    connectedCallback() {
        super.connectedCallback?.();
        this._syncData();
        // 全局关闭菜单
        this._onDocDown = (e) => {
            if (
                this._menu &&
                !e.composedPath?.().some((n) => n && n.classList && n.classList.contains('menu'))
            ) {
                this._closeMenu();
            }
        };
        this._onDocKey = (e) => {
            if (e.key === 'Escape') this._closeMenu();
        };
        document.addEventListener('click', this._onDocDown, true);
        document.addEventListener('keydown', this._onDocKey, true);
    }

    disconnectedCallback() {
        super.disconnectedCallback?.();
        document.removeEventListener('click', this._onDocDown, true);
        document.removeEventListener('keydown', this._onDocKey, true);
    }

    _syncData() {
        const d = this.data;
        if (Array.isArray(d) && d.length) {
            this.requestUpdate();
            return;
        }
        const attr = this.getAttribute('data-data');
        if (attr) {
            try {
                this.data = JSON.parse(attr);
            } catch {
                /* ignore */
            }
        }
    }

    attributeChangedCallback(name, oldV, newV) {
        if (name === 'data-data' && newV !== oldV) {
            try {
                this.data = JSON.parse(newV);
            } catch {
                /* ignore */
            }
        }
    }

    _isExpanded(id) {
        const key = String(id);
        if (this.expandAll) return true;
        return (this.expandedKeys || []).some((k) => String(k) === key);
    }

    _toggle(id, e) {
        e?.stopPropagation?.();
        const key = String(id);
        const exp = !this._isExpanded(id);
        if (this.expandAll) {
            // expand-all 模式下切换写入 expandedKeys 并关掉 expandAll
            this.expandAll = false;
            this.expandedKeys = exp ? [key] : [];
        } else {
            const cur = new Set((this.expandedKeys || []).map(String));
            if (exp) cur.add(key);
            else cur.delete(key);
            this.expandedKeys = [...cur];
        }
        this.requestUpdate();
        this.emit('toggle', { id, expanded: exp });
    }

    _select(node) {
        if (node.disabled) return;
        this.selected = String(node.id);
        this.requestUpdate();
        this.emit('select', { id: node.id, node });
    }

    _onContext(e, node) {
        e.preventDefault();
        e.stopPropagation();
        if (node.disabled) return;
        const items = this.contextMenu || [];
        this._menu = { x: e.clientX, y: e.clientY, id: node.id, node };
        this.requestUpdate();
        this.emit('contextmenu', { id: node.id, node, x: e.clientX, y: e.clientY });
    }

    _closeMenu() {
        if (!this._menu) return;
        this._menu = null;
        this.requestUpdate();
    }

    _onMenuClick(item) {
        if (item.disabled || item.divider) return;
        const m = this._menu;
        this._closeMenu();
        this.emit('menu-select', { key: item.key, id: m?.id, node: m?.node, item });
    }

    /** 递归渲染节点（无限层） */
    _renderNode(node, depth) {
        const id = String(node.id);
        const has = node.children && node.children.length > 0;
        const exp = this._isExpanded(node.id);
        const isSel = this.selected === id;
        return html`
            <div
                class=${classMap({ node: true, selected: isSel, disabled: !!node.disabled })}
                style=${'padding-left:' + (8 + depth * 4) + 'px'}
                @click=${() => this._select(node)}
                @contextmenu=${(e) => this._onContext(e, node)}
            >
                <span
                    class=${classMap({ twist: true, open: exp, leaf: !has })}
                    @click=${(e) => this._toggle(node.id, e)}
                    ><lux-icon name="chevron_right" size="12px"></lux-icon
                ></span>
                ${when(!!node.icon, () => html`<span class="icon"><lux-icon .name=${node.icon} size="16px"></lux-icon></span>`)}
                <span class="label">${node.label ?? ''}</span>
            </div>
            ${when(
                has && exp,
                () => html`
                    <div class="children">
                        ${repeat(
                            node.children,
                            (c) => c.id,
                            (c) => this._renderNode(c, depth + 1)
                        )}
                    </div>
                `
            )}
        `;
    }

    _renderMenu() {
        const m = this._menu;
        if (!m) return '';
        const items = this.contextMenu || [];
        if (!items.length) return '';
        // 翻转靠近视口右/下边
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const estW = 160;
        const estH = items.length * 30 + 12;
        const left = m.x + estW > vw ? Math.max(8, m.x - estW) : m.x;
        const top = m.y + estH > vh ? Math.max(8, m.y - estH) : m.y;
        return html`
            <div
                class="menu-mask"
                @click=${() => this._closeMenu()}
                @contextmenu=${(e) => {
                    e.preventDefault();
                    this._closeMenu();
                }}
            ></div>
            <div class="menu" style=${'left:' + left + 'px;top:' + top + 'px'}>
                ${repeat(
                    items,
                    (it, i) => it.key || 'd' + i,
                    (it) => html`
                        ${when(!!it.divider, () => html`<div class="menu-divider"></div>`)}
                        ${when(
                            !it.divider,
                            () => html`
                                <div
                                    class=${classMap({ 'menu-item': true, disabled: !!it.disabled, danger: !!it.danger })}
                                    @click=${() => this._onMenuClick(it)}
                                >
                                    ${when(!!it.icon, () => html`<lux-icon .name=${it.icon} size="16px"></lux-icon>`)}
                                    <span>${it.label ?? ''}</span>
                                </div>
                            `
                        )}
                    `
                )}
            </div>
        `;
    }

    render() {
        return html`
            <div class="tree">
                ${repeat(
                    this.data || [],
                    (n) => n.id,
                    (n) => this._renderNode(n, 0)
                )}
            </div>
            ${this._renderMenu()}
        `;
    }
}

registerComponent('lux-tree', LuxTree);
export default LuxTree;
