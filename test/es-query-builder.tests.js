'use strict';

const should = require('should');
const MultiSearchBuilder = require('../index');

describe('es-search-builder', function() {
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
                (() => subject.setSuggestText('b')).should.throw(/already been set/);
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
                (() => subject.setSuggestCompletion({ size: 2 })).should.throw(/already been set/);
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
                (() => subject.setGeoBoundingBox({ type: 'indexed' })).should.throw(/already been set/);
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
                (() => subject.setNested({ status: 'Active' })).should.throw(/already been set/);
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
                (() => subject.setTerms({ tags: ['a', 'b'] })).should.throw(/already been set/);
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
                (() => subject.setTerm({ status: 'Active' })).should.throw(/already been set/);
            });
        });
    });

    describe('Must', function() {
        describe('setMatch', function() {
            it('should set the multi match', function() {
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

            it('should throw when setting the multi match twice', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const boolQuery = query.createBoolQuery();
                const subject = boolQuery.addMust();
                subject.setMatch({ name: 'foo' });
                (() => subject.setMatch({ name: 'foo' })).should.throw(/already been set/);
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
                (() => subject.setMultiMatch({ query: 'foo' })).should.throw(/already been set/);
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
    });

    describe('QueryBuilder', function() {
        describe('createBoolQuery', function() {
            it('should build a bool query', function() {
                const multiSearchBuilder = new MultiSearchBuilder();
                const search = multiSearchBuilder.createSearch({ index: 'some-index' });
                const query = search.createQuery();
                const subject = query.createBoolQuery();

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

                (() => query.createBoolQuery()).should.throw(/already exists/);
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

                (() => subject.setSearchSort([{ _score: { order: 'desc' } }]))
                    .should.throw(/already been set/);
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
                (() => subject.setSearchSource(['id', 'name'])).should.throw(/already been set/);
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
                (() => subject.setSearchTake(5)).should.throw(/already been set/);
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
                (() => subject.setSearchSkip(5)).should.throw(/already been set/);
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

                (() => subject.createQuery()).should.throw(/already exists/);
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

                (() => subject.createSuggest('my-suggest')).should.throw(/already exists/);
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

                should(result.header).eql(header);
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
