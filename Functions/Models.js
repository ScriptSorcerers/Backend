const {DataTypesMap} = require('../Constants/models');
const typeMaker = (field) => {
    if(field.type === "ENUM"){
        const enumString = field.defaultValue.split(',').map((val) => {
            return `'${val}'`
            }).join(',');
        return `DataTypes.ENUM(${enumString})`
    }
    else
        return DataTypesMap[field.type]||'DataTypes.STRING';
}

const defaultMaker = (field) => {
    if(field.type === "BOOLEAN"){
        return `${field.defaultValue}`;
    }
    if(field.type === "INTEGER"||field.type === "BIGINT"||field.type === "FLOAT"||field.type === "DOUBLE"||field.type === "DECIMAL"){
        return `${field.defaultValue}`;
    }
    if(field.type === "ENUM"||field.type === "ARRAY"){
        const firstEnum = field.defaultValue.split(',')[0];
        return `'${firstEnum}'`;
    }
    else
        return `'${field.defaultValue}'`;
}
const makeModels = (name, fieldsObject) => {
    const model = `
    const { DataTypes } = require('sequelize');
    
    const ${name}Model = {
        ${
            Object.keys(fieldsObject).map((field) => {
                console.log(fieldsObject[field])
                return `${field}: {
                    type: ${typeMaker(fieldsObject[field])},
                    allowNull: ${!fieldsObject[field].allowNull},
                    unique: ${fieldsObject[field].unique},
                    primaryKey: ${fieldsObject[field].primaryKey||false},
                    ${fieldsObject[field].defaultValue&&`defaultValue: ${defaultMaker(fieldsObject[field])}`||''}
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