import{_ as p,$ as c,F as f,h as m,u as j,r as _,a0 as $,Z as w,Q as y,T as b,a1 as D,a2 as A,K as M,a3 as g}from"./BBHrziBA.js";import"./DsnmJJEf.js";import"./bOk_8AqK.js";import{I as S,s as P,a as u}from"./BMQEqQ_J.js";import{l as x,s as k}from"./DrVnXhUl.js";function N(e,a,s=a){var t=new WeakSet;p(e,"input",async r=>{var o=r?e.defaultValue:e.value;if(o=n(e)?h(o):o,s(o),c!==null&&t.add(c),await f(),o!==(o=a())){var d=e.selectionStart,i=e.selectionEnd,v=e.value.length;if(e.value=o??"",i!==null){var l=e.value.length;d===i&&i===v&&l>v?(e.selectionStart=l,e.selectionEnd=l):(e.selectionStart=d,e.selectionEnd=Math.min(i,l))}}}),(m&&e.defaultValue!==e.value||j(a)==null&&e.value)&&(s(n(e)?h(e.value):e.value),c!==null&&t.add(c)),_(()=>{var r=a();if(e===document.activeElement){var o=$??c;if(t.has(o))return}n(e)&&r===h(e.value)||e.type==="date"&&!r&&!e.value||r!==e.value&&(e.value=r??"")})}function n(e){var a=e.type;return a==="number"||a==="range"}function h(e){return e===""?null:+e}function U(e,a){const s=x(a,["children","$$slots","$$events","$$legacy"]);/**
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
 */const t=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"M10 9H8"}],["path",{d:"M16 13H8"}],["path",{d:"M16 17H8"}]];S(e,k({name:"file-text"},()=>s,{get iconNode(){return t},children:(r,o)=>{var d=w(),i=y(d);P(i,a,"default",{}),b(r,d)},$$slots:{default:!0}}))}class E{#e=D(A([]));get projects(){return M(this.#e)}set projects(a){g(this.#e,a,!0)}constructor(){this.projects=u.getProjects()}add(a,s,t,r){const o={id:r||crypto.randomUUID(),name:a,color:s,position:t||{x:Math.random()*400,y:Math.random()*300},width:350,height:400,createdAt:Date.now(),updatedAt:Date.now()};return this.projects=[...this.projects,o],this.save(),o.id}update(a,s){this.projects=this.projects.map(t=>t.id===a?{...t,name:s,updatedAt:Date.now()}:t),this.save()}updateColor(a,s){this.projects=this.projects.map(t=>t.id===a?{...t,color:s,updatedAt:Date.now()}:t),this.save()}updatePosition(a,s){this.projects=this.projects.map(t=>t.id===a?{...t,position:s,updatedAt:Date.now()}:t),this.save()}updateSize(a,s,t){this.projects=this.projects.map(r=>r.id===a?{...r,width:s,height:t,updatedAt:Date.now()}:r),this.save()}updateImage(a,s){this.projects=this.projects.map(t=>t.id===a?{...t,imageUrl:s,updatedAt:Date.now()}:t),this.save()}delete(a){this.projects=this.projects.filter(s=>s.id!==a),this.save()}updateObjective(a,s){this.projects=this.projects.map(t=>t.id===a?{...t,objective:s,updatedAt:Date.now()}:t),this.save()}save(){u.setProjects(this.projects)}}const Z=new E;export{U as F,N as b,Z as p};
