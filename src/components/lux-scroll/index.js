/**
 * lux-scroll — Custom scrollbar container.
 *
 * Hides native scrollbar and shows a styled custom scrollbar.
 * Supports scroll-to-top/bottom buttons and theme-aware colors.
 *
 * Usage:
 *   <lux-scroll height="400px">
 *     <div>Long content...</div>
 *   </lux-scroll>
 *   <lux-scroll height="100%" show-buttons>
 *     <div>Content with scroll buttons</div>
 *   </lux-scroll>
 *
 * Props:
 *   height        — container height (default: 100%)
 *   width         — container width (default: 100%)
 *   show-buttons  — show scroll-to-top/bottom buttons
 *   disabled      — disable custom scrollbar (show native)
 */

import { html, css, LuxElement, registerComponent } from '../../index.js';

const styles = css`
    :host {
        display: block;
        position: relative;
        width: var(--scroll-w, 100%);
        height: var(--scroll-h, 100%);
    }

    .scroll-container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .scroll-container::-webkit-scrollbar {
        display: none;
    }

    /* ── Custom Track ── */
    .scroll-track {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 6px;
        height: calc(100% - 8px);
        background: rgb(var(--lux-border, 226 232 240) / 0.2);
        border-radius: 3px;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    :host(:hover) .scroll-track,
    .scroll-container:hover + .scroll-track,
    .scroll-track.visible {
        opacity: 1;
    }

    /* ── Custom Thumb ── */
    .scroll-thumb {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        border-radius: 3px;
        background: rgb(var(--lux-scrollbar, 180 196 214));
        cursor: grab;
        transition:
            background 0.15s ease,
            height 0.15s ease;
        min-height: 20px;
    }

    .scroll-thumb:hover,
    .scroll-thumb.dragging {
        background: rgb(var(--lux-primary-400, 129 120 247));
    }

    .scroll-thumb.dragging {
        cursor: grabbing;
    }

    /* ── Scroll Buttons ─── */
    .scroll-buttons {
        position: absolute;
        top: 8px;
        right: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        z-index: 11;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    :host(:hover) .scroll-buttons,
    .scroll-buttons.visible {
        opacity: 1;
    }

    .scroll-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1px solid rgb(var(--lux-border, 51 65 85));
        background: rgb(var(--lux-card, 30 41 59));
        color: rgb(var(--lux-text-secondary, 148 163 184));
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        transition: all 0.15s ease;
        padding: 0;
    }

    .scroll-btn:hover {
        background: rgb(var(--lux-primary-400, 129 120 247));
        color: #fff;
        border-color: rgb(var(--lux-primary-400, 129 120 247));
    }

    .scroll-btn:disabled {
        opacity: 0.3;
        pointer-events: none;
    }

    /* ── Disabled (show native) ── */
    :host([disabled]) .scroll-track,
    :host([disabled]) .scroll-buttons {
        display: none;
    }
    :host([disabled]) .scroll-container {
        scrollbar-width: auto;
        -ms-overflow-style: auto;
    }
    :host([disabled]) .scroll-container::-webkit-scrollbar {
        display: block;
    }
`;

class LuxScroll extends LuxElement {
    static styles = styles;

    static properties = {
        height: { type: String, attribute: 'height', reflect: true },
        width: { type: String, attribute: 'width', reflect: true },
        showButtons: { type: Boolean, attribute: 'show-buttons', reflect: true },
        disabled: { type: Boolean, attribute: 'disabled', reflect: true },
    };

    constructor() {
        super();
        this.height = '100%';
        this.width = '100%';
        this.showButtons = false;
        this.disabled = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this.style.height = this.height;
        this.style.width = this.width;
    }

    firstUpdated() {
        this._setupScroll();
    }

    updated() {
        this.style.height = this.height;
        this.style.width = this.width;
        requestAnimationFrame(() => this._syncThumb());
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._teardownScroll();
    }

