import { html, css, LuxElement, registerComponent, classMap, repeat } from '../../index.js';

const ARROW_SVG = html`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
</svg>`;
const CLEAR_SVG = html`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
    />
</svg>`;

const styles = css`
    :host {
        display: inline-flex;
        align-items: stretch;
        position: relative;
        vertical-align: middle;
    }
    .trigger {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        padding: 8px 12px;
        border: 1px solid rgb(var(--lux-border, 51 65 85));
        border-radius: var(--lux-radius, 6px);
        background: rgb(var(--lux-card, 30 41 59));
        color: rgb(var(--lux-text, 241 245 249));
        font-size: 13px;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        box-sizing: border-box;
    }
    .trigger:hover {
        border-color: rgb(var(--lux-primary-500, 99 91 218));
        background: rgb(var(--lux-hover, 255 255 255 / 5%));
    }
    .placeholder {
        color: rgb(var(--lux-text-muted, 100 116 139));
    }
    .end-icons {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        margin-left: auto;
    }
    .arrow,
    .clear {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 18px;
        height: 18px;
        transition: opacity 150ms ease;
    }
    .arrow {
        color: rgb(var(--lux-text-secondary, 148 163 184));
        transition:
            transform 150ms ease,
            opacity 150ms ease;
    }
    :host([open]) .arrow {
        transform: rotate(180deg);
    }
    .clear {
        display: none;
        cursor: pointer;
        color: rgb(var(--lux-text-secondary, 148 163 184));
        z-index: 1;
    }
    .clear:hover {
        color: rgb(var(--lux-text, 241 245 249));
    }
    :host([clearable][has-value]:hover) .clear {
        display: inline-flex;
    }
    :host([clearable][has-value]:hover) .arrow {
        opacity: 0;
        pointer-events: none;
    }
    .menu {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        min-width: 100%;
        max-height: 200px;
        overflow-y: auto;
        background: rgb(var(--lux-card, 30 41 59));
        border: 1px solid rgb(var(--lux-border, 51 65 85));
        border-radius: var(--lux-radius, 6px);
        box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
        z-index: 1000;
        padding: 4px 0;
        display: none;
    }
    :host([open]) .menu {
        display: block;
    }
    .item {
        display: block;
        padding: 7px 12px;
        font-size: 13px;
        color: rgb(var(--lux-text, 241 245 249));
        cursor: pointer;
        white-space: nowrap;
        user-select: none;
    }
    .item:hover {
        background: rgb(var(--lux-hover, 255 255 255 / 5%));
    }
    .item.active {
        color: rgb(var(--lux-primary-400, 129 113 234));
    }

    :host([disabled]) .trigger {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }

    /* Size: sm */
    :host([size='sm']) .trigger {
        padding: 7px 8px;
        font-size: 12px;
        gap: 4px;
    }
    :host([size='sm']) .item {
        padding: 5px 10px;
        font-size: 12px;
    }
    :host([size='sm']) .end-icons {
        width: 14px;
        height: 14px;
    }

    /* Size: lg */
    :host([size='lg']) .trigger {
        padding: 12px 16px;
        font-size: 15px;
        gap: 8px;
    }
    :host([size='lg']) .item {
        padding: 10px 16px;
        font-size: 15px;
    }
    :host([size='lg']) .end-icons {
        width: 22px;
        height: 22px;
    }
`;

class LuxSelect extends LuxElement {
    static styles = styles;

    static properties = {
        options: { type: Array, attribute: false },
        value: { type: String, reflect: true },
        placeholder: { type: String, reflect: true },
        open: { type: Boolean, reflect: true },
        clearable: { type: Boolean, reflect: true },
        disabled: { type: Boolean, reflect: true },
        size: { type: String, reflect: true },
    };

    constructor() {
        super();
        this.options = [];
        this.placeholder = '';
        this.value = '';
        this.clearable = false;
        this.disabled = false;
        this._onDocClickBound = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this._bindDocClick();
    }

    _bindDocClick() {
        if (this._onDocClickBound) return;
        this._onDocClick = this._onDocClick.bind(this);
        document.addEventListener('click', this._onDocClick, true);
        this._onDocClickBound = true;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this._onDocClick, true);
        this._onDocClickBound = false;
    }

    updated() {
        if (this.value) {
            this.setAttribute('has-value', '');
        } else {
            this.removeAttribute('has-value');
        }
    }

    _onDocClick(e) {
        if (!this.contains(e.target)) {
            this.open = false;
        }
    }

    _toggle() {
        if (this.disabled) return;
        this.open = !this.open;
    }

    _clear() {
        this.value = '';
        this.emit('clear');
    }

    _select(opt) {
        this.value = String(opt.value);
        this.open = false;
        this.emit('change', { value: opt.value, label: opt.label ?? opt.value });
    }

    render() {
        const opts = Array.isArray(this.options) ? this.options : [];
        const matched = opts.find((o) => String(o.value) === String(this.value));
        const text = matched ? (matched.label ?? matched.value) : '';
        const ph = this.placeholder;
        const triggerText = text || ph;
        const isPh = !text && !!ph;

        return html`
            <div class="trigger" @click=${() => this._toggle()}>
                <span class=${classMap({ placeholder: isPh })}>${triggerText}</span>
                <span class="end-icons">
                    <span
                        class=${classMap({ clear: true })}
                        @click=${(e) => {
                            e.stopPropagation();
                            this._clear();
                        }}
                        >${CLEAR_SVG}</span
                    >
                    <span class="arrow">${ARROW_SVG}</span>
                </span>
            </div>
            <div class="menu">
                ${repeat(
                    opts,
                    (opt) => opt.value,
                    (opt) => html`
                        <div class="item" @click=${() => this._select(opt)}>
                            ${opt.label ?? opt.value}
                        </div>
                    `
                )}
            </div>
        `;
    }
}

registerComponent('lux-select', LuxSelect);
export default LuxSelect;
