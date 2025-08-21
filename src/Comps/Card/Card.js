import * as THREE from "three";
import { PLANE, SIZES } from "../../const";
import { getHeightInPx, getWidthInPx } from "../../math";
import ImageViewer from "../ImageViewer/ImageViewer";
import { copyImageToClipboard } from "copy-image-clipboard";

class Card {
  constructor({ row, column, origin, texture, id, camera, src }) {
    this.id = id;
    this.row = row;
    this.column = column;
    this.origin = origin;
    this.texture = texture;
    this.rotation = new THREE.Vector3();
    this.camera = camera;
    this.revealed = false;
    this.src = src;
    this.scrollSpeed = 1;
    this.$container = document.getElementById("app");

    this.imgViewer = new ImageViewer();

    this.init();
  }
  _init3D() {
    const gap = 0;
    this.geometry = new THREE.PlaneGeometry(PLANE.width, PLANE.height);
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.userData.id = this.id;

    const x = 0;
    const y = this.row * PLANE.height;

    this.center = this.origin.clone().add({ x, y, z: 0 });

    this.mesh.position.copy(this.center);
  }
  _initDOM() {
    this.$ui = document.createElement("div");
    this.$ui.className = "card";

    this.$ui.innerHTML = `
      <button class="btn btn-expand">
      <svg class="icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.25 17.0625H6.75C2.6775 17.0625 0.9375 15.3225 0.9375 11.25V6.75C0.9375 2.6775 2.6775 0.9375 6.75 0.9375H11.25C15.3225 0.9375 17.0625 2.6775 17.0625 6.75V11.25C17.0625 15.3225 15.3225 17.0625 11.25 17.0625ZM6.75 2.0625C3.2925 2.0625 2.0625 3.2925 2.0625 6.75V11.25C2.0625 14.7075 3.2925 15.9375 6.75 15.9375H11.25C14.7075 15.9375 15.9375 14.7075 15.9375 11.25V6.75C15.9375 3.2925 14.7075 2.0625 11.25 2.0625H6.75Z" fill="white"/>
        <path d="M4.50008 14.0625C4.35758 14.0625 4.21508 14.01 4.10258 13.8975C3.88508 13.68 3.88508 13.32 4.10258 13.1025L13.1026 4.10246C13.3201 3.88496 13.6801 3.88496 13.8976 4.10246C14.1151 4.31996 14.1151 4.67996 13.8976 4.89746L4.89758 13.8975C4.78508 14.01 4.64258 14.0625 4.50008 14.0625Z" fill="white"/>
        <path d="M13.5 8.0625C13.1925 8.0625 12.9375 7.8075 12.9375 7.5V5.0625H10.5C10.1925 5.0625 9.9375 4.8075 9.9375 4.5C9.9375 4.1925 10.1925 3.9375 10.5 3.9375H13.5C13.8075 3.9375 14.0625 4.1925 14.0625 4.5V7.5C14.0625 7.8075 13.8075 8.0625 13.5 8.0625Z" fill="white"/>
        <path d="M7.5 14.0625H4.5C4.1925 14.0625 3.9375 13.8075 3.9375 13.5V10.5C3.9375 10.1925 4.1925 9.9375 4.5 9.9375C4.8075 9.9375 5.0625 10.1925 5.0625 10.5V12.9375H7.5C7.8075 12.9375 8.0625 13.1925 8.0625 13.5C8.0625 13.8075 7.8075 14.0625 7.5 14.0625Z" fill="white"/>
      </svg>
    </button>

    <button class="btn btn-copy">
      <svg class="icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.325 17.0625H5.175C2.2425 17.0625 0.9375 15.7575 0.9375 12.825V9.675C0.9375 6.7425 2.2425 5.4375 5.175 5.4375H8.325C11.2575 5.4375 12.5625 6.7425 12.5625 9.675V12.825C12.5625 15.7575 11.2575 17.0625 8.325 17.0625ZM5.175 6.5625C2.85 6.5625 2.0625 7.35 2.0625 9.675V12.825C2.0625 15.15 2.85 15.9375 5.175 15.9375H8.325C10.65 15.9375 11.4375 15.15 11.4375 12.825V9.675C11.4375 7.35 10.65 6.5625 8.325 6.5625H5.175Z" fill="white"/>
        <path d="M12.825 12.5625H12C11.6925 12.5625 11.4375 12.3075 11.4375 12V9.675C11.4375 7.35 10.65 6.5625 8.325 6.5625H6C5.6925 6.5625 5.4375 6.3075 5.4375 6V5.175C5.4375 2.2425 6.7425 0.9375 9.675 0.9375H12.825C15.7575 0.9375 17.0625 2.2425 17.0625 5.175V8.325C17.0625 11.2575 15.7575 12.5625 12.825 12.5625ZM12.5625 11.4375H12.825C15.15 11.4375 15.9375 10.65 15.9375 8.325V5.175C15.9375 2.85 15.15 2.0625 12.825 2.0625H9.675C7.35 2.0625 6.5625 2.85 6.5625 5.175V5.4375H8.325C11.2575 5.4375 12.5625 6.7425 12.5625 9.675V11.4375Z" fill="white"/>
      </svg>
      <span class="label">
        copy
      </span>
    </button>

    <button class="btn btn-download">
      <svg class="icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.91007 11.2425C8.76757 11.2425 8.62507 11.19 8.51257 11.0775L6.59257 9.15747C6.37507 8.93997 6.37507 8.57997 6.59257 8.36247C6.81007 8.14497 7.17007 8.14497 7.38757 8.36247L8.91007 9.88497L10.4326 8.36247C10.6501 8.14497 11.0101 8.14497 11.2276 8.36247C11.4451 8.57997 11.4451 8.93997 11.2276 9.15747L9.30757 11.0775C9.19507 11.19 9.05257 11.2425 8.91007 11.2425Z" fill="white"/>
        <path d="M8.90991 11.19C8.60241 11.19 8.34741 10.935 8.34741 10.6275V3C8.34741 2.6925 8.60241 2.4375 8.90991 2.4375C9.21741 2.4375 9.47241 2.6925 9.47241 3V10.6275C9.47241 10.935 9.21741 11.19 8.90991 11.19Z" fill="white"/>
        <path d="M9 15.6975C5.1375 15.6975 2.4375 12.9975 2.4375 9.13501C2.4375 8.82751 2.6925 8.57251 3 8.57251C3.3075 8.57251 3.5625 8.82751 3.5625 9.13501C3.5625 12.3375 5.7975 14.5725 9 14.5725C12.2025 14.5725 14.4375 12.3375 14.4375 9.13501C14.4375 8.82751 14.6925 8.57251 15 8.57251C15.3075 8.57251 15.5625 8.82751 15.5625 9.13501C15.5625 12.9975 12.8625 15.6975 9 15.6975Z" fill="white"/>
      </svg>
      <span class="label">
        download
      </span>
    </button>
    `;

    this.widthPx = getWidthInPx(PLANE.width);
    this.heightPx = getHeightInPx(PLANE.height);
    this.$ui.style.width = `${this.widthPx}px`;
    this.$ui.style.height = `${this.heightPx}px`;

    this.$ui.addEventListener("click", (e) => {
      e.stopPropagation();
      this._hide();
    });

    this.$container.appendChild(this.$ui);

    // button
    const $downloadBtn = this.$ui.querySelector(".btn-download");
    $downloadBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._downloadImg();
    });
    const $copyBtn = this.$ui.querySelector(".btn-copy");
    $copyBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      await this._copyImg();
    });
    const $expandBtn = this.$ui.querySelector(".btn-expand");
    $expandBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.imgViewer.setImage(this.src);
      this.imgViewer.open();
    });
  }
  init() {
    this._init3D();
    this._initDOM();
  }
  update(position) {
    if (this.revealed) {
      const screen = position.clone().add(this.center);
      screen.project(this.camera);
      const x = (screen.x * 0.5 + 0.5) * SIZES.width - this.widthPx * 0.5;
      const y = (-screen.y * 0.5 + 0.5) * SIZES.height - this.heightPx * 0.5;
      this.$ui.style.left = x + "px";
      this.$ui.style.top = y + "px";
      this.$ui.style.scale = `${this.mesh.scale.x} ${this.mesh.scale.y}`;
    }
  }
  dispose() {
    this._hide();
    this.geometry.dispose();
    this.material.dispose();
    this.$container.removeChild(this.$ui);
  }
  handleClick() {
    this._toggle();
  }
  _toggle() {
    if (!this.revealed) {
      this._reveal();
    } else {
      this._hide();
    }
  }
  _hide() {
    this.revealed = false;
    this.$ui.classList.remove("visible");
  }
  _reveal() {
    this.revealed = true;
    this.$ui.classList.add("visible");
  }
  async _copyImg() {
    try {
      await copyImageToClipboard(this.src);
      console.log("image copied");
    } catch (err) {
      console.error(err.name, err.message);
    }
  }
  _downloadImg() {
    const a = document.createElement("a");
    a.href = this.src;
    a.download = this.id || "download";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

export default Card;
