import { Geometry } from "./Geometry.js";
import { IVector, Vector } from "../units/Vector.js";
import type { IClonable } from "../core/IClonable.js";
export declare type MultipleRadiusInitType = [radius: number | IVector] | [radius: number | IVector] | [topLeftBottomRightRadius: number | IVector, topRightBottomLeftRadius: number | IVector] | [topLeftRadius: number | IVector, topRightBottomLeftRadius: number | IVector, bottomRightRadius: number | IVector] | [topLeftRadius: number | IVector, topRightRadius: number | IVector, bottomRightRadius: number | IVector, bottomLeftRadius: number | IVector];
export declare type SingleRadiusInitType = [radius: number | IVector] | [radiusX: number, radiusY: number];
export declare class RoundedRectangleGeometry extends Geometry implements IClonable<RoundedRectangleGeometry> {
    width: number;
    height: number;
    topLeftRadius: Vector;
    topRightRadius: Vector;
    bottomLeftRadius: Vector;
    bottomRightRadius: Vector;
    constructor(width: number, height: number, ...radius: MultipleRadiusInitType);
    setRadius(...radius: MultipleRadiusInitType): void;
    setTopLeftRadius(...values: SingleRadiusInitType): void;
    setTopRightRadius(...values: SingleRadiusInitType): void;
    setBottomRightRadius(...values: SingleRadiusInitType): void;
    setBottomLeftRadius(...values: SingleRadiusInitType): void;
    private static _parseRadiusValue;
    clone(): RoundedRectangleGeometry;
}
