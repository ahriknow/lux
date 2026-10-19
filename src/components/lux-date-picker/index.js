/**
 * lux-date-picker — Date / time / range picker.
 *
 * Modes (`mode` prop):
 *   date            — value: unix seconds (day precision)
 *   time            — value: unix seconds (h:m:s on epoch day, kept as-is)
 *   datetime        — value: unix seconds
 *   date-range      — value: [startSec, endSec] (start day 00:00:00, end 23:59:59)
 *   datetime-range  — value: [startSec, endSec] (selected clock applied to both ends)
 *
 * Single modes accept number | null; range modes accept [number, number] | null.
 * All conversions are LOCAL time.
 *
 * Events: change { value } — bubbles + composed
 */
import {
    html,
    css,
    LuxElement,
    registerComponent,
    repeat,
    when,
    msg,
    date,
    getLocale,
} from '../../index.js';
import '../lux-icon/index.js';

const pad = (n) => String(n).padStart(2, '0');
const dayStart = (sec) => {
    const d = new Date(sec * 1000);
    d.setHours(0, 0, 0, 0);
    return Math.floor(d.getTime() / 1000);
};
const mkSec = (y, m, d, h = 0, mi = 0, s = 0) =>
    Math.floor(new Date(y, m, d, h, mi, s).getTime() / 1000);

