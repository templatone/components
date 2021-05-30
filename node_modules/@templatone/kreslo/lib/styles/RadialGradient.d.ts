import { Gradient } from "./Gradient.js";
import type { IBoundingBox } from "../renderables/IBoundingBox.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
export declare class RadialGradient extends Gradient {
    computeStyle(renderingLayer: IRenderingLayer, boundingBox: IBoundingBox): CanvasGradient;
}
