export class Utils {

    // TODO: rename
    static async getImageFormFile(file: File): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener('load', async () => {
                const img = new Image();

                img.addEventListener('load', () => {
                    resolve(img);
                }, { once: true});

                img.src = reader.result as string;
            
            }, { once: true });

            reader.readAsDataURL(file);
        });
    }


    static async getImageByPath(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.addEventListener('load', () => {
                resolve(img);
            }, { once: true });

            img.addEventListener('error', () => {
                reject(`Image „${url}“ cannot be loaded.`);
            }, { once: true });

            img.src = url;
        });
    }


    static async loadImage(img: HTMLImageElement): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            img.addEventListener('load', () => {
                resolve(img);
            }, { once: true });
        });
    }
}