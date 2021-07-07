import { LitElement, css, html, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { InputElement } from "./core/InputElement.js";
import type { IInputElement } from "./core/IInputElement.js";
import { clear as clearIcon, images as imagesIcon } from '../assets/icons.js';
import { Images as ImagesUtils } from '@templatone/utils';


export type InputImagesValue = HTMLImageElement[];


@customElement('input-images')
export class InputImagesElement extends InputElement<InputImagesValue> implements IInputElement<InputImagesValue> {

    readonly defaultValue: InputImagesValue = [];

    @property({ type: Array })
    value: InputImagesValue = [];


    @property({ attribute: true, reflect: true, type: Boolean })
    disabled: boolean = false;


    @property({ attribute: true, reflect: true, type: Boolean })
    readOnly: boolean = false;


    @property({ attribute: true, type: Boolean })
    capture: boolean = false;


    @property({ attribute: true, type: Boolean })
    multiple: boolean = false;


    @query('#input')
    private _input!: HTMLInputElement;


    private async _onFileSelect(e: Event) {
        const f  = this._input.files;
        const files = f != null && f.length ? [...f] : [];
        

        if (files.length > 0) {
            const promises = files.map(f => ImagesUtils.getFormFile(f));
            const images = await Promise.all(promises)

            this._addImages(...images);

            this._input.value = '';
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


    private _updateValue(value: InputImagesValue): void {
        this.value = InputImagesElement.applyFilters(this.filters, value);
        this.fireUpdateEvent();
    }

    hasSameValueAs(value: InputImagesValue): boolean {
        return this.value === value;
    }


    clearValue() {
        this._updateValue(this.defaultValue);
    }


    focus() {
        this._input.focus();
        this.fireFocusEvent();
    }


    blur() {
        this._input.blur();
        this.fireBlurEvent();
    }


    private _renderThumbnails(): TemplateResult[] {
        if (this.value == null) return [];

        const urls = this.value.map(img => img.src);

        return urls.map((url, i) => html`
            <div class="thumbnail">
                <div class="close icon"
                    ?hidden=${!(this.disabled || this.readOnly)}
                    @click=${() => this._removeImageByIndex(i)}>
                    <div class="icon">${clearIcon}</div>
                </div>

                <img .src=${url}>
            </div>
        `);
    }


    render() {
        return html`
            <div id="container" ?disabled=${this.disabled}>
                <div id="button" ?disabled=${this.disabled} ?readOnly=${this.readOnly}>
                    <div class="button-face">
                        <div class="icon">${imagesIcon}</div>
                        <span>${this.multiple ? "Vybrat obrázky" : "Vybrat obrázek"}</span>
                    </div>
                
                    <div class="file">
                        <input id="input"
                            accept="image/*"
                            .capture=${this.capture}
                            .multiple=${this.multiple}
                            .readOnly=${this.readOnly}
                            .disabled=${this.disabled}
                            .autofocus=${this.autofocus}
                            @change=${(e: Event) => this._onFileSelect(e)}
                        type="file">
                    </div>
                </div>

                <div id="thumbnailContainer" ?hidden=${this._renderThumbnails().length == 0}>${this._renderThumbnails()}</div>
            </div>
        `;
    }


    static styles = css`
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

        #button[disabled],
        #button[readOnly] {
            pointer-events: none;
        }

        #button .button-face {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background-color: var(--system-color-grey5);
            font-weight: 500;
            border-radius: 6px;
            width: 100%;
            height: 36px;
            box-sizing: border-box;
            margin-bottom: -36px;
        }

        #button:focus-within .button-face,
        #button:hover .button-face {
            background-color: var(--system-color-grey4);
        }

        #button:focus-within:hover .button-face {
            background-color: var(--system-color-grey3);
        }


        #button[disabled] .button-face {
            background-color: transparent;
            color: var(--system-color-grey3);
            border: 2px solid currentColor;
            background-color: var(--system-color-grey6);
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
            pointer-events: none;
        }


        .thumbnail .icon {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background-color: var(--system-color-grey5);
            font-weight: 500;
            border-radius: 6px;
            box-sizing: border-box;
        }

        .thumbnail .icon > svg {
            display: block;
            width: 24px;
            height: 24px;
        }

        .thumbnail .icon:focus-within,
        .thumbnail .icon:hover {
            background-color: var(--system-color-grey4);
        }

        .thumbnail .icon:hover {
            background-color: var(--system-color-grey3);
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
    `;
}