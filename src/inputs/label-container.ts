import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';


export type TextValue = string | null;


@customElement('label-container')
export class LabelContainer extends LitElement {

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


    static styles = css`
        :host {
            display: block;
            box-sizing: border-box;
        }

        #container {
            --x-transition-duration: .3s;
            --x-pading: 10px;

            padding: var(--x-pading);
            border-radius: calc(6px + var(--x-pading));
            background-color: var(--system-color-gray6);

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
            color: var(--system-color-gray1);
        }

        #label:empty {
            display: none;
        }

        [hidden] {
            display: none;
        }
    `;
}