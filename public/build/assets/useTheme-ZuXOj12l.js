import{r as o}from"./app-BkC8VWgr.js";function d(){const[e,c]=o.useState(localStorage.getItem("theme")||"light");return o.useEffect(()=>{const s=window.document.documentElement,r=t=>{t==="dark"||t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches?s.classList.add("dark"):s.classList.remove("dark")};if(r(e),localStorage.setItem("theme",e),e==="system"){const t=window.matchMedia("(prefers-color-scheme: dark)"),a=m=>r(m.matches?"dark":"light");return t.addEventListener("change",a),()=>t.removeEventListener("change",a)}},[e]),{theme:e,setTheme:c}}export{d as u};
