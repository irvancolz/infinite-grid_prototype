import App from "./App";
import "./index.scss";

const $comingSoonLinks = document.querySelectorAll(".link.coming_soon");
$comingSoonLinks.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    el.classList.add("clicked");
  });
});

const app = new App({ content: document.getElementById("app") });
window.addEventListener("load", async () => {
  await app.render();
});

window.addEventListener("hashchange", async () => {
  app.dispose();
  await app.render();
});
