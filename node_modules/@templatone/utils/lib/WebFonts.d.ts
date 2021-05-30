import WebFont from "webfontloader";
export declare type StyleType = 'normal' | 'italic' | 'oblique';
export declare type WeightType = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'normal' | 'bold';
export declare type StretchType = 'ultra-condensed' | 'extra-condensed' | 'condensed' | 'semi-condensed' | 'normal' | 'semi-expanded' | 'expanded' | 'extra-expanded' | 'ultra-expanded';
export declare type VariantType = 'normal' | 'small-caps';
export declare type FontVariationType = {
    style?: StyleType;
    weight?: WeightType;
};
export declare type FontFaceDescriptionType = {
    family: string;
    path: string;
} & FontVariationType;
export declare type FontFamilyDescriptionType = {
    family: string;
    path: string;
    variations: FontVariationType[];
};
export declare class WebFonts {
    static load(config: WebFont.Config): Promise<void>;
    private static _getFvd;
    static computeFamilyQuery(name: string, variations?: FontVariationType[]): string;
    static convertFacesToFamilies(descriptions: FontFaceDescriptionType[]): FontFamilyDescriptionType[];
}
