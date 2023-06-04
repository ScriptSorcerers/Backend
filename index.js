// start a server and make an api
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const mongoose = require('mongoose');
const setupRoutes = require('./Routes');

// databse connection
mongoose.connect(process.env.MONGODB_URI)
    .then( ()=> console.log("DB Connected") )
    .catch(err => console.log("unable to connect to Database\n",err) );

// import zip
const archiver = require('archiver');
const {makeSrcFolderFunction, makeFolderFunction, zipFolderFunction, deleteFolderFunction, downloadZipFunction, zipFolderwithAdmFunction} = require('./Functions/FolderFunctions');
const {makeSrcIndexFileFunction, makeDatabaseConnectivityFunction, makeModelsFunction, makeModelsIndexFunction, copyDefaultFilesFunction, testFileHandlingFunction, makeRoutesFunction, makeRoutesIndexFunction,makePackageJsonFunction} = require('./Functions/FileFunctions');

const app = express();
const port = 3000;
//json formatter
app.use(express.json());
app.use(cors());

setupRoutes(app);
// app.get('/', async (req, res) => {

//     // create a unique id
//     var id = Math.random().toString(36).substr(2, 9);
//     // create a folder
//     fs.mkdir(id, (err) => {
//         if (err) {
//             return console.error(err);
//         }
//         console.log('Directory created successfully!');
//         // zip the folder with archiver
//         var output = fs.createWriteStream(__dirname + `/${id}.zip`);

//         var archive = archiver('zip', {
//             zlib: { level: 9 } // Sets the compression level.
//         });

//         output.on('close', function () {
//             console.log(archive.pointer() + ' total bytes');
//             console.log('archiver has been finalized and the output file descriptor has closed.');
//         });

//         archive.on('error', function (err) {
//             throw err;
//         });


//         archive.pipe(output);

//         archive.directory(`${id}/`, false);

//         archive.finalize().then(() => {
//             res.download(__dirname + `/${id}.zip`, `${id}.zip`, (err) => {
//                 if (err) {
//                     throw err;
//                 }
//             });
//             // delete folder and zip file
//             fs.rm(id, { recursive: true }, (err) => {
//                 if (err) {
//                     throw err;
//                 }
//                 console.log(`${id} is deleted!`);
//             }
//             );
//             fs.rm(`${id}.zip`, (err) => {
//                 if (err) {
//                     throw err;
//                 }
//                 console.log(`${id}.zip is deleted!`);
//             });
//         })
//         .catch((err) => {
//             res.send(err);
//         })
//     })
// });

app.post('/test', async (req, res) => {
    var id = Math.random().toString(36).substr(2, 9);
    const {connObj, models} = req.body;
    // console.log(req.body);
    await makeFolderFunction(id, __dirname);
    
    await makeSrcFolderFunction(id);
    await makeSrcIndexFileFunction(__dirname, id, 5000);

    await makePackageJsonFunction(__dirname, id)

    await makeDatabaseConnectivityFunction(__dirname, id, 'MySQL', connObj);

    await makeModelsFunction(__dirname, id, models);
    await makeModelsIndexFunction(__dirname, id, models);

    await copyDefaultFilesFunction(__dirname, id);
    // await testFileHandlingFunction(__dirname, id);
    await makeRoutesFunction(__dirname, id, models);

    await makeRoutesIndexFunction(__dirname, id, models);
    // await zipFolderFunction(id, __dirname);
    await zipFolderwithAdmFunction(id, __dirname);
    await downloadZipFunction(id, res, __dirname)

    await deleteFolderFunction(id, __dirname);

});
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
