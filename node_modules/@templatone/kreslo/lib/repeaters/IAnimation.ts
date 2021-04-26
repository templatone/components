export { LoopAnimation } from "./LoopAnimation.js";
export { TimelineAnimation } from "./TimelineAnimation.js";


export interface IAnimation<TCallback> {

    duration: number,
    delay: number,
    looping: boolean,

    update: TCallback,

    isFirstIteration(): boolean,
    isLastIteration(): boolean,

    getNumberOfCycles(): number,
}