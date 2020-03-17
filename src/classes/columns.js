/**
 * Column wrapper.
 * @module columns
 * @author deverte
 */

// project modules
let { Row } = require('./row')
let { Column } = require('./column')

/**
 * @classdesc Column wrapper.
 */
class Columns  {
    /**
     * Creates columns from 'diagramJSON' object.
     * @static
     * @param {Array<object>} columns - Array with columns.
     */
    static add(obj, columns) {
        for (let column of columns) {
            if (column.rows == undefined) {
                continue
            }

            let rows = []
            for (let row of column.rows) {
                rows.push(
                    new Row(
                        {
                            n: row.n,
                            content: row.content,
                            type: row.type,
                            height: row.height,
                            join: row.join
                        }
                    )
                )
            }

            obj.columns.push(
                new Column(
                    {
                        n: column.n,
                        time: column.time,
                        rows: rows
                    }
                )
            )
        }
    }

    /**
     * Counts number of all columns.
     * In fact - highest number of the all columns.
     * @static
     * @returns {number} Number of all columns.
     */
    static count(obj) {
        let colsN = 0
        for (let column of obj.columns) {
            if (colsN < column.n) {
                colsN = column.n
            }
        }
        return colsN
    }

    /**
     * Calculates maximum width of the specified column.
     * @static
     * @param {number} colN - Number of the column to calculate maximum width.
     * @returns {number} Maximum width of the `colN` column.
     */
    static getMaxWidth(obj, colN) {
        let maxColumnWidth = 0
        for (let column of obj.columns) {
            for (let row of column.rows) {
                if (column.n == colN) {
                    let columnWidth = row.block.svg.width()
                    if (maxColumnWidth < columnWidth) {
                        maxColumnWidth = columnWidth
                    }
                }
            }
        }
        return maxColumnWidth
    }

    /**
     * Sets all blocks in column widths as maximum width in column.
     * @static
     */
    static setWidths(obj) {
        for (let column of obj.columns) {
            let maxColumnWidth = this.getMaxWidth(obj, column.n)
            for (let row of column.rows) {
                row.block.svg.width(maxColumnWidth)
                row.block.centerFormula()
            }
        }
    }
}

module.exports.Columns = Columns