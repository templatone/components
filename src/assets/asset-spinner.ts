import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';


@customElement('asset-spinner')
export class AssetSpinnerElement extends LitElement {
    // Define scoped styles right with your component, in plain CSS
    static styles = css`
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
}


/*
export class UISpinner extends CustomElement {

    constructor() {
        super();
    }

    getTemplate(): TemplateResult {
        const duration = 1000;

        return html`
            <style>
                :host {
                    --size: 24px;

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
                    animation-delay: ${-duration / 8 * 7}ms;
                }
                span:nth-child(2) {
                    transform: rotate(${360 / 8 * 1}deg);
                    animation-delay: ${-duration / 8 * 6}ms;
                }
                span:nth-child(3) {
                    transform: rotate(${360 / 8 * 2}deg);
                    animation-delay: ${-duration / 8 * 5}ms;
                }
                span:nth-child(4) {
                    transform: rotate(${360 / 8 * 3}deg);
                    animation-delay: ${-duration / 8 * 4}ms;
                }
                span:nth-child(5) {
                    transform: rotate(${360 / 8 * 4}deg);
                    animation-delay: ${-duration / 8 * 3}ms;
                }
                span:nth-child(6) {
                    transform: rotate(${360 / 8 * 5}deg);
                    animation-delay: ${-duration / 8 * 2}ms;
                }
                span:nth-child(7) {
                    transform: rotate(${360 / 8 * 6}deg);
                    animation-delay: ${-duration / 8 * 1}ms;
                }
                span:nth-child(8) {
                    transform: rotate(${360 / 8 * 7}deg);
                    animation-delay: ${-duration / 8 * 0}ms;
                }
            </style>

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

}
*/