/**
 * lux-pagination — Pagination component.
 *
 * Props:
 *   total           — total number of items
 *   current         — current page (1-based, default: 1)
 *   pageSize        — items per page (default: 10)
 *   pageSizeOptions — array of pageSize options (default: [10, 20, 50, 100])
 *   size            — sm / md / lg (default: md)
 *   disabled        — disable all interactions
 *   showSizeChanger — show page size selector
 *   showQuickJumper — show quick jump input
 *   showTotal       — show total info text
 *   simple          — simple mode (prev/next + current/total)
 */

import { html, css, LuxElement, registerComponent } from '../../index.js';
import { getLocale } from '../../i18n/index.js';
import '../lux-icon/index.js';

// ── Persist pageSize across component re-creation ──
let _savedPageSize = null;

// ── Built-in i18n for pagination labels ──
const _messages = {
    'zh-CN': { jumper: '跳至', page: '页', itemsPerPage: '{size} 条/页' },
    zh: { jumper: '跳至', page: '页', itemsPerPage: '{size} 条/页' },
    en: { jumper: 'Go to', page: '', itemsPerPage: '{size} / page' },
    ru: { jumper: 'Перейти к', page: '', itemsPerPage: '{size} / стр.' },
};
const _defaultLocale = 'en';

function _t(key, values = {}) {
    const locale = getLocale() || (typeof navigator !== 'undefined' ? navigator.language : 'en');
    const dict = _messages[locale] || _messages[locale.split('-')[0]] || _messages[_defaultLocale];
    let str = dict[key] ?? _messages[_defaultLocale][key] ?? key;
    for (const [k, v] of Object.entries(values)) {
        str = str.replace(`{${k}}`, v);
    }
    return str;
}

const PREV_SVG = html`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
</svg>`;
const NEXT_SVG = html`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
</svg>`;
const MORE_SVG = html`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path
        d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
    />
</svg>`;
const DOUBLE_PREV_SVG = html`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" />
</svg>`;
const DOUBLE_NEXT_SVG = html`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" />
</svg>`;

const styles = css`
    :host {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        vertical-align: middle;
        user-select: none;
    }
    :host([block]) {
        display: flex;
        justify-content: center;
    }

    /* ── Size ── */
    :host([size='sm']) {
        font-size: 12px;
    }
    :host([size='sm']) .page-item {
        min-width: 26px;
        height: 26px;
        padding: 0 4px;
    }
    :host([size='lg']) {
        font-size: 14px;
    }
    :host([size='lg']) .page-item {
        min-width: 36px;
        height: 36px;
        padding: 0 8px;
    }

    /* ── Page item ── */
    .page-item {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 30px;
        height: 30px;
        padding: 0 6px;
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: var(--lux-radius-sm, 4px);
        background: rgb(var(--lux-card, 255 255 255));
        color: rgb(var(--lux-text, 15 23 42));
        cursor: pointer;
        transition: all 150ms ease;
        box-sizing: border-box;
        font-family: inherit;
        line-height: 1;
    }
    .page-item:hover:not(.disabled):not(.active) {
        border-color: rgb(var(--lux-primary-400, 108 92 231));
        color: rgb(var(--lux-primary-400, 108 92 231));
    }
    .page-item:active:not(.disabled):not(.active) {
        filter: brightness(0.92);
    }

    /* ── Active ── */
    .page-item.active {
        background: rgb(var(--lux-primary-500, 99 91 218));
        border-color: rgb(var(--lux-primary-500, 99 91 218));
        color: #fff;
        font-weight: 600;
        cursor: default;
    }

    /* ── Disabled ── */
    .page-item.disabled {
        opacity: 0.4;
        cursor: not-allowed;
        pointer-events: none;
    }
    :host([disabled]) .page-item {
        opacity: 0.4;
        cursor: not-allowed;
        pointer-events: none;
    }

    /* ── Ellipsis ── */
    .page-item.ellipsis {
        border-color: transparent;
        background: transparent;
        cursor: default;
        color: rgb(var(--lux-text-muted, 148 163 184));
        padding: 0 2px;
    }
    .page-item.ellipsis:hover:not(.disabled) {
        border-color: rgb(var(--lux-primary-400, 108 92 231));
        color: rgb(var(--lux-primary-400, 108 92 231));
        background: rgb(var(--lux-card, 255 255 255));
        cursor: pointer;
    }

    /* ── Navigation arrows ── */
    .page-item.nav {
        font-size: 1.15em;
    }

    /* ── Total info ── */
    .total-info {
        color: rgb(var(--lux-text-secondary, 100 116 139));
        margin-right: 8px;
        white-space: nowrap;
    }

    /* ── Quick jumper ── */
    .quick-jumper {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: 8px;
        color: rgb(var(--lux-text-secondary, 100 116 139));
        white-space: nowrap;
    }
    .quick-jumper input {
        width: 48px;
        height: 30px;
        padding: 0 8px;
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: var(--lux-radius-sm, 4px);
        background: rgb(var(--lux-card, 255 255 255));
        color: rgb(var(--lux-text, 15 23 42));
        font-size: inherit;
        font-family: inherit;
        text-align: center;
        outline: none;
        box-sizing: border-box;
        transition: border-color 150ms ease;
    }
    .quick-jumper input:focus {
        border-color: rgb(var(--lux-primary-400, 108 92 231));
    }
    :host([size='sm']) .quick-jumper input {
        height: 26px;
        width: 40px;
    }
    :host([size='lg']) .quick-jumper input {
        height: 36px;
        width: 56px;
    }

    /* ── Size changer ── */
    .size-changer {
        margin-left: 4px;
    }
    .size-changer select {
        padding: 4px 8px;
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: var(--lux-radius-sm, 4px);
        background: rgb(var(--lux-card, 255 255 255));
        color: rgb(var(--lux-text, 15 23 42));
        font-size: 12px;
        font-family: inherit;
        outline: none;
        cursor: pointer;
        appearance: auto;
    }
    .size-changer select:focus {
        border-color: rgb(var(--lux-primary-400, 108 92 231));
    }
    :host([size='sm']) .size-changer select {
        padding: 3px 6px;
        font-size: 11px;
    }
    :host([size='lg']) .size-changer select {
        padding: 6px 10px;
        font-size: 13px;
    }
`;

