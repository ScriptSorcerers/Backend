const dbStrings = {
    "MongoDB": `mongodb://localhost:27017/dbname`,
    "MySQL": MySQLConnect = (connObj) => {
        const {name, user, pass, host} = connObj;
        return     `
        var {Sequelize} = require('sequelize');
        require('dotenv').config();
        const DATABASE = process.env.DATABASENAME||\'${name}\';
    const USER = process.env.USER||\'${user}\';
    const PASSWORD = process.env.PASSWORD||\'${pass}\';
    const HOST = process.env.HOST||\'${host}\';
        
        // connect to database
        const db = new Sequelize(DATABASE, USER, PASSWORD, {
            host: HOST,
            dialect: 'mysql',
            logging: false,
            });
        
            db.authenticate().then(()=>{
                console.log("Connected!");
            })
            .catch((error)=>{
                console.log(error);
            })
        module.exports = db;
        
            `
        },
    "PostgreSQL": PostgreSQLConnect = (connObj) => {
        const {name, user, pass, host} = connObj;
        return`
    var {Sequelize} = require('sequelize');
    require('dotenv').config();
    const DATABASE = process.env.DATABASENAME||\'${name}\';
    const USER = process.env.USER||\'${user}\';
    const PASSWORD = process.env.PASSWORD||\'${pass}\';
    const HOST = process.env.HOST||\'${host}\';
    
    // connect to database
    const db = new Sequelize(DATABASE, USER, PASSWORD, {
        host: HOST,
        dialect: 'postgres',
        logging: false,
        });
    
        db.authenticate().then(()=>{
            console.log("Connected!");
        }
        .catch((error)=>{
            console.log(error);
        }
    module.exports = db;
        `
    }
}

// For future use
const MongoConnect = (dbname) => {
    `
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const mongo = process.env.MONGO_URI||${dbStrings("MongoDB").replace("dbname", dbname)}||${dbStrings("MongoDB")};
const connectDB = async () => {
    try{
        mongoose.connect(mongo,
             {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => console.log('MongoDB connected'))
            .catch(err => console.log(err));
    
    
    }
    catch(err){
        console.log(err);
    }
}
connectDB();
`
}

module.exports = dbStrings;