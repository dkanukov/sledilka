module.exports = {
	'env': {
		'browser': true,
		'es2021': true,
		'node': true,
	},
	'extends': [
		'eslint:recommended',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:react/recommended',
		'plugin:import/typescript',
		'plugin:import/recommended',
		'plugin:import/warnings',
		'plugin:import/errors',
		'plugin:compat/recommended',
	],
	'overrides': [
		{
			'env': {
				'node': true,
			},
			'files': [
				'.eslintrc.{js,cjs}',
			],
			'parserOptions': {
				'sourceType': 'script',
			},
		},
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module',
	},
	'plugins': [
		'@typescript-eslint',
		'react',
	],
	'settings': {
		'import/resolver': {
			'alias': [
				['@/*', './*'],
			],
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
		'comma-dangle': ['error', 'always-multiline'],
		'arrow-parens': ['error', 'always'],

		// typescript
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/prefer-ts-expect-error': 'error',
		'@typescript-eslint/ban-ts-comment': 'warn',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/semi': ['error', 'never'],
		'@typescript-eslint/member-delimiter-style': ['error', {
			multiline: {
				delimiter: 'none',
			},
		}],
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/ban-types': [
			'warn',
			{
				types: {
					Omit: 'Prefer use \'OmitStrict\' from @fe/types',
				},
			},
		],
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

		// jsx
		'react/prop-types': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/display-name': 'off',
		'react/no-string-refs': 'off',
		'react/no-unknown-property': 'off',
		'react/jsx-wrap-multilines': ['error', {
			declaration: 'parens-new-line',
			assignment: 'parens-new-line',
			return: 'parens-new-line',
			arrow: 'parens-new-line',
			condition: 'parens-new-line',
			logical: 'parens-new-line',
			prop: 'parens-new-line',
		}],
		'react/jsx-max-props-per-line': ['error', {
			maximum: 2,
		}],
		'react/jsx-first-prop-new-line': ['error', 'multiline'],
		'react/jsx-closing-tag-location': 'error',
		'react/jsx-closing-bracket-location': 'error',

		// TODO: (historycal case) нужно вернуть ошибку в мажорном релизе
		'react/jsx-one-expression-per-line': 'off',
		// 'react/jsx-one-expression-per-line': ['off', {
		// 	allow: 'literal',
		// }],

		// TODO: (historycal case) `warn` нужно обратно заменить на `error` в мажорном релизе
		'react/jsx-max-depth': ['warn', {
			max: 5,
		}],
		'react/jsx-curly-spacing': ['warn', 'never'],
		'react/jsx-equals-spacing': ['error', 'never'],
		'react/sort-comp': ['warn', {
			order: [
				'static-methods',
				'instance-variables',
				'lifecycle',
				'getters',
				'setters',
				'everything-else',
				'render',
			],
			groups: {
				lifecycle: [
					'name',
					'beforeCreate',
					'created',
					'beforeMount',
					'mounted',
					'beforeUpdate',
					'updated',
					'beforeDestroy',
					'destroyed',
				],
			},
		}],
		'jsx-quotes': ['error', 'prefer-double'],
		// whitespace
		'no-whitespace-before-property': 'error',
		'key-spacing': ['error', {
			beforeColon: false,
			afterColon: true,
		}],
		'space-before-blocks': 'error',
		'arrow-spacing': 'error',
		'space-infix-ops': ['error', {
			int32Hint: false,
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
			allowAllPropertiesOnSameLine: false,
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
