import { Geometry } from "./Geometry.js";
import type { BezierPoint } from "../units/BezierPoint.js";
export declare class BezierGeometry extends Geometry {
    points: BezierPoint[];
    constructor(...points: BezierPoint[]);
}
