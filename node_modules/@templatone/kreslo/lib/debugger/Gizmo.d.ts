import type { IRenderingLayer } from "../core/RenderingLayer.js";
import type { IVector } from "../units/Vector.js";
export declare class Gizmo {
    static nullColor: string;
    static shapeColor: string;
    static mediaColor: string;
    static textColor: string;
    static origin(renderingLayer: IRenderingLayer, position: IVector, color?: string): void;
}
