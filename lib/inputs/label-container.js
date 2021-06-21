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
import {customElement} from "../web-modules/pkg/lit/decorators.js";
export let LabelContainerElement = class extends LitElement {
  render() {
    return html`
            <div id="container">
                <div id="label">
                    <slot name="label"></slot>
                </div>
                <slot></slot>
            </div>
        `;
  }
};
LabelContainerElement.styles = css`
        :host {
            display: block;
            box-sizing: border-box;
        }

        #container {
            --x-transition-duration: .3s;
            --x-pading: 10px;

            padding: var(--x-pading);
            border-radius: calc(6px + var(--x-pading));
            background-color: var(--system-color-grey6);

            transition-property: background-color;
            transition-duration: var(--x-transition-duration);
        }

        #container:not(:focus-within) {
            background: transparent;
        }

        ::slotted([slot=label]) {
            display: block;
            margin-bottom: 4px;
            font-weight: 500;
            line-height: 1;
            font-size: 18px;
            height: 18px;
            color: var(--system-color-label);
            transform-origin: left bottom;

            transition-property: transform, color, letter-spacing, font-weight;
            transition-duration: var(--x-transition-duration);
        }

        #container:not(:focus-within) ::slotted([slot=label]) {
            transform: scale(.7);
            font-weight: 600;
            letter-spacing: .06em;
            color: var(--system-color-grey1);
        }

        #label:empty {
            display: none;
        }

        [hidden] {
            display: none;
        }
    `;
LabelContainerElement = __decorate([
  customElement("label-container")
], LabelContainerElement);
