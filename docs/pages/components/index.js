import { html, css, LuxElement } from '../../lux.min.js';
import { msg, createI18n, getLocale } from '../../lux.min.js';
import '../../complib/lux-layout.min.js';
import '../../complib/lux-switch.min.js';
import '../../complib/lux-dropdown.min.js';
import '../../complib/lux-scroll.min.js';
import '../../complib/lux-menu.min.js';
import '../../complib/lux-icon.min.js';
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
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 16px;
    }
    .aside-menu-scroll {
        flex: 1;
        min-height: 0;
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
    localStorage.setItem('lux-theme', dark ? 'dark' : 'light');
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
            { key: 'intro', label: msg('sidebar.intro'), icon: 'bookmark' },
            { key: 'divider1', divider: true },
            { key: 'layout', label: msg('sidebar.layout'), icon: 'view_quilt' },
            { key: 'menu', label: msg('sidebar.menu'), icon: 'menu' },
            { key: 'scroll', label: msg('sidebar.scroll'), icon: 'swap_vert' },
            { key: 'example', label: msg('sidebar.example'), icon: 'visibility' },
            { key: 'divider2', divider: true },
            { key: 'button', label: msg('sidebar.button'), icon: 'smart_button' },
            { key: 'input', label: msg('sidebar.input'), icon: 'edit' },
            { key: 'textarea', label: msg('sidebar.textarea'), icon: 'subject' },
            { key: 'radio', label: msg('sidebar.radio'), icon: 'check_circle' },
            { key: 'switch', label: msg('sidebar.switch'), icon: 'toggle_on' },
            { key: 'select', label: msg('sidebar.select'), icon: 'list' },
            { key: 'dropdown', label: msg('sidebar.dropdown'), icon: 'arrow_down' },
            { key: 'item-group', label: msg('sidebar.itemGroup'), icon: 'view_module' },
            { key: 'icon', label: msg('sidebar.icon'), icon: 'star' },
            { key: 'divider3', divider: true },
            { key: 'timeline', label: msg('sidebar.timeline'), icon: 'timeline' },
            { key: 'modal', label: msg('sidebar.modal'), icon: 'open_in_full' },
            { key: 'upload', label: msg('sidebar.upload'), icon: 'upload' },
            { key: 'color-picker', label: msg('sidebar.colorPicker'), icon: 'palette' },
            { key: 'date-picker', label: msg('sidebar.datePicker'), icon: 'calendar' },
            { key: 'collapse', label: msg('sidebar.collapse'), icon: 'expand_more' },
            { key: 'tree', label: msg('sidebar.tree'), icon: 'account_tree' },
            { key: 'table', label: msg('sidebar.table'), icon: 'table_chart' },
            { key: 'pagination', label: msg('sidebar.pagination'), icon: 'pagination' },
            { key: 'code', label: msg('sidebar.code'), icon: 'code' },
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
        const match = path.match(/\/components\/([\w-]+)/);
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
                    <lux-scroll class="aside-menu-scroll" height="100%">
                        <lux-menu
                            .collapse-width=${200}
                            id="aside-menu"
                            .items=${this._getMenuItems()}
                            active-key=${this._getActiveKey()}
                        ></lux-menu>
                    </lux-scroll>
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
                                ><lux-icon name="language" size="20px"></lux-icon
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
