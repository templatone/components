import { Transform } from "../properties/Transform.js";
import type { IBoundingBox } from "./IBoundingBox.js";
import type { IObject } from "./IObject.js";
import type { IRenderable } from "./IRenderable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
import type { IVisible } from "./IVisible.js";
import type { Shadow } from "../properties/Shadow.js";
/** @deprecated */
export declare class ImageSliceObject implements IObject, IRenderable, IVisible {
    readonly source: HTMLImageElement;
    readonly width: number;
    readonly height: number;
    sliceX: number;
    sliceY: number;
    sliceWidth: number;
    sliceHeight: number;
    transform: Transform;
    shadow: Shadow | null;
    opacity: number;
    constructor(source: HTMLImageElement, sliceX: number, sliceY: number, sliceWidth: number, sliceHeight: number);
    getBoundingBox(renderingLayer: IRenderingLayer): IBoundingBox;
    render(renderingLayer: IRenderingLayer): void;
    renderGizmo(renderingLayer: IRenderingLayer): void;
    getImageElement(): HTMLImageElement;
}
