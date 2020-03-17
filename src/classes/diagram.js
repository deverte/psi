/**
 * Diagram class.
 * @module diagram
 * @author deverte
 */

// npm packages
let _ = require('lodash')
let { SVG, registerWindow } = require('@svgdotjs/svg.js') // https://svgjs.com/docs/3.0/
let window = require('svgdom') // https://www.npmjs.com/package/svgdom
let mjAPI = require('mathjax-node') // https://www.npmjs.com/package/mathjax-node
// project modules
let { Axis } = require('./axis')
let { Column } = require('./column')
let { Style } = require('./style')
let { Rows } = require('./rows.js') // wrapper
let { Columns } = require('./columns') // wrapper
let { Axes } = require('./axes') // wrapper
let { Blocks } = require('./blocks') // wrapper

/**
 * Creates Diagram object.
 * @classdesc Diagram class, that contains axis and all columns.
 * @param {string} diagramJSON - String with json-description of the diagram.
 * @param {object} mjConfig - Configured MathJax package.
 * @param {object} mjTypeset - MathJax typeset object.
 * @param {object} style - Style object.
 * @param {HTMLElement} documentElement - parent HTML-element.
 */
class Diagram {
    // Defaults
    _MJ_CONFIG = { // http://docs.mathjax.org/en/latest/options/output/index.html
        MathJax: {
            svg: {
                scale: 1, // global scaling factor for all expressions
                minScale: 0.5, // smallest scaling factor to use
                matchFontHeight: true, // true to match ex-height of surrounding font
                mtextInheritFont: false, // true to make mtext elements use surrounding font
                merrorInheritFont: true, // true to make merror text use surrounding font
                mathmlSpacing: false, // true for MathML spacing rules, false for TeX rules
                skipAttributes: {}, // RFDa and other attributes NOT to copy to the output
                exFactor: 0.5, // default size of ex in em units
                displayAlign: 'center', // default for indentalign when set to 'auto'
                displayIndent: '0', // default for indentshift when set to 'auto'
                fontCache: 'local', // or 'global' or 'none'
                localID: null, // ID to use for local font cache (for single equation processing)
                internalSpeechTitles: true, // insert <title> tags with speech content
                titleID: 0 // initial id number to use for aria-labeledby titles
            }
        },
        displayMessages: false, // determines whether Message.Set() calls are logged
        displayErrors:   true, // determines whether error messages are shown on the console
        undefinedCharError: false, // determines whether "unknown characters" (i.e., no glyph
                                   // in the configured fonts) are saved in the error array
        extensions: '', // a convenience option to add MathJax extensions
        fontURL: 'https://cdnjs.cloudflare.com/ajax/' + // for webfont urls in the
                 'libs/mathjax/2.7.2/fonts/HTML-CSS',   // CSS for HTML output
        paths: {} // configures custom path variables (e.g., for third party extensions, cf.
                  // test/config-third-party-extensions.js)
    }
    _MJ_TYPESET = { // https://www.npmjs.com/package/mathjax-node#typesetoptions-callback
        ex: 6, // ex-size in pixels
        width: 100, // width of container (in ex) for linebreaking and tags
        useFontCache: true, // use <defs> and <use> in svg output?
        useGlobalCache: false, // use common <defs> for all equations?
        linebreaks: false, // automatic linebreaking
        equationNumbers: 'none', // automatic equation numbering ("none", "AMS" or "all")
        cjkCharWidth: 13, // width of CJK character
        math: '', // the math string to typeset
        format: 'TeX', // the input format (TeX, inline-TeX, AsciiMath, or MathML)
        xmlns: 'mml', // the namespace to use for MathML
        html: false, // generate HTML output
        htmlNode: false, // generate HTML output as jsdom node
        css: false, // generate CSS for HTML output
        mml: false, // generate MathML output
        mmlNode: false, // generate MathML output as jsdom node
        svg: false, // generate SVG output
        svgNode: false, // generate SVG output as jsdom node
        speakText: true, // add textual alternative (for TeX/asciimath the input string,
                         // for MathML a dummy string)
        state: {}, // an object to store information from multiple calls (e.g., <defs>
                   // if useGlobalCache, counter for equation numbering if equationNumbers ar )
        timeout: 10e3 // 10 second timeout before restarting MathJax
    }
    _STYLE = {}
    _DOCUMENT_ELEMENT = undefined
    _COLUMNS = []
    // Constructor
    _mjConfig = this._MJ_CONFIG
    _mjAPI = null
    _mjTypeset = this._MJ_TYPESET
    _style = null
    _documentElement = this._DOCUMENT_ELEMENT
    _axis = null
    _columns = []
    // Setter
    _svg = null

    constructor(
        diagramJSON,
        {
            style = this._STYLE,
            documentElement = this._DOCUMENT_ELEMENT,
            mjConfig = this._MJ_CONFIG,
            mjTypeset = this._MJ_TYPESET
        }={}
    ) {
        this.mjConfig = mjConfig
        this.mjTypeset = mjTypeset

        // Style priority: 1) style, 2) diagramJSON.style, 3) Style defaults
        diagramJSON.style = _.defaultTo(diagramJSON.style, {})
        _.defaultsDeep(style, diagramJSON.style)
        this.style = new Style(style)

        this.documentElement = documentElement

        // Columns
        Columns.add(this, diagramJSON.columns)

        // Axis
        Axes.add(this, diagramJSON.axis)
    }

