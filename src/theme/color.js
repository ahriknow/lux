/**
 * Color utilities — HSL-based color generation from a seed color
 */

// ─── Conversion ───

export function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
    };
}

export function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
}

export function hexToHsl(hex) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHsl(r, g, b);
}

export function hslToHex(h, s, l) {
    const { r, g, b } = hslToRgb(h, s, l);
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function rgbString(r, g, b) {
    return `${r} ${g} ${b}`;
}

// ─── Palette generation ───

/**
 * Generate a 10-step palette (50-900) from a seed HSL.
 * Lightness curve: 50→97%, 100→93%, 200→86%, 300→76%, 400→64%,
 *                  500→seed%, 600→45%, 700→38%, 800→28%, 900→18%
 */
export function generatePalette(h, s, l) {
    const steps = [
        [50, 97, 90],
        [100, 93, 85],
        [200, 86, 78],
        [300, 76, 68],
        [400, 64, 58],
        [500, s, l], // seed
        [600, s, 45],
        [700, s, 38],
        [800, s, 28],
        [900, s, 18],
    ];

    const palette = {};
    for (const [step, sat, light] of steps) {
        palette[step] = hslToHex(h, sat, light);
    }
    return palette;
}

/**
 * Generate semantic colors by shifting hue from seed.
 * success: +120°, warning: +40°, error: -20° (or +340°), info: +200°
 */
export function generateSemantic(h, s, l) {
    const shift = (hue, sat, light) => {
        const h2 = ((hue % 360) + 360) % 360;
        return hslToHex(h2, sat, light);
    };

    return {
        success: {
            500: shift(h + 120, 72, 45),
            light: shift(h + 120, 60, 92),
        },
        warning: {
            500: shift(h + 40, 85, 55),
            light: shift(h + 40, 80, 93),
        },
        error: {
            500: shift(h - 20, 78, 55),
            light: shift(h - 20, 70, 93),
        },
        info: {
            500: shift(h + 200, 72, 55),
            light: shift(h + 200, 65, 93),
        },
    };
}
