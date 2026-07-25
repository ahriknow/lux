import { html, css, LuxElement } from '../../lux.min.js';
import { msg, createI18n, getLocale } from '../../lux.min.js';
import '../../complib/lux-layout.min.js';
import '../../complib/lux-switch.min.js';
import '../../complib/lux-dropdown.min.js';
import '../../complib/lux-scroll.min.js';
import '../../complib/lux-menu.min.js';
import messages from '../../i18n/messages.js';

const i18n = createI18n({ locale: 'zh-CN', messages });

const styles = css`
    :host {
        display: block;
        height: 100vh;
    }
    :host *,
    :host *::before,
    :host *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    .aside-inner {
        padding: 16px;
    }
    .aside-brand {
        padding: 0 16px 16px;
        border-bottom: 1px solid rgb(var(--lux-border));
        display: block;
        text-decoration: none;
    }
    .aside-brand:hover {
        text-decoration: none;
    }

    .main-scroll {
        height: 100%;
    }
    .page-inner {
        padding: 32px 40px 80px;
        max-width: 880px;
        margin: 0 auto;
    }

    .header-inner {
        padding: 15px 24px;
        height: 100%;
        display: flex;
        align-items: center;
        gap: 20px;
        border-bottom: 1px solid rgb(var(--lux-border));
        font-size: 14px;
        color: rgb(var(--lux-text-secondary));
    }
    .header-inner a {
        color: rgb(var(--lux-text-secondary));
        text-decoration: none;
        font-size: 14px;
    }
    .header-inner a:hover {
        color: rgb(var(--lux-text));
    }

    .theme-toggle {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: rgb(var(--lux-text-secondary));
    }

    .footer-inner {
        padding: 10px 24px;
        font-size: 13px;
        color: rgb(var(--lux-text-muted));
        border-top: 1px solid rgb(var(--lux-border));
    }
`;

const DARK_LINK_ID = 'lux-dark-css';

function loadTheme() {
    const dark = localStorage.getItem('lux-theme') === 'dark';
    applyTheme(dark);
    return dark;
}

function applyTheme(dark) {
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

class PageComponents extends LuxElement {
    static styles = styles;

    constructor() {
        super();
        this._dark = loadTheme();
        const saved = localStorage.getItem('lux-lang');
        if (saved) i18n.setLocale(saved);
    }

    _getMenuItems() {
        return [
            { key: 'intro', label: 'Intro', icon: 'bookmark' },
            { key: 'divider1', divider: true },
            { key: 'layout', label: 'Layout', icon: 'view_quilt' },
            { key: 'menu', label: 'Menu', icon: 'menu' },
            { key: 'scroll', label: 'Scroll', icon: 'swap_vert' },
            { key: 'example', label: 'Example', icon: 'visibility' },
            { key: 'divider1', divider: true },
            { key: 'button', label: 'Button', icon: 'smart_button' },
            { key: 'input', label: 'Input', icon: 'edit' },
            { key: 'switch', label: 'Switch', icon: 'toggle_on' },
            { key: 'dropdown', label: 'Dropdown', icon: 'arrow_down' },
            { key: 'icon', label: 'Icon', icon: 'star' },
            { key: 'divider1', divider: true },
            { key: 'table', label: 'Table', icon: 'table_chart' },
            { key: 'code', label: 'Code', icon: 'code' },
        ];
    }

    connectedCallback() {
        super.connectedCallback();
        this._onHash = () => {
            const menu = this.renderRoot.querySelector('#aside-menu');
            if (menu) menu.activeKey = this._getActiveKey();
        };
        window.addEventListener('hashchange', this._onHash);
    }

    disconnectedCallback() {
        window.removeEventListener('hashchange', this._onHash);
    }

    firstUpdated() {
        const dd = this.renderRoot.querySelector('#lang-dd');
        if (dd) {
            dd.placeholder = msg('nav.lang');
            dd.value = localStorage.getItem('lux-lang') || 'zh-CN';
        }
        const sw = this.renderRoot.querySelector('lux-switch');
        if (sw) sw.checked = this._dark;
        const menu = this.renderRoot.querySelector('#aside-menu');
        if (menu) {
            menu.items = this._getMenuItems();
            menu.activeKey = this._getActiveKey();
            menu.addEventListener('select', (e) => this._onMenuSelect(e));
        }
    }

    _getActiveKey() {
        const path = location.hash.slice(1) || '/';
        const match = path.match(/\/components\/(\w+)/);
        return match ? match[1] : '';
    }

    _onMenuSelect(e) {
        const key = e.detail.key;
        location.hash = '#/components/' + key;
    }

    _toggleTheme(e) {
        this._dark = e.detail.checked;
        applyTheme(this._dark);
    }

    _onLangChange(e) {
        const locale = e.detail.value;
        i18n.setLocale(locale);
        localStorage.setItem('lux-lang', locale);
        location.reload();
    }

    _onLangClear(e) {
        i18n.setLocale('zh-CN');
        localStorage.removeItem('lux-lang');
        location.reload();
    }

    render() {
        return html`
            <lux-layout aside-width="200px" aside-min="160px" aside-max="320px">
                <div slot="aside" class="aside-inner">
                    <a href="#/home" class="aside-brand"
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
                    <lux-menu
                        .collapse-width=${200}
                        id="aside-menu"
                        .items=${this._getMenuItems()}
                        active-key=${this._getActiveKey()}
                    ></lux-menu>
                </div>

                <div slot="header" class="header-inner">
                    <a href="https://github.com/ahriknow/lux" target="_blank" title="GitHub"
                        ><lux-icon .name=${'github'} size="20px"></lux-icon
                    ></a>
                    <a
                        href="https://www.npmjs.com/package/@ahriknow/lux"
                        target="_blank"
                        title="npm"
                        ><lux-icon .name=${'npm'} size="20px"></lux-icon
                    ></a>
                    <div class="theme-toggle">
                        <lux-dropdown
                            id="lang-dd"
                            .placeholder=${msg('nav.lang')}
                            .options=${[
                  { value: 'zh-CN', label: msg('nav.lang.zh') },
                  { value: 'ru', label: msg('nav.lang.ru') },
                  { value: 'en', label: msg('nav.lang.en') },
              ]}
                            clearable
                            @change=${(e) => this._onLangChange(e)}
                            @clear=${(e) => this._onLangClear(e)}
                        ></lux-dropdown>
                        <span>${this._dark ? msg('nav.light') : msg('nav.dark')}</span>
                        <lux-switch
                            .checked=${this._dark}
                            @change=${(e) => this._toggleTheme(e)}
                        ></lux-switch>
                    </div>
                </div>

                <lux-scroll class="main-scroll" slot="main">
                    <div class="page-inner">
                        <router-outlet level="1"></router-outlet>
                    </div>
                </lux-scroll>

                <div slot="footer" class="footer-inner">
                    ${msg('footer.license')}
                    <a href="https://github.com/ahriknow" target="_blank">ahriknow</a>.
                </div>
            </lux-layout>
        `;
    }
}

export default PageComponents;
