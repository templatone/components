export class Images {
  static async getFormFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", async () => {
        const img = new Image();
        img.addEventListener("load", () => {
          resolve(img);
        }, {once: true});
        img.src = reader.result;
      }, {once: true});
      reader.readAsDataURL(file);
    });
  }
  static async getByPath(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => {
        resolve(img);
      }, {once: true});
      img.addEventListener("error", () => {
        reject(`Image „${url}“ cannot be loaded.`);
      }, {once: true});
      img.src = url;
    });
  }
}
