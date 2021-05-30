import { Angle, EntryAngleType } from "./Angle.js";
import type { IClonable } from "../core/IClonable.js";
export interface IVector {
    x: number;
    y: number;
}
export declare class Vector implements IVector, IClonable<Vector> {
    x: number;
    y: number;
    get length(): number;
    constructor(...values: EntryVectorType);
    set(...values: EntryVectorModifierType): Vector;
    add(...values: EntryVectorModifierType): Vector;
    subtract(...values: EntryVectorModifierType): Vector;
    multiple(...values: EntryVectorModifierType): Vector;
    divide(...values: EntryVectorModifierType): Vector;
    rotate(...values: EntryAngleType): Vector;
    /**
     * Normalize the Vector to length equal 1.
     * @returns {Vector} Same Vector object.
     */
    normalize(): Vector;
    /**
     * TODO: Add description
     * @returns {Vector} Same Vector object.
     */
    absolute(): Vector;
    /**
     * TODO: Add description
     */
    isEquals(vector: Vector): boolean;
    /**
     * Convert the Vector to Angle
     * @returns {Angle} New instance of Angle
     */
    getAngle(): Angle;
    /**
     * Clone the Vector without references
     * @returns {Vector} New instance of Vector
     */
    clone(): Vector;
    /**
     * Alias for `new Vector(0, 0);`
     * @returns {Vector} New instance of Vector
     */
    static get Zero(): Vector;
    /**
     * Alias for `new Vector(.5, .5);`
     * @returns {Vector} New instance of Vector
     */
    static get Half(): Vector;
    /**
     * Alias for `new Vector(1, 1);`
     * @returns {Vector} New instance of Vector
     */
    static get One(): Vector;
    /**
      * Alias for `new Vector(0, -1);`
      * @returns {Vector} New instance of Vector
      */
    static get Top(): Vector;
    /**
      * Alias for `new Vector(0, 1);`
      * @returns {Vector} New instance of Vector
      */
    static get Bottom(): Vector;
    /**
      * Alias for `new Vector(-1, 0);`
      * @returns {Vector} New instance of Vector
      */
    static get Left(): Vector;
    /**
      * Alias for `new Vector(1, 0);`
      * @returns {Vector} New instance of Vector
      */
    static get right(): Vector;
    static distance(vector1: IVector, vector2: IVector): number;
    private static _parseEntryType_Vector;
    private static _parseEntryType_VectorModifier;
}
export declare type EntryVectorType = [x: number, y: number] | [vector: IVector];
export declare type EntryVectorModifierType = EntryVectorType | [scalar: number];
