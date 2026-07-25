/**
 * lux-code — Code display component with optional highlight.js integration
 *
 * Props:
 *   code          — code content (string)
 *   language      — language hint for highlight.js (optional)
 *   show-header   — show mac-style header (boolean)
 *   show-language — show language label in header (boolean, default true)
 *   show-copy     — show copy button (boolean, default true)
 *
 * Events:
 *   copy — fired when copy button is clicked, detail: { code }
 */

import { html, css, LuxElement, registerComponent, classMap } from '../../index.js';

const styles = css`
    :host {
        display: block;
        position: relative;
        margin: 12px 0;
        border-radius: var(--lux-radius, 6px);
        border: 1px solid rgb(var(--lux-code-border, 226 232 240));
    }

    :host(.has-fixed-height) {
        display: flex;
        flex-direction: column;
    }

    :host(.has-fixed-height) .code-body {
        flex: 1;
        min-height: 0;
        overflow: auto;
        display: flex;
        flex-direction: column;
    }

    :host(.has-fixed-height) pre {
        flex: 1;
        min-height: 0;
    }

    /* ── Header ── */
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 14px;
        background: rgb(var(--lux-code-header, 241 245 249));
        border-bottom: 1px solid rgb(var(--lux-code-border, 226 232 240));
        font-size: 12px;
        color: rgb(var(--lux-text-muted, 100 116 139));
    }
    .header.hidden {
        display: none;
    }

    .dots {
        display: flex;
        gap: 8px;
    }
    .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }
    .dot-red {
        background: #ff5f57;
    }
    .dot-yellow {
        background: #ffbd2e;
    }
    .dot-green {
        background: #28c840;
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .lang-label {
        font-size: 11px;
        color: rgb(var(--lux-text-muted, 100 116 139));
        opacity: 0.7;
    }

    .copy-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        border: none;
        border-radius: 4px;
        background: transparent;
        color: rgb(var(--lux-text-secondary, 148 163 184));
        cursor: pointer;
        transition: all 0.15s;
    }
    .copy-btn:hover {
        background: rgb(var(--lux-hover, 0 0 0 / 5%));
        color: rgb(var(--lux-text, 15 23 42));
    }

    /* ── Floating copy (no header) ── */
    .copy-float {
        position: absolute;
        top: 8px;
        right: 8px;
        display: none;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        background: rgb(var(--lux-code-header, 241 245 249));
        border: 1px solid rgb(var(--lux-code-border, 226 232 240));
        color: rgb(var(--lux-text-secondary, 148 163 184));
        cursor: pointer;
        transition: all 0.15s;
        z-index: 1;
    }
    .copy-float:hover {
        background: rgb(var(--lux-hover, 0 0 0 / 5%));
        color: rgb(var(--lux-text, 15 23 42));
    }
    :host(:not([show-header]):hover) .copy-float {
        display: flex;
    }

    /* ── Code block ── */
    .code-body {
        padding: 14px 18px;
        position: relative;
        background: rgb(var(--lux-code-bg, 248 250 252));
        border-radius: 0 0 var(--lux-radius, 6px) var(--lux-radius, 6px);
        overflow: auto;
    }
    :host([show-header]) .code-body {
        border-radius: 0;
    }

    pre {
        margin: 0;
        padding: 0;
        font-size: 13px;
        line-height: 1.7;
        font-family: var(--lux-font-mono, 'SF Mono', Consolas, monospace);
        color: rgb(var(--lux-code-text, 51 65 85));
    }

    pre code {
        display: block;
        padding: 0;
    }

    .code-body::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    .code-body::-webkit-scrollbar-track {
        background: transparent;
    }
    .code-body::-webkit-scrollbar-thumb {
        background: rgb(var(--lux-scrollbar, 180 196 214));
        border-radius: 4px;
    }
    .code-body::-webkit-scrollbar-thumb:hover {
        background: rgb(var(--lux-text-muted, 100 116 139));
    }
    .code-body {
        scrollbar-width: thin;
        scrollbar-color: rgb(var(--lux-scrollbar, 180 196 214)) transparent;
    }

    pre code {
        display: block;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        background: transparent;
        padding: 0;
        white-space: pre;
    }

    /* ── highlight.js token styles via CSS variables ── */
    .hljs-keyword,
    .hljs-doctag,
    .hljs-template-tag,
    .hljs-template-variable,
    .hljs-type,
    .hljs-variable.language_ {
        color: rgb(var(--lux-code-keyword));
    }
    .hljs-string,
    .hljs-meta .hljs-string,
    .hljs-regexp {
        color: rgb(var(--lux-code-string));
    }
    .hljs-number,
    .hljs-literal,
    .hljs-attr,
    .hljs-attribute,
    .hljs-selector-attr,
    .hljs-selector-class,
    .hljs-selector-id,
    .hljs-variable {
        color: rgb(var(--lux-code-number));
    }
    .hljs-comment,
    .hljs-quote,
    .hljs-formula,
    .hljs-code {
        color: rgb(var(--lux-code-comment));
        font-style: italic;
    }
    .hljs-title.class_,
    .hljs-title.class_.inherited__ {
        color: rgb(var(--lux-code-class));
    }
    .hljs-title.function_ {
        color: rgb(var(--lux-code-function));
    }
    .hljs-variable {
        color: rgb(var(--lux-code-variable));
    }
    .hljs-tag,
    .hljs-name,
    .hljs-selector-pseudo,
    .hljs-selector-tag {
        color: rgb(var(--lux-code-tag));
    }
    .hljs-attr {
        color: rgb(var(--lux-code-attr));
    }
    .hljs-selector-class {
        color: rgb(var(--lux-code-selector));
    }
    .hljs-literal {
        color: rgb(var(--lux-code-literal));
    }
    .hljs-symbol {
        color: rgb(var(--lux-code-symbol));
    }
    .hljs-built_in {
        color: rgb(var(--lux-code-built-in));
    }
    .hljs-meta {
        color: rgb(var(--lux-code-meta));
    }
    .hljs-section {
        color: rgb(var(--lux-code-section));
        font-weight: 700;
    }
    .hljs-bullet {
        color: rgb(var(--lux-code-bullet));
    }
    .hljs-operator {
        color: rgb(var(--lux-code-operator));
    }
    .hljs-punctuation {
        color: rgb(var(--lux-code-punctuation));
    }
    .hljs-subst {
        color: rgb(var(--lux-code-text));
    }
    .hljs-addition {
        color: rgb(var(--lux-code-addition));
    }
    .hljs-deletion {
        color: rgb(var(--lux-code-deletion));
    }
    .hljs-emphasis {
        font-style: italic;
    }
    .hljs-strong {
        font-weight: 700;
    }

    .copied {
        color: rgb(var(--lux-success, 34 197 94)) !important;
    }
`;

