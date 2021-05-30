import { Style, EntryStyleType } from "../styles/Style.js";
import type { IBoundingBox } from "../renderables/IBoundingBox.js";
import type { IClonable } from "../core/IClonable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
export declare class Stroke extends Style implements IClonable<Stroke> {
    lineWidth: number;
    lineJoin: CanvasLineJoin;
    lineCap: CanvasLineCap;
    lineDashOffset: number;
    miterLimit: number;
    constructor(style?: EntryStyleType, lineWidth?: number, lineJoin?: CanvasLineJoin, lineCap?: CanvasLineCap, lineDashOffset?: number, miterLimit?: number);
    apply(renderingLayer: IRenderingLayer, boundingBox: IBoundingBox): void;
    clone(): Stroke;
    static clear(renderingLayer: IRenderingLayer): void;
}
