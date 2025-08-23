class ImageViewer {
  #IMAGE_FORMAT = ["png", "jpg", "jpeg"];
  #VIDEO_FORMAT = ["mp4", "webm"];
  #IMAGE = "image";
  #VIDEO = "video";
  static instance;

  static getInstance() {
    return ImageViewer.instance;
  }

  constructor() {
    if (ImageViewer.instance) return ImageViewer.instance;

    ImageViewer.instance = this;

    this.opened = false;
    this.src = "./1.jpg";
    this.title = "lorem ipsum dolor";
    this.assetType = this.#IMAGE;
    this._init();
  }
  _init() {
    this.$ui = document.createElement("div");
    this.$ui.setAttribute("id", "image_viewer");
    this.$ui.className = this.opened ? "visible" : "";

    this.$wrapper = document.createElement("div");
    this.$wrapper.className = "wrapper";
    this.$wrapper.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    this._initAssetsWrapper();
    this.$wrapper.appendChild(this.$img);
    this.setImage(this.src);

    this.$closeBtn = document.createElement("button");
    this.$closeBtn.className = "btn btn-close";
    this.$closeBtn.innerHTML = `
    <svg class="icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
    `;

    this.$closeBtn.addEventListener("click", (e) => {
      this.close();
    });

    this.$wrapper.append(this.$closeBtn);

    this.$ui.appendChild(this.$wrapper);
    document.body.append(this.$ui);
  }
  setImage(url) {
    this.src = url;
    const splitted = url.split(".");
    const format = splitted[splitted.length - 1];

    const type = this._checkType(format);

    if (type != this.assetType) {
      this.assetType = type;
      const oldAssets = this.assetType == this.#IMAGE ? this.$video : this.$img;
      this.$wrapper.removeChild(oldAssets);

      const newAssets = this.assetType == this.#IMAGE ? this.$img : this.$video;
      this.$wrapper.appendChild(newAssets);
    }
    this._displayAsset();
  }
  setTitle(txt) {
    this.title = txt;
  }
  open() {
    this.opened = true;
    this.$ui.className = "visible";
  }
  close() {
    this.opened = false;
    this.src = null;
    this.$ui.className = "";
    this.$img.setAttribute("src", "");
    this.$ui.style.backgroundImage = `url("")`;
  }
  _initAssetsWrapper() {
    this.$img = document.createElement("img");
    this.$img.setAttribute("class", "img");

    this.$video = document.createElement("video");
    this.$video.className = "img";
    this.$video.muted = true;
    this.$video.loop = true;
    this.$video.autoplay = true;
  }

  _displayAsset() {
    this.$asset = this.assetType == this.#IMAGE ? this.$img : this.$video;
    this.$asset.src = this.src;
    this.$ui.style.backgroundImage = `url(${
      this.assetType == this.#IMAGE ? this.src : ""
    })`;
    if (this.assetType == this.#VIDEO) this.$asset.play();
  }
  _checkType(format) {
    if (this.#IMAGE_FORMAT.includes(format)) {
      return this.#IMAGE;
    } else if (this.#VIDEO_FORMAT.includes(format)) {
      return this.#VIDEO;
    } else {
      console.error("invalid assets to preview :", format);
      return "";
    }
  }
}

export default ImageViewer;
