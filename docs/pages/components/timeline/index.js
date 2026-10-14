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
        tag: '创建',
        color: 'info',
        title: '有个人 创建了工作项',
        desc: '复现步骤：Safari 打开登录页',
        time: '09:12',
    },
    {
        id: 2,
        tag: '指派',
        color: 'warning',
        title: '有个人 将工作项指派给 banuser',
        time: '09:13',
    },
    {
        id: 3,
        tag: '状态流转',
        color: 'primary',
        title: '超级管理员：新建 → 进行中',
        desc: '开始处理，预计本周修复',
        time: '10:04',
    },
    {
        id: 4,
        tag: '评论',
        color: 'success',
        title: '有个人 评论',
        desc: '已定位到连接池耗尽，等发布后转待验证',
        time: '10:21',
    },
];

const colorItems = [
    { id: 1, color: 'primary', tag: 'primary', title: '默认主色节点' },
    { id: 2, color: 'success', tag: 'success', title: '成功 / 完成语义' },
    { id: 3, color: 'warning', tag: 'warning', title: '警告 / 指派语义' },
    { id: 4, color: 'danger', tag: 'danger', title: '危险 / 驳回语义' },
    { id: 5, color: 'info', tag: 'info', title: '中性 / 创建语义' },
];

const minimalItems = [
    { id: 1, title: '只有主文本的条目也完全合法' },
    { id: 2, title: '主文本 + 时间', time: '昨天 18:30' },
    { id: 3, title: '主文本 + 描述', desc: 'desc 字段用于补充说明，颜色随主题变浅' },
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
                <span slot="heading">${msg('timeline.basic')}（最小字段）</span>
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
                            <div style="padding: 4px 0 12px 26px; color: rgb(var(--lux-text-secondary)); font-size: 13px;">
                                items 为空时回退到默认 slot，内容与结构完全自由（此模式不带轴线样式）。
                            </div>
                            <div style="padding: 4px 0 12px 26px; color: rgb(var(--lux-text-secondary)); font-size: 13px);">
                                需要时间线视觉请使用 <code>.items</code> 数据驱动模式。
                            </div>
                        </lux-timeline>
                    </div>
                </div>
                <div slot="footer">
                    <lux-code
                        language="html"
                        .code=${`<lux-timeline>
    <div>自由结构的回退内容（无轴线样式）</div>
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
