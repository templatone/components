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
                <div class="overlay">
                    <slot></slot>
                </div>
            </div>
        `;
  }
};
AssetButtonElement.styles = css`
        :host(:disabled),
        :host([disabled]) {
            pointer-events: none;
        }


        :host {
            display: block;
            border-radius: 6px;
            font-weight: 500;
            font-size: 18px;
            line-height: 1;
            width: 100%;
            height: 36px;
            background-color: green;
        }

        #container {
            --bg: var(--system-color-grey5);
            --bg-focus: var(--system-color-grey3);
            --bg-hover: var(--system-color-grey4);
            --bg-active: var(--system-color-grey3);
            --text: var(--system-color-label);
        }

        :host([primary]) #container {
            --bg: var(--system-accentColor);
            --text: #fff;
        }

        #container {
            user-select: none;
            background-color: var(--bg);
            color: var(--text);
            border-radius: inherit;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            overflow: hidden;
        }

        #container .overlay {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
        }

        :host(:not([disabled]):not([primary]):focus) #container {
            background-color: var(--bg-focus);
        }
        
        :host(:not([disabled]):not([primary]):hover) #container {
            background-color: var(--bg-hover);
        }
        
        :host(:not([disabled]):not([primary]):hover) #container {
            background-color: var(--bg-active);
        }


        :host(:not([disabled])[primary]:focus) .overlay {
            background-color: rgba(0 0 0 / 4%);
        }

        :host(:not([disabled])[primary]:hover) .overlay {
            background-color: rgba(0 0 0 / 8%);
        }
        
        :host(:not([disabled])[primary]:active) .overlay {
            background-color: rgba(0 0 0 / 12%);
        }

        :host(:disabled) #container,
        :host([disabled]) #container {
            pointer-events: none;
            color: var(--system-color-grey3);
            background-color: var(--system-color-grey6);
            border: 2px solid var(--system-color-grey4);
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
