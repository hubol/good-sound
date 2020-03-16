#!/usr/bin/env node

const path = require("path");
const { getFileHash } = require("./utils/file");
const { convertToMp3, convertToOgg } = require("./utils/convert");
const { getSoundDescriptions } = require("./mapper");
const timeUtils = require("./utils/time");

const args = process.argv.slice(2);

const soundSourceDirectoryPath = path.resolve(args[0]);
const soundDestDirectoryPath = path.resolve(args[1]);
const definitionDestFilePath = path.resolve(args[2]);
const runImmediately = args.filter(x => x === "--build").length > 0;

async function run()
{
    const soundDescriptions = await getSoundDescriptions(soundSourceDirectoryPath, soundDestDirectoryPath);
    console.log(JSON.stringify(soundDescriptions));

    // const identifiedSource = await convertUtils.identify(fileName);
    // const convertToOgg = convertToOgg(fileName, `/Users/Hubol/Projects/typed-sound/src/generator/.out/test.ogg`);
    // const convertToAac = convertToMp3(fileName, `/Users/Hubol/Projects/typed-sound/src/generator/.out/test.mp3`);
    //
    // await Promise.all([convertToOgg, convertToAac]);

    // /Users/Hubol/Projects/super-bogus/res/sounds/-viewsteam.wav
    // /Users/Hubol/Projects/typed-sound/src/generator/.out/
}

run()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(`An unexpected error occurred: ${e}`);
        process.exit(1);
    });