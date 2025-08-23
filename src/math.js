import { frustumHeight, frustumWidth, SIZES } from "./const";

function getHeightInPx(worldHeight = 0) {
  return (SIZES.height / frustumHeight) * worldHeight;
}

function getWidthInPx(worldWidth = 0) {
  return (SIZES.width / frustumWidth) * worldWidth;
}

function getWorldHeightFromPx(px = 0) {
  return (frustumHeight / SIZES.height) * px;
}

function getWorldWidthFromPx(px = 0) {
  return (frustumWidth / SIZES.width) * px;
}

export {
  getHeightInPx,
  getWidthInPx,
  getWorldHeightFromPx,
  getWorldWidthFromPx,
};
