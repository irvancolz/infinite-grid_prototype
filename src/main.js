import "./style.css";
import Router from "./Router";

// Example usage
const routes = [
  {
    path: "/",
    view: () => `<h1>Home</h1><p>Welcome to the homepage!</p>`,
  },
  {
    path: "/about",
    view: () => `<h1>About</h1><p>This is a simple SPA router.</p>`,
  },
  {
    path: "/contact",
    view: () => `<h1>Contact</h1><p>Contact us at: example@email.com</p>`,
  },
];

const router = new Router(routes);
