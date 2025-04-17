import{r as a,m as $,j as e,L as P}from"./app-Bg47GELj.js";import{M as T}from"./Modal-Dzar1sTF.js";import{v as M}from"./validateForm-CYcmU5RH.js";import{I as S,T as L}from"./TextInput-edBcP1P0.js";import{I as N}from"./InputLabel-C-VGudrc.js";import{I}from"./InputAutocomplete -yt_ZALCd.js";import{g as q}from"./clientService-CdxhVize.js";import{a as F}from"./api-a9I7BKl2.js";import{C as B}from"./ConfirmDialog-lcfo3xbK.js";import{D as R}from"./DataTable-D7FafvJG.js";import{H as V}from"./HeaderPage-BpbYEXIl.js";import{S as G}from"./Snackbar-Cwip0f4I.js";import{n as H,f as O}from"./constant-BN7yM2lW.js";import{A as W}from"./AuthenticatedLayout-DkSav3wu.js";import{G as z}from"./index-DpQhDF5W.js";import"./transition-DtGW8Zkx.js";import"./index-B7LjuRmF.js";import"./iconBase-Cl3-Y9IV.js";import"./index-CAUqluHG.js";import"./useTheme-BY8UN6Fd.js";const J=async()=>{try{return(await F.get("/alert")).data}catch(o){throw console.error("Erreur lors de la récupération des alert",o),o}},K=async o=>{try{return(await F.post("/alert",o)).data}catch(r){throw console.error("Erreur lors de l'enregistrement du alert",r),r}},Q=async o=>{try{return(await F.delete(`/alert/${o}`)).data}catch(r){throw console.error("Erreur lors de la suppression du alert",r),r}},U=({open:o=!0,setOpen:r,dataModify:v={},onCloseFormulaire:A=()=>{}})=>{const[b,u]=a.useState("Enregistrer"),[w,C]=a.useState(!1),[l,n]=a.useState({}),[d,x]=a.useState([]),[m,h]=a.useState([]),{data:c,setData:p,errors:g,reset:y}=$({client_id:0,message:"",type_alert:"",installation_id:0}),j=t=>{r(!1),_(),A(t)},_=()=>{y(),C(!1),u("Enregistrer"),n({})},E=async()=>{const{clients:t}=await q(),D=t.map(i=>({id:i.id,nom:`${i.nom} ${i.prenom}`,installations:i.installations}));x(D.filter(i=>i.installations.length>0))};a.useEffect(()=>{E()},[]);const k=async()=>{if(M(c,n)){C(!0),u("Chargement...");try{let t;b==="Enregistrer"&&({message:t}=await K(c)),j(t)}catch(t){console.error("Error submitting alert:",t)}finally{_()}}},s=t=>{p("client_id",t.id);const D=t.installations.map(i=>({id:i.id,nom:i.code_installation}));h(D)},f=t=>{p("installation_id",t.id)};return e.jsxs(T,{show:o,onClose:j,closeable:!1,role:"dialog","aria-labelledby":"modal-title",maxWidth:"xl",children:[e.jsx("div",{className:"text-2xl font-semibold text-center",children:v.nom?"Modifier une alert":"Ajouter une alert"}),e.jsxs("form",{className:"grid w-full gap-4 my-6 sm:grid-cols-2",children:[e.jsxs("div",{className:"w-full",children:[e.jsx(N,{htmlFor:"client_id",value:"Nom client"}),e.jsx(I,{data:d,className:"block w-full mt-1",onSelect:s,isFocused:!0,defaultValue:c.client_id??0,onFocus:()=>n({...l,client_id:""})}),e.jsx(S,{message:l.client_id||g.client_id,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(N,{htmlFor:"type_alert",value:"Type d'alert"}),e.jsx(L,{id:"type_alert",name:"type_alert",value:c.type_alert??"",className:"block w-full mt-1",autoComplete:"type_alert",onChange:t=>p("type_alert",t.target.value),required:!0,type:"text",onFocus:()=>n({...l,type_alert:""})}),e.jsx(S,{message:l.type_alert||g.type_alert,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(N,{htmlFor:"message",value:"Message"}),e.jsx(L,{id:"message",name:"message",value:c.message??"",className:"block w-full mt-1",autoComplete:"message",onChange:t=>p("message",t.target.value),required:!0,type:"text",onFocus:()=>n({...l,message:""})}),e.jsx(S,{message:l.message||g.message,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(N,{htmlFor:"installation_id",value:"Code installation"}),e.jsx(I,{data:m,className:"block w-full mt-1",onSelect:f,defaultValue:c.installation_id??0,onFocus:()=>n({...l,installation_id:""})}),e.jsx(S,{message:l.installation_id||g.installation_id,className:"mt-2"})]})]}),e.jsxs("div",{className:"flex items-center justify-end gap-4 px-1",children:[e.jsx("button",{type:"button",className:"px-4 py-1 text-red-500 rounded-md bg-red-400/10",onClick:()=>j(""),children:"Fermer"}),e.jsx("button",{type:"submit",className:`rounded-md py-1 px-4 disabled:cursor-not-allowed bg-blue-500 text-white ${w&&"opacity-25"}`,disabled:w,onClick:k,children:b})]})]})},he=()=>{const[o,r]=a.useState(!1),[v,A]=a.useState(""),[b,u]=a.useState(1),[w,C]=a.useState([]),[l,n]=a.useState([]),[d,x]=a.useState({open:!1,message:"",id:0}),[m,h]=a.useState({open:!1,message:"",type:"success"}),c=[{key:"id",label:"Id"},{key:"code",label:"Code Iins"},{key:"nom",label:"Nom client"},{key:"message",label:"Profondeur du forage (m)"},{key:"resolue",label:"Statut",customRender:s=>e.jsx("div",{className:"w-auto text-white flex text-nowrap cursor-pointer",children:e.jsx("span",{className:`px-2 py-1 rounded-full ${s?"bg-green-500/80":"bg-red-500/80"}`,children:s?"Résolut":"En attente"})})},{key:"createdAt",label:"Date d'alert"}],p=[{label:e.jsx(z,{className:"text-base"}),color:"text-red-500",hoverColor:"text-red-600",handler:s=>j(s)}],g=s=>{A(s),u(1);const f=w.filter(t=>t.nom.toLowerCase().includes(s.toLowerCase())||t.message.toLowerCase().includes(s.toLowerCase())||t.code.toLowerCase().includes(s.toLowerCase())||t.created_at.toString().toLowerCase().includes(s.toLowerCase()));n(f)},y=async()=>{const{data:s}=await J(),f=s.map(t=>({...t,nom:`${t.client.nom} ${t.client.prenom}`,code:t.installation.code_installation,createdAt:O(t.created_at)}));C(f),n(f)};a.useEffect(()=>{y()},[]);const j=s=>{x({open:!0,message:`Êtes-vous sûr de vouloir supprimer l'alert du ${s.client.nom} le ${s.createdAt} ?`,id:s.id})},_=async()=>{const{message:s}=await Q(d.id);h({...m,message:s,open:!0}),x({...d,open:!1,id:0}),y(),u(1)},E=()=>{r(!0)},k=s=>{r(!1),y(),s&&h({open:!0,message:s,type:"success"})};return e.jsxs(W,{children:[e.jsx(P,{title:"Alerts"}),e.jsx(V,{handleClick:E,title:"Liste des alerts",search:v,onSearch:g}),e.jsx(U,{setOpen:r,open:o,onCloseFormulaire:k}),e.jsx(G,{message:m.message,type:m.type,duration:3e3,position:"top-right",show:m.open,onClose:()=>h({...m,message:"",open:!1})}),e.jsx(B,{open:d.open,message:d.message,btnAcceptName:"Supprimer",title:"Suppression",btnAcceptColor:"bg-red-500 text-white",close:()=>x({...d,open:!1}),accept:_}),e.jsx("div",{children:l.length>0?e.jsx(R,{headers:c,rows:l,itemsPerPage:10,actions:p,className:"mt-4",currentPage:b,onPageChange:u,masqueColumns:["client_id"]}):e.jsx("div",{className:"flex justify-center",children:e.jsx("img",{src:H,alt:"no data",className:"max-w-md opacity-50 mt-2"})})})]})};export{he as default};
