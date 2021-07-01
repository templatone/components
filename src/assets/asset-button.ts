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
                <div class="overlay">
                    <slot></slot>
                </div>
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
}