import { html, TemplateResult } from "../../node_modules/lit-html/lit-html.js";
import { Input, IInputTextBased, INPUTMODE } from "./Input.js";


const regex = {
    spaces: /\s+/g,
    validChars: /[^0-9,.+\- ]/g,
    decimalSeparator: /\.|\,/
}

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
        justify-content: flex-start;
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
        color: var(--system-color-gray3);
    }

    #container[disabled] input::placeholder {
        color: transparent;
    }

    .clear-button {
        outline: 0;
        cursor: pointer;
        margin: 4px;
        flex-shrink: 0;
        color: var(--system-color-gray2);
    }

    .clear-button:hover,
    .clear-button:focus {
        color: var(--system-color-gray1);
    }

    #container[disabled] .clear-button,
    #container:not([filled]) .clear-button {
        display: none;
    }

    [hidden] {
        display: none;
    }
</style>`;


export type NumberValue = number | null;

export class InputNumber extends Input<NumberValue> implements IInputTextBased<NumberValue> {

    // Properties
    readonly defaultValue: NumberValue = 0;

    private _min: number | null = null;
    get min(): number | null { return this._min; }
    set min(v: number | null) {
        this._min = v;
        this.invalidate();
    }

    private _max: number | null = null;
    get max(): number | null { return this._max; }
    set max(v: number | null) {
        this._max = v;
        this.invalidate();
    }

    private _step: number | null = null;
    get step(): number | null { return this._step; }
    set step(v: number | null) {
        this._step = v;

        if (Number.isInteger(this._step)) this._computedInputMode = INPUTMODE.Decimal;
        else this._computedInputMode = INPUTMODE.Numeric;

        this.invalidate();
    }

    private _value: NumberValue = 0;
    get value(): NumberValue { return this._value; }
    set value(v: NumberValue) {
        this._value = v;
        this.invalidate();
    }


    private _placeholder: string | null = null;
    get placeholder(): string | null { return this._placeholder; }
    set placeholder(v: string | null) {
        this._placeholder = v;
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


    private _computedInputMode: INPUTMODE = INPUTMODE.Decimal;
    private _inputMode: INPUTMODE = INPUTMODE.Decimal;
    get inputMode(): INPUTMODE { return this._inputMode; }
    set inputMode(v: INPUTMODE) {
        this._inputMode = v;
        this.invalidate();
    }

    // Elements
    private _inputEl!: HTMLInputElement;


    constructor() {
        super();

        this._inputEl = this.shadowRoot!.getElementById('input') as HTMLInputElement;
    }


    private _onInput() {
        const rawValue = this._inputEl.value;
        
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
        this._updateValue(!isNaN(n) ? n : null);
    }


    private _onBlur() {
        this._inputEl.value = this._formatValue(this.value);
    }


    private _onKeyDown(e: KeyboardEvent) {
        const increment = (direction: -1|1) => {
            e.preventDefault();

            const v: number = this.step ?? 1;
            this._updateValue((this.value ?? 0) + (v * (e.shiftKey ? 10 : 1) * direction));
        }

        switch (e.key) {
            case 'ArrowUp': increment(1); break;
            case 'ArrowDown': increment(-1); break;
        }
    }


    private _onClearValue() {
        this.clearValue();
        this.focus();
    }


    private _updateValue(value: NumberValue): void {
        if (value != null) {
            if (this.max != null) value = Math.min(value, this.max);
            if (this.min != null) value = Math.max(value, this.min);
        }

        this._value = InputNumber.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    private _formatValue(n: NumberValue): string {
        return n?.toString().replace('.', ',') ?? '';
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: NumberValue): boolean {
        return this.value === value;
    }


    focus() {
        this._inputEl.focus();
        this.fireFocusEvent();
    }


    blur() {
        this._inputEl.blur();
        this.fireBlurEvent();
    }


    // Attributes
    static get observedAttributes() {
        return ['autocomplete', 'readonly', 'disabled', 'placeholder', 'label', 'min', 'max', 'step', 'value'];
    }


    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name.toLocaleLowerCase()) {
            case 'value':
                this.value = newValue ? parseFloat(newValue) : null;
                break;

            case 'min':
                this.min = newValue ? parseFloat(newValue) : null;
                break;

            case 'max':
                this.max = newValue ? parseFloat(newValue) : null;
                break;

            case 'step':
                this.step = newValue ? parseFloat(newValue) : null;
                break;

            case 'placeholder':
                this.placeholder = newValue;
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

            <div id="container" ?disabled=${this.disabled} ?filled=${this.value != null}>
                <div class="clear-button"
                    tabindex="-1"
                    ?hidden=${this.hasSameValueAs(this.defaultValue)}
                    @click=${() => this._onClearValue()}>
                    <!-- TODO: --> Clear
                </div>

                <input
                    id="input"
                    @input=${() => this._onInput()} 
                    @blur=${() => this._onBlur()}
                    @keydown=${(e: KeyboardEvent) => this._onKeyDown(e)}
                    .value=${this._formatValue(this.value)}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    .autocomplete=${this.autocomplete}
                    .inputMode=${this.inputMode == INPUTMODE.Default ? this._computedInputMode : this.inputMode}
                    placeholder=${this.placeholder ? this.placeholder : ''}
                    type="text">
            </div>
        `;
    }
}

InputNumber.registerCustomElement('input-number');