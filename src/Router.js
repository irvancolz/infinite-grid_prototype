class Router {
  constructor(routes) {
    this.routes = routes;
    this.rootElem = document.getElementById("app");
    this.loadInitialRoute();
    this.handleLinks();
    window.addEventListener("popstate", () =>
      this.loadRoute(location.pathname)
    );
  }

  handleLinks() {
    document.body.addEventListener("click", (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        this.navigateTo(e.target.href);
      }
    });
  }

  navigateTo(url) {
    history.pushState(null, null, url);
    this.loadRoute(url);
  }

  loadRoute(path) {
    const route = this.routes.find((r) => r.path === path);
    if (route) {
      this.rootElem.innerHTML = route.view();
    } else {
      this.rootElem.innerHTML = "<h1>404 - Not Found</h1>";
    }
  }

  loadInitialRoute() {
    this.loadRoute(location.pathname);
  }
}

export default Router;
