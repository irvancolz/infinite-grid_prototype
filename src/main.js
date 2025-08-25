import App from "./App";
import "./index.scss";
import Topnav from "./Topnav/Topnav";

const topnav = new Topnav();

const app = new App({ content: document.getElementById("app") });
window.addEventListener("load", async () => {
  const name = location.hash.split("");
  name.splice(0, 2);
  const joined = name.join("");
  document.body.className = "body-" + joined;

  await app.render();
});

window.addEventListener("hashchange", async () => {
  const name = location.hash.split("");
  name.splice(0, 2);
  const joined = name.join("");
  document.body.className = "body-" + joined;
  app.dispose();
  await app.render();
});
