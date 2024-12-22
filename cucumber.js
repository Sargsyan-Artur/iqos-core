module.exports = {
  default: {
    parallel: 1,
    publishQuiet: true,
    dryRun: false,
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    runFeatures: ['core/tests/features/**/*.feature'],
    paths: ['core/tests/features/**/*.feature'],
    require: ['tsconfig.json', './core/**/**/**/**/*.ts'],
    requireModule: ['ts-node/register']
  }
};
