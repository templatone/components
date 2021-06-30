import { LitElement, css, html, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';


@customElement('asset-button')
export class AssetButtonElement extends LitElement {

    @property({ attribute: true, reflect: true, type: Boolean })
    disabled: boolean = false;

    @property({ attribute: true, reflect: true, type: Boolean })
    primary: boolean = false;


    render() {
        return html`
            <div tabindex="-1" id="container" ?disabled=${this.disabled}>
                <slot></slot>
            </div>
        `;
    }


    // updated(changedProperties: PropertyValues) {
    //     if (changedProperties.has('disabled')) {
    //         if (this.disabled === true) {
    //             console.log("A");
                
    //             this.style.pointerEvents = 'none';
    //         } else {
    //             console.log("B");
                
    //             this.style.pointerEvents = 'all';
    //         }
    //     }
    // }


    static styles = css`
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
}