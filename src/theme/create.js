/**
 * createTheme — generate a complete theme from colors.
 *
 * Usage:
 *   const theme = createTheme({ primary: '#6c5ce7' });
 *   const theme = createTheme({
 *     primary: '#6c5ce7', success: '#10b981',
 *     warning: '#f59e0b', error: '#ef4444', info: '#3b82f6'
 *   });
 *   theme.setColors({ success: '#22c55e' });
 *   theme.apply();
 */

import { hexToHsl, hslToHex } from './color.js';
import { generatePalette } from './color.js';
import { generateLightTokens, generateDarkTokens, tokensToCSS } from './tokens.js';

const defaultColors = {
    primary: '#6c5ce7',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
};

export function createTheme(options = {}) {
    if (typeof options === 'string') options = { primary: options };

    const _colors = { ...defaultColors, ...options.colors };
    let _dark = options.dark ?? false;
    let _radius = options.radius ?? '8px';
    let _font =
        options.font ?? '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

    function _build() {
        const { h, s, l } = hexToHsl(_colors.primary);
        const palette = generatePalette(h, s, l);

        const semantic = {};
        for (const [name, hex] of Object.entries(_colors)) {
            if (name === 'primary') continue;
            const { h: sh, s: ss } = hexToHsl(hex);
            semantic[name] = { 500: hex, light: hslToHex(sh, 60, 93) };
        }

        const tokens = _dark
            ? generateDarkTokens(palette, semantic)
            : generateLightTokens(palette, semantic);

        tokens['lux-radius'] = _radius;
        tokens['lux-font'] = _font;

        return tokens;
    }

    function _inject(tokens) {
        let el = document.getElementById('lux-theme');
        if (!el) {
            el = document.createElement('style');
            el.id = 'lux-theme';
            document.head.appendChild(el);
        }
        el.textContent = tokensToCSS(tokens);
    }

    return {
        apply() {
            _inject(_build());
        },

        setColors(patch) {
            Object.assign(_colors, patch);
            this.apply();
        },

        setDark(dark) {
            _dark = dark;
            this.apply();
        },
        getCSS() {
            return tokensToCSS(_build());
        },
        getTokens() {
            return _build();
        },
        getColors() {
            return { ..._colors };
        },

        get primary() {
            return _colors.primary;
        },
        get dark() {
            return _dark;
        },
    };
}
