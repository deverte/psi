/**
 * Row wrapper.
 * @module rows
 * @author deverte
 */
// project modules
let {
  Block
} = require('./block');

let utils = require('../utils');
/**
 * @classdesc Row wrapper.
 */


class Rows {
  /**
   * Generates blocks only for single-rows.
   * For row==1, row==2 and etc. [typeof(row)=='number'].
   * @static
   */
  static async generateSingle(obj) {
    for (let column of obj.columns) {
      for (let row of column.rows) {
        if (typeof row.n == 'number') {
          let type = row.type.name;
          console.assert(obj.style.blocks.types[type] != undefined, `Type '${type}' is not defined in styles. ` + `The 'default' type is used instead.`);

          if (obj.style.blocks.types[type] == undefined) {
            type = 'default';
          }

          let block = new Block(row.content.text, obj.mjAPI, obj.mjTypeset, {
            format: row.content.format,
            wrapper: {
              backgroundColor: obj.style.blocks.types[type].backgroundColor,
              strokeWidth: obj.style.blocks.types[type].strokeWidth,
              strokeColor: obj.style.blocks.types[type].strokeColor,
              backgroundOpacity: obj.style.blocks.types[type].backgroundOpacity,
              width: obj.style.blocks.types[type].width,
              height: obj.style.blocks.types[type].height
            }
          });
          await block.createBlock();
          row.block = block;
        }
      }
    }
  }
  /**
   * Generates blocks only for multiple-rows.
   * For row==[1, 3] and etc. [typeof(row)=='object'].
   * @static
   */


  static async generateMultiple(obj) {
    for (let column of obj.columns) {
      for (let row of column.rows) {
        if (row.n instanceof Array) {
          let type = row.type.name;
          console.assert(obj.style.blocks.types[type] != undefined, `Type '${type}' is not defined in styles. ` + `The 'default' type is used instead.`);

          if (obj.style.blocks.types[type] == undefined) {
            type = 'default';
          }

          let block = new Block(row.content.text, obj.mjAPI, obj.mjTypeset, {
            format: row.content.format,
            wrapper: {
              backgroundColor: obj.style.blocks.types[type].backgroundColor,
              strokeWidth: obj.style.blocks.types[type].strokeWidth,
              strokeColor: obj.style.blocks.types[type].strokeColor,
              backgroundOpacity: obj.style.blocks.types[type].backgroundOpacity,
              width: obj.style.blocks.types[type].width
            }
          });
          await block.createBlock();
          row.block = block; // Set height as sum of the including rows heights.

          let height = 0;

          for (let i = row.n[0]; i <= row.n[1]; i++) {
            height += this.getMaxHeight(obj, i) + obj.style.rows.interval;
          }

          height -= obj.style.rows.interval;
          row.block.svg.size(row.block.svg.width(), height);
          row.block.centerFormula();
        }
      }
    }
  }
  /**
   * Sets heights only for single-rows.
   * @static
   */


  static setSingleHeights(obj) {
    let maxAllHeight = this.getMaxSingleHeight(obj);

    for (let column of obj.columns) {
      for (let row of column.rows) {
        if (typeof row.n == 'number') {
          if (row.height == 'maxAll') {
            row.block.svg.size(null, maxAllHeight);
          } else if (row.height == 'maxRow') {
            row.block.svg.size(null, this.getMaxHeight(obj, row.n));
          }
        }
      }
    }
  }
  /**
   * Counts number of all rows.
   * In fact - highest number of the all rows.
   * @static
   * @returns {number} Number of all rows.
   */


  static count(obj) {
    let rowsN = 0;

    for (let column of obj.columns) {
      for (let row of column.rows) {
        if (rowsN < row.n) {
          rowsN = row.n;
        }
      }
    }

    return rowsN;
  }
  /**
   * Calculates maximum height of all single-rows.
   * @static
   * @returns {number} Maximum height of all single-rows.
   */


  static getMaxSingleHeight(obj) {
    let maxAllHeight = 0;

    for (let column of obj.columns) {
      for (let row of column.rows) {
        if (typeof row.n == 'number') {
          let rowHeight = row.block.svg.height();

          if (maxAllHeight < rowHeight) {
            maxAllHeight = rowHeight;
          }
        }
      }
    }

    return maxAllHeight;
  }
  /**
   * Calculates maximum height of the specified row.
   * @static
   * @param {number} rowN - Number of the row to calculate maximum height.
   * @returns {number} Maximum height of the `rowN` row.
   */


  static getMaxHeight(obj, rowN) {
    let maxRowHeight = 0;

    for (let column of obj.columns) {
      for (let row of column.rows) {
        if (typeof row.n == 'number' && row.n == rowN) {
          let rowHeight = row.block.svg.height();

          if (maxRowHeight < rowHeight) {
            maxRowHeight = rowHeight;
          }
        }
      }
    }

    return maxRowHeight;
  }
  /**
   * Get center `y` coordinate of the row.
   * @static
   * @param {number} rowN - Number of the row to calculate center `y` coordinate.
   * @returns {number | undefined} - Center `y` coordinate of the row or `undefined`
   *                                 if row is empty.
   */


  static getCenterY(obj, rowN) {
    for (let column of obj.columns) {
      for (let row of column.rows) {
        if (row.n == rowN && row.block != undefined) {
          if (row.block.svg != undefined) {
            return row.block.svg.y() + row.block.svg.height() / 2;
          }
        }
      }
    }

    return undefined;
  }

}

module.exports.Rows = Rows;