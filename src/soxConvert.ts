import {command, execute} from "pissant-node";

export function convertToMp3(sourceFileName: string, destFileName: string)
{
    if (!destFileName.endsWith(".mp3"))
        throw new Error(`destination file name: ${destFileName} does not end with .mp3!`);

    return execute(command("sox", sourceFileName, destFileName));
}

export function convertToOgg(sourceFileName: string, destFileName: string)
{
    if (!destFileName.endsWith(".ogg"))
        throw new Error(`destination file name: ${destFileName} does not end with .ogg!`);

    return execute(command("sox", sourceFileName, destFileName));
}