const defaultJson = {
    "name": "",
    "version": "0.0.1",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "nodemon index.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
        "express": "^4.18.2",
        "nodemon": "^2.0.20",
        "sequelize": "^6.6.5",
        "mongoose": "^5.13.7",
        "jsonwebtoken": "^9.0.0",
        "bcrypt": "^5.1.0",
        "bcryptjs": "^2.4.3",
        "cors": "^2.8.5",
        "dotenv": "^16.0.3",
    }
}

const makePackageJson = (name) => {
    if(name)
        return defaultJson;
    let json = defaultJson;
    json.name = name;
    return json;
};

module.exports = {makePackageJson};