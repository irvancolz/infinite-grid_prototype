import { frustumHeight, frustumWidth, SIZES } from "./const";

function getHeightInPx(worldHeight = 0) {
  return (SIZES.height / frustumHeight) * worldHeight;
}

function getWidthInPx(worldWidth = 0) {
  return (SIZES.width / frustumWidth) * worldWidth;
}

export { getHeightInPx, getWidthInPx };
