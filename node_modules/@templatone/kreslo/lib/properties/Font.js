export class Font {
  constructor(size = 12, family = "sans-serif") {
    this.weight = 400;
    this.italic = false;
    this.letterSpacing = 0;
    this.features = [];
    this.align = "left";
    this.baseline = "alphabetic";
    this.size = size;
    this.lineHeight = this.size * 1.5;
    this.family = family;
  }
  apply(renderingLayer) {
    const ctx = renderingLayer.getRenderingContext();
    const pxs = renderingLayer.pixelScale;
    const canvas = renderingLayer.getCanvas();
    canvas.style.letterSpacing = `${this.letterSpacing}em`;
    canvas.style.fontFeatureSettings = this.features.length > 0 ? this.features.map((f) => `"${f}"`).join(", ") : "initial";
    const fontSize = this.size * pxs;
    const font = [
      this.weight.toFixed(0),
      `${fontSize.toFixed(0)}px`,
      this.italic ? "italic" : "",
      this.family
    ].join(" ");
    ctx.font = font;
    ctx.textAlign = this.align;
  }
  clone() {
    const f = new Font();
    f.size = this.size;
    f.family = this.family;
    f.size = this.size;
    f.weight = this.weight;
    f.italic = this.italic;
    f.lineHeight = this.lineHeight;
    f.letterSpacing = this.letterSpacing;
    f.features = this.features;
    f.align = this.align;
    f.baseline = this.baseline;
    return f;
  }
  static clear(renderingLayer) {
    const canvas = renderingLayer.getCanvas();
    canvas.style.letterSpacing = `0em`;
    canvas.style.fontFeatureSettings = "initial";
    const ctx = renderingLayer.getRenderingContext();
    ctx.font = "10px sans-serif";
  }
}
export var FontFeatures;
(function(FontFeatures2) {
  FontFeatures2["StandardLigatures"] = "liga";
  FontFeatures2["ContextualAlternates"] = "calt";
  FontFeatures2["DiscretionaryLigatures"] = "dlig";
  FontFeatures2["SmallSaps"] = "smcp";
  FontFeatures2["CapitalsToSmallCaps"] = "c2sc";
  FontFeatures2["Swashes"] = "swsh";
  FontFeatures2["StylisticAlternates"] = "salt";
  FontFeatures2["LiningFigures"] = "lnum";
  FontFeatures2["OldstyleFigures"] = "onum";
  FontFeatures2["ProportionalFigures"] = "pnum";
  FontFeatures2["TabularFigures"] = "tnum";
  FontFeatures2["Fractions"] = "frac";
  FontFeatures2["Ordinals"] = "ordn";
  FontFeatures2["ProportionalWidths"] = "pwid";
  FontFeatures2["ProportionalAlternateWidths"] = "palt";
  FontFeatures2["ProportionalKana"] = "pkna";
  FontFeatures2["FullWidths"] = "fwid";
  FontFeatures2["HalfWidths"] = "hwid";
  FontFeatures2["AlternateHalfWidths"] = "halt";
  FontFeatures2["ThirdWidths"] = "twid";
  FontFeatures2["QuarterWidths"] = "qwid";
  FontFeatures2["JIS78Forms"] = "jp78";
  FontFeatures2["JIS83Forms"] = "jp83";
  FontFeatures2["JIS90Forms"] = "jp90";
  FontFeatures2["JIS2004Forms"] = "jp04";
  FontFeatures2["TraditionalForms"] = "trad";
  FontFeatures2["RubyNotationForms"] = "ruby";
  FontFeatures2["HorizontalKanaAlternates"] = "hkna";
  FontFeatures2["NLCKanjiForms"] = "nlck";
  FontFeatures2["AlternateAnnotationForms"] = "nalt";
  FontFeatures2["Italics"] = "ital";
  FontFeatures2["VerticalKerning"] = "vkrn";
  FontFeatures2["VerticalAlternates"] = "vert";
  FontFeatures2["ProportionalAlternateVerticalMetrics"] = "vpal";
  FontFeatures2["AlternateVerticalHalfMetrics"] = "vhal";
  FontFeatures2["VerticalKanaAlternates"] = "vkna";
  FontFeatures2["Kerning"] = "kern";
  FontFeatures2["GlyphComposition"] = "ccmp";
  FontFeatures2["LocalizedForms"] = "locl";
  FontFeatures2["Superscript"] = "sups";
  FontFeatures2["Subscript"] = "subs";
})(FontFeatures || (FontFeatures = {}));
