import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-layout.min.js';
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
        gap: 12px;
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

    .layout-demo {
        border: 1px solid rgb(var(--lux-border));
        border-radius: var(--lux-radius);
        overflow: hidden;
        height: 300px;
        margin: 12px 0;
    }
    .layout-demo .aside {
        background: rgb(var(--lux-card));
        padding: 12px;
        color: rgb(var(--lux-text-secondary));
        font-size: 13px;
    }
    .layout-demo .header {
        background: rgb(var(--lux-card));
        padding: 10px 16px;
        border-bottom: 1px solid rgb(var(--lux-border));
        font-size: 13px;
        color: rgb(var(--lux-text-secondary));
    }
    .layout-demo .main {
        padding: 16px;
        font-size: 13px;
        color: rgb(var(--lux-text-secondary));
    }
    .layout-demo .footer {
        background: rgb(var(--lux-card));
        padding: 8px 16px;
        border-top: 1px solid rgb(var(--lux-border));
        font-size: 12px;
        color: rgb(var(--lux-text-muted));
    }
`;

class PageComponentsLayout extends LuxElement {
    static styles = styles;
    render() {
        return html`
            <h1>${msg('layout.title')}</h1>
            <p class="subtitle">${msg('layout.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('layout.basic')}</span>
                <div slot="main">
                    <div class="layout-demo">
                        <lux-layout aside-width="180px">
                            <div slot="aside" class="aside">Aside</div>
                            <div slot="header" class="header">Header</div>
                            <div slot="main" class="main">Main Content</div>
                            <div slot="footer" class="footer">Footer</div>
                        </lux-layout>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-layout aside-width="180px">
  <div slot="aside">Aside</div>
  <div slot="header">Header</div>
  <div slot="main">Main Content</div>
  <div slot="footer">Footer</div>
</lux-layout>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('layout.noAside')}</span>
                <div slot="main">
                    <div class="layout-demo">
                        <lux-layout no-aside>
                            <div slot="header" class="header">Header</div>
                            <div slot="main" class="main">Main Content (no aside)</div>
                            <div slot="footer" class="footer">Footer</div>
                        </lux-layout>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-layout no-aside>
  <div slot="header">Header</div>
  <div slot="main">Main Content</div>
  <div slot="footer">Footer</div>
</lux-layout>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('layout.noHeaderFooter')}</span>
                <div slot="main">
                    <div class="layout-demo">
                        <lux-layout no-header no-footer aside-width="160px">
                            <div slot="aside" class="aside">Aside</div>
                            <div slot="main" class="main">Main Content (no header/footer)</div>
                        </lux-layout>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-layout no-header no-footer aside-width="160px">
  <div slot="aside">Aside</div>
  <div slot="main">Main Content</div>
</lux-layout>`}
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
                            <td><code>aside-width</code></td>
                            <td>String</td>
                            <td><code>240px</code></td>
                            <td>${msg('layout.asideWidth.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>aside-min</code></td>
                            <td>String</td>
                            <td><code>120px</code></td>
                            <td>${msg('layout.asideMin.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>aside-max</code></td>
                            <td>String</td>
                            <td><code>50vw</code></td>
                            <td>${msg('layout.asideMax.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>aside-scroll</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('layout.asideScroll.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>no-header</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('layout.noHeader.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>no-footer</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('layout.noFooter.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>no-aside</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('layout.noAside.desc')}</td>
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
                            <td><code>aside-resize</code></td>
                            <td><code>{ width: string }</code></td>
                            <td>${msg('layout.asideResize.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2>${msg('layout.slots')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>Slot</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>aside</code></td>
                            <td>${msg('layout.slot.aside.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>header</code></td>
                            <td>${msg('layout.slot.header.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>main</code></td>
                            <td>${msg('layout.slot.main.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>footer</code></td>
                            <td>${msg('layout.slot.footer.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsLayout;
