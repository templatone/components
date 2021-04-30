class RenderingLayer {
    constructor(canvas, width, height, pixelScale = 1, updateStyleSizeCallback = RenderingLayer.DEFAULT_UPDATESIZE_CALLBACK) {
        this._pixelScale = 1;
        // private _updateStyleSizeCallback: UpdateStyleSizeCallback | null = RenderingLayer.DEFAULT_UPDATESIZE_CALLBACK;
        this._updateStyleSizeCallback = null;
        this._width = 0;
        this._height = 0;
        this.gizmoVisibility = false;
        this.gizmoScale = 1;
        this._canvas = canvas;
        this.updateSize(width, height, pixelScale, updateStyleSizeCallback);
    }
    static get PIXELSCALE() { return window.devicePixelRatio; }
    get pixelScale() { return this._pixelScale; }
    get width() { return this._width; }
    get height() { return this._height; }
    /**
     *
     * @param width Width of canvas.
     * @param height Height of canvas.
     * @param pixelScale Resolution scale for retina stuff. If `undefined`, will used value from last time.
     * @param updateStyleSize If it is `true`, the style will be set by the callback `updateStyleSizeCallback`. If `undefined`, will used value from last time.

     */
    updateSize(width, height, pixelScale, updateStyleSizeCallback) {
        if (pixelScale !== undefined)
            this._pixelScale = Math.max(pixelScale, 0);
        this._width = Math.max(width, 0);
        this._height = Math.max(height, 0);
        this._canvas.width = this._width * this._pixelScale;
        this._canvas.height = this._height * this._pixelScale;
        if (updateStyleSizeCallback !== undefined) {
            this._updateStyleSizeCallback = updateStyleSizeCallback;
        }
        if (this._updateStyleSizeCallback !== null) {
            this._updateStyleSizeCallback(this._canvas, this._width, this._height, this._pixelScale);
        }
        this._renderingContext = this._canvas.getContext('2d', {
            willReadFrequently: true
        });
    }
    clear() {
        const pxs = this.pixelScale;
        this.resetMatrix();
        this._renderingContext.clearRect(0, 0, this.width * pxs, this.height * pxs);
    }
    getRenderingContext() {
        return this._renderingContext;
    }
    resetRenderingContext() {
        this._renderingContext = this._canvas.getContext('2d');
    }
    setImageSmoothing(toggle) {
        const ctx = this.getRenderingContext();
        ctx.msImageSmoothingEnabled = toggle;
        ctx.mozImageSmoothingEnabled = toggle;
        ctx.webkitImageSmoothingEnabled = toggle;
        ctx.imageSmoothingEnabled = toggle;
    }
    getCanvas() {
        return this._canvas;
    }
    setMatrixToTransform(transform) {
        this.resetMatrix();
        const pxs = this.pixelScale;
        const path = [];
        let t = transform;
        path.unshift(t);
        while (t.hasParent()) {
            t = t.getParent();
            path.unshift(t);
        }
        path.forEach(t => {
            this._renderingContext.translate(t.position.x * pxs, t.position.y * pxs);
            this._renderingContext.rotate(t.rotation.radians);
            this._renderingContext.scale(t.scale.x, t.scale.y);
        });
    }
    resetMatrix() {
        this._renderingContext.resetTransform();
    }
}
RenderingLayer.DEFAULT_UPDATESIZE_CALLBACK = (canvas, width, height, pixelScale) => {
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
};

class LayerBlender {
    constructor(width, height, compositeOperation) {
        const matteCanvas = document.createElement('canvas');
        const sourceCanvas = document.createElement('canvas');
        const resultCanvas = document.createElement('canvas');
        this.upperLayer = new RenderingLayer(matteCanvas, width, height);
        this.lowerLayer = new RenderingLayer(sourceCanvas, width, height);
        this._resultLayer = new RenderingLayer(resultCanvas, width, height);
        this.compositeOperation = compositeOperation;
    }
    render(renderingLayer) {
        const matteCanvas = this.upperLayer.getCanvas();
        const sourceCanvas = this.lowerLayer.getCanvas();
        const resultCanvas = this._resultLayer.getCanvas();
        this._resultLayer.clear();
        const resultCtx = this._resultLayer.getRenderingContext();
        resultCtx.globalCompositeOperation = "source-over" /* SourceOver */;
        resultCtx.drawImage(matteCanvas, 0, 0);
        resultCtx.globalCompositeOperation = this.compositeOperation;
        resultCtx.drawImage(sourceCanvas, 0, 0);
        const ctx = renderingLayer.getRenderingContext();
        ctx.drawImage(resultCanvas, 0, 0);
    }
    clear() {
        this.lowerLayer.clear();
        this.upperLayer.clear();
    }
}
// export const enum CompositeOperation {
//     SourceOver = 'source-over',
//     SourceAtop = 'source-atop',
//     SourceIn = 'source-in',
//     SourceOut = 'source-out',
//     DestinationOver = 'destination-over',
//     DestinationAtop = 'destination-atop',
//     DestinationIn = 'destination-in',
//     DestinationOut = 'destination-out',
//     Lighter = 'lighter',
//     Copy = 'copy',
//     XOR = 'xor',
// }

class TrackAlpha {
    constructor(width, height, inverted = false) {
        this._layerBlender = new LayerBlender(width, height, inverted ? "source-out" /* SourceOut */ : "source-in" /* SourceIn */);
    }
    get matteLayer() {
        return this._layerBlender.upperLayer;
    }
    get sourceLayer() {
        return this._layerBlender.lowerLayer;
    }
    render(renderingLayer) {
        // TODO: dodělat gizma
        this._layerBlender.render(renderingLayer);
    }
    clear() {
        this._layerBlender.clear();
    }
}

class Loop extends EventTarget {
    constructor() {
        super(...arguments);
        this._time = 0;
        this._startTimestamp = 0;
        this._previousTimestamp = 0;
        this._isRunningToggle = false;
        this._updateCallbacks = [];
    }
    get time() {
        return this._time;
    }
    addUpdateCallback(callback) {
        this._updateCallbacks.push(callback);
    }
    removeUpdateCallback(callback) {
        const i = this._updateCallbacks.indexOf(callback);
        if (i == -1) {
            throw new Error("Callback not found.");
        }
        this._updateCallbacks.splice(i, 1);
    }
    isRunning() {
        return this._isRunningToggle;
    }
    start() {
        this._isRunningToggle = true;
        this._startTimestamp = Date.now();
        this._previousTimestamp = Date.now();
        window.requestAnimationFrame(t => this._frame(t));
        this.dispatchEvent(new StartLoopEvent());
    }
    stop() {
        this._isRunningToggle = false;
        this.dispatchEvent(new StartLoopEvent());
    }
    update(time, delta) {
        this._updateCallbacks.forEach(callback => callback(time, delta));
    }
    _frame(time) {
        if (!this._isRunningToggle)
            return;
        const delta = ((n) => n > 1 ? n : 1)(time - this._previousTimestamp);
        this.update(this._time, delta);
        this._previousTimestamp = time;
        this._time += delta;
        window.requestAnimationFrame((t => {
            this._frame(t);
        }));
    }
}
class StartLoopEvent extends CustomEvent {
    constructor() {
        super(StartLoopEvent.arg);
    }
}

class Engine extends RenderingLayer {
    constructor(canvas, width, height, pixelScale = 1, updateStyleSizeCallback) {
        super(canvas, width, height, pixelScale, updateStyleSizeCallback);
        this.loop = new Loop();
        // this.debuggerBar = new DebuggerBar(this);
        // this.loop.addUpdateCallback((time: number, delta: number) => this.debuggerBar.update(time, delta));
    }
}

