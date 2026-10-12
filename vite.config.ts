import adapter from '@sveltejs/adapter-static'
import { sveltekit } from '@sveltejs/kit/vite'

import { defineConfig, lazyPlugins } from 'vite-plus'

export default defineConfig({
  fmt: {
    singleQuote: true,
    jsxSingleQuote: false,
    quoteProps: 'as-needed',
    trailingComma: 'es5',
    semi: false,
    svelte: true,
  },
  lint: {
    plugins: ['typescript', 'unicorn', 'oxc', 'import', 'promise'],
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  plugins: lazyPlugins(() => [
    sveltekit({
      adapter: adapter({
        fallback: 'index.html',
      }),
      compilerOptions: {
        experimental: {
          async: true,
        },
      },
    }),
  ]),
})
