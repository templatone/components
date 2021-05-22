export declare type InputFilterType<ValueType> = {
    (v: ValueType): ValueType;
};
export declare class InputFilters {
    private static regex;
    static trim(v: string): string;
    static trimEachLines(v: string): string;
    static reduceSpaces(v: string): string;
    static reduceBreaklines(v: string): string;
    static lowerCase(v: string): string;
    static upperCase(v: string): string;
    static blankToNull(v: string): string | null;
}
