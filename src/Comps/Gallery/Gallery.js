class Gallery {
  constructor() {
    this.$ui = document.createElement("div");
    this.$ui.className = "gallery";
    this.$ui.innerHTML = `
      <div class="img_container">
          <img 
            src="home_gallery_3.webp" 
            alt="" 
            class="img" 
          />
          <img 
            src="home_gallery_1.webp" 
            alt="" 
            class="img" 
          />
          <img
            src="home_gallery_2.webp"
            alt=""
            class="img"
          />
        </div>
      <a class="link" href="/gallery">see more</a>
        `;
  }
}

export default Gallery;
