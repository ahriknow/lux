/**
 * Locale detection
 */

export function getDefaultLocale() {
    if (typeof navigator !== 'undefined' && navigator.language) {
        return navigator.language;
    }
    return 'en';
}

export function formatNumber(value, options = {}, locale) {
    try {
        return new Intl.NumberFormat(locale, options).format(value);
    } catch {
        return String(value);
    }
}

export function formatDate(value, options = {}, locale) {
    try {
        return new Intl.DateTimeFormat(locale, options).format(value);
    } catch {
        return String(value);
    }
}
