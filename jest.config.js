module.exports = {
    collectCoverage: false,
    coverageDirectory: '<rootDir>/coverage',
    setupFiles: ['<rootDir>/tests/shim.js'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    testMatch: ['**/*.spec.(ts|tsx|js)'],
    testPathIgnorePatterns: ['<rootDir>/lib/', '<rootDir>/dest/'],
};
