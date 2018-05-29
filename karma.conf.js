module.exports = function (config) {
    config.set({
        basePath: '.',
        frameworks: ["jasmine", "karma-typescript"],
        plugins: [
            "karma-jasmine",
            "karma-phantomjs-launcher",
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
        reporters: ["karma-typescript"],
        browsers: ["PhantomJS"],
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.spec.json",
            coverageOptions: {
                exclude: [/index.ts/i, /\.(d|spec|test|fake)\.ts/i]
            }
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
