import globals from 'globals';
import css from '@eslint/css';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import baseConfig from '../../eslint.config.mjs';

export default defineConfig([
	...baseConfig,
	globalIgnores(['dist']),
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite
		],
		languageOptions: {
			globals: globals.browser
		}
	},
	{
		files: ['**/*.css'],
		plugins: { css },
		language: 'css/css',
		extends: ['css/recommended'],
		rules: {
			'css/use-baseline': 'off',
			'css/no-invalid-properties': 'off'
		}
	}
]);
