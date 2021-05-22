import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { clear as clearIcon } from '../assets/icons.js';

import { InputElement, ITextBasedInputElement } from "./core/InputElement.js";
import { AutocompleteType } from './core/AutocompleteType.js';
import { InputModeType } from './core/InputModeType.js';


export type TextValue = string;


@customElement('input-text')
export class InputTextElement extends InputElement<TextValue> implements ITextBasedInputElement<TextValue> {
    // Properties
    readonly defaultValue: TextValue = '';

    @property()
    value: TextValue = '';


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


    private _onClearValue() {
        this.clearValue();
        this.focus();
    }


    private _updateValue(value: TextValue): void {
        this.value = InputTextElement.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    hasSameValueAs(value: TextValue): boolean {
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
    `;


    render() {
        return html`
            <div id="container" ?disabled=${this.disabled} ?filled=${this.value !=null}>
                <input id="input" @input=${(e: InputEvent)=> this._onInput()}
                .value=${this.value}
                ?disabled=${this.disabled}
                ?readOnly=${this.readOnly}
                .autocomplete=${this.autocomplete ? 'on' : 'off'}
                .inputMode=${this.inputMode}
                placeholder=${this.placeholder ? this.placeholder : ''}
                type="text">
            
                <div class="clear-button"
                    tabindex="-1"
                    ?hidden=${this.hasSameValueAs(this.defaultValue)}
                    @click=${()=> this._onClearValue()}>
                    ${clearIcon}
                </div>
            </div>
        `;
    }
}