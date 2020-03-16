const fs = require("fs");
const path = require("path");
const { getDirectory, createDirectory } = require("./utils/file");

function writeTypescriptFile(soundDescriptions, config)
{
    createDirectory(getDirectory(config.definitionDestFilePath));
    fs.writeFileSync(config.definitionDestFilePath, composeTypescriptText(soundDescriptions, config));
}

function composeTypescriptText(soundDescriptions, config)
{
    let text = `
export interface Sound {
    oggUrl: string;
    mp3Url: string;
}    
`;

    soundDescriptions.forEach(x => text += toTypescript(x, config.definitionDestFilePath));

    return text;
}

function toTypescript(soundDescription, typescriptFilePath)
{
    const typescriptDirectory = getDirectory(typescriptFilePath);
    return `
export const ${soundDescription.typedName}: Sound = {
    oggUrl: require("${path.relative(typescriptDirectory, soundDescription.oggFilePath)}"),
    mp3Url: require("${path.relative(typescriptDirectory, soundDescription.mp3FilePath)}"),
};
`;
}

module.exports = { writeTypescriptFile };