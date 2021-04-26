import { html, TemplateResult } from "../../node_modules/lit-html/lit-html.js";
import { Input, IInputTextBased } from "./Input.js";


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

    textarea {
        display: block;
        resize: vertical;
        width: 100%;
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

    textarea::placeholder {
        color: var(--system-color-gray3);
    }

    #container[disabled] textarea::placeholder {
        color: transparent;
    }

    [hidden] {
        display: none;
    }
</style>
`;

export type TextareaValue = string;

export class InputTextarea extends Input<TextareaValue> implements IInputTextBased<TextareaValue> {

    // Properties
    readonly defaultValue: TextareaValue = '';

    private _value: TextareaValue = '';
    get value(): TextareaValue { return this._value; }
    set value(v: TextareaValue) {
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


    // Elements
    private _input!: HTMLInputElement;


    constructor() {
        super();

        this._input = this.shadowRoot!.getElementById('input') as HTMLInputElement;
    }


    private _onInput() {
        const value = this._input.value;
        this._updateValue(value);
    }


    private _updateValue(value: TextareaValue): void {
        this._value = InputTextarea.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: TextareaValue): boolean {
        return this.value === value;
    }


    focus() {
        this._input.focus();
        this.fireFocusEvent();
    }


    blur() {
        this._input.blur();
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

            <div id="container" ?disabled=${this.disabled}>
                <textarea
                    id="input"
                    @input=${(e: InputEvent) => this._onInput()} 
                    .value=${this.value}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    .autocomplete=${this.autocomplete}
                    placeholder=${this.placeholder ? this.placeholder : ''}></textarea>
            </div>
        `;
    }
}

InputTextarea.registerCustomElement('input-textarea');