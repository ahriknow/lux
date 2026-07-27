/**
 * lux-radio — Radio group component.
 *
 * Props:
 *   options    — Array of { value, label } objects
 *   value      — currently selected value
 *   disabled   — disable interaction
 *   size       — sm / md / lg (default: md)
 *   shape      — round (default) / square
 *   vertical   — stack radios vertically
 *
 * Events:
 *   change — detail: { value: string, label: string }
 */

import { html, css, LuxElement, registerComponent, repeat } from '../../index.js';

const styles = css`
    :host {
        display: flex;
        flex-wrap: wrap;
        gap: var(--radio-gap, 16px);
        width: 100%;
    }

    :host([vertical]) {
        flex-direction: column;
        gap: var(--radio-gap, 8px);
    }

    :host([disabled]) {
        opacity: 0.5;
        pointer-events: none;
    }

    .radio-item {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }

    .radio {
        position: relative;
        width: var(--radio-size, 18px);
        height: var(--radio-size, 18px);
        border: 2px solid rgb(var(--lux-border, 226 232 240));
        background: rgb(var(--lux-card, 255 255 255));
        transition: all 0.2s;
        flex-shrink: 0;
        border-radius: 50%;
    }

    :host([shape='square']) .radio {
        border-radius: 4px;
    }

    .radio::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: inherit;
        background: rgb(var(--lux-primary-400, 108 92 231));
        transform: translate(-50%, -50%);
        transition: all 0.2s;
    }

    .radio-item.checked .radio {
        border-color: rgb(var(--lux-primary-400, 108 92 231));
    }

    .radio-item.checked .radio::after {
        width: 8px;
        height: 8px;
    }

    :host([shape='square']) .radio-item.checked .radio::after {
        width: 10px;
        height: 10px;
        border-radius: 2px;
    }

    .radio-item:hover .radio {
        border-color: rgb(var(--lux-primary-400, 108 92 231) / 60%);
    }

    .radio-item.checked:hover .radio {
        border-color: rgb(var(--lux-primary-400, 108 92 231));
    }

    .label {
        font-size: var(--radio-font, 14px);
        color: rgb(var(--lux-text, 15 23 42));
        line-height: 1.4;
    }

    :host([size='sm']) {
        gap: var(--radio-gap, 12px);
    }
    :host([size='sm']) .radio-item {
        gap: 6px;
    }
    :host([size='sm']) .radio {
        --radio-size: 16px;
    }
    :host([size='sm']) .radio-item.checked .radio::after {
        width: 6px;
        height: 6px;
    }
    :host([size='sm'])[shape='square'] .radio-item.checked .radio::after {
        width: 8px;
        height: 8px;
    }
    :host([size='sm']) .label {
        font-size: 12px;
        --radio-font: 12px;
    }

    :host([size='lg']) {
        gap: var(--radio-gap, 20px);
    }
    :host([size='lg']) .radio-item {
        gap: 10px;
    }
    :host([size='lg']) .radio {
        --radio-size: 22px;
    }
    :host([size='lg']) .radio-item.checked .radio::after {
        width: 10px;
        height: 10px;
    }
    :host([size='lg'])[shape='square'] .radio-item.checked .radio::after {
        width: 12px;
        height: 12px;
    }
    :host([size='lg']) .label {
        font-size: 16px;
        --radio-font: 16px;
    }
`;

class LuxRadio extends LuxElement {
    static styles = styles;

    static properties = {
        options: { type: Array, attribute: false },
        value: { type: String, reflect: true },
        disabled: { type: Boolean, reflect: true },
        size: { type: String, reflect: true },
        shape: { type: String, reflect: true },
        vertical: { type: Boolean, reflect: true },
    };

    constructor() {
        super();
        this.options = [];
        this.value = '';
        this.disabled = false;
        this.size = '';
        this.shape = '';
        this.vertical = false;
    }

    _select(opt) {
        if (this.disabled) return;
        this.value = String(opt.value);
        this.emit('change', { value: opt.value, label: opt.label ?? opt.value });
    }

    render() {
        const opts = Array.isArray(this.options) ? this.options : [];
        return html`
            ${opts.map(
                (opt, i) => html`
                    <div
                        class=${{ 'radio-item': true, checked: String(opt.value) === String(this.value) }}
                        @click=${() => this._select(opt)}
                    >
                        <span class="radio"></span>
                        <span class="label">${opt.label ?? opt.value}</span>
                    </div>
                `
            )}
        `;
    }
}

registerComponent('lux-radio', LuxRadio);
export default LuxRadio;
