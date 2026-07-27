import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-button.min.js';
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

class PageComponentsButton extends LuxElement {
    static styles = styles;
    render() {
        return html`
            <h1>${msg('btn.title')}</h1>
            <p class="subtitle">${msg('btn.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('btn.basic')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-button>Primary</lux-button>
                        <lux-button variant="secondary">Secondary</lux-button>
                        <lux-button outline>Outline</lux-button>
                        <lux-button ghost>Ghost</lux-button>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-button>Primary</lux-button>
<lux-button variant="secondary">Secondary</lux-button>
<lux-button outline>Outline</lux-button>
<lux-button ghost>Ghost</lux-button>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('btn.colors')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-button variant="success">Success</lux-button>
                        <lux-button variant="warning">Warning</lux-button>
                        <lux-button variant="error">Error</lux-button>
                        <lux-button variant="info">Info</lux-button>
                    </div>
                    <div class="demo-row" style="margin-top:8px">
                        <lux-button variant="success" outline>Success</lux-button>
                        <lux-button variant="warning" outline>Warning</lux-button>
                        <lux-button variant="error" outline>Error</lux-button>
                        <lux-button variant="info" outline>Info</lux-button>
                    </div>
                    <div class="demo-row" style="margin-top:8px">
                        <lux-button variant="success" ghost>Success</lux-button>
                        <lux-button variant="warning" ghost>Warning</lux-button>
                        <lux-button variant="error" ghost>Error</lux-button>
                        <lux-button variant="info" ghost>Info</lux-button>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-button variant="success">Success</lux-button>
<lux-button variant="warning">Warning</lux-button>
<lux-button variant="error">Error</lux-button>
<lux-button variant="info">Info</lux-button>

<!-- Outline + color -->
<lux-button variant="success" outline>Success</lux-button>
<lux-button variant="warning" outline>Warning</lux-button>

<!-- Ghost + color -->
<lux-button variant="success" ghost>Success</lux-button>
<lux-button variant="error" ghost>Error</lux-button>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('btn.sizes')}</span>
                <div slot="main">
                    <div class="demo-row" style="align-items:center">
                        <lux-button size="sm">Small</lux-button>
                        <lux-button size="md">Medium</lux-button>
                        <lux-button size="lg">Large</lux-button>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-button size="sm">Small</lux-button>
<lux-button size="md">Medium</lux-button>
<lux-button size="lg">Large</lux-button>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('btn.icon')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-button icon="add">Add</lux-button>
                        <lux-button icon="edit">Edit</lux-button>
                        <lux-button icon="delete" variant="error">Delete</lux-button>
                        <lux-button icon="search" outline>Search</lux-button>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-button icon="add">Add</lux-button>
<lux-button icon="edit">Edit</lux-button>
<lux-button icon="delete" variant="error">Delete</lux-button>
<lux-button icon="search" outline>Search</lux-button>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('btn.iconOnly')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-button shape="circle" icon="add"></lux-button>
                        <lux-button shape="circle" icon="edit" variant="secondary"></lux-button>
                        <lux-button shape="circle" icon="delete" variant="error"></lux-button>
                        <lux-button shape="circle" icon="search" outline></lux-button>
                        <lux-button shape="circle" icon="settings" ghost></lux-button>
                    </div>
                    <div class="demo-row" style="margin-top:12px">
                        <lux-button shape="square" icon="add"></lux-button>
                        <lux-button shape="square" icon="edit" variant="secondary"></lux-button>
                        <lux-button shape="square" icon="delete" variant="error"></lux-button>
                        <lux-button shape="square" icon="search" outline></lux-button>
                        <lux-button shape="square" icon="settings" ghost></lux-button>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-button shape="circle" icon="add"></lux-button>
<lux-button shape="circle" icon="edit" variant="secondary"></lux-button>
<lux-button shape="circle" icon="delete" variant="error"></lux-button>

<lux-button shape="square" icon="add"></lux-button>
<lux-button shape="square" icon="search" outline></lux-button>
<lux-button shape="square" icon="settings" ghost></lux-button>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('btn.iconSizes')}</span>
                <div slot="main">
                    <div class="demo-row" style="align-items:center">
                        <lux-button shape="circle" icon="add" size="sm"></lux-button>
                        <lux-button shape="circle" icon="add" size="md"></lux-button>
                        <lux-button shape="circle" icon="add" size="lg"></lux-button>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-button shape="circle" icon="add" size="sm"></lux-button>
<lux-button shape="circle" icon="add" size="md"></lux-button>
<lux-button shape="circle" icon="add" size="lg"></lux-button>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('btn.states')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-button disabled>Disabled</lux-button>
                        <lux-button loading>Loading</lux-button>
                        <lux-button shape="circle" icon="add" disabled></lux-button>
                        <lux-button shape="circle" icon="add" loading></lux-button>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-button disabled>Disabled</lux-button>
<lux-button loading>Loading</lux-button>
<lux-button shape="circle" icon="add" disabled></lux-button>
<lux-button shape="circle" icon="add" loading></lux-button>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('btn.block')}</span>
                <div slot="main">
                    <lux-button block>Block Button</lux-button>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-button block>Block Button</lux-button>`}
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
                            <td><code>variant</code></td>
                            <td>String</td>
                            <td><code>primary</code></td>
                            <td>${msg('btn.variant.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>outline</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('btn.outline.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>ghost</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('btn.ghost.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td>String</td>
                            <td><code>md</code></td>
                            <td>${msg('btn.size.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>shape</code></td>
                            <td>String</td>
                            <td>—</td>
                            <td>${msg('btn.shape.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>icon</code></td>
                            <td>String</td>
                            <td>—</td>
                            <td>${msg('btn.icon.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('btn.disabled.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>loading</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('btn.loading.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>block</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('btn.block.desc')}</td>
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
                            <td><code>--btn-py</code></td>
                            <td><code>8px</code></td>
                            <td>${msg('btn.var.btnPy')}</td>
                        </tr>
                        <tr>
                            <td><code>--btn-px</code></td>
                            <td><code>16px</code></td>
                            <td>${msg('btn.var.btnPx')}</td>
                        </tr>
                        <tr>
                            <td><code>--btn-font</code></td>
                            <td><code>13px</code></td>
                            <td>${msg('btn.var.btnFont')}</td>
                        </tr>
                        <tr>
                            <td><code>--btn-gap</code></td>
                            <td><code>8px</code></td>
                            <td>${msg('btn.var.btnGap')}</td>
                        </tr>
                        <tr>
                            <td><code>--icon-size</code></td>
                            <td><code>36px</code></td>
                            <td>${msg('btn.var.iconSize')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsButton;
