# psi.js

JavaScript (Node.js) package for describing different quantum systems using diagrams. E.g. these diagrams can describe and represent models such as D-CTC, P-CTC and T-CTC.

---

1. [Installation](#Installation)
2. [Usage](#Usage)
    1. [Project structure](#Project-structure)
    2. [Application](#Application)
    3. [Diagram](#Diagram)
3. [Package information](#Package-information)
3. [Documentation](#Documentation)
4. [License](#License)

---

## Installation
```sh
npm install git+https://git@github.com/deverte/psi.git
```

## Usage
### Project structure
```
project
|   app.js
|   diagram.json
|   package.json
|
|---node_modules
|   |   ...
```

### Application
`app.js`
```js
let fs = require('fs')
let jsonminify = require('jsonminify')

let { Diagram } = require('psi')

let main = async () => {
    // Read diagram description from file
    diagramFile = 'diagram.json'
    let diagramJSON = JSON.parse(JSON.minify(fs.readFileSync(diagramFile, 'utf8')))

    // Create and generate diagram
    let diagram = new Diagram(diagramJSON)
    await diagram.generate()

    // Write diagram to file
    fs.writeFileSync('out.svg', diagram.svg.svg())
}

if (require.main === module) { 
    main()
}
```

### Diagram
Description of the diagram objects can be found at project [wiki](https://github.com/deverte/psi/wiki).

## Package information
Based on the next packages:
1. [mathjax-node](https://www.npmjs.com/package/mathjax-node)
2. [svg.js](https://www.npmjs.com/package/@svgdotjs/svg.js)
3. [svgdom](https://www.npmjs.com/package/svgdom)
4. [lodash](https://www.npmjs.com/package/lodash)

## Documentation
Documentation can be found at project [wiki](https://github.com/deverte/psi/wiki).

## License
**MIT**