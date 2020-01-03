var reporter = require('cucumber-html-reporter');
 
var options = {
        theme: 'bootstrap',
        jsonFile: './reports/test-front-report.json',
        output: './reports/test-front-report.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true
    };
 
    reporter.generate(options);