#!/usr/bin/env node

import fs from "fs";
import {config} from "./config";
import {sleep} from "./utils/time";
import {getSoundDescriptions} from "./mapper";
import {writeTypescriptFile} from "./typeWriter";
import {convertSoundFiles, SoundDescriptionPredicate} from "./converter";

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

async function runOnce(soundDescriptionPredicate: SoundDescriptionPredicate = () => true)
{
    const soundDescriptions = await getSoundDescriptions(config);
    writeTypescriptFile(soundDescriptions, config);
    await convertSoundFiles(
        soundDescriptions,
        config,
        soundDescriptionPredicate);
}

run()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(`An unexpected error occurred: ${e}`);
        process.exit(1);
    });