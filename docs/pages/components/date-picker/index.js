import { html, css, LuxElement, msg } from '../../../lux.min.js';
import '../../../complib/lux-date-picker.min.js';
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
    .row {
        display: flex;
        flex-wrap: wrap;
        gap: 18px 28px;
        color: rgb(var(--lux-text));
        align-items: center;
    }
    .cell {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .cell .lab {
        font-size: 12.5px;
        color: rgb(var(--lux-text-secondary));
    }
    .cell .val {
        font-size: 12px;
        color: rgb(var(--lux-text-muted));
        font-family: 'SF Mono', Consolas, monospace;
        min-height: 16px;
    }
`;

class PageComponentsDatePicker extends LuxElement {
    static styles = styles;

    static properties = {
        d: { type: Object },
        t: { type: Object },
        dt: { type: Object },
        dr: { type: Object },
        dtr: { type: Object },
    };

    constructor() {
        super();
        const now = Math.floor(Date.now() / 1000);
        this.d = now;
        this.t = now;
        this.dt = now;
        this.dr = [now - 3 * 86400, now + 5 * 86400];
        this.dtr = [now - 3600, now + 7200];
    }

    _set(key) {
        return (e) => {
            this[key] = e.detail.value;
            this.requestUpdate();
        };
    }

    _fmtSingle(sec) {
        return typeof sec === 'number' ? String(sec) : 'null';
    }

    _fmtRange(v) {
        return Array.isArray(v) ? `[${v[0]}, ${v[1]}]` : 'null';
    }

    render() {
        return html`
            <h1>${msg('date.title')}</h1>
            <p class="subtitle">${msg('date.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('date.modes')}</span>
                <div slot="main">
                    <div class="row">
                        <div class="cell">
                            <span class="lab">mode="date"</span>
                            <lux-date-picker
                                mode="date"
                                .value=${this.d}
                                @change=${this._set('d')}
                            ></lux-date-picker>
                            <span class="val">${this._fmtSingle(this.d)}</span>
                        </div>
                        <div class="cell">
                            <span class="lab">mode="time"</span>
                            <lux-date-picker
                                mode="time"
                                .value=${this.t}
                                @change=${this._set('t')}
                            ></lux-date-picker>
                            <span class="val">${this._fmtSingle(this.t)}</span>
                        </div>
                        <div class="cell">
                            <span class="lab">mode="datetime"</span>
                            <lux-date-picker
                                mode="datetime"
                                .value=${this.dt}
                                @change=${this._set('dt')}
                            ></lux-date-picker>
                            <span class="val">${this._fmtSingle(this.dt)}</span>
                        </div>
                    </div>
                    <div class="row" style="margin-top:16px">
                        <div class="cell">
                            <span class="lab">mode="date-range"</span>
                            <lux-date-picker
                                mode="date-range"
                                .value=${this.dr}
                                @change=${this._set('dr')}
                            ></lux-date-picker>
                            <span class="val">${this._fmtRange(this.dr)}</span>
                        </div>
                        <div class="cell">
                            <span class="lab">mode="datetime-range"</span>
                            <lux-date-picker
                                mode="datetime-range"
                                .value=${this.dtr}
                                @change=${this._set('dtr')}
                            ></lux-date-picker>
                            <span class="val">${this._fmtRange(this.dtr)}</span>
                        </div>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`// value = unix 秒（范围 = [start, end]，本地时区）
html\`<lux-date-picker mode="date" .value=\${sec} @change=\${(e) => (sec = e.detail.value)}></lux-date-picker>\`
html\`<lux-date-picker mode="datetime-range" .value=\${[s, e]} @change=\${onRange}></lux-date-picker>\``}
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
                            <td><code>mode</code></td>
                            <td>String</td>
                            <td><code>"date"</code></td>
                            <td>${msg('date.prop.mode')}</td>
                        </tr>
                        <tr>
                            <td><code>value</code></td>
                            <td>Number | [Number, Number] | null</td>
                            <td><code>null</code></td>
                            <td>${msg('date.prop.value')}</td>
                        </tr>
                        <tr>
                            <td><code>placeholder</code></td>
                            <td>String</td>
                            <td><code>—</code></td>
                            <td>${msg('date.prop.placeholder')}</td>
                        </tr>
                        <tr>
                            <td><code>disabled</code></td>
                            <td>Boolean</td>
                            <td><code>false</code></td>
                            <td>${msg('date.prop.disabled')}</td>
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
                            <td>${msg('date.event.change')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}

export default PageComponentsDatePicker;
