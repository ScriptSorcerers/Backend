
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const setupRoutes = require('./Routes');
require('dotenv').config();
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/backendproject';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then( ()=> console.log("DB Connected") )
    .catch(err => console.log("unable to connect to Database\n",err) );

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
