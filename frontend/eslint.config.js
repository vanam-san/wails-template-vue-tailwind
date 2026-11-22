import vue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import parser from 'vue-eslint-parser'

export default tseslint.config(
  { ignores: ['bindings/**', 'dist/**'] },
  ...tseslint.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: { parser, parserOptions: { parser: tseslint.parser } },
    rules: { 'vue/multi-word-component-names': 'off' },
  },
)
