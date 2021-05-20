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
import {css, html} from "../web-modules/pkg/lit.v2.0.0-rc.2.js";
import {customElement, property, query} from "../web-modules/pkg/lit.decorators.v2.0.0-rc.2.js";
import {InputElement} from "./core/InputElement.js";
const style = html`
<style>
    :host {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
    }

    #container {
        --x-size: 24px;
        --x-border-color: var(--system-color-gray1);

        outline: 0;
        display: block;
        width: var(--x-size);
        height: var(--x-size);
        border-radius: var(--x-size);
    }

    #container:not(:focus-within) {
        --x-border-color: var(--system-color-gray2);
    }

    #track {
        display: block;
        width: var(--x-size);
        height: var(--x-size);
        box-sizing: border-box;
        margin-bottom: calc(var(--x-size) * -1);
        border-radius: var(--x-size);
        background-color: var(--system-color-base);
        border: 2px solid var(--x-border-color);
    }

    [disabled] #track {
        background-color: transparent;
        color: var(--system-color-gray3);
    }

    #fill {
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--x-size);
        height: var(--x-size);
        margin-bottom: calc(var(--x-size) * -1);
        border-radius: var(--x-size);
        background-color: var(--system-accentColor);
        transition: width .16s;
    }

    #fill:active {
        background-color: var(--system-accentColor-hover);
    }

    #fill::before {
        display: block;
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 6px;
        background-color: #fff;
    }

    [disabled] #fill {
        background-color: var(--system-color-gray3);
    }
    
    :not([checked]) #fill {
        display: none;
    }

    [hidden] {
        display: none;
    }
</style>
`;
export let InputRadioElement = class extends InputElement {
  constructor() {
    super(...arguments);
    this.defaultValue = false;
    this.value = false;
    this.disabled = false;
    this.readOnly = false;
  }
  get checked() {
    return this.value === true;
  }
  set checked(v) {
    this.value = v;
  }
  _onPointer(e) {
    if (this.disabled || this.readOnly)
      return;
    if (!(e instanceof MouseEvent) && e.touches.length > 1)
      return;
    e.preventDefault();
    if (!this.value)
      this._updateValue(true);
  }
  _onKeyboard(e) {
    if (this.disabled || this.readOnly)
      return;
    switch (e.code) {
      case "Enter":
      case "Space":
        if (!this.value)
          this._updateValue(true);
        break;
      default:
        return;
    }
    e.preventDefault();
    e.stopPropagation();
  }
  _updateValue(value) {
    this.value = InputRadioElement.applyFilters(this.filters, value);
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
                ?checked=${this.value}
                ?disabled=${this.disabled}
                @keydown=${(e) => this._onKeyboard(e)}
                @click=${(e) => this._onPointer(e)}
                @touchend=${(e) => this._onPointer(e)}">
                <div id="track"></div>
                <div id="fill"></div>
            </div>
        `;
  }
};
InputRadioElement.styles = css`
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
        }

        #container {
            --x-size: 24px;
            --x-border-color: var(--system-color-gray1);

            outline: 0;
            display: block;
            width: var(--x-size);
            height: var(--x-size);
            border-radius: var(--x-size);
        }

        #container:not(:focus-within) {
            --x-border-color: var(--system-color-gray2);
        }

        #track {
            display: block;
            width: var(--x-size);
            height: var(--x-size);
            box-sizing: border-box;
            margin-bottom: calc(var(--x-size) * -1);
            border-radius: var(--x-size);
            background-color: var(--system-color-base);
            border: 2px solid var(--x-border-color);
        }

        [disabled] #track {
            background-color: transparent;
            color: var(--system-color-gray3);
        }

        #fill {
            display: flex;
            justify-content: center;
            align-items: center;
            width: var(--x-size);
            height: var(--x-size);
            margin-bottom: calc(var(--x-size) * -1);
            border-radius: var(--x-size);
            background-color: var(--system-accentColor);
            transition: width .16s;
        }

        #fill:active {
            background-color: var(--system-accentColor-hover);
        }

        #fill::before {
            display: block;
            content: '';
            width: 6px;
            height: 6px;
            border-radius: 6px;
            background-color: #fff;
        }

        [disabled] #fill {
            background-color: var(--system-color-gray3);
        }
        
        :not([checked]) #fill {
            display: none;
        }

        [hidden] {
            display: none;
        }
    `;
__decorate([
  property({type: Boolean})
], InputRadioElement.prototype, "value", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputRadioElement.prototype, "disabled", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputRadioElement.prototype, "readOnly", 2);
__decorate([
  query("#container")
], InputRadioElement.prototype, "_container", 2);
InputRadioElement = __decorate([
  customElement("input-radio")
], InputRadioElement);
