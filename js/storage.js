import {validateDesign} from './data.js';
const KEY='moonriver.wishes.v1';
const cleanMessage=m=>typeof m==='string'?m.trim().slice(0,120):'';
export function readOwnWishes(){
 try{
  const value=JSON.parse(localStorage.getItem(KEY)||'[]');
  if(!Array.isArray(value))return [];
  return value.slice(0,24).filter(x=>x&&typeof x.id==='string').map(x=>({id:x.id,message:cleanMessage(x.message),design:validateDesign(x.design),created_at:x.created_at||new Date().toISOString(),x:Math.max(.10,Math.min(.87,Number(x.x)||.48)),y:Math.max(.57,Math.min(.81,Number(x.y)||.69))}));
 }catch{return [];}
}
export function storeOwnWish(wish){
 try{const items=readOwnWishes();items.unshift(wish);localStorage.setItem(KEY,JSON.stringify(items.slice(0,24)));return true;}catch{return false;}
}
// Optional Supabase integration: anonymous inserts remain pending until approved by a moderator.
const conf=globalThis.LOY_CONFIG||{};
const url=typeof conf.supabaseUrl==='string'?conf.supabaseUrl.replace(/\/$/,''):'';
const key=typeof conf.supabaseAnonKey==='string'?conf.supabaseAnonKey:'';
export const onlineEnabled=Boolean(url&&key&&/^https:\/\//.test(url));
const endpoint=`${url}/rest/v1/krathong_wishes`;
const headers=()=>({'apikey':key,'Authorization':`Bearer ${key}`,'Content-Type':'application/json'});
export async function fetchApproved(){
 if(!onlineEnabled)return [];
 const response=await fetch(`${endpoint}?select=id,message,design,created_at&status=eq.approved&order=created_at.desc&limit=40`,{headers:headers()});
 if(!response.ok)throw new Error(`Supabase read: ${response.status}`);
 const rows=await response.json();
 return (Array.isArray(rows)?rows:[]).filter(r=>typeof r.id==='string').map(r=>({id:r.id,message:cleanMessage(r.message),design:validateDesign(r.design),created_at:r.created_at}));
}
export async function submitForModeration({message,design}){
 if(!onlineEnabled)return false;
 const response=await fetch(endpoint,{method:'POST',headers:{...headers(),'Prefer':'return=minimal'},body:JSON.stringify({message:cleanMessage(message),design:validateDesign(design)})});
 if(!response.ok)throw new Error(`Supabase insert: ${response.status}`);
 return true;
}
