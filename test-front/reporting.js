const reporter = require('cucumber-html-reporter');

let fileName = 'test-front-report';
if(process.env.REPORT_NAME){
    fileName = process.env.REPORT_NAME;
}
 
const options = {
        theme: 'bootstrap',
        jsonFile: fileName + '.cucumber',
        output: fileName + '.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true
    };
 
    reporter.generate(options);