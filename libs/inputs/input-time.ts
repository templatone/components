import { html, TemplateResult } from "../../node_modules/lit-html/lit-html.js";
import { Input, IInput } from "./Input.js";
import { Utils } from "../../node_modules/@templatone/kreslo/kreslo.js";


const style = html`
<style>
    :host {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        align-items: stretch;
        box-sizing: border-box;
    }

    #container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
        overflow: hidden;
        border: 2px solid;
        border-radius: 6px;

        color: var(--system-color-label);
        background-color: var(--system-color-base);
        border-color: var(--system-color-gray2);
    }

    #container:focus-within {
        border-color: var(--system-color-gray1);
    }

    #container[disabled] {
        color: var(--system-color-gray3);
        background-color: var(--system-color-gray6);
        border-color: var(--system-color-gray4);
    }


    input {
        display: block;
        flex-shrink: 1;
        flex-grow: 1;
        width: auto;
        height: 100%;
        max-width: 100%;
        min-width: 2em;
        max-height: 100%;
        min-height: 32px;
        box-sizing: border-box;
        border: none;
        outline: 0;
        outline: none;
        padding: 4px 0;
        margin: 0;
        font-family: inherit;
        font-size: 19px;
        text-align: center;
        line-height: 24px;
        color: var(--system-color-label);
        font-variant-numeric: tabular-nums;
        -moz-font-feature-settings: "tnum";
        -webkit-font-feature-settings: "tnum";
        font-feature-settings: "tnum";
        background-color: inherit;
    }

    input::placeholder {
        color: var(--system-color-gray3);
    }

    #container[disabled] input::placeholder {
        color: transparent;
    }

    .clear-button {
        cursor: pointer;
        margin: 4px;
        flex-shrink: 0;
        fill: var(--x-border-color);
    }

    .clear-button:hover {
        fill: var(--system-color-gray2);
    }

    #container[disabled] .clear-button,
    #container:not([filled]) .clear-button {
        display: none;
    }

    .flexspace {
        flex-grow: 1;
        flex-shrink: 1;
    }

    .separator {
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    [hidden] {
        display: none;
    }
</style>`;


export type TimeValue = {
    hours: number,
    minutes: number,
    seconds: number,
    miliseconds: number,
} | null;

export class InputTime extends Input<TimeValue> implements IInput<TimeValue> {

    private static regexp = {
        numbers: /[0-9]+/g,
    }


    // Properties
    readonly defaultValue: TimeValue = null;

    private _value: TimeValue = null;
    get value(): TimeValue { return this._value; }
    set value(v: TimeValue) {
        this._value = v;
        this.invalidate();
    }


    private _disabled: boolean = false;
    get disabled(): boolean { return this._disabled; }
    set disabled(v: boolean) {
        this._disabled = v;
        this.invalidate();
    }


    private _readOnly: boolean = false;
    get readOnly(): boolean { return this._readOnly; }
    set readOnly(v: boolean) {
        this._readOnly = v;
        this.invalidate();
    }


    private _autocomplete: boolean = false;
    get autocomplete(): boolean { return this._autocomplete; }
    set autocomplete(v: boolean) {
        this._autocomplete = v;
        this.invalidate();
    }


    private _precision: number = 2;
    get precision(): number { return this._precision; }
    set precision(value: number) {
        this._precision = value;
        this.invalidate
    }



    // Elements
    private _hoursEl: HTMLInputElement;
    private _minutesEl: HTMLInputElement;
    private _secondsEl: HTMLInputElement;
    private _milisecondsEl: HTMLInputElement;


    constructor() {
        super();

        this._hoursEl = this.shadowRoot!.getElementById('hours') as HTMLInputElement;
        this._minutesEl = this.shadowRoot!.getElementById('minutes') as HTMLInputElement;
        this._secondsEl = this.shadowRoot!.getElementById('seconds') as HTMLInputElement;
        this._milisecondsEl = this.shadowRoot!.getElementById('miliseconds') as HTMLInputElement;
    }


