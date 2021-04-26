import { Angle } from "../units/Angle.js";
import { IClonable } from "../core/IClonable.js";
import { Vector } from "../units/Vector.js";


export class Transform implements IClonable<Transform> {

    origin: Vector;
    position: Vector;
    scale: Vector;
    rotation: Angle;

    private _parent: Transform | null = null;


    constructor(position: Vector = Vector.Zero, scale: Vector = Vector.One, rotation: Angle = Angle.Zero, origin: Vector = Vector.Zero) {
        this.position = position;
        this.scale = scale;
        this.rotation = rotation;
        this.origin = origin;
    }


    getComputed(): Transform {
        const transforms: Transform[] = (() => {
            const fce = (arr: Transform[], t: Transform): Transform[] => {
                arr.unshift(t);

                if (t.hasParent()) return fce(arr, t.getParent());
                else return arr;
            }

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
    setParent(parent: Transform, updateLocals: boolean = false) {
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


    clearParent(updateLocals: boolean = false) {
        if (this._parent === null) return;

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


    hasParent(): boolean {
        return this._parent !== null;
    }


    getParent(): Transform {
        if (this._parent == null) {
            throw new Error("Transform has no parent. You can test by method `.hasParent()`");
        }

        return this._parent;
    }


    clone(): Transform {
        const t = new Transform(this.position.clone(), this.scale.clone(), this.rotation.clone(), this.origin.clone());

        if (this.hasParent()) t.setParent(t.getParent());

        return t;
    }

}