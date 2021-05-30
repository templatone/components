import { IVector, Vector } from "./Vector.js";
import type { IClonable } from "../core/IClonable.js";
export declare class BezierPoint extends Vector implements IClonable<BezierPoint> {
    startControl: Vector;
    endControl: Vector;
    constructor(position: IVector, startControl?: IVector, endControl?: IVector);
    toVector(): Vector;
    clone(): BezierPoint;
}
