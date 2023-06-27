const srcIndex = (port) => {
    return `
    const { Router } = require("express")
    const express = require("express")
    require("dotenv").config()
    const cors = require("cors")
    //Add port in an env file
    const port = process.env.PORT || 5000
    
    require("../src/db/conn")
    
    const app = express()
    app.use(express.json())
    app.use(cors());
    require("./routers")(app);
    
    app.listen(port, ()=> console.log('connection setup at ${port||5000}'));`
};

module.exports = srcIndex;