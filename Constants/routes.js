const makeRoutesHeader = (name) => {
    // const { Class } = require('../models');
    // const operations = require('../utilities/common')(Class);
    return `
const { ${name} } = require('../models');
const operations = require('../utilities/common')(${name});
    `
}

module.exports = {makeRoutesHeader}