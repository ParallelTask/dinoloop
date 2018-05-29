module.exports = function (config) {
    config.set({
        basePath: '../../',
        frameworks: ["jasmine", "karma-typescript"],
        plugins: [
            "karma-jasmine",
            "karma-chrome-launcher",
            "karma-jasmine-html-reporter",
            "karma-typescript"
        ],
        mime: {
            'text/x-typescript': ['ts']
        },
        files: [
            "src/**/*.ts",
            "tests/*.ts",
            "tests/fakes/*.ts",
            "tests/unit/**/*.ts"
        ],
        preprocessors: {
            "**/*.ts": "karma-typescript"
        },
        reporters: ["kjhtml", "karma-typescript"],
        browsers: ["Chrome"],
        karmaTypescriptConfig: {
            tsconfig: "./tsconfig.spec.json",
            coverageOptions: {
                exclude: [/(index|fakes).ts/i, /\.(d|spec|test|fake)\.ts/i]
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
