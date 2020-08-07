import path from "path";

const args = process.argv.slice(2);

const soundSourceDirectoryPath = path.resolve(args[0]);
const soundDestDirectoryPath = path.resolve(args[1]);
const definitionDestFilePath = path.resolve(args[2]);
const runImmediately = args.filter(x => x === "--build").length > 0;
const dontPreload = args.filter(x => x.toLowerCase() === "--dontpreload").length > 0;

export const config = {
    soundSourceDirectoryPath,
    soundDestDirectoryPath,
    definitionDestFilePath,
    runImmediately,
    dontPreload
};

export type Config = typeof config;