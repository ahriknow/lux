import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-dropdown.min.js';
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

class PageComponentsDropdown extends LuxElement {
    static styles = styles;

    firstUpdated() {
        const progDd = this.$('#dd-prog');
        if (progDd) {
            progDd.options = [
                { value: 'apple', label: 'Apple' },
                { value: 'banana', label: 'Banana' },
                { value: 'cherry', label: 'Cherry' },
            ];
        }
    }

    render() {
        return html`
            <h1>${msg('dd.title')}</h1>
            <p class="subtitle">${msg('dd.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('dd.basic')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-dropdown .options=${fruitOptions}>
                            <span slot="trigger">${msg('dropdown.selectFruit')}</span>
                        </lux-dropdown>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-dropdown .options=${'[{value:"apple",label:"Apple"},...]'}>
    <span slot="trigger">${msg('dropdown.selectFruit')}</span>
</lux-dropdown>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('dd.programmatic')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-dropdown id="dd-prog">
                            <span slot="trigger">${msg('dropdown.selectFruit')}</span>
                        </lux-dropdown>
                        <lux-button
                            @click=${() => {
                                const dd = this.$('#dd-prog');
                                if (dd) dd.value = 'banana';
                            }}
                            >${msg('select.setBanana')}</lux-button
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
                            >${msg('select.setOptions')}</lux-button
                        >
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-dropdown id="dd">
    <span slot="trigger">${msg('dropdown.selectFruit')}</span>
</lux-dropdown>

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
                <span slot="heading">${msg('dd.clearable')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-dropdown clearable .options=${fruitOptions}>
                            <span slot="trigger">${msg('dropdown.selectFruit')}</span>
                        </lux-dropdown>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-dropdown clearable .options=${'...'}>
    <span slot="trigger">${msg('dropdown.selectFruit')}</span>
</lux-dropdown>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('dd.size')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-dropdown size="sm" .options=${fruitOptions}>
                            <span slot="trigger">${msg('demo.small')}</span>
                        </lux-dropdown>
                    </div>
                    <div class="demo-row">
                        <lux-dropdown .options=${fruitOptions}>
                            <span slot="trigger">${msg('demo.medium')}</span>
                        </lux-dropdown>
                    </div>
                    <div class="demo-row">
                        <lux-dropdown size="lg" .options=${fruitOptions}>
                            <span slot="trigger">${msg('demo.large')}</span>
                        </lux-dropdown>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-dropdown size="sm" .options=${'...'}>
    <span slot="trigger">Small</span>
</lux-dropdown>

<lux-dropdown .options=${'...'}>
    <span slot="trigger">Medium</span>
</lux-dropdown>

<lux-dropdown size="lg" .options=${'...'}>
    <span slot="trigger">Large</span>
</lux-dropdown>`}
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
                            <td>${msg('dd.options.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>value</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('dd.value.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>clearable</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('dd.clearable.desc')}</td>
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
                            <td>${msg('dd.size.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2 style="margin-top:56px">${msg('common.slots')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('common.props')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>trigger</code></td>
                            <td>${msg('dd.trigger.desc')}</td>
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
                            <td>${msg('dd.change.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>clear</code></td>
                            <td>—</td>
                            <td>${msg('dd.clear.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsDropdown;
