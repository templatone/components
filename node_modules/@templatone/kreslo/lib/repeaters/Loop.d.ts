export interface ILoopUpdateCallback {
    /**
     * @param time Number of milliseconds elapsed.
     * @param delta Time in milliseconds since the previous frame.
     */
    (time: number, delta: number): void;
}
export declare class Loop extends EventTarget {
    private _time;
    get time(): number;
    private _startTimestamp;
    private _previousTimestamp;
    private _isRunningToggle;
    private _updateCallbacks;
    addUpdateCallback(callback: ILoopUpdateCallback): void;
    removeUpdateCallback(callback: ILoopUpdateCallback): void;
    isRunning(): boolean;
    start(): void;
    stop(): void;
    update(time: number, delta: number): void;
    private _frame;
}
export declare class StartLoopEvent extends CustomEvent<{}> {
    static arg: 'start';
    constructor();
}
export declare class StopLoopEvent extends CustomEvent<{}> {
    static arg: 'stop';
    constructor();
}