    _setupScroll() {
        const container = this.renderRoot.querySelector('.scroll-container');
        const thumb = this.renderRoot.querySelector('.scroll-thumb');
        const track = this.renderRoot.querySelector('.scroll-track');
        if (!container || !thumb || !track) return;

        this._container = container;
        this._thumb = thumb;
        this._track = track;

        // Sync thumb position on scroll
        this._onScroll = () => this._syncThumb();
        container.addEventListener('scroll', this._onScroll, { passive: true });

        // Drag thumb
        this._onThumbDown = (e) => this._startDrag(e);
        thumb.addEventListener('mousedown', this._onThumbDown);

        // Click track to scroll
        this._onTrackClickBound = (e) => this._onTrackClick(e);
        track.addEventListener('click', this._onTrackClickBound);

        // Show/hide on hover
        this._onMouseEnter = () => {
            track.classList.add('visible');
            this._showButtons(true);
        };
        this._onMouseLeave = () => {
            track.classList.remove('visible');
            this._showButtons(false);
        };
        this.addEventListener('mouseenter', this._onMouseEnter);
        this.addEventListener('mouseleave', this._onMouseLeave);

        // Initial sync
        requestAnimationFrame(() => this._syncThumb());
    }

    _teardownScroll() {
        if (this._container) {
            this._container.removeEventListener('scroll', this._onScroll);
        }
        if (this._thumb) {
            this._thumb.removeEventListener('mousedown', this._onThumbDown);
        }
        if (this._track) {
            this._track.removeEventListener('click', this._onTrackClickBound);
        }
        this.removeEventListener('mouseenter', this._onMouseEnter);
        this.removeEventListener('mouseleave', this._onMouseLeave);
    }

    _syncThumb() {
        const c = this._container;
        const t = this._thumb;
        const track = this._track;
        if (!c || !t || !track) return;

        const scrollH = c.scrollHeight;
        const clientH = c.clientHeight;
        const trackH = track.offsetHeight || clientH - 8;
        if (scrollH <= clientH) {
            t.style.height = '0px';
            t.style.opacity = '0';
            return;
        }

        const ratio = clientH / scrollH;
        const thumbH = Math.max(20, trackH * ratio);
        const maxTop = trackH - thumbH;
        const scrollTop = c.scrollTop;
        const maxScroll = scrollH - clientH;
        const top = maxScroll > 0 ? (scrollTop / maxScroll) * maxTop : 0;

        t.style.height = thumbH + 'px';
        t.style.top = top + 'px';
        t.style.opacity = '1';
    }

    _startDrag(e) {
        e.preventDefault();
        const c = this._container;
        const t = this._thumb;
        if (!c || !t) return;

        const startY = e.clientY;
        const startScroll = c.scrollTop;
        const scrollH = c.scrollHeight;
        const clientH = c.clientHeight;
        const thumbH = t.offsetHeight;
        const maxScroll = scrollH - clientH;
        const maxTop = clientH - thumbH;
        const ratio = maxScroll > maxTop ? maxScroll / maxTop : 1;

        t.classList.add('dragging');

        const onMove = (ev) => {
            const dy = ev.clientY - startY;
            const newScroll = startScroll + dy * ratio;
            c.scrollTop = Math.max(0, Math.min(maxScroll, newScroll));
        };

        const onUp = () => {
            t.classList.remove('dragging');
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    _onTrackClick(e) {
        const c = this._container;
        if (!c) return;
        const rect = this._track.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const trackH = rect.height;
        const ratio = clickY / trackH;
        const maxScroll = c.scrollHeight - c.clientHeight;
        c.scrollTop = ratio * maxScroll;
    }

    _showButtons(show) {
        if (!this.showButtons) return;
        const btns = this.renderRoot.querySelector('.scroll-buttons');
        if (btns) btns.classList.toggle('visible', show);
    }

    scrollToTop() {
        this._container?.scrollTo({ top: 0, behavior: 'smooth' });
    }

    scrollToBottom() {
        const c = this._container;
        if (c) c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
    }

    render() {
        return html`
            <div class="scroll-container">
                <slot></slot>
            </div>
            <div class="scroll-track">
                <div class="scroll-thumb"></div>
            </div>
            ${
                this.showButtons
                    ? html`
                          <div class="scroll-buttons">
                              <button class="scroll-btn" @click=${() => this.scrollToTop()}>
                                  ▲
                              </button>
                              <button class="scroll-btn" @click=${() => this.scrollToBottom()}>
                                  ▼
                              </button>
                          </div>
                      `
                    : ''
            }
        `;
    }
}

registerComponent('lux-scroll', LuxScroll);
export default LuxScroll;
