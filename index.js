'use strict';

class MultiSearchBuilder {
    constructor() {
        this.searches = [];
    }

    createSearch(header) {
        const search = {
            header: header,
            body: {}
        };

        this.searches.push(search);
        return new SearchBuilder(search.body);
    }

    build() {
        const result = [];

        this.searches.forEach(search => {
            result.push(search.header);
            result.push(search.body);
        });

        return result;
    }
}

class PublicSearchBuilder {
    constructor() {
        this.body = {};
        this.searchBuilder = new SearchBuilder(this.body);
    }

    setSearchTake(take) {
        return this.searchBuilder.setSearchTake(take);
    }

    setSearchSkip(skip) {
        return this.searchBuilder.setSearchSkip(skip);
    }

    setSearchSource(source) {
        return this.searchBuilder.setSearchSource(source);
    }

    setSearchSort(sort) {
        return this.searchBuilder.setSearchSort(sort);
    }

    createSuggest(name) {
        return this.searchBuilder.createSuggest(name);
    }

    createQuery() {
        return this.searchBuilder.createQuery();
    }

    build() {
        return this.body;
    }
}

class SearchBuilder {
    constructor(searchBody) {
        this.body = searchBody;
    }

    setSearchTake(take) {
        if (this.body.hasOwnProperty('size')) {
            throw new Error('search take value has already been set');
        }

        this.body.size = take;
        return this;
    }

    setSearchSkip(skip) {
        if (this.body.hasOwnProperty('from')) {
            throw new Error('search skip value has already been set');
        }

        this.body.from = skip;
        return this;
    }

    setSearchSource(source) {
        if (this.body.hasOwnProperty('_source')) {
            throw new Error('search source value has already been set');
        }

        this.body._source = source;
        return this;
    }

    setSearchSort(sort) {
        if (this.body.hasOwnProperty('sort')) {
            throw new Error('search sort value has already been set');
        }

        this.body.sort = sort;
        return this;
    }

    createSuggest(name) {
        if (!this.body.suggest) {
            this.body.suggest = {};
        }

        if (this.body.suggest.hasOwnProperty(name)) {
            throw new Error(`suggest with name '${name}' already exists`);
        }

        this.body.suggest[name] = {};
        return new SuggestBuilder(this.body.suggest[name]);
    }

    createQuery() {
        if (this.body.hasOwnProperty('query')) {
            throw new Error('query clause already exists');
        }

        this.body.query = {};
        return new QueryBuilder(this.body.query);
    }
}

class SuggestBuilder {
    constructor(body) {
        this.body = body;
    }

    setSuggestText(text) {
        if (this.body.hasOwnProperty('text')) {
            throw new Error('text value has already been set');
        }

        this.body.text = text;
        return this;
    }

    setSuggestCompletion(completion) {
        if (this.body.hasOwnProperty('completion')) {
            throw new Error('completion value has already been set');
        }

        this.body.completion = completion;
        return this;
    }
}

class QueryBuilder {
    constructor(body) {
        this.body = body;
    }

    createBoolQuery() {
        if (this.body.hasOwnProperty('bool')) {
            throw new Error('bool query already exists');
        }

        this.body.bool = {};
        return new BoolQueryBuilder(this.body.bool);
    }
}

class BoolQueryBuilder {
    constructor(body) {
        this.body = body;
    }

    addFilter() {
        const filter = {};

        if (!this.body.filter) {
            this.body.filter = [];
        }

        this.body.filter.push(filter);
        return new Filter(filter);
    }

    addMust() {
        const must = {};

        if (!this.body.must) {
            this.body.must = [];
        }

        this.body.must.push(must);
        return new Must(must);
    }

    addShould() {
        const should = {};

        if (!this.body.should) {
            this.body.should = [];
        }

        this.body.should.push(should);
        return new Should(should);
    }

    setMinimumShouldMatch(minimumShouldMatch) {
        this.body.minimum_should_match = minimumShouldMatch;
    }
}

class Must {
    constructor(body) {
        this.body = body;
    }

    setMultiMatch(multiMatch) {
        if (this.body.hasOwnProperty('multi_match')) {
            throw new Error('multi_match value has already been set');
        }

        this.body.multi_match = multiMatch;
        return this;
    }

    setMatch(match) {
        if (this.body.hasOwnProperty('match')) {
            throw new Error('match value has already been set');
        }

        this.body.match = match;
        return this;
    }
}

class Should {
    constructor(body) {
        this.body = body;
    }

    setMatch(match) {
        if (this.body.hasOwnProperty('match')) {
            throw new Error('match value has already been set');
        }

        this.body.match = match;
        return this;
    }
}

class Filter {
    constructor(body) {
        this.body = body;
    }

    setTerm(term) {
        if (this.body.hasOwnProperty('term')) {
            throw new Error('term value has already been set');
        }

        this.body.term = term;
        return this;
    }

    setTerms(terms) {
        if (this.body.hasOwnProperty('terms')) {
            throw new Error('terms value has already been set');
        }

        this.body.terms = terms;
        return this;
    }

    setNested(nested) {
        if (this.body.hasOwnProperty('nested')) {
            throw new Error('nested value has already been set');
        }

        this.body.nested = nested;
        return this;
    }

    setGeoBoundingBox(geoBoundingBox) {
        if (this.body.hasOwnProperty('geo_bounding_box')) {
            throw new Error('geo_bounding_box value has already been set');
        }

        this.body.geo_bounding_box = geoBoundingBox;
        return this;
    }
}

module.exports = exports = {
    SearchBuilder: PublicSearchBuilder,
    MultiSearchBuilder: MultiSearchBuilder
};
