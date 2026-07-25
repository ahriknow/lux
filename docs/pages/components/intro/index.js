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
        desc: {
            zh: '响应式页面布局，支持 header/aside/main/footer 区域',
            en: 'Responsive page layout with header/aside/main/footer regions',
            ru: 'Адаптивный макет страницы с областями header/aside/main/footer',
        },
    },
    {
        key: 'menu',
        name: 'Menu',
        icon: 'menu',
        desc: {
            zh: '菜单组件，支持多级嵌套、图标、选中状态和折叠',
            en: 'Menu component with nested items, icons, selection and collapse',
            ru: 'Компонент меню с вложенными пунктами, иконками и сворачиванием',
        },
    },
    {
        key: 'scroll',
        name: 'Scroll',
        icon: 'swap_vert',
        desc: {
            zh: '自定义滚动条容器，美化滚动条样式',
            en: 'Custom scrollbar container with styled scrollbars',
            ru: 'Контейнер с кастомными полосами прокрутки',
        },
    },
    {
        key: 'example',
        name: 'Example',
        icon: 'visibility',
        desc: {
            zh: '代码示例展示容器，支持展开/折叠代码',
            en: 'Code example container with expand/collapse',
            ru: 'Контейнер для примеров кода со сворачиванием',
        },
    },
    {
        key: 'button',
        name: 'Button',
        icon: 'smart_button',
        desc: {
            zh: '按钮组件，支持多种变体、尺寸、形状和图标',
            en: 'Button component with variants, sizes, shapes and icons',
            ru: 'Кнопка с вариантами, размерами, формами и иконками',
        },
    },
    {
        key: 'input',
        name: 'Input',
        icon: 'edit',
        desc: {
            zh: '输入框组件，支持前后缀、清除按钮和状态',
            en: 'Input component with prefix/suffix, clear button and states',
            ru: 'Поле ввода с префиксом/суффиксом и очисткой',
        },
    },
    {
        key: 'switch',
        name: 'Switch',
        icon: 'toggle_on',
        desc: {
            zh: '开关组件，支持异步切换和加载状态',
            en: 'Switch toggle with async change and loading state',
            ru: 'Переключатель с асинхронным переключением',
        },
    },
    {
        key: 'dropdown',
        name: 'Dropdown',
        icon: 'arrow_down',
        desc: {
            zh: '下拉选择组件，支持自定义选项和清除',
            en: 'Dropdown select with custom options and clear',
            ru: 'Выпадающий список с пользовательскими опциями',
        },
    },
    {
        key: 'icon',
        name: 'Icon',
        icon: 'star',
        desc: {
            zh: '图标组件，支持 Material Icons 和自定义 SVG',
            en: 'Icon component with Material Icons and custom SVG',
            ru: 'Компонент иконок с Material Icons и SVG',
        },
    },
    {
        key: 'table',
        name: 'Table',
        icon: 'table_chart',
        desc: {
            zh: '表格组件，支持动态列和响应式数据',
            en: 'Table component with dynamic columns and reactive data',
            ru: 'Таблица с динамическими колонками и реактивными данными',
        },
    },
    {
        key: 'code',
        name: 'Code',
        icon: 'code',
        desc: {
            zh: '代码高亮组件，支持语法高亮、Mac 风格头部和复制',
            en: 'Syntax highlighting with Mac-style header and copy',
            ru: 'Подсветка синтаксиса с заголовком в стиле Mac и копированием',
        },
    },
];

class PageComponentsIntro extends LuxElement {
    static styles = styles;

    _getLocale() {
        return localStorage.getItem('lux-lang') || 'zh-CN';
    }

    _desc(item) {
        const locale = this._getLocale();
        return item.desc[locale] || item.desc['en'];
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
