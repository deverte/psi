function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Column class.
 * @module column
 * @author deverte
 */
// npm packages
let _ = require('lodash'); // project modules


let {
  Row
} = require('./row');

let {
  Block
} = require('./block');
/**
 * Creates Column object.
 * @classdesc Column class with some properties, that contains rows.
 * @param {number} n - Column's index.
 * @param {object} [time={format: 'TeX', text: ''}] - Time object on the axis.
 * @param {string} [time.format='TeX'] - Format of the time's text.
 * @param {string} [time.text=''] - Time's text.
 * @param {Array<Row>} [rows=[]] - Array containing all rows.
 */


class Column {
  // Choices
  // Defaults
  // Constructor
  // Setter
  constructor({
    n = this._N,
    time = this._TIME,
    rows = this._ROWS
  } = {}) {
    _defineProperty(this, "_MJ_FORMATS_CHOICES", ['inline-TeX', 'TeX', 'AsciiMath', 'MathML']);

    _defineProperty(this, "_N", 1);

    _defineProperty(this, "_TIME", {
      format: 'TeX',
      text: ''
    });

    _defineProperty(this, "_ROWS", []);

    _defineProperty(this, "_n", this._N);

    _defineProperty(this, "_time", this._TIME);

    _defineProperty(this, "_rows", this._ROWS);

    _defineProperty(this, "_axisLabel", null);

    this.n = n;
    this.time = time;
    this.rows = rows;
  }

  get n() {
    return this._n;
  }
  /**
   * @param {number} value - Number of the column.
   */


  set n(value) {
    value = _.defaultTo(value, this._N);
    console.assert(typeof value == 'number', `Incorrect type '${typeof value}' of 'Column.n'. Must be a 'number'.`);
    this._n = value;
  }

  get time() {
    return this._time;
  }
  /**
   * @param {object} value - Time object on the axis.
   * @param {string} value.format - Format of the time's text.
   * @param {string} value.text - Time's text.
   */


  set time(value) {
    value = _.defaultTo(value, {});

    _.defaultsDeep(value, this._TIME);

    console.assert(typeof value == 'object', `Incorrect type '${typeof value}' of 'Column.time'. Must be an 'object' or 'null'.`);
    console.assert(typeof value.format == 'string', `Incorrect type '${typeof value.format}' of 'Column.time.format'. Must be a 'string'.`);
    console.assert(typeof value.text == 'string', `Incorrect type '${typeof value.text}' of 'Column.time.text'. Must be a 'string'.`);
    console.assert(_.includes(this._MJ_FORMATS_CHOICES, value.format), `Incorrect value '${value.format}' of the 'Column.time.format'. ` + `Must be a one of 'inline-TeX', 'TeX', 'AsciiMath', or 'MathML'.`);
    this._time = value;
  }

  get rows() {
    return this._rows;
  }
  /**
   * @param {Array<Row>} value - Array containing all rows.
   */


  set rows(value) {
    value = _.defaultTo(value, this._ROWS);

    for (let row of value) {
      console.assert(row instanceof Row, `Incorrect type '${typeof row}' of 'Column.rows.row'. Must be a 'Row'.`);
    }

    this._rows = value;
  }

  get axisLabel() {
    return this._axisLabel;
  }
  /**
   * @param {Block} value - Axis label SVG-block.
   */


  set axisLabel(value) {
    console.assert(value instanceof Block, `Incorrect type '${typeof value}' of 'Column.axisLabel'. Must be a 'Block'.`);
    this._axisLabel = value;
  }

}

module.exports.Column = Column;