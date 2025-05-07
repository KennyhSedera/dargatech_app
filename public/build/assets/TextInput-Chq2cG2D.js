import{j as c,r as o}from"./app-DZjtVRK5.js";function R({message:t,className:e="",...r}){return t?c.jsx("p",{...r,className:"text-sm text-red-600 dark:text-red-400 "+e,children:t}):null}/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),b=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,r,s)=>s?s.toUpperCase():r.toLowerCase()),x=t=>{const e=b(t);return e.charAt(0).toUpperCase()+e.slice(1)},m=(...t)=>t.filter((e,r,s)=>!!e&&e.trim()!==""&&s.indexOf(e)===r).join(" ").trim();/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var C={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=o.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:r=2,absoluteStrokeWidth:s,className:a="",children:n,iconNode:f,...d},i)=>o.createElement("svg",{ref:i,...C,width:e,height:e,stroke:t,strokeWidth:s?Number(r)*24/Number(e):r,className:m("lucide",a),...d},[...f.map(([p,l])=>o.createElement(p,l)),...Array.isArray(n)?n:[n]]));/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=(t,e)=>{const r=o.forwardRef(({className:s,...a},n)=>o.createElement(j,{ref:n,iconNode:e,className:m(`lucide-${k(x(t))}`,`lucide-${t}`,s),...a}));return r.displayName=x(t),r};/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],E=y("eye-off",v);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],I=y("eye",N),L=o.forwardRef(function({type:e="text",className:r="",isFocused:s=!1,value:a,...n},f){const d=o.useRef(null),[i,p]=o.useState(!1),l=e==="password",g=a??"";o.useImperativeHandle(f,()=>({focus:()=>{var u;return(u=d.current)==null?void 0:u.focus()}})),o.useEffect(()=>{var u;s&&((u=d.current)==null||u.focus())},[s]);const h=l?i?"text":"password":e,w=()=>{p(!i)};return c.jsxs("div",{className:"relative flex items-center",children:[c.jsx("input",{...n,value:g,type:h,className:"rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 "+(l?"pr-10 ":"")+r,ref:d}),l&&c.jsx("button",{type:"button",className:"absolute right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",onClick:w,tabIndex:"-1",children:i?c.jsx(I,{size:20,className:"h-5 w-5"}):c.jsx(E,{size:20,className:"h-5 w-5"})})]})});export{R as I,L as T};
