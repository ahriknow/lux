import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
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
        margin: 64px 0 16px;
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
        gap: 12px;
        flex-wrap: wrap;
        margin: 12px 0;
        color: rgb(var(--lux-text));
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
`;

const icons = [
    'check',
    'close',
    'search',
    'menu',
    'add',
    'remove',
    'edit',
    'delete',
    'home',
    'settings',
    'star',
    'heart',
    'share',
    'link',
    'download',
    'upload',
    'refresh',
    'expand_more',
    'expand_less',
    'visibility',
    'visibility_off',
    'info',
    'warning',
    'error_outline',
    'help_outline',
    'arrow_back',
    'arrow_forward',
    'more_vert',
    'more_horiz',
    'light_mode',
    'dark_mode',
    'view_quilt',
    'code',
    'toggle_on',
    'swap_vert',
    'arrow_down',
    'language',
    'smart_button',
    'table_chart',
    'check_circle',
    'cancel',
    'pause',
    'play',
    'stop',
    'save',
    'folder',
    'file',
    'email',
    'person',
    'lock',
    'filter',
    'sort',
    'calendar',
    'map',
    'camera',
    'bookmark',
    'clock',
    'chat',
    'phone',
    'notification',
    'cloud',
    'download_done',
];

class PageComponentsIcon extends LuxElement {
    static styles = styles;
    render() {
        return html`
            <h1>${msg('icon.title')}</h1>
            <p class="subtitle">${msg('icon.subtitle')}</p>

            <lux-example
                ><span slot="heading">${msg('icon.basic')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-icon .name=${'check'}></lux-icon>
                        <lux-icon .name=${'close'}></lux-icon>
                        <lux-icon .name=${'search'}></lux-icon>
                        <lux-icon .name=${'home'}></lux-icon>
                        <lux-icon .name=${'settings'}></lux-icon>
                        <lux-icon .name=${'star'}></lux-icon>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-icon .name="check"></lux-icon>
<lux-icon .name="close"></lux-icon>
<lux-icon .name="search"></lux-icon>
<lux-icon .name="home"></lux-icon>
<lux-icon .name="settings"></lux-icon>
<lux-icon .name="star"></lux-icon>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('icon.sizes')}</span>
                <div slot="main">
                    <div class="demo-row" style="align-items:flex-end">
                        <lux-icon .name=${'star'} size="16px"></lux-icon>
                        <lux-icon .name=${'star'} size="24px"></lux-icon>
                        <lux-icon .name=${'star'} size="32px"></lux-icon>
                        <lux-icon .name=${'star'} size="48px"></lux-icon>
                        <lux-icon .name=${'star'} size="2rem"></lux-icon>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-icon .name="star" size="16px"></lux-icon>
<lux-icon .name="star" size="24px"></lux-icon>
<lux-icon .name="star" size="32px"></lux-icon>
<lux-icon .name="star" size="48px"></lux-icon>
<lux-icon .name="star" size="2rem"></lux-icon>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('icon.colors')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-icon
                            .name=${'heart'}
                            size="32px"
                            color="rgb(var(--lux-error))"
                        ></lux-icon>
                        <lux-icon
                            .name=${'star'}
                            size="32px"
                            color="rgb(var(--lux-warning))"
                        ></lux-icon>
                        <lux-icon
                            .name=${'check'}
                            size="32px"
                            color="rgb(var(--lux-success))"
                        ></lux-icon>
                        <lux-icon
                            .name=${'info'}
                            size="32px"
                            color="rgb(var(--lux-info))"
                        ></lux-icon>
                        <lux-icon
                            .name=${'close'}
                            size="32px"
                            color="rgb(var(--lux-primary-400))"
                        ></lux-icon>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-icon .name="heart" size="32px" color="rgb(var(--lux-error))"></lux-icon>
<lux-icon .name="star" size="32px" color="rgb(var(--lux-warning))"></lux-icon>
<lux-icon .name="check" size="32px" color="rgb(var(--lux-success))"></lux-icon>
<lux-icon .name="info" size="32px" color="rgb(var(--lux-info))"></lux-icon>
<lux-icon .name="close" size="32px" color="rgb(var(--lux-primary-400))"></lux-icon>`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example
                ><span slot="heading">${msg('icon.custom')}</span>
                <div slot="main">
                    <div class="demo-row">
                        <lux-icon size="32px"
                            ><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                />
                                <path
                                    d="M12 8v4l3 3"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                /></svg
                        ></lux-icon>
                        <lux-icon size="32px"
                            ><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="3"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                />
                                <path
                                    d="M8 12h8M12 8v8"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                /></svg
                        ></lux-icon>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-icon size="32px">
  <svg viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
  </svg>
</lux-icon>
<lux-icon size="32px">
  <svg viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>
  </svg>
</lux-icon>`}
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
                            <td><code>name</code></td>
                            <td>String</td>
                            <td>—</td>
                            <td>${msg('icon.name.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>size</code></td>
                            <td>String</td>
                            <td><code>1em</code></td>
                            <td>${msg('icon.size.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>color</code></td>
                            <td>String</td>
                            <td><code>currentColor</code></td>
                            <td>${msg('icon.color.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2>${msg('common.slots')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>Slot</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><em>default</em></td>
                            <td>${msg('icon.slot.default.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2>${msg('icon.list')}</h2>
            <p>${msg('icon.all', { count: icons.length })}:</p>
            <div class="demo-row" style="flex-wrap:wrap;gap:6px">
                ${icons.map(
            (name) => html`
                <div
                    style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 8px;border:1px solid rgb(var(--lux-border));border-radius:var(--lux-radius);background:rgb(var(--lux-card));min-width:72px;color:rgb(var(--lux-text))"
                >
                    <lux-icon .name=${name} size="24px"></lux-icon>
                    <span
                        style="font-size:11px;color:rgb(var(--lux-text-muted));text-align:center;word-break:break-all"
                        >${name}</span
                    >
                </div>
            `
        )}
            </div>
        `;
    }
}
export default PageComponentsIcon;
