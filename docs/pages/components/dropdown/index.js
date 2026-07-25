import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-dropdown.min.js';
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
    .demo-row {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        margin: 12px 0;
        color: rgb(var(--lux-text));
    }
`;

const fruitOpts = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
];

const progOpts = [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
];

const eventOpts = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
];

class PageComponentsDropdown extends LuxElement {
    static styles = styles;

    firstUpdated() {
        const dd = this.renderRoot.querySelector('#dd-prog');
        if (dd) dd.options = progOpts;
    }

    render() {
        return html`
            <h1>${msg('dd.title')}</h1>
            <p class="subtitle">${msg('dd.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('dd.basic')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-dropdown
                            .options=${fruitOpts}
                            placeholder="Select fruit..."
                        ></lux-dropdown>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        code='<lux-dropdown .options=\${options} placeholder="Select fruit...">
</lux-dropdown>'
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('dd.programmatic')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-dropdown id="dd-prog" placeholder="Select..."></lux-dropdown>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="javascript"
                        code="const dd = document.querySelector('#dd-prog');
dd.options = [
  { value: 1, label: 'First' },
  { value: 2, label: 'Second' },
  { value: 3, label: 'Third' }
];
dd.value = 2;"
                    ></lux-code>
                </div>
            </lux-example>

            <p>${msg('dd.events.desc')}</p>
            <lux-example>
                <span slot="heading">${msg('dd.events')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-dropdown
                            .options=${eventOpts}
                            placeholder="Select..."
                            @change=${(e) => {
                  const log = this.renderRoot.querySelector('#dd-event-log');
                  if (log) log.textContent = `value: ${e.detail.value}, label: ${e.detail.label}`;
              }}
                        ></lux-dropdown>
                        <span
                            id="dd-event-log"
                            style="color:rgb(var(--lux-text-secondary));font-size:13px;"
                            >No selection yet</span
                        >
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="javascript"
                        code="dd.addEventListener('change', (e) => {
  console.log(e.detail.value);  // selected value
  console.log(e.detail.label); // display label
});"
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('dd.clearable')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-dropdown
                            .options=${fruitOpts}
                            placeholder="Select fruit..."
                            clearable
                        ></lux-dropdown>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        code='<lux-dropdown .options=\${options} placeholder="Select fruit..." clearable>
</lux-dropdown>'
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('dd.size')}</span>
                <div slot="main">
                    <div class="demo-row" style="align-items:center">
                        <lux-dropdown
                            .options=${fruitOpts}
                            placeholder="Small"
                            size="sm"
                        ></lux-dropdown>
                        <lux-dropdown .options=${fruitOpts} placeholder="Medium"></lux-dropdown>
                        <lux-dropdown
                            .options=${fruitOpts}
                            placeholder="Large"
                            size="lg"
                        ></lux-dropdown>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-dropdown .options=\${options} placeholder="Small" size="sm"></lux-dropdown>
<lux-dropdown .options=\${options} placeholder="Medium"></lux-dropdown>
<lux-dropdown .options=\${options} placeholder="Large" size="lg"></lux-dropdown>`}
                    ></lux-code>
                </div>
            </lux-example>

            <h2>${msg('common.props')}</h2>
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
                            <td><code>options</code></td>
                            <td>${msg('dd.options.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>value</code></td>
                            <td>${msg('dd.value.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>placeholder</code></td>
                            <td>${msg('dd.placeholder.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>clearable</code></td>
                            <td>${msg('dd.clearable.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>open</code></td>
                            <td>${msg('dd.open.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td>${msg('dd.size.desc')}</td>
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
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>change</code></td>
                            <td>${msg('dd.change.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>clear</code></td>
                            <td>${msg('dd.clear.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}

export default PageComponentsDropdown;
