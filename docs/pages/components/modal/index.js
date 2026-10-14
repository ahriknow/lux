import { html, css, LuxElement, msg } from '../../../lux.min.js';
import '../../../complib/lux-modal.min.js';
import '../../../complib/lux-example.min.js';
import '../../../complib/lux-code.min.js';
import '../../../complib/lux-button.min.js';
import '../../../complib/lux-input.min.js';
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
    .meta {
        margin-top: 10px;
        font-size: 13px;
        color: rgb(var(--lux-text-secondary));
    }
    .meta b {
        color: rgb(var(--lux-text));
    }
`;

class PageComponentsModal extends LuxElement {
    static styles = styles;

    static properties = {
        open: { type: Boolean },
        text: { type: String },
        lastEvent: { type: String },
        open2: { type: Boolean },
    };

    constructor() {
        super();
        this.open = false;
        this.text = '草稿内容（关闭 × 后保留）';
        this.lastEvent = '—';
        this.open2 = false;
    }

    render() {
        return html`
            <h1>${msg('modal.title')}</h1>
            <p class="subtitle">${msg('modal.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('modal.basic')}</span>
                <div slot="main">
                    <lux-button variant="primary" @click=${() => (this.open = true)}>
                        ${msg('modal.openBtn')}
                    </lux-button>
                    <div class="meta">
                        ${msg('modal.lastEvent')}: <b>${this.lastEvent}</b> ·
                        ${msg('modal.content')}: <b>${this.text}</b>
                    </div>
                    <lux-modal
                        .open=${this.open}
                        title="新建工作项"
                        width="520px"
                        @close=${() => {
                            this.open = false;
                            this.lastEvent = 'close（× / 遮罩 / Esc — 内容保留）';
                        }}
                        @cancel=${() => {
                            this.open = false;
                            this.text = '';
                            this.lastEvent = 'cancel（取消 — 内容清空）';
                        }}
                        @confirm=${() => {
                            this.open = false;
                            this.lastEvent = `confirm（确定 — 提交「${this.text}」后清空）`;
                            this.text = '';
                        }}
                    >
                        <div style="display:flex;gap:10px;align-items:center">
                            <span>${msg('modal.titleLabel')}</span>
                            <lux-input .value=${this.text} @input=${(e) => (this.text = e.detail.value)}></lux-input>
                        </div>
                    </lux-modal>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`html\`<lux-modal
    .open=\${open}
    title="新建工作项"
    width="520px"
    @close=\${() => (open = false)}          // × / 遮罩 / Esc — 保留输入
    @cancel=\${() => { open = false; reset(); }} // 取消 — 清空输入
    @confirm=\${() => submit()}              // 确定
>
    <lux-input .value=\${text}></lux-input>
</lux-modal>\``}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('modal.control')}</span>
                <div slot="main">
                    <lux-button @click=${() => (this.open2 = true)}>${msg('modal.openBtn')}</lux-button>
                    <lux-modal
                        .open=${this.open2}
                        .closable=${false}
                        .hideFooter=${true}
                        title="closable=false · hide-footer"
                        width="420px"
                        @close=${() => (this.open2 = false)}
                    >
                        <p>${msg('modal.noX')}</p>
                        <p>
                            <lux-button variant="primary" @click=${() => (this.open2 = false)}>
                                ${msg('modal.closeBtn')}
                            </lux-button>
                        </p>
                    </lux-modal>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`html\`<lux-modal
    .open=\${open}
    .closable=\${false}     // 隐藏右上角 ×（Esc / 遮罩仍生效）
    .hideFooter=\${true}    // 无底部按钮，内容区自带操作
    title="自定义操作"
>…</lux-modal>\``}
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
                        <tr><td><code>open</code></td><td>Boolean</td><td><code>false</code></td><td>${msg('modal.prop.open')}</td></tr>
                        <tr><td><code>title</code></td><td>String</td><td><code>""</code></td><td>${msg('modal.prop.title')}</td></tr>
                        <tr><td><code>width</code></td><td>String</td><td><code>"480px"</code></td><td>${msg('modal.prop.width')}</td></tr>
                        <tr><td><code>closable</code></td><td>Boolean</td><td><code>true</code></td><td>${msg('modal.prop.closable')}</td></tr>
                        <tr><td><code>mask-closable</code></td><td>Boolean</td><td><code>true</code></td><td>${msg('modal.prop.mask')}</td></tr>
                        <tr><td><code>hide-footer</code></td><td>Boolean</td><td><code>false</code></td><td>${msg('modal.prop.hideFooter')}</td></tr>
                        <tr><td><code>confirm-text / cancel-text</code></td><td>String</td><td><code>确定/取消</code></td><td>${msg('modal.prop.texts')}</td></tr>
                        <tr><td><code>loading</code></td><td>Boolean</td><td><code>false</code></td><td>${msg('modal.prop.loading')}</td></tr>
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
                        <tr><td><code>close</code></td><td>—</td><td>${msg('modal.event.close')}</td></tr>
                        <tr><td><code>cancel</code></td><td>—</td><td>${msg('modal.event.cancel')}</td></tr>
                        <tr><td><code>confirm</code></td><td>—</td><td>${msg('modal.event.confirm')}</td></tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}

export default PageComponentsModal;
