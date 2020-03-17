const fs = require('fs');
const path = require("path");

async function getFileHash(fileName)
{
    const fileSizeInBytes = await getFileSizeInBytes(fileName);
    if (fileSizeInBytes === 0)
        return "";

    let start = fileSizeInBytes / 2;
    const end = fileSizeInBytes - 1;
    if (start === end)
        start = 0;

    const length = Math.min(end - start, 1024);

    const buffer = await readBytesToBuffer(fileName, start, length);
    return buffer.toString("base64");
}

function readBytesToBuffer(fileName, start, length)
{
    if (start < 0)
        throw new Error(`Invalid start position: ${start}`);
    if (length <= 0)
        throw new Error(`Invalid length: ${length}`);

    return new Promise((resolve, reject) => {
        fs.open(fileName, "r", (err, fd) => {
            if (err) {
                reject(err);
                return;
            }

            const buffer = Buffer.alloc(length);
            fs.read(fd, buffer, 0, length, start, err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(buffer);
            });
        });
    });
}

function getFileSizeInBytes(fileName)
{
    return new Promise((resolve, reject) => {
        fs.stat(fileName, (err, stats) => {
           if (err) {
               reject(err);
               return;
           }

           resolve(stats.size);
        });
    });
}

function getAllFiles(dirPath, arrayOfFiles)
{
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory())
            arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        else
            arrayOfFiles.push(filePath);
    });

    return arrayOfFiles;
}

function getDirectory(filePath)
{
    return path.basename(path.dirname(filePath));
}

function createDirectory(directoryPath)
{
    fs.mkdirSync(directoryPath, { recursive: true });
}

function getRelativePath(sourcePath, destinationPath)
{
    const relativePath = path.relative(sourcePath, destinationPath);
    if (relativePath.charAt(0) !== ".")
        return "./" + relativePath;
    return relativePath;
}

module.exports = { getFileHash, getAllFiles, createDirectory, getDirectory, getRelativePath };