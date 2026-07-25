import { html, css, LuxElement, registerComponent } from '../../index.js';

const styles = css`
    :host {
        display: block;
        border: 1px solid rgb(var(--lux-border, 51 65 85));
        border-radius: var(--lux-radius, 6px);
        background: rgb(var(--lux-card, 30 41 59));
        margin-bottom: var(--lux-space-4, 1rem);
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-bottom: 1px solid rgb(var(--lux-border, 51 65 85));
        cursor: pointer;
        user-select: none;
        transition: background var(--lux-transition, 150ms ease);
    }
    .header:hover {
        background: rgba(0, 0, 0, 0.03);
    }

    .title {
        font-size: var(--lux-font-sm, 0.875rem);
        font-weight: 600;
        color: rgb(var(--lux-text, 241 245 249));
    }

    .toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border: none;
        border-radius: var(--lux-radius-sm, 4px);
        background: transparent;
        color: rgb(var(--lux-text-secondary, 148 163 184));
        cursor: pointer;
        transition: all var(--lux-transition, 150ms ease);
        font-size: 14px;
    }
    .toggle-btn:hover {
        background: rgba(0, 0, 0, 0.05);
        color: rgb(var(--lux-text, 241 245 249));
    }
    .toggle-icon {
        transition: transform var(--lux-transition, 150ms ease);
        display: inline-block;
    }
    :host([expanded]) .toggle-icon {
        transform: rotate(180deg);
    }

    .main {
        padding: 16px;
    }

    .footer {
        padding: 12px 16px;
        border-top: 1px solid rgb(var(--lux-border, 51 65 85));
        background: rgb(var(--lux-bg, 248 250 252));
        color: rgb(var(--lux-text-secondary, 148 163 184));
        font-size: var(--lux-font-sm, 0.875rem);
        display: none;
    }

    :host([expanded]) .footer {
        display: block;
    }
`;

class LuxExample extends LuxElement {
    static styles = styles;

    static properties = {
        expanded: { type: Boolean, reflect: true },
    };

    constructor() {
        super();
        this.expanded = false;
    }

    _toggle() {
        this.expanded = !this.expanded;
    }

    render() {
        return html`
            <div class="header" @click=${() => this._toggle()}>
                <span class="title"><slot name="heading"></slot></span>
                <button
                    class="toggle-btn"
                    @click=${(e) => {
              e.stopPropagation();
              this._toggle();
          }}
                >
                    <span class="toggle-icon">▼</span>
                </button>
            </div>
            <div class="main">
                <slot name="main"></slot>
            </div>
            <div class="footer">
                <slot name="footer"></slot>
            </div>
        `;
    }
}

registerComponent('lux-example', LuxExample);
export default LuxExample;
