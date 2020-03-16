const { execute, Command } = require("./execute");

function convertToMp3(sourceFileName, destFileName)
{
    if (!destFileName.endsWith(".mp3"))
        throw new Error(`destination file name: ${destFileName} does not end with .mp3!`);

    return execute(new Command("sox", sourceFileName, destFileName));
}

function convertToOgg(sourceFileName, destFileName)
{
    if (!destFileName.endsWith(".ogg"))
        throw new Error(`destination file name: ${destFileName} does not end with .ogg!`);

    return execute(new Command("sox", sourceFileName, destFileName));
}

module.exports = { convertToMp3, convertToOgg };