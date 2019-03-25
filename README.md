## Before start:

Run PostgreSQL:

```
docker run -td -p 5432:5432 postgres:11.2-alpine
```

install packages:

```
npm i -g yarn
yarn install
```

## Start in development:

Run:

```
yarn start
```

when the schema is changed, it is necessary to rebuild the `swagger` configuration:

```
yarn swagger
#OR
yarn swagger:watch
```

> visit `localhots:3010/api-docs/` to see swagger the API documentation

Debug (VScode only):

> start `Launch` debug configurations

## Tests:

Run:

```
yarn start
```

Debug (VScode only):

> start `Run mochapack` debug configurations

## Build for production:

Run:

```
yarn build
```


---

## Todo

- omit extra properties from the DTO objects (write custom tsoa template)

## known issues:

- swagger ui gives wrong ids for each endpoint
