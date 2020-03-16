const fs = require("fs");
const { getDirectory, createDirectory } = require("./utils/file");

function writeTypescriptFile(soundDescriptions, config)
{
    createDirectory(getDirectory(config.definitionDestFilePath));
    fs.writeFileSync(config.definitionDestFilePath, composeTypescriptText(soundDescriptions));
}

function composeTypescriptText(soundDescriptions)
{
    let text = `
export interface Sound {
    oggUrl: string;
    mp3Url: string;
}    
`;

    soundDescriptions.forEach(x => text += toTypescript(x));

    return text;
}

function toTypescript(soundDescription)
{
    return `
export const ${soundDescription.typedName}: Sound = {
    oggUrl: require("${soundDescription.oggFilePath}"),
    mp3Url: require("${soundDescription.mp3FilePath}"),
};
`;
}

module.exports = { writeTypescriptFile };