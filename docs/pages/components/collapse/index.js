import { html, css, LuxElement, msg } from '../../../lux.min.js';
import '../../../complib/lux-collapse.min.js';
import '../../../complib/lux-example.min.js';
import '../../../complib/lux-code.min.js';
import '../../../complib/lux-table.min.js';
import '../../../complib/lux-button.min.js';

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
    .demo {
        max-width: 560px;
        color: rgb(var(--lux-text));
    }
    .meta {
        margin-top: 10px;
        font-size: 13px;
        color: rgb(var(--lux-text-secondary));
    }
    .meta b {
        color: rgb(var(--lux-text));
    }
    .row-list .row {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 6px;
        border-bottom: 1px dashed rgb(var(--lux-border));
        font-size: 13px;
    }
    .row-list .row:last-child {
        border-bottom: 0;
    }
    .row-list .muted {
        color: rgb(var(--lux-text-secondary));
    }
    .row-list a {
        color: rgb(var(--lux-primary-500, 99 91 218));
        cursor: pointer;
    }
    .head-demo {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .tag {
        font-size: 12px;
        padding: 1px 6px;
        border-radius: 4px;
        background: rgb(var(--lux-primary-500, 99 91 218) / 12%);
        color: rgb(var(--lux-primary-500, 99 91 218));
    }
`;

class PageComponentsCollapse extends LuxElement {
    static styles = styles;

    static properties = {
        state: { type: String },
        lastAction: { type: String },
    };

    constructor() {
        super();
        this.state = 'closed';
        this.lastAction = '';
    }

    render() {
        return html`
            <h1>${msg('collapse.title')}</h1>
            <p class="subtitle">${msg('collapse.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('collapse.basic')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-collapse
                            title=${msg('collapse.demoTitle')}
                            .open=${this.state === 'open'}
                            @toggle=${(e) => (this.state = e.detail.open ? 'open' : 'closed')}
                        >
                            <p>${msg('collapse.sampleBody')}</p>
                        </lux-collapse>
                        <div class="meta">${msg('collapse.state')}: <b>${this.state}</b></div>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`html\`<lux-collapse
    title="Panel title"
    @toggle=\${(e) => console.log(e.detail.open)}
>
    <p>Body content…</p>
</lux-collapse>\``}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('collapse.custom')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-collapse>
                            <div slot="title" class="head-demo">
                                <span>${msg('collapse.boardName')}</span>
                                <span class="tag">${msg('collapse.public')}</span>
                            </div>
                            <div slot="actions">
                                <a
                                    href="#"
                                    @click=${(e) => {
                                        e.preventDefault();
                                        this.lastAction = msg('collapse.action.open');
                                    }}
                                    >${msg('collapse.open')}</a
                                >
                                <a
                                    href="#"
                                    @click=${(e) => {
                                        e.preventDefault();
                                        this.lastAction = msg('collapse.action.pin');
                                    }}
                                    >${msg('collapse.pin')}</a
                                >
                                <a
                                    href="#"
                                    @click=${(e) => {
                                        e.preventDefault();
                                        this.lastAction = msg('collapse.action.edit');
                                    }}
                                    >${msg('collapse.edit')}</a
                                >
                            </div>
                            <div class="row-list">
                                <div class="row">
                                    <b>${msg('collapse.todo')}</b
                                    ><span class="muted"
                                        >${msg('collapse.statusCount', { count: 1 })}</span
                                    >
                                </div>
                                <div class="row">
                                    <b>${msg('collapse.done')}</b
                                    ><span class="muted"
                                        >${msg('collapse.statusCount', { count: 2 })}</span
                                    >
                                </div>
                            </div>
                        </lux-collapse>
                        <div class="meta">
                            ${msg('collapse.actionHint')}
                            ${this.lastAction ? html`<b>${this.lastAction}</b>` : ''}
                        </div>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`html\`<lux-collapse>
    <div slot="title">Board name</div>
    <div slot="actions">
        <a @click=\${open}>Open</a>
        <a @click=\${edit}>Edit</a>
    </div>
    <!-- body: click "Open/Edit" does NOT toggle the panel -->
    <div>Column list…</div>
</lux-collapse>\``}
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
                            <td><code>open</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('collapse.prop.open')}</td>
                        </tr>
                        <tr>
                            <td><code>title</code></td>
                            <td>String</td>
                            <td><code>""</code></td>
                            <td>${msg('collapse.prop.title')}</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('collapse.prop.disabled')}</td>
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
                            <td><code>toggle</code></td>
                            <td><code>{ open }</code></td>
                            <td>${msg('collapse.event.toggle')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}

export default PageComponentsCollapse;
