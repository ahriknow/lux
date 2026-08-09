import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-pagination.min.js';
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
    .demo-col {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin: 12px 0;
    }
    .event-log {
        font-size: 13px;
        color: rgb(var(--lux-text-secondary));
        padding: 8px 12px;
        background: rgb(var(--lux-bg));
        border-radius: 6px;
        min-height: 20px;
        margin-top: 8px;
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

class PageComponentsPagination extends LuxElement {
    static styles = styles;

    constructor() {
        super();
    }

    firstUpdated() {
        const pg = this.renderRoot.querySelector('.events-pagination');
        if (!pg || pg._docsBound) return;
        pg._docsBound = true;
        pg.addEventListener('pageChange', (e) => {
            const { page, pageSize } = e.detail;
            const logEl = this.renderRoot.querySelector('.event-log');
            if (logEl) logEl.textContent = `pageChange → page: ${page}, pageSize: ${pageSize}`;
        });
        pg.addEventListener('pageSizeChange', (e) => {
            const { pageSize, page } = e.detail;
            const logEl = this.renderRoot.querySelector('.event-log');
            if (logEl) logEl.textContent = `pageSizeChange → pageSize: ${pageSize}, page: ${page}`;
        });
    }

    render() {
        return html`
            <h1>${msg('pagination.title')}</h1>
            <p class="subtitle">${msg('pagination.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('pagination.basic')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-pagination
                            .total=${100}
                            .current=${1}
                            .pageSize=${10}
                        ></lux-pagination>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<!-- 属性绑定（推荐） -->
<lux-pagination .total=\${100} .current=\${1} .pageSize=\${10}></lux-pagination>

<!-- HTML 属性 -->
<lux-pagination total="100" current="1" page-size="10"></lux-pagination>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('pagination.more')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-pagination
                            .total=${200}
                            .current=${1}
                            .pageSize=${10}
                        ></lux-pagination>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-pagination .total=\${200} .current=\${1} .pageSize=\${10}></lux-pagination>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('pagination.sizes')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-pagination total="100" size="sm"></lux-pagination>
                        <lux-pagination total="100" size="md"></lux-pagination>
                        <lux-pagination total="100" size="lg"></lux-pagination>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-pagination total="100" size="sm"></lux-pagination>
<lux-pagination total="100" size="md"></lux-pagination>
<lux-pagination total="100" size="lg"></lux-pagination>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('pagination.simple')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-pagination total="50" page-size="10" simple></lux-pagination>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-pagination total="50" page-size="10" simple></lux-pagination>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('pagination.total')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-pagination total="97" show-total></lux-pagination>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-pagination total="97" show-total></lux-pagination>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('pagination.jumper')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-pagination total="200" show-quick-jumper></lux-pagination>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-pagination total="200" show-quick-jumper></lux-pagination>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('pagination.pageSize')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-pagination total="200" show-size-changer></lux-pagination>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-pagination total="200" show-size-changer></lux-pagination>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('pagination.disabled')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-pagination total="100" current="3" disabled></lux-pagination>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-pagination total="100" current="3" disabled></lux-pagination>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('common.events')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-pagination
                            class="events-pagination"
                            total="200"
                            current="1"
                            page-size="10"
                            show-size-changer
                        >
                        </lux-pagination>
                        <div class="event-log">—</div>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-pagination
    .total=\${200}
    .current=\${1}
    .pageSize=\${10}
    show-size-changer
    @pageChange=${this._onPageChange}
    @pageSizeChange=${this._onPageSizeChange}
></lux-pagination>

_onPageChange(e) {
    const { page, pageSize } = e.detail;
    console.log('pageChange →', page, pageSize);
}
_onPageSizeChange(e) {
    const { pageSize, page } = e.detail;
    console.log('pageSizeChange →', pageSize, page);
}`}
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
                            <td><code>total</code></td>
                            <td>Number</td>
                            <td><code>0</code></td>
                            <td>${msg('pagination.prop.total')}</td>
                        </tr>
                        <tr>
                            <td><code>current</code></td>
                            <td>Number</td>
                            <td><code>1</code></td>
                            <td>${msg('pagination.prop.current')}</td>
                        </tr>
                        <tr>
                            <td><code>page-size</code></td>
                            <td>Number</td>
                            <td><code>10</code></td>
                            <td>${msg('pagination.prop.pageSize')}</td>
                        </tr>
                        <tr>
                            <td><code>page-size-options</code></td>
                            <td>Array</td>
                            <td><code>[10, 20, 50, 100]</code></td>
                            <td>${msg('pagination.prop.pageSizeOptions')}</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td>String</td>
                            <td><code>md</code></td>
                            <td>${msg('pagination.prop.size')}</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('pagination.prop.disabled')}</td>
                        </tr>
                        <tr>
                            <td><code>show-size-changer</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('pagination.prop.showSizeChanger')}</td>
                        </tr>
                        <tr>
                            <td><code>show-quick-jumper</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('pagination.prop.showQuickJumper')}</td>
                        </tr>
                        <tr>
                            <td><code>show-total</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('pagination.prop.showTotal')}</td>
                        </tr>
                        <tr>
                            <td><code>simple</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('pagination.prop.simple')}</td>
                        </tr>
                        <tr>
                            <td><code>block</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('pagination.prop.block')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2 style="margin-top:40px">${msg('common.events')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('common.events')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>pageChange</code></td>
                            <td>${msg('pagination.event.pageChange')}</td>
                        </tr>
                        <tr>
                            <td><code>pageSizeChange</code></td>
                            <td>${msg('pagination.event.pageSizeChange')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}

export default PageComponentsPagination;
