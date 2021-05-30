import type { Fill } from "../properties/Fill.js";
import type { IBoundingBox } from "./IBoundingBox.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
import type { IVisible } from "./IVisible.js";
import type { Stroke } from "../properties/Stroke.js";
export interface IShape extends IVisible {
    fill: Fill | null;
    stroke: Stroke | null;
    getBoundingBox: GetBoundingBoxCallbackType;
}
export declare type GetBoundingBoxCallbackType = {
    (renderingLayer: IRenderingLayer): IBoundingBox;
};
