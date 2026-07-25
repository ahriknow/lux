import { html, css, LuxElement } from '../../lux.min.js';
import { msg } from '../../lux.min.js';
import '../../complib/lux-code.min.js';
import '../../complib/lux-table.min.js';

const styles = css`
    :host {
        display: block;
    }
    h1 {
        font-size: 32px;
        font-weight: 700;
        letter-spacing: -1px;
        margin-bottom: 8px;
        color: rgb(var(--lux-text));
    }
    h2 {
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.5px;
        margin-top: 48px;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgb(var(--lux-border));
        color: rgb(var(--lux-text));
    }
    p {
        color: rgb(var(--lux-text-secondary));
        font-size: 15px;
        margin-bottom: 16px;
        line-height: 1.7;
    }
    code {
        font-family: 'SF Mono', Consolas, monospace;
        font-size: 0.88em;
        background: rgb(var(--lux-bg-alt));
        padding: 2px 6px;
        border-radius: 4px;
    }
    .callout {
        background: rgb(var(--lux-primary-400) / 8%);
        border-left: 3px solid rgb(var(--lux-primary-400));
        border-radius: 0 8px 8px 0;
        padding: 14px 18px;
        margin: 20px 0;
        font-size: 14px;
        color: rgb(var(--lux-text-secondary));
    }
    .callout strong {
        color: rgb(var(--lux-text));
    }
`;

class PageI18n extends LuxElement {
    static styles = styles;

    render() {
        return html`
            <span
                style="display:inline-block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:rgb(var(--lux-primary-400));margin-bottom:12px"
                >Guide</span
            >
            <h1>${msg('i18n.title')}</h1>
            <p>${msg('i18n.subtitle')}</p>

            <h2>${msg('i18n.setup')}</h2>
            <lux-code
                language="javascript"
                .code=${`import { createI18n, msg, number, date } from '@ahriknow/lux';

const i18n = createI18n({
  locale: 'zh-CN',
  messages: {
    'zh-CN': {
      hello: '你好',
      welcome: '欢迎, {name}',
      items: '{count, plural, =0{没有项目} =1{# 个项目} other{# 个项目}}',
    },
    'en': {
      hello: 'Hello',
      welcome: 'Welcome, {name}',
      items: '{count, plural, =0{No items} =1{# item} other{# items}}',
    },
  }
});`}
                show-header
            ></lux-code>

            <h2>${msg('i18n.basic')}</h2>
            <lux-code
                language="javascript"
                .code=${`// Simple translation
msg('hello')                         // → "你好"

// With variables
msg('welcome', { name: 'Alice' })    // → "欢迎, Alice"

// Pluralization
msg('items', { count: 0 })           // → "没有项目"
msg('items', { count: 5 })           // → "5 个项目"

// Select
msg('{gender, select, male{He} female{She} other{They}}', { gender: 'male' })  // → "He"`}
                show-header
            ></lux-code>

            <h2>${msg('i18n.syntax')}</h2>
            <p>${msg('i18n.syntax.desc')}</p>

            <h3>${msg('i18n.syntax.interpolation')}</h3>
            <lux-code
                language="javascript"
                .code=${`// Format: {key}
msg('welcome', { name: 'Alice' })  // → "欢迎, Alice"`}
                show-header
            ></lux-code>

            <h3>${msg('i18n.syntax.plural')}</h3>
            <lux-code
                language="javascript"
                .code=${`// Format: {key, plural, =N{...} other{...}}
'{count, plural, =0{没有项目} =1{# 个项目} other{# 个项目}}'

msg('items', { count: 0 })  // → "没有项目"
msg('items', { count: 1 })  // → "1 个项目"
msg('items', { count: 5 })  // → "5 个项目"

// # is replaced with the count value`}
                show-header
            ></lux-code>

            <h3>${msg('i18n.syntax.select')}</h3>
            <lux-code
                language="javascript"
                .code=${`// Format: {key, select, val1{...} val2{...}}
'{gender, select, male{他是} female{她是} other{他们是}}'

msg('{gender, select, male{He} female{She} other{They}}', { gender: 'female' })  // → "She"`}
                show-header
            ></lux-code>

            <h2>${msg('i18n.number')}</h2>
            <lux-code
                language="javascript"
                .code=${`import { number } from '@ahriknow/lux';

number(1234567)                                      // → "1,234,567"
number(0.95, 'percent')                              // → "95%"
number(1234567, { style: 'currency', currency: 'CNY' })  // → "¥1,234,567"
number(1234567, { style: 'currency', currency: 'USD' })  // → "$1,234,567"`}
                show-header
            ></lux-code>

            <h2>${msg('i18n.datefmt')}</h2>
            <lux-code
                language="javascript"
                .code=${`import { date } from '@ahriknow/lux';

date(new Date())                                       // → "2024/1/15"
date(new Date(), { dateStyle: 'full' })                // → "2024年1月15日星期三"
date(new Date(), { year: 'numeric', month: 'long', day: 'numeric' })`}
                show-header
            ></lux-code>

            <h2>${msg('i18n.switch')}</h2>
            <lux-code
                language="javascript"
                .code=${`// Switch locale
i18n.setLocale('en');

// Listen for locale changes
const unsubscribe = i18n.onLocaleChange((locale) => {
  console.log('Locale changed to:', locale);
});

// Get current locale
i18n.locale  // → "zh-CN"`}
                show-header
            ></lux-code>

            <h2>${msg('i18n.apiref')}</h2>
            <lux-table border row-border stripe>
                <table>
                    <thead>
                        <tr>
                            <th>${msg('common.props')}</th>
                            <th>${msg('common.type')}</th>
                            <th>${msg('common.description')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>createI18n(options)</code></td>
                            <td>Function</td>
                            <td>${msg('i18n.api.create.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>msg(key, values?)</code></td>
                            <td>Function</td>
                            <td>${msg('i18n.api.msg.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>number(value, options?)</code></td>
                            <td>Function</td>
                            <td>${msg('i18n.api.number.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>date(value, options?)</code></td>
                            <td>Function</td>
                            <td>${msg('i18n.api.date.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>setLocale(locale)</code></td>
                            <td>Function</td>
                            <td>${msg('i18n.api.setLocale.desc')}</td>
                        </tr>
                        <tr>
                            <td><code>onLocaleChange(fn)</code></td>
                            <td>Function</td>
                            <td>${msg('i18n.api.onLocaleChange.desc')}</td>
                        </tr>
                    </tbody>
                </table>
            </lux-table>

            <div class="callout"><strong>Note:</strong> ${msg('i18n.note')}</div>
        `;
    }
}
export default PageI18n;
