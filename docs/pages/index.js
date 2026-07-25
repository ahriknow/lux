import { html, css, LuxElement, msg, createI18n } from '../lux.min.js';
import '../complib/lux-icon.min.js';
import '../complib/lux-dropdown.min.js';
import '../complib/lux-scroll.min.js';
import messages from '../i18n/messages.js';

const DARK_LINK_ID = 'lux-dark-css';

function loadTheme() {
    const dark = localStorage.getItem('lux-theme') === 'dark';
    applyTheme(dark);
    return dark;
}

function applyTheme(dark) {
    // Lux theme
    let link = document.getElementById(DARK_LINK_ID);
    if (dark) {
        if (!link) {
            link = document.createElement('link');
            link.id = DARK_LINK_ID;
            link.rel = 'stylesheet';
            link.href = './themes/dark.css';
            document.head.appendChild(link);
        }
    } else {
        if (link) link.remove();
    }
}

const i18n = createI18n({ locale: 'zh-CN', messages });

const styles = css`
    :host {
        display: block;
        height: 100vh;
    }
    .root {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .topnav {
        flex-shrink: 0;
        height: var(--nav-h);
        background: var(--lux-nav-bg);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgb(var(--lux-border));
        z-index: 200;
    }
    .topnav-inner {
        max-width: 1100px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0 24px;
    }
    .topnav-brand {
        display: flex;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
    }
    .topnav-links {
        display: flex;
        gap: 4px;
        margin-left: 32px;
    }
    .topnav-links a {
        padding: 6px 14px;
        font-size: 14px;
        color: rgb(var(--lux-text-secondary));
        border-radius: 6px;
        transition: all 0.15s;
        text-decoration: none;
    }
    .topnav-links a:hover {
        color: rgb(var(--lux-text));
        background: rgb(var(--lux-hover));
    }
    .topnav-links a.active {
        color: rgb(var(--lux-primary-400));
        background: rgb(var(--lux-primary-400) / 10%);
    }
    .topnav-right {
        margin-left: auto;
        display: flex;
        gap: 16px;
        align-items: center;
    }
    .topnav-right a {
        color: rgb(var(--lux-text-secondary));
        font-size: 14px;
        transition: color 0.2s;
        text-decoration: none;
    }
    .topnav-right a:hover {
        color: rgb(var(--lux-text));
    }
    .theme-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 6px;
        background: transparent;
        color: rgb(var(--lux-text-secondary));
        cursor: pointer;
        transition: all 0.2s;
    }
    .theme-btn:hover {
        background: rgb(var(--lux-hover));
        color: rgb(var(--lux-text));
    }
    .content-wrap {
        flex: 1;
        min-height: 0;
    }
    .content-inner {
        padding: 40px 48px 80px;
        max-width: 880px;
        margin: 0 auto;
    }
`;

class IndexLayout extends LuxElement {
    static styles = styles;

    constructor() {
        super();
        this._dark = loadTheme();
        const saved = localStorage.getItem('lux-lang');
        if (saved) i18n.setLocale(saved);
    }

    connectedCallback() {
        super.connectedCallback();
        this._onHash = () => this._updateNav();
        window.addEventListener('hashchange', this._onHash);
    }

    disconnectedCallback() {
        window.removeEventListener('hashchange', this._onHash);
    }

    firstUpdated() {
        this._updateNav();
        const dd = this.renderRoot.querySelector('#lang-dd');
        if (dd) {
            dd.placeholder = msg('nav.lang');
            dd.value = localStorage.getItem('lux-lang') || 'zh-CN';
        }
    }

    _updateNav() {
        const path = location.hash.slice(1) || '/';
        this.renderRoot.querySelectorAll('.topnav-links a').forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + path);
        });
    }

    _toggleTheme() {
        this._dark = !this._dark;
        applyTheme(this._dark);
    }

    _onLangChange(e) {
        const locale = e.detail.value;
        i18n.setLocale(locale);
        localStorage.setItem('lux-lang', locale);
        location.reload();
    }

    render() {
        return html`
            <div class="root">
                <header class="topnav">
                    <div class="topnav-inner">
                        <a class="topnav-brand" href="#/home"
                            ><img
                                src="favicon.svg"
                                alt="Lux"
                                height="28"
                                style="vertical-align:middle"
                            />
                            <span
                                style="font-size:20px;font-weight:700;letter-spacing:-0.5px;color:rgb(var(--lux-text));vertical-align:middle"
                                ><span style="color:rgb(var(--lux-primary-400))">L</span>ux</span
                            ></a
                        >
                        <nav class="topnav-links">
                            <a href="#/home">${msg('nav.home')}</a>
                            <a href="#/guide">${msg('nav.guide')}</a>
                            <a href="#/api">${msg('nav.api')}</a>
                            <a href="#/examples">${msg('nav.examples')}</a>
                            <a href="#/router">${msg('nav.router')}</a>
                            <a href="#/i18n">${msg('nav.i18n')}</a>
                            <a href="#/components">${msg('nav.components')}</a>
                        </nav>
                        <div class="topnav-right">
                            <a href="https://github.com/ahriknow/lux" target="_blank" title="GitHub"
                                ><lux-icon .name=${'github'} size="20px"></lux-icon
                            ></a>
                            <a
                                href="https://www.npmjs.com/package/@ahriknow/lux"
                                target="_blank"
                                title="npm"
                                ><lux-icon .name=${'npm'} size="20px"></lux-icon
                            ></a>
                            <lux-dropdown
                                id="lang-dd"
                                style="width:100px"
                                .placeholder=${msg('nav.lang')}
                                .options=${[
                    { value: 'zh-CN', label: '简体中文' },
                    { value: 'ru', label: 'Русский' },
                    { value: 'en', label: 'English' },
                ]}
                                @change=${(e) => this._onLangChange(e)}
                            ></lux-dropdown>
                            <button class="theme-btn" @click=${() => this._toggleTheme()}>
                                <lux-icon
                                    .name=${this._dark ? 'light_mode' : 'dark_mode'}
                                    size="18px"
                                ></lux-icon>
                            </button>
                        </div>
                    </div>
                </header>

                <lux-scroll class="content-wrap">
                    <div class="content-inner">
                        <router-outlet level="1"></router-outlet>
                    </div>
                </lux-scroll>
            </div>
        `;
    }
}

export default IndexLayout;
