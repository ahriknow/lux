import { html, css, LuxElement, registerComponent, repeat } from '../../index.js';

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
        border: 1px solid rgb(var(--lux-primary-500));
        border-radius: var(--lux-radius, 6px);
        background: rgb(var(--lux-primary-500));
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        box-sizing: border-box;
    }
    .trigger:hover {
        background: rgb(var(--lux-primary-600));
        border-color: rgb(var(--lux-primary-600));
    }
    .trigger-content {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .clear {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
        cursor: pointer;
        color: rgb(255 255 255 / 70%);
    }
    .clear:hover {
        color: #fff;
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
    :host([size='sm']) .clear {
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
    :host([size='lg']) .clear {
        width: 22px;
        height: 22px;
    }

    /* Ghost variant */
    :host([ghost]) .trigger {
        background: transparent;
        border-color: transparent;
        color: rgb(var(--lux-text-secondary));
        padding: 4px;
    }
    :host([ghost]) .trigger:hover {
        background: rgb(var(--lux-hover));
        border-color: transparent;
        color: rgb(var(--lux-text));
    }
    :host([ghost]) .clear {
        color: rgb(var(--lux-text-secondary));
    }
    :host([ghost]) .clear:hover {
        color: rgb(var(--lux-text));
    }
`;

class LuxDropdown extends LuxElement {
    static styles = styles;

    static properties = {
        options: { type: Array, attribute: false },
        value: { type: String, reflect: true },
        open: { type: Boolean, reflect: true },
        clearable: { type: Boolean, reflect: true },
        ghost: { type: Boolean, reflect: true },
        size: { type: String, reflect: true },
    };

    constructor() {
        super();
        this.options = [];
        this.value = '';
        this.clearable = false;
        this.ghost = false;
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
        // e.target 跨 shadow 边界会被 retarget 成外层宿主（如页面组件），
        // contains() 会把组件内点击误判为外部点击而关掉菜单；
        // composedPath() 返回真实事件路径（含 shadow 内节点），以它判断归属
        if (!e.composedPath().includes(this)) {
            this.open = false;
        }
    }

    _toggle() {
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

        return html`
            <div class="trigger" @click=${() => this._toggle()}>
                <span class="trigger-content">
                    <slot name="trigger"></slot>
                </span>
                ${
                    this.clearable && this.value
                        ? html`<span
                              class="clear"
                              @click=${(e) => {
                                  e.stopPropagation();
                                  this._clear();
                              }}
                              >${CLEAR_SVG}</span
                          >`
                        : ''
                }
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

registerComponent('lux-dropdown', LuxDropdown);
export default LuxDropdown;
