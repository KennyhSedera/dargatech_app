import{j as e,r as l,L as S}from"./app-BHlEgV8h.js";import{A as U}from"./AuthenticatedLayout-BjgeGHNf.js";import{g as A,d as F}from"./userService-B8XBmkgl.js";import{H as E}from"./HeaderPage-0yGN3rak.js";import{S as _}from"./Snackbar-BQFkOtLk.js";import{C as D}from"./ConfirmDialog-DBsVJ0Bp.js";import{s as P,y as H,F as I,u as M,t as z}from"./constant-DWaMCm0f.js";import{E as R}from"./EmptyState-ZOOdGK54.js";import"./transition-B_kQGfJg.js";import"./index-BXs8jzyO.js";import"./iconBase-BFETdY70.js";import"./useTheme-B_30QYdK.js";import"./index-CY0UWhOO.js";import"./api-BOyPyE9B.js";import"./Modal-DtVsgs1x.js";const T=({user:t,handleDelete:y,handleImageError:p})=>{var c,x,h,d,g,a,m,o,n,f,j,b;return e.jsxs("div",{className:"bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl",children:[e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 dark:from-indigo-600 dark:via-purple-600 dark:to-blue-700 opacity-90"}),e.jsxs("div",{className:"relative pt-4 pb-14 px-6 flex justify-between items-start",children:[e.jsx("h3",{className:"text-xl font-bold text-white",children:t.name}),e.jsx("div",{className:"relative",children:t.user_role.name!=="admin"&&e.jsx("button",{onClick:()=>y(t.id),className:"p-2 text-white hover:bg-red-50 dark:hover:bg-gray-700 rounded-full transition-colors",children:e.jsx(P,{})})})]}),e.jsx("div",{className:"absolute -bottom-12 left-6",children:e.jsx("div",{className:"h-24 w-24 rounded-xl shadow-md overflow-hidden border-4 border-white dark:border-gray-800",children:(c=t.profile)!=null&&c.photo||(x=t.technicien)!=null&&x.photo||(h=t.partenaire)!=null&&h.logo?e.jsx("img",{src:((d=t.profile)==null?void 0:d.photo)||((g=t.technicien)==null?void 0:g.photo)||((a=t.partenaire)==null?void 0:a.logo),alt:`${t.name}'s profile`,className:"h-full w-full object-cover bg-gray-100 dark:bg-gray-900",onError:p}):e.jsx("div",{className:"h-full w-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center",children:e.jsx(H,{className:"text-4xl text-gray-400 dark:text-gray-300"})})})})]}),e.jsxs("div",{className:"pt-14 px-6 pb-6",children:[e.jsx("div",{className:"mt-2 mb-4",children:e.jsx("span",{className:"inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white",children:t.user_role.name})}),e.jsxs("div",{className:"space-y-3 mt-4",children:[e.jsxs("div",{className:"flex items-center text-sm",children:[e.jsx(I,{className:"text-gray-500 dark:text-gray-400 mr-2"}),e.jsx("span",{className:"text-gray-800 dark:text-gray-200",children:t.email})]}),e.jsxs("div",{className:"flex items-center text-sm",children:[e.jsx(M,{className:"text-gray-500 dark:text-gray-400 mr-2"}),e.jsx("span",{className:"text-gray-800 dark:text-gray-200",children:((m=t.technicien)==null?void 0:m.contact)||((o=t.profile)==null?void 0:o.contact)||((n=t.partenaire)==null?void 0:n.telephone)})]}),e.jsxs("div",{className:"flex items-center text-sm",children:[e.jsx(z,{className:"text-gray-500 dark:text-gray-400 mr-2"}),e.jsx("span",{className:"text-gray-800 dark:text-gray-200",children:((f=t.technicien)==null?void 0:f.adress)||((j=t.profile)==null?void 0:j.adress)||((b=t.partenaire)==null?void 0:b.adresse)})]})]})]})]},t.id)},se=()=>{const[t,y]=l.useState([]),[p,c]=l.useState([]),[x,h]=l.useState(!0),[d,g]=l.useState(""),[a,m]=l.useState({open:!1,message:"",btnAcceptName:"",title:"",btnAcceptColor:""}),[o,n]=l.useState({open:!1,message:"",type:"success"});l.useEffect(()=>{(async()=>{try{const i=await A();y(i),c(i)}catch(i){console.error("Failed to fetch users:",i)}finally{h(!1)}})()},[]);const f=s=>{g(s);const i=t.filter(r=>{var u,w,N,C,v,L,k;return r.name.toLowerCase().includes(s.toLowerCase())||r.email.toLowerCase().includes(s.toLowerCase())||((u=r.technicien)==null?void 0:u.contact.toLowerCase().includes(s.toLowerCase()))||((w=r.technicien)==null?void 0:w.adress.toLowerCase().includes(s.toLowerCase()))||r.user_role.name.toLowerCase().includes(s.toLowerCase())||((N=r.profile)==null?void 0:N.adress.toLowerCase().includes(s.toLowerCase()))||((C=r.profile)==null?void 0:C.contact.toLowerCase().includes(s.toLowerCase()))||((v=r.partenaire)==null?void 0:v.telephone.toLowerCase().includes(s.toLowerCase()))||((L=r.partenaire)==null?void 0:L.adresse.toLowerCase().includes(s.toLowerCase()))||((k=r.partenaire)==null?void 0:k.site_web.toLowerCase().includes(s.toLowerCase()))});c(i)},j=s=>{s.target.onerror=null,s.target.src="/path/to/default-avatar.png"},b=s=>{m({open:!0,message:"Voulez-vous vraiment supprimer cet utilisateur ?",btnAcceptName:"Supprimer",title:"Suppression",btnAcceptColor:"bg-red-500 text-white"}),F(s).then(i=>{i.success?(n({...o,open:!0,message:"Utilisateur supprimé avec succès",type:"success"}),m({...a,open:!1}),fetchUsers()):n({...o,open:!0,message:i.message,type:"error"})})};return e.jsxs(U,{children:[e.jsx(S,{title:"Users"}),e.jsx(E,{title:"Liste des utilisateurs",onSearch:f,search:d,btn:!1}),e.jsx(D,{open:a.open,message:a.message,btnAcceptName:a.btnAcceptName,title:a.title,btnAcceptColor:a.btnAcceptColor,close:a.close,accept:a.accept}),e.jsx(_,{open:o.open,message:o.message,type:o.type,onClose:()=>n({...o,open:!1})}),e.jsx("div",{className:"py-8",children:e.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:x?e.jsx("div",{className:"flex justify-center items-center h-64",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"})}):p.length===0?e.jsx(R,{nom:"utilisateur",search:d}):e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",children:p.map(s=>e.jsx(T,{user:s,handleDelete:b,handleImageError:j},s.id))})})})]})};export{se as default};
