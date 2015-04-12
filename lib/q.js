/*Q Promise lib*/
!function(e){"use strict";if("function"==typeof bootstrap)bootstrap("promise",e);else if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeQ=e}else{if("undefined"==typeof self)throw new Error("This environment was not anticiapted by Q. Please file a bug.");self.Q=e()}}(function(){"use strict";function e(e){return function(){return V.apply(e,arguments)}}function t(e){return e===Object(e)}function n(e){return"[object StopIteration]"===tt(e)||e instanceof B}function r(e,t){if(q&&t.stack&&"object"==typeof e&&null!==e&&e.stack&&-1===e.stack.indexOf(nt)){for(var n=[],r=t;r;r=r.source)r.stack&&n.unshift(r.stack);n.unshift(e.stack);var a=n.join("\n"+nt+"\n");e.stack=i(a)}}function i(e){for(var t=e.split("\n"),n=[],r=0;r<t.length;++r){var i=t[r];s(i)||a(i)||!i||n.push(i)}return n.join("\n")}function a(e){return-1!==e.indexOf("(module.js:")||-1!==e.indexOf("(node.js:")}function o(e){var t=/at .+ \((.+):(\d+):(?:\d+)\)$/.exec(e);if(t)return[t[1],Number(t[2])];var n=/at ([^ ]+):(\d+):(?:\d+)$/.exec(e);if(n)return[n[1],Number(n[2])];var r=/.*@(.+):(\d+)$/.exec(e);return r?[r[1],Number(r[2])]:void 0}function s(e){var t=o(e);if(!t)return!1;var n=t[0],r=t[1];return n===z&&r>=U&&ot>=r}function u(){if(q)try{throw new Error}catch(e){var t=e.stack.split("\n"),n=t[0].indexOf("@")>0?t[1]:t[2],r=o(n);if(!r)return;return z=r[0],r[1]}}function c(e,t,n){return function(){return"undefined"!=typeof console&&"function"==typeof console.warn&&console.warn(t+" is deprecated, use "+n+" instead.",new Error("").stack),e.apply(e,arguments)}}function l(e){return e instanceof p?e:y(e)?T(e):C(e)}function f(){function e(e){t=e,a.source=e,K(n,function(t,n){l.nextTick(function(){e.promiseDispatch.apply(e,n)})},void 0),n=void 0,r=void 0}var t,n=[],r=[],i=Z(f.prototype),a=Z(p.prototype);if(a.promiseDispatch=function(e,i,a){var o=J(arguments);n?(n.push(o),"when"===i&&a[1]&&r.push(a[1])):l.nextTick(function(){t.promiseDispatch.apply(t,o)})},a.valueOf=function(){if(n)return a;var e=g(t);return v(e)&&(t=e),e},a.inspect=function(){return t?t.inspect():{state:"pending"}},l.longStackSupport&&q)try{throw new Error}catch(o){a.stack=o.stack.substring(o.stack.indexOf("\n")+1)}return i.promise=a,i.resolve=function(n){t||e(l(n))},i.fulfill=function(n){t||e(C(n))},i.reject=function(n){t||e(E(n))},i.notify=function(e){t||K(r,function(t,n){l.nextTick(function(){n(e)})},void 0)},i}function d(e){if("function"!=typeof e)throw new TypeError("resolver must be a function.");var t=f();try{e(t.resolve,t.reject,t.notify)}catch(n){t.reject(n)}return t.promise}function h(e){return d(function(t,n){for(var r=0,i=e.length;i>r;r++)l(e[r]).then(t,n)})}function p(e,t,n){void 0===t&&(t=function(e){return E(new Error("Promise does not support operation: "+e))}),void 0===n&&(n=function(){return{state:"unknown"}});var r=Z(p.prototype);if(r.promiseDispatch=function(n,i,a){var o;try{o=e[i]?e[i].apply(r,a):t.call(r,i,a)}catch(s){o=E(s)}n&&n(o)},r.inspect=n,n){var i=n();"rejected"===i.state&&(r.exception=i.reason),r.valueOf=function(){var e=n();return"pending"===e.state||"rejected"===e.state?r:e.value}}return r}function m(e,t,n,r){return l(e).then(t,n,r)}function g(e){if(v(e)){var t=e.inspect();if("fulfilled"===t.state)return t.value}return e}function v(e){return e instanceof p}function y(e){return t(e)&&"function"==typeof e.then}function b(e){return v(e)&&"pending"===e.inspect().state}function k(e){return!v(e)||"fulfilled"===e.inspect().state}function w(e){return v(e)&&"rejected"===e.inspect().state}function x(){rt.length=0,it.length=0,at||(at=!0)}function _(e,t){at&&(it.push(e),rt.push(t&&"undefined"!=typeof t.stack?t.stack:"(no stack) "+t))}function S(e){if(at){var t=Q(it,e);-1!==t&&(it.splice(t,1),rt.splice(t,1))}}function E(e){var t=p({when:function(t){return t&&S(this),t?t(e):this}},function(){return this},function(){return{state:"rejected",reason:e}});return _(t,e),t}function C(e){return p({when:function(){return e},get:function(t){return e[t]},set:function(t,n){e[t]=n},"delete":function(t){delete e[t]},post:function(t,n){return null===t||void 0===t?e.apply(void 0,n):e[t].apply(e,n)},apply:function(t,n){return e.apply(t,n)},keys:function(){return et(e)}},void 0,function(){return{state:"fulfilled",value:e}})}function T(e){var t=f();return l.nextTick(function(){try{e.then(t.resolve,t.reject,t.notify)}catch(n){t.reject(n)}}),t.promise}function A(e){return p({isDef:function(){}},function(t,n){return M(e,t,n)},function(){return l(e).inspect()})}function O(e,t,n){return l(e).spread(t,n)}function j(e){return function(){function t(e,t){var o;if("undefined"==typeof StopIteration){try{o=r[e](t)}catch(s){return E(s)}return o.done?l(o.value):m(o.value,i,a)}try{o=r[e](t)}catch(s){return n(s)?l(s.value):E(s)}return m(o,i,a)}var r=e.apply(this,arguments),i=t.bind(t,"next"),a=t.bind(t,"throw");return i()}}function $(e){l.done(l.async(e)())}function L(e){throw new B(e)}function N(e){return function(){return O([this,R(arguments)],function(t,n){return e.apply(t,n)})}}function M(e,t,n){return l(e).dispatch(t,n)}function R(e){return m(e,function(e){var t=0,n=f();return K(e,function(r,i,a){var o;v(i)&&"fulfilled"===(o=i.inspect()).state?e[a]=o.value:(++t,m(i,function(r){e[a]=r,0===--t&&n.resolve(e)},n.reject,function(e){n.notify({index:a,value:e})}))},void 0),0===t&&n.resolve(e),n.promise})}function D(e){return m(e,function(e){return e=Y(e,l),m(R(Y(e,function(e){return m(e,H,H)})),function(){return e})})}function I(e){return l(e).allSettled()}function F(e,t){return l(e).then(void 0,void 0,t)}function W(e,t){return l(e).nodeify(t)}var q=!1;try{throw new Error}catch(P){q=!!P.stack}var z,B,U=u(),H=function(){},G=function(){function e(){for(;t.next;){t=t.next;var n=t.task;t.task=void 0;var i=t.domain;i&&(t.domain=void 0,i.enter());try{n()}catch(o){if(a)throw i&&i.exit(),setTimeout(e,0),i&&i.enter(),o;setTimeout(function(){throw o},0)}i&&i.exit()}r=!1}var t={task:void 0,next:null},n=t,r=!1,i=void 0,a=!1;if(G=function(e){n=n.next={task:e,domain:a&&process.domain,next:null},r||(r=!0,i())},"undefined"!=typeof process&&process.nextTick)a=!0,i=function(){process.nextTick(e)};else if("function"==typeof setImmediate)i="undefined"!=typeof window?setImmediate.bind(window,e):function(){setImmediate(e)};else if("undefined"!=typeof MessageChannel){var o=new MessageChannel;o.port1.onmessage=function(){i=s,o.port1.onmessage=e,e()};var s=function(){o.port2.postMessage(0)};i=function(){setTimeout(e,0),s()}}else i=function(){setTimeout(e,0)};return G}(),V=Function.call,J=e(Array.prototype.slice),K=e(Array.prototype.reduce||function(e,t){var n=0,r=this.length;if(1===arguments.length)for(;;){if(n in this){t=this[n++];break}if(++n>=r)throw new TypeError}for(;r>n;n++)n in this&&(t=e(t,this[n],n));return t}),Q=e(Array.prototype.indexOf||function(e){for(var t=0;t<this.length;t++)if(this[t]===e)return t;return-1}),Y=e(Array.prototype.map||function(e,t){var n=this,r=[];return K(n,function(i,a,o){r.push(e.call(t,a,o,n))},void 0),r}),Z=Object.create||function(e){function t(){}return t.prototype=e,new t},X=e(Object.prototype.hasOwnProperty),et=Object.keys||function(e){var t=[];for(var n in e)X(e,n)&&t.push(n);return t},tt=e(Object.prototype.toString);B="undefined"!=typeof ReturnValue?ReturnValue:function(e){this.value=e};var nt="From previous event:";l.resolve=l,l.nextTick=G,l.longStackSupport=!1,"object"==typeof process&&process&&process.env&&process.env.Q_DEBUG&&(l.longStackSupport=!0),l.defer=f,f.prototype.makeNodeResolver=function(){var e=this;return function(t,n){t?e.reject(t):e.resolve(arguments.length>2?J(arguments,1):n)}},l.Promise=d,l.promise=d,d.race=h,d.all=R,d.reject=E,d.resolve=l,l.passByCopy=function(e){return e},p.prototype.passByCopy=function(){return this},l.join=function(e,t){return l(e).join(t)},p.prototype.join=function(e){return l([this,e]).spread(function(e,t){if(e===t)return e;throw new Error("Can't join: not the same: "+e+" "+t)})},l.race=h,p.prototype.race=function(){return this.then(l.race)},l.makePromise=p,p.prototype.toString=function(){return"[object Promise]"},p.prototype.then=function(e,t,n){function i(t){try{return"function"==typeof e?e(t):t}catch(n){return E(n)}}function a(e){if("function"==typeof t){r(e,s);try{return t(e)}catch(n){return E(n)}}return E(e)}function o(e){return"function"==typeof n?n(e):e}var s=this,u=f(),c=!1;return l.nextTick(function(){s.promiseDispatch(function(e){c||(c=!0,u.resolve(i(e)))},"when",[function(e){c||(c=!0,u.resolve(a(e)))}])}),s.promiseDispatch(void 0,"when",[void 0,function(e){var t,n=!1;try{t=o(e)}catch(r){if(n=!0,!l.onerror)throw r;l.onerror(r)}n||u.notify(t)}]),u.promise},l.tap=function(e,t){return l(e).tap(t)},p.prototype.tap=function(e){return e=l(e),this.then(function(t){return e.fcall(t).thenResolve(t)})},l.when=m,p.prototype.thenResolve=function(e){return this.then(function(){return e})},l.thenResolve=function(e,t){return l(e).thenResolve(t)},p.prototype.thenReject=function(e){return this.then(function(){throw e})},l.thenReject=function(e,t){return l(e).thenReject(t)},l.nearer=g,l.isPromise=v,l.isPromiseAlike=y,l.isPending=b,p.prototype.isPending=function(){return"pending"===this.inspect().state},l.isFulfilled=k,p.prototype.isFulfilled=function(){return"fulfilled"===this.inspect().state},l.isRejected=w,p.prototype.isRejected=function(){return"rejected"===this.inspect().state};var rt=[],it=[],at=!0;l.resetUnhandledRejections=x,l.getUnhandledReasons=function(){return rt.slice()},l.stopUnhandledRejectionTracking=function(){x(),at=!1},x(),l.reject=E,l.fulfill=C,l.master=A,l.spread=O,p.prototype.spread=function(e,t){return this.all().then(function(t){return e.apply(void 0,t)},t)},l.async=j,l.spawn=$,l["return"]=L,l.promised=N,l.dispatch=M,p.prototype.dispatch=function(e,t){var n=this,r=f();return l.nextTick(function(){n.promiseDispatch(r.resolve,e,t)}),r.promise},l.get=function(e,t){return l(e).dispatch("get",[t])},p.prototype.get=function(e){return this.dispatch("get",[e])},l.set=function(e,t,n){return l(e).dispatch("set",[t,n])},p.prototype.set=function(e,t){return this.dispatch("set",[e,t])},l.del=l["delete"]=function(e,t){return l(e).dispatch("delete",[t])},p.prototype.del=p.prototype["delete"]=function(e){return this.dispatch("delete",[e])},l.mapply=l.post=function(e,t,n){return l(e).dispatch("post",[t,n])},p.prototype.mapply=p.prototype.post=function(e,t){return this.dispatch("post",[e,t])},l.send=l.mcall=l.invoke=function(e,t){return l(e).dispatch("post",[t,J(arguments,2)])},p.prototype.send=p.prototype.mcall=p.prototype.invoke=function(e){return this.dispatch("post",[e,J(arguments,1)])},l.fapply=function(e,t){return l(e).dispatch("apply",[void 0,t])},p.prototype.fapply=function(e){return this.dispatch("apply",[void 0,e])},l["try"]=l.fcall=function(e){return l(e).dispatch("apply",[void 0,J(arguments,1)])},p.prototype.fcall=function(){return this.dispatch("apply",[void 0,J(arguments)])},l.fbind=function(e){var t=l(e),n=J(arguments,1);return function(){return t.dispatch("apply",[this,n.concat(J(arguments))])}},p.prototype.fbind=function(){var e=this,t=J(arguments);return function(){return e.dispatch("apply",[this,t.concat(J(arguments))])}},l.keys=function(e){return l(e).dispatch("keys",[])},p.prototype.keys=function(){return this.dispatch("keys",[])},l.all=R,p.prototype.all=function(){return R(this)},l.allResolved=c(D,"allResolved","allSettled"),p.prototype.allResolved=function(){return D(this)},l.allSettled=I,p.prototype.allSettled=function(){return this.then(function(e){return R(Y(e,function(e){function t(){return e.inspect()}return e=l(e),e.then(t,t)}))})},l.fail=l["catch"]=function(e,t){return l(e).then(void 0,t)},p.prototype.fail=p.prototype["catch"]=function(e){return this.then(void 0,e)},l.progress=F,p.prototype.progress=function(e){return this.then(void 0,void 0,e)},l.fin=l["finally"]=function(e,t){return l(e)["finally"](t)},p.prototype.fin=p.prototype["finally"]=function(e){return e=l(e),this.then(function(t){return e.fcall().then(function(){return t})},function(t){return e.fcall().then(function(){throw t})})},l.done=function(e,t,n,r){return l(e).done(t,n,r)},p.prototype.done=function(e,t,n){var i=function(e){l.nextTick(function(){if(r(e,a),!l.onerror)throw e;l.onerror(e)})},a=e||t||n?this.then(e,t,n):this;"object"==typeof process&&process&&process.domain&&(i=process.domain.bind(i)),a.then(void 0,i)},l.timeout=function(e,t,n){return l(e).timeout(t,n)},p.prototype.timeout=function(e,t){var n=f(),r=setTimeout(function(){t&&"string"!=typeof t||(t=new Error(t||"Timed out after "+e+" ms"),t.code="ETIMEDOUT"),n.reject(t)},e);return this.then(function(e){clearTimeout(r),n.resolve(e)},function(e){clearTimeout(r),n.reject(e)},n.notify),n.promise},l.delay=function(e,t){return void 0===t&&(t=e,e=void 0),l(e).delay(t)},p.prototype.delay=function(e){return this.then(function(t){var n=f();return setTimeout(function(){n.resolve(t)},e),n.promise})},l.nfapply=function(e,t){return l(e).nfapply(t)},p.prototype.nfapply=function(e){var t=f(),n=J(e);return n.push(t.makeNodeResolver()),this.fapply(n).fail(t.reject),t.promise},l.nfcall=function(e){var t=J(arguments,1);return l(e).nfapply(t)},p.prototype.nfcall=function(){var e=J(arguments),t=f();return e.push(t.makeNodeResolver()),this.fapply(e).fail(t.reject),t.promise},l.nfbind=l.denodeify=function(e){var t=J(arguments,1);return function(){var n=t.concat(J(arguments)),r=f();return n.push(r.makeNodeResolver()),l(e).fapply(n).fail(r.reject),r.promise}},p.prototype.nfbind=p.prototype.denodeify=function(){var e=J(arguments);return e.unshift(this),l.denodeify.apply(void 0,e)},l.nbind=function(e,t){var n=J(arguments,2);return function(){function r(){return e.apply(t,arguments)}var i=n.concat(J(arguments)),a=f();return i.push(a.makeNodeResolver()),l(r).fapply(i).fail(a.reject),a.promise}},p.prototype.nbind=function(){var e=J(arguments,0);return e.unshift(this),l.nbind.apply(void 0,e)},l.nmapply=l.npost=function(e,t,n){return l(e).npost(t,n)},p.prototype.nmapply=p.prototype.npost=function(e,t){var n=J(t||[]),r=f();return n.push(r.makeNodeResolver()),this.dispatch("post",[e,n]).fail(r.reject),r.promise},l.nsend=l.nmcall=l.ninvoke=function(e,t){var n=J(arguments,2),r=f();return n.push(r.makeNodeResolver()),l(e).dispatch("post",[t,n]).fail(r.reject),r.promise},p.prototype.nsend=p.prototype.nmcall=p.prototype.ninvoke=function(e){var t=J(arguments,1),n=f();return t.push(n.makeNodeResolver()),this.dispatch("post",[e,t]).fail(n.reject),n.promise},l.nodeify=W,p.prototype.nodeify=function(e){return e?void this.then(function(t){l.nextTick(function(){e(null,t)})},function(t){l.nextTick(function(){e(t)})}):this};var ot=u();return l});