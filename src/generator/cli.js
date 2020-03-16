#!/usr/bin/env node

const { getSoundDescriptions } = require("./mapper");
const { writeTypescriptFile } = require("./typeWriter");
const { convertSoundFiles } = require("./converter");

const { config } = require("./config");

async function run()
{
    const soundDescriptions = await getSoundDescriptions(config);
    writeTypescriptFile(soundDescriptions, config);
    await convertSoundFiles(soundDescriptions, config);
}

run()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(`An unexpected error occurred: ${e}`);
        process.exit(1);
    });