class Numbers {
    /**
     * Remapuje hodnotu na novou škálu
     * @param value Současná hodnota na remaping
     * @param min1 Současné minumunm
     * @param max1 Současné maximum
     * @param min2 Nové minimum
     * @param max2 Nové maximum
     */
    static remap(value, min1, max1, min2 = 0, max2 = 1) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    /**
     * „Ořízne“ číslo pokud není v zadaném rozsahu.
     * @param {number} value
     * @param {number} min
     * @param {number} max
     */
    static limit(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    /**
     * Vrátí náhodné číslo v daném rozsahu. <min, max)
     * @param min Minumum inkluzivně
     * @param max Maximum exkluzivně
     */
    static randomArbitrary(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    }
    /**
     * Vrátí náhodné celé číslo v daném rozsahu. <min, max>
     * @param min Minumum inkluzivně
     * @param max Maximum inkluzivně
     */
    static randomInt(min = 0, max = 1) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * Vrátí bod na křivce
     * @param t Procentuální průběh křivky <0, 1>
     * @param p1 Počáteční bod <0, 1>
     * @param p2 Koncový bod <0, 1>
     */
    static bezierCurve2(t, p1, p2) {
        const compute = (t, v1, v2) => {
            return (1 - t) * v1 + t * v2;
        };
        return {
            x: compute(t, p1.x, p2.x),
            y: compute(t, p1.y, p2.y),
        };
    }
    /**
     * Vrátí bod na křivce
     * @param t Procentuální průběh křivky <0, 1>
     * @param p1 Počáteční bod <0, 1>
     * @param p2 Společné táhlo <0, 1>
     * @param p3 Koncový bod <0, 1>
     */
    static bezierCurve3(t, p1, p2, p3) {
        const compute = (t, v1, v2, v3) => {
            return (1 - t) ** 2 * v1 + 2 * (1 - t) * t * v2 + t ** 2 * v3;
        };
        return {
            x: compute(t, p1.x, p2.x, p3.x),
            y: compute(t, p1.y, p2.y, p3.y),
        };
    }
    /**
     * Vrátí bod na křivce
     * @param t Procentuální průběh křivky <0, 1>
     * @param p1 Počáteční bod <0, 1>
     * @param p2 Táhlo počáteční bodu <0, 1>
     * @param p3 Táhlo koncového bodu <0, 1>
     * @param p4 Koncový bod <0, 1>
     */
    static bezierCurve4(t, p1, p2, p3, p4) {
        const compute = (t, v1, v2, v3, v4) => {
            return (1 - t) ** 3 * v1 + 3 * (1 - t) ** 2 * t * v2 + 3 * (1 - t) * t ** 2 * v3 + t ** 3 * v4;
        };
        return {
            x: compute(t, p1.x, p2.x, p3.x, p4.x),
            y: compute(t, p1.y, p2.y, p3.y, p4.y),
        };
    }
}

class Color {
    constructor(r = 0, g = 0, b = 0, alpha = 1) {
        this._red = 0;
        this._green = 0;
        this._blue = 0;
        this._alpha = 1;
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = alpha;
    }
    get red() { return this._red; }
    set red(v) {
        this._red = Numbers.limit(v, 0, 255);
    }
    get green() { return this._green; }
    set green(v) {
        this._green = Numbers.limit(v, 0, 255);
    }
    get blue() { return this._blue; }
    set blue(v) {
        this._blue = Numbers.limit(v, 0, 255);
    }
    get alpha() { return this._alpha; }
    set alpha(v) {
        this._alpha = Numbers.limit(v, 0, 1);
    }
    getRGBA() {
        return {
            red: this.red,
            green: this.green,
            blue: this.blue,
            alpha: this.alpha
        };
    }
    getRGB() {
        return {
            red: this.red,
            green: this.green,
            blue: this.blue,
        };
    }
    getHSLA() {
        return Color.convertRGBAtoHSLA(this.red, this.green, this.blue, this.alpha);
    }
    getHSL() {
        return Color.convertRGBtoHSL(this.red, this.green, this.blue);
    }
    getHue() {
        const c = this.getHSL();
        return c.hue;
    }
    getSaturation() {
        const c = this.getHSL();
        return c.saturation;
    }
    getLightness() {
        const c = this.getHSL();
        return c.lightness;
    }
    setRGBA(...values) {
        const entry = Color._parseEntryType_ColorRGBA(values);
        this.red = entry.red;
        this.green = entry.green;
        this.blue = entry.blue;
        this.alpha = entry.alpha;
        return this;
    }
    setRGB(...values) {
        const entry = Color._parseEntryType_ColorRGB(values);
        this.red = entry.red;
        this.green = entry.green;
        this.blue = entry.blue;
        return this;
    }
    setHSLA(...values) {
        const entry = Color._parseEntryType_ColorHSLA(values);
        const data = Color.convertHSLAtoRGBA(entry.hue, entry.saturation, entry.lightness, entry.alpha);
        this.red = data.red;
        this.green = data.green;
        this.blue = data.blue;
        this.alpha = data.alpha;
        return this;
    }
    setHSL(...values) {
        const entry = Color._parseEntryType_ColorHSL(values);
        const data = Color.convertHSLtoRGB(entry.hue, entry.saturation, entry.lightness);
        this.red = data.red;
        this.green = data.green;
        this.blue = data.blue;
        return this;
    }
    setHue(hue) {
        const c = this.getHSLA();
        this.setHSLA(hue, c.saturation, c.lightness, c.alpha);
    }
    setSaturation(saturation) {
        const c = this.getHSLA();
        this.setHSLA(c.hue, saturation, c.lightness, c.alpha);
    }
    setLightness(lightness) {
        const c = this.getHSLA();
        this.setHSLA(c.hue, c.saturation, lightness, c.alpha);
    }
    getHex() {
        return Color.convertRGBAtoHex(this.red, this.green, this.blue, this.alpha);
    }
    getCSSValue() {
        if (this.alpha < 1) {
            return `rgba(${this.red.toFixed(3)}, ${this.green.toFixed(3)}, ${this.blue.toFixed(3)}, ${this.alpha.toFixed(3)})`;
        }
        else {
            return this.getHex();
        }
    }
    computeStyle() {
        return Color.convertRGBAtoStyle(this);
    }
    /**
     * Returns cloned Color object
     * @returns {Color} Color
     */
    clone() {
        return new Color(this.red, this.green, this.blue, this.alpha);
    }
    /**
     * Create new Color object ❤️
     * @returns {Color} new Color
     */
    static get Red() {
        return new Color(255, 0, 0);
    }
    /**
     * Create new Color object 🟨
     * @returns {Color} new Color
     */
    static get Yellow() {
        return new Color(255, 255, 0);
    }
    /**
     * Create new Color object 🟩
     * @returns {Color} new Color
     */
    static get Green() {
        return new Color(0, 255, 0);
    }
    /**
     * Create new Color object 🟦
     * @returns {Color} new Color
     */
    static get Blue() {
        return new Color(0, 0, 255);
    }
    /**
     * Create new Color object 🟪
     * @returns {Color} new Color
     */
    static get Magenta() {
        return new Color(255, 0, 255);
    }
    /**
     * Create new Color object ⬛️
     * @returns {Color} new Color
     */
    static get Black() {
        return new Color(0, 0, 0);
    }
    /**
     * Create new Color object ⬜️
     * @returns {Color} new Color
     */
    static get White() {
        return new Color(255, 255, 255);
    }
    /**
     * Create new Color object 🐀
     * @returns {Color} new Color
     */
    static get Grey() {
        return new Color(127, 127, 127);
    }
    /**
     * Create new Color object 🏁
     * @returns {Color} new Color
     */
    static get Transparent() {
        return new Color(0, 0, 0, 0);
    }
    /**
     * Create new Color object from hexdec value
     * @param {string} value #RGB|#RRGGBB|#RRGGBBAA
     * @returns {Color} new Color
     */
    static fromHex(value) {
        value = value.trim();
        if (value.substr(0, 1) == '#') {
            value = value.substr(1);
        }
        let rr;
        let gg;
        let bb;
        let aa = null;
        if (value.length == 3) {
            rr = value.substring(0, 1) + value.substring(0, 1);
            gg = value.substring(1, 2) + value.substring(1, 2);
            bb = value.substring(2, 3) + value.substring(2, 3);
        }
        else if (value.length == 4) {
            rr = value.substring(0, 1) + value.substring(0, 1);
            gg = value.substring(1, 2) + value.substring(1, 2);
            bb = value.substring(2, 3) + value.substring(2, 3);
            aa = value.substring(3, 4) + value.substring(3, 4);
        }
        else if (value.length == 6) {
            rr = value.substring(0, 2);
            gg = value.substring(2, 4);
            bb = value.substring(4, 6);
        }
        else if (value.length == 8) {
            rr = value.substring(0, 2);
            gg = value.substring(2, 4);
            bb = value.substring(4, 6);
            aa = value.substring(6, 8);
        }
        else {
            throw new Error(`Color #${value} is not valid hex color value.`);
        }
        const r = parseInt(rr, 16);
        const g = parseInt(gg, 16);
        const b = parseInt(bb, 16);
        const a = aa ? parseInt(aa, 16) / 255 : 1;
        return Color.fromRGBA(r, g, b, a);
    }
    /**
     * Create new Color object from RGBA values
     * @param {number} r ❤️ Red channel <0, 255>
     * @param {number} g 💚 Green channel <0, 255>
     * @param {number} b 💙 Blue channel <0, 255>
     * @param {number} alpha 🏁 Alpha channel <0, 1>
     * @returns {Color} new Color
     */
    static fromRGBA(...values) {
        const entry = Color._parseEntryType_ColorRGBA(values);
        const color = new Color(entry.red, entry.green, entry.blue, entry.alpha);
        return color;
    }
    /**
     * Create new Color object from RGB values
     * @param {number} r ❤️ Red channel <0, 255>
     * @param {number} g 💚 Green channel <0, 255>
     * @param {number} b 💙 Blue channel <0, 255>
     * @returns {Color} new Color
     */
    static fromRGB(...values) {
        const entry = Color._parseEntryType_ColorRGB(values);
        const color = this.fromRGBA(entry.red, entry.green, entry.blue, 1);
        return color;
    }
    /**
     * Create new Color object from HSLA values
     * @param {number} h 🌈 Hue channel <0, 360)
     * @param {number} s ☯️ Saturation channel <0, 100>
     * @param {number} l ☀️ Lightness channel <0, 100>
     * @param {number} alpha 🏁 Alpha channel <0, 1>
     * @returns {Color} new Color
     */
    static fromHSLA(...values) {
        const entry = Color._parseEntryType_ColorHSLA(values);
        const data = Color.convertHSLAtoRGBA(entry.hue, entry.saturation, entry.lightness, entry.alpha);
        const color = new Color();
        color.red = data.red;
        color.green = data.green;
        color.blue = data.blue;
        color.alpha = data.alpha;
        return color;
    }
    /**
     * Create new Color object from HSL values
     * @param {number} h 🌈 Hue channel <0, 360)
     * @param {number} s ☯️ Saturation channel <0, 100>
     * @param {number} l ☀️ Lightness channel <0, 100>
     * @returns {Color} new Color
     */
    static fromHSL(...values) {
        const entry = Color._parseEntryType_ColorHSL(values);
        const color = this.fromHSLA(entry.hue, entry.saturation, entry.lightness, 1);
        return color;
    }
    static _parseEntryType_ColorRGBA(values) {
        if (values.length == 4) {
            return {
                red: values[0],
                green: values[1],
                blue: values[2],
                alpha: values[3],
            };
        }
        else {
            return values[0];
        }
    }
    static _parseEntryType_ColorRGB(values) {
        if (values.length == 3) {
            return {
                red: values[0],
                green: values[1],
                blue: values[2],
            };
        }
        else {
            return values[0];
        }
    }
    static _parseEntryType_ColorHSLA(values) {
        if (values.length == 4) {
            return {
                hue: values[0],
                saturation: values[1],
                lightness: values[2],
                alpha: values[3],
            };
        }
        else {
            return values[0];
        }
    }
    static _parseEntryType_ColorHSL(values) {
        if (values.length == 3) {
            return {
                hue: values[0],
                saturation: values[1],
                lightness: values[2],
            };
        }
        else {
            return values[0];
        }
    }
}
/**
 * Conver RGBA to HSLA
 * @param {number} r ❤️ Red channel <0, 255>
 * @param {number} g 💚 Green channel <0, 255>
 * @param {number} b 🟦 Blue channel <0, 255>
 * @param {number} alpha 🏁 Alpha channel <0, 1>
 * @returns IColorHSLA
 */
Color.convertRGBAtoHSLA = (...values) => {
    const entry = Color._parseEntryType_ColorRGBA(values);
    let r = Numbers.limit(entry.red, 0, 255);
    let g = Numbers.limit(entry.green, 0, 255);
    let b = Numbers.limit(entry.blue, 0, 255);
    let alpha = Numbers.limit(entry.alpha, 0, 1);
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0)
        h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s *= 100;
    l *= 100;
    return { hue: h, saturation: s, lightness: l, alpha };
};
/**
 * Conver RGB to HSL
 * @param {number} r ❤️ Red channel <0, 255>
 * @param {number} g 💚 Green channel <0, 255>
 * @param {number} b 🟦 Blue channel <0, 255>
 * @returns IColorHSL
 */
