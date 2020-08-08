import {SoundDescription} from "./mapper";
import {Config} from "./config";
import {createOrUpdateFile, getDirectory, getRelativePath} from "pissant-node";

export function writeTypescriptFile(soundDescriptions: SoundDescription[], config: Config)
{
    const newTypescriptText = composeTypescriptText(soundDescriptions, config);
    createOrUpdateFile(config.definitionDestFilePath, newTypescriptText);
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