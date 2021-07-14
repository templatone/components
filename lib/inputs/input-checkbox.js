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
import {customElement, property, query} from "../web-modules/pkg/lit/decorators.js";
import {InputElement} from "./core/InputElement.js";
var CheckboxValueOption;
(function(CheckboxValueOption2) {
  CheckboxValueOption2[CheckboxValueOption2["Unchecked"] = -1] = "Unchecked";
  CheckboxValueOption2[CheckboxValueOption2["Indeterminate"] = 0] = "Indeterminate";
  CheckboxValueOption2[CheckboxValueOption2["Checked"] = 1] = "Checked";
})(CheckboxValueOption || (CheckboxValueOption = {}));
export let InputCheckboxElement = class extends InputElement {
  constructor() {
    super(...arguments);
    this.emptyValue = -1;
    this.defaultValue = -1;
    this.value = -1;
    this.disabled = false;
    this.readOnly = false;
  }
  set checked(v) {
    this.value = v ? 1 : -1;
  }
  get checked() {
    return this.value === 1;
  }
  set indeterminate(v) {
    this.value = v ? 0 : -1;
  }
  get indeterminate() {
    return this.value === 0;
  }
  _negateValue(value) {
    return value === 1 ? -1 : 1;
  }
  _onPointer(e) {
    if (this.disabled || this.readOnly)
      return;
    console.log("_onPointer", this.value);
    if (!(e instanceof MouseEvent) && e.touches.length > 1)
      return;
    e.preventDefault();
    this._updateValue(this._negateValue(this.value));
  }
  _onKeyboard(e) {
    if (this.disabled || this.readOnly)
      return;
    let value = this.value;
    switch (e.code) {
      case "Enter":
      case "Space":
        value = this._negateValue(this.value);
        break;
      default:
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (this.value != value) {
      this._updateValue(value);
    }
  }
  _updateValue(value) {
    this.value = InputCheckboxElement.applyFilters(this.filters, value);
    this.fireUpdateEvent();
  }
  clearValue() {
    this._updateValue(this.defaultValue);
  }
  hasSameValueAs(value) {
    return this.value === value;
  }
  focus() {
    this._container.focus();
    this.fireFocusEvent();
  }
  blur() {
    this._container.blur();
    this.fireBlurEvent();
  }
  render() {
    return html`
            <div id="container"
                tabindex="0"
                ?checked=${this.checked}
                ?disabled=${this.disabled}
                @keydown=${(e) => this._onKeyboard(e)}
                @click=${(e) => this._onPointer(e)}
                @touchend=${(e) => this._onPointer(e)}">
                <div id="track"></div>
                <div id="fill">
                    <svg ?hidden=${!this.checked} viewBox="0 0 21 21">
                        <polygon points="16.1,5.1 8.5,12.7 4.9,9.1 3.5,10.5 8.5,15.5 17.5,6.5 "/>
                    </svg>

                    <svg ?hidden=${!this.indeterminate} viewBox="0 0 21 21">
                        <path d="M16,11.5H5v-2h11V11.5z"/>
                    </svg>
                </div>
            </div>
        `;
  }
};
InputCheckboxElement.styles = css`
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
        }

        #container {
            --x-size: 24px;
            --x-border-color: var(--system-color-grey1);

            outline: 0;
            display: block;
            width: var(--x-size);
            height: var(--x-size);
            border-radius: 6px;
        }

        #container:not(:focus-within) {
            --x-border-color: var(--system-color-grey2);
        }

        #track {
            display: block;
            width: var(--x-size);
            height: var(--x-size);
            box-sizing: border-box;
            margin-bottom: calc(var(--x-size) * -1);
            border-radius: inherit;
            background-color: var(--system-color-base);
            border: 2px solid var(--x-border-color);
        }

        [disabled] #track {
            background-color: transparent;
            color: var(--system-color-grey3);
        }

        #fill {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: var(--x-size);
            height: var(--x-size);
            margin-bottom: calc(var(--x-size) * -1);
            border-radius: inherit;
            background-color: var(--system-accentColor);
        }

        #fill:hover {
            background-color: var(--system-accentColor-hover);
        }

        :not([checked]) #fill {
            display: none;
        }

        svg {
            display: block;
            width: 22px;
            height: 22px;
            fill: #fff;
        }

        [hidden] {
            display: none;
        }
    `;
__decorate([
  property({type: Number})
], InputCheckboxElement.prototype, "value", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputCheckboxElement.prototype, "disabled", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputCheckboxElement.prototype, "readOnly", 2);
__decorate([
  query("#container")
], InputCheckboxElement.prototype, "_container", 2);
InputCheckboxElement = __decorate([
  customElement("input-checkbox")
], InputCheckboxElement);
