import { Component } from "../../index.js";
import { a } from "../html/index.js";

let router;

class Link extends Component {
  constructor(...props) {
    super(...props);

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }

    e.preventDefault();

    if (!router) {
      throw new Error(
        "You must declare an router before you can use link components."
      );
    }

    router.navigate(this.props.href);

    return false;
  }
  render() {
    let attrs = Object.assign({}, this.props, {
      onClick: this.handleClick,
    });

    delete attrs.children;

    return a(attrs, this.props.children);
  }
}

class Router {
  constructor(root) {
    this.routes = {};
    this.current = location.pathname;

    this.root = root;
    this.init();

    router = this;
  }
  get(path, render) {
    this.routes[path] = render;
  }
  remove(path) {
    delete this.routes[path];
  }
  init() {
    window.addEventListener("popstate", (e) => {
      const state = e.state;
      if (state !== null) {
        this.restoreHistory();
      }
    });
  }
  async restoreHistory(path) {
    this.saveHistory();

    path = path || location.pathname + location.search;
    // let cached = getHistoryCache(path)
    // if(cached) { window.scrollTo(0, cached.scroll) }

    force.clear();
    await this.render(path);

    this.current = path;
  }
  pushUrlHistory(url) {
    history.pushState({ url }, "", url);
  }
  saveHistory() {
    let url = this.current || location.pathname + location.search;
    history.replaceState({ url }, document.title, location.href);
  }
  async navigate(path) {
    if (this.current !== path) {
      await this.restoreHistory(path);
      this.pushUrlHistory(path);
    }
  }
  start() {
    this.render(this.current);
  }
  async render(path) {
    if (this.routes.hasOwnProperty(path)) {
      render(await this.routes[path]({ pathname: path }), this.root);
    } else {
      render(await this.routes["404"]({ pathname: path }), this.root);
    }
  }
}

export { Link, Router };
