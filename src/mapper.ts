import {Config} from "./config";

const path = require("path");
const { toPascalCase } = require("./utils/pascalCaser");
const { getFileHash, getAllFiles } = require("./utils/file");

export function getSoundDescriptions(config: Config): Promise<SoundDescription[]>
{
    return Promise.all(getAllFiles(config.soundSourceDirectoryPath)
        .map(x => toSoundDescription(x, config.soundDestDirectoryPath)));
}

type AsyncReturnType<T extends (...args: any) => Promise<any>> =
    T extends (...args: any) => Promise<infer R> ? R : any

export type SoundDescription = AsyncReturnType<typeof toSoundDescription>;

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