import { EllipseGeometry } from "./EllipseGeometry.js";
import { Fill } from "../properties/Fill.js";
import { IClonable } from "../core/IClonable.js";
import { IRenderable } from "./IRenderable.js";
import { IRenderingLayer } from "../core/RenderingLayer.js";
import { IShape } from "./IShape.js";
import { Shadow } from "../properties/Shadow.js";
import { Shape } from "./Shape.js";
import { Stroke } from "../properties/Stroke.js";


export class EllipseShape extends EllipseGeometry implements IRenderable, IShape, IClonable<EllipseShape> {

    fill: Fill | null = null;
    stroke: Stroke | null = null;
    shadow: Shadow | null = null;

    opacity: number = 1;

    constructor(width: number, height: number) {
        super(width, height);
    }


    render(renderingLayer: IRenderingLayer) {
        Shape.renderObject(renderingLayer, this, this, this);
    }


    renderGizmo(renderingLayer: IRenderingLayer) {
        Shape.renderGizmo(renderingLayer, this);
    }


    clone(): EllipseShape {
        const ellipse = new EllipseShape(this.width, this.height);

        ellipse.fill = this.fill?.clone() ?? null;
        ellipse.stroke = this.stroke?.clone() ?? null;
        ellipse.shadow = this.shadow?.clone() ?? null;
        ellipse.opacity = this.opacity;

        return ellipse;
    }

}