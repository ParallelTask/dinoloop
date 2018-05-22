module.exports = function (config) {
    config.set({
        basePath: '.',
        frameworks: ["jasmine", "karma-typescript"],
        plugins: [
            "karma-jasmine",
            "karma-spec-reporter",
            "karma-typescript"
        ],
        files: [
            "src/**/*.ts",
            "tests/**/*.ts"
        ],
        preprocessors: {
            "**/*.ts": "karma-typescript"
        },
        reporters: ["karma-typescript"],
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
