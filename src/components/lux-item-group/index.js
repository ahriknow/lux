import { html, css, LuxElement, registerComponent } from '../../index.js';

const styles = css`
    :host {
        display: inline-flex;
        vertical-align: middle;
    }
    :host([vertical]) {
        flex-direction: column;
    }
    :host([block]) {
        display: flex;
    }

    .group {
        display: inline-flex;
        align-items: stretch;
    }
    :host([vertical]) .group {
        flex-direction: column;
    }
    :host([block]) .group {
        display: flex;
    }

    /* ── Horizontal: collapse borders ── */
    ::slotted(*) {
        --btn-radius: 0;
        --lux-radius: 0;
        --lux-radius-sm: 0;
        flex-shrink: 0;
    }
    ::slotted(:not(:first-child)) {
        margin-left: -1px;
    }
    ::slotted([focused]) {
        position: relative;
        z-index: 1;
    }
    ::slotted(:first-child) {
        --btn-radius: var(--group-radius, 6px) 0 0 var(--group-radius, 6px);
        --lux-radius: var(--group-radius, 6px) 0 0 var(--group-radius, 6px);
        --lux-radius-sm: var(--group-radius, 6px) 0 0 var(--group-radius, 6px);
    }
    ::slotted(:last-child) {
        --btn-radius: 0 var(--group-radius, 6px) var(--group-radius, 6px) 0;
        --lux-radius: 0 var(--group-radius, 6px) var(--group-radius, 6px) 0;
        --lux-radius-sm: 0 var(--group-radius, 6px) var(--group-radius, 6px) 0;
    }
    ::slotted(:first-child:last-child) {
        --btn-radius: var(--group-radius, 6px);
        --lux-radius: var(--group-radius, 6px);
        --lux-radius-sm: var(--group-radius, 6px);
    }

    /* ── Vertical: collapse borders ── */
    :host([vertical]) ::slotted(:not(:first-child)) {
        margin-left: 0;
        margin-top: -1px;
    }
    :host([vertical]) ::slotted([focused]) {
        position: relative;
        z-index: 1;
    }
    :host([vertical]) ::slotted(:first-child) {
        --btn-radius: var(--group-radius, 6px) var(--group-radius, 6px) 0 0;
        --lux-radius: var(--group-radius, 6px) var(--group-radius, 6px) 0 0;
        --lux-radius-sm: var(--group-radius, 6px) var(--group-radius, 6px) 0 0;
    }
    :host([vertical]) ::slotted(:last-child) {
        --btn-radius: 0 0 var(--group-radius, 6px) var(--group-radius, 6px);
        --lux-radius: 0 0 var(--group-radius, 6px) var(--group-radius, 6px);
        --lux-radius-sm: 0 0 var(--group-radius, 6px) var(--group-radius, 6px);
    }
    :host([vertical]) ::slotted(:first-child:last-child) {
        --btn-radius: var(--group-radius, 6px);
        --lux-radius: var(--group-radius, 6px);
        --lux-radius-sm: var(--group-radius, 6px);
    }
`;

class LuxItemGroup extends LuxElement {
    static styles = styles;

    static properties = {
        vertical: { type: Boolean, reflect: true },
        block: { type: Boolean, reflect: true },
        size: { type: String, reflect: true },
    };

    connectedCallback() {
        super.connectedCallback();
        this._onSlotChange = () => this._propagateSize();
        const slot = this.renderRoot.querySelector('slot');
        if (slot) slot.addEventListener('slotchange', this._onSlotChange);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        const slot = this.renderRoot.querySelector('slot');
        if (slot) slot.removeEventListener('slotchange', this._onSlotChange);
    }

    firstUpdated() {
        this._propagateSize();
    }

    updated(changed) {
        if (changed.has('size')) {
            this._propagateSize();
        }
    }

    _propagateSize() {
        const slot = this.renderRoot.querySelector('slot');
        if (!slot) return;
        const children = slot.assignedElements();
        for (const child of children) {
            if (this.size) {
                child.setAttribute('size', this.size);
            } else {
                child.removeAttribute('size');
            }
        }
    }

    render() {
        return html`<div class="group"><slot></slot></div>`;
    }
}

registerComponent('lux-item-group', LuxItemGroup);
export default LuxItemGroup;