const COPY_SVG = html`<span class="icon-svg" style="width:14px;height:14px;fill:currentColor"
    ><svg viewBox="0 0 24 24">
        <path
            d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
        /></svg
></span>`;

class LuxCode extends LuxElement {
    static styles = styles;

    static properties = {
        code: { type: String },
        language: { type: String, reflect: true },
        showHeader: { type: Boolean, attribute: 'show-header', reflect: true },
        showLanguage: { type: Boolean, attribute: 'show-language', reflect: true },
        showCopy: { type: Boolean, attribute: 'show-copy', reflect: true },
    };

    constructor() {
        super();
        this.code = this.code || '';
        this.language = this.language || '';
        this.showHeader = this.showHeader ?? false;
        this.showLanguage = this.showLanguage ?? true;
        this.showCopy = this.showCopy ?? true;
    }

    updated() {
        this._highlight();
        this._checkHeight();
    }

    _checkHeight() {
        const host = this.shadowRoot.host;
        const style = host.getAttribute('style') || '';
        const hasHeight = /height\s*:/i.test(style);
        host.classList.toggle('has-fixed-height', hasHeight);
    }

    _highlight() {
        const codeEl = this.renderRoot.querySelector('code');
        if (!codeEl || !this.code) return;

        codeEl.textContent = this.code;

        const hljs = window.hljs;
        if (hljs) {
            const lang = String(this.language || '');
            if (lang) {
                codeEl.className = `language-${lang}`;
            }
            try {
                hljs.highlightElement(codeEl);
            } catch (e) {
                // ignore
            }
        }
    }

    async _copy() {
        try {
            await navigator.clipboard.writeText(this.code);
            const btns = this.renderRoot.querySelectorAll('.copy-btn, .copy-float');
            btns.forEach((btn) => {
                btn.classList.add('copied');
                setTimeout(() => btn.classList.remove('copied'), 2000);
            });
            this.emit('copy', { code: this.code });
        } catch {
            // clipboard API not available
        }
    }

    render() {
        return html`
            <div class=${classMap({ header: true, hidden: !this.showHeader })}>
                <div class="dots">
                    <span class="dot dot-red"></span>
                    <span class="dot dot-yellow"></span>
                    <span class="dot dot-green"></span>
                </div>
                <div class="header-right">
                    ${this.showLanguage ? html`<span class="lang-label">${this.language || 'text'}</span>` : ''}
                    ${this.showCopy ? html`<button class="copy-btn" @click=${() => this._copy()}>${COPY_SVG}</button>` : ''}
                </div>
            </div>
            ${!this.showHeader && this.showCopy ? html`<button class="copy-float" @click=${() => this._copy()}>${COPY_SVG}</button>` : ''}
            <div class="code-body">
                <pre><code></code></pre>
            </div>
        `;
    }
}

registerComponent('lux-code', LuxCode);
export default LuxCode;
