module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    '@vue/prettier'
  ],
  plugins: ['vue'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    indent: [1, 2],
    eqeqeq: [1, 'always'],
    'import/no-unresolved': 'off',
    'vue/valid-v-model': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    'vue/no-v-html': 'off',
    'vue/no-dupe-keys': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/no-template-key': 'off',
    'prettier/prettier': [
      'off',
      {
        semi: false,
        singleQuote: true,
        endOfLine: 'auto'
      }
    ]
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {}
    }
  ],
  settings: {
    'import/resolver': {
      //配置/src目录下的索引
      alias: {
        map: [['/@/', 'src']]
      }
    }
  }
}
