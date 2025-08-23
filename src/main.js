import App from "./App";
import "./index.scss";
import Topnav from "./Topnav/Topnav";

const topnav = new Topnav();

const app = new App({ content: document.getElementById("app") });
window.addEventListener("load", async () => {
  await app.render();
});

window.addEventListener("hashchange", async () => {
  app.dispose();
  await app.render();
});
