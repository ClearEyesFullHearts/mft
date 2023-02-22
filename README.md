# Proof of concept for a fully tested website integrated with circleci and deployed on Google Cloud.  
  
## Description:  
"rest" folder is a REST server written in node.js  
"front" folder is a vue.js website  
"test-api" folder contains the integration tests of the REST server written in Gherkin and played with cucumber.js  
"test-front" folder contains the integration tests of the whole application written in Gherkin and played with cucumber.js and selenium  
"last_reports" folder contains the last reports from the tests and the code coverage report obtained through Istambul  
"docker" folder contains the different configuration of the containers for each environment  
".circleci" contain the configuration of the circleci pipeline  
  
## Compatibility:  
Node.js v18.14.x  
MongoDB v4.2.x  
  
## Usage:  
- clone the project  
- run "npm install" in the "rest", "front", "test-api" and "test-front" folders (note: you may have to use "npm install --force" in the "front" folder)  
- Windows env: in the "test-front" folder run "npm run dev-win-cmd" and then "npm run test-ff-cmd" to test with firefox or "npm run test-gg-cmd" to test with chrome (Note: the fake-smtp-server module is broken by node v18 so some tests will be failing)  
- Linux env: in the "docker/dev" folder run "docker-compose up" then in the "test-front" folder run "npm run dock-dev"  
- play "npm run dev-report" or "npm run dock-report" to create the html test report in the "test-front/reports" folder  
- If you want the code coverage report, start the rest server manually using the "cover" commmands in the "rest" folder; i.e "npm run rest-win-cmd:cover", run the "test-api" tests and the report will be created when you stop the server.
  
Current test status of master branch: [![ClearEyesFullHearts](https://circleci.com/gh/ClearEyesFullHearts/mft.svg?style=svg)](https://app.circleci.com/pipelines/github/ClearEyesFullHearts)
