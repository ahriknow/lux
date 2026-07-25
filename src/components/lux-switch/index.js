/**
 * lux-switch — Toggle switch component.
 *
 * Usage:
 *   <lux-switch checked></lux-switch>
 *   <lux-switch checked size="lg" shape="square"></lux-switch>
 *   <lux-switch checked-on-color="#10b981" checked-off-color="#ef4444">ON/OFF</lux-switch>
 *
 * Props:
 *   checked         — switch state
 *   disabled        — disable interaction
 *   size            — sm / md / lg
 *   shape           — round (default) / square
 *   checked-on-bg   — background when checked
 *   checked-on-color — text/icon color when checked
 *   checked-off-bg  — background when unchecked
 *   checked-off-color — text/icon color when unchecked
 *
 * Events:
 *   change — detail: { checked: boolean }
 */

import { html, css, LuxElement, registerComponent } from '../../index.js';

const styles = css`
    :host {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        vertical-align: middle;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) {
        opacity: 0.5;
        pointer-events: none;
    }

    :host([loading]) {
        pointer-events: none;
    }

    .track {
        position: relative;
        width: var(--sw-w, 40px);
        height: var(--sw-h, 22px);
        background: var(--sw-off-bg, rgb(var(--lux-border, 51 65 85)));
        border: none;
        padding: 0;
        cursor: pointer;
        transition: background var(--lux-transition, 150ms ease);
        flex-shrink: 0;
    }

    :host([checked]) .track {
        background: var(--sw-on-bg, rgb(var(--lux-primary-500, 99 91 218)));
    }

    .thumb {
        position: absolute;
        top: calc((var(--sw-h, 22px) - var(--sw-thumb, 18px)) / 2);
        left: calc((var(--sw-h, 22px) - var(--sw-thumb, 18px)) / 2);
        width: var(--sw-thumb, 18px);
        height: var(--sw-thumb, 18px);
        background: var(--sw-thumb-bg, rgb(var(--lux-bg, 255 255 255)));
        border-radius: inherit;
        transition: transform var(--lux-transition, 150ms ease);
        box-shadow: 0 1px 3px rgb(0 0 0 / 20%);
    }

    :host([checked]) .thumb {
        transform: translateX(calc(var(--sw-w, 40px) - var(--sw-h, 22px)));
    }

    .content {
        font-size: var(--sw-font, 14px);
        color: var(--sw-off-color, rgb(var(--lux-text, 241 245 249)));
        transition: color var(--lux-transition, 150ms ease);
    }

    :host([checked]) .content {
        color: var(--sw-on-color, rgb(var(--lux-text, 241 245 249)));
    }

    /* ── Size: sm ── */
    :host([size='sm']) .track {
        --sw-w: 32px;
        --sw-h: 18px;
        --sw-thumb: 14px;
        --sw-font: 12px;
    }

    /* ── Size: md (default) ── */
    /* uses CSS variables above */

    /* ── Size: lg ── */
    :host([size='lg']) .track {
        --sw-w: 52px;
        --sw-h: 28px;
        --sw-thumb: 22px;
        --sw-font: 16px;
    }

    /* ── Shape: square ── */
    :host([shape='square']) .track,
    :host([shape='square']) .thumb {
        border-radius: 4px;
    }

    /* ── Shape: round (default) ── */
    .track {
        border-radius: 9999px;
    }
    .thumb {
        border-radius: 9999px;
    }

    /* ── Loading ── */
    :host([loading]) .thumb::after {
        content: '';
        position: absolute;
        inset: 1px;
        border: 2px solid rgb(var(--lux-border, 51 65 85) / 0.2);
        border-top-color: rgb(var(--lux-text, 241 245 249));
        border-radius: 50%;
        animation: sw-spin 0.8s linear infinite;
    }
    @keyframes sw-spin {
        to {
            transform: rotate(360deg);
        }
    }
`;

class LuxSwitch extends LuxElement {
    static styles = styles;

    static properties = {
        checked: { type: Boolean, reflect: true },
        disabled: { type: Boolean, reflect: true },
        loading: { type: Boolean, reflect: true },
        size: { type: String, reflect: true },
        shape: { type: String, reflect: true },
        checkedOnBg: { type: String, attribute: 'checked-on-bg', reflect: true },
        checkedOnColor: { type: String, attribute: 'checked-on-color', reflect: true },
        checkedOffBg: { type: String, attribute: 'checked-off-bg', reflect: true },
        checkedOffColor: { type: String, attribute: 'checked-off-color', reflect: true },
        toggle: { type: Function, attribute: false },
    };

    constructor() {
        super();
        this.checked = false;
        this.disabled = false;
        this.loading = false;
        this.size = 'md';
        this.shape = 'round';
    }

    updated() {
        const s = this.style;
        if (this.checkedOnBg) s.setProperty('--sw-on-bg', this.checkedOnBg);
        if (this.checkedOnColor) s.setProperty('--sw-on-color', this.checkedOnColor);
        if (this.checkedOffBg) s.setProperty('--sw-off-bg', this.checkedOffBg);
        if (this.checkedOffColor) s.setProperty('--sw-off-color', this.checkedOffColor);
    }

    async _toggle() {
        if (this.disabled || this.loading) return;

        if (typeof this.toggle === 'function') {
            this.loading = true;
            try {
                const result = await this.toggle();
                if (result === true) {
                    this.checked = !this.checked;
                }
            } catch {
                // error — don't toggle
            } finally {
                this.loading = false;
            }
        } else {
            this.checked = !this.checked;
        }

        this.emit('change', { checked: this.checked });
    }

    render() {
        return html`
            <div class="track" @click=${() => this._toggle()}>
                <div class="thumb"></div>
            </div>
            <div class="content"><slot></slot></div>
        `;
    }
}

registerComponent('lux-switch', LuxSwitch);
export default LuxSwitch;
