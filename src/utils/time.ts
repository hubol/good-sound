export function sleep(milliseconds)
{
    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), milliseconds);
    })
}

export class Stopwatch
{
    public readonly startedMilliseconds = new Date().getTime();

    get elapsedMilliseconds()
    {
        return new Date().getTime() - this.startedMilliseconds;
    }

    get elapsedMillisecondsText()
    {
        return `${this.elapsedMilliseconds}ms`;
    }
}