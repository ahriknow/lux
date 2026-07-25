<div align="center">

# Lux

[English](./README.md) | **中文**

轻量级 Web Components 框架，提供响应式属性、模板引擎、路由和国际化。

[![npm version](https://img.shields.io/npm/v/@ahriknow/lux.svg)](https://www.npmjs.com/package/@ahriknow/lux)
[![license](https://img.shields.io/npm/l/@ahriknow/lux.svg)](./LICENSE)

</div>

---

## 特性

- **响应式属性** — 声明 `static properties`，Lux 自动处理变更检测、批量更新和增量 DOM 操作
- **Shadow DOM 样式** — `static styles` 配合 `css` 标签模板，通过 `adoptedStyleSheets` 注入
- **模板引擎** — 标签模板字面量，支持事件、属性、布尔、类名和样式绑定
- **repeat() 指令** — 带键列表渲染，O(n) 差异算法
- **路由** — 基于 Hash 的 SPA 路由，支持参数、嵌套路由、懒加载和路由守卫
- **国际化** — ICU MessageFormat，数字/日期格式化
- **主题系统** — CSS 自定义属性，支持亮色/暗色主题
- **零依赖** — 纯 JS 实现，无需构建工具

## 包体积

| 模块 | 大小 |
|------|------|
| Template | 4.5 KB |
| Core | 10.7 KB |
| Router | 4.1 KB |
| i18n | 1.4 KB |
| Theme | 4.0 KB |
| 完整包 | 20.1 KB |

## 安装

```bash
npm install @ahriknow/lux
```

## 快速开始

```javascript
import { html, css, LuxElement, registerComponent } from '@ahriknow/lux';

class MyCounter extends LuxElement {
  static styles = css`
    :host { display: flex; gap: 12px; align-items: center; }
    button { padding: 8px 16px; border-radius: 6px; cursor: pointer; }
  `;

  static properties = { count: { type: Number } };

  constructor() {
    super();
    this.count = 0;
  }

  render() {
    return html`
      <button @click=${() => this.count--}>-</button>
      <span>${this.count}</span>
      <button @click=${() => this.count++}>+</button>
    `;
  }
}

registerComponent('my-counter', MyCounter);
```

## 模板绑定

| 语法 | 类型 | 说明 |
|------|------|------|
| `${value}` | 文本 | 文本插值 |
| `@click=${fn}` | 事件 | 事件监听 |
| `.value=${val}` | 属性 | 属性绑定 |
| `?hidden=${bool}` | 布尔 | 属性开关 |
| `class=${classMap({...})}` | 类名 | 类名绑定 |
| `style=${styleMap({...})}` | 样式 | 样式绑定 |
| `ref=${fn}` | 引用 | 元素引用 |

## 指令

- `repeat(items, keyFn, renderFn)` — 带键列表渲染
- `when(condition, trueFn, falseFn?)` — 条件渲染
- `show(condition)` — 显示切换（`""` 或 `"none"`）
- `nothing` — Symbol，清空容器

## 路由

```javascript
import { createRouter } from '@ahriknow/lux';

createRouter({
  routes: [
    { path: '/', component: HomePage, redirect: '/home', children: [
      { path: '/home', component: () => import('./home.js') },
      { path: '/users/:id', component: () => import('./profile.js') },
    ]}
  ]
});
```

## 国际化

```javascript
import { createI18n, msg } from '@ahriknow/lux';

createI18n({
  locale: 'zh-CN',
  messages: {
    'zh-CN': { hello: '你好', items: '{count, plural, =0{没有} other{# 个}}' },
    'en': { hello: 'Hello', items: '{count, plural, =0{none} other{# items}}' },
  }
});

msg('hello');                // "你好"
msg('items', { count: 5 }); // "5 个"
```

## 许可证

[MIT](./LICENSE)
