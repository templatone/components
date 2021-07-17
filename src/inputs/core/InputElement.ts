import { LitElement, css, html, TemplateResult } from 'lit';
import { InputEvent } from './InputEvent.js';
import { InputFilterType } from './InputFilter.js';
import { InputRuleType, InputRuleValidatorType } from './InputRule.js';


export abstract class InputElement<ValueType> extends LitElement {
    abstract readonly emptyValue: ValueType;
    abstract defaultValue: ValueType;
    abstract value: ValueType;

    eventRepeaterDelay: number = 220;

    private _eventRepeater: number | null = null;
    private _eventWaiter: number | null = null;


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
        const delay = this.eventRepeaterDelay;

        // Start
        if (this._eventWaiter === null) {
            this.fireStartUpdateEvent();
        } else {
            clearTimeout(this._eventWaiter);
        }

        // Immediately
        this.fireImmediatelyUpdateEvent()


        if (this._eventRepeater === null) {
            this._eventRepeater = window.setTimeout(() => {
                this.firePeriodicallyUpdateEvent();
                this._eventRepeater = null;
            }, delay);
        }

        // End
        this._eventWaiter = window.setTimeout(() => {
            this.fireStopUpdateEvent();
            this._eventWaiter = null;
        }, delay);
    }


    fireImmediatelyUpdateEvent(): void {
        const evnt = new InputEvent(InputEvent.Update, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    firePeriodicallyUpdateEvent(): void {
        const evnt = new InputEvent(InputEvent.UpdatePeriodically, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    fireStartUpdateEvent(): void {
        const evnt = new InputEvent(InputEvent.UpdateStart, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    fireStopUpdateEvent(): void {
        const evnt = new InputEvent(InputEvent.UpdateStop, this.value, this.isValid());
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