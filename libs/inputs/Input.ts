import { CustomElement } from "../../libs/CustomElement.js";
import { TemplateResult, html } from "../../node_modules/lit-html/lit-html.js";


export interface IInput<VALUE> {
    value: VALUE,
    readonly defaultValue: VALUE,

    hasSameValueAs(value: VALUE): boolean,
    isValid(): boolean

    clearValue(): void,

    focus(): void,
    blur(): void,

    disabled: boolean,
    readOnly: boolean,
}


export const enum INPUTMODE {
    Default = '',
    None = 'none',
    Text = 'text',
    Url = 'url',
    Email = 'email',
    Numeric = 'numeric',
    Search = 'search',
    Tel = 'tel',
    Decimal = 'decimal',
}


export interface IInputTextBased<VALUE> extends IInput<VALUE> {
    placeholder: string | null,
    autocomplete: boolean,
    spellcheck: boolean,
    inputMode: INPUTMODE | string,
}


export interface IInputRule {
    message: TemplateResult | Element | string | null,
    validator: IInputRuleValidator,
}


export interface IInputRuleValidator {
    (value: any): boolean
}


export type InputFilter<VALUE> = { (v: VALUE): VALUE };


export abstract class Input<VALUE> extends CustomElement {

    get value(): VALUE {
        throw new Error(`${this.tagName}: Property 'value' is not defined.`);
    }

    eventRepeaterDelay: number = 100;

    private _eventRepeater: number = NaN;
    private _eventWaiter: number = NaN;


    // Rules
    private _rules: IInputRule[] = [];


    addRule(validator: IInputRuleValidator, message: TemplateResult | Element | string | null = null): void {
        this._rules.push({
            validator,
            message,
        });
    }


    setRules(rules: IInputRule[]): void {
        this._rules = rules;
    }


    getRules(): IInputRule[] {
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


    readonly filters: InputFilter<VALUE>[] = [];


    static applyFilters<VALUE>(filters: InputFilter<VALUE>[], value: VALUE): VALUE {
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
            this.fireStableUpdateEvent();
            this._eventWaiter = NaN;
        }, this.eventRepeaterDelay);

        if (isNaN(this._eventRepeater)) {
            this._eventRepeater = window.setTimeout(() => {
                this.fireStableUpdateEvent();
                this._eventRepeater = NaN;
            }, this.eventRepeaterDelay);
        }
    }


    fireImmediatelyUpdateEvent(): void {
        const evnt = new InputEvent(InputEvent.UPDATE, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    fireStableUpdateEvent(): void {
        const evnt = new InputEvent(InputEvent.UPDATE_STABLE, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    fireStartUpdateEvent(): void {
        const evnt = new InputEvent(InputEvent.UPDATE_START, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    fireEndUpdateEvent(): void {
        const evnt = new InputEvent(InputEvent.UPDATE_END, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    fireFocusEvent(): void {
        const evnt = new InputEvent(InputEvent.FOCUS, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    fireBlurEvent(): void {
        const evnt = new InputEvent(InputEvent.BLUR, this.value, this.isValid());
        this.dispatchEvent(evnt);
    }


    getTemplate(): TemplateResult {
        throw new Error(`${this.tagName}: Method 'getTemplate' is not defined.`);
    }


    connectedCallback() {
        super.invalidate();
    }
}



const enum EVENT_TYPE {
    FOCUS = 'focus',
    BLUR = 'blur',

    UPDATE = 'update',
    UPDATE_DELAYED = 'update-delayed',
    UPDATE_START = 'update-start',
    UPDATE_END = 'update-end',
}



export class InputEvent<VALUE> extends CustomEvent<{
    value: VALUE,
    valid: boolean,
}> {

    static readonly FOCUS = EVENT_TYPE.FOCUS;
    static readonly BLUR = EVENT_TYPE.BLUR;

    static readonly UPDATE = EVENT_TYPE.UPDATE;
    static readonly UPDATE_STABLE = EVENT_TYPE.UPDATE_DELAYED;
    static readonly UPDATE_START = EVENT_TYPE.UPDATE_START;
    static readonly UPDATE_END = EVENT_TYPE.UPDATE_END;

    constructor(typeArg: EVENT_TYPE, value: VALUE, isValid: boolean) {
        super(typeArg, {
            detail: {
                value, valid: isValid
            }
        })
    }
}



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