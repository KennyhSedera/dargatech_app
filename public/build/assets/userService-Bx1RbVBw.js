import{a as e}from"./api-BCBe_GFF.js";const r=async()=>(await e.get("/users")).data,n=async s=>(await e.delete(`/users/${s}`)).data;export{n as d,r as g};
