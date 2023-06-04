const { User } = require('../Models');
const jwt = require("jsonwebtoken");

const verifyLogin = async (req,res,next) => {
    try{
        let token = req.headers?.authorization;
        if(!token) return res.status(400).json({
            message:"invalid authorization header",
        });
        if(!token.startsWith("Bearer")) return res.status(400).json({
            message:"invalid 'Bearer token' provided in the authorization header"
        })
        token = token.split(" ")[1];
        const decoded = jwt.verify(token,process.env.TOKEN_SECRET);
        req.USER = decoded;
        req.USER.isLoggedIn = true;
        next();

    }catch(err){
        console.log(err);
        return res.status(400).json({
            message:"invalid login attempt"
        });
    }
}

const isLoggedIn = async (req,res,next) => {
    req.USER = {isLoggedIn : false};
    try{
        let token = req.headers?.authorization;
        if(!token) return next();
        
        if(!token.startsWith("Bearer")) return next();
        token = token.split(" ")[1];
        const decoded = jwt.verify(token,process.env.TOKEN_SECRET);
        req.USER = decoded;
        req.USER.isLoggedIn = true;
        next();

    }catch(err){
        next();
    }
}

module.exports = {
    verifyLogin,
    isLoggedIn
}