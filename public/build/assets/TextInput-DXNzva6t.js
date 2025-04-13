import{j as n,r as o}from"./app-jvMxUIYj.js";function I({message:t,className:e="",...r}){return t?n.jsx("p",{...r,className:"text-sm text-red-600 dark:text-red-400 "+e,children:t}):null}/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),w=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,s)=>s?s.toUpperCase():r.toLowerCase()),x=t=>{const e=w(t);return e.charAt(0).toUpperCase()+e.slice(1)},m=(...t)=>t.filter((e,r,s)=>!!e&&e.trim()!==""&&s.indexOf(e)===r).join(" ").trim();/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var k={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=o.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:r=2,absoluteStrokeWidth:s,className:c="",children:a,iconNode:d,...i},f)=>o.createElement("svg",{ref:f,...k,width:e,height:e,stroke:t,strokeWidth:s?Number(r)*24/Number(e):r,className:m("lucide",c),...i},[...d.map(([l,p])=>o.createElement(l,p)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=(t,e)=>{const r=o.forwardRef(({className:s,...c},a)=>o.createElement(b,{ref:a,iconNode:e,className:m(`lucide-${h(x(t))}`,`lucide-${t}`,s),...c}));return r.displayName=x(t),r};/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],j=y("eye-off",C);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],E=y("eye",v),A=o.forwardRef(function({type:e="text",className:r="",isFocused:s=!1,...c},a){const d=o.useRef(null),[i,f]=o.useState(!1),l=e==="password";o.useImperativeHandle(a,()=>({focus:()=>{var u;return(u=d.current)==null?void 0:u.focus()}})),o.useEffect(()=>{var u;s&&((u=d.current)==null||u.focus())},[s]);const p=l?i?"text":"password":e,g=()=>{f(!i)};return n.jsxs("div",{className:"relative flex items-center",children:[n.jsx("input",{...c,type:p,className:"rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 "+(l?"pr-10 ":"")+r,ref:d}),l&&n.jsx("button",{type:"button",className:"absolute right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",onClick:g,tabIndex:"-1",children:i?n.jsx(E,{size:20,className:"h-5 w-5"}):n.jsx(j,{size:20,className:"h-5 w-5"})})]})});export{I,A as T};
