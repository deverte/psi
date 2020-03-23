# psi.js

<div width="30%" align="center">
    <img width="50%" src="https://raw.githubusercontent.com/wiki/deverte/psi/images/icon.svg?sanitize=true" />
</div>

JavaScript (Node.js) package for describing different quantum systems using diagrams. E.g. these diagrams can describe and represent models such as D-CTC, P-CTC and T-CTC.

<div align="center">
    <img src="https://raw.githubusercontent.com/wiki/deverte/psi/images/bell.svg?sanitize=true" />
</div>

---

1. [Installation](#Installation)
2. [Wiki](#Wiki)
3. [Usage](#Usage)
    1. [Project structure](#Project-structure)
    2. [Application](#Application)
    3. [Diagram](#Diagram)
4. [Package information](#Package-information)
5. [License](#License)

---

## Installation
```sh
npm install git+https://git@github.com/deverte/psi.git
```

## Wiki
Documentation and instructions can be found at project [wiki](https://github.com/deverte/psi/wiki).

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

## License
**MIT**