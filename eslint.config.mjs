import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import { defineConfig, globalIgnores } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
    globalIgnores(['**/dist/*', 'samples/*/*.js', '**/package-lock.json']),
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
    },
    tseslint.configs.recommended,
    {
        plugins: {
            '@stylistic': stylistic,
        },

        rules: {
            'one-var': ['error', 'never'],
            'no-undef': 'off', // handled better by TS
            'prefer-const': 'error',
            'spaced-comment': ['error', 'always'],
            'no-shadow': 'error',
            'no-prototype-builtins': 'off', // samples show more vanilla patterns
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        extends: [...tseslint.configs.recommendedTypeChecked],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            'no-shadow': 'off', // required to enable @typescript-eslint/no-shadow
            '@typescript-eslint/no-shadow': 'error',
            '@typescript-eslint/no-deprecated': 'error',
            '@typescript-eslint/no-misused-promises': [
                'error',
                {
                    checksVoidReturn: {
                        arguments: false,
                        attributes: false,
                    },
                },
            ],
            '@typescript-eslint/no-namespace': [
                'error',
                { allowDeclarations: true, allowDefinitionFiles: true },
            ],

            // temporarily downgraded to warn for historic reasons:
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
        },
    },
    {
        files: ['**/*.json'],
        plugins: { json },
        language: 'json/json',
        extends: ['json/recommended'],
    },
    {
        files: ['**/*.jsonc'],
        plugins: { json },
        language: 'json/jsonc',
        extends: ['json/recommended'],
    },
    {
        files: ['**/*.json5'],
        plugins: { json },
        language: 'json/json5',
        extends: ['json/recommended'],
    },
    {
        files: ['**/*.md'],
        plugins: { markdown },
        language: 'markdown/gfm',
        extends: ['markdown/recommended'],
        rules: {
            // temporarily disabled for historic reasons:
            'markdown/no-empty-links': 'off',
            'markdown/no-missing-label-refs': 'off',
        },
    },
    {
        files: ['**/*.css'],
        plugins: { css },
        language: 'css/css',
        extends: ['css/recommended'],
        rules: {
            'css/use-baseline': 'off',
        },
    },
]);
