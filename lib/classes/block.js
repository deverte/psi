function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Block that contains formula and formula wrapper. SVG.js object.
 * @module block
 * @author deverte
 */
// npm packages
let _ = require('lodash');

let {
  SVG
} = require('@svgdotjs/svg.js'); // project modules


let utils = require('../utils');
/**
 * Creates block with formula with background.
 * @classdesc Block with formula with background.
 * @param {string} formulaText - Formula specified in TeX, AsciiMath or MathML format.
 * @param {object} mjAPI - Object with MathJax API.
 * @param {object} mjTypeset - Object with MathJax configurations.
 * @param {string} [format='TeX'] - Input format of the formula.
 * @param {object} wrapper - Formula wrapper.
 * @param {string} [wrapper.backgroundColor='#fff'] - Background color of the formula wrapper.
 * @param {number} [wrapper.strokeWidth=1] - Stroke width of the formula wrapper.
 * @param {string} [wrapper.strokeColor='#000'] - Stroke color of the formula wrapper.
 * @param {number} [wrapper.backgroundOpacity=0] - Background opacity of the formula wrapper.
 * @param {number} [wrapper.width=undefined] - Width of the formula wrapper.
 * @param {number} [wrapper.height=undefined] - Height of the formula wrapper.
 */


class Block {
  // Choices
  // Defaults
  // Constructor
  // Setter 
  constructor(formulaText, mjAPI, mjTypeset, {
    format = this._FORMAT,
    wrapper = this._WRAPPER
  }) {
    _defineProperty(this, "_MJ_FORMATS_CHOICES", ['inline-TeX', 'TeX', 'AsciiMath', 'MathML']);

    _defineProperty(this, "_FORMULA_TEXT", '');

    _defineProperty(this, "_MJ_API", null);

    _defineProperty(this, "_MJ_TYPESET", null);

    _defineProperty(this, "_FORMAT", 'TeX');

    _defineProperty(this, "_WRAPPER", {
      backgroundColor: '#fff',
      strokeWidth: 1,
      strokeColor: '#000',
      backgroundOpacity: 0,
      width: undefined,
      height: undefined
    });

    _defineProperty(this, "_formulaText", this._FORMULA_TEXT);

    _defineProperty(this, "_mjAPI", this._MJ_API);

    _defineProperty(this, "_mjTypeset", this._MJ_TYPESET);

    _defineProperty(this, "_format", this._FORMAT);

    _defineProperty(this, "_wrapper", this._WRAPPER);

    _defineProperty(this, "_svg", null);

    _defineProperty(this, "_formulaSVG", null);

    _defineProperty(this, "_formulaWrapperSVG", null);

    this.formulaText = formulaText;
    this.mjAPI = mjAPI;
    this.mjTypeset = mjTypeset;
    this.format = format;
    this.wrapper = wrapper;
  }
  /**
   * Get svg-string of formula specified in TeX, AsciiMath or MathML format.
   * @returns {string} svg-string of specified formula.
   * @example <caption>Example usage.</caption>
   * formula = SVG(await getSVGFormula({formula: text, mjTypeset: mjTypeset, format: format}))
   * // Under async/await construction.
   */


  async _getSVGFormula() {
    // Set output options
    let options = _.cloneDeep(this.mjTypeset);

    options.math = this.formulaText;
    options.format = this.format;
    options.svg = true; // Get svg-string

    let data = await this.mjAPI.typeset(options);
    return data.svg;
  }
  /**
   * Creates block with formula, wrapped in a square with border.
   * @returns {object} formula block SVG.js-object.
   * @example <caption>Example usage.</caption>
   * formulaBlock = await createBlock('\\frac{3}{2}') // Under async/await construction.
   */


  async createBlock() {
    // Structure:
    //             /-------------------------------\
    //             | svg -----> formulaWrapperSVG  |
    // canvas ---> |      \                        |
    //             |       ---> formulaSVG         |
    //             \-------------------------------/
    this.svg = SVG(); // Get fourmula

    this.formulaSVG = SVG((await this._getSVGFormula()));
    let width = this.formulaSVG.width();
    let height = this.formulaSVG.height();

    if (typeof this.wrapper.width == 'number') {
      width = this.wrapper.width / 2;
    }

    if (typeof this.wrapper.height == 'number') {
      height = this.wrapper.height / 2;
    }

    this.svg.size(utils.exToPx(width, this.mjTypeset.ex) * 2, utils.exToPx(height, this.mjTypeset.ex) * 2); // Set formula wrapper

    this.formulaWrapperSVG = this.svg.rect();
    this.formulaWrapperSVG.size('100%', '100%').stroke({
      width: this.wrapper.strokeWidth,
      color: this.wrapper.strokeColor
    }).fill({
      color: this.wrapper.backgroundColor,
      opacity: this.wrapper.backgroundOpacity
    }); // Add formula to SVG

    this.svg.add(this.formulaSVG);
    this.centerFormula();
  }
  /**
   * Set center position of the formula.
   * @public
   */


  centerFormula() {
    // -2 at the end of the formulas was chosen empirically
    this.formulaSVG.move((this.svg.width() - utils.exToPx(this.formulaSVG.width(), this.mjTypeset.ex)) / 2 - 2, (this.svg.height() - utils.exToPx(this.formulaSVG.height(), this.mjTypeset.ex)) / 2 - 2);
  }

