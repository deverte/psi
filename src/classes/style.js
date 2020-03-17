/**
 * Style class.
 * @module style
 * @author deverte
 */

// npm packages
let _ = require('lodash')

/**
 * Creates Style object.
 * @classdesc Style class.
 * @param {object} styleJSON - Style object.
 * @param {object} styleJSON.blocks.types - Types style.
 * @param {object} styleJSON.blocks.types.type - 'Type' block style.
 * @param {string} styleJSON.blocks.types.type.backgroundColor - Background color of the block
 *                                                               of type 'type'.
 * @param {number} styleJSON.blocks.types.type.strokeWidth - Stroke width of the block of type
 *                                                           'type'.
 * @param {string} styleJSON.blocks.types.type.strokeColor - Stroke color of the block of type  
 *                                                           'type'.
 * @param {string} styleJSON.blocks.types.type.backgroundOpacity - Background opacity of the block
 *                                                                 of type 'type'.
 * @param {string} styleJSON.blocks.types.type.width - Width of the block of type 'type'.
 * @param {string} styleJSON.blocks.types.type.height - Height of the block of type 'type'.
 * @param {string} styleJSON.blocks.types.controlledInteraction.circleDiameter - Diameter of the
 *                                                                               controlled
 *                                                                               element's circle.
 * @param {string} styleJSON.blocks.types.controlledInteraction.lineWidth - Width of the connection
 *                                                                          line.
 * @param {object} styleJSON.blocks.connections.width - Connections line width.
 * @param {number} styleJSON.blocks.connections.color - Connections line color.
 * @param {string} styleJSON.blocks.connections - Connections style object.
 * @param {object} styleJSON.canvas.margin - Margin of the canvas.
 * @param {number} styleJSON.canvas.margin.top - Top margin of the canvas.
 * @param {number} styleJSON.canvas.margin.bottom - Bottom margin of the canvas.
 * @param {number} styleJSON.canvas.margin.left - Left margin of the canvas.
 * @param {number} styleJSON.canvas.margin.right - Right margin of the canvas.
 * @param {number} styleJSON.canvas.backgroundColor - Canvas background color.
 * @param {number} styleJSON.canvas.backgroundOpacity - Canvas background opacity.
 *                                           Must be in [0, 1] interval.
 * @param {object} styleJSON.columns - Columns style object.
 * @param {number} styleJSON.columns.interval - Interval between columns.
 * @param {object} styleJSON.axis - Axis style object.
 * @param {number} styleJSON.axis.width - Axis width.
 * @param {number} styleJSON.axis.arrowHeight - Axis arrow height (and width).
 * @param {number} styleJSON.axis.tickHeight - Axis ticks height (radius).
 * @param {string} styleJSON.axis.color - Axis color.
 */
class Style {
    // Defaults
    _CANVAS = {
        margin: {
            top: 5,
            bottom: 5,
            left: 5,
            right: 5
        },
        backgroundColor: '#fff',
        backgroundOpacity: 1
    }
    _BLOCKS = {
        connections: {
            width: 2,
            color: '#000'
        },
        types: {
            default: {
                backgroundColor: '#fff',
                strokeWidth: 0,
                strokeColor: '#000',
                backgroundOpacity: 1,
            },
            interaction: {
                backgroundColor: '#fff',
                strokeWidth: 2,
                strokeColor: '#ff0000',
                backgroundOpacity: 1,
            },
            controlledInteraction: {
                backgroundColor: '#fff',
                strokeWidth: 2,
                strokeColor: "#0000ff",
                backgroundOpacity: 1,
                circleDiameter: 10,
                lineWidth: 2
            }
        }
    }
    _COLUMNS = {
        interval: 5
    }
    _ROWS = {
        interval: 5
    }
    _AXIS = {
        width: 2,
        arrowHeight: 5,
        tickHeight: 2,
        color: '#000'
    }
    // Setter
    _canvas = this._CANVAS
    _blocks = this._BLOCKS
    _columns = this._COLUMNS
    _rows = this._ROWS
    _axis = this._AXIS

    constructor(
        styleJSON = {
            canvas: this._CANVAS,
            blocks: this._BLOCKS,
            columns: this._COLUMNS,
            rows: this._ROWS,
            axis: this._AXIS
        }={}
    ) {
        this.canvas = styleJSON.canvas
        this.blocks = styleJSON.blocks
        this.columns = styleJSON.columns
        this.rows = styleJSON.rows
        this.axis = styleJSON.axis
    }

    get canvas() {
        return this._canvas
    }

