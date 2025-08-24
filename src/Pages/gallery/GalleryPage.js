import * as THREE from "three";
import { CAMERA_DISTANCE, CONFIG } from "../../const";
import Sizes from "../../Utils/Sizes";
import Time from "../../Utils/Time";
import Card from "../../Comps/Card/Card";
import ResourcesLoader from "../../Utils/ResourcesLoader";
import resources from "../../resources.json";

class GalleryPage {
  #CANCEL_DRAG_EVENTS = ["pointerup", "touchend", "touchcancel", "mouseup"];
  #INIT_DRAG_EVENTS = ["pointerdown", "touchstart", "mousedown"];
  #DRAG_EVENTS = ["pointermove", "touchmove", "mousemove"];
  constructor() {
    this.SIZES = new Sizes();
    this.TIME = new Time();
    this.started = false;

    this.config = {
      scrollX: 0.04,
      scrollY: 0.04,
      swipeX: 0.5,
      swipeY: 0.5,
      touch_multiplier: 36,
    };

    this.cards = [];
    this.raycaster = new THREE.Raycaster();

    this.dragged = false;
    this.selected = null;
    this.mouseStart = new THREE.Vector2();
    this.pointer = new THREE.Vector2();
    this.selector = new THREE.Vector2();
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
  _handleMouseDown(x, y) {
    this.dragged = true;
    this.mouseStart.x = (x / this.SIZES.width) * 2 - 1;
    this.mouseStart.y = -(y / this.SIZES.height) * 2 + 1;
  }
  _handleMouseUp() {
    this.dragged = false;
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
    this.camera.position.x = this.SIZES.frustumWidth * 0.4;
    this.camera.position.y = this.SIZES.PLANE.height * CONFIG.row * 0.5;

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

    this.resources = new ResourcesLoader(resources);
    this.resources.on("finish:loaded", () => {
      this._initColumnsCoord();
      this._initCards();
    });

    this.#CANCEL_DRAG_EVENTS.forEach((name) => {
      this.$ui.addEventListener(name, (e) => {
        this._handleMouseUp();
      });
    });

    this.#INIT_DRAG_EVENTS.forEach((name) => {
      this.$ui.addEventListener(name, (e) => {
        const touch = name.includes("touch");
        let x = touch ? e.touches[0].clientX : e.clientX;
        let y = touch ? e.touches[0].clientY : e.clientY;

        this._handleMouseDown(x, y);
      });
    });

    this.#DRAG_EVENTS.forEach((name) => {
      this.$ui.addEventListener(
        name,
        (e) => {
          e.preventDefault();
          const touch = name.includes("touch");
          let x = touch ? e.touches[0].clientX : e.clientX;
          let y = touch ? e.touches[0].clientY : e.clientY;

          this.selector.x = (x / this.SIZES.width) * 2 - 1;
          this.selector.y = -(y / this.SIZES.height) * 2 + 1;

          this._handleMouseMove(x, y, touch);
        },
        { passive: false }
      );
    });

    this.$ui.addEventListener("wheel", (e) => {
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
    this.columns.forEach((col) => {
      this._calcColumnFinalPos(col);
    });
    this.cards.forEach((card) => {
      card.resize();
    });
    //   camera
    this.camera.aspect = this.SIZES.width / this.SIZES.height;
    this.camera.updateProjectionMatrix();

    //   renderer
    this.renderer.setSize(this.SIZES.width, this.SIZES.height);
    this.renderer.setPixelRatio(this.SIZES.pixelRatio);
  }
  _handleScroll(e) {
    this.scroll.x = -Math.min(100, e.deltaX) * this.config.scrollX;
    this.scroll.y = Math.min(e.deltaY, 100) * this.config.scrollY * 5;

    this.columns.forEach((col) => {
      col.translation.add(
        new THREE.Vector3(this.scroll.x, this.scroll.y * col.factor, 0)
      );
    });
  }
  _handleMouseMove(x, y, touch) {
    this.pointer.x = (x / this.SIZES.width) * 2 - 1;
    this.pointer.y = -(y / this.SIZES.height) * 2 + 1;

    if (this.dragged) {
      this.columns.forEach((col) => {
        let translateX =
          (this.pointer.x - this.mouseStart.x) * this.config.swipeX;

        let translateY =
          (this.pointer.y - this.mouseStart.y) *
          this.config.swipeY *
          col.factor;

        if (touch) {
          translateY *= this.config.touch_multiplier;
        }

        col.translation.add(new THREE.Vector3(translateX, translateY, 0));
      });
    }
  }
  _loop() {
    if (!this.started) return;
    this.raycaster.setFromCamera(this.selector, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    if (intersects.length > 0) {
      this.selected = intersects[0].object.userData.id;
    } else {
      this.selected = null;
    }

    // update position
    this.columns.forEach((col, i) => {
      const yTresshold = this.SIZES.PLANE.height * CONFIG.row * 2;
      const currentYPos = col.group.position.y;
      if (Math.abs(currentYPos) > yTresshold) {
        const dir = currentYPos / Math.abs(currentYPos);

        col.group.position.y = yTresshold * 0.5 * -dir;

        const offset = (Math.abs(col.translation.y) - yTresshold) * dir;

        col.translation.y = col.group.position.y + offset;
      }

      const xTresshold = this.SIZES.PLANE.width * CONFIG.column * 2;
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
    const asset = resources.find((el) => el.name == `${i}`);
    const texture = this.resources.resources[`${i}`].clone();
    texture.colorSpace = THREE.SRGBColorSpace;

    const parent = this.columns.find((el) => {
      return el.x == config.x && el.y == config.y;
    });

    const tile = new Card({
      id: i,
      row,
      column,
      texture,
      camera: this.camera,
      src: asset.path,
    });

    parent.group.add(tile.mesh);
    parent.cards.push(tile);
    this.cards.push(tile);
  }
  _initColumns(coord) {
    for (let i = 0; i < CONFIG.column; i++) {
      const x = coord.x * CONFIG.column + i;
      const y = coord.y;
      const group = new THREE.Group();
      const factor = 0.0625 + i / 100;

      const cards = [];

      const translation = this._getColumnInitialPos(coord);

      this.columns.push({
        x,
        y,
        i,
        group,
        translation,
        factor,
        cards,
        coord,
      });

      this.scene.add(group);
    }
  }
  _initColumnsCoord() {
    this.columnCoords = [];

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const coord = new THREE.Vector3(-1, -1, 0).add({ x, y, z: 0 });

        this.columnCoords.push(coord);
      }
    }
  }
  _getColumnInitialPos(coord = new THREE.Vector3()) {
    const translation = coord.clone().multiply({
      x: CONFIG.column * this.SIZES.PLANE.width,
      y: CONFIG.row * this.SIZES.PLANE.height,
      z: 0,
    });
    return translation;
  }
  _calcColumnFinalPos(col) {
    const translation = this._getColumnInitialPos(col.coord);
    const offsetX = col.i * this.SIZES.PLANE.width;
    translation.add({ x: offsetX, y: 0, z: 0 });

    col.translation.copy(translation);
    col.group.position.copy(translation);
  }

  _initCards() {
    this.columnCoords.forEach((e) => {
      this._initColumns(e);
    });

    this.columns.forEach((col) => {
      this._calcColumnFinalPos(col);
    });

    this.columnCoords.forEach((e) => {
      for (let row = 0; row < CONFIG.row; row++) {
        for (let column = 0; column < CONFIG.column; column++) {
          const coordX = e.x * CONFIG.column + column;
          const coordY = e.y;
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
    this.columns.length = 0;
  }
}

export default GalleryPage;
