/**
 * lux-timeline — Timeline component.
 *
 * 数据驱动的时间线：左侧轴线 + 彩色节点，条目支持标签 / 主文本 / 描述 / 时间。
 *
 * Props:
 *   items — [{ id?, tag?, title?, desc?, time?, color? }]（attribute: false）
 *   color — 'primary' | 'success' | 'warning' | 'danger' | 'info'
 *
 * Slots:
 *   default — items 为空时回退到自由内容（轴线样式仅 items 模式提供）
 */
import { html, css, LuxElement, registerComponent, repeat, when } from '../../index.js';

const styles = css`
    :host {
        display: block;
    }

    .timeline {
        position: relative;
        margin: 0;
        padding: 0;
    }

    .item {
        position: relative;
        padding: 0 0 18px 26px;
    }
    .item.last {
        padding-bottom: 2px;
    }

    /* 连接线：从本项节点下沿延伸到下一项（最后一项不画） */
    .item::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 20px;
        bottom: -2px;
        width: 2px;
        background: rgb(var(--lux-border));
        border-radius: 1px;
    }
    /* 注意：repeat 会把每项包进独立 span（display:contents），
       :last-child 对每项都成立 —— 必须用 JS 标记的 .last 类 */
    .item.last::before {
        display: none;
    }

    .dot {
        position: absolute;
        left: 0;
        top: 5px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgb(var(--lux-primary-400));
        box-shadow: 0 0 0 3px rgb(var(--lux-bg));
    }
    .dot.success {
        background: rgb(var(--lux-success, 22 163 74));
    }
    .dot.warning {
        background: rgb(217 119 6);
    }
    .dot.danger {
        background: rgb(220 38 38);
    }
    .dot.info {
        background: rgb(100 116 139);
    }

    /* 标签 + 标题 + 时间同一行 inline 流：时间紧跟标题文本（而非右对齐） */
    .head {
        font-size: 14px;
        line-height: 1.6;
        color: rgb(var(--lux-text));
        word-break: break-word;
    }

    .tag {
        display: inline-block;
        vertical-align: 1px;
        margin-right: 8px;
        font-size: 11px;
        line-height: 18px;
        padding: 0 8px;
        border-radius: 999px;
        white-space: nowrap;
        background: rgb(var(--lux-primary-400) / 12%);
        color: rgb(var(--lux-primary-400));
    }
    .tag.success {
        background: rgb(var(--lux-success, 22 163 74) / 14%);
        color: rgb(var(--lux-success, 22 163 74));
    }
    .tag.warning {
        background: rgb(217 119 6 / 14%);
        color: rgb(217 119 6);
    }
    .tag.danger {
        background: rgb(220 38 38 / 12%);
        color: rgb(220 38 38);
    }
    .tag.info {
        background: rgb(100 116 139 / 14%);
        color: rgb(100 116 139);
    }

    .time {
        margin-left: 8px;
        font-size: 12px;
        color: rgb(var(--lux-text-secondary));
        white-space: nowrap;
    }

    .title {
        color: rgb(var(--lux-text));
        word-break: break-word;
    }

    .desc {
        font-size: 13px;
        line-height: 1.55;
        color: rgb(var(--lux-text-secondary));
        margin-top: 4px;
        word-break: break-word;
    }
`;

class LuxTimeline extends LuxElement {
    static styles = styles;

    static properties = {
        items: { type: Array, attribute: false },
    };

    constructor() {
        super();
        this.items = [];
    }

    _itemView(item) {
        const color = item.color || 'primary';
        const hasHead = Boolean(item.tag || item.title || item.time);
        return html`
            <div class=${item._last ? 'item last' : 'item'}>
                <span class=${`dot ${color}`}></span>
                ${when(
                    hasHead,
                    () => html`
                        <div class="head">
                            ${when(item.tag, () => html`<span class=${`tag ${color}`}>${item.tag}</span>`)}
                            ${when(item.title, () => html`<span class="title">${item.title}</span>`)}
                            ${when(item.time, () => html`<span class="time">${item.time}</span>`)}
                        </div>
                    `
                )}
                ${when(item.desc, () => html`<div class="desc">${item.desc}</div>`)}
            </div>
        `;
    }

    render() {
        const items = this.items || [];
        if (items.length > 0) {
            // 标记最后一项（.last 去掉轴线段）—— repeat 的 span 包裹使 :last-child 失效
            const list = items.map((item, i) =>
                i === items.length - 1 ? { ...item, _last: true } : item
            );
            return html`
                <div class="timeline">
                    ${repeat(
                        list,
                        (item) => item.id,
                        (item) => this._itemView(item)
                    )}
                </div>
            `;
        }
        // 自由内容回退（无轴线样式）
        return html`<slot></slot>`;
    }
}

registerComponent('lux-timeline', LuxTimeline);
export default LuxTimeline;
