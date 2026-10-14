/**
 * lux-collapse — Collapsible panel.
 *
 * Props:
 *   open      — expanded state (reflected, bindable)
 *   title     — header title (overridden by slot="title")
 *   disabled  — disable toggle
 *
 * Slots:
 *   title    — custom header title content
 *   actions  — header right-side actions; clicks on interactive
 *              elements (a/button/lux-*) here do NOT toggle
 *   (default)—— panel body
 *
 * Events:
 *   toggle — { open } after expand/collapse
 */
import { html, css, LuxElement, registerComponent } from '../../index.js';

const ARROW_SVG = html`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"></path>
</svg>`;

const styles = css`
    :host {
        display: block;
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: var(--lux-radius, 8px);
        background: rgb(var(--lux-card, 255 255 255));
        margin-bottom: 8px;
        overflow: hidden;
    }
    .head {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        cursor: pointer;
        user-select: none;
    }
    .head:hover {
        background: rgb(var(--lux-hover, 0 0 0 / 3%));
    }
    :host([disabled]) .head {
        cursor: default;
        opacity: 0.6;
    }
    .arrow {
        display: inline-flex;
        color: rgb(var(--lux-text-secondary, 100 116 139));
        transition: transform 0.15s ease;
        flex-shrink: 0;
    }
    :host([open]) .arrow {
        transform: rotate(90deg);
    }
    .title {
        flex: 1;
        min-width: 0;
        font-weight: 600;
        font-size: 14px;
        color: rgb(var(--lux-text, 15 23 42));
    }
    .actions {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        font-weight: 400;
        font-size: 13px;
        color: rgb(var(--lux-text-secondary, 100 116 139));
    }
    .body {
        display: none;
        padding: 10px 14px 12px;
        border-top: 1px solid rgb(var(--lux-border, 226 232 240));
        font-size: 14px;
        font-weight: 400;
        color: rgb(var(--lux-text, 15 23 42));
    }
    :host([open]) .body {
        display: block;
    }
`;

class LuxCollapse extends LuxElement {
    static styles = styles;

    static properties = {
        open: { type: Boolean, reflect: true },
        title: { type: String },
        disabled: { type: Boolean, reflect: true },
    };

    constructor() {
        super();
        this.open = false;
        this.disabled = false;
    }

    /** 头部点击 → 翻转；落在头部交互元素（链接/按钮等）上的点击只交给该控件，不折叠 */
    _onHeadClick(e) {
        if (this.disabled) return;
        const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
        const isCtl = path.some(
            (n) =>
                n instanceof Element &&
                n.matches('a,button,input,select,textarea,lux-button,lux-select,lux-switch,lux-modal')
        );
        if (isCtl) return;
        this.open = !this.open;
        this.emit('toggle', { open: this.open });
    }

    render() {
        return html`
            <div class="head" @click=${(e) => this._onHeadClick(e)}>
                <span class="arrow">${ARROW_SVG}</span>
                <div class="title"><slot name="title">${this.title ?? ''}</slot></div>
                <div class="actions"><slot name="actions"></slot></div>
            </div>
            <div class="body"><slot></slot></div>
        `;
    }
}

registerComponent('lux-collapse', LuxCollapse);
export default LuxCollapse;
