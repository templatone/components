interface IVector {
    x: number;
    y: number;
}
export declare class Numbers {
    /**
     * Remapuje hodnotu na novou škálu
     * @param value Současná hodnota na remaping
     * @param min1 Současné minumunm
     * @param max1 Současné maximum
     * @param min2 Nové minimum
     * @param max2 Nové maximum
     */
    static remap(value: number, min1: number, max1: number, min2?: number, max2?: number): number;
    /**
     * „Ořízne“ číslo pokud není v zadaném rozsahu.
     * @param {number} value
     * @param {number} min
     * @param {number} max
     */
    static limit(value: number, min: number, max: number): number;
    /**
     * Vrátí náhodné číslo v daném rozsahu. <min, max)
     * @param min Minumum inkluzivně
     * @param max Maximum exkluzivně
     */
    static randomArbitrary(min?: number, max?: number): number;
    /**
     * Vrátí náhodné celé číslo v daném rozsahu. <min, max>
     * @param min Minumum inkluzivně
     * @param max Maximum inkluzivně
     */
    static randomInt(min?: number, max?: number): number;
    /**
     * Vrátí bod na křivce
     * @param t Procentuální průběh křivky <0, 1>
     * @param p1 Počáteční bod <0, 1>
     * @param p2 Koncový bod <0, 1>
     */
    static bezierCurve2(t: number, p1: IVector, p2: IVector): IVector;
    /**
     * Vrátí bod na křivce
     * @param t Procentuální průběh křivky <0, 1>
     * @param p1 Počáteční bod <0, 1>
     * @param p2 Společné táhlo <0, 1>
     * @param p3 Koncový bod <0, 1>
     */
    static bezierCurve3(t: number, p1: IVector, p2: IVector, p3: IVector): IVector;
    /**
     * Vrátí bod na křivce
     * @param t Procentuální průběh křivky <0, 1>
     * @param p1 Počáteční bod <0, 1>
     * @param p2 Táhlo počáteční bodu <0, 1>
     * @param p3 Táhlo koncového bodu <0, 1>
     * @param p4 Koncový bod <0, 1>
     */
    static bezierCurve4(t: number, p1: IVector, p2: IVector, p3: IVector, p4: IVector): IVector;
}
export {};
