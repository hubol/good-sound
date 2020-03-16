const childProcess = require('child_process');

function Command(name, ...args)
{
    return {
        name,
        args
    };
}

let executeCount = 0;

function execute(command)
{
    return new Promise((resolve, reject) => {
        const startMilliseconds = new Date().getTime();
        const executeName = `PROC ${++executeCount}`;

        console.log(`${executeName}: > ${command.name} ${command.args.join(" ")}`);
        const process = childProcess.spawn(command.name, command.args);

        let stderr = "";

        process.stderr.setEncoding('utf8');
        process.stderr.on('data', data => {
            stderr += data;
        });

        process.on('close', exitCode => {
            const timeText = `${new Date().getTime() - startMilliseconds}ms`;

            if (exitCode)
            {
                console.error(`${executeName}: ...errored with Code(${exitCode}) after ${timeText}`);
                reject(new Error(`sox returned nonzero exit code: ${exitCode}. stderr: ${stderr}`));
                return;
            }

            console.log(`${executeName}: ...completed in ${timeText}`);
            resolve();
        });
    });
}

module.exports = { Command, execute };