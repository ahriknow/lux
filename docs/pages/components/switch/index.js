import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-switch.min.js';
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
        border-radius: var(--lux-radius-sm);
    }
    .demo-row {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        margin: 12px 0;
        color: rgb(var(--lux-text));
    }

    .tbl {
        width: 100%;
        border-collapse: collapse;
        margin: 12px 0;
        font-size: 14px;
    }
    .tbl th,
    .tbl td {
        padding: 10px 16px;
        text-align: left;
        border-bottom: 1px solid rgb(var(--lux-border));
    }
    .tbl th {
        color: rgb(var(--lux-text-muted));
        font-weight: 500;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .tbl td {
        color: rgb(var(--lux-text-secondary));
    }
`;

class PageComponentsSwitch extends LuxElement {
    static styles = styles;

    firstUpdated() {
        const sw = this.renderRoot.querySelector('#async-switch');
        if (sw) {
            sw.toggle = async () => {
                return new Promise((resolve) => {
                    setTimeout(() => resolve(Math.random() > 0.3), 1000);
                });
            };
        }
    }

    render() {
        return html`
            <h1>${msg('switch.title')}</h1>
            <p class="subtitle">${msg('switch.subtitle')}</p>

            <lux-example
                ><span slot="heading">${msg('switch.basic')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-switch></lux-switch>
                        <lux-switch checked></lux-switch>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-switch></lux-switch>
<lux-switch checked></lux-switch>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('switch.disabled')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-switch disabled></lux-switch>
                        <lux-switch checked disabled></lux-switch>
                        <lux-switch
                            checked-on-bg="rgb(var(--lux-success))"
                            checked-on-color="rgb(var(--lux-text-muted))"
                            disabled
                            >Disabled</lux-switch
                        >
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-switch disabled></lux-switch>
<lux-switch checked disabled></lux-switch>
<lux-switch checked-on-bg="rgb(var(--lux-success))" checked-on-color="rgb(var(--lux-text-muted))" disabled>Disabled</lux-switch>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('switch.loading')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-switch loading></lux-switch>
                        <lux-switch checked loading></lux-switch>
                        <lux-switch
                            checked
                            loading
                            checked-on-bg="rgb(var(--lux-success))"
                            checked-on-color="rgb(var(--lux-text-muted))"
                            >Saving...</lux-switch
                        >
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-switch loading></lux-switch>
<lux-switch checked loading></lux-switch>
<lux-switch checked loading checked-on-bg="rgb(var(--lux-success))" checked-on-color="rgb(var(--lux-text-muted))">Saving...</lux-switch>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('switch.async')}</span>
                <div slot="main">
                    <div class="demo-row" style="align-items:center">
                        <lux-switch id="async-switch"></lux-switch>
                        <span style="font-size:12px;color:rgb(var(--lux-text-muted))"
                            >点击后模拟 1s 请求，返回 true 切换，返回 false 不切换</span
                        >
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="javascript"
                        .code=${`<lux-switch .toggle=\${async () => {
  const ok = await new Promise(resolve => {
    setTimeout(() => resolve(Math.random() > 0.3), 1000);
  });
  return ok;
}}>Toggle</lux-switch>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('switch.sizes')}</span>
                <div slot="main">
                    <div class="demo-row" style="align-items:center">
                        <lux-switch size="sm" checked></lux-switch>
                        <span style="font-size:12px;color:rgb(var(--lux-text-muted))">sm</span>
                        <lux-switch size="md" checked></lux-switch>
                        <span style="font-size:12px;color:rgb(var(--lux-text-muted))"
                            >md (default)</span
                        >
                        <lux-switch size="lg" checked></lux-switch>
                        <span style="font-size:12px;color:rgb(var(--lux-text-muted))">lg</span>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-switch size="sm" checked></lux-switch>
<lux-switch size="md" checked></lux-switch>
<lux-switch size="lg" checked></lux-switch>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('switch.shape')}</span>
                <div slot="main">
                    <div class="demo-row" style="align-items:center">
                        <lux-switch shape="round" checked></lux-switch>
                        <span style="font-size:12px;color:rgb(var(--lux-text-muted))"
                            >round (default)</span
                        >
                        <lux-switch shape="square" checked></lux-switch>
                        <span style="font-size:12px;color:rgb(var(--lux-text-muted))">square</span>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-switch shape="round" checked></lux-switch>
<lux-switch shape="square" checked></lux-switch>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('switch.colors')}</span>
                <div slot="main">
                    <div class="demo-row" style="align-items:center">
                        <lux-switch
                            checked-on-bg="rgb(var(--lux-success))"
                            checked-on-color="rgb(var(--lux-text-muted))"
                            >Green</lux-switch
                        >
                        <lux-switch
                            checked-on-bg="rgb(var(--lux-error))"
                            checked-on-color="rgb(var(--lux-text-muted))"
                            >Red</lux-switch
                        >
                        <lux-switch
                            checked-on-bg="rgb(var(--lux-warning))"
                            checked-on-color="rgb(var(--lux-text-muted))"
                            >Warning</lux-switch
                        >
                        <lux-switch
                            checked-on-bg="rgb(var(--lux-info))"
                            checked-on-color="rgb(var(--lux-text-muted))"
                            >Info</lux-switch
                        >
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-switch checked-on-bg="rgb(var(--lux-success))" checked-on-color="rgb(var(--lux-text-muted))">Green</lux-switch>
<lux-switch checked-on-bg="rgb(var(--lux-error))" checked-on-color="rgb(var(--lux-text-muted))">Red</lux-switch>
<lux-switch checked-on-bg="rgb(var(--lux-warning))" checked-on-color="rgb(var(--lux-text-muted))">Warning</lux-switch>
<lux-switch checked-on-bg="rgb(var(--lux-info))" checked-on-color="rgb(var(--lux-text-muted))">Info</lux-switch>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('switch.content')}</span>
                <div slot="main">
                    <div class="demo-row" style="align-items:center">
                        <lux-switch checked>Enable notifications</lux-switch>
                        <lux-switch
                            checked-on-color="rgb(var(--lux-success))"
                            checked-off-color="rgb(var(--lux-text-muted))"
                            >Dark Mode</lux-switch
                        >
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-switch checked>Enable notifications</lux-switch>
<lux-switch checked-on-color="rgb(var(--lux-success))" checked-off-color="rgb(var(--lux-text-muted))">Dark Mode</lux-switch>`}
                    ></lux-code>
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
                            <td><code>checked</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('switch.checked.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('switch.disabled.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>loading</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('switch.loading.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td>String</td>
                            <td><code>md</code></td>
                            <td>${msg('switch.size.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>shape</code></td>
                            <td>String</td>
                            <td><code>round</code></td>
                            <td>${msg('switch.shape.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>checked-on-bg</code></td>
                            <td>String</td>
                            <td>primary-500</td>
                            <td>${msg('switch.checkedOnBg.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>checked-on-color</code></td>
                            <td>String</td>
                            <td>#fff</td>
                            <td>${msg('switch.checkedOnColor.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>checked-off-bg</code></td>
                            <td>String</td>
                            <td>border</td>
                            <td>${msg('switch.checkedOffBg.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>checked-off-color</code></td>
                            <td>String</td>
                            <td>text</td>
                            <td>${msg('switch.checkedOffColor.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>toggle</code></td>
                            <td>Function</td>
                            <td>-</td>
                            <td>${msg('switch.toggle.desc')}</td>
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
                            <td><code>{ checked: boolean }</code></td>
                            <td>${msg('switch.change.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsSwitch;
