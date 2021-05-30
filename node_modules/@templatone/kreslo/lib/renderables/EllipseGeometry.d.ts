import { Geometry } from "./Geometry.js";
import type { IClonable } from "../core/IClonable.js";
export declare class EllipseGeometry extends Geometry implements IClonable<EllipseGeometry> {
    width: number;
    height: number;
    constructor(width: number, height: number);
    clone(): EllipseGeometry;
}
