import * as THREE from "three";
import EventEmitter from "./EventEmitter";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export default class ResourcesLoader extends EventEmitter {
  constructor(src) {
    super();
    this.sources = src;
    this.loaded = 0;
    this.total = src.length;
    this.resources = {};

    this.init();
    this.load();
  }

  init() {
    this.loader = {};
    this.loader.modelLoader = new GLTFLoader();
    this.loader.textureLoader = new THREE.TextureLoader();
    this.loader.videoLoader = new THREE.TextureLoader();
  }

  load() {
    for (const src of this.sources) {
      if (src.type == "texture") {
        this.loader.textureLoader.load(
          src.path,
          (texture) => {
            this._loadSource(src, texture);
          },
          undefined,

          // onError callback
          function (err) {
            console.error(err);
          }
        );
      } else if (src.type == "gltfModel") {
        this.loader.modelLoader.load(src.path, (texture) => {
          this._loadSource(src, texture);
        });
      } else if (src.type == "video") {
        const video = document.createElement("video");
        video.src = src.path;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.play();

        const texture = new THREE.VideoTexture(video);
        this._loadSource(src, texture);
      } else {
        console.error(
          `invalid resources type : '${src.type}' at resources : '${src.name}`
        );
      }
    }
  }

  _loadSource(src, file) {
    this.resources[src.name] = file;
    this.loaded++;

    if (this.loaded == this.total) {
      this.trigger("finish:loaded");
    }
  }
}
