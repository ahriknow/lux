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
    h3 {
        font-size: 16px;
        font-weight: 600;
        margin-top: 32px;
        margin-bottom: 8px;
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
    .callout a {
        color: rgb(var(--lux-primary-400));
    }
`;

class PageGuide extends LuxElement {
    static styles = styles;

    render() {
        return html`
            <span
                style="display:inline-block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:rgb(var(--lux-primary-400));margin-bottom:12px"
                >Getting Started</span
            >
            <h1>${msg('guide.title')}</h1>
            <p>${msg('guide.subtitle')}</p>

            <div
                class="callout"
                style="margin-bottom:32px"
                .innerHTML=${msg('guide.inspired')}
            ></div>

            <h2>${msg('guide.npm')}</h2>
            <lux-code language="bash" code="npm install @ahriknow/lux" show-header></lux-code>

            <h2>${msg('guide.esm')}</h2>
            <lux-code
                language="javascript"
                .code=${`import { html, render, LuxElement, registerComponent } from '@ahriknow/lux';`}
                show-header
            ></lux-code>

            <h2>${msg('guide.iife')}</h2>
            <lux-code
                language="html"
                .code=${`<script src="dist/lux.iife.min.js"></script>
<script>
  const { html, render, LuxElement } = Lux;
</script>`}
                show-header
            ></lux-code>

            <h2>${msg('guide.template')}</h2>
            <p>
                If you just need <code>html</code> and <code>render</code> without Web Components:
            </p>
            <lux-code
                language="javascript"
                .code=${`import { html, render } from '@ahriknow/lux/template';`}
                show-header
            ></lux-code>

            <h2>${msg('guide.first')}</h2>
            <lux-code
                language="javascript"
                .code=${`import { html, css, LuxElement, registerComponent } from '@ahriknow/lux';

class MyGreeting extends LuxElement {
  static styles = css\`
    :host { display: block; padding: 20px; }
    h2 { color: #6c5ce7; }
  \`;

  static properties = { name: { type: String } };

  render() {
    return html\`<h2>Hello, \${this.name || 'World'}</h2>\`;
  }
}

registerComponent('my-greeting', MyGreeting);`}
                show-header
            ></lux-code>

            <h2>${msg('guide.features')}</h2>

            <h3>${msg('home.featReactive')}</h3>
            <p>${msg('home.featReactiveDesc')}</p>
            <lux-code
                language="javascript"
                .code=${`class MyCounter extends LuxElement {
  static properties = {
    count: { type: Number, reflect: true },
  };

  constructor() {
    super();
    this.count = 0;
  }

  _increment() {
    this.count++;
  }

  render() {
    return html\`<button @click=\${() => this._increment()}>
      Count: \${this.count}
    </button>\`;
  }
}`}
                show-header
            ></lux-code>

            <h3>${msg('home.featStyles')}</h3>
            <p>${msg('home.featStylesDesc')}</p>
            <lux-code
                language="javascript"
                .code=${`class MyCard extends LuxElement {
  static styles = css\`
    :host { display: block; padding: 16px; border-radius: 8px; }
    ::slotted(h2) { margin: 0 0 8px; }
  \`;

  render() {
    return html\`<slot></slot>\`;
  }
}`}
                show-header
            ></lux-code>

            <h3>${msg('home.featRepeat')}</h3>
            <p>${msg('home.featRepeatDesc')}</p>
            <lux-code
                language="javascript"
                .code=${`import { repeat } from '@ahriknow/lux';

class MyList extends LuxElement {
  static properties = { items: { type: Array } };

  constructor() {
    super();
    this.items = [
      { id: 1, text: 'First' },
      { id: 2, text: 'Second' },
      { id: 3, text: 'Third' },
    ];
  }

  render() {
    return html\`
      \${repeat(this.items, item => item.id, item => html\`
        <div>\${item.text}</div>
      \`}
    \`;
  }
}`}
                show-header
            ></lux-code>

            <h3>${msg('home.featBindings')}</h3>
            <p>${msg('home.featBindingsDesc')}</p>
            <lux-code
                language="html"
                .code=${`<!-- Event binding -->
<lux-button @click=\${() => doSomething()}>Click</lux-button>

<!-- Property binding -->
<lux-input .value=\${myValue} .placeholder=\${'Enter text'}></lux-input>

<!-- Boolean attribute -->
<lux-button ?disabled=\${isLoading}>Submit</lux-button>

<!-- Class binding -->
<div class=\${classMap({ active: isActive, disabled: isDisabled })}>Content</div>

<!-- Style binding -->
<div style=\${styleMap({ color: myColor, fontSize: mySize })}>Styled</div>`}
                show-header
            ></lux-code>

            <div class="callout">
                <strong>Next step:</strong> Learn about <a href="#/api">API reference</a> for
                properties, bindings, and directives.
            </div>
        `;
    }
}

export default PageGuide;
