import { html, render, TemplateResult, RenderOptions } from "../../node_modules/lit-html/lit-html.js";
import { IInput, Input } from "./Input.js";


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
        display: block;
        overflow: hidden;
    }

    #container .button {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: var(--system-color-gray5);
        font-weight: 500;
        /* border: 2px solid var(--x-border-color); */
        border-radius: 6px;

        width: 100%;
        height: 36px;
        box-sizing: border-box;
        margin-bottom: -36px;
    }

    #container:focus-within .button,
    #container:hover .button {
        background-color: var(--system-color-gray4);
    }

    #container:focus-within:hover .button {
        background-color: var(--system-color-gray3);
    }

    .icon {
        display: block;
        width: 24px;
        height: 24px;
        margin: 0 8px;
    }

    .icon:first-child {
        margin-left: 0;
    }
    
    .icon:last-child {
        margin-right: 0;
    }

    .file {
        display: block;

        width: 100%;
        height: 36px;
    }

    input[type=file] {
        display: block;
        min-width: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
        min-height: 0 !important;
        max-height: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        outline: 0 !important;
        box-sizing: border-box !important;
        background-color: transparent !important;
        opacity: 0 !important;
        cursor: inherit !important;
    }

    [hidden] {
        display: none;
    }
</style>`;


export type FileValue = File[] | null;

export class InputFile extends Input<FileValue> implements IInput<FileValue> {

    readonly defaultValue: FileValue = null;

    private _value: FileValue = null;
    get value(): FileValue { return this._value; }
    set value(v: FileValue) {
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

    accept: string = "";
    capture: boolean = false;
    multiple: boolean = false;


    private _inputEl!: HTMLInputElement;


    get files(): FileList | null {
        return this._inputEl.files;
    }
    set files(value: FileList | null) {
        this._inputEl.files = value;
    }


    constructor() {
        super();

        this._inputEl = this.shadowRoot!.getElementById('input') as HTMLInputElement;
    }


    private _onFileSelect(e: Event) {
        const f = this._inputEl.files;
        const value = f != null && f.length ? [...f] : null;

        this._updateValue(value);
    }


    private _updateValue(value: FileValue): void {
        this._value = InputFile.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    hasSameValueAs(value: FileValue): boolean {
        return this.value === value;
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    focus() {
        this._inputEl.focus();
        this.fireFocusEvent();
    }


    blur() {
        this._inputEl.blur();
        this.fireBlurEvent();
    }


    private _showSpinner: boolean = false;
    public get showSpinner(): boolean {
        return this._showSpinner;
    }
    public set showSpinner(value: boolean) {
        this._showSpinner = value;
        this.invalidate();
    }


    getTemplate(): TemplateResult {
        return html`
            ${style}
            
            <div id="container" ?disabled=${this.disabled}>
                <div class="button">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path
                            d="M2 12.5C2 9.46 4.46 7 7.5 7H18c2.21 0 4 1.79 4 4s-1.79 4-4 4H9.5C8.12 15 7 13.88 7 12.5S8.12 10 9.5 10H17v2H9.41c-.55 0-.55 1 0 1H18c1.1 0 2-.9 2-2s-.9-2-2-2H7.5C5.57 9 4 10.57 4 12.5S5.57 16 7.5 16H17v2H7.5C4.46 18 2 15.54 2 12.5z" />
                    </svg>
            
                    <span>${this.multiple ? "Vybrat soubory" : "Vybrat soubor"}</span>
                </div>
            
                <div class="file">
                    <input id="input"
                        .accept=${this.accept}
                        ?capture=${this.capture}
                        ?multiple=${this.multiple}
                        ?disabled=${this.disabled}
                        ?autofocus=${this.autofocus}
                        @change=${(e: any) => this._onFileSelect(e)}
                    type="file">
                </div>
            </div>
        `;
    }


    static get observedAttributes() {
        return [ 'accept', 'capture', 'disabled', 'multiple', 'readonly' ];
    }


    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue == newValue) return;

        switch (name.toLocaleLowerCase()) {
            case 'accept':
                this.accept = newValue ?? '';
                break;

            case 'capture':
                this.capture = newValue != null;
                break;

            case 'disabled':
                this.disabled = newValue != null;
                break;

            case 'readonly':
                this.readOnly = newValue != null;
                break;

            case 'multiple':
                this.multiple = newValue != null;
                break;
        }
    }

}

InputFile.registerCustomElement('input-file');