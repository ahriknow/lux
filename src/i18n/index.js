/**
 * Lux i18n — Lightweight internationalization
 *
 * Usage:
 *   import { createI18n, msg, number, date } from 'lux/i18n';
 *
 *   const i18n = createI18n({
 *     locale: 'zh-CN',
 *     messages: {
 *       'zh-CN': { hello: '你好', welcome: '欢迎, {name}' },
 *       'en': { hello: 'Hello', welcome: 'Welcome, {name}' },
 *     }
 *   });
 *
 *   // In templates
 *   html`<h1>${msg('hello')}</h1>`
 *   html`<p>${msg('welcome', { name: 'Alice' })}</p>`
 *   html`<span>${msg('items', { count: 5 })}</span>`
 *
 *   // Number/date formatting
 *   html`<span>${number(1234567)}</span>`
 *   html`<span>${date(new Date())}</span>`
 */

import { formatMessage } from './format.js';
import { getDefaultLocale, formatNumber, formatDate } from './locale.js';

let currentLocale = '';
let currentMessages = {};
let listeners = [];

/**
 * Get the current translation for a key.
 */
export function msg(key, values = {}) {
    const dict = currentMessages[currentLocale] || currentMessages;
    const template = dict[key] ?? key;
    return formatMessage(template, values);
}

/**
 * Format a number using Intl.NumberFormat.
 */
export function number(value, options) {
    return formatNumber(
        value,
        typeof options === 'string' ? { style: options } : options,
        currentLocale
    );
}

/**
 * Format a date using Intl.DateTimeFormat.
 */
export function date(value, options) {
    return formatDate(value, options, currentLocale);
}

/**
 * Get the current locale string.
 */
export function getLocale() {
    return currentLocale;
}

/**
 * Create an i18n instance.
 *
 * @param {Object} options
 * @param {string} options.locale - Initial locale (default: navigator.language)
 * @param {Object} messages - { 'zh-CN': {...}, 'en': {...} }
 * @returns {Object} i18n instance
 */
export function createI18n(options = {}) {
    currentLocale = options.locale || getDefaultLocale();
    currentMessages = options.messages || {};

    function setLocale(locale) {
        currentLocale = locale;
        for (const fn of listeners) fn(locale);
    }

    function onLocaleChange(fn) {
        listeners.push(fn);
        return () => {
            const i = listeners.indexOf(fn);
            if (i >= 0) listeners.splice(i, 1);
        };
    }

    return {
        get locale() {
            return currentLocale;
        },
        setLocale,
        onLocaleChange,
        msg,
        number,
        date,
        getLocale,
    };
}
