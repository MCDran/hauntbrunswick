import tsPlugin from '@typescript-eslint/eslint-plugin';  // TypeScript ESLint Plugin
import tsParser from '@typescript-eslint/parser';  // TypeScript Parser
import globals from 'globals';

export default [
    {
        ignores: ['node_modules'],  // Ignore node_modules
    },
    {
        files: ['**/*.ts'],  // Apply to all TypeScript files
        languageOptions: {
            parser: tsParser,  // Set TypeScript parser
            ecmaVersion: 2020,  // Modern ECMAScript features
            sourceType: 'module',  // Use ES module system
            globals: {
                ...globals.node,  // Include Node.js globals like __dirname, process, etc.
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,  // Add TypeScript ESLint plugin
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',  // Example rule: warn on unused variables
            '@typescript-eslint/explicit-function-return-type': 'off',  // Example rule: turn off requiring explicit return types
        },
    },
];
