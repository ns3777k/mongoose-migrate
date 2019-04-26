# mongoose-migrate

[![Build Status](https://travis-ci.org/ns3777k/mongoose-migrate.svg?branch=master)](https://travis-ci.org/ns3777k/mongoose-migrate)
[![npm (scoped)](https://img.shields.io/npm/v/@ns3777k/mongoose-migrate.svg)](https://www.npmjs.com/package/@ns3777k/mongoose-migrate)
[![codecov](https://codecov.io/gh/ns3777k/mongoose-migrate/branch/master/graph/badge.svg)](https://codecov.io/gh/ns3777k/mongoose-migrate)

A dead simple mongoose migrations tool for mongoose 5.

```bash
$ npm install --save @ns3777k/mongoose-migrate
```

Or

```bash
$ yarn add @ns3777k/mongoose-migrate
```

And finally you can manage your migrations:

```bash
$ migrate --help
```

Take a look at [Contributing guide](CONTRIBUTING.md) for development purposes.

## Docker

You can use pre-built image to run migrations:

```bash
$ docker run --rm \
    -v /my/project/path:/project \
    ns3777k/mongoose-migrate \
    --dsn mongodb://... \
    -m /project/src/migrations up
``` 

Here we're mounting the whole project and then specify path to migration directory. The reason to do that is because
your migrations can use modules from `node_modules` directory or separated schemas (like in example below).

## Example migration

```javascript
// Migration: 1555839074983-example-migration.js

import { Schema as AdvSchema } from '../schemas/adv';

/**
 * @param {Mongoose} mongoose
 * @returns {Promise}
 */
export async function up(mongoose) {
  mongoose.model('Adv', AdvSchema, 'Adv');
  await mongoose.model('Adv').insertMany([
    {
      title: 'Use github!',
      text: 'Use github for free!'
    },
    {
      title: 'Use adblock',
      text: 'Use adblock to block the advs'
    }
  ]);
}

/**
 * @param {Mongoose} mongoose
 * @returns {Promise}
 */
export async function down(mongoose) {
  mongoose.model('Adv', AdvSchema, 'Adv');
  await mongoose.model('Adv').deleteMany();
}
```
