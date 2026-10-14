import { html, css, LuxElement, registerComponent, classMap, repeat, when } from '../../index.js';

const ARROW_SVG = html`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
</svg>`;
const CLEAR_SVG = html`<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
    />
</svg>`;

const styles = css`
    :host {
        display: inline-flex;
        align-items: stretch;
        position: relative;
        vertical-align: middle;
    }
    .trigger {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        padding: 8px 12px;
        border: 1px solid rgb(var(--lux-border, 51 65 85));
        border-radius: var(--lux-radius, 6px);
        background: rgb(var(--lux-card, 30 41 59));
        color: rgb(var(--lux-text, 241 245 249));
        font-size: 13px;
        /* 与 lux-input 同高：Chrome 对 input 的内容盒用字体 metrics（13px→16px），
           这里显式给同行高，否则 select 比 input 矮 3px */
        line-height: 16px;
        /* 空值时文本 span 高 0，只剩箭头盒(1em)撑高会塌 3px——min-height 锁死与 input 等高 */
        min-height: 34px;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        box-sizing: border-box;
    }
    .trigger:hover {
        border-color: rgb(var(--lux-primary-500, 99 91 218));
        background: rgb(var(--lux-hover, 255 255 255 / 5%));
    }
    .placeholder {
        color: rgb(var(--lux-text-muted, 100 116 139));
    }
    .end-icons {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 18px;
        /* 1em 对齐文本行高，18px 固定高会把 trigger 撑得比 input 高 */
        height: 1em;
        flex-shrink: 0;
        margin-left: auto;
    }
    .arrow,
    .clear {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: opacity 150ms ease;
    }
    .arrow {
        color: rgb(var(--lux-text-secondary, 148 163 184));
        transition:
            transform 150ms ease,
            opacity 150ms ease;
    }
    :host([open]) .arrow {
        transform: rotate(180deg);
    }
    .clear {
        display: none;
        cursor: pointer;
        color: rgb(var(--lux-text-secondary, 148 163 184));
        z-index: 1;
    }
    .clear:hover {
        color: rgb(var(--lux-text, 241 245 249));
    }
    :host([clearable][has-value]:hover) .clear {
        display: inline-flex;
    }
    :host([clearable][has-value]:hover) .arrow {
        opacity: 0;
        pointer-events: none;
    }
    .menu {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        min-width: 100%;
        max-height: 200px;
        overflow-y: auto;
        background: rgb(var(--lux-card, 30 41 59));
        border: 1px solid rgb(var(--lux-border, 51 65 85));
        border-radius: var(--lux-radius, 6px);
        box-shadow: 0 4px 12px rgb(0 0 0 / 30%);
        z-index: 1000;
        padding: 4px 0;
        display: none;
    }
    :host([open]) .menu {
        display: block;
    }
    .opt-slot {
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }
    .item {
        display: block;
        padding: 7px 12px;
        font-size: 13px;
        color: rgb(var(--lux-text, 241 245 249));
        cursor: pointer;
        white-space: nowrap;
        user-select: none;
    }
    .item:hover {
        background: rgb(var(--lux-hover, 255 255 255 / 5%));
    }
    .item.active {
        color: rgb(var(--lux-primary-400, 129 113 234));
    }

    /* ── fetch 搜索模式：trigger 内嵌可输入框 ── */
    .search-input {
        flex: 1;
        min-width: 0;
        border: none;
        outline: none;
        background: transparent;
        color: inherit;
        font: inherit;
        font-size: inherit;
        line-height: 16px;
        padding: 0;
        cursor: text;
        text-overflow: ellipsis;
    }
    .search-input::placeholder {
        color: rgb(var(--lux-text-muted, 100 116 139));
    }
    .search-input:disabled {
        cursor: not-allowed;
    }
    /* 菜单内的异步状态行 */
    .menu-state {
        padding: 9px 12px;
        font-size: 12px;
        text-align: center;
        color: rgb(var(--lux-text-muted, 100 116 139));
        white-space: nowrap;
    }

    :host([disabled]) .trigger {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }

    /* Size: sm */
    :host([size='sm']) .trigger {
        padding: 7px 8px;
        font-size: 12px;
        line-height: 15px;
        min-height: 31px;
        gap: 4px;
    }
    :host([size='sm']) .item {
        padding: 5px 10px;
        font-size: 12px;
    }
    :host([size='sm']) .end-icons {
        width: 14px;
        height: 1em;
    }

    /* Size: lg */
    :host([size='lg']) .trigger {
        padding: 12px 16px;
        font-size: 15px;
        line-height: 19px;
        min-height: 45px;
        gap: 8px;
    }
    :host([size='lg']) .item {
        padding: 10px 16px;
        font-size: 15px;
    }
    :host([size='lg']) .end-icons {
        width: 22px;
        height: 1em;
    }
`;

