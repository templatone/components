import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { InputElement } from "./core/InputElement.js";
import { attachment as attachmentIcon } from '../assets/icons.js';
import type { IInputElement } from './core/IInputElement.js';


export type InputFilesValue = File[];


@customElement('input-files')
export class InputFilesElement extends InputElement<InputFilesValue> implements IInputElement<InputFilesValue> {

    readonly defaultValue: InputFilesValue = [];

    @property()
    value: InputFilesValue = [];


    @property({ attribute: true, reflect: true, type: Boolean })
    disabled: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    readOnly: boolean = false;


    @property({ attribute: true })
    accept: string = "";


    @property({ attribute: true, type: Boolean })
    capture: boolean = false;


    @property({ attribute: true, type: Boolean })
    multiple: boolean = false;


    @query('#input')
    private _input!: HTMLInputElement;


    private _onFileSelect(e: Event) {
        const f = this._input.files;
        const value = f != null && f.length ? [...f] : [];

        this._updateValue(value);
    }


    private _updateValue(value: InputFilesValue): void {
        this.value = InputFilesElement.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    hasSameValueAs(value: InputFilesValue): boolean {
        if (this.value.length === value.length) {
            return this.value.reduce((acc: boolean, f) => acc && value.indexOf(f) >= 0, true)
        } else {
            return false;
        }
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    focus() {
        this._input.focus();
        this.fireFocusEvent();
    }


    blur() {
        this._input.blur();
        this.fireBlurEvent();
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
        display: block;
        overflow: hidden;
    }

    #container .button {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: var(--system-color-grey5);
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
        background-color: var(--system-color-grey4);
    }

    #container:focus-within:hover .button {
        background-color: var(--system-color-grey3);
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
    `;


    render() {
        return html`
            <div id="container" ?disabled=${this.disabled}>
                <div class="button">
                    <div class="icon">${attachmentIcon}</div>
            
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
}