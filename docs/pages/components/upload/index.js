import { html, css, LuxElement, msg } from '../../../lux.min.js';
import '../../../complib/lux-upload.min.js';
import '../../../complib/lux-example.min.js';
import '../../../complib/lux-code.min.js';
import '../../../complib/lux-button.min.js';
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
    }
    .meta {
        margin-top: 10px;
        font-size: 13px;
        color: rgb(var(--lux-text-secondary));
    }
    .meta b {
        color: rgb(var(--lux-text));
    }
`;

const TINY_PNG =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

class PageComponentsUpload extends LuxElement {
    static styles = styles;

    static properties = {
        files: { type: Array },
        lastEvent: { type: String },
    };

    constructor() {
        super();
        this.files = [];
        this.lastEvent = '—';
        this.demoReadonly = [
            { name: msg('upload.demo.diagram'), size: 2048, type: 'image/png', data: TINY_PNG },
            {
                name: msg('upload.demo.minutes'),
                size: 148000,
                type: 'application/pdf',
                data: 'data:application/pdf;base64,JVBERi0xLjQK',
            },
        ];
    }

    render() {
        return html`
            <h1>${msg('upload.title')}</h1>
            <p class="subtitle">${msg('upload.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('upload.basic')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-upload
                            .value=${this.files}
                            @change=${(e) => {
                                this.files = e.detail.value;
                                this.lastEvent = `change × ${this.files.length}`;
                            }}
                        ></lux-upload>
                        <div class="meta">
                            ${msg('upload.count')}: <b>${this.files.length}</b> ·
                            ${msg('upload.lastEvent')}: <b>${this.lastEvent}</b>
                        </div>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`html\`<lux-upload
    .value=\${this.files}
    accept="image/*,video/*"
    @change=\${(e) => (this.files = e.detail.value)}
></lux-upload>\``}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('upload.readonly')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-upload .value=${this.demoReadonly} readonly></lux-upload>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`// readonly：仅展示——图片直接预览、视频可播放、其他文件显示图标
html\`<lux-upload .value=\${files} readonly></lux-upload>\``}
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
                            <td>Array</td>
                            <td><code>[]</code></td>
                            <td>${msg('upload.prop.value')}</td>
                        </tr>
                        <tr>
                            <td><code>accept</code></td>
                            <td>String</td>
                            <td><code>""</code></td>
                            <td>${msg('upload.prop.accept')}</td>
                        </tr>
                        <tr>
                            <td><code>multiple</code></td>
                            <td>Boolean</td>
                            <td><code>true</code></td>
                            <td>${msg('upload.prop.multiple')}</td>
                        </tr>
                        <tr>
                            <td><code>max-size</code></td>
                            <td>Number</td>
                            <td><code>8</code></td>
                            <td>${msg('upload.prop.maxSize')}</td>
                        </tr>
                        <tr>
                            <td><code>readonly / disabled</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('upload.prop.readonly')}</td>
                        </tr>
                        <tr>
                            <td><code>upload</code></td>
                            <td>Function</td>
                            <td><code>null</code></td>
                            <td>${msg('upload.prop.upload')}</td>
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
                            <td>${msg('upload.event.change')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}

export default PageComponentsUpload;
