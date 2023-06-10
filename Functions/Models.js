const makeModels = (name, fieldsObject) => {
    const model = `
    const { DataTypes } = require('sequelize');
    
    const ${name}Model = {
        ${
            Object.keys(fieldsObject).map((field) => {
                return `${field}: {
                    type: DataTypes.${fieldsObject[field].type||DataTypes.STRING},
                    allowNull: ${fieldsObject[field].allowNull||true},
                    unique: ${fieldsObject[field].unique||false},
                    primaryKey: ${fieldsObject[field].primaryKey||false},
                    defaultValue: \'${fieldsObject[field].defaultValue || ''}\',
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