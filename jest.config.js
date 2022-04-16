module.exports = {
    // 文件后缀名
    moduleFileExtensions: ['js', 'json', 'vue', 'jsx'],
    // 文件解析
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
        '^.+\\.js$': 'babel-jest'
    },
    // 解析别名
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    collectCoverage: true, // 输出覆盖率
    coverageDirectory: '<rootDir>/__tests__/coverage', // 指定输出目录
    testMatch: ['<rootDir>/__tests__/**/*.test.js'] // 选择覆盖的文件
}
