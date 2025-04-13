import{r as s,m as V,j as e,K as M,L as ee,S as $}from"./app-jvMxUIYj.js";import{C as te}from"./ConfirmDialog-BqCVKYO9.js";import{D as ne,G as oe}from"./index-DpgSmSHE.js";import{H as ie}from"./HeaderPage-DvDs5SNa.js";import{M as B}from"./Modal-DrPFBf_w.js";import{I as b,T as P}from"./TextInput-DXNzva6t.js";import{I as f}from"./InputLabel-BqUBMbEn.js";import{g as re}from"./installationService-B99URrIs.js";import{I as se}from"./InputAutocomplete -WUdS4NmY.js";import{o as ae,n as le,f as ce,q as de}from"./constant-ApUvhRhm.js";import{a as R}from"./api-B7tCGyO2.js";import{S as me}from"./SelectInput-B1RkN-HR.js";import{c as pe}from"./validateForm-CYcmU5RH.js";import{I as ue}from"./InputImage-KrKzla81.js";import{S as G}from"./Snackbar-fSLeFUpR.js";import{A as _e}from"./AuthenticatedLayout-BtO0Yj-o.js";import{T as ve}from"./index-2tx5OY_F.js";import"./iconBase-DqTCrpj_.js";import"./index-DOJmtg_t.js";import"./transition-74_cHGX7.js";import"./useTheme-B49Rfz8M.js";const fe=async()=>{try{return(await R.get("/maintenance")).data}catch(c){throw console.error("Erreur lors de la récupération des maintenances",c),c}},ge=async c=>{try{return(await R.post("/maintenance",c)).data}catch(a){throw console.error("Erreur lors de l'enregistrement du maintenance",a),a}},be=async(c,a)=>{try{return(await R.put(`/maintenance/${c}`,a)).data}catch(r){throw console.error("Erreur lors de la modification du maintenance",r),r}},xe=async c=>{try{return(await R.delete(`/maintenance/${c}`)).data}catch(a){throw console.error("Erreur lors de la suppression du maintenance",a),a}},he=async c=>{try{return(await R.post("/rapport-maintenances",c)).data}catch(a){throw console.error("Erreur lors de la création du rapport de maintenance",a),a}},je=({open:c=!0,setOpen:a,dataModify:r={},onCloseFormulaire:S=()=>{},idTechnicien:x})=>{const[y,o]=s.useState("Enregistrer"),[d,_]=s.useState(!1),[h,g]=s.useState({}),[k,p]=s.useState([]);s.useState([]);const{data:l,setData:u,errors:w,reset:L}=V({installation_id:0,date_intervention:new Date().toISOString().split("T")[0],type_intervention:"préventive",description_probleme:"",solutions_apportees:"",duree_intervention:"",technicien:x}),C=async()=>{const[{data:i}]=await Promise.all([re()]),t=i.map(j=>({id:j.id,nom:j.code_installation}));p(t)},I=i=>{a(!1),N(),S(i)},N=()=>{L(),_(!1),o("Enregistrer"),g({})};s.useEffect(()=>{C(),r.id?(u({installation_id:r.installation_id||0,date_intervention:ae(r.date_intervention)||new Date().toISOString().split("T")[0],type_intervention:r.type_intervention||"",description_probleme:r.description_probleme||"",solutions_apportees:r.solutions_apportees||"",duree_intervention:r.duree_intervention||"",technicien:r.technicien_id||0}),o("Modifier")):N()},[r,u]),s.useEffect(()=>{x&&u("technicien",x)},[x,u]);const F=async()=>{if(pe(l,g)){_(!0),o("Chargement...");try{let i;y==="Enregistrer"?{message:i}=await ge(l):{message:i}=await be(r.id,l),I(i)}catch(i){console.error("Error submitting payment:",i)}finally{_(!1),o("Enregistrer")}}},E=i=>{u({...l,installation_id:i.id,description_probleme:i.message})};return e.jsxs(B,{show:c,closeable:!1,onClose:I,maxWidth:"xl",children:[e.jsx("div",{className:"text-2xl font-semibold text-center",children:r.nom?"Modifier une Intervention":"Ajouter une Intervention"}),e.jsxs("form",{className:"grid w-full grid-cols-1 gap-4 my-6 sm:grid-cols-2",children:[e.jsxs("div",{children:[e.jsx(f,{htmlFor:"installation_id",value:"Code d'instalation"}),e.jsx(se,{data:k,className:"block w-full mt-1",onSelect:E,isFocused:!0,defaultValue:l.installation_id,readOnly:r.id,onFocus:()=>g({...h,installation_id:""})}),e.jsx(b,{message:h.installation_id||w.installation_id,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(f,{htmlFor:"type_intervention",value:"Type d'intervention"}),e.jsxs(me,{id:"type_intervention",type:"type_intervention",name:"type_intervention",value:l.type_intervention,className:"block w-full mt-1",autoComplete:"type_intervention",onChange:i=>u("type_intervention",i.target.value),required:!0,children:[e.jsx("option",{value:"préventive",children:"Préventive"}),e.jsx("option",{value:"curative",children:"Curative"})]}),e.jsx(b,{message:w.email,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(f,{htmlFor:"description_probleme",value:"Description du problème"}),e.jsx(P,{id:"description_probleme",name:"description_probleme",value:l.description_probleme,className:"block w-full mt-1",autoComplete:"description_probleme",onChange:i=>u("description_probleme",i.target.value),required:!0,onFocus:()=>g({...h,description_probleme:""})}),e.jsx(b,{message:h.description_probleme||w.description_probleme,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(f,{htmlFor:"date_intervention",value:"Date d'intervention"}),e.jsx(P,{id:"date_intervention",name:"date_intervention",value:l.date_intervention,className:"block w-full mt-1",autoComplete:"date_intervention",type:"date",onChange:i=>u("date_intervention",i.target.value),required:!0,onFocus:()=>g({...h,date_intervention:""})}),e.jsx(b,{message:h.date_intervention||w.date_intervention,className:"mt-2"})]})]}),e.jsxs("div",{className:"flex items-center justify-end gap-4 px-1",children:[e.jsx("button",{type:"button",className:"px-4 py-1 text-red-500 rounded-md bg-red-400/10",onClick:()=>I(""),children:"Fermer"}),e.jsx("button",{type:"submit",className:`rounded-md py-1 px-4 disabled:cursor-not-allowed bg-blue-500 text-white ${d&&"opacity-25"}`,disabled:d,onClick:F,children:y})]})]})},D=s.forwardRef(({className:c="",readOnly:a=!1,...r},S)=>e.jsx("textarea",{...r,readOnly:a,className:"rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 "+(a?"bg-gray-100 cursor-not-allowed ":"")+c,ref:S}));D.displayName="TextArea";const ye=({open:c=!0,setOpen:a,dataModify:r={},onCloseFormulaire:S=()=>{},idTechnicien:x})=>{const y=new Date().toISOString().split("T")[0],{data:o,setData:d,errors:_,reset:h}=V({clientId:0,technicienId:x,maintenanceId:0,description_probleme:"",photo_probleme:null,verifications_preliminaires:"",resultat_diagnostic:"",actions_correctives:"",verification_fonctionnement:"",recommandations:"",date_intervention:y}),[g,k]=s.useState(!1),[p,l]=s.useState({}),[u,w]=s.useState({show:!1,message:"",type:"info"});s.useEffect(()=>{r&&(d("maintenanceId",r.id),d("clientId",r.idclient),d("description_probleme",r.description_probleme))},[r]);const L=s.useRef(null),[C,I]=s.useState({}),N=t=>{a(!1),d({clientId:0,technicienId:x||1,maintenanceId:0,description_probleme:"",photo_probleme:null,verifications_preliminaires:"",resultat_diagnostic:"",actions_correctives:"",verification_fonctionnement:"",recommandations:"",date_intervention:y}),S(t)},F=t=>{d("photo_probleme",t),C.photo_probleme&&I({...C,photo_probleme:""})},E=()=>{const t={};return o.description_probleme.trim()||(t.description_probleme="Le problème rapporté est obligatoire"),o.verifications_preliminaires.trim()||(t.verifications_preliminaires="Les vérifications préliminaires sont obligatoires"),o.resultat_diagnostic.trim()||(t.resultat_diagnostic="Le résultat du diagnostic est obligatoire"),o.actions_correctives.trim()||(t.actions_correctives="Les actions correctives sont obligatoires"),o.verification_fonctionnement.trim()||(t.verification_fonctionnement="La vérification du fonctionnement est obligatoire"),o.date_intervention||(t.date_intervention="La date d'intervention est obligatoire"),l(t),Object.keys(t).length===0},i=async()=>{if(E()){o.technicienId=x;try{k(!0);const t=new FormData;t.append("clientId",o.clientId),t.append("technicienId",o.technicienId),t.append("maintenanceId",o.maintenanceId),t.append("description_probleme",o.description_probleme),o.photo_probleme&&t.append("photo_probleme",o.photo_probleme),t.append("verifications_preliminaires",o.verifications_preliminaires),t.append("resultat_diagnostic",o.resultat_diagnostic),t.append("actions_correctives",o.actions_correctives),t.append("verification_fonctionnement",o.verification_fonctionnement),t.append("recommandations",o.recommandations),t.append("date_intervention",o.date_intervention);const j=await he(t);N(j.message)}catch(t){console.error("Erreur lors de la création du rapport:",t),w({show:!0,message:"Une erreur est survenue lors de la création du rapport",type:"error"})}finally{k(!1)}}};return e.jsxs(B,{show:c,closeable:!1,onClose:N,maxWidth:"xl",children:[e.jsx("div",{className:"text-2xl font-semibold text-center",children:"Formulaire rapport maintenance"}),e.jsxs("form",{className:"grid w-full grid-cols-1 gap-4 my-6 sm:grid-cols-2",children:[e.jsxs("div",{children:[e.jsx(f,{htmlFor:"description_probleme",value:"Problème rapporté *"}),e.jsx(D,{id:"description_probleme",name:"description_probleme",value:o.description_probleme,className:"block w-full mt-1",autoComplete:"off",onChange:t=>d("description_probleme",t.target.value),required:!0,rows:3,readOnly:!0,onFocus:()=>l({...p,description_probleme:""})}),e.jsx(b,{message:p.description_probleme||C.description_probleme||_.description_probleme,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(f,{htmlFor:"verifications_preliminaires",value:"Vérifications préliminaires *"}),e.jsx(D,{id:"verifications_preliminaires",name:"verifications_preliminaires",value:o.verifications_preliminaires,className:"block w-full mt-1",autoComplete:"off",onChange:t=>d("verifications_preliminaires",t.target.value),required:!0,rows:3,onFocus:()=>l({...p,verifications_preliminaires:""})}),e.jsx(b,{message:p.verifications_preliminaires||_.verifications_preliminaires,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(f,{htmlFor:"resultat_diagnostic",value:"Résultat du diagnostic *"}),e.jsx(D,{id:"resultat_diagnostic",name:"resultat_diagnostic",value:o.resultat_diagnostic,className:"block w-full mt-1",autoComplete:"off",onChange:t=>d("resultat_diagnostic",t.target.value),required:!0,rows:3,onFocus:()=>l({...p,resultat_diagnostic:""})}),e.jsx(b,{message:p.resultat_diagnostic||_.resultat_diagnostic,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(f,{htmlFor:"actions_correctives",value:"Actions correctives *"}),e.jsx(D,{id:"actions_correctives",name:"actions_correctives",value:o.actions_correctives,className:"block w-full mt-1",autoComplete:"off",onChange:t=>d("actions_correctives",t.target.value),required:!0,rows:3,onFocus:()=>l({...p,actions_correctives:""})}),e.jsx(b,{message:p.actions_correctives||_.actions_correctives,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(f,{htmlFor:"verification_fonctionnement",value:"Vérification du fonctionnement *"}),e.jsx(D,{id:"verification_fonctionnement",name:"verification_fonctionnement",value:o.verification_fonctionnement,className:"block w-full mt-1",autoComplete:"off",onChange:t=>d("verification_fonctionnement",t.target.value),required:!0,rows:3,onFocus:()=>l({...p,verification_fonctionnement:""})}),e.jsx(b,{message:p.verification_fonctionnement||_.verification_fonctionnement,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(f,{htmlFor:"recommandations",value:"Recommandations au Client (optionnel)"}),e.jsx(D,{id:"recommandations",name:"recommandations",value:o.recommandations,className:"block w-full mt-1",autoComplete:"off",onChange:t=>d("recommandations",t.target.value),rows:3,onFocus:()=>l({...p,recommandations:""})}),e.jsx(b,{message:_.recommandations,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(f,{htmlFor:"photo_probleme",value:"Photo du problème (optionnel)"}),e.jsx(ue,{ref:L,selectedFile:o.photo_probleme,onLoadFile:F,onFocus:()=>I({...C,photo_probleme:""})})]}),e.jsxs("div",{children:[e.jsx(f,{htmlFor:"date_intervention",value:"Date de l'intervention *"}),e.jsx(P,{id:"date_intervention",name:"date_intervention",value:o.date_intervention,className:"block w-full mt-1",autoComplete:"off",onChange:t=>d("date_intervention",t.target.value),type:"date",required:!0,readOnly:!0,onFocus:()=>l({...p,date_intervention:""})}),e.jsx(b,{message:p.date_intervention||_.date_intervention,className:"mt-2"})]})]}),e.jsxs("div",{className:"flex items-center justify-end gap-4 px-1",children:[e.jsx("button",{type:"button",className:"px-4 py-1 text-red-500 rounded-md bg-red-400/10",onClick:()=>N(""),children:"Fermer"}),e.jsx("button",{type:"submit",className:`rounded-md py-1 px-4 disabled:cursor-not-allowed bg-blue-500 text-white ${g&&"opacity-25"}`,disabled:g,onClick:i,children:g?"Enregistrement...":"Enregistrer"})]}),e.jsx(G,{show:u.show,message:u.message,type:u.type,onClose:()=>w({...u,show:!1})})]})},We=()=>{const[c,a]=s.useState(""),[r,S]=s.useState(0),[x,y]=s.useState(!1),[o,d]=s.useState(!1),[_,h]=s.useState({}),[g,k]=s.useState({}),[p,l]=s.useState(1),[u,w]=s.useState([]),[L,C]=s.useState([]),[I,N]=s.useState(!0),[F,E]=s.useState({open:!1,message:"",id:0}),[i,t]=s.useState({open:!1,message:"",type:"success"}),j=M().props.auth.user,H=[{key:"id",label:"ID"},{key:"code_installation",label:"Installation"},{key:"nom",label:"Client"},{key:"type_intervention",label:"Type"},{key:"description_probleme",label:"Problème"},{key:"date_intervention",label:"Date d'intervenir"},{key:"status_intervention",label:"Statuts",customRender:n=>e.jsx("span",{className:`px-2 py-1 rounded-full text-white flex text-nowrap ${n==="terminée"?"bg-green-500/50":n==="en attente"?"bg-blue-500/50":"bg-red-500/50"}`,children:n})},{key:"status_intervention",label:"Rapport",customRender:(n,v)=>{var m,q,A;return e.jsx("span",{onClick:()=>{var O;return n==="terminée"?$.visit("/rapport",{data:{intervention_id:v.id}}):((O=j.user_role)==null?void 0:O.name)==="partenaire"?null:U(v)},className:`px-2 py-1 rounded-full flex text-nowrap ${((m=j.user_role)==null?void 0:m.name)==="partenaire"&&n!=="terminée"?"cursor-default":"cursor-pointer"} ${n==="terminée"?"text-green-500":((q=j.user_role)==null?void 0:q.name)==="partenaire"?"text-gray-300":"text-blue-500"}`,children:n==="terminée"?"Consulter":((A=j.user_role)==null?void 0:A.name)==="partenaire"?"En attente":"Ajouter"})}}],W=[{label:e.jsx(ve,{className:"text-lg"}),color:"text-blue-500",hoverColor:"text-blue-600",handler:n=>Z(n)},{label:e.jsx(oe,{className:"text-base"}),color:"text-red-500",hoverColor:"text-red-600",handler:n=>X(n)}],K=()=>{y(!0)},U=n=>{var v;((v=j.user_role)==null?void 0:v.name)==="partenaire"?$.visit("/rapport",{data:{intervention_id:n.id}}):(d(!0),k(n))},T=async()=>{N(!0);const{data:n}=await fe(),v=n.map(m=>({id:m.id,installation_id:m.installation_id,code_installation:m.installation.code_installation,nom:m.installation.client.nom+" "+m.installation.client.prenom,idclient:m.installation.client.id,type_intervention:m.type_intervention,description_probleme:m.description_probleme,status_intervention:m.status_intervention,date_intervention:ce(m.date_intervention)}));w(v),C(v),N(!1)};s.useEffect(()=>{T()},[]);const z=n=>{a(n),l(1);const v=u.filter(m=>m.nom.toLowerCase().includes(n.toLowerCase())||m.type_intervention.toLowerCase().includes(n.toLowerCase())||m.description_probleme.toLowerCase().includes(n.toLowerCase())||m.date_intervention.toString().toLowerCase().includes(n.toLowerCase()));C(v)},J=n=>{T(),n&&t({...i,message:n,open:!0}),h({})},Q=n=>{T(),n&&t({...i,message:n,open:!0}),k({})},X=n=>{E({open:!0,message:`Êtes-vous sûr de vouloir supprimer l'intervention du ${n.nom} le ${n.date_intervention} ?`,id:n.id})},Y=async()=>{const{message:n}=await xe(F.id);t({...i,message:n,open:!0}),E({...F,open:!1,id:0}),T(),l(1)},Z=n=>{const v=n.date_intervention?n.date_intervention:"Invalid date";h({...n,date_intervention:de(v)}),y(!0)};return e.jsxs(_e,{setId:S,children:[e.jsx(ee,{title:"Maintenance"}),e.jsx(ie,{search:c,onSearch:z,title:"Liste des interventions",handleClick:K}),e.jsx(G,{message:i.message,type:i.type,duration:3e3,position:"top-right",show:i.open,onClose:()=>t({...i,message:"",open:!1})}),e.jsx(te,{open:F.open,message:F.message,btnAcceptName:"Supprimer",title:"Suppression",btnAcceptColor:"bg-red-500 text-white",close:()=>E({...F,open:!1}),accept:Y}),e.jsx(je,{open:x,setOpen:y,dataModify:_,onCloseFormulaire:J,idTechnicien:r}),e.jsx(ye,{open:o,setOpen:d,dataModify:g,onCloseFormulaire:Q,idTechnicien:r}),I?e.jsx("div",{className:"flex justify-center items-center h-64",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"})}):e.jsx("div",{children:L.length>0?e.jsx(ne,{headers:H,rows:L,itemsPerPage:6,actions:W,className:"mt-4",currentPage:p,onPageChange:l,masqueColumns:["client_id"]}):e.jsx("div",{className:"flex justify-center",children:e.jsx("img",{src:le,alt:"no data",className:"max-w-md mt-2 opacity-50"})})})]})};export{We as default};