// static convertRGBtoHSL = (r: number, g: number, b: number): IColorHSL => {
Color.convertRGBtoHSL = (...values) => {
    const entry = Color._parseEntryType_ColorRGB(values);
    const c = Color.convertRGBAtoHSLA(entry.red, entry.green, entry.blue, 1);
    return {
        hue: c.hue,
        saturation: c.saturation,
        lightness: c.lightness,
    };
};
/**
 * Convert HSLA to RGBA
 * @param {number} h 🌈 Hue channel <0, 360)
 * @param {number} s ☯️ Saturation channel <0, 100>
 * @param {number} l ☀️ Lightness channel <0, 100>
 * @param {number} alpha 🏁 Alpha channel <0, 1>
 * @returns IColorRGBA
 */
Color.convertHSLAtoRGBA = (...values) => {
    const entry = Color._parseEntryType_ColorHSLA(values);
    let h = entry.hue;
    let s = entry.saturation;
    let l = entry.lightness;
    let alpha = entry.alpha;
    if (h > 0)
        while (h >= 360)
            h -= 360;
    else if (h < 0)
        while (h < 0)
            h += 360;
    s = Numbers.limit(s, 0, 100);
    l = Numbers.limit(l, 0, 100);
    alpha = Numbers.limit(alpha, 0, 1);
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    r = (r + m) * 255;
    g = (g + m) * 255;
    b = (b + m) * 255;
    return { red: r, green: g, blue: b, alpha };
};
/**
 * Convert HSL to RGB
 * @param {number} r ❤️ Red channel <0, 255>
 * @param {number} g 💚 Green channel <0, 255>
 * @param {number} b 🟦 Blue channel <0, 255>
 * @returns IColorRGB
 */
Color.convertHSLtoRGB = (...values) => {
    const entry = Color._parseEntryType_ColorHSL(values);
    const c = Color.convertHSLAtoRGBA(entry.hue, entry.saturation, entry.lightness, 1);
    return {
        red: c.red,
        green: c.green,
        blue: c.blue,
    };
};
/**
 * Convert RGBA to Hex
 * @param {number} r ❤️ Red channel <0, 255>
 * @param {number} g 💚 Green channel <0, 255>
 * @param {number} b 🟦 Blue channel <0, 255>
 * @param {number} alpha 🏁 Alpha channel <0, 1>
 * @returns string
 */
Color.convertRGBAtoHex = (...values) => {
    const entry = Color._parseEntryType_ColorRGBA(values);
    const red = Math.round(entry.red).toString(16);
    const green = Math.round(entry.green).toString(16);
    const blue = Math.round(entry.blue).toString(16);
    const alpha = Math.round(entry.alpha * 255).toString(16);
    const builder = ['#',
        red.length == 2 ? red : '0' + red,
        green.length == 2 ? green : '0' + green,
        blue.length == 2 ? blue : '0' + blue,
    ];
    if (entry.alpha < 1) {
        builder.push(alpha.length == 2 ? alpha : '0' + alpha);
    }
    return builder.join('');
};
/**
 * Convert RGB to Hex
 * @param {number} r ❤️ Red channel <0, 255>
 * @param {number} g 💚 Green channel <0, 255>
 * @param {number} b 🟦 Blue channel <0, 255>
 * @returns string
 */
Color.convertRGBtoHex = (...values) => {
    const entry = Color._parseEntryType_ColorRGB(values);
    return Color.convertRGBAtoHex(entry.red, entry.green, entry.blue, 1);
};
/**
 * Convert HSLA to Hex
 * @param {number} h 🌈 Hue channel <0, 360)
 * @param {number} s ☯️ Saturation channel <0, 100>
 * @param {number} l ☀️ Lightness channel <0, 100>
 * @param {number} alpha 🏁 Alpha channel <0, 1>
 * @returns string
 */
Color.convertHSLAtoHex = (...values) => {
    const entry = Color._parseEntryType_ColorHSLA(values);
    const data = Color.convertHSLAtoRGBA(entry.hue, entry.saturation, entry.lightness, entry.alpha);
    return Color.convertRGBAtoHex(data.red, data.green, data.blue, data.alpha);
};
/**
 * Convert HSL to Hex
 * @param {number} r ❤️ Red channel <0, 255>
 * @param {number} g 💚 Green channel <0, 255>
 * @param {number} b 🟦 Blue channel <0, 255>
 * @returns string
 */
Color.convertHSLtoHex = (...values) => {
    const entry = Color._parseEntryType_ColorHSL(values);
    const data = Color.convertHSLtoRGB(entry.hue, entry.saturation, entry.lightness);
    return Color.convertRGBtoHex(data.red, data.green, data.blue);
};
Color.convertRGBAtoStyle = (...values) => {
    const entry = Color._parseEntryType_ColorRGBA(values);
    return `rgba(${entry.red.toFixed(3)}, ${entry.green.toFixed(3)}, ${entry.blue.toFixed(3)}, ${entry.alpha.toFixed(3)})`;
};

class Style {
    constructor(style) {
        this._style = Style._parseEntryType_Style(style);
    }
    computeStyle(renderingLayer, boundingBox) {
        const v = this._style.computeStyle(renderingLayer, boundingBox);
        return v;
    }
    setStyle(style) {
        this._style = Style._parseEntryType_Style(style);
    }
    getStyle() {
        return this._style;
    }
    clone() {
        const thisStyle = this._style;
        const style = thisStyle.hasOwnProperty('clone') ? thisStyle.clone() : { ...this._style };
        return new Style(style);
    }
    static _parseEntryType_Style(raw) {
        const style = raw;
        if (typeof style === 'object' && typeof style.computeStyle === 'function') {
            return style;
        }
        else {
            return {
                computeStyle: (renderingLayer, boundingBox) => {
                    return style;
                }
            };
        }
    }
}

class Fill extends Style {
    constructor(style = Color.Grey) {
        super(style);
    }
    apply(renderingLayer, boundingBox) {
        const ctx = renderingLayer.getRenderingContext();
        ctx.fillStyle = this.computeStyle(renderingLayer, boundingBox);
    }
    clone() {
        const style = super.clone();
        return new Fill(style);
    }
    static clear(renderingLayer) {
        const ctx = renderingLayer.getRenderingContext();
        ctx.fillStyle = 'transparent';
    }
}

class Font {
    constructor(size = 12, family = 'sans-serif') {
        this.weight = 400;
        this.italic = false;
        this.letterSpacing = 0;
        this.features = [];
        this.align = "left";
        this.baseline = "alphabetic";
        this.size = size;
        this.lineHeight = this.size * 1.5;
        this.family = family;
    }
    apply(renderingLayer) {
        const ctx = renderingLayer.getRenderingContext();
        const pxs = renderingLayer.pixelScale;
        const canvas = renderingLayer.getCanvas();
        canvas.style.letterSpacing = `${this.letterSpacing}em`;
        canvas.style.fontFeatureSettings = this.features.length > 0 ? this.features.map(f => `"${f}"`).join(', ') : 'initial';
        const fontSize = this.size * pxs;
        const font = [
            this.weight.toFixed(0),
            `${fontSize.toFixed(0)}px`,
            this.italic ? 'italic' : '',
            this.family,
        ].join(' ');
        ctx.font = font;
        ctx.textAlign = this.align;
    }
    clone() {
        const f = new Font();
        f.size = this.size;
        f.family = this.family;
        f.size = this.size;
        f.weight = this.weight;
        f.italic = this.italic;
        f.lineHeight = this.lineHeight;
        f.letterSpacing = this.letterSpacing;
        f.features = this.features;
        f.align = this.align;
        f.baseline = this.baseline;
        return f;
    }
    static clear(renderingLayer) {
        const canvas = renderingLayer.getCanvas();
        canvas.style.letterSpacing = `0em`;
        canvas.style.fontFeatureSettings = 'initial';
        const ctx = renderingLayer.getRenderingContext();
        ctx.font = "10px sans-serif";
    }
}

class Angle {
    constructor(...values) {
        this.degrees = 0;
        this.set(...values);
    }
    get revolutions() {
        return Angle.degreesToRevelutions(this.degrees);
    }
    set revolutions(revolutions) {
        this.degrees = Angle.revelutionsToDegress(revolutions);
    }
    get radians() {
        return Angle.degreesToRadians(this.degrees);
    }
    set radians(radians) {
        this.degrees = Angle.radiansToDegress(radians);
    }
    set(...values) {
        const value = values[0];
        if (value instanceof Angle) {
            this.degrees = value.degrees;
        }
        else {
            this.degrees = value;
        }
    }
    /**
     * Add to angle
     * @param {Angle|number} value Angle or number (degrees)
     * @returns {Angle} Same Angle object.
     */
    add(...values) {
        const value = values[0];
        if (value instanceof Angle) {
            this.degrees += value.degrees;
        }
        else {
            this.degrees += value;
        }
        return this;
    }
    /**
     * Subtract of angle
     * @param {Angle|number} value Angle or number (degrees)
     * @returns {Angle} Same Angle object.
     */
    subtract(...values) {
        const value = values[0];
        if (value instanceof Angle) {
            this.degrees -= value.degrees;
        }
        else {
            this.degrees -= value;
        }
        return this;
    }
    /**
     * Multiply the angle
     * @param {Angle|number} value Angle or number (degrees)
     * @returns {Angle} Same Angle object.
     */
    multiply(...values) {
        const value = values[0];
        if (value instanceof Angle) {
            this.degrees *= value.degrees;
        }
        else {
            this.degrees *= value;
        }
        return this;
    }
    /**
     * Divide the angle
     * @param {Angle|number} value Angle or number (degrees)
     * @returns {Angle} Same Angle object.
     */
    divide(...values) {
        const value = values[0];
        if (value instanceof Angle) {
            this.degrees /= value.degrees;
        }
        else {
            this.degrees /= value;
        }
        return this;
    }
    normalize() {
        if (this.degrees > 0) {
            while (this.degrees > 360)
                this.degrees -= 360;
        }
        else if (this.degrees < 0) {
            while (this.degrees < 0)
                this.degrees += 360;
        }
        return this;
    }
    getVector() {
        const angle = this.clone();
        angle.normalize();
        const radians = angle.radians;
        return new Vector(Math.cos(radians), Math.sin(radians));
    }
    getCSSValue() {
        return `${this.degrees.toFixed(3)}deg`;
    }
    clone() {
        return new Angle(this.degrees);
    }
    static fromDegrees(degrees) {
        return new Angle(degrees);
    }
    static fromRadians(radians) {
        const angle = new Angle(0);
        angle.radians = radians;
        return angle;
    }
    static fromRevolutions(revolutions) {
        const angle = new Angle(0);
        angle.revolutions = revolutions;
        return angle;
    }
    static get Zero() {
        return new Angle(0);
    }
    static get Quarter() {
        return new Angle(90);
    }
    static get Third() {
        return new Angle(120);
    }
    static get Half() {
        return new Angle(180);
    }
    static get Full() {
        return new Angle(360);
    }
    /**
     * Convert degrees to radians
     * @param degrees
     */
    static degreesToRadians(degrees) {
        return (degrees / 180) * Math.PI;
    }
    /**
     * Convert radians to degrees
     * @param radians
     */
    static radiansToDegress(radians) {
        return (radians / Math.PI) * 180;
    }
    /**
     * Convert degrees to revolutions
     * @param degrees
     */
    static degreesToRevelutions(degrees) {
        return degrees / 360;
    }
    /**
     * Convert revolutions to degrees
     * @param revolutions
     */
    static revelutionsToDegress(revolutions) {
        return revolutions * 360;
    }
    /**
     * Convert radians to revolutions
     * @param radians
     */
    static radiansToRevelutions(radians) {
        return radians / (2 * Math.PI);
    }
    /**
     * Convert revolutions to radians
     * @param revolutions
     */
    static revelutionsToRadians(revolutions) {
        return revolutions * (2 * Math.PI);
    }
}

