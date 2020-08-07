const childProcess = require('child_process');
const {Stopwatch} = require("./time");

type Command = ReturnType<typeof Command>;

export function Command(name: string, ...args: string[])
{
    return {
        name,
        args
    };
}

let executeCount = 0;

export function execute(command: Command)
{
    return new Promise<void>((resolve, reject) => {
        const stopwatch = new Stopwatch();
        const executeName = `PROC ${++executeCount}`;

        console.log(`${executeName}: > ${command.name} ${command.args.join(" ")}`);
        const process = childProcess.spawn(command.name, command.args);

        let stderr = "";

        process.stderr.setEncoding('utf8');
        process.stderr.on('data', data => {
            stderr += data;
        });

        process.on('close', exitCode => {
            if (exitCode)
            {
                console.error(`${executeName}: ...errored with Code(${exitCode}) after ${stopwatch.elapsedMillisecondsText}`);
                reject(new Error(`sox returned nonzero exit code: ${exitCode}. stderr: ${stderr}`));
                return;
            }

            console.log(`${executeName}: ...completed in ${stopwatch.elapsedMillisecondsText}`);
            resolve();
        });
    });
}