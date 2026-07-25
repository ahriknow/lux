/**
 * lux-table — Table component.
 *
 * Props:
 *   border, stripe, row-border, col-border, size, hover
 */

import { html, css, LuxElement, registerComponent } from '../../index.js';

const styles = css`
    :host {
        display: block;
        width: 100%;
        margin: 12px 0;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
    }
    th,
    td {
        padding: 10px 16px;
        text-align: left;
        vertical-align: top;
    }
    th {
        color: rgb(var(--lux-text-muted, 100 116 139));
        font-weight: 500;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        background: rgb(var(--lux-bg-alt, 30 41 59));
    }
    td {
        color: rgb(var(--lux-text-secondary, 148 163 184));
    }
    code {
        font-family: 'SF Mono', Consolas, monospace;
        font-size: 0.88em;
        background: rgb(var(--lux-bg-alt, 30 41 59));
        padding: 2px 6px;
        border-radius: 4px;
    }
    :host([size='sm']) table {
        font-size: 13px;
    }
    :host([size='sm']) th,
    :host([size='sm']) td {
        padding: 6px 12px;
    }
    :host([size='lg']) table {
        font-size: 15px;
    }
    :host([size='lg']) th,
    :host([size='lg']) td {
        padding: 14px 20px;
    }
    :host([border]) table {
        border: 1px solid rgb(var(--lux-border, 51 65 85));
    }
    :host([row-border]) th,
    :host([row-border]) td {
        border-bottom: 1px solid rgb(var(--lux-border, 51 65 85));
    }
    :host([col-border]) td + td,
    :host([col-border]) th + th {
        border-left: 1px solid rgb(var(--lux-border, 51 65 85));
    }
    :host([stripe]) tbody tr:nth-child(even) {
        background: rgb(var(--lux-hover, 255 255 255 / 3%));
    }
    :host([hover]) tbody tr:hover {
        background: rgb(var(--lux-hover, 255 255 255 / 5%));
    }
`;

class LuxTable extends LuxElement {
    static styles = styles;

    static properties = {
        border: { type: Boolean, reflect: true },
        stripe: { type: Boolean, reflect: true },
        rowBorder: { type: Boolean, attribute: 'row-border', reflect: true },
        colBorder: { type: Boolean, attribute: 'col-border', reflect: true },
        size: { type: String, reflect: true },
        hover: { type: Boolean, reflect: true },
    };

    firstUpdated() {
        const table = this.renderRoot.querySelector('table');
        if (table) {
            while (this.firstChild) {
                table.appendChild(this.firstChild);
            }
        }
    }

    render() {
        return html`<table></table>`;
    }
}

registerComponent('lux-table', LuxTable);
export default LuxTable;
