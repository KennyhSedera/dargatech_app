import{r as t,j as e,m as C,c as D}from"./app-BkC8VWgr.js";import{S,C as P,D as T,G as F}from"./index-C9BLxk6X.js";import{H as E}from"./HeaderPage-DFPcx5HP.js";import{a as k,u as I}from"./index-C9tktaFt.js";import{T as A,I as v}from"./TextInput-BkqmQp0b.js";import{I as N}from"./InputLabel-DJrVxPwe.js";import{e as L}from"./validateForm-B0TA_X9F.js";import{n as R}from"./constant-B050u7nx.js";const $=async()=>{try{return(await k.get("/type_paiement")).data}catch(l){throw console.error("Erreur lors de la récupération des type paiements",l),l}},H=async l=>{try{return(await k.delete(`/type_paiement/${l}`)).data}catch(o){throw console.error("Erreur lors de la suppression du type paiement",o),o}},G=t.forwardRef(({className:l="",isFocused:o=!1,selectedFile:d,onLoadFile:p,onFocus:j,...u},h)=>{const r=t.useRef(null),[n,g]=t.useState("Sélectionner une image");t.useImperativeHandle(h,()=>({focus:()=>{var s;return(s=r.current)==null?void 0:s.focus()},click:()=>{var s;return(s=r.current)==null?void 0:s.click()},getFiles:()=>{var s;return(s=r.current)==null?void 0:s.files}})),t.useEffect(()=>{var s;o&&((s=r.current)==null||s.focus())},[o]),t.useEffect(()=>{d||g("Sélectionner une image")},[d]);const c=()=>{var s;(s=r.current)==null||s.click(),j()},y=()=>{var x,f;const s=(f=(x=r.current)==null?void 0:x.files)==null?void 0:f[0];s&&(g(s.name),p(s))};return e.jsxs("div",{children:[e.jsx("div",{onClick:c,className:`rounded-md line-clamp-1 px-2 py-2 border border-gray-300 shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700
                    dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600
                    dark:focus:ring-indigo-600 cursor-pointer
                    ${d?"":"text-gray-500"} ${l}`,children:n}),e.jsx("input",{...u,type:"file",ref:r,accept:"image/*",className:"hidden",onChange:y})]})}),O=({reload:l=()=>{}})=>{const{data:o,setData:d,errors:p,reset:j}=C({name:"",logo_path:null}),[u,h]=t.useState({open:!1,message:"",type:"success"}),[r,n]=t.useState({}),g=t.useRef(null),[c,y]=t.useState("Ajouter"),[s,x]=t.useState(!1),f=async()=>{var a;if(!L(o,n))return;const i=new FormData;i.append("name",o.name),i.append("logo_path",o.logo_path),x(!0),y("Loading ...");try{const{data:m}=await D.post(`${I}/type_paiement`,i);h({open:!0,message:m.message,type:"success"})}catch(m){console.error("Erreur:",((a=m.response)==null?void 0:a.data)||m.message)}finally{w()}},_=i=>{d({...o,logo_path:i})},w=()=>{j(),y("Ajouter"),x(!1),n({}),l()};return e.jsxs("div",{className:"w-full p-4 mt-4 bg-white rounded-lg shadow-sm dark:bg-gray-800",children:[e.jsx(S,{message:u.message,type:u.type,duration:3e3,position:"top-right",show:u.open,onClose:()=>h({...u,message:"",open:!1})}),e.jsx("div",{className:"text-lg font-semibold text-center",children:"Nouveau"}),e.jsxs("form",{className:"grid w-full grid-cols-1 gap-2 mb-4",children:[e.jsxs("div",{children:[e.jsx(N,{htmlFor:"type_name",value:"Nom"}),e.jsx(A,{id:"type_name",isFocused:!0,name:"type_name",value:o.name,className:"block w-full mt-1",autoComplete:"type_name",onChange:i=>d("name",i.target.value),required:!0,placeholder:"Nom de la type",onFocus:()=>n({...r,name:""})}),e.jsx(v,{message:r.name||p.name,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(N,{htmlFor:"logo_path",value:"Logo"}),e.jsx(G,{ref:g,selectedFile:o.logo_path,onLoadFile:_,onFocus:()=>n({...r,logo_path:""})}),e.jsx(v,{message:r.logo_path||p.logo_path,className:"mt-2"})]})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("button",{className:"w-auto px-4 py-1 mr-2 text-red-600 rounded-md bg-red-400/20 disabled:cursor-not-allowed",onClick:w,children:"Annuler"}),e.jsx("button",{disabled:s,className:"w-auto px-4 py-1 text-white bg-blue-500 rounded-md disabled:cursor-not-allowed disabled:opacity-10 ",onClick:f,children:c})]})]})},q=()=>{const[l,o]=t.useState("");t.useState({});const[d,p]=t.useState(1),[j,u]=t.useState([]),[h,r]=t.useState([]),[n,g]=t.useState({open:!1,message:"",id:0}),[c,y]=t.useState({open:!1,message:"",type:"success"}),s=[{key:"id",label:"ID"},{key:"name",label:"Nom"},{key:"logo_path",label:"logo",customRender:a=>e.jsx("img",{src:a,alt:"logo type",className:"w-10 h-10 object-cover rounded-md"})}],x=[{label:e.jsx(F,{className:"text-base"}),color:"text-red-500",hoverColor:"text-red-600",handler:a=>_(a)}],f=async()=>{try{const{type:a}=await $(),m=a.map(b=>({id:b.id,name:b.name,logo_path:b.logo_path}));u(m),r(m)}catch(a){console.log(a)}};t.useEffect(()=>{f()},[]);const _=a=>{g({open:!0,message:`Êtes-vous sûr de vouloir supprimer la type de paiement par ${a.name} ?`,id:a.id})},w=async()=>{const{message:a}=await H(n.id);y({...c,message:a,open:!0}),g({...n,open:!1,id:0}),f(),p(1)},i=a=>{o(a),p(1);const m=j.filter(b=>b.name.toString().toLowerCase().includes(a.toLowerCase()));r(m)};return e.jsxs("div",{children:[e.jsx(E,{search:l,onSearch:i,title:"Liste des types de paiement"}),e.jsx(S,{message:c.message,type:c.type,duration:3e3,position:"top-right",show:c.open,onClose:()=>y({...c,message:"",open:!1})}),e.jsx(P,{open:n.open,message:n.message,btnAcceptName:"Supprimer",title:"Suppression",btnAcceptColor:"bg-red-500 text-white",close:()=>g({...n,open:!1}),accept:w}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4",children:[e.jsx("div",{className:"sm:col-span-2",children:h.length>0?e.jsx(T,{headers:s,rows:h,itemsPerPage:10,actions:x,className:"mt-4",currentPage:d,onPageChange:p}):e.jsx("div",{className:"flex justify-center",children:e.jsx("img",{src:R,alt:"no data",className:"max-w-md opacity-50 mt-2"})})}),e.jsx("div",{className:"sm:col-span-1",children:e.jsx(O,{reload:()=>f()})})]})]})},W=Object.freeze(Object.defineProperty({__proto__:null,default:q},Symbol.toStringTag,{value:"Module"}));export{q as T,W as a,$ as g};
