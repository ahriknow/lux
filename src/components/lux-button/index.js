/**
 * lux-button — Button component.
 *
 * Props:
 *   variant  — primary / secondary / success / warning / error / info (default: primary)
 *   outline  — outline style (boolean)
 *   ghost    — ghost style (boolean)
 *   size     — sm / md / lg (default: md)
 *   shape    — circle / square (default: none)
 *   icon     — icon name from lux-icon registry
 *   disabled — disable interaction
 *   loading  — show loading spinner
 *   block    — full width
 */

import { html, css, LuxElement, registerComponent } from '../../index.js';
import '../lux-icon/index.js';

const styles = css`
    :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        vertical-align: middle;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        font-family: inherit;
    }
    :host([block]) {
        display: flex;
        width: 100%;
    }

    /* ── Base ── */
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--btn-gap, 8px);
        padding: var(--btn-py, 6px) var(--btn-px, 16px);
        border: 1px solid transparent;
        border-radius: var(--btn-radius, 6px);
        font-size: var(--btn-font, 13px);
        font-weight: 500;
        line-height: 1;
        cursor: pointer;
        transition: all var(--lux-transition, 150ms ease);
        white-space: nowrap;
    }
    :host(:not([block])) .btn {
        width: 100%;
        box-sizing: border-box;
    }
    .btn:active {
        transform: translateY(1px);
    }

    /* ── Default (primary solid) ── */
    .btn {
        background: rgb(var(--lux-primary-500));
        color: #fff;
        border-color: rgb(var(--lux-primary-500));
    }
    .btn:hover {
        background: rgb(var(--lux-primary-600));
        border-color: rgb(var(--lux-primary-600));
    }
    .btn:active {
        background: rgb(var(--lux-primary-700));
    }

    /* ── Color variants (solid) ── */
    :host([variant='secondary']) .btn {
        background: rgb(var(--lux-card));
        color: rgb(var(--lux-text));
        border-color: rgb(var(--lux-border));
    }
    :host([variant='secondary']) .btn:hover {
        background: rgb(var(--lux-hover));
        border-color: rgb(var(--lux-border-hover));
    }

    :host([variant='success']) .btn {
        background: rgb(var(--lux-success));
        color: #fff;
        border-color: rgb(var(--lux-success));
    }
    :host([variant='success']) .btn:hover {
        background: rgb(22 163 74);
    }

    :host([variant='warning']) .btn {
        background: rgb(var(--lux-warning));
        color: #fff;
        border-color: rgb(var(--lux-warning));
    }
    :host([variant='warning']) .btn:hover {
        background: rgb(217 119 6);
    }

    :host([variant='error']) .btn,
    :host([variant='danger']) .btn {
        background: rgb(var(--lux-error));
        color: #fff;
        border-color: rgb(var(--lux-error));
    }
    :host([variant='error']) .btn:hover,
    :host([variant='danger']) .btn:hover {
        background: rgb(239 68 68);
    }

    :host([variant='info']) .btn {
        background: rgb(var(--lux-info));
        color: #fff;
        border-color: rgb(var(--lux-info));
    }
    :host([variant='info']) .btn:hover {
        background: rgb(37 99 235);
    }

    /* ── Outline (transparent bg, colored border/text) ── */
    :host([outline]) .btn {
        background: transparent;
        color: rgb(var(--lux-primary-500));
        border-color: rgb(var(--lux-primary-500));
    }
    :host([outline]) .btn:hover {
        background: rgb(var(--lux-primary-500) / 10%);
    }
    :host([outline]) .btn:active {
        background: rgb(var(--lux-primary-500) / 18%);
    }

    :host([outline][variant='secondary']) .btn {
        color: rgb(var(--lux-text));
        border-color: rgb(var(--lux-border));
    }
    :host([outline][variant='secondary']) .btn:hover {
        background: rgb(var(--lux-hover));
    }

    :host([outline][variant='success']) .btn {
        color: rgb(var(--lux-success));
        border-color: rgb(var(--lux-success));
    }
    :host([outline][variant='success']) .btn:hover {
        background: rgb(var(--lux-success) / 10%);
    }

    :host([outline][variant='warning']) .btn {
        color: rgb(var(--lux-warning));
        border-color: rgb(var(--lux-warning));
    }
    :host([outline][variant='warning']) .btn:hover {
        background: rgb(var(--lux-warning) / 10%);
    }

    :host([outline][variant='error']) .btn,
    :host([outline][variant='danger']) .btn {
        color: rgb(var(--lux-error));
        border-color: rgb(var(--lux-error));
    }
    :host([outline][variant='error']) .btn:hover,
    :host([outline][variant='danger']) .btn:hover {
        background: rgb(var(--lux-error) / 10%);
    }

    :host([outline][variant='info']) .btn {
        color: rgb(var(--lux-info));
        border-color: rgb(var(--lux-info));
    }
    :host([outline][variant='info']) .btn:hover {
        background: rgb(var(--lux-info) / 10%);
    }

    /* ── Ghost (transparent, no border, colored text) ── */
    :host([ghost]) .btn {
        background: transparent;
        border-color: transparent;
        color: rgb(var(--lux-primary-500));
    }
    :host([ghost]) .btn:hover {
        background: rgb(var(--lux-primary-500) / 10%);
    }
    :host([ghost]) .btn:active {
        background: rgb(var(--lux-primary-500) / 18%);
    }

    :host([ghost][variant='secondary']) .btn {
        color: rgb(var(--lux-text));
    }
    :host([ghost][variant='secondary']) .btn:hover {
        background: rgb(var(--lux-hover));
    }

    :host([ghost][variant='success']) .btn {
        color: rgb(var(--lux-success));
    }
    :host([ghost][variant='success']) .btn:hover {
        background: rgb(var(--lux-success) / 10%);
    }

    :host([ghost][variant='warning']) .btn {
        color: rgb(var(--lux-warning));
    }
    :host([ghost][variant='warning']) .btn:hover {
        background: rgb(var(--lux-warning) / 10%);
    }

    :host([ghost][variant='error']) .btn,
    :host([ghost][variant='danger']) .btn {
        color: rgb(var(--lux-error));
    }
    :host([ghost][variant='error']) .btn:hover,
    :host([ghost][variant='danger']) .btn:hover {
        background: rgb(var(--lux-error) / 10%);
    }

    :host([ghost][variant='info']) .btn {
        color: rgb(var(--lux-info));
    }
    :host([ghost][variant='info']) .btn:hover {
        background: rgb(var(--lux-info) / 10%);
    }

    /* ── Size ── */
    :host([size='sm']) .btn {
        --btn-py: 4px;
        --btn-px: 12px;
        --btn-font: 12px;
        --btn-gap: 4px;
    }
    :host([size='lg']) .btn {
        --btn-py: 10px;
        --btn-px: 20px;
        --btn-font: 15px;
        --btn-gap: 10px;
    }

    /* ── Shape: circle ── */
    :host([shape='circle']) .btn {
        border-radius: 50%;
        --btn-px: 0;
        width: var(--icon-size, 36px);
        height: var(--icon-size, 36px);
        padding: 0;
    }
    :host([shape='circle'][size='sm']) .btn {
        --icon-size: 32px;
    }
    :host([shape='circle'][size='lg']) .btn {
        --icon-size: 44px;
    }

    /* ── Shape: square ── */
    :host([shape='square']) .btn {
        --btn-px: 0;
        width: var(--icon-size, 36px);
        height: var(--icon-size, 36px);
        padding: 0;
    }
    :host([shape='square'][size='sm']) .btn {
        --icon-size: 32px;
    }
    :host([shape='square'][size='lg']) .btn {
        --icon-size: 44px;
    }

    /* ── Loading ── */
    .spinner {
        width: 1em;
        height: 1em;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: lux-spin 0.6s linear infinite;
    }
    @keyframes lux-spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

class LuxButton extends LuxElement {
    static styles = styles;

    static properties = {
        variant: { type: String, reflect: true },
        size: { type: String, reflect: true },
        shape: { type: String, reflect: true },
        icon: { type: String, reflect: true },
        disabled: { type: Boolean, reflect: true },
        loading: { type: Boolean, reflect: true },
        block: { type: Boolean, reflect: true },
        outline: { type: Boolean, reflect: true },
        ghost: { type: Boolean, reflect: true },
    };

    constructor() {
        super();
        this.variant = 'primary';
        this.size = 'md';
    }

    render() {
        const hasIcon = !!this.icon;
        return html`
            <div class="btn">
                ${this.loading ? html`<span class="spinner"></span>` : hasIcon ? html`<lux-icon name=${this.icon}></lux-icon>` : ''}
                ${hasIcon ? '' : html`<slot></slot>`}
            </div>
        `;
    }
}

registerComponent('lux-button', LuxButton);
export default LuxButton;
