import { html, css, LuxElement } from '../../lux.min.js';
import { msg } from '../../lux.min.js';
import '../../complib/lux-code.min.js';
import '../../complib/lux-table.min.js';

const styles = css`
    :host {
        display: block;
    }
    h1 {
        font-size: 32px;
        font-weight: 700;
        letter-spacing: -1px;
        margin-bottom: 8px;
        color: rgb(var(--lux-text));
    }
    h2 {
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.5px;
        margin-top: 48px;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgb(var(--lux-border));
        color: rgb(var(--lux-text));
    }
    p {
        color: rgb(var(--lux-text-secondary));
        font-size: 15px;
        margin-bottom: 16px;
        line-height: 1.7;
    }
    code {
        font-family: 'SF Mono', Consolas, monospace;
        font-size: 0.88em;
        background: rgb(var(--lux-bg-alt));
        padding: 2px 6px;
        border-radius: 4px;
    }
    .callout {
        background: rgb(var(--lux-primary-400) / 8%);
        border-left: 3px solid rgb(var(--lux-primary-400));
        border-radius: 0 8px 8px 0;
        padding: 14px 18px;
        margin: 20px 0;
        font-size: 14px;
        color: rgb(var(--lux-text-secondary));
    }
    .callout strong {
        color: rgb(var(--lux-text));
    }
`;

class PageRouter extends LuxElement {
    static styles = styles;

    render() {
        return html`
            <span
                style="display:inline-block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:rgb(var(--lux-primary-400));margin-bottom:12px"
                >Guide</span
            >
            <h1>${msg('router.title')}</h1>
            <p>${msg('router.subtitle')}</p>

            <h2>${msg('router.setup')}</h2>
            <lux-code
                language="javascript"
                .code=${`import { createRouter, LuxElement, html } from '@ahriknow/lux';

class Home extends LuxElement {
  render() {
    return html\`<h1>Home</h1>\`;
  }
}

class UserProfile extends LuxElement {
  static properties = { params: { type: Object } };

  render() {
    return html\`<h1>User #\${this.params.id}</h1>\`;
  }
}

const router = createRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/users/:id', component: UserProfile },
  ]
});`}
                show-header
            ></lux-code>

            <h2>${msg('router.html')}</h2>
            <lux-code
                language="html"
                .code=${`<nav>
  <a href="#/">Home</a>
  <a href="#/users/42">User #42</a>
</nav>
<router-outlet></router-outlet>`}
                show-header
            ></lux-code>

            <h2>${msg('router.nested')}</h2>
            <p>${msg('router.nestedDesc')}</p>
            <lux-code
                language="javascript"
                .code=${`const router = createRouter({
  routes: [
    {
      path: '/',
      component: () => import('./layout.js'),
      redirect: '/home',
      children: [
        { path: '/home', component: () => import('./home.js') },
        { path: '/about', component: () => import('./about.js') },
      ]
    }
  ]
});`}
                show-header
            ></lux-code>

            <h2>${msg('router.features')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('router.feature')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>:id</code></td>
                            <td>${msg('router.feat.params')}</td>
                        </tr>
                        <tr>
                            <td><code>(.*)</code></td>
                            <td>${msg('router.feat.wildcard')}</td>
                        </tr>
                        <tr>
                            <td><code>#/page?x=1</code></td>
                            <td>${msg('router.feat.query')}</td>
                        </tr>
                        <tr>
                            <td><code>component: () => import()</code></td>
                            <td>${msg('router.feat.lazy')}</td>
                        </tr>
                        <tr>
                            <td><code>router.beforeEach()</code></td>
                            <td>${msg('router.feat.guard')}</td>
                        </tr>
                        <tr>
                            <td><code>router.push()</code></td>
                            <td>${msg('router.feat.programmatic')}</td>
                        </tr>
                        <tr>
                            <td><code>redirect</code></td>
                            <td>${msg('router.feat.redirect')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <div class="callout"><strong>Note:</strong> ${msg('router.note')}</div>
        `;
    }
}

export default PageRouter;
