'use strict';

const should = require('should');
const MultiSearchBuilder = require('../index').MultiSearchBuilder;
const SearchBuilder = require('../index').SearchBuilder;

// need to remove the getter added by shouldjs
delete Object.prototype.should;

describe('es-search-builder', function() {
    describe('SearchBuilder', function() {
        describe('setSearchSort', function() {
            it('should set the search sort', function() {
                const subject = new SearchBuilder();
                subject.setSearchSort([{ _score: { order: 'desc' } }]);

                const result = subject.build();

                should(result).eql({ sort: [{ _score: { order: 'desc' } }] });
            });

            it('should throw when setting the search sort twice', function() {
                const subject = new SearchBuilder();
                subject.setSearchSort([{ _score: { order: 'desc' } }]);

                should(() => subject.setSearchSort([{ _score: { order: 'desc' } }]))
                    .throw(/already been set/);
            });
        });

        describe('setSearchSource', function() {
            it('should set the search source', function() {
                const subject = new SearchBuilder();
                subject.setSearchSource(['id', 'name']);

                const result = subject.build();

                should(result).eql({ _source: ['id', 'name'] });
            });

            it('should throw when setting the search source twice', function() {
                const subject = new SearchBuilder();
                subject.setSearchSource(['id', 'name']);
                should(() => subject.setSearchSource(['id', 'name'])).throw(/already been set/);
            });
        });

        describe('setSearchTake', function() {
            it('should set the search take', function() {
                const subject = new SearchBuilder();
                subject.setSearchTake(5);

                const result = subject.build();

                should(result).eql({ size: 5 });
            });

            it('should throw when setting the search take twice', function() {
                const subject = new SearchBuilder();
                subject.setSearchTake(5);
                should(() => subject.setSearchTake(5)).throw(/already been set/);
            });
        });

        describe('setSearchSkip', function() {
            it('should set the search skip', function() {
                const subject = new SearchBuilder();
                subject.setSearchSkip(5);

                const result = subject.build();

                should(result).eql({ from: 5 });
            });

            it('should throw when setting the search skip twice', function() {
                const subject = new SearchBuilder();
                subject.setSearchSkip(5);
                should(() => subject.setSearchSkip(5)).throw(/already been set/);
            });
        });

        describe('createQuery', function() {
            it('should create the query', function() {
                const subject = new SearchBuilder();
                subject.createQuery();

                const result = subject.build();

                should(result).eql({
                    query: {}
                });
            });

            it('should throw when trying to create a query twice', function() {
                const subject = new SearchBuilder();
                subject.createQuery();

                should(() => subject.createQuery()).throw(/already exists/);
            });
        });

        describe('createSuggest', function() {
            it('should create a suggest', function() {
                const subject = new SearchBuilder();
                const result = subject.createSuggest('my-suggest');

                should(result.body).eql({});
            });

            it('should throw when trying to create a suggest twice', function() {
                const subject = new SearchBuilder();
                subject.createSuggest('my-suggest');

                should(() => subject.createSuggest('my-suggest')).throw(/already exists/);
            });

            it('should add the suggest correctly to the build', function() {
                const subject = new SearchBuilder();
                subject.createSuggest('my-suggest');

                const result = subject.build();

                should(result).eql({
                    suggest: { 
                        'my-suggest': {}
                    }
                });
            });
        });
    });

    describe('SuggestBuilder', function() {
        describe('setSuggestText', function() {
            it('should set the suggest text', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const searchBuilder = multiSearchBuilder.createSearch({ index: 'some-index' });
                const subject = searchBuilder.createSuggest('my-suggest');
                subject.setSuggestText('the text');

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    { 
                        suggest: {
                            'my-suggest': {
                                text: 'the text'
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the suggest text twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const searchBuilder = multiSearchBuilder.createSearch({ index: 'some-index' });
                const subject = searchBuilder.createSuggest('my-suggest');
                subject.setSuggestText('a');
                should(() => subject.setSuggestText('b')).throw(/already been set/);
            });
        });

        describe('setSuggestCompletion', function() {
            it('should set the suggest completion', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const searchBuilder = multiSearchBuilder.createSearch({ index: 'some-index' });
                const subject = searchBuilder.createSuggest('my-suggest');
                subject.setSuggestCompletion({ size: 1 });

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    { 
                        suggest: {
                            'my-suggest': {
                                completion: {
                                    size: 1
                                }
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the suggest completion twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const searchBuilder = multiSearchBuilder.createSearch({ index: 'some-index' });
                const subject = searchBuilder.createSuggest('my-suggest');
                subject.setSuggestCompletion({ size: 1 });
                should(() => subject.setSuggestCompletion({ size: 2 })).throw(/already been set/);
            });
        });
    });

    describe('Filter', function() {
        describe('setGeoBoundingBox', function() {
            it('should set the geo bounding box', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                subject.setGeoBoundingBox({ type: 'indexed' });

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                filter: [{
                                    geo_bounding_box: { type: 'indexed' }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the geo bounding box twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                subject.setGeoBoundingBox({ type: 'indexed' });
                should(() => subject.setGeoBoundingBox({ type: 'indexed' })).throw(/already been set/);
            });
        });

        describe('setNested', function() {
            it('should set the nested clause', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                subject.setNested({ status: 'Active' });

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                filter: [{
                                    nested: { status: 'Active' }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the nested clause twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                subject.setNested({ status: 'Active' });
                should(() => subject.setNested({ status: 'Active' })).throw(/already been set/);
            });
        });

        describe('setTerms', function() {
            it('should set the terms', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                subject.setTerms({ tags: ['a', 'b'] });

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                filter: [{
                                    terms: { tags: ['a', 'b'] }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the terms twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                subject.setTerms({ tags: ['a', 'b'] });
                should(() => subject.setTerms({ tags: ['a', 'b'] })).throw(/already been set/);
            });
        });

        describe('createNestedQuery', function() {
            it('should create the nested query', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                const nestedQuery = subject.createNestedQuery('some.path');
                nestedQuery.createBoolQuery();

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                filter: [{
                                    nested: {
                                        path: 'some.path',
                                        query: {
                                            bool: { }
                                        }
                                    }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the nested clause twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                subject.createNestedQuery('some.path');
                should(() => subject.createNestedQuery('some.otherpath')).throw(/already exists/);
            });
        });

        describe('createQuery', function() {
            it('should create the query', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                const filterQuery = subject.createQuery();
                filterQuery.createBoolQuery();

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                filter: [{
                                    query: {
                                        bool: { }
                                    }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when creating the query twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                subject.createQuery();
                should(() => subject.createQuery()).throw(/already exists/);
            });
        });

        describe('setRange', function() {
            it('should set the range', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                subject.setRange({ count: { gte: 4 } });

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                filter: [{
                                    range: { count: { gte: 4 } }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the range twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                subject.setRange({ count: { gte: 4 } });
                should(() => subject.setRange({ count: { gte: 4 } })).throw(/already been set/);
            });
        });

        describe('setTerm', function() {
            it('should set the term', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                subject.setTerm({ status: 'Active' });

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                filter: [{
                                    term: { status: 'Active' }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the term twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addFilter();
                subject.setTerm({ status: 'Active' });
                should(() => subject.setTerm({ status: 'Active' })).throw(/already been set/);
            });
        });
    });

    describe('Should', function() {
        describe('setRange', function() {
            it('should set the range', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addShould();
                subject.setRange({ count: { gte: 4 } });

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                should: [{
                                    range: { count: { gte: 4 } }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the range twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addShould();
                subject.setRange({ count: { gte: 4 } });
                should(() => subject.setRange({ count: { gte: 4 } })).throw(/already been set/);
            });
        });

        describe('createNestedQuery', function() {
            it('should create the nested query', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addShould();
                const nestedQuery = subject.createNestedQuery('some.path');
                nestedQuery.createBoolQuery();

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                should: [{
                                    nested: {
                                        path: 'some.path',
                                        query: {
                                            bool: { }
                                        }
                                    }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the nested clause twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addShould();
                subject.createNestedQuery('some.path');
                should(() => subject.createNestedQuery('some.otherpath')).throw(/already exists/);
            });
        });

        describe('setTerm', function() {
            it('should set the term', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addShould();
                subject.setTerm({ status: 'Active' });

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                should: [{
                                    term: { status: 'Active' }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the term twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addShould();
                subject.setTerm({ status: 'Active' });
                should(() => subject.setTerm({ status: 'Active' })).throw(/already been set/);
            });
        });

        describe('setMatch', function() {
            it('should set the match', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addShould();
                subject.setMatch({ name: 'foo' });

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                should: [{
                                    match: { name: 'foo' }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the match twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addShould();
                subject.setMatch({ name: 'foo' });
                should(() => subject.setMatch({ name: 'foo' })).throw(/already been set/);
            });
        });
    });

    describe('Must', function() {
        describe('setMatch', function() {
            it('should set the match', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addMust();
                subject.setMatch({ name: 'foo' });

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                must: [{
                                    match: { name: 'foo' }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the match twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addMust();
                subject.setMatch({ name: 'foo' });
                should(() => subject.setMatch({ name: 'foo' })).throw(/already been set/);
            });
        });

        describe('setMultiMatch', function() {
            it('should set the multi match', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addMust();
                subject.setMultiMatch({ query: 'foo' });

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                must: [{
                                    multi_match: { query: 'foo' }
                                }]
                            }
                        }
                    }
                ]);
            });

            it('should throw when setting the multi match twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addMust();
                subject.setMultiMatch({ query: 'foo' });
                should(() => subject.setMultiMatch({ query: 'foo' })).throw(/already been set/);
            });
        });
    });

    describe('BoolQueryBuilder', function() {
        describe('addFilter', function() {
            it('should add the filter', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const subject = query.createBoolQuery();
                subject.addFilter();

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                filter: [{}]
                            }
                        }
                    }
                ]);
            });

            it('should allowing adding multiple filters', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const subject = query.createBoolQuery();
                subject.addFilter();
                subject.addFilter();

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                filter: [{}, {}]
                            }
                        }
                    }
                ]);
            });
        });

        describe('setMinimumShouldMatch', function() {
            it('should set the minimum', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const subject = query.createBoolQuery();
                subject.setMinimumShouldMatch(3);

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                minimum_should_match: 3
                            }
                        }
                    }
                ]);
            });
        });

        describe('addMust', function() {
            it('should add a must clause', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const subject = query.createBoolQuery();
                subject.addMust();

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                must: [{}]
                            }
                        }
                    }
                ]);
            });

            it('should allowing adding multiple must clauses', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const subject = query.createBoolQuery();
                subject.addMust();
                subject.addMust();

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                must: [{}, {}]
                            }
                        }
                    }
                ]);
            });
        });

        describe('addShould', function() {
            it('should add a should clause', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const subject = query.createBoolQuery();

                subject.addShould();

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                should: [{}]
                            }
                        }
                    }
                ]);
            });

            it('should allowing adding multiple should clauses', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const subject = query.createBoolQuery();
                subject.addShould();
                subject.addShould();

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {
                                should: [{}, {}]
                            }
                        }
                    }
                ]);
            });
        });
    });

    describe('QueryBuilder', function() {
        describe('createBoolQuery', function() {
            it('should build a bool query', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                query.createBoolQuery();

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {
                            bool: {}
                        }
                    }
                ]);
            });

            it('should throw if creating a bool query twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                query.createBoolQuery();

                should(() => query.createBoolQuery()).throw(/already exists/);
            });
        });
    });

    describe('SearchBuilder', function() {
        describe('setSearchSort', function() {
            it('should set the search sort', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                subject.setSearchSort([{ _score: { order: 'desc' } }]);

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    { sort: [{ _score: { order: 'desc' } }] }
                ]);
            });

            it('should throw when setting the search sort twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                subject.setSearchSort([{ _score: { order: 'desc' } }]);

                should(() => subject.setSearchSort([{ _score: { order: 'desc' } }]))
                    .throw(/already been set/);
            });
        });

        describe('setSearchSource', function() {
            it('should set the search source', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                subject.setSearchSource(['id', 'name']);

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    { _source: ['id', 'name'] }
                ]);
            });

            it('should throw when setting the search source twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                subject.setSearchSource(['id', 'name']);
                should(() => subject.setSearchSource(['id', 'name'])).throw(/already been set/);
            });
        });

        describe('setSearchTake', function() {
            it('should set the search take', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                subject.setSearchTake(5);

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    { size: 5 }
                ]);
            });

            it('should throw when setting the search take twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                subject.setSearchTake(5);
                should(() => subject.setSearchTake(5)).throw(/already been set/);
            });
        });

        describe('setSearchSkip', function() {
            it('should set the search skip', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                subject.setSearchSkip(5);

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    { from: 5 }
                ]);
            });

            it('should throw when setting the search skip twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                subject.setSearchSkip(5);
                should(() => subject.setSearchSkip(5)).throw(/already been set/);
            });
        });

        describe('createQuery', function() {
            it('should create the query', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                subject.createQuery();

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        query: {}
                    }
                ]);
            });

            it('should throw when trying to create a query twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                subject.createQuery();

                should(() => subject.createQuery()).throw(/already exists/);
            });
        });

        describe('createSuggest', function() {
            it('should create a suggest', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                const result = subject.createSuggest('my-suggest');

                should(result.body).eql({});
            });

            it('should throw when trying to create a suggest twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                subject.createSuggest('my-suggest');

                should(() => subject.createSuggest('my-suggest')).throw(/already exists/);
            });

            it('should add the suggest correctly to the build', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const subject = multiSearchBuilder.createSearch({ index: 'some-index' });
                subject.createSuggest('my-suggest');

                const result = multiSearchBuilder.build();

                should(result).eql([
                    { index: 'some-index' },
                    {
                        suggest: { 
                            'my-suggest': {}
                        }
                    }
                ]);
            });
        });
    });

    describe('MultiSearchBuilder', function() {
        describe('createSearch', function() {
            it('should create a search', function() {
                const subject = new MultiSearchBuilder();
                const header = { index: 'some-index' };

                const result = subject.createSearch(header);

                should(result.body).eql({});
            });
        });

        describe('build', function() {
            it('should build zero created searches', function() {
                const subject = new MultiSearchBuilder();
                const result = subject.build();
                should(result).eql([]);
            });

            it('should build a created search', function() {
                const subject = new MultiSearchBuilder();
                const header = { index: 'some-index' };
                subject.createSearch(header);

                const result = subject.build();

                should(result).eql([
                    header,
                    {}
                ]);
            });

            it('should build two created searches', function() {
                const subject = new MultiSearchBuilder();

                const searchOneHeader = { index: 'some-index-1' };
                subject.createSearch(searchOneHeader);
                
                const searchTwoHeader = { index: 'some-index-2' };
                subject.createSearch(searchTwoHeader);

                const result = subject.build();

                should(result).eql([
                    searchOneHeader,
                    {},
                    searchTwoHeader,
                    {}
                ]);
            });
        });
    });
});
