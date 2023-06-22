const attributesMap = {
    'dataType' : "type",
    'unique' : "unique",
    'allowNull' : "allowNull",
    'defaultValue' : "defaultValue",
    'primaryKey' : "primaryKey",
}

const DataTypesMap = {
    'STRING' : "DataTypes.STRING",
    'INTEGER' : "DataTypes.INTEGER",
    'UUID' : "DataTypes.UUID",
    'UUIDV4' : "DataTypes.UUIDV4",
    'ENUM' : "DataTyoes.ENUM",
    'BOOLEAN' : "DataTypes.BOOLEAN",
    'DATE' : "DataTypes.DATE",
    'TEXT' : "DataTypes.TEXT",
    'FLOAT' : "DataTypes.FLOAT",
    'DOUBLE' : "DataTypes.DOUBLE",
    'DECIMAL' : "DataTypes.DECIMAL",
    'BLOB' : "DataTypes.BLOB",
    'VIRTUAL' : "DataTypes.VIRTUAL",
    'ARRAY' : "DataTypes.ARRAY",
    'JSON' : "DataTypes.JSON",
    'JSONB' : "DataTypes.JSONB",
    'GEOMETRY' : "DataTypes.GEOMETRY",
    'GEOGRAPHY' : "DataTypes.GEOGRAPHY",
    'CIDR' : "DataTypes.CIDR",
    'INET' : "DataTypes.INET",
    'MACADDR' : "DataTypes.MACADDR",
    'RANGE' : "DataTypes.RANGE",
    'REAL' : "DataTypes.REAL",
    'DOUBLE PRECISION' : "DataTypes.DOUBLE PRECISION",
    'TIME' : "DataTypes.TIME",
    'TINYINT' : "DataTypes.TINYINT",
    'SMALLINT' : "DataTypes.SMALLINT",
    'MEDIUMINT' : "DataTypes.MEDIUMINT",
    'BIGINT' : "DataTypes.BIGINT",
    'UNSIGNED INTEGER' : "DataTypes.UNSIGNED INTEGER",
    'UNSIGNED BIGINT' : "DataTypes.UNSIGNED BIGINT",
    'ZEROFILL' : "DataTypes.ZEROFILL",
    'BINARY' : "DataTypes.BINARY",
    'VARBINARY' : "DataTypes.VARBINARY",
    'BIT' : "DataTypes.BIT",
    'CHAR' : "DataTypes.CHAR",
    'DATEONLY' : "DataTypes.DATEONLY",
    'HSTORE' : "DataTypes.HSTORE",
    'NOW' : "DataTypes.NOW",
}

const makeModelIndex = (models) => {
    return `
        ${models.map((model) => {
            return `const ${model.name}Model = require('./${model.name}')`
        }).join('\n')}

        const db = require('../db/conn');
        ${ models.map((model) => {
            return `
            const ${model.name} = db.define('${model.name}', ${model.name}Model);`
        }).join('\n')}

        const syncDatabase = async () => {
            await db.sync({force: true,
                logging: false,
                freezeTableName: true
            });
        }

        ${
            models.map((model,i) => {
                if(models[i+1]) return `// ${model.name}.hasMany(${models[i+1].name});\t// ${models[i+1].name}.belongsTo(${model.name});\n\n`                
            })
        }

        module.exports = {
            ${models.map((model) => {
                return `${model.name},`
            }).join('\n')}
        }
    `
}
const makeEnum = (enumArray) => {
    return 'DataTypes.ENUM(' + enumArray.map((item) => {
        return `'${item}'`
    }).join(',') + ')';
}

module.exports = {
    makeModelIndex,
    DataTypesMap
}