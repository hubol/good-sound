#!/usr/bin/env node

const path = require("path");
const { createDirectory } = require("./utils/file");
const { convertToMp3, convertToOgg } = require("./utils/convert");
const { getSoundDescriptions } = require("./mapper");
const { writeTypescriptFile } = require("./typeWriter");
const timeUtils = require("./utils/time");

const args = process.argv.slice(2);

const soundSourceDirectoryPath = path.resolve(args[0]);
const soundDestDirectoryPath = path.resolve(args[1]);
const definitionDestFilePath = path.resolve(args[2]);
const runImmediately = args.filter(x => x === "--build").length > 0;

async function run()
{
    const soundDescriptions = await getSoundDescriptions(soundSourceDirectoryPath, soundDestDirectoryPath);
    writeTypescriptFile(soundDescriptions, definitionDestFilePath);

    createDirectory(soundDestDirectoryPath);
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