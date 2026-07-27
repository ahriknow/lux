import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-item-group.min.js';
import '../../../complib/lux-button.min.js';
import '../../../complib/lux-input.min.js';
import '../../../complib/lux-dropdown.min.js';
import '../../../complib/lux-select.min.js';
import '../../../complib/lux-example.min.js';
import '../../../complib/lux-code.min.js';
import '../../../complib/lux-table.min.js';

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

class PageComponentsItemGroup extends LuxElement {
    static styles = styles;
    render() {
        return html`
            <h1>${msg('itemGroup.title')}</h1>
            <p class="subtitle">${msg('itemGroup.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('itemGroup.basic')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-item-group>
                            <lux-button>Left</lux-button>
                            <lux-button>Center</lux-button>
                            <lux-button>Right</lux-button>
                        </lux-item-group>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-item-group>
    <lux-button>Left</lux-button>
    <lux-button>Center</lux-button>
    <lux-button>Right</lux-button>
</lux-item-group>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('itemGroup.variants')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-item-group>
                            <lux-button variant="primary">One</lux-button>
                            <lux-button variant="primary">Two</lux-button>
                            <lux-button variant="primary">Three</lux-button>
                        </lux-item-group>
                    </div>
                    <div class="demo-row">
                        <lux-item-group>
                            <lux-button outline>Left</lux-button>
                            <lux-button outline>Center</lux-button>
                            <lux-button outline>Right</lux-button>
                        </lux-item-group>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-item-group>
    <lux-button variant="primary">One</lux-button>
    <lux-button variant="primary">Two</lux-button>
    <lux-button variant="primary">Three</lux-button>
</lux-item-group>

<lux-item-group>
    <lux-button outline>Left</lux-button>
    <lux-button outline>Center</lux-button>
    <lux-button outline>Right</lux-button>
</lux-item-group>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('itemGroup.iconButtons')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-item-group>
                            <lux-button icon="chevron_left"></lux-button>
                            <lux-button>1</lux-button>
                            <lux-button>2</lux-button>
                            <lux-button>3</lux-button>
                            <lux-button icon="chevron_right"></lux-button>
                        </lux-item-group>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-item-group>
    <lux-button icon="chevron_left"></lux-button>
    <lux-button>1</lux-button>
    <lux-button>2</lux-button>
    <lux-button>3</lux-button>
    <lux-button icon="chevron_right"></lux-button>
</lux-item-group>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('itemGroup.vertical')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-item-group vertical>
                            <lux-button>Top</lux-button>
                            <lux-button>Middle</lux-button>
                            <lux-button>Bottom</lux-button>
                        </lux-item-group>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-item-group vertical>
    <lux-button>Top</lux-button>
    <lux-button>Middle</lux-button>
    <lux-button>Bottom</lux-button>
</lux-item-group>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('itemGroup.mixed')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-item-group>
                            <lux-button>Go</lux-button>
                            <lux-input placeholder="请输入地址"></lux-input>
                            <lux-button variant="primary">Search</lux-button>
                        </lux-item-group>
                    </div>
                    <div class="demo-row">
                        <lux-item-group>
                            <lux-select
                                placeholder="选择类型"
                                .options=${[
                                    { value: 'all', label: '全部' },
                                    { value: 'article', label: '文章' },
                                    { value: 'video', label: '视频' },
                                ]}
                            ></lux-select>
                            <lux-input placeholder="搜索关键词"></lux-input>
                            <lux-button variant="primary">Search</lux-button>
                        </lux-item-group>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-item-group>
    <lux-button>Go</lux-button>
    <lux-input placeholder="请输入地址"></lux-input>
    <lux-button variant="primary">Search</lux-button>
</lux-item-group>

<lux-item-group>
    <lux-select placeholder="选择类型" .options=${'[{...}]'}></lux-select>
    <lux-input placeholder="搜索关键词"></lux-input>
    <lux-button variant="primary">Search</lux-button>
</lux-item-group>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('itemGroup.sizes')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-item-group size="sm">
                            <lux-button>Small</lux-button>
                            <lux-button>Group</lux-button>
                        </lux-item-group>
                    </div>
                    <div class="demo-row">
                        <lux-item-group>
                            <lux-button>Medium</lux-button>
                            <lux-button>Group</lux-button>
                        </lux-item-group>
                    </div>
                    <div class="demo-row">
                        <lux-item-group size="lg">
                            <lux-button>Large</lux-button>
                            <lux-button>Group</lux-button>
                        </lux-item-group>
                    </div>
                    <div class="demo-row">
                        <lux-item-group size="sm">
                            <lux-button>Go</lux-button>
                            <lux-input placeholder="Small input"></lux-input>
                            <lux-select
                                placeholder="Select"
                                .options=${[
                                    { value: '1', label: 'Option 1' },
                                    { value: '2', label: 'Option 2' },
                                ]}
                            ></lux-select>
                        </lux-item-group>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-item-group size="sm">
    <lux-button>Small</lux-button>
    <lux-button>Group</lux-button>
</lux-item-group>

<lux-item-group size="lg">
    <lux-button>Large</lux-button>
    <lux-button>Group</lux-button>
</lux-item-group>

<lux-item-group size="sm">
    <lux-button>Go</lux-button>
    <lux-input placeholder="Small input"></lux-input>
    <lux-select placeholder="Select" .options=${'[{...}]'}></lux-select>
</lux-item-group>`}
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
                            <td><code>vertical</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('itemGroup.prop.vertical')}</td>
                        </tr>
                        <tr>
                            <td><code>block</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('itemGroup.prop.block')}</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td>String</td>
                            <td>—</td>
                            <td>${msg('itemGroup.prop.size')}</td>
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
                            <td><code>default</code></td>
                            <td>${msg('itemGroup.slot.default')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2 style="margin-top:56px">CSS Variables</h2>
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
                            <td><code>--group-radius</code></td>
                            <td><code>6px</code></td>
                            <td>${msg('itemGroup.prop.groupRadius')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsItemGroup;
