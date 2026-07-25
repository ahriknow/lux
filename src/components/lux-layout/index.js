import { html, css, LuxElement, registerComponent } from '../../index.js';

/**
 * lux-layout — Aside-left layout component.
 *
 * Structure:
 *   aside | header
 *         | main (flex:1, overflow:auto)
 *         | footer
 *
 * Usage:
 *   <lux-layout aside-width="240px" aside-min="120px" aside-max="400px">
 *     <header slot="header">Header</header>
 *     <aside slot="aside">Sidebar</aside>
 *     <main slot="main">Content</main>
 *     <footer slot="footer">Footer</footer>
 *   </lux-layout>
 *
 * Props:
 *   aside-width   — aside width (number=px, string='20rem')
 *   aside-min     — min width for aside drag
 *   aside-max     — max width for aside drag
 *   aside-scroll  — aside overflow scroll
 *   no-header     — hide header
 *   no-footer     — hide footer
 *   no-aside      — hide aside
 */

const styles = css`
    :host {
        display: block;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .root {
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .slot-aside {
        z-index: 3;
        flex-shrink: 0;
        width: var(--aside-w, 240px);
        min-width: var(--aside-min, 120px);
        max-width: var(--aside-max, 50vw);
        overflow: hidden;
        position: relative;
        border-right: 1px solid rgb(var(--lux-border, 51 65 85));
        background: rgb(var(--lux-card, 30 41 59));
    }

    :host([aside-scroll]) .slot-aside {
        overflow-y: auto;
    }

    .slot-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .slot-header {
        flex-shrink: 0;
        z-index: 2;
    }
    .slot-footer {
        flex-shrink: 0;
        z-index: 2;
    }
    .slot-main {
        flex: 1;
        overflow: auto;
        min-height: 0;
        z-index: 1;
    }

    :host([no-header]) .slot-header {
        display: none;
    }
    :host([no-footer]) .slot-footer {
        display: none;
    }
    :host([no-aside]) .slot-aside {
        display: none;
    }

    .resize-handle {
        position: absolute;
        top: 0;
        right: 0;
        width: 6px;
        height: 100%;
        cursor: col-resize;
        z-index: 10;
        background: transparent;
        transition: background var(--lux-transition, 150ms ease);
    }
    .resize-handle:hover {
        background: rgb(var(--lux-primary-400, 129 120 247) / 0.3);
    }
`;

class LuxLayout extends LuxElement {
    static styles = styles;

    static properties = {
        asideWidth: { type: String, attribute: 'aside-width', reflect: true },
        asideMin: { type: String, attribute: 'aside-min', reflect: true },
        asideMax: { type: String, attribute: 'aside-max', reflect: true },
        asideScroll: { type: Boolean, attribute: 'aside-scroll', reflect: true },
        noHeader: { type: Boolean, attribute: 'no-header', reflect: true },
        noFooter: { type: Boolean, attribute: 'no-footer', reflect: true },
        noAside: { type: Boolean, attribute: 'no-aside', reflect: true },
    };

    constructor() {
        super();
        this.asideWidth = '240px';
        this.asideMin = '120px';
        this.asideMax = '50vw';
    }

    firstUpdated() {
        this._applyAside();
        this._initDrag();
    }

    updated() {
        if (!this._dragging) this._applyAside();
    }

    _parseWidth(val) {
        if (val == null) return null;
        if (typeof val === 'number') return val + 'px';
        if (/^\d+(\.\d+)?$/.test(val)) return val + 'px';
        return val;
    }

    _toPx(val) {
        const w = this._parseWidth(val);
        if (!w) return 0;
        if (w.endsWith('vw')) return (parseFloat(w) / 100) * window.innerWidth;
        if (w.endsWith('em') || w.endsWith('rem')) return parseFloat(w) * 16;
        return parseFloat(w) || 0;
    }

    _applyAside() {
        const w = this._parseWidth(this.asideWidth) || '240px';
        const min = this._parseWidth(this.asideMin) || '120px';
        const max = this._parseWidth(this.asideMax) || '50vw';
        this.style.setProperty('--aside-w', w);
        this.style.setProperty('--aside-min', min);
        this.style.setProperty('--aside-max', max);
    }

    _initDrag() {
        const handle = this.renderRoot.querySelector('.resize-handle');
        if (!handle) return;

        handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const aside = this.renderRoot.querySelector('.slot-aside');
            if (!aside) return;

            const min = this._toPx(this.asideMin) || 120;
            const max = this._toPx(this.asideMax) || 9999;
            const startW = aside.offsetWidth || 240;
            const startX = e.clientX;

            this._dragging = true;
            handle.classList.add('dragging');

            const onMove = (ev) => {
                const w = Math.min(max, Math.max(min, startW + ev.clientX - startX));
                aside.style.width = w + 'px';
            };

            const onUp = () => {
                this._dragging = false;
                handle.classList.remove('dragging');
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                this.asideWidth = aside.offsetWidth + 'px';
                this.style.setProperty('--aside-w', this.asideWidth);
                this.dispatchEvent(
                    new CustomEvent('aside-resize', {
                        detail: { width: this.asideWidth },
                        bubbles: true,
                        composed: true,
                    })
                );
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }

    render() {
        return html`
            <div class="root">
                <div class="slot-aside">
                    <slot name="aside"></slot>
                    <div class="resize-handle"></div>
                </div>
                <div class="slot-right">
                    <div class="slot-header"><slot name="header"></slot></div>
                    <div class="slot-main"><slot name="main"></slot></div>
                    <div class="slot-footer"><slot name="footer"></slot></div>
                </div>
            </div>
        `;
    }
}

registerComponent('lux-layout', LuxLayout);
export default LuxLayout;
