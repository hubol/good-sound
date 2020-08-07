import {Stopwatch} from "./utils/time";
import {createDirectory} from "./utils/file";
import {convertToMp3, convertToOgg} from "./utils/convert";
import {Config} from "./config";
import {SoundDescription} from "./mapper";

export type SoundDescriptionPredicate = (soundDescription: SoundDescription) => boolean;

export async function convertSoundFiles(soundDescriptions: SoundDescription[], config: Config, soundDescriptionPredicate: SoundDescriptionPredicate)
{
    const filteredSoundDescriptions = soundDescriptions
        .filter(soundDescriptionPredicate);
    if (filteredSoundDescriptions.length === 0)
        return;

    const stopwatch = new Stopwatch();
    createDirectory(config.soundDestDirectoryPath);
    const conversionPromises = filteredSoundDescriptions
        .map(x => {
            const convertToOggPromise = convertToOgg(x.sourceFilePath, x.oggFilePath);
            const convertToAacPromise = convertToMp3(x.sourceFilePath, x.mp3FilePath);

            return Promise.all([convertToOggPromise, convertToAacPromise])
                .catch(e => console.error(`Failed to convert ${x.typedName}: ${e}`))
        });

    await Promise.all(conversionPromises);
    console.log(`Converting ${filteredSoundDescriptions.length} sound(s) took ${stopwatch.elapsedMillisecondsText}`);
}