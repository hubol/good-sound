const { createDirectory } = require("./utils/file");
const { convertToMp3, convertToOgg } = require("./utils/convert");

async function convertSoundFiles(soundDescriptions, config, soundDescriptionPredicate)
{
    const filteredSoundDescriptions = soundDescriptions
        .filter(soundDescriptionPredicate);
    if (filteredSoundDescriptions.length === 0)
        return;


    createDirectory(config.soundDestDirectoryPath);
    const conversionPromises = filteredSoundDescriptions
        .map(x => {
            const convertToOggPromise = convertToOgg(x.sourceFilePath, x.oggFilePath);
            const convertToAacPromise = convertToMp3(x.sourceFilePath, x.mp3FilePath);

            return Promise.all([convertToOggPromise, convertToAacPromise])
                .catch(e => console.error(`Failed to convert ${x.typedName}: ${e}`))
        });

    await Promise.all(conversionPromises);
}

module.exports = { convertSoundFiles };