function sleep(milliseconds)
{
    return new Promise(resolve => {
        setTimeout(() => resolve(), milliseconds);
    })
}

class Stopwatch
{
    constructor() {
        this.startedMilliseconds = new Date().getTime();
    }

    get elapsedMilliseconds()
    {
        return new Date().getTime() - this.startedMilliseconds;
    }

    get elapsedMillisecondsText()
    {
        return `${this.elapsedMilliseconds}ms`;
    }
}

module.exports = { sleep, Stopwatch };