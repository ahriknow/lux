import { html, css, LuxElement, msg } from '../../../lux.min.js';
import '../../../complib/lux-timeline.min.js';
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
        max-width: 640px;
        color: rgb(var(--lux-text));
    }
`;

const basicItems = [
    {
        id: 1,
        tag: msg('timeline.demo.create'),
        color: 'info',
        title: msg('timeline.demo.created'),
        desc: msg('timeline.demo.repro'),
        time: '09:12',
    },
    {
        id: 2,
        tag: msg('timeline.demo.assign'),
        color: 'warning',
        title: msg('timeline.demo.assigned'),
        time: '09:13',
    },
    {
        id: 3,
        tag: msg('timeline.demo.status'),
        color: 'primary',
        title: msg('timeline.demo.adminStatus'),
        desc: msg('timeline.demo.started'),
        time: '10:04',
    },
    {
        id: 4,
        tag: msg('timeline.demo.comment'),
        color: 'success',
        title: msg('timeline.demo.commented'),
        desc: msg('timeline.demo.resolved'),
        time: '10:21',
    },
];

const colorItems = [
    { id: 1, color: 'primary', tag: 'primary', title: msg('timeline.demo.primary') },
    { id: 2, color: 'success', tag: 'success', title: msg('timeline.demo.success') },
    { id: 3, color: 'warning', tag: 'warning', title: msg('timeline.demo.warning') },
    { id: 4, color: 'danger', tag: 'danger', title: msg('timeline.demo.danger') },
    { id: 5, color: 'info', tag: 'info', title: msg('timeline.demo.info') },
];

const minimalItems = [
    { id: 1, title: msg('timeline.demo.onlyTitle') },
    { id: 2, title: msg('timeline.demo.titleTime'), time: msg('timeline.demo.yesterday') },
    {
        id: 3,
        title: msg('timeline.demo.titleDesc'),
        desc: msg('timeline.demo.description'),
    },
];

class PageComponentsTimeline extends LuxElement {
    static styles = styles;

    render() {
        return html`
            <h1>${msg('timeline.title')}</h1>
            <p class="subtitle">${msg('timeline.subtitle')}</p>

            <lux-example>
                <span slot="heading">${msg('timeline.basic')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-timeline .items=${basicItems}></lux-timeline>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`const items = [
    { id: 1, tag: '创建', color: 'info',  title: '有个人 创建了工作项', desc: '复现步骤：Safari 打开登录页', time: '09:12' },
    { id: 2, tag: '指派', color: 'warning', title: '有个人 将工作项指派给 banuser', time: '09:13' },
    { id: 3, tag: '状态流转', title: '超级管理员：新建 → 进行中', desc: '开始处理，预计本周修复', time: '10:04' },
    { id: 4, tag: '评论', color: 'success', title: '有个人 评论', desc: '已定位到连接池耗尽', time: '10:21' },
];

html\`<lux-timeline .items=\${items}></lux-timeline>\``}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('timeline.colors')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-timeline .items=${colorItems}></lux-timeline>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`// color: 'primary' | 'success' | 'warning' | 'danger' | 'info'
const items = [
    { color: 'primary', tag: 'primary', title: '默认主色节点' },
    { color: 'success', tag: 'success', title: '成功 / 完成语义' },
    { color: 'warning', tag: 'warning', title: '警告 / 指派语义' },
    { color: 'danger',  tag: 'danger',  title: '危险 / 驳回语义' },
    { color: 'info',    tag: 'info',    title: '中性 / 创建语义' },
];`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('timeline.basic')} ${msg('timeline.minimum')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-timeline .items=${minimalItems}></lux-timeline>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="js"
                        .code=${`// tag / time / desc 均可省略，只给 title 也能渲染
const items = [
    { title: '只有主文本的条目也完全合法' },
    { title: '主文本 + 时间', time: '昨天 18:30' },
    { title: '主文本 + 描述', desc: 'desc 字段用于补充说明' },
];`}
                    ></lux-code>
                </div>
            </lux-example>

            <lux-example>
                <span slot="heading">${msg('timeline.custom')}</span>
                <div slot="main">
                    <div class="demo">
                        <lux-timeline>
                            <div
                                style="padding: 4px 0 12px 26px; color: rgb(var(--lux-text-secondary)); font-size: 13px;"
                            >
                                ${msg('timeline.demo.slotDesc')}
                            </div>
                            <div
                                style="padding: 4px 0 12px 26px; color: rgb(var(--lux-text-secondary)); font-size: 13px);"
                            >
                                ${msg('timeline.demo.dataDriven')} <code>.items</code>.
                            </div>
                        </lux-timeline>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-timeline>
    <div>${msg('timeline.demo.freeContent')}</div>
</lux-timeline>`}
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
                            <td><code>items</code></td>
                            <td>Array</td>
                            <td><code>[]</code></td>
                            <td>${msg('timeline.props.items')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <h2 style="margin-top:56px">${msg('common.slots')}</h2>
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
                            <td><code>default</code></td>
                            <td>${msg('timeline.slot.default')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>
        `;
    }
}

export default PageComponentsTimeline;
