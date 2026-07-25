import { html, css, LuxElement } from '../../lux.min.js';
import { msg } from '../../lux.min.js';
import '../../complib/lux-code.min.js';

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

class PageExamples extends LuxElement {
    static styles = styles;

    render() {
        return html`
            <span
                style="display:inline-block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:rgb(var(--lux-primary-400));margin-bottom:12px"
                >Examples</span
            >
            <h1>${msg('examples.title')}</h1>
            <p>${msg('examples.subtitle')}</p>

            <h2>${msg('examples.counter')}</h2>
            <p>${msg('examples.counter.desc')}</p>
            <lux-code
                language="javascript"
                .code=${`import { html, css, LuxElement, registerComponent } from '@ahriknow/lux';

class Counter extends LuxElement {
  static styles = css\`
    :host { display: flex; gap: 12px; align-items: center; }
    button { padding: 8px 16px; border-radius: 6px; border: 1px solid #ddd; cursor: pointer; }
  \`;

  static properties = { count: { type: Number } };

  constructor() {
    super();
    this.count = 0;
  }

  render() {
    return html\`
      <button @click=\${() => this.count--}>-</button>
      <span>\${this.count}</span>
      <button @click=\${() => this.count++}>+</button>
    \`;
  }
}

registerComponent('my-counter', Counter);`}
                show-header
            ></lux-code>

            <h2>${msg('examples.todo')}</h2>
            <p>${msg('examples.todo.desc')}</p>
            <lux-code
                language="javascript"
                .code=${`import { html, css, LuxElement, repeat } from '@ahriknow/lux';

class TodoList extends LuxElement {
  static properties = { todos: { type: Array } };

  constructor() {
    super();
    this.todos = [];
    this._nextId = 1;
  }

  _add(text) {
    this.todos = [...this.todos, { id: this._nextId++, text, done: false }];
  }

  _toggle(id) {
    this.todos = this.todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t);
  }

  render() {
    return html\`
      <input ref=\${el => this._input = el}
        @keydown=\${e => {
          if (e.key === 'Enter') {
            this._add(e.target.value);
            e.target.value = '';
          }
        }}>
      \${repeat(this.todos, t => t.id, t => html\`
        <div @click=\${() => this._toggle(t.id)}
          style="cursor:pointer;text-decoration:\${t.done ? 'line-through' : 'none'}">
          \${t.text}
        </div>
      \`)}
    \`;
  }
}`}
                show-header
            ></lux-code>

            <h2>${msg('examples.parentChild')}</h2>
            <p>${msg('examples.parentChild.desc')}</p>
            <lux-code
                language="javascript"
                .code=${`// Parent → Child: property binding
render() {
  return html\`
    <user-card .name=\${this.userName}
      .age=\${this.userAge}></user-card>
  \`;
}

// Child → Parent: custom event
_handleClick() {
  this.emit('user-select', { id: 42, name: 'Alice' });
}
// Parent: <user-card @user-select=\${e => console.log(e.detail)}>`}
                show-header
            ></lux-code>

            <h2>${msg('examples.conditional')}</h2>
            <p>${msg('examples.conditional.desc')}</p>
            <lux-code
                language="javascript"
                .code=${`import { when, repeat } from '@ahriknow/lux';

render() {
  return html\`
    \${when(this.isLoggedIn,
      html\`\${repeat(this.items, i => i.id, i =>
        html\`<div>\${i.name}</div>\`
      )}\`,
      html\`<div>Please log in</div>\`
    )}
    <div ?hidden=\${!this.showBanner}>Banner</div>
  \`;
}`}
                show-header
            ></lux-code>

            <h2>${msg('examples.controller')}</h2>
            <p>${msg('examples.controller.desc')}</p>
            <lux-code
                language="javascript"
                .code=${`import { html, css, LuxElement } from '@ahriknow/lux';

class AutoRefresh extends LuxElement {
  static properties = { data: { type: String } };

  connectedCallback() {
    super.connectedCallback();
    this._timer = setInterval(() => this._fetch(), 5000);
    this._fetch();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this._timer);
  }

  async _fetch() {
    const res = await fetch('/api/data');
    this.data = await res.text();
  }

  render() {
    return html\`<pre>\${this.data || 'Loading...'}</pre>\`;
  }
}`}
                show-header
            ></lux-code>

            <div class="callout">
                <strong>${msg('examples.nextStep')}</strong> ${msg('examples.nextStepDesc')}
            </div>
        `;
    }
}

export default PageExamples;
