import "./index.scss";
import GalleryPage from "./Pages/gallery/GalleryPage";
import HomePage from "./Pages/home/Home";
import Router from "./Router";

const routes = [
  {
    path: "/",
    view: new HomePage(),
  },
  {
    path: "/gallery",
    view: new GalleryPage(),
  },
];

const router = new Router(routes);
router.loadInitialRoute(location.pathname);
