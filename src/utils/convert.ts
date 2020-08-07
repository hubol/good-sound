const { execute, Command } = require("./execute");

export function convertToMp3(sourceFileName: string, destFileName: string)
{
    if (!destFileName.endsWith(".mp3"))
        throw new Error(`destination file name: ${destFileName} does not end with .mp3!`);

    return execute(new Command("sox", sourceFileName, destFileName));
}

export function convertToOgg(sourceFileName: string, destFileName: string)
{
    if (!destFileName.endsWith(".ogg"))
        throw new Error(`destination file name: ${destFileName} does not end with .ogg!`);

    return execute(new Command("sox", sourceFileName, destFileName));
}