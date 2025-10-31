import{_ as v,$ as c,F as m,h as f,u as j,r as D,a0 as w,Z as A,Q as _,T as y,a1 as k,a2 as $,K as b,a3 as g}from"./BcC68qzm.js";import"./DsnmJJEf.js";import"./BxKOMVKL.js";import{I as M,s as S,a as p}from"./Dqwft_2m.js";import{l as I,s as P}from"./DCmR52Zg.js";function R(a,e,s=e){var t=new WeakSet;v(a,"input",async r=>{var o=r?a.defaultValue:a.value;if(o=h(a)?u(o):o,s(o),c!==null&&t.add(c),await m(),o!==(o=e())){var d=a.selectionStart,i=a.selectionEnd,l=a.value.length;if(a.value=o??"",i!==null){var n=a.value.length;d===i&&i===l&&n>l?(a.selectionStart=n,a.selectionEnd=n):(a.selectionStart=d,a.selectionEnd=Math.min(i,n))}}}),(f&&a.defaultValue!==a.value||j(e)==null&&a.value)&&(s(h(a)?u(a.value):a.value),c!==null&&t.add(c)),D(()=>{var r=e();if(a===document.activeElement){var o=w??c;if(t.has(o))return}h(a)&&r===u(a.value)||a.type==="date"&&!r&&!a.value||r!==a.value&&(a.value=r??"")})}function h(a){var e=a.type;return e==="number"||e==="range"}function u(a){return a===""?null:+a}function V(a,e){const s=I(e,["children","$$slots","$$events","$$legacy"]);/**
 * @license lucide-svelte v0.546.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The MIT License (MIT) (for portions derived from Feather)
 *
 * Copyright (c) 2013-2023 Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */const t=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"M10 9H8"}],["path",{d:"M16 13H8"}],["path",{d:"M16 17H8"}]];M(a,P({name:"file-text"},()=>s,{get iconNode(){return t},children:(r,o)=>{var d=A(),i=_(d);S(i,e,"default",{}),y(r,d)},$$slots:{default:!0}}))}class U{#t=k($([]));get projects(){return b(this.#t)}set projects(e){g(this.#t,e,!0)}constructor(){this.projects=p.getProjects()}add(e,s,t,r){const o={id:r||crypto.randomUUID(),name:e,color:s,position:t||{x:Math.random()*400,y:Math.random()*300},width:350,height:400,createdAt:Date.now(),updatedAt:Date.now()};return this.projects=[...this.projects,o],this.save(),o.id}update(e,s){this.projects=this.projects.map(t=>t.id===e?{...t,name:s,updatedAt:Date.now()}:t),this.save()}updateColor(e,s){this.projects=this.projects.map(t=>t.id===e?{...t,color:s,updatedAt:Date.now()}:t),this.save()}updatePosition(e,s){this.projects=this.projects.map(t=>t.id===e?{...t,position:s,updatedAt:Date.now()}:t),this.save()}updateSize(e,s,t){this.projects=this.projects.map(r=>r.id===e?{...r,width:s,height:t,updatedAt:Date.now()}:r),this.save()}updateImage(e,s){this.projects=this.projects.map(t=>t.id===e?{...t,imageUrl:s,updatedAt:Date.now()}:t),this.save()}delete(e){this.projects=this.projects.filter(s=>s.id!==e),this.save()}updateDescription(e,s){this.projects=this.projects.map(t=>t.id===e?{...t,description:s,updatedAt:Date.now()}:t),this.save()}updateObjective(e,s){this.projects=this.projects.map(t=>t.id===e?{...t,objective:s,updatedAt:Date.now()}:t),this.save()}updateDeadline(e,s){this.projects=this.projects.map(t=>t.id===e?{...t,deadline:s,updatedAt:Date.now()}:t),this.save()}updateStatus(e,s){this.projects=this.projects.map(t=>t.id===e?{...t,status:s,updatedAt:Date.now()}:t),this.save()}addLink(e,s){this.projects=this.projects.map(t=>{if(t.id===e){const r={...s,id:crypto.randomUUID(),createdAt:Date.now()};return{...t,links:[...t.links||[],r],updatedAt:Date.now()}}return t}),this.save()}removeLink(e,s){this.projects=this.projects.map(t=>t.id===e?{...t,links:(t.links||[]).filter(r=>r.id!==s),updatedAt:Date.now()}:t),this.save()}addResource(e,s){this.projects=this.projects.map(t=>{if(t.id===e){const r={...s,id:crypto.randomUUID(),createdAt:Date.now()};return{...t,resources:[...t.resources||[],r],updatedAt:Date.now()}}return t}),this.save()}removeResource(e,s){this.projects=this.projects.map(t=>t.id===e?{...t,resources:(t.resources||[]).filter(r=>r.id!==s),updatedAt:Date.now()}:t),this.save()}updateTags(e,s){this.projects=this.projects.map(t=>t.id===e?{...t,tags:s,updatedAt:Date.now()}:t),this.save()}save(){p.setProjects(this.projects)}}const z=new U;export{V as F,R as b,z as p};
