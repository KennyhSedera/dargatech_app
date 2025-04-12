import{m as g,r as d,j as e,L as f,d as h}from"./app-BIIzlTCs.js";import{T as y,I as v}from"./TextInput-DpbIaw5O.js";import{P as w}from"./PrimaryButton-Ch5xGKV7.js";import{S as j}from"./Snackbar-D6o1nh_8.js";function P({status:o,setTitle:m}){const{data:i,setData:l,post:b,errors:u,setError:c}=g({email:""}),[p,n]=d.useState(!1),[t,a]=d.useState({show:!1,message:"",type:""}),x=async r=>{r.preventDefault(),n(!0);try{const s=await h.post("forgot-password",{email:i.email});s.status===200&&(a({show:!0,message:s.data.message,type:"success"}),setTimeout(()=>{m("Log In")},3e3))}catch(s){s.response&&s.response.status===422?a({show:!0,message:s.response.data.errors||{},type:"error"}):console.error(s)}finally{l("email",""),n(!1)}};return e.jsxs("div",{className:"mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800",children:[e.jsx(f,{title:"Mot de passe oublié"}),e.jsx(j,{show:t.show,message:t.message,type:t.type,onClose:()=>a({show:!1,message:"",type:""})}),e.jsx("div",{className:"mb-4 text-sm text-gray-600 dark:text-gray-400",children:"Vous avez oublié votre mot de passe ? Pas de problème. Indiquez-nous simplement votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe."}),o&&e.jsx("div",{className:"mb-4 text-sm font-medium text-green-600 dark:text-green-400",children:o}),e.jsxs("form",{onSubmit:x,children:[e.jsx(y,{id:"email",type:"email",name:"email",value:i.email,className:"mt-1 block w-full",isFocused:!0,onChange:r=>l("email",r.target.value),onFocus:()=>c("email","")}),e.jsx(v,{message:u.email,className:"mt-2"}),e.jsxs("div",{className:"mt-4 flex items-center justify-end",children:[e.jsx("button",{onClick:()=>m("Log In"),children:"Retour"}),e.jsx(w,{className:"ms-4",disabled:p,children:"Envoyer"})]})]})]})}export{P as default};
