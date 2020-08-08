import {Config} from "./config";
import {AsyncReturnType, toPascalCase} from "pissant";
import path from "path";

export type SoundDescription = AsyncReturnType<typeof toSoundDescription>;

export async function toSoundDescription(soundFilePath: string, config: Config)
{
    const soundFileName = path.basename(soundFilePath);
    const soundFileNameNoExtension = soundFileName.replace(/\.[^/.]+$/, "");
    const pascalCasedName = toPascalCase(soundFileNameNoExtension);

    return {
        typedName: pascalCasedName,
        sourceFilePath: soundFilePath,
        mp3FilePath: path.join(config.soundDestDirectoryPath, `${soundFileNameNoExtension}.mp3`),
        oggFilePath: path.join(config.soundDestDirectoryPath, `${soundFileNameNoExtension}.ogg`)
    };
}