var e=Object.assign;import{r as t,s as n,o as r,l as o,i as c,f as i,a,b as l,c as s,d,p as u,e as h,g as p,u as m,t as f,h as g,m as b,j as v,k as E,n as x,q as C,v as w}from"./vendor.89a71862.js";!function(e=".",t="__import__"){try{self[t]=new Function("u","return import(u)")}catch(n){const r=new URL(e,location),o=e=>{URL.revokeObjectURL(e.src),e.remove()};self[t]=e=>new Promise(((n,c)=>{const i=new URL(e,r);if(self[t].moduleMap[i])return n(self[t].moduleMap[i]);const a=new Blob([`import * as m from '${i}';`,`${t}.moduleMap['${i}']=m;`],{type:"text/javascript"}),l=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(a),onerror(){c(new Error(`Failed to import: ${e}`)),o(l)},onload(){n(self[t].moduleMap[i]),o(l)}});document.head.appendChild(l)})),self[t].moduleMap={}}}("/tsmind/assets/");const y=t.createContext({canvas:null,setCanvas:e=>{}}),M=t.createContext({startDragging:()=>{}}),$=20,k=20,R=10,S=5,z=5;function j(e){return{padding:`${S}px ${R}px`}}function B(t){const r=new DocumentFragment;function o(e){const t=document.createElement("span");return t.setAttribute("style",`position: absolute; visibility: hidden; user-select: none; ${Object.entries(j()).map((([e,t])=>`${e}: ${t}`)).join(";")}`),t.innerText=e.label,r.appendChild(t),t}const c=function t(n){const r=n.children.map(t),c=o(n);return e(e({coord:[0,0]},n),{children:r,size:()=>{const e=[c.clientWidth,c.clientHeight];return c.remove(),e}})}(t);return document.body.appendChild(r),function t(r){const o=r.children.map(t),c=r.size(),i=Math.max(c[1],$*(o.length-1)+n(o,"height"));return e(e({},r),{size:c,height:i,children:o})}(c)}function D(t){const n=n=>function(t,n){return function t(r){let o=0;for(const e of r.children)e.coord=[r.coord[0]+(r.size[0]/2+k+e.size[0]/2)*("left"===n?-1:1),r.coord[1]+o-r.height/2+e.height/2],o+=e.height+$;return e(e({},r),{children:r.children.map(t)})}(B(t))}(e(e({},t),{children:t.children.filter((e=>e.direction===n))}),n),r=n("right");return e(e({},r),{children:r.children.concat(n("left").children)})}function L(e){return{children:e.children.map(D)}}function P(e,t=!1,n=""){return{root:t,id:Math.random().toString(36).slice(2),label:n,direction:e,expanded:!0,children:[]}}function N(e){return i(e,(e=>["children",e]))}function O(e){return t=N(e),[a(t),l(t)];var t}function U(e,t,n){const[i,a]=O(t);return r(o(i),c(a,n),e)}function A(e,t){const[n,c]=O(t);return r(o(n),h(c,1),e)}function T(e,t){return[e[0]-t[0],e[1]-t[1]]}function F(e,t){const n=T(e,t);return Math.abs(n[0])+Math.abs(n[1])}const I=function(e,t){return[e[0]+t[0],e[1]+t[1]]};function X(e){return`${e[0]},${e[1]}`}const Y=t.memo((function(e){const{a:n,b:r}=e,o=Math.min(n[1],r[1]),c=Math.min(n[0],r[0]),i=Math.max(Math.abs(n[0]-r[0]),1),a=Math.max(Math.abs(n[1]-r[1]),1),l=[c,o],s=[r[0]-c,n[1]-o],d=[n[0]-c,r[1]-o];return t.createElement("svg",{viewBox:`0 0 ${i} ${a}`,style:{position:"absolute",zIndex:-1,top:o,left:c,width:i,height:a}},t.createElement("path",{d:`M${X(T(n,l))} C${X(s)} ${X(d)} ${X(T(r,l))}`,fill:"transparent",stroke:"black"}))})),_=t.memo((function(e){const{parent:n,child:r}=e;return t.createElement(Y,{a:n.coord,b:I(r.coord,[(z-r.size[0]/2)*("left"===r.direction?-1:1),0])})})),H=new Set,K=t.memo((function(n){const{node:r,editing:o}=n,[c,i]=t.useState(r.label.length),a=t.useRef(null),l=e(e({},j()),{height:r.size[1],border:"1px solid black",borderRadius:"5px",lineHeight:`${r.size[1]}px`,backgroundColor:"white"});return t.useLayoutEffect((()=>{const e=document.getSelection();if(o&&e&&a.current){const t=new Range,n=Array.from(a.current.childNodes).find((e=>e.nodeValue));n&&(null==t||t.setStart(n,c),null==t||t.setEnd(n,c),e.removeAllRanges(),e.addRange(t))}}),[c,o]),t.createElement("div",{ref:a,className:"node",contentEditable:o,style:l,suppressContentEditableWarning:!0,onBlur:n.onBlur,onInput:t=>{var o,c;i(null!=(c=null==(o=window.getSelection())?void 0:o.getRangeAt(0).startOffset)?c:0),n.onChange(e(e({},r),{label:t.currentTarget.innerText}))}},r.label||" ")})),W=t.memo((function(e){const{node:n,path:c,getCoord:i}=e,[a,l]=t.useState(H.has(n.id)),u=t.useCallback((()=>l(!1)),[]),{canvas:h,setCanvas:p}=t.useContext(y),{startDragging:m}=t.useContext(M);function f(){const e=P(n.direction);H.add(e.id),p(function(e,t,n){return r(o(N(t).concat("children")),d(n),e)}(h,c,e))}t.useEffect((()=>{H.delete(n.id)}),[]);const[g,b]=[n.coord[0]-n.size[0]/2,n.coord[1]-n.size[1]/2];return t.createElement(t.Fragment,null,n.children.map(((e,r)=>t.createElement("div",{key:e.id,className:e.dropPreview?"drop-preview":""},t.createElement(_,{parent:n,child:e}),t.createElement(W,{getCoord:i,node:e,path:[...c,r]})))),t.createElement("div",{className:"node-wrap",style:{position:"absolute",top:b,left:g},onKeyPressCapture:e=>{if("Enter"===e.key)if(e.preventDefault(),a)l(!1);else if(e.shiftKey)f();else{if(function(e){return!!e.root}(n))return;const e=P(n.direction);H.add(e.id),p(U(h,c,e))}},tabIndex:-1,onMouseDown:t=>{const r=T(n.coord,i(t.clientX,t.clientY));m(e.path,((e,t)=>I(i(e,t),r)),[t.clientX,t.clientY])},onDoubleClick:()=>{a||l(!0)}},t.createElement(K,{editing:a,node:n,onBlur:u,onChange:function(e){p(function(e,t,n){return s(N(t),n,e)}(h,c,e))}})))}));function q(e){const{canvas:n}=e,r=t.useRef(null),o=t.useCallback(((e,t)=>{const{left:n,top:o}=r.current.getBoundingClientRect();return[e-n-300,t-o-300]}),[]);return t.createElement("div",{ref:r,style:{width:600,height:600}},t.createElement("div",{style:{transform:"translate(300px, 300px)"}},n.children.map(((e,n)=>t.createElement(W,{key:e.id,node:e,path:[n],getCoord:o}))),n.dragSource&&!n.dropTarget&&t.createElement(W,{node:n.dragSource,path:[],getCoord:o})))}const V={children:[{label:"Root",id:"root",expanded:!0,direction:"right",root:!0,coord:[0,0],children:[{label:"sup2",id:"sub2",direction:"right",expanded:!1,children:[{label:"sub4",id:"sub4",direction:"right",expanded:!1,children:[]},{label:"sub3",id:"sub3",direction:"right",expanded:!1,children:[]}]},{label:"sub5",id:"sub5",direction:"right",expanded:!1,children:[]},{label:"sub1",id:"sub1",direction:"left",expanded:!1,children:[]}]}]};function G(e,t){let n={value:-1/0,path:void 0};function r(e,o){const c=function(e,t){return-F(t,e.coord)}(e,t);c>n.value&&t[0]-e.coord[0]>k&&t[0]-e.coord[0]<100&&(n={value:c,path:[...o,0]}),e.children.filter((e=>!e.dropPreview)).forEach(((e,t)=>r(e,[...o,t])))}return e.children.forEach(((e,t)=>r(e,[t]))),n.path}const J=p(document,"mousemove"),Q=p(document,"mouseup");let Z=[],ee=[];function te(){var n;const[o,c]=t.useState(V),i=t.useMemo((()=>L(o)),[o]),a=t.useRef(),l=m();function s(e){a.current=e,l()}const h=t.useCallback(((t,n,c)=>{const l=function(e,t){return u(N(t),e)}(i,t);J.pipe(f(Q),g((e=>F([e.clientX,e.clientY],c)<10)),b((e=>n(e.clientX,e.clientY)))).pipe(b((e=>{var n;return[e,G(null!=(n=a.current)?n:A(i,t),e)]})),v((([n,r])=>{let c=A(o,t);r&&(c=U(c,r,e(e({},l),{children:[],dropPreview:!0,root:void 0}))),s(e(e({},L(c)),{dragSource:e(e({},l),{coord:n,children:[]}),dropTarget:r}))})),E(),x()).subscribe((n=>{"N"===n.kind&&p((o=>{const c=A(o,t),[,i]=n.value;return i?U(c,i,l):r(C("children"),d(e(e({},a.current.dragSource),{root:!0})),c)})),s(void 0)}))}),[o]),p=e=>(Z.push(o),ee=[],c(e));return t.createElement(y.Provider,{value:{canvas:o,setCanvas:p}},t.createElement(M.Provider,{value:{startDragging:h}},t.createElement("div",{className:"App"},t.createElement("button",{onClick:function(){const e=Z.pop();e&&(ee.push(o),c(e))}},"undo"),t.createElement("button",{onClick:function(){const e=ee.pop();e&&(Z.push(o),c(e))}},"redo"),t.createElement(q,{canvas:null!=(n=a.current)?n:i}))))}w.render(t.createElement(t.StrictMode,null,t.createElement(te,null)),document.getElementById("root"));
