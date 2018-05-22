module.exports = function (config) {
    config.set({
        basePath: '.',
        frameworks: ["jasmine", "karma-typescript"],
        plugins: [
            "karma-jasmine",
            "karma-chrome-launcher",
            "karma-jasmine-html-reporter",
            "karma-spec-reporter",
            "karma-typescript"
        ],
        mime: {
            'text/x-typescript': ['ts']
        },
        files: [
            "src/**/*.ts",
            "tests/**/*.ts"
        ],
        preprocessors: {
            "**/*.ts": "karma-typescript"
        },
        reporters: ["kjhtml", "karma-typescript"],
        browsers: ["ChromeHeadlessNoSandbox"],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        },
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.spec.json"
        },
        client: {
            clearContext: false,
            captureConsole: false
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_WARN,
        autoWatch: true,
        singleRun: false,
        concurrency: Infinity
    });
};
