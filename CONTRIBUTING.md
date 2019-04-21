# Contributing

## Development

Clone project:

```bash
$ git clone git@github.com:ns3777k/mongoose-migrate.git
```

Start local mongodb:
 
```bash
$ docker run --rm -p27017:27017 mongo
```

To run javascript use `babel-node`: 

```bash
$ babel-node src/cli.js --dsn mongodb://127.0.0.1:27017/mongoose-migration create testing-migration
```

## Building

[Webpack](https://webpack.js.org/) is used to build this project to a single script using:

```bash
$ npm run build
```

## Testing and Linting

[Prettier](https://prettier.io/) and [eslint](https://eslint.org/) are used to check code style and errors.
[Jest](https://jestjs.io/) is used as a testing framework.

```bash
$ npm test
```
