import terser from '@rollup/plugin-terser';

const minify = terser();

const components = [
  "lux-layout",
  "lux-menu",
  "lux-scroll",
  "lux-example",
  "lux-button",
  "lux-input",
  "lux-switch",
  "lux-dropdown",
  "lux-icon",
  "lux-table",
  "lux-code",
];

const compName = (name) => name.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');

export default [
  // ── Lux full bundle for docs (self-contained) ──
  {
    input: 'src/index.js',
    output: [
      { file: 'docs/lux.min.js', format: 'es', plugins: [minify] },
    ],
  },
  // ── Individual component bundles for docs/complib ──
  ...components.map(name => ({
    input: `src/components/${name}/index.js`,
    output: [
      { file: `docs/complib/${name}.min.js`, format: 'es', plugins: [minify] },
    ],
  })),
  // ── Full bundle: all modules ──
  {
    input: 'src/index.js',
    output: [
      { file: 'dist/lux.js', format: 'es', sourcemap: true },
      { file: 'dist/lux.min.js', format: 'es', plugins: [minify] },
      { file: 'dist/lux.iife.js', format: 'iife', name: 'Lux', sourcemap: true },
      { file: 'dist/lux.iife.min.js', format: 'iife', name: 'Lux', plugins: [minify] },
    ],
  },
  // ── Template only ──
  {
    input: 'src/template.js',
    output: [
      { file: 'dist/lux.template.min.js', format: 'es', plugins: [minify] },
    ],
  },
  // ── Core: template + element ──
  {
    input: 'src/core.js',
    output: [
      { file: 'dist/lux.core.min.js', format: 'es', plugins: [minify] },
    ],
  },
  // ── Router standalone ──
  {
    input: 'src/router.js',
    output: [
      { file: 'dist/lux.router.min.js', format: 'es', plugins: [minify] },
    ],
  },
  // ── i18n standalone ──
  {
    input: 'src/i18n/index.js',
    output: [
      { file: 'dist/lux.i18n.min.js', format: 'es', plugins: [minify] },
    ],
  },
  // ── theme standalone ──
  {
    input: 'src/theme/index.js',
    output: [
      { file: 'dist/lux.theme.min.js', format: 'es', plugins: [minify] },
    ],
  },
  // ── dist component bundles ──
  ...components.map(name => ({
    input: `src/components/${name}/index.js`,
    output: [
      { file: `dist/components/${name}/index.min.js`, format: 'es', plugins: [minify] },
      { file: `dist/components/${name}/index.iife.min.js`, format: 'iife', name: compName(name), plugins: [minify] },
    ],
  }))
];
