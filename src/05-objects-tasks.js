/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  values: {
    elementValue: '',
    classValue: [],
    idValue: '',
    attrValue: [],
    pseudoClassValue: [],
    pseudoElementValue: [],
    selector1: null,
    selector2: null,
    combinator: '',
    isCombine: false,
  },

  setValues() {
    this.values = {
      elementValue: '',
      classValue: [],
      idValue: '',
      attrValue: [],
      pseudoClassValue: [],
      pseudoElementValue: [],
      selector1: null,
      selector2: null,
      combinator: '',
      isCombine: false,
    };
  },

  getValues() {
    return {
      elementValue: this.values.elementValue,
      classValue: [...this.values.classValue],
      idValue: this.values.idValue,
      attrValue: [...this.values.attrValue],
      pseudoClassValue: [...this.values.pseudoClassValue],
      pseudoElementValue: [...this.values.pseudoElementValue],
      selector1: null,
      selector2: null,
      combinator: '',
      isCombine: false,
    };
  },

  element(value) {
    const builder = Object.create(cssSelectorBuilder);
    builder.values = this.getValues();
    if (builder.values.elementValue !== '') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (builder.values.idValue !== ''
    || builder.values.classValue.length
    || builder.values.attrValue.length
    || builder.values.pseudoClassValue.length
    || builder.values.pseudoElementValue.length) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    builder.values.elementValue = value;
    return builder;
  },

  id(value) {
    const builder = Object.create(cssSelectorBuilder);
    builder.values = this.getValues();
    if (builder.values.idValue !== '') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (builder.values.classValue.length
    || builder.values.attrValue.length
    || builder.values.pseudoClassValue.length
    || builder.values.pseudoElementValue.length) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    builder.values.idValue = value;
    return builder;
  },

  getIdValue() {
    return this.values.idValue !== '' ? `#${this.values.idValue}` : '';
  },

  class(value) {
    const builder = Object.create(cssSelectorBuilder);
    builder.values = this.getValues();
    if (builder.values.attrValue.length
    || builder.values.pseudoClassValue.length
    || builder.values.pseudoElementValue.length) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    builder.values.classValue.push(value);
    return builder;
  },

  getClassValue() {
    return this.values.classValue.length ? `.${this.values.classValue.join('.')}` : '';
  },

  attr(value) {
    const builder = Object.create(cssSelectorBuilder);
    builder.values = this.getValues();
    if (builder.values.pseudoClassValue.length
    || builder.values.pseudoElementValue.length) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    builder.values.attrValue.push(`[${value}]`);
    return builder;
  },

  getAttrValue() {
    return this.values.attrValue.length ? `${this.values.attrValue.join('')}` : '';
  },

  pseudoClass(value) {
    const builder = Object.create(cssSelectorBuilder);
    builder.values = this.getValues();
    if (builder.values.pseudoElementValue.length) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    builder.values.pseudoClassValue.push(value);
    return builder;
  },

  getPseudoClassValue() {
    return this.values.pseudoClassValue.length ? `:${this.values.pseudoClassValue.join(':')}` : '';
  },

  pseudoElement(value) {
    const builder = Object.create(cssSelectorBuilder);
    builder.values = this.getValues();
    if (builder.values.pseudoElementValue.length) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    builder.values.pseudoElementValue.push(value);
    return builder;
  },

  getPseudoElementValue() {
    return this.values.pseudoElementValue.length ? `::${this.values.pseudoElementValue.join('::')}` : '';
  },

  combine(selector1, combinator, selector2) {
    const builder = Object.create(cssSelectorBuilder);
    builder.values = this.getValues();
    builder.values.selector1 = selector1;
    builder.values.selector2 = selector2;
    builder.values.combinator = combinator;
    builder.values.isCombine = true;
    return builder;
  },

  stringify() {
    if (this.values.isCombine) {
      const sel1 = this.values.selector1.stringify();
      const sel2 = this.values.selector2.stringify();
      return `${sel1} ${this.values.combinator} ${sel2}`;
    }
    const res = `${this.values.elementValue}${this.getIdValue()}${this.getClassValue()}${this.getAttrValue()}${this.getPseudoClassValue()}${this.getPseudoElementValue()}`;
    this.setValues();
    if (res !== '') return res;
    return 'div';
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
