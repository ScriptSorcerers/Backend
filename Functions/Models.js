const makeModels = (name, fieldsObject) => {
    const model = `
    const { DataTypes } = require('sequelize');
    
    const ${name}Model = {
        ${
            Object.keys(fieldsObject).map((field) => {
                return `${field}: {
                    type: DataTypes.${fieldsObject[field].type},
                    allowNull: ${fieldsObject[field].allowNull},
                    primaryKey: ${fieldsObject[field].primaryKey},
                    defaultValue: ${fieldsObject[field].defaultValue}
                },`
            }).join('\n')
        }
    }
    module.exports = ${name}Model;
    `;
    return model;
}

module.exports = {
    makeModels
}