class LuxPagination extends LuxElement {
    static styles = styles;

    static properties = {
        total: { type: Number, reflect: true },
        current: { type: Number, reflect: true },
        pageSize: { type: Number, attribute: 'page-size', reflect: true },
        pageSizeOptions: { type: Array, attribute: false },
        size: { type: String, reflect: true },
        disabled: { type: Boolean, reflect: true },
        showSizeChanger: { type: Boolean, attribute: 'show-size-changer', reflect: true },
        showQuickJumper: { type: Boolean, attribute: 'show-quick-jumper', reflect: true },
        showTotal: { type: Boolean, attribute: 'show-total', reflect: true },
        simple: { type: Boolean, reflect: true },
        block: { type: Boolean, reflect: true },
    };

    constructor() {
        super();
        this.total = 0;
        this.current = 1;
        this.pageSize = 10;
        this.pageSizeOptions = [10, 20, 50, 100];
        this.size = 'md';
        this.disabled = false;
        this.showSizeChanger = false;
        this.showQuickJumper = false;
        this.showTotal = false;
        this.simple = false;
        this.block = false;
    }

    get _totalPages() {
        return Math.max(1, Math.ceil(this.total / this.pageSize));
    }

    _go(page) {
        page = Math.max(1, Math.min(page, this._totalPages));
        if (page === this.current || this.disabled) return;
        const oldPage = this.current;
        this.current = page;
        this.dispatchEvent(
            new CustomEvent('pageChange', {
                detail: { page, pageSize: this.pageSize },
                bubbles: true,
                composed: true,
            })
        );
    }

