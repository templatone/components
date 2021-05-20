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
export let AssetSpinner = class extends LitElement {
  render() {
    return html`
            <div id="container">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
  }
};
AssetSpinner.styles = css`
        :host {
            --size: 24px;
            --duration: 1000ms;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: var(--size);
            height: var(--size);
        }


        @keyframes segmentAnim {
            0% { opacity: .8; }
            100% { opacity: 0; }
        }


        #container {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            width: var(--size);
            height: var(--size);
            transform-origin: center;
        }

        span {
            --width: calc(var(--size) / 8);
            --height: calc(var(--size) / 2);

            display: block;
            width: var(--width);
            height: var(--height);
            margin-bottom: calc(var(--height) * -1);
            transform-origin: 50% 100%;
            animation-name: segmentAnim;
            animation-duration: var(--duration);
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }

        span::before {
            content: '';
            display: block;
            background-color: var(--system-color-label, #000);
            width: 100%;
            height: 61.8%;
            border-radius: var(--size);
        }

        span:nth-child(1) {
            transform: rotate(${360 / 8 * 0}deg);
            animation-delay: calc(var(--duration) / -8 * 7);
        }
        span:nth-child(2) {
            transform: rotate(${360 / 8 * 1}deg);
            animation-delay: calc(var(--duration) / -8 * 6);
        }
        span:nth-child(3) {
            transform: rotate(${360 / 8 * 2}deg);
            animation-delay: calc(var(--duration) / -8 * 5);
        }
        span:nth-child(4) {
            transform: rotate(${360 / 8 * 3}deg);
            animation-delay: calc(var(--duration) / -8 * 4);
        }
        span:nth-child(5) {
            transform: rotate(${360 / 8 * 4}deg);
            animation-delay: calc(var(--duration) / -8 * 3);
        }
        span:nth-child(6) {
            transform: rotate(${360 / 8 * 5}deg);
            animation-delay: calc(var(--duration) / -8 * 2);
        }
        span:nth-child(7) {
            transform: rotate(${360 / 8 * 6}deg);
            animation-delay: calc(var(--duration) / -8 * 1);
        }
        span:nth-child(8) {
            transform: rotate(${360 / 8 * 7}deg);
            animation-delay: calc(var(--duration) / -8 * 0);
        }
    `;
AssetSpinner = __decorate([
  customElement("asset-spinner")
], AssetSpinner);
