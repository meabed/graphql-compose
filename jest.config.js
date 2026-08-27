module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript' },
          target: 'es2016',
        },
        module: { type: 'commonjs' },
      },
    ],
  },
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage/junit/',
        outputName: 'jest-junit.xml',
        classNameTemplate: '{classname} › {title}',
        titleTemplate: '{classname} › {title}',
        suiteName: '{filepath}',
        addFileAttribute: 'true',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
      },
    ],
  ],
};
