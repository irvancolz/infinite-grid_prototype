import App from "./App";
import ImageViewer from "./ImageViewer";
import "./index.scss";

const app = new App({ content: document.getElementById("app") });
window.addEventListener("load", async () => {
  await app.render();
});

window.addEventListener("hashchange", async () => {
  app.dispose();
  await app.render();
});
