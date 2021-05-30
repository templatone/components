import type { IClonable } from "../core/IClonable.js";
import type { IRenderingLayer } from "../core/RenderingLayer.js";
export declare class Font implements IClonable<Font> {
    family: string;
    size: number;
    weight: number;
    italic: boolean;
    lineHeight: number;
    letterSpacing: number;
    features: FontFeatures[];
    align: CanvasTextAlign;
    baseline: CanvasTextBaseline;
    constructor(size?: number, family?: string);
    apply(renderingLayer: IRenderingLayer): void;
    clone(): Font;
    static clear(renderingLayer: IRenderingLayer): void;
}
export declare const enum FontFeatures {
    StandardLigatures = "liga",
    ContextualAlternates = "calt",
    DiscretionaryLigatures = "dlig",
    SmallSaps = "smcp",
    CapitalsToSmallCaps = "c2sc",
    Swashes = "swsh",
    StylisticAlternates = "salt",
    LiningFigures = "lnum",
    OldstyleFigures = "onum",
    ProportionalFigures = "pnum",
    TabularFigures = "tnum",
    Fractions = "frac",
    Ordinals = "ordn",
    ProportionalWidths = "pwid",
    ProportionalAlternateWidths = "palt",
    ProportionalKana = "pkna",
    FullWidths = "fwid",
    HalfWidths = "hwid",
    AlternateHalfWidths = "halt",
    ThirdWidths = "twid",
    QuarterWidths = "qwid",
    JIS78Forms = "jp78",
    JIS83Forms = "jp83",
    JIS90Forms = "jp90",
    JIS2004Forms = "jp04",
    TraditionalForms = "trad",
    RubyNotationForms = "ruby",
    HorizontalKanaAlternates = "hkna",
    NLCKanjiForms = "nlck",
    AlternateAnnotationForms = "nalt",
    Italics = "ital",
    VerticalKerning = "vkrn",
    VerticalAlternates = "vert",
    ProportionalAlternateVerticalMetrics = "vpal",
    AlternateVerticalHalfMetrics = "vhal",
    VerticalKanaAlternates = "vkna",
    Kerning = "kern",
    GlyphComposition = "ccmp",
    LocalizedForms = "locl",
    Superscript = "sups",
    Subscript = "subs"
}
