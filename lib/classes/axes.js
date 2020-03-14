/**
 * Axis wrapper.
 * @module axes
 * @author deverte
 */

// npm packages
let _ = require('lodash')
// project modules
let { Axis } = require('./axis')
let { Block } = require('./block')
let { Columns } = require('./columns') // wrapper

/**
 * @classdesc Axis wrapper.
 */
class Axes {
    /**
     * Creates axis with params given in `diagramJSON`.
     * @static
     * @param {object} axis - JSON-object with axis parameters.
     * @param {string} axis.direction - Direction of the axis.
     *                                  Can be "left" | "right" | "bidirectional".
     * @param {object} axis.label - Object with label parameters.
     * @param {string} axis.label.format - Format of the label's text.
     *                                     Can be "inline-TeX" | "TeX" | "AsciiMath" | "MathML".
     * @param {string} axis.label.text - Label's text.
     * @param {number} axis.width - Width of the line.
     */
    static add(obj, axis) {
        if (axis == undefined) {
            obj.axis = null
        }
        else {
            // if axis.position == undefined
            axis.position = _.defaultTo(axis.position, Axis._POSITION)
            // if axis.position.left == undefined || axis.position.right == undefined
            _.defaultsDeep(axis.position, Axis._POSITION)

            // To start from the end
            if (axis.position.right < 0) {
                axis.position.right = Columns.count(obj) + axis.position.right + 1
            }
            obj.axis = new Axis(
                {
                    direction: axis.direction,
                    label: axis.label,
                    position: axis.position,
                    margin: obj.style.axis.margin,
                    width: obj.style.axis.width,
                    arrowHeight: obj.style.axis.arrowHeight,
                    tickHeight: obj.style.axis.tickHeight,
                    color: obj.style.axis.color
                }
            )
        }
    }

    /**
     * Generates axis labels (over axis arrows and over ticks).
     * @static
     */
    static async generateLabels(obj) {
        // Labels over axis arrows
        let format = 'TeX'
        if (obj.axis.label.format != undefined) {
            format = obj.axis.label.format
        }
        if (obj.axis.label.text != undefined) {
            let label = new Block(
                obj.axis.label.text,
                obj.mjAPI,
                obj.mjTypeset,
                {
                    format: format,
                    wrapper: {
                        strokeWidth: 0
                    }
                }
            )
            await label.createBlock()

            obj.axis.labelBlock.push(label) // Once if not 'bidirectional'

            if (obj.axis.direction == 'bidirectional') {
                obj.axis.labelBlock.push(_.cloneDeep(label))
            }
        }

        // Labels over ticks
        for (let column of obj.columns) {
            if (column.time != undefined) {
                let format = 'TeX'
                if (column.time.format != undefined) {
                    format = column.time.format
                }
                if (column.time.text != undefined) {
                    let label = new Block(
                        column.time.text,
                        obj.mjAPI,
                        obj.mjTypeset,
                        {
                            format: format,
                            wrapper: {
                                strokeWidth: 0
                            }
                        }
                    )
                    await label.createBlock()
                    column.axisLabel = label
                }
            }
        }
    }

    /**
     * Get max axis label's height (over ticks).
     * @static
     * @returns {number} Max axis label's height.
     */
    static getLabelsMaxHeight(obj) {
        let maxHeight = 0
        for (let column of obj.columns) {
            if (column.axisLabel != null) {
                if (maxHeight < column.axisLabel.svg.height()) {
                    maxHeight = column.axisLabel.svg.height()
                }
            }
        }
        return maxHeight
    }

