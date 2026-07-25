/**
 * lux-menu — Data-driven navigation menu.
 *
 * Props:
 *   items          — array of menu items
 *   collapse-width — auto-collapse when host width < this value (px)
 *   collapsed      — force collapsed state (boolean)
 *   active-key     — currently active item key
 *
 * Events:
 *   select — fired when item clicked, detail: { key, item }
 */

import { html, css, LuxElement, registerComponent, classMap } from '../../index.js';
import '../lux-icon/index.js';

const styles = css`
    :host {
        display: block;
        width: 100%;
    }

    .menu {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        color: rgb(var(--lux-text-secondary));
        font-size: 14px;
        white-space: nowrap;
        user-select: none;
        min-height: 36px;
        transition: all 150ms ease;
        text-decoration: none;
    }
    .item:hover {
        background: rgb(var(--lux-hover));
        color: rgb(var(--lux-text));
    }
    .item.active {
        background: rgb(var(--lux-primary-400) / 10%);
        color: rgb(var(--lux-primary-400));
        font-weight: 500;
    }
    .item.disabled {
        opacity: 0.4;
        pointer-events: none;
    }

    .item-icon {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
    }
    .item-label {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .item-arrow {
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        transition: transform 150ms ease;
        font-size: 22px;
    }
    .item-arrow.open {
        transform: rotate(90deg);
    }

    .divider {
        height: 1px;
        background: rgb(var(--lux-border));
        margin: 4px 12px;
    }
    .children {
        padding-left: 16px;
    }

    :host([collapsed]) .menu {
        width: 48px;
        align-items: center;
    }
    :host([collapsed]) .item {
        justify-content: center;
        padding: 8px;
        width: 36px;
        height: 36px;
        min-height: auto;
        position: relative;
    }
    :host([collapsed]) .item-label,
    :host([collapsed]) .item-arrow {
        display: none;
    }
    :host([collapsed]) .children {
        display: none;
    }
    :host([collapsed]) .divider {
        width: 24px;
        margin: 4px auto;
    }

    :host([collapsed]) .item::after {
        content: attr(data-label);
        display: none;
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 8px;
        padding: 4px 8px;
        background: rgb(var(--lux-card));
        border: 1px solid rgb(var(--lux-border));
        border-radius: 6px;
        box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
        font-size: 12px;
        color: rgb(var(--lux-text));
        white-space: nowrap;
        z-index: 1001;
        pointer-events: none;
    }
    :host([collapsed]) .item:hover::after {
        display: block;
    }

    :host([collapsed]) .popup-wrap {
        position: relative;
        display: inline-flex;
    }
    :host([collapsed]) .children-popup {
        display: none;
        position: absolute;
        left: 100%;
        top: 0;
        min-width: 180px;
        background: rgb(var(--lux-card));
        border: 1px solid rgb(var(--lux-border));
        border-radius: 6px;
        box-shadow: 0 4px 12px rgb(0 0 0 / 20%);
        padding: 4px;
        z-index: 1000;
    }
    :host([collapsed]) .popup-wrap:hover > .children-popup {
        display: block;
    }
    :host([collapsed]) .children-popup .item {
        width: auto;
        min-height: auto;
        justify-content: flex-start;
        padding: 6px 12px;
    }
    :host([collapsed]) .children-popup .item-label {
        display: block;
    }
    :host([collapsed]) .children-popup .children {
        display: block;
        padding-left: 12px;
    }
    :host([collapsed]) .children-popup .divider {
        margin: 4px 8px;
    }
`;

class LuxMenu extends LuxElement {
    static styles = styles;

    static properties = {
        items: { type: Array, attribute: false },
        collapseWidth: { type: Number, attribute: 'collapse-width', reflect: true },
        collapsed: { type: Boolean, reflect: true },
        activeKey: { type: String, attribute: 'active-key', reflect: true },
    };

    constructor() {
        super();
        this._expandedKeys = new Set();
        this._resizeObserver = null;
    }

    connectedCallback() {
        super.connectedCallback();

        // Sync items from multiple sources:
        // 1. .items property binding (may have been set before upgrade via cloneNode)
        // 2. data-items attribute (JSON string)
        // 3. LuxElement property system (after _initializeProperties)
        this._syncItems();

        this._resizeObserver = new ResizeObserver(() => {
            const cw = parseInt(this.getAttribute('collapse-width'));
            if (cw) this.collapsed = this.offsetWidth < cw;
        });
        this._resizeObserver.observe(this);
    }

    disconnectedCallback() {
        this._resizeObserver?.disconnect();
    }

    _syncItems() {
        // Priority: this.items (property binding) > data-items attribute > empty
        const items = this.items;
        if (Array.isArray(items) && items.length > 0) {
            this.requestUpdate();
            return;
        }
        // Fallback: read data-items attribute
        const dataAttr = this.getAttribute('data-items');
        if (dataAttr) {
            try {
                this.items = JSON.parse(dataAttr);
            } catch {}
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data-items' && newValue !== oldValue) {
            try {
                this.items = JSON.parse(newValue);
            } catch {}
        }
    }

    _toggleExpand(key) {
        if (this._expandedKeys.has(key)) this._expandedKeys.delete(key);
        else this._expandedKeys.add(key);
        this.requestUpdate();
    }

    _onItemClick(item) {
        if (item.disabled) return;
        if (item.children && item.children.length) this._toggleExpand(item.key);
        this.activeKey = item.key;
        this.setAttribute('active-key', item.key);
        this.requestUpdate();
        this.emit('select', { key: item.key, item });
    }

    _renderItems(items) {
        if (!items || !items.length) return '';
        const activeKey = this.activeKey || this.getAttribute('active-key') || '';
        return items.map((item) => {
            if (item.divider) return html`<div class="divider"></div>`;
            const has = item.children && item.children.length > 0;
            const isAct = item.key === activeKey;
            const isExp = this._expandedKeys.has(item.key);
            return html`
                <div
                    class=${classMap({ item: true, active: isAct, disabled: item.disabled })}
                    data-label="${item.label || ''}"
                    @click=${() => this._onItemClick(item)}
                >
                    ${item.icon ? html`<span class="item-icon"><lux-icon .name=${item.icon} size="20px"></lux-icon></span>` : ''}
                    <span class="item-label">${item.label || ''}</span>
                    ${has ? html`<span class=${classMap({ 'item-arrow': true, open: isExp })}>›</span>` : ''}
                </div>
                ${has && isExp ? html`<div class="children">${this._renderItems(item.children)}</div>` : ''}
            `;
        });
    }

    render() {
        return html`<div class="menu">${this._renderItems(this.items || [])}</div>`;
    }
}

registerComponent('lux-menu', LuxMenu);
export default LuxMenu;