class Vector {
    constructor(...values) {
        this.x = 0;
        this.y = 0;
        this.set(...values);
    }
    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    set(...values) {
        const v = Vector._parseEntryType_VectorModifier(values);
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    add(...values) {
        const v = Vector._parseEntryType_VectorModifier(values);
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    subtract(...values) {
        const v = Vector._parseEntryType_VectorModifier(values);
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    multiple(...values) {
        const v = Vector._parseEntryType_VectorModifier(values);
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }
    divide(...values) {
        const v = Vector._parseEntryType_VectorModifier(values);
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }
    rotate(...values) {
        const value = values[0];
        let degrees;
        if (value instanceof Angle) {
            degrees = value.degrees;
        }
        else {
            degrees = value;
        }
        const length = this.length;
        const angle = this.getAngle().add(degrees);
        const vector = angle.getVector().multiple(length);
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }
    /**
     * Normalize the Vector to length equal 1.
     * @returns {Vector} Same Vector object.
     */
    normalize() {
        const length = this.length;
        if (length !== 0) {
            this.x = this.x / length;
            this.y = this.y / length;
        }
        return this;
    }
    /**
     * TODO: Add description
     * @returns {Vector} Same Vector object.
     */
    absolute() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }
    /**
     * TODO: Add description
     */
    isEquals(vector) {
        return this.x == vector.x && this.y == vector.y;
    }
    /**
     * Convert the Vector to Angle
     * @returns {Angle} New instance of Angle
     */
    getAngle() {
        return Angle.fromRadians(Math.atan2(this.y, this.x));
    }
    /**
     * Clone the Vector without references
     * @returns {Vector} New instance of Vector
     */
    clone() {
        return new Vector(this.x, this.y);
    }
    /**
     * Alias for `new Vector(0, 0);`
     * @returns {Vector} New instance of Vector
     */
    static get Zero() {
        return new Vector(0, 0);
    }
    /**
     * Alias for `new Vector(.5, .5);`
     * @returns {Vector} New instance of Vector
     */
    static get Half() {
        return new Vector(.5, .5);
    }
    /**
     * Alias for `new Vector(1, 1);`
     * @returns {Vector} New instance of Vector
     */
    static get One() {
        return new Vector(1, 1);
    }
    /**
      * Alias for `new Vector(0, -1);`
      * @returns {Vector} New instance of Vector
      */
    static get Top() {
        return new Vector(0, -1);
    }
    /**
      * Alias for `new Vector(0, 1);`
      * @returns {Vector} New instance of Vector
      */
    static get Bottom() {
        return new Vector(0, 1);
    }
    /**
      * Alias for `new Vector(-1, 0);`
      * @returns {Vector} New instance of Vector
      */
    static get Left() {
        return new Vector(-1, 0);
    }
    /**
      * Alias for `new Vector(1, 0);`
      * @returns {Vector} New instance of Vector
      */
    static get right() {
        return new Vector(1, 0);
    }
    static distance(vector1, vector2) {
        const a = vector1.x - vector2.x;
        const b = vector1.y - vector2.y;
        return Math.sqrt(a ** 2 + b ** 2);
    }
    static _parseEntryType_Vector(raw) {
        let x;
        let y;
        if (raw.length == 2) {
            x = raw[0];
            y = raw[1];
        }
        else {
            x = raw[0].x;
            y = raw[0].y;
        }
        return { x, y };
    }
    static _parseEntryType_VectorModifier(raw) {
        let x;
        let y;
        if (raw.length == 2) {
            x = raw[0];
            y = raw[1];
        }
        else if (typeof raw[0] == 'number') {
            x = raw[0];
            y = raw[0];
        }
        else {
            x = raw[0].x;
            y = raw[0].y;
        }
        return { x, y };
    }
}

class Shadow {
    constructor(color, offset, blur) {
        this.color = Color.Black;
        this.offset = Vector.Zero;
        this.blur = 0;
        this.color = color;
        this.offset = offset;
        this.blur = blur;
    }
    apply(renderingLayer, boundingBox) {
        const ctx = renderingLayer.getRenderingContext();
        const pxs = renderingLayer.pixelScale;
        ctx.shadowColor = Color.convertRGBAtoStyle(this.color);
        ctx.shadowBlur = this.blur * pxs;
        ctx.shadowOffsetX = this.offset.x * pxs;
        ctx.shadowOffsetY = this.offset.y * pxs;
    }
    clone() {
        const thisColor = this.color;
        const color = thisColor.hasOwnProperty('clone') ? thisColor.clone() : { ...this.color };
        return new Shadow(color, this.offset.clone(), this.blur);
    }
    static clear(renderingLayer) {
        const ctx = renderingLayer.getRenderingContext();
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
}

class Stroke extends Style {
    constructor(style = Color.Black, lineWidth = 1, lineJoin = 'miter', lineCap = 'square', lineDashOffset = 0, miterLimit = 10) {
        super(style);
        this.lineWidth = lineWidth;
        this.lineJoin = lineJoin;
        this.lineCap = lineCap;
        this.lineDashOffset = lineDashOffset;
        this.miterLimit = miterLimit;
    }
    apply(renderingLayer, boundingBox) {
        const ctx = renderingLayer.getRenderingContext();
        const pxs = renderingLayer.pixelScale;
        ctx.lineWidth = this.lineWidth * pxs;
        ctx.lineDashOffset = this.lineDashOffset * pxs;
        ctx.lineJoin = this.lineJoin;
        ctx.lineCap = this.lineCap;
        ctx.miterLimit = this.miterLimit * pxs;
        ctx.strokeStyle = this.computeStyle(renderingLayer, boundingBox);
    }
    clone() {
        const style = super.clone();
        return new Stroke(style, this.lineWidth, this.lineJoin, this.lineCap, this.lineDashOffset, this.miterLimit);
    }
    static clear(renderingLayer) {
        const ctx = renderingLayer.getRenderingContext();
        ctx.lineWidth = 0;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineDashOffset = 0;
        ctx.miterLimit = 10;
        ctx.strokeStyle = 'transparent';
    }
}

class Transform {
    constructor(position = Vector.Zero, scale = Vector.One, rotation = Angle.Zero, origin = Vector.Zero) {
        this._parent = null;
        this.position = position;
        this.scale = scale;
        this.rotation = rotation;
        this.origin = origin;
    }
    getComputed() {
        const transforms = (() => {
            const fce = (arr, t) => {
                arr.unshift(t);
                if (t.hasParent())
                    return fce(arr, t.getParent());
                else
                    return arr;
            };
            return fce([], this);
        })();
        const computed = new Transform();
        for (let i = 0; i < transforms.length; i++) {
            const current = transforms[i];
            const position = current.position.clone()
                .rotate(computed.rotation)
                .multiple(computed.scale);
            computed.position.add(position);
            computed.rotation.add(current.rotation);
            computed.scale.multiple(current.scale);
        }
        return computed;
    }
    /**
     * @param parent Transformace rodiče
     * @param updateLocals Pokud bude TRUE, změní transformace tak, aby po parentování opticky identická
     */
    setParent(parent, updateLocals = false) {
        const before = this.getComputed();
        this._parent = parent;
        if (updateLocals === true) {
            const after = this.getComputed();
            after.position.subtract(before.position);
            after.rotation.subtract(before.rotation);
            after.scale.subtract(before.scale);
            this.position.subtract(after.position);
            this.rotation.subtract(after.rotation);
            this.scale.subtract(after.scale);
        }
    }
    clearParent(updateLocals = false) {
        if (this._parent === null)
            return;
        const before = this.getComputed();
        this._parent = null;
        if (updateLocals === true) {
            const after = this.getComputed();
            after.position.subtract(before.position);
            after.rotation.subtract(before.rotation);
            after.scale.subtract(before.scale);
            this.position.subtract(after.position);
            this.rotation.subtract(after.rotation);
            this.scale.subtract(after.scale);
        }
    }
    hasParent() {
        return this._parent !== null;
    }
    getParent() {
        if (this._parent == null) {
            throw new Error("Transform has no parent. You can test by method `.hasParent()`");
        }
        return this._parent;
    }
    clone() {
        const t = new Transform(this.position.clone(), this.scale.clone(), this.rotation.clone(), this.origin.clone());
        if (this.hasParent())
            t.setParent(t.getParent());
        return t;
    }
}

class Geometry {
    constructor(draw, getBoundingBox) {
        this.transform = new Transform();
        this._drawWithoutMatrixManipulation = draw;
        this._getBoundingBox = getBoundingBox;
    }
    contructMatrix(renderingLayer) {
        const t = this.transform;
        renderingLayer.setMatrixToTransform(t);
    }
    destructMatrix(renderingLayer) {
        renderingLayer.resetMatrix();
    }
    drawWithoutMatrixManipulation(renderingLayer) {
        const ctx = renderingLayer.getRenderingContext();
        const pxs = renderingLayer.pixelScale;
        const t = this.transform;
        this._drawWithoutMatrixManipulation(ctx, pxs, t);
    }
    draw(renderingLayer) {
        this.contructMatrix(renderingLayer);
        this.drawWithoutMatrixManipulation(renderingLayer);
        this.destructMatrix(renderingLayer);
    }
    getBoundingBox(renderingLayer) {
        return this._getBoundingBox(this.transform);
    }
}

class BezierGeometry extends Geometry {
    constructor(...points) {
        const d = (ctx, pxs, t) => {
            ctx.beginPath();
            const point = points[points.length - 1];
            const x = pxs * (-t.origin.x + point.x);
            const y = pxs * (-t.origin.y + point.y);
            ctx.moveTo(x, y);
            for (let i = 0; i < points.length; i++) {
                const point1 = i > 0 ? points[i - 1] : points[points.length - 1];
                const point2 = points[i];
                const cp1x = point1.x + point1.endControl.x;
                const cp1y = point1.y + point1.endControl.y;
                const cp2x = point2.x + point2.startControl.x;
                const cp2y = point2.y + point2.startControl.y;
                const x = point2.x;
                const y = point2.y;
                ctx.bezierCurveTo(pxs * (-t.origin.x + cp1x), pxs * (-t.origin.x + cp1y), pxs * (-t.origin.x + cp2x), pxs * (-t.origin.x + cp2y), pxs * (-t.origin.x + x), pxs * (-t.origin.x + y));
            }
            ctx.closePath();
        };
        const b = (t) => {
            const min = Vector.Zero;
            const max = Vector.Zero;
            points.forEach(p => {
                min.x = Math.min(min.x, p.x);
                min.y = Math.min(min.y, p.y);
                max.x = Math.max(max.x, p.x);
                max.y = Math.max(max.y, p.y);
            });
            return {
                origin: t.origin.clone().add(min),
                size: max.subtract(min),
            };
        };
        super(d, b);
        this.points = points;
    }
}

class Gizmo {
    static origin(renderingLayer, position, color = "#000") {
        const ctx = renderingLayer.getRenderingContext();
        const pxs = renderingLayer.pixelScale;
        const scale = renderingLayer.gizmoScale;
        const fillStyle = ctx.fillStyle;
        const crossLineWidth = 16 * scale;
        const crossLineHeight = 2 * scale;
        const dotSize = 4 * scale;
        ctx.beginPath();
        ctx.rect(-(crossLineWidth / 2 + 1) * pxs, -(crossLineHeight / 2 + 1) * pxs, (crossLineWidth + 2) * pxs, (crossLineHeight + 2) * pxs);
        ctx.rect(-(crossLineHeight / 2 + 1) * pxs, -(crossLineWidth / 2 + 1) * pxs, (crossLineHeight + 2) * pxs, (crossLineWidth + 2) * pxs);
        ctx.rect(-(dotSize / 2 + crossLineHeight + 1) * pxs, -(dotSize / 2 + crossLineHeight + 1) * pxs, (dotSize + crossLineHeight * 2 + 2) * pxs, (dotSize + crossLineHeight * 2 + 2) * pxs);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, .6)';
        ctx.fill();
        ctx.beginPath();
        ctx.rect((-crossLineWidth / 2) * pxs, (-crossLineHeight / 2) * pxs, crossLineWidth * pxs, crossLineHeight * pxs);
        ctx.rect((-crossLineHeight / 2) * pxs, (-crossLineWidth / 2) * pxs, crossLineHeight * pxs, crossLineWidth * pxs);
        ctx.rect(-(dotSize / 2 + crossLineHeight) * pxs, -(dotSize / 2 + crossLineHeight) * pxs, (dotSize + crossLineHeight * 2) * pxs, (dotSize + crossLineHeight * 2) * pxs);
        ctx.closePath();
        ctx.fillStyle = '#222';
        ctx.fill();
        ctx.fillStyle = color;
        ctx.fillRect((-dotSize / 2) * pxs, (-dotSize / 2) * pxs, dotSize * pxs, dotSize * pxs);
        ctx.fillStyle = fillStyle;
    }
}
Gizmo.nullColor = "white";
Gizmo.shapeColor = "cyan";
Gizmo.mediaColor = "magenta";
Gizmo.textColor = "yellow";

class Shape {
    constructor(geometry, getBoundingBox) {
        this.transform = new Transform();
        this.fill = null;
        this.stroke = null;
        this.shadow = null;
        this.opacity = 1;
        this.geometry = geometry;
        this._getBoundingBox = getBoundingBox;
    }
    render(renderingLayer) {
        Shape.renderObject(renderingLayer, this.geometry, this, this);
    }
    renderGizmo(renderingLayer) {
        Shape.renderGizmo(renderingLayer, this.geometry);
    }
    getBoundingBox(renderingLayer) {
        return this._getBoundingBox(renderingLayer);
    }
    static applyStyles(renderingLayer, shape) {
        const ctx = renderingLayer.getRenderingContext();
        ctx.globalAlpha = Numbers.limit(shape.opacity, 0, 1);
        if (shape.shadow) {
            shape.shadow.apply(renderingLayer, shape.getBoundingBox(renderingLayer));
        }
        else {
            Shadow.clear(renderingLayer);
        }
        if (shape.fill) {
            shape.fill.apply(renderingLayer, shape.getBoundingBox(renderingLayer));
            ctx.fill();
        }
        else {
            Fill.clear(renderingLayer);
        }
        if (shape.stroke) {
            shape.stroke.apply(renderingLayer, shape.getBoundingBox(renderingLayer));
            ctx.stroke();
        }
        else {
            Stroke.clear(renderingLayer);
        }
        ctx.globalAlpha = 1;
    }
    static renderObject(renderingLayer, geometry, renderable, shape) {
        const ctx = renderingLayer.getRenderingContext();
        ctx.beginPath();
        geometry.contructMatrix(renderingLayer);
        geometry.drawWithoutMatrixManipulation(renderingLayer);
        Shape.applyStyles(renderingLayer, shape);
        geometry.destructMatrix(renderingLayer);
        ctx.closePath();
        if (renderingLayer.gizmoVisibility && renderable.renderGizmo)
            renderable.renderGizmo(renderingLayer);
    }
    static renderGizmo(renderingLayer, geometry) {
        renderingLayer.setMatrixToTransform(geometry.transform);
        Gizmo.origin(renderingLayer, Vector.Zero, Gizmo.shapeColor);
        renderingLayer.resetMatrix();
    }
}

class BezierShape extends BezierGeometry {
    constructor(...points) {
        super(...points);
        this.fill = null;
        this.stroke = null;
        this.shadow = null;
        this.opacity = 1;
    }
    render(renderingLayer) {
        Shape.renderObject(renderingLayer, this, this, this);
    }
    renderGizmo(renderingLayer) {
        Shape.renderGizmo(renderingLayer, this);
    }
}

class EllipseGeometry extends Geometry {
    constructor(width, height) {
        const d = (ctx, pxs, t) => {
            const width = (this.width > 0 ? this.width : 0);
            const height = (this.height > 0 ? this.height : 0);
            const x = -t.origin.x + width / 2;
            const y = -t.origin.y + height / 2;
            const radiusX = width / 2;
            const radiusY = height / 2;
            ctx.beginPath();
            ctx.ellipse(x * pxs, y * pxs, radiusX * pxs, radiusY * pxs, 0, 0, 2 * Math.PI);
            ctx.closePath();
        };
        const b = (t) => {
            return {
                origin: t.origin.clone(),
                size: new Vector(this.width, this.height),
            };
        };
        super(d, b);
        this.width = width;
        this.height = height;
    }
    clone() {
        return new EllipseGeometry(this.width, this.height);
    }
}

class EllipseShape extends EllipseGeometry {
    constructor(width, height) {
        super(width, height);
        this.fill = null;
        this.stroke = null;
        this.shadow = null;
        this.opacity = 1;
    }
    render(renderingLayer) {
        Shape.renderObject(renderingLayer, this, this, this);
    }
    renderGizmo(renderingLayer) {
        Shape.renderGizmo(renderingLayer, this);
    }
    clone() {
        const ellipse = new EllipseShape(this.width, this.height);
        ellipse.fill = this.fill?.clone() ?? null;
        ellipse.stroke = this.stroke?.clone() ?? null;
        ellipse.shadow = this.shadow?.clone() ?? null;
        ellipse.opacity = this.opacity;
        return ellipse;
    }
}

class ImageObject {
    constructor(image, width, height) {
        this.transform = new Transform();
        this.shadow = null;
        this.opacity = 1;
        if (image.naturalWidth == 0 || image.naturalHeight == 0) {
            throw new Error("The image is not fully loaded.");
        }
        if (width != undefined && height != undefined) {
            this.width = typeof width == 'number' ? width : width(image.naturalWidth);
            this.height = typeof height == 'number' ? height : height(image.naturalHeight);
        }
        else {
            this.width = image.naturalWidth;
            this.height = image.naturalHeight;
        }
        this.source = image;
    }
    getBoundingBox(renderingLayer) {
        return {
            origin: this.transform.origin.clone(),
            size: new Vector(this.width, this.height),
        };
    }
    render(renderingLayer) {
        const ctx = renderingLayer.getRenderingContext();
        const pxs = renderingLayer.pixelScale;
        const t = this.transform;
        renderingLayer.setMatrixToTransform(t);
        ctx.globalAlpha = Numbers.limit(this.opacity, 0, 1);
        if (this.shadow) {
            this.shadow.apply(renderingLayer, this.getBoundingBox(renderingLayer));
        }
        else {
            Shadow.clear(renderingLayer);
        }
        ctx.moveTo(-t.origin.x * pxs, -t.origin.y * pxs);
        ctx.drawImage(this.source, 0, 0, this.width * pxs, this.height * pxs);
        renderingLayer.resetMatrix();
        ctx.globalAlpha = 1;
        if (renderingLayer.gizmoVisibility && this.renderGizmo)
            this.renderGizmo(renderingLayer);
    }
    renderGizmo(renderingLayer) {
        renderingLayer.setMatrixToTransform(this.transform);
        Gizmo.origin(renderingLayer, Vector.Zero, Gizmo.mediaColor);
        renderingLayer.resetMatrix();
    }
    clone() {
        const image = new ImageObject(this.source, this.width, this.height);
        image.transform = this.transform.clone();
        image.shadow = this.shadow?.clone() ?? null;
        image.opacity = this.opacity;
        return image;
    }
}

/** @deprecated */
class ImageSliceObject {
    constructor(source, sliceX, sliceY, sliceWidth, sliceHeight) {
        this.transform = new Transform();
        this.shadow = null;
        this.opacity = 1;
        if (source.naturalWidth == 0 || source.naturalHeight == 0) {
            throw new Error("The image is not fully loaded.");
        }
        this.width = sliceWidth;
        this.height = sliceHeight;
        this.sliceX = sliceX;
        this.sliceY = sliceY;
        this.sliceWidth = sliceWidth;
        this.sliceHeight = sliceHeight;
        this.source = source;
    }
    getBoundingBox(renderingLayer) {
        return {
            origin: this.transform.origin.clone(),
            size: new Vector(this.width, this.height),
        };
    }
    render(renderingLayer) {
        const ctx = renderingLayer.getRenderingContext();
        const pxs = renderingLayer.pixelScale;
        const t = this.transform;
        ctx.globalAlpha = Numbers.limit(this.opacity, 0, 1);
        renderingLayer.setMatrixToTransform(t);
        ctx.moveTo(-t.origin.x * pxs, -t.origin.y * pxs);
        ctx.drawImage(this.source, this.sliceX, this.sliceY, this.sliceWidth, this.sliceHeight, 0, 0, this.width * pxs, this.height * pxs);
        renderingLayer.resetMatrix();
        ctx.globalAlpha = 1;
        if (renderingLayer.gizmoVisibility && this.renderGizmo)
            this.renderGizmo(renderingLayer);
    }
    renderGizmo(renderingLayer) {
        renderingLayer.setMatrixToTransform(this.transform);
        Gizmo.origin(renderingLayer, Vector.Zero, Gizmo.mediaColor);
        renderingLayer.resetMatrix();
    }
    getImageElement() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.source, this.sliceX, this.sliceY, this.sliceWidth, this.sliceHeight, 0, 0, this.width, this.height);
        const dataURL = canvas.toDataURL('image/png');
        const imageElement = document.createElement('img');
        imageElement.src = dataURL;
        return imageElement;
    }
}