class LuxSelect extends LuxElement {
    static styles = styles;

    static properties = {
        options: { type: Array, attribute: false },
        value: { type: String, reflect: true },
        placeholder: { type: String, reflect: true },
        open: { type: Boolean, reflect: true },
        clearable: { type: Boolean, reflect: true },
        disabled: { type: Boolean, reflect: true },
        size: { type: String, reflect: true },
        /// 远程搜索：传入后 select 变为可输入的 combobox，
        /// `fetch(keyword) => options[]`，输入按 `fetchDelay` 防抖节流调用
        fetch: { type: Function, attribute: false },
        /// fetch 防抖间隔（毫秒），默认 300
        fetchDelay: { type: Number, attribute: 'fetch-delay' },
        /// 自定义下拉项渲染：`(option, selected) => string | Node | TemplateResult`
        itemRender: { type: Function, attribute: false },
        /// 本地搜索：输入即时过滤静态 options（无需后端；与 fetch 互斥使用）
        searchable: { type: Boolean, reflect: true },
        // ── fetch 模式的内部状态（声明为 property 以触发渲染）──
        searchOptions: { type: Array, attribute: false },
        searching: { type: Boolean, attribute: false },
        searchError: { type: Boolean, attribute: false },
        keyword: { type: String, attribute: false },
        editing: { type: Boolean, attribute: false },
    };

    constructor() {
        super();
        this.options = [];
        this.placeholder = '';
        this.value = '';
        this.clearable = false;
        this.disabled = false;
        this.fetch = null;
        this.fetchDelay = 300;
        this.itemRender = null;
        this.searchable = false;
        this.searchOptions = [];
        this.searching = false;
        this.searchError = false;
        this.keyword = '';
        this.editing = false;
        this._fetchSeq = 0;
        this._fetchTimer = null;
        this._fetchInited = false;
        this._onDocClickBound = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this._bindDocClick();
    }

