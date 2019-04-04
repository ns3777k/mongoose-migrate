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

## Testing and Linting
