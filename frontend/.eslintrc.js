module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
		'node': true,
	},
	'extends': [
		'eslint:recommended',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended-type-checked',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:react/recommended',
		'plugin:import/typescript',
		'plugin:import/recommended',
		'plugin:import/warnings',
		'plugin:import/errors',
		'plugin:compat/recommended',
		'next/core-web-vitals',
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'project': true,
		'tsconfigRootDir': './tsconfig.json',
	},
	'settings': {
		'import/resolver': {
			'eslint-import-resolver-custom-alias': {
				'alias': {
					'components': './app/components',
				},
				'extensions': ['.ts', '.tsx'],
			},
		},
	},
	'rules': {
		'indent': [
			'error',
			'tab',
		],
		'linebreak-style': [
			'error',
			'unix',
		],
		'quotes': [
			'error',
			'single',
		],
		'semi': [
			'error',
			'never',
		],
		'comma-dangle': [
			'error',
			'always-multiline',
		],
		'arrow-parens': [
			'error',
			'always',
		],
		// typescript
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/prefer-ts-expect-error': 'error',
		'@typescript-eslint/ban-ts-comment': 'warn',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'warn',
		'@typescript-eslint/no-unsafe-argument': 'warn',
		'@typescript-eslint/no-unsafe-member-access': 'warn',
		'@typescript-eslint/no-unsafe-call': 'warn',
		'@typescript-eslint/no-misused-promises': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/semi': ['error', 'never'],
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/member-delimiter-style': ['error', {
			'multiline': {
				'delimiter': 'none',
			},
		}],
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		// import
		'import/order': ['error', {
			'newlines-between': 'always',
			// Дефолтное значение
			'groups': [
				'builtin',
				'external',
				'parent',
				'sibling',
				'index',
			],
		}],
		'react/prop-types': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/display-name': 'off',
		'react/no-string-refs': 'off',
		'react/no-unknown-property': 'off',
		'react/jsx-wrap-multilines': ['error', {
			'declaration': 'parens-new-line',
			'assignment': 'parens-new-line',
			'return': 'parens-new-line',
			'arrow': 'parens-new-line',
			'condition': 'parens-new-line',
			'logical': 'parens-new-line',
			'prop': 'parens-new-line',
		}],
		'react/jsx-max-props-per-line': ['error', {
			'maximum': 2,
		}],
		'react/jsx-first-prop-new-line': ['error', 'multiline'],
		'react/jsx-closing-tag-location': 'error',
		'react/jsx-closing-bracket-location': 'error',
		'react/jsx-curly-spacing': ['warn', 'never'],
		'react/jsx-equals-spacing': ['error', 'never'],
		'react/sort-comp': ['warn', {
			'order': [
				'static-methods',
				'instance-variables',
				'lifecycle',
				'getters',
				'setters',
				'everything-else',
				'render',
			],
		}],
		'jsx-quotes': ['error', 'prefer-double'],
		// whitespace
		'no-whitespace-before-property': 'error',
		'key-spacing': ['error', {
			'beforeColon': false,
			'afterColon': true,
		}],
		'space-before-blocks': 'error',
		'arrow-spacing': 'error',
		'space-infix-ops': ['error', {
			'int32Hint': false,
		}],
		'comma-spacing': 'error',
		'object-curly-spacing': ['error', 'always'],
		'keyword-spacing': 'error',
		'no-trailing-spaces': 'error',
		'no-multi-spaces': 'error',

		// newline
		'function-paren-newline': ['error', 'multiline'],
		'function-call-argument-newline': ['error', 'consistent'],
		'object-curly-newline': ['error', {
			'consistent': true,
		}],
		'object-property-newline': ['error', {
			'allowAllPropertiesOnSameLine': false,
		}],

		'no-unneeded-ternary': 'error',
		'no-else-return': 'error',

		'no-multiple-empty-lines': ['error', {
			'max': 1,
			'maxBOF': 0,
		}],
		'no-unsafe-optional-chaining': 'warn',
	},
}
