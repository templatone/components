import { LitElement, TemplateResult } from 'lit';
import { AutocompleteType } from './AutocompleteType';
import { InputModeType } from './InputModeType';
export interface IInputElement<VALUE> {
    value: VALUE;
    readonly defaultValue: VALUE;
    hasSameValueAs(value: VALUE): boolean;
    isValid(): boolean;
    clearValue(): void;
    focus(): void;
    blur(): void;
    disabled: boolean;
    readOnly: boolean;
}
export interface ITextBasedInputElement<ValueType> extends IInputElement<ValueType> {
    placeholder: string | null;
    autocomplete: AutocompleteType;
    spellcheck: boolean;
    inputMode: InputModeType | string;
}
export interface IInputRule {
    message: TemplateResult | Element | string | null;
    validator: IInputRuleValidator;
}
export interface IInputRuleValidator {
    (value: any): boolean;
}
export declare type InputFilter<ValueType> = {
    (v: ValueType): ValueType;
};
export declare abstract class InputElement<ValueType> extends LitElement {
    value: ValueType;
    eventRepeaterDelay: number;
    private _eventRepeater;
    private _eventWaiter;
    private _rules;
    addRule(validator: IInputRuleValidator, message?: TemplateResult | Element | string | null): void;
    setRules(rules: IInputRule[]): void;
    getRules(): IInputRule[];
    isValid(): boolean;
    readonly filters: InputFilter<ValueType>[];
    static applyFilters<VALUE>(filters: InputFilter<VALUE>[], value: VALUE): VALUE;
    fireUpdateEvent(): void;
    fireImmediatelyUpdateEvent(): void;
    fireStableUpdateEvent(): void;
    fireStartUpdateEvent(): void;
    fireEndUpdateEvent(): void;
    fireFocusEvent(): void;
    fireBlurEvent(): void;
}
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
