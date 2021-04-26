import { CustomElement } from "../../libs/CustomElement.js";
import { TemplateResult, html } from "../../node_modules/lit-html/lit-html.js";


const style = html`
<style>
    #button {
        position: relative;
        display: block;
        user-select: none;
        width: min-content;
    }

    #menu {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 0;
        width: min-content;
    }

    #menu:not([opened]) {
        display: none;
    }

    #overlay {
        pointer-events: none;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    #overlay:not([opened]) {
        display: none;
    }
</style>`;


export class LogicDropdown extends CustomElement {

    private _buttonEl: HTMLElement;
    private _menuEl: HTMLElement;
    private _overlayEl: HTMLElement;

    private _toggle_value: boolean = false;
    private get _toggle(): boolean { return this._toggle_value; }
    private set _toggle(v: boolean) {
        this._toggle_value = v;
        this.invalidate();
    }

    constructor() {
        super();

        this._buttonEl = this.shadowRoot!.getElementById('button') as HTMLElement;
        this._menuEl = this.shadowRoot!.getElementById('menu') as HTMLElement;
        this._overlayEl = this.shadowRoot!.getElementById('overlay') as HTMLElement;

        this._buttonEl.addEventListener('click', () => this._onToggle());

        const listenerOptions = { capture: false, passive: false };

        window.addEventListener('mousedown', (e) => this._onClickOutside(e), listenerOptions);
        window.addEventListener('touchstart', (e) => this._onClickOutside(e), listenerOptions);
        window.addEventListener('scroll', () => this._onScroll(), listenerOptions);
        window.addEventListener('resize', () => this._onScroll(), listenerOptions);
        window.addEventListener('keydown', (e) => this._onKeyboard(e), listenerOptions);

        document.addEventListener('focus', (e) => this._onFocusOutside(e), true)
    }


    private _onToggle() {
        if (this._toggle) {
            this.close();
        } else {
            this.open();
        }
    }


    private _onScroll() {
        if (!this._toggle) return;

        this._updateMenuPositionUI();
    }


    private _onKeyboard(e: KeyboardEvent) {
        if (!this._toggle) return;

        if (e.code == 'Escape') {
            e.preventDefault();
            e.stopPropagation();

            this.close();
        }
    }


    private _onClickOutside(e: MouseEvent | TouchEvent) {
        if (!this._toggle) return;

        const path = e.composedPath();

        for (let i = 0; i < path.length; i++) {
            const element = path[i];

            if (element == this._buttonEl || element == this._menuEl) return;
        }

        this.close();
    }


    private _onFocusOutside(e: FocusEvent)  {
        const path = e.composedPath();
        const index = path.findIndex(p => p == this);
        
        if (index == -1) this.close();
    }


    private _updateUI() {
        this._menuEl.style.zIndex = '';
        this._buttonEl.style.zIndex = '';
        this._overlayEl.style.zIndex = '';

        const z = this._computeMaxZIndex();
        this._menuEl.style.zIndex = (z + 1).toString();
        this._buttonEl.style.zIndex = (z + 1).toString();
        this._overlayEl.style.zIndex = z.toString();

        this._updateMenuPositionUI();
    }


    private _updateMenuPositionUI() {
        const buttonRect = this._buttonEl.getBoundingClientRect();
        const menuRect = this._menuEl.getBoundingClientRect();

        const viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

        const margin = 8;

        let left: number;
        let top: number;

        let alignHorizontal: 'left'|'right';
        let alignVertical: 'top'|'bottom';

        if ((buttonRect.left + menuRect.width) > viewportWidth) {
            // button ← menu            
            left = buttonRect.left + buttonRect.width - menuRect.width;
            alignHorizontal = 'left';
        } else {
            // button → menu
            left = buttonRect.left;
            alignHorizontal = 'right';
        }

        if ((buttonRect.top + buttonRect.height + menuRect.height) > viewportHeight) {
            // button ↑ menu
            top = buttonRect.top - menuRect.height;
            alignVertical = 'top';
        } else {
            // button ↓ menu
            top = buttonRect.top + buttonRect.height;
            alignVertical = 'bottom';
        }

        const _menuContentEl = this.querySelector('*[slot=menu]') as HTMLElement | null;
        if (_menuContentEl) _menuContentEl.setAttribute('dropdown-align', `${alignHorizontal} ${alignVertical}`);

        this._menuEl.style.left = `${left}px`;
        this._menuEl.style.top = `${top}px`;
    }


    private _computeMaxZIndex(): number {
        function getMaxZIndex(parent: HTMLElement, z: number = 0): number {
            const _z = parent.style.zIndex != "" ? parseInt(parent.style.zIndex, 10) : 0;
            if (_z > z) z = _z;

            const children = parent.shadowRoot ? parent.shadowRoot.children : parent.children;

            for (let i = 0; i < children.length; i++) {
                const child = children[i] as HTMLElement;
                z = getMaxZIndex(child, z)
            }

            return z;
        }

        return getMaxZIndex(document.body) + 1;
    }


    open() {
        this._toggle = true;
        this._updateUI();
    }


    close() {
        this._toggle = false;
        this._updateUI();
    }


    getTemplate(): TemplateResult {
        return html`
            ${style}

            <div id="button"><slot name="button"></slot></div>
            <div id="menu" ?opened=${this._toggle_value}><slot name="menu"></slot></div>
            <div id="overlay" ?opened=${this._toggle_value}><slot name="overlay"></slot></div>
        `;
    }
}


LogicDropdown.registerCustomElement('logic-dropdown');


export interface ILogicDropdownEventDetail {
    target: LogicDropdown,
    opened: boolean,
}


export class LogicDropdownEvent extends CustomEvent<ILogicDropdownEventDetail> {

    constructor(typeArg: string, target: LogicDropdown, opened: boolean) {
        super(typeArg, {
            detail: {
                target,
                opened,
            }
        })
    }

}