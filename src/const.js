import * as THREE from "three";

const CONFIG = {
  row: 8,
  column: 7,
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

const PLANE_RATIO = 853 / 1280;
const PLANE = {
  width: frustumWidth / 4,
  height: ((frustumWidth / 4) * 1280) / 853,
};

export { PLANE, CONFIG, SIZES, CAMERA_DISTANCE, frustumHeight, frustumWidth };
