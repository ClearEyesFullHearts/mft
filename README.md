# Proof of concept for a fully tested monorepo microservice architecture integrated with circleci and (used to be) deployed on Google Cloud.  
  
# Services:  
## ./front
Vue.JS website which is also the entry point of the REST API located in ./apps/rest-api through the /api endpoint.  
## ./apps/rest-api
API Gateway service, each base endpoint is described in its own Swagger file, used to validate and route requests to their own controller, using [swagger-tools](https://www.npmjs.com/package/swagger-tools).  
Using [asyncapi-pub-middleware](https://www.npmjs.com/package/asyncapi-pub-middleware) it triggers asynchronous events to the other services (RabbitMQ or Kafka) described in the [AsyncAPI](https://www.asyncapi.com/docs/reference/specification/v2.6.0) spec file ./apps/mft.yaml.  
The persistent layer is done with MongoDB, accessed through [mongoose](https://www.npmjs.com/package/mongoose).  
Dockerized in './docker/files/restapi.dockerfile'  
## ./apps/log-manager
A [rabbitmq-express](https://www.npmjs.com/package/rabbitmq-express) server listening to log events from the other services in order to record them in an Elasticsearch server.  
It uses [asyncapi-sub-middleware](https://www.npmjs.com/package/asyncapi-sub-middleware) to validate and route incoming messages and [asyncapi-pub-middleware](https://www.npmjs.com/package/asyncapi-pub-middleware) to trigger mail event in case of high severity log, all that being described in the [AsyncAPI](https://www.asyncapi.com/docs/reference/specification/v2.6.0) spec file ./apps/mft.yaml.  
Dockerized in './docker/files/logmanager.dockerfile'.  
## ./apps/mail-worker
A [rabbitmq-express](https://www.npmjs.com/package/rabbitmq-express) server listening to mail events from the other services in order to send one mail.  
It uses [asyncapi-sub-middleware](https://www.npmjs.com/package/asyncapi-sub-middleware) to validate and route incoming messages and [asyncapi-pub-middleware](https://www.npmjs.com/package/asyncapi-pub-middleware) to trigger log event, all that being described in the [AsyncAPI](https://www.asyncapi.com/docs/reference/specification/v2.6.0) spec file ./apps/mft.yaml.  
Dockerized in './docker/files/mailworker.dockerfile'.  
## ./apps/invoice-worker (coming)
## ./apps/orchestrator (coming)
## ./apps/garbage-collector (coming)
## Others:  
"shared" folder contains all the libraries shared across the apps:  
- "middleware" contains all the middlewares used by the apps.  
- "datalayer" contains the access to the mongo database and the mongoose schemas.
  
"test-api" folder contains the integration tests of the back-end solution written in Gherkin and played with cucumber.js  
"test-front" folder contains the integration tests of the whole application written in Gherkin and played with cucumber.js and selenium  
".circleci" contain the configuration of the circleci pipeline  
"docker" folder contains the different configuration of the containers for each environment  
  
## Compatibility:  
Node.js v18.14.x  
MongoDB v4.2.x  
kafka v5.5.0  
rabbitmq v3.8  
elasticsearch v7.5.2  
  
## Usage:  
- clone the project  
- run "npm install" in the root project and the "front" folder (note: you may have to use "npm install --force" in the "front" folder).  
- In the "docker/dev" folder run "docker-compose up --build" then in the "test-front" or "test-api" folder run "npm run dock-dev"  
- play "npm run dev-report" or "npm run dock-report" to create the html test report in the "test-front/reports" folder  
  
Current test status of master branch: [![ClearEyesFullHearts](https://circleci.com/gh/ClearEyesFullHearts/mft.svg?style=svg)](https://app.circleci.com/pipelines/github/ClearEyesFullHearts)
