var e=Object.assign;import{r as t,f as n,s as r,o,l as c,i,a,b as d,c as l,d as s,p as u,e as p,t as h,g as f,h as m,j as g,k as b,u as x,m as v,n as w,q as E,v as C,w as y,x as k}from"./vendor.a3ac9ed0.js";!function(e=".",t="__import__"){try{self[t]=new Function("u","return import(u)")}catch(n){const r=new URL(e,location),o=e=>{URL.revokeObjectURL(e.src),e.remove()};self[t]=e=>new Promise(((n,c)=>{const i=new URL(e,r);if(self[t].moduleMap[i])return n(self[t].moduleMap[i]);const a=new Blob([`import * as m from '${i}';`,`${t}.moduleMap['${i}']=m;`],{type:"text/javascript"}),d=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(a),onerror(){c(new Error(`Failed to import: ${e}`)),o(d)},onload(){n(self[t].moduleMap[i]),o(d)}});document.head.appendChild(d)})),self[t].moduleMap={}}}("/tsmind/assets/");const M=t.createContext({canvas:null,setCanvas:e=>{}});function R(t={}){const{label:n="New Node",direction:r="right"}=t;return e({root:t.root,id:Math.random().toString(36).slice(2),label:n,direction:r,expanded:!0,children:[]},t.root?{coord:t.coord}:{})}const S=t.createContext({startDragging:()=>{}});n(document,"mousedown");const z=n(document,"mousemove"),$=n(document,"mouseup"),D=20,N=20,P=10,B=5,j=5;function O(t){return e({position:"absolute",padding:`${B}px ${P}px`,border:"1px solid black",boxSizing:"border-box",borderRadius:"5px",backgroundColor:"white"},t.fixedWidth?{maxWidth:`${t.fixedWidth}px`,width:`${t.fixedWidth}px`,overflowWrap:"break-word",whiteSpace:"break-spaces"}:{whiteSpace:"nowrap"})}const W=new WeakMap;function F(t){if(W.has(t))return W.get(t);const n=new DocumentFragment;const o=function t(r){const o=r.children.map(r.expanded?t:function t(n){return e(e({coord:[0,0]},n),{children:n.children.map(t),size:()=>[0,0]})}),c=function(e){const t=document.createElement("span");return t.setAttribute("style","visibility: hidden;"),Object.assign(t.style,O(e)),t.innerText=e.label,n.appendChild(t),t}(r);return e(e({coord:[0,0]},r),{children:o,size:()=>{const{width:e,height:t}=c.getBoundingClientRect(),n=[e,t];return c.remove(),n}})}(t);document.body.appendChild(n);const c=function t(n){const o=n.children.map(n.expanded?t:function t(n){return e(e({},n),{size:n.size(),height:0,children:n.children.map(t)})}),c=n.size(),i=Math.max(c[1],D*(o.length-1)+r(o,"height"));return e(e({},n),{size:c,height:i,children:o})}(o);return W.set(t,c),c}function L(t){const n=n=>function(t,n){return function t(r){let o=0;if(!r.expanded)return r;for(const e of r.children)e.coord=[r.coord[0]+(r.size[0]/2+N+e.size[0]/2)*("left"===n?-1:1),r.coord[1]+o-r.height/2+e.height/2],o+=e.height+D;return e(e({},r),{children:r.children.map(t)})}(F(t))}(e(e({},t),{children:t.children.filter((e=>e.direction===n))}),n),r=n("right");return e(e({},r),{children:r.children.concat(n("left").children)})}function X(e){return{children:e.children.map(L)}}function A(e){return a(e,(e=>["children",e]))}function T(e){return t=A(e),[d(t),l(t)];var t}function U(e,t,n){return o(c(A(t)),n,e)}function I(e,t,n){const[r,a]=T(t);return o(c(r),i(a,n),e)}function Y(e,t,n){return U(e,t,(()=>n))}function _(e,t){const[n,r]=T(t);return o(c(n),p(r,1),e)}function q(e,t){return[e[0]-t[0],e[1]-t[1]]}function H(e,t){const n=q(e,t);return Math.abs(n[0])+Math.abs(n[1])}const K=function(e,t){return[e[0]+t[0],e[1]+t[1]]};function V(e){return`${e[0]},${e[1]}`}const G=t.memo((function(e){const{a:n,b:r}=e,o=Math.min(n[1],r[1]),c=Math.min(n[0],r[0]),i=Math.max(Math.abs(n[0]-r[0]),1),a=Math.max(Math.abs(n[1]-r[1]),1),d=[c,o],l=[r[0]-c,n[1]-o],s=[n[0]-c,r[1]-o];return t.createElement("svg",{viewBox:`0 0 ${i} ${a}`,style:{position:"absolute",zIndex:-1,top:o,left:c,width:i,height:a}},t.createElement("path",{d:`M${V(q(n,d))} C${V(l)} ${V(s)} ${V(q(r,d))}`,fill:"transparent",stroke:"black"}))})),J=function(e){const[n,r]=t.useState(!1);return t.createElement("span",{style:{opacity:Number(!e.expanded||n),position:"absolute",left:e.coord[0],top:e.coord[1],fontSize:"0.8rem",transform:"translate(-50%, -50%)",border:"solid 1px black",borderRadius:"1000px",width:"12px",height:"12px",backgroundColor:n?"gray":"white",lineHeight:"12px",textAlign:"center",userSelect:"none",cursor:"pointer",transition:n?"opacity .3s ease":""},onClick:e.toggle,onMouseOver:()=>r(!0),onMouseOut:()=>r(!1)},e.expanded?"-":e.count)},Q=t.memo((function(e){const{parent:n}=e,{children:r}=n,o=n.root||!n.children.length?n.coord:[n.coord[0]+n.size[0]/2+10,n.coord[1]];return t.createElement(t.Fragment,null,n.root||t.createElement(t.Fragment,null,t.createElement(G,{a:n.coord,b:o}),t.createElement(J,{coord:o,expanded:n.expanded,count:n.children.length,toggle:e.toggle})),n.expanded&&r.map(((e,n)=>t.createElement(G,{key:n,a:o,b:K(e.coord,[(j-e.size[0]/2)*("left"===e.direction?-1:1),0])}))))})),Z=new Set,ee=t.memo((function(n){const{node:r,editing:o}=n,[c,i]=t.useState(r.label.length),a=t.useRef(null);return t.useLayoutEffect((()=>{const e=document.getSelection();if(o&&e&&a.current){const t=new Range,n=Array.from(a.current.childNodes).find((e=>e.nodeValue));n&&(null==t||t.setStart(n,c),null==t||t.setEnd(n,c),e.removeAllRanges(),e.addRange(t))}}),[c,o]),t.createElement("div",{ref:a,className:"editor",contentEditable:o,suppressContentEditableWarning:!0,onBlur:n.onBlur,onInput:t=>{var o,c;i(null!=(c=null==(o=window.getSelection())?void 0:o.getRangeAt(0).startOffset)?c:0),n.onChange(e(e({},r),{label:t.currentTarget.innerText}))}},r.label||" ")})),te=t.memo((function(n){let{node:r,path:i,getCoord:a}=n;const[d,l]=t.useState(Z.has(r.id)),u=t.useCallback((()=>l(!1)),[]),{canvas:p,setCanvas:f}=t.useContext(M),{startDragging:m}=t.useContext(S),g=t.useRef(null);function b(e){f(Y(p,i,e))}function x(){const t=R({direction:r.direction});Z.add(t.id);const n=Y(p,i,e(e({},r),{expanded:!0}));f(function(e,t,n){return o(c(A(t).concat("children")),s(n),e)}(n,i,t))}t.useEffect((()=>{Z.delete(r.id)}),[]),r=e(e({},r),{expanded:r.expanded||r.children.some((e=>e.dropPreview))});const[v,w]=q(r.coord,(E=r.size,C=.5,[E[0]*C,E[1]*C]));var E,C;const y=e(e({},O(r)),{display:"flex",alignItems:"center",top:w,left:v,width:r.size[0],height:r.size[1]});return t.createElement(t.Fragment,null,t.createElement(Q,{parent:r,toggle:()=>{b(e(e({},r),{expanded:!r.expanded}))}}),r.expanded&&r.children.map(((e,n)=>t.createElement("div",{key:e.id,className:e.dropPreview?"drop-preview":""},t.createElement(te,{getCoord:a,node:e,path:[...i,n]})))),t.createElement("div",{ref:g,className:"node-wrap node",style:y,onKeyDown:e=>{if("Enter"===e.key)if(e.preventDefault(),d)l(!1),g.current.focus();else{if(function(e){return!!e.root}(r))return x();const e=R();Z.add(e.id),f(I(p,i,e))}else"Tab"===e.key&&(e.preventDefault(),l(!1),x())},tabIndex:-1,onMouseDown:e=>{if(d)return;const t=q(r.coord,a(e.clientX,e.clientY));m(n.path,((e,n)=>K(a(e,n),t)),[e.clientX,e.clientY])},onDoubleClick:e=>{d||(e.stopPropagation(),d||l(!0))}},t.createElement("div",{className:"resizer",onMouseDown:t=>{t.stopPropagation();const n=t.clientX,o=g.current.getBoundingClientRect().width;z.pipe(h($)).subscribe((t=>{const c=o+t.clientX-n;c<10||f((t=>Y(t,i,e(e({},r),{fixedWidth:c}))))}))}}),t.createElement(ee,{editing:d,node:r,onBlur:u,onChange:b})))}));function ne(e){const{canvas:n}=e,{setCanvas:r}=t.useContext(M),i=t.useRef(null),a=t.useCallback(((e,t)=>{const{left:n,top:r}=i.current.getBoundingClientRect();return[e-n-300,t-r-300]}),[]);return t.createElement("div",{ref:i,style:{width:600,height:600},onMouseDown:e=>{e.detail>1&&e.preventDefault()},onDoubleClick:e=>{e.target===i.current&&(e.preventDefault(),r(o(c(["children"]),s(R({root:!0,label:"Free Node",coord:a(e.clientX,e.clientY)})))))}},t.createElement("div",{style:{transform:"translate(300px, 300px)"}},n.children.map(((e,n)=>t.createElement(te,{key:e.id,node:e,path:[n],getCoord:a}))),n.dragSource&&!n.dropTarget&&t.createElement(te,{node:n.dragSource,path:[],getCoord:a})))}const re={children:[{label:"Root",id:"root",expanded:!0,direction:"right",root:!0,coord:[0,0],children:[{label:"sup2",id:"sub2",direction:"right",expanded:!1,children:[{label:"sub4",id:"sub4",direction:"right",expanded:!1,children:[]},{label:"sub3",id:"sub3",direction:"right",expanded:!1,children:[]}]},{label:"sub5",id:"sub5",direction:"right",expanded:!1,children:[]},{label:"sub1",id:"sub1",direction:"left",expanded:!1,children:[]}]}]};function oe(e,t){let n={value:-1/0,path:void 0};function r(e,o){const c=function(e,t){return-H(t,e.coord)}(e,t);c>n.value&&t[0]-e.coord[0]>N&&t[0]-e.coord[0]<100&&(n={value:c,path:[...o,0]}),e.children.filter((e=>!e.dropPreview)).forEach(((e,t)=>r(e,[...o,t])))}return e.children.filter((e=>!e.dropPreview)).forEach(((e,t)=>r(e,[t]))),n.path}let ce=[],ie=[];function ae(){var n;const r=t.useRef(re),c=t.useMemo((()=>X(r.current)),[r.current]),i=t.useRef(),a=x();function l(e){r.current="function"==typeof e?e(r.current):e,a()}function p(e){i.current=e,a()}const k=t.useCallback(((t,n,a)=>{const l=function(e,t){return u(A(t),e)}(c,t);z.pipe(h($),v((e=>H([e.clientX,e.clientY],a)<10)),w((e=>n(e.clientX,e.clientY)))).pipe(((...e)=>t=>f(t.pipe(g(1),b(...e)),t.pipe(m(1))))((()=>{i.current=_(c,t),r.current=_(r.current,t)})),w((e=>[e,oe(i.current,e)])),b((([t,n])=>{var o;n&&(r.current=U(r.current,d(n),(o=!0,t=>e(e({},t),{expanded:null!=o?o:!t.expanded}))));let c=r.current;n&&(c=I(c,n,e(e({},l),{children:[],dropPreview:!0,root:void 0}))),p(e(e({},X(c)),{dragSource:e(e({},l),{coord:t,children:[]}),dropTarget:n}))})),E(),C()).subscribe((t=>{"N"===t.kind&&R((n=>{let r=n;const[,c]=t.value;return c?(r=U(r,d(c),(t=>e(e({},t),{expanded:!0}))),I(r,c,l)):o(y("children"),s(e(e({},l),{coord:i.current.dragSource.coord,root:!0})),r)})),p(void 0)}))}),[r.current]),R=e=>(ce.push(r.current),ie=[],l(e));return t.createElement(M.Provider,{value:{canvas:r.current,setCanvas:R}},t.createElement(S.Provider,{value:{startDragging:k}},t.createElement("div",{className:"App"},t.createElement("button",{onClick:function(){const e=ce.pop();e&&(ie.push(r.current),l(e))}},"undo"),t.createElement("button",{onClick:function(){const e=ie.pop();e&&(ce.push(r.current),l(e))}},"redo"),t.createElement(ne,{canvas:null!=(n=i.current)?n:c}))))}k.render(t.createElement(t.StrictMode,null,t.createElement(ae,null)),document.getElementById("root"));
