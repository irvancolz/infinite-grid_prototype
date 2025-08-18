import { routes } from "./Router/routes";
import { UrlParser } from "./Router/urlParser";

class App {
  constructor({ content }) {
    this._content = content;
    this._prevUrl = null;
  }

  async render() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url];
    if (this._prevUrl) {
      const prevPage = routes[this._prevUrl];
      this._content.removeChild(prevPage.getUI());
    }
    this._content.append(page.getUI());
    this._prevUrl = url;
  }
}

export default App;
