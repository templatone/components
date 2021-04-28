import { html, TemplateResult } from "../../node_modules/lit-html/lit-html.js";
import { Input, IInputTextBased, INPUTMODE } from "./Input.js";


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


export type TextValue = string | null;

export class InputText extends Input<TextValue> implements IInputTextBased<TextValue> {

    // Properties
    readonly defaultValue: TextValue = '';

    private _value: TextValue = '';
    get value(): TextValue { return this._value; }
    set value(v: TextValue) {
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


    private _inputMode: INPUTMODE = INPUTMODE.Default;
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
        const value = this._inputEl.value;
        this._updateValue(value);
    }


    private _onClearValue() {
        this.clearValue();
        this.focus();
    }


    private _updateValue(value: TextValue): void {
        // this._value = InputText.applyFilters(this.filters, value);
        this.value = InputText.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: TextValue): boolean {
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
        return ['autocomplete', 'readonly', 'disabled', 'placeholder', 'value'];
    }


    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        switch (name.toLocaleLowerCase()) {
            case 'value':
                this.value = newValue ?? "";
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
            
            <div id="container" ?disabled=${this.disabled} ?filled=${this.value !=null}>
                <input id="input" @input=${(e: InputEvent)=> this._onInput()}
                .value=${this.value}
                .disabled=${this.disabled}
                .readOnly=${this.readOnly}
                .autocomplete=${this.autocomplete}
                .inputMode=${this.inputMode}
                placeholder=${this.placeholder ? this.placeholder : ''}
                type="text">
            
                <div class="clear-button"
                    tabindex="-1"
                    ?hidden=${this.hasSameValueAs(this.defaultValue)}
                    @click=${()=> this._onClearValue()}>
                    <!-- TODO --> Clear
                </div>
            </div>
        `;
    }
}

InputText.registerCustomElement('input-text');