    _bindDocClick() {
        if (this._onDocClickBound) return;
        this._onDocClick = this._onDocClick.bind(this);
        document.addEventListener('click', this._onDocClick, true);
        this._onDocClickBound = true;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this._onDocClick, true);
        this._onDocClickBound = false;
        this._unbindMenuRepos();
        if (this._fetchTimer) {
            clearTimeout(this._fetchTimer);
            this._fetchTimer = null;
        }
    }

    updated() {
        if (this.value) {
            this.setAttribute('has-value', '');
        } else {
            this.removeAttribute('has-value');
        }
        if (this.open) {
            this._bindMenuRepos();
            this._positionMenu();
        } else {
            this._unbindMenuRepos();
        }
    }

    /** 菜单用视口坐标（fixed）定位：absolute 会被 modal body 等 overflow 祖先裁剪并撑出滚动条 */
    _positionMenu() {
        const menu = this.shadowRoot?.querySelector('.menu');
        if (!menu || !this.open) return;
        const r = this.getBoundingClientRect();
        if (!r.width && !r.height) return;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        menu.style.position = 'fixed';
        menu.style.minWidth = `${Math.round(r.width)}px`;
        menu.style.maxHeight = '';
        menu.style.top = '0px';
        menu.style.left = '0px';
        const nat = menu.offsetHeight;
        const below = vh - r.bottom - 12;
        const above = r.top - 12;
        let top;
        if (nat <= below || below >= above) {
            const h = Math.min(nat, Math.max(40, below - 4));
            menu.style.maxHeight = `${h}px`;
            top = r.bottom + 4;
        } else {
            const h = Math.min(nat, Math.max(40, above - 6));
            menu.style.maxHeight = `${h}px`;
            top = r.top - 6 - h;
        }
        let left = r.left;
        const mw = menu.offsetWidth;
        if (left + mw > vw - 8) left = Math.max(8, vw - 8 - mw);
        menu.style.left = `${Math.round(left)}px`;
        menu.style.top = `${Math.round(Math.max(8, top))}px`;
    }

    _bindMenuRepos() {
        if (this._reposBound) return;
        this._onRepos = () => this._positionMenu();
        window.addEventListener('resize', this._onRepos);
        document.addEventListener('scroll', this._onRepos, true);
        this._reposBound = true;
    }

    _unbindMenuRepos() {
        if (!this._reposBound) return;
        window.removeEventListener('resize', this._onRepos);
        document.removeEventListener('scroll', this._onRepos, true);
        this._reposBound = false;
    }

    /** 是否 fetch 远程搜索模式 */
    get _fetchMode() {
        return typeof this.fetch === 'function';
    }

    /** 当前菜单数据源：fetch → 搜索结果；searchable → 按关键字过滤静态 options；否则静态 options */
    _menuOptions() {
        const base = Array.isArray(this.options) ? this.options : [];
        if (this._fetchMode) return Array.isArray(this.searchOptions) ? this.searchOptions : [];
        if (this.searchable) {
            const kw = String(this.keyword ?? '').trim().toLowerCase();
            if (!kw) return base;
            return base.filter(
                (o) =>
                    String(o.label ?? o.value).toLowerCase().includes(kw) ||
                    String(o.value).toLowerCase().includes(kw)
            );
        }
        return base;
    }

    _onDocClick(e) {
        // e.target 跨 shadow 边界会被 retarget 成外层宿主（如页面组件），
        // contains() 会把组件内点击误判为外部点击而关掉菜单；
        // composedPath() 返回真实事件路径（含 shadow 内节点），以它判断归属
        if (!e.composedPath().includes(this)) {
            this.open = false;
        }
    }

    _toggle() {
        if (this.disabled) return;
        this.open = !this.open;
        if (this.open && this._fetchMode) this._ensureFetched();
    }

    /** 首次打开拉取一轮空关键字数据（之后由输入驱动） */
    _ensureFetched() {
        if (this._fetchMode && !this._fetchInited) {
            this._fetchInited = true;
            this._runFetch('');
        }
    }

    /** 输入防抖（节流）：停顿 fetchDelay 毫秒后才发一次请求 */
    _scheduleFetch() {
        if (!this._fetchMode) return;
        if (this._fetchTimer) clearTimeout(this._fetchTimer);
        this._fetchTimer = setTimeout(() => {
            this._fetchTimer = null;
            this._runFetch(String(this.keyword ?? '').trim());
        }, this.fetchDelay || 300);
    }

    /** 执行一次搜索；seq 竞态保护——过期响应直接丢弃 */
    async _runFetch(kw) {
        if (!this._fetchMode) return;
        const seq = ++this._fetchSeq;
        this.searching = true;
        this.searchError = false;
        try {
            const res = await this.fetch(kw);
            if (seq !== this._fetchSeq) return; // 过期
            this.searchOptions = Array.isArray(res) ? res : [];
        } catch (e) {
            if (seq === this._fetchSeq) {
                this.searchError = true;
                this.searchOptions = [];
            }
        } finally {
            if (seq === this._fetchSeq) this.searching = false;
        }
    }

    _onSearchInput(e) {
        e.stopPropagation();
        this.keyword = e.target.value;
        this.editing = true;
        if (!this.open) this.open = true;
        this._scheduleFetch();
    }

    _onSearchFocus(e) {
        if (this.disabled) return;
        e.target.select(); // 开始输入即覆盖当前值
        if (!this.open) {
            this.open = true;
            this._ensureFetched();
        }
    }

    _onSearchBlur() {
        // 失焦：回到已选 label（render 回写 input.value），并清空关键字让菜单恢复全量
        this.editing = false;
        this.keyword = '';
    }

    _onSearchKeydown(e) {
        if (e.key === 'Escape') {
            this.open = false;
            e.target.blur();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const opts = this._menuOptions();
            if (this.open && opts.length) this._select(opts[0]);
        }
    }

    _clear() {
        this.value = '';
        this.keyword = '';
        this.editing = false;
        if (this._fetchMode) {
            this.searchOptions = [];
            this._fetchInited = false; // 下次打开重新拉取
        }
        this.emit('clear');
    }

    _select(opt) {
        this.value = String(opt.value);
        this.open = false;
        this.editing = false;
        this.keyword = '';
        this.emit('change', { value: opt.value, label: opt.label ?? opt.value, option: opt });
    }

    /** trigger 展示文本（fetch 模式下也供 input 回写） */
    _displayText(opts, matched) {
        if (matched) return matched.label ?? matched.value;
        if (this._fetchMode) return this.value ? String(this.value) : '';
        return '';
    }

    render() {
        const opts = this._menuOptions(); // 展示源（searchable 可能已过滤）
        const isFetch = this._fetchMode;
        const searchActive = isFetch || this.searchable;
        // 已选 label 从全量里找（过滤不影响回显）
        const matchPool = isFetch ? opts : Array.isArray(this.options) ? this.options : [];
        const matched = matchPool.find((o) => String(o.value) === String(this.value));
        const text = this._displayText(opts, matched);
        const ph = this.placeholder;
        const isPh = !text && !!ph;
        // 选中项带 color（hex 或语义名）时，trigger 文字同色（与 option-slot 色块呼应）
        const tone = matched && matched.color ? `color:${matched.color}` : '';

        const triggerBody = searchActive
            ? html`<input
                  class="search-input"
                  .value=${this.editing ? this.keyword : text}
                  .placeholder=${ph}
                  .style=${tone}
                  ?disabled=${this.disabled}
                  @input=${(e) => this._onSearchInput(e)}
                  @focus=${(e) => this._onSearchFocus(e)}
                  @blur=${() => this._onSearchBlur()}
                  @keydown=${(e) => this._onSearchKeydown(e)}
                  @click=${(e) => e.stopPropagation()}
              />`
            : html`<span class=${classMap({ placeholder: isPh })} .style=${tone}>${text || ph}</span>`;

        return html`
            <div class="trigger" @click=${() => this._toggle()}>
                ${triggerBody}
                <span class="end-icons">
                    <span
                        class=${classMap({ clear: true })}
                        @click=${(e) => {
                            e.stopPropagation();
                            this._clear();
                        }}
                        >${CLEAR_SVG}</span
                    >
                    <span class="arrow">${ARROW_SVG}</span>
                </span>
            </div>
            <div class="menu">
                ${when(
                    isFetch && this.searching,
                    () => html`<div class="menu-state">搜索中…</div>`
                )}
                ${when(
                    isFetch && this.searchError,
                    () => html`<div class="menu-state">搜索失败，请重试</div>`
                )}
                ${when(
                    searchActive && !this.searching && !this.searchError && opts.length === 0,
                    () => html`<div class="menu-state">无匹配数据</div>`
                )}
                ${repeat(
                    opts,
                    (opt) => opt.value,
                    (opt) => {
                        const selected = String(opt.value) === String(this.value);
                        const custom = this.itemRender ? this.itemRender(opt, selected) : null;
                        const tpl = this._optionTemplate();
                        const body = custom != null
                            ? custom
                            : tpl
                              ? html`<span class="opt-slot" ref=${(el) => this._fillOptionTemplate(el, opt)}></span>`
                              : (opt.label ?? opt.value);
                        return html`
                            <div
                                class=${classMap({ item: true, active: selected })}
                                @click=${() => this._select(opt)}
                            >
                                ${body}
                            </div>
                        `;
                    }
                )}
            </div>
        `;
    }

    /** light DOM 插槽模板：<template slot="option">（可省略 slot 属性） */
    _optionTemplate() {
        return this.querySelector(':scope > template[slot="option"], :scope > template');
    }

    /**
     * 用插槽模板渲染一个选项：克隆模板，`data-field="字段名"` 的元素填 opt[field]；
     * 字段名 color/background 时填 background 色（选项色块场景），其余填 textContent。
     */
    _fillOptionTemplate(host, opt) {
        const tpl = this._optionTemplate();
        if (!tpl) return;
        host.textContent = '';
        const frag = tpl.content.cloneNode(true);
        const fill = (node) => {
            const f = node.getAttribute('data-field');
            if (!f) return;
            const v = opt[f];
            if (f === 'color' || f === 'background') {
                if (v == null || v === '') { node.style.display = 'none'; }
                else { node.style.display = ''; node.style.background = String(v); }
            } else node.textContent = v == null ? '' : String(v);
        };
        const root = frag.firstElementChild;
        if (root) fill(root);
        frag.querySelectorAll('[data-field]').forEach(fill);
        host.appendChild(frag);
    }
}

registerComponent('lux-select', LuxSelect);
export default LuxSelect;
