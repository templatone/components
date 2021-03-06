export interface IInputElement<ValueType> {
    hasSameValueAs(value: ValueType): boolean;
    isValid(): boolean;
    clearValue(): void;
    focus(): void;
    blur(): void;
    disabled: boolean;
    readOnly: boolean;
    autofocus: boolean;
}
