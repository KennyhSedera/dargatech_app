import{r as s,m as G,j as e,L as H,S as q}from"./app-CioeRhEc.js";import{C as M}from"./ConfirmDialog-BRq-JB5K.js";import{D as R,G as W}from"./index-CYReqibt.js";import{c as z,u as J,a as K,d as Q}from"./PaiementService-C34hHa2x.js";import{b as U}from"./clientService-azgSIGnW.js";import{I as h,T as A}from"./TextInput-BT7Wr8cb.js";import{I as j}from"./InputLabel-C9t2yx6r.js";import{g as X}from"./TypePaiementService-BdBmOX0c.js";import{M as Y}from"./Modal-DJASKe-o.js";import{I as O}from"./InputAutocomplete -CLTyez5k.js";import{d as Z}from"./validateForm-CYcmU5RH.js";import{o as ee,n as te,f as ae,q as se}from"./constant-CwlMxgGQ.js";import{S as oe}from"./Snackbar-4vLpxNND.js";import{A as ne}from"./AuthenticatedLayout-BhxuBAw7.js";import re from"./TypePaiement-DOJIqBgN.js";import{H as ie}from"./HeaderPage-DXXNTJKk.js";import{T as me}from"./index-CEzzQFT5.js";import"./iconBase-CQTiVuH1.js";import"./api-B9u69R4T.js";import"./transition-h6HD-RMB.js";import"./useTheme-CDz0N4Kl.js";import"./index-D0oqvPkB.js";import"./InputImage-DWROZpOv.js";const le=({open:L=!0,setOpen:T,dataModify:r={},onCloseFormulaire:v=()=>{}})=>{const[y,c]=s.useState("Enregistrer"),[i,d]=s.useState({}),[C,w]=s.useState(!1),[S,N]=s.useState([]),[D,P]=s.useState([]),{data:n,setData:l,errors:m,reset:g}=G({client_id:"",montant:"",date_paiement:new Date().toISOString().split("T")[0],mode_paiement:"",periode_couverte:"",receipt_path:""}),_=async()=>{var a;try{const[{clients:u},$]=await Promise.all([U(),X()]);N(u==null?void 0:u.map(p=>({id:p.id,nom:`${p.nom} ${p.prenom}`}))),P((a=$.type)==null?void 0:a.map(p=>({id:p.id,nom:p.name})))}catch(u){console.error("Error fetching clients or payment types:",u)}},f=s.useCallback(()=>{r.id?(l({client_id:r.client_id||"",montant:r.montant||"",date_paiement:ee(r.date_paiement)||new Date().toISOString().split("T")[0],mode_paiement:parseInt(r.mode_paiement)||"",periode_couverte:r.periode_couverte||"",receipt_path:r.receipt_path||""}),c("Modifier")):k()},[r,l]),b=a=>{T(!1),k(),v(a)},k=()=>{g(),c("Enregistrer"),d({})};s.useEffect(()=>{_()},[]),s.useEffect(()=>{f()},[r,f]);const F=async()=>{if(Z(n,d)){w(!0),c("Loading ...");try{let a;y==="Enregistrer"?{message:a}=await z(n):{message:a}=await J(r.id,n),b(a)}catch(a){console.error("Error submitting payment:",a)}finally{w(!1),c("Enregistrer")}}},I=a=>{l("client_id",a.id)},E=a=>{l("mode_paiement",a.id)};return e.jsxs(Y,{show:L,closeable:!1,onClose:b,maxWidth:"xl",children:[e.jsx("div",{className:"text-2xl font-semibold text-center",children:r.nom?"Modifier un Paiement":"Ajouter un Paiement"}),e.jsxs("form",{className:"grid w-full grid-cols-1 gap-4 my-6 sm:grid-cols-2",children:[e.jsxs("div",{children:[e.jsx(j,{htmlFor:"client_id",value:"Nom client"}),e.jsx(O,{data:S,isFocused:!0,className:"block w-full mt-1",onSelect:I,defaultValue:n.client_id,onFocus:()=>d({...i,client_id:""})}),e.jsx(h,{message:i.client_id||m.client_id,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(j,{htmlFor:"montant",value:"Montant ($)"}),e.jsx(A,{id:"montant",name:"montant",value:n.montant,className:"block w-full mt-1",autoComplete:"montant",onChange:a=>l("montant",a.target.value),required:!0,type:"number",onFocus:()=>d({...i,montant:""})}),e.jsx(h,{message:i.montant||m.montant,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(j,{htmlFor:"mode_paiement",value:"Mode paiement"}),e.jsx(O,{data:D,className:"block w-full mt-1",onSelect:E,defaultValue:n.mode_paiement,onFocus:()=>d({...i,mode_paiement:""})}),e.jsx(h,{message:i.mode_paiement||m.mode_paiement,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(j,{htmlFor:"periode_couverte",value:"Période couverte"}),e.jsx(A,{id:"periode_couverte",name:"periode_couverte",value:n.periode_couverte,className:"block w-full mt-1",autoComplete:"periode_couverte",onChange:a=>l("periode_couverte",a.target.value),required:!0,onFocus:()=>d({...i,periode_couverte:""})}),e.jsx(h,{message:i.periode_couverte||m.periode_couverte,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(j,{htmlFor:"date_paiement",value:"Date de paiement"}),e.jsx(A,{id:"date_paiement",name:"date_paiement",value:n.date_paiement,className:"block w-full mt-1",autoComplete:"date_paiement",type:"date",onChange:a=>l("date_paiement",a.target.value),required:!0,onFocus:()=>d({...i,date_paiement:""})}),e.jsx(h,{message:i.date_paiement||m.date_paiement,className:"mt-2"})]})]}),e.jsxs("div",{className:"flex items-center justify-end gap-4 px-1",children:[e.jsx("button",{type:"button",className:"px-4 py-1 text-red-500 rounded-md bg-red-400/10",onClick:()=>b(""),children:"Fermer"}),e.jsx("button",{type:"submit",className:`disabled:cursor-not-allowed rounded-md py-1 px-4 bg-blue-500 text-white ${C&&"opacity-25"}`,disabled:C,onClick:F,children:y})]})]})},Ie=()=>{const[L,T]=s.useState(""),[r,v]=s.useState({}),[y,c]=s.useState(1),[i,d]=s.useState(!1),[C,w]=s.useState([]),[S,N]=s.useState([]),[D,P]=s.useState(!0),[n,l]=s.useState({open:!1,message:"",id:0}),[m,g]=s.useState({open:!1,message:"",type:"success"}),[_,f]=s.useState(!1),[b,k]=s.useState(!1),F=[{key:"id",label:"ID"},{key:"nom",label:"Nom client"},{key:"montant",label:"Montant ($)"},{key:"mode_paiement",label:"Mode de paiement"},{key:"periode_couverte",label:"Periode couverte"},{key:"date_paiement",label:"Date de paiement"},{key:"statut_paiement",label:"Statut"},{key:"observation",label:"Observation"}],I=[{label:e.jsx(me,{className:"text-lg"}),color:"text-blue-500",hoverColor:"text-blue-600",handler:t=>B(t)},{label:e.jsx(W,{className:"text-base"}),color:"text-red-500",hoverColor:"text-red-600",handler:t=>p(t)}],E=()=>{q.visit("/form/paiement")},a=async()=>{try{P(!0);const{data:t}=await K(),x=t.map(o=>({id:o.id,client_id:o.client_id,nom:`${o.client.nom} ${o.client.prenom}`,montant:o.montant,mode_paiement:o.mode_paiement,periode_couverte:o.periode_couverte,date_paiement:ae(o.date_paiement),statut_paiement:o.statut_paiement,observation:o.observation}));w(x),N(x)}catch(t){console.log(t)}finally{P(!1)}};s.useEffect(()=>{a()},[]);const u=t=>{T(t),c(1);const x=C.filter(o=>o.nom.toLowerCase().includes(t.toLowerCase())||o.montant.toLowerCase().includes(t.toLowerCase())||o.type_paiement.toLowerCase().includes(t.toLowerCase())||o.periode_couverte.toLowerCase().includes(t.toLowerCase())||o.mode_paiement.toLowerCase().includes(t.toLowerCase())||o.date_paiement.toString().toLowerCase().includes(t.toLowerCase()));N(x)},$=t=>{a(),t&&g({...m,message:t,open:!0}),v({})},p=t=>{l({open:!0,message:`Êtes-vous sûr de vouloir supprimer la paiement du ${t.nom} le ${t.date_paiement} ?`,id:t.id})},V=async()=>{const{message:t}=await Q(n.id);g({...m,message:t,open:!0}),l({...n,open:!1,id:0}),a(),c(1)},B=t=>{const x=t.date_paiement?t.date_paiement:"Invalid date";v({...t,date_paiement:se(x)}),q.visit("/form/paiement?id="+t.id)};return e.jsxs(ne,{setId:k,children:[e.jsx(H,{title:"Paiements"}),e.jsx(le,{open:i,setOpen:d,onCloseFormulaire:$,dataModify:r}),e.jsx(oe,{message:m.message,type:m.type,duration:3e3,position:"top-right",show:m.open,onClose:()=>g({...m,message:"",open:!1})}),e.jsx(M,{open:n.open,message:n.message,btnAcceptName:"Supprimer",title:"Suppression",btnAcceptColor:"bg-red-500 text-white",close:()=>l({...n,open:!1}),accept:V}),!b&&e.jsxs("span",{className:"flex items-center w-40 p-1 mb-2 border border-gray-300 rounded-md dark:border-gray-700",children:[e.jsx("div",{onClick:()=>f(!1),className:`w-1/2 cursor-pointer text-center py-1 rounded-md text-sm transition-colors duration-300 ${_?"bg-transparent":"bg-gray-300 dark:bg-gray-700"}`,children:"Tous"}),e.jsx("div",{onClick:()=>f(!0),className:`w-1/2 cursor-pointer text-center py-1 rounded-md text-sm transition-colors duration-300 ${_?"bg-gray-300 dark:bg-gray-700":"bg-transparent"}`,children:"Types"})]}),_?e.jsx(re,{}):e.jsxs("div",{children:[e.jsx(ie,{title:"Liste des Paiements",handleClick:E,search:L,onSearch:u}),D?e.jsx("div",{className:"flex justify-center items-center h-64",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"})}):e.jsx("div",{children:S.length>0?e.jsx(R,{headers:F,rows:S,itemsPerPage:9,actions:I,className:"mt-4",currentPage:y,onPageChange:c,masqueColumns:["client_id"]}):e.jsx("div",{className:"flex justify-center",children:e.jsx("img",{src:te,alt:"no data",className:"max-w-md mt-2 opacity-50"})})})]})]})};export{Ie as default};
