import { RenderingLayer } from "../core/RenderingLayer.js";
import type { IRenderable } from "../renderables/IRenderable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
export declare class LayerBlender implements IRenderable {
    readonly upperLayer: RenderingLayer;
    readonly lowerLayer: RenderingLayer;
    private _resultLayer;
    readonly compositeOperation: CompositeOperation;
    constructor(width: number, height: number, compositeOperation: CompositeOperation);
    render(renderingLayer: IRenderingLayer): void;
    clear(): void;
}
export declare const enum CompositeOperation {
    Color = "color",
    ColorBurn = "color-burn",
    ColorDodge = "color-dodge",
    Copy = "copy",
    Darken = "darken",
    DestinationAtop = "destination-atop",
    DestinationIn = "destination-in",
    DestinationOut = "destination-out",
    DestinationOver = "destination-over",
    Difference = "difference",
    Exclusion = "exclusion",
    HardLight = "hard-light",
    Hue = "hue",
    Lighten = "lighten",
    Lighter = "lighter",
    Luminosity = "luminosity",
    Multiply = "multiply",
    Overlay = "overlay",
    Saturation = "saturation",
    Screen = "screen",
    SoftLight = "soft-light",
    SourceAtop = "source-atop",
    SourceIn = "source-in",
    SourceOut = "source-out",
    SourceOver = "source-over",
    XOR = "xor"
}
