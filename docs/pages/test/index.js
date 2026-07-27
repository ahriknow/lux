import { html, css, LuxElement } from '../../lux.min.js';
import { createTheme } from '../../lux.min.js';

const presets = [
    { name: 'Violet', color: '#6c5ce7' },
    { name: 'Blue', color: '#3b82f6' },
    { name: 'Cyan', color: '#00cec9' },
    { name: 'Green', color: '#10b981' },
    { name: 'Amber', color: '#f59e0b' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Rose', color: '#f43f5e' },
    { name: 'Orange', color: '#f97316' },
];

const colorRoles = [
    { key: 'primary', label: 'Primary', desc: 'Main accent color' },
    { key: 'success', label: 'Success', desc: 'Positive actions, confirmations' },
    { key: 'warning', label: 'Warning', desc: 'Caution, attention needed' },
    { key: 'error', label: 'Error', desc: 'Destructive, errors, danger' },
    { key: 'info', label: 'Info', desc: 'Links, informational' },
];

const styles = css`
    :host {
        display: block;
    }
    h1 {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
        margin-bottom: 8px;
        color: rgb(var(--lux-text));
    }
    p {
        color: rgb(var(--lux-text-secondary));
        font-size: 14px;
        margin-bottom: 16px;
        line-height: 1.6;
    }
    h2 {
        font-size: 18px;
        font-weight: 600;
        margin: 32px 0 12px;
        color: rgb(var(--lux-text));
    }
    h3 {
        font-size: 15px;
        font-weight: 600;
        margin: 20px 0 8px;
        color: rgb(var(--lux-text));
    }

    /* Color role picker */
    .role-section {
        margin-bottom: 20px;
    }
    .role-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
    }
    .role-label {
        font-size: 14px;
        font-weight: 600;
        color: rgb(var(--lux-text));
        min-width: 80px;
    }
    .role-desc {
        font-size: 12px;
        color: rgb(var(--lux-text-muted));
    }
    .preset-row {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
    }
    .preset-btn {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: 2px solid transparent;
        cursor: pointer;
        transition: all 0.15s;
    }
    .preset-btn:hover {
        transform: scale(1.15);
    }
    .preset-btn.active {
        border-color: rgb(var(--lux-text));
    }
    .custom-input {
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        padding: 0;
        background: none;
    }

    /* Dark mode */
    .toggle-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 24px;
    }
    .toggle {
        width: 44px;
        height: 24px;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        background: rgb(var(--lux-border));
        position: relative;
        transition: background 0.2s;
    }
    .toggle.on {
        background: rgb(var(--lux-primary-500));
    }
    .toggle::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
    }
    .toggle.on::after {
        transform: translateX(20px);
    }

    /* Token preview */
    .tokens {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 6px;
        margin: 12px 0;
    }
    .token {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 10px;
        background: rgb(var(--lux-card));
        border: 1px solid rgb(var(--lux-border));
        border-radius: var(--lux-radius);
        font-size: 11px;
    }
    .token-swatch {
        width: 24px;
        height: 24px;
        border-radius: 5px;
        flex-shrink: 0;
        border: 1px solid rgb(var(--lux-border));
    }
    .token-name {
        color: rgb(var(--lux-text-muted));
        font-family: monospace;
    }

    /* Component preview */
    .preview {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        align-items: center;
        margin: 12px 0;
    }
    .btn-p {
        padding: 8px 20px;
        border-radius: var(--lux-radius);
        border: none;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
    }
    .btn-primary {
        background: rgb(var(--lux-primary-500));
        color: #fff;
    }
    .btn-primary:hover {
        background: rgb(var(--lux-primary-400));
    }
    .btn-outline {
        background: transparent;
        color: rgb(var(--lux-primary-500));
        border: 1px solid rgb(var(--lux-primary-500));
    }
    .btn-outline:hover {
        background: rgb(var(--lux-primary-500));
        color: #fff;
    }
    .btn-ghost {
        background: transparent;
        color: rgb(var(--lux-text-secondary));
    }
    .btn-ghost:hover {
        background: rgb(var(--lux-hover));
        color: rgb(var(--lux-text));
    }
    .badge {
        display: inline-block;
        padding: 2px 10px;
        border-radius: var(--lux-radius-full);
        font-size: 12px;
        font-weight: 500;
    }
    .input-p {
        padding: 8px 12px;
        border-radius: var(--lux-radius);
        border: 1px solid rgb(var(--lux-border));
        background: rgb(var(--lux-surface));
        color: rgb(var(--lux-text));
        font-size: 14px;
        width: 240px;
        outline: none;
        transition: border-color 0.2s;
    }
    .input-p:focus {
        border-color: rgb(var(--lux-primary-500));
    }
    .card-p {
        background: rgb(var(--lux-card));
        border: 1px solid rgb(var(--lux-border));
        border-radius: var(--lux-radius-lg);
        padding: 20px;
        max-width: 320px;
    }
    .card-p p {
        font-size: 13px;
        color: rgb(var(--lux-text-secondary));
        margin: 8px 0 0;
    }
`;

class PageTest extends LuxElement {
    static styles = styles;

    constructor() {
        super();
        this._theme = createTheme();
        this._dark = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this._theme.apply();
    }

    _pickColor(role, hex) {
        this._theme.setColors({ [role]: hex });
    }

    _toggleDark() {
        this._dark = !this._dark;
        this._theme.setDark(this._dark);
    }

    render() {
        const colors = this._theme.getColors();
        const btnBase =
            'width:32px;height:32px;border-radius:8px;border:2px solid transparent;cursor:pointer;transition:all 0.15s;';
        const swatchBase =
            'width:24px;height:24px;border-radius:5px;border:1px solid rgb(var(--lux-border));';

        return html`
            <h1>Theme Playground</h1>
            <p>Pick colors for each role — palette and tokens are generated automatically.</p>

            ${colorRoles.map(
                (role) => html`
                    <div class="role-section">
                        <div class="role-header">
                            <span class="role-label">${role.label}</span>
                            <span class="role-desc">${role.desc}</span>
                        </div>
                        <div class="preset-row">
                            ${presets.map(
                                (p) => html`
                                    <button
                                        class="preset-btn ${colors[role.key] === p.color ? 'active' : ''}"
                                        .style=${btnBase + 'background:' + p.color}
                                        @click=${() => this._pickColor(role.key, p.color)}
                                    ></button>
                                `
                            )}
                            <input
                                type="color"
                                class="custom-input"
                                .value=${colors[role.key]}
                                @input=${(e) => this._pickColor(role.key, e.target.value)}
                            />
                        </div>
                    </div>
                `
            )}

            <h2>Dark Mode</h2>
            <div class="toggle-row">
                <button
                    class="toggle ${this._dark ? 'on' : ''}"
                    @click=${() => this._toggleDark()}
                ></button>
                <span style="color:rgb(var(--lux-text));font-size:14px"
                    >${this._dark ? 'Dark' : 'Light'}</span
                >
            </div>

            <h2>Generated Tokens</h2>
            <div class="tokens">
                ${['primary-500', 'primary-400', 'primary-600', 'primary-700', 'primary-800'].map(
                    (k) => html`
                        <div class="token">
                            <div
                                class="token-swatch"
                                .style=${swatchBase + 'background:rgb(var(--lux-' + k + '))'}
                            ></div>
                            <span class="token-name">${k}</span>
                        </div>
                    `
                )}
                ${['success', 'warning', 'error', 'info'].map(
                    (k) => html`
                        <div class="token">
                            <div
                                class="token-swatch"
                                .style=${swatchBase + 'background:rgb(var(--lux-' + k + '))'}
                            ></div>
                            <span class="token-name">${k}</span>
                        </div>
                    `
                )}
                ${['bg', 'card', 'text', 'text-secondary', 'border'].map(
                    (k) => html`
                        <div class="token">
                            <div
                                class="token-swatch"
                                .style=${swatchBase + 'background:rgb(var(--lux-' + k + '))'}
                            ></div>
                            <span class="token-name">${k}</span>
                        </div>
                    `
                )}
            </div>

            <h2>Component Preview</h2>
            <h3>Buttons</h3>
            <div class="preview">
                <button class="btn-p btn-primary">Primary</button>
                <button class="btn-p btn-outline">Outline</button>
                <button class="btn-p btn-ghost">Ghost</button>
            </div>
            <h3>Badges</h3>
            <div class="preview">
                <span class="badge" .style=${'background:rgb(var(--lux-primary-500));color:#fff'}
                    >Primary</span
                >
                <span class="badge" .style=${'background:rgb(var(--lux-success));color:#fff'}
                    >Success</span
                >
                <span class="badge" .style=${'background:rgb(var(--lux-warning));color:#fff'}
                    >Warning</span
                >
                <span class="badge" .style=${'background:rgb(var(--lux-error));color:#fff'}
                    >Error</span
                >
                <span class="badge" .style=${'background:rgb(var(--lux-info));color:#fff'}
                    >Info</span
                >
            </div>
            <h3>Input</h3>
            <div class="preview">
                <input class="input-p" placeholder="Type something..." />
            </div>
            <h3>Card</h3>
            <div class="card-p">
                <h3>Card Title</h3>
                <p>This card uses theme tokens. Colors adapt to your selections above.</p>
            </div>
        `;
    }
}

export default PageTest;