    private _evaluateInput(input: HTMLInputElement, max: number, nextInput: HTMLInputElement): number | null {
        const raw = input.value;
        const cursor = input.selectionStart ?? 0;

        const raw1 = raw.substring(0, cursor);
        const raw2 = raw.substring(cursor, raw.length);

        const part1 = raw1.match(InputTime.regexp.numbers)?.join('') ?? '';
        const part2 = raw2.match(InputTime.regexp.numbers)?.join('') ?? '';

        const cleaned = part1 + part2;
        const parsedValue = parseInt(cleaned, 10);
        let finalValue: number | null = null;

        if (!isNaN(parsedValue)) {
            finalValue = Utils.Numbers.limit(parsedValue, 0, max);

            if (finalValue == parsedValue) {
                input.value = cleaned;
                input.selectionStart = part1.length;
                input.selectionEnd = part1.length;
            } else {
                input.value = finalValue.toString();
                input.selectionStart = 0;
                input.selectionEnd = input.value.length;
            }
        }

        const separators = [' ', ',', ':', ';', '-', '/', '\\'];
        const last = raw.substring(raw.length - 1, raw.length);

        if (!isNaN(parsedValue) && separators.indexOf(last) >= 0) {
            nextInput.focus();
            nextInput.setSelectionRange(0, nextInput.value.length);
        }

        return finalValue;
    }


    private _onInputHours() {
        const hours = this._evaluateInput(this._hoursEl, 23, this._minutesEl);

        if (this.value != null || hours != null) {
            this._updateValue({
                hours: hours ?? 0,
                minutes: this.value?.minutes ?? 0,
                seconds: this.value?.seconds ?? 0,
                miliseconds: this.value?.miliseconds ?? 0,
            });
        } else {
            this._updateValue(null);
        }
    }


    private _onInputMinutes() {
        const minutes = this._evaluateInput(this._minutesEl, 59, this._secondsEl);

        if (this.value != null || minutes != null) {
            this._updateValue({
                hours: this.value?.hours ?? 0,
                minutes: minutes ?? 0,
                seconds: this.value?.seconds ?? 0,
                miliseconds: this.value?.miliseconds ?? 0,
            });
        } else {
            this._updateValue(null);
        }
    }


    private _onInputSeconds() {
        const seconds = this._evaluateInput(this._secondsEl, 59, this._milisecondsEl);

        if (this.value != null || seconds != null) {
            this._updateValue({
                hours: this.value?.hours ?? 0,
                minutes: this.value?.minutes ?? 0,
                seconds: seconds ?? 0,
                miliseconds: this.value?.miliseconds ?? 0,
            });
        } else {
            this._updateValue(null);
        }
    }


    private _onInputMiliseconds() {
        const miliseconds = this._evaluateInput(this._milisecondsEl, 999, this._hoursEl);

        if (this.value != null || miliseconds != null) {
            this._updateValue({
                hours: this.value?.hours ?? 0,
                minutes: this.value?.minutes ?? 0,
                seconds: this.value?.seconds ?? 0,
                miliseconds: miliseconds ?? 0,
            });
        } else {
            this._updateValue(null);
        }
    }


    private _onBlurHours() {
        this._updateIU();
    }


    private _onBlurMinutes() {
        this._updateIU();
    }


    private _onBlurSeconds() {
        this._updateIU();
    }


    private _onBlurMiliseconds() {
        this._updateIU();
    }


    private _updateIU() {
        this._updateUIHours();
        this._updateUIMinutes();
        this._updateUISeconds();
        this._updateUIMiliseconds();
    }


    private _updateUIHours() {
        this._hoursEl.value = this.value ? Utils.Strings.padLeft(this.value.hours.toString(), 2, '0') : '';
    }


    private _updateUIMinutes() {
        this._minutesEl.value = this.value ? Utils.Strings.padLeft(this.value.minutes.toString(), 2, '0') : '';
    }


    private _updateUISeconds() {
        this._secondsEl.value = this.value ? Utils.Strings.padLeft(this.value.seconds.toString(), 2, '0') : '';
    }