class NullObject {
    constructor() {
        this.transform = new Transform();
    }
    getBoundingBox(renderingLayer) {
        return {
            origin: this.transform.origin.clone(),
            size: Vector.Zero,
        };
    }
    render(renderingLayer) {
        if (renderingLayer.gizmoVisibility && this.renderGizmos)
            this.renderGizmos(renderingLayer);
    }
    renderGizmos(renderingLayer) {
        renderingLayer.setMatrixToTransform(this.transform);
        Gizmo.origin(renderingLayer, Vector.Zero, Gizmo.nullColor);
        renderingLayer.resetMatrix();
    }
    clone() {
        const n = new NullObject();
        n.transform = this.transform.clone();
        return n;
    }
}

class PieGeometry extends Geometry {
    constructor(width, height, startAngle, endAngle, innerRadius) {
        const d = (ctx, pxs, t) => {
            const width = this.width > 0 ? this.width : 0;
            const height = this.height > 0 ? this.height : 0;
            const x = -t.origin.x + width / 2;
            const y = -t.origin.y + height / 2;
            const radiusX = width / 2;
            const radiusY = height / 2;
            const innerRadius = Numbers.limit(this.innerRadius, 0, 1);
            const innerRadiusX = radiusX * innerRadius;
            const innerRadiusY = radiusY * innerRadius;
            let startAngle = this.startAngle.radians - Math.PI / 2;
            let endAngle = this.endAngle.radians - Math.PI / 2;
            if (endAngle - startAngle > Math.PI * 2) {
                endAngle = Math.PI * 2 + startAngle;
            }
            ctx.beginPath();
            ctx.ellipse(x * pxs, y * pxs, radiusX * pxs, radiusY * pxs, 0, startAngle, endAngle);
            ctx.ellipse(x * pxs, y * pxs, innerRadiusX * pxs, innerRadiusY * pxs, 0, endAngle, startAngle, true);
            ctx.closePath();
        };
        const b = (t) => {
            return {
                origin: t.origin.clone(),
                size: new Vector(this.width, this.height),
            };
        };
        super(d, b);
        this.width = width;
        this.height = height;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.innerRadius = innerRadius;
    }
}

