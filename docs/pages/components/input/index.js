import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-input.min.js';
import '../../../complib/lux-icon.min.js';
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
    .demo-col {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin: 12px 0;
        color: rgb(var(--lux-text));
        max-width: 360px;
    }
`;

class PageComponentsInput extends LuxElement {
    static styles = styles;
    render() {
        return html`
            <h1>${msg('input.title')}</h1>
            <p class="subtitle">${msg('input.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('input.basic')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-input placeholder="Enter text..."></lux-input>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-input placeholder="Enter text..."></lux-input>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('input.value')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-input placeholder="Controlled value" value="Hello Lux"></lux-input>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-input placeholder="Controlled value" value="Hello Lux"></lux-input>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('input.types')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-input type="text" placeholder="Text"></lux-input>
                        <lux-input type="password" placeholder="Password"></lux-input>
                        <lux-input type="number" placeholder="Number"></lux-input>
                        <lux-input type="email" placeholder="Email"></lux-input>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-input type="text" placeholder="Text"></lux-input>
<lux-input type="password" placeholder="Password"></lux-input>
<lux-input type="number" placeholder="Number"></lux-input>
<lux-input type="email" placeholder="Email"></lux-input>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('input.sizes')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-input size="sm" placeholder="Small"></lux-input>
                        <lux-input placeholder="Medium (default)"></lux-input>
                        <lux-input size="lg" placeholder="Large"></lux-input>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-input size="sm" placeholder="Small"></lux-input>
<lux-input placeholder="Medium (default)"></lux-input>
<lux-input size="lg" placeholder="Large"></lux-input>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('input.clearable')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-input
                            placeholder="Hover to show clear"
                            value="Clear me"
                            clearable
                        ></lux-input>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-input placeholder="Hover to show clear" value="Clear me" clearable></lux-input>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('input.disabled')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-input placeholder="Disabled" disabled></lux-input>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-input placeholder="Disabled" disabled></lux-input>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('input.error')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-input
                            placeholder="Invalid input"
                            error="This field is required"
                        ></lux-input>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-input placeholder="Invalid input" error="This field is required"></lux-input>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('input.status')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-input
                            placeholder="Success"
                            status="success"
                            value="Valid input"
                        ></lux-input>
                        <lux-input placeholder="Info" status="info" value="Information"></lux-input>
                        <lux-input
                            placeholder="Warning"
                            status="warning"
                            value="Check this"
                        ></lux-input>
                        <lux-input placeholder="Error" status="error" value="Invalid"></lux-input>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-input placeholder="Success" status="success" value="Valid input"></lux-input>
<lux-input placeholder="Info" status="info" value="Information"></lux-input>
<lux-input placeholder="Warning" status="warning" value="Check this"></lux-input>
<lux-input placeholder="Error" status="error" value="Invalid"></lux-input>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('input.regex')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-input
                            placeholder="Email (regex)"
                            regex="^[\\w.-]+@[\\w.-]+\\.\\w{2,}$"
                            regex-status="error"
                        ></lux-input>
                        <lux-input
                            placeholder="Phone (regex, warning)"
                            regex="^\\d{10,}$"
                            regex-status="warning"
                        ></lux-input>
                        <lux-input
                            placeholder="Always success"
                            status="success"
                            regex="^\\d+$"
                        ></lux-input>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<!-- Regex: red border when invalid -->
<lux-input placeholder="Email"
  regex="^[\\w.-]+@[\\w.-]+\\.\\w{2,}$"
  regex-status="error">
</lux-input>

<!-- Regex: warning border when invalid -->
<lux-input placeholder="Phone"
  regex="^\\d{10,}$"
  regex-status="warning">
</lux-input>

<!-- status overrides regex-status -->
<lux-input placeholder="Always success"
  status="success"
  regex="^\\d+$">
</lux-input>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('input.prefixSuffix')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-input placeholder="Search...">
                            <lux-icon slot="prefix" name="search" size="16px"></lux-icon>
                        </lux-input>
                        <lux-input placeholder="Enter URL">
                            <span
                                slot="prefix"
                                style="color:rgb(var(--lux-text-muted));font-size:13px"
                                >https://</span
                            >
                        </lux-input>
                        <lux-input placeholder="Amount" value="100">
                            <span
                                slot="suffix"
                                style="color:rgb(var(--lux-text-muted));font-size:13px"
                                >.00</span
                            >
                        </lux-input>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<!-- Prefix with icon -->
<lux-input placeholder="Search...">
  <lux-icon slot="prefix" name="search" size="16px"></lux-icon>
</lux-input>

<!-- Prefix with text -->
<lux-input placeholder="Enter URL">
  <span slot="prefix">https://</span>
</lux-input>

<!-- Suffix with text -->
<lux-input placeholder="Amount" value="100">
  <span slot="suffix">.00</span>
</lux-input>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('input.events')}</span>
                <div slot="main">
                    <div class="demo-col">
                        <lux-input
                            placeholder="Type something..."
                            @input=${(e) => {
                  const log = this.renderRoot.querySelector('#input-event-log');
                  if (log) log.textContent = `input: "${e.detail.value}"`;
              }}
                            @change=${(e) => {
                  const log = this.renderRoot.querySelector('#input-event-log');
                  if (log) log.textContent = `change: "${e.detail.value}"`;
              }}
                        ></lux-input>
                        <span
                            id="input-event-log"
                            style="color:rgb(var(--lux-text-secondary));font-size:13px"
                            >No input yet</span
                        >
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="javascript"
                        .code=${`input.addEventListener('input', (e) => {
  console.log(e.detail.value); // current value on each keystroke
});

input.addEventListener('change', (e) => {
  console.log(e.detail.value); // value on blur or Enter
});`}
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
                            <td><code>value</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('input.value.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>placeholder</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('input.placeholder.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>type</code></td>
                            <td>String</td>
                            <td><code>text</code></td>
                            <td>${msg('input.type.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('input.disabled.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>clearable</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('input.clearable.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>error</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('input.error.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td>String</td>
                            <td><code>md</code></td>
                            <td>${msg('input.size.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>status</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('input.status.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>regex</code></td>
                            <td>String</td>
                            <td><code>''</code></td>
                            <td>${msg('input.regex.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>regex-status</code></td>
                            <td>String</td>
                            <td><code>error</code></td>
                            <td>${msg('input.regexStatus.desc')}</td>
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
                            <td><code>input</code></td>
                            <td>${msg('input.event.input.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>change</code></td>
                            <td>${msg('input.event.change.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>focus</code></td>
                            <td>${msg('input.event.focus.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>blur</code></td>
                            <td>${msg('input.event.blur.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>clear</code></td>
                            <td>${msg('input.event.clear.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2>${msg('common.slots')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('common.slots')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>prefix</code></td>
                            <td>${msg('input.slot.prefix.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>suffix</code></td>
                            <td>${msg('input.slot.suffix.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsInput;
