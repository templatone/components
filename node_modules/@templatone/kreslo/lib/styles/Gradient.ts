import { IBoundingBox } from "../renderables/IBoundingBox.js";
import { IColorRGBA } from "./Color.js";
import { IRenderingLayer } from "../core/RenderingLayer.js";
import { IStyle } from "./Style.js";
import { Vector } from "../units/Vector.js";


export abstract class Gradient implements IGradient, IStyle {
    start: Vector;
    end: Vector;

    steps: IGradientStep[] = [];

    constructor(start: Vector, end: Vector, steps: IGradientStep[]) {
        this.start = start;
        this.end = end;
        this.steps = steps;
    }


    computeStyle(renderingLayer: IRenderingLayer, boundingBox: IBoundingBox): string | CanvasGradient | CanvasPattern {
        throw new Error("Mehod `getStyle` is not implemented.");
    }
}


export interface IGradient {
    start: Vector;
    end: Vector;

    steps: IGradientStep[];
}


export interface IGradientStep {
    offset: number,
    color: IColorRGBA,
}