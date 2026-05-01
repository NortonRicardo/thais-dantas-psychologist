import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

const eslintConfig = defineConfig([
  // Next.js configurations (já inclui plugins: react, react-hooks, jsx-a11y)
  ...nextVitals,
  ...nextTs,

  // Global ignores
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    '.git/**',
  ]),

  // Regras customizadas estilo Rocketseat
  // (plugins react, react-hooks e jsx-a11y já estão definidos pelo Next.js)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // React rules (plugin já definido pelo Next.js)
      'react/react-in-jsx-scope': 'off', // Next.js não precisa importar React
      'react/prop-types': 'off', // TypeScript cuida disso
      'react/display-name': 'off',

      // React Hooks rules (plugin já definido pelo Next.js)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // JSX A11y rules (plugin já definido pelo Next.js)
      // As regras recomendadas já estão ativas pelo Next.js

      // Regras adicionais estilo Rocketseat
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'off', // TypeScript cuida disso
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Prettier: executa o Prettier como regra do ESLint
      'prettier/prettier': 'error',

      // Prettier config: desabilita regras que conflitam com Prettier
      ...prettierConfig.rules,
    },
  },
])

export default eslintConfig
