import{j as e,r}from"./app-BpSp9HcJ.js";import{c as f}from"./createLucideIcon-D535D088.js";function I({message:o,className:s="",...a}){return o?e.jsx("p",{...a,className:"text-sm text-red-600 dark:text-red-400 "+s,children:o}):null}/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],k=f("eye-off",m);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],b=f("eye",w),v=r.forwardRef(function({type:s="text",className:a="",isFocused:u=!1,value:c,...l},x){const n=r.useRef(null),[d,y]=r.useState(!1),i=s==="password",p=c??"";r.useImperativeHandle(x,()=>({focus:()=>{var t;return(t=n.current)==null?void 0:t.focus()}})),r.useEffect(()=>{var t;u&&((t=n.current)==null||t.focus())},[u]);const g=i?d?"text":"password":s,h=()=>{y(!d)};return e.jsxs("div",{className:"relative flex items-center",children:[e.jsx("input",{...l,value:p,type:g,className:"rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 "+(i?"pr-10 ":"")+a,ref:n}),i&&e.jsx("button",{type:"button",className:"absolute right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",onClick:h,tabIndex:"-1",children:d?e.jsx(b,{size:20,className:"h-5 w-5"}):e.jsx(k,{size:20,className:"h-5 w-5"})})]})});export{I,v as T};
