import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { clear as clearIcon } from '../assets/icons.js';

import { InputElement, ITextBasedInputElement, AutocompleteType, InputModeType } from "./core/InputElement.js";


export type TextareaValue = string;


@customElement('input-textarea')
export class InputTextareaElement extends InputElement<TextareaValue> implements ITextBasedInputElement<TextareaValue> {
    readonly defaultValue: TextareaValue = '';

    @property()
    value: TextareaValue = '';


    @property({ attribute: true, converter: (v) => v?.trim() != "" ? v : null  })
    placeholder: string | null = null;


    @property({ attribute: true, reflect: true, type: Boolean })
    disabled: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    readOnly: boolean = false;


    @property({ attribute: true, type: String })
    autocomplete: AutocompleteType = AutocompleteType.Off;


    @property({ attribute: true })
    inputMode: InputModeType = InputModeType.Default;


    @query('#input')
    private _input!: HTMLInputElement;



    private _onInput() {
        const value = this._input.value;
        this._updateValue(value);
    }


    private _updateValue(value: TextareaValue): void {
        this.value = InputTextareaElement.applyFilters(this.filters, value);
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


    render() {
        return html`
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
    `;
}