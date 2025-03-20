# loopback4-todo

This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Database Setup (MySQL)
Ensure you have a running MySQL database and create a database for this project.

Configure your database connection in `src/datasources/db.datasource.ts`.

You can use `.env` file to setting the env.


## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.
Open http://127.0.0.1:3000/explorer/ to get the api docs.

```
#Todo API

Create a Todo - POST /todos

Retrieve Todos (with filtering and pagination) - GET /todos

Retrieve a single Todo and its Items - GET /todos/{id}

Update a Todo - PATCH /todos/{id}

Soft delete a Todo - DELETE /todos/{id}

#Item API

Create an Item - POST /items

Retrieve Items under a Todo (Supports filtering) - GET /todos/{todoId}/items

Update an Item - PATCH /items/{id}

Hard delete an Item - DELETE /items/{id}
```


## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run rebuild
```

## Fix code style and formatting issues

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)
