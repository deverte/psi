/**
 * Some utils for manipulating with sizes (coordinates).
 * @module utils
 * @author deverte
 */

/**
 * Conversion of size with `ex` units into size with `px` units.
 * @param {string} ex - String of size with `ex` units.
 * @param {number} exSize - `ex` size in pixels.
 * @returns {number} Coordinate with `px` units.
 * @example <caption>Example usage.</caption>
 * console.log(svgjsFigure.width()) // '2ex'
 * console.log(mjTypeset.ex) // 6
 * pxWidth = exToPx(svgjsFigure.width(), mjTypeset.ex)
 * console.log(pxWidth) // 12
 */
let exToPx = (ex, exSize) => {
    return parseFloat(ex) * exSize
}

/**
 * Conversion of size with `ex` units into size with `px` units.
 * @param {number} px - Number with `px` units.
 * @param {number} exSize - `ex` size in pixels.
 * @param {number} dec - Decimal places.
 * @returns {number} Coordinate with `ex` units.
 */
let pxToEx = (px, exSize, dec=3) => {
    return (px / exSize).toFixed(dec) + 'ex'
}

/**
 * Evaluation with coordinates in `ex` units and returning result back in `ex` units.
 * @param {string} ex - String of coordinate with `ex` units.
 * @param {number} exSize - `ex` size in pixels.
 * @param {evaluationCallback} callback - function to perform evaluation.
 * @returns {string} Coordinate with `ex` units.
 * @example <caption>Example usage.</caption>
 * console.log(svgjsFigure.width()) // '2ex'
 * console.log(mjTypeset.ex) // 6
 * newWidth = exPxEval(svgjsFigure.width(), mjTypeset.ex, (x) => x + 7)
 * console.log(newWidth) // '9ex'
 */
let exPxEval = (ex, exSize, callback) => {
    // Convert to `px`
    let px = exToPx(ex, exSize)
    // Evaluate expression as if the value is in `px` units
    let ev = callback(px)
    // Convert back to `ex` string with 3 decimal places
    return pxToEx(ev, exSize, 3)
}
/**
 * Function to perform evaluation
 * @callback evaluationCallback
 * @param {number} px - Variable to perform calculations as if value is in `px` units.
 */

module.exports.exToPx = exToPx
module.exports.pxToEx = pxToEx
module.exports.exPxEval = exPxEval