const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require('../Models');
const Helpers = require("../Helpers")

const checkDuplicatePhone = async phone =>{
    if(!phone) return false;
    const user = await User.findOne({phone});
    if(user) return true;
    return false;
}

const checkDuplicateEmail = async email =>{
    if(!email) return false;
    const user = await User.findOne({email});
    if(user) return true;
    return false;
}

const checkDuplicateUsername = async username =>{
    const user = await User.findOne({username});
    if(user) return true;
    return false;
}

const signup = async (req,res)=>{
    try{
        let {username, number, name, password } = req.body;

        if(!username || !name || !password || !number) return res.status(400).json({
            message: "fields missing",
            data:{
                username: !username || username.length==0?"missing/invalid":"provided",
                name: !name || name.length==0?"missing/invalid":"provided",
                password: !password || password.length==0?"missing/invalid":"provided",
                number: !number || number.length==0?"missing/invalid":"provided",
                
            }
        })
       
        let email,phone;
        if(Helpers.vaildateEmail(number) ) 
            email = number;
        else if(Helpers.validatePhone(number) ) 
            phone = +number;
        else{
            return res.status(400).json({
                message:"Invalid Email / Phone"
            });
        }
       
        const isDuplicates = await Promise.all([
            checkDuplicateEmail(email),
            checkDuplicatePhone(phone),
            checkDuplicateUsername(username)
        ]);
        
        if(isDuplicates.some( isRepated => isRepated ) ){
            const [email, phone , username] = isDuplicates;
            const wheterDuplicate = t => t?"duplicate":"not duplicate";
            return res.status(400).json({
                message:"found duplicates",
                data:{
                    email:wheterDuplicate(email), 
                    phone:wheterDuplicate(phone),
                    username:wheterDuplicate(username),
                }
            })
        }

        password = await bcrypt.hash(password, +process.env.SALT);
        const user = await User.create({username, phone, email, name, password });
        let data = user.toJSON();
        delete data.password;
        return res.status(200).json({message:"signup successful",data});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"something went wrong"});
    }
}

const login = async (req,res)=>{
    try{
        const {credentials, password } = req.body;
               
        if(!credentials) return res.status(400).json({
            message:"Either username, email or phone is required for login"
        })
        if( !password || (password && password.length==0)) return res.status(400).json({
            message:"Password is required for login"
        })
        let user;

        let email, username, phone;
        if(Helpers.vaildateEmail(credentials)){
            email = credentials;
        }else if(Helpers.validatePhone(credentials)){
            phone = +credentials;
        }else{
            username=credentials;
        }

        if(username)
            user = await User.findOne({ username }).select("username name password").exec();
        else if(email)
            user = await User.findOne({ email }).select("username name password").exec();
        else if(phone)
            user = await User.findOne({ phone }).select("username name password").exec();
        if(user){
            if(await bcrypt.compare(password,user.password)){
                let data = user.toJSON();
                console.log(data);
                delete data.password;
                let token = jwt.sign(data,process.env.TOKEN_SECRET);
                return res.status(200).json({message:"logged in successfully", data, token});
            }
        }else{
            return res.status(403).json({message:"unauthorized access"});
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"something went wrong"});
    }
}


module.exports = {
    signup,
    login,
    checkDuplicateEmail,
    checkDuplicatePhone,
    checkDuplicateUsername,
}