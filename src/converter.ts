import {Config} from "./config";
import {SoundDescription} from "./mapper";
import {Predicate, Stopwatch} from "pissant";
import {createDirectory} from "pissant-node";
import {convertToMp3, convertToOgg} from "./soxConvert";

export async function convertSoundFiles<T extends SoundDescription>(soundDescriptions: T[], config: Config, soundDescriptionPredicate: Predicate<T>)
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
            const convertToMp3Promise = convertToMp3(x.sourceFilePath, x.mp3FilePath);

            return Promise.all([convertToOggPromise, convertToMp3Promise])
                .catch(e => console.error(`Failed to convert ${x.typedName}: ${e}`))
        });

    await Promise.all(conversionPromises);
    console.log(`Converting ${filteredSoundDescriptions.length} sound(s) took ${stopwatch.elapsedMillisecondsText}`);
}