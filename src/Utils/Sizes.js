import { CAMERA_DISTANCE } from "../const";
import EventEmitter from "./EventEmitter";
import * as THREE from "three";

let instance;
export default class Sizes extends EventEmitter {
  constructor() {
    super();
    if (instance) return instance;

    instance = this;
    this.fov = 75;

    this._calculate();

    window.addEventListener("resize", () => {
      this.resize();
    });
  }

  _calculate() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    this.frustumHeight =
      2 * CAMERA_DISTANCE * Math.tan(THREE.MathUtils.degToRad(this.fov / 2));
    this.frustumWidth = this.frustumHeight * this.aspect;

    this.PLANE_RATIO = 853 / 1280;
    const width = Math.max(
      this.frustumWidth / 4,
      this.getWorldWidthFromPx(160)
    );
    const height = (width * 1280) / 853;
    this.PLANE = {
      width,
      height,
    };
  }

  resize() {
    this._calculate();

    this.trigger("resize");
  }

  getHeightInPx(worldHeight = 0) {
    return (this.height / this.frustumHeight) * worldHeight;
  }

  getWidthInPx(worldWidth = 0) {
    return (this.width / this.frustumWidth) * worldWidth;
  }

  getWorldHeightFromPx(px = 0) {
    return (this.frustumHeight / this.height) * px;
  }

  getWorldWidthFromPx(px = 0) {
    return (this.frustumWidth / this.width) * px;
  }
}
