module.exports = {
    collectCoverage: false,
    coverageDirectory: '<rootDir>/coverage',
    setupFiles: ['<rootDir>/tests/shim.js'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleDirectories: ['node_modules', 'src'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    testMatch: ['**/*.spec.(ts|tsx|js)'],
    testPathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/dest/'],
};
