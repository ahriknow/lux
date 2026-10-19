/**
 * lux-textarea — Multiline text input.
 *
 * Props:
 *   value      — text (controlled)
 *   placeholder— hint when empty
 *   rows       — visible lines (default 3)
 *   maxlength  — max characters (0 = unlimited)
 *   disabled / readonly — states
 *   clearable  — show × when non-empty (default false)
 *   autosize   — grow with content instead of fixed rows (default false)
 *
 * Events: input {value}, change {value}, clear — all bubbles + composed
 */
import { html, css, LuxElement, registerComponent, when } from '../../index.js';
import '../lux-icon/index.js';

const styles = css`
    :host {
        display: block;
        position: relative;
    }
    textarea {
        display: block;
        width: 100%;
        box-sizing: border-box;
        padding: 8px 12px;
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: var(--lux-radius, 6px);
        background: rgb(var(--lux-card, 255 255 255));
        color: rgb(var(--lux-text, 15 23 42));
        font: inherit;
        font-size: 13px;
        line-height: 1.55;
        resize: vertical;
        outline: none;
        transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
    }
    textarea::placeholder {
        color: rgb(var(--lux-text-muted, 148 163 184));
    }
    textarea:focus {
        border-color: rgb(var(--lux-primary-400, 108 92 231));
        box-shadow: 0 0 0 3px rgb(var(--lux-primary-500, 99 91 218) / 12%);
    }
    :host([disabled]) textarea {
        opacity: 0.5;
        cursor: not-allowed;
    }
    :host([readonly]) textarea {
        background: rgb(var(--lux-bg, 248 250 252));
        cursor: default;
    }
    .clear {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 20px;
        height: 20px;
        border: 0;
        border-radius: 50%;
        background: rgb(var(--lux-border, 226 232 240));
        color: rgb(var(--lux-text-secondary, 100 116 139));
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        opacity: 0;
        transition: opacity 0.12s ease;
    }
    :host(:hover) .clear,
    .clear:focus-visible {
        opacity: 1;
    }
    .count {
        position: absolute;
        right: 8px;
        bottom: 6px;
        font-size: 11px;
        color: rgb(var(--lux-text-muted, 148 163 184));
        pointer-events: none;
    }
`;

class LuxTextarea extends LuxElement {
    static styles = styles;

    static properties = {
        value: { type: String },
        placeholder: { type: String },
        rows: { type: Number },
        maxlength: { type: Number },
        disabled: { type: Boolean, reflect: true },
        readonly: { type: Boolean, reflect: true },
        clearable: { type: Boolean, reflect: true },
        autosize: { type: Boolean, reflect: true },
    };

    constructor() {
        super();
        this.value = '';
        this.placeholder = '';
        this.rows = 3;
        this.maxlength = 0;
        this.disabled = false;
        this.readonly = false;
        this.clearable = false;
        this.autosize = false;
    }

    _set(v, evt) {
        this.value = v;
        if (evt) this.emit(evt, { value: v });
        if (this.autosize) this._resize();
    }

    _onInput(e) {
        this._set(e.target.value, 'input');
    }

    _onBlur(e) {
        this.emit('change', { value: e.target.value });
    }

    _onClear(e) {
        e.stopPropagation();
        this._set('', 'input');
        this.emit('clear', { value: '' });
        this.emit('change', { value: '' });
        const ta = this.renderRoot.querySelector('textarea');
        if (ta) ta.focus();
    }

    _resize() {
        const ta = this.renderRoot.querySelector('textarea');
        if (!ta) return;
        ta.style.height = 'auto';
        ta.style.height = `${ta.scrollHeight}px`;
    }

    updated() {
        if (this.autosize) this._resize();
    }

    render() {
        const showClear = this.clearable && !this.disabled && !this.readonly && !!this.value;
        return html`
            <textarea
                .value=${this.value ?? ''}
                .placeholder=${this.placeholder}
                .rows=${this.rows}
                ?disabled=${this.disabled}
                ?readonly=${this.readonly}
                maxlength=${this.maxlength > 0 ? this.maxlength : null}
                @input=${(e) => this._onInput(e)}
                @blur=${(e) => this._onBlur(e)}
            ></textarea>
            ${when(showClear, () => html`<button class="clear" type="button" @click=${(e) => this._onClear(e)}><lux-icon name="close" size="14px"></lux-icon></button>`)}
            ${when(
                this.maxlength > 0,
                () =>
                    html`<span class="count"
                        >${(this.value || '').length} / ${this.maxlength}</span
                    >`
            )}
        `;
    }
}

registerComponent('lux-textarea', LuxTextarea);
export default LuxTextarea;
