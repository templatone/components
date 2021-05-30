import type { IAnimation } from "./IAnimation.js";
import type { ITimelineUpdateCallback } from "./Timeline.js";
export declare class TimelineAnimation implements IAnimation<ITimelineUpdateCallback> {
    private _callback;
    duration: number;
    delay: number;
    looping: boolean;
    private _frames;
    get frames(): number;
    constructor(callback: ITimelineUpdateCallback, duration: number, delay: number, looping: boolean);
    isFirstIteration(): boolean;
    isLastIteration(): boolean;
    getNumberOfCycles(): number;
    update: ITimelineUpdateCallback;
    static convertGlobalFramesToLocal(frames: number, duration: number, delay: number, looping: boolean): number;
}
