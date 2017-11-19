(function(){
'use strict';


var expect = chai.expect;



var listOwnProps = fav.prop.listOwnProps;

describe('fav.prop.listOwnProps', function() {

  it('Should get all props when the argument is a plain object', function() {
    expect(listOwnProps({})).to.deep.equal([]);
    expect(listOwnProps({ a: 1, b: true, c: 'C' }).sort()).to.deep
      .equal(['a', 'b', 'c']);
  });

  it('Should not get properties of prototype', function() {
    function Fn0() {}
    Fn0.prototype.a = 1;
    expect(listOwnProps(new Fn0())).to.deep.equal([]);

    function Fn1() {
      this.b = true;
      this.c = 'C';
    }
    Fn1.prototype = new Fn0();
    Fn1.prototype.d = 'D';
    Object.defineProperty(Fn1.prototype, 'e', { value: 'E' });
    expect(listOwnProps(new Fn1()).sort()).to.deep.equal(['b', 'c']);
  });

  it('Should get also unenumerable props', function() {
    var obj = {};
    Object.defineProperties(obj, {
      a: { enumerable: true, value: 1 },
      b: { value: true },
      c: { value: 'C' },
    });
    expect(listOwnProps(obj).sort()).to.deep.equal(['a', 'b', 'c']);
  });

  it('Should return an empty array when the argument is nullish', function() {
    expect(listOwnProps(undefined)).to.deep.equal([]);
    expect(listOwnProps(null)).to.deep.equal([]);
  });

  it('Should return an empty array when the argument is primitive type',
  function() {
    expect(listOwnProps(true)).to.deep.equal([]);
    expect(listOwnProps(false)).to.deep.equal([]);
    expect(listOwnProps(0)).to.deep.equal([]);
    expect(listOwnProps(123)).to.deep.equal([]);
  });

  it('Should return an array having index strings and `length` when the ' +
  '\n\targument is a string', function() {
    expect(listOwnProps('')).to.deep.equal(['length']);
    expect(listOwnProps('abc').sort()).to.deep
      .equal(['0', '1', '2', 'length']);

    var s = 'abc';
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throws TypeError on Node.js v0.11 or later.
      //console.log(e);
    }
    expect(listOwnProps(s).sort()).to.deep.equal(['0', '1', '2', 'length']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(listOwnProps(s).sort()).to.deep.equal(['0', '1', '2', 'length']);
  });

  it('Should return an array having only `length` when the argument is a ' +
  'string', function() {
    expect(listOwnProps(new String(''))).to.deep.equal(['length']);
    expect(listOwnProps(new String('abc')).sort()).to.deep
      .equal(['0', '1', '2', 'length']);

    var s = new String('abc');
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throws TypeError on Node.js v0.11 or later.
      //console.log(e);
    }
    expect(listOwnProps(s).sort()).to.deep
      .equal(['0', '1', '2', 'aaa', 'length']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(listOwnProps(s).sort()).to.deep
      .equal(['0', '1', '2', 'aaa', 'bbb', 'length']);
  });

  it('Should return an array of index strings and `length` when the argument' +
  '\n\tis an array', function() {
    expect(listOwnProps([])).to.deep.equal(['length']);
    expect(listOwnProps([1, 2, 3]).sort()).to.deep
      .equal(['0', '1', '2', 'length']);

    var a = ['a', 'b'];
    a.aaa = 'AAA';
    expect(listOwnProps(a).sort()).to.deep.equal(['0', '1', 'aaa', 'length']);

    try {
      Object.defineProperty(a, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(listOwnProps(a).sort()).to.deep
      .equal(['0', '1', 'aaa', 'bbb', 'length']);
  });

  it('Should return appended properties when the argument is a function',
  function() {
    var fn = function() {};
    expect(listOwnProps(fn).sort()).to.deep
      .equal(['length', 'name', 'prototype']);

    fn.aaa = 'AAA';
    expect(listOwnProps(fn).sort()).to.deep
      .equal(['aaa', 'length', 'name', 'prototype']);

    Object.defineProperty(fn, 'bbb', { value: 'BBB' });
    expect(listOwnProps(fn).sort()).to.deep
      .equal(['aaa', 'bbb', 'length', 'name', 'prototype']);
  });

  it('Should return an empty string when the argument is a symbol',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var symbol = Symbol('foo');
    expect(listOwnProps(symbol)).to.deep.equal([]);

    try {
      symbol.aaa = 'AAA';
    } catch (e) {
      // console.error(e);
    }
    expect(listOwnProps(symbol)).to.deep.equal([]);

    try {
      Object.defineProperty(symbol, 'bbb', { value: 'BBB' });
    } catch (e) {
      // console.error(e);
    }
    expect(listOwnProps(symbol)).to.deep.equal([]);
  });
});

})();
