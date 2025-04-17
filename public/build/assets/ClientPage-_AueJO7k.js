import{r as m,m as P,j as e,L as A,S as H}from"./app-Bg47GELj.js";import{M as V}from"./Modal-Dzar1sTF.js";import{T as d,I as u}from"./TextInput-edBcP1P0.js";import{I as p}from"./InputLabel-C-VGudrc.js";import{u as G,c as K,b as O,d as Q}from"./clientService-CdxhVize.js";import{a as z}from"./validateForm-CYcmU5RH.js";import{S as B}from"./SelectInput-CXhJA8Bt.js";import{C as R}from"./ConfirmDialog-lcfo3xbK.js";import{D as W}from"./DataTable-D7FafvJG.js";import{E as J}from"./EmptyState-B6UVW3W7.js";import{H as U}from"./HeaderPage-BpbYEXIl.js";import{S as X}from"./Snackbar-Cwip0f4I.js";import{A as Y}from"./AuthenticatedLayout-DkSav3wu.js";import{j as Z}from"./constant-BN7yM2lW.js";import{G as M}from"./index-DpQhDF5W.js";import{T as ee}from"./index-CAUqluHG.js";import"./transition-DtGW8Zkx.js";import"./api-a9I7BKl2.js";import"./index-B7LjuRmF.js";import"./iconBase-Cl3-Y9IV.js";import"./useTheme-BY8UN6Fd.js";const te=async(f,_,a="",x="")=>{if(!f||!_)throw new Error("Veuillez entrer un pays et une ville.");try{let g=`${f},${_}`;a&&(g=`${a},${g}`),x&&(g=`${x},${g}`);const l=await(await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${g}`)).json();if(l.length===0)throw new Error("Lieu introuvable !");const{lat:r,lon:N}=l[0];return{lat:parseFloat(r),lon:parseFloat(N)}}catch{throw new Error("Erreur lors de la récupération des coordonnées.")}},ae=({open:f=!0,setOpen:_,dataModify:a={},onCloseFormulaire:x=()=>{}})=>{const[g,h]=m.useState("Enregistrer"),[l,r]=m.useState({}),[N,w]=m.useState(!1),{data:s,setData:i,errors:c,reset:F}=P({nom:"",prenom:"",email:"",genre:"Homme",CIN:"",telephone:"",pays:"Togo",ville:"Kara",latitude:"",longitude:"",localisation:"",surface_cultivee:"",type_activite_agricole:"",quartier:"",village:""}),v=t=>{_(!1),y(),x(t)},y=()=>{F(),h("Enregistrer"),r({}),w(!1)};m.useEffect(()=>{var t,C,b,S,q,k,I;a.id?(i({nom:a.nom||"",prenom:a.prenom||"",email:a.email||"",genre:a.genre||"Homme",CIN:a.CIN||"",telephone:a.telephone||"",pays:((t=a.localisation)==null?void 0:t.pays)||"Togo",ville:((C=a.localisation)==null?void 0:C.ville)||"Kara",quartier:((b=a.localisation)==null?void 0:b.quartier)||"",village:((S=a.localisation)==null?void 0:S.village)||"",latitude:((q=a.localisation)==null?void 0:q.latitude)||"",longitude:((k=a.localisation)==null?void 0:k.longitude)||"",localisation:((I=a.localisation)==null?void 0:I.localisation)||"",surface_cultivee:a.surface_cultivee||"",type_activite_agricole:a.type_activite_agricole||""}),h("Modifier")):y()},[a,i]);const j=async()=>{if(z(s,r)){w(!0),h(a.id?"Modification...":"Enregistrement...");try{const{lat:t,lon:C}=await te(s.ville,s.pays,s.village,s.quartier),b={...s,latitude:t,longitude:C,localisation:`${s.pays} ${s.ville}${s.village?` ${s.village}`:""}${s.quartier?` ${s.quartier}`:""}`,quartier:s.quartier||"Non spécifié",village:s.village||"Non spécifié"};a.id?(await G(a.id,b),v("Client modifié avec succès !")):(await K(b),v("Client créé avec succès !"))}catch(t){console.error("Erreur:",t),w(!1),h(a.id?"Modifier":"Enregistrer")}}};return e.jsxs(V,{show:f,closeable:!1,onClose:v,maxWidth:"xl",children:[e.jsx("div",{className:"text-center font-semibold text-2xl",children:a.id?"Modifier un Maraîcher":"Ajouter un Maraîcher"}),e.jsxs("form",{className:"w-full my-6 grid grid-cols-1 sm:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx(p,{htmlFor:"nom",value:"Nom"}),e.jsx(d,{id:"nom",name:"nom",value:s.nom,className:"mt-1 block w-full",autoComplete:"nom",isFocused:!0,onChange:t=>i("nom",t.target.value),required:!0,onFocus:()=>r({...l,nom:""})}),e.jsx(u,{message:l.nom||c.nom,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(p,{htmlFor:"prenom",value:"Prénom"}),e.jsx(d,{id:"prenom",name:"prenom",value:s.prenom,className:"mt-1 block w-full",autoComplete:"prenom",onChange:t=>i("prenom",t.target.value),required:!0,onFocus:()=>r({...l,prenom:""})}),e.jsx(u,{message:l.prenom||c.prenom,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(p,{htmlFor:"email",value:"Email"}),e.jsx(d,{id:"email",name:"email",value:s.email,className:"mt-1 block w-full",autoComplete:"email",onChange:t=>i("email",t.target.value),onFocus:()=>r({...l,email:""})}),e.jsx(u,{message:l.email||c.email,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(p,{htmlFor:"genre",value:"Sexe"}),e.jsxs(B,{id:"genre",type:"genre",name:"genre",value:s.genre,className:"block w-full mt-1",autoComplete:"genre",onChange:t=>i("genre",t.target.value),required:!0,children:[e.jsx("option",{value:"Homme",children:"Homme"}),e.jsx("option",{value:"Femme",children:"Femme"})]}),e.jsx(u,{message:c.genre,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(p,{htmlFor:"CIN",value:"Pièce d'identité"}),e.jsx(d,{id:"CIN",name:"CIN",value:s.CIN,className:"mt-1 block w-full",autoComplete:"CIN",onChange:t=>i("CIN",t.target.value),required:!0,onFocus:()=>r({...l,CIN:""})}),e.jsx(u,{message:l.CIN||c.CIN,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(p,{htmlFor:"telephone",value:"Téléphone"}),e.jsx(d,{id:"telephone",name:"telephone",value:s.telephone,className:"mt-1 block w-full",autoComplete:"telephone",onChange:t=>i("telephone",t.target.value),required:!0,onFocus:()=>r({...l,telephone:""})}),e.jsx(u,{message:l.telephone||c.telephone,className:"mt-2"})]}),a.id?null:e.jsxs(e.Fragment,{children:[e.jsxs("div",{children:[e.jsx(p,{htmlFor:"pays",value:"Pays"}),e.jsx(d,{id:"pays",name:"pays",value:s.pays,className:"mt-1 block w-full",autoComplete:"pays",onChange:t=>i("pays",t.target.value),required:!0,onFocus:()=>r({...l,pays:""})}),e.jsx(u,{message:l.pays||c.pays,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(p,{htmlFor:"ville",value:"Ville"}),e.jsx(d,{id:"ville",name:"ville",value:s.ville,className:"mt-1 block w-full",autoComplete:"ville",onChange:t=>i("ville",t.target.value),required:!0,onFocus:()=>r({...l,ville:""})}),e.jsx(u,{message:l.ville||c.ville,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(p,{htmlFor:"village",value:"Village"}),e.jsx(d,{id:"village",name:"village",value:s.village,className:"mt-1 block w-full",autoComplete:"village",onChange:t=>i("village",t.target.value),onFocus:()=>r({...l,village:""})}),e.jsx(u,{message:l.village||c.village,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(p,{htmlFor:"quartier",value:"Quartier"}),e.jsx(d,{id:"quartier",name:"quartier",value:s.quartier,className:"mt-1 block w-full",autoComplete:"quartier",onChange:t=>i("quartier",t.target.value),onFocus:()=>r({...l,quartier:""})}),e.jsx(u,{message:l.quartier||c.quartier,className:"mt-2"})]})]}),e.jsxs("div",{children:[e.jsx(p,{htmlFor:"type_activite_agricole",value:"Type activité agricole"}),e.jsx(d,{id:"type_activite_agricole",name:"type_activite_agricole",value:s.type_activite_agricole,className:"mt-1 block w-full",autoComplete:"type_activite_agricole",onChange:t=>i("type_activite_agricole",t.target.value),required:!0,onFocus:()=>r({...l,type_activite_agricole:""})}),e.jsx(u,{message:l.type_activite_agricole||c.type_activite_agricole,className:"mt-2"})]}),e.jsxs("div",{children:[e.jsx(p,{htmlFor:"surface_cultivee",value:"Surface cultivée (en ha)"}),e.jsx(d,{id:"surface_cultivee",name:"surface_cultivee",value:s.surface_cultivee,className:"mt-1 block w-full",autoComplete:"surface_cultivee",onChange:t=>i("surface_cultivee",t.target.value),required:!0,onFocus:()=>r({...l,surface_cultivee:""})}),e.jsx(u,{message:l.surface_cultivee||c.surface_cultivee,className:"mt-2"})]})]}),e.jsxs("div",{className:"flex items-center justify-end gap-4 px-1",children:[e.jsx("button",{type:"button",className:"rounded-md py-1 px-4 text-red-500 bg-red-400/10",onClick:()=>v(""),children:"Fermer"}),e.jsx("button",{type:"submit",className:`disabled:cursor-not-allowed rounded-md py-1 px-4 bg-blue-500 text-white ${N&&"opacity-25"}`,disabled:N,onClick:j,children:g})]})]})},we=()=>{const[f,_]=m.useState(""),[a,x]=m.useState(!1),[g,h]=m.useState(1),[l,r]=m.useState([]),[N,w]=m.useState([]),[s,i]=m.useState({}),[c,F]=m.useState(!0),[v,y]=m.useState({open:!1,message:"",id:0}),[j,t]=m.useState({open:!1,message:"",type:"success"}),C=async()=>{F(!0);const E=(await O()).clients.map(n=>({id:n.id,nom:n.nom,prenom:n.prenom,CIN:n.CIN,email:n.email,telephone:n.telephone,localisation:n.localisation.pays+" "+n.localisation.ville,surface_cultivee:n.surface_cultivee,type_activite_agricole:n.type_activite_agricole}));r(E),w(E),F(!1)};m.useEffect(()=>{C()},[]);const b=o=>{_(o),h(1);const E=l.filter(n=>n.nom.toLowerCase().includes(o.toLowerCase())||n.prenom.toLowerCase().includes(o.toLowerCase())||n.telephone.toLowerCase().includes(o.toLowerCase())||n.surface_cultivee.toLowerCase().includes(o.toLowerCase())||n.type_activite_agricole.toLowerCase().includes(o.toLowerCase())||n.localisation.toLowerCase().includes(o.toLowerCase()));w(E)},S=()=>{x(!0)},q=[{key:"id",label:"ID"},{key:"nom",label:"Nom"},{key:"prenom",label:"Prénom"},{key:"CIN",label:"CIN"},{key:"email",label:"Email"},{key:"telephone",label:"Téléphone"},{key:"localisation",label:"Localisation"},{key:"surface_cultivee",label:"Surface cultivée (ha)"},{key:"type_activite_agricole",label:"Type d'activité agricole"}],k=[{label:e.jsx(Z,{className:"text-base"}),color:"text-green-500",hoverColor:"text-green-600",handler:o=>D(o.id)},{label:e.jsx(ee,{className:"text-lg"}),color:"text-blue-500",hoverColor:"text-blue-600",handler:o=>L(o)},{label:e.jsx(M,{className:"text-base"}),color:"text-red-500",hoverColor:"text-red-600",handler:o=>$(o)}],I=o=>{C(),o&&t({...j,message:o,open:!0}),i({})},L=o=>{i(o),x(!0)},$=o=>{y({open:!0,message:`Êtes-vous sûr de vouloir supprimer ${o.nom} ${o.prenom}?`,id:o.id})},T=async()=>{const{message:o}=await Q(v.id);t({...j,message:o,open:!0}),y({...v,open:!1,id:0}),C(),h(1)},D=async o=>{H.visit(`/client/${o}`)};return e.jsxs(Y,{children:[e.jsx(A,{title:"Maraîchers"}),e.jsx(U,{title:"Liste des Maraîchers",handleClick:S,onSearch:b,search:f}),e.jsx(ae,{setOpen:x,open:a,dataModify:s,onCloseFormulaire:I}),e.jsx(X,{message:j.message,type:j.type,duration:3e3,position:"top-right",show:j.open,onClose:()=>t({...j,message:"",open:!1})}),e.jsx(R,{open:v.open,message:v.message,btnAcceptName:"Supprimer",title:"Suppression",btnAcceptColor:"bg-red-500 text-white",close:()=>y({...v,open:!1}),accept:T}),c?e.jsx("div",{className:"flex justify-center items-center h-64",children:e.jsx("div",{className:"animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"})}):e.jsx("div",{children:N.length>0?e.jsx(W,{headers:q,rows:N,itemsPerPage:10,actions:k,className:"mt-4",currentPage:g,onPageChange:h}):e.jsx(J,{nom:"maraîcher",search:f})})]})};export{we as default};
