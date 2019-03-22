Symbol.asyncIterator = Symbol.asyncIterator || Symbol.for('Symbol.asyncIterator');

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
// eslint-disable-next-line @typescript-eslint/no-var-requires
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

// var config = require.context("../src/graph/test/", true, /mocha_config.ts$/);
var testsContext = require.context('../src', true, /test.ts$/);

// config.keys().forEach(config);
testsContext.keys().forEach(testsContext);
