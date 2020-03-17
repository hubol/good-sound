const fs = require("fs");
const { getDirectory, createDirectory, getRelativePath } = require("./utils/file");

function writeTypescriptFile(soundDescriptions, config)
{
    createDirectory(getDirectory(config.definitionDestFilePath));
    fs.writeFileSync(config.definitionDestFilePath, composeTypescriptText(soundDescriptions, config));
}

function composeTypescriptText(soundDescriptions, config)
{
    let text = `import { Howl } from 'howler';
    
// This file is generated. Do not touch.
`;

    soundDescriptions.forEach(x => text += toTypescript(x, config.definitionDestFilePath));

    return text;
}

function toTypescript(soundDescription, typescriptFilePath)
{
    const typescriptDirectory = getDirectory(typescriptFilePath);
    return `
export const ${soundDescription.typedName} = new Howl({
    src: [require("${getRelativePath(typescriptDirectory, soundDescription.oggFilePath)}"), require("${getRelativePath(typescriptDirectory, soundDescription.mp3FilePath)}")]
});
`;
}

module.exports = { writeTypescriptFile };