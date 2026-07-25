import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-table.min.js';
import '../../../complib/lux-example.min.js';
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

class PageComponentsTable extends LuxElement {
    static styles = styles;
    render() {
        return html`
            <h1>${msg('table.title')}</h1>
            <p class="subtitle">${msg('table.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('table.basic')}</span>
                <div slot="main">
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
                                    <td><code>border</code></td>
                                    <td>Boolean</td>
                                    <td>false</td>
                                    <td>${msg('table.border.desc')}</td>
                                </tr>
                                <tr>
                                    <td><code>stripe</code></td>
                                    <td>Boolean</td>
                                    <td>false</td>
                                    <td>${msg('table.stripe.desc')}</td>
                                </tr>
                                <tr>
                                    <td><code>row-border</code></td>
                                    <td>Boolean</td>
                                    <td>false</td>
                                    <td>${msg('table.rowBorder.desc')}</td>
                                </tr>
                                <tr>
                                    <td><code>col-border</code></td>
                                    <td>Boolean</td>
                                    <td>false</td>
                                    <td>${msg('table.colBorder.desc')}</td>
                                </tr>
                                <tr>
                                    <td><code>size</code></td>
                                    <td>String</td>
                                    <td>md</td>
                                    <td>${msg('table.size.desc')}</td>
                                </tr>
                                <tr>
                                    <td><code>hover</code></td>
                                    <td>Boolean</td>
                                    <td>false</td>
                                    <td>${msg('table.hover.desc')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </lux-table>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        code="<lux-table border row-border stripe>
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th></tr>
    </thead>
    <tbody>
      <tr><td>foo</td><td>String</td></tr>
    </tbody>
  </table>
</lux-table>"
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('table.sizes')}</span>
                <div slot="main">
                    <lux-table border row-border size="sm">
                        <table>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Small</td>
                                    <td>13px font, 6px padding</td>
                                </tr>
                                <tr>
                                    <td>Medium</td>
                                    <td>14px font, 10px padding (default)</td>
                                </tr>
                            </tbody>
                        </table>
                    </lux-table>
                    <lux-table border row-border size="lg">
                        <table>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Large</td>
                                    <td>15px font, 14px padding</td>
                                </tr>
                            </tbody>
                        </table>
                    </lux-table>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        code='<lux-table border row-border size="sm">
  <table>...</table>
</lux-table>
<lux-table border row-border size="lg">
  <table>...</table>
</lux-table>'
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('table.colBorder')}</span>
                <div slot="main">
                    <lux-table border col-border>
                        <table>
                            <thead>
                                <tr>
                                    <th>Left</th>
                                    <th>Center</th>
                                    <th>Right</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>A1</td>
                                    <td>B1</td>
                                    <td>C1</td>
                                </tr>
                                <tr>
                                    <td>A2</td>
                                    <td>B2</td>
                                    <td>C2</td>
                                </tr>
                            </tbody>
                        </table>
                    </lux-table>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        code="<lux-table border col-border>
  <table>...</table>
</lux-table>"
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('table.hover')}</span>
                <div slot="main">
                    <lux-table border row-border hover>
                        <table>
                            <thead>
                                <tr>
                                    <th>Icon</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>✓</td>
                                    <td>check</td>
                                    <td>Check mark</td>
                                </tr>
                                <tr>
                                    <td>✕</td>
                                    <td>close</td>
                                    <td>Close / cancel</td>
                                </tr>
                                <tr>
                                    <td>🔍</td>
                                    <td>search</td>
                                    <td>Search</td>
                                </tr>
                            </tbody>
                        </table>
                    </lux-table>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        code="<lux-table border row-border hover>
  <table>...</table>
</lux-table>"
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
                            <td><code>border</code></td>
                            <td>Boolean</td>
                            <td>false</td>
                            <td>${msg('table.border.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>stripe</code></td>
                            <td>Boolean</td>
                            <td>false</td>
                            <td>${msg('table.stripe.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>row-border</code></td>
                            <td>Boolean</td>
                            <td>false</td>
                            <td>${msg('table.rowBorder.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>col-border</code></td>
                            <td>Boolean</td>
                            <td>false</td>
                            <td>${msg('table.colBorder.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td>String</td>
                            <td>md</td>
                            <td>${msg('table.size.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>hover</code></td>
                            <td>Boolean</td>
                            <td>false</td>
                            <td>${msg('table.hover.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsTable;
