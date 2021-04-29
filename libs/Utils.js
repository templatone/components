export class Utils {
    // TODO: rename
    static async getImageFormFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', async () => {
                const img = new Image();
                img.addEventListener('load', () => {
                    resolve(img);
                }, { once: true });
                img.src = reader.result;
            }, { once: true });
            reader.readAsDataURL(file);
        });
    }
    static async getImageByPath(url) {
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
    static async loadImage(img) {
        return new Promise((resolve, reject) => {
            img.addEventListener('load', () => {
                resolve(img);
            }, { once: true });
        });
    }
}
