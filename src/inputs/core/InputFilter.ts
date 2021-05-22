export type InputFilterType<ValueType> = { (v: ValueType): ValueType };


export class InputFilters {
    private static regex = {
        spaces: /\u0020+/g,
        breaklines: /(\r*\n)+/g,
    }

    static trim(v: string): string {
        return v.trim();
    }


    static trimEachLines(v: string): string {
        const splitter = '\n';

        const lines = v.split(splitter);
        return lines.map(l => l.trim()).join(splitter);
    }


    static reduceSpaces(v: string): string {
        InputFilters.regex.spaces.lastIndex = 0;

        return v.replace(InputFilters.regex.spaces, ' ');
    }


    static reduceBreaklines(v: string): string {
        if (v == '') return '';

        InputFilters.regex.breaklines.lastIndex = 0;
        return v.replace(InputFilters.regex.breaklines, '\n');
    }


    static lowerCase(v: string): string {
        return v.toLocaleLowerCase();
    }


    static upperCase(v: string): string {
        return v.toLocaleUpperCase();
    }


    static blankToNull(v: string): string | null {
        return v != "" ? v : null;
    }
}