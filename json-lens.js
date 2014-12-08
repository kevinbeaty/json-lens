'use strict';

var undef;

module.exports = jsonLens;

function jsonLens(pointer){
  // modified from ramda
  var tokens = parse(pointer),
      get = tokenGet(tokens),
      set = tokenSet(tokens),
      lns = function(obj) { return get(obj); };
  lns.set = set;
  lns.map = function(fn, obj) { return set(fn(get(obj)), obj); };
  return lns;
}

function tokenGet(tokens) {
  return function(obj){
    // modified from json-pointer
    var i = 0, len = tokens.length, tok;
    for(; i < len; i++){
      tok = tokens[i];
      if (!obj.hasOwnProperty(tok)) {
        return undef;
      }
      obj = obj[tok];
    }
    return obj;
  };
}

function tokenSet(tokens) {
  return function(value, obj){
    // modified from json-pointer
    var i = 0, len = tokens.length,
        tok, nextTok = tokens[0];
    for(; i < len - 1; i++){
      tok = tokens[i];
      nextTok = tokens[i+1];

      if (!obj.hasOwnProperty(tok)) {
        if (nextTok.match(/^\d+$/)) {
          obj[tok] = [];
        } else {
          obj[tok] = {};
        }
      }
      obj = obj[tok];
    }
    obj[nextTok] = value;
  };
}


function parse (pointer) {
  // from json-pointer
  if (pointer === '') { return []; }
  if (pointer.charAt(0) !== '/') { throw new Error('Invalid JSON pointer: ' + pointer); }
  return pointer.substring(1).split(/\//).map(_unescape);
}

function _unescape(str) {
  // from json-pointer
  return str.replace(/~1/g, '/').replace(/~0/g, '~');
}
