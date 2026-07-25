<div align="center">

# Lux

**English** | [中文](./README_zh-CN.md)

A lightweight Web Components framework with reactive properties, template engine, router, and i18n.

[![npm version](https://img.shields.io/npm/v/@ahriknow/lux.svg)](https://www.npmjs.com/package/@ahriknow/lux)
[![license](https://img.shields.io/npm/l/@ahriknow/lux.svg)](./LICENSE)

</div>

---

## Features

- **Reactive Properties** — Declare `static properties`, Lux handles change detection, batching, and incremental DOM updates
- **Shadow DOM Styles** — `static styles` with `css` tagged template, injected via `adoptedStyleSheets`
- **Template Engine** — Tagged template literals with event, property, boolean, class, and style bindings
- **repeat() Directive** — Keyed list rendering with O(n) diff algorithm
- **Router** — Hash-based SPA routing with params, nested routes, lazy loading, and guards
- **i18n** — ICU MessageFormat with number/date formatting
- **Theme System** — CSS custom properties for light/dark themes
- **Zero Dependencies** — Pure JS, no build-time requirements for end users

## Bundle Size

| Module | Size |
|--------|------|
| Template | 4.5 KB |
| Core | 10.7 KB |
| Router | 4.1 KB |
| i18n | 1.4 KB |
| Theme | 4.0 KB |
| Full | 20.1 KB |

## Install

```bash
npm install @ahriknow/lux
```

## Quick Start

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

## Template Bindings

| Syntax | Type | Description |
|--------|------|-------------|
| `${value}` | Text | Text interpolation |
| `@click=${fn}` | Event | Event listener |
| `.value=${val}` | Property | Property binding |
| `?hidden=${bool}` | Boolean | Attribute toggle |
| `class=${classMap({...})}` | Class | Class binding |
| `style=${styleMap({...})}` | Style | Style binding |
| `ref=${fn}` | Ref | Element reference |

## Directives

- `repeat(items, keyFn, renderFn)` — Keyed list rendering
- `when(condition, trueFn, falseFn?)` — Conditional rendering
- `show(condition)` — Display toggle (`""` or `"none"`)
- `nothing` — Symbol to clear a container

## Router

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

## i18n

```javascript
import { createI18n, msg } from '@ahriknow/lux';

createI18n({
  locale: 'en',
  messages: {
    'en': { hello: 'Hello', items: '{count, plural, =0{No items} other{# items}}' },
    'ru': { hello: 'Привет', items: '{count, plural, =0{Нет элементов} other{# элементов}}' },
  }
});

msg('hello');                // "Hello"
msg('items', { count: 5 });  // "5 items"
```

## License

[MIT](./LICENSE)
