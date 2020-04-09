const fs = require("fs");
const { getDirectory, createDirectory, getRelativePath } = require("./utils/file");

function writeTypescriptFile(soundDescriptions, config)
{
    createDirectory(getDirectory(config.definitionDestFilePath));
    const newTypescriptText = composeTypescriptText(soundDescriptions, config);
    if (fs.existsSync(config.definitionDestFilePath))
    {
        const currentTypescriptText = fs.readFileSync(config.definitionDestFilePath).toString();
        if (currentTypescriptText === newTypescriptText)
            return;
    }

    console.log(`Writing ${config.definitionDestFilePath}...`);
    fs.writeFileSync(config.definitionDestFilePath, newTypescriptText);
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