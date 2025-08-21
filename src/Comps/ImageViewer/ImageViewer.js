class ImageViewer {
  static instance;

  static getInstance() {
    return ImageViewer.instance;
  }

  constructor() {
    if (ImageViewer.instance) return ImageViewer.instance;

    ImageViewer.instance = this;

    this.opened = false;
    this.image = "./1.jpg";
    this.title = "lorem ipsum dolor";
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

    this.$img = document.createElement("img");
    this.$img.setAttribute("class", "img");
    this.setImage(this.image);
    this.$wrapper.appendChild(this.$img);

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
    const tempImg = new Image();
    tempImg.src = url;
    tempImg.onload = () => {
      this.$img.setAttribute("src", url);
      this.$ui.style.backgroundImage = `url(${url})`;
    };
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
    this.image = null;
    this.$ui.className = "";
    this.$img.setAttribute("src", "");
    this.$ui.style.backgroundImage = `url("")`;
  }
}

export default ImageViewer;
