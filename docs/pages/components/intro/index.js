import { html, css, LuxElement } from '../../../lux.min.js';
import { msg } from '../../../lux.min.js';
import '../../../complib/lux-icon.min.js';
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
        margin-bottom: 32px;
        line-height: 1.6;
    }
    h2 {
        font-size: 18px;
        font-weight: 600;
        color: rgb(var(--lux-text));
        margin: 48px 0 16px;
    }
    p {
        font-size: 14px;
        color: rgb(var(--lux-text-secondary));
        line-height: 1.6;
        margin-bottom: 12px;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
        margin: 16px 0;
    }

    .card {
        display: block;
        padding: 20px;
        border-radius: var(--lux-radius);
        border: 1px solid rgb(var(--lux-border));
        background: rgb(var(--lux-card));
        text-decoration: none;
        transition: all 0.2s;
        cursor: pointer;
    }
    .card:hover {
        border-color: rgb(var(--lux-primary-400));
        box-shadow: 0 2px 8px rgb(var(--lux-primary-400) / 10%);
        text-decoration: none;
    }

    .card-icon {
        width: 36px;
        height: 36px;
        border-radius: var(--lux-radius-sm);
        background: rgb(var(--lux-primary-400) / 10%);
        color: rgb(var(--lux-primary-400));
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
    }

    .card-name {
        font-size: 15px;
        font-weight: 600;
        color: rgb(var(--lux-text));
        margin-bottom: 4px;
    }

    .card-desc {
        font-size: 13px;
        color: rgb(var(--lux-text-muted));
        line-height: 1.5;
    }

    .install-block {
        background: rgb(var(--lux-bg));
        border: 1px solid rgb(var(--lux-border));
        border-radius: var(--lux-radius);
        padding: 16px 20px;
        font-family: 'SF Mono', Consolas, monospace;
        font-size: 13px;
        color: rgb(var(--lux-text-secondary));
        margin: 12px 0;
        overflow-x: auto;
    }

    .usage-example {
        margin: 16px 0 0;
    }
    .usage-example h3 {
        font-size: 14px;
        font-weight: 600;
        color: rgb(var(--lux-text));
        margin-bottom: 8px;
    }
`;

const COMPONENTS = [
    {
        key: 'layout',
        name: 'Layout',
        icon: 'view_quilt',
        desc: 'intro.desc.layout',
    },
    {
        key: 'menu',
        name: 'Menu',
        icon: 'menu',
        desc: 'intro.desc.menu',
    },
    {
        key: 'scroll',
        name: 'Scroll',
        icon: 'swap_vert',
        desc: 'intro.desc.scroll',
    },
    {
        key: 'example',
        name: 'Example',
        icon: 'visibility',
        desc: 'intro.desc.example',
    },
    {
        key: 'button',
        name: 'Button',
        icon: 'smart_button',
        desc: 'intro.desc.button',
    },
    {
        key: 'input',
        name: 'Input',
        icon: 'edit',
        desc: 'intro.desc.input',
    },
    {
        key: 'switch',
        name: 'Switch',
        icon: 'toggle_on',
        desc: 'intro.desc.switch',
    },
    {
        key: 'dropdown',
        name: 'Dropdown',
        icon: 'arrow_down',
        desc: 'intro.desc.dropdown',
    },
    {
        key: 'icon',
        name: 'Icon',
        icon: 'star',
        desc: 'intro.desc.icon',
    },
    {
        key: 'table',
        name: 'Table',
        icon: 'table_chart',
        desc: 'intro.desc.table',
    },
    {
        key: 'code',
        name: 'Code',
        icon: 'code',
        desc: 'intro.desc.code',
    },
];

class PageComponentsIntro extends LuxElement {
    static styles = styles;

    _desc(item) {
        return msg(item.desc);
    }

    render() {
        return html`
            <h1>${msg('intro.title')}</h1>
            <p class="subtitle">${msg('intro.subtitle')}</p>

            <h2>${msg('intro.quickStart')}</h2>
            <p>${msg('intro.quickStartDesc')}</p>
            <div class="install-block">npm install @ahriknow/lux</div>

            <div class="usage-example">
                <h3>${msg('intro.usageTitle')}</h3>
                <p>${msg('intro.usageDesc')}</p>
                <lux-code
                    language="html"
                    style="height: 600px"
                    show-header
                    .code=${`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lux</title>
  <link rel="stylesheet" href="path/to/lux/src/themes/light.css">
</head>
<body>
  <h1>Lux Intro Example</h1>

  <div class="section">
    <h2>Button</h2>
    <lux-button variant="primary">Click Me</lux-button>
    <lux-button variant="secondary">Secondary</lux-button>
    <lux-button outline>Outline</lux-button>
  </div>

  <div class="section">
    <h2>Switch</h2>
    <lux-switch></lux-switch>
  </div>

  <div class="section">
    <h2>Dropdown (JS .options assignment)</h2>
    <lux-dropdown id="myDd" placeholder="Please select"
      style="width: 200px;"></lux-dropdown>
  </div>

  <div class="section">
    <h2>Dropdown (Lux template .options binding)</h2>
    <div id="lux-mount"></div>
  </div>

  <script type="module">
    import './node_modules/@ahriknow/lux/complib/lux-button.min.js';
    import './node_modules/@ahriknow/lux/complib/lux-switch.min.js';
    import './node_modules/@ahriknow/lux/complib/lux-dropdown.min.js';

    // JS .options assignment
    document.getElementById('myDd').options = [
      { value: 'a', label: 'Option A' },
      { value: 'b', label: 'Option B' },
      { value: 'c', label: 'Option C' }
    ];

    // Lux template .options binding
    import { html, render } from './node_modules/@ahriknow/lux/src/index.js';

    const options = [
      { value: 'x', label: 'Template Option X' },
      { value: 'y', label: 'Template Option Y' },
      { value: 'z', label: 'Template Option Z' }
    ];

    render(
      html\`<lux-dropdown .options=\${options} placeholder="Please select"
        style="width: 200px;"></lux-dropdown>\`,
      document.getElementById('lux-mount')
    );
  </script>
</body>
</html>`}
                ></lux-code>
            </div>

            <h2>${msg('intro.components')}</h2>
            <div class="grid">
                ${COMPONENTS.map(
                    (item) => html`
                        <a
                            class="card"
                            href=${`#/components/${item.key}`}
                            @click=${(e) => {
                                e.preventDefault();
                                location.hash = '#/components/' + item.key;
                            }}
                        >
                            <div class="card-icon">
                                <lux-icon .name=${item.icon} size="20px"></lux-icon>
                            </div>
                            <div class="card-name">${item.name}</div>
                            <div class="card-desc">${this._desc(item)}</div>
                        </a>
                    `
                )}
            </div>
        `;
    }
}

export default PageComponentsIntro;
