import { html, css, LuxElement, registerComponent } from '../../index.js';

const CLEAR_SVG = html`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
    />
</svg>`;

const styles = css`
    :host {
        display: inline-block;
        width: 100%;
        font-size: 13px;
        vertical-align: middle;
    }

    .wrap {
        display: flex;
        align-items: center;
        gap: 0;
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: var(--lux-radius, 6px);
        background: rgb(var(--lux-card, 255 255 255));
        transition:
            border-color 0.2s,
            box-shadow 0.2s;
        overflow: hidden;
    }

    .wrap:hover {
        border-color: rgb(var(--lux-primary-400, 108 92 231) / 40%);
    }

    :host([focused]) .wrap {
        border-color: rgb(var(--lux-primary-400, 108 92 231));
        box-shadow: 0 0 0 2px rgb(var(--lux-primary-400, 108 92 231) / 15%);
    }

    :host([has-error]) .wrap {
        border-color: rgb(var(--lux-error, 239 68 68));
    }

    :host([has-error][focused]) .wrap {
        box-shadow: 0 0 0 2px rgb(var(--lux-error, 239 68 68) / 15%);
    }

    /* Status colors */
    :host([status='success']) .wrap {
        border-color: rgb(var(--lux-success, 34 197 94));
    }
    :host([status='success'][focused]) .wrap {
        box-shadow: 0 0 0 2px rgb(var(--lux-success, 34 197 94) / 15%);
    }

    :host([status='info']) .wrap {
        border-color: rgb(var(--lux-info, 59 130 246));
    }
    :host([status='info'][focused]) .wrap {
        box-shadow: 0 0 0 2px rgb(var(--lux-info, 59 130 246) / 15%);
    }

    :host([status='warning']) .wrap {
        border-color: rgb(var(--lux-warning, 234 179 8));
    }
    :host([status='warning'][focused]) .wrap {
        box-shadow: 0 0 0 2px rgb(var(--lux-warning, 234 179 8) / 15%);
    }

    :host([status='error']) .wrap {
        border-color: rgb(var(--lux-error, 239 68 68));
    }
    :host([status='error'][focused]) .wrap {
        box-shadow: 0 0 0 2px rgb(var(--lux-error, 239 68 68) / 15%);
    }

    /* Regex invalid (when no explicit status) */
    :host([regex-invalid]) .wrap {
        border-color: rgb(var(--lux-error, 239 68 68));
    }
    :host([regex-invalid][focused]) .wrap {
        box-shadow: 0 0 0 2px rgb(var(--lux-error, 239 68 68) / 15%);
    }
    :host([data-regex-status='success'][regex-invalid]) .wrap {
        border-color: rgb(var(--lux-success, 34 197 94));
    }
    :host([data-regex-status='info'][regex-invalid]) .wrap {
        border-color: rgb(var(--lux-info, 59 130 246));
    }
    :host([data-regex-status='warning'][regex-invalid]) .wrap {
        border-color: rgb(var(--lux-warning, 234 179 8));
    }
    :host([data-regex-status='error'][regex-invalid]) .wrap,
    :host([data-regex-status=''][regex-invalid]) .wrap {
        border-color: rgb(var(--lux-error, 239 68 68));
    }

    :host([disabled]) .wrap {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }

    .prefix,
    .suffix {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: rgb(var(--lux-text, 15 23 42));
        padding: 0;
        font-size: inherit;
        line-height: 1;
        user-select: none;
    }

    .prefix {
        padding-left: 6px;
    }
    .suffix {
        padding-right: 6px;
    }

    input {
        flex: 1;
        min-width: 0;
        border: none;
        outline: none;
        background: transparent;
        color: rgb(var(--lux-text, 15 23 42));
        font-size: inherit;
        font-family: inherit;
        padding: 6px 8px;
        line-height: 1.5;
        width: 100%;
    }

    input[type='number'] {
        -moz-appearance: textfield;
    }

    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
        opacity: 1;
        height: auto;
    }

    input::placeholder {
        color: rgb(var(--lux-text-muted, 148 163 184));
    }

    input:disabled {
        cursor: not-allowed;
    }

    .clear-btn {
        display: none;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        margin-right: 8px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: rgb(var(--lux-text-muted, 148 163 184));
        cursor: pointer;
        padding: 0;
        transition:
            color 0.15s,
            background 0.15s;
    }

    .clear-btn:hover {
        color: rgb(var(--lux-text, 15 23 42));
        background: rgb(var(--lux-hover, 0 0 0 / 5%));
    }

    :host([clearable][has-value]:hover) .clear-btn,
    :host([clearable][focused]) .clear-btn {
        display: inline-flex;
    }

    .error-msg {
        display: none;
        margin-top: 4px;
        font-size: 12px;
        color: rgb(var(--lux-error, 239 68 68));
        line-height: 1.4;
    }

    :host([has-error]) .error-msg {
        display: block;
    }

    /* Size: sm */
    :host([size='sm']) .wrap {
        border-radius: var(--lux-radius-sm, 4px);
    }
    :host([size='sm']) input {
        padding: 4px 8px;
        font-size: 12px;
    }
    :host([size='sm']) .prefix {
        padding-left: 4px;
    }
    :host([size='sm']) .suffix {
        padding-right: 4px;
    }

    /* Size: lg */
    :host([size='lg']) .wrap {
        border-radius: var(--lux-radius, 6px);
    }
    :host([size='lg']) input {
        padding: 10px 12px;
        font-size: 15px;
    }
    :host([size='lg']) .prefix {
        padding-left: 10px;
    }
    :host([size='lg']) .suffix {
        padding-right: 10px;
    }
`;

