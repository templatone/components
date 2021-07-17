export class Loaders {
  static async getImageFormFile(file) {
    console.warn("'Loaders.getImageFormFile' is deprecated. Use 'Images.getFormFile'.");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const img = new Image();
      reader.addEventListener("load", async () => {
        img.src = reader.result;
        resolve(await Loaders.waitToImageLoad(img));
      }, false);
    });
  }
  static async getImageByPath(path) {
    console.warn("'Loaders.getImageByPath' is deprecated. Use 'Images.getFromUrl'.");
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.addEventListener("load", () => {
        resolve(img);
      });
      img.addEventListener("error", () => {
        reject(`Image „${path}“ cannot be loaded.`);
      });
    });
  }
  static async waitToImageLoad(img) {
    console.warn("'Loaders.waitToImageLoad' is deprecated. Use 'Images.waitToLoad'.");
    return new Promise((resolve, reject) => {
      const src = img.src;
      img.src = src;
      img.addEventListener("load", () => {
        resolve(img);
      });
    });
  }
}
