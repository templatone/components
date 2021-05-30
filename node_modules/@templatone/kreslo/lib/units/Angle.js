import {Vector} from "./Vector.js";
export class Angle {
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
    } else {
      this.degrees = value;
    }
  }
  add(...values) {
    const value = values[0];
    if (value instanceof Angle) {
      this.degrees += value.degrees;
    } else {
      this.degrees += value;
    }
    return this;
  }
  subtract(...values) {
    const value = values[0];
    if (value instanceof Angle) {
      this.degrees -= value.degrees;
    } else {
      this.degrees -= value;
    }
    return this;
  }
  multiply(...values) {
    const value = values[0];
    if (value instanceof Angle) {
      this.degrees *= value.degrees;
    } else {
      this.degrees *= value;
    }
    return this;
  }
  divide(...values) {
    const value = values[0];
    if (value instanceof Angle) {
      this.degrees /= value.degrees;
    } else {
      this.degrees /= value;
    }
    return this;
  }
  normalize() {
    if (this.degrees > 0) {
      while (this.degrees > 360)
        this.degrees -= 360;
    } else if (this.degrees < 0) {
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
  static degreesToRadians(degrees) {
    return degrees / 180 * Math.PI;
  }
  static radiansToDegress(radians) {
    return radians / Math.PI * 180;
  }
  static degreesToRevelutions(degrees) {
    return degrees / 360;
  }
  static revelutionsToDegress(revolutions) {
    return revolutions * 360;
  }
  static radiansToRevelutions(radians) {
    return radians / (2 * Math.PI);
  }
  static revelutionsToRadians(revolutions) {
    return revolutions * (2 * Math.PI);
  }
}
