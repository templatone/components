import { Loop } from "../repeaters/Loop.js";
import { RenderingLayer, UpdateStyleSizeCallbackType } from "./RenderingLayer.js";
export declare class Engine extends RenderingLayer {
    readonly loop: Loop;
    constructor(canvas: HTMLCanvasElement, width: number, height: number, pixelScale?: number, updateStyleSizeCallback?: UpdateStyleSizeCallbackType | null);
}
