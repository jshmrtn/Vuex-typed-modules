module.exports = {
  moduleFileExtensions: ["js", "vue", "ts", "tsx"],
  transform: {
    "^.+\\.vue$": "vue-jest",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleDirectories: ["node_modules"],
  testPathIgnorePatterns: ["/node_modules/"],
  setupFiles: ["./tests/setup.ts"],
  testMatch: ["<rootDir>/**/*.spec.(ts|tsx)"],
  testURL: "http://localhost/",
  collectCoverage: true,
  collectCoverageFrom: ["src/*.ts"],
  transformIgnorePatterns: ["/node_modules/"],
  globals: {
    "ts-jest": {
      babelConfig: true,
      diagnostics: false
    },
  },
};
