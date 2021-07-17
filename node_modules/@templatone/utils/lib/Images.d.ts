export declare class Images {
    static getFormFile(file: File): Promise<HTMLImageElement>;
    static getByPath(url: string): Promise<HTMLImageElement>;
    static getFromUrl(url: string): Promise<HTMLImageElement>;
    static waitToLoad(image: HTMLImageElement): Promise<HTMLImageElement>;
}
