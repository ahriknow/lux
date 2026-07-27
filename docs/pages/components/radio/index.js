import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-radio.min.js';
import '../../../complib/lux-example.min.js';
import '../../../complib/lux-table.min.js';
import '../../../complib/lux-code.min.js';

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
    h2 {
        font-size: 18px;
        font-weight: 600;
        color: rgb(var(--lux-text));
        margin: 56px 0 16px;
    }
    p {
        font-size: 14px;
        color: rgb(var(--lux-text-secondary));
        line-height: 1.6;
        margin-bottom: 12px;
    }
    code {
        font-family: 'SF Mono', Consolas, monospace;
        font-size: 0.88em;
        background: rgb(var(--lux-bg));
        padding: 2px 6px;
        border-radius: 4px;
    }
    .demo-row {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        margin: 12px 0;
        color: rgb(var(--lux-text));
    }
`;

const fruitOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
];

const basicCode = `<lux-radio .options=${'{fruitOptions}'} value="apple"></lux-radio>`;

const sizesCode = `<lux-radio .options=${'{options}'} value="a" size="sm"></lux-radio>
<lux-radio .options=${'{options}'} value="a"></lux-radio>
<lux-radio .options=${'{options}'} value="a" size="lg"></lux-radio>`;

const squareCode = `<lux-radio .options=${'{options}'} value="a" shape="square"></lux-radio>`;

const verticalCode = `<lux-radio .options=${'{colors}'} value="red" vertical></lux-radio>`;

const disabledCode = `<lux-radio .options=${'{options}'} value="a" disabled></lux-radio>`;

class PageComponentsRadio extends LuxElement {
    static styles = styles;
    render() {
        return html`
            <h1>${msg('radio.title')}</h1>
            <p class="subtitle">${msg('radio.subtitle')}</p>

            <lux-example
                ><span slot="heading">${msg('radio.basic')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-radio
                            .options=${fruitOptions}
                            value="apple"
                            @change=${(e) => {
                                const log = this.$('#radio-log');
                                if (log)
                                    log.textContent =
                                        'value: ' + e.detail.value + ', label: ' + e.detail.label;
                            }}
                        ></lux-radio>
                        <span
                            id="radio-log"
                            style="color:rgb(var(--lux-text-secondary));font-size:13px"
                            >value: apple, label: Apple</span
                        >
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="javascript"
                        .code=${`const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

html\`<lux-radio .options=\${fruitOptions} value="apple"\`}></lux-code>`}
                        show-header
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('radio.sizes')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-radio .options=${fruitOptions} value="apple" size="sm"></lux-radio>
                        <lux-radio .options=${fruitOptions} value="apple"></lux-radio>
                        <lux-radio .options=${fruitOptions} value="apple" size="lg"></lux-radio>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code language="html" .code=${sizesCode} show-header></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('radio.square')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-radio
                            .options=${fruitOptions}
                            value="apple"
                            shape="square"
                        ></lux-radio>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code language="html" .code=${squareCode} show-header></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('radio.vertical')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-radio
                            .options=${[
                                { value: 'red', label: 'Red' },
                                { value: 'green', label: 'Green' },
                                { value: 'blue', label: 'Blue' },
                            ]}
                            value="red"
                            vertical
                        ></lux-radio>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code language="html" .code=${verticalCode} show-header></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('radio.disabled')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-radio .options=${fruitOptions} value="apple" disabled></lux-radio>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code language="html" .code=${disabledCode} show-header></lux-code>
                </div>
            </lux-example>

            <h2>${msg('common.props')}</h2>
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
                            <td>${msg('radio.prop.options')}</td>
                        </tr>
                        <tr>
                            <td><code>value</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('radio.prop.value')}</td>
                        </tr>
                        <tr>
                            <td><code>name</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('radio.prop.name')}</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('radio.prop.disabled')}</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('radio.prop.size')}</td>
                        </tr>
                        <tr>
                            <td><code>shape</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('radio.prop.shape')}</td>
                        </tr>
                        <tr>
                            <td><code>vertical</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('radio.prop.vertical')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2>${msg('common.events')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('common.events')}</th>
                            <th>Detail</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>change</code></td>
                            <td><code>{ value, label }</code></td>
                            <td>${msg('radio.event.change')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2 style="margin-top:56px">${msg('common.cssVars')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('common.props')}</th>
                            <th>${msg('common.default')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>--radio-size</code></td>
                            <td><code>18px</code></td>
                            <td>${msg('radio.var.radioSize')}</td>
                        </tr>
                        <tr>
                            <td><code>--radio-font</code></td>
                            <td><code>14px</code></td>
                            <td>${msg('radio.var.radioFont')}</td>
                        </tr>
                        <tr>
                            <td><code>--radio-gap</code></td>
                            <td><code>16px</code></td>
                            <td>${msg('radio.var.radioGap')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsRadio;