class PieShape extends PieGeometry {
    constructor(width, height, startAngle, endAngle, innerRadius) {
        super(width, height, startAngle, endAngle, innerRadius);
        this.fill = null;
        this.stroke = null;
        this.shadow = null;
        this.opacity = 1;
    }
    render(renderingLayer) {
        Shape.renderObject(renderingLayer, this, this, this);
    }
    renderGizmo(renderingLayer) {
        Shape.renderGizmo(renderingLayer, this);
    }
}

class PolygonGeometry extends Geometry {
    constructor(...points) {
        const d = (ctx, pxs, t) => {
            ctx.beginPath();
            const p = points[0];
            const x = -t.origin.x * pxs + p.x * pxs;
            const y = -t.origin.y * pxs + p.y * pxs;
            ctx.moveTo(x, y);
            for (let i = 1; i < points.length; i++) {
                const p = points[i];
                const x = -t.origin.x * pxs + p.x * pxs;
                const y = -t.origin.y * pxs + p.y * pxs;
                ctx.lineTo(x, y);
            }
            ctx.closePath();
        };
        const b = (t) => {
            const min = Vector.Zero;
            const max = Vector.Zero;
            points.forEach(p => {
                min.x = Math.min(min.x, p.x);
                min.y = Math.min(min.y, p.y);
                max.x = Math.max(max.x, p.x);
                max.y = Math.max(max.y, p.y);
            });
            return {
                origin: t.origin.clone().add(min),
                size: max.subtract(min),
            };
        };
        super(d, b);
    }
}

class PolygonShape extends PolygonGeometry {
    constructor(...points) {
        super(...points);
        this.fill = null;
        this.stroke = null;
        this.shadow = null;
        this.opacity = 1;
    }
    render(renderingLayer) {
        Shape.renderObject(renderingLayer, this, this, this);
    }
    renderGizmo(renderingLayer) {
        Shape.renderGizmo(renderingLayer, this);
    }
}

class RectangleGeometry extends Geometry {
    constructor(width, height) {
        const d = (ctx, pxs, t) => {
            const width = this.width > 0 ? this.width : 0;
            const height = this.height > 0 ? this.height : 0;
            ctx.beginPath();
            ctx.rect(-t.origin.x * pxs, -t.origin.y * pxs, width * pxs, height * pxs);
            ctx.closePath();
        };
        const b = (t) => {
            return {
                origin: t.origin.clone(),
                size: new Vector(this.width, this.height),
            };
        };
        super(d, b);
        this.width = width;
        this.height = height;
    }
    clone() {
        return new RectangleGeometry(this.width, this.height);
    }
}

class RectangleShape extends RectangleGeometry {
    constructor(width, height) {
        super(width, height);
        this.fill = null;
        this.stroke = null;
        this.shadow = null;
        this.opacity = 1;
    }
    render(renderingLayer) {
        Shape.renderObject(renderingLayer, this, this, this);
    }
    renderGizmo(renderingLayer) {
        Shape.renderGizmo(renderingLayer, this);
    }
    clone() {
        const rectangle = new RectangleShape(this.width, this.height);
        rectangle.fill = this.fill?.clone() ?? null;
        rectangle.stroke = this.stroke?.clone() ?? null;
        rectangle.shadow = this.shadow?.clone() ?? null;
        rectangle.opacity = this.opacity;
        return rectangle;
    }
}

class RoundedRectangleGeometry extends Geometry {
    constructor(width, height, ...radius) {
        const d = (ctx, pxs, t) => {
            const width = (this.width > 0 ? this.width : 0);
            const height = (this.height > 0 ? this.height : 0);
            const r1 = this.topLeftRadius.clone();
            if (r1.x > 0 && r1.y > 0) {
                r1.multiple(Numbers.limit(r1.x, 0, width / 2) / r1.x);
                r1.multiple(Numbers.limit(r1.y, 0, height / 2) / r1.y);
            }
            const r2 = this.topRightRadius.clone();
            if (r2.x > 0 && r2.y > 0) {
                r2.multiple(Numbers.limit(r2.x, 0, width / 2) / r2.x);
                r2.multiple(Numbers.limit(r2.y, 0, height / 2) / r2.y);
            }
            const r3 = this.bottomRightRadius.clone();
            if (r3.x > 0 && r3.y > 0) {
                r3.multiple(Numbers.limit(r3.x, 0, width / 2) / r3.x);
                r3.multiple(Numbers.limit(r3.y, 0, height / 2) / r3.y);
            }
            const r4 = this.bottomLeftRadius.clone();
            if (r4.x > 0 && r4.y > 0) {
                r4.multiple(Numbers.limit(r4.x, 0, width / 2) / r4.x);
                r4.multiple(Numbers.limit(r4.y, 0, height / 2) / r4.y);
            }
            ctx.translate(-t.origin.x * pxs, -t.origin.y * pxs);
            ctx.beginPath();
            ctx.moveTo(0, r1.y * pxs);
            ctx.ellipse(r1.x * pxs, r1.y * pxs, r1.x * pxs, r1.y * pxs, Math.PI, 0, Math.PI / 2);
            ctx.ellipse((width - r2.x) * pxs, r2.y * pxs, r2.y * pxs, r2.x * pxs, Math.PI * 1.5, 0, Math.PI / 2);
            ctx.ellipse((width - r3.x) * pxs, (height - r3.y) * pxs, r3.x * pxs, r3.y * pxs, Math.PI * 2, 0, Math.PI / 2);
            ctx.ellipse(r4.x * pxs, (height - r4.y) * pxs, r4.y * pxs, r4.x * pxs, Math.PI * .5, 0, Math.PI / 2);
            ctx.closePath();
        };
        const b = (t) => {
            return {
                origin: t.origin.clone(),
                size: new Vector(this.width, this.height),
            };
        };
        super(d, b);
        this.width = width;
        this.height = height;
        this.topLeftRadius = Vector.Zero;
        this.topRightRadius = Vector.Zero;
        this.bottomLeftRadius = Vector.Zero;
        this.bottomRightRadius = Vector.Zero;
        this.setRadius(...radius);
    }
    setRadius(...radius) {
        if (radius.length == 4) {
            this.setTopLeftRadius(radius[0]);
            this.setTopRightRadius(radius[1]);
            this.setBottomRightRadius(radius[2]);
            this.setBottomLeftRadius(radius[3]);
        }
        else if (radius.length == 3) {
            this.setTopLeftRadius(radius[0]);
            this.setTopRightRadius(radius[1]);
            this.setBottomRightRadius(radius[2]);
            this.setBottomLeftRadius(radius[1]);
        }
        else if (radius.length == 2) {
            this.setTopLeftRadius(radius[0]);
            this.setTopRightRadius(radius[1]);
            this.setBottomRightRadius(radius[0]);
            this.setBottomLeftRadius(radius[1]);
        }
        else if (radius.length == 1) {
            const v = radius[0];
            this.setTopLeftRadius(radius[0]);
            this.setTopRightRadius(radius[0]);
            this.setBottomRightRadius(radius[0]);
            this.setBottomLeftRadius(radius[0]);
        }
        else {
            throw new Error("Incorrect combination of agruments");
        }
    }
    setTopLeftRadius(...values) {
        const radius = RoundedRectangleGeometry._parseRadiusValue(...values);
        this.topLeftRadius.x = radius.x;
        this.topLeftRadius.y = radius.y;
    }
    setTopRightRadius(...values) {
        const radius = RoundedRectangleGeometry._parseRadiusValue(...values);
        this.topRightRadius.x = radius.x;
        this.topRightRadius.y = radius.y;
    }
    setBottomRightRadius(...values) {
        const radius = RoundedRectangleGeometry._parseRadiusValue(...values);
        this.bottomRightRadius.x = radius.x;
        this.bottomRightRadius.y = radius.y;
    }
    setBottomLeftRadius(...values) {
        const radius = RoundedRectangleGeometry._parseRadiusValue(...values);
        this.bottomLeftRadius.x = radius.x;
        this.bottomLeftRadius.y = radius.y;
    }
    static _parseRadiusValue(...values) {
        let x;
        let y;
        if (values.length == 2) {
            x = values[0];
            y = values[1];
        }
        else if (typeof values[0] == 'number') {
            x = values[0];
            y = values[0];
        }
        else {
            x = values[0].x;
            y = values[0].y;
        }
        return { x, y };
    }
    clone() {
        const topLeftRadius = { x: this.topLeftRadius.x, y: this.topLeftRadius.y };
        const topRightRadius = { x: this.topRightRadius.x, y: this.topRightRadius.y };
        const bottomRightRadius = { x: this.bottomRightRadius.x, y: this.bottomRightRadius.y };
        const bottomLeftRadius = { x: this.bottomLeftRadius.x, y: this.bottomLeftRadius.y };
        const geometry = new RoundedRectangleGeometry(this.width, this.height, topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius);
        return geometry;
    }
}

