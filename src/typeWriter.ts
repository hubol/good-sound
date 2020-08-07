import fs from "fs";
import {createDirectory, getDirectory, getRelativePath} from "./utils/file";
import {SoundDescription} from "./mapper";
import {Config} from "./config";

export function writeTypescriptFile(soundDescriptions: SoundDescription[], config: Config)
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

function composeTypescriptText(soundDescriptions: SoundDescription[], config: Config)
{
    let text = `import { Howl } from 'howler';
    
// This file is generated. Do not touch.
`;

    soundDescriptions.forEach(x => text += toTypescript(x, config));

    return text;
}

function toTypescript(soundDescription: SoundDescription, config: Config)
{
    const typescriptDirectory = getDirectory(config.definitionDestFilePath);
    return `
export const ${soundDescription.typedName} = new Howl({
    src: [require("${getRelativePath(typescriptDirectory, soundDescription.oggFilePath)}"), require("${getRelativePath(typescriptDirectory, soundDescription.mp3FilePath)}")],
    ${config.dontPreload ? "preload: false" : ""}
});
`;
}