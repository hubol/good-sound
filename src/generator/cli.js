#!/usr/bin/env node

const fs = require("fs");

const { getSoundDescriptions } = require("./mapper");
const { writeTypescriptFile } = require("./typeWriter");
const { convertSoundFiles } = require("./converter");
const { sleep } = require("./utils/time");

const { config } = require("./config");

async function run()
{
    if (config.runImmediately) {
        await runOnce();
        return;
    }

    const seenHashes = { };
    while (true)
    {
        await runOnce(x => {
            if (x.sourceFilePath in seenHashes
                && seenHashes[x.sourceFilePath] === x.hash
                && fs.existsSync(x.oggFilePath)
                && fs.existsSync(x.mp3FilePath))
                return false;

            seenHashes[x.sourceFilePath] = x.hash;
            return true;
        });

        await sleep(8 * 1000);
    }
}

async function runOnce(soundDescriptionPredicate)
{
    const soundDescriptions = await getSoundDescriptions(config);
    writeTypescriptFile(soundDescriptions, config);
    await convertSoundFiles(
        soundDescriptions,
        config,
        !soundDescriptionPredicate ? () => true : soundDescriptionPredicate);
}

run()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(`An unexpected error occurred: ${e}`);
        process.exit(1);
    });