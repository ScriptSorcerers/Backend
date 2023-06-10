const fs = require('fs');
const archiver = require('archiver');
var AdmZip = require("adm-zip");

const makeFolderFunction = async (name, dir) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(name, (err) => {
            if (err) {
                reject(err);
            }
            resolve(name);
        });
    });
}

const zipFolderFunction = async (name, dir) => {
    // zip with archive
    return new Promise((resolve, reject) => {
        var output = fs.createWriteStream(dir + `/${name}.zip`);

        var archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });

        archive.on('error', function (err) {
            throw err;
        });

        archive.pipe(output);

        archive.directory(`${name}/`, false);

        archive.finalize().then(() => {
            resolve();
        })
        .catch((err) => {
                console.log(err);
                reject(err);
            });
    })
}

const zipFolderwithAdmFunction = async (name, dir) => {
    // zip with adm-zip
    return new Promise((resolve, reject) => {
        var zip = new AdmZip();
        zip.addLocalFolder(`${name}`);
        zip.writeZip(dir + `/${name}.zip`);
        resolve();
    });
}
const deleteFolderFunction = async (name, dir) => {
    return new Promise((resolve, reject) => {
        fs.rm(dir + "\\" + name, { recursive: true }, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
        fs.rm(dir + "\\" + `${name}.zip`, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

const downloadZipFunction = async (name, res, dir) => {

    return new Promise((resolve, reject) => {
        // console.log(dir + `/${name}.zip`)
        res.download(dir + `\\${name}.zip`, `${name}.zip`, (err) => {
            if (err) {
                reject(err);
            }
            // resolve();
            return true;
        });
    });
}

const makeSrcFolderFunction = async (name) => {
    // make many folders
    await makeFolderFunction(`${name}/src`, name);
    console.log('src folder created');
    await makeFolderFunction(`${name}/src/db`, name);
    console.log('db folder created');
    await makeFolderFunction(`${name}/src/middleware`, name);
    console.log('middleware folder created');
    await makeFolderFunction(`${name}/src/models`, name);
    console.log('models folder created');
    await makeFolderFunction(`${name}/src/routers`, name);
    console.log('routes folder created');
    await makeFolderFunction(`${name}/src/utilities`, name);
    console.log('utilities folder created');
}

module.exports = {
    makeFolderFunction,
    zipFolderFunction,
    deleteFolderFunction,
    downloadZipFunction,
    makeSrcFolderFunction,
    zipFolderwithAdmFunction
}