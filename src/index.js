/**
 * Lux — Lightweight Web Components Framework
 */

// ─── Core exports ───

// Template engine
export { html, svg, css, render, isTemplateResult, nothing, escapeHtml } from './template.js';

// Directives
export { repeat, when, show, classMap, styleMap, guard } from './template.js';

// Element base class
export { LuxElement, registerComponent, createComponent } from './element.js';

export { createRouter } from './router.js';

export { createI18n, msg, number, date, getLocale } from './i18n/index.js';

export { createTheme } from './theme/index.js';

export const version = '0.1.0';
