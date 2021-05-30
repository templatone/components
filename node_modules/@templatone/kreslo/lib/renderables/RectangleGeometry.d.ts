import { Geometry } from "./Geometry.js";
import type { IClonable } from "../core/IClonable.js";
export declare class RectangleGeometry extends Geometry implements IClonable<RectangleGeometry> {
    width: number;
    height: number;
    constructor(width: number, height: number);
    clone(): RectangleGeometry;
}
