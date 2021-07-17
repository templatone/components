export class Images {
  static async getFormFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", async () => {
        const image = new Image();
        image.addEventListener("load", () => {
          resolve(image);
        }, {once: true});
        image.src = reader.result;
      }, {once: true});
      reader.readAsDataURL(file);
    });
  }
  static async getByPath(url) {
    console.warn("'Loaders.getByPath' is deprecated. Use 'Images.getFromUrl'.");
    return Images.getFromUrl(url);
  }
  static async getFromUrl(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => {
        resolve(image);
      }, {once: true});
      image.addEventListener("error", () => {
        reject(`Image „${url}“ cannot be loaded.`);
      }, {once: true});
      image.src = url;
    });
  }
  static async waitToLoad(image) {
    return new Promise((resolve, reject) => {
      if (image.complete && image.naturalHeight !== 0) {
        resolve(image);
      } else {
        image.addEventListener("load", () => {
          resolve(image);
        }, {once: true});
      }
    });
  }
}
