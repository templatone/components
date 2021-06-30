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
import {LitElement, css, html} from "../web-modules/pkg/lit.js";
import {customElement, property} from "../web-modules/pkg/lit/decorators.js";
export let AssetButtonElement = class extends LitElement {
  constructor() {
    super(...arguments);
    this.disabled = false;
    this.primary = false;
  }
  render() {
    return html`
            <div tabindex="-1" id="container" ?disabled=${this.disabled}>
                <slot></slot>
            </div>
        `;
  }
};
AssetButtonElement.styles = css`
        :host(:disabled),
        :host([disabled]) {
            pointer-events: none;
        }


        #container {
            user-select: none;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background-color: var(--system-color-grey5);
            font-weight: 500;
            font-size: 18px;
            border-radius: 6px;
            width: 100%;
            height: 36px;
            box-sizing: border-box;
        }

        :host(:not([disabled]):hover) #container {
            background-color: var(--system-color-grey4);
        }

        :host(:not([disabled]):focus) #container {
            background-color: var(--system-color-grey3);
        }

        :host(:disabled) #container,
        :host([disabled]) #container {
            color: red;
            pointer-events: none;
        }
    `;
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], AssetButtonElement.prototype, "disabled", 2);
__decorate([
  property({attribute: true, reflect: true, type: Boolean})
], AssetButtonElement.prototype, "primary", 2);
AssetButtonElement = __decorate([
  customElement("asset-button")
], AssetButtonElement);