class RoundedRectangleShape extends RoundedRectangleGeometry {
    constructor(width, height, ...radius) {
        super(width, height, ...radius);
        this.fill = null;
        this.stroke = null;
        this.shadow = null;
        this.opacity = 1;
    }
    render(renderingLayer) {
        Shape.renderObject(renderingLayer, this, this, this);
    }
    renderGizmo(renderingLayer) {
        Shape.renderGizmo(renderingLayer, this);
    }
    clone() {
        const topLeftRadius = { x: this.topLeftRadius.x, y: this.topLeftRadius.y };
        const topRightRadius = { x: this.topRightRadius.x, y: this.topRightRadius.y };
        const bottomRightRadius = { x: this.bottomRightRadius.x, y: this.bottomRightRadius.y };
        const bottomLeftRadius = { x: this.bottomLeftRadius.x, y: this.bottomLeftRadius.y };
        const shape = new RoundedRectangleShape(this.width, this.height, topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius);
        shape.fill = this.fill?.clone() ?? null;
        shape.stroke = this.stroke?.clone() ?? null;
        shape.shadow = this.shadow?.clone() ?? null;
        shape.opacity = this.opacity;
        return shape;
    }
}

class Regex {
    static breakLines() {
        return Regex._regexp.breakLines;
    }
}
Regex._regexp = {
    breakLines: /\r{0,1}\n/g,
};

class TextObject {
    constructor(content) {
        this.transform = new Transform();
        this._contentLines = [];
        this.fill = new Fill(Color.Black);
        this.stroke = null;
        this.font = new Font();
        this.shadow = null;
        this.opacity = 1;
        this.content = content;
    }
    get content() {
        return this._contentLines.join('\n');
    }
    set content(content) {
        this._contentLines = content.split(Regex.breakLines());
    }
    getBoundingBox(renderingLayer) {
        this.font.apply(renderingLayer);
        const ctx = renderingLayer.getRenderingContext();
        let width = 0;
        let height = 0;
        this._contentLines.forEach((line, i) => {
            const w = ctx.measureText(line).width;
            if (width < w)
                width = w;
            height += this.font.lineHeight;
        });
        return {
            origin: this.transform.origin.clone(),
            size: new Vector(Math.ceil(width), Math.ceil(height)),
        };
    }
    render(renderingLayer) {
        const ctx = renderingLayer.getRenderingContext();
        const pxs = renderingLayer.pixelScale;
        const t = this.transform;
        ctx.globalAlpha = Numbers.limit(this.opacity, 0, 1);
        renderingLayer.setMatrixToTransform(t);
        ctx.moveTo(-t.origin.x, -t.origin.y);
        this.font.apply(renderingLayer);
        const lineheight = this.font.lineHeight * pxs;
        this._contentLines.forEach((line, i) => {
            if (this.shadow) {
                this.shadow.apply(renderingLayer, this.getBoundingBox(renderingLayer));
            }
            else {
                Shadow.clear(renderingLayer);
            }
            if (this.fill) {
                this.fill.apply(renderingLayer, this.getBoundingBox(renderingLayer));
                ctx.fillText(line, 0, (i + 1) * lineheight);
            }
            else {
                Fill.clear(renderingLayer);
            }
            if (this.stroke) {
                this.stroke.apply(renderingLayer, this.getBoundingBox(renderingLayer));
                ctx.strokeText(line, 0, (i + 1) * lineheight);
            }
            else {
                Stroke.clear(renderingLayer);
            }
        });
        renderingLayer.resetMatrix();
        ctx.globalAlpha = 1;
        if (renderingLayer.gizmoVisibility && this.renderGizmo)
            this.renderGizmo(renderingLayer);
    }
    renderGizmo(renderingLayer) {
        renderingLayer.setMatrixToTransform(this.transform);
        Gizmo.origin(renderingLayer, Vector.Zero, Gizmo.textColor);
        renderingLayer.resetMatrix();
    }
    clone() {
        const text = new TextObject(this.content);
        text.transform = this.transform.clone();
        text.fill = this.fill?.clone() ?? null;
        text.stroke = this.stroke?.clone() ?? null;
        text.font = this.font?.clone() ?? null;
        text.shadow = this.shadow?.clone() ?? null;
        text.opacity = this.opacity;
        return text;
    }
}

class TrimablePolygonGeometry extends Geometry {
    constructor(points, closed = true, trimStart = 0, trimEnd = 1, trimOffset = 0) {
        const d = (ctx, pxs, transform) => {
            this._draw(ctx, pxs, transform);
        };
        const b = (t) => {
            const width = Math.max(...this.points.map(p => p.x));
            const height = Math.max(...this.points.map(p => p.y));
            return {
                origin: this.transform.origin.clone(),
                size: new Vector(width, height),
            };
        };
        super(d, b);
        this.points = points;
        this.closed = closed;
        this.trimEnd = trimEnd;
        this.trimStart = trimStart;
        this.trimOffset = trimOffset;
    }
    _draw(ctx, pxs, transform) {
        const trimOffsetNormalized = this.trimOffset + this.trimStart;
        const trimStartNormalized = 0;
        const trimEndNormalized = this.trimEnd - this.trimStart;
        const trimOffsetRatio = ((v) => {
            while (v < 0)
                v += 1;
            while (v > 1)
                v -= 1;
            return v;
        })(trimOffsetNormalized);
        const trimStartRatio = Numbers.limit(trimStartNormalized, 0, 1) + trimOffsetRatio;
        const trimEndRatio = Numbers.limit(trimEndNormalized, 0, 1) + trimOffsetRatio;
        const sides = this.points.map((start, i, arr) => {
            const end = i + 1 < arr.length ? arr[i + 1] : arr[0];
            const line = Vector.Zero.add(end).subtract(start);
            return line;
        }).slice(0, this.closed ? this.points.length : this.points.length - 1);
        const circuit = sides.reduce((acc, side) => acc + side.length, 0);
        const trimStartLength = trimStartRatio * circuit;
        const trimEndLength = trimEndRatio * circuit;
        let alreadyDrawn = 0;
        ctx.translate(-transform.origin.x * pxs, -transform.origin.y * pxs);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        sides.forEach(side => {
            alreadyDrawn = this._drawSide(ctx, pxs, side, alreadyDrawn, trimStartLength, trimEndLength);
        });
        if (1 < trimEndRatio) {
            if (!this.closed) {
                const resetMovement = sides.reduce((acc, side) => {
                    return acc.subtract(side);
                }, Vector.Zero);
                ctx.moveTo(resetMovement.x * pxs, resetMovement.y * pxs);
                ctx.translate(resetMovement.x * pxs, resetMovement.y * pxs);
            }
            let overflowAlreadyDrawn = 0;
            for (let i = 0; i < sides.length; i++) {
                const side = sides[i];
                overflowAlreadyDrawn = this._drawSide(ctx, pxs, side, overflowAlreadyDrawn, 0, (trimEndLength - circuit));
                if (overflowAlreadyDrawn > trimEndLength - circuit)
                    break;
            }
        }
        if (this.closed && (trimStartRatio != trimEndRatio && trimStartRatio - trimEndRatio == 0)) {
            ctx.closePath();
        }
    }
    _drawSide(ctx, pxs, side, alreadyDrawn, trimStartLength, trimEndLength) {
        if (trimEndLength >= (alreadyDrawn + side.length) && trimStartLength <= alreadyDrawn) {
            // FULL
            ctx.lineTo(side.x * pxs, side.y * pxs);
        }
        else if (trimEndLength >= (alreadyDrawn + side.length) && trimStartLength < (alreadyDrawn + side.length) && trimStartLength >= alreadyDrawn) {
            // GAP BEFORE
            const beforeGapModifier = (trimStartLength - alreadyDrawn) / side.length;
            if (beforeGapModifier > 0) {
                const v = side.clone().multiple(beforeGapModifier);
                ctx.moveTo(v.x * pxs, v.y * pxs);
            }
            ctx.lineTo(side.x * pxs, side.y * pxs);
        }
        else if (trimEndLength > alreadyDrawn && trimStartLength <= alreadyDrawn) {
            // GAP AFTER
            const afterLength = side.length - (trimEndLength - alreadyDrawn);
            const lineLength = side.length - afterLength;
            const lineModifier = lineLength / side.length;
            const v = side.clone().multiple(lineModifier);
            ctx.lineTo(v.x * pxs, v.y * pxs);
            if (afterLength > 0) {
                const afterGapModifier = afterLength / side.length;
                const v = side.clone().multiple(afterGapModifier);
                ctx.moveTo(v.x * pxs, v.y * pxs);
            }
        }
        else if (trimEndLength > alreadyDrawn && trimStartLength < (alreadyDrawn + side.length) && trimStartLength > alreadyDrawn) {
            // BETWEEN
            const beforeLength = trimStartLength - alreadyDrawn;
            const afterLength = side.length - (trimEndLength - alreadyDrawn);
            const lineLength = side.length - (beforeLength + afterLength);
            if (beforeLength > 0) {
                const beforeGapModifier = beforeLength / side.length;
                const v = side.clone().multiple(beforeGapModifier);
                ctx.moveTo(v.x * pxs, v.y * pxs);
            }
            const lineModifier = (lineLength + beforeLength) / side.length;
            const v = side.clone().multiple(lineModifier);
            ctx.lineTo(v.x * pxs, v.y * pxs);
            if (afterLength > 0) {
                const afterGapModifier = afterLength / side.length;
                const v = side.clone().multiple(afterGapModifier);
                ctx.moveTo(v.x * pxs, v.y * pxs);
            }
        }
        else {
            // NONE
            ctx.moveTo(side.x * pxs, side.y * pxs);
        }
        ctx.translate(side.x * pxs, side.y * pxs);
        return alreadyDrawn += side.length;
    }
}

