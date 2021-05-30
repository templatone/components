import WebFont from "./web-modules/pkg/webfontloader.js";
export class WebFonts {
  static async load(config) {
    return await new Promise((resolve, reject) => {
      const userActive = config.active ? config.active : () => {
      };
      const userInactive = config.inactive ? config.inactive : () => {
      };
      config.events = true;
      config.active = () => {
        userActive();
        resolve();
      };
      config.inactive = () => {
        userInactive();
        reject();
      };
      WebFont.load(config);
    });
  }
  static _getFvd(style = "normal", weight = 400) {
    const _style = ((v) => {
      switch (v) {
        case "normal":
          return "n";
        case "italic":
          return "i";
        case "oblique":
          return "o";
      }
    })(style);
    const _weight = ((v) => {
      if (typeof v == "string") {
        switch (v) {
          case "normal":
            return "4";
          case "bold":
            return "7";
        }
      } else {
        return (v / 100).toFixed(0);
      }
    })(weight);
    return `${_style}${_weight}`;
  }
  static computeFamilyQuery(name, variations = [{}]) {
    const fvds = variations.map((v) => this._getFvd(v.style, v.weight));
    return `${name}:${fvds.join(",")}`;
  }
  static convertFacesToFamilies(descriptions) {
    const variationDescription = [...descriptions].reduce((results, v) => {
      let face = results.find((x) => x.family.toLowerCase() === v.family.toLowerCase());
      if (face === void 0) {
        face = {
          family: v.family,
          path: v.path,
          variations: []
        };
        results.push(face);
      }
      face.variations.push({
        style: v.style ?? "normal",
        weight: v.weight ?? "normal"
      });
      return results;
    }, []);
    variationDescription.forEach((v) => v.variations.sort((a, b) => {
      const w = (w2) => {
        if (w2 === void 0)
          return 400;
        else if (w2 === "normal")
          return 400;
        else if (w2 === "bold")
          return 700;
        else
          return w2;
      };
      return w(a.weight) - w(b.weight);
    }));
    return variationDescription;
  }
}
