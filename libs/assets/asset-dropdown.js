import { html } from "../../node_modules/lit-html/lit-html.js";
import { LogicDropdown } from "../logics/logic-dropdown.js";
import { CustomElement } from "../../libs/CustomElement.js";
export class AssetDropdown extends CustomElement {
    constructor() {
        super();
    }
    getTemplate() {
        LogicDropdown;
        return html `
            <style>
                .overlay {
                    display: block;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, .1);
                }

                .menu {
                    --x-color: var(--system-color-base);
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                }

                .menu[dropdown-align~="left" i] {
                    align-items: flex-end;
                }

                .menu[dropdown-align~="right" i] {
                    align-items: flex-start;
                }

                .menu-content {
                    display: block;
                    box-sizing: border-box;
                    background-color: var(--x-color);
                    border-bottom: none;
                    border-radius: 16px;
                }

                .arrow-top,
                .arrow-bottom {
                    --x-size: 24px;

                    display: block;
                    margin: 0 var(--x-size);
                    width: var(--x-size);
                    height: var(--x-size);
                    fill: var(--x-color);
                }

                .menu:not([dropdown-align~="top" i]) .arrow-top {
                    display: none;
                }
                
                .menu:not([dropdown-align~="bottom" i]) .arrow-bottom {
                    display: none;
                }
            </style>

            <logic-dropdown>
                <div slot="overlay" class="overlay">
                    <slot name="overlay"></slot>
                </div>

                <div slot="button" class="button">
                    <slot name="button"></slot>
                </div>

                <div slot="menu" class="menu">
                    <svg class="arrow-bottom" viewBox="0 0 24 24">
                        <path d="M20.3,22l-4.9-8.5c-1.5-2.7-5.4-2.7-6.9,0L3.7,22c-0.7,1.2-2,2-3.5,2h23.6C22.4,24,21.1,23.2,20.3,22z"/>
                    </svg>

                    <div class="menu-content">
                        <slot name="menu"></slot>
                    </div>

                    <svg class="arrow-top" viewBox="0 0 24 24">
                        <path d="M3.7,2l4.9,8.5c1.5,2.7,5.4,2.7,6.9,0L20.3,2c0.7-1.2,2-2,3.5-2H0.2C1.6,0,2.9,0.8,3.7,2z"/>
                    </svg>
                </div>
            </logic-dropdown>
        `;
    }
}
AssetDropdown.registerCustomElement('asset-dropdown');
