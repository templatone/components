import type { IRenderable } from "../renderables/IRenderable.js";
import type { RenderingLayer, IRenderingLayer } from "../core/RenderingLayer.js";
export declare class TrackAlpha implements IRenderable {
    private _layerBlender;
    get matteLayer(): RenderingLayer;
    get sourceLayer(): RenderingLayer;
    constructor(width: number, height: number, inverted?: boolean);
    render(renderingLayer: IRenderingLayer): void;
    clear(): void;
}
