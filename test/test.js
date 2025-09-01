// test/test.js - Simple example test
const assert = require('chai').assert;
const app = require('../app');

describe('App', function() {
  it('app should be an Express application', function() {
    assert.isFunction(app.listen);
    assert.isFunction(app.use);
  });
});