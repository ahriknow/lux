import { html, css, LuxElement, msg } from '../../../lux.min.js';
import '../../../complib/lux-tree.min.js';
import '../../../complib/lux-example.min.js';
import '../../../complib/lux-code.min.js';
import '../../../complib/lux-button.min.js';

const styles = css`
    :host { display: block; }
    h1 { font-size: 24px; font-weight: 700; color: rgb(var(--lux-text)); margin-bottom: 4px; }
    .subtitle { font-size: 14px; color: rgb(var(--lux-text-secondary)); margin-bottom: 24px; line-height: 1.6; }
    code { font-family: 'SF Mono', Consolas, monospace; font-size: 0.88em; background: rgb(var(--lux-bg)); padding: 2px 6px; border-radius: var(--lux-radius-sm); }
    .demo { max-width: 520px; color: rgb(var(--lux-text)); }
    .meta { margin-top: 10px; font-size: 13px; color: rgb(var(--lux-text-secondary)); }
    .meta b { color: rgb(var(--lux-text)); }
    lux-tree { border: 1px solid rgb(var(--lux-border)); border-radius: 8px; padding: 8px; background: rgb(var(--lux-card)); }
`;

const TREE_DATA = [
    {
        id: '1',
        label: '技术部',
        children: [
            {
                id: '1-1',
                label: '后端组',
                children: [
                    { id: '1-1-1', label: '平台小组', children: [{ id: '1-1-1-1', label: '存储小组' }] },
                    { id: '1-1-2', label: '业务小组' },
                ],
            },
            { id: '1-2', label: '前端组' },
        ],
    },
    { id: '2', label: '产品部', children: [{ id: '2-1', label: '设计组' }] },
    { id: '3', label: '销售部', disabled: true },
];

const MENU = [
    { key: 'add', label: '新建子部门' },
    { key: 'rename', label: '重命名' },
    { divider: true },
    { key: 'move', label: '移动到…' },
    { divider: true },
    { key: 'delete', label: '删除', danger: true },
];

class PageComponentsTree extends LuxElement {
    static styles = styles;

    static properties = {
        selected: { type: String },
        lastAction: { type: String },
    };

    constructor() {
        super();
        this.selected = '';
        this.lastAction = '—';
        this.treeData = TREE_DATA;
        this.menu = MENU;
    }

    render() {
        return html`
            <h1>${msg('tree.title')}</h1>
            <p class="subtitle">${msg('tree.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('tree.basic')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-tree
                            .data=${this.treeData}
                            .selected=${this.selected}
                            expand-all
                            @select=${(e) => {
                                this.selected = String(e.detail.id);
                                this.lastAction = `select → ${e.detail.node.label}`;
                            }}
                            @toggle=${(e) => {
                                this.lastAction = `toggle → ${e.detail.id} ${e.detail.expanded ? 'open' : 'close'}`;
                            }}
                        ></lux-tree>
                        <div class="meta">${msg('tree.selected')}: <b>${this.selected || '—'}</b> · ${this.lastAction}</div>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`html\`<lux-tree
    .data=\${[{ id: '1', label: 'Root', children: [{ id: '1-1', label: 'Child' }] }]}
    expand-all
    @select=\${(e) => console.log(e.detail.id)}
></lux-tree>\``}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('tree.context')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-tree
                            .data=${this.treeData}
                            .contextMenu=${this.menu}
                            @menu-select=${(e) => {
                                this.lastAction = `menu → ${e.detail.key} @ ${e.detail.node?.label ?? ''}`;
                            }}
                            @contextmenu=${(e) => {
                                this.lastAction = `contextmenu → ${e.detail.node.label}`;
                            }}
                        ></lux-tree>
                        <div class="meta">${msg('tree.tryRight')}: <b>${this.lastAction}</b></div>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`html\`<lux-tree
    .data=\${nodes}
    .contextMenu=\${[
        { key: 'add', label: 'Add child' },
        { key: 'rename', label: 'Rename' },
        { divider: true },
        { key: 'delete', label: 'Delete', danger: true },
    ]}
    @menu-select=\${(e) => console.log(e.detail.key, e.detail.id)}
></lux-tree>\``}
                    ></lux-code>
                </div>
            </lux-example>
        `;
    }
}

registerComponent('page-components-tree', PageComponentsTree);
export default PageComponentsTree;
