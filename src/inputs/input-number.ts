import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { InputElement } from "./core/InputElement.js";
import { clear as clearIcon, reset as resetIcon } from '../assets/icons.js';
import type { ITextBasedInputElement } from './core/ITextBasedInputElement.js';
import { InputModeType } from './core/InputModeType.js';
import { AutocompleteType } from './core/AutocompleteType.js';
import { AutocapitalizeType } from './core/AutocapitalizeType.js';


const regex = {
    spaces: /\s+/g,
    validChars: /[^0-9,.+\- ]/g,
    decimalSeparator: /\.|\,/
}


const converterNumberOrNull = (attributeName: string, v: string | null): number | null => {
    if (v !== null) {
        const n = parseFloat(v);

        if (!isNaN(n)) {
            return n;
        } else {
            console.error(`InputNumberElement - convert attribute ${attributeName} unexpected value.`)
            return null;
        }
    } else {
        return null;
    }
}


export type InputNumberValue = number;


@customElement('input-number')
export class InputNumberElement extends InputElement<InputNumberValue> implements ITextBasedInputElement<InputNumberValue> {
    readonly emptyValue: InputNumberValue = 0;
    defaultValue: InputNumberValue = 0;


    @property({
        attribute: true,
        converter: (v) => converterNumberOrNull('min', v),
    })
    min: number | null = null;


    @property({
        attribute: true,
        converter: (v) => converterNumberOrNull('max', v),
    })
    max: number | null = null;


    @property({
        attribute: true,
        converter: (v) => converterNumberOrNull('step', v),
    })
    step: number | null = null;


    @property({ type: Number })
    value: InputNumberValue = 0;


    @property({ attribute: true, converter: (v) => v?.trim() != "" ? v : null })
    placeholder: string | null = null;


    @property({ attribute: true, reflect: true, type: Boolean })
    disabled: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    readOnly: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    autofocus: boolean = false;


    @property({ attribute: true, type: String })
    autocomplete: AutocompleteType = AutocompleteType.Off;


    @property({ attribute: true })
    autocapitalize: AutocapitalizeType = AutocapitalizeType.Off;


    @property({ attribute: true })
    inputMode: InputModeType = InputModeType.Default;


    @property({ attribute: true })
    name: string = '';


    private _computeInputMode(): InputModeType {
        if (this.inputMode === InputModeType.Default) {
            return Number.isInteger(this.step) ? InputModeType.Decimal : InputModeType.Numeric;
        } else {
            return this.inputMode;
        }
    };


    @query('#input')
    private _input!: HTMLInputElement;



    private _onInput() {
        const rawValue = this._input.value;

        const rawParts = rawValue.split(regex.decimalSeparator);
        if (rawParts.length == 1) {
            rawParts.push('');
        } else if (rawParts.length >= 3) {
            rawParts[1] = rawParts.slice(1).join('');
        }

        rawParts.splice(2);

        const parts = rawParts.map(v => {
            return v.replace(regex.validChars, '')
                .replace(regex.spaces, '')
                .replace(regex.decimalSeparator, '')
                .replace('+', '');
        });

        const value: string = [
            parts[0].length != 0 ? parts[0] : 0,
            parts[1].length != 0 ? parts[1] : 0,
        ].join('.');

        const n = parseFloat(value);
        this._updateValue(n);
    }


    private _onFocus() {
        if (this.value == 0) {
            this._input.select();
        }
    }


    private _onBlur() {
        this._input.value = this._formatValue(this.value);
    }


    private _onKeyDown(e: KeyboardEvent) {
        const increment = (direction: -1 | 1) => {
            e.preventDefault();

            const v: number = this.step ?? 1;
            this._updateValue((this.value ?? 0) + (v * (e.shiftKey ? 10 : 1) * direction));
            this._input.select();
        }

        switch (e.key) {
            case 'ArrowUp': increment(1); break;
            case 'ArrowDown': increment(-1); break;
        }
    }


    private _onClearValue() {
        this.clearValue();
        setTimeout(() => this.focus(), 1);
    }


    private _updateValue(value: InputNumberValue): void {
        if (value != null) {
            if (this.max != null) value = Math.min(value, this.max);
            if (this.min != null) value = Math.max(value, this.min);
        }

        this.value = InputNumberElement.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    private _formatValue(n: InputNumberValue): string {
        return n?.toString().replace('.', ',') ?? '';
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: InputNumberValue): boolean {
        return this.value === value;
    }


    focus() {
        this._input.focus();
        this._input.setSelectionRange(this._input.value.length, this._input.value.length);
        this.fireFocusEvent();
    }


    blur() {
        this._input.blur();
        this.fireBlurEvent();
    }


    render() {
        return html`
            <div id="container" ?disabled=${this.disabled} ?readOnly=${this.readOnly} ?filled=${this.value !=null}>
                <div class="actionButton"
                    tabindex="-1"
                    ?hidden=${this.hasSameValueAs(this.defaultValue)}
                    @click=${this._onClearValue.bind(this)}>
                    ${this.defaultValue == this.emptyValue ? clearIcon : resetIcon}
                </div>
            
                <input id="input" @input=${()=> this._onInput()}
                    @focus=${this._onFocus.bind(this)}
                    @blur=${this._onBlur.bind(this)}
                    @keydown=${(e: KeyboardEvent) => this._onKeyDown(e)}
                    .name=${this.name}
                    .value=${this._formatValue(this.value)}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    .autocomplete=${this.autocomplete}
                    .autocapitalize=${this.autocapitalize}
                    .autofocus=${this.autofocus}
                    .inputMode=${this._computeInputMode()}
                    .placeholder=${this.placeholder ? this.placeholder : ''}
                    type="text">
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
            justify-content: flex-start;
            align-items: stretch;
            overflow: hidden;
            box-sizing: border-box;
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
            min-width: 0%;
            max-height: 100%;
            min-height: 32px;
            box-sizing: border-box;
            border: none;
            outline: 0;
            outline: none;
            padding: 0;
            margin: 0;
            padding: 4px 6px;
            font-family: inherit;
            font-size: 18px;
            line-height: 24px;
            color: inherit;
            background-color: inherit;
            text-align: right;
        }

        
        input::placeholder {
            color: var(--system-color-grey3);
        }

        #container[disabled] input::placeholder {
            color: transparent;
        }

        .actionButton {
            outline: 0;
            cursor: pointer;
            margin: 4px;
            flex-shrink: 0;
            color: var(--system-color-grey2);
        }

        .actionButton > svg {
            display: block;
            width: 24px;
            height: 24px;
        }

        .actionButton:hover,
        .actionButton:focus {
            color: var(--system-color-grey1);
        }

        #container[disabled] .actionButton,
        #container:not([filled]) .actionButton,
        #container[readOnly] .actionButton {
            display: none;
        }

        [hidden] {
            display: none;
        }
    `;
}