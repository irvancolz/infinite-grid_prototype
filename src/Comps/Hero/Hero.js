class Hero {
  constructor() {
    this.$ui = document.createElement("div");
    this.$ui.className = "hero";
    this.$ui.innerHTML = `
    <h1 class="hero_title">Hosicoverse</h1>
    <div class="hero_description_container">
      <p class="hero_desc">A World of Hosico in Every Frame</p>
      <p class="hero_desc">we're shooting for the stars</p>
    </div>
    <video class="hero_video" muted loop autoplay playsinline>
      <source src="/home_hero.mp4" type="video/mp4" />
      <source src="/home_hero.webm" type="video/webm" />
    </video>
        `;
  }
}

export default Hero;
