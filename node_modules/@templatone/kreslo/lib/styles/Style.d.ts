import type { IBoundingBox } from "../renderables/IBoundingBox.js";
import type { IClonable } from "../core/IClonable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
export interface IStyle {
    computeStyle: {
        (renderingLayer: IRenderingLayer, boundingBox: IBoundingBox): string | CanvasGradient | CanvasPattern;
    };
}
export declare class Style implements IStyle, IClonable<Style> {
    private _style;
    constructor(style: EntryStyleType);
    computeStyle(renderingLayer: IRenderingLayer, boundingBox: IBoundingBox): string | CanvasGradient | CanvasPattern;
    setStyle(style: EntryStyleType): void;
    getStyle(): IStyle;
    clone(): Style;
    private static _parseEntryType_Style;
}
export declare type EntryStyleType = IStyle | string | CanvasGradient | CanvasPattern;
