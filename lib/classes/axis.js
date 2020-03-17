function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Axis class.
 * @module axis
 * @author deverte
 */
// npm packages
let _ = require('lodash'); // project modules


let {
  Block
} = require('./block');
/**
 * Creates Axis object.
 * @classdesc Axis class.
 * @param {string} [direction="right"] - Direction of the axis.
 *                                       Can be "left" | "right" | "bidirectional".
 * @param {object} label - Label configuration.
 * @param {string} label.format - Format of the label's text.
 *                                Can be "inline-TeX" | "TeX" | "AsciiMath" | "MathML".
 * @param {string} label.text - Label's text.
 * @param {object} position - Axis position in column context.
 * @param {number} position.left - Number of column to start drawing the axis.
 * @param {number} position.right - Number of column to end drawing the axis.
 *                                  You can set a negative number to start from the end.
 *                                  For example, `-1` to set the last column.
 * @param {number} margin - Margin between main part of the diagram and axis.
 * @param {number} width - Width of the line.
 * @param {number} arrowHeight - Height of the arrow of the axis.
 * @param {number} tickHeight - Height (radius) of the ticks.
 * @param {string} color - Axis color.
 */


class Axis {
  // Choices
  // Defaults
  // Constructor
  // Setter
  constructor({
    direction = this._DIRECTION,
    label = this._LABEL,
    position = this._POSITION,
    margin = this._MARGIN,
    width = this._WIDTH,
    arrowHeight = this._ARROW_HEIGHT,
    tickHeight = this._TICK_HEIGHT,
    color = this._COLOR
  } = {}) {
    _defineProperty(this, "_DIRECTION_CHOICES", ['left', 'right', 'bidirectional']);

    _defineProperty(this, "_MJ_FORMATS_CHOICES", ['inline-TeX', 'TeX', 'AsciiMath', 'MathML']);

    _defineProperty(this, "_DIRECTION", 'right');

    _defineProperty(this, "_LABEL", {
      format: 'TeX',
      text: ''
    });

    _defineProperty(this, "_WIDTH", 2);

    _defineProperty(this, "_MARGIN", 5);

    _defineProperty(this, "_ARROW_HEIGHT", 5);

    _defineProperty(this, "_TICK_HEIGHT", 2);

    _defineProperty(this, "_COLOR", '#000');

    _defineProperty(this, "_LABEL_BLOCK", []);

    _defineProperty(this, "_direction", this._DIRECTION);

    _defineProperty(this, "_label", this._LABEL);

    _defineProperty(this, "_position", this._POSITION);

    _defineProperty(this, "_margin", this._MARGIN);

    _defineProperty(this, "_width", this._WIDTH);

    _defineProperty(this, "_arrowHeight", this._ARROW_HEIGHT);

    _defineProperty(this, "_tickHeight", this._TICK_HEIGHT);

    _defineProperty(this, "_color", this._COLOR);

    _defineProperty(this, "_labelBlock", this._LABEL_BLOCK);

    this.direction = direction;
    this.label = label;
    this.position = position;
    this.margin = margin;
    this.width = width;
    this.arrowHeight = arrowHeight;
    this.tickHeight = tickHeight;
    this.color = color;
  }

  get direction() {
    return this._direction;
  }
  /**
   * @param {string} value - Direction of the axis.
   *                         Can be "left" | "right" | "bidirectional".
   */


  set direction(value) {
    value = _.defaultTo(value, this._DIRECTION);
    console.assert(typeof value == 'string', `Incorrect type '${typeof value}' of 'Axis.direction'. Must be a string.`);
    console.assert(_.includes(this._DIRECTION_CHOICES, _.toLower(value)), `Incorrect value '${value}' of the 'Axis.direction'. Must be a one of 'right', ` + `'left', or 'bidirectional'.`);
    this._direction = value;
  }

  get label() {
    return this._label;
  }
  /**
   * @param {object | null} value - Label configuration.
   * @param {string} value.format - Format of the label's text.
   *                                Can be "inline-TeX" | "TeX" | "AsciiMath" | "MathML".
   * @param {string} value.text - Label's text.
   */