    /**
     * @param {object} value - Canvas style.
     * @param {object} value.margin - Margin of the canvas.
     * @param {number} value.margin.top - Top margin of the canvas.
     * @param {number} value.margin.bottom - Bottom margin of the canvas.
     * @param {number} value.margin.left - Left margin of the canvas.
     * @param {number} value.margin.right - Right margin of the canvas.
     * @param {string} value.backgroundColor - Canvas background color.
     * @param {number} value.backgroundOpacity - Canvas background opacity.
     *                                           Must be in [0, 1] interval.
     */
    set canvas(value) {
        value = _.defaultTo(value, {})
        _.defaultsDeep(value, this._CANVAS)

        console.assert(
            typeof(value) == 'object',
            `Incorrect type '${value}' of 'Style.canvas'. Must be an 'object'.`
        )

        // margin
        console.assert(
            typeof(value.margin) == 'object',
            `Incorrect type '${value.margin}' of 'Style.canvas.margin'. Must be an 'object'.`
        )
        console.assert(
            typeof(value.margin.top) == 'number',
            `Incorrect type '${typeof(value.margin.top)}' of 'Style.canvas.margin.top'. ` +
            `Must be a 'number'.`
        )
        console.assert(
            typeof(value.margin.bottom) == 'number',
            `Incorrect type '${typeof(value.margin.bottom)}' of ` +
            `'Style.canvas.margin.bottom'. Must be a 'number'.`
        )
        console.assert(
            typeof(value.margin.left) == 'number',
            `Incorrect type '${typeof(value.margin.left)}' of 'Style.canvas.margin.left'. ` +
            `Must be a 'number'.`
        )
        console.assert(
            typeof(value.margin.right) == 'number',
            `Incorrect type '${typeof(value.margin.right)}' of 'Style.canvas.margin.right'. ` +
            `Must be a 'number'.`
        )

        // backgroundColor
        console.assert(
            typeof(value.backgroundColor) == 'string',
            `Incorrect type '${typeof(value.backgroundColor)}' of 'Style.canvas.backgroundColor'. ` +
            `Must be a 'string'.`
        )

        // backgroundOpacity
        console.assert(
            typeof(value.backgroundOpacity) == 'number',
            `Incorrect type '${typeof(value.backgroundOpacity)}' of ` +
            `'Style.canvas.backgroundOpacity'. Must be a 'number'.`
        )
        console.assert(
            value.backgroundOpacity >= 0 && value.backgroundOpacity <= 1,
            `Incorrect value '${value.backgroundOpacity}' of 'Style.canvas.backgroundOpacity'. ` +
            `Must be in [0, 1] interval.`
        )

        this._canvas = value
    }

    get blocks() {
        return this._blocks
    }

    /**
     * @param {object} value - Blocks style.
     * @param {object} value.types - Types style.
     * @param {object} value.types.type - 'Type' block style.
     * @param {string} value.types.type.backgroundColor - Background color of the block of 
     *                                                    type 'type'.
     * @param {number} value.types.type.strokeWidth - Stroke width of the block of type 'type'.
     * @param {string} value.types.type.strokeColor - Stroke color of the block of type 'type'.
     * @param {string} value.types.type.backgroundOpacity - Background opacity of the block of 
     *                                                      type 'type'.
     * @param {string} value.types.type.width - Width of the block of type 'type'.
     * @param {string} value.types.type.height - Height of the block of type 'type'.
     * @param {string} value.types.controlledInteraction.circleDiameter - Diameter of the controlled
     *                                                                    element's circle.
     * @param {string} value.types.controlledInteraction.lineWidth - Width of the connection line.
     * @param {object} value.connections - Connections style object.
     * @param {number} value.connections.width - Connections width.
     * @param {string} value.connections.color - Connections color.
     */
    set blocks(value) {
        value = _.defaultTo(value, {})
        _.defaultsDeep(value, this._BLOCKS)

        console.assert(
            typeof(value) == 'object',
            `Incorrect type '${value}' of 'Style.blocks'. ` +
            `Must be an 'object'.`
        )

        // types
        console.assert(
            typeof(value.types) == 'object',
            `Incorrect type '${value.types}' of 'Style.blocks.types'. ` +
            `Must be an 'object'.`
        )

        for (let typeName of _.keys(value.types)) {
            let type = value.types[typeName]
            console.assert(
                typeof(type) == 'object',
                `Incorrect type '${type}' of ` +
                `'Style.blocks.types.${typeName}'. Must be an 'object'.`
            )
            console.assert(
                typeof(type.backgroundColor) == 'string',
                `Incorrect type '${type.backgroundColor}' of ` +
                `'Style.blocks.types.${typeName}.backgroundColor'. Must be a 'string'.`
            )
            console.assert(
                typeof(type.strokeWidth) == 'number',
                `Incorrect type '${type.strokeWidth}' of ` +
                `'Style.blocks.types.${typeName}.strokeWidth'. Must be a 'number'.`
            )
            console.assert(
                typeof(type.strokeColor) == 'string',
                `Incorrect type '${type.strokeColor}' of ` +
                `'Style.blocks.types.${typeName}.strokeColor'. Must be a 'string'.`
            )
            console.assert(
                typeof(type.backgroundOpacity) == 'number',
                `Incorrect type '${type.backgroundOpacity}' of ` +
                `'Style.blocks.types.${typeName}.backgroundOpacity'. Must be a 'number'.`
            )
            console.assert(
                type.backgroundOpacity >= 0 && type.backgroundOpacity <= 1,
                `Incorrect value '${type.backgroundOpacity}' of ` +
                `'Style.blocks.types.${typeName}.backgroundOpacity'. ` +
                `Must be in [0, 1] interval.`
            )
            console.assert(
                typeof(type.width) == 'number' || type.width == undefined,
                `Incorrect type '${type.width}' of ` +
                `'Style.blocks.types.${typeName}.width'. Must be a 'number'.`
            )
            console.assert(
                typeof(type.height) == 'number' || type.height == undefined,
                `Incorrect type '${type.height}' of ` +
                `'Style.blocks.types.${typeName}.height'. Must be a 'number'.`
            )
        }
        console.assert(
            typeof(value.types.controlledInteraction.circleDiameter) == 'number',
            `Incorrect type '${value.types.controlledInteraction.circleDiameter}' of ` +
            `'Style.blocks.types.controlledInteraction.circleDiameter'. Must be a 'number'.`
        )
        console.assert(
            typeof(value.types.controlledInteraction.lineWidth) == 'number',
            `Incorrect type '${value.types.controlledInteraction.lineWidth}' of ` +
            `'Style.blocks.types.controlledInteraction.lineWidth'. Must be a 'number'.`
        )

        // connections
        console.assert(
            typeof(value.connections) == 'object',
            `Incorrect type '${value.connections}' of 'Style.blocks.connections'. ` +
            `Must be an 'object'.`
        )

        console.assert(
            typeof(value.connections.width) == 'number',
            `Incorrect type '${value.connections.width}' of 'Style.blocks.connections.width'. ` +
            `Must be a 'number'.`
        )

        console.assert(
            typeof(value.connections.color) == 'string',
            `Incorrect type '${value.connections.color}' of 'Style.blocks.connections.color'. ` +
            `Must be a 'string'.`
        )

        this._blocks = value
    }

