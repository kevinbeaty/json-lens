"use strict";
var lens = require('../'),
    test = require('tape'),
    rfcExample, rfcValues;

test('examples', function (t){
  var firstFruit = lens('/foods/fruits/0');
  var secondVeggie = lens('/foods/veggies/1');

  var market = {
    foods: {
      fruits: ['apples', 'oranges'],
      veggies: ['peas', 'carrots']
    }
  };

  t.equal(firstFruit(market), 'apples');
  t.equal(secondVeggie(market), 'carrots');

  firstFruit.set('bananas', market);
  t.equal(firstFruit(market), 'bananas');

  secondVeggie.set('onions', market);
  t.equal(secondVeggie(market), 'onions');

  function ohYeah(v){
    return v+'!';
  }

  firstFruit.map(ohYeah, market);
  t.equal(firstFruit(market), 'bananas!');

  secondVeggie.map(ohYeah, market);
  t.equal(secondVeggie(market), 'onions!');

  var result = {
    foods: {
      fruits: ['bananas!', 'oranges'],
      veggies: ['peas', 'onions!']
    }
  };
  t.deepEqual(market, result);

  t.end();
});

test('get', function (t){
  // modified from json-pointer tests
  rfcExample = {
    "foo":      ["bar", "baz"],
    "":         0,
    "a/b":      1,
    "c%d":      2,
    "e^f":      3,
    "g|h":      4,
    "i\\j":     5,
    "k\"l":     6,
    " ":        7,
    "m~n":      8
  };

  rfcValues = {
    "":         rfcExample,
    "/foo":     rfcExample.foo,
    "/foo/0":   "bar",
    "/":        0,
    "/a~1b":    1,
    "/c%d":     2,
    "/e^f":     3,
    "/g|h":     4,
    "/i\\j":    5,
    "/k\"l":    6,
    "/ ":       7,
    "/m~0n":    8
  };

  var obj = {};
  t.deepEqual(obj, lens('')(obj), 'should work for root element');

  Object.keys(rfcValues).forEach(function (p) {
    t.deepEqual(obj, lens('')(obj), 'should work for "' + p + '"');
    var expectedValue = rfcValues[p];
    t.deepEqual(rfcValues[p], lens(p)(rfcExample));
  });
  t.end();
});

test('set', function(t){
  // modified from json-pointer tests
  var obj = { existing: 'bla' };

  lens('/new-value/bla').set('expected', obj);
  t.deepEqual('expected', obj['new-value'].bla, 'should set a value on an object');

  obj = { existing: 'bla' };

  lens('/first-level').set('expected', obj);
  t.deepEqual(obj['first-level'], 'expected', 'should set on first level');

  obj = [];
  lens('/0/test/0').set('expected', obj);
  t.ok(Array.isArray(obj), 'should retain array array for');
  t.ok(!Array.isArray(obj[0]), 'should not create array for nested string token');
  t.ok(Array.isArray(obj[0].test), 'should create array for nested numeric token');
  t.deepEqual(obj[0].test[0], 'expected', 'should set nested expected value');

  t.end();
});
