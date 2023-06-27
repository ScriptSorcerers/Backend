
const { makeSrcFolderFunction, makeFolderFunction, zipFolderFunction, deleteFolderFunction, downloadZipFunction, zipFolderwithAdmFunction } = require('./Functions/FolderFunctions');
const { makeSrcIndexFileFunction, makeDatabaseConnectivityFunction, makeModelsFunction, makeModelsIndexFunction, copyDefaultFilesFunction, testFileHandlingFunction, makeRoutesFunction, makeRoutesIndexFunction, makePackageJsonFunction,makeEnvFunction } = require('./Functions/FileFunctions');

const CreateBackend = async (req, res) => {
    var id = "Backend" + Math.random().toString(36).substr(2, 9);
    const { connObj, models } = req.body;
    // console.log(req.body);
    try {
        await makeFolderFunction(id, __dirname);

        await makeSrcFolderFunction(id);
        await makeSrcIndexFileFunction(__dirname, id, 5000);

        await makePackageJsonFunction(__dirname, id)
        await makeEnvFunction(__dirname, id, connObj)
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
        // right now delete ni hora coz download zip wala resolve ni hora
        // baad m dekhenge
        await deleteFolderFunction(id, __dirname);

        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = CreateBackend;