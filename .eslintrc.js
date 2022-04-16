module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'prettier', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module'
    },
    plugins: ['vue'],
    rules: {}
}
