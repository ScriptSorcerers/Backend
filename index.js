
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const setupRoutes = require('./Routes');
require('dotenv');
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/backend';
// databse connection
mongoose.connect(MONGO_URI)
    .then( ()=> console.log("DB Connected") )
    .catch(err => console.log("unable to connect to Database\n",err) );

// import zip
// const archiver = require('archiver');


const app = express();
const port = process.env.PORT || 5000;
//json formatter
app.use(express.json());
app.use(cors());


setupRoutes(app);
app.get('/test', async (req, res) => {
    res.send("hello");
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
