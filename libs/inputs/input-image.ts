import { Utils } from "../Utils.js";
import { html, render, TemplateResult, RenderOptions } from "../../node_modules/lit-html/lit-html.js";
import { IInput, Input } from "./Input.js";


const style = html`
<style>
    :host {
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        align-items: stretch;
        box-sizing: border-box;
    }

    #button {
        display: block;
        overflow: hidden;
    }

    #button .buttonface {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: var(--system-color-gray5);
        font-weight: 500;
        /* border: 2px solid var(--x-border-color); */
        border-radius: 6px;

        width: 100%;
        height: 36px;
        box-sizing: border-box;
        margin-bottom: -36px;
    }

    #button:focus-within .buttonface,
    #button:hover .buttonface {
        background-color: var(--system-color-gray4);
    }

    #button:focus-within:hover .buttonface {
        background-color: var(--system-color-gray3);
    }

    .icon {
        display: block;
        width: 24px;
        height: 24px;
        margin: 0 8px;
    }

    .icon:first-child {
        margin-left: 0;
    }
    
    .icon:last-child {
        margin-right: 0;
    }

    .file {
        display: block;

        width: 100%;
        height: 36px;
    }

    input[type=file] {
        display: block;
        min-width: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
        min-height: 0 !important;
        max-height: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        outline: 0 !important;
        box-sizing: border-box !important;
        background-color: transparent !important;
        opacity: 0 !important;
        cursor: inherit !important;
    }

    [hidden] {
        display: none;
    }

    #thumbnailContainer {
        display: flex;
        flex-direction: row;
        overflow-x: auto;
        width: 100%;
        margin-top: 10px;
        border-radius: 6px;
        scroll-snap-type: x mandatory;
    }

    #thumbnailContainer:empty {
        display: none;
    }

    .thumbnail {
        scroll-snap-align: start;
        overflow: hidden;
        flex-shrink: 0;
        height: 128px;
        border-radius: 6px;
    }

    .thumbnail + .thumbnail {
        margin-left: 10px;
    }

    .thumbnail img {
        display: block;
        height: 100%;
        user-select: none;
        /* pointer-events: none; */
    }


    .buttonicon {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: var(--system-color-gray5);
        font-weight: 500;
        border-radius: 6px;
        box-sizing: border-box;
    }

    .buttonicon:focus-within,
    .buttonicon:hover {
        background-color: var(--system-color-gray4);
    }

    .buttonicon:hover {
        background-color: var(--system-color-gray3);
    }


    .thumbnail .close {
        cursor: pointer;
        position: relative;
        top: 8px;
        left: 8px;
        display: block;
        width: 24px;
        height: 24px;
        margin-bottom: -24px;
    }
</style>`;


export type ImageValue = HTMLImageElement[] | null;

export class InputImage extends Input<ImageValue> implements IInput<ImageValue> {

    readonly defaultValue: ImageValue = null;

    private _value: ImageValue = null;
    get value(): ImageValue { return this._value; }
    set value(v: ImageValue) {
        this._value = v;
        this.invalidate();
    }

    private _disabled: boolean = false;
    get disabled(): boolean { return this._disabled; }
    set disabled(v: boolean) {
        this._disabled = v;
        this.invalidate();
    }

    private _readOnly: boolean = false;
    get readOnly(): boolean { return this._readOnly; }
    set readOnly(v: boolean) {
        this._readOnly = v;
        this.invalidate();
    }

    accept: string = "";
    capture: boolean = false;
    multiple: boolean = false;


    private _inputEl!: HTMLInputElement;


    get files(): FileList | null {
        return this._inputEl.files;
    }
    set files(value: FileList | null) {
        this._inputEl.files = value;
    }


    constructor() {
        super();

        this._inputEl = this.shadowRoot!.getElementById('input') as HTMLInputElement;
    }


    private async _onFileSelect(e: Event) {
        const files = ((v) => {
            return v != null ? [...v] : [];
        })(this._inputEl.files)
        

        if (files.length > 0) {
            const promises = files.map(f => Utils.getImageFormFile(f));
            const images = await Promise.all(promises)

            this._addImages(...images);
        }
    }


    private _addImages(...images: HTMLImageElement[]) {
        if (this.multiple) {
            this._updateValue([...(this.value ?? []), ...images]);
        } else {
            this._updateValue(images.slice(0, 1));
        }
    }


    private _removeImageByIndex(index: number) {
        console.log(index);
        
        if (this.value == null) return;

        const images = [...this.value];
        images.splice(index, 1);

        this._updateValue(images);
    }


    private _updateValue(value: ImageValue): void {
        if (value !== null && value.length === 0) value = null;


        this._value = InputImage.applyFilters(this.filters, value);
        this.fireUpdateEvent();

        this.invalidate();
    }

    hasSameValueAs(value: ImageValue): boolean {
        return this.value === value;
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    focus() {
        this._inputEl.focus();
        this.fireFocusEvent();
    }


    blur() {
        this._inputEl.blur();
        this.fireBlurEvent();
    }


    private _getThumbnails(): TemplateResult[] {
        if (this.value == null) return [];

        const urls = this.value.map(img => img.src);

        return urls.map((url, i) => html`
            <div class="thumbnail">
                <div class="close buttonicon" @click=${() => this._removeImageByIndex(i)}>
                    <svg class="icon" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                    </svg>
                </div>

                <img .src=${url}>
            </div>
        `);
    }


    getTemplate(): TemplateResult {
        return html`
            ${style}
            
            <div id="container" ?disabled=${this.disabled}>
                <div id="button" ?disabled=${this.disabled}>
                    <div class="buttonface">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
                        </svg>
                
                        <span>${this.multiple ? "Vybrat obrázky" : "Vybrat obrázek"}</span>
                    </div>
                
                    <div class="file">
                        <input id="input"
                            accept="image/*"
                            ?capture=${this.capture}
                            ?multiple=${this.multiple}
                            ?disabled=${this.disabled}
                            ?autofocus=${this.autofocus}
                            @change=${(e: any) => this._onFileSelect(e)}
                        type="file">
                    </div>
                </div>

                <div id="thumbnailContainer" ?hidden=${this._getThumbnails().length == 0}>${this._getThumbnails()}</div>
            </div>
        `;
    }


    static get observedAttributes() {
        return [ 'accept', 'capture', 'disabled', 'multiple', 'readonly' ];
    }


    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue == newValue) return;

        switch (name.toLocaleLowerCase()) {
            case 'accept':
                this.accept = newValue ?? '';
                break;

            case 'capture':
                this.capture = newValue != null;
                break;

            case 'disabled':
                this.disabled = newValue != null;
                break;

            case 'readonly':
                this.readOnly = newValue != null;
                break;

            case 'multiple':
                this.multiple = newValue != null;
                break;
        }
    }

}

InputImage.registerCustomElement('input-image');