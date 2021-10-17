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
export let InputToggleElement = class extends InputElement {
  constructor() {
    super(...arguments);
    this.emptyValue = false;
    this.defaultValue = false;
    this.value = false;
    this.disabled = false;
    this.readOnly = false;
    this.autofocus = false;
    this._pointerActive = false;
    this._pointerMovements = [];
    this._pointerLastX = NaN;
    this._skipClick = false;
  }
  get checked() {
    return this.value === true;
  }
  set checked(v) {
    this.value = v;
  }
  connectedCallback() {
    super.connectedCallback();
    const listenerOptions = {capture: false, passive: false};
    window.addEventListener("mouseup", (e) => this._onPointerEnd(e), listenerOptions);
    window.addEventListener("mouseleave", (e) => this._onPointerEnd(e), listenerOptions);
    window.addEventListener("mousemove", (e) => this._onPointerMove(e), listenerOptions);
    window.addEventListener("touchmove", (e) => this._onPointerMove(e), listenerOptions);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  _onPointerStart(e) {
    this._container.focus();
    this._pointerActive = true;
    this._pointerMovements = [];
    this._pointerLastX = NaN;
    this._onPointerMove(e);
  }
  _onPointerEnd(e, mayClicked = false) {
    if (this.disabled || this.readOnly)
      return;
    if (this._skipClick == false && mayClicked) {
      this.value = !this.value;
      this.fireUpdateEvent();
    }
    this._pointerActive = false;
    this._pointerMovements = [];
    this._pointerLastX = 0;
    this._skipClick = false;
    e.preventDefault();
  }
  _onPointerMove(e) {
    if (this.disabled || this.readOnly)
      return;
    if (!this._pointerActive)
      return;
    let clientX;
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
    } else {
      if (e.touches.length >= 2)
        return;
      const touch = e.touches[0];
      clientX = touch.clientX;
    }
    e.preventDefault();
    if (isNaN(this._pointerLastX)) {
      this._pointerLastX = clientX;
    } else {
      this._pointerMovements.push(clientX - this._pointerLastX);
      this._pointerLastX = clientX;
    }
    if (this._pointerMovements.length > 8) {
      this._pointerMovements = this._pointerMovements.slice(this._pointerMovements.length - 32);
      const movement = this._pointerMovements.reduce((acc, n) => acc += n, 0);
      if (movement > 8 && this.value == false) {
        this._skipClick = true;
        this._updateValue(true);
      } else if (movement < -8 && this.value == true) {
        this._skipClick = true;
        this._updateValue(false);
      }
    }
  }
  _onKeyboard(e) {
    if (this.disabled || this.readOnly)
      return;
    let value = this.value;
    switch (e.code) {
      case "Enter":
      case "Space":
        value = !value;
        break;
      case "ArrowLeft":
        value = false;
        break;
      case "ArrowRight":
        value = true;
        break;
      default:
        return;
    }
    e.preventDefault();
    if (this.value != value) {
      this._updateValue(value);
    }
  }
  _updateValue(value) {
    this.value = InputToggleElement.applyFilters(this.filters, value);
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
                ?autofocus=${this.autofocus}
                @keydown=${(e) => this._onKeyboard(e)}
                @mousedown=${(e) => this._onPointerStart(e)}
                @touchstart=${(e) => this._onPointerStart(e)}
                @mouseup=${(e) => this._onPointerEnd(e, true)}
                @touchend=${(e) => this._onPointerEnd(e, true)}
                @touchend=${(e) => this._onPointerEnd(e)}
                @touchcancel=${(e) => this._onPointerEnd(e)}>
                <div id="track"></div>
                <div id="bar">
                    <div id="handle"></div>
                </div>
            </div>
        `;
  }
};
InputToggleElement.styles = css`
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
        }

        #container {
            --x-height: 28px;
            --x-border-color: var(--system-color-grey1);

            display: block;
            width: 54px;
            height: var(--x-height);
            border-radius: var(--x-height);
            outline: 0;
        }

        #container:not(:focus-within) {
            --x-border-color: var(--system-color-grey2);
        }


        #track {
            display: block;
            width: 100%;
            height: var(--x-height);
            box-sizing: border-box;
            margin-bottom: calc(var(--x-height) * -1);
            border: 2px solid var(--x-border-color);
            border-radius: var(--x-height);
            background-color: var(--system-color-base);
        }

        [checked] #track {
            background-color: var(--system-accentColor);
            border-color: var(--system-accentColor);
        }

        [checked]:active #track {
            background-color: var(--system-accentColor-hover);
            border-color: var(--system-accentColor-hover);
        }


        #bar {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
            width: var(--x-height);
            height: var(--x-height);
            margin-bottom: calc(var(--x-height) * -1);
            border-radius: var(--x-height);
            transition: width .16s;
        }

        [checked] #bar {
            width: 100%;
        }

        [disabled] #bar {
            background-color: var(--system-color-grey3);
        }

        #handle {
            --x-outline: var(--system-color-grey1);
            --x-fill: var(--system-color-grey3);

            display: flex;
            width: var(--x-height);
            height: var(--x-height);
            justify-content: center;
            align-items: center;
        }

        #handle::before {
            content: '';
            box-sizing: border-box;
            width: 20px;
            height: 20px;
            border-radius: 20px;
            border: 2px solid var(--x-outline);
            background-color: var(--x-fill);
        }

        [checked] #handle {
            --x-outline: #fff;
            --x-fill: transparent;
        }
        
        [disabled] #handle {
            display: none;
        }

        [hidden] {
            display: none;
        }
    `;
__decorate([
  property({type: Boolean})
], InputToggleElement.prototype, "value", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputToggleElement.prototype, "disabled", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputToggleElement.prototype, "readOnly", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputToggleElement.prototype, "autofocus", 2);
__decorate([
  query("#container")
], InputToggleElement.prototype, "_container", 2);
InputToggleElement = __decorate([
  customElement("input-toggle")
], InputToggleElement);
