#!/usr/bin/env node

const path = require("path");
const { createDirectory } = require("./utils/file");
const { convertToMp3, convertToOgg } = require("./utils/convert");
const { getSoundDescriptions } = require("./mapper");
const { writeTypescriptFile } = require("./typeWriter");
const timeUtils = require("./utils/time");

const { config } = require("./config");

async function run()
{
    const soundDescriptions = await getSoundDescriptions(config);
    writeTypescriptFile(soundDescriptions, config);

    createDirectory(config.soundDestDirectoryPath);
    const conversionPromises = soundDescriptions.map(x => {
        const convertToOggPromise = convertToOgg(x.sourceFilePath, x.oggFilePath);
        const convertToAacPromise = convertToMp3(x.sourceFilePath, x.mp3FilePath);

        return Promise.all([convertToOggPromise, convertToAacPromise])
            .catch(e => console.error(`Failed to convert ${x.typedName}: ${e}`))
    });

    await Promise.all(conversionPromises);
}

run()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(`An unexpected error occurred: ${e}`);
        process.exit(1);
    });