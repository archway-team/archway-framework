/* Rendering Engine */
function arch(tag, attrs, ...children) {
  return {
    tag,
    attrs,
    children: children.flat() || [],
  };
}

function renderNode(node) {
  let vNode = node;
  let component = typeof node.render == "function";
  if (component) {
    vNode = node.render();
    node.vNode = vNode;
  }

  const { tag, attrs, children } = vNode;

  let el = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    key.startsWith("on")
      ? el.addEventListener(key.substring(2).toLowerCase(), value)
      : el.setAttribute(key, value);
  }
  for (const child of children) {
    el.appendChild(renderHandler(child));
  }
  if (component) {
    node.vBase = el;
  }

  return el;
}

function renderHandler(node) {
  return typeof node === "string"
    ? document.createTextNode(node)
    : renderNode(node);
}

function mount(node, target) {
  target.appendChild(node);
  return node;
}

function render(node, target) {
  mount(renderHandler(node), target);
}

/* Diff Algorithm */
function zip(xs, ys) {
  const zipped = [];
  for (let i = 0; i < Math.min(xs, ys); i++) {
    zipped.push([xs[i], ys[i]]);
  }
  return zipped;
}

function diffAttrs(oldAttrs, newAttrs) {
  let patches = [];
  for (const [key, value] of Object.entries(newAttrs)) {
    patches.push((node) => {
      key.startsWith("on")
        ? node.addEventListener(key.substring(2).toLowerCase(), value)
        : node.setAttribute(key, value);

      return node;
    });
  }
  for (const key in oldAttrs) {
    if (!(key in newAttrs)) {
      patches.push((node) => {
        node.removeAttribute(key);
        return node;
      });
    }
  }
  return (node) => {
    for (const patch of patches) {
      patch(node);
    }
    return node;
  };
}

function diffChildren(oldChildren, newChildren) {
  let patches = [];
  oldChildren.forEach((child, i) => {
    patches.push(diffTree(child, newChildren[i]));
  });

  let _patches = [];
  for (const child of newChildren.slice(oldChildren.length)) {
    _patches.push((node) => {
      node.appendChild(renderHandler(child));
      return node;
    });
  }
  return (parent) => {
    for (const [patch, child] of zip(patches, parent.childNodes)) patch(child);

    for (const patch of _patches) patch(parent);

    return parent;
  };
}

function diffTree(oldTree, newTree) {
  if (!newTree) {
    return (node) => {
      node.remove();
    };
  }
  if (typeof oldTree == "string" || typeof newTree == "string") {
    if (oldTree !== newTree) {
      return (node) => {
        const replacement = renderHandler(newTree);
        node.replaceWith(replacement);
        return replacement;
      };
    } else {
      return (node) => node;
    }
  }
  if (oldTree.tag !== newTree.tag) {
    return (node) => {
      const replacement = renderHandler(newTree);
      node.replaceWith(replacement);
      return replacement;
    };
  }
  const patchAttrs = diffAttrs(oldTree.attrs, newTree.attrs);
  const patchChildren = diffChildren(oldTree.children, newTree.children);

  return (node) => {
    patchAttrs(node);
    patchChildren(node);
    return node;
  };
}

/* Component */
class Component {
  constructor(...props) {
    let attrs = props.shift() || {};

    this.props = Object.assign(attrs, {
      children: props.flat().filter((v) => v) || [],
    });

    this.vNode = null;
    this.vBase = null;
    this.state = {};
  }
  setState(state) {
    this.state = Object.assign(
      {},
      this.state,
      typeof state == "function" ? state(this.state, this.props) : state
    );

    renderComponent(this);
  }
}

function renderComponent(node) {
  let nApp = node.render();
  node.vBase = diffTree(node.vBase, nApp)(node.vBase);
  node.vNode = nApp;
}

/* Exports */
export { render, arch, Component };