    _onJumpInput(e) {
        if (e.key === 'Enter') {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val)) {
                this._go(val);
            }
            e.target.value = '';
        }
    }

    _getPages() {
        const total = this._totalPages;
        const current = this.current;
        const pages = [];

        if (total <= 7) {
            for (let i = 1; i <= total; i++) pages.push(i);
            return pages;
        }

        pages.push(1);

        if (current > 4) {
            pages.push('prev-ellipsis');
        }

        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);

        // Adjust window to always show 3 items in the middle
        if (current <= 4) {
            for (let i = 2; i <= Math.min(4, total - 1); i++) pages.push(i);
        } else if (current >= total - 3) {
            for (let i = Math.max(total - 3, 2); i <= total - 1; i++) pages.push(i);
        } else {
            for (let i = start; i <= end; i++) pages.push(i);
        }

        if (current < total - 3) {
            pages.push('next-ellipsis');
        }

        pages.push(total);
        return pages;
    }

    _renderSimple() {
        const total = this._totalPages;
        const current = this.current;
        const prevDisabled = current <= 1 || this.disabled;
        const nextDisabled = current >= total || this.disabled;

        return html`
            ${this._renderTotal()}
            <div
                class=${prevDisabled ? 'page-item nav disabled' : 'page-item nav'}
                @click=${() => !prevDisabled && this._go(current - 1)}
            >
                ${PREV_SVG}
            </div>
            <div class="page-item active" style="cursor:default">${current}</div>
            <span style="color:rgb(var(--lux-text-muted));padding:0 2px">/</span>
            <div class="page-item" style="cursor:default">${total}</div>
            <div
                class=${nextDisabled ? 'page-item nav disabled' : 'page-item nav'}
                @click=${() => !nextDisabled && this._go(current + 1)}
            >
                ${NEXT_SVG}
            </div>
            ${this._renderQuickJumper()}
        `;
    }

    _renderTotal() {
        if (!this.showTotal) return '';
        const start = (this.current - 1) * this.pageSize + 1;
        const end = Math.min(this.current * this.pageSize, this.total);
        return html`<span class="total-info">${start}-${end} / ${this.total}</span>`;
    }

    _renderQuickJumper() {
        if (!this.showQuickJumper) return '';
        return html`
            <span class="quick-jumper">
                <span>${_t('jumper')}</span>
                <input
                    type="number"
                    min="1"
                    max="${this._totalPages}"
                    @keydown=${this._onJumpInput.bind(this)}
                />
                <span>${_t('page')}</span>
            </span>
        `;
    }

    _renderSizeChanger() {
        if (!this.showSizeChanger) return '';
        return html`<span class="size-changer"
            ><select @change=${this._handleSizeChange}></select
        ></span>`;
    }

    _handleSizeChange = (e) => {
        const newSize = Number(e.target.value);
        if (newSize === this.pageSize) return;
        const firstItem = (this.current - 1) * this.pageSize;
        this.pageSize = newSize;
        this.current = Math.max(1, Math.floor(firstItem / newSize) + 1);
        this.requestUpdate();
        this.dispatchEvent(
            new CustomEvent('pageSizeChange', {
                detail: { pageSize: newSize, page: this.current },
                bubbles: true,
                composed: true,
            })
        );
        this.dispatchEvent(
            new CustomEvent('pageChange', {
                detail: { page: this.current, pageSize: newSize },
                bubbles: true,
                composed: true,
            })
        );
    };

    updated() {
        if (!this.showSizeChanger) return;
        const sel = this.renderRoot.querySelector('.size-changer select');
        if (!sel) return;
        // Rebuild options if needed
        if (sel.childElementCount !== this.pageSizeOptions.length) {
            sel.textContent = '';
            for (const v of this.pageSizeOptions) {
                const opt = document.createElement('option');
                opt.value = String(v);
                opt.textContent = _t('itemsPerPage', { size: v });
                sel.appendChild(opt);
            }
        }
        sel.value = String(this.pageSize);
    }

    firstUpdated() {}

    render() {
        if (this.simple) return this._renderSimple();

        const total = this._totalPages;
        const current = this.current;
        const pages = this._getPages();
        const prevDisabled = current <= 1 || this.disabled;
        const nextDisabled = current >= total || this.disabled;

        return html`
            ${this._renderTotal()}

            <div
                class=${prevDisabled ? 'page-item nav disabled' : 'page-item nav'}
                @click=${() => !prevDisabled && this._go(1)}
            >
                ${DOUBLE_PREV_SVG}
            </div>
            <div
                class=${prevDisabled ? 'page-item nav disabled' : 'page-item nav'}
                @click=${() => !prevDisabled && this._go(current - 1)}
            >
                ${PREV_SVG}
            </div>

            ${pages.map((p) => {
                if (p === 'prev-ellipsis' || p === 'next-ellipsis') {
                    return html` <div
                        class="page-item ellipsis"
                        @click=${() => {
                                if (this.disabled) return;
                                this._go(p === 'prev-ellipsis' ? current - 3 : current + 3);
                            }}
                    >
                        ${MORE_SVG}
                    </div>`;
                }
                return html` <div
                    class=${p === current ? 'page-item active' : 'page-item'}
                    @click=${() => p !== current && this._go(p)}
                >
                    ${p}
                </div>`;
            })}

            <div
                class=${nextDisabled ? 'page-item nav disabled' : 'page-item nav'}
                @click=${() => !nextDisabled && this._go(current + 1)}
            >
                ${NEXT_SVG}
            </div>
            <div
                class=${nextDisabled ? 'page-item nav disabled' : 'page-item nav'}
                @click=${() => !nextDisabled && this._go(total)}
            >
                ${DOUBLE_NEXT_SVG}
            </div>

            ${this._renderQuickJumper()} ${this._renderSizeChanger()}
        `;
    }
}

registerComponent('lux-pagination', LuxPagination);
export default LuxPagination;
