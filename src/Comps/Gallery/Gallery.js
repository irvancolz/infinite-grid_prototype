class Gallery {
  constructor() {
    this.$ui = document.createElement("div");
    this.$ui.className = "gallery";
    this.$ui.innerHTML = `
    <div class="header">
      <p>gallery</p>
      <a href='#/gallery'>
        <span>see more</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M16.0468 13.3832C15.9572 13.4727 15.8347 13.5293 15.6932 13.5293C15.4198 13.5293 15.1936 13.303 15.1936 13.0296L15.1936 7.80645L9.97039 7.80645C9.69698 7.80645 9.4707 7.58018 9.4707 7.30676C9.4707 7.03335 9.69698 6.80707 9.97039 6.80707L15.6932 6.80707C15.9667 6.80707 16.1929 7.03335 16.1929 7.30676L16.1929 13.0296C16.1929 13.171 16.1364 13.2936 16.0468 13.3832Z" fill="#292D32"/>
        <path d="M15.9667 7.74049L8.03292 15.6742C7.83964 15.8675 7.51909 15.8675 7.32581 15.6742C7.13254 15.481 7.13254 15.1604 7.32581 14.9671L15.2596 7.03339C15.4528 6.84011 15.7734 6.84011 15.9667 7.03339C16.1599 7.22666 16.1599 7.54722 15.9667 7.74049Z" fill="#292D32"/>
        </svg>
      </a>
    </div>
      <div class="img_container">
      <picture class="img" >
        <source media="(min-width: 768px)" srcset="home_gallery_3.webp">
        <img src="home_gallery_3_sm.webp" alt="" />
      </picture>
      <picture class="img" >
        <source media="(min-width: 768px)" srcset="home_gallery_1.webp">
        <img src="home_gallery_1_sm.webp" alt="" />
      </picture>
      <picture class="img" >
        <source media="(min-width: 768px)" srcset="home_gallery_2.webp">
        <img src="home_gallery_2_sm.webp" alt="" />
      </picture>
        </div>
      <a class="link" href="#/gallery">see more</a>
        `;
  }
}

export default Gallery;
