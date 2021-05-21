import WebFont from "webfontloader";

export type StyleType = 'normal' | 'italic' | 'oblique';
export type WeightType = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'normal' | 'bold';
export type StretchType = 'ultra-condensed' | 'extra-condensed' | 'condensed' | 'semi-condensed' | 'normal' | 'semi-expanded' | 'expanded' | 'extra-expanded' | 'ultra-expanded';
export type VariantType = 'normal' | 'small-caps';


export type FontVariationType = {
    style?: StyleType,
    weight?: WeightType,
}


export type FontFaceDescriptionType = {
    family: string,
    path: string,
} & FontVariationType;


export type FontFamilyDescriptionType = {
    family: string,
    path: string,
    variations: FontVariationType[]
}


export class WebFonts {

    static async load(config: WebFont.Config): Promise<void> {
        return await new Promise((resolve, reject) => {
            const userActive = config.active ? config.active : () => { };
            const userInactive = config.inactive ? config.inactive : () => { };

            config.events = true;

            config.active = () => {
                userActive()
                resolve()
            }

            config.inactive = () => {
                userInactive()
                reject()
            }

            WebFont.load(config);
        })
    }


    private static _getFvd(style: StyleType = 'normal', weight: WeightType = 400/*, stretch: stretch = 'normal', variant: variant = 'normal'*/): string {
        const _style = ((v) => {
            switch (v) {
                case 'normal': return 'n'
                case 'italic': return 'i'
                case 'oblique': return 'o'
            }
        })(style)


        const _weight = ((v) => {
            if (typeof v == 'string') {
                switch (v) {
                    case 'normal': return '4'
                    case 'bold': return '7'
                }
            } else {
                return (v / 100).toFixed(0)
            }
        })(weight)

        /* Forward compatibility
        const _stretch = ((v) => {
            switch (v) {
                case 'ultra-condensed': return 'a'
                case 'extra-condensed': return 'b'
                case 'condensed': return 'c'
                case 'semi-condensed': return 'd'
                case 'normal': return 'n'
                case 'semi-expanded': return 'e'
                case 'expanded': return 'f'
                case 'extra-expanded': return 'g'
                case 'ultra-expanded': return 'h'
            }
        })(stretch)


        const _variant = ((v) => {
            switch (v) {
                case 'normal': return 'n'
                case 'small-caps': return 'c'
            }
        })(variant)
        */


        return `${_style}${_weight}`
    }


    static computeFamilyQuery(name: string, variations: FontVariationType[] = [{}]): string {
        const fvds: string[] = variations.map(v => this._getFvd(v.style, v.weight));

        return `${name}:${fvds.join(',')}`
    }


    static convertFacesToFamilies(descriptions: FontFaceDescriptionType[]): FontFamilyDescriptionType[] {
        const variationDescription = [...descriptions].reduce((results, v) => {
            let face = results.find(x => x.family.toLowerCase() === v.family.toLowerCase());

            if (face === undefined) {
                face = {
                    family: v.family,
                    path: v.path,
                    variations: []
                };

                results.push(face);
            }

            face.variations.push({
                style: v.style ?? 'normal',
                weight: v.weight ?? 'normal',
            });

            return results;
        }, [] as FontFamilyDescriptionType[]);

        variationDescription.forEach(v => v.variations.sort((a, b) => {
            const w = (w?: WeightType): number => {
                if (w === undefined) return 400;
                else if (w === 'normal') return 400;
                else if (w === 'bold') return 700;
                else return w;
            };

            return w(a.weight) - w(b.weight);
        }));

        return variationDescription;
    }
}