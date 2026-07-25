import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-menu.min.js';
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
`;

const basicItems = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'search', label: 'Search', icon: 'search' },
    { key: 'divider1', divider: true },
    { key: 'settings', label: 'Settings', icon: 'settings' },
    { key: 'about', label: 'About', icon: 'info' },
];

const nestedItems = [
    { key: 'home', label: 'Home', icon: 'home' },
    { key: 'divider1', divider: true },
    {
        key: 'settings',
        label: 'Settings',
        icon: 'settings',
        children: [
            { key: 'general', label: 'General', icon: 'home' },
            { key: 'security', label: 'Security', icon: 'lock' },
            { key: 'advanced', label: 'Advanced', icon: 'settings' },
        ],
    },
    {
        key: 'links',
        label: 'Links',
        icon: 'link',
        children: [
            { key: 'github', label: 'GitHub', icon: 'home' },
            { key: 'npm', label: 'npm', icon: 'link' },
        ],
    },
];

class PageComponentsMenu extends LuxElement {
    static styles = styles;

    firstUpdated() {
        // Fallback: set items via JS if .items binding doesn't work
        // across nested Shadow DOM (page → lux-example → lux-menu)
        setTimeout(() => {
            const menus = this.renderRoot.querySelectorAll('lux-menu');
            menus.forEach((menu, i) => {
                if (i === 0 && !menu.items?.length) {
                    menu.items = basicItems;
                    menu.activeKey = 'home';
                }
                if (i === 1 && !menu.items?.length) {
                    menu.items = nestedItems;
                    menu.activeKey = 'home';
                }
            });
        }, 100);
    }

    render() {
        return html`
            <h1>${msg('menu.title')}</h1>
            <p class="subtitle">${msg('menu.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('menu.basic')}</span>
                <div slot="main">
                    <div
                        style="max-width:240px;border:1px solid rgb(var(--lux-border));border-radius:var(--lux-radius);padding:4px;background:rgb(var(--lux-card));"
                    >
                        <lux-menu .items=${basicItems} active-key="home"></lux-menu>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="javascript"
                        code="const items = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'search', label: 'Search', icon: 'search' },
  { key: 'divider1', divider: true },
  { key: 'settings', label: 'Settings', icon: 'settings' },
  { key: 'about', label: 'About', icon: 'info' },
];

html\`<lux-menu .items=\${items} active-key=&quot;home&quot;></lux-menu>\`"
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('menu.nested')}</span>
                <div slot="main">
                    <div
                        style="max-width:240px;border:1px solid rgb(var(--lux-border));border-radius:var(--lux-radius);padding:4px;background:rgb(var(--lux-card));"
                    >
                        <lux-menu .items=${nestedItems} active-key="home"></lux-menu>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="javascript"
                        code="const items = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'divider1', divider: true },
  { key: 'settings', label: 'Settings', icon: 'settings', children: [
    { key: 'general', label: 'General', icon: 'home' },
    { key: 'security', label: 'Security', icon: 'lock' },
  ]},
];"
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
                            <td><code>items</code></td>
                            <td>Array</td>
                            <td>[]</td>
                            <td>${msg('menu.items.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>collapse-width</code></td>
                            <td>Number</td>
                            <td>—</td>
                            <td>${msg('menu.collapseWidth.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>collapsed</code></td>
                            <td>Boolean</td>
                            <td>false</td>
                            <td>${msg('menu.collapsed.prop.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>active-key</code></td>
                            <td>String</td>
                            <td>—</td>
                            <td>${msg('menu.activeKey.desc')}</td>
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
                            <td><code>select</code></td>
                            <td><code>{ key, item }</code></td>
                            <td>${msg('menu.select.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2>${msg('menu.itemSchema')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Type</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>key</code></td>
                            <td>String</td>
                            <td>${msg('menu.itemKey.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>label</code></td>
                            <td>String</td>
                            <td>${msg('menu.itemLabel.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>icon</code></td>
                            <td>String</td>
                            <td>${msg('menu.icon.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>active</code></td>
                            <td>Boolean</td>
                            <td>${msg('menu.active.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td>Boolean</td>
                            <td>${msg('menu.disabled.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>divider</code></td>
                            <td>Boolean</td>
                            <td>${msg('menu.divider.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>children</code></td>
                            <td>Array</td>
                            <td>${msg('menu.children.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsMenu;
