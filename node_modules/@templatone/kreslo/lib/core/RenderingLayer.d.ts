import type { Transform } from "../properties/Transform.js";
export declare class RenderingLayer implements IRenderingLayer {
    static readonly DEFAULT_UPDATESIZE_CALLBACK: (canvas: HTMLCanvasElement, width: number, height: number, pixelScale: number) => void;
    static get PIXELSCALE(): number;
    private _pixelScale;
    get pixelScale(): number;
    private _updateStyleSizeCallback;
    private _width;
    private _height;
    get width(): number;
    get height(): number;
    private _canvas;
    private _renderingContext;
    gizmoVisibility: boolean;
    gizmoScale: number;
    constructor(canvas: HTMLCanvasElement, width: number, height: number, pixelScale?: number, updateStyleSizeCallback?: UpdateStyleSizeCallbackType | null);
    /**
     *
     * @param width Width of canvas.
     * @param height Height of canvas.
     * @param pixelScale Resolution scale for retina stuff. If `undefined`, will used value from last time.
     * @param updateStyleSize If it is `true`, the style will be set by the callback `updateStyleSizeCallback`. If `undefined`, will used value from last time.

     */
    updateSize(width: number, height: number, pixelScale?: number, updateStyleSizeCallback?: UpdateStyleSizeCallbackType | null): void;
    clear(): void;
    getRenderingContext(): CanvasRenderingContext2D;
    resetRenderingContext(): void;
    setImageSmoothing(toggle: boolean): void;
    getCanvas(): HTMLCanvasElement;
    setMatrixToTransform(transform: Transform): void;
    resetMatrix(): void;
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
export declare type UpdateStyleSizeCallbackType = {
    (canvas: HTMLCanvasElement, width: number, height: number, pixelScale: number): void;
};
