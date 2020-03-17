/**
 * Row class.
 * @module row
 * @author deverte
 */

// npm packages
let _ = require('lodash')
// project modules
let { Block } = require('./block')

/**
 * Creates Row object.
 * @classdesc Row class with some properties, that contains rows.
 * @param {number | Array} [n=1] - Row index or `start` and `end` indices in format [start, end]
 *                                   for multi-row blocks.
 * @param {object} [content={format: 'TeX', text: ''}] - Contents of the row.
 * @param {string} [content.format='TeX'] - Format of the content's text.
 *                                          Can be "inline-TeX" | "TeX" | "AsciiMath" | "MathML".
 * @param {string} [content.text=''] - Text or formula.
 * @param {object} [type={name: 'default'}] - Row type definition.
 * @param {string} [type.name='default'] - Type of the row.
 *                                         Can be "default" | "interaction" | "controlledInteraction".
 * @param {number} [type.controlled=null] - Controlled row for the "controlledInteraction" type.
 * @param {string} [height='maxAll'] - Height parameter. Can be 'maxAll' for setting
 *                                      cell's height as max cell's height of all cells
 *                                      (only for rows with row's number type).
 *                                      'maxRow' for setting cell's height as max cell's height
 *                                      of cells in current row.
 * @param {object} [join={in: false, out: false}] - Join parameters.
 * @param {boolean} [join.in=false] - Is there an incoming connection.
 * @param {boolean} [join.out=false] - Is there an outgoing connection.
 */
class Row {
    // Choices
    _MJ_FORMATS_CHOICES = ['inline-TeX', 'TeX', 'AsciiMath', 'MathML']
    _HEIGHT_CHOICES = ['maxAll', 'maxRow']
    // Defaults
    _N = 1
    _CONTENT = {
        format: 'TeX',
        text: ''
    }
    _TYPE = {
        name: 'default'
    }
    _HEIGHT = 'maxAll'
    _JOIN = {
        in: false,
        out: false
    }
    // Constructor
    _n = this._N
    _content = this._CONTENT
    _type = this._TYPE
    _height = this._HEIGHT
    _join = this._JOIN
    // Setter
    _block = null

    constructor(
        {
            n = this._N,
            content = this._CONTENT,
            type = this._TYPE,
            height = this._HEIGHT,
            join = this._JOIN
        } = {}
    ) {
        this.n = n
        this.content = content
        this.type = type
        this.height = height
        this.join = join
    }

    get n() {
        return this._n
    }

    /**
     * @param {number | Array<number>} value - Number(s) of the row.
     *                                         If one number, then it is a single-row.
     *                                         If array, consisting of two numbers, then
     *                                         it is a multiple-row.
     */
    set n(value) {
        value = _.defaultTo(value, this._N)

        console.assert(
            typeof(value) == 'number' || value instanceof Array,
            `Incorrect type '${typeof(value)}' of 'Row.n'. Must be a 'number' or 'Array'.`
        )

        this._n = value
    }

    get content() {
        return this._content
    }

    /**
     * @param {object | null} value - Contents of the row.
     * @param {string} value.format - Format of the content's text.
     *                                Can be "inline-TeX" | "TeX" | "AsciiMath" | "MathML".
     * @param {string} value.text - Text or formula.
     */
    set content(value) {
        _.defaultsDeep(value, this._CONTENT)

        console.assert(
            typeof(value) == 'object',
            `Incorrect type '${typeof(value)}' of 'Row.content'. Must be an 'object' or 'null'.`
        )
        console.assert(
            typeof(value.format) == 'string',
            `Incorrect type '${typeof(value.format)}' of 'Row.content.format'. Must be a 'string'.`
        )
        console.assert(
            typeof(value.text) == 'string',
            `Incorrect type '${typeof(value.text)}' of 'Row.content.text'. Must be a 'string'.`
        )

        console.assert(
            _.includes(this._MJ_FORMATS_CHOICES, value.format),
            `Incorrect value '${value.format}' of the 'Row.content.format'. Must be ` +
            `a one of 'inline-TeX', 'TeX', 'AsciiMath', or 'MathML'.`
        )

        this._content = value
    }

    get type() {
        return this._type
    }

    /**
     * @param {object} value - Row type definition.
     * @param {string} value.name - Type of the row.
     *                              Standard types: "default" | "interaction" |
     *                              "controlledInteraction".
     *                              You can add your own types and set your style for it.
     * @param {boolean | null} value.controlled - Controlled row for the
     *                                           "controlledInteraction" type.
     */
    set type(value) {
        _.defaultsDeep(value, this._TYPE)

        console.assert(
            typeof(value) == 'object',
            `Incorrect type '${typeof(value)}' of 'Row.type'. Must be an 'object'.`
        )

        this._type = value
    }

    get height() {
        return this._height
    }

    /**
     * @param {string} value - Height parameter. Can be 'maxAll' for setting
     *                         cell's height as max cell's height of all cells
     *                         (only for rows with row's number type).
     *                         'maxRow' for setting cell's height as max cell's height
     *                         of cells in current row.
     */
    set height(value) {
        value = _.defaultTo(value, this._HEIGHT)

        console.assert(
            typeof(value) == 'string',
            `Incorrect type '${typeof(value)}' of 'Row.height'. Must be a 'string'.`
        )
        console.assert(
            _.includes(this._HEIGHT_CHOICES, value),
            `Incorrect value '${value}' of the 'Row.height'. Must be a one of 'maxAll', ` +
            `or 'maxRow'.`
        )

        this._height = value
    }

    get join() {
        return this._join
    }

    /**
     * @param {object} value - Join parameters.
     * @param {boolean} value.in - Is there an incoming connection.
     * @param {boolean} value.out - Is there an outgoing connection.
     */
    set join(value) {
        _.defaultsDeep(value, this._JOIN)

        console.assert(
            typeof(value) == 'object',
            `Incorrect type '${typeof(value)}' of 'Row.join'. Must be an 'object'.`
        )
        console.assert(
            typeof(value.in) == 'boolean',
            `Incorrect type '${typeof(value.in)}' of 'Row.join.in'. Must be a 'boolean'.`
        )
        console.assert(
            typeof(value.out) == 'boolean',
            `Incorrect type '${typeof(value.out)}' of 'Row.join.out'. Must be a 'boolean'.`
        )

        this._join = value
    }

    get block() {
        return this._block
    }

    /**
     * @param {Block} value - row's SVG-block.
     */
    set block(value) {
        console.assert(
            value instanceof Block,
            `Incorrect type '${typeof(value)}' of 'Row.block'. Must be a 'Block'.`
        )
        
        this._block = value
    }
}

module.exports.Row = Row