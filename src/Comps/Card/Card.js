import * as THREE from "three";
import { PLANE, SIZES } from "../../const";
import { gsap } from "gsap";
import { getHeightInPx, getWidthInPx } from "../../math";
import ImageViewer from "../../ImageViewer";
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

    this.imgViewer = ImageViewer.getInstance();

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

    const yOffset = ((Math.abs(this.column) % 2) * PLANE.height) / 3;

    const x = this.column * PLANE.width + gap * (this.column - 1);
    const y = this.row * PLANE.height + gap * (this.row - 1);

    this.center = this.origin.clone().add({ x, y, z: 0 });

    this.mesh.position.copy(this.center);
  }
  _initDOM() {
    this.$ui = document.createElement("div");
    this.$ui.className = "card";

    this.$ui.innerHTML = `
    <button class="btn btn-download">download</button>
    <button class="btn btn-copy">copy</button>
    <button class="btn btn-expand">expand</button>
    `;

    this.widthPx = getWidthInPx(PLANE.width);
    this.heightPx = getHeightInPx(PLANE.height);
    this.$ui.style.width = `${this.widthPx}px`;
    this.$ui.style.height = `${this.heightPx}px`;

    this.$ui.addEventListener("click", (e) => {
      e.stopPropagation();
      this._hide();
    });

    document.body.append(this.$ui);

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
  update(position, scale) {
    if (this.$ui) {
      const screen = position.clone().add(this.center);
      screen.project(this.camera);
      const x = (screen.x * 0.5 + 0.5) * SIZES.width - this.widthPx * 0.5;
      const y = (-screen.y * 0.5 + 0.5) * SIZES.height - this.heightPx * 0.5;

      this.$ui.style.left = x + "px";
      this.$ui.style.top = y + "px";

      this.$ui.style.scale = `${this.mesh.scale.x} ${this.mesh.scale.y}`;
    }
    this.mesh.scale.copy(scale);
    this.mesh.position.copy(position).add(this.center);
  }
  dispose() {
    this.geometry.dispose();
    this.material.dispose();
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
    this.rotation.y += Math.PI;
    this.$ui.classList.remove("visible");
    gsap.to(this.mesh.rotation, {
      y: this.rotation.y,
    });
  }
  _reveal() {
    this.revealed = true;
    this.rotation.y -= Math.PI;
    this.$ui.classList.add("visible");
    gsap.to(this.mesh.rotation, {
      y: this.rotation.y,
    });
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
