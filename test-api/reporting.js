var reporter = require('cucumber-html-reporter');

let fileName = 'test-api-report';
if(process.env.REPORT_NAME){
    fileName = process.env.REPORT_NAME;

var options = {
        theme: 'bootstrap',
        jsonFile: fileName + '.cucumber',
        output: fileName + '.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true
    };
 
    reporter.generate(options);