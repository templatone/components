import { Transform } from "../properties/Transform.js";
import type { IBoundingBox } from "./IBoundingBox.js";
import type { IClonable } from "../core/IClonable.js";
import type { IObject } from "./IObject.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
export declare class NullObject implements IObject, IClonable<NullObject> {
    transform: Transform;
    constructor();
    getBoundingBox(renderingLayer: IRenderingLayer): IBoundingBox;
    render(renderingLayer: IRenderingLayer): void;
    renderGizmos(renderingLayer: IRenderingLayer): void;
    clone(): NullObject;
}
