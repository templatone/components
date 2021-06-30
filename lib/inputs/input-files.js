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
import {attachment as attachmentIcon} from "../assets/icons.js";
export let InputFilesElement = class extends InputElement {
  constructor() {
    super(...arguments);
    this.defaultValue = [];
    this.value = [];
    this.disabled = false;
    this.readOnly = false;
    this.accept = "";
    this.capture = false;
    this.multiple = false;
  }
  _onFileSelect(e) {
    const f = this._input.files;
    const value = f != null && f.length ? [...f] : [];
    this._updateValue(value);
  }
  _updateValue(value) {
    this.value = InputFilesElement.applyFilters(this.filters, value);
    this.fireUpdateEvent();
  }
  hasSameValueAs(value) {
    if (this.value.length === value.length) {
      return this.value.reduce((acc, f) => acc && value.indexOf(f) >= 0, true);
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
                        @change=${(e) => this._onFileSelect(e)}
                    type="file">
                </div>
            </div>
        `;
  }
};
InputFilesElement.styles = css`
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
__decorate([
  property()
], InputFilesElement.prototype, "value", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputFilesElement.prototype, "disabled", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], InputFilesElement.prototype, "readOnly", 2);
__decorate([
  property({attribute: true})
], InputFilesElement.prototype, "accept", 2);
__decorate([
  property({attribute: true, type: Boolean})
], InputFilesElement.prototype, "capture", 2);
__decorate([
  property({attribute: true, type: Boolean})
], InputFilesElement.prototype, "multiple", 2);
__decorate([
  query("#input")
], InputFilesElement.prototype, "_input", 2);
InputFilesElement = __decorate([
  customElement("input-files")
], InputFilesElement);
