# es-search-builder

Query builder for Elasticsearch

[![npm version](https://badge.fury.io/js/es-search-builder.svg)](https://badge.fury.io/js/es-search-builder)
[![Coverage Status](https://coveralls.io/repos/github/stevejay/es-search-builder/badge.svg?branch=master)](https://coveralls.io/github/stevejay/es-search-builder?branch=master)
[![dependency status](https://david-dm.org/stevejay/es-search-builder.svg)](https://david-dm.org/stevejay/es-search-builder)

## Install

```
$ npm install --save es-search-builder
```

## Usage

```js
const MultiSearchBuilder = require('es-search-builder');

const multiSearchBuilder = new MultiSearchBuilder();
const search = multiSearchBuilder.createSearch({ index: 'some-index' });
const query = search.createQuery();
const boolQuery = query.createBoolQuery()
    .addFilter()
    .setTerm({ status: 'Active' });

const result = multiSearchBuilder.build();
```

## License

MIT
