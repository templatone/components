import { LitElement, TemplateResult } from 'lit';
import { InputFilterType } from './InputFilter.js';
import { InputRuleType, InputRuleValidatorType } from './InputRule.js';
export declare abstract class InputElement<ValueType> extends LitElement {
    value: ValueType;
    eventRepeaterDelay: number;
    private _eventRepeater;
    private _eventWaiter;
    private _rules;
    addRule(validator: InputRuleValidatorType, message?: TemplateResult | Element | string | null): void;
    setRules(rules: InputRuleType[]): void;
    getRules(): InputRuleType[];
    isValid(): boolean;
    readonly filters: InputFilterType<ValueType>[];
    static applyFilters<ValueType>(filters: InputFilterType<ValueType>[], value: ValueType): ValueType;
    fireUpdateEvent(): void;
    fireImmediatelyUpdateEvent(): void;
    firePeriodicalUpdateEvent(): void;
    fireStartUpdateEvent(): void;
    fireEndUpdateEvent(): void;
    fireFocusEvent(): void;
    fireBlurEvent(): void;
}
