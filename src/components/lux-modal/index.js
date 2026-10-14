/**
 * lux-modal — Modal dialog component.
 *
 * Props:
 *   open          — visibility (default false, reflect)
 *   title         — header title
 *   width         — dialog width (e.g. '560px'; default auto/480px)
 *   closable      — show the header × button (default true)
 *   maskClosable  — click mask / Esc to close (default true)
 *   confirmText   — footer confirm label (default '确定')
 *   cancelText    — footer cancel label (default '取消')
 *   hideFooter    — render no footer buttons (caller supplies its own)
 *   loading       — confirm button loading state
 *
 * Events (bubbles, composed):
 *   close   — × clicked, mask clicked or Esc (caller decides whether to keep content)
 *   cancel  — footer cancel clicked
 *   confirm — footer confirm clicked
 *
 * Slot: default → body content.
 */
import { html, css, LuxElement, registerComponent, when } from '../../index.js';
import '../lux-button/index.js';

const CLOSE_SVG = html`<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
</svg>`;

const styles = css`
    /* 0×0 block host — display:contents makes the fixed mask render fine but
       drop out of hit-testing in Chromium (clicks pass through to the page) */
    :host {
        display: block;
        width: 0;
        height: 0;
    }
    .mask {
        position: fixed;
        inset: 0;
        z-index: var(--lux-modal-z, 2000);
        background: rgb(15 23 42 / 45%);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 10vh 16px 16px;
        box-sizing: border-box;
        animation: lux-modal-fade 0.16s ease;
    }
    .dialog {
        background: rgb(var(--lux-card, 255 255 255));
        border-radius: 12px;
        width: var(--lux-modal-width, 480px);
        max-width: calc(100vw - 32px);
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        box-shadow: 0 24px 64px rgb(15 23 42 / 0.28);
        animation: lux-modal-pop 0.2s ease;
        overflow: hidden;
    }
    .head {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 14px 18px;
        border-bottom: 1px solid rgb(var(--lux-border, 226 232 240));
    }
    .title {
        flex: 1;
        font-size: 16px;
        font-weight: 600;
        color: rgb(var(--lux-text, 15 23 42));
    }
    .x {
        border: 0;
        background: transparent;
        width: 30px;
        height: 30px;
        border-radius: 8px;
        cursor: pointer;
        color: rgb(var(--lux-text-secondary, 100 116 139));
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }
    .x:hover {
        background: rgb(var(--lux-bg, 248 250 252));
        color: rgb(var(--lux-text, 15 23 42));
    }
    .body {
        padding: 18px;
        overflow: auto;
        color: rgb(var(--lux-text, 15 23 42));
        font-size: 14px;
    }
    .foot {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        padding: 12px 18px;
        border-top: 1px solid rgb(var(--lux-border, 226 232 240));
    }
    @keyframes lux-modal-fade {
        from {
            opacity: 0;
        }
    }
    @keyframes lux-modal-pop {
        from {
            opacity: 0;
            transform: translateY(-10px) scale(0.98);
        }
    }
`;

class LuxModal extends LuxElement {
    static styles = styles;

    static properties = {
        open: { type: Boolean, reflect: true },
        title: { type: String },
        width: { type: String, reflect: true },
        closable: { type: Boolean, reflect: true },
        maskClosable: { type: Boolean, attribute: 'mask-closable' },
        confirmText: { type: String, attribute: 'confirm-text' },
        cancelText: { type: String, attribute: 'cancel-text' },
        hideFooter: { type: Boolean, attribute: 'hide-footer' },
        loading: { type: Boolean, reflect: true },
    };

    constructor() {
        super();
        this.open = false;
        this.title = '';
        this.width = '';
        this.closable = true;
        this.maskClosable = true;
        this.confirmText = '确定';
        this.cancelText = '取消';
        this.hideFooter = false;
        this.loading = false;
        this._onKey = (e) => {
            if (e.key === 'Escape' && this.open && this.closable) this._emit('close');
        };
        // 兜底：遮罩若未命中（视口级点击不在本组件内）也视为遮罩点击关闭
        // 嵌套 modal：点击落在任意 lux-modal（含 shadow DOM 内）则不关当前
        this._onDocClick = (e) => {
            if (!this.open || !this.maskClosable) return;
            const path = e.composedPath();
            if (path.includes(this)) return; // 点击自身内部
            // 点击在任何 lux-modal 内 → 不关（让目标 modal 自己处理）
            for (const el of path) {
                if (el instanceof HTMLElement && el.tagName === 'LUX-MODAL' && el !== this) return;
            }
            this._emit('close');
            e.stopPropagation();
            e.preventDefault();
        };
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('keydown', this._onKey);
        document.addEventListener('click', this._onDocClick, true);
    }

    willUpdate(changed) {
        super.willUpdate?.(changed);
        if (changed.has('open') && this.open) {
            this._myZ = 2000 + ((LuxModal._zCounter = (LuxModal._zCounter || 0) + 1)) * 10;
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this._onKey);
        document.removeEventListener('click', this._onDocClick, true);
    }

    _emit(name) {
        this.dispatchEvent(new CustomEvent(name, { detail: {}, bubbles: true, composed: true }));
    }

    _onMask(e) {
        if (this.maskClosable && e.target === e.currentTarget) this._emit('close');
    }

    render() {
        return when(
            this.open,
            () => {
                // 嵌套 modal：用打开计数器递增 z-index
                return html`
                <div class="mask" style="z-index:${this._myZ || 2000}" @click=${(e) => this._onMask(e)}>
                    <div
                        class="dialog"
                        .style=${this.width ? `width:${this.width}` : ''}
                        role="dialog"
                    >
                        <div class="head">
                            <div class="title">${this.title}</div>
                            ${when(
                                this.closable,
                                () => html`<button
                                    class="x"
                                    type="button"
                                    aria-label="关闭"
                                    @click=${() => this._emit('close')}
                                >
                                    ${CLOSE_SVG}
                                </button>`
                            )}
                        </div>
                        <div class="body"><slot></slot></div>
                        ${when(
                            !this.hideFooter,
                            () => html`
                                <div class="foot">
                                    <lux-button @click=${() => this._emit('cancel')}>${this.cancelText}</lux-button>
                                    <lux-button
                                        variant="primary"
                                        .loading=${this.loading}
                                        @click=${() => this._emit('confirm')}
                                        >${this.confirmText}</lux-button
                                    >
                                </div>
                            `
                        )}
                    </div>
                </div>`;
            }
        );
    }
}

registerComponent('lux-modal', LuxModal);
export default LuxModal;
