(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{322:function(t,e,n){t.exports=n.p+"img/zheng.881c2fa.png"},328:function(t,e,n){"use strict";n.d(e,"a",(function(){return v}));n(186),n(32),n(33),n(10),n(315),n(352);var r=n(316),c=n(318),o=n(319),f=n(317),l=n(313),d=n.n(l);function h(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Object(f.a)(t);if(e){var c=Object(f.a)(this).constructor;n=Reflect.construct(r,arguments,c)}else n=r.apply(this,arguments);return Object(o.a)(this,n)}}var v=function(t){Object(c.a)(n,t);var e=h(n);function n(t){Object(r.a)(this,n);var c=t.reTextWidth,o=void 0===c?750:c,f=t.fixIOS,l=void 0!==f&&f,d=t.fontSize,h=void 0===d?12:d,v=t.lineHeight,w=void 0===v?12:v,y=t.bold,m=void 0!==y&&y,x=function(t){return l&&t<40?1/40*t:1};return t.font="normal ".concat(m?"bold":"400"," ").concat(h,"px/").concat(w/x(h),"px Helvetica Neue, Helvetica, Arial, Microsoft Yahei,Hiragino Sans GB, Heiti SC, WenQuanYi Micro Hei, sans-serif"),t.scaleX=t.scaleY=x(h),t.maxWidth=o/x(h),t.width=o/x(h),t.textOverflow&&(t.text=n.textOverWidth(t.font,t.text||"",t.reTextWidth-t.fontSize)),e.call(this,t)}return n}(d.a.Text);v.measureTextWidth=function(t,e){var n,r=document.documentElement,c=d.a.createElement("div",{style:{font:t,position:"absolute"},innerHTML:e});return r.appendChild(c),n=c.offsetWidth,r.removeChild(c),n},v.textOverWidth=function(t,e,n){return v.measureTextWidth(t,e)<=n?e:e.split("").reduce((function(pre,e){var r=v.measureTextWidth(t,pre),c=v.measureTextWidth(t,pre+e);return r<n&&c<n?pre+e:pre}),"")+"..."}},336:function(t,e,n){"use strict";n(66),n(22),n(23),n(48),n(37),n(186),n(10);var r=n(350),c=n(21),o=(n(34),n(2)),f=n(313),l=n.n(f);function d(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}function h(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(e){Object(c.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}e.a=function(){return l.a.Class.create({Mixes:l.a.EventMixin,queue:null,rawSource:null,spsource:{},load:function(){var t=this;return Object(o.a)(regeneratorRuntime.mark((function e(){var c,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.e(11).then(n.t.bind(null,353,3));case 2:return c=e.sent.default,o={categorys:h({},c.categorys),rawUrls:Object(r.a)(c.rawUrls),imageIds:Object(r.a)(c.imageIds)},t.rawSource=o,t.queue=new l.a.LoadQueue,t.queue.add(Object(r.a)(o.imageIds.map((function(t){var e=n(337)("./".concat(t,".png"));return-1===e.indexOf("data:image")&&(e=""+e),{id:t,type:"png",src:e}})))),t.queue.on("load",t.onProcess.bind(t)),e.next=10,new Promise((function(e,n){t.queue.on("complete",(function(n){t.onComplete(n),e(t)})),t.queue.on("error",(function(e){t.onError(e),n(e)})),t.queue.start()}));case 10:return e.abrupt("return",e.sent);case 11:case"end":return e.stop()}}),e)})))()},onProcess:function(t){this.fire("load",t)},onError:function(t){this.fire("error",t)},onComplete:function(t){var e=this,n=this.rawSource;for(var r in n.rawUrls.forEach((function(t){var r=t.rawUrl.split("/"),c=r.pop();n.categorys[r.join("-")].filter((function(t){return t.name===c}))[0].image=e.queue.get(t.imageName).content})),n.categorys)n.categorys.hasOwnProperty(r)&&(n.categorys[r]=n.categorys[r].reduce((function(a,b){return h(h({},a),{},Object(c.a)({},b.name,b))}),{}));this.spsource={layout:n.categorys},this.queue.off("complete"),this.fire("complete")}})}},337:function(t,e,n){var map={"./43055795-1c94-47ce-97e9-1843f55c3d14.png":338,"./50aa7e1e-bbb5-4215-81a9-972d1a9f2cc8.png":339,"./710d5c9b-f830-4f49-999f-9e962a3862e5.png":340,"./a15b9fee-c25f-46d8-8c9d-7c27b6217627.png":341,"./buding.png":342,"./c43ff35a-9d4d-4f4a-af09-c1188c6618e4.png":343,"./doudou.png":344,"./fan.png":345,"./zheng.png":322};function r(t){var e=c(t);return n(e)}function c(t){if(!n.o(map,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return map[t]}r.keys=function(){return Object.keys(map)},r.resolve=c,t.exports=r,r.id=337},338:function(t,e,n){t.exports=n.p+"img/43055795-1c94-47ce-97e9-1843f55c3d14.a4ea66b.png"},339:function(t,e,n){t.exports=n.p+"img/50aa7e1e-bbb5-4215-81a9-972d1a9f2cc8.64b968b.png"},340:function(t,e,n){t.exports=n.p+"img/710d5c9b-f830-4f49-999f-9e962a3862e5.1ea504c.png"},341:function(t,e,n){t.exports=n.p+"img/a15b9fee-c25f-46d8-8c9d-7c27b6217627.24d6586.png"},342:function(t,e,n){t.exports=n.p+"img/buding.feb2729.png"},343:function(t,e,n){t.exports=n.p+"img/c43ff35a-9d4d-4f4a-af09-c1188c6618e4.8f238ee.png"},344:function(t,e,n){t.exports=n.p+"img/doudou.f3cac1e.png"},345:function(t,e,n){t.exports=n.p+"img/fan.e8b21dc.png"},346:function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));var r=n(313),c=n.n(r);function o(){var t=null,e=null,n=innerWidth/1920,r=innerHeight/1080;return(t=new c.a.Stage({renderType:"canvas",width:1920,height:1080,scaleX:n,scaleY:r,container:document.createElement("canvas")})).enableDOMEvent(c.a.event.POINTER_START,!0),t.enableDOMEvent(c.a.event.POINTER_MOVE,!0),t.enableDOMEvent(c.a.event.POINTER_END,!0),window.addEventListener("resize",(function(){requestAnimationFrame((function(){t.scaleX=innerWidth/1920,t.scaleY=innerHeight/1080,t.resize(1920,1080,!0)}))})),(e=new c.a.Ticker(500)).addTick(c.a.Tween),e.addTick(t),e.start(!0),t.ticker=e,{stage:t,ticker:e}}},347:function(t,e,n){"use strict";n.d(e,"a",(function(){return w}));n(32),n(33),n(10),n(315);var r=n(316),c=n(320),o=n(318),f=n(319),l=n(317),d=n(313),h=n.n(d);function v(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Object(l.a)(t);if(e){var c=Object(l.a)(this).constructor;n=Reflect.construct(r,arguments,c)}else n=r.apply(this,arguments);return Object(f.a)(this,n)}}var w=function(t){Object(o.a)(n,t);var e=v(n);function n(t){var c;return Object(r.a)(this,n),(c=e.call(this,t)).initBg(t),c}return Object(c.a)(n,[{key:"initBg",value:function(t){var e=t.backgroundPos;t.questions,t.preview;new h.a.Bitmap({x:0,y:0,image:e.image,rect:e.rect,visible:!0}).addTo(this,-1)}}]),n}(h.a.Container)},348:function(t,e,n){"use strict";n.d(e,"a",(function(){return y}));n(32),n(33),n(10),n(315);var r=n(316),c=n(320),o=n(318),f=n(319),l=n(317),d=n(313),h=n.n(d),v=n(328);function w(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Object(l.a)(t);if(e){var c=Object(l.a)(this).constructor;n=Reflect.construct(r,arguments,c)}else n=r.apply(this,arguments);return Object(f.a)(this,n)}}var y=function(t){Object(o.a)(n,t);var e=w(n);function n(t){var c;return Object(r.a)(this,n),(c=e.call(this,t)).x=t.x,c.y=t.y,c.init(t),c}return Object(c.a)(n,[{key:"init",value:function(t){var e=t||{},n=e.backgroundPos,title=e.title;new h.a.Bitmap({x:0,y:0,width:n.width,height:n.height,image:n.image,visible:!0}).addTo(this);new v.a({text:title||"翻翻卡游戏",fontSize:36,lineHeight:36,bold:!0,textAlign:"center",textVAlign:"middle",height:116,reTextWidth:250,x:112,y:10,color:"#ffffff"}).addTo(this)}}]),n}(h.a.Container)},351:function(t,e,n){"use strict";n.d(e,"a",(function(){return x}));n(32),n(33),n(10),n(315);var r=n(316),c=n(320),o=n(318),f=n(319),l=n(317),d=n(313),h=n.n(d),v=n(328);function w(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Object(l.a)(t);if(e){var c=Object(l.a)(this).constructor;n=Reflect.construct(r,arguments,c)}else n=r.apply(this,arguments);return Object(f.a)(this,n)}}var y=function(t){Object(o.a)(f,t);var e=w(f);function f(t){var n;Object(r.a)(this,f),n=e.call(this,t);var c=t||{},o=c.x,l=void 0===o?0:o,d=c.y,h=void 0===d?0:d,v=c.backgroundPos,w=void 0===v?{}:v,y=c.questions,m=void 0===y?{}:y;return n.backgroundPos=w,n.questions=m,n.x=l,n.y=h,n.width=306,n.height=316,n.circleRadius=115,n.circlePointX=(n.width-2*n.circleRadius)/2,n.circlePointY=(n.height-2*n.circleRadius)/2-4,n.initFront(t),n.initBack(),n}return Object(c.a)(f,[{key:"circleBj",value:function(t){return new h.a.Bitmap({x:0,y:0,width:this.width,height:this.height,image:this.backgroundPos.image,visible:!0})}},{key:"initFront",value:function(){var t=this,e=new h.a.Container({x:0,y:0,width:this.width,height:this.height,visible:!0}).addTo(this),n=this.questions,r=n.zhengText,c=void 0===r?"":r,o=n.zhengImg,f=void 0===o?"":o;c?this.drawText(e,c,"#ffd65d"):this.drawImg(e,f,"#ffd65d"),e.on(h.a.event.POINTER_START,(function(n){t.toggleTween(e,t.back)})),this.front=e}},{key:"initBack",value:function(){var t=this,e=new h.a.Container({x:this.width/2,y:0,scaleX:0,scaleY:1,width:this.width,height:this.height,visible:!1,id:"back"}).addTo(this),n=this.questions,r=n.fanText,c=void 0===r?"":r,o=n.fanImg,f=void 0===o?"":o;c?this.drawText(e,c):this.drawImg(e,f),e.on(h.a.event.POINTER_START,(function(n){t.toggleTween(e,t.front)})),this.back=e}},{key:"drawImg",value:function(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"#58b8ff",c=this,o=new h.a.Container({x:c.circlePointX,y:c.circlePointY,width:2*c.circleRadius,height:2*c.circleRadius,visible:!0}).addTo(t),f=new h.a.Graphics({x:0,y:0,scaleX:1,scaleY:1,width:this.width,height:this.height,align:h.a.align.CENTER,background:"#999999",visible:!0}),l=new h.a.Bitmap({x:0,y:0,align:h.a.align.CENTER,image:e||n(322),visible:!0}),d=1,img=new Image;img.src=e||n(322),img.onload=function(){img.width>img.height&&img.width>c.width&&(d=c.width/img.width),img.height>img.width&&img.height>c.height&&(d=c.height/img.height),l.width=img.width*d-120,l.height=img.height*d-124},f.beginFill(r).drawCircle(c.circlePointX,c.circlePointY,c.circleRadius).endFill().addTo(o),l.addTo(o),c.circleBj().addTo(t)}},{key:"drawText",value:function(t,text){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"#58b8ff",n=new h.a.Graphics({width:this.width,height:this.height,x:0,y:0});n.beginFill(e).drawCircle(this.circlePointX,this.circlePointY,this.circleRadius).endFill().addTo(t),new v.a({text:text||"apple",fontSize:50,lineHeight:50,bold:!0,textAlign:"center",textVAlign:"middle",height:50,reTextWidth:2*this.circleRadius,x:this.circlePointX,y:this.height/2-25,color:"#ffffff"}).addTo(t),this.circleBj().addTo(t)}},{key:"toggleTween",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:300;h.a.Tween.to(t,{scaleX:0,x:this.width/2},{duration:n,onComplete:function(){t.visible=!1,h.a.Tween.to(e,{scaleX:1,x:0},{duration:n,onStart:function(){e.visible=!0},onComplete:function(){console.log("执行成功")}})}})}}]),f}(h.a.Container);function m(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Object(l.a)(t);if(e){var c=Object(l.a)(this).constructor;n=Reflect.construct(r,arguments,c)}else n=r.apply(this,arguments);return Object(f.a)(this,n)}}var x=function(t){Object(o.a)(n,t);var e=m(n);function n(t){var c;return Object(r.a)(this,n),(c=e.call(this,t)).questions=t.questions||[],c.align=h.a.align.CENTER,c.width=0,c.height=326,c.init(t),c}return Object(c.a)(n,[{key:"init",value:function(t){for(var e=(t||{}).backgroundPos,n={x:0,y:0,questions:{},backgroundPos:e},r={x:0,y:336,questions:{},backgroundPos:e},i=0;i<this.questions.length;i++)i<=3?(n.questions=this.questions[i],new y(n).addTo(this),n.x+=348,this.width+=348):(r.questions=this.questions[i],new y(r).addTo(this),r.x+=348,this.height=652)}}]),n}(h.a.Container)},365:function(t,e,n){"use strict";n.r(e);n(91),n(34);var r=n(2),c=(n(313),n(336)),o=n(346),f=n(347),l=n(351),d=n(348),h={data:function(){return{}},mounted:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,h,v,w,y,m,x,title,O;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,t.$testload();case 3:"string"==typeof(n=e.sent)&&(n=JSON.parse(n||null)),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),n=JSON.parse(localStorage.getItem("configData")||null);case 10:if(n){e.next=12;break}return e.abrupt("return",t.$router.replace("/config"));case 12:return t.questions=n.data,r=Object(c.a)(),(h=new r).on("load",(function(t){(t.target.queue.getLoaded()/t.target.queue.getTotal()).toFixed(2)})),e.next=18,h.load();case 18:v=e.sent,w=v.spsource.layout,y=Object(o.a)(),t.$refs.container.appendChild(y.stage.canvas),m=y.stage,y.ticker,x=new f.a({x:0,y:0,backgroundPos:w["game-bj"]["游戏背景.png"],visible:!0}),title=new d.a({x:46,y:30,backgroundPos:w["game-title"]["游戏标题.png"],title:n.title,visible:!0}),O=new l.a({x:0,y:0,questions:t.questions,backgroundPos:w["game-card"]["游泳圈.png"],visible:!0}),m.addChild(x,title,O);case 27:case"end":return e.stop()}}),e,null,[[0,7]])})))()}},v=n(35),component=Object(v.a)(h,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("div",{ref:"container",staticClass:"container"})])}),[],!1,null,null,null);e.default=component.exports}}]);