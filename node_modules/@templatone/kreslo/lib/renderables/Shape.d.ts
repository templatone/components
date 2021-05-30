import { Fill } from "../properties/Fill.js";
import { Shadow } from "../properties/Shadow.js";
import { Stroke } from "../properties/Stroke.js";
import { Transform } from "../properties/Transform.js";
import type { GetBoundingBoxCallbackType, IShape } from "./IShape.js";
import type { IGeometry } from "./IGeometry.js";
import type { IRenderable } from "./IRenderable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
export declare class Shape {
    geometry: IGeometry;
    private _getBoundingBox;
    transform: Transform;
    fill: Fill | null;
    stroke: Stroke | null;
    shadow: Shadow | null;
    opacity: number;
    constructor(geometry: IGeometry, getBoundingBox: GetBoundingBoxCallbackType);
    render(renderingLayer: IRenderingLayer): void;
    renderGizmo(renderingLayer: IRenderingLayer): void;
    getBoundingBox(renderingLayer: IRenderingLayer): import("./IBoundingBox.js").IBoundingBox;
    static applyStyles(renderingLayer: IRenderingLayer, shape: IShape): void;
    static renderObject(renderingLayer: IRenderingLayer, geometry: IGeometry, renderable: IRenderable, shape: IShape): void;
    static renderGizmo(renderingLayer: IRenderingLayer, geometry: IGeometry): void;
}
