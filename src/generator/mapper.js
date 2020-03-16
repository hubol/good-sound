const path = require("path");
const { toPascalCase } = require("./utils/pascalCaser");
const { getFileHash, getAllFiles } = require("./utils/file");

function getSoundDescriptions(sourceDirectoryPath, destDirectoryPath)
{
    return Promise.all(getAllFiles(sourceDirectoryPath)
        .map(x => toSoundDescription(x, destDirectoryPath)));
}

async function toSoundDescription(soundFilePath, destDirectoryPath)
{
    const hash = await getFileHash(soundFilePath);
    const soundFileName = path.basename(soundFilePath);
    const soundFileNameNoExtension = soundFileName.replace(/\.[^/.]+$/, "");
    const pascalCasedName = toPascalCase(soundFileNameNoExtension);

    return {
        typedName: pascalCasedName,
        sourceFilePath: soundFilePath,
        mp3FilePath: path.join(destDirectoryPath, `${soundFileNameNoExtension}.mp3`),
        oggFilePath: path.join(destDirectoryPath, `${soundFileNameNoExtension}.ogg`),
        hash
    };
}

module.exports = { getSoundDescriptions };