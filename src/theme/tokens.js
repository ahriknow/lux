/**
 * Generate CSS custom properties (tokens) from a palette.
 */

import { hexToRgb, rgbString } from './color.js';

function rgb(hex) {
    const { r, g, b } = hexToRgb(hex);
    return rgbString(r, g, b);
}

/**
 * Generate light theme tokens from palette + semantic colors.
 */
export function generateLightTokens(palette, semantic) {
    return {
        // Primary palette
        'lux-primary-50': rgb(palette[50]),
        'lux-primary-100': rgb(palette[100]),
        'lux-primary-200': rgb(palette[200]),
        'lux-primary-300': rgb(palette[300]),
        'lux-primary-400': rgb(palette[400]),
        'lux-primary-500': rgb(palette[500]),
        'lux-primary-600': rgb(palette[600]),
        'lux-primary-700': rgb(palette[700]),
        'lux-primary-800': rgb(palette[800]),
        'lux-primary-900': rgb(palette[900]),

        // Semantic
        'lux-success': rgb(semantic.success[500]),
        'lux-warning': rgb(semantic.warning[500]),
        'lux-error': rgb(semantic.error[500]),
        'lux-info': rgb(semantic.info[500]),

        // Surface / background (light mode)
        'lux-bg': '15 23 42',
        'lux-bg-alt': '30 41 59',
        'lux-surface': '15 23 42',
        'lux-card': '30 41 59',
        'lux-overlay': '0 0 0 / 50%',

        // Text
        'lux-text': '241 245 249',
        'lux-text-dim': '148 163 184',
        'lux-text-muted': '100 116 139',

        // Border
        'lux-border': '51 65 85',
        'lux-border-light': '71 85 105',

        // Interactive
        'lux-hover': '255 255 255 / 5%',
        'lux-active': '255 255 255 / 10%',
        'lux-focus': '0 0 0 / 40%',

        // Radius
        'lux-radius-sm': '6px',
        'lux-radius': '8px',
        'lux-radius-lg': '12px',
        'lux-radius-xl': '16px',
        'lux-radius-full': '9999px',
    };
}

/**
 * Generate dark theme tokens.
 */
export function generateDarkTokens(palette, semantic) {
    return {
        // Primary — use lighter variants for dark mode
        'lux-primary-50': rgb(palette[900]),
        'lux-primary-100': rgb(palette[800]),
        'lux-primary-200': rgb(palette[700]),
        'lux-primary-300': rgb(palette[600]),
        'lux-primary-400': rgb(palette[400]),
        'lux-primary-500': rgb(palette[500]),
        'lux-primary-600': rgb(palette[300]),
        'lux-primary-700': rgb(palette[200]),
        'lux-primary-800': rgb(palette[100]),
        'lux-primary-900': rgb(palette[50]),

        // Semantic
        'lux-success': rgb(semantic.success[500]),
        'lux-warning': rgb(semantic.warning[500]),
        'lux-error': rgb(semantic.error[500]),
        'lux-info': rgb(semantic.info[500]),

        // Surface (dark mode)
        'lux-bg': '15 23 42',
        'lux-bg-alt': '30 41 59',
        'lux-surface': '15 23 42',
        'lux-card': '30 41 59',
        'lux-overlay': '0 0 0 / 70%',

        // Text
        'lux-text': '241 245 249',
        'lux-text-dim': '148 163 184',
        'lux-text-muted': '100 116 139',

        // Border
        'lux-border': '51 65 85',
        'lux-border-light': '71 85 105',

        // Interactive
        'lux-hover': '255 255 255 / 8%',
        'lux-active': '255 255 255 / 12%',
        'lux-focus': '0 0 0 / 50%',

        // Radius (same as light)
        'lux-radius-sm': '6px',
        'lux-radius': '8px',
        'lux-radius-lg': '12px',
        'lux-radius-xl': '16px',
        'lux-radius-full': '9999px',
    };
}

/**
 * Convert token map to CSS string.
 */
export function tokensToCSS(tokens, indent = '  ') {
    let css = ':root {\n';
    for (const [key, value] of Object.entries(tokens)) {
        css += `${indent}--${key}: ${value};\n`;
    }
    css += '}';
    return css;
}
