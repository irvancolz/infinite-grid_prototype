import About from "../../Comps/About/About";
import Gallery from "../../Comps/Gallery/Gallery";
import Hero from "../../Comps/Hero/Hero";

class HomePage {
  constructor() {
    this.sections = [];
    this._init();
  }
  _init() {
    this.$ui = document.createElement("div");
    this.$ui.className = "home";

    this._initSections();
  }
  _initSections() {
    this.hero = new Hero();
    this.$ui.append(this.hero.$ui);

    this.about = new About();
    this.$ui.append(this.about.$ui);

    this.gallery = new Gallery();
    this.$ui.append(this.gallery.$ui);
  }
  getUI() {
    return this.$ui;
  }
}

export default HomePage;
