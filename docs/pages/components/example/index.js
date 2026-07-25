import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
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
        background: rgb(var(--lux-bg-alt));
        padding: 2px 6px;
        border-radius: var(--lux-radius-sm);
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

class PageComponentsExample extends LuxElement {
    static styles = styles;
    render() {
        return html`
            <h1>${msg('ex.title')}</h1>
            <p class="subtitle">${msg('ex.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('ex.basic')}</span>
                <div slot="main">
                    <lux-example>
                        <span slot="heading">Demo</span>
                        <div slot="main">
                            <p>This is the main content area. It's always visible.</p>
                        </div>
                        <div slot="footer">
                            <p>
                                This is the footer content. Click the header to toggle visibility.
                            </p>
                        </div>
                    </lux-example>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-example>
  <span slot="heading">Demo</span>
  <div slot="main">
    <p>This is the main content area. It's always visible.</p>
  </div>
  <div slot="footer">
    <p>This is the footer content. Click the header to toggle visibility.</p>
  </div>
</lux-example>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('ex.preexpanded')}</span>
                <div slot="main">
                    <lux-example .expanded=${true}>
                        <span slot="heading">Pre-expanded</span>
                        <div slot="main">
                            <p>This example starts expanded. The footer is visible by default.</p>
                        </div>
                        <div slot="footer">
                            <p>Footer content visible on load.</p>
                        </div>
                    </lux-example>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-example .expanded=${true}>
  <span slot="heading">Pre-expanded</span>
  <div slot="main">
    <p>This example starts expanded. The footer is visible by default.</p>
  </div>
  <div slot="footer">
    <p>Footer content visible on load.</p>
  </div>
</lux-example>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('ex.event')}</span>
                <div slot="main">
                    <lux-example>
                        <span slot="heading">With Code</span>
                        <div slot="main">
                            <p>Rendered result above, expand to see the code below.</p>
                        </div>
                        <div slot="footer">
                            <p>Code or additional details go in the footer slot.</p>
                        </div>
                    </lux-example>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-example>
  <span slot="heading">With Code</span>
  <div slot="main">
    <p>Rendered result above, expand to see the code below.</p>
  </div>
  <div slot="footer">
    <p>Code or additional details go in the footer slot.</p>
  </div>
</lux-example>`}
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
                            <td><code>expanded</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('ex.expanded.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2>${msg('ex.slots')}</h2>
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
                            <td><code>heading</code></td>
                            <td>${msg('ex.heading.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>main</code></td>
                            <td>${msg('ex.main.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>footer</code></td>
                            <td>${msg('ex.footer.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsExample;
