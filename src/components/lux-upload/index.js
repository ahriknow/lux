/**
 * lux-upload — File upload component (drag & drop + click to pick).
 *
 * Value shapes (array of plain objects, controlled via `value`):
 *   upload mode  — { file_id, url, name, size, mime }   ← reference only (no payload in the value)
 *   fallback     — { name, size, type, data }           ← dataURL, used when no `upload` callback
 *
 * Props:
 *   value      — current file list (Array, controlled)
 *   upload     — async (file: File) => meta; called per accepted file instead of
 *                FileReader→dataURL (wire the backend upload here; meta is stored as-is)
 *   accept     — input accept attribute (e.g. 'image/*,video/*')
 *   multiple   — allow multiple files (default true)
 *   disabled   — disable picking / dropping
 *   readonly   — display only (no zone, no remove buttons)
 *   maxSize    — per-file size limit in MB (default 8)
 *   placeholder— dropzone hint text
 *
 * Events: change { value: [...] } — full list after add/remove (bubbles, composed)
 */
import { html, css, LuxElement, registerComponent, when, repeat, msg } from '../../index.js';
import '../lux-icon/index.js';

const styles = css`
    :host {
        display: block;
    }
    .list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 10px;
    }
    .item {
        position: relative;
        width: 116px;
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: 8px;
        overflow: hidden;
        background: rgb(var(--lux-card, 255 255 255));
    }
    .media {
        width: 100%;
        height: 84px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgb(var(--lux-bg, 248 250 252));
        color: rgb(var(--lux-text-secondary, 100 116 139));
        overflow: hidden;
    }
    .media img,
    .media video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
    .meta {
        padding: 5px 7px;
        font-size: 11px;
        line-height: 1.35;
        color: rgb(var(--lux-text-secondary, 100 116 139));
    }
    .meta .nm {
        color: rgb(var(--lux-text, 15 23 42));
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .rm {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 22px;
        height: 22px;
        border: 0;
        border-radius: 6px;
        background: rgb(15 23 42 / 55%);
        color: #fff;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }
    .rm:hover {
        background: rgb(var(--lux-error, 239 68 68));
    }
    .zone {
        border: 1.5px dashed rgb(var(--lux-border, 200 210 224));
        border-radius: 10px;
        padding: 18px 12px;
        text-align: center;
        color: rgb(var(--lux-text-secondary, 100 116 139));
        font-size: 13px;
        cursor: pointer;
        transition: all 0.15s ease;
        background: rgb(var(--lux-bg, 248 250 252) / 60%);
    }
    .zone:hover {
        border-color: rgb(var(--lux-primary-400, 108 92 231));
        color: rgb(var(--lux-primary-400, 108 92 231));
    }
    .zone.over {
        border-color: rgb(var(--lux-primary-500, 99 91 218));
        background: rgb(var(--lux-primary-500, 99 91 218) / 8%);
        color: rgb(var(--lux-primary-500, 99 91 218));
    }
    :host([disabled]) .zone,
    :host([readonly]) .zone {
        opacity: 0.5;
        pointer-events: none;
        cursor: not-allowed;
    }
    .hint {
        margin-top: 6px;
        font-size: 12px;
        color: rgb(var(--lux-error, 239 68 68));
    }
    input[type='file'] {
        display: none;
    }
`;

