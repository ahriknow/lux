import { html, css, LuxElement, msg } from '../../../lux.min.js';
import '../../../complib/lux-color-picker.min.js';
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
    .demo {
        max-width: 560px;
        color: rgb(var(--lux-text));
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
    }
    .meta {
        font-size: 13px;
        color: rgb(var(--lux-text-secondary));
    }
    .meta b {
        color: rgb(var(--lux-text));
        font-family: 'SF Mono', Consolas, monospace;
    }
    .preview {
        width: 34px;
        height: 26px;
        border-radius: 6px;
        border: 1px solid rgb(var(--lux-border));
    }
    .swatches {
        display: flex;
        gap: 8px;
    }
    .swatches button {
        width: 34px;
        height: 26px;
        border-radius: 6px;
        border: 1px solid rgb(15 23 42 / 12%);
        cursor: pointer;
        padding: 0;
    }
    .swatches button.on {
        outline: 2px solid rgb(var(--lux-primary-500));
        outline-offset: 1px;
    }
`;

const SMALL_PALETTE = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#0f172a'];

class PageComponentsColorPicker extends LuxElement {
    static styles = styles;

    static properties = {
        color: { type: String },
        brand: { type: String },
        lastEvent: { type: String },
    };

    constructor() {
        super();
        this.color = '#6366f1';
        this.brand = '#22c55e';
        this.lastEvent = '—';
    }

    render() {
        return html`
            <h1>${msg('color.title')}</h1>
            <p class="subtitle">${msg('color.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('color.basic')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-color-picker
                            .value=${this.color}
                            @change=${(e) => {
                                this.color = e.detail.value;
                                this.lastEvent = e.detail.value;
                            }}
                        ></lux-color-picker>
                        <span class="preview" .style=${`background:${this.color}`}></span>
                        <span class="meta"
                            >value: <b>${this.color}</b> · @change: <b>${this.lastEvent}</b></span
                        >
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`html\`<lux-color-picker
    .value=\${this.color}
    @change=\${(e) => (this.color = e.detail.value)}
></lux-color-picker>\``}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('color.customPalette')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-color-picker
                            .value=${this.brand}
                            .palette=${SMALL_PALETTE}
                            @change=${(e) => (this.brand = e.detail.value)}
                        ></lux-color-picker>
                        <span class="preview" .style=${`background:${this.brand}`}></span>
                        <span class="meta"
                            >palette × ${SMALL_PALETTE.length} · value: <b>${this.brand}</b></span
                        >
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`// 预设色板可整体替换（hex 字符串数组）
html\`<lux-color-picker .palette=\${['#ef4444','#f59e0b','#22c55e']} …></lux-color-picker>\``}
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
                            <td><code>value</code></td>
                            <td>String</td>
                            <td><code>""</code></td>
                            <td>${msg('color.prop.value')}</td>
                        </tr>
                        <tr>
                            <td><code>palette</code></td>
                            <td>Array</td>
                            <td><code>${msg('demo.colorCount')}</code></td>
                            <td>${msg('color.prop.palette')}</td>
                        </tr>
                        <tr>
                            <td><code>placeholder</code></td>
                            <td>String</td>
                            <td><code>—</code></td>
                            <td>${msg('color.prop.placeholder')}</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('color.prop.disabled')}</td>
                        </tr>
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
                        <tr>
                            <td><code>change</code></td>
                            <td><code>{ value }</code></td>
                            <td>${msg('color.event.change')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}

export default PageComponentsColorPicker;
