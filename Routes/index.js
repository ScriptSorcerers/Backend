const Auth = require("./Auth")
const User = require("./User")
const Backend = require("./Backend")

const setupRoutes = (app) => {
    app.use(Auth);      
    app.use(User);      
    app.use(Backend);  
    app.use((req,res)=>{
        res.status(404).json({message:"Not Found"});
    });
    return app;
}

module.exports = setupRoutes;