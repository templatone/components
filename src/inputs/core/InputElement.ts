import { LitElement, css, html, TemplateResult } from 'lit';
import { InputEvent } from './InputEvent.js';
import { InputFilterType } from './InputFilter.js';
import { InputRuleType, InputRuleValidatorType } from './InputRule.js';


export abstract class InputElement<ValueType> extends LitElement {
    abstract value: ValueType;

    eventRepeaterDelay: number = 100;

    private _eventRepeater: number = NaN;
    private _eventWaiter: number = NaN;


    // Rules
    private _rules: InputRuleType[] = [];


    addRule(validator: InputRuleValidatorType, message: TemplateResult | Element | string | null = null): void {
        this._rules.push({
            validator,
            message,
        });
    }


    setRules(rules: InputRuleType[]): void {
        this._rules = rules;
    }


    getRules(): InputRuleType[] {
        return [...this._rules];
    }


    isValid(): boolean {
        const rules = this.getRules();
        const value = this.value;

        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];

            if (rule.validator(value) == false) return false;
        }

        return true;
    }


    readonly filters: InputFilterType<ValueType>[] = [];


    static applyFilters<ValueType>(filters: InputFilterType<ValueType>[], value: ValueType): ValueType {
        return filters.reduce((value, filter) => {
            return filter(value);
        }, value);
    }


    fireUpdateEvent(): void {
        this.fireImmediatelyUpdateEvent()

        if (isNaN(this._eventWaiter)) {
            this.fireStartUpdateEvent();
        } else {
            clearTimeout(this._eventWaiter);
        }

        this._eventWaiter = window.setTimeout(() => {
            this.firePeriodicalUpdateEvent();
            this._eventWaiter = NaN;
        }, this.eventRepeaterDelay);

        if (isNaN(this._eventRepeater)) {
            this._eventRepeater = window.setTimeout(() => {
                this.firePeriodicalUpdateEvent();
                this._eventRepeater = NaN;
            }, this.eventRepeaterDelay);
        }
    }


    fireImmediatelyUpdateEvent(): void {
        const evnt = new InputEvent(InputEvent.Update, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    firePeriodicalUpdateEvent(): void {
        const evnt = new InputEvent(InputEvent.UpdatePeriodically, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    fireStartUpdateEvent(): void {
        const evnt = new InputEvent(InputEvent.UpdateStart, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    fireEndUpdateEvent(): void {
        const evnt = new InputEvent(InputEvent.UpdateEnd, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    fireFocusEvent(): void {
        const evnt = new InputEvent(InputEvent.Focus, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    fireBlurEvent(): void {
        const evnt = new InputEvent(InputEvent.Blur, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }
}