/**
 * Block wrapper.
 * @module blocks
 * @author deverte
 */

// project modules
let { Columns } = require('./columns') // wrapper
let { Rows } = require('./rows') // wrapper

/**
 * @classdesc Block wrapper.
 */
class Blocks {
    /**
     * Set positions of all blocks.
     * @static
     */
    static arrange(obj) {
        for (let i = 0; i < Columns.count(obj); i++) {
            for (let row of obj.columns[i].rows) {
                // Calculate `x` coordinate
                let x = obj.style.canvas.margin.left
                for (let j = 1; j < obj.columns[i].n; j++) {
                    x += Columns.getMaxWidth(obj, j) + obj.style.columns.interval
                }
                x += (Columns.getMaxWidth(obj, obj.columns[i].n) -
                     row.block.svg.width()) / 2

                // Calculate `y` coordinate
                let y = obj.style.canvas.margin.top
                let finJ = 1
                if (typeof(row.n) == 'number') {
                    finJ = row.n
                }
                else if (row.n instanceof Array) {
                    finJ = row.n[0]
                }
                for (let j = 1; j < finJ; j++) {
                    y += Rows.getMaxHeight(obj, j) + obj.style.rows.interval
                }

                // Add block
                row.block.svg
                    .x(x)
                    .y(y)
                obj.svg.add(row.block.svg)
            }
        }
    }

    /**
     * Draws connections between blocks with 'join' mark.
     * @static
     */
    static join(obj) {
        // Single rows
        for (let i = 1; i <= Rows.count(obj); i++) {
            let outRow = null
            let outColN = 0
            for (let column of obj.columns) {
                for (let row of column.rows) {
                    if (row.n == i && outRow != null && row.join.in == true) {
                        this.drawConnection(obj, outRow, row, outColN, column.n)
                        outRow = null
                        outColN = 0
                    }
                    if (row.n == i && row.join.out == true) {
                        outRow = row
                        outColN = column.n
                    }
                }
            }
        }
    }

    /**
     * Draws connection between two blocks located in specified rows and columns.
     * @static
     * @param {Row} outRow - Start block's row coordinate.
     * @param {Row} inRow - Finish block's row coordinate.
     * @param {number} outColN - Start block's column number coordinate.
     * @param {number} inColN - Finish block's column number coordinate.
     */
    static drawConnection(obj, outRow, inRow, outColN, inColN) {
        let y = outRow.block.svg.y() + outRow.block.svg.height() / 2
        let x0 = outRow.block.svg.x() + outRow.block.svg.width()
        if (outRow.content.text == '') {
            x0 -= Columns.getMaxWidth(obj, outColN) / 2
        }
        let x = inRow.block.svg.x()
        if (inRow.content.text == '') {
            x += Columns.getMaxWidth(obj, inColN) / 2
        }
        obj.svg.line(x0, y, x, y)
            .stroke(
                {
                    color: obj.style.blocks.connections.color,
                    width: obj.style.blocks.connections.width,
                    linecap: 'round'
                }
            )
    }

    /**
     * Draws connections between controlled and controlling blocks.
     * @static
     */
    static drawControlledInteractionLinks(obj) {
        for (let column of obj.columns) {
            for (let row of column.rows) {
                if (row.type.name == 'controlledInteraction') {
                    if (row.n < row.type.controlled) {
                        let x = row.block.svg.x() + row.block.svg.width() / 2
                        let y0 = row.block.svg.y() + row.block.svg.height()
                        let y = Rows.getCenterY(obj, row.type.controlled)
                        if (y != undefined) {
                            let ciStyle = obj.style.blocks.types.controlledInteraction
                            obj.svg.line(x, y0, x, y)
                                .stroke(
                                    {
                                        color: ciStyle.strokeColor,
                                        width: ciStyle.lineWidth,
                                        linecap: 'round'
                                    }
                                )
                            obj.svg.circle(ciStyle.circleDiameter)
                                .move(
                                    x - ciStyle.circleDiameter / 2,
                                    y - ciStyle.circleDiameter / 2
                                )
                                .fill(ciStyle.strokeColor)
                        }
                    }
                }
            }
        }
    }
}

module.exports.Blocks = Blocks