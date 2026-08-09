/**
 * Rollup dev config — docs-only, no minify, fast incremental rebuilds.
 * Usage: rollup -c rollup.dev.config.js --watch
 */

const components = [
  "lux-layout",
  "lux-menu",
  "lux-scroll",
  "lux-example",
  "lux-button",
  "lux-input",
  "lux-radio",
  "lux-switch",
  "lux-select",
  "lux-dropdown",
  "lux-item-group",
  "lux-icon",
  "lux-table",
  "lux-pagination",
  "lux-code",
];

export default [
  // ── Lux full bundle for docs ──
  {
    input: 'src/index.js',
    output: [
      { file: 'docs/lux.min.js', format: 'es' },
    ],
  },
  // ── Individual component bundles for docs/complib ──
  ...components.map(name => ({
    input: `src/components/${name}/index.js`,
    output: [
      { file: `docs/complib/${name}.min.js`, format: 'es' },
    ],
  })),
];