class TrimablePolygonShape extends TrimablePolygonGeometry {
    constructor(points, closed, trimStart, trimEnd, trimOffset) {
        super(points, closed, trimStart, trimEnd, trimOffset);
        this.fill = null;
        this.stroke = null;
        this.shadow = null;
        this.opacity = 1;
    }
    render(renderingLayer) {
        Shape.renderObject(renderingLayer, this, this, this);
    }
    renderGizmo(renderingLayer) {
        Shape.renderGizmo(renderingLayer, this);
    }
}

class Gradient {
    constructor(start, end, steps) {
        this.steps = [];
        this.start = start;
        this.end = end;
        this.steps = steps;
    }
    computeStyle(renderingLayer, boundingBox) {
        throw new Error("Mehod `getStyle` is not implemented.");
    }
}

class LinearGradient extends Gradient {
    computeStyle(renderingLayer, boundingBox) {
        const ctx = renderingLayer.getRenderingContext();
        const pxs = renderingLayer.pixelScale;
        // TODO: Zkontrolovat jestli "origin" přičítám, nebo odčítáms
        const startPoint = this.start.clone().multiple(boundingBox.size).add(boundingBox.origin);
        const endPoint = this.end.clone().multiple(boundingBox.size).add(boundingBox.origin);
        const gradient = ctx.createLinearGradient(startPoint.x * pxs, startPoint.y * pxs, endPoint.x * pxs, endPoint.y * pxs);
        this.steps.forEach(step => {
            const offset = Numbers.limit(step.offset, 0, 1);
            const color = `rgba(${step.color.red.toFixed(3)}, ${step.color.green.toFixed(3)}, ${step.color.blue.toFixed(3)}, ${step.color.alpha.toFixed(3)})`;
            gradient.addColorStop(offset, color);
        });
        return gradient;
    }
}

class RadialGradient extends Gradient {
    computeStyle(renderingLayer, boundingBox) {
        const ctx = renderingLayer.getRenderingContext();
        const pxs = renderingLayer.pixelScale;
        const centerPoint = this.start.clone()
            .multiple(boundingBox.size)
            .add(boundingBox.origin)
            .absolute();
        const radiusPoint = this.end.clone()
            .multiple(boundingBox.size)
            .add(boundingBox.origin)
            .absolute();
        if (centerPoint.isEquals(radiusPoint) == false) {
            const gradient = ctx.createRadialGradient(centerPoint.x * pxs, centerPoint.y * pxs, 0, centerPoint.x * pxs, centerPoint.y * pxs, radiusPoint.subtract(centerPoint).length * pxs);
            this.steps.forEach(step => {
                const offset = Numbers.limit(step.offset, 0, 1);
                const color = `rgba(${step.color.red.toFixed(3)}, ${step.color.green.toFixed(3)}, ${step.color.blue.toFixed(3)}, ${step.color.alpha.toFixed(3)})`;
                gradient.addColorStop(offset, color);
            });
            return gradient;
        }
        else {
            const gradient = ctx.createRadialGradient(0, 0, 0, 1, 1, 1);
            const step = this.steps[this.steps.length - 1];
            const color = `rgba(${step.color.red.toFixed(3)}, ${step.color.green.toFixed(3)}, ${step.color.blue.toFixed(3)}, ${step.color.alpha.toFixed(3)})`;
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, color);
            return gradient;
        }
    }
}

class BezierPoint extends Vector {
    constructor(position, startControl = Vector.Zero, endControl = Vector.Zero) {
        super(position.x, position.y);
        this.startControl = new Vector(startControl.x, startControl.y);
        this.endControl = new Vector(endControl.x, endControl.y);
    }
    toVector() {
        return new Vector(this.x, this.y);
    }
    clone() {
        const startControl = this.startControl.clone();
        const endControl = this.endControl.clone();
        return new BezierPoint({ x: this.x, y: this.y }, startControl, endControl);
    }
}

class BezierEasing {
    static custom(t, p1, p2, p3, p4) {
        const compute = (t, v1, v2, v3, v4) => {
            return (1 - t) ** 3 * v1 + 3 * (1 - t) ** 2 * t * v2 + 3 * (1 - t) * t ** 2 * v3 + t ** 3 * v4;
        };
        const y = compute(t, p1.y, p2.y, p3.y, p4.y);
        const result = y;
        return result;
    }
    static linear(t) {
        return t;
    }
    static ease(t) {
        return BezierEasing.custom(t, { x: 0, y: 0 }, { x: 0.25, y: 0.1 }, { x: 0.25, y: 1 }, { x: 1, y: 1 });
    }
    static easeIn(t) {
        return BezierEasing.custom(t, { x: 0, y: 0 }, { x: 0.42, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 1 });
    }
    static easeInOut(t) {
        return BezierEasing.custom(t, { x: 0, y: 0 }, { x: 0.42, y: 0 }, { x: 0.58, y: 1 }, { x: 1, y: 1 });
    }
    static easeOut(t) {
        return BezierEasing.custom(t, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0.58, y: 1 }, { x: 1, y: 1 });
    }
    static easeInSine(t) {
        return BezierEasing.custom(t, { x: 0, y: 0 }, { x: 0.47, y: 0 }, { x: 0.745, y: 0.715 }, { x: 1, y: 1 });
    }
    static easeOutSine(t) {
        return BezierEasing.custom(t, { x: 0, y: 0 }, { x: 0.39, y: 0.575 }, { x: 0.565, y: 1 }, { x: 1, y: 1 });
    }
    static easeInOutSine(t) {
        return BezierEasing.custom(t, { x: 0, y: 0 }, { x: 0.445, y: 0.05 }, { x: 0.55, y: 0.95 }, { x: 1, y: 1 });
    }
    static easeInQuad(t) {
        return BezierEasing.custom(t, { x: 0, y: 0 }, { x: 0.55, y: 0.085 }, { x: 0.68, y: 0.53 }, { x: 1, y: 1 });
    }
    static easeOutQuad(t) {
        return BezierEasing.custom(t, { x: 0, y: 0 }, { x: 0.25, y: 0.46 }, { x: 0.45, y: 0.94 }, { x: 1, y: 1 });
    }
    static easeInOutQuad(t) {
        return BezierEasing.custom(t, { x: 0, y: 0 }, { x: 0.445, y: 0.03 }, { x: 0.515, y: 0.955 }, { x: 1, y: 1 });
    }
}

class Loaders {
    static async getImageFormFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            const img = new Image();
            reader.addEventListener('load', async () => {
                img.src = reader.result;
                resolve(await Loaders.waitToImageLoad(img));
            }, false);
        });
    }
    static async getImageByPath(path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = path;
            img.addEventListener('load', () => {
                resolve(img);
            });
            img.addEventListener('error', () => {
                reject(`Image „${path}“ cannot be loaded.`);
            });
        });
    }
    static async waitToImageLoad(img) {
        return new Promise((resolve, reject) => {
            const src = img.src;
            img.src = src;
            img.addEventListener('load', () => {
                resolve(img);
            });
        });
    }
}

class Oscillators {
    static sawtooth(interator, frequency, min = -1, max = 1) {
        if (interator > 0)
            return Numbers.remap(interator % frequency, 0, frequency, min, max);
        else
            return Numbers.remap(-interator % frequency, 0, frequency, max, min);
    }
    static linear(interator, frequency, min = -1, max = 1) {
        return Numbers.remap(Math.abs(Oscillators.sawtooth(interator, frequency, -2, 2)) - 1, -1, 1, min, max);
    }
    static sinus(interator, frequency, min = -1, max = 1) {
        return Numbers.remap(Math.sin(Oscillators.sawtooth(interator, frequency, 0, Math.PI * 2)), -1, 1, min, max);
    }
    static cosinus(interator, frequency, min = -1, max = 1) {
        return Numbers.remap(Math.cos(Oscillators.sawtooth(interator, frequency, 0, Math.PI * 2)), -1, 1, min, max);
    }
}

class Strings {
    static padLeft(s, length, pad) {
        if (s.length > length)
            return s;
        const repeat = Math.ceil((length - s.length) / pad.length);
        const full = Array(repeat + 1).join(pad) + s;
        return full.substring(full.length - length, full.length);
    }
    static padRight(s, length, pad) {
        if (s.length > length)
            return s;
        const repeat = Math.ceil((length - s.length) / pad.length);
        const full = s + Array(repeat + 1).join(pad);
        return full.substring(0, length);
    }
}

var Utils;
(function (Utils) {
    Utils.BezierEasing = BezierEasing;
    Utils.Loaders = Loaders;
    Utils.Numbers = Numbers;
    Utils.Oscillators = Oscillators;
    Utils.Regex = Regex;
    Utils.Strings = Strings;
})(Utils || (Utils = {}));

export { Angle, BezierGeometry, BezierPoint, BezierShape, Color, EllipseGeometry, EllipseShape, Engine, Fill, Font, Geometry, Gradient, ImageObject, ImageSliceObject, LayerBlender, LinearGradient, NullObject, PieGeometry, PieShape, PolygonGeometry, PolygonShape, RadialGradient, RectangleGeometry, RectangleShape, RenderingLayer, RoundedRectangleGeometry, RoundedRectangleShape, Shadow, Shape, Stroke, Style, TextObject, TrackAlpha, Transform, TrimablePolygonGeometry, TrimablePolygonShape, Utils, Vector };
