import{j as e,r as m,m as y}from"./app-DKoFDuFE.js";import{D as c}from"./DangerButton-BgxL3NaL.js";import{T as j,I as b}from"./TextInput-CiGTJEXf.js";import{I as w}from"./InputLabel-D64J9CxP.js";import{M as k}from"./Modal-DY6LoxCn.js";import{o as l,e as N}from"./index-DjaKU5I4.js";import"./transition-De3IdRTQ.js";import"./iconBase-fpqdAeX1.js";function D({type:t="button",className:o="",disabled:s,children:r,...a}){return e.jsx("button",{...a,type:t,className:`inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-800 ${s&&"opacity-25"} `+o,disabled:s,children:r})}function M({className:t=""}){const[o,s]=m.useState(!1),r=m.useRef(),{data:a,setData:p,delete:u,processing:x,reset:d,errors:f,clearErrors:g}=y({password:""}),h=()=>{s(!0)},v=i=>{i.preventDefault(),u(route("profile.destroy"),{preserveScroll:!0,onSuccess:()=>n(),onError:()=>r.current.focus(),onFinish:()=>d()})},n=()=>{s(!1),g(),d()};return e.jsxs("section",{className:`space-y-6 ${t}`,children:[e.jsx("div",{className:"max-w-xl",children:e.jsx("p",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Une fois votre compte supprimé, toutes ses ressources et données seront définitivement effacées. Avant de supprimer votre compte, veuillez télécharger toutes les données ou informations que vous souhaitez conserver."})}),e.jsxs(c,{onClick:h,className:"inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-700 dark:to-pink-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5",children:[e.jsx(l,{className:"w-5 h-5 mr-2"}),"Supprimer le compte"]}),e.jsx(k,{show:o,onClose:n,maxWidth:"md",children:e.jsxs("form",{onSubmit:v,className:"p-6",children:[e.jsxs("div",{className:"flex items-center gap-4 mb-6",children:[e.jsx("div",{className:"p-3 rounded-full bg-red-100 dark:bg-red-900/30",children:e.jsx(l,{className:"w-6 h-6 text-red-600 dark:text-red-400"})}),e.jsx("h2",{className:"text-lg font-medium text-gray-900 dark:text-gray-100",children:"Êtes-vous sûr de vouloir supprimer votre compte ?"})]}),e.jsx("p",{className:"mt-1 text-sm text-gray-600 dark:text-gray-400",children:"Une fois votre compte supprimé, toutes ses ressources et données seront définitivement supprimées. Cette action est irréversible. Veuillez entrer votre mot de passe pour confirmer que vous souhaitez supprimer définitivement votre compte."}),e.jsxs("div",{className:"mt-6",children:[e.jsx(w,{htmlFor:"password",value:"Mot de passe",className:"sr-only"}),e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:e.jsx(N,{className:"w-5 h-5 text-gray-400"})}),e.jsx(j,{id:"password",type:"password",name:"password",ref:r,value:a.password,onChange:i=>p("password",i.target.value),className:"pl-10 mt-1 block w-full",isFocused:!0,placeholder:"Votre mot de passe"})]}),e.jsx(b,{message:f.password,className:"mt-2"})]}),e.jsxs("div",{className:"mt-6 flex justify-end gap-4",children:[e.jsx(D,{onClick:n,className:"px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200",children:"Annuler"}),e.jsxs(c,{className:"px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-700 dark:to-pink-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5",disabled:x,children:[e.jsx(l,{className:"w-5 h-5 mr-2"}),"Confirmer la suppression"]})]})]})})]})}export{M as default};