function fmtSize(n) {
    if (!n && n !== 0) return '';
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function mimeOf(f) {
    if (f.mime) return f.mime;
    if (f.type) return f.type;
    const m = /^data:([^;,]+)/.exec(f.data || '');
    return m ? m[1] : '';
}

class LuxUpload extends LuxElement {
    static styles = styles;

    static properties = {
        value: { type: Array },
        accept: { type: String },
        multiple: { type: Boolean, reflect: true },
        disabled: { type: Boolean, reflect: true },
        readonly: { type: Boolean, reflect: true },
        maxSize: { type: Number, attribute: 'max-size' },
        upload: { type: Function, attribute: false },
        placeholder: { type: String },
        _over: { type: Boolean, state: true },
        _hint: { type: String, state: true },
    };

    constructor() {
        super();
        this.value = [];
        this.accept = '';
        this.multiple = true;
        this.disabled = false;
        this.readonly = false;
        this.maxSize = 8;
        this.upload = null;
        this.placeholder = '';
        this._over = false;
        this._hint = '';
    }

    _emitChange(next) {
        this.value = next;
        this.dispatchEvent(
            new CustomEvent('change', { detail: { value: next }, bubbles: true, composed: true })
        );
    }

    _pick() {
        if (this.disabled || this.readonly) return;
        const input = this.renderRoot.querySelector("input[type='file']");
        if (input) {
            input.value = '';
            input.click();
        }
    }

    async _onFiles(files) {
        if (this.disabled || this.readonly || !files || !files.length) return;
        const list = [...files];
        const accepted = [];
        this._hint = '';
        for (const f of list) {
            if (this.maxSize && f.size > this.maxSize * 1024 * 1024) {
                this._hint = msg('upload.tooLarge', { name: f.name, size: this.maxSize });
                continue;
            }
            accepted.push(f);
        }
        if (!accepted.length) return;
        const picks = this.multiple ? accepted : accepted.slice(0, 1);

        if (typeof this.upload === 'function') {
            // 上传模式：文件交给调用方（如 multipart 到文件服务），value 只存引用
            const settled = await Promise.allSettled(picks.map((f) => this.upload(f)));
            const items = [];
            const failed = [];
            for (let i = 0; i < settled.length; i++) {
                const r = settled[i];
                if (r.status === 'fulfilled' && r.value && r.value.url) {
                    const m = r.value;
                    items.push({
                        file_id: m.file_id ?? null,
                        url: m.url,
                        name: m.name || picks[i].name,
                        size: m.size ?? picks[i].size,
                        mime: m.mime || picks[i].type || '',
                    });
                } else {
                    failed.push(
                        `${picks[i].name}: ${
                            r.status === 'rejected'
                                ? (r.reason && r.reason.message) || msg('upload.failed')
                                : msg('upload.missingUrl')
                        }`
                    );
                }
            }
            if (failed.length) this._hint = failed.join(' · ');
            if (items.length) {
                const base = this.multiple ? this.value || [] : [];
                this._emitChange([...base, ...items]);
            }
            return;
        }

        // 兜底：无 upload 回调时本地转 dataURL（docs demo / 离线用法）
        let pending = picks.length;
        const items = [];
        const done = () => {
            if (--pending > 0) return;
            const base = this.multiple ? this.value || [] : [];
            this._emitChange([...base, ...items]);
        };
        for (const f of picks) {
            const r = new FileReader();
            r.onload = () => {
                items.push({
                    name: f.name,
                    size: f.size,
                    type: f.type || '',
                    data: String(r.result),
                });
                done();
            };
            r.onerror = () => done();
            r.readAsDataURL(f);
        }
    }

    _remove(item) {
        if (this.readonly) return;
        const next = (this.value || []).filter((x) => x !== item);
        this._emitChange(next);
    }

    _onDrop(e) {
        e.preventDefault();
        this._over = false;
        this._onFiles(e.dataTransfer && e.dataTransfer.files);
    }

    render() {
        const items = this.value || [];
        const zone = this.readonly
            ? ''
            : html`
                  <div
                      class=${this._over ? 'zone over' : 'zone'}
                      @click=${() => this._pick()}
                      @dragover=${(e) => {
                          e.preventDefault();
                          if (!this.disabled) this._over = true;
                      }}
                      @dragleave=${() => (this._over = false)}
                      @drop=${(e) => this._onDrop(e)}
                  >
                      ${this.placeholder || msg('upload.placeholder')}
                      <div style="margin-top:4px;font-size:12px;opacity:.75">
                          ${this.accept ? msg('upload.supports', { accept: this.accept }) : ''}${msg('upload.singleLimit', { size: this.maxSize })}${this.multiple ? msg('upload.multiple') : ''}
                      </div>
                      <input
                          type="file"
                          .accept=${this.accept}
                          ?multiple=${this.multiple}
                          @change=${(e) => this._onFiles(e.target.files)}
                      />
                  </div>
                  ${when(!!this._hint, () => html`<div class="hint">${this._hint}</div>`)}
              `;

        return html`
            ${when(
                items.length > 0,
                () => html`
                    <div class="list">
                        ${repeat(
                            items,
                            (f) => `${f.name}:${f.file_id ?? f.url ?? (f.data || '').length}`,
                            (f) => {
                                const mime = mimeOf(f);
                                const isImg = mime.startsWith('image/');
                                const isVid = mime.startsWith('video/');
                                return html`
                                    <div class="item">
                                        <div class="media">
                                            ${
                                                isImg
                                                    ? html`<img
                                                          .src=${f.url || f.data}
                                                          alt=${f.name}
                                                      />`
                                                    : isVid
                                                      ? html`<video
                                                            .src=${f.url || f.data}
                                                            controls
                                                            preload="metadata"
                                                        ></video>`
                                                      : html`<lux-icon
                                                            name="description"
                                                            size="26px"
                                                        ></lux-icon>`
                                            }
                                        </div>
                                        <div class="meta">
                                            <div class="nm" title=${f.name}>${f.name}</div>
                                            <div>${fmtSize(f.size)}</div>
                                        </div>
                                        ${when(
                                            !this.readonly,
                                            () => html`
                                                <button
                                                    class="rm"
                                                    type="button"
                                                    aria-label=${msg('upload.remove')}
                                                    @click=${() => this._remove(f)}
                                                >
                                                    <lux-icon name="close" size="14px"></lux-icon>
                                                </button>
                                            `
                                        )}
                                    </div>
                                `;
                            }
                        )}
                    </div>
                `
            )}
            ${zone}
        `;
    }
}

registerComponent('lux-upload', LuxUpload);
export default LuxUpload;
