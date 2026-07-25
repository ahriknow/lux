/**
 * ICU MessageFormat subset parser
 *
 * Supports:
 *   - Simple interpolation: "Hello, {name}"
 *   - Plural: "{count, plural, =0{No items} =1{# item} other{# items}}"
 *   - Select: "{gender, select, male{He} female{She} other{They}}"
 */

/**
 * Find the matching closing brace for an opening brace at position `start`.
 */
function findMatchingBrace(str, start) {
    let depth = 1;
    for (let i = start + 1; i < str.length; i++) {
        if (str[i] === '{') depth++;
        else if (str[i] === '}') {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}

/**
 * Extract all top-level {...} expressions from the template.
 */
function extractExpressions(template) {
    const parts = [];
    let i = 0;
    while (i < template.length) {
        if (template[i] === '{') {
            const end = findMatchingBrace(template, i);
            if (end !== -1) {
                parts.push({ start: i, end, expr: template.slice(i + 1, end) });
                i = end + 1;
                continue;
            }
        }
        i++;
    }
    return parts;
}

export function formatMessage(template, values = {}) {
    if (!template || typeof template !== 'string') return '';

    const exprs = extractExpressions(template);
    let result = '';
    let lastIdx = 0;

    for (const { start, end, expr } of exprs) {
        result += template.slice(lastIdx, start);
        const trimmed = expr.trim();

        // Plural: {key, plural, =N{...} other{...}}
        const pluralMatch = trimmed.match(/^(\w+),\s*plural\s*,\s*(.+)$/);
        if (pluralMatch) {
            const [, key, rules] = pluralMatch;
            const count = Number(values[key]) || 0;
            result += formatPlural(count, rules);
            lastIdx = end + 1;
            continue;
        }

        // Select: {key, select, val1{...} val2{...}}
        const selectMatch = trimmed.match(/^(\w+),\s*select\s*,\s*(.+)$/);
        if (selectMatch) {
            const [, key, rules] = selectMatch;
            const value = String(values[key] || '');
            result += formatSelect(value, rules);
            lastIdx = end + 1;
            continue;
        }

        // Simple interpolation: {key}
        result += values[trimmed] ?? template.slice(start, end + 1);
        lastIdx = end + 1;
    }

    result += template.slice(lastIdx);
    return result;
}

function formatPlural(count, rulesStr) {
    const rules = parseRules(rulesStr);
    const exact = rules[`=${count}`];
    if (exact !== undefined) return exact.replace(/#/g, String(count));

    const key = count === 1 ? 'one' : 'other';
    const rule = rules[key] || rules['other'] || '';
    return rule.replace(/#/g, String(count));
}

function formatSelect(value, rulesStr) {
    const rules = parseRules(rulesStr);
    return rules[value] || rules['other'] || '';
}

function parseRules(rulesStr) {
    const rules = {};
    const re = /(\w+|=\d+)\{([^}]*)\}/g;
    let m;
    while ((m = re.exec(rulesStr))) {
        rules[m[1]] = m[2];
    }
    return rules;
}