    get columns() {
        return this._columns
    }

    /**
     * @param {object} value - Columns style.
     * @param {number} value.interval - Interval between columns.
     */
    set columns(value) {
        value = _.defaultTo(value, {})
        _.defaultsDeep(value, this._COLUMNS)

        console.assert(
            typeof(value) == 'object',
            `Incorrect type '${typeof(value)}' of 'Style.columns'. ` +
            `Must be an 'object'.`
        )

        console.assert(
            typeof(value.interval) == 'number',
            `Incorrect type '${typeof(value.interval)}' of 'Style.columns.interval'. ` +
            `Must be a 'number'.`
        )

        this._columns = value
    }

    get rows() {
        return this._rows
    }

    /**
     * @param {object} value - Rows style.
     * @param {number} value.interval - Interval between rows.
     */
    set rows(value) {
        value = _.defaultTo(value, {})
        _.defaultsDeep(value, this._ROWS)

        console.assert(
            typeof(value) == 'object',
            `Incorrect type '${typeof(value)}' of 'Style.rows'. ` +
            `Must be an 'object'.`
        )

        console.assert(
            typeof(value.interval) == 'number',
            `Incorrect type '${typeof(value.interval)}' of 'Style.rows.interval'. ` +
            `Must be a 'number'.`
        )

        this._rows = value
    }

    get axis() {
        return this._axis
    }

    /**
     * @param {object} value - Axis style object.
     * @param {number} value.width - Axis width.
     * @param {number} value.arrowHeight - Axis arrow height (and width).
     * @param {number} value.tickHeight - Axis ticks height (radius).
     * @param {string} value.color - Axis color.
     */
    set axis(value) {
        value = _.defaultTo(value, {})
        _.defaultsDeep(value, this._AXIS)

        console.assert(
            typeof(value) == 'object',
            `Incorrect type '${value}' of 'Style.axis'. Must be an 'object'.`
        )

        console.assert(
            typeof(value.width) == 'number',
            `Incorrect type '${value.width}' of 'Style.axis.width'. Must be a 'number'.`
        )

        console.assert(
            typeof(value.arrowHeight) == 'number',
            `Incorrect type '${value.arrowHeight}' of 'Style.axis.arrowHeight'. Must be a 'number'.`
        )

        console.assert(
            typeof(value.tickHeight) == 'number',
            `Incorrect type '${value.tickHeight}' of 'Style.axis.tickHeight'. Must be a 'number'.`
        )

        console.assert(
            typeof(value.color) == 'string',
            `Incorrect type '${value.color}' of 'Style.axis.color'. Must be a 'string'.`
        )

        this._axis = value
    }
}

module.exports.Style = Style