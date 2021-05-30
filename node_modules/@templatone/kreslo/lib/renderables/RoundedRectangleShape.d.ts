import { MultipleRadiusInitType, RoundedRectangleGeometry } from "./RoundedRectangleGeometry.js";
import type { Fill } from "../properties/Fill.js";
import type { IClonable } from "../core/IClonable.js";
import type { IRenderable } from "./IRenderable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
import type { IShape } from "./IShape.js";
import type { Shadow } from "../properties/Shadow.js";
import type { Stroke } from "../properties/Stroke.js";
export declare class RoundedRectangleShape extends RoundedRectangleGeometry implements IRenderable, IShape, IClonable<RoundedRectangleShape> {
    fill: Fill | null;
    stroke: Stroke | null;
    shadow: Shadow | null;
    opacity: number;
    constructor(width: number, height: number, ...radius: MultipleRadiusInitType);
    render(renderingLayer: IRenderingLayer): void;
    renderGizmo(renderingLayer: IRenderingLayer): void;
    clone(): RoundedRectangleShape;
}
