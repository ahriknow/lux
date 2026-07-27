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
        transition: background 0.15s;
    }
    .theme-btn:hover {
        background: rgb(var(--lux-hover));
        color: rgb(var(--lux-text));
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
            { key: 'divider2', divider: true },
            { key: 'button', label: 'Button', icon: 'smart_button' },
            { key: 'input', label: 'Input', icon: 'edit' },
            { key: 'radio', label: 'Radio', icon: 'check_circle' },
            { key: 'switch', label: 'Switch', icon: 'toggle_on' },
            { key: 'select', label: 'Select', icon: 'list' },
            { key: 'dropdown', label: 'Dropdown', icon: 'arrow_down' },
            { key: 'item-group', label: 'Item Group', icon: 'view_module' },
            { key: 'icon', label: 'Icon', icon: 'star' },
            { key: 'divider3', divider: true },
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

    _cycleLang() {
        const langs = ['zh-CN', 'ru', 'en'];
        const current = localStorage.getItem('lux-lang') || 'zh-CN';
        const idx = langs.indexOf(current);
        const next = langs[(idx + 1) % langs.length];
        i18n.setLocale(next);
        localStorage.setItem('lux-lang', next);
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
                            ghost
                            .options=${[
                                { value: 'zh-CN', label: msg('nav.lang.zh') },
                                { value: 'ru', label: msg('nav.lang.ru') },
                                { value: 'en', label: msg('nav.lang.en') },
                            ]}
                            @change=${this._onLangChange.bind(this)}
                        >
                            <span
                                slot="trigger"
                                .title=${msg('nav.lang')}
                                style="display:inline-flex;align-items:center;cursor:pointer;color:rgb(var(--lux-text-secondary))"
                                ><svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 1024 1024"
                                    fill="currentColor"
                                >
                                    <path
                                        d="M640 416h256c35.328 0 64 28.4672 64 64V896c0 35.328-28.4672 64-64 64H480c-35.328 0-64-28.4672-64-64v-256h128c53.2992 0 96-43.008 96-96v-128zM64 128c0-35.328 28.4672-64 64-64h416c35.328 0 64 28.4672 64 64v416c0 35.328-28.4672 64-64 64H128c-35.328 0-64-28.4672-64-64V128z m128 276.2752h46.6944v-24.7808H306.176v118.272h49.5104v-118.272h68.7616v20.6336h50.8928V243.3536H355.6352v-34.3552c0-10.0864 1.3824-18.7904 4.096-26.112a10.5472 10.5472 0 0 0 1.3824-4.1472c0-0.9216-3.1744-1.792-9.5744-2.7648H304.64v67.3792H192v160.9216z m46.6944-122.368H306.176v60.416H238.7456v-60.416z m185.7024 60.416H355.6352v-60.416h68.7616v60.4672z m203.8272 488.0384l19.2512-53.6064h100.352l19.3024 53.6064h54.9888L732.672 576H668.16l-92.1088 254.4128h52.224z m33.024-96.256l37.12-108.5952h1.3824l34.3552 108.5952h-72.8576zM896 320h-64a128 128 0 0 0-128-128V128a192 192 0 0 1 192 192z m-768 384h64a128 128 0 0 0 128 128v64a192 192 0 0 1-192-192z"
                                    /></svg
                            ></span>
                        </lux-dropdown>
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
