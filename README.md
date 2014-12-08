## JSON Lens
[![Build Status](https://secure.travis-ci.org/kevinbeaty/json-lens.svg)](http://travis-ci.org/kevinbeaty/json-lens)

Create Lenses from [JSON Pointer][0].

Starting with this JSON:

```javascript
var market = {
  foods: {
    fruits: ['apples', 'oranges'],
    veggies: ['peas', 'carrots']
  }
};
```

We can create lenses using JSON pointers.

```javascript
var lens = require('json-lens');
var firstFruit = lens('/foods/fruits/0');
var secondVeggie = lens('/foods/veggies/1');
```

And use them to get values from our JSON object

```javascript
t.equal(firstFruit(market), 'apples');
t.equal(secondVeggie(market), 'carrots');
```

Or set values within it

```javascript
firstFruit.set('bananas', market);
t.equal(firstFruit(market), 'bananas');

secondVeggie.set('onions', market);
t.equal(secondVeggie(market), 'onions');
```

Or set by modifying existing values
```javascript
function ohYeah(v){
  return v+'!';
}

firstFruit.map(ohYeah, market);
t.equal(firstFruit(market), 'bananas!');

secondVeggie.map(ohYeah, market);
t.equal(secondVeggie(market), 'onions!');
```

Retaining the structure of our JSON all along

```javascript
var result = {
  foods: {
    fruits: ['bananas!', 'oranges'],
    veggies: ['peas', 'onions!']
  }
};
t.deepEqual(market, result);
```

### Credits
Pointer get/set code modified from [json-pointer][1] and lens implementation from [Ramda][2].  Both projects are licensed under MIT.

[0]: http://tools.ietf.org/html/rfc6901
[1]: https://github.com/manuelstofer/json-pointer
[2]: http://ramdajs.com