    /**
     * Generation of the diagram.
     * @public
     * @example <caption>Example usage.</caption>
     * diagramFile = 'diagram.json'
     * diagramJSON = JSON.parse(JSON.minify(fs.readFileSync(diagramFile, 'utf8')))
     * diagram = new Diagram(diagramJSON)
     * await diagram.generate()
     */
    async generate() {
        await Rows.generateSingle(this) // After that we know heights of the all rows.
        Rows.setSingleHeights(this)
        await Rows.generateMultiple(this)
        this._createCanvas()
        Blocks.arrange(this)
        Blocks.join(this)
        Blocks.drawControlledInteractionLinks(this)

        if (this.axis != null) {
            await Axes.generateLabels(this)
            Axes.generate(this)
            Axes.addLabels(this)
            Axes.addTicks(this)
        }
    }

    /**
     * Creates canvas containing all graphics (blocks, formulas and etc.).
     * @private
     */
    _createCanvas() {
        // Calculate width and height of canvas as sum of all elements widths and heights
        let width = this.style.canvas.margin.left + this.style.canvas.margin.right
        for (let i = 1; i <= Columns.count(this); i++) {
            width += Columns.getMaxWidth(this, i) + this.style.columns.interval
        }

        let height = this.style.canvas.margin.top + this.style.canvas.margin.bottom
        for (let i = 1; i <= Rows.count(this); i++) {
            height += Rows.getMaxHeight(this, i) + this.style.rows.interval
        }
        height -= this.style.rows.interval

        // Create canvas and it's background
        this.svg = SVG(this.documentElement)
            .width(width)
            .height(height)
        this.svg.rect()
            .size('100%', '100%')
            .fill(
                {
                    color: this.style.canvas.backgroundColor,
                    opacity: this.style.canvas.backgroundOpacity
                }
            )
    }

    get columns() {
        return this._columns
    }

    /**
     * @param {Array<Column>} value - Columns.
     */
    set columns(value) {
        value = _.defaultTo(value, this._COLUMNS)

        for (let column of columns) {
            console.assert(
                column instanceof Column,
                `Incorrect type '${column}' of 'Diagram.columns.column'. Must be a 'Column'.`
            )
        }

        this._columns = value
    }

    get axis() {
        return this._axis
    }

    /**
     * @param {Axis | null} value - Axis.
     */
    set axis(value) {
        console.assert(
            value instanceof Axis || value == null,
            `Incorrect type '${value}' of 'Diagram.axis'. Must be an 'Axis' or 'null'.`
        )

        this._axis = value
    }

    get mjConfig() {
        return this._mjConfig
    }

    /**
     * @param {object} value - MathJax configuration.
     */
    set mjConfig(value) {
        value = _.defaultTo(value, {})
        _.defaultsDeep(value, this._MJ_CONFIG)

        console.assert(
            typeof(value) == 'object',
            `Incorrect type '${value}' of 'Diagram.mjConfig'. Must be an 'object'.`
        )

        mjAPI.config(value)
        mjAPI.start()

        this.mjAPI = mjAPI

        this._mjConfig = value
    }

    get mjAPI() {
        return this._mjAPI
    }

    /**
     * @param {object} value - MathJax API.
     */
    set mjAPI(value) {
        console.assert(
            typeof(value) == 'object',
            `Incorrect type '${value}' of 'Diagram.mjAPI'. Must be an 'object'.`
        )

        this._mjAPI = value
    }

    get mjTypeset() {
        return this._mjTypeset
    }

    /**
     * @param {object} value - MathJax typeset.
     */
    set mjTypeset(value) {
        value = _.defaultTo(value, {})
        _.defaultsDeep(value, this._MJ_TYPESET)

        console.assert(
            typeof(value) == 'object',
            `Incorrect type '${value}' of 'Diagram.mjTypeset'. Must be an 'object'.`
        )

        this._mjTypeset = value
    }

    get style() {
        return this._style
    }

    /**
     * @param {Style} value - Style object.
     */
    set style(value) {
        value = _.defaultTo(value, {})
        _.defaultsDeep(value, this._STYLE)

        console.assert(
            value instanceof Style,
            `Incorrect type '${value}' of 'Diagram.style'. Must be a 'Style'.`
        )

        this._style = value
    }

    get documentElement() {
        return this._documentElement
    }

    /**
     * @param {object} value - Parent HTML-element.
     */
    set documentElement(value) {
        if (value == undefined || value == null) {
            let document = window.document
            registerWindow(window, document)

            value = document.documentElement
        }

        console.assert(
            typeof(value) == 'object',
            `Incorrect type '${value}' of 'Diagram.documentElement'. Must be an 'object'.`
        )

        this._documentElement = value
    }

    get svg() {
        return this._svg
    }

    /**
     * @param {SVG} value - Canvas.
     */
    set svg(value) {
        console.assert(
            value instanceof Object,
            `Incorrect type '${value}' of 'Diagram.svg'. Must be a 'SVG' or 'object'.`
        )
        
        this._svg = value
    }
}

module.exports.Diagram = Diagram