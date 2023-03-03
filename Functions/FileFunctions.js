const fs = require('fs');
const srcIndex = require('../Constants/srcIndex');
const dbStrings = require('../Constants/dbConnJs');
const {makeModels} = require('./Models');
const {makeModelIndex} = require('../Constants/models');
const {makeRoutesHeader} = require('../Constants/routes');


const makeSrcIndexFileFunction = async (dir, name, port) => {
    fs.writeFileSync(`${dir}\\${name}\\src\\index.js`, srcIndex(port), (err) => {
        if (err) {
            deleteFolderFunction(name, dir);
            throw err;
        }
    });
}

const makeDatabaseConnectivityFunction = async (dir, name, dbname, connObj) => {
    // console.log(dbStrings[dbname](connObj));
    fs.writeFileSync(`${dir}\\${name}\\src\\db\\conn.js`, dbStrings[dbname](connObj),
        (err) => {
            if (err) {
                deleteFolderFunction(name, dir);
                throw err;
            }
        }
    );
}

const makeModelsFunction = async (dir, name, models) => {
    models.forEach((model) => {
        fs.writeFileSync(`${dir}\\${name}\\src\\models\\${model.name}.js`, makeModels(model.name, model.fieldsObject), (err) => {
            if (err) {
                deleteFolderFunction(name, dir);
                throw err;
            }
        });
    })
}

const makeModelsIndexFunction = async (dir, name, models) => {
    fs.writeFileSync(`${dir}\\${name}\\src\\models\\index.js`, makeModelIndex(models), (err) => {
        if (err) {
            deleteFolderFunction(name, dir);
            throw err;
        }
    });   
}

const copyDefaultFilesFunction = async (dir, name) => {
    fs.copyFileSync(`${dir}\\CopyFiles\\common.js`, `${dir}\\${name}\\src\\utilities\\common.js`);
    fs.copyFileSync(`${dir}\\CopyFiles\\tools.js`, `${dir}\\${name}\\src\\utilities\\tools.js`);
}

const testFileHandlingFunction = async (dir, name) => {
    // store the data of the file
    const dataInFle = fs.readFileSync(`${dir}\\${name}\\src\\utilities\\common.js`, 'utf8');
    const dataToFill = "const test = 'test';";
    // fill the data in the file
    fs.writeFileSync(`${dir}\\${name}\\src\\utilities\\common.js`, dataToFill + dataInFle, (err) => {
        if (err) {
            deleteFolderFunction(name, dir);
            throw err;
        }
    });

    // read the file
}

const makeRoutesFunction = (dir, name, models) => {
    const routeLogic = fs.readFileSync(`${dir}\\CopyFiles\\routeDemo.js`, 'utf8', (err) => {
        if (err) {
            deleteFolderFunction(name, dir);
            throw err;
        }
    });
    models.map((model) => {
        const routesHeader = makeRoutesHeader(model.name);
        const routesFooter = `\nmodule.exports = {${model.name}Router:router}`;
        fs.writeFileSync(`${dir}\\${name}\\src\\routes\\${model.name}Route.js`, routesHeader + routeLogic + routesFooter, (err) => {
            if (err) {
                deleteFolderFunction(name, dir);
                throw err;
            }
        });
    })
}

const makeRoutesIndexFunction = (dir, name, models) => {
    
    const indexHeader = models.map((model) => {
        return `const {${model.name}Router} = require('./${model.name}Route');\n`;
    }).join('');
    const indexWrapper = `const routes = (app)=>{\n`;
    const indexLogic = models.map((model) => {
        return `app.use('/api/${model.name.toLowerCase()}', ${model.name}Router);\n`;
    }).join('');
    const indexFooter = `\n}\nmodule.exports = {routes};`;
    console.log(indexHeader + indexWrapper + indexLogic + indexFooter);
    fs.writeFileSync(`${dir}\\${name}\\src\\routes\\index.js`, indexHeader + indexWrapper + indexLogic + indexFooter, (err) => {
        if (err) {
            deleteFolderFunction(name, dir);
            throw err;
        }
    });
}
module.exports = {
    makeSrcIndexFileFunction,
    makeDatabaseConnectivityFunction,
    makeModelsFunction,
    makeModelsIndexFunction,
    copyDefaultFilesFunction,
    testFileHandlingFunction,
    makeRoutesFunction,
    makeRoutesIndexFunction
};