/**
 * lux-color-picker — Color swatch picker with preset palette + native custom color input.
 *
 * Props:
 *   value      — '#rrggbb' (controlled, may be '' / semantic legacy names — shown as-is)
 *   palette    — array of hex strings (default: curated 20)
 *   placeholder— trigger hint when value empty (default 选择颜色)
 *   disabled
 *
 * Events: change { value } — bubbles + composed
 */
import { html, css, LuxElement, registerComponent, repeat, when } from '../../index.js';

export const DEFAULT_PALETTE = [
    '#ef4444', '#dc2626', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
    '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899', '#f43f5e', '#64748b', '#0f172a',
];

const ARROW_SVG = html`<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
</svg>`;

const styles = css`
    :host {
        display: inline-block;
        position: relative;
        vertical-align: middle;
    }
    .trigger {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 32px;
        padding: 0 10px;
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: var(--lux-radius, 6px);
        background: rgb(var(--lux-card, 255 255 255));
        cursor: pointer;
        font-size: 13px;
        color: rgb(var(--lux-text, 15 23 42));
        min-width: 120px;
        box-sizing: border-box;
        transition: border-color 0.15s ease;
    }
    .trigger:hover {
        border-color: rgb(var(--lux-primary-400, 108 92 231));
    }
    :host([disabled]) .trigger {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }
    .dot {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        border: 1px solid rgb(var(--lux-border, 226 232 240) / 80%);
        background: var(--cp, transparent);
        background-image: linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),
            linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);
        background-size: 8px 8px;
        background-position: 0 0, 4px 4px;
        flex: 0 0 auto;
    }
    .dot i {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 3px;
        background: var(--cp, transparent);
    }
    .text {
        flex: 1;
        text-align: left;
        color: rgb(var(--lux-text-secondary, 100 116 139));
        font-family: 'SF Mono', Consolas, monospace;
        font-size: 12px;
    }
    .arrow {
        color: rgb(var(--lux-text-muted, 148 163 184));
        display: inline-flex;
    }
    .panel {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        z-index: 1100;
        width: 232px;
        padding: 12px;
        background: rgb(var(--lux-card, 255 255 255));
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: 10px;
        box-shadow: 0 12px 32px rgb(15 23 42 / 16%);
        display: none;
    }
    .panel.open {
        display: block;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
    }
    .sw {
        width: 34px;
        height: 26px;
        border-radius: 6px;
        border: 1px solid rgb(15 23 42 / 12%);
        cursor: pointer;
        padding: 0;
        position: relative;
        transition: transform 0.1s ease;
    }
    .sw:hover {
        transform: scale(1.08);
    }
    .sw.active {
        outline: 2px solid rgb(var(--lux-primary-500, 99 91 218));
        outline-offset: 1px;
    }
    .custom {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px dashed rgb(var(--lux-border, 226 232 240));
        font-size: 12px;
        color: rgb(var(--lux-text-secondary, 100 116 139));
    }
    .custom input[type='color'] {
        width: 40px;
        height: 26px;
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: 6px;
        background: none;
        cursor: pointer;
        padding: 1px;
    }
    .hex {
        font-family: 'SF Mono', Consolas, monospace;
        font-size: 12px;
        color: rgb(var(--lux-text, 15 23 42));
    }
`;

class LuxColorPicker extends LuxElement {
    static styles = styles;

    static properties = {
        value: { type: String },
        palette: { type: Array },
        placeholder: { type: String },
        disabled: { type: Boolean, reflect: true },
        open: { type: Boolean, state: true },
    };

    constructor() {
        super();
        this.value = '';
        this.palette = [...DEFAULT_PALETTE];
        this.placeholder = '选择颜色';
        this.disabled = false;
        this.open = false;
        this._onDocClick = (e) => {
            if (!this.open) return;
            if (!e.composedPath().includes(this)) this.open = false;
        };
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('mousedown', this._onDocClick, true);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('mousedown', this._onDocClick, true);
    }

    _pick(hex) {
        this.value = hex;
        this.emit('change', { value: hex });
    }

    _toggle() {
        if (this.disabled) return;
        this.open = !this.open;
    }

    render() {
        const v = this.value || '';
        return html`
            <div class="trigger" @click=${() => this._toggle()}>
                <span class="dot" .style=${`--cp:${v || 'transparent'}`}><i></i></span>
                <span class="text">${v || this.placeholder}</span>
                <span class="arrow">${ARROW_SVG}</span>
            </div>
            <div class=${this.open ? 'panel open' : 'panel'}>
                <div class="grid">
                    ${repeat(
                        this.palette,
                        (c) => c,
                        (c) => html`
                            <button
                                class=${c === v ? 'sw active' : 'sw'}
                                type="button"
                                .style=${`background:${c}`}
                                title=${c}
                                @click=${() => this._pick(c)}
                            ></button>
                        `
                    )}
                </div>
                <div class="custom">
                    <input
                        type="color"
                        .value=${/^#[0-9a-fA-F]{6}$/.test(v) ? v : '#6366f1'}
                        @input=${(e) => this._pick(e.target.value)}
                    />
                    <span>自定义</span>
                    <span class="hex">${v || '—'}</span>
                </div>
            </div>
        `;
    }
}

registerComponent('lux-color-picker', LuxColorPicker);
export default LuxColorPicker;
