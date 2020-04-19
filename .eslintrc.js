module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/essential',
		'eslint:recommended'
	],
	parserOptions: {
		parser: 'babel-eslint'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
		'no-mixed-spaces-and-tabs': 'off',
      'vue/no-multi-spaces': 'warn',
      'vue/require-default-prop': 'warn',
      'vue/require-prop-types': 'warn',
      'vue/v-bind-style': 'warn',
      'vue/v-on-style': 'warn',
      'vue/arrow-spacing': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
	}
}
