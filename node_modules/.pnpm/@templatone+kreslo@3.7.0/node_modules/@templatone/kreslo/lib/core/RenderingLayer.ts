import { Transform } from "../properties/Transform.js";


export class RenderingLayer implements IRenderingLayer {

    static readonly DEFAULT_UPDATESIZE_CALLBACK = (canvas: HTMLCanvasElement, width: number, height: number, pixelScale: number): void => {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
    }

    static get PIXELSCALE(): number { return window.devicePixelRatio; }

    private _pixelScale: number = 1;
    get pixelScale(): number { return this._pixelScale; }

    // private _updateStyleSizeCallback: UpdateStyleSizeCallback | null = RenderingLayer.DEFAULT_UPDATESIZE_CALLBACK;
    private _updateStyleSizeCallback: UpdateStyleSizeCallback | null = null;

    private _width: number = 0;
    private _height: number = 0;
    get width(): number { return this._width; }
    get height(): number { return this._height; }

    private _canvas: HTMLCanvasElement;
    private _renderingContext!: CanvasRenderingContext2D;

    gizmoVisibility: boolean = false;
    gizmoScale: number = 1;


    constructor(canvas: HTMLCanvasElement, width: number, height: number, pixelScale: number = 1, updateStyleSizeCallback: UpdateStyleSizeCallback | null = RenderingLayer.DEFAULT_UPDATESIZE_CALLBACK) {
        this._canvas = canvas;

        this.updateSize(width, height, pixelScale, updateStyleSizeCallback);
    }


    /**
     * 
     * @param width Width of canvas.
     * @param height Height of canvas.
     * @param pixelScale Resolution scale for retina stuff. If `undefined`, will used value from last time.
     * @param updateStyleSize If it is `true`, the style will be set by the callback `updateStyleSizeCallback`. If `undefined`, will used value from last time.

     */
    updateSize(width: number, height: number, pixelScale?: number, updateStyleSizeCallback?: UpdateStyleSizeCallback | null) {
        if (pixelScale !== undefined) this._pixelScale = Math.max(pixelScale, 0);

        this._width = Math.max(width, 0);
        this._height = Math.max(height, 0);

        this._canvas.width = this._width * this._pixelScale;
        this._canvas.height = this._height * this._pixelScale;

        if (updateStyleSizeCallback !== undefined) {
            this._updateStyleSizeCallback = updateStyleSizeCallback;
        }

        if (this._updateStyleSizeCallback !== null) {
            this._updateStyleSizeCallback(this._canvas, this._width, this._height, this._pixelScale);
        }

        this._renderingContext = this._canvas.getContext('2d', {
            willReadFrequently: true
        })! as CanvasRenderingContext2D;
    }


    clear() {
        const pxs = this.pixelScale;

        this.resetMatrix();
        this._renderingContext.clearRect(0, 0, this.width * pxs, this.height * pxs);
    }


    getRenderingContext(): CanvasRenderingContext2D {
        return this._renderingContext;
    }


    resetRenderingContext() {
        this._renderingContext = this._canvas.getContext('2d')!;
    }


    setImageSmoothing(toggle: boolean) {
        const ctx = this.getRenderingContext();

        (ctx as any).msImageSmoothingEnabled = toggle;
        (ctx as any).mozImageSmoothingEnabled = toggle;
        (ctx as any).webkitImageSmoothingEnabled = toggle;
        ctx.imageSmoothingEnabled = toggle;
    }


    getCanvas(): HTMLCanvasElement {
        return this._canvas;
    }


    setMatrixToTransform(transform: Transform) {
        this.resetMatrix();

        const pxs = this.pixelScale;
        const path: Transform[] = [];

        let t: Transform = transform;
        path.unshift(t);

        while (t.hasParent()) {
            t = t.getParent();
            path.unshift(t);
        }

        path.forEach(t => {
            this._renderingContext.translate(t.position.x * pxs, t.position.y * pxs);
            this._renderingContext.rotate(t.rotation.radians);
            this._renderingContext.scale(t.scale.x, t.scale.y);
        });
    }


    resetMatrix() {
        this._renderingContext.resetTransform();
    }
}


export interface IRenderingLayer {
    readonly pixelScale: number;
    readonly width: number;
    readonly height: number;

    gizmoVisibility: boolean;
    gizmoScale: number;

    updateSize(width: number, height: number, pixelScale: number): void;

    clear(): void;

    getRenderingContext(): CanvasRenderingContext2D;
    resetRenderingContext(): void;

    setImageSmoothing(toggle: boolean): void;

    getCanvas(): HTMLCanvasElement;

    setMatrixToTransform(transform: Transform): void;
    resetMatrix(): void;
}


export type UpdateStyleSizeCallback = {
    (canvas: HTMLCanvasElement, width: number, height: number, pixelScale: number): void;
};