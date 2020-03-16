const path = require("path");

const args = process.argv.slice(2);

const soundSourceDirectoryPath = path.resolve(args[0]);
const soundDestDirectoryPath = path.resolve(args[1]);
const definitionDestFilePath = path.resolve(args[2]);
const runImmediately = args.filter(x => x === "--build").length > 0;

const config = {
    soundSourceDirectoryPath,
    soundDestDirectoryPath,
    definitionDestFilePath,
    runImmediately
};

module.exports = { config };