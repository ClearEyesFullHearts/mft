var reporter = require('cucumber-html-reporter');
 
var options = {
        theme: 'bootstrap',
        jsonFile: './reports/test-api-report.json',
        output: './reports/test-api-report.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true
    };
 
    reporter.generate(options);