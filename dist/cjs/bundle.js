"use strict";function renderHandler(e){return"string"==typeof e?document.createTextNode(e):function renderNode(e){let t=e,r="function"==typeof e.render;r&&(t=e.render(),e.vNode=t);const{tag:n,attrs:o,children:s}=t;let i=document.createElement(n);for(const[e,t]of Object.entries(o))e.startsWith("on")?i.addEventListener(e.substring(2).toLowerCase(),t):i.setAttribute(e,t);for(const e of s)i.appendChild(renderHandler(e));return r&&(e.vBase=i),i}(e)}function diffChildren(e,t){let r=[];e.forEach(((e,n)=>{r.push(diffTree(e,t[n]))}));let n=[];for(const r of t.slice(e.length))n.push((e=>(e.appendChild(renderHandler(r)),e)));return e=>{for(const[t,n]of function zip(e,t){const r=[];for(let n=0;n<Math.min(e,t);n++)r.push([e[n],t[n]]);return r}(r,e.childNodes))t(n);for(const t of n)t(e);return e}}function diffTree(e,t){if(!t)return e=>{e.remove()};if("string"==typeof e||"string"==typeof t)return e!==t?e=>{const r=renderHandler(t);return e.replaceWith(r),r}:e=>e;if(e.tag!==t.tag)return e=>{const r=renderHandler(t);return e.replaceWith(r),r};const r=function diffAttrs(e,t){let r=[];for(const[e,n]of Object.entries(t))r.push((t=>(e.startsWith("on")?t.addEventListener(e.substring(2).toLowerCase(),n):t.setAttribute(e,n),t)));for(const n in e)n in t||r.push((e=>(e.removeAttribute(n),e)));return e=>{for(const t of r)t(e);return e}}(e.attrs,t.attrs),n=diffChildren(e.children,t.children);return e=>(r(e),n(e),e)}Object.defineProperty(exports,"__esModule",{value:!0});exports.Component=class Component{constructor(...e){let t=e.shift()||{};this.props=Object.assign(t,{children:e.flat().filter((e=>e))||[]}),this.vNode=null,this.vBase=null,this.state={}}setState(e){this.state=Object.assign({},this.state,"function"==typeof e?e(this.state,this.props):e),function renderComponent(e){let t=e.render();e.vBase=diffTree(e.vBase,t)(e.vBase),e.vNode=t}(this)}},exports.arch=function arch(e,t,...r){return{tag:e,attrs:t,children:r.flat()||[]}},exports.render=function render(e,t){!function mount(e,t){return t.appendChild(e),e}(renderHandler(e),t)};
//# sourceMappingURL=bundle.js.map
