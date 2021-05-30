export interface IInputElement<ValueType> {
    value: ValueType,
    readonly defaultValue: ValueType,

    hasSameValueAs(value: ValueType): boolean,
    isValid(): boolean

    clearValue(): void,

    focus(): void,
    blur(): void,

    disabled: boolean,
    readOnly: boolean,
}