  set label(value) {
    _.defaultsDeep(value, this._LABEL);

    console.assert(typeof value == 'object', `Incorrect type '${typeof value}' of 'Axis.label'. Must be an 'object' or 'null'.`);
    console.assert(typeof value.format == 'string', `Incorrect type '${typeof value.format}' of 'Axis.label.format'. Must be a 'string'.`);
    console.assert(typeof value.text == 'string', `Incorrect type '${typeof value.text}' of 'Axis.label.text'. Must be a 'string'.`);
    console.assert(_.includes(this._MJ_FORMATS_CHOICES, value.format), `Incorrect value '${value.format}' of the 'Axis.label.format'. ` + `Must be a one of 'inline-TeX', 'TeX', 'AsciiMath', or 'MathML'.`);
    this._label = value;
  }

  get width() {
    return this._width;
  }
  /**
   * @param {number} value - Width of the line.
   */


  set width(value) {
    value = _.defaultTo(value, this._WIDTH);
    console.assert(typeof value == 'number', `Incorrect type '${typeof value}' of the 'Axis.width'. Must be a 'number'.`);
    this._width = value;
  }

  get position() {
    return this._position;
  }
  /**
   * @param {object} value - Position of the axis.
   * @param {number} value.left - Number of column to start drawing the axis.
   * @param {number} value.right - Number of column to end drawing the axis.
   *                               You can set a negative number to start from the end.
   *                               For example, `-1` to set the last column.
   */


  set position(value) {
    _.defaultsDeep(value, this._POSITION);

    console.assert(typeof value == 'object', `Incorrect type '${typeof value}' of the 'Axis.position'. Must be an 'object'.`);
    console.assert(typeof value.left == 'number', `Incorrect type '${typeof value.left}' of the 'Axis.position.left'. ` + `Must be a 'number'.`);
    console.assert(typeof value.right == 'number', `Incorrect type '${typeof value.right}' of the 'Axis.position.right'. ` + `Must be a 'number'.`);
    this._position = value;
  }

  get margin() {
    return this._margin;
  }
  /**
   * @param {number} value - Margin of the axis.
   */


  set margin(value) {
    value = _.defaultTo(value, this._MARGIN);
    console.assert(typeof value == 'number', `Incorrect type '${typeof value}' of the 'Axis.margin'. Must be a 'number'.`);
    this._margin = value;
  }

  get arrowHeight() {
    return this._arrowHeight;
  }
  /**
   * @param {number} value - Height of the arrow of the axis.
   */


  set arrowHeight(value) {
    value = _.defaultTo(value, this._ARROW_HEIGHT);
    console.assert(typeof value == 'number', `Incorrect type '${typeof value}' of the 'Axis.arrowHeight'. Must be a 'number'.`);
    console.assert(value >= 0, `Incorrect value '${value}' of the 'Axis.arrowHeight'. Must be more or equals to 0.`);
    this._arrowHeight = value;
  }

  get tickHeight() {
    return this._tickHeight;
  }
  /**
   * @param {number} value - Height (radius) of the ticks.
   */


  set tickHeight(value) {
    value = _.defaultTo(value, this._TICK_HEIGHT);
    console.assert(typeof value == 'number', `Incorrect type '${typeof value}' of the 'Axis.tickHeight'. Must be a 'number'.`);
    console.assert(value >= 0, `Incorrect value '${value}' of the 'Axis.tickHeight'. Must be more or equals to 0.`);
    this._tickHeight = value;
  }

  get color() {
    return this._color;
  }
  /**
   * @param {string} value - Axis color.
   */


  set color(value) {
    value = _.defaultTo(value, this._COLOR);
    console.assert(typeof value == 'string', `Incorrect type '${typeof value}' of the 'Axis.color'. Must be a 'string'.`);
    this._color = value;
  }

  get labelBlock() {
    return this._labelBlock;
  }
  /**
   * @param {Block} value - SVG-block of the label.
   */


  set labelBlock(value) {
    value = _.defaultTo(value, this._LABEL_BLOCK);
    console.assert(value instanceof Block, `Incorrect type '${typeof value}' of 'Axis.labelBlock'. Must be a 'Block'.`);
    this._labelBlock = value;
  }

}

_defineProperty(Axis, "_POSITION", {
  left: 1,
  right: -1
});

module.exports.Axis = Axis;