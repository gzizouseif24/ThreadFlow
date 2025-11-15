import"./DsnmJJEf.js";import{i as Be}from"./CLQ63CCY.js";import{aG as de,b as G,aH as Ne,a0 as L,h as S,g as me,a as W,K as k,ad as Ue,Z as Ye,_ as je,$ as pe,a1 as P,f as M,aA as ze,aI as We,aJ as B,aK as Ke,aL as q,aM as F,aq as Ge,aN as _e,a4 as qe,a9 as ge,aO as Ie,n as $e,aP as De,aQ as Fe,aR as Xe,aS as te,q as Oe,aT as U,aU as Ze,aB as Qe,aV as xe,aW as et,aX as tt,a8 as Ce,aY as at,E as rt,B as st,aZ as it,d as nt,a_ as lt,t as Me,e as ke,a$ as ft,b0 as ot,b1 as ut,b2 as dt,b3 as ct,b4 as vt,b5 as ht,b6 as pt,b7 as _t,aw as gt,b8 as bt,b9 as At,ba as Et,bb as St,bc as wt,bd as Tt,O as Nt,be as mt,T as Y,U as It,u as be,L as H,W as $t,V as Dt,X as Ot,as as X,Q as Z,au as Ct,bf as Mt,at as kt,ae as Pt,a7 as yt}from"./D_zHt7FK.js";import{l as j,p as y,s as ce}from"./CldaVQCD.js";function Lt(e,a){return a}function Rt(e,a,t){for(var r=e.items,s=[],n=a.length,i=0;i<n;i++)xe(a[i].e,s,!0);var f=n>0&&s.length===0&&t!==null;if(f){var h=t.parentNode;et(h),h.append(t),r.clear(),O(e,a[0].prev,a[n-1].next)}tt(s,()=>{for(var p=0;p<n;p++){var _=a[p];f||(r.delete(_.k),O(e,_.prev,_.next)),U(_.e,!f)}})}function Ht(e,a,t,r,s,n=null){var i=e,f={flags:a,items:new Map,first:null},h=(a&Ne)!==0;if(h){var p=e;i=S?L(me(p)):p.appendChild(de())}S&&W();var _=null,g=!1,d=new Map,E=Ue(()=>{var w=t();return $e(w)?w:w==null?[]:Ie(w)}),u,v;function c(){Vt(v,u,f,d,i,s,a,r,t),n!==null&&(u.length===0?_?De(_):_=B(()=>n(i)):_!==null&&Fe(_,()=>{_=null}))}G(()=>{v??=Ce,u=k(E);var w=u.length;if(g&&w===0)return;g=w===0;let m=!1;if(S){var I=Ye(i)===je;I!==(w===0)&&(i=pe(),L(i),P(!1),m=!0)}if(S){for(var A=null,T,l=0;l<w;l++){if(M.nodeType===ze&&M.data===We){i=M,m=!0,P(!1);break}var o=u[l],b=r(o,l);T=oe(M,f,A,null,o,b,l,s,a,t),f.items.set(b,T),A=T}w>0&&L(pe())}if(S)w===0&&n&&(_=B(()=>n(i)));else if(Ke()){var $=new Set,N=Ge;for(l=0;l<w;l+=1){o=u[l],b=r(o,l);var C=f.items.get(b)??d.get(b);C?(a&(q|F))!==0&&Pe(C,o,l,a):(T=oe(null,f,null,null,o,b,l,s,a,t,!0),d.set(b,T)),$.add(b)}for(const[D,z]of f.items)$.has(D)||N.skipped_effects.add(z.e);N.add_callback(c)}else c();m&&P(!0),k(E)}),S&&(i=M)}function Vt(e,a,t,r,s,n,i,f,h){var p=(i&Ze)!==0,_=(i&(q|F))!==0,g=a.length,d=t.items,E=t.first,u=E,v,c=null,w,m=[],I=[],A,T,l,o;if(p)for(o=0;o<g;o+=1)A=a[o],T=f(A,o),l=d.get(T),l!==void 0&&(l.a?.measure(),(w??=new Set).add(l));for(o=0;o<g;o+=1){if(A=a[o],T=f(A,o),l=d.get(T),l===void 0){var b=r.get(T);if(b!==void 0){r.delete(T),d.set(T,b);var $=c?c.next:u;O(t,c,b),O(t,b,$),ae(b,$,s),c=b}else{var N=u?u.e.nodes_start:s;c=oe(N,t,c,c===null?t.first:c.next,A,T,o,n,i,h)}d.set(T,c),m=[],I=[],u=c.next;continue}if(_&&Pe(l,A,o,i),(l.e.f&te)!==0&&(De(l.e),p&&(l.a?.unfix(),(w??=new Set).delete(l))),l!==u){if(v!==void 0&&v.has(l)){if(m.length<I.length){var C=I[0],D;c=C.prev;var z=m[0],x=m[m.length-1];for(D=0;D<m.length;D+=1)ae(m[D],C,s);for(D=0;D<I.length;D+=1)v.delete(I[D]);O(t,z.prev,x.next),O(t,c,z),O(t,x,C),u=C,c=x,o-=1,m=[],I=[]}else v.delete(l),ae(l,u,s),O(t,l.prev,l.next),O(t,l,c===null?t.first:c.next),O(t,c,l),c=l;continue}for(m=[],I=[];u!==null&&u.k!==T;)(u.e.f&te)===0&&(v??=new Set).add(u),I.push(u),u=u.next;if(u===null)continue;l=u}m.push(l),c=l,u=l.next}if(u!==null||v!==void 0){for(var R=v===void 0?[]:Ie(v);u!==null;)(u.e.f&te)===0&&R.push(u),u=u.next;var ee=R.length;if(ee>0){var Ve=(i&Ne)!==0&&g===0?s:null;if(p){for(o=0;o<ee;o+=1)R[o].a?.measure();for(o=0;o<ee;o+=1)R[o].a?.fix()}Rt(t,R,Ve)}}p&&Oe(()=>{if(w!==void 0)for(l of w)l.a?.apply()}),e.first=t.first&&t.first.e,e.last=c&&c.e;for(var Je of r.values())U(Je.e);r.clear()}function Pe(e,a,t,r){(r&q)!==0&&_e(e.v,a),(r&F)!==0?_e(e.i,t):e.i=t}function oe(e,a,t,r,s,n,i,f,h,p,_){var g=(h&q)!==0,d=(h&Xe)===0,E=g?d?qe(s,!1,!1):ge(s):s,u=(h&F)===0?i:ge(i),v={i:u,v:E,k:n,a:null,e:null,prev:t,next:r};try{if(e===null){var c=document.createDocumentFragment();c.append(e=de())}return v.e=B(()=>f(e,E,u,p),S),v.e.prev=t&&t.e,v.e.next=r&&r.e,t===null?_||(a.first=v):(t.next=v,t.e.next=v.e),r!==null&&(r.prev=v,r.e.prev=v.e),v}finally{}}function ae(e,a,t){for(var r=e.next?e.next.e.nodes_start:t,s=a?a.e.nodes_start:t,n=e.e.nodes_start;n!==null&&n!==r;){var i=Qe(n);s.before(n),n=i}}function O(e,a,t){a===null?e.first=t:(a.next=t,a.e.next=t&&t.e),t!==null&&(t.prev=a,t.e.prev=a&&a.e)}function Q(e,a,t,r,s){S&&W();var n=a.$$slots?.[t],i=!1;n===!0&&(n=a.children,i=!0),n===void 0||n(e,i?()=>r:r)}function Jt(e,a,t,r,s,n){let i=S;S&&W();var f=null;S&&M.nodeType===at&&(f=M,W());var h=S?M:e,p=new st(h,!1);G(()=>{const _=a()||null;var g=it;if(_===null){p.ensure(null,null);return}return p.ensure(_,d=>{if(_){if(f=S?f:document.createElementNS(g,_),nt(f,f),r){S&&lt(_)&&f.append(document.createComment(""));var E=S?me(f):f.appendChild(de());S&&(E===null?P(!1):L(E)),r(f,E)}Ce.nodes_end=f,d.before(f)}S&&L(d)}),()=>{}},rt),Me(()=>{}),i&&(P(!0),L(h))}function Bt(e,a){var t=void 0,r;G(()=>{t!==(t=a())&&(r&&(U(r),r=null),t&&(r=B(()=>{ke(()=>t(e))})))})}function ye(e){var a,t,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var s=e.length;for(a=0;a<s;a++)e[a]&&(t=ye(e[a]))&&(r&&(r+=" "),r+=t)}else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}function Ut(){for(var e,a,t=0,r="",s=arguments.length;t<s;t++)(e=arguments[t])&&(a=ye(e))&&(r&&(r+=" "),r+=a);return r}function Yt(e){return typeof e=="object"?Ut(e):e??""}const Ae=[...` 	
\r\f \v\uFEFF`];function jt(e,a,t){var r=e==null?"":""+e;if(a&&(r=r?r+" "+a:a),t){for(var s in t)if(t[s])r=r?r+" "+s:s;else if(r.length)for(var n=s.length,i=0;(i=r.indexOf(s,i))>=0;){var f=i+n;(i===0||Ae.includes(r[i-1]))&&(f===r.length||Ae.includes(r[f]))?r=(i===0?"":r.substring(0,i))+r.substring(f+1):i=f}}return r===""?null:r}function Ee(e,a=!1){var t=a?" !important;":";",r="";for(var s in e){var n=e[s];n!=null&&n!==""&&(r+=" "+s+": "+n+t)}return r}function re(e){return e[0]!=="-"||e[1]!=="-"?e.toLowerCase():e}function zt(e,a){if(a){var t="",r,s;if(Array.isArray(a)?(r=a[0],s=a[1]):r=a,e){e=String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g,"").trim();var n=!1,i=0,f=!1,h=[];r&&h.push(...Object.keys(r).map(re)),s&&h.push(...Object.keys(s).map(re));var p=0,_=-1;const v=e.length;for(var g=0;g<v;g++){var d=e[g];if(f?d==="/"&&e[g-1]==="*"&&(f=!1):n?n===d&&(n=!1):d==="/"&&e[g+1]==="*"?f=!0:d==='"'||d==="'"?n=d:d==="("?i++:d===")"&&i--,!f&&n===!1&&i===0){if(d===":"&&_===-1)_=g;else if(d===";"||g===v-1){if(_!==-1){var E=re(e.substring(p,_).trim());if(!h.includes(E)){d!==";"&&g++;var u=e.substring(p,g).trim();t+=" "+u+";"}}p=g+1,_=-1}}}}return r&&(t+=Ee(r)),s&&(t+=Ee(s,!0)),t=t.trim(),t===""?null:t}return e==null?null:String(e)}function Wt(e,a,t,r,s,n){var i=e.__className;if(S||i!==t||i===void 0){var f=jt(t,r,n);(!S||f!==e.getAttribute("class"))&&(f==null?e.removeAttribute("class"):a?e.className=f:e.setAttribute("class",f)),e.__className=t}else if(n&&s!==n)for(var h in n){var p=!!n[h];(s==null||p!==!!s[h])&&e.classList.toggle(h,p)}return n}function se(e,a={},t,r){for(var s in t){var n=t[s];a[s]!==n&&(t[s]==null?e.style.removeProperty(s):e.style.setProperty(s,n,r))}}function Kt(e,a,t,r){var s=e.__style;if(S||s!==a){var n=zt(a,r);(!S||n!==e.getAttribute("style"))&&(n==null?e.removeAttribute("style"):e.style.cssText=n),e.__style=a}else r&&(Array.isArray(r)?(se(e,t?.[0],r[0]),se(e,t?.[1],r[1],"important")):se(e,t,r));return r}function ue(e,a,t=!1){if(e.multiple){if(a==null)return;if(!$e(a))return ft();for(var r of e.options)r.selected=a.includes(Se(r));return}for(r of e.options){var s=Se(r);if(ot(s,a)){r.selected=!0;return}}(!t||a!==void 0)&&(e.selectedIndex=-1)}function Gt(e){var a=new MutationObserver(()=>{ue(e,e.__value)});a.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),Me(()=>{a.disconnect()})}function Se(e){return"__value"in e?e.__value:e.value}const V=Symbol("class"),J=Symbol("style"),Le=Symbol("is custom element"),Re=Symbol("is html");function qt(e){if(S){var a=!1,t=()=>{if(!a){if(a=!0,e.hasAttribute("value")){var r=e.value;K(e,"value",null),e.value=r}if(e.hasAttribute("checked")){var s=e.checked;K(e,"checked",null),e.checked=s}}};e.__on_r=t,Oe(t),St()}}function sa(e,a){var t=ve(e);t.checked!==(t.checked=a??void 0)&&(e.checked=a)}function Ft(e,a){a?e.hasAttribute("selected")||e.setAttribute("selected",""):e.removeAttribute("selected")}function K(e,a,t,r){var s=ve(e);S&&(s[a]=e.getAttribute(a),a==="src"||a==="srcset"||a==="href"&&e.nodeName==="LINK")||s[a]!==(s[a]=t)&&(a==="loading"&&(e[wt]=t),t==null?e.removeAttribute(a):typeof t!="string"&&He(e).includes(a)?e[a]=t:e.setAttribute(a,t))}function Xt(e,a,t,r,s=!1,n=!1){if(S&&s&&e.tagName==="INPUT"){var i=e,f=i.type==="checkbox"?"defaultChecked":"defaultValue";f in t||qt(i)}var h=ve(e),p=h[Le],_=!h[Re];let g=S&&p;g&&P(!1);var d=a||{},E=e.tagName==="OPTION";for(var u in a)u in t||(t[u]=null);t.class?t.class=Yt(t.class):t[V]&&(t.class=null),t[J]&&(t.style??=null);var v=He(e);for(const l in t){let o=t[l];if(E&&l==="value"&&o==null){e.value=e.__value="",d[l]=o;continue}if(l==="class"){var c=e.namespaceURI==="http://www.w3.org/1999/xhtml";Wt(e,c,o,r,a?.[V],t[V]),d[l]=o,d[V]=t[V];continue}if(l==="style"){Kt(e,o,a?.[J],t[J]),d[l]=o,d[J]=t[J];continue}var w=d[l];if(!(o===w&&!(o===void 0&&e.hasAttribute(l)))){d[l]=o;var m=l[0]+l[1];if(m!=="$$")if(m==="on"){const b={},$="$$"+l;let N=l.slice(2);var I=Tt(N);if(pt(N)&&(N=N.slice(0,-7),b.capture=!0),!I&&w){if(o!=null)continue;e.removeEventListener(N,d[$],b),d[$]=null}if(o!=null)if(I)e[`__${N}`]=o,gt([N]);else{let C=function(D){d[l].call(this,D)};d[$]=_t(N,e,C,b)}else I&&(e[`__${N}`]=void 0)}else if(l==="style")K(e,l,o);else if(l==="autofocus")bt(e,!!o);else if(!p&&(l==="__value"||l==="value"&&o!=null))e.value=e.__value=o;else if(l==="selected"&&E)Ft(e,o);else{var A=l;_||(A=At(A));var T=A==="defaultValue"||A==="defaultChecked";if(o==null&&!p&&!T)if(h[l]=null,A==="value"||A==="checked"){let b=e;const $=a===void 0;if(A==="value"){let N=b.defaultValue;b.removeAttribute(A),b.defaultValue=N,b.value=b.__value=$?N:null}else{let N=b.defaultChecked;b.removeAttribute(A),b.defaultChecked=N,b.checked=$?N:!1}}else e.removeAttribute(l);else T||v.includes(A)&&(p||typeof o!="string")?(e[A]=o,A in h&&(h[A]=Et)):typeof o!="function"&&K(e,A,o)}}}return g&&P(!0),d}function we(e,a,t=[],r=[],s,n=!1,i=!1){ut(t,r,f=>{var h=void 0,p={},_=e.nodeName==="SELECT",g=!1;if(G(()=>{var E=a(...f.map(k)),u=Xt(e,h,E,s,n,i);g&&_&&"value"in E&&ue(e,E.value);for(let c of Object.getOwnPropertySymbols(p))E[c]||U(p[c]);for(let c of Object.getOwnPropertySymbols(E)){var v=E[c];c.description===vt&&(!h||v!==h[c])&&(p[c]&&U(p[c]),p[c]=B(()=>Bt(e,()=>v))),u[c]=v}h=u}),_){var d=e;ke(()=>{ue(d,h.value,!0),Gt(d)})}g=!0})}function ve(e){return e.__attributes??={[Le]:e.nodeName.includes("-"),[Re]:e.namespaceURI===dt}}var Te=new Map;function He(e){var a=e.getAttribute("is")||e.nodeName,t=Te.get(a);if(t)return t;Te.set(a,t=[]);for(var r,s=e,n=Element.prototype;n!==s;){r=ht(s);for(var i in r)r[i].set&&t.push(i);s=ct(s)}return t}/**
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
 */const Zt={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};var Qt=mt("<svg><!><!></svg>");function he(e,a){const t=j(a,["children","$$slots","$$events","$$legacy"]),r=j(t,["name","color","size","strokeWidth","absoluteStrokeWidth","iconNode"]);Nt(a,!1);let s=y(a,"name",8,void 0),n=y(a,"color",8,"currentColor"),i=y(a,"size",8,24),f=y(a,"strokeWidth",8,2),h=y(a,"absoluteStrokeWidth",8,!1),p=y(a,"iconNode",24,()=>[]);const _=(...u)=>u.filter((v,c,w)=>!!v&&w.indexOf(v)===c).join(" ");Be();var g=Qt();we(g,(u,v)=>({...Zt,...r,width:i(),height:i(),stroke:n(),"stroke-width":u,class:v}),[()=>(H(h()),H(f()),H(i()),be(()=>h()?Number(f())*24/Number(i()):f())),()=>(H(s()),H(t),be(()=>_("lucide-icon","lucide",s()?`lucide-${s()}`:"",t.class)))]);var d=$t(g);Ht(d,1,p,Lt,(u,v)=>{var c=Ct(()=>Mt(k(v),2));let w=()=>k(c)[0],m=()=>k(c)[1];var I=X(),A=Z(I);Jt(A,w,!0,(T,l)=>{we(T,()=>({...m()}))}),Y(u,I)});var E=Dt(d);Q(E,a,"default",{}),Ot(g),Y(e,g),It()}function ia(e,a){const t=j(a,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M8 2v4"}],["path",{d:"M16 2v4"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2"}],["path",{d:"M3 10h18"}]];he(e,ce({name:"calendar"},()=>t,{get iconNode(){return r},children:(s,n)=>{var i=X(),f=Z(i);Q(f,a,"default",{}),Y(s,i)},$$slots:{default:!0}}))}function na(e,a){const t=j(a,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]];he(e,ce({name:"trash-2"},()=>t,{get iconNode(){return r},children:(s,n)=>{var i=X(),f=Z(i);Q(f,a,"default",{}),Y(s,i)},$$slots:{default:!0}}))}function la(e,a){const t=j(a,["children","$$slots","$$events","$$legacy"]);/**
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
 */const r=[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]];he(e,ce({name:"x"},()=>t,{get iconNode(){return r},children:(s,n)=>{var i=X(),f=Z(i);Q(f,a,"default",{}),Y(s,i)},$$slots:{default:!0}}))}const ie="threadflow-tabs",ne="threadflow-projects",le="threadflow-events",fe={get(){const e=localStorage.getItem(ie);return e?JSON.parse(e):[]},set(e){localStorage.setItem(ie,JSON.stringify(e))},clear(){localStorage.removeItem(ie)},getProjects(){const e=localStorage.getItem(ne);return e?JSON.parse(e):[]},setProjects(e){localStorage.setItem(ne,JSON.stringify(e))},clearProjects(){localStorage.removeItem(ne)},getEvents(){const e=localStorage.getItem(le);return e?JSON.parse(e):[]},setEvents(e){localStorage.setItem(le,JSON.stringify(e))},clearEvents(){localStorage.removeItem(le)},cleanupOldJunk(e){const a=Date.now()-2592e6;return e.filter(t=>!(t.isDeleted&&t.deletedAt&&t.deletedAt<a))}};class xt{#e=kt(Pt([]));get tabs(){return k(this.#e)}set tabs(a){yt(this.#e,a,!0)}constructor(){let a=fe.get();const t=a.length;a=fe.cleanupOldJunk(a);const r=new Set,s=a.filter(n=>r.has(n.id)?(console.warn(`Removing duplicate task with ID: ${n.id}`),!1):(r.add(n.id),!0));this.tabs=s,s.length!==t&&this.save()}add(a,t,r=null){const s={id:crypto.randomUUID(),content:a,parentId:r,isPinned:!1,isCompleted:!1,isDeleted:!1,deletedAt:null,createdAt:Date.now(),updatedAt:Date.now(),position:t||{x:Math.random()*400,y:Math.random()*300}};this.tabs=[...this.tabs,s],this.save()}update(a,t){this.tabs=this.tabs.map(r=>r.id===a?{...r,content:t,updatedAt:Date.now()}:r),this.save()}togglePin(a){this.tabs=this.tabs.map(t=>t.id===a?{...t,isPinned:!t.isPinned,updatedAt:Date.now()}:t),this.save()}toggleComplete(a){this.tabs=this.tabs.map(t=>t.id===a?{...t,isCompleted:!t.isCompleted,updatedAt:Date.now()}:t),this.save()}delete(a){this.tabs=this.tabs.map(t=>t.id===a?{...t,isDeleted:!0,deletedAt:Date.now(),updatedAt:Date.now()}:t),this.save()}restore(a){this.tabs=this.tabs.map(t=>t.id===a?{...t,isDeleted:!1,deletedAt:null,updatedAt:Date.now()}:t),this.save()}permanentDelete(a){this.tabs=this.tabs.filter(t=>t.id!==a),this.save()}emptyJunk(){this.tabs=this.tabs.filter(a=>!a.isDeleted),this.save()}moveToProject(a,t){this.tabs=this.tabs.map(r=>r.id===a?{...r,parentId:t,updatedAt:Date.now()}:r),this.save()}reorder(a){this.tabs=a,this.save()}reorderInProject(a,t){const r=this.tabs.filter(s=>s.parentId!==a);this.tabs=[...r,...t],this.save()}updatePosition(a,t){this.tabs=this.tabs.map(r=>r.id===a?{...r,position:t,updatedAt:Date.now()}:r),this.save()}updateImage(a,t){this.tabs=this.tabs.map(r=>r.id===a?{...r,imageUrl:t,updatedAt:Date.now()}:r),this.save()}updateNotes(a,t){this.tabs=this.tabs.map(r=>r.id===a?{...r,notes:t,updatedAt:Date.now()}:r),this.save()}updateTags(a,t){this.tabs=this.tabs.map(r=>r.id===a?{...r,tags:t,updatedAt:Date.now()}:r),this.save()}get activeTabs(){return this.tabs.filter(a=>!a.isDeleted)}get deletedTabs(){return this.tabs.filter(a=>a.isDeleted)}get rootTasks(){return this.tabs.filter(a=>a.parentId===null&&!a.isDeleted)}getTasksByProject(a){return this.tabs.filter(t=>t.parentId===a&&!t.isDeleted)}save(){fe.set(this.tabs)}}const fa=new xt;export{ia as C,he as I,na as T,la as X,fe as a,Wt as b,K as c,sa as d,Ht as e,Kt as f,Lt as i,qt as r,Q as s,fa as t};
