import * as THREE from "three";

const CONFIG = {
  row: 2,
  column: 4,
};

const SIZES = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  fov: 75,
  aspect: window.innerWidth / window.innerHeight,
};

const CAMERA_DISTANCE = 10;
const frustumHeight =
  2 * CAMERA_DISTANCE * Math.tan(THREE.MathUtils.degToRad(SIZES.fov / 2));
const frustumWidth = frustumHeight * SIZES.aspect;

const PLANE = {
  width: frustumWidth / 4,
  height: frustumHeight / 2,
};

export { PLANE, CONFIG, SIZES, CAMERA_DISTANCE, frustumHeight, frustumWidth };