    private _updateUIMiliseconds() {
        this._milisecondsEl.value = this.value ? Utils.Strings.padLeft(this.value.miliseconds.toString(), 3, '0') : '';
    }


    private _onClearValue() {
        this.clearValue();
        this.focus();
    }


    private _updateValue(value: TimeValue): void {
        this._value = InputTime.applyFilters(this.filters, value);
        this.fireUpdateEvent();

        this._updateIU();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: TimeValue): boolean {
        if (this.value != null && value != null) {
            return this.value.hours == value.hours
                && this.value.minutes == value.minutes
                && this.value.seconds == value.seconds
                && this.value.miliseconds == value.miliseconds;
        }

        return this.value === value;
    }


    focus() {
        this._hoursEl.focus();
        this.fireFocusEvent();
    }


    blur() {
        this._hoursEl.blur();
        this._minutesEl.blur();
        this._secondsEl.blur();
        this._milisecondsEl.blur();

        this.fireBlurEvent();
    }


    // Attributes
    static get observedAttributes() {
        return ['precision', 'autocomplete', 'readonly', 'disabled', 'value'];
    }


    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name.toLocaleLowerCase()) {
            case 'precision':
                this.precision = newValue ? parseInt(newValue, 10) : 2;
                break;

            case 'value':
                if (newValue !== null && newValue.trim() !== "") {
                    const p1 = newValue.split(':');
                    const p2 = p1[2] ? p1[2].split('.')[1] : undefined;

                    const hours: number = p1[0] ? parseInt(p1[0], 10) : 0;
                    const minutes: number = p1[1] ? parseInt(p1[1], 10) : 0;
                    const seconds: number = p1[2] ? parseInt(p1[2], 10) : 0;
                    const miliseconds: number = p2 ? parseInt(p2, 10) : 0;

                    this._updateValue({
                        hours,
                        minutes,
                        seconds,
                        miliseconds,
                    });

                } else {
                    this._updateValue(null);
                }
                break;

            case 'disabled':
                this.disabled = newValue !== null;
                break;

            case 'readonly':
                this.readOnly = newValue !== null;
                break;

            case 'autocomplete':
                this.autocomplete = newValue !== null;
                break;
        }
    }


    getTemplate(): TemplateResult {
        return html`
            ${style}
            
            <div id="container"
                    ?disabled=${this.disabled}
                    ?filled=${this.value != null}>

                <input
                    ?hidden=${this.precision < 1}
                    id="hours" @input=${(e: InputEvent) => this._onInputHours()}
                    @blur=${() => this._onBlurHours()}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    .autocomplete=${this.autocomplete}
                    placeholder="h"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    enterkeyhint="enter"
                    type="text">

                <span
                    ?hidden=${this.precision < 2}
                    class="separator">:</span>
            
                <input
                    ?hidden=${this.precision < 2}
                    id="minutes"
                    @input=${(e: InputEvent) => this._onInputMinutes()}
                    @blur=${() => this._onBlurMinutes()}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    placeholder="min"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    enterkeyhint="enter"
                    type="text">

                <span
                    ?hidden=${this.precision < 3}
                    class="separator">:</span>
            
                <input
                    ?hidden=${this.precision < 3}
                    id="seconds" @input=${(e: InputEvent) => this._onInputSeconds()}
                    @blur=${() => this._onBlurSeconds()}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    placeholder="s"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    enterkeyhint="enter"
                    type="text">
            
                <span
                    ?hidden=${this.precision < 4}
                    class="separator">,</span>
            
                <input
                    ?hidden=${this.precision < 4}
                    id="miliseconds"
                    @input=${(e: InputEvent) => this._onInputMiliseconds()}
                    @blur=${() => this._onBlurMiliseconds()}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    placeholder="ms"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    enterkeyhint="enter"
                    type="text">

                <div class="clear-button" ?hidden=${this.hasSameValueAs(this.defaultValue)} @click=${()=> this._onClearValue()}>
                    <!-- TODO: --> Clear
                </div>
            </div>
        `;
    }
}

InputTime.registerCustomElement('input-time');