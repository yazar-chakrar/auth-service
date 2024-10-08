## Authentication Microservice

- The authentication microservice is responsible for creating users.
- When a user successfully creates an account, an event is published from the `authentication service` to the `users service`.
- Server side errors from the authentication microservice is sent to `elasticsearch` and can be viewed on `kibana`.
- Authentication service uses these tools as the main tools
  - `My shared library` : The shared library contains codes that are used acrossed the microservices.
  - `NodeJS`
  - `Express`
  - `Typescript`
  - `Rabbitmq`
  - `Elasticsearch`
  - `MySQL database`
  - `Sequelize`
  - `Json web token`
  - `Faker to create seed data`
