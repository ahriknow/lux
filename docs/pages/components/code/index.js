import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-code.min.js';
import '../../../complib/lux-example.min.js';
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
        border-radius: 4px;
    }
`;

const basicCode = `const greeting = 'Hello, Lux!';
console.log(greeting);`;

const basicCodeHtml = `<lux-code code="const greeting = 'Hello, Lux!';
console.log(greeting);"></lux-code>`;

const cssCode = `:host {
  display: block;
  padding: 16px;
  color: var(--text);
}`;

const cssCodeHtml = `<lux-code language="css" code=":host {
  display: block;
  padding: 16px;
  color: var(--text);
}"></lux-code>`;

const headerCode = `import { html, LuxElement } from '@ahriknow/lux';

class MyComponent extends LuxElement {
  render() {
    return html\`<div>Hello World</div>\`;
  }
}`;

const headerCodeHtml = `<lux-code language="javascript" show-header
  code="import { html, LuxElement } from '@ahriknow/lux';

class MyComponent extends LuxElement {
  render() {
    return html\`<div>Hello World</div>\`;
  }
}"></lux-code>`;

const scrollCode = `import { html, css, LuxElement, registerComponent } from '@ahriknow/lux';

const styles = css\`
  :host { display: block; }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--lux-card);
    border-bottom: 1px solid var(--lux-border);
  }
  .title { font-size: 16px; font-weight: 600; }
  .content { padding: 16px; }
  .footer {
    padding: 12px 16px;
    border-top: 1px solid var(--lux-border);
    font-size: 13px;
    color: var(--lux-text-muted);
  }
\`;

class LuxExample extends LuxElement {
  static styles = styles;
  static properties = {
    expanded: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.expanded = false;
  }

  _toggle() {
    this.expanded = !this.expanded;
  }

  render() {
    return html\`
      <div class="header" @click=\${() => this._toggle()}>
        <span class="title"><slot name="heading"></slot></span>
      </div>
      <div class="main">
        <slot name="main"></slot>
      </div>
      <div class="footer" style="\${this.expanded ? '' : 'display:none'}">
        <slot name="footer"></slot>
      </div>
    \`;
  }
}

registerComponent('lux-example', LuxExample);`;

const scrollCodeHtml = `<lux-code style="height: 300px" show-header language="javascript" code="import { html, css, LuxElement, registerComponent } from '@ahriknow/lux';

const styles = css\`
  :host { display: block; }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--lux-card);
    border-bottom: 1px solid var(--lux-border);
  }
  .title { font-size: 16px; font-weight: 600; }
  .content { padding: 16px; }
  .footer {
    padding: 12px 16px;
    border-top: 1px solid var(--lux-border);
    font-size: 13px;
    color: var(--lux-text-muted);
  }
\`;

class LuxExample extends LuxElement {
  static styles = styles;
  static properties = {
    expanded: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.expanded = false;
  }

  _toggle() {
    this.expanded = !this.expanded;
  }

  render() {
    return html\`
      &lt;div class=&quot;header&quot; @click=\${() => this._toggle()}&gt;
        &lt;span class=&quot;title&quot;&gt;&lt;slot name=&quot;heading&quot;&gt;&lt;/slot&gt;&lt;/span&gt;
      &lt;/div&gt;
      &lt;div class=&quot;main&quot;&gt;
        &lt;slot name=&quot;main&quot;&gt;&lt;/slot&gt;
      &lt;/div&gt;
      &lt;div class=&quot;footer&quot; style=&quot;\${this.expanded ? '' : 'display:none'}&quot;&gt;
        &lt;slot name=&quot;footer&quot;&gt;&lt;/slot&gt;
      &lt;/div&gt;
    \`;
  }
}

registerComponent('lux-example', LuxExample);"></lux-code>`;

const hscrollCode = `const router = createRouter({ routes: [{ path: '/', component: HomePage, redirect: '/home', children: [{ path: '/home', component: Home }, { path: '/about', component: About }, { path: '/contact', component: Contact }, { path: '/blog', component: Blog }, { path: '/blog/:id', component: BlogPost }, { path: '/settings', component: Settings, children: [{ path: '/general', component: General }, { path: '/security', component: Security }, { path: '/notifications', component: Notifications }] }] }]);`;

const hscrollCodeHtml = `<lux-code language="javascript" code="const router = createRouter({ routes: [{ path: '/', component: HomePage, redirect: '/home', children: [{ path: '/home', component: Home }, { path: '/about', component: About }, { path: '/contact', component: Contact }, { path: '/blog', component: Blog }, { path: '/blog/:id', component: BlogPost }, { path: '/settings', component: Settings, children: [{ path: '/general', component: General }, { path: '/security', component: Security }, { path: '/notifications', component: Notifications }] }] }]);"></lux-code>`;

class PageComponentsCode extends LuxElement {
    static styles = styles;
    render() {
        return html`
            <h1>${msg('code.title')}</h1>
            <p class="subtitle">${msg('code.subtitle')}</p>

            <lux-example
                ><span slot="heading">${msg('code.basic')}</span>
                <div slot="main">
                    <lux-code .code=${basicCode}></lux-code>
                </div>
                <div slot="footer">
                    <lux-code language="html" .code=${basicCodeHtml} show-header></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('code.language')}</span>
                <div slot="main">
                    <lux-code language="css" .code=${cssCode}></lux-code>
                </div>
                <div slot="footer">
                    <lux-code language="html" .code=${cssCodeHtml} show-header></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('code.header')}</span>
                <div slot="main">
                    <lux-code language="javascript" .code=${headerCode} show-header></lux-code>
                </div>
                <div slot="footer">
                    <lux-code language="html" .code=${headerCodeHtml} show-header></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('code.scroll')}</span>
                <div slot="main">
                    <lux-code
                        style="height: 300px"
                        show-header
                        language="javascript"
                        .code=${scrollCode}
                    ></lux-code>
                </div>
                <div slot="footer">
                    <lux-code language="html" .code=${scrollCodeHtml} show-header></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('code.hscroll')}</span>
                <div slot="main">
                    <lux-code language="javascript" .code=${hscrollCode}></lux-code>
                </div>
                <div slot="footer">
                    <lux-code language="html" .code=${hscrollCodeHtml} show-header></lux-code>
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
                            <td><code>code</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('code.code.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>language</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('code.language.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>show-header</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('code.showHeader.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>show-language</code></td>
                            <td>Boolean</td>
                            <td><code>true</code></td>
                            <td>${msg('code.showLanguage.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>show-copy</code></td>
                            <td>Boolean</td>
                            <td><code>true</code></td>
                            <td>${msg('code.showCopy.desc')}</td>
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
                            <td><code>copy</code></td>
                            <td><code>{ code: string }</code></td>
                            <td>${msg('code.copy.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsCode;
