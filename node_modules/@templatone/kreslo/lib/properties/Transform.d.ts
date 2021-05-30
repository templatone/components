import { Angle } from "../units/Angle.js";
import { Vector } from "../units/Vector.js";
import type { IClonable } from "../core/IClonable.js";
export declare class Transform implements IClonable<Transform> {
    origin: Vector;
    position: Vector;
    scale: Vector;
    rotation: Angle;
    private _parent;
    constructor(position?: Vector, scale?: Vector, rotation?: Angle, origin?: Vector);
    getComputed(): Transform;
    /**
     * @param parent Transformace rodiče
     * @param updateLocals Pokud bude TRUE, změní transformace tak, aby po parentování opticky identická
     */
    setParent(parent: Transform, updateLocals?: boolean): void;
    clearParent(updateLocals?: boolean): void;
    hasParent(): boolean;
    getParent(): Transform;
    clone(): Transform;
}
