import { Shadow } from "../properties/Shadow.js";
import { Transform } from "../properties/Transform.js";
import type { IBoundingBox } from "./IBoundingBox.js";
import type { IClonable } from "../core/IClonable.js";
import type { IObject } from "./IObject.js";
import type { IRenderable } from "./IRenderable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
import type { IVisible } from "./IVisible.js";
import type { ValueModifierType } from "../types/valueModifier.js";
export declare class ImageObject implements IObject, IRenderable, IVisible, IClonable<ImageObject> {
    readonly source: HTMLImageElement;
    readonly width: number;
    readonly height: number;
    transform: Transform;
    shadow: Shadow | null;
    opacity: number;
    constructor(image: HTMLImageElement, width?: number | ValueModifierType<number>, height?: number | ValueModifierType<number>);
    getBoundingBox(renderingLayer: IRenderingLayer): IBoundingBox;
    render(renderingLayer: IRenderingLayer): void;
    renderGizmo(renderingLayer: IRenderingLayer): void;
    clone(): ImageObject;
}
