import type { IAnimation } from "./IAnimation.js";
import type { ILoopUpdateCallback } from "./Loop.js";
export declare class LoopAnimation implements IAnimation<ILoopUpdateCallback> {
    private _callback;
    duration: number;
    delay: number;
    looping: boolean;
    private _time;
    get time(): number;
    constructor(callback: ILoopUpdateCallback, duration: number, delay: number, looping: boolean);
    isFirstIteration(): boolean;
    isLastIteration(): boolean;
    getNumberOfCycles(): number;
    update: ILoopUpdateCallback;
    static convertGlobalMilisecondsToLocal(time: number, duration: number, delay: number, looping: boolean): number;
}
