import About from "../../Comps/About/About";
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
  }
  getUI() {
    return this.$ui;
  }
}

export default HomePage;
