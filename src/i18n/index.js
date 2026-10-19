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

const stateKey = Symbol.for('@ahriknow/lux/i18n');
const state = (globalThis[stateKey] ||= { locale: '', messages: {}, listeners: [] });

const fallbackMessages = {
    'zh-CN': {
        'modal.confirm': '确定',
        'modal.cancel': '取消',
        'modal.close': '关闭',
        'colorPicker.placeholder': '选择颜色',
        'colorPicker.custom': '自定义',
        'datePicker.time': '选择时间',
        'datePicker.dateRange': '选择日期范围',
        'datePicker.dateTimeRange': '选择日期时间范围',
        'datePicker.dateTime': '选择日期时间',
        'datePicker.date': '选择日期',
        'datePicker.prevYear': '上一年',
        'datePicker.prevMonth': '上一月',
        'datePicker.nextMonth': '下一月',
        'datePicker.nextYear': '下一年',
        'datePicker.rangeStart': '点击选择开始日期，再次点击选择结束日期',
        'datePicker.rangeReset': '再次点击可重新选择',
        'datePicker.clear': '清空',
        'datePicker.cancel': '取消',
        'datePicker.confirm': '确定',
        'select.loading': '搜索中…',
        'select.error': '搜索失败，请重试',
        'select.noResults': '无匹配数据',
        'upload.placeholder': '拖拽文件到此处，或点击选择',
        'upload.supports': '支持 {accept} · ',
        'upload.singleLimit': '单文件 ≤ {size}MB',
        'upload.multiple': ' · 可多选',
        'upload.tooLarge': '「{name}」超过 {size}MB，已忽略',
        'upload.failed': '上传失败',
        'upload.missingUrl': '响应缺少 url',
        'upload.remove': '移除',
    },
    en: {
        'modal.confirm': 'Confirm',
        'modal.cancel': 'Cancel',
        'modal.close': 'Close',
        'colorPicker.placeholder': 'Select color',
        'colorPicker.custom': 'Custom',
        'datePicker.time': 'Select time',
        'datePicker.dateRange': 'Select date range',
        'datePicker.dateTimeRange': 'Select date and time range',
        'datePicker.dateTime': 'Select date and time',
        'datePicker.date': 'Select date',
        'datePicker.prevYear': 'Previous year',
        'datePicker.prevMonth': 'Previous month',
        'datePicker.nextMonth': 'Next month',
        'datePicker.nextYear': 'Next year',
        'datePicker.rangeStart': 'Select a start date, then select an end date',
        'datePicker.rangeReset': 'Select again to start a new range',
        'datePicker.clear': 'Clear',
        'datePicker.cancel': 'Cancel',
        'datePicker.confirm': 'Confirm',
        'select.loading': 'Searching…',
        'select.error': 'Search failed. Please try again.',
        'select.noResults': 'No matching results',
        'upload.placeholder': 'Drop files here, or click to select',
        'upload.supports': 'Supports {accept} · ',
        'upload.singleLimit': 'Max {size}MB per file',
        'upload.multiple': ' · Multiple files allowed',
        'upload.tooLarge': '"{name}" exceeds {size}MB and was skipped',
        'upload.failed': 'Upload failed',
        'upload.missingUrl': 'Response is missing a URL',
        'upload.remove': 'Remove',
    },
    ru: {
        'modal.confirm': 'Подтвердить',
        'modal.cancel': 'Отмена',
        'modal.close': 'Закрыть',
        'colorPicker.placeholder': 'Выберите цвет',
        'colorPicker.custom': 'Другой',
        'datePicker.time': 'Выберите время',
        'datePicker.dateRange': 'Выберите диапазон дат',
        'datePicker.dateTimeRange': 'Выберите диапазон даты и времени',
        'datePicker.dateTime': 'Выберите дату и время',
        'datePicker.date': 'Выберите дату',
        'datePicker.prevYear': 'Предыдущий год',
        'datePicker.prevMonth': 'Предыдущий месяц',
        'datePicker.nextMonth': 'Следующий месяц',
        'datePicker.nextYear': 'Следующий год',
        'datePicker.rangeStart': 'Выберите дату начала, затем дату окончания',
        'datePicker.rangeReset': 'Выберите снова, чтобы начать новый диапазон',
        'datePicker.clear': 'Очистить',
        'datePicker.cancel': 'Отмена',
        'datePicker.confirm': 'Подтвердить',
        'select.loading': 'Поиск…',
        'select.error': 'Ошибка поиска. Повторите попытку.',
        'select.noResults': 'Нет совпадений',
        'upload.placeholder': 'Перетащите файлы сюда или нажмите для выбора',
        'upload.supports': 'Форматы {accept} · ',
        'upload.singleLimit': 'До {size} МБ на файл',
        'upload.multiple': ' · Можно выбрать несколько',
        'upload.tooLarge': '«{name}» превышает {size} МБ и пропущен',
        'upload.failed': 'Ошибка загрузки',
        'upload.missingUrl': 'В ответе отсутствует URL',
        'upload.remove': 'Удалить',
    },
};

function getFallback(locale) {
    return (
        fallbackMessages[locale] || fallbackMessages[locale.split('-')[0]] || fallbackMessages.en
    );
}

/**
 * Get the current translation for a key.
 */
export function msg(key, values = {}) {
    const locale = state.locale || getDefaultLocale();
    const dict = state.messages[locale] || state.messages[locale.split('-')[0]] || state.messages;
    const template = dict[key] ?? getFallback(locale)[key] ?? key;
    return formatMessage(template, values);
}

/**
 * Format a number using Intl.NumberFormat.
 */
export function number(value, options) {
    return formatNumber(
        value,
        typeof options === 'string' ? { style: options } : options,
        state.locale || getDefaultLocale()
    );
}

/**
 * Format a date using Intl.DateTimeFormat.
 */
export function date(value, options) {
    return formatDate(value, options, state.locale || getDefaultLocale());
}

/**
 * Get the current locale string.
 */
export function getLocale() {
    return state.locale;
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
    state.locale = options.locale || getDefaultLocale();
    state.messages = options.messages || {};

    function setLocale(locale) {
        state.locale = locale;
        for (const fn of state.listeners) fn(locale);
    }

    function onLocaleChange(fn) {
        state.listeners.push(fn);
        return () => {
            const i = state.listeners.indexOf(fn);
            if (i >= 0) state.listeners.splice(i, 1);
        };
    }

    return {
        get locale() {
            return state.locale;
        },
        setLocale,
        onLocaleChange,
        msg,
        number,
        date,
        getLocale,
    };
}
