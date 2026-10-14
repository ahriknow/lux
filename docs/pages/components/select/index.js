import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-select.min.js';
import '../../../complib/lux-button.min.js';
import '../../../complib/lux-example.min.js';
import '../../../complib/lux-code.min.js';
import '../../../complib/lux-table.min.js';

const fruitOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'grape', label: 'Grape' },
    { value: 'orange', label: 'Orange' },
];

// 远程搜索演示数据：fetch(keyword) 模拟服务端过滤 + 随机延迟（竞态可观察）
const DEMO_USERS = Array.from({ length: 24 }, (_, i) => {
    const depts = ['平台组', '业务组', '基础设施', '质量保障'];
    return {
        value: `u${i + 1}`,
        label: `用户 ${String(i + 1).padStart(2, '0')}`,
        dept: depts[i % 4],
    };
});

// 自定义 item 渲染演示数据
const TEAM_OPTIONS = [
    { value: 'core', label: '核心服务', color: 'danger', note: 'P0 值守' },
    { value: 'web', label: '前端体验', color: 'primary', note: '组件库 / 文档' },
    { value: 'infra', label: '基础设施', color: 'success', note: 'CI / 集群' },
    { value: 'data', label: '数据平台', color: 'warning', note: '指标 / 报表' },
];

const styles = css`
    :host {
        display: block;
    }
    h1 {
        font-size: 24px;
        font-weight: 700;
        color: rgb(var(--lux-text));
        margin-bottom: 4px;
    }
    .subtitle {
        font-size: 14px;
        color: rgb(var(--lux-text-secondary));
        margin-bottom: 24px;
        line-height: 1.6;
    }
    code {
        font-family: 'SF Mono', Consolas, monospace;
        font-size: 0.88em;
        background: rgb(var(--lux-bg));
        padding: 2px 6px;
        border-radius: var(--lux-radius-sm);
    }
    .demo-row {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        margin: 12px 0;
        color: rgb(var(--lux-text));
    }
`;

class PageComponentsSelect extends LuxElement {
    static styles = styles;
    static properties = {
        fetchCalls: { type: Number },
        lastKw: { type: String },
        fetchPicked: { type: String },
    };

    constructor() {
        super();
        this.fetchCalls = 0;
        this.lastKw = '';
        this.fetchPicked = '';
    }

    /** 模拟远程搜索：随机 150~750ms 延迟（演示防抖节流与过期响应丢弃） */
    async _demoFetch(kw) {
        this.fetchCalls++;
        this.lastKw = kw;
        await new Promise((r) => setTimeout(r, 150 + Math.random() * 600));
        const q = kw.trim().toLowerCase();
        return DEMO_USERS.filter(
            (u) => !q || u.label.toLowerCase().includes(q) || u.dept.toLowerCase().includes(q)
        );
    }

    firstUpdated() {
        const progSelect = this.$('#dd-prog');
        if (progSelect) {
            progSelect.options = [
                { value: 'apple', label: 'Apple' },
                { value: 'banana', label: 'Banana' },
                { value: 'cherry', label: 'Cherry' },
            ];
        }
    }

