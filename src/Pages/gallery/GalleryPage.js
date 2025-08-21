import * as THREE from "three";
import {
  CAMERA_DISTANCE,
  CONFIG,
  frustumHeight,
  frustumWidth,
  PLANE,
} from "../../const";
import Sizes from "../../Utils/Sizes";
import Time from "../../Utils/Time";
import Card from "../../Comps/Card/Card";
import ResourcesLoader from "../../Utils/ResourcesLoader";

class GalleryPage {
  constructor() {
    this.SIZES = new Sizes();
    this.TIME = new Time();
    this.started = false;

    this.cards = [];
    this.raycaster = new THREE.Raycaster();

    this.pressed = false;
    this.selected = null;
    this.pointer = new THREE.Vector2();
    this.scroll = new THREE.Vector2();

    this.scale = new THREE.Vector3();

    this.columns = [];

    this.SIZES.on("resize", () => {
      if (!this.started) return;

      this._resize();
    });
    this.TIME.on("tick", () => {
      this._loop();
    });
  }
  _initUI() {
    this.$ui = document.createElement("canvas");
    this.$ui.className = "canvas";
  }
  _init3D() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      this.SIZES.fov,
      this.SIZES.width / this.SIZES.height,
      0.1,
      100
    );
    this.camera.position.z = CAMERA_DISTANCE;
    // this.camera.position.z = 80;
    this.camera.position.x = frustumWidth * 0.4;
    this.camera.position.y = PLANE.height * CONFIG.row * 0.5;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.$ui,
    });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.setSize(this.SIZES.width, this.SIZES.height);
    this.renderer.render(this.scene, this.camera);
  }
  _init() {
    this.started = true;
    this._initUI();
    this._init3D();

    this.images = [];
    for (let i = 0; i < CONFIG.column * CONFIG.row; i++) {
      const item = {
        type: "texture",
        path: `./${i + 1}.jpg`,
        name: `img_${i + 1}`,
      };
      this.images.push(item);
    }
    this.resources = new ResourcesLoader(this.images);
    this.resources.on("finish:loaded", () => {
      this._initCards();
    });

    this.$ui.addEventListener("mouseup", () => {
      this.animating = false;
    });
    this.$ui.addEventListener("mouseleave", () => {
      this.animating = false;
    });
    this.$ui.addEventListener("mousedown", () => {
      this.animating = true;
    });
    document.addEventListener("mousemove", (e) => {
      this._handleMouseMove(e);
    });
    document.addEventListener("wheel", (e) => {
      this._handleScroll(e);
    });
    this.$ui.addEventListener("click", () => {
      const filtered = this.cards.filter(
        (el) => el.mesh.userData.id == this.selected
      );

      filtered.forEach((obj) => {
        obj.handleClick();
      });
    });
  }
  _resize() {
    //   camera
    this.camera.aspect = this.SIZES.width / this.SIZES.height;
    this.camera.updateProjectionMatrix();

    //   renderer
    this.renderer.setSize(this.SIZES.width, this.SIZES.height);
    this.renderer.setPixelRatio(this.SIZES.pixelRatio);
  }
  _handleScroll(e) {
    const speed = 0.04;

    this.scroll.x = -Math.min(100, e.deltaX) * speed;
    this.scroll.y = Math.min(e.deltaY, 100) * speed * 5;

    this.columns.forEach((col) => {
      col.translation.add(
        new THREE.Vector3(this.scroll.x, this.scroll.y * col.factor, 0)
      );
    });
  }
  _handleMouseMove(e) {
    this.pointer.x = (e.clientX / this.SIZES.width) * 2 - 1;
    this.pointer.y = -(e.clientY / this.SIZES.height) * 2 + 1;
  }
  _loop() {
    if (!this.started) return;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    if (intersects.length > 0) {
      this.selected = intersects[0].object.userData.id;
    } else {
      this.selected = null;
    }

    // update position
    this.columns.forEach((col, i) => {
      const yTresshold = PLANE.height * CONFIG.row * 2;
      const currentYPos = col.group.position.y;
      if (Math.abs(currentYPos) > yTresshold) {
        const dir = currentYPos / Math.abs(currentYPos);

        col.group.position.y = yTresshold * 0.5 * -dir;

        const offset = (Math.abs(col.translation.y) - yTresshold) * dir;

        col.translation.y = col.group.position.y + offset;
      }

      const xTresshold = PLANE.width * CONFIG.column * 2;
      const currentXPos = col.group.position.x;
      if (Math.abs(currentXPos) > xTresshold) {
        const dir = currentXPos / Math.abs(currentXPos);

        col.group.position.x = xTresshold * 0.5 * -dir;

        const offset = (Math.abs(col.translation.x) - xTresshold) * dir;

        col.translation.x = col.group.position.x + offset;
      }

      const deltaY = (col.translation.y - col.group.position.y) * 0.1;
      col.group.position.y += deltaY;

      const deltaX = (col.translation.x - col.group.position.x) * 0.1;
      col.group.position.x += deltaX;
    });

    // update cards
    this.columns.forEach((col) => {
      col.cards.forEach((card) => {
        card.update(col.group.position);
      });
    });

    this.renderer.render(this.scene, this.camera);
  }

  _createCard(column, row, config) {
    const i = row * CONFIG.column + column + 1;
    const asset = this.images.find((el) => el.name == `img_${i}`);
    const texture = this.resources.resources[`img_${i}`].clone();
    texture.colorSpace = THREE.SRGBColorSpace;

    const parent = this.columns.find((el) => {
      return el.x == config.x && el.y == config.y;
    });

    const tile = new Card({
      id: i,
      row,
      column,
      origin: new THREE.Vector3(),
      texture,
      camera: this.camera,
      src: asset.path,
    });

    parent.group.add(tile.mesh);
    parent.cards.push(tile);
    this.cards.push(tile);
  }
  _initColumns(config) {
    for (let i = 0; i < CONFIG.column; i++) {
      const x = config.coord.x * CONFIG.column + i;
      const y = config.coord.y;
      const group = new THREE.Group();
      const translation = config.pos.clone();
      const factor = (i + 1) / Math.pow(CONFIG.column, 2);
      const cards = [];

      const offsetX = i * PLANE.width;
      translation.add({ x: offsetX, y: 0, z: 0 });

      this.columns.push({
        x,
        y,
        group,
        translation,
        factor,
        origin: translation.clone(),
        cards,
      });

      group.position.copy(translation);
      this.scene.add(group);
    }
  }
  _initCards() {
    const coordnPos = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const coord = new THREE.Vector3(-1, -1, 0).add({ x, y, z: 0 });

        const pos = coord.clone().multiply({
          x: CONFIG.column * PLANE.width,
          y: CONFIG.row * PLANE.height,
          z: 0,
        });

        coordnPos.push({ coord, pos });
      }
    }

    coordnPos.forEach((e) => {
      this._initColumns(e);
    });

    coordnPos.forEach((e) => {
      for (let row = 0; row < CONFIG.row; row++) {
        for (let column = 0; column < CONFIG.column; column++) {
          const coordX = e.coord.x * CONFIG.column + column;
          const coordY = e.coord.y;
          this._createCard(column, row, { x: coordX, y: coordY });
        }
      }
    });
  }

  getUI() {
    return this.$ui;
  }
  dispose() {
    this.started = false;
    this.cards.forEach((card) => {
      this.scene.remove(card.mesh);
      card.dispose();
    });
  }
}

export default GalleryPage;
