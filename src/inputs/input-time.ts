import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { clear as clearIcon } from '../assets/icons.js';
import { Numbers, Strings } from '@templatone/utils';
import { InputElement } from "./core/InputElement.js";
import type { IInputElement } from "./core/IInputElement.js";


export type InputTimeValue = {
    hours: number,
    minutes: number,
    seconds: number,
    miliseconds: number,
};


@customElement('input-time')
export class InputTimeElement extends InputElement<InputTimeValue> implements IInputElement<InputTimeValue> {

    private static regexp = {
        numbers: /[0-9]+/g,
    }


    // Properties
    readonly emptyValue: InputTimeValue = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        miliseconds: 0,
    };
    defaultValue: InputTimeValue = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        miliseconds: 0,
    };


    @property({
        attribute: true,
        converter: (v: string | null): InputTimeValue => {
            let hours: number = 0;
            let minutes: number = 0;
            let seconds: number = 0;
            let miliseconds: number = 0;

            if (v !== null) {
                const time = parseInt(v, 10);
                const date = new Date(time);

                hours = date.getHours();
                minutes = date.getMinutes();
                seconds = date.getSeconds();
                miliseconds = date.getMilliseconds();
            }

            return { hours, minutes, seconds, miliseconds };
        },
        hasChanged: (val, old) => {
            console.log(val, old);
            
            return false;
        }
    })
    value: InputTimeValue = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        miliseconds: 0,
    };;


    @property({ attribute: true, reflect: true, type: Boolean })
    disabled: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    readOnly: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    autofocus: boolean = false;


    @property({
        attribute: true,
        type: Number,
        converter: (v) => parseInt(v ?? "2", 10)
    })
    precision: number = 2;


    // Elements
    @query('#hours')
    private _hours!: HTMLInputElement;

    @query('#minutes')
    private _minutes!: HTMLInputElement;

    @query('#seconds')
    private _seconds!: HTMLInputElement;

    @query('#miliseconds')
    private _miliseconds!: HTMLInputElement;


    private _evaluateInput(input: HTMLInputElement, max: number, nextInput: HTMLInputElement): number | null {
        const raw = input.value;
        const cursor = input.selectionStart ?? 0;

        const raw1 = raw.substring(0, cursor);
        const raw2 = raw.substring(cursor, raw.length);

        const part1 = raw1.match(InputTimeElement.regexp.numbers)?.join('') ?? '';
        const part2 = raw2.match(InputTimeElement.regexp.numbers)?.join('') ?? '';

        const cleaned = part1 + part2;
        const parsedValue = parseInt(cleaned, 10);
        let finalValue: number = 0;

        if (!isNaN(parsedValue)) {
            finalValue = Numbers.limit(parsedValue, 0, max);

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
        const hours = this._evaluateInput(this._hours, 23, this._minutes);

        if (this.value != null || hours != null) {
            this._updateValue({
                hours: hours ?? 0,
                minutes: this.value?.minutes ?? 0,
                seconds: this.value?.seconds ?? 0,
                miliseconds: this.value?.miliseconds ?? 0,
            });
        } else {
            this._updateValue(this.defaultValue);
        }
    }


    private _onInputMinutes() {
        const minutes = this._evaluateInput(this._minutes, 59, this._seconds);

        if (this.value != null || minutes != null) {
            this._updateValue({
                hours: this.value?.hours ?? 0,
                minutes: minutes ?? 0,
                seconds: this.value?.seconds ?? 0,
                miliseconds: this.value?.miliseconds ?? 0,
            });
        } else {
            this._updateValue(this.defaultValue);
        }
    }


    private _onInputSeconds() {
        const seconds = this._evaluateInput(this._seconds, 59, this._miliseconds);

        if (this.value != null || seconds != null) {
            this._updateValue({
                hours: this.value?.hours ?? 0,
                minutes: this.value?.minutes ?? 0,
                seconds: seconds ?? 0,
                miliseconds: this.value?.miliseconds ?? 0,
            });
        } else {
            this._updateValue(this.defaultValue);
        }
    }


    private _onInputMiliseconds() {
        const miliseconds = this._evaluateInput(this._miliseconds, 999, this._hours);

        if (this.value != null || miliseconds != null) {
            this._updateValue({
                hours: this.value?.hours ?? 0,
                minutes: this.value?.minutes ?? 0,
                seconds: this.value?.seconds ?? 0,
                miliseconds: miliseconds ?? 0,
            });
        } else {
            this._updateValue(this.defaultValue);
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
        this._hours.value = this.value ? Strings.padLeft(this.value.hours.toString(), 2, '0') : '';
    }


    private _updateUIMinutes() {
        this._minutes.value = this.value ? Strings.padLeft(this.value.minutes.toString(), 2, '0') : '';
    }


    private _updateUISeconds() {
        this._seconds.value = this.value ? Strings.padLeft(this.value.seconds.toString(), 2, '0') : '';
    }


    private _updateUIMiliseconds() {
        this._miliseconds.value = this.value ? Strings.padLeft(this.value.miliseconds.toString(), 3, '0') : '';
    }


    private _onClearValue() {
        this.clearValue();
        setTimeout(() => this.focus(), 1);
    }


    private _updateValue(value: InputTimeValue): void {
        this.value = InputTimeElement.applyFilters(this.filters, { ...value });
        this.fireUpdateEvent();

        this._updateIU();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: InputTimeValue): boolean {
        if (this.value != null && value != null) {
            return this.value.hours == value.hours
                && this.value.minutes == value.minutes
                && this.value.seconds == value.seconds
                && this.value.miliseconds == value.miliseconds;
        }

        return this.value === value;
    }


    focus() {
        this._hours.focus();
        this._hours.setSelectionRange(0, this._hours.value.length);
        this.fireFocusEvent();
    }


    blur() {
        this._hours.blur();
        this._minutes.blur();
        this._seconds.blur();
        this._miliseconds.blur();

        this.fireBlurEvent();
    }


    render() {
        return html`
            <div id="container" ?disabled=${this.disabled} ?filled=${this.value != null}>
            
                <input ?hidden=${this.precision < 1} id="hours" @input=${(e: InputEvent) => this._onInputHours()}
                    @blur=${() => this._onBlurHours()}
                    ?disabled=${this.disabled}
                    ?readOnly=${this.readOnly}
                    ?autofocus=${this.autofocus}
                    placeholder="h"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    enterkeyhint="enter"
                    type="text">
            
                <span ?hidden=${this.precision < 2} class="separator">:</span>
            
                <input ?hidden=${this.precision < 2} id="minutes" @input=${(e: InputEvent) => this._onInputMinutes()}
                    @blur=${() => this._onBlurMinutes()}
                    ?disabled=${this.disabled}
                    ?readOnly=${this.readOnly}
                    placeholder="min"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    enterkeyhint="enter"
                    type="text">
            
                <span ?hidden=${this.precision < 3} class="separator">:</span>
            
                <input ?hidden=${this.precision < 3} id="seconds" @input=${(e: InputEvent) => this._onInputSeconds()}
                    @blur=${() => this._onBlurSeconds()}
                    ?disabled=${this.disabled}
                    ?readOnly=${this.readOnly}
                    placeholder="s"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    enterkeyhint="enter"
                    type="text">
            
                <span ?hidden=${this.precision < 4} class="separator">,</span>
            
                <input ?hidden=${this.precision < 4} id="miliseconds" @input=${(e: InputEvent) => this._onInputMiliseconds()}
                    @blur=${() => this._onBlurMiliseconds()}
                    ?disabled=${this.disabled}
                    ?readOnly=${this.readOnly}
                    placeholder="ms"
                    pattern="[0-9]*"
                    inputmode="numeric"
                    enterkeyhint="enter"
                    type="text">
            
                <div class="actionButton" ?hidden=${this.hasSameValueAs(this.defaultValue)} @click=${()=> this._onClearValue()}>
                    <div class="icon">${clearIcon}</div>
                </div>
            </div>
        `;
    }


    static styles = css`
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
            border-color: var(--system-color-grey2);
        }

        #container:focus-within {
            border-color: var(--system-color-grey1);
        }

        #container[disabled] {
            color: var(--system-color-grey3);
            background-color: var(--system-color-grey6);
            border-color: var(--system-color-grey4);
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
            color: var(--system-color-grey3);
        }

        #container[disabled] input::placeholder {
            color: transparent;
        }

        .actionButton {
            cursor: pointer;
            margin: 4px;
            flex-shrink: 0;
            fill: var(--x-border-color);
        }

        .actionButton:hover {
            fill: var(--system-color-grey2);
        }

        #container[disabled] .actionButton,
        #container:not([filled]) .actionButton {
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
    `;
}