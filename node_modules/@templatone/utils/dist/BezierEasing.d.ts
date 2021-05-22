interface IVector {
    x: number;
    y: number;
}
export declare class BezierEasing {
    static custom(t: number, p1: IVector, p2: IVector, p3: IVector, p4: IVector): number;
    static linear(t: number): number;
    static ease(t: number): number;
    static easeIn(t: number): number;
    static easeInOut(t: number): number;
    static easeOut(t: number): number;
    static easeInSine(t: number): number;
    static easeOutSine(t: number): number;
    static easeInOutSine(t: number): number;
    static easeInQuad(t: number): number;
    static easeOutQuad(t: number): number;
    static easeInOutQuad(t: number): number;
}
export {};
