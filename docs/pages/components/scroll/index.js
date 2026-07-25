import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
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

    .scroll-demo {
        border: 1px solid rgb(var(--lux-border));
        border-radius: var(--lux-radius);
        overflow: hidden;
    }

    .scroll-demo-btn {
        padding: 6px 14px;
        border: 1px solid rgb(var(--lux-border));
        border-radius: var(--lux-radius-sm);
        background: rgb(var(--lux-card));
        color: rgb(var(--lux-text));
        font-size: 13px;
        cursor: pointer;
        transition: all 0.15s ease;
    }
    .scroll-demo-btn:hover {
        background: rgb(var(--lux-primary-400, 129 120 247));
        color: #fff;
        border-color: rgb(var(--lux-primary-400, 129 120 247));
    }
`;

class PageComponentsScroll extends LuxElement {
    static styles = styles;
    render() {
        const items = Array.from({ length: 30 }, (_, i) => i + 1);
        return html`
            <h1>${msg('scroll.title')}</h1>
            <p class="subtitle">${msg('scroll.subtitle')}</p>

            <lux-example
                ><span slot="heading">${msg('scroll.basic')}</span>
                <div slot="main">
                    <div class="scroll-demo">
                        <lux-scroll height="200px">
                            ${items.map((i) => html`<div style="padding:10px 16px;border-bottom:1px solid rgb(var(--lux-border))">Item ${i}</div>`)}
                        </lux-scroll>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-scroll height="200px">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
</lux-scroll>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('scroll.buttons')}</span>
                <div slot="main">
                    <div class="scroll-demo">
                        <lux-scroll height="200px" show-buttons>
                            ${items.map((i) => html`<div style="padding:10px 16px;border-bottom:1px solid rgb(var(--lux-border))">Item ${i}</div>`)}
                        </lux-scroll>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-scroll height="200px" show-buttons>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
</lux-scroll>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('scroll.fixed')}</span>
                <div slot="main">
                    <div class="scroll-demo">
                        <lux-scroll height="160px">
                            ${items.map((i) => html`<div style="padding:8px 16px;border-bottom:1px solid rgb(var(--lux-border));font-size:13px">Row ${i} — scroll down to see more content inside this fixed-height container.</div>`)}
                        </lux-scroll>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-scroll height="160px">
  <div>Row 1</div>
  <div>Row 2</div>
  <div>Row 3</div>
  <div>Row 4</div>
  <div>Row 5</div>
</lux-scroll>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('scroll.programmatic')}</span>
                <div slot="main">
                    <div style="display:flex;gap:8px;margin-bottom:8px">
                        <button
                            class="scroll-demo-btn"
                            @click=${() => this.renderRoot.querySelector('#prog-scroll')?.scrollToTop()}
                        >
                            ${msg('scroll.scrollToTop')}
                        </button>
                        <button
                            class="scroll-demo-btn"
                            @click=${() => this.renderRoot.querySelector('#prog-scroll')?.scrollToBottom()}
                        >
                            ${msg('scroll.scrollToBottom')}
                        </button>
                    </div>
                    <div class="scroll-demo">
                        <lux-scroll id="prog-scroll" height="200px" show-buttons>
                            ${items.map((i) => html`<div style="padding:10px 16px;border-bottom:1px solid rgb(var(--lux-border))">Item ${i}</div>`)}
                        </lux-scroll>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<script>
  const scroll = document.querySelector('lux-scroll');
  scroll.scrollToTop();
  scroll.scrollToBottom();
</script>

<lux-scroll height="200px" show-buttons>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
</lux-scroll>`}
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
                            <td><code>height</code></td>
                            <td>String</td>
                            <td><code>100%</code></td>
                            <td>${msg('scroll.height.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>width</code></td>
                            <td>String</td>
                            <td><code>100%</code></td>
                            <td>${msg('scroll.width.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>show-buttons</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('scroll.showButtons.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('scroll.disabled.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2>${msg('scroll.methods')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('scroll.methods')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>scrollToTop()</code></td>
                            <td>${msg('scroll.scrollToTop.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>scrollToBottom()</code></td>
                            <td>${msg('scroll.scrollToBottom.desc')}</td>
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
                            <td><em>default</em></td>
                            <td>${msg('scroll.slots.default.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}
export default PageComponentsScroll;
