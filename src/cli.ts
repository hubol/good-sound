#!/usr/bin/env node

import fs from "fs";
import {config} from "./config";
import {toSoundDescription} from "./mapper";
import {writeTypescriptFile} from "./typeWriter";
import {convertSoundFiles} from "./converter";
import {main, Scan, scanDirectory, ScanDirectoryArgs} from "pissant-node";

const scanDirectoryArgs: ScanDirectoryArgs = {
    path: config.soundSourceDirectoryPath,
    scanConsumer: consumeScan,
    foreverArgs: !config.runImmediately ? { checkFileContents: true, intervalMilliseconds: 8_000 } : undefined
};

async function consumeScan(scan: Scan)
{
    const derivedFiles = await Promise.all(scan.files.map(async x => {
        return {
            ...await toSoundDescription(x.path, config),
            ...x,
        }
    }));

    writeTypescriptFile(derivedFiles, config);
    await convertSoundFiles(
        derivedFiles,
        config,
        x =>
            config.runImmediately || !(x.changedOrAdded && fs.existsSync(x.oggFilePath) && fs.existsSync(x.mp3FilePath)));
}

main(scanDirectory(scanDirectoryArgs));