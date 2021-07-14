var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorate = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
import {css, html} from "../web-modules/pkg/lit.js";
import {customElement, property, query, state} from "../web-modules/pkg/lit/decorators.js";
import {AutocapitalizeType} from "./core/AutocapitalizeType.js";
import {AutocompleteType} from "./core/AutocompleteType.js";
import {InputElement} from "./core/InputElement.js";
import {InputModeType} from "./core/InputModeType.js";
export let InputTextareaElement = class extends InputElement {
  constructor() {
    super(...arguments);
    this.emptyValue = "";
    this.defaultValue = "";
    this._value = "";
    this.placeholder = null;
    this.disabled = false;
    this.readOnly = false;
    this.autocomplete = AutocompleteType.Off;
    this.autocapitalize = AutocapitalizeType.Off;
    this.inputMode = InputModeType.Default;
    this.name = "";
  }
  get value() {
    return this._value;
  }
  set value(v) {
    this._value = v;
    this._reflectValueToView();
  }
  _onInput() {
    const value = this._input.value;
    this._updateValue(value);
  }
  _updateValue(value) {
    this.value = InputTextareaElement.applyFilters(this.filters, value);
    this.fireUpdateEvent();
  }
  clearValue() {
    this._updateValue(this.defaultValue);
  }
  _reflectValueToView() {
    if (this._input) {
      this._input.value = this._value;
    }
  }
  hasSameValueAs(value) {
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
    this._input.value = this._value;
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
                    .placeholder=${this.placeholder ? this.placeholder : ""}></textarea>
            </div>
        `;
  }
};
InputTextareaElement.styles = css`
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
__decorate([
  state()
], InputTextareaElement.prototype, "_value", 2);
__decorate([
  property({attribute: true, converter: (v) => v?.trim() != "" ? v : null})
], InputTextareaElement.prototype, "placeholder", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputTextareaElement.prototype, "disabled", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputTextareaElement.prototype, "readOnly", 2);
__decorate([
  property({attribute: true, type: String})
], InputTextareaElement.prototype, "autocomplete", 2);
__decorate([
  property({attribute: true})
], InputTextareaElement.prototype, "autocapitalize", 2);
__decorate([
  property({attribute: true})
], InputTextareaElement.prototype, "inputMode", 2);
__decorate([
  property({attribute: true})
], InputTextareaElement.prototype, "name", 2);
__decorate([
  query("#input")
], InputTextareaElement.prototype, "_input", 2);
InputTextareaElement = __decorate([
  customElement("input-textarea")
], InputTextareaElement);
