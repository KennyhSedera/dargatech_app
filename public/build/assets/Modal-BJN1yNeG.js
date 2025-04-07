import{d as Ze,r as s,R as f,j as N}from"./app-BkC8VWgr.js";import{s as oe,K as y,L as $,o as w,y as S,n as A,a as z,b as B,u as Y,t as le,T as Je,l as ue,p as Qe,f as ye,O as pe,c as $e,i as V,d as et,z as xe,F as G}from"./transition-CGbVp9qO.js";var tt=Ze();function X(e){return oe.isServer?null:e instanceof Node?e.ownerDocument:e!=null&&e.hasOwnProperty("current")&&e.current instanceof Node?e.current.ownerDocument:document}let nt=s.createContext(void 0);function rt(){return s.useContext(nt)}let ot="span";var q=(e=>(e[e.None=1]="None",e[e.Focusable=2]="Focusable",e[e.Hidden=4]="Hidden",e))(q||{});function lt(e,t){var n;let{features:r=1,...o}=e,l={ref:t,"aria-hidden":(r&2)===2?!0:(n=o["aria-hidden"])!=null?n:void 0,hidden:(r&4)===4?!0:void 0,style:{position:"fixed",top:1,left:1,width:1,height:0,padding:0,margin:-1,overflow:"hidden",clip:"rect(0, 0, 0, 0)",whiteSpace:"nowrap",borderWidth:"0",...(r&4)===4&&(r&2)!==2&&{display:"none"}}};return $()({ourProps:l,theirProps:o,slot:{},defaultTag:ot,name:"Hidden"})}let ee=y(lt),ae=s.createContext(null);ae.displayName="DescriptionContext";function Te(){let e=s.useContext(ae);if(e===null){let t=new Error("You used a <Description /> component, but it is not inside a relevant parent.");throw Error.captureStackTrace&&Error.captureStackTrace(t,Te),t}return e}function ut(){let[e,t]=s.useState([]);return[e.length>0?e.join(" "):void 0,s.useMemo(()=>function(n){let r=w(l=>(t(a=>[...a,l]),()=>t(a=>{let i=a.slice(),u=i.indexOf(l);return u!==-1&&i.splice(u,1),i}))),o=s.useMemo(()=>({register:r,slot:n.slot,name:n.name,props:n.props,value:n.value}),[r,n.slot,n.name,n.props,n.value]);return f.createElement(ae.Provider,{value:o},n.children)},[t])]}let at="p";function it(e,t){let n=s.useId(),r=rt(),{id:o=`headlessui-description-${n}`,...l}=e,a=Te(),i=S(t);A(()=>a.register(o),[o,a.register]);let u=r||!1,d=s.useMemo(()=>({...a.slot,disabled:u}),[a.slot,u]),c={ref:i,...a.props,id:o};return $()({ourProps:c,theirProps:l,slot:d,defaultTag:at,name:a.name||"Description"})}let st=y(it),ct=Object.assign(st,{});var Fe=(e=>(e.Space=" ",e.Enter="Enter",e.Escape="Escape",e.Backspace="Backspace",e.Delete="Delete",e.ArrowLeft="ArrowLeft",e.ArrowUp="ArrowUp",e.ArrowRight="ArrowRight",e.ArrowDown="ArrowDown",e.Home="Home",e.End="End",e.PageUp="PageUp",e.PageDown="PageDown",e.Tab="Tab",e))(Fe||{});let dt=s.createContext(()=>{});function ft({value:e,children:t}){return f.createElement(dt.Provider,{value:e},t)}let mt=class extends Map{constructor(t){super(),this.factory=t}get(t){let n=super.get(t);return n===void 0&&(n=this.factory(t),this.set(t,n)),n}};function Pe(e,t){let n=e(),r=new Set;return{getSnapshot(){return n},subscribe(o){return r.add(o),()=>r.delete(o)},dispatch(o,...l){let a=t[o].call(n,...l);a&&(n=a,r.forEach(i=>i()))}}}function Le(e){return s.useSyncExternalStore(e.subscribe,e.getSnapshot,e.getSnapshot)}let pt=new mt(()=>Pe(()=>[],{ADD(e){return this.includes(e)?this:[...this,e]},REMOVE(e){let t=this.indexOf(e);if(t===-1)return this;let n=this.slice();return n.splice(t,1),n}}));function k(e,t){let n=pt.get(t),r=s.useId(),o=Le(n);if(A(()=>{if(e)return n.dispatch("ADD",r),()=>n.dispatch("REMOVE",r)},[n,e]),!e)return!1;let l=o.indexOf(r),a=o.length;return l===-1&&(l=a,a+=1),l===a-1}let te=new Map,j=new Map;function he(e){var t;let n=(t=j.get(e))!=null?t:0;return j.set(e,n+1),n!==0?()=>ve(e):(te.set(e,{"aria-hidden":e.getAttribute("aria-hidden"),inert:e.inert}),e.setAttribute("aria-hidden","true"),e.inert=!0,()=>ve(e))}function ve(e){var t;let n=(t=j.get(e))!=null?t:1;if(n===1?j.delete(e):j.set(e,n-1),n!==1)return;let r=te.get(e);r&&(r["aria-hidden"]===null?e.removeAttribute("aria-hidden"):e.setAttribute("aria-hidden",r["aria-hidden"]),e.inert=r.inert,te.delete(e))}function ht(e,{allowed:t,disallowed:n}={}){let r=k(e,"inert-others");A(()=>{var o,l;if(!r)return;let a=z();for(let u of(o=n==null?void 0:n())!=null?o:[])u&&a.add(he(u));let i=(l=t==null?void 0:t())!=null?l:[];for(let u of i){if(!u)continue;let d=X(u);if(!d)continue;let c=u.parentElement;for(;c&&c!==d.body;){for(let m of c.children)i.some(h=>m.contains(h))||a.add(he(m));c=c.parentElement}}return a.dispose},[r,t,n])}function vt(e,t,n){let r=B(o=>{let l=o.getBoundingClientRect();l.x===0&&l.y===0&&l.width===0&&l.height===0&&n()});s.useEffect(()=>{if(!e)return;let o=t===null?null:t instanceof HTMLElement?t:t.current;if(!o)return;let l=z();if(typeof ResizeObserver<"u"){let a=new ResizeObserver(()=>r.current(o));a.observe(o),l.add(()=>a.disconnect())}if(typeof IntersectionObserver<"u"){let a=new IntersectionObserver(()=>r.current(o));a.observe(o),l.add(()=>a.disconnect())}return()=>l.dispose()},[t,r,e])}let K=["[contentEditable=true]","[tabindex]","a[href]","area[href]","button:not([disabled])","iframe","input:not([disabled])","select:not([disabled])","textarea:not([disabled])"].map(e=>`${e}:not([tabindex='-1'])`).join(","),gt=["[data-autofocus]"].map(e=>`${e}:not([tabindex='-1'])`).join(",");var T=(e=>(e[e.First=1]="First",e[e.Previous=2]="Previous",e[e.Next=4]="Next",e[e.Last=8]="Last",e[e.WrapAround=16]="WrapAround",e[e.NoScroll=32]="NoScroll",e[e.AutoFocus=64]="AutoFocus",e))(T||{}),ne=(e=>(e[e.Error=0]="Error",e[e.Overflow=1]="Overflow",e[e.Success=2]="Success",e[e.Underflow=3]="Underflow",e))(ne||{}),Et=(e=>(e[e.Previous=-1]="Previous",e[e.Next=1]="Next",e))(Et||{});function wt(e=document.body){return e==null?[]:Array.from(e.querySelectorAll(K)).sort((t,n)=>Math.sign((t.tabIndex||Number.MAX_SAFE_INTEGER)-(n.tabIndex||Number.MAX_SAFE_INTEGER)))}function bt(e=document.body){return e==null?[]:Array.from(e.querySelectorAll(gt)).sort((t,n)=>Math.sign((t.tabIndex||Number.MAX_SAFE_INTEGER)-(n.tabIndex||Number.MAX_SAFE_INTEGER)))}var Se=(e=>(e[e.Strict=0]="Strict",e[e.Loose=1]="Loose",e))(Se||{});function yt(e,t=0){var n;return e===((n=X(e))==null?void 0:n.body)?!1:Y(t,{0(){return e.matches(K)},1(){let r=e;for(;r!==null;){if(r.matches(K))return!0;r=r.parentElement}return!1}})}var $t=(e=>(e[e.Keyboard=0]="Keyboard",e[e.Mouse=1]="Mouse",e))($t||{});typeof window<"u"&&typeof document<"u"&&(document.addEventListener("keydown",e=>{e.metaKey||e.altKey||e.ctrlKey||(document.documentElement.dataset.headlessuiFocusVisible="")},!0),document.addEventListener("click",e=>{e.detail===1?delete document.documentElement.dataset.headlessuiFocusVisible:e.detail===0&&(document.documentElement.dataset.headlessuiFocusVisible="")},!0));function F(e){e==null||e.focus({preventScroll:!0})}let xt=["textarea","input"].join(",");function Tt(e){var t,n;return(n=(t=e==null?void 0:e.matches)==null?void 0:t.call(e,xt))!=null?n:!1}function Ft(e,t=n=>n){return e.slice().sort((n,r)=>{let o=t(n),l=t(r);if(o===null||l===null)return 0;let a=o.compareDocumentPosition(l);return a&Node.DOCUMENT_POSITION_FOLLOWING?-1:a&Node.DOCUMENT_POSITION_PRECEDING?1:0})}function W(e,t,{sorted:n=!0,relativeTo:r=null,skipElements:o=[]}={}){let l=Array.isArray(e)?e.length>0?e[0].ownerDocument:document:e.ownerDocument,a=Array.isArray(e)?n?Ft(e):e:t&64?bt(e):wt(e);o.length>0&&a.length>1&&(a=a.filter(p=>!o.some(v=>v!=null&&"current"in v?(v==null?void 0:v.current)===p:v===p))),r=r??l.activeElement;let i=(()=>{if(t&5)return 1;if(t&10)return-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),u=(()=>{if(t&1)return 0;if(t&2)return Math.max(0,a.indexOf(r))-1;if(t&4)return Math.max(0,a.indexOf(r))+1;if(t&8)return a.length-1;throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last")})(),d=t&32?{preventScroll:!0}:{},c=0,m=a.length,h;do{if(c>=m||c+m<=0)return 0;let p=u+c;if(t&16)p=(p+m)%m;else{if(p<0)return 3;if(p>=m)return 1}h=a[p],h==null||h.focus(d),c+=i}while(h!==l.activeElement);return t&6&&Tt(h)&&h.select(),2}function Me(){return/iPhone/gi.test(window.navigator.platform)||/Mac/gi.test(window.navigator.platform)&&window.navigator.maxTouchPoints>0}function Pt(){return/Android/gi.test(window.navigator.userAgent)}function Lt(){return Me()||Pt()}function H(e,t,n,r){let o=B(n);s.useEffect(()=>{if(!e)return;function l(a){o.current(a)}return document.addEventListener(t,l,r),()=>document.removeEventListener(t,l,r)},[e,t,r])}function Ce(e,t,n,r){let o=B(n);s.useEffect(()=>{if(!e)return;function l(a){o.current(a)}return window.addEventListener(t,l,r),()=>window.removeEventListener(t,l,r)},[e,t,r])}const ge=30;function St(e,t,n){let r=k(e,"outside-click"),o=B(n),l=s.useCallback(function(u,d){if(u.defaultPrevented)return;let c=d(u);if(c===null||!c.getRootNode().contains(c)||!c.isConnected)return;let m=function h(p){return typeof p=="function"?h(p()):Array.isArray(p)||p instanceof Set?p:[p]}(t);for(let h of m)if(h!==null&&(h.contains(c)||u.composed&&u.composedPath().includes(h)))return;return!yt(c,Se.Loose)&&c.tabIndex!==-1&&u.preventDefault(),o.current(u,c)},[o,t]),a=s.useRef(null);H(r,"pointerdown",u=>{var d,c;a.current=((c=(d=u.composedPath)==null?void 0:d.call(u))==null?void 0:c[0])||u.target},!0),H(r,"mousedown",u=>{var d,c;a.current=((c=(d=u.composedPath)==null?void 0:d.call(u))==null?void 0:c[0])||u.target},!0),H(r,"click",u=>{Lt()||a.current&&(l(u,()=>a.current),a.current=null)},!0);let i=s.useRef({x:0,y:0});H(r,"touchstart",u=>{i.current.x=u.touches[0].clientX,i.current.y=u.touches[0].clientY},!0),H(r,"touchend",u=>{let d={x:u.changedTouches[0].clientX,y:u.changedTouches[0].clientY};if(!(Math.abs(d.x-i.current.x)>=ge||Math.abs(d.y-i.current.y)>=ge))return l(u,()=>u.target instanceof HTMLElement?u.target:null)},!0),Ce(r,"blur",u=>l(u,()=>window.document.activeElement instanceof HTMLIFrameElement?window.document.activeElement:null),!0)}function U(...e){return s.useMemo(()=>X(...e),[...e])}function De(e,t,n,r){let o=B(n);s.useEffect(()=>{e=e??window;function l(a){o.current(a)}return e.addEventListener(t,l,r),()=>e.removeEventListener(t,l,r)},[e,t,r])}function Mt(){let e;return{before({doc:t}){var n;let r=t.documentElement,o=(n=t.defaultView)!=null?n:window;e=Math.max(0,o.innerWidth-r.clientWidth)},after({doc:t,d:n}){let r=t.documentElement,o=Math.max(0,r.clientWidth-r.offsetWidth),l=Math.max(0,e-o);n.style(r,"paddingRight",`${l}px`)}}}function Ct(){return Me()?{before({doc:e,d:t,meta:n}){function r(o){return n.containers.flatMap(l=>l()).some(l=>l.contains(o))}t.microTask(()=>{var o;if(window.getComputedStyle(e.documentElement).scrollBehavior!=="auto"){let i=z();i.style(e.documentElement,"scrollBehavior","auto"),t.add(()=>t.microTask(()=>i.dispose()))}let l=(o=window.scrollY)!=null?o:window.pageYOffset,a=null;t.addEventListener(e,"click",i=>{if(i.target instanceof HTMLElement)try{let u=i.target.closest("a");if(!u)return;let{hash:d}=new URL(u.href),c=e.querySelector(d);c&&!r(c)&&(a=c)}catch{}},!0),t.addEventListener(e,"touchstart",i=>{if(i.target instanceof HTMLElement)if(r(i.target)){let u=i.target;for(;u.parentElement&&r(u.parentElement);)u=u.parentElement;t.style(u,"overscrollBehavior","contain")}else t.style(i.target,"touchAction","none")}),t.addEventListener(e,"touchmove",i=>{if(i.target instanceof HTMLElement){if(i.target.tagName==="INPUT")return;if(r(i.target)){let u=i.target;for(;u.parentElement&&u.dataset.headlessuiPortal!==""&&!(u.scrollHeight>u.clientHeight||u.scrollWidth>u.clientWidth);)u=u.parentElement;u.dataset.headlessuiPortal===""&&i.preventDefault()}else i.preventDefault()}},{passive:!1}),t.add(()=>{var i;let u=(i=window.scrollY)!=null?i:window.pageYOffset;l!==u&&window.scrollTo(0,l),a&&a.isConnected&&(a.scrollIntoView({block:"nearest"}),a=null)})})}}:{}}function Dt(){return{before({doc:e,d:t}){t.style(e.documentElement,"overflow","hidden")}}}function Rt(e){let t={};for(let n of e)Object.assign(t,n(t));return t}let R=Pe(()=>new Map,{PUSH(e,t){var n;let r=(n=this.get(e))!=null?n:{doc:e,count:0,d:z(),meta:new Set};return r.count++,r.meta.add(t),this.set(e,r),this},POP(e,t){let n=this.get(e);return n&&(n.count--,n.meta.delete(t)),this},SCROLL_PREVENT({doc:e,d:t,meta:n}){let r={doc:e,d:t,meta:Rt(n)},o=[Ct(),Mt(),Dt()];o.forEach(({before:l})=>l==null?void 0:l(r)),o.forEach(({after:l})=>l==null?void 0:l(r))},SCROLL_ALLOW({d:e}){e.dispose()},TEARDOWN({doc:e}){this.delete(e)}});R.subscribe(()=>{let e=R.getSnapshot(),t=new Map;for(let[n]of e)t.set(n,n.documentElement.style.overflow);for(let n of e.values()){let r=t.get(n.doc)==="hidden",o=n.count!==0;(o&&!r||!o&&r)&&R.dispatch(n.count>0?"SCROLL_PREVENT":"SCROLL_ALLOW",n),n.count===0&&R.dispatch("TEARDOWN",n)}});function At(e,t,n=()=>({containers:[]})){let r=Le(R),o=t?r.get(t):void 0,l=o?o.count>0:!1;return A(()=>{if(!(!t||!e))return R.dispatch("PUSH",t,n),()=>R.dispatch("POP",t,n)},[e,t]),l}function Ot(e,t,n=()=>[document.body]){let r=k(e,"scroll-lock");At(r,t,o=>{var l;return{containers:[...(l=o.containers)!=null?l:[],n]}})}function ie(e,t){let n=s.useRef([]),r=w(e);s.useEffect(()=>{let o=[...n.current];for(let[l,a]of t.entries())if(n.current[l]!==a){let i=r(t,o);return n.current=t,i}},[r,...t])}function Nt(e){function t(){document.readyState!=="loading"&&(e(),document.removeEventListener("DOMContentLoaded",t))}typeof window<"u"&&typeof document<"u"&&(document.addEventListener("DOMContentLoaded",t),t())}let L=[];Nt(()=>{function e(t){if(!(t.target instanceof HTMLElement)||t.target===document.body||L[0]===t.target)return;let n=t.target;n=n.closest(K),L.unshift(n??t.target),L=L.filter(r=>r!=null&&r.isConnected),L.splice(10)}window.addEventListener("click",e,{capture:!0}),window.addEventListener("mousedown",e,{capture:!0}),window.addEventListener("focus",e,{capture:!0}),document.body.addEventListener("click",e,{capture:!0}),document.body.addEventListener("mousedown",e,{capture:!0}),document.body.addEventListener("focus",e,{capture:!0})});function Re(e){let t=w(e),n=s.useRef(!1);s.useEffect(()=>(n.current=!1,()=>{n.current=!0,le(()=>{n.current&&t()})}),[t])}let Ae=s.createContext(!1);function kt(){return s.useContext(Ae)}function Ee(e){return f.createElement(Ae.Provider,{value:e.force},e.children)}function It(e){let t=kt(),n=s.useContext(Ne),r=U(e),[o,l]=s.useState(()=>{var a;if(!t&&n!==null)return(a=n.current)!=null?a:null;if(oe.isServer)return null;let i=r==null?void 0:r.getElementById("headlessui-portal-root");if(i)return i;if(r===null)return null;let u=r.createElement("div");return u.setAttribute("id","headlessui-portal-root"),r.body.appendChild(u)});return s.useEffect(()=>{o!==null&&(r!=null&&r.body.contains(o)||r==null||r.body.appendChild(o))},[o,r]),s.useEffect(()=>{t||n!==null&&l(n.current)},[n,l,t]),o}let Oe=s.Fragment,Ht=y(function(e,t){let n=e,r=s.useRef(null),o=S(Je(m=>{r.current=m}),t),l=U(r),a=It(r),[i]=s.useState(()=>{var m;return oe.isServer?null:(m=l==null?void 0:l.createElement("div"))!=null?m:null}),u=s.useContext(re),d=ue();A(()=>{!a||!i||a.contains(i)||(i.setAttribute("data-headlessui-portal",""),a.appendChild(i))},[a,i]),A(()=>{if(i&&u)return u.register(i)},[u,i]),Re(()=>{var m;!a||!i||(i instanceof Node&&a.contains(i)&&a.removeChild(i),a.childNodes.length<=0&&((m=a.parentElement)==null||m.removeChild(a)))});let c=$();return d?!a||!i?null:tt.createPortal(c({ourProps:{ref:o},theirProps:n,slot:{},defaultTag:Oe,name:"Portal"}),i):null});function _t(e,t){let n=S(t),{enabled:r=!0,...o}=e,l=$();return r?f.createElement(Ht,{...o,ref:n}):l({ourProps:{ref:n},theirProps:o,slot:{},defaultTag:Oe,name:"Portal"})}let jt=s.Fragment,Ne=s.createContext(null);function Wt(e,t){let{target:n,...r}=e,o={ref:S(t)},l=$();return f.createElement(Ne.Provider,{value:n},l({ourProps:o,theirProps:r,defaultTag:jt,name:"Popover.Group"}))}let re=s.createContext(null);function Bt(){let e=s.useContext(re),t=s.useRef([]),n=w(l=>(t.current.push(l),e&&e.register(l),()=>r(l))),r=w(l=>{let a=t.current.indexOf(l);a!==-1&&t.current.splice(a,1),e&&e.unregister(l)}),o=s.useMemo(()=>({register:n,unregister:r,portals:t}),[n,r,t]);return[t,s.useMemo(()=>function({children:l}){return f.createElement(re.Provider,{value:o},l)},[o])]}let Ut=y(_t),ke=y(Wt),Vt=Object.assign(Ut,{Group:ke});function Yt(e,t=typeof document<"u"?document.defaultView:null,n){let r=k(e,"escape");De(t,"keydown",o=>{r&&(o.defaultPrevented||o.key===Fe.Escape&&n(o))})}function Gt(){var e;let[t]=s.useState(()=>typeof window<"u"&&typeof window.matchMedia=="function"?window.matchMedia("(pointer: coarse)"):null),[n,r]=s.useState((e=t==null?void 0:t.matches)!=null?e:!1);return A(()=>{if(!t)return;function o(l){r(l.matches)}return t.addEventListener("change",o),()=>t.removeEventListener("change",o)},[t]),n}function qt({defaultContainers:e=[],portals:t,mainTreeNode:n}={}){let r=U(n),o=w(()=>{var l,a;let i=[];for(let u of e)u!==null&&(u instanceof HTMLElement?i.push(u):"current"in u&&u.current instanceof HTMLElement&&i.push(u.current));if(t!=null&&t.current)for(let u of t.current)i.push(u);for(let u of(l=r==null?void 0:r.querySelectorAll("html > *, body > *"))!=null?l:[])u!==document.body&&u!==document.head&&u instanceof HTMLElement&&u.id!=="headlessui-portal-root"&&(n&&(u.contains(n)||u.contains((a=n==null?void 0:n.getRootNode())==null?void 0:a.host))||i.some(d=>u.contains(d))||i.push(u));return i});return{resolveContainers:o,contains:w(l=>o().some(a=>a.contains(l)))}}let Ie=s.createContext(null);function we({children:e,node:t}){let[n,r]=s.useState(null),o=He(t??n);return f.createElement(Ie.Provider,{value:o},e,o===null&&f.createElement(ee,{features:q.Hidden,ref:l=>{var a,i;if(l){for(let u of(i=(a=X(l))==null?void 0:a.querySelectorAll("html > *, body > *"))!=null?i:[])if(u!==document.body&&u!==document.head&&u instanceof HTMLElement&&u!=null&&u.contains(l)){r(u);break}}}}))}function He(e=null){var t;return(t=s.useContext(Ie))!=null?t:e}var _=(e=>(e[e.Forwards=0]="Forwards",e[e.Backwards=1]="Backwards",e))(_||{});function Kt(){let e=s.useRef(0);return Ce(!0,"keydown",t=>{t.key==="Tab"&&(e.current=t.shiftKey?1:0)},!0),e}function _e(e){if(!e)return new Set;if(typeof e=="function")return new Set(e());let t=new Set;for(let n of e.current)n.current instanceof HTMLElement&&t.add(n.current);return t}let zt="div";var D=(e=>(e[e.None=0]="None",e[e.InitialFocus=1]="InitialFocus",e[e.TabLock=2]="TabLock",e[e.FocusLock=4]="FocusLock",e[e.RestoreFocus=8]="RestoreFocus",e[e.AutoFocus=16]="AutoFocus",e))(D||{});function Xt(e,t){let n=s.useRef(null),r=S(n,t),{initialFocus:o,initialFocusFallback:l,containers:a,features:i=15,...u}=e;ue()||(i=0);let d=U(n);en(i,{ownerDocument:d});let c=tn(i,{ownerDocument:d,container:n,initialFocus:o,initialFocusFallback:l});nn(i,{ownerDocument:d,container:n,containers:a,previousActiveElement:c});let m=Kt(),h=w(E=>{let P=n.current;P&&(b=>b())(()=>{Y(m.current,{[_.Forwards]:()=>{W(P,T.First,{skipElements:[E.relatedTarget,l]})},[_.Backwards]:()=>{W(P,T.Last,{skipElements:[E.relatedTarget,l]})}})})}),p=k(!!(i&2),"focus-trap#tab-lock"),v=Qe(),M=s.useRef(!1),C={ref:r,onKeyDown(E){E.key=="Tab"&&(M.current=!0,v.requestAnimationFrame(()=>{M.current=!1}))},onBlur(E){if(!(i&4))return;let P=_e(a);n.current instanceof HTMLElement&&P.add(n.current);let b=E.relatedTarget;b instanceof HTMLElement&&b.dataset.headlessuiFocusGuard!=="true"&&(je(P,b)||(M.current?W(n.current,Y(m.current,{[_.Forwards]:()=>T.Next,[_.Backwards]:()=>T.Previous})|T.WrapAround,{relativeTo:E.target}):E.target instanceof HTMLElement&&F(E.target)))}},x=$();return f.createElement(f.Fragment,null,p&&f.createElement(ee,{as:"button",type:"button","data-headlessui-focus-guard":!0,onFocus:h,features:q.Focusable}),x({ourProps:C,theirProps:u,defaultTag:zt,name:"FocusTrap"}),p&&f.createElement(ee,{as:"button",type:"button","data-headlessui-focus-guard":!0,onFocus:h,features:q.Focusable}))}let Zt=y(Xt),Jt=Object.assign(Zt,{features:D});function Qt(e=!0){let t=s.useRef(L.slice());return ie(([n],[r])=>{r===!0&&n===!1&&le(()=>{t.current.splice(0)}),r===!1&&n===!0&&(t.current=L.slice())},[e,L,t]),w(()=>{var n;return(n=t.current.find(r=>r!=null&&r.isConnected))!=null?n:null})}function en(e,{ownerDocument:t}){let n=!!(e&8),r=Qt(n);ie(()=>{n||(t==null?void 0:t.activeElement)===(t==null?void 0:t.body)&&F(r())},[n]),Re(()=>{n&&F(r())})}function tn(e,{ownerDocument:t,container:n,initialFocus:r,initialFocusFallback:o}){let l=s.useRef(null),a=k(!!(e&1),"focus-trap#initial-focus"),i=ye();return ie(()=>{if(e===0)return;if(!a){o!=null&&o.current&&F(o.current);return}let u=n.current;u&&le(()=>{if(!i.current)return;let d=t==null?void 0:t.activeElement;if(r!=null&&r.current){if((r==null?void 0:r.current)===d){l.current=d;return}}else if(u.contains(d)){l.current=d;return}if(r!=null&&r.current)F(r.current);else{if(e&16){if(W(u,T.First|T.AutoFocus)!==ne.Error)return}else if(W(u,T.First)!==ne.Error)return;if(o!=null&&o.current&&(F(o.current),(t==null?void 0:t.activeElement)===o.current))return;console.warn("There are no focusable elements inside the <FocusTrap />")}l.current=t==null?void 0:t.activeElement})},[o,a,e]),l}function nn(e,{ownerDocument:t,container:n,containers:r,previousActiveElement:o}){let l=ye(),a=!!(e&4);De(t==null?void 0:t.defaultView,"focus",i=>{if(!a||!l.current)return;let u=_e(r);n.current instanceof HTMLElement&&u.add(n.current);let d=o.current;if(!d)return;let c=i.target;c&&c instanceof HTMLElement?je(u,c)?(o.current=c,F(c)):(i.preventDefault(),i.stopPropagation(),F(d)):F(o.current)},!0)}function je(e,t){for(let n of e)if(n.contains(t))return!0;return!1}var rn=(e=>(e[e.Open=0]="Open",e[e.Closed=1]="Closed",e))(rn||{}),on=(e=>(e[e.SetTitleId=0]="SetTitleId",e))(on||{});let ln={0(e,t){return e.titleId===t.id?e:{...e,titleId:t.id}}},se=s.createContext(null);se.displayName="DialogContext";function Z(e){let t=s.useContext(se);if(t===null){let n=new Error(`<${e} /> is missing a parent <Dialog /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(n,Z),n}return t}function un(e,t){return Y(t.type,ln,e,t)}let be=y(function(e,t){let n=s.useId(),{id:r=`headlessui-dialog-${n}`,open:o,onClose:l,initialFocus:a,role:i="dialog",autoFocus:u=!0,__demoMode:d=!1,unmount:c=!1,...m}=e,h=s.useRef(!1);i=function(){return i==="dialog"||i==="alertdialog"?i:(h.current||(h.current=!0,console.warn(`Invalid role [${i}] passed to <Dialog />. Only \`dialog\` and and \`alertdialog\` are supported. Using \`dialog\` instead.`)),"dialog")}();let p=$e();o===void 0&&p!==null&&(o=(p&V.Open)===V.Open);let v=s.useRef(null),M=S(v,t),C=U(v),x=o?0:1,[E,P]=s.useReducer(un,{titleId:null,descriptionId:null,panelRef:s.createRef()}),b=w(()=>l(!1)),ce=w(g=>P({type:0,id:g})),O=ue()?x===0:!1,[Be,Ue]=Bt(),Ve={get current(){var g;return(g=E.panelRef.current)!=null?g:v.current}},J=He(),{resolveContainers:Q}=qt({mainTreeNode:J,portals:Be,defaultContainers:[Ve]}),de=p!==null?(p&V.Closing)===V.Closing:!1;ht(d||de?!1:O,{allowed:w(()=>{var g,me;return[(me=(g=v.current)==null?void 0:g.closest("[data-headlessui-portal]"))!=null?me:null]}),disallowed:w(()=>{var g;return[(g=J==null?void 0:J.closest("body > *:not(#headlessui-portal-root)"))!=null?g:null]})}),St(O,Q,g=>{g.preventDefault(),b()}),Yt(O,C==null?void 0:C.defaultView,g=>{g.preventDefault(),g.stopPropagation(),document.activeElement&&"blur"in document.activeElement&&typeof document.activeElement.blur=="function"&&document.activeElement.blur(),b()}),Ot(d||de?!1:O,C,Q),vt(O,v,b);let[Ye,Ge]=ut(),qe=s.useMemo(()=>[{dialogState:x,close:b,setTitleId:ce,unmount:c},E],[x,E,b,ce,c]),fe=s.useMemo(()=>({open:x===0}),[x]),Ke={ref:M,id:r,role:i,tabIndex:-1,"aria-modal":d?void 0:x===0?!0:void 0,"aria-labelledby":E.titleId,"aria-describedby":Ye,unmount:c},ze=!Gt(),I=D.None;O&&!d&&(I|=D.RestoreFocus,I|=D.TabLock,u&&(I|=D.AutoFocus),ze&&(I|=D.InitialFocus));let Xe=$();return f.createElement(et,null,f.createElement(Ee,{force:!0},f.createElement(Vt,null,f.createElement(se.Provider,{value:qe},f.createElement(ke,{target:v},f.createElement(Ee,{force:!1},f.createElement(Ge,{slot:fe},f.createElement(Ue,null,f.createElement(Jt,{initialFocus:a,initialFocusFallback:v,containers:Q,features:I},f.createElement(ft,{value:b},Xe({ourProps:Ke,theirProps:m,slot:fe,defaultTag:an,features:sn,visible:x===0,name:"Dialog"})))))))))))}),an="div",sn=pe.RenderStrategy|pe.Static;function cn(e,t){let{transition:n=!1,open:r,...o}=e,l=$e(),a=e.hasOwnProperty("open")||l!==null,i=e.hasOwnProperty("onClose");if(!a&&!i)throw new Error("You have to provide an `open` and an `onClose` prop to the `Dialog` component.");if(!a)throw new Error("You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.");if(!i)throw new Error("You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.");if(!l&&typeof e.open!="boolean")throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${e.open}`);if(typeof e.onClose!="function")throw new Error(`You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${e.onClose}`);return(r!==void 0||n)&&!o.static?f.createElement(we,null,f.createElement(xe,{show:r,transition:n,unmount:o.unmount},f.createElement(be,{ref:t,...o}))):f.createElement(we,null,f.createElement(be,{ref:t,open:r,...o}))}let dn="div";function fn(e,t){let n=s.useId(),{id:r=`headlessui-dialog-panel-${n}`,transition:o=!1,...l}=e,[{dialogState:a,unmount:i},u]=Z("Dialog.Panel"),d=S(t,u.panelRef),c=s.useMemo(()=>({open:a===0}),[a]),m=w(C=>{C.stopPropagation()}),h={ref:d,id:r,onClick:m},p=o?G:s.Fragment,v=o?{unmount:i}:{},M=$();return f.createElement(p,{...v},M({ourProps:h,theirProps:l,slot:c,defaultTag:dn,name:"Dialog.Panel"}))}let mn="div";function pn(e,t){let{transition:n=!1,...r}=e,[{dialogState:o,unmount:l}]=Z("Dialog.Backdrop"),a=s.useMemo(()=>({open:o===0}),[o]),i={ref:t,"aria-hidden":!0},u=n?G:s.Fragment,d=n?{unmount:l}:{},c=$();return f.createElement(u,{...d},c({ourProps:i,theirProps:r,slot:a,defaultTag:mn,name:"Dialog.Backdrop"}))}let hn="h2";function vn(e,t){let n=s.useId(),{id:r=`headlessui-dialog-title-${n}`,...o}=e,[{dialogState:l,setTitleId:a}]=Z("Dialog.Title"),i=S(t);s.useEffect(()=>(a(r),()=>a(null)),[r,a]);let u=s.useMemo(()=>({open:l===0}),[l]),d={ref:i,id:r};return $()({ourProps:d,theirProps:o,slot:u,defaultTag:hn,name:"Dialog.Title"})}let gn=y(cn),We=y(fn);y(pn);let En=y(vn),wn=Object.assign(gn,{Panel:We,Title:En,Description:ct});function xn({children:e,show:t=!1,maxWidth:n="2xl",closeable:r=!0,onClose:o=()=>{}}){const l=()=>{r&&o()},a={sm:"sm:max-w-sm",md:"sm:max-w-md",lg:"sm:max-w-lg",xl:"sm:max-w-xl","2xl":"sm:max-w-2xl"}[n];return N.jsx(xe,{show:t,leave:"duration-200",children:N.jsxs(wn,{as:"div",id:"modal",className:"fixed inset-0 z-40 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0",onClose:l,children:[N.jsx(G,{enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:N.jsx("div",{className:"absolute inset-0 bg-gray-500/75 dark:bg-gray-900/75"})}),N.jsx(G,{enter:"ease-out duration-300",enterFrom:"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",enterTo:"opacity-100 translate-y-0 sm:scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 translate-y-0 sm:scale-100",leaveTo:"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95",children:N.jsx(We,{className:`mb-6 transform rounded-lg bg-white shadow-xl transition-all sm:mx-auto sm:w-full dark:bg-gray-800 dark:text-white p-4 z-40 ${a}`,children:e})})]})})}export{xn as M};
