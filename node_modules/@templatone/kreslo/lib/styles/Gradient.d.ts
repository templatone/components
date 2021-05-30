import type { IBoundingBox } from "../renderables/IBoundingBox.js";
import type { IColorRGBA } from "./Color.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
import type { IStyle } from "./Style.js";
import type { Vector } from "../units/Vector.js";
export declare abstract class Gradient implements IGradient, IStyle {
    start: Vector;
    end: Vector;
    steps: IGradientStep[];
    constructor(start: Vector, end: Vector, steps: IGradientStep[]);
    computeStyle(renderingLayer: IRenderingLayer, boundingBox: IBoundingBox): string | CanvasGradient | CanvasPattern;
}
export interface IGradient {
    start: Vector;
    end: Vector;
    steps: IGradientStep[];
}
export interface IGradientStep {
    offset: number;
    color: IColorRGBA;
}