    render() {
        const phFruit = msg('select.ph.fruit');
        const phSelect = msg('select.ph.select');

        return html`
            <h1>${msg('select.title')}</h1>
            <p class="subtitle">${msg('select.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('select.basic')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-select
                            .placeholder=${phFruit}
                            .options=${fruitOptions}
                            @change=${(e) => console.log(e.detail)}
                        ></lux-select>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-select placeholder="..." .options=${'[{value:"apple",label:"Apple"},...]'}></lux-select>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('dd.programmatic')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-select id="dd-prog" .placeholder=${phSelect}></lux-select>
                        <lux-button
                            @click=${() => {
                                const dd = this.$('#dd-prog');
                                if (dd) dd.value = 'banana';
                            }}
                            >Set Banana</lux-button
                        >
                        <lux-button
                            @click=${() => {
                                const dd = this.$('#dd-prog');
                                if (dd) {
                                    dd.options = [
                                        { value: 'x', label: 'Option X' },
                                        { value: 'y', label: 'Option Y' },
                                        { value: 'z', label: 'Option Z' },
                                    ];
                                    dd.value = '';
                                }
                            }}
                            >Set Options</lux-button
                        >
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-select id="dd" placeholder="..."></lux-select>

<script>
const dd = document.getElementById('dd');
// 设置选项
dd.options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
];
// 设置值
dd.value = 'banana';
</script>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('select.fetch')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-select
                            .placeholder=${msg('select.ph.search')}
                            .fetch=${(kw) => this._demoFetch(kw)}
                            .fetchDelay=${300}
                            clearable
                            @change=${(e) => (this.fetchPicked = e.detail.label)}
                        ></lux-select>
                        <span style="font-size: 12px; color: rgb(var(--lux-text-secondary))">
                            ${msg('select.fetch.stat')} ${this.fetchCalls} · kw: “${this.lastKw}” ·
                            ${msg('select.fetch.picked')}: ${this.fetchPicked || '—'}
                        </span>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-select
  placeholder="输入搜索…"
  .fetch=${'${async (keyword) => api.search(keyword)}'} // 返回 options 数组
  .fetchDelay=${'300'}                               // 防抖节流（毫秒）
  @change=${'${(e) => console.log(e.detail)}'}
></lux-select>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('select.searchable')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-select
                            searchable
                            clearable
                            .placeholder=${msg('select.ph.search')}
                            .options=${fruitOptions}
                            @change=${(e) => console.log(e.detail)}
                        ></lux-select>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-select
  searchable
  .placeholder=${'"输入过滤…"'}
  .options=${'OPTIONS'}
></lux-select>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('select.custom')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-select
                            .placeholder=${msg('select.ph.select')}
                            .options=${TEAM_OPTIONS}
                            .itemRender=${(opt, selected) => html`
                                <div style="display:flex;align-items:center;gap:8px;min-width:160px">
                                    <span
                                        style="width:8px;height:8px;border-radius:50%;background:rgb(var(--lux-${opt.color}))"
                                    ></span>
                                    <b>${opt.label}</b>
                                    <span style="font-size:12px;color:rgb(var(--lux-text-secondary))">${opt.note}</span>
                                    ${selected
                                        ? html`<span style="margin-left:auto;color:rgb(var(--lux-primary-400))">✓</span>`
                                        : ''}
                                </div>
                            `}
                            @change=${(e) => console.log(e.detail)}
                        ></lux-select>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-select
  .options=${'TEAM_OPTIONS'}
  .itemRender=${'(opt, selected) => html`<b>${opt.label}</b> …`'}
></lux-select>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('select.clearable')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-select
                            clearable
                            .placeholder=${phSelect}
                            .options=${fruitOptions}
                        ></lux-select>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-select clearable placeholder="..." .options=${'...'}></lux-select>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('select.disabled')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-select
                            disabled
                            value="apple"
                            .placeholder=${phSelect}
                            .options=${fruitOptions}
                        ></lux-select>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-select disabled value="apple" placeholder="..." .options=${'...'}></lux-select>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('select.sizes')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-select
                            size="sm"
                            .placeholder=${phSelect}
                            .options=${fruitOptions}
                        ></lux-select>
                    </div>
                    <div class="demo-row">
                        <lux-select .placeholder=${phSelect} .options=${fruitOptions}></lux-select>
                    </div>
                    <div class="demo-row">
                        <lux-select
                            size="lg"
                            .placeholder=${phSelect}
                            .options=${fruitOptions}
                        ></lux-select>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-select size="sm" placeholder="..." .options=${'...'}></lux-select>
<lux-select placeholder="..." .options=${'...'}></lux-select>
<lux-select size="lg" placeholder="..." .options=${'...'}></lux-select>`}
                    ></lux-code>
                </div>
            </lux-example>

            <h2 style="margin-top:56px">${msg('common.props')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('common.props')}</th>
                            <th>${msg('common.type')}</th>
                            <th>${msg('common.default')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>options</code></td>
                            <td>Array</td>
                            <td><code>[]</code></td>
                            <td>${msg('select.prop.options')}</td>
                        </tr>
                        <tr>
                            <td><code>value</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('select.prop.value')}</td>
                        </tr>
                        <tr>
                            <td><code>placeholder</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('select.prop.placeholder')}</td>
                        </tr>
                        <tr>
                            <td><code>clearable</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('select.prop.clearable')}</td>
                        </tr>
                        <tr>
                            <td><code>open</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('dd.open.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td>String</td>
                            <td><code>md</code></td>
                            <td>${msg('select.prop.size')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2 style="margin-top:56px">${msg('common.events')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('common.events')}</th>
                            <th>${msg('common.detail')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>change</code></td>
                            <td><code>{ value, label }</code></td>
                            <td>${msg('select.event.change')}</td>
                        </tr>
                        <tr>
                            <td><code>clear</code></td>
                            <td>—</td>
                            <td>${msg('select.event.clear')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsSelect;
