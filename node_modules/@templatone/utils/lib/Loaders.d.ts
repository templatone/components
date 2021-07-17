/**
 * @deprecated Use class `Images`, `Files` or`Blobs`.
 */
export declare class Loaders {
    /**
     * @deprecated Use 'Images.getFormFile'.
     */
    static getImageFormFile(file: File): Promise<HTMLImageElement>;
    /**
     * @deprecated Use 'Images.getFromUrl'.
     */
    static getImageByPath(path: string): Promise<HTMLImageElement>;
    /**
     * @deprecated Use 'Images.waitToLoad'.
     */
    static waitToImageLoad(img: HTMLImageElement): Promise<HTMLImageElement>;
}
