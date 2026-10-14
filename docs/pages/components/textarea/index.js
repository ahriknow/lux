import { html, css, LuxElement, msg } from '../../../lux.min.js';
import '../../../complib/lux-textarea.min.js';
import '../../../complib/lux-example.min.js';
import '../../../complib/lux-code.min.js';
import '../../../complib/lux-table.min.js';

const styles = css`
    :host { display: block; }
    h1 { font-size: 24px; font-weight: 700; color: rgb(var(--lux-text)); margin-bottom: 4px; }
    .subtitle { font-size: 14px; color: rgb(var(--lux-text-secondary)); margin-bottom: 24px; line-height: 1.6; }
    code { font-family: 'SF Mono', Consolas, monospace; font-size: 0.88em; background: rgb(var(--lux-bg)); padding: 2px 6px; border-radius: var(--lux-radius-sm); }
    .demo { max-width: 560px; color: rgb(var(--lux-text)); }
    .meta { margin-top: 10px; font-size: 13px; color: rgb(var(--lux-text-secondary)); }
    .meta b { color: rgb(var(--lux-text)); }
`;

class PageComponentsTextarea extends LuxElement {
    static styles = styles;

    static properties = {
        text: { type: String },
        note: { type: String },
    };

    constructor() {
        super();
        this.text = '';
        this.note = '';
    }

    render() {
        return html`
            <h1>${msg('textarea.title')}</h1>
            <p class="subtitle">${msg('textarea.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('textarea.basic')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-textarea
                            .value=${this.text}
                            placeholder="请输入内容…"
                            rows="4"
                            clearable
                            @input=${(e) => (this.text = e.detail.value)}
                        ></lux-textarea>
                        <div class="meta">${msg('textarea.len')}: <b>${this.text.length}</b></div>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`html\`<lux-textarea
    .value=\${this.text}
    placeholder="请输入内容…"
    rows="4"
    clearable
    maxlength="200"
    @input=\${(e) => (this.text = e.detail.value)}
></lux-textarea>\``}
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
                        <tr><td><code>value</code></td><td>String</td><td><code>""</code></td><td>${msg('textarea.prop.value')}</td></tr>
                        <tr><td><code>placeholder</code></td><td>String</td><td><code>""</code></td><td>${msg('textarea.prop.placeholder')}</td></tr>
                        <tr><td><code>rows</code></td><td>Number</td><td><code>3</code></td><td>${msg('textarea.prop.rows')}</td></tr>
                        <tr><td><code>maxlength</code></td><td>Number</td><td><code>0</code></td><td>${msg('textarea.prop.maxlength')}</td></tr>
                        <tr><td><code>clearable</code></td><td>Boolean</td><td><code>false</code></td><td>${msg('textarea.prop.clearable')}</td></tr>
                        <tr><td><code>autosize</code></td><td>Boolean</td><td><code>false</code></td><td>${msg('textarea.prop.autosize')}</td></tr>
                        <tr><td><code>disabled / readonly</code></td><td>Boolean</td><td><code>false</code></td><td>${msg('textarea.prop.states')}</td></tr>
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
                        <tr><td><code>input</code></td><td><code>{ value }</code></td><td>${msg('textarea.event.input')}</td></tr>
                        <tr><td><code>change</code></td><td><code>{ value }</code></td><td>${msg('textarea.event.change')}</td></tr>
                        <tr><td><code>clear</code></td><td><code>{ value }</code></td><td>${msg('textarea.event.clear')}</td></tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}

export default PageComponentsTextarea;