function fmtPart(sec, withDate, withTime) {
    const d = new Date(sec * 1000);
    const out = [];
    if (withDate) out.push(date(d, { year: 'numeric', month: '2-digit', day: '2-digit' }));
    if (withTime) out.push(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    return out.join(' ');
}

const styles = css`
    :host {
        display: inline-block;
        position: relative;
        vertical-align: middle;
    }
    .trigger {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        height: 32px;
        min-width: 190px;
        box-sizing: border-box;
        padding: 0 10px;
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: var(--lux-radius, 6px);
        background: rgb(var(--lux-card, 255 255 255));
        cursor: pointer;
        font-size: 13px;
        color: rgb(var(--lux-text, 15 23 42));
        transition: border-color 0.15s ease;
    }
    .trigger:hover {
        border-color: rgb(var(--lux-primary-400, 108 92 231));
    }
    :host([disabled]) .trigger {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }
    .text {
        flex: 1;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: 'SF Mono', Consolas, monospace;
        font-size: 12.5px;
    }
    .text.ph {
        color: rgb(var(--lux-text-muted, 148 163 184));
        font-family: inherit;
    }
    .arrow {
        color: rgb(var(--lux-text-muted, 148 163 184));
        display: inline-flex;
    }
    .panel {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        z-index: 1100;
        background: rgb(var(--lux-card, 255 255 255));
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: 10px;
        box-shadow: 0 12px 32px rgb(15 23 42 / 16%);
        padding: 12px;
        display: none;
        width: max-content;
        /* fixed 定位后高度可能被视口钳制，超出部分面板内滚动 */
        overflow-y: auto;
    }
    .panel.open {
        display: block;
    }
    .nav {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 600;
        color: rgb(var(--lux-text, 15 23 42));
        justify-content: center;
    }
    .nav button {
        border: 0;
        background: transparent;
        cursor: pointer;
        color: rgb(var(--lux-text-secondary, 100 116 139));
        width: 26px;
        height: 26px;
        border-radius: 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }
    .nav button:hover {
        background: rgb(var(--lux-bg, 248 250 252));
        color: rgb(var(--lux-text, 15 23 42));
    }
    .nav .label {
        min-width: 96px;
        text-align: center;
    }
    table.cal {
        border-collapse: collapse;
        font-size: 12.5px;
    }
    .cal th {
        width: 32px;
        height: 28px;
        font-weight: 500;
        color: rgb(var(--lux-text-muted, 148 163 184));
        font-size: 11.5px;
    }
    .cal td {
        width: 32px;
        height: 30px;
        text-align: center;
        padding: 0;
    }
    .cell {
        width: 28px;
        height: 28px;
        line-height: 28px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        cursor: pointer;
        color: rgb(var(--lux-text, 15 23 42));
        font-size: 12.5px;
        padding: 0;
        font-family: inherit;
    }
    .cell:hover:not(:disabled) {
        background: rgb(var(--lux-primary-500, 99 91 218) / 12%);
    }
    .cell.dim {
        color: rgb(var(--lux-text-muted, 148 163 184) / 70%);
    }
    .cell.today {
        box-shadow: inset 0 0 0 1px rgb(var(--lux-primary-500, 99 91 218));
    }
    .cell.sel {
        background: rgb(var(--lux-primary-500, 99 91 218));
        color: #fff;
        font-weight: 600;
    }
    .cell.inr {
        background: rgb(var(--lux-primary-500, 99 91 218) / 14%);
        border-radius: 0;
    }
    .cell.s-start {
        border-radius: 8px 0 0 8px;
    }
    .cell.s-end {
        border-radius: 0 8px 8px 0;
    }
    .time {
        display: flex;
        gap: 6px;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed rgb(var(--lux-border, 226 232 240));
        font-size: 13px;
        color: rgb(var(--lux-text-secondary, 100 116 139));
    }
    .time select {
        height: 28px;
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        border-radius: 6px;
        background: rgb(var(--lux-card, 255 255 255));
        color: rgb(var(--lux-text, 15 23 42));
        font-size: 13px;
        padding: 0 4px;
        outline: none;
        cursor: pointer;
    }
    .hint {
        margin-top: 8px;
        font-size: 11.5px;
        color: rgb(var(--lux-text-muted, 148 163 184));
        text-align: center;
    }
    .foot {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid rgb(var(--lux-border, 226 232 240));
    }
    .foot button {
        height: 28px;
        padding: 0 12px;
        border-radius: 6px;
        border: 1px solid rgb(var(--lux-border, 226 232 240));
        background: rgb(var(--lux-card, 255 255 255));
        color: rgb(var(--lux-text, 15 23 42));
        font-size: 12.5px;
        cursor: pointer;
        font-family: inherit;
    }
    .foot button:hover {
        border-color: rgb(var(--lux-primary-400, 108 92 231));
        color: rgb(var(--lux-primary-500, 99 91 218));
    }
    .foot button.primary {
        background: rgb(var(--lux-primary-500, 99 91 218));
        border-color: rgb(var(--lux-primary-500, 99 91 218));
        color: #fff;
    }
    .foot button.primary:hover {
        filter: brightness(1.05);
        color: #fff;
    }
    .foot button:disabled {
        opacity: 0.45;
        cursor: not-allowed;
        pointer-events: none;
    }
    .foot .grow {
        flex: 1;
    }
`;

class LuxDatePicker extends LuxElement {
    static styles = styles;

    static properties = {
        mode: { type: String, reflect: true },
        value: { type: Object },
        placeholder: { type: String },
        disabled: { type: Boolean, reflect: true },
        open: { type: Boolean, state: true },
        vy: { type: Number, state: true },
        vm: { type: Number, state: true },
        draftS: { type: Object, state: true },
        draftE: { type: Object, state: true },
        th: { type: Number, state: true },
        tmi: { type: Number, state: true },
        ts: { type: Number, state: true },
    };

    constructor() {
        super();
        this.mode = 'date';
        this.value = null;
        this.placeholder = '';
        this.disabled = false;
        this.open = false;
        this.draftS = null;
        this.draftE = null;
        this.th = 0;
        this.tmi = 0;
        this.ts = 0;
        const now = new Date();
        this.vy = now.getFullYear();
        this.vm = now.getMonth();
        this._onDocClick = (e) => {
            if (!this.open) return;
            if (!e.composedPath().includes(this)) this.open = false;
        };
        this._onKey = (e) => {
            if (e.key === 'Escape' && this.open) this.open = false;
        };
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('mousedown', this._onDocClick, true);
        document.addEventListener('keydown', this._onKey, true);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('mousedown', this._onDocClick, true);
        document.removeEventListener('keydown', this._onKey, true);
        this._unbindPanelRepos();
    }

    updated() {
        if (this.open) {
            this._bindPanelRepos();
            this._positionPanel();
        } else {
            this._unbindPanelRepos();
        }
    }

    /** 面板用视口坐标（fixed）定位：absolute 会被 modal body 等 overflow 祖先裁剪并撑出滚动条 */
    _positionPanel() {
        const panel = this.shadowRoot?.querySelector('.panel');
        if (!panel || !this.open) return;
        const r = this.getBoundingClientRect();
        if (!r.width && !r.height) return;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        panel.style.position = 'fixed';
        panel.style.maxHeight = '';
        panel.style.top = '0px';
        panel.style.left = '0px';
        const nat = panel.offsetHeight;
        const below = vh - r.bottom - 12;
        const above = r.top - 12;
        let top;
        if (nat <= below || below >= above) {
            const h = Math.min(nat, Math.max(40, below - 4));
            panel.style.maxHeight = `${h}px`;
            top = r.bottom + 6;
        } else {
            const h = Math.min(nat, Math.max(40, above - 6));
            panel.style.maxHeight = `${h}px`;
            top = r.top - 6 - h;
        }
        let left = r.left;
        const pw = panel.offsetWidth;
        if (left + pw > vw - 8) left = Math.max(8, vw - 8 - pw);
        panel.style.left = `${Math.round(left)}px`;
        panel.style.top = `${Math.round(Math.max(8, top))}px`;
    }

    _bindPanelRepos() {
        if (this._reposBound) return;
        this._onRepos = () => this._positionPanel();
        window.addEventListener('resize', this._onRepos);
        document.addEventListener('scroll', this._onRepos, true);
        this._reposBound = true;
    }

    _unbindPanelRepos() {
        if (!this._reposBound) return;
        window.removeEventListener('resize', this._onRepos);
        document.removeEventListener('scroll', this._onRepos, true);
        this._reposBound = false;
    }

    get _isRange() {
        return this.mode === 'date-range' || this.mode === 'datetime-range';
    }

    get _hasDate() {
        return this.mode !== 'time';
    }

    get _hasTime() {
        return this.mode !== 'date' && this.mode !== 'date-range';
    }

    _display() {
        const v = this.value;
        const empty =
            v == null || (Array.isArray(v) && (v.length < 2 || v[0] == null || v[1] == null));
        if (empty) return this.placeholder || this._ph();
        if (this._isRange) {
            const [a, b] = v;
            return `${fmtPart(a, this._hasDate, this.mode === 'datetime-range')} ~ ${fmtPart(b, this._hasDate, this.mode === 'datetime-range')}`;
        }
        return fmtPart(v, this._hasDate, this._hasTime);
    }

    _ph() {
        switch (this.mode) {
            case 'time':
                return msg('datePicker.time');
            case 'date-range':
                return msg('datePicker.dateRange');
            case 'datetime-range':
                return msg('datePicker.dateTimeRange');
            case 'datetime':
                return msg('datePicker.dateTime');
            default:
                return msg('datePicker.date');
        }
    }

    _weekdays() {
        const locale = getLocale() || undefined;
        return Array.from({ length: 7 }, (_, day) =>
            new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, 7 + day))
        );
    }

    _openPanel() {
        if (this.disabled) return;
        const v = this.value;
        const base = this._isRange
            ? Array.isArray(v)
                ? v[0]
                : null
            : typeof v === 'number'
              ? v
              : null;
        const ref = base != null ? new Date(base * 1000) : new Date();
        this.vy = ref.getFullYear();
        this.vm = ref.getMonth();
        if (this._isRange) {
            this.draftS = Array.isArray(v) && v[0] != null ? v[0] : null;
            this.draftE = Array.isArray(v) && v[1] != null ? v[1] : null;
        } else {
            this.draftS = typeof v === 'number' ? v : null;
            this.draftE = null;
        }
        const t = this.draftS != null ? new Date(this.draftS * 1000) : new Date();
        this.th = t.getHours();
        this.tmi = t.getMinutes();
        this.ts = t.getSeconds();
        this.open = true;
    }

    _cells() {
        const first = new Date(this.vy, this.vm, 1);
        const startPad = first.getDay();
        const daysInMonth = new Date(this.vy, this.vm + 1, 0).getDate();
        const prevDays = new Date(this.vy, this.vm, 0).getDate();
        const cells = [];
        for (let i = 0; i < 42; i++) {
            const dayIdx = i - startPad;
            let y = this.vy,
                m = this.vm,
                d,
                dim = false;
            if (dayIdx < 0) {
                m = this.vm - 1;
                d = prevDays + dayIdx + 1;
                dim = true;
            } else if (dayIdx >= daysInMonth) {
                m = this.vm + 1;
                d = dayIdx - daysInMonth + 1;
                dim = true;
            } else {
                d = dayIdx + 1;
            }
            if (m < 0) {
                m = 11;
                y -= 1;
            }
            if (m > 11) {
                m = 0;
                y += 1;
            }
            cells.push({ y, m, d, dim });
        }
        return cells;
    }

    _cellCls(c) {
        const sec = mkSec(c.y, c.m, c.d);
        const cls = ['cell'];
        if (c.dim) cls.push('dim');
        const now = new Date();
        if (c.y === now.getFullYear() && c.m === now.getMonth() && c.d === now.getDate())
            cls.push('today');
        if (this._isRange) {
            const s = this.draftS != null ? dayStart(this.draftS) : null;
            const e = this.draftE != null ? dayStart(this.draftE) : null;
            if (s === sec) cls.push('sel', 's-start');
            else if (e === sec) cls.push('sel', 's-end');
            else if (s != null && e != null && sec > s && sec < e) cls.push('inr');
        } else if (this.draftS != null && dayStart(this.draftS) === sec) {
            cls.push('sel');
        }
        return cls.join(' ');
    }

    _pickDay(c) {
        const dateSec = mkSec(c.y, c.m, c.d);
        if (this._isRange) {
            if (this.draftS == null || this.draftE != null) {
                this.draftS = this._hasTime ? this._withClock(dateSec) : dateSec;
                this.draftE = null;
            } else {
                const sDay = dayStart(this.draftS);
                if (dateSec < sDay) {
                    this.draftE = this._hasTime ? this._withClock(sDay) : sDay;
                    this.draftS = this._hasTime ? this._withClock(dateSec) : dateSec;
                } else {
                    this.draftE = this._hasTime ? this._withClock(dateSec) : dateSec;
                }
            }
        } else {
            this.draftS = this._hasTime ? this._withClock(dateSec) : dateSec;
        }
        if (c.dim) {
            this.vy = c.y;
            this.vm = c.m;
        }
        this.requestUpdate();
    }

    /** 把时分秒写入某个 sec（本地） */
    _withClock(sec) {
        const d = new Date(sec * 1000);
        return mkSec(d.getFullYear(), d.getMonth(), d.getDate(), this.th, this.tmi, this.ts);
    }

    _syncClockToDraft() {
        if (this.draftS != null) this.draftS = this._withClock(this.draftS);
        if (this.draftE != null) this.draftE = this._withClock(this.draftE);
        this.requestUpdate();
    }

    _shiftMonth(delta) {
        let m = this.vm + delta;
        let y = this.vy;
        if (m < 0) {
            m = 11;
            y -= 1;
        }
        if (m > 11) {
            m = 0;
            y += 1;
        }
        this.vy = y;
        this.vm = m;
    }

    _confirm() {
        if (this._isRange) {
            if (this.draftS == null || this.draftE == null) return;
            this.value = [this.draftS, this.draftE];
        } else {
            if (this.draftS == null) return;
            this.value = this.draftS;
        }
        this.open = false;
        this.emit('change', { value: this.value });
    }

    _clear() {
        this.value = null;
        this.draftS = null;
        this.draftE = null;
        this.open = false;
        this.emit('change', { value: null });
    }

    render() {
        const text = this._display();
        const isPh =
            text === this._ph() && !this.placeholder
                ? true
                : !(this.value != null && (!Array.isArray(this.value) || this.value.length === 2));
        const showCal = this._hasDate;
        const showTime = this._hasTime;
        const canConfirm = this._isRange
            ? this.draftS != null && this.draftE != null
            : this.draftS != null;
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const minutes = Array.from({ length: 60 }, (_, i) => i);
        const seconds = Array.from({ length: 60 }, (_, i) => i);
        const monthLabel = date(new Date(this.vy, this.vm, 1), { year: 'numeric', month: 'long' });

        return html`
            <div class="trigger" @click=${() => this._openPanel()}>
                <span class=${isPh ? 'text ph' : 'text'}>${text}</span>
                <span class="arrow"><lux-icon name="expand_more" size="14px"></lux-icon></span>
            </div>
            <div class=${this.open ? 'panel open' : 'panel'}>
                ${when(
                    showCal,
                    () => html`
                        <div class="nav">
                            <button
                                type="button"
                                .title=${msg('datePicker.prevYear')}
                                @click=${() => this._shiftMonth(-12)}
                            >
                                <lux-icon name="double_arrow_left" size="15px"></lux-icon>
                            </button>
                            <button
                                type="button"
                                .title=${msg('datePicker.prevMonth')}
                                @click=${() => this._shiftMonth(-1)}
                            >
                                <lux-icon name="chevron_left" size="15px"></lux-icon>
                            </button>
                            <span class="label">${monthLabel}</span>
                            <button
                                type="button"
                                .title=${msg('datePicker.nextMonth')}
                                @click=${() => this._shiftMonth(1)}
                            >
                                <lux-icon name="chevron_right" size="15px"></lux-icon>
                            </button>
                            <button
                                type="button"
                                .title=${msg('datePicker.nextYear')}
                                @click=${() => this._shiftMonth(12)}
                            >
                                <lux-icon name="double_arrow_right" size="15px"></lux-icon>
                            </button>
                        </div>
                        <table class="cal">
                            <thead>
                                <tr>
                                    ${this._weekdays().map((w) => html`<th>${w}</th>`)}
                                </tr>
                            </thead>
                            <tbody>
                                ${repeat(
                                    Array.from({ length: 6 }, (_, r) => ({
                                        r,
                                        days: this._cells().slice(r * 7, r * 7 + 7),
                                    })),
                                    (week) => String(week.r),
                                    (week) => html`
                                        <tr>
                                            ${week.days.map(
                                                (c) => html`
                                                    <td>
                                                        <button
                                                            class=${this._cellCls(c)}
                                                            type="button"
                                                            @click=${() => this._pickDay(c)}
                                                        >
                                                            ${c.d}
                                                        </button>
                                                    </td>
                                                `
                                            )}
                                        </tr>
                                    `
                                )}
                            </tbody>
                        </table>
                    `
                )}
                ${when(
                    showTime,
                    () => html`
                        <div class="time">
                            <select
                                .value=${String(this.th)}
                                @change=${(e) => {
                                    this.th = Number(e.target.value);
                                    this._syncClockToDraft();
                                }}
                            >
                                ${hours.map((h) => html`<option value=${String(h)}>${pad(h)}</option>`)}
                            </select>
                            <span>:</span>
                            <select
                                .value=${String(this.tmi)}
                                @change=${(e) => {
                                    this.tmi = Number(e.target.value);
                                    this._syncClockToDraft();
                                }}
                            >
                                ${minutes.map((m) => html`<option value=${String(m)}>${pad(m)}</option>`)}
                            </select>
                            <span>:</span>
                            <select
                                .value=${String(this.ts)}
                                @change=${(e) => {
                                    this.ts = Number(e.target.value);
                                    this._syncClockToDraft();
                                }}
                            >
                                ${seconds.map((s) => html`<option value=${String(s)}>${pad(s)}</option>`)}
                            </select>
                        </div>
                    `
                )}
                ${when(
                    this._isRange,
                    () => html`
                        <div class="hint">
                            ${this.draftE == null ? msg('datePicker.rangeStart') : msg('datePicker.rangeReset')}
                        </div>
                    `
                )}
                <div class="foot">
                    <button type="button" @click=${() => this._clear()}>
                        ${msg('datePicker.clear')}
                    </button>
                    <span class="grow"></span>
                    <button type="button" @click=${() => (this.open = false)}>
                        ${msg('datePicker.cancel')}
                    </button>
                    <button
                        class="primary"
                        type="button"
                        ?disabled=${!canConfirm}
                        @click=${() => this._confirm()}
                    >
                        ${msg('datePicker.confirm')}
                    </button>
                </div>
            </div>
        `;
    }
}

registerComponent('lux-date-picker', LuxDatePicker);
export default LuxDatePicker;
