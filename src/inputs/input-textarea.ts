import { LitElement, css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { AutocapitalizeType } from './core/AutocapitalizeType.js';
import { AutocompleteType } from './core/AutocompleteType.js';
import { InputElement } from './core/InputElement.js';
import { InputModeType } from './core/InputModeType.js';
import type { ITextBasedInputElement } from './core/ITextBasedInputElement.js';


export type InputTextareaValue = string;


@customElement('input-textarea')
export class InputTextareaElement extends InputElement<InputTextareaValue> implements ITextBasedInputElement<InputTextareaValue> {
    readonly emptyValue: InputTextareaValue = '';
    defaultValue: InputTextareaValue = '';


    @state()
    private _value: InputTextareaValue = '';

    get value(): InputTextareaValue {
        return this._value;
    };

    set value(v: InputTextareaValue) {
        this._value = v;
        this._reflectValueToView();
    };


    @property({ attribute: true, converter: (v) => v?.trim() != "" ? v : null  })
    placeholder: string | null = null;


    @property({ attribute: true, reflect: true, type: Boolean })
    disabled: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    readOnly: boolean = false;


    @property({ attribute: true, type: String })
    autocomplete: AutocompleteType = AutocompleteType.Off;


    @property({ attribute: true })
    autocapitalize: AutocapitalizeType = AutocapitalizeType.Off;


    @property({ attribute: true })
    inputMode: InputModeType = InputModeType.Default;


    @property({ attribute: true })
    name: string = '';


    @query('#input')
    private _input?: HTMLInputElement;



    private _onInput() {
        const value = this._input!.value;
        this._updateValue(value);
    }


    private _updateValue(value: InputTextareaValue): void {
        this.value = InputTextareaElement.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    private _reflectValueToView(): void {
        if (this._input) {
            this._input.value = this._value;
        }
    }


    hasSameValueAs(value: InputTextareaValue): boolean {
        return this.value === value;
    }


    focus() {
        this._input?.focus();
        this.fireFocusEvent();
    }


    blur() {
        this._input?.blur();
        this._reflectValueToView();
        this.fireBlurEvent();
    }


    async connectedCallback() {
        super.connectedCallback();
        await 0;

        this._input!.value = this._value;
    }


    render() {
        return html`
            <div id="container" ?disabled=${this.disabled} ?readOnly=${this.readOnly}>
                <textarea id="input"
                    @input=${this._onInput.bind(this)}
                    .name=${this.name}
                    .disabled=${this.disabled}
                    .readOnly=${this.readOnly}
                    .autocomplete=${this.autocomplete}
                    .autocapitalize=${this.autocapitalize}
                    .autofocus=${this.autofocus}
                    .inputMode=${this.inputMode}
                    .placeholder=${this.placeholder ? this.placeholder : ''}></textarea>
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
            color: var(--system-color-grey3);
        }

        #container[disabled] textarea::placeholder {
            color: transparent;
        }

        [hidden] {
            display: none;
        }
    `;
}