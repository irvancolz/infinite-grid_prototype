import "./index.scss";
import HomePage from "./Pages/home/Home";
import Router from "./Router";

const routes = [
  {
    path: "/",
    view: new HomePage(),
  },
  // {
  //   path: "/about",
  //   view: () => `<h1>About</h1><p>This is a simple SPA router.</p>`,
  // },
  // {
  //   path: "/contact",
  //   view: () => `<h1>Contact</h1><p>Contact us at: example@email.com</p>`,
  // },
];

const router = new Router(routes);