class LuxInput extends LuxElement {
    static styles = styles;

    static properties = {
        value: { type: String, reflect: true },
        placeholder: { type: String, reflect: true },
        type: { type: String, reflect: true },
        disabled: { type: Boolean, reflect: true },
        clearable: { type: Boolean, reflect: true },
        error: { type: String, reflect: true },
        size: { type: String, reflect: true },
        status: { type: String, reflect: true },
        regex: { type: String, reflect: true },
        regexStatus: { type: String, attribute: 'regex-status', reflect: true },
    };

    constructor() {
        super();
        this.value = '';
        this.placeholder = '';
        this.type = 'text';
        this.disabled = false;
        this.clearable = false;
        this.error = '';
        this.status = '';
        this.regex = '';
        this.regexStatus = '';
        this._onDocClickBound = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this._updateHasValue();
    }

    updated(changed) {
        if (changed.has('value')) {
            this._updateHasValue();
            this._validateRegex();
        }
        if (changed.has('error')) {
            if (this.error) {
                this.setAttribute('has-error', '');
            } else {
                this.removeAttribute('has-error');
            }
        }
        if (changed.has('status') || changed.has('regex') || changed.has('regexStatus')) {
            this._validateRegex();
        }
    }

    _updateHasValue() {
        if (this.value) {
            this.setAttribute('has-value', '');
        } else {
            this.removeAttribute('has-value');
        }
    }

    _onInput(e) {
        e.stopPropagation();
        this.value = e.target.value;
        this._validateRegex();
        this.emit('input', { value: this.value });
    }

    _onChange(e) {
        this.value = e.target.value;
        this._validateRegex();
        this.emit('change', { value: this.value });
    }

    _validateRegex() {
        if (!this.regex || this.status) {
            this.removeAttribute('regex-invalid');
            this.removeAttribute('data-regex-status');
            return;
        }
        if (!this.value) {
            this.removeAttribute('regex-invalid');
            this.removeAttribute('data-regex-status');
            return;
        }
        const re = new RegExp(this.regex);
        if (re.test(String(this.value))) {
            this.removeAttribute('regex-invalid');
            this.removeAttribute('data-regex-status');
        } else {
            this.setAttribute('regex-invalid', '');
            this.setAttribute('data-regex-status', this.regexStatus || 'error');
        }
    }

    _onFocus() {
        this.setAttribute('focused', '');
        this.emit('focus');
    }

    _onBlur() {
        this.removeAttribute('focused');
        this.emit('blur');
    }

    _clear() {
        this.value = '';
        this.removeAttribute('regex-invalid');
        this.emit('input', { value: '' });
        this.emit('clear');
        const input = this.renderRoot.querySelector('input');
        if (input) input.focus();
    }

    render() {
        return html`
            <div class="wrap">
                <slot class="prefix" name="prefix"></slot>
                <input
                    .type=${this.type}
                    .value=${this.value}
                    .placeholder=${this.placeholder}
                    .disabled=${this.disabled}
                    @input=${(e) => this._onInput(e)}
                    @change=${(e) => this._onChange(e)}
                    @focus=${() => this._onFocus()}
                    @blur=${() => this._onBlur()}
                />
                <span class="clear-btn" @click=${this._clear}>${CLEAR_SVG}</span>
                <slot class="suffix" name="suffix"></slot>
            </div>
            ${this.error ? html`<span class="error-msg">${this.error}</span>` : ''}
        `;
    }
}

registerComponent('lux-input', LuxInput);
export default LuxInput;
