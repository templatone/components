import type { ILoopUpdateCallback } from "./Loop.js";
export interface ITimelineUpdateCallback {
    (frames: number): void;
}
export declare class Timeline {
    readonly fps: number;
    private _frames;
    get frames(): number;
    private _updateCallbacks;
    constructor(fps: number);
    addUpdateCallback(callback: ITimelineUpdateCallback): void;
    removeUpdateCallback(callback: ITimelineUpdateCallback): void;
    update: ITimelineUpdateCallback;
    playByLoop: ILoopUpdateCallback;
    rewind(frames?: number): void;
    forward(frames?: number): void;
}
