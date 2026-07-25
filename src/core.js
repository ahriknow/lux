/**
 * Lux Core — template engine + element base class
 * Use this when you need Web Components but not router/i18n/theme.
 */
export { html, svg, css, render, isTemplateResult, nothing, escapeHtml } from './template.js';
export { repeat, when, show, classMap, styleMap, guard } from './template.js';
export { LuxElement, registerComponent, createComponent } from './element.js';
