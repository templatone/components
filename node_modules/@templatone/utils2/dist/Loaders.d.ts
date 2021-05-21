export declare class Loaders {
    static getImageFormFile(file: File): Promise<HTMLImageElement>;
    static getImageByPath(path: string): Promise<HTMLImageElement>;
    static waitToImageLoad(img: HTMLImageElement): Promise<HTMLImageElement>;
}
