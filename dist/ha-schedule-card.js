function t(t,e,i,s){var o,r=arguments.length,n=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,i,n):o(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:u,getPrototypeOf:_}=Object,p=globalThis,f=p.trustedTypes,m=f?f.emptyScript:"",y=p.reactiveElementPolyfillSupport,v=(t,e)=>t,g={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},w=(t,e)=>!c(t,e),b={attribute:!0,type:String,converter:g,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);o?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=_(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...h(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:g).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:g;this._$Em=s;const r=o.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const r=this.constructor;if(!1===s&&(o=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??w)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[v("elementProperties")]=new Map,$[v("finalized")]=new Map,y?.({ReactiveElement:$}),(p.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,k=t=>t,A=x.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+C,P=`<${T}>`,L=document,M=()=>L.createComment(""),N=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,D="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,R=/>/g,z=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,j=/"/g,B=/^(?:script|style|textarea|title)$/i,W=(t,...e)=>({_$litType$:1,strings:t,values:e}),V=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),q=new WeakMap,Y=L.createTreeWalker(L,129);function K(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,s=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=U;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(n.lastIndex=d,c=n.exec(i),null!==c);)d=n.lastIndex,n===U?"!--"===c[1]?n=H:void 0!==c[1]?n=R:void 0!==c[2]?(B.test(c[2])&&(o=RegExp("</"+c[2],"g")),n=z):void 0!==c[3]&&(n=z):n===z?">"===c[0]?(n=o??U,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,a=c[1],n=void 0===c[3]?z:'"'===c[3]?j:I):n===j||n===I?n=z:n===H||n===R?n=U:(n=z,o=void 0);const h=n===z&&t[e+1].startsWith("/>")?" ":"";r+=n===U?i+P:l>=0?(s.push(a),i.slice(0,l)+E+i.slice(l)+C+h):i+C+(-2===l?e:h)}return[K(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[c,l]=X(t,e);if(this.el=Z.createElement(c,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=Y.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=l[r++],i=s.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?et:"?"===n[1]?it:"@"===n[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),Y.nextNode(),a.push({type:2,index:++o});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===T)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:o}),t+=C.length-1}o++}}static createElement(t,e){const i=L.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,s){if(e===V)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const r=N(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=J(t,o._$AS(t,e.values),o,s)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??L).importNode(e,!0);Y.currentNode=s;let o=Y.nextNode(),r=0,n=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ot(o,this,t)),this._$AV.push(e),a=i[++n]}r!==a?.index&&(o=Y.nextNode(),r++)}return Y.currentNode=L,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),N(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&N(this._$AH)?this._$AA.nextSibling.data=t:this.T(L.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new G(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new Z(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new Q(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,s){const o=this.strings;let r=!1;if(void 0===o)t=J(this,t,e,0),r=!N(t)||t!==this._$AH&&t!==V,r&&(this._$AH=t);else{const s=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=J(this,s[i+n],e,n),a===V&&(a=this._$AH[n]),r||=!N(a)||a!==this._$AH[n],a===F?t=F:t!==F&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class st extends tt{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??F)===V)return;const i=this._$AH,s=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}let ot=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}};const rt=x.litHtmlPolyfillSupport;rt?.(Z,Q),(x.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;let at=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new Q(e.insertBefore(M(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}};at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const ct=nt.litElementPolyfillSupport;ct?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");const lt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},dt={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:w},ht=(t=dt,e,i)=>{const{kind:s,metadata:o}=i;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function ut(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function _t(t){return ut({...t,state:!0,attribute:!1})}const pt=t=>(...e)=>({_$litDirective$:t,values:e});let ft=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const mt=pt(class extends ft{constructor(t){if(super(t),1!==t.type||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const s=!!e[t];s===this.st.has(t)||this.nt?.has(t)||(s?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return V}}),yt="important",vt=" !"+yt,gt=pt(class extends ft{constructor(t){if(super(t),1!==t.type||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(vt);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?yt:""):i[t]=s}}return V}});var wt,bt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(wt||(wt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(bt||(bt={}));var $t=["closed","locked","off"],xt=function(t,e,i,s){s=s||{},i=i??{};var o=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return o.detail=i,t.dispatchEvent(o),o},kt=function(t){xt(window,"haptic",t)};function At(t){return void 0!==t&&"none"!==t.action}const St="ha-schedule-card",Et="ha-schedule-card-editor",Ct=1440,Tt=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],Pt=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];function Lt(t){return Pt[t.getDay()]}function Mt(t){if(!t)return 0;if("24:00:00"===t||"24:00"===t)return Ct;const e=t.split(":"),i=Number(e[0]??0),s=Number(e[1]??0);return Number.isFinite(i)&&Number.isFinite(s)?Math.min(Ct,Math.max(0,60*i+s)):0}function Nt(t){return Math.max(0,Math.min(Ct,t))/Ct*100}function Ot(t){if(!t?.length)return[];const e=[...t].map(t=>({...t,_f:Mt(t.from),_t:Mt(t.to)})).sort((t,e)=>t._f-e._f),i=[];let s={...e[0]};for(let t=1;t<e.length;t++){const o=e[t];o._f<=s._t?o._t>s._t&&(s._t=o._t,s.to=o.to):(i.push({from:s.from,to:s.to,data:s.data}),s={...o})}return i.push({from:s.from,to:s.to,data:s.data}),i}function Dt(t){if(!t)return"";if("24:00:00"===t)return"24:00";const[e="00",i="00"]=t.split(":");return`${e.padStart(2,"0")}:${i.padStart(2,"0")}`}function Ut(t){const e=Mt(t.from),i=Mt(t.to),s=Nt(e);return{fromMin:e,toMin:i,leftPct:s,widthPct:Math.max(0,Nt(i)-s),fromLabel:Dt(t.from),toLabel:Dt(t.to)}}function Ht(t,e,i,s=new Date){return e&&t?.states?.[e]?.state?"on"===t.states[e].state:!!i&&function(t,e){if(!t?.length)return!1;const i=60*e.getHours()+e.getMinutes();return t.some(t=>{const e=Mt(t.from),s=Mt(t.to);return i>=e&&i<s})}(i[Lt(s)],s)}function Rt(t=new Date){return(60*t.getHours()+t.getMinutes()+t.getSeconds()/60)/1440*100}const zt=n`
  :host {
    --hsc-active-color: var(--card-active-color, var(--primary-color));
    --hsc-inactive-color: var(--card-inactive-color, var(--divider-color));
    --hsc-now-color: var(--card-now-color, var(--error-color));
    --hsc-text-color: var(--primary-text-color);
    --hsc-text-secondary: var(--secondary-text-color);
    --hsc-radius: 6px;
    --hsc-gap: 8px;
    display: block;
    container-type: inline-size;
  }

  ha-card {
    display: block;
    overflow: hidden;
  }

  .root {
    padding: var(--hsc-padding, 12px 16px);
    color: var(--hsc-text-color);
  }

  .root.compact {
    padding: 8px 12px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: var(--hsc-gap);
    margin-bottom: 8px;
  }

  .header__icon {
    --mdc-icon-size: 24px;
    color: var(--hsc-active-color);
    flex-shrink: 0;
  }

  .header__title {
    font-size: var(--ha-card-header-font-size, 1.1rem);
    font-weight: 500;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .header__badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.78rem;
    background: var(--hsc-inactive-color);
    color: var(--primary-text-color);
    flex-shrink: 0;
  }

  .header__badge.is-on {
    background: var(--hsc-active-color);
    color: var(--text-primary-color, #fff);
  }

  .next-event {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    color: var(--hsc-text-secondary);
    margin: 4px 0 8px;
  }

  .next-event ha-icon {
    --mdc-icon-size: 16px;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 8px;
    font-size: 0.75rem;
    color: var(--hsc-text-secondary);
  }

  .legend__item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .legend__swatch {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    display: inline-block;
  }

  .legend__swatch.is-active {
    background: var(--hsc-active-color);
  }

  .legend__swatch.is-inactive {
    background: var(--hsc-inactive-color);
  }

  .legend__swatch.is-now {
    background: var(--hsc-now-color);
  }

  .view-switch {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-inline-start: auto;
  }

  .view-switch button {
    background: transparent;
    border: 1px solid var(--divider-color);
    border-radius: var(--hsc-radius);
    color: var(--hsc-text-color);
    padding: 2px 8px;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .view-switch button[aria-pressed="true"] {
    background: var(--hsc-active-color);
    color: var(--text-primary-color, #fff);
    border-color: transparent;
  }

  .error {
    padding: 16px;
    color: var(--error-color);
  }

  /* === RTL refinements === */
  :host([dir="rtl"]) .view-switch ha-icon-button ha-icon,
  :host([dir="rtl"]) .day-nav__prev ha-icon,
  :host([dir="rtl"]) .day-nav__next ha-icon {
    transform: scaleX(-1);
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }

  /* Container queries — collapse less-important UI on narrow cards */
  @container (max-width: 360px) {
    .header__title {
      font-size: 1rem;
    }
    .legend {
      gap: 8px;
    }
  }
`,It={en:{common:{on:"On",off:"Off",loading:"Loading…",error_no_entity:"Entity not found",error_pick_schedule:"Please select a schedule entity",error_not_a_schedule:"The selected entity is not a schedule.* entity",error_invalid_config:"Invalid card configuration",error_loading_timeout:"Loading took too long — try again.",empty_pick_entity:"No schedule selected",empty_pick_entity_hint:"Open the card editor and choose a schedule.* entity.",error_ws_failed:"Failed to load the schedule from Home Assistant: {message}",retry:"Retry",now:"Now"},header:{state_on:"Active",state_off:"Inactive",next_event:"Next event",until:"Until {time}",from:"From {time}",starts_in:"Starts in {duration}",ends_in:"Ends in {duration}",no_blocks_today:"No blocks scheduled today"},days:{short:{sunday:"Sun",monday:"Mon",tuesday:"Tue",wednesday:"Wed",thursday:"Thu",friday:"Fri",saturday:"Sat"},long:{sunday:"Sunday",monday:"Monday",tuesday:"Tuesday",wednesday:"Wednesday",thursday:"Thursday",friday:"Friday",saturday:"Saturday"},today:"Today",yesterday:"Yesterday",tomorrow:"Tomorrow"},view:{daily:"Daily",weekly:"Weekly",switch_to_daily:"Switch to daily view",switch_to_weekly:"Switch to weekly view"},layout:{full:"Full",compact:"Compact"},legend:{active:"Active",inactive:"Inactive",current_time:"Current time"},nav:{previous_day:"Previous day",next_day:"Next day"},blocks:{title:"Today's blocks",title_for_day:"Blocks for {day}"},a11y:{active_block:"Active block from {from} to {to}",inactive_block:"Inactive from {from} to {to}",day_column:"{day}, {count} active blocks",now_marker:"Current time: {time}",timeline_region:"24-hour schedule timeline",week_region:"Weekly schedule grid"},editor:{sections:{display_options:{title:"Display options"},appearance:{title:"Appearance"},actions:{title:"Actions (Tap / Hold)"}},fields:{entity:{label:"Schedule entity",helper:"Select a schedule.* entity"},title:{label:"Title override"},view:{label:"View",options:{daily:"Daily",weekly:"Weekly"}},layout:{label:"Layout",options:{full:"Full",compact:"Compact"}},show_header:{label:"Show header"},show_state:{label:"Show current state badge"},show_next_event:{label:"Show next event"},show_legend:{label:"Show legend"},allow_view_switch:{label:"Show view-switch toggle on the card"},first_day_of_week:{label:"First day of the week",options:{sunday:"Sunday",monday:"Monday"}},time_format:{label:"Time format",options:{auto:"Auto (follow HA settings)","24h":"24-hour","12h":"12-hour (AM/PM)"}},active_color:{label:"Active block color"},inactive_color:{label:"Inactive block color"},current_time_color:{label:"Current time marker color"},tap_action:{label:"Tap action"},hold_action:{label:"Hold action"},double_tap_action:{label:"Double-tap action"}}}},he:{common:{on:"פעיל",off:"כבוי",loading:"טוען…",error_no_entity:"הישות לא נמצאה",error_pick_schedule:"יש לבחור ישות לוח-זמנים",error_not_a_schedule:"הישות שנבחרה אינה ישות schedule.",error_invalid_config:"הגדרת הכרטיס אינה תקינה",error_loading_timeout:"הטעינה ארכה זמן רב — נסו שוב.",empty_pick_entity:"לא נבחר לוח-זמנים",empty_pick_entity_hint:"פתחו את עריכת הכרטיס ובחרו ישות מסוג schedule.",error_ws_failed:"טעינת לוח-הזמנים מ-Home Assistant נכשלה: {message}",retry:"נסה שוב",now:"עכשיו"},header:{state_on:"פעיל",state_off:"לא פעיל",next_event:"האירוע הבא",until:"עד {time}",from:"החל מ-{time}",starts_in:"מתחיל בעוד {duration}",ends_in:"מסתיים בעוד {duration}",no_blocks_today:"אין בלוקים מתוזמנים להיום"},days:{short:{sunday:"א׳",monday:"ב׳",tuesday:"ג׳",wednesday:"ד׳",thursday:"ה׳",friday:"ו׳",saturday:"ש׳"},long:{sunday:"ראשון",monday:"שני",tuesday:"שלישי",wednesday:"רביעי",thursday:"חמישי",friday:"שישי",saturday:"שבת"},today:"היום",yesterday:"אתמול",tomorrow:"מחר"},view:{daily:"יומית",weekly:"שבועית",switch_to_daily:"מעבר לתצוגה יומית",switch_to_weekly:"מעבר לתצוגה שבועית"},layout:{full:"מלאה",compact:"קומפקטית"},legend:{active:"פעיל",inactive:"לא פעיל",current_time:"זמן נוכחי"},nav:{previous_day:"יום קודם",next_day:"יום הבא"},blocks:{title:"בלוקים פעילים היום",title_for_day:"בלוקים ליום {day}"},a11y:{active_block:"בלוק פעיל בין {from} ל-{to}",inactive_block:"לא פעיל בין {from} ל-{to}",day_column:"{day}, {count} בלוקים פעילים",now_marker:"השעה הנוכחית: {time}",timeline_region:"ציר לוח-זמנים של 24 שעות",week_region:"טבלת לוח-זמנים שבועית"},editor:{sections:{display_options:{title:"אפשרויות תצוגה"},appearance:{title:"עיצוב"},actions:{title:"פעולות (לחיצה / לחיצה ארוכה)"}},fields:{entity:{label:"ישות לוח-זמנים",helper:"בחר/י ישות מסוג schedule."},title:{label:"כותרת מותאמת"},view:{label:"תצוגה",options:{daily:"יומית",weekly:"שבועית"}},layout:{label:"פריסה",options:{full:"מלאה",compact:"קומפקטית"}},show_header:{label:"הצגת כותרת"},show_state:{label:"הצגת תווית מצב נוכחי"},show_next_event:{label:"הצגת האירוע הבא"},show_legend:{label:"הצגת מקרא"},allow_view_switch:{label:"כפתור החלפת תצוגה בכרטיס"},first_day_of_week:{label:"יום ראשון בשבוע",options:{sunday:"ראשון",monday:"שני"}},time_format:{label:"פורמט שעה",options:{auto:"אוטומטי (לפי הגדרות HA)","24h":"24 שעות","12h":"12 שעות (AM/PM)"}},active_color:{label:"צבע בלוק פעיל"},inactive_color:{label:"צבע בלוק לא פעיל"},current_time_color:{label:"צבע סמן השעה הנוכחית"},tap_action:{label:"פעולת לחיצה"},hold_action:{label:"פעולת לחיצה ארוכה"},double_tap_action:{label:"פעולת לחיצה כפולה"}}}}},jt="en";function Bt(t,e){return e.split(".").reduce((t,e)=>t&&"object"==typeof t?t[e]:void 0,t)}function Wt(t,e,i,s){const o=function(t){if(!t)return jt;const e=(t.locale?.language??t.language??jt).toLowerCase();if("iw"===e||e.startsWith("he"))return"he";if(e in It)return e;const i=e.split("-")[0];return i in It?i:jt}(t);let r=Bt(It[o],e)??Bt(It[jt],e)??s??e;if(i)for(const[t,e]of Object.entries(i))r=r.replaceAll(`{${t}}`,String(e));return r}function Vt(t,e){return Wt(t,`days.short.${e}`)}function Ft(t,e){return Wt(t,`days.long.${e}`)}const qt=new Set(["ar","he","iw","fa","ur","ps","dv","sd","ug","yi"]);function Yt(t){return function(t){if(!t)return!1;const e=t.translationMetadata?.translations?.[t.language??""];if(e&&"boolean"==typeof e.isRTL)return e.isRTL;const i=(t.locale?.language??t.language??"en").toLowerCase();if(qt.has(i))return!0;const s=i.split("-")[0];return qt.has(s)}(t)?"rtl":"ltr"}function Kt(t){return t?.locale?.language??t?.language??"en"}function Xt(t,e){const i=e?.time_format??"auto";if("24h"===i)return!1;if("12h"===i)return!0;const s=t?.locale?.time_format;if("12"===s)return!0;if("24"===s)return!1;try{return new Intl.DateTimeFormat(Kt(t),{hour:"numeric"}).formatToParts(new Date).some(t=>"dayPeriod"===t.type)}catch{return!1}}function Zt(t,e,i){try{return new Intl.DateTimeFormat(Kt(e),{hour:"2-digit",minute:"2-digit",hour12:Xt(e,i)}).format(t)}catch{return t.toTimeString().slice(0,5)}}function Jt(t,e,i){if(!t)return"";const[s,o="00"]=t.split(":"),r=new Date;return r.setHours(Number(s),Number(o),0,0),"24"===s?"24:00":Zt(r,e,i)}const Gt=(t,e)=>{const i=t._$AN;if(void 0===i)return!1;for(const t of i)t._$AO?.(e,!1),Gt(t,e);return!0},Qt=t=>{let e,i;do{if(void 0===(e=t._$AM))break;i=e._$AN,i.delete(t),t=e}while(0===i?.size)},te=t=>{for(let e;e=t._$AM;t=e){let i=e._$AN;if(void 0===i)e._$AN=i=new Set;else if(i.has(t))break;i.add(t),se(e)}};function ee(t){void 0!==this._$AN?(Qt(this),this._$AM=t,te(this)):this._$AM=t}function ie(t,e=!1,i=0){const s=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(e)if(Array.isArray(s))for(let t=i;t<s.length;t++)Gt(s[t],!1),Qt(s[t]);else null!=s&&(Gt(s,!1),Qt(s));else Gt(this,t)}const se=t=>{2==t.type&&(t._$AP??=ie,t._$AQ??=ee)};class oe extends ft{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,i){super._$AT(t,e,i),te(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(Gt(this,t),Qt(this))}setValue(t){if((()=>void 0===this._$Ct.strings)())this._$Ct._$AI(t,this);else{const e=[...this._$Ct._$AH];e[this._$Ci]=t,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}const re=pt(class extends oe{constructor(t){if(super(t),6!==t.type)throw new Error("actionHandler can only be used on an element binding")}render(t={}){return V}update(t,[e={}]){const i=t.element;return this._element!==i?(this._state?.cleanup(),this._element=i,this._state=function(t,e){const i={options:e,cleanup:()=>{}};let s,o,r=!1,n=0;const a=e=>{t.dispatchEvent(new CustomEvent("action",{detail:{action:e},bubbles:!0,composed:!0}))},c=t=>{i.options.disabled||(r=!1,i.options.hasHold&&(s=window.setTimeout(()=>{r=!0,a("hold")},500)),"touchstart"===t.type&&t.preventDefault?.())},l=()=>{if(!i.options.disabled)if(void 0!==s&&(window.clearTimeout(s),s=void 0),r)r=!1;else if(i.options.hasDoubleClick){const t=Date.now();if(t-n<250)return void 0!==o&&(window.clearTimeout(o),o=void 0),n=0,void a("double_tap");n=t,o=window.setTimeout(()=>{o=void 0,a("tap")},250)}else a("tap")},d=()=>{void 0!==s&&(window.clearTimeout(s),s=void 0),r=!1};return t.addEventListener("mousedown",c),t.addEventListener("touchstart",c,{passive:!1}),t.addEventListener("mouseup",l),t.addEventListener("touchend",l),t.addEventListener("mouseleave",d),t.addEventListener("touchcancel",d),i.cleanup=()=>{t.removeEventListener("mousedown",c),t.removeEventListener("touchstart",c),t.removeEventListener("mouseup",l),t.removeEventListener("touchend",l),t.removeEventListener("mouseleave",d),t.removeEventListener("touchcancel",d),void 0!==s&&window.clearTimeout(s),void 0!==o&&window.clearTimeout(o)},i}(i,e)):this._state&&(this._state.options=e),V}disconnected(){this._state?.cleanup(),this._state=void 0}});var ne;let ae=class extends at{constructor(){super(...arguments),this.blocks=[],this.showScale=!0,this.denseScale=!1}static{ne=this}static{this.RENDER_KEYS=["blocks","nowPercent","showScale","denseScale","heightOverride"]}shouldUpdate(t){for(const e of ne.RENDER_KEYS)if(t.has(e))return!0;return!1}render(){const t=this.denseScale?[0,6,12,18,24]:[0,3,6,9,12,15,18,21,24];return W`
      <div
        class="bar"
        style=${this.heightOverride?gt({height:this.heightOverride}):F}
        role="img"
        aria-label=${Wt(this.hass,"a11y.timeline_region")}
      >
        <div class="bar__inactive" aria-hidden="true"></div>
        ${this.blocks.map(t=>this._renderBlock(t))}
        ${void 0!==this.nowPercent?this._renderNow(this.nowPercent):F}
      </div>
      ${this.showScale?this._renderScale(t):F}
    `}_renderBlock(t){const e=Ut(t);if(e.widthPct<=0)return F;const i=Wt(this.hass,"a11y.active_block",{from:e.fromLabel,to:e.toLabel});return W`
      <div
        class="bar__block"
        style=${gt({insetInlineStart:`${e.leftPct}%`,width:`${e.widthPct}%`})}
        title=${`${e.fromLabel} – ${e.toLabel}`}
        role="img"
        aria-label=${i}
      ></div>
    `}_renderNow(t){const e=Math.max(0,Math.min(100,t)),i=new Date,s=Wt(this.hass,"a11y.now_marker",{time:Jt(`${i.getHours()}:${i.getMinutes()}`,this.hass)});return W`
      <div
        class="bar__now"
        style=${gt({insetInlineStart:`${e}%`})}
        role="img"
        aria-label=${s}
      ></div>
    `}_renderScale(t){return W`
      <div class="scale" aria-hidden="true">
        ${t.map(t=>{const e=Nt(60*t);return W`
            <span
              class=${mt({scale__tick:!0,"scale__tick--edge":0===t||24===t})}
              style=${gt({insetInlineStart:`${e}%`})}
              >${String(t).padStart(2,"0")}</span
            >
          `})}
      </div>
    `}static{this.styles=n`
    :host {
      display: block;
      direction: ltr; /* timeline geometry is always LTR */
      unicode-bidi: isolate;
      width: 100%;
    }

    .bar {
      position: relative;
      width: 100%;
      height: var(--hsc-bar-height, 36px);
      border-radius: var(--hsc-radius, 6px);
      overflow: hidden;
      background: transparent;
    }

    .bar__inactive {
      position: absolute;
      inset: 0;
      background: var(--hsc-inactive-color);
      opacity: 0.45;
    }

    .bar__block {
      position: absolute;
      top: 0;
      bottom: 0;
      background: var(--hsc-active-color);
      border-radius: 2px;
      transition: background 200ms ease;
    }

    .bar__now {
      position: absolute;
      top: -2px;
      bottom: -2px;
      width: 2px;
      background: var(--hsc-now-color);
      box-shadow: 0 0 4px var(--hsc-now-color);
      pointer-events: none;
      z-index: 2;
    }

    .scale {
      position: relative;
      width: 100%;
      height: 14px;
      margin-top: 2px;
      font-size: 0.65rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
    }

    .scale__tick {
      position: absolute;
      top: 0;
      transform: translateX(-50%);
      white-space: nowrap;
    }

    .scale__tick--edge {
      font-weight: 600;
    }

    @container (max-width: 360px) {
      .scale__tick {
        font-size: 0.6rem;
      }
    }
  `}};var ce;t([ut({attribute:!1})],ae.prototype,"hass",void 0),t([ut({attribute:!1})],ae.prototype,"blocks",void 0),t([ut({type:Number,attribute:"now-percent"})],ae.prototype,"nowPercent",void 0),t([ut({type:Boolean,attribute:"show-scale"})],ae.prototype,"showScale",void 0),t([ut({type:Boolean,attribute:"dense-scale"})],ae.prototype,"denseScale",void 0),t([ut({type:String,attribute:"height"})],ae.prototype,"heightOverride",void 0),ae=ne=t([lt("hsc-timeline-bar")],ae);let le=class extends at{constructor(){super(...arguments),this.layout="full",this.nowTick=0,this._offset=0}static{ce=this}static{this.RENDER_KEYS=["schedule","config","nowTick","_offset","layout","entityState"]}shouldUpdate(t){for(const e of ce.RENDER_KEYS)if(t.has(e))return!0;return!1}_displayedDate(){const t=new Date;return t.setDate(t.getDate()+this._offset),t}_displayedWeekday(){return Lt(this._displayedDate())}render(){const t=this._displayedDate(),e=this._displayedWeekday(),i=0===this._offset,s=Ot(this.schedule[e]??[]);return"compact"===this.layout?this._renderCompact(s,i):W`
      <div class="daily">
        ${this._renderDayNav(t,i)}
        <hsc-timeline-bar
          .hass=${this.hass}
          .blocks=${s}
          .nowPercent=${i?Rt():void 0}
          show-scale
        ></hsc-timeline-bar>
        ${this._renderBlocksList(s,e)}
      </div>
    `}_renderCompact(t,e){return W`
      <hsc-timeline-bar
        .hass=${this.hass}
        .blocks=${t}
        .nowPercent=${e?Rt():void 0}
        ?show-scale=${!1}
        height="20px"
      ></hsc-timeline-bar>
    `}_renderDayNav(t,e){const i=function(t,e){try{return new Intl.DateTimeFormat(Kt(e),{weekday:"long",day:"numeric",month:"long"}).format(t)}catch{return t.toDateString()}}(t,this.hass);return W`
      <div class="day-nav" role="group" aria-label=${Wt(this.hass,"view.daily")}>
        <button
          class="day-nav__prev"
          type="button"
          @click=${()=>this._shift(-1)}
          aria-label=${Wt(this.hass,"nav.previous_day")}
        >
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <span class="day-nav__title">
          ${e?W`<strong>${Wt(this.hass,"days.today")}</strong> · `:F}${i}
        </span>
        <button
          class="day-nav__next"
          type="button"
          @click=${()=>this._shift(1)}
          aria-label=${Wt(this.hass,"nav.next_day")}
        >
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>
      </div>
    `}_renderBlocksList(t,e){if(!t.length)return W`<div class="empty">${Wt(this.hass,"header.no_blocks_today")}</div>`;const i=60*(s=new Date).getHours()+s.getMinutes();var s;const o=0===this._offset;return W`
      <div class="blocks">
        <div class="blocks__title">
          ${o?Wt(this.hass,"blocks.title"):Wt(this.hass,"blocks.title_for_day",{day:Ft(this.hass,e)})}
        </div>
        <ul class="blocks__list">
          ${t.map(t=>{const e=Ut(t),s=o&&i>=e.fromMin&&i<e.toMin;return W`
              <li class="blocks__row ${s?"is-now":""}">
                <span class="blocks__dot" aria-hidden="true"></span>
                <span class="blocks__time"
                  >${Jt(e.fromLabel,this.hass,this.config)} –
                  ${Jt(e.toLabel,this.hass,this.config)}</span
                >
              </li>
            `})}
        </ul>
      </div>
    `}_shift(t){this._offset+=t}static{this.styles=n`
    :host {
      display: block;
    }
    .daily {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .day-nav {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.9rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
    }
    .day-nav__title {
      flex: 1;
      text-align: center;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .day-nav button {
      background: transparent;
      border: none;
      color: inherit;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .day-nav button:hover {
      background: var(--divider-color);
    }
    .day-nav button:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .day-nav ha-icon {
      --mdc-icon-size: 20px;
    }
    .empty {
      font-size: 0.85rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
      text-align: center;
      padding: 8px 0;
    }
    .blocks__title {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
      margin-bottom: 4px;
    }
    .blocks__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 4px 12px;
    }
    .blocks__row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
    }
    .blocks__row.is-now {
      color: var(--hsc-now-color, var(--error-color));
      font-weight: 600;
    }
    .blocks__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--hsc-active-color, var(--primary-color));
      flex-shrink: 0;
    }
    .blocks__row.is-now .blocks__dot {
      background: var(--hsc-now-color, var(--error-color));
    }

    @container (max-width: 380px) {
      .blocks__title {
        font-size: 0.75rem;
      }
      .blocks__row {
        font-size: 0.8rem;
      }
    }
  `}};var de;t([ut({attribute:!1})],le.prototype,"hass",void 0),t([ut({attribute:!1})],le.prototype,"config",void 0),t([ut({attribute:!1})],le.prototype,"schedule",void 0),t([ut({type:String})],le.prototype,"layout",void 0),t([ut({attribute:!1})],le.prototype,"nowTick",void 0),t([ut({attribute:!1})],le.prototype,"entityState",void 0),t([_t()],le.prototype,"_offset",void 0),le=ce=t([lt("hsc-daily-view")],le);let he=class extends at{constructor(){super(...arguments),this.layout="full",this.nowTick=0}static{de=this}static{this.RENDER_KEYS=["schedule","config","nowTick","layout","entityState"]}shouldUpdate(t){for(const e of de.RENDER_KEYS)if(t.has(e))return!0;return!1}_days(){return function(t="sunday"){const e="monday"===t?1:0;return[...Pt.slice(e),...Pt.slice(0,e)]}(this.config.first_day_of_week??"sunday")}render(){return"compact"===this.layout?this._renderCompact():this._renderFull()}_renderFull(){const t=Lt(new Date),e=this._days(),i=Rt();return W`
      <div class="week-full" role="grid" aria-label=${Wt(this.hass,"a11y.week_region")}>
        <div class="week-full__axis" aria-hidden="true">
          ${[0,6,12,18,24].map(t=>W`
              <span
                class="week-full__axis-tick"
                style=${gt({insetBlockStart:t/24*100+"%"})}
                >${String(t).padStart(2,"0")}</span
              >
            `)}
        </div>
        <div class="week-full__cols">
          ${e.map(e=>this._renderColumn(e,e===t,i))}
        </div>
      </div>
    `}_renderColumn(t,e,i){const s=Ot(this.schedule[t]??[]),o=Wt(this.hass,"a11y.day_column",{day:Vt(this.hass,t),count:s.length});return W`
      <div
        class=${mt({"week-full__col":!0,"is-today":e})}
        role="gridcell"
        aria-label=${o}
      >
        <div class="week-full__day-label">${Vt(this.hass,t)}</div>
        <div class="week-full__col-bar">
          <div class="week-full__inactive" aria-hidden="true"></div>
          ${s.map(t=>this._renderVerticalBlock(t))}
          ${e?W`
                <div
                  class="week-full__now"
                  style=${gt({insetBlockStart:`${i}%`})}
                  aria-hidden="true"
                ></div>
              `:F}
        </div>
      </div>
    `}_renderVerticalBlock(t){const e=Ut(t);return e.widthPct<=0?F:W`
      <div
        class="week-full__block"
        style=${gt({insetBlockStart:`${e.leftPct}%`,height:`${e.widthPct}%`})}
        title=${`${e.fromLabel} – ${e.toLabel}`}
      ></div>
    `}_renderCompact(){const t=Lt(new Date),e=this._days(),i=Rt();return W`
      <div class="week-compact" role="grid" aria-label=${Wt(this.hass,"a11y.week_region")}>
        ${e.map(e=>{const s=Ot(this.schedule[e]??[]),o=e===t;return W`
            <div class=${mt({"week-compact__row":!0,"is-today":o})} role="row">
              <span class="week-compact__label">${Vt(this.hass,e)}</span>
              <hsc-timeline-bar
                .hass=${this.hass}
                .blocks=${s}
                .nowPercent=${o?i:void 0}
                ?show-scale=${!1}
                height="12px"
              ></hsc-timeline-bar>
            </div>
          `})}
        <div class="week-compact__scale" aria-hidden="true">
          ${[0,6,12,18,24].map(t=>W`
              <span
                class="week-compact__scale-tick"
                style=${gt({insetInlineStart:`${Nt(60*t)}%`})}
                >${String(t).padStart(2,"0")}</span
              >
            `)}
        </div>
      </div>
    `}static{this.styles=n`
    :host {
      display: block;
    }

    /* ===== Full ===== */
    .week-full {
      display: flex;
      gap: 6px;
      direction: ltr; /* axis + columns are LTR; text inside flips by parent dir */
      unicode-bidi: isolate;
    }
    .week-full__axis {
      position: relative;
      width: 22px;
      flex-shrink: 0;
      padding-block-start: 22px;
      font-size: 0.65rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
    }
    .week-full__axis-tick {
      position: absolute;
      transform: translateY(-50%);
      inset-inline-start: 0;
      text-align: end;
      width: 100%;
    }
    .week-full__cols {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      flex: 1;
      min-width: 0;
    }
    .week-full__col {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      min-width: 0;
    }
    .week-full__day-label {
      text-align: center;
      font-size: 0.75rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
      margin-bottom: 4px;
      padding-block: 2px;
      border-radius: var(--hsc-radius, 6px);
    }
    .week-full__col.is-today .week-full__day-label {
      background: var(--hsc-active-color, var(--primary-color));
      color: var(--text-primary-color, #fff);
      font-weight: 600;
    }
    .week-full__col-bar {
      position: relative;
      flex: 1;
      min-height: 120px;
      border-radius: var(--hsc-radius, 6px);
      overflow: hidden;
    }
    .week-full__inactive {
      position: absolute;
      inset: 0;
      background: var(--hsc-inactive-color, var(--divider-color));
      opacity: 0.4;
    }
    .week-full__block {
      position: absolute;
      inset-inline-start: 0;
      inset-inline-end: 0;
      background: var(--hsc-active-color, var(--primary-color));
    }
    .week-full__col.is-today .week-full__block {
      box-shadow: inset 0 0 0 1px var(--hsc-active-color);
    }
    .week-full__now {
      position: absolute;
      inset-inline-start: 0;
      inset-inline-end: 0;
      height: 2px;
      transform: translateY(-1px);
      background: var(--hsc-now-color, var(--error-color));
      box-shadow: 0 0 4px var(--hsc-now-color, var(--error-color));
      z-index: 2;
    }

    @container (max-width: 480px) {
      .week-full__axis {
        width: 18px;
        font-size: 0.6rem;
      }
      .week-full__day-label {
        font-size: 0.7rem;
      }
      .week-full__col-bar {
        min-height: 90px;
      }
    }

    @container (max-width: 320px) {
      .week-full__axis {
        display: none;
      }
    }

    /* ===== Compact ===== */
    .week-compact {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .week-compact__row {
      display: grid;
      grid-template-columns: 22px 1fr;
      gap: 8px;
      align-items: center;
    }
    .week-compact__label {
      font-size: 0.75rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
      text-align: center;
    }
    .week-compact__row.is-today .week-compact__label {
      color: var(--hsc-active-color, var(--primary-color));
      font-weight: 700;
    }
    .week-compact__scale {
      position: relative;
      direction: ltr;
      unicode-bidi: isolate;
      height: 14px;
      margin-inline-start: 30px;
      font-size: 0.6rem;
      color: var(--hsc-text-secondary, var(--secondary-text-color));
    }
    .week-compact__scale-tick {
      position: absolute;
      top: 0;
      transform: translateX(-50%);
    }
  `}};t([ut({attribute:!1})],he.prototype,"hass",void 0),t([ut({attribute:!1})],he.prototype,"config",void 0),t([ut({attribute:!1})],he.prototype,"schedule",void 0),t([ut({type:String})],he.prototype,"layout",void 0),t([ut({attribute:!1})],he.prototype,"nowTick",void 0),t([ut({attribute:!1})],he.prototype,"entityState",void 0),he=de=t([lt("hsc-weekly-view")],he);let ue=class extends at{constructor(){super(...arguments),this._computeLabel=t=>"expandable"===t.type?Wt(this.hass,`editor.sections.${t.name}.title`):t.name.startsWith("_")?"":Wt(this.hass,`editor.fields.${t.name}.label`),this._computeHelper=t=>Wt(this.hass,`editor.fields.${t.name}.helper`,void 0,""),this._localizeValue=t=>t.includes(".")?Wt(this.hass,t):t}setConfig(t){this._config=t}render(){return this.hass&&this._config?W`
      <div dir=${Yt(this.hass)}>
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${[{name:"entity",required:!0,selector:{entity:{filter:{domain:"schedule"}}}},{name:"title",selector:{text:{}}},{name:"_view_layout_grid",type:"grid",schema:[{name:"view",required:!0,selector:{select:{mode:"dropdown",options:[{value:"daily"},{value:"weekly"}]}}},{name:"layout",required:!0,selector:{select:{mode:"dropdown",options:[{value:"full"},{value:"compact"}]}}}]},{name:"display_options",type:"expandable",schema:[{name:"show_header",selector:{boolean:{}}},{name:"show_state",selector:{boolean:{}}},{name:"show_next_event",selector:{boolean:{}}},{name:"show_legend",selector:{boolean:{}}},{name:"allow_view_switch",selector:{boolean:{}}},{name:"first_day_of_week",selector:{select:{mode:"dropdown",options:[{value:"sunday"},{value:"monday"}]}}},{name:"time_format",selector:{select:{mode:"dropdown",options:[{value:"auto"},{value:"24h"},{value:"12h"}]}}}]},{name:"appearance",type:"expandable",schema:[{name:"_colors_grid",type:"grid",schema:[{name:"active_color",selector:{ui_color:{default_color:"primary",include_none:!0}}},{name:"inactive_color",selector:{ui_color:{default_color:"disabled",include_none:!0}}},{name:"current_time_color",selector:{ui_color:{default_color:"red",include_none:!0}}}]}]},{name:"actions",type:"expandable",schema:[{name:"tap_action",selector:{ui_action:{}}},{name:"hold_action",selector:{ui_action:{}}},{name:"double_tap_action",selector:{ui_action:{}}}]}]}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          .localizeValue=${this._localizeValue}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>
    `:F}_valueChanged(t){const e=t.detail.value;xt(this,"config-changed",{config:e})}static{this.styles=n`
    :host {
      display: block;
    }
    ha-form {
      display: block;
    }
  `}};t([ut({attribute:!1})],ue.prototype,"hass",void 0),t([_t()],ue.prototype,"_config",void 0),ue=t([lt(Et)],ue),globalThis.__HSC_PRINTED__??=(console.info("%c  HA-SCHEDULE-CARD  %c  v0.1.0  ","color: white; background: #03a9f4; font-weight: 700","color: #03a9f4; background: white; font-weight: 700"),!0);const _e=(()=>{const t=(globalThis.navigator?.language??"en").toLowerCase();return"iw"===t||t.startsWith("he")?"he":"en"})(),pe={en:{name:"Schedule Card",description:"A 24-hour visual timeline of schedule.* entities with daily/weekly and full/compact views."},he:{name:"כרטיס לוחות זמנים",description:"ציר זמן ויזואלי של 24 שעות לישויות schedule.* — עם תצוגות יומית/שבועית ומלאה/קומפקטית."}};window.customCards=window.customCards||[],window.customCards.some(t=>t.type===St)||window.customCards.push({type:St,name:pe[_e].name,description:pe[_e].description,preview:!0,documentationURL:"https://github.com/yosef-chai/ha-schedule-card"});let fe=class extends at{constructor(){super(...arguments),this._nowTick=0,this._handleAction=t=>{this.hass&&this._config&&function(t,e,i,s){var o;"double_tap"===s&&i.double_tap_action?o=i.double_tap_action:"hold"===s&&i.hold_action?o=i.hold_action:"tap"===s&&i.tap_action&&(o=i.tap_action),function(t,e,i,s){if(s||(s={action:"more-info"}),!s.confirmation||s.confirmation.exemptions&&s.confirmation.exemptions.some(function(t){return t.user===e.user.id})||(kt("warning"),confirm(s.confirmation.text||"Are you sure you want to "+s.action+"?")))switch(s.action){case"more-info":(i.entity||i.camera_image)&&xt(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":s.navigation_path&&function(t,e,i){void 0===i&&(i=!1),i?history.replaceState(null,"",e):history.pushState(null,"",e),xt(window,"location-changed",{replace:i})}(0,s.navigation_path);break;case"url":s.url_path&&window.open(s.url_path);break;case"toggle":i.entity&&(function(t,e){!function(t,e,i){void 0===i&&(i=!0);var s,o=function(t){return t.substr(0,t.indexOf("."))}(e),r="group"===o?"homeassistant":o;switch(o){case"lock":s=i?"unlock":"lock";break;case"cover":s=i?"open_cover":"close_cover";break;default:s=i?"turn_on":"turn_off"}t.callService(r,s,{entity_id:e})}(t,e,$t.includes(t.states[e].state))}(e,i.entity),kt("success"));break;case"call-service":if(!s.service)return void kt("failure");var o=s.service.split(".",2);e.callService(o[0],o[1],s.service_data,s.target),kt("success");break;case"fire-dom-event":xt(t,"ll-custom",s)}}(t,e,i,o)}(this,this.hass,this._config,t.detail.action)}}static getConfigElement(){return document.createElement(Et)}static getStubConfig(){return{type:`custom:${St}`,entity:"",view:"daily",layout:"full",show_header:!0,show_state:!0,show_next_event:!0}}setConfig(t){if(!t)throw new Error(Wt(this.hass,"common.error_invalid_config"));if(t.entity&&!t.entity.startsWith("schedule."))throw new Error(Wt(this.hass,"common.error_not_a_schedule"));this._config={view:"daily",layout:"full",show_header:!0,show_state:!0,show_next_event:!0,show_legend:!1,allow_view_switch:!1,first_day_of_week:"sunday",time_format:"auto",tap_action:{action:"more-info"},...t},this._viewOverride=void 0,this._loadedForEntity!==this._config.entity&&(this._loadedForEntity=this._config.entity,this._schedule=void 0,this._scheduleError=void 0,this._loadStartedAt=void 0,this._config.entity&&this._loadSchedule())}getCardSize(){const t=this._config?.layout??"full",e=this._effectiveView();return"compact"===t?1:"weekly"===e?5:3}getLayoutOptions(){const t=this._config?.layout??"full",e=this._effectiveView();return"compact"===t?{grid_columns:12,grid_rows:1,grid_min_rows:1,grid_max_rows:2}:{grid_columns:12,grid_rows:"weekly"===e?5:3,grid_min_rows:2}}getGridOptions(){return this.getLayoutOptions()}connectedCallback(){super.connectedCallback(),this._nowTimer=window.setInterval(()=>{this._nowTick=(this._nowTick+1)%1e6},6e4)}disconnectedCallback(){super.disconnectedCallback(),void 0!==this._nowTimer&&(window.clearInterval(this._nowTimer),this._nowTimer=void 0),this._scheduleUpdatedSub?.(),this._scheduleUpdatedSub=void 0}async _loadSchedule(){return this._loadingPromise||(this._loadingPromise=this._doLoadSchedule().finally(()=>{this._loadingPromise=void 0})),this._loadingPromise}async _doLoadSchedule(){if(this.hass&&this._config?.entity){this._scheduleError=void 0,this._loadStartedAt=Date.now();try{const e=await(t=async function(t,e){const i=await t.callService("schedule","get_schedule",void 0,{entity_id:e},!1,!0),s=i?.response??i,o=s?.[e];if(!o)throw new Error("entity_not_in_response");const r=Tt.reduce((t,e)=>(t[e]=o[e]??[],t),{}),n=t.states?.[e]?.attributes;return{entity_id:e,name:n?.friendly_name,icon:n?.icon,...r}}(this.hass,this._config.entity),Promise.race([t,new Promise((t,e)=>setTimeout(()=>e(new Error("timeout after 15000ms")),15e3))]));this._schedule=e}catch(t){console.error("[ha-schedule-card] failed to load schedule",t);const e=String(t?.message??t);this._scheduleError="entity_not_in_response"===e?Wt(this.hass,"common.error_no_entity"):Wt(this.hass,"common.error_ws_failed",{message:e}),this._schedule=void 0}finally{this._loadStartedAt=void 0}var t}}_subscribeToScheduleUpdated(){if(!this._scheduleUpdatedSub&&this.hass?.connection)try{const t=this.hass.connection.subscribeEvents(()=>{this._loadSchedule()},"schedule_updated");this._scheduleUpdatedSub=()=>{t.then(t=>t()).catch(()=>{})}}catch{}}updated(t){if(super.updated(t),t.has("hass")&&this._subscribeToScheduleUpdated(),t.has("hass")&&this._config?.entity){const t="on"===this.hass?.states?.[this._config.entity]?.state?"on":"off";t!==this._entityState&&(this._entityState=t)}t.has("hass")&&this.hass&&this._config?.entity&&!this._schedule&&!this._scheduleError&&!this._loadingPromise&&this._loadSchedule()}_effectiveView(){return this._viewOverride??this._config?.view??"daily"}_effectiveLayout(){return this._config?.layout??"full"}render(){if(!this._config||!this.hass)return F;if(!this._config.entity)return this._renderEmpty();if(this._scheduleError)return this._renderError(this._scheduleError);if(!this._schedule){const t=this.hass.states?.[this._config.entity];return t?this._loadStartedAt&&Date.now()-this._loadStartedAt>3e4?this._renderError(Wt(this.hass,"common.error_loading_timeout")):this._renderLoading():this._renderError(Wt(this.hass,"common.error_no_entity"))}const t=this.hass.states?.[this._config.entity];if(!t)return this._renderError(Wt(this.hass,"common.error_no_entity"));const e=this._effectiveView(),i=this._effectiveLayout(),s=Yt(this.hass),o=this._computeCardCssVars();return W`
      <ha-card
        dir=${s}
        style=${o}
        @action=${this._handleAction}
        .actionHandler=${re({hasHold:At(this._config.hold_action),hasDoubleClick:At(this._config.double_tap_action)})}
        role="region"
        aria-label=${this._cardAriaLabel(t)}
      >
        <div class=${mt({root:!0,compact:"compact"===i})}>
          ${!1!==this._config.show_header?this._renderHeader(t):F}
          ${this._config.show_next_event&&"compact"!==i?this._renderNextEvent(t):F}
          ${"daily"===e?W`
                <hsc-daily-view
                  .hass=${this.hass}
                  .config=${this._config}
                  .schedule=${this._schedule}
                  .layout=${i}
                  .nowTick=${this._nowTick}
                  .entityState=${this._entityState}
                ></hsc-daily-view>
              `:W`
                <hsc-weekly-view
                  .hass=${this.hass}
                  .config=${this._config}
                  .schedule=${this._schedule}
                  .layout=${i}
                  .nowTick=${this._nowTick}
                  .entityState=${this._entityState}
                ></hsc-weekly-view>
              `}
          ${this._config.show_legend&&"compact"!==i?this._renderLegend():F}
        </div>
      </ha-card>
    `}_resolveColor(t){if(null==t||"none"===t||""===t)return;if(Array.isArray(t))return`rgb(${t.join(",")})`;if("string"!=typeof t)return;const e=t.trim();return e.startsWith("#")||e.startsWith("rgb")||e.startsWith("hsl")||e.startsWith("var(")?e:`var(--${e}-color)`}_computeCardCssVars(){const t=this._config??{},e={},i=this._resolveColor(t.active_color),s=this._resolveColor(t.inactive_color),o=this._resolveColor(t.current_time_color);return i&&(e["--card-active-color"]=i),s&&(e["--card-inactive-color"]=s),o&&(e["--card-now-color"]=o),gt(e)}_cardAriaLabel(t){return`${this._config?.title||this.hass.states?.[this._config.entity]?.attributes?.friendly_name||this._config.entity} — ${"on"===t.state?Wt(this.hass,"header.state_on"):Wt(this.hass,"header.state_off")}`}_renderHeader(t){const e=this._config?.title||t.attributes?.friendly_name||this._config.entity,i=t.attributes?.icon||"mdi:calendar-clock",s=Ht(this.hass,this._config.entity,this._schedule),o=Wt(this.hass,s?"header.state_on":"header.state_off");return W`
      <div class="header">
        <ha-icon class="header__icon" .icon=${i}></ha-icon>
        <div class="header__title">${e}</div>
        ${!1!==this._config.show_state?W`
              <span class=${mt({header__badge:!0,"is-on":s})}> ${o} </span>
            `:F}
        ${this._config.allow_view_switch?this._renderViewSwitch():F}
      </div>
    `}_renderNextEvent(t){const e=t.attributes?.next_event,i=function(t){if(t){if(t instanceof Date)return t;if("string"==typeof t){const e=new Date(t);return Number.isNaN(e.getTime())?void 0:e}}}(e);if(!i)return F;const s=Ht(this.hass,this._config.entity,this._schedule),o=Zt(i,this.hass,this._config),r=s?"header.until":"header.from",n=Wt(this.hass,r,{time:o});return W`
      <div class="next-event">
        <ha-icon icon="mdi:clock-outline"></ha-icon>
        <span>${Wt(this.hass,"header.next_event")}: ${n}</span>
      </div>
    `}_renderLegend(){return W`
      <div class="legend" aria-hidden="true">
        <span class="legend__item"
          ><span class="legend__swatch is-active"></span>${Wt(this.hass,"legend.active")}</span
        >
        <span class="legend__item"
          ><span class="legend__swatch is-inactive"></span>${Wt(this.hass,"legend.inactive")}</span
        >
        <span class="legend__item"
          ><span class="legend__swatch is-now"></span>${Wt(this.hass,"legend.current_time")}</span
        >
      </div>
    `}_renderViewSwitch(){const t=this._effectiveView();return W`
      <div class="view-switch" role="group">
        <button
          type="button"
          aria-pressed=${"daily"===t}
          aria-label=${Wt(this.hass,"view.switch_to_daily")}
          @click=${()=>this._viewOverride="daily"}
        >
          ${Wt(this.hass,"view.daily")}
        </button>
        <button
          type="button"
          aria-pressed=${"weekly"===t}
          aria-label=${Wt(this.hass,"view.switch_to_weekly")}
          @click=${()=>this._viewOverride="weekly"}
        >
          ${Wt(this.hass,"view.weekly")}
        </button>
      </div>
    `}_renderLoading(){return W`
      <ha-card>
        <div class="root loading">
          <ha-spinner size="small"></ha-spinner>
          <span class="loading-label">${Wt(this.hass,"common.loading")}</span>
        </div>
      </ha-card>
    `}_renderEmpty(){return W`
      <ha-card>
        <div class="root empty">
          <ha-icon class="empty__icon" icon="mdi:calendar-clock"></ha-icon>
          <div class="empty__text">${Wt(this.hass,"common.empty_pick_entity")}</div>
          <div class="empty__hint">${Wt(this.hass,"common.empty_pick_entity_hint")}</div>
        </div>
      </ha-card>
    `}_renderError(t){return W`
      <ha-card>
        <div class="root">
          <div class="error" role="alert">${t}</div>
          <button
            class="retry"
            type="button"
            @click=${()=>{this._scheduleError=void 0,this._loadStartedAt=void 0,this._loadSchedule()}}
          >
            ${Wt(this.hass,"common.retry")}
          </button>
        </div>
      </ha-card>
    `}static{this.styles=[zt,n`
      :host {
        --schedule-card-direction: inherit;
      }
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 20px 16px;
      }
      .retry {
        margin-block-start: 8px;
        background: transparent;
        border: 1px solid var(--divider-color);
        border-radius: var(--hsc-radius, 6px);
        color: var(--primary-text-color);
        padding: 4px 12px;
        font-size: 0.85rem;
        cursor: pointer;
      }
      .retry:hover {
        background: var(--divider-color);
      }
      .retry:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      .loading-label {
        color: var(--secondary-text-color);
      }
      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        padding: 20px 16px;
        text-align: center;
      }
      .empty__icon {
        --mdc-icon-size: 36px;
        color: var(--secondary-text-color);
        opacity: 0.6;
      }
      .empty__text {
        font-weight: 500;
      }
      .empty__hint {
        font-size: 0.85rem;
        color: var(--secondary-text-color);
      }
    `]}};t([ut({attribute:!1})],fe.prototype,"hass",void 0),t([_t()],fe.prototype,"_config",void 0),t([_t()],fe.prototype,"_schedule",void 0),t([_t()],fe.prototype,"_scheduleError",void 0),t([_t()],fe.prototype,"_viewOverride",void 0),t([_t()],fe.prototype,"_nowTick",void 0),t([_t()],fe.prototype,"_entityState",void 0),t([_t()],fe.prototype,"_loadStartedAt",void 0),fe=t([lt(St)],fe);export{fe as ScheduleCard};