  get svg() {
    return this._svg;
  }
  /**
   * @param {SVG} value - SVG-block.
   */


  set svg(value) {
    console.assert(value instanceof Object, `Incorrect type '${value}' of 'Block.svg'. Must be a 'SVG' or 'object'.`);
    this._svg = value;
  }

  get formulaSVG() {
    return this._formulaSVG;
  }
  /**
   * @param {SVG} value - Formula SVG-block.
   */


  set formulaSVG(value) {
    console.assert(value instanceof Object, `Incorrect type '${value}' of 'Block.formulaSVG'. Must be a 'SVG' or 'object'.`);
    this._formulaSVG = value;
  }

  get formulaWrapperSVG() {
    return this._formulaWrapperSVG;
  }
  /**
   * @param {SVG} value - Formula wrapper SVG-block.
   */


  set formulaWrapperSVG(value) {
    console.assert(value instanceof Object, `Incorrect type '${value}' of 'Block.formulaWrapperSVG'. Must be a 'SVG' or 'object'.`);
    this._formulaWrapperSVG = value;
  }

  get formulaText() {
    return this._formulaText;
  }
  /**
   * @param {string} value - Formula specified in TeX, AsciiMath or MathML format.
   */


  set formulaText(value) {
    value = _.defaultTo(value, this._FORMULA_TEXT);
    console.assert(typeof value == 'string', `Incorrect type '${typeof value}' of 'Block.formulaText'. Must be a 'string'.`);
    this._formulaText = value;
  }

  get mjAPI() {
    return this._mjAPI;
  }
  /**
   * @param {object} value - MathJax API.
   */


  set mjAPI(value) {
    value = _.defaultTo(value, {});

    _.defaultsDeep(value, this._MJ_API);

    console.assert(typeof value == 'object', `Incorrect type '${value}' of 'Block.mjAPI'. Must be an 'object'.`);
    this._mjAPI = value;
  }

  get mjTypeset() {
    return this._mjTypeset;
  }
  /**
   * @param {object} value - MathJax typeset.
   */


  set mjTypeset(value) {
    value = _.defaultTo(value, {});

    _.defaultsDeep(value, this._MJ_TYPESET);

    console.assert(typeof value == 'object', `Incorrect type '${value}' of 'Block.mjTypeset'. Must be an 'object'.`);
    this._mjTypeset = value;
  }

  get format() {
    return this._format;
  }
  /**
   * @param {string} value - Format of the block's text.
   *                         Can be "inline-TeX" | "TeX" | "AsciiMath" | "MathML".
   */


  set format(value) {
    value = _.defaultTo(value, this._FORMAT);
    console.assert(typeof value == 'string', `Incorrect type '${typeof value}' of 'Block.format'. Must be a 'string'.`);
    console.assert(_.includes(this._MJ_FORMATS_CHOICES, value), `Incorrect value '${value}' of the 'Block.format'. ` + `Must be a one of 'inline-TeX', 'TeX', 'AsciiMath', or 'MathML'.`);
    this._format = value;
  }

  get wrapper() {
    return this._wrapper;
  }
  /**
   * @param {object} value - Wrapper parameters.
   * @param {string} value.backgroundColor - Background color of the formula wrapper.
   * @param {number} value.strokeWidth - Stroke width of the formula wrapper.
   * @param {string} value.strokeColor - Stroke color of the formula wrapper.
   * @param {number} value.backgroundOpacity - Background opacity of the formula wrapper.
   * @param {number | undefined} value.width - Formula wrapper width.
   * @param {number | undefined} value.height - Formula wrapper height.
   */


  set wrapper(value) {
    value = _.defaultTo(value, {});

    _.defaultsDeep(value, this._WRAPPER);

    console.assert(typeof value == 'object', `Incorrect type '${typeof value}' of 'Block.wrapper'. Must be an 'object'.`);
    console.assert(typeof value.backgroundColor == 'string', `Incorrect type '${typeof value.backgroundColor}' of ` + `'Block.wrapper.backgroundColor'. Must be a 'string'.`);
    console.assert(typeof value.strokeWidth == 'number', `Incorrect type '${typeof value.strokeWidth}' of 'Block.wrapper.strokeWidth'. ` + `Must be a 'number'.`);
    console.assert(typeof value.strokeColor == 'string', `Incorrect type '${typeof value.strokeColor}' of 'Block.wrapper.strokeColor'. ` + `Must be a 'string'.`);
    console.assert(typeof value.backgroundOpacity == 'number', `Incorrect type '${typeof value.backgroundOpacity}' of ` + `'Block.wrapper.backgroundOpacity'. Must be a 'number'.`);
    console.assert(typeof value.width == 'number' || value.width == undefined, `Incorrect type '${typeof value.width}' of ` + `'Block.wrapper.width'. Must be a 'number' or 'undefined'.`);
    console.assert(typeof value.height == 'number' || value.height == undefined, `Incorrect type '${typeof value.height}' of ` + `'Block.wrapper.height'. Must be a 'number' or 'undefined'.`);
    this._wrapper = value;
  }

}

module.exports.Block = Block;