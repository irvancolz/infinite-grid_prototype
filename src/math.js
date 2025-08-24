import Sizes from "./Utils/Sizes";

function getHeightInPx(worldHeight = 0) {
  const SIZES = new Sizes();
  return (SIZES.height / SIZES.frustumHeight) * worldHeight;
}

function getWidthInPx(worldWidth = 0) {
  const SIZES = new Sizes();

  return (SIZES.width / SIZES.frustumWidth) * worldWidth;
}

function getWorldHeightFromPx(px = 0) {
  const SIZES = new Sizes();

  return (SIZES.frustumHeight / SIZES.height) * px;
}

function getWorldWidthFromPx(px = 0) {
  const SIZES = new Sizes();

  return (SIZES.frustumWidth / SIZES.width) * px;
}

export {
  getHeightInPx,
  getWidthInPx,
  getWorldHeightFromPx,
  getWorldWidthFromPx,
};
