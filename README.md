# es-search-builder

Query builder for Elasticsearch

[![npm version](https://badge.fury.io/js/es-search-builder.svg)](https://badge.fury.io/js/es-search-builder)
[![Codeship Status for stevejay/es-search-builder](https://app.codeship.com/projects/46bccee0-a5a5-0134-4955-3633a5896bfa/status?branch=master)](https://app.codeship.com/projects/190905)
[![Coverage Status](https://coveralls.io/repos/github/stevejay/es-search-builder/badge.svg?branch=master)](https://coveralls.io/github/stevejay/es-search-builder?branch=master)
[![dependency status](https://david-dm.org/stevejay/es-search-builder.svg)](https://david-dm.org/stevejay/es-search-builder)
![license](https://img.shields.io/npm/l/es-search-builder.svg)

[![NPM](https://nodei.co/npm/es-search-builder.png)](https://nodei.co/npm/es-search-builder/)

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