    /**
     * Draw axis line with arrow (without labels and ticks).
     * @static
     */
    static generate(obj) {
        if (obj.axis != null) {
            let axisHeight = obj.axis.margin + obj.axis.arrowHeight * 2 +
                             obj.axis.width + this.getLabelsMaxHeight(obj)
            obj.svg
                .height(
                    obj.svg.height() + axisHeight
                )

            // Line
            let x0 = obj.style.canvas.margin.left
            for (let i = 1; i < obj.axis.position.left; i++) {
                x0 += Columns.getMaxWidth(obj, i) + obj.style.columns.interval
            }
            let x = obj.svg.width() - obj.style.canvas.margin.right
            for (let i = Columns.count(obj); i > obj.axis.position.right; i--) {
                x -= Columns.getMaxWidth(obj, i) + obj.style.columns.interval
            }
            let y = obj.svg.height() - obj.style.canvas.margin.bottom -
                    this.getLabelsMaxHeight(obj) - obj.axis.arrowHeight
            obj.svg.line(x0, y, x, y)
                .stroke({color: obj.axis.color, width: obj.axis.width, linecap: 'round'})

            // Arrow
            if (obj.axis.direction == 'left') {
                obj.svg.line(x0, y, x0 + obj.axis.arrowHeight, y + obj.axis.arrowHeight)
                    .stroke({color: obj.axis.color, width: obj.axis.width, linecap: 'round'})
                obj.svg.line(x0, y, x0 + obj.axis.arrowHeight, y - obj.axis.arrowHeight)
                    .stroke({color: obj.axis.color, width: obj.axis.width, linecap: 'round'})
            }
            else if (obj.axis.direction == 'right') {
                obj.svg.line(x, y, x - obj.axis.arrowHeight, y + obj.axis.arrowHeight)
                    .stroke({color: obj.axis.color, width: obj.axis.width, linecap: 'round'})
                obj.svg.line(x, y, x - obj.axis.arrowHeight, y - obj.axis.arrowHeight)
                    .stroke({color: obj.axis.color, width: obj.axis.width, linecap: 'round'})
            }
            else if (obj.axis.direction == 'bidirectional') {
                obj.svg.line(x0, y, x0 + obj.axis.arrowHeight, y + obj.axis.arrowHeight)
                    .stroke({color: obj.axis.color, width: obj.axis.width, linecap: 'round'})
                obj.svg.line(x0, y, x0 + obj.axis.arrowHeight, y - obj.axis.arrowHeight)
                    .stroke({color: obj.axis.color, width: obj.axis.width, linecap: 'round'})
                obj.svg.line(x, y, x - obj.axis.arrowHeight, y + obj.axis.arrowHeight)
                    .stroke({color: obj.axis.color, width: obj.axis.width, linecap: 'round'})
                obj.svg.line(x, y, x - obj.axis.arrowHeight, y - obj.axis.arrowHeight)
                    .stroke({color: obj.axis.color, width: obj.axis.width, linecap: 'round'})
            }
        }
    }

    /**
     * Draw axis labels (over axis arrows and over ticks).
     * @static
     */
    static addLabels(obj) {
        let y = obj.svg.height() - obj.style.canvas.margin.bottom -
                this.getLabelsMaxHeight(obj)

        // Labels over axis arrows
        if (obj.axis.direction == 'left') {
            let x = obj.style.canvas.margin.left
            for (let i = 1; i < obj.axis.position.left; i++) {
                x += Columns.getMaxWidth(obj, i) + obj.style.columns.interval
            }
            obj.axis.labelBlock[0].svg
                .x(x)
                .y(y)
            obj.svg.add(obj.axis.labelBlock[0].svg)
        }
        else if (obj.axis.direction == 'right') {
            let x = obj.svg.width() -
                    obj.style.canvas.margin.right -
                    obj.axis.labelBlock[0].svg.width() / 2
            for (let i = Columns.count(obj); i > obj.axis.position.right; i--) {
                x -= Columns.getMaxWidth(obj, i) + obj.style.columns.interval
            }
            obj.axis.labelBlock[0].svg
                .x(x)
                .y(y)
            obj.svg.add(obj.axis.labelBlock[0].svg)
        }
        else if (obj.axis.direction == 'bidirectional') {
            let xLeft = obj.style.canvas.margin.left
            for (let i = 1; i < obj.axis.position.left; i++) {
                xLeft += Columns.getMaxWidth(obj, i) + obj.style.columns.interval
            }
            let xRight = obj.svg.width() -
                    obj.style.canvas.margin.right -
                    obj.axis.labelBlock[0].svg.width() / 2
            for (let i = Columns.count(obj); i > obj.axis.position.right; i--) {
                xRight -= Columns.getMaxWidth(obj, i) + obj.style.columns.interval
            }
            obj.axis.labelBlock[0].svg
                .x(xLeft)
                .y(y)
            obj.svg.add(obj.axis.labelBlock[0].svg)
            obj.axis.labelBlock[1].svg
                .x(xRight)
                .y(y)
            obj.svg.add(obj.axis.labelBlock[1].svg)
        }

        // Labels over ticks
        for (let column of obj.columns) {
            if (column.axisLabel != null) {
                column.axisLabel.svg
                    .x(
                        column.rows[0].block.svg.x() +
                        column.rows[0].block.svg.width() / 2 -
                        column.axisLabel.svg.width() / 2
                    )
                    .y(y)

                obj.svg.add(column.axisLabel.svg)
            }
        }
    }

    /**
     * Draw axis ticks.
     * @static
     */
    static addTicks(obj) {
        let y = obj.svg.height() - obj.style.canvas.margin.bottom -
                this.getLabelsMaxHeight(obj) - obj.axis.arrowHeight
        for (let column of obj.columns) {
            if (column.time.text != '') {
                let tickX = column.rows[0].block.svg.x() + column.rows[0].block.svg.width() / 2

                obj.svg.line(tickX, y - obj.axis.tickHeight, tickX, y + obj.axis.tickHeight)
                    .stroke({color: obj.axis.color, width: obj.axis.width, linecap: 'round'})
            }
        }
    }
}

module.exports.Axes = Axes