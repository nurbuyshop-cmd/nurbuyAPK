window.UICP={"car": "<path d=\"M5 17H4.5A1.5 1.5 0 0 1 3 15.5V12l2-5.2A2 2 0 0 1 6.9 5.5h10.2A2 2 0 0 1 19 6.8L21 12v3.5a1.5 1.5 0 0 1-1.5 1.5H19\"/><circle cx=\"7.5\" cy=\"17\" r=\"2\"/><circle cx=\"16.5\" cy=\"17\" r=\"2\"/><path d=\"M9.5 17h5M3 12h18\"/>", "bolt": "<path d=\"M13 2L4 14h7l-1 8 9-12h-7z\"/>", "truck": "<path d=\"M3 6h11v10H3zM14 9h4l3 3v4h-7\"/><circle cx=\"7\" cy=\"17.5\" r=\"1.8\"/><circle cx=\"17\" cy=\"17.5\" r=\"1.8\"/>", "shield": "<path d=\"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z\"/><path d=\"M8.5 12l2.5 2.5 4.5-5\"/>", "ok": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M8 12.5l2.7 2.7L16 9.5\"/>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>", "flame": "<path d=\"M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z\"/>", "spark": "<path d=\"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z\"/>", "cash": "<rect x=\"2\" y=\"6\" width=\"20\" height=\"12\" rx=\"2\"/><circle cx=\"12\" cy=\"12\" r=\"2.6\"/><path d=\"M6 9.5v.01M18 14.5v.01\"/>", "search": "<circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"M21 21l-4.3-4.3\"/>", "pin": "<path d=\"M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/>", "ret": "<path d=\"M9 14L4 9l5-5\"/><path d=\"M4 9h10a6 6 0 0 1 0 12h-3\"/>", "globe": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18\"/>", "store": "<path d=\"M3 9l1.5-5h15L21 9M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 14v7h14v-7\"/>", "phone": "<path d=\"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z\"/>", "mail": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M3 7l9 6 9-6\"/>", "users": "<circle cx=\"9\" cy=\"8\" r=\"3.5\"/><path d=\"M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5\"/>", "eye": "<path d=\"M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/>", "bag": "<path d=\"M6 7h12l1 14H5zM9 7a3 3 0 0 1 6 0\"/>", "cart": "<circle cx=\"9\" cy=\"20\" r=\"1.5\"/><circle cx=\"18\" cy=\"20\" r=\"1.5\"/><path d=\"M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6\"/>", "box": "<path d=\"M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8\"/>", "cam": "<path d=\"M4 8h3l2-3h6l2 3h3v11H4z\"/><circle cx=\"12\" cy=\"13.5\" r=\"3.5\"/>", "heart": "<path d=\"M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z\"/>", "grid": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1\"/>", "x": "<path d=\"M6 6l12 12M18 6L6 18\"/>"};window.uic=function(n){return '<svg class="uic" viewBox="0 0 24 24" aria-hidden="true">'+UICP[n]+'</svg>'};
var $=function(i){return document.getElementById(i)};
function enName(x){if(x&&typeof x=='object')return x.en;return(typeof SUB!='undefined'&&SUB&&BN.test(x))?conv(x):x}
function imgOf(p){var u=p[5]||IMG[enName(p[1])]||'';return Array.isArray(u)?(u[0]||''):u}
function galOf(p){var u=(p[7]&&p[7].length)?p[7]:IMG[enName(p[1])];if(!Array.isArray(u))return null;u=u.filter(Boolean);return u.length?u:null}
function tU(u,w){try{var m=/\/uploads\/([A-Za-z0-9_-]{1,80}\.(?:jpe?g|png|webp))$/i.exec(u||'');return m&&window.NB_API&&String(u).indexOf(window.NB_API)==0?window.NB_API+(window.NB_API_PRETTY===false?'/index.php':'')+'/thumb/'+(w||640)+'/'+m[1]:u}catch(e){return u}}
function PIC(url,emo,alt,cls,w){if(Array.isArray(url))url=url[0];if(!url)return emo;var og=url;url=tU(url,w||window.NB_TW||640);var dO=og!=url?' data-o="'+esc(og)+'"':'';var rt=og!=url?'var o=this.dataset.o;if(o){this.removeAttribute(\'data-o\');this.src=o;return}':'';var fb=cls=='bg'?'<div class=em>'+emo+'</div>':'<span class=pe>'+emo+'</span>';return '<img class="pi'+(cls?' '+cls:'')+'" src="'+url+'"'+dO+' alt="'+(alt||'')+'" loading="lazy" decoding="async" onerror="'+rt+'this.outerHTML=\''+fb+'\'">'}

var P=function(a){return a.map(function(x){return x})};
var V={
min:{strip:'আপনার এলাকায় ১৫ থেকে ৫৯ মিনিটে ডেলিভারি',hero:[],ob:[],
cats:[["🥦","সবজী"],["🐟","মাছ"],["🥩","মাংস"],["🍎","ফল"],["💊","ঔষধ"],["🔌","বৈদ্যুতিক দোকান"],["📺","ইলেকট্রনিক"],["🛒","মুদী দোকান"],["🍛","রেস্টুরেন্ট"],["⊞","সব"]],
od:[['NurBuy','এ শুধু','অফার','আর<br><b>অফার</b>'],['NurBuy','মিনিটসে','ডেলিভারি','ফ্রি<br><b>ডেলিভারি</b>'],['NurBuy','প্রথম অর্ডারে','১০০৳','ছাড়<br><b>পান</b>']],
hot:[["🥩","গরুর মাংস",3,700,900],["🧅","দেশি পিয়াজ",4,700,900],["🥔","ডায়মন্ড আলু",4,700,900],["🍅","টমেটো",4,120,150],["🐟","রুই মাছ",5,350,420],["🥕","গাজর",4,80,100]],
best:[["🥩","গরুর মাংস",3,700,900],["🐟","ইলিশ মাছ",5,1800,2100],["🍎","আপেল",4,260,300],["🥚","ডিম (হালি)",4,52,60],["🍚","মিনিকেট চাল",5,75,85],["🥛","দুধ (১লি)",4,95,110]],
shops:[["👨‍💼","Daily Ghorer Shop","MD Abdul Mia"],["🧑","Ali Vai Shop","MD Ali Ahmed"],["👨‍🍳","Rahim Store","MD Rahim Uddin"],["🧔","Karim Fresh Mart","MD Karim Hossain"],["👨‍🌾","Sobuj Bazar","MD Sobuj Ali"],["🧑‍💼","Noor Grocery","MD Nur Islam"],["👨‍💼","Ma Fish House","MD Jasim Uddin"],["🧑","Fresh Meat Point","MD Salam Khan"],["👨‍🍳","Tasty Kitchen","MD Farid Ahmed"],["🧔","Green Veg Shop","MD Habib Mia"],["👨‍💼","City Pharmacy","MD Rubel Hasan"],["🧑‍💼","Digital Zone","MD Sumon Mia"]]}};
var timers=[],cart={},view='min';
var SK={food:['Food & Restaurant','খাবার ও রেস্টুরেন্ট','<path d="M7 2v7M5 2v5a2 2 0 004 0V2M7 9v13M17 2c-2.500 2-3 5-3 8h3v12"/>'],grocery:['Grocery & Vegetables','মুদি ও সবজি','<path d="M20 4C9 4 4 9 4 15c0 2 1 4 3 5 6 0 13-3 13-16zM4 21c3-5 6-8 11-11"/>'],med:['Medicine & Health','ঔষধ ও স্বাস্থ্য','<rect x="2" y="8" width="20" height="8" rx="4" transform="rotate(-45 12 12)"/><path d="M9.500 14.500l5-5"/>'],elec:['Electronics & Gadgets','ইলেকট্রনিক্স ও গ্যাজেট','<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 21h8M12 16v5"/>'],meat:['Meat & Poultry','মাংস ও মুরগি','<path d="M4 12a8 6 0 0116 0 8 6 0 01-16 0zM9 12h6"/>'],fish:['Fish & Seafood','মাছ ও সীফুড','<path d="M3 12c3-5 9-6 13-2l5-3v10l-5-3c-4 4-10 3-13-2z"/>']};
var SH=[['Tasty Kitchen','MD Farid Ahmed','food',5.0,500,'15-59',5.2,40,'👨‍🍳'],['Green Veg Shop','MD Habib Mia','grocery',4.8,420,'15-59',4.8,30,'🧔'],['City Pharmacy','MD Rubel Hasan','med',5.0,380,'15-59',6.7,50,'👨‍⚕️'],['Digital Zone','MD Sumon Mia','elec',4.7,310,'15-59',7.1,60,'🤵'],['Daily Ghorer Shop','MD Abdul Mia','grocery',4.9,500,'15-59',2.1,20,'👨‍💼'],['Ali Vai Shop','MD Ali Ahmed','grocery',4.7,350,'15-59',3.4,30,'🧑'],['Rahim Store','MD Rahim Uddin','grocery',4.6,290,'15-59',3.9,30,'👨‍🌾'],['Karim Fresh Mart','MD Karim Hossain','grocery',4.8,410,'15-59',4.5,30,'🧔'],['Ma Fish House','MD Jasim Uddin','fish',4.7,260,'15-59',5.0,40,'🧔‍♂️'],['Fresh Meat Point','MD Salam Khan','meat',4.6,230,'15-59',4.2,40,'👨‍🦱'],['Sobuj Bazar','MD Sobuj Ali','grocery',4.5,180,'35-45',6.0,40,'👨‍🌾'],['Noor Grocery','MD Nur Islam','grocery',4.7,300,'15-59',2.8,25,'🧑‍💼']];
var FAV={};
var IC={star:'<svg viewBox="0 0 24 24"><path d="M12 2l3 6.500 7 .8-5.200 4.800 1.400 7L12 17.500 5.800 21l1.400-7L2 9.300l7-.8z"/></svg>',user:'<svg viewBox="0 0 24 24" style="fill:currentColor"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0z"/></svg>',pin:'<svg viewBox="0 0 24 24" style="fill:currentColor"><path d="M12 22s7-6.500 7-12a7 7 0 00-14 0c0 5.500 7 12 7 12zm0-9.500a2.500 2.500 0 110-5 2.500 2.500 0 010 5z"/></svg>',house:'<svg viewBox="0 0 24 24" style="fill:currentColor"><path d="M12 3L2 12h3v8h5v-5h4v5h5v-8h3z"/></svg>',bike:'<svg class="st2" viewBox="0 0 24 24" style="fill:none;stroke:currentColor;stroke-width:2"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17h4l3-8h3M13 9H9"/></svg>',truck:'<svg viewBox="0 0 24 24" style="fill:currentColor"><path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="7" cy="18" r="2.200"/><circle cx="17" cy="18" r="2.200"/></svg>',heart:'<svg viewBox="0 0 24 24"><path d="M12 21s-8-5-8-11a4.500 4.500 0 018-2.800A4.500 4.500 0 0120 10c0 6-8 11-8 11z"/></svg>',arr:'<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',chk:'<svg viewBox="0 0 24 24"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg>'};
function shopCard(s){var b=lang=='bn',k=SK[s[2]],fs=Math.min(3.7,48/Math.max(s[0].length,13));if(LIVE&&LSTO[s[0]])return shopCardL(s,b,k,fs);
return '<div class="shop t-'+s[2]+'" data-sn="'+esc(s[0])+'" role="link" tabindex="0"><div class="si"></div><div class="av">'+PIC(IMG[s[0]],s[8],s[0])+'</div><div class="nm"><h4 style="font-size:'+fs.toFixed(2)+'cqw">'+s[0]+'</h4><div class="ow">'+IC.user+s[1]+'</div></div><div class="rt"><b>'+IC.star+s[3].toFixed(1)+'</b><small>('+s[4]+' '+(b?'রিভিউ':'Reviews')+')</small></div><span class="on">'+(b?'অনলাইন':'Online')+'</span><button class="hr'+(FAV[s[0]]?' f':'')+'" data-n="'+s[0]+'" aria-label="Favorite">'+IC.heart+'</button><span class="cat"><svg viewBox="0 0 24 24">'+k[2]+'</svg>'+(b?k[1]:k[0])+'</span><div class="tp"><span class="tm2">'+IC.bike+s[5]+' '+(b?'মিনিট':'min')+'</span><span class="hd2">'+IC.house+(b?'হোম ডেলিভারি':'Home Delivery')+'</span></div><div class="ft"><span>'+IC.pin+s[6]+' '+(b?'কিমি':'km')+'</span><i></i><span>'+IC.truck+(b?'ডেলিভারি ফি:':'Delivery Fee:')+' ৳ '+s[7]+'</span></div><button class="go" aria-label="Open shop">'+IC.arr+'</button></div>'}
function shopCardL(s,b,k,fs){var st=shSt(s[0]),fo=flOn(s[0]),lf=locBase('min'),fee=lf!=null?lf:30;
return '<div class="shop t-'+s[2]+(st.open?'':' scl')+'" data-sn="'+esc(s[0])+'" role="link" tabindex="0"><div class="si"></div><div class="av">'+PIC(IMG[s[0]],s[8],s[0])+'</div><div class="nm"><h4 style="font-size:'+fs.toFixed(2)+'cqw">'+esc(s[0])+'</h4><div class="ow">'+IC.user+esc(s[1])+'</div></div><div class="rt"><b>'+IC.user+'<span data-flc="'+esc(s[0])+'">'+bnN(flCount(s[0]))+'</span></b><small>'+(b?'ফলোয়ার':'Followers')+'</small></div><span class="on'+(st.open?'':' off')+'">'+(st.open?(b?'খোলা':'Open'):(b?'বন্ধ':'Closed'))+'</span><button class="hr'+(fo?' f':'')+'" data-n="'+esc(s[0])+'" data-fln="'+esc(s[0])+'" aria-pressed="'+fo+'" aria-label="'+(b?'ফলো':'Follow')+'">'+IC.heart+'</button><span class="cat"><svg viewBox="0 0 24 24">'+k[2]+'</svg>'+(b?k[1]:k[0])+'</span><div class="tp"><span class="tm2">'+IC.bike+(b?'সর্বোচ্চ ৫৯ মিনিট':'Up to 59 min')+'</span><span class="hd2">'+IC.house+(b?'হোম ডেলিভারি':'Home Delivery')+'</span></div><div class="ft"><span>'+uic('clock')+(st.open?esc(hrsToday(LSTO[s[0]].h)):esc(st.nx||shClosedLbl(st)))+'</span><i></i><span>'+IC.truck+(b?'ডেলিভারি ফি:':'Delivery Fee:')+' ৳ '+bnN(fee)+'</span></div><button class="go" aria-label="Open shop">'+IC.arr+'</button></div>'}
function renderShops(){var h='';for(var i=0;i<SH.length;i+=4)h+='<div class="sc">'+SH.slice(i,i+4).map(shopCard).join('')+'</div>';var t=$('shopl'),sl=t.scrollLeft;t.innerHTML=h;t.scrollLeft=sl}

/* ===== HERO SLIDER: admin-panel design config =====
 Each slide has a separate design per device: mobile (<768px), tablet (768-1099px), desktop (>=1100px).
 design = {bg:"css background", layers:[ {type:"text|button|image|shape", x,y,w,h (% of canvas), size (% of canvas width),
           color,weight,align,bg,radius,rot,op,z,src,link, text:"..." or {en:"..",bn:".."} } ]}
 Canvas size per device: HERO.<view>.canvas = {mobile:[w,h],tablet:[w,h],desktop:[w,h]}
 Load from admin: NurBuyHero.setConfig(json)  */
var P={mobile:{h:[6,14,60,6.2],p:[6,50,58,3.1],b:[6,68,30,17,3.3],e:[68,14,28,24]},tablet:{h:[6,18,56,5],p:[6,48,52,2.3],b:[6,66,20,15,2.3],e:[66,10,30,32]},desktop:{h:[6,20,55,4.2],p:[6,50,52,1.8],b:[6,68,14,13,1.7],e:[68,8,26,36]},flat:{h:[5,14,58,3.4],p:[5,46,50,1.5],b:[5,64,13,22,1.5],e:[72,10,20,15]}};
function sample(k,sl){var q=P[k];return {bg:sl[0],layers:[{type:'text',x:q.h[0],y:q.h[1],w:q.h[2],text:sl[1],size:q.h[3],weight:800},{type:'text',x:q.p[0],y:q.p[1],w:q.p[2],text:sl[2],size:q.p[3],weight:500,op:.92},{type:'button',x:q.b[0],y:q.b[1],w:q.b[2],h:q.b[3],text:sl[3],size:q.b[4],bg:'#fff',color:sl[0].match(/#[0-9a-f]{6}/i)[0],weight:700,radius:.8},{type:'text',x:q.e[0],y:q.e[1],w:q.e[2],text:sl[4],size:q.e[3],align:'center'}]}}
function mk(sls,cv){return sls.map(function(sl){var o={};['mobile','tablet','desktop'].forEach(function(dv){var c=cv[dv];o[dv]=sample(dv=='desktop'&&c[0]/c[1]>3.5?'flat':dv,sl)});return o})}
var CV={min:{mobile:[800,350],tablet:[1200,400],desktop:[1300,400]}};
var HS1=[['linear-gradient(110deg,#0f3bd1,#2fa4ff)',{en:'Everything in one place',bn:'সব কিছু এক জায়গায়'},{en:'Your daily bazaar, delivered in minutes.',bn:'প্রতিদিনের বাজার, মিনিটসেই আপনার দরজায়।'},{en:'Get Started',bn:'শুরু করুন'},'🛒'],['linear-gradient(110deg,#0f766e,#34d399)',{en:'Fresh vegetables & fruits',bn:'তাজা সবজি ও ফল'},{en:'Straight from the farm, new offers every day.',bn:'সরাসরি কৃষকের কাছ থেকে, প্রতিদিন নতুন অফার।'},{en:'Order Now',bn:'অর্ডার করুন'},'🥦'],['linear-gradient(110deg,#7c3aed,#e11d9c)',{en:'Discount on your first order',bn:'প্রথম অর্ডারে ছাড়'},{en:'Special discount and free delivery for new customers.',bn:'নতুন গ্রাহকদের জন্য বিশেষ ডিসকাউন্ট ও ফ্রি ডেলিভারি।'},{en:'View Offers',bn:'অফার দেখুন'},'🎉']];
var HERO={min:{canvas:CV.min,slides:mk(HS1,CV.min)}};
var SPD=[['🐟',{en:'Fresh Hilsa Fish (1 kg)',bn:'তাজা ইলিশ মাছ (১ কেজি)'},1800,'linear-gradient(135deg,#0e7490,#22d3ee)'],['🍚',{en:'Premium Miniket Rice (5 kg)',bn:'প্রিমিয়াম মিনিকেট চাল (৫ কেজি)'},420,'linear-gradient(135deg,#b45309,#fbbf24)'],['🥚',{en:'Farm Fresh Eggs (12 pcs)',bn:'ফার্ম ফ্রেশ ডিম (১২ পিস)'},140,'linear-gradient(135deg,#c2410c,#fb923c)'],['🧃',{en:'Mixed Fruit Juice (1 L)',bn:'মিক্সড ফ্রুট জুস (১ লি)'},180,'linear-gradient(135deg,#7c3aed,#ec4899)']];
function spR(){var h='<div class="spi">'+SPD.map(function(p){return '<div class="sq" style="background:'+p[3]+'">'+PIC(IMG[enName(p[1])],p[0],'','bg')+'<div class="ov"><div class="nn">'+tx(p[1])+'</div><b>৳ '+p[2]+'</b><small>'+(lang=='bn'?'স্পন্সরড':'Sponsored')+'</small></div></div>'}).join('')+'</div>';$('sp').innerHTML=h;$('spm').innerHTML=h}
var hT=[],FB={mobile:['mobile','tablet','desktop'],tablet:['tablet','desktop','mobile'],desktop:['desktop','tablet','mobile']};
function dev(){var w=window.innerWidth;return w<768?'mobile':w<1100?'tablet':'desktop'}
function tx(v){return v&&typeof v=='object'?(v[lang]||v.en||v.bn||''):(v||'')}
var BNR=null,oT={min:[]};
function nn(v,d){v=parseFloat(v);return isFinite(v)?v:d}
function bnLink(u){if(typeof u!='string')return '';u=u.replace(/[\u0000- \u007f]/g,'');if(!u||u.length>2000||u.indexOf('\\')>-1)return '';if(/^[a-z][a-z0-9+.\-]*:/i.test(u))return /^https?:\/\/[^\/]/i.test(u)?u:'';if(u.slice(0,2)=='//')return '';return u}
function bnImg(u){if(typeof u!='string')return '';u=u.trim();if(!u||u.length>4e6)return '';if(/^data:/i.test(u))return /^data:image\/(png|jpe?g|gif|webp|avif|svg\+xml)[;,]/i.test(u)?u:'';var t=u.replace(/[\u0000- \u007f]/g,'');if(/^[a-z][a-z0-9+.\-]*:/i.test(t))return /^https?:\/\/[^\/]/i.test(t)?u:'';if(t.slice(0,2)=='//'||t.indexOf('\\')>-1)return '';return u}
function bnUrlEnc(u){var d=/^data:/i.test(u);u=u.replace(/[\u0000-\u001f\u007f"'()<>\\ ]/g,function(c){return '%'+('0'+c.charCodeAt(0).toString(16)).slice(-2).toUpperCase()});return d?u.replace(/#/g,'%23'):u}
var BNFN=/^(rgb|rgba|hsl|hsla|linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient)$/i;
function bnBg(v,d){if(typeof v!='string')return d;v=v.trim();if(!v||v.length>6e6)return d;var us=[],bad=false;
var r=v.replace(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)'"]*))\s*\)/gi,function(m,a,b,c){var u=bnImg(a!=null?a:b!=null?b:(c||''));if(!u){bad=true;return ''}us.push("url('"+bnUrlEnc(u)+"')");return ' NBURL'+(us.length-1)+'X '});
if(bad)return d;if(!/^[#a-z0-9%.,\s()\-+\/]*$/i.test(r))return d;var f=r.match(/[a-z\-]+(?=\()/gi)||[];for(var i=0;i<f.length;i++)if(!BNFN.test(f[i]))return d;var o=0;for(i=0;i<r.length;i++){if(r[i]=='(')o++;else if(r[i]==')'&&--o<0)return d}if(o)return d;
r=r.replace(/NBURL(\d+)X/g,function(m,k){return us[+k]});return r}
function bnCol(v,d){var r=bnBg(v,'');return r&&!/gradient|url\(/i.test(r)?r:d}
function lyr(l){l=l||{};var t=l.type,lk=bnLink(l.link),st='left:'+nn(l.x,0)+'%;top:'+nn(l.y,0)+'%;'+(l.w!=null&&isFinite(+l.w)?'width:'+(+l.w)+'%;':'')+(l.h!=null&&isFinite(+l.h)?'height:'+(+l.h)+'%;':'')+(l.rot?'transform:rotate('+nn(l.rot,0)+'deg);':'')+(l.op!=null&&isFinite(+l.op)?'opacity:'+Math.max(0,Math.min(1,+l.op))+';':'')+(l.z?'z-index:'+(nn(l.z,0)|0)+';':''),c='';
if(t=='image'){var src=bnImg(l.src);c=src?'<img src="'+esc(src)+'" alt="" draggable="false" style="width:100%;height:100%;object-fit:'+(l.fit=='contain'?'contain':'cover')+';border-radius:'+nn(l.radius,0)+'cqw;display:block">':''}
else if(t=='shape')st+='background:'+bnBg(l.bg,'#fff')+';border-radius:'+nn(l.radius,0)+'cqw;';
else{var al=l.align=='center'||l.align=='right'?l.align:'left';st+='font-size:'+nn(l.size,3)+'cqw;color:'+bnCol(l.color,'#fff')+';font-weight:'+Math.max(100,Math.min(900,nn(l.weight,600)))+';text-align:'+al+';line-height:'+nn(l.lh,1.2)+';white-space:pre-line;';if(t=='button')st+='background:'+bnBg(l.bg,'#fff')+';border-radius:'+nn(l.radius,1)+'cqw;display:flex;align-items:center;justify-content:center;';c=esc(tx(l.text))}
return '<div class="ly" style="'+esc(st)+'"'+(lk?' data-link="'+esc(lk)+'"':'')+'>'+c+'</div>'}
function dz(d){d=d||{};var bg=bnBg(d.bg,'#1d2fe0');return '<div class="dz" style="'+esc('background:'+bg+(/url\(/i.test(bg)?';background-size:cover;background-position:center':''))+'">'+(Array.isArray(d.layers)?d.layers:[]).map(lyr).join('')+'</div>'}
function bnA(v,k){var b=LIVE&&BNR&&BNR[v],sl=b&&b[k];if(!sl||!Array.isArray(sl.slides))return null;var a=sl.slides.filter(function(x){return x&&typeof x=='object'&&x.on!==false});return a.length?{canvas:sl.canvas,ms:sl.ms,slides:a}:null}
function bnCv(cv,dv,d){cv=cv||{};for(var i=0;i<3;i++){var c=cv[FB[dv][i]];if(Array.isArray(c)&&+c[0]>0&&+c[1]>0)return [+c[0],+c[1]]}return d}
function bnMs(v,d){v=+v;return isFinite(v)&&v>0?Math.max(1500,Math.min(60000,v)):d}
function bnGo(u){u=bnLink(u);if(!u)return;var pm=u.match(/^#p=([\w.-]{1,64})$/);if(pm)return bsOpenP(pm[1]);if(/^#(min|exp)$/.test(u)){goHome();return}if(u.charAt(0)=='#'){location.hash=u;return}location.href=u}
function bnSet(el,txt){if(!el)return;if(txt){if(!el._dn)el._dn=[].slice.call(el.childNodes);el.textContent=txt}else if(el._dn){el.textContent='';el._dn.forEach(function(n){el.appendChild(n)});el._dn=null}}
/* "delivery in N minutes" strip: a Banner Studio design (placement top_min) when one is live, else the plain text. {eta} in a text layer = the delivery time of the chosen area */
var sT=[];
function bsStrip(){var e=$('strip');if(!e)return false;var SB=LIVE?bsFor(['top_min']):[];
if(!SB.length){if(e._bs){e._bs=0;e._k='';sT.forEach(clearInterval);sT=[];e.classList.remove('bst','bsr');e.style.aspectRatio='';e.innerHTML=''}return false}
var et=window.v2Eta?+v2Eta()||59:59,k=dev()+'|'+lang+'|'+SB.map(function(x){return x.id}).join(',')+'|'+et;if(e._bs&&e._k===k&&e.querySelector('.slide'))return true;
e._bs=1;e._k=k;sT.forEach(clearInterval);sT=[];NBBS.vars.eta=et;e.classList.add('bst');bsRot(e,SB,sT,false,false);return true}
function bnTop(){var g=function(v,k){var b=LIVE&&BNR&&BNR[v];return b&&b[k]},st=g('min','strip'),t=st&&typeof st=='object'?tx(st).trim():'',e=$('strip');if(e&&!bsStrip())e.textContent=t||(V.min.strip||'')}
function obR(){oT.min.forEach(clearInterval);oT.min=[];var el=$('ob');if(!el)return;var SB=bsFor(['strip_min']);if(SB.length){el.style.display='';el.classList.add('bnr');bsRot(el,SB,oT.min,false,false);return}el.classList.remove('bsr');var B=bnA('min','ob'),dv=dev();
if(B){var c=bnCv(B.canvas,dv,[1200,200]),h='',n=B.slides.length;B.slides.forEach(function(sl,i){var lk=bnLink(sl.link);h+='<div class="slide bz'+(i?'':' on')+'"'+(lk?' data-link="'+esc(lk)+'"':'')+'>'+dz(pick(sl,dv))+'</div>'});
el.classList.add('bnr');el.style.display='';el.style.aspectRatio=c[0]+'/'+c[1];el.innerHTML=h+(n>1?dots(n):'');if(n>1)setup(el,bnMs(B.ms,4000),oT.min);return}
el.classList.remove('bnr');el.style.aspectRatio='';
var d=V.min,oN=Math.max(d.ob.length,d.od.length),oh='',i;
for(i=0;i<oN;i++)oh+='<div class="slide'+(i?'':' on')+'">'+(d.ob[i]?'<img src="'+d.ob[i]+'" alt="অফার '+(i+1)+'">':'<span class="nb">🛍 '+d.od[i][0]+'</span><span class="t1">'+d.od[i][1]+'</span><big>'+d.od[i][2]+'</big><span class="t2">'+d.od[i][3]+'</span>')+'</div>';
el.innerHTML=oh+dots(oN);setup(el,4000,oT.min)}
function pick(sl,dv){for(var i=0;i<3;i++){if(sl[FB[dv][i]])return sl[FB[dv][i]]}return {}}
function heroR(){hT.forEach(clearInterval);hT=[];var SB=bsFor(['home','home_min']);if(SB.length){bsRot($('hero'),SB,hT,true,false);spR();obR();bnTop();bsSlots();return}
var dv=dev(),H=HERO.min,c=H.canvas[dv]||H.canvas.desktop,sls=H.slides,ms=3000,B=bnA('min','hero');
if(B){sls=B.slides;c=bnCv(B.canvas,dv,[800,350]);ms=B.ms==5000?3000:bnMs(B.ms,3000)}
function build(el){var h='',n=sls.length;sls.forEach(function(sl,i){var lk=B?bnLink(sl.link):'';h+='<div class="slide'+(i?'':' on')+'"'+(lk?' data-link="'+esc(lk)+'"':'')+'>'+dz(pick(sl,dv))+'</div>'});
el.classList.remove('bsr');el.style.aspectRatio=c[0]+'/'+c[1];el.innerHTML=h+(B&&n<2?'':'<button class="arr pv" style="left:8px" aria-label="Previous">‹</button><button class="arr nx" style="right:8px" aria-label="Next">›</button>'+dots(n));setup(el,ms,hT)}
build($('hero'));spR();
obR();bnTop();bsSlots()}
window.NurBuyHero={get:function(){return HERO},setConfig:function(cfg){HERO=cfg;heroR()}};
/* ---------- Banner Studio banners (admin > Banner Studio; contract in docs/BANNER_STUDIO.md) ----------
   The catalog carries bs:{banners:[{id,pl,s,e,d}],fonts,now}. Each placement shows its live banners
   (schedule and device checked here, so start/end take effect without a reload); none -> the legacy banner. */
var BSB=null,BSP={},BSSIG='',BSLOT={cat:'bsct',product:'bspd'};
function bsApply(c){var b=c&&c.bs;if(!window.NBBS||!b||!Array.isArray(b.banners)){BSB=null;return}
NBBS.addFonts(b.fonts||[]);if(b.now)NBBS.skew=+b.now-Date.now();BSB=b.banners.filter(function(x){return x&&x.d&&Array.isArray(x.pl)});
BSP={};(c.products||[]).forEach(function(x){if(x&&x.id!=null)BSP[String(x.id)]={n:x.n,bn:x.bn,pr:x.pr,old:x.old,img:x.img,r:x.r}});
NBBS.onCopy=function(v){msg(L('Coupon copied: ','কুপন কপি হয়েছে: ')+v)};BSSIG=bsSig()}
function bsNowS(){return Date.now()+((window.NBBS&&NBBS.skew)||0)}
function bsFor(pls){if(!BSB||!window.NBBS)return [];var dv=dev(),now=bsNowS(),seen={};
return BSB.filter(function(b){if(seen[b.id])return false;if(b.s&&b.s>now||b.e&&b.e<=now)return false;
var ok=pls.some(function(pl){if(b.pl.indexOf(pl)<0)return false;var dd=b.d.devs&&b.d.devs[pl];return !Array.isArray(dd)||dd.indexOf(dv)>=0});
if(ok&&NBBS.design(b.d,dv)){seen[b.id]=1;return true}return false})}
function bsProdF(id){return BSP[id]||null}
/* slides of studio banners; each shows for its own length and replays its entrance when it comes back */
function bsRot(el,B,bag,arrows,lazy){var dv=dev(),d0=NBBS.design(B[0].d,dv),n=B.length,c=0,t0=Date.now();
el.classList.add('bsr');el.style.aspectRatio=d0.w+'/'+d0.h;
el.innerHTML=B.map(function(b,i){return '<div class="slide'+(i?'':' on')+'"></div>'}).join('')+(n>1?(arrows?'<button class="arr pv" style="left:8px" aria-label="Previous">‹</button><button class="arr nx" style="right:8px" aria-label="Next">›</button>':'')+dots(n):'');
var sl=el.querySelectorAll('.slide'),dt=el.querySelectorAll('.dots i');
function ms(i){var d=B[i].d;return +d.show>0?Math.max(1000,Math.min(60000,+d.show)):3000}
function show(i){c=(i+n)%n;t0=Date.now();sl.forEach(function(x,k){x.classList.toggle('on',k==c);if(dt[k])dt[k].classList.toggle('on',k==c)});
NBBS.mount(sl[c],B[c].d,{dev:dv,prod:bsProdF,end:B[c].e||0,now:bsNowS(),lazy:lazy})}
show(0);if(n<2)return;var nx=el.querySelector('.nx'),pv=el.querySelector('.pv');if(nx)nx.onclick=function(){show(c+1)};if(pv)pv.onclick=function(){show(c-1)};
dt.forEach(function(d,i){d.onclick=function(){show(i)}});bag.push(setInterval(function(){if(!document.hidden&&el.isConnected&&Date.now()-t0>=ms(c))show(c+1)},500))}
function bsSlot(el,pls,on){if(!el)return;var B=on?bsFor(pls):[],k=LCUP+'|'+dev()+'|'+lang+'|'+B.map(function(x){return x.id}).join(',');if(el._k===k)return;el._k=k;(el._bt||[]).forEach(clearInterval);el._bt=[];
if(!B.length){el.hidden=true;el.innerHTML='';return}el.hidden=false;bsRot(el,B,el._bt,false,true)}
/* promo (home), category, product and seller-store slots */
function bsSlots(){try{bsSlot($('bspm'),['promo'],true);
bsSlot($('bsct'),['category'],!!(allS&&allS.src=='cat'));bsSlot($('bspd'),['product'],document.body.classList.contains('vd'));bsStore()}catch(e){}}
function bsStore(){var v=$('sellv');if(!v||!v.firstChild)return;var el=v.querySelector('.sl-bs');if(!el){el=document.createElement('div');el.className='bsslot sl-bs';el.hidden=true;var w=v.firstElementChild,at=w.querySelector(':scope>.sl-ab')||w.querySelector(':scope>.sl-pr');w.insertBefore(el,at)}bsSlot(el,['store'],true)}
function bsSig(){return ['home','home_min','strip_min','top_min','sponsored','promo','category','product','store'].map(function(p){return bsFor([p]).map(function(b){return b.id}).join(',')}).join('|')}
/* schedules start and end on their own: re-check every 20 seconds */
setInterval(function(){if(!BSB)return;var s=bsSig();if(s!==BSSIG){BSSIG=s;try{heroR()}catch(e){}}},20000);
(function(){var q=0,f=function(){if(q)return;q=setTimeout(function(){q=0;if(BSB)bsSlots()},60)};['ag','pd'].forEach(function(id){var e=$(id);if(e&&window.MutationObserver)new MutationObserver(f).observe(e,{childList:true})});
var sv=$('sellv');if(sv&&window.MutationObserver)new MutationObserver(function(){if(BSB&&!sv.querySelector('.sl-bs'))f()}).observe(sv,{childList:true})})();
/* "#p=ID" links open that product */
function bsOpenP(id){var t=null;V.min.hot.concat(V.min.best).some(function(x){if(x[8]==='L'&&String(x[9])===id){t=x;return true}});
if(!t){msg(L('This product is not available right now','এই পণ্যটি এখন পাওয়া যাচ্ছে না'));return}PMAP['bs'+id]=t;openPD('bs'+id)}

document.addEventListener('click',function(e){var l=e.target.closest('[data-link]');if(l)bnGo(l.dataset.link)});
(function(){var pd=dev();window.addEventListener('resize',function(){var n=dev();if(n!=pd){pd=n;if(BNR||BSB){try{heroR()}catch(e){}}}})})();
function setup(root,ms,bag){var sl=root.querySelectorAll('.slide'),dt=root.querySelectorAll('.dots i'),c=0;
function go(n){c=(n+sl.length)%sl.length;sl.forEach(function(x,i){x.classList.toggle('on',i==c);dt[i]&&dt[i].classList.toggle('on',i==c)})}
var nx=root.querySelector('.nx'),pv=root.querySelector('.pv');if(nx)nx.onclick=function(){go(c+1)};if(pv)pv.onclick=function(){go(c-1)};
dt.forEach(function(d,i){d.onclick=function(){go(i)}});if(sl.length>1)(bag||timers).push(setInterval(function(){go(c+1)},ms))}
function dots(n){return '<div class="dots">'+Array.apply(0,Array(n)).map(function(_,i){return '<i class="'+(i?'':'on')+'"></i>'}).join('')+'</div>'}
var WL={};try{WL=JSON.parse(localStorage.getItem('nb_wl')||'{}')}catch(x){}
/* saved items from the retired Express store are dropped */
Object.keys(WL).forEach(function(k){if(k.indexOf('exp')==0)delete WL[k]});
function wlSave(){try{localStorage.setItem(AU.uid?'nb_wl_'+AU.uid:'nb_wl',JSON.stringify(WL))}catch(x){}wlPush()}
/* the wishlist also lives in the account on the server, so it survives other browsers and devices */
function wlPush(){if(!(LIVE&&AU.uid&&PROF))return;PROF.wl=Object.keys(WL).filter(function(k){return WL[k]}).slice(0,500);PROF.wls=WLS;saveProf()}
function wlK(k){var p=PMAP[k]||findP(k);return p?'min'+(typeof p[1]=='object'?p[1].en:p[1]):k}
function wlHearts(){document.querySelectorAll('.pc').forEach(function(c){var b=c.querySelector('.wh');if(b&&c.dataset.k)b.classList.toggle('on',!!WL[wlK(c.dataset.k)])})}
function toggleWL(k,btn){var p=PMAP[k]||findP(k);var ck=wlK(k);if(p)PMAP[ck]=p;var on=WL[ck];if(on)delete WL[ck];else WL[ck]='min';wlSave();wlHearts();msg(!on?L('Added to wishlist','উইশলিস্টে যোগ হয়েছে'):L('Removed from wishlist','উইশলিস্ট থেকে সরানো হয়েছে'))}
function mcard(p,k,key,nm){var en=typeof p[1]=='object'?p[1].en:p[1],sh=pdShop(en,hsh(en)),lg=LSLG&&LSLG[sh],pr=+p[3],od=+p[4],inC=!!cart[key],cs=pClosed(en),fee=LIVE?(pr>=locFree('min')?L('Free','ফ্রি'):'৳'+(locBase('min')!=null?locBase('min'):30)):pr>=FREEMIN()?L('Free','ফ্রি'):'৳30',f2=function(v){return (Math.round(v*100)/100).toFixed(2)},g=galOf(p);
return '<div class="pc mc'+(cs?' cl':'')+'" data-k="'+key+'"><div class="im">'+PIC(imgOf(p),p[0],nm)+(g&&g.length>1&&window.NB_HOVER?'<img class="pi pi2" src="'+tU(g[1],window.NB_TW||640)+'" data-o="'+esc(g[1])+'" alt="" loading="lazy" decoding="async" onerror="var o=this.dataset.o;if(o&&this.src!=o){this.src=o;return}this.remove()">':'')+(cs?'<span class="mcl"><b>'+shClosedLbl(cs)+'</b>'+(cs.nx?'<small>'+esc(cs.nx)+'</small>':'')+'</span>':'')
+'<span class="mlg">'+(lg?'<img src="'+lg+'" alt="" loading="lazy" onerror="this.remove()">':'<b>'+esc(String(sh||'N').trim().charAt(0).toUpperCase())+'</b>')+'</span>'
+'<button class="wh'+(WL[wlK(key)]?' on':'')+'" aria-label="Wishlist"><svg viewBox="0 0 24 24"><path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/></svg></button>'
+'<button class="add pl'+(inC?' done':'')+(cs?' dis':'')+'" data-k="'+key+'" aria-label="'+L('Add to cart','কার্টে যোগ করুন')+'">'+(inC?MCK:MCP)+'</button></div>'
+'<div class="msh">'+esc(sh)+'</div><h4>'+nm+'</h4>'+rsCard(p)
+('<div class="mmt"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'+(window.v2EtaL?v2EtaL():L('59 mins','৫৯ মিনিট'))+'<i>&bull;</i><svg viewBox="0 0 24 24"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l3-7h5l4 7M9 10L8 7H5M14 10l-1-3h3"/></svg>'+fee+'</div>')
+'<div class="mpr">'+(vrFrom(p)?'<small style="font-size:11px;color:#777;margin-right:4px">'+L('From','শুরু')+'</small>':'')+'<b'+(od>pr?' class="dc"':'')+'>৳ '+f2(pr)+'</b>'+(od>pr?'<del>৳ '+f2(od)+'</del>':'')+'</div></div>'}
var MCP='<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',MCK='<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
function card(p,best,k){var nm=(lang=='en'&&typeof p[1]=='string'&&BN.test(p[1]))?enName(p[1]):tx(p[1]),key=k+(typeof p[1]=='object'?p[1].en:p[1]);PMAP[key]=p;return mcard(p,k,key,nm)}
function bnN(n){return lang=='bn'?String(n).replace(/\d/g,function(d){return '০১২৩৪৫৬৭৮৯'[d]}):String(n)}
var AU={uid:null,next:null};function cnt(){var n=Object.keys(cart).length;document.querySelectorAll('.cc').forEach(function(e){e.textContent=n})}
var HK='nb_hist',H=[];try{H=JSON.parse(localStorage.getItem(HK)||'[]').filter(function(o){return o&&String(o.k).indexOf('exp')!=0})}catch(x){}
function saveH(){try{localStorage.setItem(HK,JSON.stringify(H))}catch(x){}}
function histR(fresh){var HV=H;$('hist').innerHTML=HV.length?HV.slice(0,12).map(function(o){var p=o.p;return '<div class="hi" data-k="'+esc(o.k)+'"><div class="im">'+PIC(imgOf(p),p[0],'')+'</div><b>'+tx(p[1])+'</b><span>BDT '+p[3]+'</span></div>'}).join(''):'<div class="hempty">কোনো পণ্যে ক্লিক করলে এখানে ব্রাউজিং হিস্টরি জমা হবে</div>';
var f=$('hist').firstElementChild;if(fresh&&HV.length&&f.animate)f.animate([{transform:'scale(.6)',opacity:0},{transform:'scale(1)',opacity:1}],{duration:350,easing:'ease-out'})}
function addHist(k){var p=PMAP[k]||null;V.min.hot.concat(V.min.best).forEach(function(x){if('min'+x[1]==k)p=x});NEWL().forEach(function(x){if('new'+(typeof x[1]=='object'?x[1].en:x[1])==k)p=x});if(!p)return;
H=H.filter(function(o){return o.k!=k});H.unshift({k:k,p:p});H=H.slice(0,60);saveH();histR(1)}
$('hclr').onclick=function(e){e.preventDefault();H=[];saveH();histR();if(window.renderHist)renderHist()};
$('hall').onclick=function(e){e.preventDefault();if(window.openHist)openHist()};
/* ===== NEW PRODUCTS: auto-listed =====
 Each product: [emoji, name | {en,bn}, stars, price, oldPrice, imageUrl, addedISO]. Anything added in the last NEW_DAYS days shows
 automatically (newest first). Live use:  NurBuyNew.add(product)  |  NurBuyNew.set(list)  |  NurBuyNew.load('/api/new-products') */
var NEW_DAYS=30,NEW_MAX=18;
function dAgo(n){return new Date(Date.now()-n*864e5).toISOString()}
var NEWP=[['🥭',{en:'Himsagar Mango (1 kg)',bn:'হিমসাগর আম (১ কেজি)'},5,180,220,'',dAgo(0)],['🍇',{en:'Black Grapes (500 g)',bn:'কালো আঙ্গুর (৫০০ গ্রাম)'},4,320,380,'',dAgo(1)],['🥬',{en:'Organic Spinach',bn:'অর্গানিক পালংশাক'},4,40,50,'',dAgo(2)],['🍯',{en:'Sundarban Honey (500 g)',bn:'সুন্দরবনের মধু (৫০০ গ্রাম)'},5,650,780,'',dAgo(4)],['🧀',{en:'Cheddar Cheese (200 g)',bn:'চেডার চিজ (২০০ গ্রাম)'},4,420,480,'',dAgo(6)],['🥜',{en:'Roasted Almonds (250 g)',bn:'রোস্টেড কাঠবাদাম (২৫০ গ্রাম)'},5,520,600,'',dAgo(9)],['🍞',{en:'Brown Bread',bn:'ব্রাউন ব্রেড'},4,90,110,'',dAgo(12)],['🐟',{en:'Fresh Prawn (500 g)',bn:'তাজা চিংড়ি (৫০০ গ্রাম)'},4,750,850,'',dAgo(20)],['🧴',{en:'Aloe Vera Gel',bn:'অ্যালোভেরা জেল'},4,260,320,'',dAgo(26)],['🔦',{en:'Rechargeable Torch',bn:'রিচার্জেবল টর্চ'},4,450,550,'',dAgo(45)]];
function NEWL(){return NEWA().slice(0,NEW_MAX)}
function NEWA(){var lim=NEW_DAYS*864e5,t=Date.now();return NEWP.filter(function(p){var d=Date.parse(p[6]);return LIVEONLY||isNaN(d)||t-d<=lim}).sort(function(a,b){return Date.parse(b[6])-Date.parse(a[6])})}
function renderNew(){var L=NEWL(),sec=$('newsec');sec.style.display=L.length?'':'none';$('newr').innerHTML=L.map(function(p){return card(p,2,'new')}).join('')}
window.NurBuyNew={add:function(p){NEWP.unshift([p[0]||'🆕',p[1],p[2]||4,p[3],p[4]||p[3],p[5]||'',p[6]||new Date().toISOString()]);renderNew()},set:function(l){NEWP=l;renderNew()},load:function(u){fetch(u).then(function(r){return r.json()}).then(function(l){NurBuyNew.set(l)}).catch(function(){})}};
var PMAP={},allS=null,BATCH=30;
var PRT={min:[[[30,120],[40,160],[30,120],[60,500]],[[250,900],[200,600],[500,1800],[300,1200]],[[650,950],[900,1300],[200,450],[400,1100]],[[80,260],[250,900],[100,500],[600,2200]],[[5,250],[150,900],[50,400],[200,2500]],[[60,600],[80,900],[1200,6500],[200,2500]],[[6000,70000],[1500,60000],[28000,110000],[600,15000]],[[60,600],[120,1100],[30,500],[10,300]],[[120,350],[150,550],[200,650],[40,300]]]};
function PRC(v,i,gi,h){var r=(PRT[v][i]||[[30,300]])[gi]||[30,300],f=Math.pow((h%997)/997,1.5),p=r[0]+f*(r[1]-r[0]),st=p<100?5:p<1000?10:p<10000?50:100;return Math.max(5,Math.round(p/st)*st)}
function catalog(v,src){var out=[],seen={};
function push(p,f,k){if(LIVEONLY&&p[8]!=='L')return;var key=k+(typeof p[1]=='object'?p[1].en:p[1]);if(seen[key])return;seen[key]=1;out.push({p:p,f:f,k:k})}
var H=function(){V[v].hot.forEach(function(p){push(p,0,v)})},B=function(){V[v].best.forEach(function(p){push(p,1,v)})},N=function(){if(LIVEONLY&&src!='new')return;NEWA().forEach(function(p){push(p,2,'new')})};
if(src=='best'){B();H();N()}else if(src=='new'){N();H();B()}else{H();B();N()}
var em=CEM,A=CDS[v].en,Bn=CDS[v].bn;
A.forEach(function(c,i){c.g.forEach(function(g,gi){g[1].forEach(function(t,ti){var bn=Bn[i]&&Bn[i].g[gi]&&Bn[i].g[gi][1][ti]||t,h=hsh(t+i),pr=PRC(v,i,gi,h);push([em[i],{en:t,bn:bn},3+h%3,pr,Math.round(pr*(1.15+(h%20)/100)/5)*5],0,v)})})});
return out}
function catItems(S){if(LIVEONLY){var v0=S.v,c0=CDS[v0].en[S.i],o0=[],sn0={};if(!c0)return o0;V[v0].hot.concat(V[v0].best).forEach(function(p){if(p[8]!=='L'||p[12]!==c0.n)return;if(S.gi!=null){var g0=c0.g[S.gi];if(!g0||p[13]!==g0[0])return}var kk=v0+enName(p[1]);if(sn0[kk])return;sn0[kk]=1;o0.push({p:p,f:V[v0].hot.indexOf(p)>-1?0:1,k:v0})});return o0}var v=S.v,em=CEM,A=CDS[v].en,Bn=CDS[v].bn,c=A[S.i],out=[],seen={};if(!c)return out;
var add=function(p,f,k){if(LIVEONLY&&p[8]!=='L')return;var key=k+(typeof p[1]=='object'?p[1].en:p[1]);if(seen[key])return;seen[key]=1;out.push({p:p,f:f,k:k})};
if(S.gi==null){V[v].hot.forEach(function(p){if(p[0]==em[S.i])add(p,0,v)});V[v].best.forEach(function(p){if(p[0]==em[S.i])add(p,1,v)})}
c.g.forEach(function(g,gi){if(S.gi!=null&&S.gi!=gi)return;g[1].forEach(function(t,ti){if(S.ti!=null&&S.ti!=ti)return;var bn=Bn[S.i]&&Bn[S.i].g[gi]&&Bn[S.i].g[gi][1][ti]||t,h=hsh(t+S.i),pr=PRC(v,S.i,gi,h);add([em[S.i],{en:t,bn:bn},3+h%3,pr,Math.round(pr*(1.15+(h%20)/100)/5)*5],0,v)})});return out}
function catTitle(){var c=CDS[allS.v][lang][allS.i];if(!c)return '';if(allS.gi!=null&&allS.ti!=null)return c.g[allS.gi][1][allS.ti];if(allS.gi!=null)return c.g[allS.gi][0];return c.n}
function openCat(i,gi,ti){if(i==null||i<0||!CDS[view].en[i])return openAll('all');hideM();openAll('cat',{v:view,i:i,gi:gi==null||gi===''?null:+gi,ti:ti==null||ti===''?null:+ti})}
function renderAll(){if(!allS)return;var cat=allS.src=='cat',d=cat?catItems(allS):allS.src=='search'?(window.searchItems?searchItems(allS.q):[]):catalog(view,allS.src),n=Math.min(allS.shown,d.length),rem=d.length-n,T={hot:['Hot Deals','হট ডিলস'],best:['Best Selling Products','সেরা বিক্রিত পণ্য'],'new':['New Products','নতুন প্রোডাক্ট'],all:['All Products','সব পণ্য']}[allS.src]||['',''];
$('att').textContent=cat?catTitle():allS.src=='search'?(lang=='bn'?'"'+allS.q+'" এর ফলাফল':'Results for "'+allS.q+'"'):(lang=='bn'?T[1]:T[0]);
var ac=$('ach');if(cat){var cc=CDS[allS.v][lang][allS.i];ac.innerHTML='<button type="button" data-ag="" class="'+(allS.gi==null?'on':'')+'">'+(lang=='bn'?'সব':'All')+'</button>'+cc.g.map(function(g,gi){return '<button type="button" data-ag="'+gi+'" class="'+(allS.gi==gi?'on':'')+'">'+g[0]+'</button>'}).join('')}else ac.innerHTML='';$('abk').textContent=lang=='bn'?'← ফিরে যান':'← Back';
$('acnt').textContent=lang=='bn'?n+' / '+d.length+' টি পণ্য':'Showing '+n+' of '+d.length+' products';
$('ag').innerHTML=d.length?d.slice(0,n).map(function(x){return card(x.p,x.f,x.k)}).join(''):'<div class="hv-em" style="grid-column:1/-1"><div>'+uic('search')+'</div><p>'+(lang=='bn'?'কোনো পণ্য পাওয়া যায়নি। অন্য শব্দ দিয়ে খুঁজুন।':'No products found. Try a different search.')+'</p></div>';
$('amore').parentNode.style.display=rem>0?'':'none';$('amore').textContent=(lang=='bn'?'আরও দেখুন':'Load More')+' ('+Math.min(rem,BATCH)+')'}
function openAll(src,ex){if(document.body.classList.contains('vp'))closeProf();if(document.body.classList.contains('vo'))closeOrd();closeShops();closePD();if(window.cpS&&cpS.o){closeCP()}allS=Object.assign({src:src,shown:BATCH,pushed:false},ex||{});document.body.classList.add('va');try{history.pushState({a:1},'','#all-'+src);allS.pushed=true}catch(e){}renderAll();window.scrollTo(0,0)}
function closeAll(){document.body.classList.remove('vq');if(!allS&&!document.body.classList.contains('va'))return;allS=null;document.body.classList.remove('va');window.scrollTo(0,0)}
$('abk').onclick=function(){NAV.back()};
$('amore').onclick=function(){if(allS){allS.shown+=BATCH;renderAll()}};
$('ach').addEventListener('click',function(e){var b=e.target.closest('[data-ag]');if(!b||!allS)return;allS.gi=b.dataset.ag===''?null:+b.dataset.ag;allS.ti=null;allS.shown=BATCH;renderAll();window.scrollTo(0,0)});
window.addEventListener('popstate',function(){if(document.body.classList.contains('vd'))return;closeAll()});
document.addEventListener('click',function(e){var a=e.target.closest('a[data-all]');if(a){e.preventDefault();openAll(a.dataset.all)}});
var tr=$('shopl'),pz=0;
tr.addEventListener('mouseenter',function(){pz=1});tr.addEventListener('mouseleave',function(){pz=0});
tr.addEventListener('touchstart',function(){pz=1},{passive:true});tr.addEventListener('touchend',function(){setTimeout(function(){pz=0},3000)});
function render(){var v='min',d=V.min;timers.forEach(clearInterval);timers=[];
var se0=$('strip');if(se0&&!se0._bs)se0.textContent=d.strip;hideM();histR();if(CDS)buildNav();if(window.cpS&&cpS.o){cpS.s='list';cpR()}
heroR();
/* two rows of five on mobile: nine categories + "All" (opens the full category page) */
window.catCirc=function(){$('cats').innerHTML=V[view].cats.slice(0,9).map(function(c){var nm=window.v2CatL?v2CatL(c):c[1];return '<button class="cat" data-cn="'+esc(c[1])+'"><s>'+PIC(c[2]||IMG[enName(c[1])],c[0],nm)+'</s>'+esc(nm)+'</button>'}).join('')+'<button class="cat call" data-cn="" aria-label="'+L('All categories','সব ক্যাটাগরি')+'"><s><svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/></svg></s>'+L('All','সব')+'</button>';}
catCirc();
var rowL=function(src,f,arr){return (window.CDS?catalog(v,src).slice(0,12).map(function(x){return {p:x.p,k:x.k}}):arr.map(function(p){return {p:p,k:v}})).map(function(x){return card(x.p,f,x.k)}).join('')};
$('hotr').innerHTML=rowL('hot',0,d.hot);
$('bestr').innerHTML=rowL('best',1,d.best);
$('hotr').scrollLeft=0;$('bestr').scrollLeft=0;autoRow($('hotr'),3200);autoRow($('bestr'),3900);
renderShops();$('shopl').scrollLeft=0;renderNew();
timers.push(setInterval(function(){if(pz)return;var cs=tr.querySelectorAll('.sc'),nx=null;
for(var i=0;i<cs.length;i++){if(cs[i].offsetLeft>tr.scrollLeft+8){nx=cs[i];break}}
var end=tr.scrollLeft+tr.clientWidth>=tr.scrollWidth-4;
tr.scrollTo({left:(nx&&!end)?nx.offsetLeft:0,behavior:'smooth'})},3000));}
$('hero').addEventListener('change',function(e){var f=e.target.files&&e.target.files[0];if(!f)return;var r=new FileReader(),sl=e.target.closest('.slide');r.onload=function(){sl.innerHTML='<img src="'+r.result+'" alt="ব্যানার">'};r.readAsDataURL(f)});

var VAR={},ATC=null;
function vrOf(p){var r=p&&p[8]==='L'?p[14]:null;return r&&r.v&&r.v.length&&r.a&&r.a.length?r:null}
function vrFrom(p){var r=vrOf(p);if(!r)return false;var a=r.v.map(function(v){return +v.price});return Math.min.apply(0,a)!=Math.max.apply(0,a)}
function vrGroups(r){return r.a.map(function(a){var seen=[],o=[];r.v.forEach(function(v){var x=v.o&&v.o[a.n];if(x!=null&&seen.indexOf(x)<0){seen.push(x);var q={n:String(x)};if(a.t=='color'&&r.hex&&r.hex[x])q.sw=r.hex[x];o.push(q)}});return{id:'vr',vr:1,t:a.t,l:a.n,o:o,d:0}})}
function vrMatch(A,upto){return A.vr.v.filter(function(v){for(var j=0;j<upto;j++){var g=A.g[j];if(String((v.o||{})[g.l])!==g.o[A.sel[j]].n)return false}return true})}
function vrCur(A){var l=vrMatch(A,A.g.length);return l[0]||null}
function vrAnyStk(A){return A.vr.v.some(function(v){return +v.stock>0})}
function vrAvail(A,gi,oi){var g=A.g[gi],nm=g.o[oi].n,any=vrAnyStk(A);return vrMatch(A,gi).some(function(v){return String((v.o||{})[g.l])===nm&&(!any||+v.stock>0)})}
function vrNorm(A,from){for(var j=from+1;j<A.g.length;j++){if(!vrAvail(A,j,A.sel[j])){var f=-1;for(var i=0;i<A.g[j].o.length;i++){if(vrAvail(A,j,i)){f=i;break}}A.sel[j]=f<0?0:f}}}
function vrInit(r,g,prev){var A={vr:r,g:g,sel:[]},ok=prev&&prev.sel&&prev.sel.length==g.length&&prev.sel.every(function(x,i){return g[i].o[x]});if(ok){A.sel=prev.sel.slice();if(vrCur(A))return A.sel}
var v=r.v.filter(function(v){return +v.stock>0})[0]||r.v[0];return g.map(function(x){var i=0;x.o.forEach(function(o,j){if(o.n===String((v.o||{})[x.l]))i=j});return i})}
function vrSync(A){var c=atcCalc(A);if(c.v){A.stock=+c.v.stock||0;A.max=pLim(A.en,A.stock);if(A.q>A.max)A.q=A.max}return c}
function vrRec(A){var c=atcCalc(A),r={sel:A.sel.slice(),u:c.u,old:c.old,lab:c.lab.join(' · ')};if(c.v){r.vid=c.v.id;r.img=c.v.img||'';r.stock=+c.v.stock||0}return r}
function vrGroupHtml(A,gi,at){var g=A.g[gi],sw=g.t=='color';return '<div class="atc-g"><div class="atc-gh"><b>'+esc(g.l)+'</b><small>'+esc(g.o[A.sel[gi]].n)+'</small></div><div class="atc-op">'+g.o.map(function(o,oi){var av=vrAvail(A,gi,oi),on=oi==A.sel[gi],cl='atc-ob'+(on?' on':'')+(av?'':' dis')+(sw&&o.sw?' vr-sw':' vr-ch');
return '<button type="button" class="'+cl+'" '+at(gi,oi)+(av?'':' disabled')+' title="'+esc(o.n)+'" aria-label="'+esc(g.l+': '+o.n)+'">'+(sw&&o.sw?'<i class="vr-dot" style="background:'+esc(o.sw)+'"></i>':esc(o.n))+'</button>'}).join('')+'</div></div>'}
function atcGroups(en,P){if(P&&P[8]==='L'){var r=vrOf(P);return r?vrGroups(r):[]}var n=en.toLowerCase(),t=/fish|rui|hilsa|ilish|prawn|shrimp/.test(n)?'fish':/beef|mutton|chicken|meat|egg/.test(n)?'meat':/tablet|medicine|napa|paracetamol|syrup|saline/.test(n)?'med':/burger|pizza|biryani|kebab|roll|noodle|fries|kacchi/.test(n)?'food':'gen';
var W=[['500 g',.53,'500 g'],['1 kg',1,'1 kg'],['2 kg',1.97,'2 kg']];
if(t=='meat')return [{id:'w',l:L('Select weight','ওজন বাছাই করুন'),o:W.map(function(w){return{n:w[0],m:w[1]}}),d:1},{id:'c',l:L('Cut type','কাটের ধরন'),o:[{n:L('Mince','কিমা'),a:0},{n:L('Curry cut','কারি কাট'),a:0},{n:L('Boneless','হাড়ছাড়া'),a:50}],d:0}];
if(t=='fish')return [{id:'w',l:L('Select weight','ওজন বাছাই করুন'),o:W.map(function(w){return{n:w[0],m:w[1]}}),d:1},{id:'c',l:L('Cleaning','কাটা-বাছা'),o:[{n:L('Whole','আস্ত'),a:0},{n:L('Cleaned','পরিষ্কার'),a:20},{n:L('Steak cut','টুকরা'),a:30}],d:1}];
if(t=='med')return [{id:'p',l:L('Pack size','প্যাক'),o:[{n:L('1 strip','১ পাতা'),m:1},{n:L('3 strips','৩ পাতা'),m:2.8},{n:L('Box','বক্স'),m:9}],d:0}];
if(t=='food')return [{id:'s',l:L('Size','সাইজ'),o:[{n:L('Regular','রেগুলার'),m:1},{n:L('Large','বড়'),m:1.35}],d:0},{id:'e',l:L('Add-on','এড-অন'),o:[{n:L('None','কিছু না'),a:0},{n:L('Extra cheese','এক্সট্রা চিজ'),a:30},{n:L('Extra spicy','ঝাল বেশি'),a:0}],d:0}];
return [{id:'p',l:L('Select pack','প্যাক বাছাই করুন'),o:[{n:L('Regular','রেগুলার'),m:1},{n:L('Family pack (x2)','ফ্যামিলি (x২)'),m:1.9},{n:L('Value pack (x5)','ভ্যালু (x৫)'),m:4.6}],d:0}]}
function atcCalc(A){A=A||ATC;if(A.vr){var v=vrCur(A);if(v){var u0=+v.price||0,o0=+v.old>u0?+v.old:u0;return{u:u0,old:o0,lab:[v.name||A.g.map(function(g,i){return g.o[A.sel[i]].n}).join(' / ')],vid:v.id,v:v}}}var base=A.p[3],m=1,a=0,lab=[];A.g.forEach(function(g,i){var o=g.o[A.sel[i]];if(o.m)m*=o.m;if(o.a)a+=o.a;if(g.pct)m*=1+g.pct[A.sel[i]];lab.push(o.n)});var u=Math.round(base*m+a);return{u:u,old:Math.round(A.p[4]*m+a),lab:lab}}
function atcRender(){var A=ATC;if(!A)return;var c=A.vr?vrSync(A):atcCalc(),p=A.p,nm=A.nm,oos=!!(A.vr&&c.v&&+c.v.stock<=0),off=(A.vr?c.old>c.u:p[4]>p[3])?Math.round((c.old-c.u)*100/c.old):0,sv=Math.max(0,c.old-c.u);
var ex=A.k in cart;
if(A.mode=='buy'&&A.step>1){atcR2();return}
var h='<div class="atc-gr"></div><div class="atc-hd"><b>'+(A.mode=='buy'?L('Buy Now','এখনই কিনুন'):L('Add to Cart','কার্টে যোগ করুন'))+'</b><button class="atc-x" data-at="x" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="atc-bd">'
+'<div class="atc-pt"><div class="atc-im">'+(off?'<em>-'+off+'%</em>':'')+PIC((c.v&&c.v.img)||imgOf(p),p[0],nm,'')+'</div><div class="atc-in"><h3>'+esc(nm)+'</h3><div class="atc-sb">'+L('Sold by','বিক্রেতা')+' <b>'+esc(A.shop)+'</b> <i>✓</i></div>'+(p[8]==='L'?'':'<div class="atc-rt"><u>'+'★'.repeat(Math.round(A.rt))+'☆'.repeat(5-Math.round(A.rt))+'</u> '+A.rt.toFixed(1)+' · '+A.rc+' '+L('reviews','রিভিউ')+' · '+A.sold+' '+L('sold','বিক্রি')+'</div>')
+'<div class="atc-pr"><b>'+pdMoney(c.u)+'</b>'+(c.old>c.u?'<del>'+pdMoney(c.old)+'</del><span>'+L('Save ','সাশ্রয় ')+pdMoney(sv)+'</span>':'')+'</div>'
+'<div class="atc-stk'+(A.stock>9?' ok':'')+(oos?' oos':'')+'">'+(oos?L('Out of Stock','স্টক শেষ'):A.stock>9?L('In stock','স্টকে আছে'):L('Only '+A.stock+' left in stock','মাত্র '+A.stock+'টি বাকি'))+'</div></div></div>';
A.g.forEach(function(g,gi){if(g.vr){h+=vrGroupHtml(A,gi,function(a,b){return 'data-at="o" data-g="'+a+'" data-o="'+b+'"'});return}h+='<div class="atc-g"><div class="atc-gh"><b>'+g.l+'</b><small>'+esc(g.o[A.sel[gi]].n)+'</small></div><div class="atc-op">'+g.o.map(function(o,oi){var pr='';if(g.o[0].m!==undefined&&o.m!==undefined&&g.id!='s'||o.m!==undefined&&g.id=='s'&&o.m!=1){pr='<small>'+pdMoney(Math.round(p[3]*o.m))+'</small>'}else if(o.a){pr='<small>+'+pdMoney(o.a)+'</small>'}else if(g.pct&&g.pct[oi]){pr='<small>+'+Math.round(g.pct[oi]*100)+'%</small>'}
return '<button type="button" class="atc-ob'+(oi==A.sel[gi]?' on':'')+'" data-at="o" data-g="'+gi+'" data-o="'+oi+'">'+(o.sw?'<i class="atc-sw" style="background:'+o.sw+'"></i>':'')+esc(o.n)+pr+'</button>'}).join('')+'</div></div>'});
h+='<div class="atc-q"><div><b>'+L('Quantity','পরিমাণ')+'</b>'+(A.max<99?'<small>'+L('Max '+A.max+' per order','প্রতি অর্ডারে সর্বোচ্চ '+bnN(A.max)+'টি')+'</small>':'')+'</div><div class="atc-st"><button type="button" data-at="dec"'+(A.q<=1?' disabled':'')+'>−</button><span>'+A.q+'</span><button type="button" data-at="inc"'+(A.q>=A.max?' disabled':'')+'>+</button></div></div></div>'
+(A.mode=='buy'?'<div class="atc-ft"><button type="button" class="atc-go" data-at="next"'+(oos?' disabled':'')+'>'+L('Next','পরবর্তী')+' · '+pdMoney(c.u*A.q)+'</button></div>':'<div class="atc-ft"><button type="button" class="atc-go" data-at="add"'+(oos?' disabled':'')+'>'+(ex?L('Update Cart','কার্ট আপডেট'):L('Add to Cart','কার্টে যোগ করুন'))+' · '+pdMoney(c.u*A.q)+'</button>'+(ex?'<button type="button" class="atc-rm" data-at="rm">'+L('Remove from cart','কার্ট থেকে সরান')+'</button>':'')+'</div>');
$('atcs').innerHTML=h}
function atcOpen(k,mode,step,pre){var p=findP(k);if(!p)return;if((mode=='buy')&&!AU.uid){lgrOpen({k:k,step:step,pre:pre});return}var en=enName(p[1]),h=hs(en),g=atcGroups(en,p),stock=(LIVE&&LST[en]!=null?Math.max(1,LST[en]):3+(h%14)),prev=VAR[k];
var shop=pdShop(en,h);
ATC={k:k,p:p,en:en,nm:lang=='en'?en:tx(p[1]),g:g,vr:vrOf(p),sel:vrOf(p)?vrInit(vrOf(p),g,prev):g.map(function(x,i){return prev&&prev.sel&&prev.sel[i]!=null?prev.sel[i]:(x.d||0)}),q:Math.max(1,+cart[k]||1),stock:stock,max:pLim(en,stock),shop:shop,rt:Math.min(5,Math.max(3.5,p[2]-(h%3)*.1)),rc:120+(h%700),sold:((h%40)+8)/10+'k',mode:mode||'cart',step:step||1,ai:(window.geoFull&&geoFull())?-2:((PROF.addr&&PROF.addr.length)?0:-1),newA:'',loc:($('lcn')||{}).textContent||'',pay:'cod',mob:PROF.mobile||'',em:PROF.email||'',gn:''};
if(pre){if(pre.sel)ATC.sel=pre.sel.slice();if(pre.q)ATC.q=pre.q}
if(ATC.vr&&pre&&pre.sel&&!vrCur(ATC))ATC.sel=vrInit(ATC.vr,g,null);if(ATC.vr)vrSync(ATC);if(ATC.q>ATC.max)ATC.q=ATC.max;atcRender();$('atco').classList.add('o');document.body.style.overflow='hidden';fcUpd()}

function atcFees(A){if(A.cart)return cartFees(A);var c=atcCalc(A),sub=c.u*A.q,FREE=FREEMIN(),fee=LIVE?locFee('min',sub,1):(sub>=FREE?0:(30)),cod=A.pay=='cod'?CODFEE:0,dsc=(A.cp&&A.cp.key==c.u+'x'+A.q)?Math.min(A.cp.d,sub):0;return{sub:sub,disc:dsc,fee:fee,cod:cod,total:Math.round((sub-dsc+fee+cod)*100)/100,u:c.u,lab:c.lab.join(' · '),vid:c.vid||''}}
function atcMobOk(A){var m=normM(A.mob);return /^01[3-9]\d{8}$/.test(m)}
function atcEmOk(A){var e=(A.em||'').trim();return !e||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}
function atcReady(A){return atcMobOk(A)&&atcEmOk(A)&&!!atcAddr(A)&&(!LIVE||locOk('min'))}
function atcAddr(A){if(A.ai==-2){var g=window.geoFull&&geoFull();return g?g.text:''}if(A.ai>=0&&PROF.addr&&PROF.addr[A.ai])return PROF.addr[A.ai];return (A.newA||'').trim()}
var IPIN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.5 7-12a7 7 0 00-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/></svg>';
function atcR2(){var A=ATC,F=atcFees(A),st=A.step,h='',ttl=st==2?L('Delivery address','ডেলিভারি ঠিকানা'):st==3?L('Review & pay','রিভিউ ও পেমেন্ট'):L('Order placed','অর্ডার সম্পন্ন');
h+='<div class="atc-gr"></div><div class="atc-hd">'+(st<4?'<button class="atc-x atc-bk" data-at="back" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>':'')+'<b style="flex:1;margin-left:'+(st<4?'10':'0')+'px">'+ttl+'</b><button class="atc-x" data-at="x" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
if(st<4)h+='<div class="atc-sp"><i class="on"></i><i class="'+(st>=2?'on':'')+'"></i><i class="'+(st>=3?'on':'')+'"></i></div>';
h+='<div class="atc-bd">';
if(st==2){var sv=PROF.addr||[];
h+='<div class="atc-gh"><b>'+L('Contact','যোগাযোগ')+'</b></div><div class="ad-ct">'+(AU.uid?'':'<label><span>'+L('Full name','পুরো নাম')+' <em>('+L('optional','ঐচ্ছিক')+')</em></span><input id="atcg" class="ad-in ad-ip" autocomplete="name" placeholder="'+L('Your name','আপনার নাম')+'" value="'+esc(A.gn)+'"></label>')+'<label><span>'+L('Mobile number','মোবাইল নম্বর')+' <i>*</i></span><input id="atcm" class="ad-in ad-ip" type="tel" inputmode="numeric" autocomplete="tel" maxlength="16" placeholder="01XXXXXXXXX" value="'+esc(A.mob)+'"></label><small class="ad-er" id="atcme">'+(A.mob&&!atcMobOk(A)?L('Enter a valid 11-digit mobile number','সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন'):'')+'</small><label><span>'+L('Email','ইমেইল')+' <em>('+L('optional','ঐচ্ছিক')+')</em></span><input id="atce" class="ad-in ad-ip" type="email" autocomplete="email" placeholder="name@example.com" value="'+esc(A.em)+'"></label><small class="ad-er" id="atcee">'+(!atcEmOk(A)?L('Enter a valid email or leave it empty','সঠিক ইমেইল দিন বা খালি রাখুন'):'')+'</small></div>';

if(LIVE){var lsy='min',lok=locOk(lsy);h+='<div class="atc-gh" style="margin-top:14px"><b>'+L('Delivery area','ডেলিভারি এলাকা')+' <i style="color:#e5254b;font-style:normal">*</i></b></div><button type="button" id="atclc" class="ad-c'+(lok?' on':'')+'" data-at="loc"><span class="ad-r"></span><span class="ad-t"><b>'+(lok?esc(locText(lsy)):L('Choose your delivery area','ডেলিভারি এলাকা বাছুন'))+'</b><small>'+(lok?L('Delivery charge ','ডেলিভারি চার্জ ')+pdMoney(locBase(lsy))+(lsy=='min'?L(' per shop',' (প্রতি দোকান)'):'')+' · '+L('free over ','ফ্রি: ')+pdMoney(locFree(lsy))+L('',' এর বেশি অর্ডারে')+' · '+L('Change','বদলান'):(L('District, thana, post office and village','জেলা, থানা, পোস্ট অফিস ও গ্রাম')))+'</small></span></button><small class="ad-er" id="atcle"></small>'}
h+='<div class="ad-box" id="atcab">';var gf=window.geoFull&&geoFull();
if(gf)h+='<div class="atc-gh"><b>'+L('Your delivery area','আপনার ডেলিভারি এলাকা')+'</b></div><button type="button" class="ad-c'+(A.ai==-2?' on':'')+'" data-at="asel" data-i="-2"><span class="ad-r"></span><span class="ad-t"><b>'+(gf.v?esc(gf.v):esc(gf.area.split(', ')[0]))+'</b><small>'+esc(gf.v?gf.area:gf.area.split(', ').slice(1).join(', '))+'</small></span></button>';
if(sv.length||!gf)h+='<div class="atc-gh"'+(gf?' style="margin-top:14px"':'')+'><b>'+L('Saved addresses','সেভ করা ঠিকানা')+'</b></div>';
h+=sv.length?sv.map(function(a,i){return '<button type="button" class="ad-c'+(A.ai==i?' on':'')+'" data-at="asel" data-i="'+i+'"><span class="ad-r"></span><span class="ad-t"><b>'+esc(PROF.name||'')+(PROF.mobile?' · '+esc(PROF.mobile):'')+'</b><small>'+esc(a)+'</small></span></button>'}).join(''):(gf?'':'<p class="ad-em">'+L('No saved address yet. Add one below.','এখনও কোনো ঠিকানা সেভ করা নেই। নিচে যোগ করুন।')+'</p>');
h+='<button type="button" class="ad-c'+(A.ai==-1?' on':'')+'" data-at="anew"><span class="ad-r"></span><span class="ad-t"><b>'+L('New address','নতুন ঠিকানা')+'</b><small>'+L('House, road, area','বাসা, রাস্তা, এলাকা')+'</small></span></button>';
if(A.ai==-1)h+='<textarea id="atca" class="ad-in" rows="3" placeholder="'+L('Write your full address (house, road, area)','পূর্ণ ঠিকানা লিখুন (বাসা, রাস্তা, এলাকা)')+'">'+esc(A.newA)+'</textarea>';
h+='</div><small class="ad-er" id="atcae"></small>';
h+='<div class="atc-gh" style="margin-top:18px"><b>'+L('Delivery location','ডেলিভারি লোকেশন')+'</b></div><div class="ad-lc"><span class="ad-pi">'+IPIN+'</span><div class="ad-lt"><b>'+esc(A.loc||L('Not set','সেট করা নেই'))+'</b><small>'+L('Rider will use this to find you','রাইডার এই লোকেশন দেখে আপনাকে খুঁজে নেবে')+'</small></div></div>'
+'<div class="ad-bt"><button type="button" data-at="agps"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="8"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/></svg>'+L('Use current location','বর্তমান লোকেশন')+'</button><button type="button" data-at="amap">'+IPIN+L('Choose on map','ম্যাপে বেছে নিন')+'</button></div>'}
else if(st==3){var ad=atcAddr(A);
h+=(A.cart?cartSumHtml(A):('<div class="ad-sm"><div class="atc-im" style="width:64px;height:64px;font-size:34px">'+PIC(imgOf(A.p),A.p[0],A.nm,'')+'</div><div style="min-width:0"><b>'+esc(A.nm)+'</b><small>'+esc(F.lab)+'</small><small>'+pdMoney(F.u)+' × '+A.q+'</small></div></div>'
))+'<div class="ad-ds"><span class="ad-pi">'+IPIN+'</span><div class="ad-lt"><b>'+esc(ad)+'</b><small>'+((A.ai==-2)?'':esc(A.loc))+'</small><small>'+esc(normM(A.mob))+(A.em.trim()?' · '+esc(A.em.trim()):'')+'</small></div><button type="button" class="ad-ch" data-at="back">'+L('Change','বদলান')+'</button></div>'
+'<div class="atc-gh" style="margin-top:16px"><b>'+L('Payment method','পেমেন্ট পদ্ধতি')+'</b></div>'
+(wlOpt(A,F))+'<button type="button" class="ad-c'+(A.pay=='cod'?' on':'')+'" data-at="pay" data-p="cod"><span class="ad-r"></span><span class="ad-t"><b>'+L('Cash on Delivery','ক্যাশ অন ডেলিভারি')+'</b><small>'+L('Pay when you receive · +','পণ্য হাতে পেয়ে দিন · +')+pdMoney(CODFEE)+'</small></span></button>'
+'<button type="button" class="ad-c'+(A.pay=='online'?' on':'')+'" data-at="pay" data-p="online"><span class="ad-r"></span><span class="ad-t"><b>bKash · Nagad · Card</b><small>'+L('Pay online, no extra charge','অনলাইনে পেমেন্ট, বাড়তি চার্জ নেই')+'</small></span></button>'
+(A.cart&&cartShopsOf(A.cart)>1?mshopHtml():'')+atcCpnHtml(A,F)+'<div class="ad-tt"><div><span>'+L('Subtotal','সাবটোটাল')+'</span><b>'+pdMoney(F.sub)+'</b></div>'+(F.disc?'<div class="g"><span>'+L('Coupon discount','কুপন ছাড়')+' ('+esc(A.cp.code)+')</span><b>− '+pdMoney(F.disc)+'</b></div>':'')+'<div><span>'+L('Delivery fee','ডেলিভারি ফি')+'</span><b>'+(F.fee?pdMoney(F.fee):L('FREE','ফ্রি'))+'</b></div>'+(F.cod?'<div><span>'+L('Cash on Delivery charge','ক্যাশ অন ডেলিভারি চার্জ')+'</span><b>'+pdMoney(F.cod)+'</b></div>':'')+'<div class="t"><span>'+L('Total','মোট')+'</span><b>'+pdMoney(F.total)+'</b></div></div>'+(wlEarn(F))+(A.perr?'<div class="wt-ern" style="background:#ffe9e9;color:#c62828">'+esc(A.perr)+'</div>':'')}
else{h+='<div class="ad-ok"><div class="ad-ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><h3>'+L('Order placed!','অর্ডার হয়ে গেছে!')+'</h3><p>'+L('Order ID','অর্ডার আইডি')+' <b>#'+esc(A.oid)+'</b></p><p class="ad-sb2">'+(A.etaO&&window.v2EtaBox?'':L('Arriving within 59 minutes','সর্বোচ্চ ৫৯ মিনিটে পৌঁছাবে'))+'</p>'+(A.etaO&&window.v2EtaBox?v2EtaBox(A.etaO,true):'')+((A.multi>1)?mshopHtml():'')+((A.wcb>0||A.wpay>0)?'<div class="ad-nt wt-nt"><b>'+L('NurBuy Wallet','NurBuy ওয়ালেট')+'</b><span>'+(A.wpay>0?L('Paid ','ওয়ালেট থেকে কাটা হয়েছে ')+wM(A.wpay)+L(' from your wallet. ','। '):'')+(A.wcb>0?wM(A.wcb)+L(' cashback added to your wallet.',' ক্যাশব্যাক আপনার ওয়ালেটে যোগ হয়েছে।'):'')+'</span></div>':'')+(A.newAcc?'<div class="ad-nt"><b>'+L('Your account is ready','আপনার অ্যাকাউন্ট তৈরি হয়ে গেছে')+'</b><span>'+L('We created an account with ','আমরা এই নম্বর দিয়ে অ্যাকাউন্ট খুলে দিয়েছি: ')+esc(normM(A.mob))+L('. Verify your mobile, add an email and set a password anytime from Profile.','। প্রোফাইল থেকে যেকোনো সময় মোবাইল ভেরিফাই, ইমেইল যোগ ও পাসওয়ার্ড সেট করতে পারবেন।')+(A.emDup?' '+L('The email you entered already belongs to another account, so it was not added.','দেওয়া ইমেইলটি অন্য অ্যাকাউন্টে আগেই ব্যবহৃত, তাই যোগ করা হয়নি।'):'')+'</span></div>':A.exists?'<div class="ad-nt"><b>'+L('Account found','অ্যাকাউন্ট পাওয়া গেছে')+'</b><span>'+L('This mobile number already has an account. Log in to track this order.','এই নম্বরে আগে থেকেই অ্যাকাউন্ট আছে। অর্ডার ট্র্যাক করতে লগইন করুন।')+'</span></div>':'')+'</div>'}
h+='</div><div class="atc-ft">';
if(st==2)h+='<button type="button" class="atc-go" data-at="next">'+L('Next','পরবর্তী')+'</button>';
else if(st==3)h+='<button type="button" class="atc-go" data-at="place">'+L('Place Order','অর্ডার করুন')+' · '+pdMoney(F.total)+'</button>';
else h+='<button type="button" class="atc-go" data-at="trk">'+L('Track order','অর্ডার ট্র্যাক করুন')+'</button><button type="button" class="atc-rm" style="color:#555" data-at="x">'+L('Continue shopping','কেনাকাটা চালিয়ে যান')+'</button>';
h+='</div>';$('atcs').innerHTML=h;if(st==2)atcErrUpd()}
function atcErrUpd(){var A=ATC;if(!A||A.step!=2)return;var T=function(i,t){var e=$(i);if(e)e.textContent=t||''},C=function(i,on){var e=$(i);if(e)e.classList.toggle('bad',!!on)};
var mb=A.mob.trim()?!atcMobOk(A):!!A.err;C('atcm',mb);T('atcme',mb?(A.mob.trim()?L('Enter a valid 11-digit mobile number','সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন'):L('Mobile number is required','মোবাইল নম্বর দিন (বাধ্যতামূলক)')):'');
var eb=!atcEmOk(A);C('atce',eb);T('atcee',eb?L('Enter a valid email or leave it empty','সঠিক ইমেইল দিন বা খালি রাখুন'):'');
if(LIVE){var lb=!!A.err&&!locOk('min');C('atclc',lb);T('atcle',lb?L('Please choose your delivery area','আপনার ডেলিভারি এলাকা বাছুন'):'')}
var ab=!!A.err&&!atcAddr(A);C('atcab',ab);C('atca',ab);T('atcae',ab?(A.ai==-1?L('Please write your delivery address','আপনার ডেলিভারি ঠিকানা লিখুন'):L('Please select your delivery address','আপনার ডেলিভারি ঠিকানা বাছাই করুন')):'')}
function atcPlace(){var A=ATC;if(A.pay=='wallet'){var f0=atcFees(A);if(!AU.uid||wGet(AU.uid).bal<f0.sub-f0.disc+f0.fee)A.pay='online'}var F=atcFees(A),now=new Date(),id='NB30-'+(100000+Math.floor(Math.random()*899999));
if(LIVE)return atcPlaceLive(A,F);if(A.cart){cartPlaceDemo(A,F,id);return}
var o={id:id,t:'m',s:'p',ago:0,h:now.getHours(),m:now.getMinutes(),step:0,eta:{en:'Arriving within 59 minutes',bn:'সর্বোচ্চ ৫৯ মিনিটে পৌঁছাবে'},pay:A.pay=='cod'?['Cash on Delivery','ক্যাশ অন ডেলিভারি']:A.pay=='wallet'?['NurBuy Wallet','NurBuy ওয়ালেট']:['Online','অনলাইন'],ad:atcAddr(A)+((A.loc&&A.ai!=-2)?' · '+A.loc:''),mob:normM(A.mob),em:A.em.trim(),
items:[[A.en+(F.lab?' ('+F.lab+')':''),A.nm+(F.lab?' ('+F.lab+')':''),A.p[0],F.u,A.q,A.shop,A.shop]]};
var owner=AU.uid;
if(!owner){try{var mob=normM(A.mob),dq=window.dupU(mob,A.em,''),ex=dq.m;
if(ex){owner=ex.id;A.exists=true}
else{var nu={id:'u_'+Date.now().toString(36),name:(A.gn||'').trim()||'Customer',email:dq.e?'':A.em.trim(),mobile:mob,ph:'',auto:true};USERS.push(nu);usave();try{localStorage.setItem('nb_sess',nu.id)}catch(e){}loadUserData(nu);PROF.addr=[atcAddr(A)];PROF.mvf=false;saveProf();A.newAcc=true;A.emDup=!!dq.e;owner=nu.id}}catch(e){}}
if(owner){try{var wl=wGet(owner),wp=wPct(),cb=wR(F.sub*wp/100),pw=0;if(A.pay=='wallet'&&wl.bal>=F.total){pw=F.total;wl.bal=wR(wl.bal-pw);wl.tx.unshift({t:'pay',a:pw,oid:id,d:Date.now()})}if(cb>0){wl.bal=wR(wl.bal+cb);wl.tx.unshift({t:'cb',a:cb,oid:id,pct:wp,d:Date.now()})}wl.tx=wl.tx.slice(0,200);wSet(owner,wl);A.wcb=cb;A.wpay=pw}catch(e){}}
try{if(owner==AU.uid)ORD.unshift(o);var key='nb_myord_'+(owner||'g'),a=JSON.parse(localStorage.getItem(key)||'[]');a.unshift(o);localStorage.setItem(key,JSON.stringify(a.slice(0,30)))}catch(e){}
try{var ch=0;if(!PROF.mobile){PROF.mobile=normM(A.mob);ch=1}if(!PROF.email&&A.em.trim()){PROF.email=A.em.trim();ch=1}if(ch)saveProf()}catch(e){}
A.oid=id;A.step=4;atcR2()}
function atcNext(){var A=ATC;
if(A.step==1){A.step=2;atcRender();$('atcs').scrollTop=0;return}
if(A.step==2){if(!atcReady(A)){A.err=1;atcErrUpd();var bd=document.querySelector('#atcs .atc-bd'),fe=document.querySelector('#atcs .bad');if(fe&&bd){bd.scrollTo({top:Math.max(0,fe.offsetTop-90),behavior:'smooth'});fe.classList.remove('shk');void fe.offsetWidth;fe.classList.add('shk');var inp=fe.tagName=='INPUT'||fe.tagName=='TEXTAREA'?fe:null;if(inp)setTimeout(function(){inp.focus({preventScroll:true})},350)}return}A.err=0;A.step=3;atcRender();if(LIVE&&A.cpc&&!(A.cp&&atcFees(A).disc))atcCpn(A.cpc);return}}
function atcPlaceLive(A,F){if(A.busy)return;A.busy=1;A.perr='';var btn=document.querySelector('#atcs [data-at=place]');if(btn){btn.disabled=true;btn.textContent=L('Placing order...','অর্ডার হচ্ছে...')}
var ad=atcAddr(A)+((A.loc&&A.ai!=-2)?' · '+A.loc:'');var lsx='min';if(A.ai!=-2&&locOk(lsx)){var ltx=locText(lsx);if(ad.indexOf(ltx)<0)ad+=', '+ltx}
if(A.cart)return cartPlaceLive(A,F,ad);var it0={id:(A.p&&A.p[9])||A.k,n:cz(A.en)+(F.lab?' ('+F.lab+')':''),bn:cz(A.nm)+(F.lab?' ('+F.lab+')':''),e:A.p[0],unit:F.u,q:A.q,shop:A.shop};if(F.vid){it0.vid=F.vid;it0.variant=F.lab}
var body={view:'min',items:[it0],fee:F.fee,loc_id:locId('min'),pay:A.pay,name:(A.gn||'').trim()||(PROF&&PROF.name)||'',mobile:normM(A.mob),email:A.em.trim(),address:ad,shop:A.shop,extra:{loc:A.loc||''}};if(F.disc&&A.cp)body.coupon=A.cp.code;
nbApi('POST','/orders',body).then(function(r){A.oid=r.order.id;A.etaO=(r.order&&r.order.eta)||null;A.multi=+((r.order.extra||{}).multi||0);A.wcb=r.cashback||0;A.wpay=r.paid||0;A.exists=!!r.exists;A.emDup=!!r.emDup;A.newAcc=!!r.newAcc;if(r.wallet&&r.wallet.bal!=null)WC.bal=r.wallet.bal;
var done=function(){A.busy=0;A.step=4;atcR2()};
if(r.token){TOKN=r.token;try{localStorage.setItem('nb_tok',TOKN)}catch(e){}return nbApi('GET','/auth/me').then(function(m){applyMe(m);return Promise.all([liveOrders(),wRefresh()])}).then(done,done)}
if(AU.uid){ORD.unshift(mapOrd(r.order))}done()}).catch(function(e){A.busy=0;if(e.data&&e.data.code=='login_required'){atcClose();lgrOpen({k:A.k});return}A.perr=liveErr(e);liveFix(e);if(e.data&&String(e.data.code||'').indexOf('coupon_')==0){A.cp=null;A.cperr=cpnErr(e);A.perr=L('Coupon could not be applied. The order was not placed.','কুপন যুক্ত করা যায়নি, অর্ডার হয়নি।')}if(e.data&&e.data.code=='insufficient_wallet')A.pay='online';atcRender()})}
var _ao=atcOpen;atcOpen=function(k){var p0=findP(k),X0=false;if(p0&&!X0){var cs=pClosed(enName(p0[1]));if(cs){msg(L(LSHOP[enName(p0[1])]+' is closed now. ',LSHOP[enName(p0[1])]+' এখন বন্ধ। ')+(cs.nx||''));return}}_ao.apply(this,arguments);if(ATC){ATC.cpc=PCP[ATC.k]||'';ATC.cp=null;ATC.cperr=''}if(LIVE&&AU.uid&&ATC)wRefresh().then(function(){if(ATC&&ATC.step==3)atcRender()})};
function atcClose(){$('atco').classList.remove('o');document.body.style.overflow='';ATC=null;if(window.fcUpd)fcUpd()}
function atcSync(k){var pa=document.getElementById('pdad');if(pa&&window.PDS&&PDS.k==k){var dn=k in cart;pa.classList.toggle('done',dn);pa.textContent=dn?'✓ '+L('Added','যোগ হয়েছে'):L('Add to cart','কার্টে যোগ করুন')}document.querySelectorAll('.add[data-k="'+k.replace(/"/g,'\\"')+'"]').forEach(function(b){var d=k in cart;b.classList.toggle('done',d);if(b.classList.contains('pl')){b.innerHTML=d?MCK:MCP;return}b.textContent=d?'✓ '+L('Added','যোগ হয়েছে'):L('Add to Cart','কার্টে যোগ করুন')})}
(function(){var o=document.createElement('div');o.className='atc-o';o.id='atco';o.innerHTML='<div class="atc" id="atcs" role="dialog" aria-modal="true"></div>';document.body.appendChild(o);
o.addEventListener('click',function(e){if(e.target===o){atcClose();return}var t=e.target.closest('[data-at]');if(!t||!ATC)return;var a=t.dataset.at,A=ATC;
if(a=='x'){atcClose();return}
if(A.cart&&(a=='cpn'||a=='cpk'||a=='cprm')){if(a=='cprm'){CPN[view]='';CPD[view]=null;atcRender();renderCart();return}var cc=a=='cpk'?t.dataset.c:((($('atcc')||{}).value)||'').trim().toUpperCase();if(cc)cartCpnCheck(cc,true,function(){atcRender()});return}
if(a=='cpn'){var cv=$('atcc');atcCpn(((cv&&cv.value)||'').trim().toUpperCase());return}
if(a=='cpk'){atcCpn(t.dataset.c);return}
if(a=='cprm'){A.cp=null;A.cpc='';A.cperr='';delete PCP[A.k];atcRender();return}
if(a=='o'){A.sel[+t.dataset.g]=+t.dataset.o;if(A.vr)vrNorm(A,+t.dataset.g);atcRender();return}
if(a=='inc'){if(A.q<A.max)A.q++;else msg(L('Maximum '+A.max+' per order','প্রতি অর্ডারে সর্বোচ্চ '+bnN(A.max)+'টি'));atcRender();return}
if(a=='dec'){if(A.q>1)A.q--;atcRender();return}
if(a=='rm'){delete cart[A.k];delete VAR[A.k];cnt();atcSync(A.k);atcClose();return}
if(a=='add'){if(A.vr&&A.stock<=0)return;cart[A.k]=A.q;VAR[A.k]=vrRec(A);FC.last=A.k;cnt();atcSync(A.k);atcClose()}});
document.addEventListener('keydown',function(e){if(e.key=='Escape'&&ATC)atcClose()})})();
(function(){var o=$('atco');
o.addEventListener('input',function(e){if(!ATC)return;var id=e.target.id;if(id=='atca')ATC.newA=e.target.value;else if(id=='atcg')ATC.gn=e.target.value;else if(id=='atcm'){ATC.mob=e.target.value;var m1=$('atcme');if(m1)m1.textContent=(ATC.mob&&!atcMobOk(ATC))?L('Enter a valid 11-digit mobile number','সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন'):''}else if(id=='atce'){ATC.em=e.target.value;var e1=$('atcee');if(e1)e1.textContent=atcEmOk(ATC)?'':L('Enter a valid email or leave it empty','সঠিক ইমেইল দিন বা খালি রাখুন')}else return;atcErrUpd()});
o.addEventListener('click',function(e){var t=e.target.closest('[data-at]');if(!t||!ATC)return;var a=t.dataset.at,A=ATC;
if(a=='next'){atcNext();return}
if(a=='back'){if(A.cart&&A.step<=2){atcClose();return}if(A.step>1){A.step--;atcRender()}return}
if(a=='asel'){A.ai=+t.dataset.i;atcRender();return}
if(a=='loc'){if(window.locPick)locPick('min',function(){if(ATC){if((ATC.ai==-1)&&window.geoFull&&geoFull())ATC.ai=-2;atcRender()}});return}
if(a=='anew'){A.ai=-1;atcRender();var ta=$('atca');if(ta)ta.focus();return}
if(a=='pay'){if(t.dataset.p=='wallet'&&t.classList.contains('dis'))return;A.pay=t.dataset.p;atcRender();return}
if(a=='place'){if(A.busy)return;atcPlace();return}
if(a=='trk'){var ex2=A.exists;atcClose();if(ex2){openAuth('login')}else if(window.openOrd)openOrd();return}
if(a=='agps'){if(!navigator.geolocation){msg(L('Location is not available','লোকেশন পাওয়া যায়নি'));return}t.disabled=true;navigator.geolocation.getCurrentPosition(function(p){if(!ATC)return;ATC.loc=L('Current location','বর্তমান লোকেশন')+' ('+p.coords.latitude.toFixed(4)+', '+p.coords.longitude.toFixed(4)+')';atcRender()},function(){if(ATC)atcRender();msg(L('Could not get your location. Choose on map instead.','লোকেশন পাওয়া যায়নি। ম্যাপে বেছে নিন।'))},{timeout:8000});return}
if(a=='amap'){A.map=1;$('mo').style.zIndex=3200;openMap();return}},true);
new MutationObserver(function(){var m=$('mo');if(!m.classList.contains('o')){m.style.zIndex='';if(ATC&&ATC.map){ATC.map=0;ATC.loc=$('lcn').textContent||ATC.loc;if(ATC.step==2)atcRender()}}}).observe($('mo'),{attributes:true,attributeFilter:['class']})})();


var FC={last:null,pos:null};
function fcUpd(){var el=document.getElementById('fcart');if(!el)return;var its=[];try{its=cItems()}catch(e){}var n=its.length,B=document.body.classList,mob=window.innerWidth<900;
var show=n>0&&!B.contains('vk')&&!(mob&&(B.contains('vm')||B.contains('vr')))&&!document.getElementById('atco').classList.contains('o');
if(!show){el.classList.remove('o');return}
var o=its.filter(function(x){return x.k==FC.last})[0]||its[its.length-1],p=o.p,nm=lang=='en'?enName(p[1]):tx(p[1]);
el.querySelector('.fi').innerHTML=PIC(imgOf(p),p[0],nm,'');el.querySelector('.ft b').textContent=L('View cart','কার্ট দেখুন');el.querySelector('.ft small').textContent=n+' '+L(n==1?'Item':'Items','টি পণ্য');
el.classList.add('o');if(!mob)fcPlace()}
function fcPlace(){var el=document.getElementById('fcart');if(!el||window.innerWidth<900){if(el){el.style.left='';el.style.top='';el.style.right=''}return}
var w=el.offsetWidth||190,h=el.offsetHeight||56,x,y;if(FC.pos){x=FC.pos.x;y=FC.pos.y}else{x=window.innerWidth-w-52;y=Math.round(window.innerHeight*.46)}
x=Math.min(Math.max(8,x),window.innerWidth-w-8);y=Math.min(Math.max(8,y),window.innerHeight-h-8);el.style.left=x+'px';el.style.top=y+'px';el.style.right='auto';el.style.bottom='auto'}
(function(){var el=document.createElement('button');el.type='button';el.id='fcart';el.className='fcart';el.setAttribute('aria-label','View cart');el.innerHTML='<span class="fi"></span><span class="ft"><b></b><small></small></span>';document.body.appendChild(el);
try{var sp=JSON.parse(localStorage.getItem('nb_fcpos')||'null');if(sp&&typeof sp.x=='number')FC.pos=sp}catch(e){}
var d=null,moved=false;
el.addEventListener('pointerdown',function(e){if(window.innerWidth<900)return;d={x:e.clientX,y:e.clientY,l:el.offsetLeft,t:el.offsetTop};moved=false;try{el.setPointerCapture(e.pointerId)}catch(x){}});
el.addEventListener('pointermove',function(e){if(!d)return;var dx=e.clientX-d.x,dy=e.clientY-d.y;if(!moved&&Math.abs(dx)+Math.abs(dy)<5)return;moved=true;el.classList.add('dg');FC.pos={x:d.l+dx,y:d.t+dy};fcPlace()});
el.addEventListener('pointerup',function(){if(!d)return;d=null;el.classList.remove('dg');if(moved){try{localStorage.setItem('nb_fcpos',JSON.stringify(FC.pos))}catch(e){}}});
el.addEventListener('click',function(e){if(moved){moved=false;e.preventDefault();return}openCart()});
new MutationObserver(fcUpd).observe(document.body,{attributes:true,attributeFilter:['class']});
window.addEventListener('resize',function(){fcUpd()})})();
(function(){var c0=cnt;cnt=function(){var r=c0.apply(this,arguments);fcUpd();return r}})();

(function(){var Z=4.6,pane=document.createElement('div');pane.className='pd-zm';pane.id='pdzm';pane.innerHTML='<div></div>';document.body.appendChild(pane);var inner=pane.firstChild,lens=document.createElement('i');lens.className='pd-lens';var cur=null,pv=$('pdv');
function off(){pane.classList.remove('o');lens.style.display='none';cur=null}
pv.addEventListener('mousemove',function(e){if(window.innerWidth<900){return}var sl=e.target.closest&&e.target.closest('#pdgs .pd-sl');if(!sl){if(cur)off();return}
var r=sl.getBoundingClientRect(),gs=$('pdgs').getBoundingClientRect();
if(cur!==sl){cur=sl;Z=1920/Math.max(60,Math.min(r.width,r.height)-20);inner.innerHTML='';var cl=sl.cloneNode(true);cl.style.cssText='width:'+r.width+'px;height:'+r.height+'px;position:relative;flex:none';inner.style.width=r.width+'px';inner.style.height=r.height+'px';inner.appendChild(cl);sl.appendChild(lens);
var pw=Math.min(740,Math.max(320,window.innerWidth-(gs.right+20)-16)),ph=Math.min(pw,window.innerHeight-24);pane.style.width=pw+'px';pane.style.height=ph+'px';pane.style.left=Math.round(gs.right+20)+'px';pane.style.top=Math.max(12,Math.min(Math.round(gs.top),window.innerHeight-ph-12))+'px';pane._w=pw;pane._h=ph}
var pw=pane._w,ph=pane._h,x=e.clientX-r.left,y=e.clientY-r.top,lw=pw/Z,lh=ph/Z,lx=Math.min(Math.max(0,x-lw/2),r.width-lw),ly=Math.min(Math.max(0,y-lh/2),r.height-lh);
lens.style.cssText='display:block;width:'+lw+'px;height:'+lh+'px;left:'+lx+'px;top:'+ly+'px';
inner.style.transform='translate('+(-lx*Z)+'px,'+(-ly*Z)+'px) scale('+Z+')';pane.classList.add('o')});
pv.addEventListener('mouseleave',off);window.addEventListener('scroll',function(){if(cur)off()},{passive:true});
document.body.addEventListener('click',function(){off()},true)})();
document.addEventListener('click',function(e){var b=e.target.closest('.add');if(b){atcOpen(b.dataset.k);return}
var wh=e.target.closest('.wh');if(wh){var wp=wh.closest('.pc');if(wp)toggleWL(wp.dataset.k,wh);return}var pc=e.target.closest('.pc');if(pc){addHist(pc.dataset.k);openPD(pc.dataset.k)}var hh=e.target.closest('.hi[data-k]');if(hh)openPD(hh.dataset.k);});
function setTab(n){var vx=document.body.classList.contains('vx');document.querySelectorAll('.bn a').forEach(function(x,i){var j=i>2?i-1:i;if(x.id=='bw'){x.classList.toggle('on',n==2&&!vx&&!!x.dataset.on);return}if(x.id=='bc'){x.classList.toggle('on',n==2&&vx);return}x.classList.toggle('on',j==n)})}
function goHome(){setTab(0);if(window.cpS&&cpS.o)closeCP();closeProf();closeOrd();closeShops();closePD();closeAll();window.scrollTo(0,0)}
document.querySelector('.nlogo').addEventListener('click',function(e){e.preventDefault();goHome()});
document.querySelector('.dnav a').addEventListener('click',function(e){e.preventDefault();goHome()});
(function(){var hd=document.querySelector('header'),B=document.body,hid=false,last=0,lock=false,d=0;
window.addEventListener('scroll',function(){if(window.innerWidth<900||lock)return;var y=window.scrollY;if(Date.now()<(window.NOCW||0)){last=y;return}
if(!hid&&y>220&&y>last+8){var h0=hd.offsetHeight;B.classList.add('cwh');d=h0-hd.offsetHeight;hid=true;lock=true;window.scrollTo(0,Math.max(0,y-d));last=window.scrollY;setTimeout(function(){lock=false},80)}
else if(hid&&(y<last-8||y<120)){B.classList.remove('cwh');hid=false;lock=true;window.scrollTo(0,y+d);last=window.scrollY;setTimeout(function(){lock=false},80)}
else last=y},{passive:true});
window.addEventListener('resize',function(){if(window.innerWidth<900&&hid){B.classList.remove('cwh');hid=false}})})();
document.querySelectorAll('.bn a').forEach(function(a,idx0){a.onclick=function(e){e.preventDefault();var idx=idx0;if(a.id=='bw'){setTab(idx);closeCP();closeProf();closeOrd();closeShops();closePD();openWallet();return}try{closeWallet()}catch(_){}if(idx>2)idx--;setTab(idx);if(idx==1){window.openCats?openCats():openCP()}else if(idx==4){closeCP();closeOrd();closeShops();closePD();openProf()}else if(idx==2){openCart()}else if(idx==3){closeCP();closeProf();openOrd()}else{closeCP();closeProf();closeOrd();closeShops();closePD();if(idx==0)closeAll()}}});
var cpS={o:0,s:'list',t:'',names:[],em:'',open:{}};
function L(e,b){return lang=='bn'?b:e}
function hsh(x){var h=0;for(var i=0;i<x.length;i++)h=(h*31+x.charCodeAt(i))|0;return Math.abs(h)}
function cpP(names,em){return names.map(function(n){var h=hsh(n),pr=(40+h%90)*5;return [em,n,3+h%3,pr,Math.round(pr*1.22/5)*5]})}
function cpR(){var b=$('cpb'),c=CDS[view][lang],em=CEM;$('cpt').textContent=cpS.s=='list'?L('Categories','ক্যাটাগরি'):cpS.t;var h='';
if(cpS.s=='list'){c.forEach(function(x,i){h+='<div class="cr"><button class="cm" data-a="p" data-i="'+i+'"><span class="ce">'+PIC(IMG[CDS[view].en[i].n],em[i],'')+'</span>'+x.n+'</button><button class="cx'+(cpS.open[i]?' o':'')+'" data-a="x" data-i="'+i+'" aria-label="Sub categories"><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button></div>';
if(cpS.open[i])h+='<div class="cs">'+x.g.map(function(g,gi){return '<div class="gt"><button data-a="g" data-i="'+i+'" data-g="'+gi+'">'+g[0]+' ›</button></div><div class="ci">'+g[1].map(function(t,ti){return '<button class="ch" data-a="t" data-i="'+i+'" data-g="'+gi+'" data-t="'+ti+'">'+t+'</button>'}).join('')+'</div>'}).join('')+'</div>'});b.innerHTML=h}
else{var pp=cpP(cpS.names,cpS.em);b.innerHTML='<div class="cn2">'+pp.length+' '+L('products','টি পণ্য')+'</div><div class="pg">'+pp.map(function(p){return card(p,0,'cp')}).join('')+'</div>'}}
function openCP(){cpS.o=1;cpS.s='list';$('cp').classList.add('o');cpR();$('cpb').scrollTop=0}
function closeCP(){cpS.o=0;$('cp').classList.remove('o')}
$('cpbk').onclick=function(){if(cpS.s=='prod'){cpS.s='list';cpR()}else{closeCP();setTab(0)}};
$('cpb').addEventListener('click',function(e){var t=e.target.closest('[data-a]');if(!t)return;var c=CDS[view][lang],em=CEM,a=t.dataset.a,i=+t.dataset.i,x=c[i],st=$('cpb').scrollTop;
if(a=='x'){cpS.open[i]=!cpS.open[i];cpR();$('cpb').scrollTop=st;return}
cpS.s='prod';cpS.em=em[i];
if(a=='p'){cpS.t=x.n;cpS.names=[].concat.apply([],x.g.map(function(g){return g[1]}))}
else if(a=='g'){var g=x.g[+t.dataset.g];cpS.t=g[0];cpS.names=g[1].map(function(n){return n+' – A'}).concat(g[1].map(function(n){return n+' – B'}))}
else{var n=x.g[+t.dataset.g][1][+t.dataset.t];cpS.t=n;cpS.names=['A','B','C','D','E','F'].map(function(l){return n+' – '+l})}
cpR();$('cpb').scrollTop=0});
var cities=['Dhaka','Chattogram','Sylhet','Rajshahi','Khulna','Barishal','Rangpur','Mymensingh','Cumilla','Bogura'];
$('lm').innerHTML=cities.map(function(c){return '<button>'+c+'</button>'}).join('');
$('lt').onclick=function(e){e.stopPropagation();if(LIVE&&window.locPick){locPick('min');return}$('loc').classList.toggle('o')};
$('lm').onclick=function(e){var b=e.target.closest('button');if(b){$('lcn').textContent=b.textContent;$('loc').classList.remove('o')}};
document.addEventListener('click',function(){$('loc').classList.remove('o')});
$('cats').addEventListener('click',function(e){var b=e.target.closest('.cat');if(!b)return;var i=-1;CDS.min.bn.forEach(function(x,j){if(x.n==b.dataset.cn)i=j});if(i<0)openCats();else openCat(i)});
var CNM='সবজী=পাতাজাতীয়:পালংশাক,লাল শাক,পুঁইশাক,লাউ শাক|ফলজাতীয়:বেগুন,টমেটো,করলা,লাউ|কন্দ ও মূল:আলু,গাজর,মুলা,পেঁয়াজ|মসলা সবজি:কাঁচা মরিচ,আদা,রসুন,ধনেপাতা;মাছ=নদীর মাছ:রুই,কাতলা,ইলিশ,বোয়াল|পুকুরের মাছ:তেলাপিয়া,পাঙ্গাস,কার্প,শিং|সামুদ্রিক:রূপচাঁদা,কোরাল,চিংড়ি,কাঁকড়া|শুঁটকি:লইট্টা,ছুরি,বোম্বাই,চাপিলা;মাংস=গরু:হাড়সহ,হাড়ছাড়া,কিমা,কলিজা|খাসি:রান,চাপ,কিমা,মাথা|মুরগি:ব্রয়লার,দেশি,সোনালী,পাখনা|হাঁস ও অন্যান্য:হাঁস,কবুতর,কোয়েল,টার্কি;ফল=দেশি ফল:আম,কাঁঠাল,লিচু,জাম|বিদেশি ফল:আপেল,কমলা,আঙ্গুর,কিউই|মৌসুমি:তরমুজ,পেঁপে,কলা,পেয়ারা|শুকনো ফল:খেজুর,কিশমিশ,কাজুবাদাম,বাদাম;ঔষধ=সাধারণ ওষুধ:জ্বর ও ব্যথা,সর্দি-কাশি,গ্যাস্ট্রিক,অ্যান্টিবায়োটিক|ভিটামিন:ভিটামিন সি,ভিটামিন ডি,মাল্টিভিটামিন,ক্যালসিয়াম|ফার্স্ট এইড:ব্যান্ডেজ,স্যাভলন,তুলা,থার্মোমিটার|স্বাস্থ্য সামগ্রী:মাস্ক,স্যানিটাইজার,গ্লুকোমিটার,বিপি মেশিন;বৈদ্যুতিক দোকান=বাতি ও লাইট:এলইডি বাল্ব,টিউব লাইট,ফ্যান্সি লাইট,টর্চ|তার ও সুইচ:ওয়্যার,সুইচ,সকেট,প্লাগ|ফ্যান:সিলিং ফ্যান,টেবিল ফ্যান,এক্সহস্ট ফ্যান,স্ট্যান্ড ফ্যান|টুলস:প্লাস,টেস্টার,ব্যাটারি,এক্সটেনশন বোর্ড;ইলেকট্রনিক=মোবাইল:স্মার্টফোন,চার্জার,পাওয়ার ব্যাংক,ইয়ারফোন|হোম অ্যাপ্লায়েন্স:ফ্রিজ,টিভি,রাইস কুকার,ব্লেন্ডার|কম্পিউটার:ল্যাপটপ,মাউস,কিবোর্ড,পেনড্রাইভ|অডিও:স্পিকার,হেডফোন,মাইক্রোফোন,সাউন্ডবক্স;মুদী দোকান=চাল ডাল:চাল,মসুর ডাল,মুগ ডাল,ছোলা|তেল ও মসলা:সয়াবিন তেল,সরিষার তেল,হলুদ গুঁড়া,মরিচ গুঁড়া|প্রতিদিনের:চিনি,লবণ,আটা,সুজি|স্ন্যাকস ও পানীয়:বিস্কুট,চা,নুডলস,জুস;রেস্টুরেন্ট=বাঙালি খাবার:বিরিয়ানি,ভুনা খিচুড়ি,ভর্তা ভাত,পরোটা|ফাস্ট ফুড:বার্গার,পিৎজা,ফ্রাইড চিকেন,স্যান্ডউইচ|চাইনিজ:ফ্রায়েড রাইস,চাউমিন,স্যুপ,চিলি চিকেন|মিষ্টি ও পানীয়:মিষ্টি,দই,লাচ্ছি,কফি',CNME='Vegetables=Leafy:Spinach,Red Amaranth,Malabar Spinach,Bottle Gourd Leaves|Fruit Veg:Eggplant,Tomato,Bitter Gourd,Bottle Gourd|Roots & Tubers:Potato,Carrot,Radish,Onion|Herbs & Spices:Green Chili,Ginger,Garlic,Coriander;Fish=River Fish:Rui,Katla,Hilsa,Boal|Pond Fish:Tilapia,Pangas,Carp,Shing|Sea Fish:Pomfret,Coral,Prawn,Crab|Dried Fish:Loitta,Chhuri,Bombay Duck,Chapila;Meat=Beef:Bone-in,Boneless,Mince,Liver|Mutton:Leg,Chops,Mince,Head|Chicken:Broiler,Local,Sonali,Wings|Duck & Others:Duck,Pigeon,Quail,Turkey;Fruits=Local Fruits:Mango,Jackfruit,Lychee,Black Plum|Imported Fruits:Apple,Orange,Grapes,Kiwi|Seasonal:Watermelon,Papaya,Banana,Guava|Dry Fruits:Dates,Raisins,Cashew Nuts,Peanuts;Medicine=General Medicine:Fever & Pain,Cold & Cough,Gastric,Antibiotics|Vitamins:Vitamin C,Vitamin D,Multivitamins,Calcium|First Aid:Bandage,Savlon,Cotton,Thermometer|Health Items:Masks,Sanitizer,Glucometer,BP Monitor;Electrical Shop=Bulbs & Lights:LED Bulbs,Tube Lights,Fancy Lights,Torches|Wires & Switches:Wires,Switches,Sockets,Plugs|Fans:Ceiling Fans,Table Fans,Exhaust Fans,Stand Fans|Tools:Pliers,Testers,Batteries,Extension Boards;Electronics=Mobile:Smartphones,Chargers,Power Banks,Earphones|Home Appliances:Refrigerator,TV,Rice Cooker,Blender|Computers:Laptops,Mouse,Keyboard,Pendrive|Audio:Speakers,Headphones,Microphones,Soundbox;Grocery Store=Rice & Lentils:Rice,Masoor Dal,Mung Dal,Chickpeas|Oil & Spices:Soybean Oil,Mustard Oil,Turmeric Powder,Chili Powder|Daily Needs:Sugar,Salt,Flour,Semolina|Snacks & Drinks:Biscuits,Tea,Noodles,Juice;Restaurant=Bengali Food:Biryani,Bhuna Khichuri,Bhorta Rice,Paratha|Fast Food:Burger,Pizza,Fried Chicken,Sandwich|Chinese:Fried Rice,Chowmein,Soup,Chili Chicken|Sweets & Drinks:Sweets,Yogurt,Lassi,Coffee';var CEM=['🥦','🐟','🥩','🍎','💊','🔌','📺','🛒','🍛'];
var CD=[];
var cnE=$('cn'),mgE=$('mega'),cwE=$('cw');
cnE.innerHTML=CD.map(function(c,i){return '<a href="#" data-i="'+i+'">'+c.n+'</a>'}).join('');
function showM(i){var c=CD[i],vc=V[view]&&V[view].cats&&V[view].cats[i],mpi=vc&&(vc[2]||IMG[enName(vc[1])])||'';mgE.innerHTML='<div class="wrap"><div class="mi">'+c.g.map(function(g,gi){return '<div class="mc"><h5 data-c="'+i+'" data-g="'+gi+'">'+g[0]+'</h5>'+g[1].map(function(t,ti){return '<a href="#" data-c="'+i+'" data-g="'+gi+'" data-t="'+ti+'">'+t+'</a>'}).join('')+'</div>'}).join('')+'<div class="mp'+(mpi?' mpi':'')+'" data-c="'+i+'">'+(mpi?'<img src="'+esc(mpi)+'" alt="" onerror="this.parentNode.classList.remove(\'mpi\');this.remove()">':'')+'<div><s>'+(mpi?'':CEM[i])+'</s>'+c.n+'<br><small>সব দেখুন ›</small></div></div></div></div>';mgE.classList.add('o');cnE.querySelectorAll('a').forEach(function(a,k){a.classList.toggle('on',k==i)})}
function autoRow(el,ms){if(!el)return;if(!el._ar){el._ar={p:0,busy:0};var st=el._ar;el.addEventListener('mouseenter',function(){st.p=1});el.addEventListener('mouseleave',function(){st.p=0});el.addEventListener('focusin',function(){st.p=1});el.addEventListener('focusout',function(){st.p=0});el.addEventListener('touchstart',function(){st.p=1},{passive:true});el.addEventListener('touchend',function(){setTimeout(function(){st.p=0},3500)})}
var st=el._ar;timers.push(setInterval(function(){if(st.p||st.busy||document.hidden||matchMedia('(prefers-reduced-motion:reduce)').matches)return;var r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight||!r.width)return;
var cs=el.querySelectorAll('.pc'),base=el.getBoundingClientRect().left,nx=null,sl=el.scrollLeft;for(var i=0;i<cs.length;i++){var pos=cs[i].getBoundingClientRect().left-base+sl;if(pos>sl+8){nx=pos;break}}
var end=sl+el.clientWidth>=el.scrollWidth-4,to=(nx!=null&&!end)?nx:0;if(to==sl)return;st.busy=1;var from=sl,t0=performance.now(),dur=to==0?1100:900,sn=el.style.scrollSnapType;el.style.scrollSnapType='none';
(function step(t){var k=Math.min(1,(t-t0)/dur),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;el.scrollLeft=from+(to-from)*e;if(k<1&&!st.p)requestAnimationFrame(step);else{el.style.scrollSnapType=sn;st.busy=0}})(t0)},ms))}
function hideM(){mgE.classList.remove('o');cnE.querySelectorAll('a').forEach(function(a){a.classList.remove('on')})}
cnE.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;e.preventDefault();openCat(+a.dataset.i)});
var cnA=$('cnall');function cnAT(){cnA.textContent=L('All','সব')}cnAT();
cnA.addEventListener('click',function(e){e.preventDefault();hideM();if(window.openCats)openCats()});
var _slA=setLang;setLang=function(){var r=_slA.apply(this,arguments);try{cnAT()}catch(x){}return r};
mgE.addEventListener('click',function(e){var t=e.target.closest('[data-c]');if(!t)return;e.preventDefault();openCat(+t.dataset.c,t.dataset.g,t.dataset.t)});
cnE.addEventListener('mouseover',function(e){var a=e.target.closest('a');if(a)showM(+a.dataset.i)});
cwE.addEventListener('mouseleave',hideM);
cwE.addEventListener('click',function(e){if(e.target.closest('a'))e.preventDefault()});
render('min');
var DICT=`আপনার এলাকায় ১৫ থেকে ৫৯ মিনিটে ডেলিভারি=Delivery in 15 to 59 minutes in your area
সারা বাংলাদেশে ডেলিভারি=Nationwide delivery
সারা দেশে ডেলিভারি=Nationwide delivery
সব পণ্যে ২০% পর্যন্ত সাশ্রয়=Save up to 20% on all items
২–৫ কার্যদিবস=2–5 business days
ব্যানার ছবি আপলোড করুন=Upload banner image
পণ্য খুজুন......=Search products......
সার্চ=Search
খুঁজুন=Search
মেসেজ=Messages
নোটিফিকেশন=Notifications
মিনিটস=Minutes
বৈদ্যুতিক দোকান=Electrical Shop
ইলেকট্রনিক্সে মেগা অফার=Mega offers on electronics
ইলেকট্রনিক্সে=On electronics
ইলেকট্রনিক্স=Electronics
ইলেকট্রনিক=Electronics
মুদী দোকান=Grocery Store
রেস্টুরেন্ট=Restaurant
সবজী=Vegetables
মাছ=Fish
মাংস=Meat
ফল=Fruits
ঔষধ=Medicine
এ শুধু=has only
মিনিটসে ডেলিভারি=Minutes Delivery
প্রথম অর্ডারে=On your first order
১০০৳=৳100
কুরিয়ারে=By courier
২-৫ দিন=2-5 days
নিরাপদ=Safe
ওয়ারেন্টি=Warranty
১০০% খাঁটি পণ্য=100% Genuine Products
১০০%=100%
গ্যারান্টি=Guarantee
সারা বাংলাদেশে=Nationwide
সব পণ্যে=On all items
আপনার ব্রাউজিং হিস্টরি=Your Browsing History
কোনো পণ্যে ক্লিক করলে এখানে ব্রাউজিং হিস্টরি জমা হবে=Click on any product and your browsing history will appear here
মুছুন=Clear
নতুন প্রোডাক্ট=New Products
দ্রুত ও নিরাপদ=Fast & safe
যাচাইকৃত দোকান=Verified shops
ক্যাশ অন ডেলিভারি=Cash on Delivery
বিকাশ / নগদ=bKash / Nagad
২৪/৭ সাপোর্ট=24/7 Support
সবসময় পাশে=Always with you
বাংলাদেশের অনলাইন মার্কেটপ্লেস=Bangladesh's Online Marketplace
হোম · ক্যাটাগরি · অর্ডার · প্রোফাইল=Home · Category · Orders · Profile
সর্বস্বত্ব সংরক্ষিত।=All rights reserved.
আরও কেনার কারণ=More reasons to shop
মেগা ডিলস=Mega Deals
ডিল দেখুন=Shop deals
মোবাইল ডিলস=Mobile deals
মাসাজ ও রিল্যাক্সেশন=Massage & Relaxation
ইন ফোকাস=In Focus
নতুন স্মার্টফোন কিনুন এখনই, ৬ মাস পর্যন্ত সহজ কিস্তিতে।=Buy a new smartphone now, with easy installments up to 6 months.
এখনই কিনুন=Buy now
আপনার টিমকে উৎসাহ দিন!=Cheer on your team!
স্পোর্টস গিয়ারে বিশাল ছাড়=Huge discounts on sports gear
অফার দেখুন=View offers
স্মার্টফোন, ল্যাপটপ ও আরও অনেক কিছু=Smartphones, laptops and much more
তাজা গ্রোসারি, সারা দেশে=Fresh grocery, nationwide
সরাসরি আপনার দরজায়=Right to your doorstep
অর্ডার করুন=Order now
প্রতিটি স্টাইল।=Every style.
এক জায়গায়।=One place.
মহিলাদের ফ্যাশন=Women's Fashion
পুরুষদের ফ্যাশন=Men's Fashion
ডিলস=Deals
মোবাইল=Mobiles
ল্যাপটপ ও ডেস্কটপ=Laptops & Desktops
বিউটি=Beauty
গিফট কার্ড=Gift Cards
হোম অ্যাপ্লায়েন্স=Home Appliances
স্বাস্থ্য ও পুষ্টি=Health & Nutrition
ওয়্যারেবলস=Wearables
ব্যাকপ্যাক=Backpacks
সব দেখুন=View all
গরুর মাংস=Beef
দেশি পিয়াজ=Local Onion
ডায়মন্ড আলু=Diamond Potato
টমেটো=Tomato
রুই মাছ=Rui Fish
গাজর=Carrot
ইলিশ মাছ=Hilsa Fish
আপেল=Apple
ডিম (হালি)=Eggs (4 pcs)
মিনিকেট চাল=Miniket Rice
দুধ (১লি)=Milk (1L)
স্মার্টফোন=Smartphone
ব্লুটুথ হেডফোন=Bluetooth Headphone
পাঞ্জাবি=Panjabi
স্মার্ট ওয়াচ=Smart Watch
খাঁটি মধু=Pure Honey
চাল (৫০ কেজি)=Rice (50 kg)
LED টিভি ৩২"=LED TV 32"
সরিষার তেল ৫লি=Mustard Oil 5L
ল্যাপটপ=Laptop
স্নিকার্স জুতা=Sneakers
ফেস ওয়াশ=Face Wash
নতুন ঠিকানা যোগ করুন=Add new address
আপনার ঠিকানা, ভবন বা এলাকা খুঁজুন…=Search for your address, building or area…
বর্তমান লোকেশন ব্যবহার করুন=Use current location
আপনার অর্ডার এখানে পৌঁছে দেওয়া হবে=Your order will be delivered here
বর্তমান লোকেশন=Current location
লোকেশন নিশ্চিত করুন=Confirm location
ফলাফল পাওয়া যায়নি=No results found
আগের=Previous
পরের=Next
আগে=Previous
পরে=Next
ব্যানার=Banner
অফার=Offer
হোম=Home
ক্যাটাগরি=Category
দোকান=Shop
গ্রোসারি=Grocery`;
var EXD={'আর':'and more','সব':'All','অফার':'Offers','ডেলিভারি':'Delivery','ছাড়':'Off','পান':'Deal','ফ্রি':'Free'};
var SUB=DICT.split('\n').map(function(l){var i=l.indexOf('=');return [l.slice(0,i),l.slice(i+1)]}).sort(function(a,b){return b[0].length-a[0].length});
var BN=/[\u0980-\u09FF]/,lang='en';
try{lang=localStorage.getItem('nb_lang')||'en'}catch(x){}document.documentElement.lang=lang;
function conv(o){var t=o.trim();if(EXD[t])return o.replace(t,EXD[t]);var r=o;SUB.forEach(function(p){if(r.indexOf(p[0])>-1)r=r.split(p[0]).join(p[1])});return r}
function applyLang(){var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,L=[];while(n=w.nextNode())L.push(n);
L.forEach(function(n){var p=n.parentNode&&n.parentNode.nodeName;if(p=='SCRIPT'||p=='STYLE')return;if(n.parentNode.closest&&n.parentNode.closest('#profv,#ordv,#shopv,#pdv,#wishv,#cartv,#authv,#pm,#chatw,#admv,#notifv,#ntfd,#sellv,#histv,#catsv,.bss'))return;
if(lang=='en'){if(n._o===undefined){if(!BN.test(n.nodeValue))return;n._o=n.nodeValue}var c=conv(n._o);if(n.nodeValue!==c)n.nodeValue=c}else if(n._o!==undefined&&n.nodeValue!==n._o)n.nodeValue=n._o});
document.querySelectorAll('[placeholder],[aria-label],[alt]').forEach(function(e){['placeholder','aria-label','alt'].forEach(function(a){if(!e.hasAttribute(a))return;e._oa=e._oa||{};if(e._oa[a]===undefined){var v=e.getAttribute(a);if(!BN.test(v))return;e._oa[a]=v}var nv=lang=='en'?conv(e._oa[a]):e._oa[a];if(e.getAttribute(a)!==nv)e.setAttribute(a,nv)})})}
function parseCN(x){return x.split(';').map(function(y){var p=y.split('=');return {n:p[0],g:p[1].split('|').map(function(g){var q=g.split(':');return [q[0],q[1].split(',')]})}})}
var CDS={min:{bn:parseCN(CNM),en:parseCN(CNME)}};
function buildNav(){CD=CDS[view][lang];cnE.innerHTML=CD.map(function(c,i){return '<a href="#" data-i="'+i+'">'+c.n+'</a>'}).join('')}
function setLang(l){lang=l;setTimeout(function(){if(window.catCirc&&view=='min'&&$('cats').firstChild)catCirc()},0);var _d=document.getElementById('lds');if(_d)_d.textContent=l=='bn'?'ডেলিভারি লোকেশন':'Deliver to';document.documentElement.lang=l;if(window.geoLabel)setTimeout(geoLabel,0);if(window.openGeo&&document.getElementById('geom')&&document.getElementById('geom').classList.contains('o'))setTimeout(function(){document.getElementById('geom').dispatchEvent(new Event('relang'))},0);if(window.renderCats)setTimeout(renderCats,0);if(window.renderHist)setTimeout(renderHist,0);if(window.renderSeller)setTimeout(renderSeller,0);if(window.NBN)setTimeout(NBN.refresh,0);try{localStorage.setItem('nb_lang',l)}catch(x){}document.documentElement.lang=l=='en'?'en':'bn';$('lgl').textContent=l=='en'?'English':'বাংলা';buildNav();hideM();renderShops();if(window.renderNew)renderNew();if(window.allS)renderAll();if(window.renderProf&&document.body.classList.contains('vp'))renderProf();if(window.renderOrd&&document.body.classList.contains('vo'))renderOrd();if(window.renderShv&&document.body.classList.contains('vs'))renderShv();if(window.renderPD&&document.body.classList.contains('vd')&&PDS.p)renderPD();heroR();if(window.cpS&&cpS.o)cpR();if(window.updPlace)updPlace();var li0=$('lcn').dataset.i;if(li0!==undefined&&li0!=='')$('lcn').textContent=nm(LOC[+li0]);$('dw').classList.remove('o');applyLang()}
$('dwb').onclick=function(e){e.stopPropagation();$('dw').classList.toggle('o')};
$('dw').querySelector('.lm').onclick=function(e){var b=e.target.closest('button');if(b)setLang(b.dataset.l)};
document.addEventListener('click',function(){$('dw').classList.remove('o')});
$('lgmb').onclick=function(){setLang(lang=='en'?'bn':'en')};
new MutationObserver(function(){applyLang()}).observe(document.body,{childList:true,subtree:true});

var LOC=[['Gulshan','গুলশান',1700,1300],['Banani','বনানী',1500,900],['Dhanmondi','ধানমন্ডি',1100,1900],['Mirpur','মিরপুর',700,900],['Uttara','উত্তরা',2100,500],['Motijheel','মতিঝিল',1900,2000],['Mohammadpur','মোহাম্মদপুর',800,1500],['Bashundhara R/A','বসুন্ধরা আবাসিক এলাকা',2400,1100],['Farmgate','ফার্মগেট',1300,1500],['Old Dhaka','পুরান ঢাকা',1600,2500]];
var mc={x:1700,y:1300,z:1},GPS=null,mw=$('mapw'),mg=$('mg'),msv=$('msvg');
function nm(l){return lang=='en'?l[0]:l[1]}
function mrnd(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function buildMap(){var r=mrnd(11),o='',i,j,x,y;
for(i=0;i<30;i++)for(j=0;j<30;j++){x=i*110;y=j*110;if(r()<.12)continue;o+='<rect x="'+(x+4)+'" y="'+(y+4)+'" width="'+(70+r()*32)+'" height="'+(70+r()*32)+'" rx="5" fill="'+(r()<.5?'#e8e1d2':'#e2dac8')+'"/>'}
for(i=0;i<9;i++){x=r()*2800;y=r()*2800;o+='<rect x="'+x+'" y="'+y+'" width="'+(200+r()*220)+'" height="'+(180+r()*200)+'" rx="40" fill="#cde6bf"/>'}
o+='<path d="M-100 2350 C 600 2050 1100 2700 1800 2300 S 3000 2000 3300 2250" fill="none" stroke="#bde0f1" stroke-width="130"/>';
for(i=0;i<15;i++){y=i*220+(r()-.5)*60;var mj=i%4==0;o+='<line x1="0" x2="3200" y1="'+y+'" y2="'+y+'" stroke="#cbc4b3" stroke-width="'+(mj?30:15)+'"/><line x1="0" x2="3200" y1="'+y+'" y2="'+y+'" stroke="#fff" stroke-width="'+(mj?26:11)+'"/>';
x=i*220+(r()-.5)*60;o+='<line y1="0" y2="3200" x1="'+x+'" x2="'+x+'" stroke="#cbc4b3" stroke-width="'+(mj?30:15)+'"/><line y1="0" y2="3200" x1="'+x+'" x2="'+x+'" stroke="#fff" stroke-width="'+(mj?26:11)+'"/>'}
o+='<path d="M0 700 C 900 900 1700 1500 3200 1700" fill="none" stroke="#c6cfe4" stroke-width="58"/><path d="M0 700 C 900 900 1700 1500 3200 1700" fill="none" stroke="#dde4f3" stroke-width="50"/><path d="M0 700 C 900 900 1700 1500 3200 1700" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="18 14"/>';
var rd=['Airport Rd','Mirpur Rd','Gulshan Ave','Kemal Ataturk Ave','Progoti Sarani','Satmasjid Rd','Link Rd','Bijoy Sarani'];
for(i=0;i<18;i++){x=300+r()*2600;y=(Math.floor(r()*14)*220)+(r()<.5?0:0);o+='<text x="'+x+'" y="'+(y+4)+'" font-size="13" fill="#7b7568" letter-spacing="1">'+rd[i%8]+'</text>'}
var pc=['#ff6aa0','#ff8a3d','#3b82f6','#12a150'];
for(i=0;i<46;i++){x=100+r()*3000;y=100+r()*3000;var c=pc[i%4];o+='<circle cx="'+x+'" cy="'+y+'" r="9" fill="'+c+'"/><circle cx="'+x+'" cy="'+y+'" r="3.500" fill="#fff"/><text x="'+(x+14)+'" y="'+(y+5)+'" font-size="14" fill="'+c+'">'+['Cafe','Hotel','Metro','Park','Mart','Clinic','Bakery','Mosque'][i%8]+' '+(i+1)+'</text>'}
LOC.forEach(function(l){o+='<text x="'+l[2]+'" y="'+l[3]+'" font-size="30" font-weight="700" fill="#5d574b" text-anchor="middle" stroke="#efeadf" stroke-width="6" paint-order="stroke">'+l[0]+'</text>'});
mg.innerHTML=o}
function drawM(){var w=mw.clientWidth,h=mw.clientHeight;mg.setAttribute('transform','translate('+w/2+','+h/2+') scale('+mc.z+') translate('+-mc.x+','+-mc.y+')');updPlace()}
function nearest(){var b=null,d=1e12;LOC.forEach(function(l){var k=(l[2]-mc.x)*(l[2]-mc.x)+(l[3]-mc.y)*(l[3]-mc.y);if(k<d){d=k;b=l}});return b}
function updPlace(){if(!$('mo').classList.contains('o'))return;if(GPS){$('mpn').textContent=lang=='en'?'Your current location':'আপনার বর্তমান লোকেশন';$('mps').textContent=GPS;return}var l=nearest();$('mpn').textContent=nm(l);$('mps').textContent=lang=='en'?'Dhaka, Bangladesh':'ঢাকা, বাংলাদেশ'}
function msg(t){var m=$('mmsg');m.textContent=t;m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(function(){m.style.display='none'},3000)}
function flyTo(x,y){var sx=mc.x,sy=mc.y,t0=performance.now();(function f(t){var k=Math.min(1,(t-t0)/400);k=1-Math.pow(1-k,3);mc.x=sx+(x-sx)*k;mc.y=sy+(y-sy)*k;drawM();if(k<1)requestAnimationFrame(f)})(t0)}
var mbuilt=0;
function openMap(){$('mo').classList.add('o');if(!mbuilt){buildMap();mbuilt=1}GPS=null;drawM();setTimeout(drawM,50)}
function closeMap(){$('mo').classList.remove('o');$('msr').classList.remove('o')}
$('lt').onclick=function(e){e.stopPropagation();openMap()};
$('mx').onclick=$('mback').onclick=closeMap;
$('mo').addEventListener('mousedown',function(e){if(e.target==$('mo'))closeMap()});
document.addEventListener('keydown',function(e){if(e.key=='Escape')closeMap()});
var dg=null;
mw.addEventListener('pointerdown',function(e){if(e.target.closest('.ms,.ul,.zm'))return;dg={x:e.clientX,y:e.clientY};mw.classList.add('d');mw.setPointerCapture(e.pointerId)});
mw.addEventListener('pointermove',function(e){if(!dg)return;mc.x-=(e.clientX-dg.x)/mc.z;mc.y-=(e.clientY-dg.y)/mc.z;dg={x:e.clientX,y:e.clientY};GPS=null;drawM()});
function endD(){dg=null;mw.classList.remove('d')}mw.addEventListener('pointerup',endD);mw.addEventListener('pointercancel',endD);
function zoom(f){mc.z=Math.max(.5,Math.min(2.6,mc.z*f));drawM()}
$('mzi').onclick=function(){zoom(1.25)};$('mzo').onclick=function(){zoom(.8)};
mw.addEventListener('wheel',function(e){e.preventDefault();zoom(e.deltaY<0?1.1:.9)},{passive:false});
$('msi').addEventListener('input',function(){var q=this.value.trim().toLowerCase(),b=$('msr');if(!q){b.classList.remove('o');return}
var m=LOC.filter(function(l){return l[0].toLowerCase().indexOf(q)>-1||l[1].indexOf(q)>-1});
b.innerHTML=m.length?m.map(function(l,i){return '<button data-i="'+LOC.indexOf(l)+'">'+nm(l)+' <small>· Dhaka</small></button>'}).join(''):'<button disabled>ফলাফল পাওয়া যায়নি</button>';b.classList.add('o')});
$('msr').onclick=function(e){var b=e.target.closest('button[data-i]');if(!b)return;var l=LOC[+b.dataset.i];GPS=null;flyTo(l[2],l[3]);$('msr').classList.remove('o');$('msi').value=nm(l)};
$('mul').onclick=function(){if(!navigator.geolocation){msg(lang=='en'?'Location is not available':'লোকেশন পাওয়া যায়নি');return}
navigator.geolocation.getCurrentPosition(function(p){GPS=p.coords.latitude.toFixed(4)+', '+p.coords.longitude.toFixed(4);flyTo(1700,1300);msg(lang=='en'?'Current location detected':'বর্তমান লোকেশন পাওয়া গেছে')},function(){msg(lang=='en'?'Could not get location. Please allow access.':'লোকেশন পাওয়া যায়নি, অনুমতি দিন')},{timeout:8000})};
$('mcf').onclick=function(){var l=GPS?null:nearest();$('lcn').textContent=l?l[0]:'Current location';$('lcn').dataset.i=l?LOC.indexOf(l):'';closeMap()};
$('shopl').addEventListener('click',function(e){var h=e.target.closest('.hr');if(h){var n=h.dataset.n;if(LIVE&&LSTO[n]){flToggle(n);return}FAV[n]=!FAV[n];h.classList.toggle('f',FAV[n])}});
var PD={name:'Nur Hossen Bijoy',mobile:'01309637299',email:'ijbijoy130@gmail.com',avatar:'',cover:'',addr:['Phatuavanga Vitipara, Pakundia, Kishoregonj'],locI:-2,mvf:true},PROF={};
try{PROF=Object.assign({},PD,JSON.parse(localStorage.getItem('nb_prof')||'{}'))}catch(x){PROF=Object.assign({},PD)}
var PST=0;function saveProf(){try{localStorage.setItem(AU.uid?'nb_prof_'+AU.uid:'nb_prof',JSON.stringify(PROF))}catch(x){}if(LIVE&&AU.uid&&TOKN&&!LP.skip){clearTimeout(PST);PST=setTimeout(function(){var q=Object.assign({},PROF);delete q.mvf;delete q.name;delete q.mobile;delete q.email;if(/^data:/.test(q.avatar||''))q.avatar=window.__avOld||'';nbApi('PUT','/me/profile',{profile:q}).catch(function(){})},600)}}
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var PI={pin:'<svg viewBox="0 0 24 24"><path d="M12 22s7-6.500 7-12a7 7 0 00-14 0c0 5.500 7 12 7 12zm0-9.500a2.500 2.500 0 110-5 2.500 2.500 0 010 5z"/></svg>',plus:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" fill="#1d2fe0"/><path d="M12 7v10M7 12h10" stroke="#fff" stroke-width="2.500" stroke-linecap="round"/></svg>',info:'<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1.100 15h-2.200v-6h2.200zM12 9.200a1.300 1.300 0 110-2.600 1.300 1.300 0 010 2.600z"/></svg>',doc:'<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.400 9.200-8 11-4.600-1.800-8-6-8-11V5zm-1.200 13l5.200-5.200-1.400-1.400-3.800 3.800-1.800-1.800-1.400 1.400z"/></svg>',ret:'<svg viewBox="0 0 24 24" style="fill:none;stroke:#1759e8;stroke-width:2.400;stroke-linecap:round;stroke-linejoin:round"><path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/></svg>',crown:'<svg viewBox="0 0 24 24"><path d="M3 8l4.500 4L12 5l4.500 7L21 8l-2 11H5z"/></svg>',phone:'<svg viewBox="0 0 24 24"><path d="M6.600 10.800a15 15 0 006.600 6.600l2.200-2.200a1 1 0 011-.25c1.100.37 2.300.57 3.600.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.500a1 1 0 011 1c0 1.300.2 2.500.57 3.600a1 1 0 01-.25 1z"/></svg>',mail:'<svg viewBox="0 0 24 24" style="fill:none;stroke:#1759e8;stroke-width:2.200;stroke-linejoin:round;stroke-linecap:round"><rect x="3" y="5" width="18" height="14" rx="2.500"/><path d="M4 7.500l8 6 8-6"/></svg>',cp:'<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2.500"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/></svg>',chk:'<svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.400 9.200-8 11-4.600-1.800-8-6-8-11V5zm-1.200 13l5.200-5.200-1.400-1.400-3.800 3.800-1.800-1.800-1.400 1.400z"/></svg>',pen:'<svg viewBox="0 0 24 24"><path d="M4 20l1-4L16.500 4.500a2.100 2.100 0 013 3L8 19z"/></svg>',cam:'<svg viewBox="0 0 24 24"><path d="M9 3L7.200 5H4a2 2 0 00-2 2v11a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2h-3.200L15 3zm3 5a4.500 4.500 0 110 9 4.500 4.500 0 010-9zm0 2a2.500 2.500 0 100 5 2.500 2.500 0 000-5z"/></svg>',usr2:'<svg viewBox="0 0 24 24"><circle cx="12" cy="7.500" r="4.200"/><path d="M3.500 21c0-4.600 3.800-7 8.500-7s8.500 2.400 8.500 7z"/></svg>',loc:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',gm:'<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 00-7 7c0 5.200 7 13 7 13s7-7.800 7-13a7 7 0 00-7-7z" fill="#34a853"/><path d="M12 2a7 7 0 00-5.900 3.200L12 12z" fill="#4285f4"/><path d="M18.700 5.800A7 7 0 0012 2v10z" fill="#ea4335"/><path d="M5 9c0 1.300.5 2.700 1.200 4L12 12z" fill="#1a73e8" fill-opacity=".0"/><circle cx="12" cy="9" r="2.600" fill="#fff"/></svg>',trash:'<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>',user:'<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#e6e9f5"/><circle cx="50" cy="38" r="18" fill="#a9b0d6"/><path d="M14 100c0-22 16-34 36-34s36 12 36 34z" fill="#a9b0d6"/></svg>'};
function locName(){var i=PROF.locI;return i>=0&&LOC[i]?nm(LOC[i]):(i==-1?L('Current location','বর্তমান লোকেশন'):'Dhaka')}
function thumb(n){return '<svg class="th" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid slice"><rect class="tb" width="300" height="150" fill="#ebe6da"/><rect class="tg" x="170" y="10" width="110" height="45" rx="10" fill="#cde6bf"/><path class="tw" d="M-10 122C60 92 120 142 200 112S280 102 320 122" stroke="#bde0f1" stroke-width="22" fill="none"/><g class="tr" stroke="#fff" stroke-width="7"><line x1="0" y1="40" x2="300" y2="40"/><line x1="0" y1="85" x2="300" y2="85"/><line x1="70" y1="0" x2="70" y2="150"/><line x1="150" y1="0" x2="150" y2="150"/><line x1="230" y1="0" x2="230" y2="150"/></g><path d="M150 52c-9 0-15 7-15 15 0 11 15 26 15 26s15-15 15-26c0-8-6-15-15-15z" fill="#e5254b"/><circle cx="150" cy="67" r="5" fill="#fff"/><text class="tt" x="150" y="108" font-size="9.5" font-weight="700" text-anchor="middle" fill="#5d574b" stroke="#ebe6da" stroke-width="3" paint-order="stroke">'+esc(n)+'</text></svg>'}
function renderProf(){var P=PROF,E=L('Edit','এডিট');
var w=P.name.trim().split(/\s+/),lw=w.length>1?w.pop():'';$('pnm').innerHTML=esc(w.join(' '))+(lw?' <span class="nl">'+esc(lw)+'</span>':'')+'<button class="pne" id="pne" aria-label="Edit profile">'+PI.pen+'</button>';
$('psb').textContent=locName();
$('pchips').innerHTML=P.mvf?'<span class="chp v">'+PI.chk+L('Verified','ভেরিফাইড')+'</span>':'';
(function(){var cv=document.querySelector('.pcv');cv.style.backgroundImage=P.cover?'url('+P.cover+')':'';cv.classList.toggle('hc',!!P.cover)})();$('pcc').innerHTML=PI.cam;
$('pav').innerHTML=P.avatar?'<img src="'+esc(P.avatar)+'" alt="">':PI.user;
$('pcam').innerHTML=PI.cam;
$('pep').innerHTML='<span class="ed">'+PI.pen+L('Edit Profile','প্রোফাইল এডিট')+'</span>';
var vf=P.mvf?'✓ '+L('Verified','ভেরিফাইড'):L('Unverified','ভেরিফাই হয়নি');
var ad=P.addr.map(function(a,i){var k=a.lastIndexOf(', '),t=k>0?esc(a.slice(0,k+2))+'<b>'+esc(a.slice(k+2))+'</b>':esc(a);return '<div class="pab"><div class="pat">'+t+'</div><button class="pt2" data-pa="aedit" data-i="'+i+'">'+PI.pen+E+'</button><button class="pdl" data-pa="adel" data-i="'+i+'" aria-label="Delete">'+PI.trash+'</button></div>'}).join('');
$('psh').innerHTML='<button type="button" class="pfd pf-fol" data-pa="fol"><div class="pic"><svg viewBox="0 0 24 24"><path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 6-8 11-8 11z"/></svg></div><div class="pbd"><div class="pl">'+L('Following','ফলোইং')+'</div><div class="pv">'+L('Shops you follow','আপনার ফলো করা দোকান')+(LIVE?' · '+bnN(Object.keys(LSTO).filter(function(n){return flOn(n)}).length):'')+'</div></div><b class="pch">›</b></button><div class="pfd pf-mob"><div class="pic">'+PI.phone+'</div><div class="pbd"><div class="pl">'+L('Mobile','মোবাইল')+'<button class="pt2" data-pa="mobile">'+E+'</button>'+((P.mvf||(LIVE&&window.NB_SMS!==true))?'':'<button class="pad pvb" data-pa="verify">'+L('Verify','ভেরিফাই করুন')+'</button>')+'</div><div class="pv">'+esc(P.mobile)+'<span class="pvf d'+(P.mvf?'':' no')+'">'+vf+'</span></div></div><div class="pra"><span class="pvf m'+(P.mvf?'':' no')+'">'+(P.mvf?PI.chk:'')+(P.mvf?L('Verified','ভেরিফাইড'):L('Unverified','ভেরিফাই হয়নি'))+'</span><button class="pcp" data-pa="copy" data-v="'+esc(P.mobile)+'" aria-label="Copy">'+PI.cp+'</button></div></div>'
+'<div class="pfd pf-mail"><div class="pic">'+PI.mail+'</div><div class="pbd"><div class="pl">'+L('Email','ইমেইল')+'<button class="pt2" data-pa="email">'+E+'</button></div><div class="pv">'+esc(P.email)+'</div></div><div class="pra"><button class="pcp" data-pa="copy" data-v="'+esc(P.email)+'" aria-label="Copy">'+PI.cp+'</button></div></div>'
+pwRow()+'<div class="pfd pf-addr"><div class="pic">'+PI.pin+'</div><div class="pbd"><div class="pl">'+L('Address','ঠিকানা')+'</div><div class="pabs'+(P.addr.length==1?' one':'')+'">'+ad+'</div><button class="pad" data-pa="aadd">'+PI.plus+L('Add Address','ঠিকানা যোগ করুন')+'</button></div></div>'
+'<div class="pfd pf-loc"><div class="pl2">'+PI.pin+L('Current Location','বর্তমান লোকেশন')+'</div><div class="pmp">'+thumb(locName())+'<button class="pt2" data-pa="loc">'+E+'</button><button class="pmx" data-pa="loc" aria-label="Locate">'+PI.loc+'</button></div><button class="pgm" data-pa="loc">'+PI.gm+L('Select your current location','আপনার বর্তমান লোকেশন বেছে নিন')+'<i>›</i></button></div>'
+'<div class="plks"><button class="plk" data-pa="ord"><span class="pli"><svg viewBox="0 0 24 24"><path d="M4 8l8-5 8 5v10l-8 4-8-4zM4 8l8 4 8-4M12 12v10" fill="none" stroke="currentColor" stroke-width="2"/></svg></span>'+L('My Orders','আমার অর্ডার')+'<b class="pch">›</b></button><button class="plk" data-pa="wish"><span class="pli"><svg viewBox="0 0 24 24"><path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 6-8 11-8 11z" fill="none" stroke="currentColor" stroke-width="2"/></svg></span>'+L('Wishlist','উইশলিস্ট')+'<b class="pch">›</b></button><button class="plk" data-pa="hist"><span class="pli"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>'+L('Browsing History','ব্রাউজিং হিস্টরি')+'<b class="pch">›</b></button><button class="plk" data-pa="geo"><span class="pli"><svg viewBox="0 0 24 24"><path d="M12 22s7-6.5 7-12a7 7 0 00-14 0c0 5.5 7 12 7 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/></svg></span>'+L('Minutes Delivery Area','মিনিটস ডেলিভারি এলাকা')+'<b class="pch geo-cur">'+(window.geoText&&geoText()||L('Not set','সেট করা নেই'))+' ›</b></button><button class="plk plk-lg" data-pa="lang"><span class="pli"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="2"/></svg></span>'+L('Language','ভাষা')+'<em class="plv">'+(lang=='bn'?'বাংলা':'English')+'</em><b class="pch">›</b></button></div><div class="plks plks2"><button class="plk" data-pa="pol" data-w="about"><span class="pli">'+PI.info+'</span>'+L('About NurBuy','NurBuy সম্পর্কে')+'<b class="pch">›</b></button><button class="plk" data-pa="pol" data-w="privacy"><span class="pli">'+PI.doc+'</span>'+L('Privacy Policy','প্রাইভেসি পলিসি')+'<b class="pch">›</b></button><button class="plk" data-pa="pol" data-w="return"><span class="pli">'+PI.ret+'</span>'+L('Return Policy','রিটার্ন পলিসি')+'<b class="pch">›</b></button><button class="plk lo" data-pa="logout"><span class="pli"><svg viewBox="0 0 24 24"><path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9" fill="none" stroke="currentColor" stroke-width="2"/></svg></span>'+L('Log out','লগ আউট')+'<b class="pch">›</b></button></div>'}
function fld(id,lb,v,area){return '<label for="'+id+'">'+lb+'</label>'+(area?'<textarea id="'+id+'">'+esc(v)+'</textarea>':'<input id="'+id+'" value="'+esc(v)+'" autocomplete="off">')}
var pmCb=null;
function pmOpen(t,body,cb){$('pmt').textContent=t;$('pmb').innerHTML=body;pmCb=cb;$('pms').style.display=cb?'':'none';$('pms').textContent=L('Save','সেভ করুন');$('pmc').textContent=cb?L('Cancel','বাতিল'):L('Close','বন্ধ করুন');$('pm').classList.add('o');var f=$('pmb').querySelector('input,textarea');if(f)f.focus()}
function pmClose(){$('pm').classList.remove('o');pmCb=null}
function pmErr(m){var e=$('pmb').querySelector('.perr');if(!e){e=document.createElement('div');e.className='perr';$('pmb').appendChild(e)}e.textContent=m}
function gv(id){return $('pmb').querySelector('#'+id).value.trim()}
function vMob(v){return /^(\+?88)?01\d{9}$/.test(v)}function vMail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
function curU(){return USERS.filter(function(u){return u.id==AU.uid})[0]}
function pwRow(){var u=curU();if(!u||!u.auto||u.ph||u.hasPw)return '';return '<div class="pfd pf-pw"><div class="pbd"><div class="pl">'+L('Password','পাসওয়ার্ড')+'</div><div class="pv">'+L('Not set yet','এখনও সেট করা হয়নি')+'</div></div><div class="pra"><button class="pad pvb" data-pa="setpw">'+L('Set password','পাসওয়ার্ড সেট করুন')+'</button></div></div>'}
function setMob(v){v=v.replace(/^\+?88/,'');if(v!==PROF.mobile)PROF.mvf=false;PROF.mobile=v;var cu=curU();if(cu){cu.mobile=normM(v);usave()}}
$('pmc').onclick=pmClose;$('pm').addEventListener('mousedown',function(e){if(e.target==$('pm'))pmClose()});
$('pms').onclick=function(){if(!pmCb)return;var _pb=JSON.stringify(PROF),r=pmCb(),fin=function(r){if(r){pmErr(r);return}saveProf();if(window.NBN&&AU.uid&&JSON.stringify(PROF)!=_pb)NBN.account('profile');renderProf();pmClose()};if(r&&typeof r.then=='function'){var pb=$('pms');pb.disabled=true;r.then(fin,function(e){fin(liveErr(e))}).then(function(){pb.disabled=false})}else fin(r)};
var POL={shipping:[['Shipping Information','শিপিং তথ্য'],['Your order is delivered by a NurBuy rider from the nearby shop. In served areas most orders arrive within the delivery time shown at checkout. The delivery charge for your area is shown before you place the order. (Sample text – replace with your final policy.)','আপনার অর্ডার কাছের দোকান থেকে NurBuy রাইডার পৌঁছে দেন। সেবা এলাকায় বেশিরভাগ অর্ডার চেকআউটে দেখানো সময়ের মধ্যে পৌঁছায়। অর্ডার করার আগে আপনার এলাকার ডেলিভারি চার্জ দেখানো হয়। (নমুনা লেখা – চূড়ান্ত পলিসি দিয়ে বদলে নিন।)']],about:[['About NurBuy','NurBuy সম্পর্কে'],['NurBuy is an online marketplace that connects customers with local shops. Get everyday items delivered in 15–59 minutes in your area, or order from shops across Bangladesh with nationwide delivery in 2–5 business days.','NurBuy একটি অনলাইন মার্কেটপ্লেস যা ক্রেতাদের স্থানীয় দোকানের সাথে যুক্ত করে। আপনার এলাকায় ১৫–৫৯ মিনিটে প্রতিদিনের পণ্য পান, অথবা সারা বাংলাদেশের দোকান থেকে ২–৫ কার্যদিবসে ডেলিভারি নিন।']],privacy:[['Privacy Policy','প্রাইভেসি পলিসি'],['<h2>Privacy Policy</h2><p>This policy explains what NurBuy collects when you visit the website or order from it, why we collect it, how long we keep it and what you can do about it. Last updated: October 2026.</p><h2>1. What we collect</h2><ul><li><b>Account and order details:</b> your name, mobile number, email (optional), a password stored only in scrambled (hashed) form, your delivery address and map pin, the items you order, payment method and order history.</li><li><b>IP address:</b> recorded with every order, sign-up and sign-in for security and fraud prevention. If you accept optional tracking, it is also recorded with your visit activity.</li><li><b>Visit activity (only with your permission):</b> a random visitor ID stored in your browser, the pages you open, the products and categories you view or click, and the time of each action. If you are signed in, this activity is linked to your account.</li><li><b>Anonymous counts (always):</b> visits, page views and product views are counted without your name, IP address or any account link.</li><li><b>Fraud-prevention records:</b> reports from delivery riders about suspected fake orders, repeated failed deliveries or wrong contact details, the decision our team took, any restriction placed on an account or IP address, and your review requests.</li><li>We do not collect device fingerprints, contacts, photos or your precise location unless you pin a delivery location yourself.</li></ul><h2>2. Cookies and similar storage</h2><p><b>Essential:</b> your sign-in, cart, language and delivery area are kept in your browser so the site works. <b>Optional:</b> activity tracking and personalised suggestions are used only if you press "Accept all" on the privacy notice. You can change your choice at any time under "Your privacy choices" on this page.</p><h2>3. Why we use your information</h2><ul><li>To process and deliver your orders and keep your account working.</li><li>To keep the platform safe: detecting fake orders and abuse, and protecting riders, sellers and other customers.</li><li>To understand how the site is used (anonymous counts).</li><li>With your permission, to personalise: the last two products you viewed and their categories are used to choose which deals, best sellers and recommended products we show you first on your next visit. Personalisation never changes prices and never stops you from ordering.</li><li>To meet legal, tax and accounting duties.</li></ul><h2>4. Fraud prevention and restrictions</h2><p>Delivery riders can report a suspicious order. A report is only a complaint: a person on our team reviews the order history and the evidence, and records a decision. Nobody is blocked automatically, and an IP address is never restricted just because several people share it. If an account or IP address is restricted, you will see a notice with our Customer Care phone number and you can ask for a review. Restrictions can be temporary or permanent and are lifted when a review finds them unjustified.</p><h2>5. Who can see your information</h2><ul><li>The delivery rider and the seller see only what is needed to deliver your order (name, phone number, address, items). Riders cannot see your order history, IP address or browsing activity.</li><li>Only authorised NurBuy staff can open customer records, and every restriction decision is written to an audit log.</li><li>We use service providers for hosting, maps and messages. We do not sell your personal information.</li><li>We may share information when the law requires it.</li></ul><h2>6. How long we keep it</h2><p>By default: visit activity and product views for 6 months; IP addresses stored with visit activity for 3 months; IP addresses stored with orders for 1 year; account and order records while your account exists and as long as the law requires; fraud records for as long as needed to keep the platform safe, reviewed regularly. These periods are set by NurBuy and expired data is deleted automatically.</p><h2>7. Security</h2><p>The site uses an encrypted connection, passwords are hashed, private documents are stored outside public folders, and access to customer data is limited by role.</p><h2>8. Your rights</h2><p>You can ask to see, correct or delete your information, withdraw your consent, object to personalised suggestions, and ask for a review of any restriction. The fastest way to withdraw consent and erase your stored activity is the "Your privacy choices" box on this page. For anything else, contact NurBuy Customer Care using the contact details in the website footer; we answer within 30 days.</p><h2>9. Changes</h2><p>If we change how we use your information we will update this page and, where the law requires, ask for your permission again.</p>','<h2>প্রাইভেসি পলিসি</h2><p>আপনি ওয়েবসাইটে এলে বা অর্ডার করলে NurBuy কী সংগ্রহ করে, কেন করে, কতদিন রাখে এবং আপনি কী করতে পারেন — এই পলিসিতে তা বলা হয়েছে। সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬।</p><h2>১. আমরা কী সংগ্রহ করি</h2><ul><li><b>অ্যাকাউন্ট ও অর্ডারের তথ্য:</b> নাম, মোবাইল নম্বর, ইমেইল (ঐচ্ছিক), শুধু হ্যাশ করা অবস্থায় রাখা পাসওয়ার্ড, ডেলিভারি ঠিকানা ও ম্যাপ পিন, অর্ডার করা পণ্য, পেমেন্ট পদ্ধতি এবং অর্ডারের ইতিহাস।</li><li><b>IP ঠিকানা:</b> নিরাপত্তা ও জালিয়াতি প্রতিরোধের জন্য প্রতিটি অর্ডার, সাইন-আপ ও সাইন-ইনের সময় রাখা হয়। ঐচ্ছিক ট্র্যাকিংয়ে সম্মতি দিলে ভিজিটের অ্যাক্টিভিটির সাথেও রাখা হয়।</li><li><b>ভিজিটের অ্যাক্টিভিটি (শুধু আপনার অনুমতিতে):</b> আপনার ব্রাউজারে রাখা একটি র‍্যান্ডম ভিজিটর আইডি, যে পেজ খোলেন, যে পণ্য ও ক্যাটাগরি দেখেন বা ক্লিক করেন এবং প্রতিটি কাজের সময়। সাইন-ইন থাকলে এই অ্যাক্টিভিটি আপনার অ্যাকাউন্টের সাথে যুক্ত হয়।</li><li><b>নাম-পরিচয়হীন গণনা (সবসময়):</b> ভিজিট, পেজ ভিউ ও পণ্য ভিউ আপনার নাম, IP বা অ্যাকাউন্ট ছাড়াই গোনা হয়।</li><li><b>জালিয়াতি প্রতিরোধের রেকর্ড:</b> ভুয়া অর্ডার, বারবার ডেলিভারি ব্যর্থ বা ভুল যোগাযোগের তথ্য নিয়ে রাইডারের রিপোর্ট, আমাদের টিমের সিদ্ধান্ত, কোনো অ্যাকাউন্ট বা IP-তে দেওয়া রেস্ট্রিকশন এবং আপনার রিভিউ রিকোয়েস্ট।</li><li>ডিভাইস ফিঙ্গারপ্রিন্ট, কন্টাক্ট, ছবি বা আপনার নিখুঁত লোকেশন আমরা সংগ্রহ করি না — আপনি নিজে ডেলিভারি লোকেশন পিন করলে তা ছাড়া।</li></ul><h2>২. কুকি ও অনুরূপ সংরক্ষণ</h2><p><b>জরুরি:</b> সাইট চালু রাখতে আপনার সাইন-ইন, কার্ট, ভাষা ও ডেলিভারি এলাকা ব্রাউজারে রাখা হয়। <b>ঐচ্ছিক:</b> অ্যাক্টিভিটি ট্র্যাকিং ও ব্যক্তিগত সাজেশন শুধু তখনই ব্যবহার হয় যখন আপনি প্রাইভেসি নোটিশে "সব গ্রহণ করুন" চাপেন। যেকোনো সময় এই পেজের "আপনার প্রাইভেসি পছন্দ" থেকে সিদ্ধান্ত বদলাতে পারেন।</p><h2>৩. কেন আপনার তথ্য ব্যবহার করি</h2><ul><li>অর্ডার প্রক্রিয়া ও ডেলিভারি করতে এবং আপনার অ্যাকাউন্ট চালু রাখতে।</li><li>প্ল্যাটফর্ম নিরাপদ রাখতে: ভুয়া অর্ডার ও অপব্যবহার শনাক্ত করে রাইডার, সেলার ও অন্য কাস্টমারকে রক্ষা করতে।</li><li>সাইট কীভাবে ব্যবহার হচ্ছে বুঝতে (নাম-পরিচয়হীন গণনা)।</li><li>আপনার অনুমতি থাকলে ব্যক্তিগত সাজেশনে: আপনার দেখা শেষ দুটি পণ্য ও তাদের ক্যাটাগরি দেখে পরের বার কোন ডিল, বেস্ট সেলার ও সুপারিশকৃত পণ্য আগে দেখাব তা ঠিক করি। এতে দাম বদলায় না, অর্ডার করাও আটকায় না।</li><li>আইন, কর ও হিসাবের দায়িত্ব পালন করতে।</li></ul><h2>৪. জালিয়াতি প্রতিরোধ ও রেস্ট্রিকশন</h2><p>ডেলিভারি রাইডার সন্দেহজনক অর্ডার রিপোর্ট করতে পারেন। রিপোর্ট শুধু একটি অভিযোগ: আমাদের টিমের একজন মানুষ অর্ডারের ইতিহাস ও প্রমাণ দেখে সিদ্ধান্ত লিখে রাখেন। কাউকে নিজে থেকে ব্লক করা হয় না, আর কয়েকজন একই IP ব্যবহার করলেই সেই IP রেস্ট্রিক্ট করা হয় না। কোনো অ্যাকাউন্ট বা IP রেস্ট্রিক্ট হলে কাস্টমার কেয়ারের ফোন নম্বরসহ একটি নোটিশ দেখবেন এবং রিভিউ চাইতে পারবেন। রেস্ট্রিকশন সাময়িক বা স্থায়ী হতে পারে; রিভিউয়ে অযৌক্তিক মনে হলে তুলে নেওয়া হয়।</p><h2>৫. কারা আপনার তথ্য দেখতে পায়</h2><ul><li>রাইডার ও সেলার শুধু ডেলিভারির জন্য যতটুকু দরকার (নাম, ফোন, ঠিকানা, পণ্য) ততটুকু দেখেন। রাইডার আপনার অর্ডারের ইতিহাস, IP বা ব্রাউজিং অ্যাক্টিভিটি দেখতে পান না।</li><li>শুধু অনুমোদিত NurBuy স্টাফ কাস্টমারের রেকর্ড খুলতে পারেন এবং প্রতিটি রেস্ট্রিকশনের সিদ্ধান্ত অডিট লগে লেখা হয়।</li><li>হোস্টিং, ম্যাপ ও মেসেজের জন্য সেবাদাতা ব্যবহার করি। আপনার ব্যক্তিগত তথ্য আমরা বিক্রি করি না।</li><li>আইন চাইলে তথ্য দিতে হতে পারে।</li></ul><h2>৬. কতদিন রাখি</h2><p>ডিফল্টভাবে: ভিজিট অ্যাক্টিভিটি ও পণ্য ভিউ ৬ মাস; অ্যাক্টিভিটির সাথে রাখা IP ৩ মাস; অর্ডারের সাথে রাখা IP ১ বছর; অ্যাকাউন্ট ও অর্ডারের রেকর্ড অ্যাকাউন্ট থাকা পর্যন্ত এবং আইনের প্রয়োজন অনুযায়ী; জালিয়াতির রেকর্ড প্ল্যাটফর্ম নিরাপদ রাখতে যতদিন দরকার, নিয়মিত পর্যালোচনাসহ। এই সময়সীমা NurBuy ঠিক করে এবং মেয়াদ শেষ হলে ডেটা নিজে থেকে মুছে যায়।</p><h2>৭. নিরাপত্তা</h2><p>সাইটে এনক্রিপ্টেড সংযোগ ব্যবহার হয়, পাসওয়ার্ড হ্যাশ করা থাকে, ব্যক্তিগত ডকুমেন্ট পাবলিক ফোল্ডারের বাইরে রাখা হয় এবং কাস্টমারের তথ্যে প্রবেশ ভূমিকা অনুযায়ী সীমিত।</p><h2>৮. আপনার অধিকার</h2><p>আপনি আপনার তথ্য দেখতে, সংশোধন বা মুছে ফেলতে বলতে পারেন, সম্মতি প্রত্যাহার করতে পারেন, ব্যক্তিগত সাজেশনে আপত্তি জানাতে পারেন এবং যেকোনো রেস্ট্রিকশনের রিভিউ চাইতে পারেন। সম্মতি তুলে নিতে ও জমা অ্যাক্টিভিটি মুছতে সবচেয়ে দ্রুত উপায় এই পেজের "আপনার প্রাইভেসি পছন্দ" বক্স। অন্য বিষয়ে ওয়েবসাইটের ফুটারের যোগাযোগের তথ্য দিয়ে NurBuy কাস্টমার কেয়ারে জানান; আমরা ৩০ দিনের মধ্যে উত্তর দিই।</p><h2>৯. পরিবর্তন</h2><p>আপনার তথ্য ব্যবহারের পদ্ধতি বদলালে এই পেজ হালনাগাদ করব এবং আইন চাইলে আবার আপনার অনুমতি চাইব।</p>']],'return':[['Return Policy','রিটার্ন পলিসি'],['If an item arrives damaged, wrong or expired, contact us within 24 hours of delivery for a replacement or refund. Perishable items such as fresh food can only be returned if there is a quality problem. (Sample text – replace with your final policy.)','পণ্য নষ্ট, ভুল বা মেয়াদোত্তীর্ণ এলে ডেলিভারির ২৪ ঘণ্টার মধ্যে আমাদের জানান, বদলে নতুন পণ্য বা টাকা ফেরত পাবেন। তাজা খাবারের মতো পচনশীল পণ্য শুধু মানের সমস্যা থাকলে ফেরত নেওয়া হবে। (নমুনা লেখা – চূড়ান্ত পলিসি দিয়ে বদলে নিন।)']]};
POL.following=[['Following','ফলোইং'],['','']];
var FTS=null;
var FI={home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',grid:'<rect x="4" y="4" width="6.500" height="6.500" rx="1.500"/><rect x="13.500" y="4" width="6.500" height="6.500" rx="1.500"/><rect x="4" y="13.500" width="6.500" height="6.500" rx="1.500"/><rect x="13.500" y="13.500" width="6.500" height="6.500" rx="1.500"/>',tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.500" cy="8.500" r="1.300"/>',spark:'<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.400 3.600-7 8-7s8 2.600 8 7"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="2.500"/><path d="M3.500 7l8.500 6.500L20.500 7"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.500 9.500a2.600 2.600 0 115 .8c0 1.700-2.500 2-2.500 3.700"/><circle cx="12" cy="17.300" r=".6"/>',truck:'<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.500" r="1.800"/><circle cx="17" cy="17.500" r="1.800"/>',box:'<path d="M12 3l8 4.500v9L12 21l-8-4.500v-9z"/><path d="M4 7.500l8 4.500 8-4.500M12 12v9"/>',shield:'<path d="M12 3l7 3v5c0 4.500-3 8.200-7 10-4-1.800-7-5.500-7-10V6z"/><path d="M9 12l2 2 4-4"/>',ret:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>',store:'<path d="M4 9l1.500-5h13L20 9"/><path d="M4 9a2.500 2.500 0 005 0 2.500 2.500 0 005 0 2.500 2.500 0 005 0"/><path d="M5 11.500V20h14v-8.500M10 20v-5h4v5"/>',rider:'<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17h4l3-8h3M13 9h-3M16 9l2 8"/>',pin:'<path d="M12 21s-7-6.200-7-11.500a7 7 0 0114 0C19 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/>',phone:'<path d="M5 4h4l2 5-2.500 1.500a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.500 2"/>'};
var FSO={facebook:'<svg viewBox="0 0 24 24"><path d="M14 8h2V5h-2.500C11 5 10 6.500 10 8.500V10H8v3h2v6h3v-6h2.200l.4-3H13V8.700c0-.5.200-.7 1-.7z"/></svg>',youtube:'<svg viewBox="0 0 24 24"><path d="M21.500 8.200a2.600 2.600 0 00-1.800-1.800C18.100 6 12 6 12 6s-6.100 0-7.700.4A2.600 2.600 0 002.500 8.200C2 9.800 2 12 2 12s0 2.200.5 3.800a2.600 2.600 0 001.800 1.800C5.900 18 12 18 12 18s6.100 0 7.700-.4a2.600 2.600 0 001.800-1.800c.5-1.600.5-3.800.5-3.800s0-2.200-.5-3.800zM10 15V9l5.200 3z"/></svg>',instagram:'<svg class="s" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4.500"/><circle cx="12" cy="12" r="3.700"/><circle cx="17" cy="7" r=".6"/></svg>',x:'<svg class="s" viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg>',linkedin:'<svg viewBox="0 0 24 24"><rect x="5" y="10" width="3" height="9"/><circle cx="6.500" cy="6.500" r="1.800"/><path d="M11 10h3v1.300c.5-.9 1.600-1.500 3-1.500 2.700 0 3 1.800 3 3.700V19h-3v-4.800c0-1-.2-1.800-1.300-1.800-1.200 0-1.700.9-1.700 1.900V19h-3z"/></svg>'};
var FSOL={facebook:'Facebook',youtube:'YouTube',instagram:'Instagram',x:'X',linkedin:'LinkedIn'};
var FGP='<svg viewBox="0 0 24 24"><path d="M3.600 2.400l10.100 9.600-10.100 9.600c-.4-.3-.6-.8-.6-1.400V3.800c0-.6.200-1.100.6-1.400z" fill="#00d3ff"/><path d="M17 8.700L13.700 12 17 15.300l3.800-2.100c1.100-.6 1.100-1.800 0-2.400z" fill="#ffc400"/><path d="M3.600 2.400c.4-.3 1-.3 1.600 0L17 8.700 13.700 12z" fill="#00e676"/><path d="M3.600 21.600c.4.3 1 .3 1.600 0L17 15.300 13.700 12z" fill="#ff3d57"/></svg>';
var FAS='<svg viewBox="0 0 24 24" fill="#fff"><path d="M12.150 6.900c-.9 0-2.400-1.100-4-1-2 0-3.900 1.200-5 3-2.100 3.700-.5 9.100 1.500 12.100 1 1.500 2.200 3.100 3.800 3 1.500-.1 2.100-1 3.900-1 1.800 0 2.400 1 4 .9 1.600 0 2.700-1.500 3.700-2.900 1.200-1.700 1.600-3.300 1.700-3.400 0 0-3.200-1.200-3.200-4.900 0-3 2.500-4.500 2.600-4.600-1.400-2.100-3.600-2.300-4.400-2.400-2-.2-3.700 1.100-4.600 1.100zM15.500 3.800c.8-1 1.400-2.400 1.200-3.800-1.200.1-2.700.8-3.500 1.800-.8.900-1.500 2.300-1.300 3.700 1.300.1 2.700-.7 3.600-1.700z"/></svg>';
function ftT(o){return o?((lang=='bn'&&o.bn&&o.bn.trim())?o.bn:(o.en||'')):''}
function ftIc(k){return '<svg class="i" viewBox="0 0 24 24">'+FI[k]+'</svg>'}
function ftA(u,inner,cls){u=NBFOOT.link(u);if(!u)return '<span class="'+cls+'">'+inner+'</span>';var act=/^#[a-z]+$/i.test(u);return '<a class="'+cls+'" href="'+(act?'#':esc(u))+'"'+(act?' data-ft="'+esc(u.slice(1))+'"':/^https?:/i.test(u)?' target="_blank" rel="noopener"':'')+'>'+inner+'</a>'}
function ftRender(){var f=$('ftw');if(!f)return;var C=NBFOOT.merge(FTS),t=ftT,
col=function(h,b,x){return '<div class="ft-c'+(x||'')+'"><h4>'+esc(t(h))+'</h4>'+b+'</div>'},
logo=BRL?'<span class="ft-lp"><img src="'+esc(BRL)+'" alt="NurBuy"></span>':'<span class="ft-lw"><svg viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#1d2fe0"/><path d="M9 12h14l-1 12H10z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M12.500 12v-1a3.500 3.500 0 017 0v1" fill="none" stroke="#fff" stroke-width="2"/></svg><b>Nur<i>Buy</i></b></span>',
so=Object.keys(FSO).map(function(k){var u=NBFOOT.link(C.social[k]),a=/^#[a-z]+$/.test(u||'');return u&&!a?'<a href="'+esc(u)+'" target="_blank" rel="noopener" aria-label="'+FSOL[k]+'">'+FSO[k]+'</a>':'<span aria-label="'+FSOL[k]+'">'+FSO[k]+'</span>'}).join(''),
qi=['home','grid','tag','spark','user','mail','help'],si=['help','truck','box','ret','shield'],mi=['store','rider'],
ql=C.quick.map(function(x,i){return t(x.t).trim()?ftA(x.u,ftIc(qi[i])+'<b>'+esc(t(x.t))+'</b>','ft-q'):''}).join(''),
sl=C.serv.map(function(x,i){return t(x.t).trim()?ftA(x.u,'<span class="ft-ic">'+ftIc(si[i])+'</span><div><b>'+esc(t(x.t))+'</b>'+(t(x.s).trim()?'<small>'+esc(t(x.s))+'</small>':'')+'</div>','ft-sv'):''}).join(''),
ml=C.more.map(function(x,i){return t(x.t).trim()?ftA(x.u,'<span class="ft-ic">'+ftIc(mi[i])+'</span><div><b>'+esc(t(x.t))+'</b>'+(t(x.s).trim()?'<small>'+esc(t(x.s))+'</small>':'')+'</div>','ft-sv'):''}).join(''),
nw=C.news.on?'<div class="ft-sv"><span class="ft-ic">'+ftIc('mail')+'</span><div><b>'+esc(t(C.news.t))+'</b><small>'+esc(t(C.news.s))+'</small></div></div><form class="ft-nl" data-ftn novalidate><input type="email" autocomplete="email" placeholder="'+esc(t(C.news.ph))+'" aria-label="Email"><button type="submit">'+esc(t(C.news.btn))+'</button></form>':'',
ci=function(ic,txt,u){return txt.trim()?ftA(u||'','<span class="ft-ic">'+ftIc(ic)+'</span><div>'+esc(txt)+'</div>','ft-ct'):''},
ph=C.phone.trim(),em=C.email.trim(),
cl=ci('pin',t(C.addr))+ci('phone',ph,ph?'tel:'+ph.replace(/[^\d+]/g,''):'')+ci('mail',em,em?'mailto:'+em:'')+ci('clock',t(C.hours)),
ab=function(u,svg,s1,s2){return ftA(u,svg+'<div><small>'+s1+'</small><b>'+s2+'</b></div>','')},
ap='<div class="ft-ap"><h5>'+esc(t(C.app.t))+'</h5><p>'+esc(t(C.app.s))+'</p><div class="ft-bd">'+ab(C.app.gp,FGP,'GET IT ON','Google Play')+ab(C.app.as,FAS,'Download on the','App Store')+'</div></div>';
f.innerHTML='<div class="ft-c">'+logo+'<div class="ft-tg">'+esc(t(C.tagline))+'</div><p class="ft-ab">'+esc(t(C.about))+'</p><div class="ft-so">'+so+'</div></div>'
+col(C.quickT,ql)+col(C.servT,sl)+col(C.moreT,ml+nw)+col(C.contactT,cl+ap)}
function ftPol(k){var P=POL[k];if(!P)return;if(window.openPolPage&&openPolPage(k))return;var n=lang=='bn'?1:0;pmOpen(P[0][n],'<p style="white-space:pre-line">'+esc(P[1][n])+'</p>',null)}
function ftGo(k){switch(k){case 'home':goHome();break;case 'categories':var a=document.querySelectorAll('.bn a')[1];if(a)a.click();break;case 'deals':openAll('hot');break;case 'new':openAll('new');break;case 'orders':openOrd();break;case 'help':if(window.NBChat)NBChat.open();break;case 'contact':var C=NBFOOT.merge(FTS);pmOpen(ftT(C.contactT),'<p style="white-space:pre-line">'+esc([ftT(C.addr),C.phone,C.email,ftT(C.hours)].filter(function(x){return String(x).trim()}).join('\n'))+'</p>',null);break;default:ftPol(k)}}
function ftSub(fm){var i=fm.querySelector('input'),b=fm.querySelector('button'),v=i.value.trim();if(!vMail(v)){msg(L('Enter a valid email','সঠিক ইমেইল দিন'));return}b.disabled=true;var ok=function(){b.disabled=false;i.value='';msg(L('Thanks for subscribing!','সাবস্ক্রাইব করার জন্য ধন্যবাদ!'))};if(LIVE)nbApi('POST','/newsletter',{email:v}).then(ok,function(e){b.disabled=false;msg(liveErr(e))});else ok()}
(function(){var f=$('ft');if(f){f.addEventListener('click',function(e){var a=e.target.closest('a[data-ft]');if(!a)return;e.preventDefault();ftGo(a.dataset.ft)});f.addEventListener('submit',function(e){var fm=e.target.closest('form[data-ftn]');if(!fm)return;e.preventDefault();ftSub(fm)})}ftRender();var _sl=setLang;setLang=function(){var r=_sl.apply(this,arguments);ftRender();return r}})();
$('profv').addEventListener('click',function(e){var t=e.target.closest('[data-pa]');
if(e.target.closest('#pback')){NAV.back();return}
if(e.target.closest('#pav,#pcam')){$('pfile').click();return}
if(e.target.closest('#pcc')){$('pcfile').click();return}
if(e.target.closest('#pcx')){PROF.cover='';saveProf();renderProf();return}
if(e.target.closest('#pep,#pne')){pmOpen(L('Edit Profile','প্রোফাইল এডিট'),fld('f1',L('Name','নাম'),PROF.name)+fld('f2',L('Mobile','মোবাইল'),PROF.mobile)+fld('f3',L('Email','ইমেইল'),PROF.email),function(){var n=gv('f1'),m=gv('f2'),em=gv('f3');if(!n)return L('Please enter your name','নাম লিখুন');if(!vMob(m))return L('Enter a valid mobile number (01XXXXXXXXX)','সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)');if(!vMail(em))return L('Enter a valid email','সঠিক ইমেইল দিন');if(LIVE)return nbApi('PUT','/me',{name:n.slice(0,40),mobile:normM(m),email:em}).then(function(r){var u=srvUser(r.user);USERS=[u];PROF.name=u.name;PROF.mobile=u.mobile;PROF.email=u.email;PROF.mvf=u.mvf;updAuthUI();return ''},liveErr);var dq=window.dupU(m,em,AU.uid);if(dq.m)return L('This mobile number is already used by another account','এই মোবাইল নম্বর দিয়ে আরেকটি অ্যাকাউন্ট আছে');if(dq.e)return L('This email is already used by another account','এই ইমেইল দিয়ে আরেকটি অ্যাকাউন্ট আছে');PROF.name=n.slice(0,40);setMob(m);PROF.email=em;var cu=curU();if(cu){cu.name=PROF.name;cu.email=em.toLowerCase();usave()}return ''});return}
if(!t)return;var a=t.dataset.pa,i=+t.dataset.i;
if(a=='mobile')pmOpen(L('Edit Mobile','মোবাইল এডিট'),fld('f1',L('Mobile','মোবাইল'),PROF.mobile),function(){var m=gv('f1');if(!vMob(m))return L('Enter a valid mobile number (01XXXXXXXXX)','সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)');if(LIVE)return nbApi('PUT','/me',{mobile:normM(m)}).then(function(r){var u=srvUser(r.user);USERS=[u];PROF.mobile=u.mobile;PROF.mvf=u.mvf;return ''},liveErr);if(window.dupU(m,'',AU.uid).m)return L('This mobile number is already used by another account','এই মোবাইল নম্বর দিয়ে আরেকটি অ্যাকাউন্ট আছে');setMob(m);return ''});
else if(a=='verify')pmOpen(L('Verify mobile','মোবাইল ভেরিফাই'),'<p style="margin:0 0 8px;font-size:13.5px;color:#555">'+L('Enter the 6-digit code sent to ','৬ ডিজিটের কোড দিন, পাঠানো হয়েছে: ')+'<b>'+esc(PROF.mobile)+'</b><br><small>'+L('Demo code: 123456 (real SMS comes with the backend)','ডেমো কোড: 123456 (আসল SMS ব্যাকএন্ড যুক্ত হলে)')+'</small></p>'+fld('f1',L('Verification code','ভেরিফিকেশন কোড'),''),function(){if(LIVE)return nbApi('POST','/me/verify-mobile',{code:gv('f1')}).then(function(){PROF.mvf=true;var u=curU();if(u)u.mvf=true;return ''},liveErr);if(gv('f1')!='123456')return L('Wrong code. Try 123456','কোড ভুল। 123456 দিন');PROF.mvf=true;return ''})
else if(a=='setpw')pmOpen(L('Set password','পাসওয়ার্ড সেট'),fld('f1',L('New password (min 6 characters)','নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)'),''),function(){var v=gv('f1');if(v.length<6)return L('Use at least 6 characters','কমপক্ষে ৬ অক্ষর দিন');if(LIVE)return nbApi('POST','/me/password',{password:v}).then(function(){var u=curU();if(u){u.hasPw=true;u.auto=false}return ''},liveErr);var u=curU();if(u){u.ph=hsA('nb|'+v);u.auto=false;usave()}return ''})
else if(a=='email')pmOpen(L('Edit Email','ইমেইল এডিট'),fld('f1',L('Email','ইমেইল'),PROF.email),function(){var m=gv('f1');if(!vMail(m))return L('Enter a valid email','সঠিক ইমেইল দিন');if(LIVE)return nbApi('PUT','/me',{email:m}).then(function(r){var u=srvUser(r.user);USERS=[u];PROF.email=u.email;return ''},liveErr);if(window.dupU('',m,AU.uid).e)return L('This email is already used by another account','এই ইমেইল দিয়ে আরেকটি অ্যাকাউন্ট আছে');PROF.email=m;var cu=curU();if(cu){cu.email=m.toLowerCase();usave()}return ''});
else if(a=='aadd')pmOpen(L('Add Address','ঠিকানা যোগ করুন'),fld('f1',L('Full address','পূর্ণ ঠিকানা'),'',1),function(){var v=gv('f1');if(!v)return L('Please enter an address','ঠিকানা লিখুন');PROF.addr.push(v.slice(0,200));return ''});
else if(a=='aedit')pmOpen(L('Edit Address','ঠিকানা এডিট'),fld('f1',L('Full address','পূর্ণ ঠিকানা'),PROF.addr[i],1),function(){var v=gv('f1');if(!v)return L('Please enter an address','ঠিকানা লিখুন');PROF.addr[i]=v.slice(0,200);return ''});
else if(a=='adel'){PROF.addr.splice(i,1);saveProf();renderProf()}
else if(a=='loc')openMap();
else if(a=='copy'){var cv=t.dataset.v;try{navigator.clipboard.writeText(cv)}catch(x){}msg(L('Copied','কপি হয়েছে'))}
else if(a=='gmap'){window.open('https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(locName()+', Bangladesh'),'_blank','noopener')}
else if(a=='wish'){openWish()}
else if(a=='fol'){if(window.openPolPage)openPolPage('following')}
else if(a=='ord'){closeProf();openOrd()}else if(a=='hist'){closeProf();openHist()}else if(a=='geo'){openGeo(true)}
else if(a=='logout'){doLogout()}
else if(a=='lang'){pmOpen(L('Language','ভাষা'),'<div class="lgp">'+[['bn','বাংলা','Bangla'],['en','English','ইংরেজি']].map(function(x){return '<button type="button" class="lgo'+(lang==x[0]?' on':'')+'" data-lg="'+x[0]+'"><b>'+x[1]+'</b><small>'+x[2]+'</small><i>'+(lang==x[0]?'✓':'')+'</i></button>'}).join('')+'</div>',null)}
else if(a=='pol'){var P=POL[t.dataset.w],b=lang=='bn'?1:0;if(window.openPolPage&&openPolPage(t.dataset.w))return;pmOpen(P[0][b],'<p style="white-space:pre-line">'+esc(P[1][b])+'</p>',null)}});
$('pcfile').addEventListener('change',function(){var f=this.files&&this.files[0];if(!f||!/^image\//.test(f.type))return;var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var c=document.createElement('canvas'),z=Math.min(1,1600/Math.max(im.width,im.height));c.width=Math.round(im.width*z);c.height=Math.round(im.height*z);c.getContext('2d').drawImage(im,0,0,c.width,c.height);PROF.cover=c.toDataURL('image/jpeg',.82);saveProf();renderProf()};im.src=r.result};r.readAsDataURL(f);this.value=''});
$('pfile').addEventListener('change',function(){var f=this.files&&this.files[0];if(!f||!/^image\//.test(f.type))return;var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var c=document.createElement('canvas'),z=Math.min(1,256/Math.min(im.width,im.height));c.width=Math.round(im.width*z);c.height=Math.round(im.height*z);c.getContext('2d').drawImage(im,0,0,c.width,c.height);var du=c.toDataURL('image/jpeg',.85);
if(!(LIVE&&AU.uid&&TOKN)){PROF.avatar=du;saveProf();renderProf();return}
var old=PROF.avatar;window.__avOld=/^data:/.test(old||'')?'':old;PROF.avatar=du;renderProf();
c.toBlob(function(bl){var fd=new FormData();fd.append('file',bl,'avatar.jpg');
fetch(NBAPI+(window.NB_API_PRETTY===false?'/index.php':'')+'/me/avatar',{method:'POST',headers:{Authorization:'Bearer '+TOKN},body:fd}).then(function(r){return r.json().then(function(j){if(!r.ok)throw new Error(j.error||'')
return j})}).then(function(j){PROF.avatar=j.url;saveProf();renderProf()}).catch(function(e){PROF.avatar=old;renderProf();msg((e&&e.message)||L('Photo could not be saved. Please try again.','ছবি সেভ হয়নি। আবার চেষ্টা করুন।'))})},'image/jpeg',.85)};im.src=r.result};r.readAsDataURL(f);this.value=''});
var _cf=$('mcf').onclick;$('mcf').onclick=function(){_cf();var d=$('lcn').dataset.i;PROF.locI=(d===''||d===undefined)?-1:+d;saveProf();if(document.body.classList.contains('vp'))renderProf()};
function openProf(){if(authGate('prof'))return;closeOrd();closeShops();closePD();closeAll();if(window.cpS&&cpS.o)closeCP();document.body.classList.add('vp');renderProf();try{history.pushState({p:1},'','#profile')}catch(e){}window.scrollTo(0,0);setTab(4)}
function closeProf(){document.body.classList.remove('vp');pmClose()}
window.addEventListener('popstate',function(){if(document.body.classList.contains('vp')){closeProf();setTab(0)}if(document.body.classList.contains('vo')){closeOrd();closeShops();closePD();setTab(0)}if(document.body.classList.contains('vs')&&!(history.state&&(history.state.s||history.state.l))){closeShops();closePD();setTab(0)}});
$('dlog').onclick=function(){openProf()};
/* ===== PRODUCT DETAILS ===== */
var PDS={k:null,p:null,qty:1};
function hs(t){var h=0;for(var i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;return h}
function findP(k){var p=PMAP[k]||null;if(p)return p;['min'].forEach(function(v){V[v].hot.concat(V[v].best).forEach(function(x){if(v+(typeof x[1]=='object'?x[1].en:x[1])==k)p=x})});if(!p)NEWL().forEach(function(x){if('new'+(typeof x[1]=='object'?x[1].en:x[1])==k)p=x});if(!p)H.forEach(function(o){if(o.k==k)p=o.p});return p}
var PDI={bk:'<path d="M15 5l-7 7 7 7"/>',se:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',ht:'<path d="M12 21s-8-5-8-11a4.500 4.500 0 018-2.800A4.500 4.500 0 0120 10c0 6-8 11-8 11z"/>',sh:'<path d="M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"/>',pin:'<path d="M12 22s7-6.500 7-12a7 7 0 00-14 0c0 5.500 7 12 7 12z"/><circle cx="12" cy="10" r="2.500"/>',clk:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',shop:'<path d="M4 9l1-5h14l1 5M4 9v11h16V9M4 9a3 3 0 006 0 3 3 0 006 0 3 3 0 004 0"/>',ret:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>'};
function pdDesc(nm,shop,unit){var n=esc(nm),sh=esc(shop),u=esc(unit);
return '<p>'+L('Meet '+n+' from '+sh+' - a dependable everyday pick, carefully selected and quality checked before it reaches you. Each order is packed fresh and handled with care so it arrives exactly as shown.',n+' - '+sh+' থেকে বাছাই করা একটি নির্ভরযোগ্য পণ্য। ডেলিভারির আগে মান যাচাই করা হয় এবং যত্নের সাথে প্যাক করা হয়, যাতে ছবির মতোই হাতে পৌঁছায়।')+'</p>'
+'<ul><li>'+L('Pack size / unit: ','প্যাক / একক: ')+u+'</li><li>'+L('Sold and shipped by ',' বিক্রেতা ও সরবরাহকারী: ')+sh+'</li><li>'+(L('Delivered in minutes in your area','আপনার এলাকায় মিনিটসেই ডেলিভারি'))+'</li><li>'+L('Easy returns if the item is not as described','বর্ণনার সাথে না মিললে সহজ রিটার্ন')+'</li><li>'+L('Secure payment, Cash on Delivery available','নিরাপদ পেমেন্ট, ক্যাশ অন ডেলিভারি আছে')+'</li></ul>'
+'<p class="pd-dn">'+L('Product images are for illustration. Actual packaging may vary slightly.','ছবি শুধু উদাহরণস্বরূপ। প্যাকেজিং সামান্য ভিন্ন হতে পারে।')+'</p>'}

function pdDescL(p){var en=String(p[10]||'').trim(),bn=String(p[15]||'').trim(),t=lang=='bn'?(bn||en):(en||bn);return t?'<p>'+esc(t).replace(/\n/g,'<br>')+'</p>':'<p class="pd-dn">'+L('The seller has not added a description yet.','বিক্রেতা এখনো কোনো বিবরণ যোগ করেননি।')+'</p>'}
function pdDate(p){var t=p&&+p[17];if(!(t>0))return '';try{return new Date(t).toLocaleDateString(lang=='bn'?'bn-BD':'en-GB',{day:'numeric',month:'long',year:'numeric'})}catch(e){return ''}}
function pdMeta(p){var d=pdDate(p),c=p&&p[16];if(!d&&!c)return '';return '<div class="pd-meta">'+(d?'<span>'+L('Added on','যোগ হয়েছে')+' '+esc(d)+'</span>':'')+(c?'<span>'+L('Product ID','প্রোডাক্ট আইডি')+': <b>'+esc(c)+'</b></span>':'')+'</div>'}
function pdSpecL(p,shop){var r=[[L('Seller','বিক্রেতা'),shop]];if(p[16])r.push([L('Product ID','প্রোডাক্ট আইডি'),p[16]]);if(pdDate(p))r.push([L('Added on','যোগ হয়েছে'),pdDate(p)]);if(p[12])r.push([L('Category','ক্যাটাগরি'),p[12]+(p[13]?' / '+p[13]:'')]);(p[11]||[]).forEach(function(x){r.push([x[0],x[1]])});return r.map(function(x){return '<span>'+esc(x[0])+'</span><b>'+esc(x[1])+'</b>'}).join('')}
function pdVrHtml(){var A=PDS,p=A.p;if(!A.g||!A.g.length)return '';var c=atcCalc(A);
if(A.vr){var st=c.v?+c.v.stock:0;return A.g.map(function(g,gi){return vrGroupHtml(A,gi,function(a,b){return 'data-pv="'+a+'" data-o="'+b+'"'})}).join('')+'<div class="atc-stk'+(st>9?' ok':'')+(st<=0?' oos':'')+'" id="pdvs" style="margin-top:12px">'+(st<=0?L('Out of Stock','স্টক শেষ'):st>9?L('In stock','স্টকে আছে'):L('Only '+st+' left in stock','মাত্র '+st+'টি বাকি'))+'</div>'}
return A.g.map(function(g,gi){return '<div class="atc-g"><div class="atc-gh"><b>'+g.l+'</b><small>'+esc(g.o[A.sel[gi]].n)+'</small></div><div class="atc-op">'+g.o.map(function(o,oi){var pr='';if(o.m!==undefined&&o.m!=1){pr='<small>'+pdMoney(Math.round(p[3]*o.m))+'</small>'}else if(o.a){pr='<small>+'+pdMoney(o.a)+'</small>'}else if(g.pct&&g.pct[oi]){pr='<small>+'+Math.round(g.pct[oi]*100)+'%</small>'}
return '<button type="button" class="atc-ob'+(oi==A.sel[gi]?' on':'')+'" data-pv="'+gi+'" data-o="'+oi+'">'+(o.sw?'<i class="atc-sw" style="background:'+o.sw+'"></i>':'')+esc(o.n)+pr+'</button>'}).join('')+'</div></div>'}).join('')}
function pdVrX(noImg){var A=PDS;if(!A.vr)return;var c=atcCalc(A),st=c.v?+c.v.stock:0;A.vmax=pLim(enName(A.p[1]),st);if(A.qty>A.vmax)A.qty=A.vmax;var shut=pClosed(enName(A.p[1]));['pdad','pdbn'].forEach(function(i){var b=$(i);if(b)b.disabled=st<=0||!!shut});var qn=$('pdqn');if(qn)qn.textContent=A.qty;var qs=$('pdq');if(qs){var o='';for(var n=1;n<=A.vmax;n++)o+='<option'+(n==A.qty?' selected':'')+'>'+n+'</option>';qs.innerHTML=o;qs.value=A.qty}var bb=document.querySelectorAll('[data-pq]');if(bb.length>1){bb[0].disabled=A.qty<=1;bb[1].disabled=A.qty>=A.vmax}
if(noImg||!c.v||!c.v.img)return;var im=galOf(A.p)||[imgOf(A.p)],ix=im.indexOf(c.v.img),gs=$('pdgs'),s0=document.querySelector('#pdgs .pd-sl'),t0=document.querySelector('#pdth .pd-tb');if(!gs)return;if(ix<0){if(s0)s0.innerHTML=PIC(c.v.img,A.p[0],'','');if(t0)t0.innerHTML=PIC(c.v.img,A.p[0],'','');ix=0}else{if(s0)s0.innerHTML=PIC(im[0],A.p[0],'','');if(t0)t0.innerHTML=PIC(im[0],A.p[0],'','')}
gs.scrollTo({left:gs.clientWidth*ix,behavior:'smooth'});document.querySelectorAll('.pd-tb').forEach(function(x,j){x.classList.toggle('on',j==ix)})}
/* Line next to the price: Free Delivery / discount / stock / delivery time of the visitor's village, one by one every 2 seconds */
function pdTkList(){var A=PDS;if(!A||!A.p)return [];var c=atcCalc(A),off=c.old>c.u?Math.round((c.old-c.u)*100/c.old):0,fr=FREEMIN(),en=enName(A.p[1]),m=[];
m.push(c.u>=fr?L('Free Delivery','ফ্রি ডেলিভারি'):(lang=='bn'?'৳'+bnN(fr)+' এর উপরে ফ্রি ডেলিভারি':'Free Delivery Over ৳'+fr));
if(off>0)m.push(L(off+'% Off',bnN(off)+'% ছাড়'));
var n=A.vr?(c.v&&c.v.stock!=null?+c.v.stock:null):(LIVE&&LST[en]!=null?+LST[en]:null);
if(n!=null&&n>0)m.push(L(n+' left in stock','স্টকে আছে '+bnN(n)+' টি'));
var e=window.v2Eta?+v2Eta():0;if(e>0)m.push(L('Delivery in '+e+' minutes',bnN(e)+' মিনিটে ডেলিভারি'));
return m}
var PDTK=0;
function pdTkH(){var l=pdTkList();return '<span class="pd-fc pd-tk"><i class="tkm">'+esc(l.length?l[PDTK%l.length]:'')+'</i></span>'}
setInterval(function(){if(document.hidden||!document.body.classList.contains('vd')||!window.PDS||!PDS.p)return;var es=document.querySelectorAll('.pd-tk');if(!es.length)return;var l=pdTkList();if(!l.length)return;PDTK++;es.forEach(function(e){e.innerHTML='<i class="tkm">'+esc(l[PDTK%l.length])+'</i>'})},2000);
function pdClosedHtml(en){var cs=pClosed(en);return cs?'<div class="pd-cls">'+uic('clock')+'<div><b>'+shClosedLbl(cs)+'</b><span>'+esc(cs.nx||'')+'</span></div></div>':''}
function pdVrUpd(){var A=PDS,p=A.p,c=atcCalc(A),off=c.old>c.u?Math.round((c.old-c.u)*100/c.old):0,b=$('pdvr');if(b)b.innerHTML=pdVrHtml();var bm=$('pdvrm');if(bm)bm.innerHTML=pdVrHtml();pdVrX();
document.querySelectorAll('.pd-pp').forEach(function(e){e.innerHTML='<b>'+pdMoney(c.u)+'.00</b>'+(off?'<del>'+c.old+'.00</del><em>'+off+'% '+L('Off','ছাড়')+'</em>':'')+pdTkH()});
document.querySelectorAll('.pd-pr').forEach(function(e){e.innerHTML='<b>'+pdMoney(c.u)+'</b>'+(off?'<del>'+c.old+'</del><em>'+off+'% '+L('OFF','ছাড়')+'</em>':'')+'<small>('+L('Incl. VAT','ভ্যাটসহ')+')</small>'})}
function pdVrSave(){var A=PDS;if(A.g&&A.g.length)VAR[A.k]=vrRec(A);else delete VAR[A.k]}
function pdSvg(k){return '<svg viewBox="0 0 24 24">'+PDI[k]+'</svg>'}
function pdMoney(n){return '৳ '+Number(n).toLocaleString('en-US')}
function pdShop(en,h){if(LSHOP&&LSHOP[en])return LSHOP[en];var n=en.toLowerCase(),t=/fish|rui|hilsa|ilish|prawn|shrimp/.test(n)?'fish':/beef|mutton|chicken|meat|egg/.test(n)?'meat':/tablet|medicine|napa|paracetamol|syrup|saline/.test(n)?'med':/phone|watch|charger|cable|earbud|bulb|fan|light|lamp/.test(n)?'elec':/burger|pizza|biryani|kebab|roll|noodle|fries|kacchi/.test(n)?'food':'grocery';var l=SH.filter(function(x){return x[2]==t});if(!l.length)l=SH;return l[h%l.length][0]}
function renderPD(){
var p=PDS.p,LV=p[8]==='L',k=PDS.k,b=lang=='bn',en=enName(p[1]),nm=lang=='en'?en:tx(p[1]),h=hs(en);
var rating=Math.min(5,Math.max(3.5,p[2]-(h%3)*.1)).toFixed(1),cnt2=120+(h%700),off=p[4]>p[3]?Math.round((p[4]-p[3])*100/p[4]):0;
var imgs=galOf(p)||[imgOf(p)];PDS.g=atcGroups(en,p);PDS.vr=vrOf(p);if(!PDS.sel||PDS.sel.length!=PDS.g.length){var _v=VAR[k];PDS.sel=PDS.vr?vrInit(PDS.vr,PDS.g,_v):PDS.g.map(function(x,i){return _v&&_v.sel&&_v.sel[i]!=null?_v.sel[i]:(x.d||0)})}
if(PDS.vr){var _c=atcCalc(PDS);off=_c.old>_c.u?Math.round((_c.old-_c.u)*100/_c.old):0}
if(!PDS.vr)PDS.vmax=LIVE?pLim(en,LST[en]!=null?LST[en]:99):10;if(PDS.qty>PDS.vmax&&!PDS.vr)PDS.qty=PDS.vmax;PDS.shop=pdShop(en,h);var shop=PDS.shop,unit=(en.match(/\(([^)]+)\)/)||[0,'1 pc'])[1];
var slides=imgs.map(function(u){return '<div class="pd-sl">'+PIC(u,p[0],nm,'',640)+'</div>'}).join('');
var dots=imgs.length>1?'<div class="pd-dots" id="pdd">'+imgs.map(function(_,i){return '<i'+(i?'':' class="on"')+'></i>'}).join('')+'</div>':'';
var wl=WL[wlK(k)]?' on':'';
var dist=[[5,68],[4,20],[3,7],[2,3],[1,2]].map(function(r){return '<div>'+r[0]+'★<i><u style="width:'+r[1]+'%"></u></i>'+r[1]+'%</div>'}).join('');
var more=(V[view].hot.concat(V[view].best)).filter(function(x){return enName(x[1])!=en}).slice(0,8).map(function(x){return card(x,0,'pd')}).join('');
var loc=LIVE&&locOk('min')?locText('min'):($('lcn').textContent||'Dhaka');var shd=SH.filter(function(x){return x[0]==shop})[0],srt=shd?shd[3].toFixed(1):'4.6',spos=shd?Math.round(shd[3]*19.6):96,slg=(LSLG&&LSLG[shop])?'<img class="pd-lgi" alt="" src="'+esc(LSLG[shop])+'" onerror="this.outerHTML=\''+esc(shop.charAt(0))+'\'">':esc(shop.charAt(0));
$('pd').innerHTML=
'<div class="pd-top"><button class="pd-ci pd-bk" id="pdbk" aria-label="Back">'+pdSvg('bk')+'<span class="pd-bt" style="display:none">'+L('Back','ফিরে যান')+'</span></button><nav class="pd-bc pd-dk"><a id="pdbk2">'+L('Home','হোম')+'</a><i>›</i><a id="pdvp2">'+(L('Minutes','মিনিটস'))+'</a><i>›</i><span>'+esc(nm)+'</span></nav><button class="pd-sr" id="pdsr">'+pdSvg('se')+L('Search','সার্চ')+'</button><button class="pd-ci pd-hr'+wl+'" id="pdhr" aria-label="Wishlist">'+pdSvg('ht')+'</button><button class="pd-ci" id="pdsh" aria-label="Share">'+pdSvg('sh')+'</button></div>'
+'<div class="pd-mn"><div class="pd-g"><div class="pd-th pd-dk" id="pdth">'+imgs.map(function(u,i){return '<button class="pd-tb'+(i?'':' on')+'" data-i="'+i+'">'+PIC(u,p[0],nm,'',640)+'</button>'}).join('')+'</div><div class="pd-gs" id="pdgs">'+slides+'</div>'+dots+'</div>'
+'<div class="pd-det"><div class="pd-dk pd-dh"><a class="pd-br" id="pdvp">'+shop+' ›</a><h2>'+esc(nm)+'</h2>'+pdMeta(p)+'<div class="pd-rr pd-go">'+(LV?'<span class="pd-rlw">'+pdRtH(p)+'</span>':'<b>'+rating+'</b><span class="pd-st" style="--r:'+(rating/5*100)+'%">★★★★★</span><a>'+cnt2+' '+L('Ratings','রেটিং')+'</a>')+'<a class="pd-vd">'+L('View Description','বিবরণ দেখুন')+'</a></div>'
+'<div class="pd-pp"><b>'+pdMoney(atcCalc(PDS).u)+'.00</b>'+(off?'<del>'+atcCalc(PDS).old+'.00</del><em>'+off+'% '+L('Off','ছাড়')+'</em>':'')+pdTkH()+'</div><div class="pd-ex" id="pdvp"><span><i>★</i> '+L('Explore other bestsellers','অন্যান্য বেস্টসেলার দেখুন')+' <u>'+shop+'</u></span><s>›</s></div>'
+'<div class="pd-ds"><h3 class="pd-h">'+L('Delivery Information','ডেলিভারি তথ্য')+'</h3><div class="pd-dc"><div class="pd-d1"><span class="pd-tg">'+L('minutes','মিনিটস')+'</span><b>'+(L('Get it in 15–59 minutes','১৫–৫৯ মিনিটে পাবেন'))+'</b><em>'+L('Deliver to','ডেলিভারি')+' '+esc(loc)+'</em></div><div class="pd-d2">'+L('Faster Delivery Options','দ্রুত ডেলিভারির অপশন')+'<s>⌄</s></div></div><div class="pd-dk2">'+L('Get Free delivery Today with','ফ্রি ডেলিভারি পান আজই')+' <span class="pd-tg">NurBuy</span><s>›</s></div></div>'
+(LV?pdCpnHtml(p,k):'<div class="pd-ds"><h3 class="pd-h">'+L('Coupons','কুপন')+'</h3><div class="pd-cps"><div class="pd-cpn"><i>%</i><span>'+L('Extra 10% Off','অতিরিক্ত ১০% ছাড়')+'</span><button class="pd-cp" data-c="NURBUY10">NURBUY10 ⧉</button></div><div class="pd-cpn"><i>%</i><span>'+L('Extra 15% Off with bKash','বিকাশে ১৫% ছাড়')+'</span><button class="pd-cp" data-c="BKASH15">BKASH15 ⧉</button></div></div></div>')+'</div>'
+'<div class="pd-bs pd-mo"><b>'+shop+'</b><button id="pdvp">'+(L('Visit Shop','দোকান দেখুন'))+' ›</button></div>'
+'<div class="pd-c pd-mo"><h1>'+esc(nm)+'</h1>'+pdMeta(p)+'<div class="pd-rt pd-go">'+(LV?'<span class="pd-rlw">'+pdRtH(p)+'</span>':'<svg viewBox="0 0 24 24"><path d="M12 2l3 6.500 7 .8-5.200 4.800 1.400 7L12 17.500 5.800 21l1.400-7L2 9.300l7-.8z"/></svg><b>'+rating+'</b> ('+cnt2+' '+L('ratings','রেটিং')+')')+'</div><div class="pd-vdr"><a class="pd-vd">'+L('View Description','বিবরণ দেখুন')+'</a></div>'
+'<div class="pd-pr"><b>'+pdMoney(atcCalc(PDS).u)+'</b>'+(off?'<del>'+atcCalc(PDS).old+'</del><em>'+off+'% '+L('OFF','ছাড়')+'</em>':'')+'<small>('+L('Incl. VAT','ভ্যাটসহ')+')</small></div>'+(PDS.vr?'<div class="pd-vrm" id="pdvrm">'+pdVrHtml()+'</div>':'')+pdClosedHtml(en)
+'<div class="pd-fd"><svg viewBox="0 0 24 24"><path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>'+pdTkH()+'</div>'
+(LV?'':'<div class="pd-of"><div class="pd-o"><i>%</i>'+L('Extra 10% off, CODE: NURBUY10','অতিরিক্ত ১০% ছাড়, কোড: NURBUY10')+'<u>›</u></div><div class="pd-o"><i>%</i>'+L('Extra 15% off with bKash','বিকাশে অতিরিক্ত ১৫% ছাড়')+'<u>›</u></div></div>')+'</div>'+(LV?pdCpnHtml(p,k,1):'')
+'<div class="pd-c pd-mo"><h3 class="pd-h">'+L('Delivery Information','ডেলিভারি তথ্য')+'</h3>'
+'<div class="pd-r"><i>'+pdSvg('pin')+'</i><div><small>'+L('Deliver to','ডেলিভারি ঠিকানা')+'</small><b>'+esc(loc)+'</b></div></div>'
+'<div class="pd-r"><i>'+pdSvg('clk')+'</i><div><small>'+L('Delivery time','ডেলিভারি সময়')+'</small><b>'+(L('15–59 minutes','১৫–৫৯ মিনিট'))+'</b></div></div>'
+'<div class="pd-r"><i>'+pdSvg('shop')+'</i><div><small>'+L('Sold by','বিক্রেতা')+'</small><b>'+shop+'</b></div></div>'
+'<div class="pd-r"><i>'+pdSvg('ret')+'</i><div><small>'+L('Returns','রিটার্ন')+'</small><b>'+L('Easy 7-day returns','সহজ ৭ দিনের রিটার্ন')+'</b></div></div></div>'
+(LV?'':'<div class="pd-c"><h3 class="pd-h">'+L('Highlights','বৈশিষ্ট্য')+'</h3><ul class="pd-ul"><li>'+L('Quality checked before dispatch','পাঠানোর আগে মান যাচাই করা')+'</li><li>'+L('100% authentic and fresh','১০০% আসল ও তাজা')+'</li><li>'+(L('Delivered in 15–59 minutes in your area','আপনার এলাকায় ১৫–৫৯ মিনিটে ডেলিভারি'))+'</li></ul></div>')
+'<div class="pd-c"><h3 class="pd-h">'+L('Specifications','স্পেসিফিকেশন')+'</h3><div class="pd-sp">'+(LV?pdSpecL(p,shop):'<span>'+L('Seller','বিক্রেতা')+'</span><b>'+shop+'</b><span>'+L('Unit','একক')+'</span><b>'+esc(unit)+'</b><span>'+L('Origin','উৎপত্তি')+'</span><b>'+L('Bangladesh','বাংলাদেশ')+'</b><span>SKU</span><b>NB-'+(h%900000+100000)+'</b>')+'</div></div>'
+'</div>'

+'<aside class="pd-box"><div class="pd-dk pd-sl2"><span class="pd-lg">'+slg+'</span><div><div class="pd-sb">'+L('Sold by','বিক্রেতা')+' <b>'+shop+'</b> ›</div>'+(LV?'':'<div class="pd-ss"><i>★</i> '+srt+' <span>|</span> '+spos+'% '+L('Positive','পজিটিভ')+'</div>')+'</div></div>'+(LV?'':'<div class="pd-dk pd-sts"><div><span>'+L('Item as shown','ছবির মতো পণ্য')+'</span><b>94%</b></div><div><span>'+L('Partner since','পার্টনার')+'</span><b>2+ Y</b></div><div><span>'+L('Low return seller','কম রিটার্ন')+'</span></div></div>')+''+pdClosedHtml(en)+'<div class="pd-vr" id="pdvr">'+pdVrHtml()+'</div><div class="pd-ba"><div class="pd-q"><small>'+L('QTY','পরিমাণ')+'</small><select id="pdq">'+(function(){var o=[];for(var n=1;n<=Math.min(PDS.vmax||10,30);n++)o.push(n);return o})().map(function(n){return '<option'+(n==PDS.qty?' selected':'')+'>'+n+'</option>'}).join('')+'</select><div class="pq-s"><button type="button" data-pq="-" aria-label="Decrease"'+(PDS.qty<=1?' disabled':'')+'>−</button><b id="pdqn">'+PDS.qty+'</b><button type="button" data-pq="+" aria-label="Increase"'+(PDS.qty>=(PDS.vmax||10)?' disabled':'')+'>+</button></div></div><button class="pd-b1" id="pdbn">'+L('Buy Now','এখনই কিনুন')+'</button><button class="pd-b2'+(cart[k]?' done':'')+'" id="pdad">'+(cart[k]?'✓ '+L('Added','যোগ হয়েছে'):L('Add to cart','কার্টে যোগ করুন'))+'</button></div><div class="pd-dk pd-pk"><div>'+uic('truck')+' '+L('Free delivery on orders over ৳'+FREEMIN(),'৳'+bnN(FREEMIN())+'+ অর্ডারে ফ্রি ডেলিভারি')+'</div><div>'+uic('ret')+' '+L('Easy and Hassle Free Returns','সহজ রিটার্ন')+'</div><div>'+uic('shield')+' '+L('Secure Payments','নিরাপদ পেমেন্ট')+'</div></div></aside></div>'
+'<div class="pd-c'+(LV?' ds':'')+'" id="pdrev"><div class="pd-tabs"><button type="button" class="pd-tab'+(LV?'':' on')+'" data-t="rv">'+L('Ratings & Reviews','রেটিং ও রিভিউ')+'</button><button type="button" class="pd-tab'+(LV?' on':'')+'" data-t="ds">'+L('Description','বিবরণ')+'</button></div><div class="pd-dsc">'+(LV?pdDescL(p):pdDesc(nm,shop,unit))+'</div>'+(LV?'<div class="pd-rvg">'+pdRvLive(p)+'</div>':'<div class="pd-rvg"><div class="pd-rv"><div><strong>'+rating+'</strong><small>'+cnt2+' '+L('ratings','রেটিং')+'</small></div><div class="pd-bar">'+dist+'</div></div>'
+'<div class="pd-rvr"><div class="pd-rw">'+rvAv('Rahim U.')+'<div><b>Rahim U.<span>✓ '+L('Verified buyer','ভেরিফাইড ক্রেতা')+'</span></b>'+L('Very fresh and delivered on time.','খুব তাজা, সময়মতো ডেলিভারি পেয়েছি।')+'</div></div><div class="pd-rw">'+rvAv('Sumi A.')+'<div><b>Sumi A.<span>✓ '+L('Verified buyer','ভেরিফাইড ক্রেতা')+'</span></b>'+L('Good quality, will order again.','মান ভালো, আবার অর্ডার করব।')+'</div></div><button class="pd-va" id="pdva">'+L('View All Reviews','সব রিভিউ দেখুন')+' ('+cnt2+') ›</button></div></div>')+'</div>'
+(more?'<div class="pd-c pd-wide"><h3 class="pd-h">'+L('You may also like','আপনার পছন্দ হতে পারে')+'</h3><div class="pd-al">'+more+'</div></div>':'');
if(PDS.vr)pdVrX();if(pClosed(en))['pdad','pdbn'].forEach(function(i){var b2=$(i);if(b2)b2.disabled=true});if(document.body.classList.contains('vr'))renderRP();var gs=$('pdgs'),dd=$('pdd');if(dd)gs.addEventListener('scroll',function(){var i=Math.round(gs.scrollLeft/gs.clientWidth);dd.querySelectorAll('i').forEach(function(x,j){x.classList.toggle('on',j==i)})})}


var AVF=['Sumi A.','Nusrat J.','Mitu S.','Farhana K.','Lipi A.','Shirin B.','Rina P.','Tania Z.','Shapla D.','Mim C.'];
function rvAv(n,img){
if(img)return '<span class="pdr-av"><img src="'+esc(img)+'" alt="'+n+'" loading="lazy" onerror="this.parentNode.classList.add(\'noimg\');this.remove()"></span>';
var h=0;for(var i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))%997;
var bg=['#dbe7ff','#ffe4d6','#e0f5e9','#f3e1ff','#fff1c9','#d9f1f5'][h%6],sk=['#f1c9a5','#e0a97f','#c68a5e','#a86f48'][h%4],hr=['#2b2118','#3a2a1c','#1a1a1a','#4a3426'][(h>>2)%4],fm=AVF.indexOf(n)>-1;
return '<span class="pdr-av"><svg viewBox="0 0 40 40"><rect width="40" height="40" fill="'+bg+'"/>'+(fm?'<path d="M9 30c0-14 3-21 11-21s11 7 11 21z" fill="'+hr+'"/>':'')+'<path d="M6 40c1-8 7-12 14-12s13 4 14 12z" fill="'+['#1759e8','#e5254b','#12a150','#7a4bd8'][(h>>1)%4]+'"/><circle cx="20" cy="17" r="7.5" fill="'+sk+'"/>'+(fm?'<path d="M12.200 16c0-5 3.500-8 7.800-8s7.800 3 7.800 8c-3-1-6-3.500-7-5-1 2-4 4.500-8.600 5z" fill="'+hr+'"/>':'<path d="M12.500 16c-.5-5.500 3-8.500 7.500-8.500s8 3 7.500 8.500c-2-2.500-4-3.500-7.500-3.500s-5.500 1-7.500 3.500z" fill="'+hr+'"/>')+'</svg></span>'}
var RVN=['Rahim U.','Sumi A.','Karim H.','Nusrat J.','Tanvir A.','Mitu S.','Sabbir R.','Farhana K.','Jahid M.','Lipi A.','Arif H.','Shirin B.','Imran N.','Rina P.','Masud K.','Tania Z.','Habib R.','Shapla D.','Faisal M.','Mim C.'];
var RVT={5:[['Very fresh and delivered on time.','খুব তাজা, সময়মতো ডেলিভারি পেয়েছি।'],['Excellent quality, highly recommended!','অসাধারণ মান, সবাইকে সাজেস্ট করব!'],['Delivered in minutes. Perfect!','মিনিটসেই ডেলিভারি পেয়েছি। দারুণ!'],['Good quality, will order again.','মান ভালো, আবার অর্ডার করব।']],4:[['Good product, packaging could be better.','পণ্য ভালো, প্যাকেজিং আরও ভালো হতে পারত।'],['Nice quality for the price.','দামের তুলনায় মান ভালো।'],['Fresh and as described.','তাজা এবং বর্ণনা অনুযায়ী।']],3:[['Average. Expected a little better.','মোটামুটি। আরেকটু ভালো আশা করেছিলাম।'],['Okay for the price.','দামের হিসাবে ঠিক আছে।']],2:[['Delivery was late and quality so-so.','ডেলিভারি দেরি হয়েছে, মান মোটামুটি।']],1:[['Not satisfied with the quality.','মানে সন্তুষ্ট না।']]};
function rvList(h,n){var out=[];for(var i=0;i<n;i++){var v=(i*37+h)%100,st=v<68?5:v<88?4:v<95?3:v<98?2:1,tx2=RVT[st][(i+h)%RVT[st].length],d=new Date(2026,9,1-i*2-(h%3));out.push({n:RVN[(i+h)%RVN.length],s:st,t:tx2,d:d})}return out}
function starsH(n){return '<span class="pd-st" style="--r:'+(n/5*100)+'%">★★★★★</span>'}
var RVC={},RVD={pid:'',s:0,t:''};
/* ratings summary of every reviewed product: shown on product cards, the wishlist and the product page */
var RSUM={};
function rsOf(p){if(!p||p[8]!=='L')return null;var x=RSUM[String(p[9])];return x&&x[1]>0?x:null}
function rsCard(p){var x=rsOf(p);if(!x)return '';return '<div class="mrt" aria-label="'+x[0]+' / 5">'+starsH(Math.round(x[0]*2)/2)+'<span>'+bnN(x[1])+'</span></div>'}
function rsPaint(){try{document.querySelectorAll('.pc.mc[data-k]').forEach(function(c){var p=PMAP[c.dataset.k]||findP(c.dataset.k),old=c.querySelector('.mrt'),h=rsCard(p);if(old)old.remove();if(h){var m=c.querySelector('.mmt');if(m)m.insertAdjacentHTML('beforebegin',h)}});
if(document.body.classList.contains('vw')&&typeof renderWish=='function')renderWish();
if(document.body.classList.contains('vd')&&window.PDS&&PDS.p)pdRvRefresh(PDS.p[9])}catch(e){}}
function rsLoad(){if(!LIVE)return;nbApi('GET','/reviews/summary').then(function(r){var n=(r&&r.r)||{},ch=JSON.stringify(n)!==JSON.stringify(RSUM);RSUM=n;if(ch)rsPaint()},function(){})}
setTimeout(rsLoad,300);setInterval(function(){if(!document.hidden)rsLoad()},90000);
function pdRvLive(p){var RV=rvGet(p[9]);if(!RV||!(+RV.count))return '<p style="color:#8a8f9c;margin:6px 0">'+L('No reviews yet','এখনো কোনো রিভিউ নেই')+'</p>';
var dd=RV.dist||{},tc=+RV.count||0,bars=[5,4,3,2,1].map(function(n){return '<div>'+n+'★<i><u style="width:'+Math.round((+dd[n]||0)*100/tc)+'%"></u></i>'+Math.round((+dd[n]||0)*100/tc)+'%</div>'}).join('');
var mn=lang=='en'?['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']:['জানু','ফেব্রু','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টে','অক্টো','নভে','ডিসে'];
var rows=(RV.list||[]).slice(0,3).map(function(x){var d=new Date(x.d*1000);return '<div class="pd-rw">'+rvAv(esc(x.n),x.img)+'<div><b>'+esc(x.n)+'<span>✓ '+L('Verified buyer','ভেরিফাইড ক্রেতা')+'</span></b>'+starsH(x.s)+' <small style="color:#8a8f9c">'+d.getDate()+' '+mn[d.getMonth()]+' '+d.getFullYear()+'</small>'+(x.t?'<div>'+esc(x.t)+'</div>':'')+'</div></div>'}).join('');
return '<div class="pd-rv"><div><strong>'+Number(RV.avg).toFixed(1)+'</strong><small>'+tc+' '+L('ratings','রেটিং')+'</small></div><div class="pd-bar">'+bars+'</div></div><div class="pd-rvr">'+rows+'<button class="pd-va" id="pdva">'+L('View All Reviews','সব রিভিউ দেখুন')+' ('+tc+') ›</button></div>'}
function pdRtH(p){var RV=rvGet(p[9]),c=RV&&RV.count!=null?+RV.count:(RSUM[String(p[9])]?RSUM[String(p[9])][1]:0),a=RV&&RV.count?+RV.avg:(RSUM[String(p[9])]?RSUM[String(p[9])][0]:0);
if(!c)return '<span class="pd-rl0">'+L('No ratings yet','এখনো কোনো রেটিং নেই')+'</span>';
return '<a class="pd-rl" role="button" tabindex="0">'+starsH(a)+'<b>'+Number(a).toFixed(1)+'</b><span>('+bnN(c)+' '+L('ratings','রেটিং')+')</span><u>'+L('View all','সব দেখুন')+' ›</u></a>'}
function pdRvRefresh(pid){try{var g=document.querySelector('#pdrev .pd-rvg');if(PDS&&PDS.p&&String(PDS.p[9])===String(pid)&&PDS.p[8]==='L'){if(g)g.innerHTML=pdRvLive(PDS.p);document.querySelectorAll('.pd-rlw').forEach(function(w){w.innerHTML=pdRtH(PDS.p)})}}catch(e){}}
function rvGet(pid){pid=String(pid);if(RVC[pid]===undefined){RVC[pid]=null;if(LIVE)nbApi('GET','/reviews/'+encodeURIComponent(pid)).then(function(r){RVC[pid]=r;pdRvRefresh(pid);try{if(document.body.classList.contains('vr')&&PDS&&PDS.p&&String(PDS.p[9])===pid)renderRP()}catch(e){}},function(){RVC[pid]={avg:0,count:0,dist:{},list:[],mine:null,can:false}})}return RVC[pid]}
function rvForm(RV,p){if(!RV)return '';var pid=String(p[9]);if(RVD.pid!==pid){RVD={pid:pid,s:RV.mine?RV.mine.s:0,t:RV.mine?RV.mine.t:''}}
if(!AU.uid)return '';
if(!RV.can&&!RV.mine)return '<div class="rvw rvw-n">'+L('Only customers who received this product can write a review.','যারা এই পণ্যটি পেয়েছেন শুধু তারাই রিভিউ দিতে পারবেন।')+'</div>';
return '<div class="rvw"><b>'+(RV.mine?L('Your review','আপনার রিভিউ'):L('Review this product','এই পণ্যের রিভিউ দিন'))+'</b><div class="rvw-st" id="rvst">'+[1,2,3,4,5].map(function(n){return '<button type="button" data-rs="'+n+'" class="'+(n<=RVD.s?'on':'')+'" aria-label="'+n+'">★</button>'}).join('')+'</div><textarea id="rvt" maxlength="1000" rows="3" placeholder="'+L('How was this product? (optional)','পণ্যটি কেমন ছিল? (ঐচ্ছিক)')+'">'+esc(RVD.t)+'</textarea><button type="button" class="pd-va" id="rvsub">'+(RV.mine?L('Update review','রিভিউ আপডেট করুন'):L('Submit review','রিভিউ জমা দিন'))+'</button></div>'}
var RPF='all',RPN=15;
function renderRP(){
var p=PDS.p,en=enName(p[1]),nm=lang=='en'?en:tx(p[1]),h=hs(en),rating=Math.min(5,Math.max(3.5,p[2]-(h%3)*.1)).toFixed(1),cnt2=120+(h%700);
var LVp=p[8]==='L',RV=LVp?rvGet(p[9]):null,all,dist;
if(LVp){var dd=(RV&&RV.dist)||{},tc=RV?+RV.count||0:0;all=RV?(RV.list||[]).map(function(x){return {n:esc(x.n),s:x.s,t:[esc(x.t),esc(x.t)],d:new Date(x.d*1000),img:x.img||''}}):[];dist=[5,4,3,2,1].map(function(s){return [s,tc?Math.round((+dd[s]||0)*100/tc):0]});rating=tc?Number(RV.avg).toFixed(1):'0.0';cnt2=tc}
else{all=rvList(h,Math.min(cnt2,80));dist=[[5,68],[4,20],[3,7],[2,3],[1,2]]}
var wf=LVp?rvForm(RV,p):'';
var list=all.filter(function(r){return RPF=='all'||r.s==RPF}),shown=list.slice(0,RPN);
var mn=lang=='en'?['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']:['জানু','ফেব্রু','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টে','অক্টো','নভে','ডিসে'];
var chips='<button class="pd-fc2'+(RPF=='all'?' on':'')+'" data-f="all">'+L('All','সব')+'</button>'+dist.map(function(r){return '<button class="pd-fc2'+(RPF==r[0]?' on':'')+'" data-f="'+r[0]+'">'+r[0]+' ★</button>'}).join('');
$('pdrp').innerHTML='<div class="pdr-top"><button class="pd-ci" id="pdrb" aria-label="Back">'+pdSvg('bk')+'</button><b>'+L('Ratings & Reviews','রেটিং ও রিভিউ')+'</b></div>'
+'<div class="pdr-w"><div class="pdr-pn"><div class="pdr-nm">'+esc(nm)+'</div><div class="pdr-sm"><div class="pdr-sc"><strong>'+rating+'</strong>'+starsH(+rating)+'<small>'+cnt2+' '+L('ratings','রেটিং')+'</small></div><div class="pd-bar">'+dist.map(function(r){return '<div>'+r[0]+'★<i><u style="width:'+r[1]+'%"></u></i>'+r[1]+'%</div>'}).join('')+'</div></div></div>'
+wf+'<div class="pdr-fl">'+chips+'</div>'
+'<div class="pdr-ls">'+(shown.length?shown.map(function(r){return '<div class="pdr-r">'+rvAv(r.n,r.img)+'<div class="pdr-b"><div class="pdr-h"><b>'+r.n+'</b><span>✓ '+L('Verified buyer','ভেরিফাইড ক্রেতা')+'</span></div><div class="pdr-m">'+starsH(r.s)+'<em>'+r.d.getDate()+' '+mn[r.d.getMonth()]+' '+r.d.getFullYear()+'</em></div><p>'+(lang=='en'?r.t[0]:r.t[1])+'</p></div></div>'}).join(''):'<p class="pdr-e">'+L('No reviews','কোনো রিভিউ নেই')+'</p>')+'</div>'
+(list.length>shown.length?'<button class="pd-va" id="pdrm">'+L('Show more reviews','আরও রিভিউ দেখুন')+' ('+(list.length-shown.length)+')</button>':'')+'</div>'}
function openRP(){RPF='all';RPN=15;try{if(PDS&&PDS.p)delete RVC[String(PDS.p[9])]}catch(e){}document.body.classList.add('vr');renderRP();try{history.pushState({r:1},'','#reviews')}catch(e){}window.scrollTo(0,0)}
function closeRP(){document.body.classList.remove('vr')}
$('pdrp').addEventListener('click',function(e){
if(e.target.closest('#pdrb')){if(history.state&&history.state.r){history.back()}else{closeRP()}return}
var f=e.target.closest('.pd-fc2');if(f){RPF=f.dataset.f=='all'?'all':+f.dataset.f;RPN=15;renderRP();return}
if(e.target.closest('#pdrm')){RPN+=15;renderRP();return}
var rs=e.target.closest('#rvst button');if(rs){RVD.s=+rs.dataset.rs;var tt=$('rvt');if(tt)RVD.t=tt.value;renderRP();return}
if(e.target.closest('#rvsub')){var tt2=$('rvt');if(tt2)RVD.t=tt2.value;if(!RVD.s){msg(L('Please choose a star rating','স্টার রেটিং বেছে নিন'));return}var pid=String(PDS.p[9]),bt=e.target.closest('#rvsub');bt.disabled=true;
nbApi('POST','/reviews/'+encodeURIComponent(pid),{s:RVD.s,t:RVD.t}).then(function(r){RVC[pid]=r;pdRvRefresh(pid);RVD={pid:pid,s:r.mine?r.mine.s:0,t:r.mine?r.mine.t:''};msg(L('Thank you for your review','রিভিউ দেওয়ার জন্য ধন্যবাদ'));renderRP()},function(er){bt.disabled=false;msg(er&&er.message?er.message:L('Could not save the review','রিভিউ সেভ হয়নি'))})}});

/* ===== WISHLIST ===== */
var WLS={lists:[]},WSS={cur:'d'};
try{var _w=JSON.parse(localStorage.getItem('nb_wls')||'null');if(_w&&_w.lists)WLS=_w}catch(e){}
function wsave(){try{localStorage.setItem(AU.uid?'nb_wls_'+AU.uid:'nb_wls',JSON.stringify(WLS))}catch(e){}wlPush()}
function wLists(){return WLS.lists.filter(function(l){return (l.v||'min')==view})}
function wKeys(id){if(id=='d')return Object.keys(WL).filter(function(k){return WL[k]});var l=WLS.lists.filter(function(x){return x.id==id})[0];return l?l.ks:[]}
function wItems(id){return wKeys(id).map(function(k){return{k:k,p:findP(k)}}).filter(function(o){return o.p})}
function wList(id){return id=='d'?{id:'d',n:'default'}:WLS.lists.filter(function(x){return x.id==id})[0]}
var WI={back:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',share:'<svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M8.2 11l7.600-4M8.2 13l7.600 4"/></svg>',dots:'<svg viewBox="0 0 24 24" class="f"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',lock:'<svg viewBox="0 0 24 24" class="f"><path d="M7 10V8a5 5 0 0110 0v2h1.500v10h-13V10zm2 0h6V8a3 3 0 00-6 0z"/></svg>',truck:'<svg viewBox="0 0 24 24" class="f"><path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',down:'<svg viewBox="0 0 24 24" class="f"><path d="M12 20l-7-8h4V4h6v8h4z"/></svg>'};
function wCard(o){var p=o.p,k=o.k,en=enName(p[1]),nm=lang=='en'?en:tx(p[1]),h=hs(en),rating=Math.min(5,Math.max(3.5,p[2]-(h%3)*.1)).toFixed(1),rc=(h%900)+20,off=p[4]>p[3]?Math.round((p[4]-p[3])*100/p[4]):0;
var lab=off>=30?'<div class="wl-lb m">Mega Deal</div>':off>0?'<div class="wl-lb d">'+L('Deal','ডিল')+'</div>':'<div class="wl-lb n"></div>';
return '<div class="wl-c" data-k="'+esc(k)+'"><div class="wl-im" data-w="pd">'+PIC(imgOf(p),p[0],nm,'')+'</div>'+lab
+'<div class="wl-b"><div class="wl-nm" data-w="pd">'+esc(nm)+'</div>'+(p[8]==='L'?(rsOf(p)?'<div class="wl-rt wl-rs">'+starsH(Math.round(rsOf(p)[0]*2)/2)+'<span>'+bnN(rsOf(p)[1])+'</span></div>':''):'<div class="wl-rt"><i>★</i><b>'+rating+'</b><span>('+(rc>999?(rc/1000).toFixed(1)+'K':rc)+')</span></div>')
+'<div class="wl-pr"><b>'+pdMoney(p[3])+'</b>'+(off?'<del>'+p[4]+'</del><em>'+off+'% '+L('OFF','ছাড়')+'</em>':'')+'</div>'
+(h%3==0?'<div class="wl-lw">'+WI.down+L('Lowest price in 7 days','৭ দিনে সবচেয়ে কম দাম')+'</div>':'<div class="wl-fd">'+WI.truck+L('Free Delivery','ফ্রি ডেলিভারি')+'</div>')
+(h%2==0?'<div class="wl-cp"><span>'+L('Extra 10% off','অতিরিক্ত ১০% ছাড়')+'</span><u>+1</u></div>':'<div class="wl-cp z"></div>')
+'<div class="wl-ex"><span class="wl-tg">'+L('minutes','মিনিটস')+'</span></div>'
+'<div class="wl-ac"><button class="wl-add" data-w="add">'+L('Add To Cart','কার্টে যোগ করুন')+'</button><button class="wl-mo" data-w="more" aria-label="More">'+WI.dots+'</button></div></div></div>'}
function renderWish(){
var cur=wList(WSS.cur)||(WSS.cur='d',wList('d')),items=wItems(WSS.cur),isD=WSS.cur=='d',nm=isD?'default':cur.n;
var lists=[{id:'d',n:'default'}].concat(wLists());
var tag='<span class="wl-df">'+L('Default','ডিফল্ট')+'</span>';
var side=lists.map(function(l){var n=wKeys(l.id).length;return '<button class="wl-li'+(l.id==WSS.cur?' on':'')+'" data-w="sel" data-id="'+l.id+'"><b>'+esc(l.n)+(l.id=='d'?tag:'')+'</b><small>'+n+' '+L(n==1?'item':'items','টি আইটেম')+' '+WI.lock+'</small></button>'}).join('');
var tabs=lists.map(function(l){return '<button class="wl-tb'+(l.id==WSS.cur?' on':'')+'" data-w="sel" data-id="'+l.id+'">'+esc(l.n)+(l.id=='d'?' '+WI.lock:'')+'</button>'}).join('');
var grid=items.length?items.map(wCard).join(''):'<div class="wl-em"><div>'+uic('heart')+'</div><p>'+L('Your wishlist is empty','আপনার উইশলিস্ট খালি')+'</p><button class="wl-shop" data-w="home">'+L('Start Shopping','কেনাকাটা শুরু করুন')+'</button></div>';
var logo='<a class="wl-lg" data-w="home"><svg viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#1d2fe0"/><path d="M9 12h14l-1 12H10z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M12.500 12v-1a3.500 3.500 0 017 0v1" fill="none" stroke="#fff" stroke-width="2"/></svg><b>NurBuy</b></a>';
$('wishv').innerHTML='<div class="wl"><div class="wl-top"><button class="wl-bk" data-w="back" aria-label="Back">'+WI.back+'</button><h1>'+L('Wishlist','উইশলিস্ট')+'<span class="wl-md '+('m')+'">'+(uic('bolt')+' '+L('Minutes','মিনিটস'))+'</span></h1>'+logo+'<button class="wl-cr" data-w="create"><span class="wl-p">+ </span>'+L('Create','তৈরি করুন')+'<span class="wl-dk"> '+L('NEW WISHLIST','নতুন উইশলিস্ট')+'</span></button></div>'
+'<div class="wl-md2 '+('m')+'">'+(uic('bolt')+' '+L('Minutes','মিনিটস'))+'</div><div class="wl-tabs">'+tabs+'</div>'
+'<div class="wl-bd"><aside class="wl-sd">'+side+'</aside><section class="wl-mn"><div class="wl-hd"><div class="wl-t"><b>'+esc(nm)+'</b>'+(isD?tag:'')+'<span class="wl-cn">'+items.length+' '+L(items.length==1?'Item':'Items','টি আইটেম')+' '+WI.lock+'</span></div><div class="wl-bt"><button class="wl-pl" data-w="share">'+WI.share+'<span>'+L('Share','শেয়ার')+'</span></button><button class="wl-pl" data-w="menu">'+WI.dots+'<span>'+L('More','আরও')+'</span></button></div></div><div class="wl-gr">'+grid+'</div></section></div></div>'}
function openWish(){if(authGate('wish'))return;closeAll();closeProf();closeOrd();closeShops();closePD();if(window.cpS&&cpS.o)closeCP();WSS.cur='d';document.body.classList.add('vw');renderWish();try{history.pushState({w:1},'','#wishlist')}catch(e){}window.scrollTo(0,0)}
function closeWish(){document.body.classList.remove('vw');if(document.getElementById('pm'))pmClose()}
window.closeWish=closeWish;
function wOpt(a,t,x){return '<button class="wl-op" data-wa="'+a+'"'+(x?' data-x="'+esc(x)+'"':'')+'>'+t+'</button>'}
$('pmb').addEventListener('click',function(e){var b=e.target.closest('[data-wa]');if(!b)return;var a=b.dataset.wa,k=WSS.k;
if(a=='rm'){if(WSS.cur=='d'){delete WL[k];wlSave()}else{var l=wList(WSS.cur);l.ks=l.ks.filter(function(z){return z!=k});wsave()}pmClose();renderWish();msg(L('Removed from wishlist','উইশলিস্ট থেকে সরানো হয়েছে'))}
else if(a=='mv'){var to=b.dataset.x;if(WSS.cur=='d'){delete WL[k];wlSave()}else{var l2=wList(WSS.cur);l2.ks=l2.ks.filter(function(z){return z!=k})}
if(to=='d'){WL[k]=view;wlSave()}else{var t=wList(to);if(t.ks.indexOf(k)<0)t.ks.push(k)}wsave();pmClose();renderWish();msg(L('Moved','সরানো হয়েছে'))}
else if(a=='view'){pmClose();openPD(k)}
else if(a=='ren'){var c=wList(WSS.cur);pmOpen(L('Rename wishlist','উইশলিস্টের নাম বদলান'),fld('wln',L('Name','নাম'),c.n),function(){var v=$('wln').value.trim();if(!v)return L('Enter a name','নাম লিখুন');c.n=v.slice(0,30);wsave();renderWish()})}
else if(a=='del'){WLS.lists=WLS.lists.filter(function(x){return x.id!=WSS.cur});WSS.cur='d';wsave();pmClose();renderWish();msg(L('Wishlist deleted','উইশলিস্ট মুছে ফেলা হয়েছে'))}
else if(a=='clr'){if(WSS.cur=='d'){Object.keys(WL).forEach(function(z){delete WL[z]});wlSave()}else{wList(WSS.cur).ks=[];wsave()}pmClose();renderWish()}});
$('wishv').addEventListener('click',function(e){var t=e.target.closest('[data-w]');if(!t)return;var a=t.dataset.w,c=t.closest('.wl-c'),k=c?c.dataset.k:null;
if(a=='back'){NAV.back()}
else if(a=='home'){goHome()}
else if(a=='sel'){WSS.cur=t.dataset.id;renderWish()}
else if(a=='pd'){if(k)openPD(k)}
else if(a=='add'){cart[k]=1;cnt();t.classList.add('ok');t.textContent='✓ '+L('Added','যোগ হয়েছে');msg(L('Added to cart','কার্টে যোগ হয়েছে'))}
else if(a=='more'){WSS.k=k;var o=wOpt('view',L('View product','প্রোডাক্ট দেখুন'))+wOpt('rm',L('Remove from wishlist','উইশলিস্ট থেকে সরান'));[{id:'d',n:'default'}].concat(wLists()).forEach(function(l){if(l.id!=WSS.cur)o+=wOpt('mv',L('Move to ','সরান: ')+esc(l.n),l.id)});pmOpen(L('Options','অপশন'),'<div class="wl-ops">'+o+'</div>',null)}
else if(a=='create'){pmOpen(L('Create new wishlist','নতুন উইশলিস্ট তৈরি করুন'),fld('wln',L('Name','নাম'),''),function(){var v=$('wln').value.trim();if(!v)return L('Enter a name','নাম লিখুন');var id='l'+Date.now();WLS.lists.push({id:id,n:v.slice(0,30),ks:[],v:view});WSS.cur=id;wsave();renderWish()})}
else if(a=='share'){try{if(navigator.share)navigator.share({title:'NurBuy Wishlist',url:location.href}).catch(function(){});else{navigator.clipboard.writeText(location.href);msg(L('Link copied','লিংক কপি হয়েছে'))}}catch(x){msg(L('Link copied','লিংক কপি হয়েছে'))}}
else if(a=='menu'){var o2=WSS.cur=='d'?wOpt('clr',L('Clear wishlist','উইশলিস্ট খালি করুন')):wOpt('ren',L('Rename','নাম বদলান'))+wOpt('clr',L('Clear all items','সব আইটেম সরান'))+wOpt('del',L('Delete wishlist','উইশলিস্ট মুছুন'));pmOpen(L('More','আরও'),'<div class="wl-ops">'+o2+'</div>',null)}});
$('dwl').addEventListener('click',function(){openWish()});
window.addEventListener('popstate',function(){var B=document.body.classList;if(B.contains('vw')&&!B.contains('vd')&&!(history.state&&history.state.w)){closeWish();setTab(0)}});

/* ===== CART ===== */
var CPN={min:''};
var CODFEE=10,PAYM={min:'online'}; // ক্যাশ অন ডেলিভারি চার্জ (৳) — পরে অ্যাডমিন সেটিংস থেকে আসবে
var CPC={NURBUY10:10,BKASH15:15};
var PCP={},LCPN={},CPD={min:null};
var CPE={coupon_invalid:['This coupon code is not valid','কুপন কোডটি সঠিক নয়'],coupon_not_started:['This coupon is not active yet','এই কুপন এখনো চালু হয়নি'],coupon_expired:['This coupon has expired','এই কুপনের মেয়াদ শেষ হয়ে গেছে'],coupon_used_up:['This coupon has reached its usage limit','এই কুপনের ব্যবহারের সীমা শেষ'],coupon_wrong_product:['This coupon is for a different product','এই কুপন অন্য পণ্যের জন্য'],coupon_wrong_seller:['This coupon is only for this seller\'s product','এই কুপন শুধু এই বিক্রেতার পণ্যের জন্য'],coupon_user_limit:['You have already used this coupon','আপনি এই কুপন আগেই ব্যবহার করেছেন']};
function cpnErr(e){var c=e&&e.data&&e.data.code;if(c=='coupon_min'){var m=String(e.message||'').match(/([\d.]+)\s*taka/);return L('Buy at least ','কুপন ব্যবহার করতে এই পণ্যের অন্তত ')+pdMoney(m?+m[1]:0)+L(' of this product to use the coupon',' কিনুন')}if(CPE[c])return L(CPE[c][0],CPE[c][1]);return liveErr(e)}
function cpnLab(x){return (x.t=='pct'?(+x.v)+'% '+L('off','ছাড়'):pdMoney(+x.v)+' '+L('off','ছাড়'))}
function cpnSub(x){var a=[];if(+x.min>0)a.push(L('Min. buy ','ন্যূনতম কেনা ')+pdMoney(+x.min));if(x.end){var d=new Date(x.end+'T00:00:00');a.push(L('Valid till ','মেয়াদ ')+d.toLocaleDateString(lang=='en'?'en-GB':'bn-BD',{day:'numeric',month:'short',year:'numeric'}))}return a.join(' · ')}
var CPSVG='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 012-2h9"/></svg>';
var TKSVG='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V6a1 1 0 011-1h16a1 1 0 011 1v3a3 3 0 000 6v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3a3 3 0 000-6z"/><path d="M9.5 14.5l5-5"/><circle cx="9.5" cy="9.5" r=".6" fill="currentColor"/><circle cx="14.5" cy="14.5" r=".6" fill="currentColor"/></svg>';
function pdCpnHtml(p,k,mob){var L1=LCPN[p[9]]||[];if(!L1.length)return '';var pk=PCP[k];
var rows=L1.map(function(x){var on=pk==x.c;return '<div class="cpx"><i class="cpx-i">'+TKSVG+'</i><div class="cpx-t"><b>'+cpnLab(x)+'</b><small>'+cpnSub(x)+'</small></div><div class="cpx-b"><button class="pd-cp cpx-c" data-c="'+esc(x.c)+'">'+esc(x.c)+' '+CPSVG+'</button><button class="pd-ap'+(on?' on':'')+'" data-c="'+esc(x.c)+'">'+(on?L('Applied','যুক্ত হয়েছে'):L('Apply','অ্যাপ্লাই'))+'</button></div></div>'}).join('');
return mob?'<div class="pd-c pd-mo"><h3 class="pd-h">'+L('Coupons','কুপন')+'</h3><div class="cpx-l">'+rows+'</div></div>':'<div class="pd-ds"><h3 class="pd-h">'+L('Coupons','কুপন')+'</h3><div class="cpx-l">'+rows+'</div></div>'}
function atcCpnHtml(A,F){if(A.cart)return cartCpnAtc(A,F);if(!LIVE||!A.p||A.p[8]!=='L')return '';var av=(LCPN[A.p[9]]||[]);
if(A.cp&&F.disc)return '<div class="atc-gh" style="margin-top:16px"><b>'+L('Coupon','কুপন')+'</b></div><div class="ac-cpa"><i>'+TKSVG+'</i><div><b>'+esc(A.cp.code)+'</b><small>'+L('You save ','আপনি বাঁচাচ্ছেন ')+pdMoney(F.disc)+'</small></div><button type="button" data-at="cprm">'+L('Remove','সরান')+'</button></div>';
if(!av.length&&!A.cpc)return '';
return '<div class="atc-gh" style="margin-top:16px"><b>'+L('Coupon','কুপন')+'</b></div><div class="ct-cpn"><input id="atcc" placeholder="'+L('Coupon code','কুপন কোড')+'" value="'+esc(A.cpc||'')+'" autocomplete="off"><button type="button" data-at="cpn">'+(A.cpb?'...':L('Apply','অ্যাপ্লাই'))+'</button></div>'
+(av.length?'<div class="ac-cpk">'+av.map(function(x){return '<button type="button" data-at="cpk" data-c="'+esc(x.c)+'"><b>'+esc(x.c)+'</b><small>'+cpnLab(x)+'</small></button>'}).join('')+'</div>':'')+(A.cperr?'<small class="ad-er" style="display:block">'+esc(A.cperr)+'</small>':'')}
function atcCpn(code){var A=ATC;if(!A)return;if(!code){A.cperr=L('Enter a coupon code','কুপন কোড লিখুন');atcRender();return}A.cpc=code;A.cpb=1;var F=atcFees(A),key=F.u+'x'+A.q;
nbApi('POST','/coupons/check',{code:code,items:[{id:A.p[9],unit:F.u,q:A.q,shop:A.shop}]}).then(function(r){if(ATC!==A)return;A.cpb=0;A.cp={code:r.code,d:+r.discount||0,key:key};A.cpc=r.code;A.cperr='';PCP[A.k]=r.code;atcRender();msg(L('Coupon applied','কুপন যুক্ত হয়েছে'))}).catch(function(e){if(ATC!==A)return;A.cpb=0;A.cp=null;A.cperr=cpnErr(e);atcRender()})}
function cartShop(o){var en=enName(o.p[1]);return pdShop(en,hs(en))}
function cartSig(its){return its.map(function(o){return o.k+':'+o.u+'x'+o.q}).join('|')}
function cartCpnCheck(code,loud,cb){var its=cItems(),sig=cartSig(its),v=view;if(!its.length){msg(L('Your cart is empty','আপনার কার্ট খালি'));return}CPD[v]={code:code,d:0,sig:sig,busy:1};
nbApi('POST','/coupons/check',{code:code,items:its.filter(function(o){return o.p[8]==='L'}).map(function(o){return {id:o.p[9],unit:o.u,q:o.q,shop:cartShop(o)}})}).then(function(r){CPN[v]=r.code;CPD[v]={code:r.code,d:+r.discount||0,sig:sig};if(view==v&&document.body.classList.contains('vk'))renderCart();if(loud)msg(L('Coupon applied','কুপন যুক্ত হয়েছে'));if(cb)cb()}).catch(function(e){CPN[v]='';CPD[v]=null;if(view==v&&document.body.classList.contains('vk'))renderCart();msg(cpnErr(e));if(cb)cb()})}
function cartCpnDisc(its){var c=CPN[view],r=CPD[view];if(!c||!its.length)return 0;if(r&&r.code==c&&r.sig==cartSig(its))return r.busy?0:r.d;if(!r||!r.busy)setTimeout(function(){cartCpnCheck(c,false)},0);return 0}
function cartCpnChips(its,code){var seen={},out=[];its.forEach(function(o){(LCPN[o.p[9]]||[]).forEach(function(x){if(!seen[x.c]){seen[x.c]=1;out.push(x)}})});if(!out.length)return '';return '<div class="ac-cpk ct-cpk">'+out.slice(0,6).map(function(x){return '<button type="button" data-ca="cpk" data-c="'+esc(x.c)+'"'+(code==x.c?' class="on"':'')+'><b>'+esc(x.c)+'</b><small>'+cpnLab(x)+'</small></button>'}).join('')+'</div>'}
var BRO=null,BRL='';function brandApply(S){try{if(S.pol&&typeof POL!='undefined')['about','privacy','return','shipping'].forEach(function(k){var v=S.pol[k];if(v&&POL[k]&&(v.en||v.bn))POL[k][1]=[v.en||v.bn,v.bn||v.en]});if(window.renderPol)renderPol()}catch(e){}FTS=S.footer||null;try{window.NB_FAV=S.favicon||'';if(window.NBChatLogo)NBChatLogo()}catch(e){}try{BRL=S.logo||'';try{ftRender()}catch(x){}if(S.title)document.title=S.title;var l=document.querySelector('link[rel~=icon]');if(S.favicon){if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l)}l.href=S.favicon}
var a=document.querySelector('.nlogo');if(!a)return;if(BRO===null)BRO=a.innerHTML;a.innerHTML=S.logo?'<img class="nlimg" src="'+esc(S.logo)+'" alt="'+esc(S.title||'NurBuy')+'">':BRO}catch(e){}}

function cItems(){return Object.keys(cart).map(function(k){var v=VAR[k],pp=findP(k);return{k:k,p:pp,q:Math.max(1,+cart[k]||1),u:v?v.u:(pp?pp[3]:0),old:v?v.old:(pp?pp[4]:0),vl:v?v.lab:'',img:v&&v.img||''}}).filter(function(o){return o.p})}
var CI={back:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',trash:'<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>',pin:'<svg viewBox="0 0 24 24"><path d="M12 22s7-6.500 7-12a7 7 0 00-14 0c0 5.500 7 12 7 12z"/><circle cx="12" cy="10" r="2.500"/></svg>'};
function cRow(o){var p=o.p,k=o.k,en=enName(p[1]),nm=lang=='en'?en:tx(p[1]),off=o.old>o.u?Math.round((o.old-o.u)*100/o.old):0,tot=o.u*o.q;
var eta='';
return '<div class="ct-it" data-k="'+esc(k)+'"><div class="ct-im" data-ca="pd">'+PIC(o.img||imgOf(p),p[0],nm,'')+'</div><div class="ct-in"><div class="ct-nm" data-ca="pd">'+esc(nm)+'</div>'+(o.vl?'<div class="ct-vl">'+esc(o.vl)+'</div>':'')+'<div class="ct-pr"><b>'+pdMoney(o.u)+'</b>'+(off?'<del>'+o.old+'</del><em>'+off+'% '+L('OFF','ছাড়')+'</em>':'')+'</div>'+eta
+(LIVE&&mxNote(en)?'<div class="ct-mx">'+mxNote(en)+'</div>':'')+'<div class="ct-ac"><div class="ct-st"><button data-ca="dec" aria-label="Decrease">−</button><span>'+o.q+'</span><button data-ca="inc" aria-label="Increase"'+(o.q>=cLim(k)?' disabled':'')+'>+</button></div><button class="ct-rm" data-ca="rm">'+CI.trash+'<span>'+L('Remove','সরান')+'</span></button><div class="ct-lt">'+pdMoney(tot)+'</div></div></div></div>'}
function renderCart(){
var its=cItems(),n=its.length,sub=its.reduce(function(a,o){return a+o.u*o.q},0),b=lang=='bn';
var shops={};its.forEach(function(o){var sn=pdShop(enName(o.p[1]),hs(enName(o.p[1])));(shops[sn]=shops[sn]||[]).push(o)});
var nsh=Object.keys(shops).length,FREE=FREEMIN(),fee=n?(LIVE?locFee('min',sub,nsh):(sub>=FREE?0:(30*nsh))):0,code=CPN[view],pc=LIVE?0:(CPC[code]||0),disc=LIVE?cartCpnDisc(its):Math.round(sub*pc/100),codf=(n&&PAYM[view]=='cod')?CODFEE:0,total=sub+fee-disc+codf,left=Math.max(0,FREE-sub),pct=Math.min(100,Math.round(sub*100/FREE));
var loc=LIVE&&locOk('min')?locText('min'):($('lcn').textContent||'Dhaka');
var banner='<div class="ct-bn m"><span class="ct-bi">'+uic('bolt')+'</span><div><b>'+L('Delivery in 15–59 minutes','১৫–৫৯ মিনিটে ডেলিভারি')+'</b><small>'+CI.pin+' '+L('Delivering to ','ডেলিভারি: ')+esc(loc)+'</small></div></div>';
var prog='<div class="ct-fp"><div class="ct-fl">'+(left?L('Add ','আরও ')+'<b>'+pdMoney(left)+'</b> '+L('more for FREE delivery','কিনলে ডেলিভারি ফ্রি'):uic('ok')+' '+L('You get FREE delivery!','আপনি ফ্রি ডেলিভারি পাচ্ছেন!'))+'</div><div class="ct-pb"><i style="width:'+pct+'%"></i></div></div>';
var list='';
if(!n){list='<div class="ct-em"><div>'+uic('cart')+'</div><p>'+L('Your cart is empty','আপনার কার্ট খালি')+'</p><small>'+(L('Add fresh items for Minutes delivery.','মিনিটস ডেলিভারির জন্য পণ্য যোগ করুন।'))+'</small><button class="ct-go" data-ca="home">'+L('Start Shopping','কেনাকাটা শুরু করুন')+'</button></div>'}
else {list=(nsh>1?mshopHtml():'')+Object.keys(shops).map(function(sn){var shd=SH.filter(function(x){return x[0]==sn})[0],tm=shd?shd[5]:'15-59',lg=LSLG[sn],cs=shSt(sn);return '<div class="ct-sh m"><div class="ct-sh-h"><span class="ct-av">'+(lg?'<img src="'+esc(lg)+'" alt="" loading="lazy" onerror="this.remove()">':esc(sn.charAt(0)))+'</span><b>'+esc(sn)+'</b>'+(cs.open?'<small>'+uic('bolt')+' '+tm+' '+L('min','মিনিট')+'</small>':'<small class="ct-cl">'+shClosedLbl(cs)+(cs.nx?' · '+cs.nx:'')+'</small>')+'</div>'+shops[sn].map(function(o){return cRow(o,false)}).join('')+'</div>'}).join('')}
var sum='<div class="ct-sm"><h3>'+L('Order Summary','অর্ডার সামারি')+'</h3>'
+'<div class="ct-cpn"><input id="ctc" placeholder="'+(LIVE?L('Coupon code','কুপন কোড'):L('Promo code (NURBUY10)','প্রোমো কোড (NURBUY10)'))+'" value="'+esc(code)+'" autocomplete="off"><button data-ca="apply">'+L('Apply','অ্যাপ্লাই')+'</button></div>'+(LIVE?cartCpnChips(its,code):'')
+(n?'<div class="ct-pay"><h4>'+L('Payment method','পেমেন্ট পদ্ধতি')+'</h4><button type="button" data-ca="pay" data-p="cod" class="'+(PAYM[view]=='cod'?'on':'')+'"><i></i><span><b>'+L('Cash on Delivery','ক্যাশ অন ডেলিভারি')+'</b><small>'+L('Pay when you receive','পণ্য হাতে পেয়ে টাকা দিন')+'</small></span><em>+'+pdMoney(CODFEE)+'</em></button><button type="button" data-ca="pay" data-p="online" class="'+(PAYM[view]!='cod'?'on':'')+'"><i></i><span><b>bKash · Nagad · Card</b><small>'+L('Pay online, no extra charge','অনলাইনে পেমেন্ট, বাড়তি চার্জ নেই')+'</small></span><em class="g">'+L('No fee','ফ্রি')+'</em></button></div>':'')
+'<div class="ct-ln"><span>'+L('Subtotal','সাবটোটাল')+' ('+n+' '+L(n==1?'item':'items','টি পণ্য')+')</span><b>'+pdMoney(sub)+'</b></div>'
+'<div class="ct-ln"><span>'+L('Delivery fee','ডেলিভারি ফি')+'</span><b'+(n&&!fee?' class="g"':'')+'>'+(n?(fee?pdMoney(fee):L('FREE','ফ্রি')):pdMoney(0))+'</b></div>'
+(disc?'<div class="ct-ln"><span>'+L('Discount','ছাড়')+' ('+esc(code)+')</span><b class="g">− '+pdMoney(disc)+'</b></div>':'')+(codf?'<div class="ct-ln"><span>'+L('Cash on Delivery charge','ক্যাশ অন ডেলিভারি চার্জ')+'</span><b>+ '+pdMoney(codf)+'</b></div>':'')
+'<div class="ct-ln t"><span>'+L('Total','মোট')+'</span><b>'+pdMoney(total)+'</b></div><small class="ct-vt">'+L('Inclusive of VAT','ভ্যাটসহ')+'</small>'

+'<button class="ct-co" data-ca="co"'+(n?'':' disabled')+'>'+L('Checkout','চেকআউট')+(n?' · '+pdMoney(total):'')+'</button></div>';
$('cartv').className='ck-m';
$('cartv').innerHTML='<div class="ct"><div class="ct-top"><button class="ct-bk" data-ca="back" aria-label="Back">'+CI.back+'</button><h1>'+L('My Cart','আমার কার্ট')+(n?' <i>('+n+')</i>':'')+'</h1><span class="ct-md '+('m')+'">'+(uic('bolt')+' '+L('Minutes','মিনিটস'))+'</span></div><div class="ct-bd"><div class="ct-l">'+banner+(n?prog:'')+list+'</div>'+('<aside class="ct-s">'+sum+'</aside>')+'</div>'
+(n?'<div class="ct-bar"><div><small>'+L('Total','মোট')+'</small><b>'+pdMoney(total)+'</b></div><button data-ca="co">'+L('Checkout','চেকআউট')+' ('+n+')</button></div>':'')+'</div>'}
function openCart(){closeAll();closeProf();closeOrd();closeShops();closePD();if(window.cpS&&cpS.o)closeCP();document.body.classList.add('vk');cnt();renderCart();try{history.pushState({k:1},'','#cart')}catch(e){}window.scrollTo(0,0);setTab(2)}
function closeCart(){document.body.classList.remove('vk')}
window.closeCart=closeCart;
$('cartv').addEventListener('click',function(e){var t=e.target.closest('[data-ca]');if(!t)return;var a=t.dataset.ca,r=t.closest('.ct-it'),k=r?r.dataset.k:null;
if(a=='back'){NAV.back()}
else if(a=='home'){goHome()}
else if(a=='pd'){if(k)openPD(k)}
else if(a=='inc'){var lm=cLim(k);if((+cart[k]||1)>=lm){msg(L('Maximum '+lm+' per order','প্রতি অর্ডারে সর্বোচ্চ '+bnN(lm)+'টি'));return}cart[k]=Math.min(lm,(+cart[k]||1)+1);cnt();renderCart()}
else if(a=='dec'){var q=(+cart[k]||1)-1;if(q<1){delete cart[k]}else cart[k]=q;cnt();renderCart()}
else if(a=='rm'){delete cart[k];cnt();renderCart();msg(L('Removed from cart','কার্ট থেকে সরানো হয়েছে'))}
else if(a=='cpk'||(a=='apply'&&LIVE)){var v=a=='cpk'?t.dataset.c:($('ctc').value||'').trim().toUpperCase();if(!v){CPN[view]='';CPD[view]=null;renderCart();return}cartCpnCheck(v,true);return}
else if(a=='apply'){var v=($('ctc').value||'').trim().toUpperCase();if(!v){CPN[view]='';renderCart();return}if(CPC[v]){CPN[view]=v;renderCart();msg(L('Promo applied','প্রোমো কোড যুক্ত হয়েছে'))}else{msg(L('Invalid promo code','কোডটি সঠিক নয়'))}}
else if(a=='pay'){PAYM[view]=t.dataset.p=='cod'?'cod':'online';renderCart()}
else if(a=='co'){cartCheckout()}});
$('dcart').addEventListener('click',function(){openCart()});$('hcart').addEventListener('click',function(){openCart()});
window.addEventListener('popstate',function(){var B=document.body.classList;if(B.contains('vk')){if(B.contains('vd'))return;if(history.state&&history.state.k){renderCart()}else{closeCart();setTab(0)}}});


/* ===== CART CHECKOUT (whole cart through the same checkout sheet) ===== */
function cartShopsOf(its){var o={};its.forEach(function(x){o[x.shop]=1});return Object.keys(o).length}
function cartFees(A){var its=A.cart,sub=its.reduce(function(a,o){return a+o.u*o.q},0),FREE=FREEMIN(),nsh=cartShopsOf(its),fee=LIVE?locFee('min',sub,nsh):(sub>=FREE?0:(30*nsh)),cod=A.pay=='cod'?CODFEE:0,r=CPD[view],dsc=0;
if(LIVE){if(r&&!r.busy&&r.code==CPN[view]&&r.sig==A.sig)dsc=Math.min(r.d,sub)}else{var pc=CPC[CPN[view]]||0;dsc=Math.round(sub*pc/100)}
return{sub:sub,disc:dsc,fee:fee,cod:cod,total:Math.round((sub-dsc+fee+cod)*100)/100,u:0,lab:'',vid:''}}
function cartCheckout(){var its=cItems();if(!its.length){msg(L('Your cart is empty','আপনার কার্ট খালি'));return}
if(!AU.uid){lgrOpen({cart:1});return}
var bad=its.filter(function(o){var v=VAR[o.k];return v&&v.stock!=null&&+v.stock<=0});if(bad.length){msg(L('Remove out-of-stock items first','আগে স্টক শেষ হওয়া পণ্য সরান'));return}
var shut=its.filter(function(o){return pClosed(enName(o.p[1]))})[0];if(shut){var cs0=pClosed(enName(shut.p[1]));msg(L(LSHOP[enName(shut.p[1])]+' is closed now. ',LSHOP[enName(shut.p[1])]+' এখন বন্ধ। ')+(cs0.nx||'')+L(' Remove its items to order now.',' এখন অর্ডার করতে এর পণ্যগুলো সরান।'));return}
var over=its.filter(function(o){return o.q>cLim(o.k)})[0];if(over){msg(L('Maximum '+cLim(over.k)+' per order for ','সর্বোচ্চ '+bnN(cLim(over.k))+'টি নেওয়া যাবে: ')+(lang=='en'?enName(over.p[1]):tx(over.p[1])));return}
var lines=its.map(function(o){var en=enName(o.p[1]);return {k:o.k,p:o.p,q:o.q,u:o.u,vl:o.vl,img:o.img,en:en,nm:lang=='en'?en:tx(o.p[1]),shop:cartShop(o),vid:(VAR[o.k]&&VAR[o.k].vid)||''}});
ATC={cart:lines,sig:cartSig(its),k:'cart',p:lines[0].p,en:lines[0].en,nm:lines[0].nm,g:[],sel:[],vr:null,q:1,stock:99,max:99,shop:lines[0].shop,mode:'buy',step:2,ai:(window.geoFull&&geoFull())?-2:((PROF.addr&&PROF.addr.length)?0:-1),newA:'',loc:($('lcn')||{}).textContent||'',pay:'cod',mob:PROF.mobile||'',em:PROF.email||'',gn:''};
atcRender();$('atco').classList.add('o');document.body.style.overflow='hidden';try{fcUpd()}catch(e){}
if(LIVE&&AU.uid)wRefresh().then(function(){if(ATC&&ATC.step==3)atcRender()})}
function cartSumHtml(A){var n=A.cart.length;return '<div class="ck-sum"><div class="ck-sh"><b>'+n+' '+L(n==1?'item':'items','টি পণ্য')+'</b><button type="button" class="ad-ch" data-at="x">'+L('Edit cart','কার্ট বদলান')+'</button></div>'+A.cart.map(function(o){return '<div class="ck-it"><div class="ck-im">'+PIC(o.img||imgOf(o.p),o.p[0],o.nm,'')+'</div><div class="ck-in"><b>'+esc(o.nm)+'</b>'+(o.vl?'<small>'+esc(o.vl)+'</small>':'')+'<small>'+esc(o.shop)+'</small></div><div class="ck-pr"><small>'+pdMoney(o.u)+' × '+o.q+'</small><b>'+pdMoney(o.u*o.q)+'</b></div></div>'}).join('')+'</div>'}
function cartCpnAtc(A,F){var code=CPN[view];if(!LIVE){return code&&F.disc?'<div class="atc-gh" style="margin-top:16px"><b>'+L('Coupon','কুপন')+'</b></div><div class="ac-cpa"><i>'+TKSVG+'</i><div><b>'+esc(code)+'</b><small>'+L('You save ','আপনি বাঁচাচ্ছেন ')+pdMoney(F.disc)+'</small></div></div>':''}
if(code&&F.disc)return '<div class="atc-gh" style="margin-top:16px"><b>'+L('Coupon','কুপন')+'</b></div><div class="ac-cpa"><i>'+TKSVG+'</i><div><b>'+esc(code)+'</b><small>'+L('You save ','আপনি বাঁচাচ্ছেন ')+pdMoney(F.disc)+'</small></div><button type="button" data-at="cprm">'+L('Remove','সরান')+'</button></div>';
var seen={},av=[];A.cart.forEach(function(o){(LCPN[o.p[9]]||[]).forEach(function(x){if(!seen[x.c]){seen[x.c]=1;av.push(x)}})});if(!av.length)return '';
return '<div class="atc-gh" style="margin-top:16px"><b>'+L('Coupon','কুপন')+'</b></div><div class="ct-cpn"><input id="atcc" placeholder="'+L('Coupon code','কুপন কোড')+'" autocomplete="off"><button type="button" data-at="cpn">'+L('Apply','অ্যাপ্লাই')+'</button></div><div class="ac-cpk">'+av.map(function(x){return '<button type="button" data-at="cpk" data-c="'+esc(x.c)+'"><b>'+esc(x.c)+'</b><small>'+cpnLab(x)+'</small></button>'}).join('')+'</div>'}
function cartDone(A){A.cart.forEach(function(o){delete cart[o.k]});CPN[view]='';CPD[view]=null;try{cnt()}catch(e){}try{if(document.body.classList.contains('vk'))renderCart()}catch(e){}}
function cartPlaceLive(A,F,ad){var items=A.cart.map(function(o){var it={id:(o.p&&o.p[9])||o.k,n:cz(o.en)+(o.vl?' ('+o.vl+')':''),bn:cz(o.nm)+(o.vl?' ('+o.vl+')':''),e:o.p[0],unit:o.u,q:o.q,shop:o.shop};if(o.vid){it.vid=o.vid;it.variant=o.vl}return it});
var body={view:'min',items:items,fee:F.fee,loc_id:locId('min'),pay:A.pay,name:(A.gn||'').trim()||(PROF&&PROF.name)||'',mobile:normM(A.mob),email:A.em.trim(),address:ad,shop:A.cart[0].shop,extra:{loc:A.loc||'',cart:1}};if(F.disc&&CPN[view])body.coupon=CPN[view];
nbApi('POST','/orders',body).then(function(r){A.oid=r.order.id;A.etaO=(r.order&&r.order.eta)||null;A.multi=+((r.order.extra||{}).multi||0);A.wcb=r.cashback||0;A.wpay=r.paid||0;A.exists=!!r.exists;A.emDup=!!r.emDup;A.newAcc=!!r.newAcc;if(r.wallet&&r.wallet.bal!=null)WC.bal=r.wallet.bal;cartDone(A);
var done=function(){A.busy=0;A.step=4;atcR2()};
if(r.token){TOKN=r.token;try{localStorage.setItem('nb_tok',TOKN)}catch(e){}return nbApi('GET','/auth/me').then(function(m){applyMe(m);return Promise.all([liveOrders(),wRefresh()])}).then(done,done)}
if(AU.uid){ORD.unshift(mapOrd(r.order))}done()}).catch(function(e){A.busy=0;if(e.data&&e.data.code=='login_required'){atcClose();lgrOpen({cart:1});return}A.perr=liveErr(e);liveFix(e);if(e.data&&String(e.data.code||'').indexOf('coupon_')==0){CPN[view]='';CPD[view]=null;A.perr=cpnErr(e)}if(e.data&&e.data.code=='insufficient_wallet')A.pay='online';atcRender()})}
function cartPlaceDemo(A,F,id){var now=new Date(),o={id:id,t:'m',s:'p',ago:0,h:now.getHours(),m:now.getMinutes(),step:0,eta:{en:'Arriving within 59 minutes',bn:'সর্বোচ্চ ৫৯ মিনিটে পৌঁছাবে'},pay:A.pay=='cod'?['Cash on Delivery','ক্যাশ অন ডেলিভারি']:['Online','অনলাইন'],ad:atcAddr(A),mob:normM(A.mob),em:A.em.trim(),
items:A.cart.map(function(x){return [x.en+(x.vl?' ('+x.vl+')':''),x.nm+(x.vl?' ('+x.vl+')':''),x.p[0],x.u,x.q,x.shop,x.shop]})};
try{if(AU.uid)ORD.unshift(o);var key='nb_myord_'+(AU.uid||'g'),a=JSON.parse(localStorage.getItem(key)||'[]');a.unshift(o);localStorage.setItem(key,JSON.stringify(a.slice(0,30)))}catch(e){}
cartDone(A);A.oid=id;A.step=4;atcR2()}
/* ===== AUTH (front-end demo: data stays in this browser until a backend is connected) ===== */
function hsA(t){var h1=0xdeadbeef,h2=0x41c6ce57;for(var i=0;i<t.length;i++){var c=t.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return (4294967296*(2097151&h2)+(h1>>>0)).toString(36)}
/* ===== LIVE API MODE: active only when config.js sets window.NB_API ===== */
var NBAPI=(window.NB_API||'').replace(/\/+$/,''),LIVE=!!NBAPI,LIVEONLY=LIVE&&window.NB_SHOW_DEMO!==true,TOKN='';try{TOKN=localStorage.getItem('nb_tok')||''}catch(e){}
function nbApi(m,p,b){var h={};if(TOKN)h.Authorization='Bearer '+TOKN;var o={method:m,headers:h};if(b!==undefined){h['Content-Type']='application/json';o.body=JSON.stringify(b)}
return fetch(NBAPI+(window.NB_API_PRETTY===false?'/index.php':'')+p,o).then(function(r){return r.text().then(function(t){var j={};try{j=JSON.parse(t)}catch(e){}if(!r.ok){var er=new Error(j.error||L('Something went wrong. Please try again.','কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।'));er.status=r.status;er.data=j;if(r.status==401&&TOKN&&p.indexOf('/auth/login')<0&&p.indexOf('/orders')<0)liveExpired();throw er}return j})},function(){var er=new Error(L('Cannot reach the server. Please check your internet connection.','সার্ভারে যোগাযোগ হচ্ছে না। ইন্টারনেট সংযোগ দেখুন।'));er.status=0;throw er})}
function liveErr(e){return (e&&e.message)||'Error'}
function liveFix(e){var c=e&&e.data&&e.data.code;if(['price_changed','out_of_stock','max_qty','shop_closed','shop_no_delivery','item_unavailable','variant_unavailable'].indexOf(c)>-1)catFresh().catch(function(){});if(c&&c.indexOf('loc_')==0&&window.locPick){['min'].forEach(function(s){if(!locOk(s))locWrite(s,null)})}}
function nbBlkHandle(e){if(e&&e.status===403&&e.data&&e.data.code==='blocked'){var had=!!TOKN;if(window.nbBlocked)window.nbBlocked(e.data.block);if(had){liveExpired();WL={};WLS={lists:[]};ORD=[];try{goHome()}catch(x){}}return true}return false}
window.nbBlkHandle=nbBlkHandle;function liveExpired(){TOKN='';try{localStorage.removeItem('nb_tok');localStorage.removeItem('nb_sess')}catch(e){}if(AU.uid){AU.uid=null;USERS=[];ORD=[];WC={bal:0,tx:[],card:''};updAuthUI()}}
var USERS=[];try{if(!LIVE)USERS=JSON.parse(localStorage.getItem('nb_users')||'[]')}catch(e){}
if(!LIVE&&!USERS.some(function(u){return u.demo})){USERS.push({id:'u_demo',name:'Demo Customer',email:'demo@nurbuy.com',mobile:'01700000000',ph:hsA('nb|demo123'),demo:true});try{localStorage.setItem('nb_users',JSON.stringify(USERS))}catch(e){}}
function usave(){if(LIVE)return;try{localStorage.setItem('nb_users',JSON.stringify(USERS))}catch(e){}}
/* live shop state (filled from the catalog and /geo; functions further below) */
var LSTO={},LMX={},FOLS={},LOCD={min:null},LSEL={min:null};
var DWN=[['Sunday','রবিবার'],['Monday','সোমবার'],['Tuesday','মঙ্গলবার'],['Wednesday','বুধবার'],['Thursday','বৃহস্পতিবার'],['Friday','শুক্রবার'],['Saturday','শনিবার']];
var SHSIG='';
var WC={bal:0,tx:[],card:''},LP={skip:0},LSHOP={},LSLG={},LSABT={},LST={},LCB={},LCUP=0;
function srvUser(u){return {id:u.id,name:u.name,email:u.email||'',mobile:u.mobile||'',auto:!!u.auto,mvf:!!u.mvf,hasPw:!!u.hasPw}}
function applyMe(r){setTimeout(flMine,0);var u=srvUser(r.user);USERS=[u];LP.skip=1;loadUserData(u,r.profile||{});LP.skip=0;if(r.wallet&&r.wallet.bal!=null)WC.bal=r.wallet.bal;return u}
function mapOrd(o){var d=new Date(o.created_at),n=new Date(),dy=function(x){return new Date(x.getFullYear(),x.getMonth(),x.getDate()).getTime()},st=o.status,sm={'Pending':0,'Confirmed':1,'Packed':2,'Out for delivery':3},
r={id:o.id,t:'m',s:st=='Delivered'?'d':(st=='Cancelled'||st=='Returned')?'c':'p',ago:Math.round((dy(n)-dy(d))/864e5),h:d.getHours(),m:d.getMinutes(),ad:o.address||'',mob:o.mobile||'',em:o.email||'',
pay:o.pay=='cod'?['Cash on Delivery','ক্যাশ অন ডেলিভারি']:o.pay=='wallet'?['NurBuy Wallet','NurBuy ওয়ালেট']:['Online','অনলাইন'],
items:(o.items||[]).map(function(i){return [i.n,i.bn||i.n,i.e||'🛍',+i.unit||0,+i.q||1,i.shop||'',i.shop||'',i.id!=null?String(i.id):'',i.vid||'',i.variant||'']})};
if(o.trk)r.trk=o.trk;if(o.veh)r.veh=o.veh;if(o.delivery)r.dl=o.delivery;
r.multi=+((o.extra||{}).multi||0);if(o.total!=null)r.tot=+o.total;if(r.s=='p'){r.step=sm[st]||0;r.eta={en:'Arriving within 59 minutes',bn:'সর্বোচ্চ ৫৯ মিনিটে পৌঁছাবে'}}return r}
function liveOrders(){if(!LIVE||!AU.uid)return Promise.resolve();return nbApi('GET','/orders/mine').then(function(r){ORD=(r.orders||[]).map(mapOrd);try{if(document.body.classList.contains('vo')&&window.renderOrd)renderOrd()}catch(e){}}).catch(function(){})}
function wRefresh(){if(!LIVE||!AU.uid)return Promise.resolve();return nbApi('GET','/wallet').then(function(r){WC={bal:+r.bal||0,tx:r.tx||[],card:r.card||''};if(r.pct!=null)try{localStorage.setItem('nb_walletpct',String(r.pct))}catch(e){}}).catch(function(){})}
function showMaint(nm){var m=document.getElementById('maint');if(!m){m=document.createElement('div');m.id='maint';m.style.cssText='position:fixed;inset:0;z-index:9999;background:#fff;display:grid;place-items:center;text-align:center;padding:24px;font-family:inherit';document.body.appendChild(m)}m.innerHTML='<div><div style="font-size:56px">&#128736;</div><h2 style="margin:10px 0 6px;color:#111">'+L('We will be right back','আমরা একটু পরেই ফিরছি')+'</h2><p style="color:#556;margin:0">'+L('The store is under maintenance. Please check back soon.','ওয়েবসাইটে কিছু কাজ চলছে। একটু পরে আবার আসুন।')+'</p></div>';m.style.display=''}
function hideMaint(){var m=document.getElementById('maint');if(m)m.style.display='none'}
function liveCats(c){if(!LIVEONLY)return;var cs=(c.cats||[]).filter(function(x){return x&&x.n});if(!cs.length)return;
['min'].forEach(function(v){var l=cs.filter(function(x){return !x.v||x.v=='both'||x.v==v});if(!l.length)return;
var en=l.map(function(x){return {n:x.n,g:(x.subs||[]).map(function(s){return [s.n,[]]})}}),bn=l.map(function(x){return {n:x.b||x.n,g:(x.subs||[]).map(function(s){return [s.b||s.n,[]]})}}),A=CDS[v],E=CEM;
A.en.splice.apply(A.en,[0,A.en.length].concat(en));A.bn.splice.apply(A.bn,[0,A.bn.length].concat(bn));E.splice.apply(E,[0,E.length].concat(l.map(function(){return '🛍'})));
V[v].cats=l.map(function(x){return [x.img?'':'\ud83d\udecd',x.b||x.n,x.img||'',x.n]});
l.forEach(function(x){if(x.img){IMG[x.n]=x.img;IMG[x.b||x.n]=x.img}})})}
/** Rank of each live product in its category by real sales of the last 30 days (only products that sold). */
function liveItems(s,v){var A=CDS[v].en;return V[v].hot.concat(V[v].best).filter(function(p){return p[8]==='L'&&LSHOP[enName(p[1])]===s[0]}).map(function(p){var ci=0;A.forEach(function(c,i){if(c.n===p[12])ci=i});return {p:p,f:V[v].hot.indexOf(p)>-1?0:1,k:v,ci:ci}})}
function cz(t){return String(t==null?'':t).replace(/​/g,'')}
var LCOV={};
/** A shop with a delivery coverage list shows only to customers whose chosen area is inside it. */
function covOk(sh){var cv=LCOV[sh];if(!cv||!cv.length)return true;var o=window.LSEL&&LSEL.min;if(!o||!o.p||!o.p.length)return true;for(var i=0;i<o.p.length;i++)if(cv.indexOf(+o.p[i])>-1)return true;return false}
function applyCatalog(c){window.__LASTC=c;var S=c.settings||{};brandApply(S);try{if(S.walletPct!=null)localStorage.setItem('nb_walletpct',String(S.walletPct))}catch(e){}if(S.codFee!=null&&isFinite(+S.codFee))CODFEE=+S.codFee;if(S.maint)showMaint(S.name);else hideMaint();
if(c.updated&&c.updated===LCUP){(c.stores||[]).forEach(function(x){if(x&&x.n&&LSTO[x.n]&&x.fl!=null&&!LSTO[x.n].busy)LSTO[x.n].fl=+x.fl});try{flPaint()}catch(e){}return}LCUP=c.updated||0;BNR=c.banners&&typeof c.banners=='object'?c.banners:null;bsApply(c);try{heroR()}catch(e){}
try{var _fa=c.settings&&c.settings.freeAbove;if(_fa!=null&&isFinite(+_fa)&&+_fa>=0)CFREE=+_fa}catch(e){}
['min'].forEach(function(v){['hot','best'].forEach(function(k){V[v][k]=V[v][k].filter(function(p){return !LIVEONLY&&p[8]!=='L'})})});if(LIVEONLY)NEWP=[];LSHOP={};LST={};LCB={};LSLG={};LSABT={};LCPN={};LMX={};LSTO={};LCOV={};(c.stores||[]).forEach(function(x){if(x&&x.n&&x.cov&&x.cov.length)LCOV[x.n]=x.cov});(c.stores||[]).forEach(function(x){if(x&&x.n&&covOk(x.n)){LSTO[x.n]={id:x.id||'',h:x.hours&&x.hours.d?x.hours:null,food:+x.food||0,fl:+x.fl||0,cat:x.cat||'',since:+x.since||0};if(x.cover)IMG[x.n+' Cover']=x.cover;else delete IMG[x.n+' Cover'];if(x.img){LSLG[x.n]=x.img;IMG[x.n]=x.img}if(x.about)LSABT[x.n]=x.about}});
if(LIVEONLY){var st=(c.stores||[]).filter(function(x){return x.t=='min'&&covOk(x.n)});if(!st.length)st=[{n:S.name||'NurBuy Store',ow:'',r:4.8}];SH.length=0;st.forEach(function(x){var c=String(x.cat||'').toLowerCase(),ty=+x.food||/food|restaurant|restuarant|cafe|kitchen/.test(c)?'food':/medicine|pharma|ঔষধ/.test(c)?'med':/electr/.test(c)?'elec':/fish|মাছ/.test(c)?'fish':/meat|মাংস/.test(c)?'meat':'grocery';SH.push([x.n,x.ow||'',ty,0,0,'15-59',0,0,'🏪'])});['min'].forEach(function(v){if(V[v].shops)V[v].shops=(c.stores||[]).filter(function(x){return x.t==v}).map(function(x){return ['🏪',x.n,x.ow||'']})})}
liveCats(c);var PN={},NLV=[];(c.products||[]).forEach(function(x){if(!covOk(x.sh))return;var vs=['min'];vs.forEach(function(v){var em='',ci=-1;try{var A=CDS[v].en,nm=(x.cat||'').toLowerCase();for(var i=0;i<A.length;i++){if(A[i].n.toLowerCase()==nm){ci=i;break}}if(ci<0&&x.catBn){var B=CDS[v].bn;for(var j=0;j<B.length;j++){if(B[j].n==x.catBn){ci=j;break}}}if(ci>=0)em=CEM[ci]}catch(e){}
var en=x.n,nk=v+'|'+x.n;PN[nk]=(PN[nk]||0)+1;if(PN[nk]>1)en=x.n+new Array(PN[nk]).join('\u200b');var nmn={en:en,bn:x.bn||x.n},old=x.old>x.pr?x.old:x.pr,t=[em||x.e||'🛍',nmn,4,+x.pr,+old,x.img||'',null,(x.imgs&&x.imgs.length>1?x.imgs:null),'L',x.id,x.about||'',x.specs||[],x.cat||'',x.sub||'',(x.vr&&x.vr.v&&x.vr.v.length?x.vr:null),x.aboutBn||''];t[16]=x.pcode||'';t[17]=+x.ts>0?+x.ts:0;t[18]=x.tags||'';t[19]=+x.sold||0;t[6]=new Date((+x.ts>0?+x.ts:0)-NLV.length).toISOString();NLV.push(t);(old>x.pr?V[v].hot:V[v].best).unshift(t);if(x.sh&&x.sh!='—')LSHOP[en]=x.sh;if(x.cpn&&x.cpn.length)LCPN[x.id]=x.cpn;LST[en]=Math.max(0,+x.st||0);if(+x.mx>0)LMX[en]=+x.mx;if(x.catBn)LCB[String(x.id)]=x.catBn})});
if(LIVEONLY){NEWP=NLV;try{renderNew()}catch(e){}}
if(LIVEONLY){try{var sp=c.spon||{},GR=['linear-gradient(135deg,#0e7490,#22d3ee)','linear-gradient(135deg,#b45309,#f59e0b)','linear-gradient(135deg,#7c3aed,#ec4899)'],byId={};(c.products||[]).forEach(function(x){byId[x.id]=x;if(x.img)IMG[x.n]=x.img});
SPD.length=0;(sp.min||[]).forEach(function(id,i){var x=byId[id];if(!x)return;var t=V.min.hot.concat(V.min.best).filter(function(q){return q[8]==='L'&&q[1].en==x.n})[0];if(t&&SPD.length<3)SPD.push([t[0],t[1],+x.pr,GR[i%3]])});
spR()}catch(e){}}
SHSIG=shSig();try{flPaint()}catch(e){}
try{if(!document.body.className.replace('vx','').trim())render(view)}catch(e){}}
function nbReady(){document.documentElement.classList.remove('nbw')}
/* After an update the browser may still hold the old page in its cache: compare with version.txt and load the new copy once */
(function(){var b=window.NB_BUILD;if(!b||!window.fetch||!/^https?:/.test(location.protocol))return;fetch('/version.txt?t='+Date.now(),{cache:'no-store'}).then(function(r){return r.ok?r.text():''}).then(function(v){v=(v||'').trim();if(!/^[\w.-]{4,40}$/.test(v)||v===b)return;try{if(sessionStorage.getItem('nb_vr_'+v))return;sessionStorage.setItem('nb_vr_'+v,'1')}catch(e){return}var u=new URL(location.href);u.searchParams.set('v',v);location.replace(u.toString())}).catch(function(){})})();
/** Last catalog kept in this browser, so a returning visitor sees the store's real design at once while the fresh copy loads. */
function catSave(c){try{var sk=c&&c.bs&&c.bs.now?+c.bs.now-Date.now():null,t=JSON.stringify({c:c,sk:sk});if(t.length<2e6)localStorage.setItem('nb_cat',t);else localStorage.removeItem('nb_cat')}catch(e){try{localStorage.removeItem('nb_cat')}catch(x){}}}
function catLoad(){try{var o=JSON.parse(localStorage.getItem('nb_cat')||'null');if(!o||!o.c)return null;if(o.c.bs&&o.sk!=null)o.c.bs.now=Date.now()+o.sk;return o.c}catch(e){return null}}
function catFresh(){var P=window.__NBC;window.__NBC=null;return (P?P.then(function(c){return c||nbApi('GET','/catalog')}):nbApi('GET','/catalog')).then(function(c){applyCatalog(c);catSave(c)})}
function liveBoot(){if(!LIVE)return nbReady();
if(LIVEONLY){['min'].forEach(function(v){V[v].hot=[];V[v].best=[];if(V[v].shops)V[v].shops=[]});NEWP=[];SPD.length=0;try{spR()}catch(e){}try{render(view)}catch(e){}}
var cc=catLoad();if(cc){try{applyCatalog(cc)}catch(e){}nbReady()}
catFresh().catch(function(){}).then(nbReady);
if(TOKN)nbApi('GET','/auth/me').then(function(r){applyMe(r);return Promise.all([liveOrders(),wRefresh()])}).catch(function(e){if(e.status==401)liveExpired();else window.nbBlkHandle(e)});
setInterval(function(){if(document.hidden)return;catFresh().catch(function(){});if(AU.uid){liveOrders()}},60000)}

/* ===== WALLET (front-end demo, data in this browser) ===== */
function wPct(){var v=NaN;try{v=parseFloat(localStorage.getItem('nb_walletpct'))}catch(e){}return isFinite(v)&&v>=0?v:1}
function wR(n){return Math.round(n*100)/100}
function wM(n){return '৳ '+wR(n).toLocaleString('en-US',{maximumFractionDigits:2})}
function wGet(u){if(LIVE)return {bal:WC.bal,tx:(WC.tx||[]).slice()};var w=null;try{w=JSON.parse(localStorage.getItem('nb_wal_'+u)||'null')}catch(e){}if(!w||typeof w.bal!='number')w={bal:0,tx:[]};if(!w.tx)w.tx=[];return w}
function wSet(u,w){if(LIVE)return;try{localStorage.setItem('nb_wal_'+u,JSON.stringify(w))}catch(e){}}
(function(){try{if(!LIVE&&!localStorage.getItem('nb_wal_u_demo')){var n=Date.now();wSet('u_demo',{bal:250,tx:[{t:'cb',a:164.5,oid:'NBM-482913',pct:1,d:n-864e5*2},{t:'cb',a:85.5,oid:'NBM-317706',pct:1,d:n-864e5*6}]})}}catch(e){}})();
function wCardNo(u){if(LIVE&&WC.card)return WC.card;var h=hsA('wal|'+u)+hsA('w2|'+u),d='';for(var i=0;i<h.length&&d.length<12;i++)d+=(parseInt(h[i],36)%10);while(d.length<12)d+='0';d='3030'+d;return d.replace(/(\d{4})(?=\d)/g,'$1 ')}
function wlOpt(A,F){var need=F.sub-(F.disc||0)+F.fee,bal=AU.uid?wGet(AU.uid).bal:0,ok=!!AU.uid&&bal>=need,sub=!AU.uid?L('Log in to use your wallet balance','ওয়ালেট ব্যালেন্স ব্যবহার করতে লগইন করুন'):L('Balance ','ব্যালেন্স ')+wM(bal)+(ok?'':' · '+L('need '+wM(need-bal)+' more','আরও '+wM(need-bal)+' লাগবে'));
return '<button type="button" class="ad-c wt-pay'+(A.pay=='wallet'?' on':'')+(ok?'':' dis')+'" data-at="pay" data-p="wallet"><span class="ad-r"></span><span class="ad-t"><b>'+L('Pay with NurBuy Wallet','NurBuy ওয়ালেট দিয়ে পেমেন্ট')+'</b><small>'+sub+'</small></span><span class="wt-bd">'+wPct()+'% '+L('cashback','ক্যাশব্যাক')+'</span></button>'}
function wlEarn(F){var c=wR((F.sub-(F.disc||0))*wPct()/100);return c>0?'<div class="wt-ern">'+L('After delivery you will get ','ডেলিভারির পর পাবেন ')+'<b>'+wM(c)+'</b> '+L('bonus in your NurBuy Wallet','বোনাস আপনার NurBuy ওয়ালেটে')+'</div>':''}
function wDate(t){try{return new Date(t).toLocaleString(lang=='bn'?'bn-BD':'en-GB',{day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit'})}catch(e){return ''}}
function renderWallet(){var u=AU.uid,gst=!u,w=gst?{bal:0,tx:[]}:wGet(u),pc=wPct(),er=0,sp=0;w.tx.forEach(function(x){if(x.t=='cb')er+=x.a;else if(x.t=='cbr')er-=x.a;else if(x.t=='pay')sp+=x.a});er=Math.max(0,er);
var nm=gst?'Customer Name':(PROF&&PROF.name)||'',cu=gst?null:USERS.filter(function(x){return x.id==u})[0];
var h='<div class="wt-hd"><button type="button" class="wt-bk" data-wt="x" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><b>'+L('Wallet','ওয়ালেট')+'</b><span class="wt-tg">'+L('Minutes','মিনিটস')+'</span></div><div class="wt-bd2'+(gst?' bl':'')+'">'
+'<div class="wt-card"><div class="wt-c1"><span class="wt-lg">NurBuy <i>Wallet</i></span><span class="wt-pc">'+pc+'% '+L('cashback','ক্যাশব্যাক')+'</span></div>'
+'<div class="wt-bl"><small>'+L('Available balance','বর্তমান ব্যালেন্স')+'</small><b>'+wM(w.bal)+'</b></div>'
+'<div class="wt-ch"></div><div class="wt-nu">'+(gst?'3030 0000 0000 0000':wCardNo(u))+'</div>'
+'<div class="wt-c3"><div><small>'+L('Card holder','কার্ড হোল্ডার')+'</small><b>'+esc(nm||'Customer')+'</b></div><div class="r"><small>'+L('Mobile','মোবাইল')+'</small><b>'+esc(gst?'01XXXXXXXXX':((cu&&cu.mobile)||PROF.mobile||'-'))+'</b></div></div></div>'
+'<div class="wt-st"><div><small>'+L('Total cashback earned','মোট ক্যাশব্যাক পেয়েছেন')+'</small><b class="g">+ '+wM(er)+'</b></div><div><small>'+L('Total spent from wallet','ওয়ালেট থেকে খরচ')+'</small><b>'+wM(sp)+'</b></div></div>'
+'<div class="wt-hw"><h4>'+L('How it works','কীভাবে কাজ করে')+'</h4><ul><li><b>1</b><span>'+L('Order anything from Minutes and get ','মিনিটসে যেকোনো অর্ডারে পাবেন ')+'<strong>'+pc+'%</strong>'+L(' of the product price back as wallet bonus.',' পণ্যের দামের ওপর ওয়ালেট বোনাস।')+'</span></li><li><b>2</b><span>'+L('The bonus is added to this wallet automatically when the order is delivered. Cancelled or failed orders get no bonus.','অর্ডার ডেলিভারি সম্পন্ন হলে বোনাস নিজে থেকেই এই ওয়ালেটে যোগ হবে। বাতিল বা ব্যর্থ অর্ডারে বোনাস দেওয়া হয় না।')+'</span></li><li><b>3</b><span>'+L('At checkout, choose "Pay with NurBuy Wallet" to pay using your balance.','চেকআউটে "NurBuy ওয়ালেট দিয়ে পেমেন্ট" বেছে নিলে ব্যালেন্স দিয়ে দাম মেটানো যাবে।')+'</span></li></ul><p>'+L('Your balance must cover the product price plus delivery fee.','পণ্যের দাম ও ডেলিভারি ফি পরিমাণ ব্যালেন্স থাকতে হবে।')+'</p></div>'
+'\u0001<div class="wt-hs"><h4>'+L('Transactions','লেনদেন')+'</h4>'+(w.tx.length?w.tx.map(function(x){var adj=x.t=='adj',rv=x.t=='cbr',c=x.t=='cb'||(adj&&x.a>=0),xa=Math.abs(x.a);return '<div class="wt-tx"><span class="wt-ti '+(c?'in':'out')+'"><svg viewBox="0 0 24 24"><path d="'+(c?'M12 19V5M5 12l7-7 7 7':'M12 5v14M5 12l7 7 7-7')+'"/></svg></span><div class="wt-tt"><b>'+(rv?L('Bonus taken back (order cancelled)','বোনাস ফেরত নেওয়া হয়েছে (অর্ডার বাতিল)'):adj?L('Wallet adjustment','ওয়ালেট সমন্বয়'):c?L('Delivery bonus','ডেলিভারি বোনাস')+(x.pct!=null?' ('+x.pct+'%)':''):L('Paid for order','অর্ডারের পেমেন্ট'))+'</b><small>'+(x.oid?'#'+esc(x.oid)+' · ':'')+wDate(x.d)+'</small></div><b class="wt-ta '+(c?'g':'')+'">'+(c?'+ ':'− ')+wM(xa)+'</b></div>'}).join(''):'<p class="wt-em">'+L('No transactions yet. Place a Minutes order to earn your first cashback.','এখনো কোনো লেনদেন নেই। প্রথম ক্যাশব্যাক পেতে মিনিটসে অর্ডার করুন।')+'</p>')+'</div></div>';
var lk='';if(gst)lk='<div class="wt-lk"><div class="wt-lc"><span class="wt-li"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg></span><b>'+L('Log in to see your wallet','ওয়ালেট দেখতে লগইন করুন')+'</b><p>'+L('Your balance, cashback and card are tied to your NurBuy account. Log in or create an account to use them.','আপনার ব্যালেন্স, ক্যাশব্যাক ও কার্ড NurBuy অ্যাকাউন্টের সাথে যুক্ত। ব্যবহার করতে লগইন করুন বা অ্যাকাউন্ট খুলুন।')+'</p><button type="button" class="wt-lb" data-wt="login">'+L('Log in / Create account','লগইন / অ্যাকাউন্ট খুলুন')+'</button></div></div>';
if(window.innerWidth>=900){var a=h.indexOf('<div class="wt-bd2'),b=h.indexOf('\u0001'),bs=h.indexOf('>',a)+1,left=h.slice(bs,b),right=h.slice(b+1,h.length-6);$('walv').innerHTML='<div class="wt-pgw"><div class="wt-pgh"><button type="button" class="wt-bk" data-wt="x" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><h1>'+L('Wallet','ওয়ালেট')+'</h1><span class="wt-tg">'+L('Minutes','মিনিটস')+'</span></div><div class="wt-pgb'+(gst?' bl':'')+'"><div class="wt-pgl">'+left+'</div><div class="wt-pgr">'+right+'</div></div>'+lk+'</div>';return}
h=h.replace('\u0001','')+lk;$('wts').classList.toggle('lock',gst);$('wts').innerHTML=h}
function lgrOpen(ctx){var o=$('lgro');if(!o){o=document.createElement('div');o.id='lgro';o.className='lgr-o';o.addEventListener('click',function(e){if(e.target===o||e.target.closest('[data-lg="x"]')){o.classList.remove('o');return}if(e.target.closest('[data-lg="go"]')){o.classList.remove('o');AU.next='buy';AU.buyK=lgrOpen.c;openAuth('login')}});document.body.appendChild(o)}
lgrOpen.c=ctx;o.innerHTML='<div class="lgr" role="dialog" aria-modal="true"><span class="wt-li"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1"/></svg></span><b>'+L('Account needed to order','অর্ডারে অ্যাকাউন্ট লাগবে')+'</b><p>'+L('To order from Minutes you need a NurBuy account. It lets us deliver fast, track your order and add wallet cashback. Log in or create one, it takes less than a minute.','মিনিটস থেকে অর্ডার করতে NurBuy অ্যাকাউন্ট লাগবে। এতে দ্রুত ডেলিভারি, অর্ডার ট্র্যাক ও ওয়ালেট ক্যাশব্যাক পাবেন। লগইন করুন বা অ্যাকাউন্ট খুলুন, এক মিনিটও লাগবে না।')+'</p><button type="button" class="wt-lb" data-lg="go">'+L('Log in / Create account','লগইন / অ্যাকাউন্ট খুলুন')+'</button><button type="button" class="lgr-x" data-lg="x">'+L('Not now','এখন না')+'</button></div>';o.classList.add('o')}
function openWallet(){if(LIVE&&AU.uid)wRefresh().then(function(){if(document.body.classList.contains('vq')||$('wto').classList.contains('o'))renderWallet()});if(window.innerWidth>=900){closeAll();closeProf();closeOrd();closeShops();closePD();if(window.cpS&&cpS.o)closeCP();renderWallet();document.body.classList.add('vq');try{history.pushState({q:1},'','#wallet')}catch(e){}window.scrollTo(0,0);return}renderWallet();var bn0=document.querySelector('.bn');if(bn0)document.documentElement.style.setProperty('--bnh',bn0.offsetHeight+'px');$('wto').classList.add('o');document.body.classList.add('wo');document.body.style.overflow='hidden';$('wts').scrollTop=0}
function closeWallet(){document.body.classList.remove('vq');var o=$('wto');if(o&&o.classList.contains('o')){o.classList.remove('o');document.body.style.overflow=''}document.body.classList.remove('wo')}
(function(){var o=document.createElement('div');o.className='wt-o';o.id='wto';o.innerHTML='<div class="wt" id="wts" role="dialog" aria-modal="true"></div>';document.body.appendChild(o);
o.addEventListener('click',function(e){if(e.target===o||e.target.closest('[data-wt="x"]')){closeWallet();return}if(e.target.closest('[data-wt="login"]')){closeWallet();AU.next='wal';openAuth('login')}});
document.addEventListener('keydown',function(e){if(e.key=='Escape')closeWallet()});
$('dwal').addEventListener('click',function(){openWallet()});$('walv').addEventListener('click',function(e){if(e.target.closest('[data-wt="x"]')){closeWallet();window.scrollTo(0,0);return}if(e.target.closest('[data-wt="login"]')){closeWallet();AU.next='wal';openAuth('login')}});window.addEventListener('popstate',function(){if(document.body.classList.contains('vq')&&!(history.state&&history.state.q))closeWallet()})})();

function normM(m){m=(m||'').replace(/[\s-]/g,'');m=m.replace(/^\+?88/,'');return m}
function isMob(m){return /^01[3-9]\d{8}$/.test(normM(m))}
function isMail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)}
window.dupU=function(mob,em,self){mob=normM(mob||'');em=(em||'').trim().toLowerCase();var r={m:null,e:null};USERS.forEach(function(u){if(u.id==self)return;if(mob&&u.mobile==mob)r.m=u;if(em&&u.email&&u.email.toLowerCase()==em)r.e=u});return r};
function findU(id){id=(id||'').trim();var m=isMob(id)?normM(id):null,e=id.toLowerCase();return USERS.filter(function(u){return (m&&u.mobile==m)||(u.email&&u.email.toLowerCase()==e)})[0]}
function loadUserData(u,prof){AU.uid=u.id;
var def={name:u.name,mobile:u.mobile||'',email:u.email||'',avatar:'',cover:'',addr:[],locI:-2,mvf:false};
if(LIVE){PROF=Object.assign({},def,prof||{});PROF.name=u.name;PROF.mobile=u.mobile||'';PROF.email=u.email||'';PROF.mvf=!!u.mvf;if(!Array.isArray(PROF.addr))PROF.addr=[]}else try{PROF=Object.assign({},def,JSON.parse(localStorage.getItem('nb_prof_'+u.id)||'{}'))}catch(e){PROF=Object.assign({},def)}
var g={};try{g=JSON.parse(localStorage.getItem('nb_wl')||'{}')}catch(e){}
try{var sv=null;if(LIVE&&Array.isArray(PROF.wl)){sv={};PROF.wl.forEach(function(k){sv[k]='min'})}WL=Object.assign({},sv||JSON.parse(localStorage.getItem('nb_wl_'+u.id)||'{}'),WL,g)}catch(e){WL=Object.assign({},g)}
try{var w=LIVE&&PROF.wls&&PROF.wls.lists?PROF.wls:JSON.parse(localStorage.getItem('nb_wls_'+u.id)||'null');WLS=w&&w.lists?w:{lists:[]}}catch(e){WLS={lists:[]}}
try{localStorage.removeItem('nb_wl')}catch(e){}
wlSave();saveProf();if(LIVE){ORD=[];updAuthUI();return}ORD=u.demo?ORD_DEMO:[];try{ORD=JSON.parse(localStorage.getItem('nb_myord_'+u.id)||'[]').concat(ORD)}catch(e){}updAuthUI()}
function updAuthUI(){try{if(window.NBN)NBN.userIn()}catch(e){}var u=USERS.filter(function(x){return x.id==AU.uid})[0];var sp=$('dlog').querySelector('.dl');if(sp)sp.textContent=u?(u.name.trim().split(/\s+/)[0]||'Account'):'Log in'}
function authGate(n){if(AU.uid)return false;AU.next=n;openAuth('login');return true}
function doLogout(){closeWallet();if(LIVE){try{nbApi('POST','/auth/logout',{}).catch(function(){})}catch(e){}TOKN='';try{localStorage.removeItem('nb_tok')}catch(e){}USERS=[];WC={bal:0,tx:[],card:''}}AU.uid=null;AU.next=null;try{localStorage.removeItem('nb_sess')}catch(e){}WL={};WLS={lists:[]};ORD=[];updAuthUI();document.querySelectorAll('.wh.on').forEach(function(b){b.classList.remove('on')});goHome();msg(L('Logged out','লগ আউট হয়েছে'))}
function afterAuth(){var n=AU.next||'prof';AU.next=null;closeAuth();if(n=='buy'&&AU.buyK&&AU.buyK.cart){AU.buyK=null;openCart();setTimeout(cartCheckout,80)}else if(n=='buy'&&AU.buyK){var bk=AU.buyK;AU.buyK=null;openPD(bk.k);setTimeout(function(){atcOpen(bk.k,'buy',bk.step,bk.pre)},60)}else if(n=='ord')openOrd();else if(n=='wal')openWallet();else if(n=='wish')openWish();else openProf();document.querySelectorAll('.wh.on').forEach(function(b){b.classList.remove('on')});wlHearts()}
var AUT={mode:'login',err:'',show:false};
var AI={eye:'<svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',eyeo:'<svg viewBox="0 0 24 24"><path d="M3 3l18 18M10.600 6.100A9.500 9.500 0 0112 6c6 0 10 6 10 6a17 17 0 01-3.200 3.800M6.300 7.700A16 16 0 002 12s4 7 10 7a9.500 9.500 0 004-.9"/></svg>',x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'};
function renderAuth(){var lg=AUT.mode=='login',pw=function(id,lb,ph){return '<div class="au-f"><label for="'+id+'">'+lb+'</label><div class="au-pw"><input id="'+id+'" type="'+(AUT.show?'text':'password')+'" placeholder="'+ph+'" autocomplete="'+(lg?'current-password':'new-password')+'"><button type="button" class="au-eye" data-au="eye" aria-label="Show password">'+(AUT.show?AI.eyeo:AI.eye)+'</button></div></div>'};
var form=lg?'<div class="au-f"><label for="aui">'+L('Email or mobile number','ইমেইল অথবা মোবাইল নম্বর')+'</label><input id="aui" placeholder="'+L('you@example.com or 01XXXXXXXXX','you@example.com অথবা 01XXXXXXXXX')+'" autocomplete="username"></div>'+pw('aup',L('Password','পাসওয়ার্ড'),L('Enter your password','পাসওয়ার্ড দিন'))+'<div class="au-fg"><button type="button" data-au="forgot">'+L('Forgot password?','পাসওয়ার্ড ভুলে গেছেন?')+'</button></div>'
:'<div class="au-f"><label for="aun">'+L('Full name','পুরো নাম')+'</label><input id="aun" placeholder="'+L('Your full name','আপনার পুরো নাম')+'" autocomplete="name"></div><div class="au-f"><label for="aum">'+L('Mobile number','মোবাইল নম্বর')+'</label><input id="aum" inputmode="tel" placeholder="01XXXXXXXXX" autocomplete="tel"></div><div class="au-f"><label for="aue">'+L('Email (optional)','ইমেইল (ঐচ্ছিক)')+'</label><input id="aue" type="email" placeholder="you@example.com" autocomplete="email"></div>'+pw('aup',L('Password','পাসওয়ার্ড'),L('At least 6 characters','কমপক্ষে ৬ অক্ষর'))+'<div class="au-f"><label for="aup2">'+L('Confirm password','পাসওয়ার্ড নিশ্চিত করুন')+'</label><input id="aup2" type="'+(AUT.show?'text':'password')+'" placeholder="'+L('Re-enter password','আবার পাসওয়ার্ড দিন')+'" autocomplete="new-password"></div><label class="au-tm"><input type="checkbox" id="aut"> <span>'+L('I agree to the Terms & Privacy Policy','আমি টার্মস ও প্রাইভেসি পলিসিতে সম্মত')+'</span></label>';
$('authv').innerHTML='<div class="au"><div class="au-sd"><a class="au-lg" data-au="home">'+(BRL?'<img class="au-li" src="'+esc(BRL)+'" alt="NurBuy">':'<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#fff"/><path d="M9 12h14l-1 12H10z" fill="none" stroke="#1d2fe0" stroke-width="2" stroke-linejoin="round"/><path d="M12.500 12v-1a3.500 3.500 0 017 0v1" fill="none" stroke="#1d2fe0" stroke-width="2"/></svg><b>NurBuy</b>')+'</a><h2>'+L('Fresh delivery in minutes','মিনিটসেই তাজা ডেলিভারি')+'</h2><p>'+L('Groceries, food and daily needs from shops near you.','আপনার কাছের দোকান থেকে বাজার, খাবার ও প্রয়োজনীয় সবকিছু।')+'</p><ul><li>'+uic('bolt')+' '+L('Local delivery in minutes','মিনিটসেই লোকাল ডেলিভারি')+'</li><li>'+uic('car')+' '+L('Live order tracking with countdown','কাউন্টডাউনসহ লাইভ অর্ডার ট্র্যাকিং')+'</li><li>'+uic('heart')+' '+L('Save favourites to your wishlist','উইশলিস্টে পছন্দের পণ্য রাখুন')+'</li></ul></div>'
+'<div class="au-cd"><button class="au-x" data-au="close" aria-label="Close">'+AI.x+'</button><div class="au-tabs"><button class="'+(lg?'on':'')+'" data-au="tab" data-m="login">'+L('Log in','লগইন')+'</button><button class="'+(lg?'':'on')+'" data-au="tab" data-m="signup">'+L('Create account','নতুন অ্যাকাউন্ট')+'</button></div>'
+'<h1>'+(lg?L('Welcome back','আবার স্বাগতম'):L('Create your account','অ্যাকাউন্ট খুলুন'))+'</h1><p class="au-sub">'+(lg?L('Log in to see your profile, wishlist and orders.','প্রোফাইল, উইশলিস্ট ও অর্ডার দেখতে লগইন করুন।'):L('Sign up to track orders and save your wishlist.','অর্ডার ট্র্যাক ও উইশলিস্ট সেভ করতে সাইন আপ করুন।'))+'</p>'
+'<div id="auform">'+form+'<div class="au-er" id="auer">'+esc(AUT.err)+'</div><button class="au-go" type="button" data-au="submit">'+(lg?L('Log in','লগইন করুন'):L('Create account','অ্যাকাউন্ট খুলুন'))+'</button></div>'
+'<div class="au-sw">'+(lg?L('New to NurBuy?','NurBuy-তে নতুন?')+' <button data-au="tab" data-m="signup">'+L('Create account','অ্যাকাউন্ট খুলুন')+'</button>':L('Already have an account?','আগে থেকেই অ্যাকাউন্ট আছে?')+' <button data-au="tab" data-m="login">'+L('Log in','লগইন করুন')+'</button>')+'</div>'+'</div></div>';
var fo=$('authv').querySelector('input');if(fo&&window.innerWidth>=900)fo.focus()}
function openAuth(m){closeAll();closeProf();closeOrd();closeShops();closePD();if(window.cpS&&cpS.o)closeCP();AUT={mode:m||'login',err:'',show:false};document.body.classList.add('vu');renderAuth();try{history.pushState({u:1},'','#login')}catch(e){}window.scrollTo(0,0)}
function closeAuth(){document.body.classList.remove('vu')}
window.closeAuth=closeAuth;
var _ra=renderAuth;renderAuth=function(){_ra();var a=$('authv'),d=document.createElement('div');d.className='au-lgs';d.innerHTML=uic('globe')+' <button type="button" data-lg="bn" class="'+(lang=='bn'?'on':'')+'">বাংলা</button><button type="button" data-lg="en" class="'+(lang=='en'?'on':'')+'">English</button>';a.appendChild(d)};
$('authv').addEventListener('click',function(e){var b=e.target.closest('.au-lgs [data-lg]');if(b){setLang(b.dataset.lg);renderAuth()}});
function auSubmit(){var v=function(id){var e=$(id);return e?e.value:''},E=function(t){AUT.err=t;$('auer').textContent=t};
if(AUT.mode=='login'){var id=v('aui').trim(),pw=v('aup');if(!id)return E(L('Enter your email or mobile number','ইমেইল অথবা মোবাইল নম্বর দিন'));if(!pw)return E(L('Enter your password','পাসওয়ার্ড দিন'));
if(LIVE){var sb=document.querySelector('[data-au=submit]');if(sb)sb.disabled=true;nbApi('POST','/auth/login',{id:id,password:pw}).then(function(r){TOKN=r.token;try{localStorage.setItem('nb_tok',TOKN)}catch(e){}return nbApi('GET','/auth/me')}).then(function(r){var u=applyMe(r);return Promise.all([liveOrders(),wRefresh()]).then(function(){msg(L('Welcome back, ','স্বাগতম, ')+u.name.split(/\s+/)[0]+'!');afterAuth()})}).catch(function(e){E(e.status==401?L('Incorrect email/mobile or password','ইমেইল/মোবাইল অথবা পাসওয়ার্ড ভুল'):liveErr(e))}).then(function(){if(sb)sb.disabled=false});return}
var u=findU(id);if(!u)return E(L('No account found. Please create one.','কোনো অ্যাকাউন্ট পাওয়া যায়নি। নতুন অ্যাকাউন্ট খুলুন।'));if(u.ph!=hsA('nb|'+pw))return E(L('Incorrect password','পাসওয়ার্ড ভুল'));
try{localStorage.setItem('nb_sess',u.id)}catch(e){}loadUserData(u);msg(L('Welcome back, ','স্বাগতম, ')+u.name.split(/\s+/)[0]+'!');afterAuth()}
else{var nm=v('aun').trim(),mb=v('aum').trim(),em=v('aue').trim(),p1=v('aup'),p2=v('aup2');
if(nm.length<2)return E(L('Enter your full name','পুরো নাম লিখুন'));if(!isMob(mb))return E(L('Enter a valid mobile number (01XXXXXXXXX)','সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)'));if(em&&!isMail(em))return E(L('Enter a valid email address','সঠিক ইমেইল ঠিকানা দিন'));
if(p1.length<6)return E(L('Password must be at least 6 characters','পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'));if(p1!=p2)return E(L('Passwords do not match','পাসওয়ার্ড মিলছে না'));if(!$('aut').checked)return E(L('Please accept the Terms & Privacy Policy','টার্মস ও প্রাইভেসি পলিসিতে সম্মত হোন'));
if(LIVE){var sb2=document.querySelector('[data-au=submit]');if(sb2)sb2.disabled=true;nbApi('POST','/auth/signup',{name:nm,mobile:normM(mb),email:em,password:p1}).then(function(r){TOKN=r.token;try{localStorage.setItem('nb_tok',TOKN)}catch(e){}return nbApi('GET','/auth/me')}).then(function(r){applyMe(r);return wRefresh()}).then(function(){msg(L('Account created. Welcome, ','অ্যাকাউন্ট তৈরি হয়েছে। স্বাগতম, ')+nm.split(/\s+/)[0]+'!');afterAuth()}).catch(function(e){E(liveErr(e))}).then(function(){if(sb2)sb2.disabled=false});return}
if(em&&findU(em))return E(L('An account with this email already exists','এই ইমেইলে অ্যাকাউন্ট আগেই আছে'));if(findU(normM(mb)))return E(L('An account with this mobile already exists','এই মোবাইল নম্বরে অ্যাকাউন্ট আগেই আছে'));
var nu={id:'u_'+Date.now().toString(36),name:nm,email:em.toLowerCase(),mobile:normM(mb),ph:hsA('nb|'+p1)};USERS.push(nu);usave();try{localStorage.setItem('nb_sess',nu.id)}catch(e){}loadUserData(nu);msg(L('Account created. Welcome, ','অ্যাকাউন্ট তৈরি হয়েছে। স্বাগতম, ')+nm.split(/\s+/)[0]+'!');afterAuth()}}
$('authv').addEventListener('keydown',function(e){if(e.key=='Enter'&&e.target.tagName=='INPUT'&&e.target.type!='checkbox'){e.preventDefault();auSubmit()}});
$('authv').addEventListener('click',function(e){var t=e.target.closest('[data-au]');if(!t)return;var a=t.dataset.au;
if(a=='submit'){auSubmit()}
else if(a=='tab'){AUT.mode=t.dataset.m;AUT.err='';renderAuth()}
else if(a=='eye'){var ids=['aup','aup2'],vals=ids.map(function(i){return $(i)?$(i).value:''});AUT.show=!AUT.show;AUT.err=$('auer').textContent;var snap={};['aui','aun','aum','aue'].forEach(function(i){if($(i))snap[i]=$(i).value});renderAuth();ids.forEach(function(i,k){if($(i))$(i).value=vals[k]});Object.keys(snap).forEach(function(i){if($(i))$(i).value=snap[i]})}
else if(a=='forgot'){msg(L('Password reset will be available once the server is connected','সার্ভার যুক্ত হলে পাসওয়ার্ড রিসেট চালু হবে'))}
else if(a=='home'){AU.next=null;goHome()}
else if(a=='close'){AU.next=null;NAV.back()}});
window.addEventListener('popstate',function(){var B=document.body.classList;if(B.contains('vu')&&!(history.state&&history.state.u)){closeAuth();AU.next=null;setTab(0)}});
if(LIVE){updAuthUI();liveBoot()}else nbReady();if(!LIVE)setTimeout(function(){var id=null;try{id=localStorage.getItem('nb_sess')}catch(e){}var u=id&&USERS.filter(function(x){return x.id==id})[0];if(u)loadUserData(u);else updAuthUI()},0);
function openPD(k){var p=findP(k);if(!p)return;PDS={k:k,p:p,qty:1};document.body.classList.remove('vr');document.body.classList.add('vd');renderPD();try{history.pushState({d:1},'','#product')}catch(e){}window.scrollTo(0,0)}
window.addEventListener('scroll',function(){if(!document.body.classList.contains('vd'))return;var t=document.querySelector('.pd-top');if(t)t.classList.toggle('sc',window.scrollY>60)},{passive:true});
function pdTab(t){var r=$('pdrev');if(!r)return;r.classList.toggle('ds',t=='ds');r.querySelectorAll('.pd-tab').forEach(function(x){x.classList.toggle('on',x.dataset.t==t)})}
function closePD(){document.body.classList.remove('vd','vr')}
$('pdv').addEventListener('click',function(e){var k=PDS.k;
var pq=e.target.closest('[data-pq]');if(pq){var mxq=PDS.vmax||10,nq=Math.min(mxq,Math.max(1,PDS.qty+(pq.dataset.pq=='+'?1:-1)));PDS.qty=nq;var qn=$('pdqn');if(qn)qn.textContent=nq;var qs=$('pdq');if(qs)qs.value=nq;var bb=document.querySelectorAll('[data-pq]');bb[0].disabled=nq<=1;bb[1].disabled=nq>=mxq;return}
var pv=e.target.closest('[data-pv]');if(pv){PDS.sel[+pv.dataset.pv]=+pv.dataset.o;if(PDS.vr)vrNorm(PDS,+pv.dataset.pv);pdVrUpd();return}
var tb=e.target.closest('.pd-tb');if(tb){var g=$('pdgs');g.scrollTo({left:g.clientWidth*(+tb.dataset.i),behavior:'smooth'});document.querySelectorAll('.pd-tb').forEach(function(x){x.classList.toggle('on',x==tb)});return}
var ap=e.target.closest('.pd-ap');if(ap){PCP[PDS.k]=ap.dataset.c;document.querySelectorAll('.pd-ap').forEach(function(b){var on=b.dataset.c==ap.dataset.c;b.classList.toggle('on',on);b.textContent=on?L('Applied','যুক্ত হয়েছে'):L('Apply','অ্যাপ্লাই')});msg(L('Coupon saved. It will be applied at checkout.','কুপন যুক্ত হয়েছে। অর্ডার করার সময় ছাড় পাবেন।'));return}
var cp=e.target.closest('.pd-cp');if(cp){try{navigator.clipboard.writeText(cp.dataset.c)}catch(x){}msg(L('Code copied: ','কোড কপি হয়েছে: ')+cp.dataset.c);return}
var tt=e.target.closest('.pd-tab');if(tt){pdTab(tt.dataset.t);return}
if(e.target.closest('.pd-rl')){pdTab('rv');var rv0=$('pdrev');if(rv0){window.NOCW=Date.now()+1500;rv0.scrollIntoView({behavior:'smooth',block:'start'})}return}
if(e.target.closest('.pd-vd')){pdTab('ds');var dv=$('pdrev');if(dv){window.NOCW=Date.now()+1500;dv.scrollIntoView({behavior:'smooth',block:'start'})}return}
if(e.target.closest('.pd-go')){pdTab('rv');var rv=$('pdrev');if(rv){window.NOCW=Date.now()+1500;rv.scrollIntoView({behavior:'smooth',block:'start'})}return}
if(e.target.closest('#pdva')){openRP();return}
if(e.target.closest('#pdbk2')){closePD();setTab&&setTab(0);window.scrollTo(0,0);return}
if(e.target.closest('#pdvp2')){closePD();openAll('best');return}
if(e.target.closest('#pdbk')){NAV.back();return}
if(e.target.closest('#pdsr')){closePD();closeAll();var i=document.querySelector('.search input,#q');if(i)i.focus();return}
if(e.target.closest('#pdhr')){var wk=wlK(k);PMAP[wk]=PDS.p;if(WL[wk])delete WL[wk];else WL[wk]=view;wlSave();e.target.closest('#pdhr').classList.toggle('on',!!WL[wk]);msg(WL[wk]?L('Added to wishlist','উইশলিস্টে যোগ হয়েছে'):L('Removed from wishlist','উইশলিস্ট থেকে সরানো হয়েছে'));return}
if(e.target.closest('#pdsh')){if(window.v2Share){v2Share(PDS.p);return}var t=lang=='en'?enName(PDS.p[1]):tx(PDS.p[1]);if(navigator.share){navigator.share({title:t,url:location.href}).catch(function(){})}else{try{navigator.clipboard.writeText(location.href)}catch(x){}msg(L('Link copied','লিংক কপি হয়েছে'))}return}
if(e.target.closest('#pdvp')){if(PDS.shop){var sn=PDS.shop,pk=PDS.k;closePD();openSeller(sn,false,pk)}else{closePD();openAll('best')}return}
if(e.target.closest('#pdbn')){if(window.innerWidth<900){if(PDS.vr)pdVrSave();atcOpen(k,'buy');return}pdVrSave();atcOpen(k,'buy',2,{sel:PDS.sel,q:PDS.qty});return}
if(e.target.closest('#pdad')&&window.innerWidth<900){if(PDS.vr)pdVrSave();atcOpen(k);return}
if(e.target.closest('#pdad')){pdVrSave();FC.last=k;cart[k]=PDS.qty;cnt();e.target.closest('#pdad').classList.add('done');e.target.closest('#pdad').textContent='✓ '+L('Added','যোগ হয়েছে');msg(L('Added to cart','কার্টে যোগ হয়েছে'));return}
if(e.target.closest('#pdbn')){pdVrSave();cart[k]=PDS.qty;cnt();msg(L('Added to cart – checkout is coming soon','কার্টে যোগ হয়েছে – চেকআউট শীঘ্রই আসছে'));return}});
$('pdv').addEventListener('change',function(e){if(e.target.id=='pdq')PDS.qty=+e.target.value});
window.addEventListener('popstate',function(){var B=document.body.classList;if(B.contains('vr')){B.remove('vr');return}if(B.contains('vd'))closePD()});

/* ===== ALL SHOPS ===== */
var SHS={q:'',k:'all'};
var SKC={food:['Restaurant'],grocery:['Grocery Store','Vegetables','Fruits'],med:['Medicine'],elec:['Electronics','Electrical Shop'],meat:['Meat'],fish:['Fish']};
function shIn(x,i){var n=CDS.min.en[i].n;if(LIVEONLY)return V.min.hot.concat(V.min.best).some(function(p){return p[8]==='L'&&p[12]===n&&LSHOP[enName(p[1])]===x[0]});return (SKC[x[2]]||[]).indexOf(n)>-1}
function renderShv(){
var b=lang=='bn',q=SHS.q.trim().toLowerCase();
$('shvh').textContent=L('All Shops','সব দোকান');$('shvq').placeholder=L('Search shop or owner name','দোকান বা মালিকের নাম লিখুন');
var base=SH.filter(function(x){return !q||(x[0]+' '+x[1]).toLowerCase().indexOf(q)>-1});
var CT=CDS.min[lang];
$('shvch').innerHTML='<button class="shv-c'+(SHS.k=='all'?' on':'')+'" data-k="all">'+L('All','সব')+'<i>'+base.length+'</i></button>'+CT.map(function(c,i){var n=base.filter(function(x){return shIn(x,i)}).length;return '<button class="shv-c'+(SHS.k==i?' on':'')+(n?'':' z')+'" data-k="'+i+'">'+c.n+'<i>'+n+'</i></button>'}).join('');
var L2=base.filter(function(x){return SHS.k=='all'||shIn(x,+SHS.k)});
$('shvn').textContent=L2.length+' '+L(L2.length==1?'shop':'shops','টি দোকান');
$('shvg').innerHTML=L2.length?L2.map(shopCard).join(''):'<div class="shv-e"><div>'+uic('store')+'</div><p>'+L('No shops found','কোনো দোকান পাওয়া যায়নি')+'</p></div>'}
$('shvq').addEventListener('input',function(){SHS.q=this.value;renderShv()});
$('shvch').addEventListener('click',function(e){var c=e.target.closest('.shv-c');if(!c)return;SHS.k=c.dataset.k=='all'?'all':+c.dataset.k;renderShv()});
$('shvg').addEventListener('click',function(e){var h=e.target.closest('.hr');if(h){var n=h.dataset.n;if(LIVE&&LSTO[n]){flToggle(n);return}FAV[n]=!FAV[n];h.classList.toggle('f',FAV[n])}});
$('shvbk').onclick=function(){NAV.back()};
function openShops(){closeAll();closeProf();closeOrd();closeShops();closePD();if(window.cpS&&cpS.o)closeCP();SHS={q:'',k:'all'};$('shvq').value='';document.body.classList.add('vs');renderShv();try{history.pushState({s:1},'','#shops')}catch(e){}window.scrollTo(0,0)}
function closeShops(){document.body.classList.remove('vs');if(window.closeWish)closeWish();if(window.closeCart)closeCart();if(window.closeAuth)closeAuth();if(window.closeAdm)closeAdm();if(window.closeNtfP)closeNtfP();if(window.closeSeller)closeSeller();if(window.closeHist)closeHist();if(window.closeCats)closeCats()}
$('shopall').addEventListener('click',function(e){e.preventDefault();openShops()});

/* ===== ORDERS ===== */
var ORD=[
{id:'NBM-482915',t:'m',s:'p',ago:0,step:2,eta:{en:'Arriving in about 18 minutes',bn:'আনুমানিক ১৮ মিনিটে পৌঁছাবে'},items:[['Fresh Hilsa Fish (1 kg)','তাজা ইলিশ মাছ (১ কেজি)','🐟',1800,1,'NurBuy Mart','NurBuy মার্ট'],['Farm Fresh Eggs (12 pcs)','ফার্ম ফ্রেশ ডিম (১২ পিস)','🥚',140,2,'NurBuy Mart','NurBuy মার্ট']]},
{id:'NBM-471120',t:'m',s:'d',ago:3,h:19,m:24,items:[['Premium Miniket Rice (5 kg)','প্রিমিয়াম মিনিকেট চাল (৫ কেজি)','🍚',420,1,'NurBuy Mart','NurBuy মার্ট'],['Mixed Fruit Juice (1 L)','মিক্সড ফ্রুট জুস (১ লিটার)','🧃',180,2,'NurBuy Mart','NurBuy মার্ট']]},
{id:'NBM-455871',t:'m',s:'c',ago:45,h:11,m:40,items:[['Farm Fresh Eggs (12 pcs)','ফার্ম ফ্রেশ ডিম (১২ পিস)','🥚',140,1,'NurBuy Mart','NurBuy মার্ট']]},
],ORS={q:'',rng:90,tab:'all',star:0,cur:null},ORT={};
try{ORT=JSON.parse(localStorage.getItem('nb_rate')||'{}')}catch(x){}
var ORD_DEMO=ORD;ORD=[];
var OI={box:'<path d="M4 8l8-5 8 5v10l-8 4-8-4zM4 8l8 4 8-4M12 12v10"/>',ret:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>',heart:'<path d="M12 21s-8-5.200-8-11a4.500 4.500 0 018-2.700A4.500 4.500 0 0120 10c0 5.800-8 11-8 11z"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.500-6 8-6s8 2 8 6"/>',pin:'<path d="M12 22s7-6.500 7-12a7 7 0 00-14 0c0 5.500 7 12 7 12z"/><circle cx="12" cy="10" r="2.500"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.500 9.500a2.500 2.500 0 114 2c-1 .8-1.500 1.200-1.500 2.500M12 17.500v.1"/>',truck:'<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',ok:'<circle cx="12" cy="12" r="9"/><path d="M8 12.500l3 3 5-6"/>',x:'<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>'};
function oSvg(k){return '<svg viewBox="0 0 24 24">'+OI[k]+'</svg>'}
function oDate(o){var d=new Date(Date.now()-o.ago*864e5);d.setHours(o.h||12,o.m||0,0,0);return d}
function oFmt(d){try{return d.toLocaleString(lang=='bn'?'bn-BD':'en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}catch(e){return d.toDateString()}}
function liveP(id){var r=null;if(id==null||id==='')return null;V.min.hot.concat(V.min.best).forEach(function(x){if(x[8]==='L'&&String(x[9])===String(id))r=x});return r}
function pKeyOf(p){var k='min'+(typeof p[1]=='object'?p[1].en:p[1]);PMAP[k]=p;return k}
/* Order again: the same products and quantities go back into the cart (what is no longer sold or out of stock is skipped) */
function ordAgain(o){var add=0,skip=0;o.items.forEach(function(i){var p=liveP(i[7]);if(!p){skip++;return}var en=enName(p[1]);if(LIVE&&LST[en]!=null&&+LST[en]<=0){skip++;return}var k=pKeyOf(p);delete VAR[k];
var r=vrOf(p);if(r){var v=r.v.filter(function(x){return String(x.id)===String(i[8])})[0];if(!v||+v.stock<=0){skip++;return}var g=atcGroups(en,p),A={vr:r,g:g,sel:g.map(function(x){var j=0;x.o.forEach(function(q,n){if(q.n===String((v.o||{})[x.l]))j=n});return j})};VAR[k]=vrRec(A)}
cart[k]=Math.max(1,Math.min(+i[4]||1,cLim(k)));add++});
cnt();if(!add){msg(L('These products are not available right now','এই পণ্যগুলো এখন পাওয়া যাচ্ছে না'));return}
closeOrd();openCart();msg(skip?L(add+' added, '+skip+' not available','যোগ হয়েছে '+bnN(add)+'টি, পাওয়া যায়নি '+bnN(skip)+'টি'):L('Products added to your cart','পণ্যগুলো কার্টে যোগ হয়েছে'))}
/* Review this product: opens that product's review page */
function ordReview(pid){var p=liveP(pid);if(!p){msg(L('This product is not available any more','এই পণ্যটি আর পাওয়া যাচ্ছে না'));return}openPD(pKeyOf(p));openRP()}
function oTot(o){if(o.tot!=null)return o.tot;return o.items.reduce(function(a,i){return a+i[3]*i[4]},0)}
function oMoney(n){return '৳ '+n.toLocaleString('en-US')}
function oSteps(){return [L('Order placed','অর্ডার হয়েছে'),L('Packed','প্যাক হয়েছে'),L('On the way','পথে আছে'),L('Delivered','ডেলিভারি হয়েছে')]}
function oCard(o){
var st=o.s,ic=st=='p'?'truck':st=='d'?'ok':'x',cl=st=='d'?'d':st=='c'?'c':'';
var ttl=st=='p'?(lang=='bn'?o.eta.bn:o.eta.en):st=='d'?L('Delivered on ','ডেলিভারি হয়েছে ')+oFmt(oDate(o)):L('Cancelled on ','বাতিল হয়েছে ')+oFmt(oDate(o));
var sub=st=='p'?L('Order is being delivered','অর্ডার ডেলিভারির পথে')+' · '+oVL(oVeh(o)):st=='c'?L('Refund processed to your payment method','টাকা ফেরত দেওয়া হয়েছে'):'';
var rated=ORT[o.id];
var btn=st=='p'?'<button class="ord-btn" data-oa="track" data-id="'+o.id+'">'+L('Track Order','অর্ডার ট্র্যাক করুন')+'</button>':st=='d'?'<button class="ord-btn'+(rated?' o':'')+'" data-oa="rate" data-id="'+o.id+'">'+(rated?'★ '+rated+' · '+L('Rated','রেটিং দেওয়া হয়েছে'):L('Rate Your Experience','অভিজ্ঞতা রেটিং দিন'))+'</button>':'<button class="ord-btn o" data-oa="reorder" data-id="'+o.id+'">'+L('Order again','আবার অর্ডার করুন')+'</button>';
var trk='';if(st=='p'){trk='<ol class="ord-tr">'+oSteps().map(function(t,i){return '<li class="'+(i<=o.step?'on':'')+(i==o.step?' cur':'')+'">'+(i==o.step?oVIc(o):'')+t+'</li>'}).join('')+'</ol>'}
trk+=dlvBox(o);
var its=o.items.map(function(i){return '<div class="ord-it"><div class="ord-th">'+PIC(IMG[i[0]],i[2],'','')+'</div><div class="ord-b"><small>'+esc(lang=='bn'?i[6]:i[5])+'</small><div class="ord-n">'+esc(lang=='bn'?i[1]:i[0])+'</div><div class="ord-p">'+oMoney(i[3])+'<span>× '+i[4]+'</span></div>'+(st=='d'&&i[7]?'<button class="ord-rv" data-oa="rv" data-id="'+o.id+'" data-pid="'+esc(i[7])+'">'+L('Review this product','এই পণ্যের রিভিউ দিন')+'</button>':'')+'</div></div>'}).join('');
return '<div class="ord-c"><div class="ord-ch"><div class="ord-ic '+cl+'">'+oSvg(ic)+'</div><div class="ord-st">'+esc(ttl)+(sub?'<small>'+sub+'</small>':'')+'</div>'+btn+'</div>'+(st=='p'&&o.multi>1?mshopHtml():'')+trk+its+'<div class="ord-ft"><b>'+L('Total','মোট')+': '+oMoney(oTot(o))+'</b><span class="ord-id">'+L('Order ID','অর্ডার আইডি')+' <em>'+o.id+'</em></span></div>'+(st=='d'?'<div class="ord-ac"><button class="ord-btn o" data-oa="reorder" data-id="'+o.id+'">'+L('Order again','আবার অর্ডার করুন')+'</button></div>':'')+'</div>'}

var VEHP={cycle:'<circle cx="6" cy="17" r="3.5"/><circle cx="18" cy="17" r="3.5"/><path d="M6 17l3.5-7h5.5l3 7M9.5 10L12 17l3-7M8 7.5h2.5M14 7.5l1 2.5h2"/>',bike:'<circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/><path d="M5.5 17h5l3-6.5h3.5l1.5 6.5M13.5 10.5L11 7H8.5M16.5 10.5L15.5 7.5H18"/>',car:'<path d="M3 16l1.6-5.2A2 2 0 016.5 9.4h11a2 2 0 011.9 1.4L21 16v3h-2.5v-1.5h-13V19H3z"/><circle cx="7.5" cy="15" r=".6"/><circle cx="16.5" cy="15" r=".6"/><path d="M5 13h14"/>',truck:'<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'};
function oVeh(o){var v=null;if(LIVE)v=o.veh;else try{v=localStorage.getItem('nb_veh_'+o.id)}catch(e){}v=v||o.veh||'bike';return VEHP[v]?v:'bike'}
function oVL(k){return {cycle:L('Bicycle','সাইকেল'),bike:L('Motorbike','মোটরসাইকেল'),car:L('Car','গাড়ি'),truck:L('Truck','ট্রাক')}[k]}
function oVIc(o){var k=oVeh(o);return '<s class="vmv" title="'+oVL(k)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+VEHP[k]+'</svg></s>'}

function trkFix(){document.querySelectorAll('.vmv').forEach(function(v){var li=v.parentElement,nx=li&&li.nextElementSibling;if(!nx)return;var a=li.getBoundingClientRect(),b=nx.getBoundingClientRect(),vr=v.offsetWidth/2,nr=nx.querySelector('i')?nx.querySelector('i').offsetWidth/2:6,d=Math.round((b.left+b.width/2)-(a.left+a.width/2)-vr-nr);if(d>10&&v.dataset.d!=d){v.dataset.d=d;v.style.setProperty('--vd',d+'px')}})}
(function(){var t=null,q=function(){clearTimeout(t);t=setTimeout(trkFix,60)};new MutationObserver(function(){if(document.querySelector('.vmv'))q()}).observe(document.body,{childList:true,subtree:true});window.addEventListener('resize',q)})();
function dlvBox(o){if(o.s!='p'||!o.dl||!o.dl.otp)return '';var d=o.dl,m={assigned:['Rider assigned','রাইডার ঠিক হয়েছে'],accepted:['Rider accepted your order','রাইডার অর্ডার নিয়েছেন'],going:['Rider is going to the shop','রাইডার দোকানে যাচ্ছেন'],picked:['Your order is picked up','অর্ডার তুলে নেওয়া হয়েছে'],ontheway:['Rider is on the way','রাইডার আপনার দিকে আসছেন'],arrived:['Rider has arrived','রাইডার পৌঁছে গেছেন']}[d.rstat]||['Rider assigned','রাইডার ঠিক হয়েছে'];return '<div class="dlv"><div class="dlv-t"><b>'+L(m[0],m[1])+'</b>'+(d.rider?'<small>'+esc(d.rider)+'</small>':'')+'</div><div class="dlv-c"><small>'+L('Delivery code','ডেলিভারি কোড')+'</small><b>'+esc(d.otp)+'</b></div><p>'+L('Tell this code to the rider only when you receive your order.','অর্ডার হাতে পেলে তবেই রাইডারকে এই কোডটি বলুন।')+'</p></div>'}
function renderOrdList(){
var q=ORS.q.trim().toLowerCase(),cut=ORS.rng?Date.now()-ORS.rng*864e5:0;

var base=ORD.filter(function(o){if(o.t!=('m'))return false;if(ORS.rng&&oDate(o).getTime()<cut)return false;if(!q)return true;return o.id.toLowerCase().indexOf(q)>-1||o.items.some(function(i){return (i[0]+' '+i[1]).toLowerCase().indexOf(q)>-1})});
var cnt=function(k){return base.filter(function(o){return k=='all'||o.s==k}).length};
var TB=[['all',L('All','সব')],['p',L('In Progress','চলমান')],['d',L('Completed','সম্পন্ন')],['c',L('Cancelled','বাতিল')]];
$('ordtabs').innerHTML=TB.map(function(t){return '<button class="ord-tb'+(ORS.tab==t[0]?' on':'')+'" data-oa="tab" data-k="'+t[0]+'">'+t[1]+'<i>'+cnt(t[0])+'</i></button>'}).join('');
var SC=[['p',L('In Progress','চলমান অর্ডার')],['d',L('Completed','সম্পন্ন')],['c',L('Cancelled','বাতিল')]],h='';
SC.forEach(function(g){if(ORS.tab!='all'&&ORS.tab!=g[0])return;var L2=base.filter(function(o){return o.s==g[0]});if(!L2.length)return;h+='<div class="ord-sec"><h3>'+g[1]+'</h3>'+L2.map(oCard).join('')+'</div>'});
$('ordlist').innerHTML=h||'<div class="ord-empty"><div>'+uic('box')+'</div><p>'+L('No orders found','কোনো অর্ডার পাওয়া যায়নি')+'</p></div>'}
function renderOrd(){
var P=PROF,fn=(P.name||'').trim().split(/\s+/)[0]||'',ini=(P.name||'?').trim().split(/\s+/).slice(0,2).map(function(w){return w.charAt(0)}).join('').toUpperCase();
var mi=function(k,lb,a,on){return '<button'+(on?' class="on"':'')+' data-oa="'+a+'">'+oSvg(k)+lb+'</button>'};
$('ordside').innerHTML='<div class="ord-su"><div class="ord-av"><div class="ord-ai">'+(P.avatar?'<img src="'+esc(P.avatar)+'" alt="">':esc(ini))+'</div><div class="ord-au"><b>'+L('Hello, ','হ্যালো, ')+esc(fn)+'!</b><span>'+esc(P.email)+'</span></div></div><div class="ord-pm"><svg viewBox="0 0 24 24"><path d="M3 8l4.500 4L12 5l4.500 7L21 8l-2 11H5z"/></svg>'+L('Premium Account','প্রিমিয়াম অ্যাকাউন্ট')+'</div></div>'
+'<div class="ord-mn">'+mi('box',L('Orders','অর্ডার'),'none',1)+mi('ret',L('Returns','রিটার্ন'),'soon')+mi('heart',L('Wishlist','উইশলিস্ট'),'wish')+'</div>'
+'<div class="ord-cap">'+L('MY ACCOUNT','আমার অ্যাকাউন্ট')+'</div><div class="ord-mn">'+mi('user',L('Profile','প্রোফাইল'),'prof')+mi('pin',L('Addresses','ঠিকানা'),'prof')+mi('help',L('Help & Support','সাহায্য ও সাপোর্ট'),'soon')+'</div>';
$('ordh').innerHTML=L('Orders','অর্ডার')+'<span class="ord-mode '+('m')+'">'+(uic('bolt')+' '+L('Minutes','মিনিটস'))+'</span>';
$('ordov').innerHTML='';$('ordq').placeholder=L('Find Items','পণ্য খুঁজুন');
$('ordr').innerHTML=[[90,L('Last 3 months','গত ৩ মাস')],[180,L('Last 6 months','গত ৬ মাস')],[365,L('Last 1 year','গত ১ বছর')],[0,L('All time','সব সময়')]].map(function(r){return '<option value="'+r[0]+'"'+(ORS.rng==r[0]?' selected':'')+'>'+r[1]+'</option>'}).join('');
renderOrdList()}
$('ordq').addEventListener('input',function(){ORS.q=this.value;renderOrdList()});
$('ordr').addEventListener('change',function(){ORS.rng=+this.value;renderOrdList()});
$('ordv').addEventListener('click',function(e){var t=e.target.closest('[data-oa]');if(e.target.closest('#ordbk')){NAV.back();return;if(0){window.scrollTo(0,0)}return}
if(!t)return;var a=t.dataset.oa,o=ORD.filter(function(x){return x.id==t.dataset.id})[0];
if(a=='tab'){ORS.tab=t.dataset.k;renderOrdList()}
else if(a=='prof'){closeOrd();closeShops();closePD();openProf()}
else if(a=='wish'){openWish()}
else if(a=='soon')msg(L('Coming soon','শীঘ্রই আসছে'))
else if(a=='reorder'&&o)ordAgain(o)
else if(a=='rv')ordReview(t.dataset.pid)
else if(a=='track'&&o){var S=oSteps();pmOpen(L('Order ','অর্ডার ')+o.id,'<p><b>'+esc(lang=='bn'?o.eta.bn:o.eta.en)+'</b></p>'+(o.s=='p'&&o.v2&&window.v2EtaBox?v2EtaBox(o.v2):'')+(o.multi>1?mshopHtml():'')+(o.trk?'<p>'+L('Tracking ID','ট্র্যাকিং আইডি')+': <b>'+o.trk+'</b></p>':'')+'<ul class="ord-tl">'+S.map(function(x,i){return '<li class="'+(i<=o.step?'on':'')+'">'+x+'</li>'}).join('')+'</ul>',null)}
else if(a=='rate'&&o){ORS.cur=o.id;ORS.star=ORT[o.id]||0;pmOpen(L('Rate Your Experience','অভিজ্ঞতা রেটিং দিন'),'<p>'+L('How was your order?','আপনার অর্ডারটি কেমন ছিল?')+'</p><div class="ord-stars" id="ordst">'+[1,2,3,4,5].map(function(n){return '<button data-v="'+n+'" class="'+(n<=ORS.star?'on':'')+'" aria-label="'+n+'">★</button>'}).join('')+'</div>',function(){if(!ORS.star)return L('Please select a rating','রেটিং বেছে নিন');ORT[ORS.cur]=ORS.star;try{localStorage.setItem('nb_rate',JSON.stringify(ORT))}catch(x){}renderOrdList();return ''})}});
$('pmb').addEventListener('click',function(e){var lo=e.target.closest('.lgo');if(lo){setLang(lo.dataset.lg);pmClose();return}var b=e.target.closest('#ordst button');if(!b)return;ORS.star=+b.dataset.v;this.querySelectorAll('#ordst button').forEach(function(x){x.classList.toggle('on',+x.dataset.v<=ORS.star)})});
function openOrd(){if(authGate('ord'))return;closeAll();closeProf();closeShops();closePD();if(window.cpS&&cpS.o)closeCP();document.body.classList.add('vo');renderOrd();try{history.pushState({o:1},'','#orders')}catch(e){}window.scrollTo(0,0);setTab(3)}
function closeOrd(){document.body.classList.remove('vo');pmClose()}
$('dord').onclick=function(){openOrd()};

document.addEventListener('keydown',function(e){if(e.key=='Escape')pmClose()});
if(typeof render=='function')render(view);
var lastDev=dev();window.addEventListener('resize',function(){var n=dev();if(n!==lastDev){lastDev=n;render(view)}});
setLang(lang);


/* ===== SUPPORT CHAT (customer widget + admin inbox) =====
   Front-end demo: conversations live in localStorage and sync across tabs with BroadcastChannel.
   To go live, replace load()/save() with WebSocket/REST calls to your backend. */
(function(){
var CHK='nb_chat_v1',BC=null;if(!LIVE)try{BC=new BroadcastChannel('nb_chat')}catch(e){}
var S={convs:[],agents:[{id:'a1',name:'Sara Ahmed',online:true},{id:'a2',name:'Rafi Hasan',online:true}]};
var uid=function(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)};
function load(){if(LIVE)return;try{var s=JSON.parse(localStorage.getItem(CHK)||'null');if(s&&s.convs)S=s}catch(e){}}
function persist(){if(LIVE){saveCache();return}try{localStorage.setItem(CHK,JSON.stringify(S))}catch(e){}try{BC&&BC.postMessage(1)}catch(e){}}
function save(){persist();sync()}
load();
if(BC)BC.onmessage=function(){load();sync()};
window.addEventListener('storage',function(e){if(e.key==CHK){load();sync()}});
var C={open:false,min:false,cur:null,hist:false,bt:false,rec:null,tt:0};
var A={on:false,auth:false,me:'a1',f:'all',q:'',cur:null,mob:'list',tt:0};
var prevC=0,prevA=0,titleBase=document.title;
function gid(){try{var g=localStorage.getItem('nb_gid');if(!g){g='g_'+uid();localStorage.setItem('nb_gid',g)}return g}catch(e){return C._g||(C._g='g_'+uid())}}
function me(){return AU.uid||gid()}
function mine(){return S.convs.filter(function(c){return c.cid==me()}).sort(function(a,b){return b.updated-a.updated})}
function cur(){var l=mine();if(C.cur){var f=l.filter(function(c){return c.id==C.cur})[0];if(f)return f}var f2=l.filter(function(c){return c.status!='resolved'})[0]||null;if(LIVE&&f2)C.cur=f2.id;return f2}
function conv(mk){var c=cur();if(c&&c.status!='resolved')return c;if(!mk)return null;
var nm=AU.uid&&PROF.name?PROF.name:'Guest';c={id:'c'+uid(),cid:me(),name:nm,phone:AU.uid?PROF.mobile:'',email:AU.uid?PROF.email:'',reg:!!AU.uid,mode:'bot',status:'open',assignee:'',unreadC:0,unreadA:0,msgs:[],product:null,orderId:'',await:'',created:Date.now(),updated:Date.now()};
S.convs.push(c);C.cur=c.id;add(c,{from:'b',k:'t',t:welcomeT()});return c}
function welcomeT(){return L('Hello! Welcome to NurBuy. How can we help you today?','হ্যালো! NurBuy-তে স্বাগতম। আজ আমরা আপনাকে কীভাবে সাহায্য করতে পারি?')}
function viewing(c){return C.open&&!C.min&&!C.hist&&cur()&&cur().id==c.id&&document.visibilityState!='hidden'}
function add(c,m){if(LIVE)c=redirOf(c);m.id=uid();m.ts=Date.now();if(m.from=='c')m.st=c.mode=='bot'?'read':'sent';c.msgs.push(m);c.updated=m.ts;
if(m.from=='c')c.unreadA=(c.unreadA||0)+(c.mode=='bot'?0:1);
else if(m.from!='s'&&!viewing(c))c.unreadC=(c.unreadC||0)+1;if(m.from=='a'&&!viewing(c)&&window.NBN)NBN.support(c,m);if(LIVE&&m.from!='a')qPost(c,m);return m}
function agentOnline(){return S.agents.some(function(a){return a.online})}
function agentBy(id){return S.agents.filter(function(a){return a.id==id})[0]}
function fmtT(ts){return new Date(ts).toLocaleTimeString(lang=='en'?'en-GB':'bn-BD',{hour:'2-digit',minute:'2-digit'})}
function fmtD(ts){var d=new Date(ts),n=new Date();if(d.toDateString()==n.toDateString())return L('Today','আজ');var y=new Date(n-864e5);if(d.toDateString()==y.toDateString())return L('Yesterday','গতকাল');return d.toLocaleDateString(lang=='en'?'en-GB':'bn-BD',{day:'numeric',month:'short',year:'numeric'})}
function ini(n){return (n||'?').trim().split(/\s+/).slice(0,2).map(function(w){return w.charAt(0)}).join('').toUpperCase()}
function beep(){try{var a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=880;g.gain.value=.05;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.14)}catch(e){}}
function osNotify(t,b){try{if('Notification' in window&&Notification.permission=='granted'&&document.visibilityState=='hidden')new Notification(t,{body:b})}catch(e){}}
var ICO={chat:'<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 01-11.600 7.100L4 20l1-4.400A8 8 0 1121 12z"/></svg>',min:'<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',hist:'<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 109-9 9 9 0 00-6.400 2.700L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>',img:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.800"/><path d="M21 16l-5-5-8 9"/></svg>',mic:'<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>',send:'<svg viewBox="0 0 24 24" class="f"><path d="M3 20l18-8L3 4v6l11 2-11 2z"/></svg>',back:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',tick:'<svg viewBox="0 0 24 24" class="tk"><path d="M5 12.500l4 4L19 7"/></svg>',tick2:'<svg viewBox="0 0 28 24" class="tk"><path d="M2 12.500l4 4L16 7M10 15l2 1.500L22 7"/></svg>',plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',trash:'<svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg>'};
var LOGO='<svg viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#fff"/><path d="M9 12h14l-1 12H10z" fill="none" stroke="#1d2fe0" stroke-width="2.200" stroke-linejoin="round"/><path d="M12.500 12v-1a3.500 3.500 0 017 0v1" fill="none" stroke="#1d2fe0" stroke-width="2.200"/></svg>';
/* ---- order lookup ---- */
function oFind(id){id=(id||'').trim().toUpperCase().replace(/\s+/g,'');var a=id.replace(/^NBM(\d)/,'NBM-$1');var all=(window.ORD||[]).concat(window.ORD_DEMO||[]);return all.filter(function(o){return o.id==id||o.id==a})[0]||null}
function oStage(o){return o.s=='c'?-1:o.s=='d'?4:Math.min(3,(o.step||0)+1)}
var OST=['Pending','Confirmed','Processing','Shipped','Delivered'];
function oTotal(o){return o.items.reduce(function(a,i){return a+i[3]*i[4]},0)}
function orderM(o){var st=oStage(o);return{id:o.id,t:o.t,stage:st,label:st<0?'Cancelled':OST[st],total:oTotal(o),n:o.items.length,ago:o.ago}}
/* ---- catalog search ---- */
function catSearch(q){q=q.toLowerCase().trim();if(q.length<2)return[];var out=[],seen={};['min'].forEach(function(v){V[v].hot.concat(V[v].best).forEach(function(p){var n=enName(p[1]);if(n.toLowerCase().indexOf(q)>-1&&!seen[n]){seen[n]=1;out.push({v:v,p:p,n:n})}})});return out.slice(0,3)}
/* ---- product context ---- */
function curProd(){if(!document.body.classList.contains('vd')||!PDS.p)return null;var p=PDS.p;return{name:enName(p[1]),emoji:p[0],price:p[3],k:PDS.k,link:location.href.split('#')[0]+'#product/'+encodeURIComponent(PDS.k)}}
/* ======================= CUSTOMER WIDGET ======================= */
var QH=[['track','Track My Order','আমার অর্ডার ট্র্যাক'],['delivery','Order & Delivery','অর্ডার ও ডেলিভারি'],['product','Product Information','পণ্যের তথ্য'],['payment','Payment Problem','পেমেন্ট সমস্যা'],['refund','Return & Refund','রিটার্ন ও রিফান্ড'],['avail','Product Availability','পণ্য আছে কি না'],['agent','Talk to Support Agent','সাপোর্ট এজেন্টের সাথে কথা']];
function logoH(){var f=window.NB_FAV;return f?'<img src="'+esc(f)+'" alt="">':LOGO}
window.NBChatLogo=function(){var l=document.querySelector('.cw-lg');if(l)l.innerHTML=logoH()};
function chipL(id){if(id=='ask')return L('Ask about this product','এই পণ্য সম্পর্কে জিজ্ঞাসা করুন');var q=QH.filter(function(x){return x[0]==id})[0];return q?L(q[1],q[2]):id}
function build(){if($('cwx'))return;var w=$('chatw');w.innerHTML='<div class="cwk" id="cwx" role="dialog" aria-label="NurBuy Support"><div class="cw-h"><span class="cw-lg">'+logoH()+'</span><div class="cw-t"><b>NurBuy Support</b><small id="cwst"></small></div><button class="cw-ib" data-cw="hist" id="cwhb" aria-label="History">'+ICO.hist+'</button><button class="cw-ib" data-cw="min" aria-label="Minimize">'+ICO.min+'</button><button class="cw-ib" data-cw="close" aria-label="Close">'+ICO.x+'</button></div><div class="cw-cx" id="cwcx"></div><div class="cw-b" id="cwb"></div><div class="cw-hp" id="cwhp"></div><div class="cw-f" id="cwf"><div class="cw-rec" id="cwrec" style="display:none"></div><div class="cw-in" id="cwin"><button class="cw-ib dk" data-cw="img" aria-label="Attach image">'+ICO.img+'</button><input type="file" id="cwfile" accept="image/*,.heic,.heif" hidden><input type="file" id="cwaud" accept="audio/*" hidden><input id="cwi" autocomplete="off"><button class="cw-ib dk" data-cw="mic" id="cwmic" aria-label="Voice message">'+ICO.mic+'</button><button class="cw-sd" data-cw="send" aria-label="Send">'+ICO.send+'</button></div></div></div><button class="cw-pill" id="cwpill" data-cw="restore"><span>'+ICO.chat+'</span><b>NurBuy Support</b><i id="cwpb"></i></button>'}
function openC(){build();adopt();if(LIVE)schedPoll(0);C.open=true;C.min=false;C.hist=false;var c=cur();if(c)seen(c);rC();setTimeout(function(){var i=$('cwi');if(i&&innerWidth>=900)i.focus()},300)}
function adopt(){if(LIVE){ownerCheck();return}if(AU.uid){var ch=false;S.convs.forEach(function(c){if(c.cid==gid()){c.cid=AU.uid;c.reg=true;c.name=PROF.name||c.name;c.phone=c.phone||PROF.mobile;c.email=PROF.email;ch=true}});if(ch)persist()}}
function seen(c){var had=c.unreadC||c.srvU;if(c.unreadC){c.unreadC=0;persist()}if(window.NBN)NBN.readKey('sup_'+c.id);if(LIVE&&c.sid&&had){c.srvU=0;c.rdp=1;chApi('POST','/chat/read',{conv:c.sid}).then(function(){c.rdp=0},function(){c.rdp=0})}}
function closeC(){C.open=false;C.min=false;document.body.classList.remove('cw-o');var e=$('cwx');if(e)e.classList.remove('o');var p=$('cwpill');if(p)p.classList.remove('o');upBadge()}
function upBadge(){var n=mine().reduce(function(a,c){return a+(c.unreadC||0)},0);document.querySelectorAll('.msgr').forEach(function(b){var i=b.querySelector('.cw-bd');if(!i){i=document.createElement('i');i.className='cw-bd';b.appendChild(i)}i.textContent=n>9?'9+':n;i.style.display=n?'':'none'});var pb=$('cwpb');if(pb){pb.textContent=n;pb.style.display=n?'':'none'}return n}
function stHTML(m){if(m.from!='c')return '';var s=m.st;return '<span class="cw-tk '+(s=='read'?'r':'')+'">'+(s=='sent'?ICO.tick:ICO.tick2)+'</span>'}
function msgH(m,i,list,c,last){var h='',ctx=(i==0||new Date(list[i-1].ts).toDateString()!=new Date(m.ts).toDateString())?'<div class="cw-dy"><span>'+fmtD(m.ts)+'</span></div>':'';
var body='';
if(m.k=='img')body='<img class="cw-im" src="'+m.src+'" alt="">';
else if(m.k=='aud')body='<audio controls preload="metadata" src="'+m.src+'"></audio>';
else if(m.k=='prod')body='<div class="cw-pc"><span>'+esc(m.p.emoji||'🛍')+'</span><div><b>'+esc(m.p.name)+'</b><small>'+pdMoney(m.p.price)+'</small><a href="'+esc(m.p.link)+'" target="_blank" rel="noopener">'+esc(m.p.link.replace(/^https?:\/\//,'').slice(0,34))+'…</a></div></div><div class="cw-pt">'+esc(m.t||'')+'</div>';
else if(m.k=='ord'){var o=m.o,st=o.stage;body='<div class="cw-oc"><div class="cw-oh"><b>#'+esc(o.id)+'</b><span class="cw-os cs'+(st<0?'x':st==4?'d':'p')+'">'+L(o.label,{Pending:'পেন্ডিং',Confirmed:'কনফার্মড',Processing:'প্রসেসিং',Shipped:'শিপড',Delivered:'ডেলিভারড',Cancelled:'বাতিল'}[o.label])+'</span></div>'+(st<0?'<div class="cw-ox">'+L('This order was cancelled.','এই অর্ডারটি বাতিল হয়েছে।')+'</div>':'<div class="cw-sp">'+OST.map(function(s,j){return '<i class="'+(j<=st?'on':'')+'"><u></u><em>'+L(s,{Pending:'পেন্ডিং',Confirmed:'কনফার্মড',Processing:'প্রসেসিং',Shipped:'শিপড',Delivered:'ডেলিভারড'}[s])+'</em></i>'}).join('')+'</div>')+'<div class="cw-om">'+o.n+' '+L(o.n==1?'item':'items','টি পণ্য')+' · '+pdMoney(o.total)+'</div></div>'}
else if(m.k=='nf')body='<div class="cw-nf">'+esc(m.t)+'</div>';
else body='<span class="cw-tx">'+(LIVE?lk(esc(m.t)):esc(m.t)).replace(/\n/g,'<br>')+'</span>';
if(m.from=='s')return ctx+'<div class="cw-sy"><span>'+esc(m.t)+'</span></div>';
var me_=m.from=='c',who=m.from=='a'?(m.an||'Agent'):'NurBuy Bot';
var chips='';if(m.chips&&last&&c.mode=='bot'&&c.status!='resolved')chips='<div class="cw-ch">'+m.chips.map(function(x){return '<button data-cw="chip" data-id="'+x+'">'+esc(chipL(x))+'</button>'}).join('')+'</div>';
return ctx+'<div class="cw-m '+(me_?'me':'th')+'">'+(me_?'':'<span class="cw-av '+(m.from=='a'?'ag':'bt')+'">'+(m.from=='a'?esc(ini(who)):logoH())+'</span>')+'<div class="cw-bw">'+(me_?'':'<small class="cw-wn">'+esc(who)+'</small>')+'<div class="cw-bu">'+body+'</div><div class="cw-mt">'+fmtT(m.ts)+stHTML(m)+'</div>'+chips+'</div></div>'}
function rHead(){var on=agentOnline(),s=$('cwst');if(s)s.innerHTML='<i class="cw-dot '+(on?'on':'')+'"></i>'+(on?L('Online','অনলাইন'):L('Offline','অফলাইন'));var hb=$('cwhb');if(hb)hb.style.display=AU.uid?'':'none'}
function rC(){if(!C.open)return;build();var c=cur(),w=$('cwx');if(c&&!C.min&&!C.hist&&window.NBN)NBN.readKey('sup_'+c.id);w.classList.add('o');w.classList.toggle('min',C.min);document.body.classList.add('cw-o');$('cwpill').classList.toggle('o',C.min);rHead();
if(C.hist){rHist();return}
$('cwhp').style.display='none';$('cwb').style.display='';
// product context bar
var pr=curProd(),cx=$('cwcx');if(pr&&(!c||c.status!='resolved')){cx.style.display='';cx.innerHTML='<span>'+esc(pr.emoji||'🛍')+'</span><div><small>'+L('You are viewing','আপনি দেখছেন')+'</small><b>'+esc(pr.name)+'</b></div><button data-cw="ask">'+L('Ask about this product','এই পণ্য সম্পর্কে জিজ্ঞাসা')+'</button>'}else cx.style.display='none';
var msgs=c?c.msgs:[{from:'b',k:'t',t:welcomeT(),ts:Date.now()}];
if(c&&c.msgs.length==1&&c.mode=='bot')delete c.msgs[0].chips;
var h=msgs.map(function(m,i){return msgH(m,i,msgs,c||{mode:'bot'},i==msgs.length-1)}).join('');
if(c&&c.mode=='agent'&&c.typA&&Date.now()-c.typA<5000)h+='<div class="cw-m th"><span class="cw-av ag">'+esc(ini((agentBy(c.assignee)||{name:'A'}).name))+'</span><div class="cw-bw"><div class="cw-bu cw-ty"><i></i><i></i><i></i></div></div></div>';
if(C.bt)h+='<div class="cw-m th"><span class="cw-av bt">'+logoH()+'</span><div class="cw-bw"><div class="cw-bu cw-ty"><i></i><i></i><i></i></div></div></div>';
if(c&&c.mode=='agent'&&c.assignee){}
if(C.offF)h+=offForm();
var b=$('cwb'),atEnd=b.scrollHeight-b.scrollTop-b.clientHeight<80;b.innerHTML=h;if(atEnd||C.stick){b.scrollTop=b.scrollHeight;C.stick=false}
// composer state
var f=$('cwf'),res=c&&c.status=='resolved',off=c&&c.mode=='offline'&&c.status!='resolved';
if(res){f.innerHTML='<div class="cw-rs">'+L('This conversation is resolved.','এই কথোপকথনটি সমাধান হয়েছে।')+' <button data-cw="new">'+L('Start new chat','নতুন চ্যাট শুরু করুন')+'</button></div>';C.fk='r'}
else if(C.offF||off){f.innerHTML='<div class="cw-rs">'+(off?L('We will contact you soon on the number you gave.','আপনার দেওয়া নম্বরে আমরা শীঘ্রই যোগাযোগ করব।'):L('Fill the form above to leave your message.','উপরের ফর্ম পূরণ করে বার্তা রেখে যান।'))+'</div>';C.fk='o'}
else{if(C.fk!='i'){f.innerHTML='<div class="cw-rec" id="cwrec" style="display:none"></div><div class="cw-in" id="cwin"><button class="cw-ib dk" data-cw="img" aria-label="Attach image">'+ICO.img+'</button><input type="file" id="cwfile" accept="image/*,.heic,.heif" hidden><input type="file" id="cwaud" accept="audio/*" hidden><input id="cwi" autocomplete="off"><button class="cw-ib dk" data-cw="mic" id="cwmic" aria-label="Voice message">'+ICO.mic+'</button><button class="cw-sd" data-cw="send" aria-label="Send">'+ICO.send+'</button></div>';C.fk='i'}
var inp=$('cwi');inp.placeholder=c&&c.await=='order'?L('Enter your Order ID (e.g. NBM-482915)','অর্ডার আইডি লিখুন (যেমন NBM-482915)'):c&&c.await=='avail'?L('Type the product name…','পণ্যের নাম লিখুন…'):L('Type a message…','বার্তা লিখুন…');
var mic=$('cwmic');if(mic)mic.style.display=''}
upBadge()}
function offForm(){return '<div class="cw-m th"><span class="cw-av bt">'+logoH()+'</span><div class="cw-bw"><div class="cw-bu cw-fm"><p>'+L('Our support team is currently offline. Please leave your message and we will contact you as soon as possible.','আমাদের সাপোর্ট টিম এই মুহূর্তে অফলাইনে আছে। অনুগ্রহ করে আপনার বার্তা রেখে যান, আমরা যত দ্রুত সম্ভব যোগাযোগ করব।')+'</p><input id="ofn" placeholder="'+L('Your name','আপনার নাম')+'" value="'+esc(AU.uid?PROF.name:'')+'"><input id="ofp" inputmode="tel" placeholder="'+L('Phone number (01XXXXXXXXX)','ফোন নম্বর (01XXXXXXXXX)')+'" value="'+esc(AU.uid?PROF.mobile:'')+'"><textarea id="ofm" rows="3" placeholder="'+L('Your message','আপনার বার্তা')+'"></textarea><div class="cw-fe" id="ofe"></div><button data-cw="offsend">'+L('Send message','বার্তা পাঠান')+'</button></div></div></div>'}
function rHist(){var l=mine();$('cwb').style.display='none';$('cwcx').style.display='none';var hp=$('cwhp');hp.style.display='';
hp.innerHTML='<div class="cw-hh"><button class="cw-ib" data-cw="hback">'+ICO.back+'</button><b>'+L('Previous conversations','আগের কথোপকথন')+'</b><button class="cw-nw" data-cw="new">'+ICO.plus+' '+L('New','নতুন')+'</button></div>'+(l.length?l.map(function(c){var lm=c.msgs.filter(function(m){return m.k!='nf'}).slice(-1)[0],tx=lm?(lm.k=='img'?L('Photo','ছবি'):lm.k=='aud'?L('Voice message','ভয়েস মেসেজ'):lm.k=='prod'?lm.p.name:lm.k=='ord'?'#'+lm.o.id:lm.t):'';return '<button class="cw-hi" data-cw="hopen" data-id="'+c.id+'"><span class="cw-av ag">'+ICO.chat+'</span><div><b>'+(c.mode=='agent'?L('Live support chat','লাইভ সাপোর্ট চ্যাট'):c.mode=='offline'?L('Offline message','অফলাইন বার্তা'):L('Help chat','হেল্প চ্যাট'))+'<em class="'+c.status+'">'+(c.status=='resolved'?L('Resolved','সমাধান'):L('Open','চলমান'))+'</em></b><small>'+esc((tx||'').slice(0,60))+'</small></div><i>'+fmtD(c.updated)+'</i></button>'}).join(''):'<p class="cw-he">'+L('No previous conversations yet.','এখনো কোনো আগের কথোপকথন নেই।')+'</p>');
$('cwf').style.display='none'}
/* --- actions --- */
function botSay(c,t,chips,extra){C.bt=true;C.stick=true;rC();setTimeout(function(){C.bt=false;var m={from:'b',k:t.k||'t',t:(typeof t=='string'?t:t.t||'')};if(t.o)m.o=t.o;if(chips)m.chips=chips;if(extra)for(var k in extra)m[k]=extra[k];add(c,m);C.stick=true;save()},650)}
function userSay(c,m){var r=add(c,m);C.stick=true;persist();return r}
function showF(){var f=$('cwf');if(f)f.style.display='';}
function qh(id){var c=conv(true);C.hist=false;showF();
if(id=='agent'){userSay(c,{from:'c',k:'t',t:chipL('agent')});return talkAgent(c)}
if(id=='ask'){var pr=curProd();if(!pr)return;return askProd(c,pr)}
userSay(c,{from:'c',k:'t',t:chipL(id)});c.await='';
var T={track:function(){c.await='order';botSay(c,L('Sure! Please type your Order ID below (for example NBM-482915).','অবশ্যই! নিচে আপনার অর্ডার আইডি লিখুন (যেমন NBM-482915 বা NBX-91820)।'),['agent'])},
delivery:function(){botSay(c,L('Orders arrive from local shops within the delivery time shown for your area. You can follow the countdown on the Orders page.','অর্ডার লোকাল দোকান থেকে আপনার এলাকার জন্য দেখানো সময়ের মধ্যে পৌঁছায়। অর্ডার পেজে কাউন্টডাউন দেখতে পাবেন।'),['track','agent'])},
product:function(){var pr=curProd();botSay(c,L('Tell us the product name and what you want to know. If you are viewing a product, tap "Ask about this product".','পণ্যের নাম ও কী জানতে চান লিখুন। কোনো পণ্য দেখলে "এই পণ্য সম্পর্কে জিজ্ঞাসা করুন" চাপুন।'),(pr?['ask']:[]).concat(['avail','agent']))},
payment:function(){botSay(c,L('We accept bKash, Nagad, cards and Cash on Delivery. If money was deducted but the order failed, it is refunded within 3–5 working days. For anything else, our agents can check your payment.','আমরা bKash, Nagad, কার্ড ও ক্যাশ অন ডেলিভারি নিই। টাকা কেটে অর্ডার ব্যর্থ হলে ৩–৫ কর্মদিবসে ফেরত আসে। অন্য সমস্যায় আমাদের এজেন্ট আপনার পেমেন্ট যাচাই করবেন।'),['agent','refund'])},
refund:function(){botSay(c,L('Most items can be returned within 7 days of delivery if unused and in original packaging. Refunds go to your original payment method in 5–7 working days.','অব্যবহৃত ও আসল প্যাকেজিংসহ বেশিরভাগ পণ্য ডেলিভারির ৭ দিনের মধ্যে ফেরত দেওয়া যায়। রিফান্ড ৫–৭ কর্মদিবসে আপনার পেমেন্ট মাধ্যমে ফেরত আসে।'),['track','agent'])},
avail:function(){c.await='avail';botSay(c,L('Which product are you looking for? Type its name and I will check.','কোন পণ্যটি খুঁজছেন? নাম লিখুন, আমি দেখে দিচ্ছি।'),['agent'])}};
(T[id]||function(){})();save()}
function askProd(c,pr){userSay(c,{from:'c',k:'prod',p:{name:pr.name,emoji:pr.emoji,price:pr.price,link:pr.link},t:L('I have a question about this product.','আমার এই পণ্য সম্পর্কে একটি প্রশ্ন আছে।')});c.product={name:pr.name,link:pr.link};
if(c.mode=='agent'){save();return}
c.await='';botSay(c,L('Thanks! What would you like to know about "'+pr.name+'"? Type your question, or talk to an agent.','ধন্যবাদ! "'+pr.name+'" সম্পর্কে কী জানতে চান? প্রশ্ন লিখুন অথবা এজেন্টের সাথে কথা বলুন।'),['avail','agent']);save()}
function talkAgent(c){if(c.mode=='agent'){return save()}
if(!LIVE&&!agentOnline()){C.offF=true;C.stick=true;return save()}
c.mode='agent';c.await='';add(c,{from:'s',k:'t',t:L('Connecting you to a support agent…','সাপোর্ট এজেন্টের সাথে যুক্ত করা হচ্ছে…')});C.stick=true;save();if(LIVE)return;
setTimeout(function(){var ag=S.agents.filter(function(a){return a.online}).sort(function(a,b){return S.convs.filter(function(x){return x.assignee==a.id&&x.status=='open'}).length-S.convs.filter(function(x){return x.assignee==b.id&&x.status=='open'}).length})[0];if(!ag){return}
if(!c.assignee)c.assignee=ag.id;var a2=agentBy(c.assignee)||ag;add(c,{from:'s',k:'t',t:a2.name+' '+L('joined the chat','চ্যাটে যোগ দিয়েছেন')});add(c,{from:'a',an:a2.name,k:'t',auto:1,t:L('Hi '+(c.name&&c.name!='Guest'?c.name.split(' ')[0]:'there')+', this is '+a2.name+' from NurBuy Support. How can I help you?','হ্যালো '+(c.name&&c.name!='Guest'?c.name.split(' ')[0]:'')+', আমি '+a2.name+', NurBuy সাপোর্ট থেকে। কীভাবে সাহায্য করতে পারি?')});C.stick=true;save()},1400)}
function sendTxt(t){t=(t||'').trim();if(!t)return;var c=conv(true);C.hist=false;userSay(c,{from:'c',k:'t',t:t});C.stick=true;
if(c.mode!='bot'){c.typC=0;return save()}
var idm=t.match(/\bNBM?-?\d{4,}\b/i);
if(c.await=='order'||idm){var id=idm?idm[0]:t;var o=oFind(id);c.await='';c.orderId=(o?o.id:id.toUpperCase());if(o)botSay(c,{k:'ord',t:'',o:orderM(o)},['track','agent']);else botSay(c,{k:'nf',t:L('We could not find an order with ID "'+id.toUpperCase()+'". Please check the ID'+(AU.uid?'':' or log in to your account')+', or talk to an agent.','"'+id.toUpperCase()+'" আইডির কোনো অর্ডার পাওয়া যায়নি। আইডি যাচাই করুন'+(AU.uid?'':' বা লগইন করুন')+', অথবা এজেন্টের সাথে কথা বলুন।')},['track','agent']);return save()}
if(c.await=='avail'){var r=catSearch(t);c.await='';if(r.length)botSay(c,L('Good news! Here is what we found:','সুখবর! যা পেয়েছি:')+'\n'+r.map(function(x){return '✓ '+x.n+' — '+L('In stock','স্টকে আছে')+' · ৳'+x.p[3]+' ('+L('Minutes','মিনিটস')+')'}).join('\n'),['avail','agent']);else botSay(c,L('Sorry, I could not find "'+t+'" right now. An agent can check stock for you.','দুঃখিত, "'+t+'" এখন খুঁজে পাইনি। এজেন্ট আপনার জন্য স্টক দেখে দিতে পারবেন।'),['avail','agent']);return save()}
var lo=t.toLowerCase(),intent=/track|where.*order|order status|অর্ডার.*(কোথায়|স্ট্যাটাস)|ট্র্যাক/.test(lo)?'track':/deliver|shipping|ডেলিভারি/.test(lo)?'delivery':/pay|bkash|nagad|card|পেমেন্ট|বিকাশ/.test(lo)?'payment':/refund|return|রিফান্ড|ফেরত/.test(lo)?'refund':/available|stock|আছে কি|স্টক/.test(lo)?'avail':/agent|human|support|person|এজেন্ট|সাপোর্ট/.test(lo)?'agent':/hello|hi\b|hey|হ্যালো|হাই/.test(lo)?'hi':'';
if(intent=='agent'){talkAgent(c);return}
if(intent=='hi'){botSay(c,welcomeT());return save()}
if(intent){unq(c.msgs.pop());qh(intent);return}
botSay(c,L('I am not sure I understood that. Pick a topic below or talk to a support agent.','আমি ঠিক বুঝতে পারিনি। নিচের একটি বিষয় বেছে নিন অথবা সাপোর্ট এজেন্টের সাথে কথা বলুন।'),['track','delivery','payment','agent']);save()}
function sendImg(file){if(LIVE)return liveImg(file);if(!file||!(/^image\//.test(file.type)||/\.(heic|heif)$/i.test(file.name)))return msg(L('Please choose an image file','একটি ছবির ফাইল বেছে নিন'));var r=new FileReader();r.onload=function(){var im=new Image();var raw=function(){if(file.size>2.5e6)return msg(L('Image is too large (max 2.5 MB)','ছবি অনেক বড় (সর্বোচ্চ ২.৫ MB)'));var c=conv(true);userSay(c,{from:'c',k:'img',src:r.result});if(c.mode=='bot')botSay(c,L('Thanks for the photo! Our support agent can look at it. Would you like to talk to an agent?','ছবির জন্য ধন্যবাদ! আমাদের সাপোর্ট এজেন্ট এটি দেখতে পারবেন। এজেন্টের সাথে কথা বলবেন?'),['agent','track']);save()};im.onerror=raw;im.onload=function(){var mx=900,s=Math.min(1,mx/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=Math.round(im.width*s);cv.height=Math.round(im.height*s);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);var c=conv(true);userSay(c,{from:'c',k:'img',src:cv.toDataURL('image/jpeg',.8)});if(c.mode=='bot')botSay(c,L('Thanks for the photo! Our support agent can look at it. Would you like to talk to an agent?','ছবির জন্য ধন্যবাদ! আমাদের সাপোর্ট এজেন্ট এটি দেখতে পারবেন। এজেন্টের সাথে কথা বলবেন?'),['agent','track']);save()};im.src=r.result};r.readAsDataURL(file)}
function sendAud(file){if(LIVE)return liveAud(file,0);if(!file||!/^audio\//.test(file.type))return msg(L('Please choose an audio file','একটি অডিও ফাইল বেছে নিন'));if(file.size>3e6)return msg(L('Audio is too large (max 3 MB)','অডিও ফাইল বড় (সর্বোচ্চ ৩ MB)'));var rd=new FileReader();rd.onload=function(){var c=conv(true);userSay(c,{from:'c',k:'aud',src:rd.result});if(c.mode=='bot')botSay(c,L('Thanks for your voice message! Please talk to an agent so they can listen to it.','ভয়েস মেসেজের জন্য ধন্যবাদ! এজেন্ট শুনতে পারবেন, তাই এজেন্টের সাথে কথা বলুন।'),['agent']);save()};rd.readAsDataURL(file)}
function recFallback(why){msg(why=='secure'?L('Voice recording needs a secure (HTTPS) page. It will work on your live site.','ভয়েস রেকর্ডে HTTPS পেজ লাগে। আপনার লাইভ সাইটে এটি কাজ করবে।'):why=='denied'?L('Microphone is blocked. Click the lock icon in the address bar and allow Microphone. (This preview window may block it; the live site will ask permission.)','মাইক্রোফোন ব্লক করা আছে। ঠিকানা বারের তালা আইকনে ক্লিক করে মাইক্রোফোন Allow করুন। (এই প্রিভিউ উইন্ডো ব্লক করতে পারে; লাইভ সাইটে অনুমতি চাইবে।)'):L('Voice recording is not supported in this browser.','এই ব্রাউজারে ভয়েস রেকর্ড সাপোর্ট করে না।'))}
function recStart(){if(!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder))return recFallback(window.isSecureContext===false?'secure':'unsup');navigator.mediaDevices.getUserMedia({audio:true}).then(function(st){var mr=new MediaRecorder(st),ch=[],t0=Date.now();C.rec={mr:mr,st:st,ch:ch,t0:t0,cancel:false};mr.ondataavailable=function(e){if(e.data.size)ch.push(e.data)};mr.onstop=function(){st.getTracks().forEach(function(t){t.stop()});clearInterval(C.recT);var rc=$('cwrec'),inn=$('cwin');if(rc)rc.style.display='none';if(inn)inn.style.display='';var cancel=C.rec&&C.rec.cancel;C.rec=null;if(cancel||!ch.length)return;if(LIVE){liveAud(new Blob(ch,{type:mr.mimeType||'audio/webm'}),Math.max(1,Math.round((Date.now()-t0)/1000)));return}var rd=new FileReader();rd.onload=function(){var c=conv(true);userSay(c,{from:'c',k:'aud',src:rd.result});if(c.mode=='bot')botSay(c,L('Thanks for your voice message! Please talk to an agent so they can listen to it.','ভয়েস মেসেজের জন্য ধন্যবাদ! এজেন্ট শুনতে পারবেন, তাই এজেন্টের সাথে কথা বলুন।'),['agent']);save()};rd.readAsDataURL(new Blob(ch,{type:mr.mimeType||'audio/webm'}))};mr.start();$('cwin').style.display='none';var rc=$('cwrec');rc.style.display='flex';rc.innerHTML='<button class="cw-ib" data-cw="reccancel" aria-label="Cancel">'+ICO.x+'</button><span class="cw-rd"></span><b id="cwrt">0:00</b><span class="cw-wv"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span><button class="cw-sd" data-cw="recsend" aria-label="Send voice">'+ICO.send+'</button>';C.recT=setInterval(function(){var s=Math.floor((Date.now()-t0)/1000);var e=$('cwrt');if(e)e.textContent=Math.floor(s/60)+':'+('0'+s%60).slice(-2);if(s>=90)C.rec&&C.rec.mr.stop()},500)}).catch(function(er){recFallback('denied')})}
function offSend(){var n=($('ofn').value||'').trim(),p=($('ofp').value||'').trim(),m=($('ofm').value||'').trim(),E=function(t){$('ofe').textContent=t};
if(n.length<2)return E(L('Please enter your name','আপনার নাম লিখুন'));if(!isMob(p))return E(L('Enter a valid phone number (01XXXXXXXXX)','সঠিক ফোন নম্বর দিন (01XXXXXXXXX)'));if(m.length<3)return E(L('Please write your message','আপনার বার্তা লিখুন'));
var c=conv(true);c.name=n;c.phone=normM(p);c.mode='offline';c.offline=true;c.await='';C.offF=false;userSay(c,{from:'c',k:'t',t:m});add(c,{from:'s',k:'t',t:L('Message received. We will contact you on ','বার্তা পেয়েছি। আমরা যোগাযোগ করব ')+normM(p)+L(' as soon as possible.',' নম্বরে যত দ্রুত সম্ভব।')});C.stick=true;save();msg(L('Message sent. We will contact you soon.','বার্তা পাঠানো হয়েছে। শীঘ্রই যোগাযোগ করব।'))}
/* --- customer events --- */
document.addEventListener('click',function(e){var b=e.target.closest('.ic.msgr');if(b){e.preventDefault();C.open&&!C.min?closeC():openC();return}
var t=e.target.closest('[data-cw]');if(!t||!t.closest('#chatw'))return;var a=t.dataset.cw;
if(a=='close')closeC();
else if(a=='min'){C.min=true;rC()}
else if(a=='restore'){C.min=false;var c=cur();if(c)seen(c);rC()}
else if(a=='hist'){C.hist=true;rC()}
else if(a=='hback'){C.hist=false;$('cwf').style.display='';C.fk='';rC()}
else if(a=='hopen'){C.cur=t.dataset.id;C.hist=false;C.fk='';$('cwf').style.display='';var c2=cur();if(c2)seen(c2);C.stick=true;rC()}
else if(a=='new'){C.cur=null;C.hist=false;C.offF=false;C.fk='';$('cwf').style.display='';var l=mine().filter(function(x){return x.status!='resolved'})[0];if(l){l.status='resolved';if(LIVE)l.lres=1;persist()}C.cur=null;var nc=conv(true);C.cur=nc.id;C.stick=true;save()}
else if(a=='chip')qh(t.dataset.id);
else if(a=='ask'){var pr=curProd();if(pr){var c3=conv(true);askProd(c3,pr)}}
else if(a=='send'){var i=$('cwi');if(i&&i.value.trim()){var v=i.value;i.value='';sendTxt(v)}}
else if(a=='img'){$('cwfile').click()}
else if(a=='mic'){recStart()}
else if(a=='recsend'){C.rec&&C.rec.mr.stop()}
else if(a=='reccancel'){if(C.rec){C.rec.cancel=true;C.rec.mr.stop()}}
else if(a=='offsend')offSend()});
document.addEventListener('change',function(e){if(e.target.id=='cwfile'){sendImg(e.target.files[0]);e.target.value=''}else if(e.target.id=='cwaud'){sendAud(e.target.files[0]);e.target.value=''}});
document.addEventListener('keydown',function(e){if(e.target.id=='cwi'){if(e.key=='Enter'&&!e.shiftKey){e.preventDefault();var v=e.target.value;e.target.value='';sendTxt(v)}}});
document.addEventListener('input',function(e){if(e.target.id=='cwi'){var c=cur();if(!LIVE&&c&&c.mode=='agent'&&Date.now()-C.tt>1500){C.tt=Date.now();c.typC=Date.now();persist()}}});
document.addEventListener('visibilitychange',function(){if(document.visibilityState=='visible'){var c=cur();if(C.open&&!C.min&&c)seen(c);sync()}});
/* ======================= ADMIN INBOX ======================= */
function openAdm(){if(LIVE)return;closeAll();closeProf();closeOrd();closeShops();closePD();if(window.cpS&&cpS.o)closeCP();document.body.classList.add('vm');A.on=true;rAdm();try{history.pushState({m:1},'','#admin-support')}catch(e){}window.scrollTo(0,0)}
function closeAdm(){A.on=false;document.body.classList.remove('vm')}
window.closeAdm=closeAdm;
function me2(){return agentBy(A.me)||S.agents[0]}
function rAdm(){var v=$('admv');if(!A.auth){v.innerHTML='<div class="ad-gate"><div class="ad-gc"><span class="ad-lg">'+LOGO+'</span><h2>NurBuy Support Inbox</h2><p>'+L('Sign in as a support agent','সাপোর্ট এজেন্ট হিসেবে সাইন ইন করুন')+'</p><label>'+L('Agent','এজেন্ট')+'</label><select id="adag">'+S.agents.map(function(a){return '<option value="'+a.id+'">'+esc(a.name)+'</option>'}).join('')+'</select><label>'+L('Access code','অ্যাক্সেস কোড')+'</label><input id="adpw" type="password" placeholder="admin123"><div class="ad-er" id="ader"></div><button data-ad="login">'+L('Open inbox','ইনবক্স খুলুন')+'</button><button class="ad-ln" data-ad="site">← '+L('Back to site','সাইটে ফিরুন')+'</button></div></div>';return}
if(!$('adl')){v.innerHTML='<div class="ad"><div class="ad-top" id="adtop"></div><div class="ad-bd"><aside class="ad-ls" id="adls"><div class="ad-sr"><input id="adq" placeholder="'+L('Search customer, phone or order…','কাস্টমার, ফোন বা অর্ডার খুঁজুন…')+'"></div><div class="ad-fl" id="adfl"></div><div class="ad-li" id="adl"></div></aside><section class="ad-th" id="adth"><div class="ad-tp" id="adtp"></div><div class="ad-ms" id="adms"></div><div class="ad-cm" id="adcm"><div class="ad-cn" id="adcn"></div><div class="ad-ci"><button data-ad="img" class="ad-ib" aria-label="Attach">'+ICO.img+'</button><input type="file" id="adfile" accept="image/*" hidden><textarea id="adin" rows="1" placeholder="'+L('Type your reply…','উত্তর লিখুন…')+'"></textarea><button class="ad-sn" data-ad="send" aria-label="Send">'+ICO.send+'</button></div></div></section><aside class="ad-sd" id="adsd"></aside></div><div class="adn" id="adn"></div></div>'}
rAdmParts()}
function adList(){var q=A.q.toLowerCase().trim(),l=S.convs.slice().sort(function(a,b){return b.updated-a.updated}).filter(function(c){if(A.f=='open'&&c.status!='open')return false;if(A.f=='resolved'&&c.status!='resolved')return false;if(A.f=='unassigned'&&(c.assignee||c.status=='resolved'))return false;if(A.f=='mine'&&c.assignee!=A.me)return false;if(A.f=='offline'&&!c.offline)return false;if(!q)return true;return (c.name+' '+(c.phone||'')+' '+(c.orderId||'')+' '+(c.email||'')+' '+c.msgs.map(function(m){return m.t||''}).join(' ')).toLowerCase().indexOf(q)>-1});return l}
function rAdmParts(){
var tot=S.convs.reduce(function(a,c){return a+(c.unreadA||0)},0),me_=me2();var adE=$('admv').querySelector('.ad');if(adE)adE.classList.toggle('tn',A.tab=='notif');
$('adtop').innerHTML='<button class="ad-bk" data-ad="site" aria-label="Back to site">'+ICO.back+'</button><span class="ad-lg">'+LOGO+'</span><b>'+L('Support Inbox','সাপোর্ট ইনবক্স')+'</b><div class="ad-tabs" role="tablist"><button type="button" class="ad-tab '+(A.tab!='notif'?'on':'')+'" data-ad="tab" data-t="inbox">'+L('Support','সাপোর্ট')+'</button><button type="button" class="ad-tab '+(A.tab=='notif'?'on':'')+'" data-ad="tab" data-t="notif">'+L('Notifications','নোটিফিকেশন')+'</button></div>'+(tot?'<em class="ad-tb">'+tot+'</em>':'')+'<span class="ad-sp"></span><select id="adme" aria-label="Agent">'+S.agents.map(function(a){return '<option value="'+a.id+'"'+(a.id==A.me?' selected':'')+'>'+esc(a.name)+'</option>'}).join('')+'</select><button class="ad-on '+(me_.online?'on':'')+'" data-ad="online"><i></i>'+(me_.online?L('Online','অনলাইন'):L('Offline','অফলাইন'))+'</button><button class="ad-cu" data-ad="cust">'+ICO.chat+'<span>'+L('Customer view','কাস্টমার ভিউ')+'</span></button>';
var F=[['all','All','সব'],['unassigned','Unassigned','অ্যাসাইন হয়নি'],['mine','Mine','আমার'],['open','Open','চলমান'],['resolved','Resolved','সমাধান'],['offline','Offline msgs','অফলাইন বার্তা']];
$('adfl').innerHTML=F.map(function(f){return '<button class="'+(A.f==f[0]?'on':'')+'" data-ad="flt" data-f="'+f[0]+'">'+L(f[1],f[2])+'</button>'}).join('');
var l=adList();$('adl').innerHTML=l.length?l.map(function(c){var lm=c.msgs.filter(function(m){return m.from!='s'}).slice(-1)[0],tx=lm?(lm.k=='img'?L('Photo','ছবি'):lm.k=='aud'?L('Voice','ভয়েস'):lm.k=='prod'?lm.p.name:lm.k=='ord'?'#'+lm.o.id:lm.t):'',ag=agentBy(c.assignee);return '<button class="ad-it'+(A.cur==c.id?' on':'')+'" data-ad="open" data-id="'+c.id+'"><span class="ad-av">'+esc(ini(c.name))+'</span><div><b>'+esc(c.name)+(c.reg?'<u>✓</u>':'')+'</b><small>'+esc((tx||'').slice(0,46))+'</small><div class="ad-tg">'+(c.offline?'<s class="of">'+L('Offline','অফলাইন')+'</s>':'')+(c.status=='resolved'?'<s class="rs">'+L('Resolved','সমাধান')+'</s>':'')+(c.product?'<s>🛍</s>':'')+(c.orderId?'<s>📦</s>':'')+(ag?'<s class="ag">'+esc(ag.name.split(' ')[0])+'</s>':(c.status!='resolved'?'<s class="un">'+L('Unassigned','অ্যাসাইন হয়নি')+'</s>':''))+'</div></div><div class="ad-rt"><i>'+fmtT(c.updated)+'</i>'+(c.unreadA?'<em>'+c.unreadA+'</em>':'')+'</div></button>'}).join(''):'<p class="ad-em">'+L('No conversations','কোনো কথোপকথন নেই')+'</p>';
var c=S.convs.filter(function(x){return x.id==A.cur})[0];$('admv').querySelector('.ad').classList.toggle('thr',!!c&&A.mob=='thread');
if(!c){$('adtp').innerHTML='';$('adms').innerHTML='<div class="ad-ph"><div>'+ICO.chat+'</div><p>'+L('Select a conversation to start replying','উত্তর দিতে একটি কথোপকথন বেছে নিন')+'</p></div>';$('adcm').style.display='none';$('adsd').innerHTML='';return}
$('adcm').style.display='';
$('adtp').innerHTML='<button class="ad-bk2" data-ad="list" aria-label="Back">'+ICO.back+'</button><span class="ad-av">'+esc(ini(c.name))+'</span><div class="ad-hn"><b>'+esc(c.name)+'</b><small>'+(c.phone?esc(c.phone)+' · ':'')+(c.reg?L('Registered','রেজিস্টার্ড'):L('Guest','গেস্ট'))+'</small></div><select id="adas" aria-label="Assign"><option value="">'+L('Unassigned','অ্যাসাইন হয়নি')+'</option>'+S.agents.map(function(a){return '<option value="'+a.id+'"'+(c.assignee==a.id?' selected':'')+'>'+esc(a.name)+'</option>'}).join('')+'</select><button class="ad-rv '+(c.status=='resolved'?'re':'')+'" data-ad="resolve">'+(c.status=='resolved'?L('Reopen','আবার খুলুন'):ICO.trash+' '+L('Resolve','সমাধান'))+'</button>';
var ms=c.msgs,h=ms.map(function(m,i){var ctx=(i==0||new Date(ms[i-1].ts).toDateString()!=new Date(m.ts).toDateString())?'<div class="ad-dy"><span>'+fmtD(m.ts)+'</span></div>':'';if(m.from=='s')return ctx+'<div class="ad-sy"><span>'+esc(m.t)+'</span></div>';
var body;if(m.k=='img')body='<img class="cw-im" src="'+m.src+'" alt="">';else if(m.k=='aud')body='<audio controls preload="metadata" src="'+m.src+'"></audio>';else if(m.k=='prod')body='<div class="cw-pc"><span>'+esc(m.p.emoji||'🛍')+'</span><div><b>'+esc(m.p.name)+'</b><small>'+pdMoney(m.p.price)+'</small><a href="'+esc(m.p.link)+'" target="_blank" rel="noopener">'+L('Open product','পণ্য খুলুন')+'</a></div></div><div class="cw-pt">'+esc(m.t||'')+'</div>';else if(m.k=='ord')body='<div class="cw-oc"><div class="cw-oh"><b>#'+esc(m.o.id)+'</b><span class="cw-os cs'+(m.o.stage<0?'x':m.o.stage==4?'d':'p')+'">'+m.o.label+'</span></div></div>';else if(m.k=='nf')body='<div class="cw-nf">'+esc(m.t)+'</div>';else body='<span class="cw-tx">'+esc(m.t).replace(/\n/g,'<br>')+'</span>';
var cu=m.from=='c',bot=m.from=='b';return ctx+'<div class="ad-m '+(cu?'th':'me')+(bot?' bt':'')+'"><div class="cw-bw"><small class="cw-wn">'+(cu?esc(c.name):bot?'NurBuy Bot':esc(m.an||'Agent'))+'</small><div class="cw-bu">'+body+'</div><div class="cw-mt">'+fmtT(m.ts)+(m.from=='a'?'<span class="cw-tk '+(m.st=='read'||m.cread?'r':'')+'">'+ICO.tick2+'</span>':'')+'</div></div></div>'}).join('');
if(c.typC&&Date.now()-c.typC<4000)h+='<div class="ad-m th"><div class="cw-bw"><div class="cw-bu cw-ty"><i></i><i></i><i></i></div></div></div>';
var box=$('adms'),atEnd=box.scrollHeight-box.scrollTop-box.clientHeight<90||A.stick;box.innerHTML=h;if(atEnd){box.scrollTop=box.scrollHeight;A.stick=false}
$('adcn').innerHTML=['Hello! Thanks for contacting NurBuy Support.','Could you please share your Order ID?','Your issue has been resolved. Anything else I can help with?'].map(function(t){return '<button data-ad="canned" data-t="'+esc(t)+'">'+esc(t.length>28?t.slice(0,27)+'…':t)+'</button>'}).join('');
// side panel
var ids={};c.msgs.forEach(function(m){var mm=(m.t||'').match(/\bNBM?-?\d{4,}\b/ig);if(mm)mm.forEach(function(x){ids[x.toUpperCase()]=1})});if(c.orderId)ids[c.orderId]=1;
var ords=Object.keys(ids).map(function(i){return oFind(i)}).filter(Boolean).map(orderM);
$('adsd').innerHTML='<h4>'+L('Customer','কাস্টমার')+'</h4><div class="ad-cd"><span class="ad-av lg">'+esc(ini(c.name))+'</span><b>'+esc(c.name)+'</b><small>'+(c.phone?uic('phone')+' '+esc(c.phone):'')+'</small><small>'+(c.email?uic('mail')+' '+esc(c.email):'')+'</small><small>'+(c.reg?'✓ '+L('Registered customer','রেজিস্টার্ড কাস্টমার'):L('Guest visitor','গেস্ট ভিজিটর'))+'</small></div>'
+(c.product?'<h4>'+L('Product','পণ্য')+'</h4><div class="ad-pr">'+uic('bag')+' <b>'+esc(c.product.name)+'</b><a href="'+esc(c.product.link)+'" target="_blank" rel="noopener">'+L('Open','খুলুন')+'</a></div>':'')
+'<h4>'+L('Order information','অর্ডারের তথ্য')+'</h4>'+(ords.length?ords.map(function(o){return '<div class="cw-oc ad-oc"><div class="cw-oh"><b>#'+o.id+'</b><span class="cw-os cs'+(o.stage<0?'x':o.stage==4?'d':'p')+'">'+o.label+'</span></div><div class="cw-om">'+o.n+' '+L(o.n==1?'item':'items','টি পণ্য')+' · '+pdMoney(o.total)+' · '+'Minutes'+'</div></div>'}).join(''):'<p class="ad-na">'+L('No order ID shared yet.','এখনো অর্ডার আইডি দেওয়া হয়নি।')+'</p>')
+'<div class="ad-lk"><input id="adoid" placeholder="'+L('Look up Order ID…','অর্ডার আইডি খুঁজুন…')+'"><button data-ad="lookup">'+L('Find','খুঁজুন')+'</button></div><div id="adlr"></div>'}
function admOpen(id){A.cur=id;A.mob='thread';A.stick=true;var c=S.convs.filter(function(x){return x.id==id})[0];if(c)adRead(c);persist();rAdm()}
function adRead(c){var ch=false;if(c.unreadA){c.unreadA=0;ch=true}c.msgs.forEach(function(m){if(m.from=='c'&&m.st!='read'){m.st='read';ch=true}});return ch}
function adSend(t,img){var c=S.convs.filter(function(x){return x.id==A.cur})[0];if(!c)return;t=(t||'').trim();if(!t&&!img)return;var ag=me2();if(!c.assignee){c.assignee=ag.id;add(c,{from:'s',k:'t',t:ag.name+' '+L('joined the chat','চ্যাটে যোগ দিয়েছেন')})}
if(c.mode!='agent'){c.mode='agent'}if(c.status=='resolved')c.status='open';
var m=add(c,img?{from:'a',an:ag.name,k:'img',src:img}:{from:'a',an:ag.name,k:'t',t:t});m.st=viewing(c)?'read':'delivered';c.typA=0;A.stick=true;save()}
document.addEventListener('click',function(e){var t=e.target.closest('[data-ad]');if(!t||!t.closest('#admv'))return;var a=t.dataset.ad;
if(a=='login'){var pw=$('adpw').value;if(pw!='admin123'){$('ader').textContent=L('Wrong access code','অ্যাক্সেস কোড ভুল');return}A.auth=true;A.me=$('adag').value;rAdm()}
else if(a=='tab'){A.tab=t.dataset.t;rAdmParts();if(A.tab=='notif'&&window.NBN)NBN.adRender(true)}
else if(a=='site'){closeAdm();goHome()}
else if(a=='flt'){A.f=t.dataset.f;rAdmParts()}
else if(a=='open')admOpen(t.dataset.id);
else if(a=='list'){A.mob='list';rAdmParts()}
else if(a=='online'){var g=me2();g.online=!g.online;save()}
else if(a=='cust'){C.open&&!C.min?closeC():openC()}
else if(a=='resolve'){var c=S.convs.filter(function(x){return x.id==A.cur})[0];if(!c)return;if(c.status=='resolved'){c.status='open';add(c,{from:'s',k:'t',t:L('Conversation reopened','কথোপকথন আবার খোলা হয়েছে')})}else{c.status='resolved';add(c,{from:'s',k:'t',t:L('This conversation was marked as resolved','কথোপকথনটি সমাধান হয়েছে বলে চিহ্নিত')});if(window.NBN)NBN.supportResolved(c)}save()}
else if(a=='send'){var i=$('adin'),v=i.value;i.value='';i.style.height='';adSend(v)}
else if(a=='img'){$('adfile').click()}
else if(a=='canned'){var i2=$('adin');i2.value=t.dataset.t;i2.focus()}
else if(a=='lookup'){var o=oFind($('adoid').value);$('adlr').innerHTML=o?(function(m){return '<div class="cw-oc ad-oc"><div class="cw-oh"><b>#'+m.id+'</b><span class="cw-os cs'+(m.stage<0?'x':m.stage==4?'d':'p')+'">'+m.label+'</span></div><div class="cw-om">'+m.n+' '+L(m.n==1?'item':'items','টি পণ্য')+' · '+pdMoney(m.total)+'</div></div>'})(orderM(o)):'<p class="ad-na">'+L('Order not found','অর্ডার পাওয়া যায়নি')+'</p>'}});
document.addEventListener('change',function(e){if(e.target.id=='adme'){A.me=e.target.value;rAdmParts()}
else if(e.target.id=='adas'){var c=S.convs.filter(function(x){return x.id==A.cur})[0];if(!c)return;c.assignee=e.target.value;var ag=agentBy(c.assignee);add(c,{from:'s',k:'t',t:ag?L('Conversation assigned to ','কথোপকথন অ্যাসাইন করা হয়েছে: ')+ag.name:L('Conversation unassigned','অ্যাসাইন সরানো হয়েছে')});save()}
else if(e.target.id=='adfile'){var f=e.target.files[0];e.target.value='';if(!f)return;var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,900/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=Math.round(im.width*s);cv.height=Math.round(im.height*s);cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);adSend('',cv.toDataURL('image/jpeg',.8))};im.src=r.result};r.readAsDataURL(f)}});
document.addEventListener('input',function(e){if(e.target.id=='adq'){A.q=e.target.value;rAdmParts();return}
if(e.target.id=='adin'){var c=S.convs.filter(function(x){return x.id==A.cur})[0];e.target.style.height='auto';e.target.style.height=Math.min(110,e.target.scrollHeight)+'px';if(c&&Date.now()-A.tt>1500){A.tt=Date.now();c.typA=Date.now();persist()}}});
document.addEventListener('keydown',function(e){if(e.target.id=='adin'&&e.key=='Enter'&&!e.shiftKey){e.preventDefault();var v=e.target.value;e.target.value='';e.target.style.height='';adSend(v)}else if(e.target.id=='adpw'&&e.key=='Enter'){document.querySelector('[data-ad=login]').click()}});
/* ======================= LIVE SERVER SYNC (only when window.NB_API is set; see CHAT_CONTRACT.md) ======================= */
var Q=[],QB=0,QR=0,RD=[],UPB=new WeakMap(),LS={last:0,own:'',busy:0,pt:0};
function lk(h){return h.replace(/\bhttps?:\/\/[^\s<]+/gi,function(u){var t=(u.match(/[.,:!?)]+$/)||[''])[0];if(t)u=u.slice(0,u.length-t.length);return '<a href="'+u+'" target="_blank" rel="noopener noreferrer nofollow">'+u+'</a>'+t})}
function redirOf(c){for(var i=0;i<RD.length;i++)if(RD[i][0]===c)return redirOf(RD[i][1]);return c}
function unq(m){if(!m)return;Q=Q.filter(function(i){return i.m!==m})}
function chApi(m,p,b,form){var h={'X-Chat-Guest':gid()};if(TOKN)h.Authorization='Bearer '+TOKN;var o={method:m,headers:h};if(form)o.body=form;else if(b!==undefined){h['Content-Type']='application/json';o.body=JSON.stringify(b)}
return fetch(NBAPI+(window.NB_API_PRETTY===false?'/index.php':'')+p,o).then(function(r){return r.text().then(function(t){var j={};try{j=JSON.parse(t)}catch(e){}if(!r.ok){var er=new Error(j.error||L('Something went wrong. Please try again.','কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।'));er.status=r.status;er.data=j;if(r.status==401&&TOKN)liveExpired();throw er}return j})},function(){var er=new Error(L('Cannot reach the server. Please check your internet connection.','সার্ভারে যোগাযোগ হচ্ছে না। ইন্টারনেট সংযোগ দেখুন।'));er.status=0;throw er})}
function ckey(o){return 'nb_chat_live_'+o}
function loadCache(o){S.convs=[];LS.last=0;try{var x=JSON.parse(localStorage.getItem(ckey(o))||'null');if(x&&x.convs){S.convs=x.convs;LS.last=x.last||0}}catch(e){}}
function saveCache(){if(!LS.own)return;try{var cv=[];S.convs.forEach(function(c){var ms=c.msgs.filter(function(m){return !m.pend}).slice(-150);if(!c.sid&&!ms.length)return;var x={};for(var k in c)if(k!='msgs')x[k]=c[k];x.msgs=ms;cv.push(x)});localStorage.setItem(ckey(LS.own),JSON.stringify({convs:cv,last:LS.last}))}catch(e){}}
function ownerCheck(){var o=me();if(LS.own===o)return false;LS.own=o;loadCache(o);C.cur=null;C.fk='';C.offF=false;prevC=upBadge();if(C.open)rC();schedPoll(0);return true}
function pj(x){if(x&&typeof x=='string'){try{x=JSON.parse(x)}catch(e){return {}}}return x&&typeof x=='object'?x:{}}
function toMs(t){t=+t||0;return t&&t<1e11?t*1000:t}
function okUrl(u){return /^(https?:\/\/|blob:)/i.test(u||'')?u:''}
function fromSrv(s){var mt=pj(s.meta),m={from:s.from,ts:toMs(s.ts)||Date.now(),k:'t',t:s.text||''};if(s.an)m.an=s.an;var k=s.kind;
if(k=='img'){m.k='img';m.src=okUrl(s.url)}else if(k=='aud'){m.k='aud';m.src=okUrl(s.url);m.dur=s.dur}
else if(k=='prd'){var p=mt.p||mt;m.k='prod';m.p={name:String(p.name||p.n||''),emoji:p.emoji,price:+p.price||0,link:/^https?:\/\//i.test(p.link||'')?p.link:''}}
else if(k=='ord'){var o=mt.o||mt;m.k='ord';m.o={id:String(o.id||''),t:o.t,stage:+o.stage||0,label:OST.indexOf(o.label)>-1||o.label=='Cancelled'?o.label:'Pending',total:+o.total||0,n:+o.n||0,ago:o.ago}}
else if(mt.nf)m.k='nf';
if(mt.chips&&mt.chips.length)m.chips=mt.chips;m.id='s'+s.id;return m}
function toSrv(c,m){var b={kind:'t',text:String(m.t||'').slice(0,4000),from:m.from,name:c.name||'Guest',mode:c.mode=='bot'?'bot':'human',view:'min'},mt={};
if(c.sid)b.conv=c.sid;if(c.phone)b.phone=c.phone;if(c.email)b.email=c.email;if(c.orderId)b.order=c.orderId;if(c.product)b.product={n:c.product.name,id:c.product.k||'',price:c.product.price||0,link:c.product.link||''};
if(m.k=='img')b.kind='img';else if(m.k=='aud'){b.kind='aud';if(m.dur)b.dur=m.dur}else if(m.k=='prod'){b.kind='prd';mt.p=m.p}else if(m.k=='ord'){b.kind='ord';mt.o=m.o}else if(m.k=='nf')mt.nf=1;
if(m.chips&&m.chips.length)mt.chips=m.chips;if(Object.keys(mt).length)b.meta=mt;return b}
function qPost(c,m){m.pend=1;Q.push({c:c,m:m});setTimeout(pump,0)}
function pump(){if(QB||!Q.length)return;var it=Q[0];if(S.convs.indexOf(it.c)<0){Q.shift();return pump()}
if(TOKN&&!AU.uid){clearTimeout(QR);QR=setTimeout(pump,800);return}
QB=1;doItem(it).then(function(){Q.shift();QB=0;pump()},function(e){QB=0;if(!e||e.status==0||e.status>=500){clearTimeout(QR);QR=setTimeout(pump,5000);return}
Q.shift();var c=it.c;c.msgs=c.msgs.filter(function(x){return x!==it.m});persist();msg(liveErr(e));if(C.open)rC();pump()})}
function newLocal(from){var nm=AU.uid&&PROF.name?PROF.name:'Guest',c={id:'c'+uid(),cid:me(),name:nm,phone:AU.uid?PROF.mobile:'',email:AU.uid?PROF.email:'',reg:!!AU.uid,mode:from.mode=='offline'?'offline':from.mode,status:'open',assignee:'',unreadC:0,unreadA:0,msgs:[],product:from.product||null,orderId:from.orderId||'',await:'',created:Date.now(),updated:Date.now()};S.convs.push(c);return c}
function resolvedFlow(it,c){c.status='resolved';var nc=newLocal(c),mv=c.msgs.filter(function(x){return x.pend});c.msgs=c.msgs.filter(function(x){return !x.pend});nc.msgs=mv;RD.push([c,nc]);Q.forEach(function(i){if(i.c===c)i.c=nc});it.c=nc;if(C.cur==c.id||!C.cur)C.cur=nc.id;persist();if(C.open)rC();return doItem(it)}
function doItem(it){var m=it.m,c=redirOf(it.c),u=UPB.get(m),up=Promise.resolve();
if(u&&!it.url){var fd=new FormData();fd.append('file',u.blob,u.name);fd.append('kind',u.kind);up=chApi('POST','/chat/upload',undefined,fd).then(function(r){it.url=r.url})}
return up.then(function(){var b=toSrv(c,m);if(it.url)b.url=it.url;return chApi('POST','/chat/send',b)}).then(function(r){var sm=r.msg||{},sc=r.conv||{};
if(sc.id){c.sid=sc.id;if(c.id!=sc.id){if(C.cur==c.id)C.cur=sc.id;c.id=sc.id}}
m.sid=sm.id;m.pend=0;if(sm.url&&okUrl(sm.url)){var old=m.src;m.src=sm.url;if(/^blob:/.test(old||''))try{URL.revokeObjectURL(old)}catch(e){}}UPB.delete(m);persist();if(C.open)rC()},function(e){if(e&&e.status==409&&e.data&&e.data.code=='resolved')return resolvedFlow(it,c);throw e})}
/* uploads (image / voice) */
function extOf(t,n){t=(t||'').toLowerCase();return /ogg/.test(t)?'ogg':/mp4|m4a|aac/.test(t)?'m4a':/mpeg|mp3/.test(t)?'mp3':/wav/.test(t)?'wav':/webm/.test(t)?'webm':((n||'').split('.').pop()||'webm')}
function liveImg(file){if(!file||!(/^image\//.test(file.type)||/\.(heic|heif)$/i.test(file.name)))return msg(L('Please choose an image file','একটি ছবির ফাইল বেছে নিন'));
var go=function(blob,name){if(blob.size>5e6)return msg(L('Image is too large (max 5 MB)','ছবি অনেক বড় (সর্বোচ্চ ৫ MB)'));var c=conv(true),m=userSay(c,{from:'c',k:'img',src:URL.createObjectURL(blob)});UPB.set(m,{blob:blob,name:name,kind:'img'});if(c.mode=='bot')botSay(c,L('Thanks for the photo! Our support agent can look at it. Would you like to talk to an agent?','ছবির জন্য ধন্যবাদ! আমাদের সাপোর্ট এজেন্ট এটি দেখতে পারবেন। এজেন্টের সাথে কথা বলবেন?'),['agent','track']);save()};
var u=URL.createObjectURL(file),im=new Image();im.onerror=function(){URL.revokeObjectURL(u);go(file,file.name||'photo.jpg')};
im.onload=function(){URL.revokeObjectURL(u);var s=Math.min(1,1200/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(im.width*s));cv.height=Math.max(1,Math.round(im.height*s));var x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,cv.width,cv.height);x.drawImage(im,0,0,cv.width,cv.height);cv.toBlob(function(b){b?go(b,'photo.jpg'):go(file,file.name||'photo.jpg')},'image/jpeg',.82)};im.src=u}
function liveAud(file,dur){if(!file||!(/^audio\//.test(file.type)||file.type==''||/video\/(webm|mp4)/.test(file.type)))return msg(L('Please choose an audio file','একটি অডিও ফাইল বেছে নিন'));if(file.size>5e6)return msg(L('Audio is too large (max 5 MB)','অডিও ফাইল বড় (সর্বোচ্চ ৫ MB)'));
var c=conv(true),m=userSay(c,{from:'c',k:'aud',src:URL.createObjectURL(file),dur:dur||0});UPB.set(m,{blob:file,name:'voice.'+extOf(file.type,file.name),kind:'aud'});if(c.mode=='bot')botSay(c,L('Thanks for your voice message! Please talk to an agent so they can listen to it.','ভয়েস মেসেজের জন্য ধন্যবাদ! এজেন্ট শুনতে পারবেন, তাই এজেন্টের সাথে কথা বলুন।'),['agent']);save()}
/* pull */
function sigAll(){return S.convs.map(function(c){return [c.id,c.status,c.mode,c.unreadC,c.assignee,c.msgs.length,c.name].join()}).join('|')}
function upsertConv(sc){var c=S.convs.filter(function(x){return x.sid==sc.id||x.id==sc.id})[0];
if(!c){c={id:sc.id,sid:sc.id,cid:me(),name:sc.name||'Guest',phone:sc.phone||'',email:sc.email||'',reg:!!AU.uid,mode:'bot',status:'open',assignee:'',unreadC:0,unreadA:0,msgs:[],product:null,orderId:'',await:'',created:toMs(sc.created_at)||Date.now(),updated:toMs(sc.last_at)||Date.now()};S.convs.push(c)}
c.sid=sc.id;var pend=Q.some(function(i){return i.c===c});
if(!pend)c.mode=(c.mode=='offline'&&sc.mode=='human')?'offline':(sc.mode=='human'?'agent':'bot');
c.status=(c.lres&&sc.status!='resolved')?'resolved':(sc.status=='resolved'?'resolved':'open');if(sc.name)c.name=sc.name;if(sc.phone)c.phone=sc.phone;if(sc.email)c.email=sc.email;c.assignee=sc.assignee||'';if(sc.order)c.orderId=sc.order;
var pr=pj(sc.product);if(pr.n)c.product={name:pr.n,link:pr.link||'',price:pr.price,k:pr.id};
c.srvU=+sc.unread_user||0;c.updated=Math.max(c.updated||0,toMs(sc.last_at));
if(!c.rdp){if(viewing(c)){if(c.srvU)seen(c);c.unreadC=0}else c.unreadC=c.srvU}return c}
function ingest(sm,hist){var c=S.convs.filter(function(x){return x.sid==sm.conv})[0];if(!c||c.msgs.some(function(x){return x.sid==sm.id}))return;
var m=fromSrv(sm);m.sid=sm.id;c.msgs.push(m);c.msgs.sort(function(a,b){return (a.sid||1e15)-(b.sid||1e15)});c.updated=Math.max(c.updated||0,m.ts);
if(m.from=='a'){c.lres=0;if(c.mode=='offline'){c.mode='agent';c.offline=false}if(!hist&&!viewing(c)&&window.NBN)NBN.support(c,m)}}
function tickAll(){S.convs.forEach(function(c){var li=-1;c.msgs.forEach(function(m,i){if(m.from=='a')li=i});c.msgs.forEach(function(m,i){if(m.from=='c'&&(!m.st||m.st=='sent'||m.st=='delivered'))m.st=(i<li||c.mode=='bot')?'read':'sent'})})}
function srvSync(){if(LS.busy||(TOKN&&!AU.uid))return Promise.resolve();ownerCheck();LS.busy=1;var own=LS.own,after=LS.last,hist=!after&&!S.convs.some(function(c){return c.sid});
return chApi('GET','/chat/sync?after='+after).then(function(r){LS.busy=0;if(own!==me()||Q.length||QB)return;var b4=sigAll();(r.convs||[]).forEach(upsertConv);var ms=(r.msgs||[]).slice().sort(function(a,b){return a.id-b.id});ms.forEach(function(x){ingest(x,hist);if(x.id>LS.last)LS.last=x.id});if(r.last>LS.last)LS.last=+r.last;tickAll();persist();if(sigAll()!==b4)sync()},function(){LS.busy=0})}
function pollDelay(){return C.open&&!C.min?3000:15000}
function schedPoll(d){clearTimeout(LS.pt);LS.pt=setTimeout(pollTick,d==null?pollDelay():d)}
function pollTick(){LS.pt=0;if(document.hidden)return;srvSync().then(function(){schedPoll()},function(){schedPoll()})}
if(LIVE){S.agents=[{id:'a0',name:'NurBuy Support',online:true}];var _uai=updAuthUI;updAuthUI=function(){var r=_uai.apply(this,arguments);try{ownerCheck()}catch(e){}return r};
document.addEventListener('visibilitychange',function(){if(!document.hidden)schedPoll(0)});ownerCheck();schedPoll(400)}
/* ======================= SYNC ======================= */
function sync(){var ch=false;
// delivered / read bookkeeping
if(A.on&&A.auth){S.convs.forEach(function(c){c.msgs.forEach(function(m){if(m.from=='c'&&m.st=='sent'){m.st='delivered';ch=true}});if(A.cur==c.id&&document.visibilityState!='hidden'&&adRead(c))ch=true})}
mine().forEach(function(c){if(viewing(c)){if(c.unreadC){c.unreadC=0;ch=true}c.msgs.forEach(function(m){if(m.from=='a'&&m.st!='read'){m.st='read';ch=true}})}});
if(ch)persist();
var uc=upBadge();if(uc>prevC){var lc=mine().sort(function(a,b){return b.updated-a.updated})[0],lm=lc&&lc.msgs.filter(function(m){return m.from=='a'||m.from=='b'}).slice(-1)[0];if(!(C.open&&!C.min)){msg(L('New message from NurBuy Support','NurBuy সাপোর্ট থেকে নতুন বার্তা'));beep()}osNotify('NurBuy Support',lm&&lm.t?lm.t:L('New message','নতুন বার্তা'))}prevC=uc;
var ua=S.convs.reduce(function(a,c){return a+(c.unreadA||0)},0);if(A.on&&ua>prevA){var lg=S.convs.filter(function(c){return c.unreadA}).sort(function(a,b){return b.updated-a.updated})[0];msg(L('New customer message','কাস্টমারের নতুন বার্তা')+(lg?': '+lg.name:''));beep();osNotify('NurBuy Support Inbox',lg?lg.name:'')}prevA=ua;
document.title=(uc||(A.on&&ua)?'('+(A.on?ua:uc)+') ':'')+titleBase;
if(C.open)rC();if(A.on&&A.auth&&$('adl'))rAdmParts();
clearTimeout(sync.t);var need=(C.open&&mine().some(function(c){return c.typA&&Date.now()-c.typA<5200}))||(A.on&&S.convs.some(function(c){return c.typC&&Date.now()-c.typC<4200}));if(need)sync.t=setTimeout(sync,1200)}
// agent typing indicator also needs re-render when typA updates by another tab (handled by storage event)
var fa=$('fadm');if(LIVE){if(fa)fa.parentNode.removeChild(fa)}else if(fa)fa.addEventListener('click',function(e){e.preventDefault();openAdm()});
window.addEventListener('popstate',function(){if(document.body.classList.contains('vm')&&!(history.state&&history.state.m)){closeAdm()}});
if(!LIVE&&location.hash=='#admin-support')setTimeout(openAdm,50);
document.addEventListener('DOMContentLoaded',upBadge);setTimeout(function(){upBadge();prevC=upBadge();prevA=S.convs.reduce(function(a,c){return a+(c.unreadA||0)},0)},100);
window.NBChat={openAdm:openAdm,open:openC,openConv:function(id){C.cur=id;C.fk='';openC()},state:function(){return S}};
})();

/* ===== NOTIFICATIONS =====
   Data model (localStorage 'nb_notif_v1'; swap load()/persist() for REST/WebSocket calls on a real backend):
   { seq, items:[{id,type,title,msg,img,btn,url,aud:{mode:'all'|'users',ids:[]},sendAt,created,by,key,ref}],
     st:{ <userId>:{read:{id:1},del:{id:1}} } }
   title/msg may be a string or {en,bn}. Order status overrides live in 'nb_ordst'. */
(function(){
var NK='nb_notif_v1',OK='nb_ordst',NC=null;try{NC=new BroadcastChannel('nb_notif')}catch(e){}
var D={seq:0,items:[],st:{}};
function load(){try{var s=JSON.parse(localStorage.getItem(NK)||'null');if(s&&s.items)D=s}catch(e){}}
function persist(){try{localStorage.setItem(NK,JSON.stringify(D))}catch(e){}try{NC&&NC.postMessage(1)}catch(e){}}
function save(){persist();refresh()}
load();
if(NC)NC.onmessage=function(){load();applyOv();refresh(true)};
window.addEventListener('storage',function(e){if(e.key==NK||e.key==OK){load();applyOv();refresh(true)}});
var nid=function(){return 'n'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)};
function T2(x){return x&&typeof x=='object'?(lang=='en'?x.en:x.bn||x.en):(x||'')}
function gidN(){try{return localStorage.getItem('nb_gid')||'guest'}catch(e){return 'guest'}}
function who(){return AU.uid||gidN()}
function stU(u){return D.st[u]||(D.st[u]={read:{},del:{}})}
var I={box:'<path d="M4 8l8-5 8 5v10l-8 4-8-4zM4 8l8 4 8-4M12 12v10"/>',check:'<path d="M5 12.5l4.5 4.5L19 7"/>',proc:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',truck:'<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',pin:'<path d="M12 22s7-6.5 7-12a7 7 0 00-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',ok:'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',x:'<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',card:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19M6 15h4"/>',cardx:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19M15 13.5l3.500 3.500M18.500 13.500L15 17"/>',refund:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>',bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',spark:'<path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800zM19 16l.8 2.200L22 19l-2.200.8L19 22l-.8-2.200L16 19l2.200-.8z"/>',tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.500" cy="8.500" r="1.500"/>',ticket:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M14 6v12" stroke-dasharray="2 2"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',mega:'<path d="M3 10v4h3l8 4V6L6 10zM17 9a4 4 0 010 6"/>',star:'<path d="M12 3l2.500 5 5.500.8-4 3.900.9 5.500-4.900-2.600-4.900 2.600.9-5.500-4-3.900 5.500-.8z"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.500-6 8-6s8 2 8 6"/>',shield:'<path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',alert:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.1"/>',chat:'<path d="M21 12a8 8 0 01-11.600 7.100L4 20l1-4.400A8 8 0 1121 12z"/>',chatok:'<path d="M21 12a8 8 0 01-11.600 7.100L4 20l1-4.400A8 8 0 1121 12z"/><path d="M8.500 12l2.500 2.500 4.500-5"/>',trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',bell:'<path d="M18 16v-5a6 6 0 00-12 0v5l-2 2h16zM10 21h4"/>',back:'<path d="M15 5l-7 7 7 7"/>',cls:'<path d="M6 6l12 12M18 6L6 18"/>',edit:'<path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4"/>',plus:'<path d="M12 5v14M5 12h14"/>',img:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.800"/><path d="M21 16l-5-5-8 9"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'};
function svg(k){return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(I[k]||I.bell)+'</svg>'}
var TY={
order_placed:{cat:'order',ic:'box',tone:'b',en:'Order placed',bn:'অর্ডার হয়েছে'},
order_confirmed:{cat:'order',ic:'check',tone:'b',en:'Order confirmed',bn:'অর্ডার কনফার্ম'},
order_processing:{cat:'order',ic:'proc',tone:'b',en:'Processing',bn:'প্রসেসিং'},
order_shipped:{cat:'order',ic:'truck',tone:'b',en:'Shipped',bn:'শিপড'},
order_out:{cat:'order',ic:'pin',tone:'b',en:'Out for delivery',bn:'ডেলিভারির পথে'},
order_delivered:{cat:'order',ic:'ok',tone:'g',en:'Delivered',bn:'ডেলিভারড'},
order_cancelled:{cat:'order',ic:'x',tone:'r',en:'Cancelled',bn:'বাতিল'},
pay_ok:{cat:'order',ic:'card',tone:'g',en:'Payment successful',bn:'পেমেন্ট সফল'},
pay_fail:{cat:'order',ic:'cardx',tone:'r',en:'Payment failed',bn:'পেমেন্ট ব্যর্থ'},
refund:{cat:'order',ic:'refund',tone:'g',en:'Refund processed',bn:'রিফান্ড সম্পন্ন'},
offer_flash:{cat:'offer',ic:'bolt',tone:'o',en:'Flash Sale',bn:'ফ্ল্যাশ সেল'},
offer_new:{cat:'offer',ic:'spark',tone:'o',en:'New Product',bn:'নতুন পণ্য'},
offer_discount:{cat:'offer',ic:'tag',tone:'o',en:'Discount',bn:'ডিসকাউন্ট'},
offer_coupon:{cat:'offer',ic:'ticket',tone:'o',en:'Coupon',bn:'কুপন'},
offer_limited:{cat:'offer',ic:'clock',tone:'o',en:'Limited-time offer',bn:'সীমিত সময়ের অফার'},
offer_campaign:{cat:'offer',ic:'mega',tone:'o',en:'Special campaign',bn:'বিশেষ ক্যাম্পেইন'},
acc_welcome:{cat:'account',ic:'star',tone:'k',en:'Welcome',bn:'স্বাগতম'},
acc_profile:{cat:'account',ic:'user',tone:'k',en:'Profile update',bn:'প্রোফাইল আপডেট'},
acc_security:{cat:'account',ic:'shield',tone:'k',en:'Password / security',bn:'পাসওয়ার্ড / নিরাপত্তা'},
acc_alert:{cat:'account',ic:'alert',tone:'r',en:'Important account alert',bn:'গুরুত্বপূর্ণ অ্যাকাউন্ট সতর্কতা'},
sup_reply:{cat:'support',ic:'chat',tone:'g',en:'Support reply',bn:'সাপোর্টের উত্তর'},
sup_update:{cat:'support',ic:'chatok',tone:'g',en:'Support update',bn:'সাপোর্ট আপডেট'}};
var GRP=[['order','Orders & payments','অর্ডার ও পেমেন্ট'],['offer','Offers & promotions','অফার ও প্রমোশন'],['account','Account','অ্যাকাউন্ট'],['support','Customer support','কাস্টমার সাপোর্ট']];
var CATS=[['all','All','সব'],['unread','Unread','অপঠিত'],['order','Orders','অর্ডার'],['offer','Offers','অফার'],['account','Account','অ্যাকাউন্ট'],['support','Support','সাপোর্ট']];
function typ(n){return TY[n.type]||TY.acc_alert}
function atOf(n){return n.sendAt||n.created}
function forUser(u){u=u||who();var s=D.st[u]||{read:{},del:{}},now=Date.now();return D.items.filter(function(n){return atOf(n)<=now&&!s.del[n.id]&&(n.aud.mode=='all'||(n.aud.ids||[]).indexOf(u)>-1)}).sort(function(a,b){return atOf(b)-atOf(a)})}
function isRead(n,u){var s=D.st[u||who()];return !!(s&&s.read[n.id])}
function unreadN(){return forUser().filter(function(n){return !isRead(n)}).length}
function ago(ts){var s=Math.max(0,(Date.now()-ts)/1000);if(s<60)return L('Just now','এখনই');if(s<3600){var m=Math.floor(s/60);return L(m+' min ago',m+' মি. আগে')}if(s<86400){var h=Math.floor(s/3600);return L(h+' h ago',h+' ঘণ্টা আগে')}if(s<172800)return L('Yesterday','গতকাল');if(s<604800){var d=Math.floor(s/86400);return L(d+' days ago',d+' দিন আগে')}try{return new Date(ts).toLocaleDateString(lang=='en'?'en-GB':'bn-BD',{day:'numeric',month:'short',year:'numeric'})}catch(e){return ''}}
/* ---------- creation API ---------- */
function create(o){if(o.key&&o.merge){var ex=D.items.filter(function(i){return i.key==o.key})[0];if(ex&&(o.aud.ids||[]).every(function(u){return !isRead(ex,u)})&&!(D.st[o.aud.ids[0]]&&D.st[o.aud.ids[0]].del[ex.id])){ex.title=o.title;ex.msg=o.msg;ex.created=Date.now();ex.sendAt=0;save();return ex}}
if(o.key&&!o.merge&&D.items.some(function(i){return i.key==o.key}))return null;
var n={id:nid(),type:o.type,title:o.title,msg:o.msg,img:o.img||'',btn:o.btn||'',url:o.url||'',aud:o.aud||{mode:'all',ids:[]},sendAt:o.sendAt||0,created:Date.now(),by:o.by||'system',key:o.key||'',ref:o.ref||''};D.items.push(n);D.seq++;save();return n}
function toUser(u,o){o.aud={mode:'users',ids:[u]};return create(o)}
/* ---------- order system bridge ---------- */
function ordOwner(o){return o.uid||'u_demo'}
function ordById(id){return (window.ORD_DEMO||[]).filter(function(o){return o.id==id})[0]}
function applyStatus(o,st){if(st=='delivered')o.s='d';else if(st=='cancelled')o.s='c';else{o.s='p';o.step={placed:0,confirmed:0,processing:1,shipped:2,out:2}[st]||0;if(!o.eta)o.eta={en:'Arriving soon',bn:'শীঘ্রই পৌঁছাবে'}}o.st=st}
function ovGet(){try{return JSON.parse(localStorage.getItem(OK)||'{}')}catch(e){return {}}}
function applyOv(){var ov=ovGet(),ch=false;(window.ORD_DEMO||[]).forEach(function(o){if(ov[o.id]&&o.st!=ov[o.id]){applyStatus(o,ov[o.id]);ch=true}});if(ch&&document.body.classList.contains('vo')&&window.renderOrd){try{renderOrd()}catch(e){}}}
var EV={placed:['order_placed','Order placed','অর্ডার হয়েছে','Your order #{id} has been placed successfully.','আপনার অর্ডার #{id} সফলভাবে হয়েছে।'],
confirmed:['order_confirmed','Order confirmed','অর্ডার কনফার্ম হয়েছে','Good news! Order #{id} is confirmed by the seller.','সুখবর! অর্ডার #{id} বিক্রেতা কনফার্ম করেছেন।'],
processing:['order_processing','Order is being processed','অর্ডার প্রসেস হচ্ছে','We are packing the items of order #{id}.','অর্ডার #{id}-এর পণ্য প্যাক করা হচ্ছে।'],
shipped:['order_shipped','Order shipped','অর্ডার শিপ হয়েছে','Order #{id} has left the warehouse and is on its way.','অর্ডার #{id} ডেলিভারির জন্য রওনা হয়েছে।'],
out:['order_out','Out for delivery','ডেলিভারির পথে','Order #{id} is out for delivery. Please keep your phone nearby.','অর্ডার #{id} ডেলিভারির পথে। ফোন কাছে রাখুন।'],
delivered:['order_delivered','Order delivered','অর্ডার ডেলিভারি হয়েছে','Order #{id} was delivered. Tap to rate your experience.','অর্ডার #{id} ডেলিভারি হয়েছে। রেটিং দিতে ট্যাপ করুন।'],
cancelled:['order_cancelled','Order cancelled','অর্ডার বাতিল হয়েছে','Order #{id} has been cancelled.','অর্ডার #{id} বাতিল করা হয়েছে।'],
pay_ok:['pay_ok','Payment successful','পেমেন্ট সফল হয়েছে','We received {amt} for order #{id}. Thank you!','অর্ডার #{id}-এর জন্য {amt} পেয়েছি। ধন্যবাদ!'],
pay_fail:['pay_fail','Payment failed','পেমেন্ট ব্যর্থ হয়েছে','Payment for order #{id} did not go through. Please try again.','অর্ডার #{id}-এর পেমেন্ট সম্পন্ন হয়নি। আবার চেষ্টা করুন।'],
refund:['refund','Refund processed','রিফান্ড সম্পন্ন হয়েছে','{amt} for order #{id} is refunded to your payment method (5–7 working days).','অর্ডার #{id}-এর {amt} আপনার পেমেন্ট মাধ্যমে ফেরত পাঠানো হয়েছে (৫–৭ কর্মদিবস)।']};
function orderEvent(id,ev,opt){opt=opt||{};var o=ordById(id);if(!o||!EV[ev])return null;
if(['placed','confirmed','processing','shipped','out','delivered','cancelled'].indexOf(ev)>-1){applyStatus(o,ev);var ov=ovGet();ov[id]=ev;try{localStorage.setItem(OK,JSON.stringify(ov))}catch(e){}if(document.body.classList.contains('vo')&&window.renderOrd){try{renderOrd()}catch(e){}}}
var e=EV[ev],amt='৳'+oTot(o).toLocaleString('en-US'),f=function(t){return t.replace('{id}',id).replace('{amt}',amt)};
return toUser(ordOwner(o),{type:e[0],title:{en:e[1],bn:e[2]},msg:{en:f(e[3]),bn:f(e[4])},btn:{en:'View order',bn:'অর্ডার দেখুন'}[lang]||'View order',url:'order:'+id,ref:id})}
/* ---------- account / support bridges ---------- */
function userIn(){var u=AU.uid?USERS.filter(function(x){return x.id==AU.uid})[0]:null;if(u)toUser(u.id,{key:'wel_'+u.id,type:'acc_welcome',title:{en:'Welcome to NurBuy, '+u.name.split(/\s+/)[0]+'!',bn:'NurBuy-তে স্বাগতম, '+u.name.split(/\s+/)[0]+'!'},msg:{en:'Your account is ready. Get groceries, food and daily needs from local shops in minutes.',bn:'আপনার অ্যাকাউন্ট প্রস্তুত। লোকাল দোকান থেকে বাজার, খাবার ও প্রয়োজনীয় সবকিছু কয়েক মিনিটে পেয়ে যান।'},btn:L('Start shopping','কেনাকাটা শুরু করুন'),url:'home'});refresh()}
function account(kind){if(!AU.uid)return;var M={profile:['acc_profile',{en:'Profile updated',bn:'প্রোফাইল আপডেট হয়েছে'},{en:'Your profile details were updated successfully.',bn:'আপনার প্রোফাইলের তথ্য সফলভাবে আপডেট হয়েছে।'}],password:['acc_security',{en:'Password changed',bn:'পাসওয়ার্ড পরিবর্তন হয়েছে'},{en:'Your password was changed. If this was not you, contact support immediately.',bn:'আপনার পাসওয়ার্ড পরিবর্তন হয়েছে। আপনি না করে থাকলে এখনই সাপোর্টে জানান।'}]}[kind];if(!M)return;toUser(AU.uid,{type:M[0],title:M[1],msg:M[2],btn:L('Account settings','অ্যাকাউন্ট সেটিংস'),url:'profile'})}
function supMsg(m){return m.k=='img'?L('Sent you a photo','একটি ছবি পাঠিয়েছেন'):m.k=='aud'?L('Sent you a voice message','একটি ভয়েস মেসেজ পাঠিয়েছেন'):(m.t||'')}
function support(c,m){toUser(c.cid,{key:'sup_'+c.id,merge:true,type:'sup_reply',title:{en:'New reply from '+(m.an||'Support'),bn:(m.an||'সাপোর্ট')+' এর নতুন উত্তর'},msg:supMsg(m).slice(0,140),btn:L('Open chat','চ্যাট খুলুন'),url:'support:'+c.id,ref:c.id})}
function supportResolved(c){toUser(c.cid,{type:'sup_update',title:{en:'Support conversation resolved',bn:'সাপোর্ট কথোপকথন সমাধান হয়েছে'},msg:{en:'Your support conversation was marked as resolved. Reply anytime to reopen it.',bn:'আপনার সাপোর্ট কথোপকথনটি সমাধান হয়েছে। প্রয়োজনে আবার লিখুন।'},btn:L('View chat','চ্যাট দেখুন'),url:'support:'+c.id,ref:c.id})}
function readKey(k,u){var it=D.items.filter(function(i){return i.key==k})[0];if(it&&!isRead(it,u||who())){stU(u||who()).read[it.id]=1;save()}}
/* ---------- navigation ---------- */
function go(u){closeD();closeNP();if(!u)return;if(/^https?:\/\//i.test(u)){window.open(u,'_blank','noopener');return}
var p=u.split(':'),k=p[0],a=p.slice(1).join(':');
if(k=='order'){if(authGate('ord'))return;var o=ordById(a);openOrd();if(o){ORS.tab='all';ORS.rng=0;ORS.q=a;var q=$('ordq');if(q)q.value=a;var rr=$('ordr');if(rr)rr.value='0';renderOrdList()}}
else if(k=='orders')openOrd();
else if(k=='profile')openProf();
else if(k=='wishlist')openWish();
else if(k=='cart')openCart();
else if(k=='shops')openShops();
else if(k=='home')goHome();
else if(k=='support'){if(window.NBChat&&NBChat.openConv)NBChat.openConv(a);else if(window.NBChat)NBChat.open()}
else if(k=='product'){var nm=a.toLowerCase(),key=Object.keys(PMAP).filter(function(x){return x.toLowerCase().slice(-nm.length)==nm})[0];if(key){goHome();openPD(key)}else{goHome();msg(L('This product is no longer available','এই পণ্যটি আর পাওয়া যাচ্ছে না'))}}
else goHome()}
function open1(id){var n=D.items.filter(function(x){return x.id==id})[0];if(!n)return;if(!isRead(n)){stU(who()).read[id]=1;save()}if(n.url)go(n.url);else{closeD()}}
/* ---------- customer UI ---------- */
var bell=null,live=null,PG={f:'all',n:10},prevU=-1;
function itemH(n,o){o=o||{};var T=typ(n),rd=isRead(n),ic=n.img?'<img src="'+esc(n.img)+'" alt="">':svg(n.icon||T.ic);
return '<div class="nt-i'+(rd?'':' un')+'" role="listitem" tabindex="0" data-nid="'+n.id+'"><div class="nt-ic t-'+T.tone+'">'+ic+'</div><div class="nt-b"><div class="nt-tt">'+esc(T2(n.title))+'</div><div class="nt-m">'+esc(T2(n.msg))+'</div><div class="nt-ft"><span class="nt-tm">'+(o.when||ago(atOf(n)))+'</span>'+(n.btn?'<button class="nt-ab" data-nt="go" type="button">'+esc(T2(n.btn))+'</button>':'')+'</div></div>'+(o.noact?'':'<div class="nt-r">'+(rd?'':'<i class="nt-dot" title="'+L('Unread','অপঠিত')+'"></i>')+'<div class="nt-ac">'+(rd?'':'<button type="button" data-nt="read" aria-label="'+L('Mark as read','পঠিত হিসেবে চিহ্নিত করুন')+'" title="'+L('Mark as read','পঠিত')+'">'+svg('check')+'</button>')+'<button type="button" data-nt="del" aria-label="'+L('Delete notification','নোটিফিকেশন মুছুন')+'" title="'+L('Delete','মুছুন')+'">'+svg('trash')+'</button></div></div>')+'</div>'}
function emptyH(f){return '<div class="nt-em"><div>'+svg('bell')+'</div><b>'+(f=='unread'?L('You are all caught up','সব দেখা হয়েছে'):L('No notifications yet','এখনো কোনো নোটিফিকেশন নেই'))+'</b><p>'+L('Order updates, offers and support replies will appear here.','অর্ডার আপডেট, অফার ও সাপোর্টের উত্তর এখানে দেখা যাবে।')+'</p></div>'}
function markAll(){var s=stU(who());forUser().forEach(function(n){s.read[n.id]=1});save()}
function setBadge(){var c=unreadN();if(!bell)return c;var b=bell.querySelector('.nt-bd');if(!b){b=document.createElement('i');b.className='nt-bd';bell.appendChild(b)}b.textContent=c>99?'99+':c;b.style.display=c?'':'none';bell.setAttribute('aria-label',L('Notifications','নোটিফিকেশন')+(c?', '+c+' '+L('unread','অপঠিত'):''));bell.setAttribute('aria-haspopup','dialog');return c}
function ensureD(){var d=$('ntfd');if(d)return d;d=document.createElement('div');d.id='ntfd';d.className='ntd';d.setAttribute('role','dialog');d.setAttribute('aria-modal','false');d.setAttribute('aria-label','Notifications');document.body.appendChild(d);var bd=document.createElement('div');bd.id='ntfbd';bd.className='ntd-bd';document.body.appendChild(bd);return d}
function rD(){var d=$('ntfd');if(!d||!d.classList.contains('o'))return;var all=forUser(),un=all.filter(function(n){return !isRead(n)}).length,lim=innerWidth>=900?6:30,l=all.slice(0,lim);
d.innerHTML='<div class="ntd-h"><button type="button" class="ntd-bk" data-nt="close" aria-label="'+L('Close','বন্ধ করুন')+'">'+svg('back')+'</button><h2>'+L('Notifications','নোটিফিকেশন')+(un?'<em>'+un+'</em>':'')+'</h2><button type="button" class="ntd-ma" data-nt="all"'+(un?'':' disabled')+'>'+svg('check')+'<span>'+L('Mark all as read','সব পঠিত')+'</span></button><button type="button" class="ntd-x" data-nt="close" aria-label="'+L('Close','বন্ধ করুন')+'">'+svg('cls')+'</button></div><div class="ntd-l" role="list">'+(l.length?l.map(function(n){return itemH(n)}).join(''):emptyH())+'</div><div class="ntd-f"><button type="button" data-nt="page">'+L('View All Notifications','সব নোটিফিকেশন দেখুন')+'</button></div>'}
function pos(){var d=$('ntfd');if(!d||!bell||innerWidth<900)return;var r=bell.getBoundingClientRect(),w=Math.min(410,innerWidth-24),left=Math.max(12,Math.min(r.left+r.width/2-w+36,innerWidth-w-12));d.style.width=w+'px';d.style.left=left+'px';d.style.top=(r.bottom+10)+'px';d.style.setProperty('--ar',(r.left+r.width/2-left)+'px')}
function openD(){var d=ensureD();closeNP();d.classList.add('o');$('ntfbd').classList.add('o');document.body.classList.add('nt-o');bell.setAttribute('aria-expanded','true');pos();rD();setTimeout(function(){var f=d.querySelector('.nt-i,.ntd-f button');if(f&&innerWidth>=900)f.focus({preventScroll:true})},60)}
function closeD(back){var d=$('ntfd');if(!d||!d.classList.contains('o'))return;d.classList.remove('o');$('ntfbd').classList.remove('o');document.body.classList.remove('nt-o');if(bell){bell.setAttribute('aria-expanded','false');if(back)bell.focus()}}
/* page */
function rNP(){var v=$('notifv');if(!v||!document.body.classList.contains('vn'))return;var all=forUser(),cnt={};CATS.forEach(function(c){cnt[c[0]]=all.filter(function(n){return c[0]=='all'||(c[0]=='unread'?!isRead(n):typ(n).cat==c[0])}).length});
var l=all.filter(function(n){return PG.f=='all'||(PG.f=='unread'?!isRead(n):typ(n).cat==PG.f)}),sh=l.slice(0,PG.n),un=cnt.unread;
v.innerHTML='<div class="ntp"><div class="ntp-h"><button type="button" class="ntp-bk" data-nt="pback" aria-label="'+L('Back','পেছনে')+'">'+svg('back')+'</button><h1>'+L('Notifications','নোটিফিকেশন')+'</h1><button type="button" class="ntp-ma" data-nt="all"'+(un?'':' disabled')+'>'+svg('check')+'<span>'+L('Mark all as read','সব পঠিত')+'</span></button></div><div class="ntp-tabs" role="tablist" aria-label="'+L('Filter','ফিল্টার')+'">'+CATS.map(function(c){return '<button type="button" role="tab" aria-selected="'+(PG.f==c[0])+'" class="'+(PG.f==c[0]?'on':'')+'" data-nt="f" data-f="'+c[0]+'">'+L(c[1],c[2])+'<i>'+cnt[c[0]]+'</i></button>'}).join('')+'</div><div class="ntp-c" role="list">'+(sh.length?sh.map(function(n){return itemH(n)}).join(''):emptyH(PG.f))+'</div>'+(l.length>sh.length?'<div class="ntp-mo"><button type="button" data-nt="more">'+L('Load more','আরও দেখুন')+' ('+(l.length-sh.length)+')</button></div>':'')+'</div>'}
function openNP(){closeD();closeAll();closeProf();closeOrd();closeShops();closePD();if(window.cpS&&cpS.o)closeCP();PG={f:'all',n:10};document.body.classList.add('vn');rNP();try{history.pushState({n:1},'','#notifications')}catch(e){}window.scrollTo(0,0)}
function closeNP(){document.body.classList.remove('vn')}
window.closeNtfP=closeNP;
/* events */
document.addEventListener('click',function(e){
var b=e.target.closest('.ic[aria-haspopup="dialog"],.ic.ntf');if(b&&b===bell){e.preventDefault();var d=$('ntfd');d&&d.classList.contains('o')?closeD(true):openD();return}
var t=e.target.closest('[data-nt]');var host=e.target.closest('#ntfd,#notifv');
if(!t||!host){var d2=$('ntfd');if(d2&&d2.classList.contains('o')&&!e.target.closest('#ntfd')&&!(bell&&bell.contains(e.target)))closeD();var item0=e.target.closest('#ntfd .nt-i,#notifv .nt-i');if(!item0)return;open1(item0.dataset.nid);return}
var a=t.dataset.nt,it=t.closest('.nt-i'),id=it&&it.dataset.nid;
if(a=='close')closeD(true);
else if(a=='all'){markAll()}
else if(a=='page'){openNP()}
else if(a=='pback'){NAV.back()}
else if(a=='f'){PG.f=t.dataset.f;PG.n=10;rNP()}
else if(a=='more'){PG.n+=10;rNP()}
else if(a=='read'){e.stopPropagation();stU(who()).read[id]=1;save()}
else if(a=='del'){e.stopPropagation();if(it){it.classList.add('out');setTimeout(function(){stU(who()).del[id]=1;save()},180)}}
else if(a=='go'){e.stopPropagation();open1(id)}});
document.addEventListener('keydown',function(e){if(e.key=='Escape'){var d=$('ntfd');if(d&&d.classList.contains('o'))closeD(true)}
if((e.key=='Enter'||e.key==' ')&&e.target.classList&&e.target.classList.contains('nt-i')&&e.target.closest('#ntfd,#notifv')){e.preventDefault();open1(e.target.dataset.nid)}});
window.addEventListener('resize',function(){pos();rD()});
window.addEventListener('popstate',function(){if(document.body.classList.contains('vn')&&!(history.state&&history.state.n)){closeNP();setTab(0)}});
/* refresh */
function refresh(ext){var c=setBadge();if(prevU>=0&&c>prevU){var last=forUser().filter(function(n){return !isRead(n)})[0];var d=$('ntfd');if(last&&!(d&&d.classList.contains('o')))msg(T2(last.title));if(live)live.textContent=L('New notification','নতুন নোটিফিকেশন')+': '+(last?T2(last.title):'')}prevU=c;
rD();rNP();if(window.NBN&&NBN.adList)NBN.adList()}
function init(){var ics=document.querySelectorAll('.icons .ic:not(.hcart)');bell=ics[ics.length-1];if(!bell)return;bell.classList.add('ntf');bell.setAttribute('aria-expanded','false');live=document.createElement('div');live.className='sr-only';live.setAttribute('aria-live','polite');document.body.appendChild(live);applyOv();userIn();setBadge();prevU=unreadN();
setInterval(function(){refresh()},30000)}
/* ======================= ADMIN: NOTIFICATION MANAGEMENT ======================= */
var N={sub:'list',f:'all',q:'',edit:null,img:'',aud:'all',sel:[],sc:false,cf:null};
var DST=[['','No destination','কোনো গন্তব্য নেই'],['orders','My Orders page','অর্ডার পেজ'],['order','A specific order','নির্দিষ্ট অর্ডার'],['profile','Account settings','অ্যাকাউন্ট সেটিংস'],['wishlist','Wishlist','উইশলিস্ট'],['cart','Cart','কার্ট'],['support','Live support chat','লাইভ সাপোর্ট চ্যাট'],['shops','All shops','সব দোকান'],['home','Home page','হোম পেজ'],['product','A product','একটি পণ্য'],['custom','Custom URL','কাস্টম URL']];
function catalog(){var seen={},out=[];['min'].forEach(function(v){V[v].hot.concat(V[v].best).forEach(function(p){var n=enName(p[1]);if(!seen[n]){seen[n]=1;out.push(n)}})});return out.sort()}
function admUsers(){try{return JSON.parse(localStorage.getItem('nb_users')||'[]')}catch(e){return USERS}}
function audLabel(n){if(n.aud.mode=='all')return L('All customers','সব কাস্টমার');var us=admUsers(),ids=n.aud.ids||[];if(ids.length==1){var u=us.filter(function(x){return x.id==ids[0]})[0];return u?u.name:(ids[0].indexOf('g_')==0?L('Guest','গেস্ট'):ids[0])}return ids.length+' '+L('customers','কাস্টমার')}
function readCount(n){var c=0;for(var u in D.st)if(D.st[u].read[n.id])c++;return c}
function fdt(ts){try{return new Date(ts).toLocaleString(lang=='en'?'en-GB':'bn-BD',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}catch(e){return ''}}
function rSub(){var r=$('anroot');if(!r)return;r.querySelectorAll('[data-an=sub]').forEach(function(b){b.classList.toggle('on',b.dataset.s==N.sub)});['list','form','orders'].forEach(function(s){var e=$('an-'+s);if(e)e.style.display=N.sub==s?'':'none'})}
function adRender(force){var v=$('adn');if(!v)return;if(!force&&$('anroot'))return;
v.innerHTML='<div class="an" id="anroot"><div class="an-top"><div class="an-sub" role="tablist"><button type="button" data-an="sub" data-s="list">'+svg('bell')+L('Notifications','নোটিফিকেশন')+'</button><button type="button" data-an="sub" data-s="form">'+svg('plus')+'<span id="an-ft">'+L('Create','তৈরি করুন')+'</span></button><button type="button" data-an="sub" data-s="orders">'+svg('box')+L('Order status','অর্ডার স্ট্যাটাস')+'</button></div></div><div class="an-bd"><section id="an-list"></section><section id="an-form"></section><section id="an-orders"></section></div></div>';
rSub();adList();rForm();rOrders()}
function adList(){var host=$('an-list');if(!host||N.sub!='list'&&host.innerHTML)return;var q=N.q.toLowerCase().trim(),now=Date.now();
var F=[['all','All','সব'],['sent','Sent','পাঠানো'],['sched','Scheduled','নির্ধারিত'],['order','Orders','অর্ডার'],['offer','Offers','অফার'],['account','Account','অ্যাকাউন্ট'],['support','Support','সাপোর্ট']];
var l=D.items.slice().sort(function(a,b){return atOf(b)-atOf(a)}).filter(function(n){var sc=atOf(n)>now,c=typ(n).cat;if(N.f=='sent'&&sc)return false;if(N.f=='sched'&&!sc)return false;if(['order','offer','account','support'].indexOf(N.f)>-1&&c!=N.f)return false;return !q||(T2(n.title)+' '+T2(n.msg)+' '+audLabel(n)).toLowerCase().indexOf(q)>-1});
var keep=document.activeElement&&document.activeElement.id=='anq';
host.innerHTML='<div class="an-tb"><input id="anq" type="search" placeholder="'+L('Search notifications…','নোটিফিকেশন খুঁজুন…')+'" value="'+esc(N.q)+'" aria-label="Search"><button type="button" class="an-new" data-an="new">'+svg('plus')+'<span>'+L('New notification','নতুন নোটিফিকেশন')+'</span></button></div><div class="an-fl">'+F.map(function(f){return '<button type="button" class="'+(N.f==f[0]?'on':'')+'" data-an="flt" data-f="'+f[0]+'">'+L(f[1],f[2])+'</button>'}).join('')+'</div><div class="an-ls">'+(l.length?l.map(function(n){var T=typ(n),sc=atOf(n)>now;return '<div class="an-it"><div class="nt-ic t-'+T.tone+'">'+(n.img?'<img src="'+esc(n.img)+'" alt="">':svg(n.icon||T.ic))+'</div><div class="an-ib"><div class="an-t"><b>'+esc(T2(n.title))+'</b><s class="'+(sc?'sc':'sn')+'">'+(sc?svg('cal')+L('Scheduled · ','নির্ধারিত · ')+fdt(atOf(n)):L('Sent · ','পাঠানো · ')+fdt(atOf(n)))+'</s></div><p>'+esc(T2(n.msg))+'</p><div class="an-mt"><span>'+L(T.en,T.bn)+'</span><span>'+uic('users')+' '+esc(audLabel(n))+'</span>'+(sc?'':'<span>'+uic('eye')+' '+L('Read by ','পড়েছেন ')+readCount(n)+'</span>')+(n.by=='system'?'<span>'+L('Automatic','অটোমেটিক')+'</span>':'')+(n.url?'<span>↗ '+esc(n.url.length>26?n.url.slice(0,25)+'…':n.url)+'</span>':'')+'</div></div><div class="an-ac"><button type="button" data-an="edit" data-id="'+n.id+'" aria-label="'+L('Edit','এডিট')+'" title="'+L('Edit','এডিট')+'">'+svg('edit')+'</button><button type="button" class="dl" data-an="del" data-id="'+n.id+'" aria-label="'+L('Delete','মুছুন')+'" title="'+L('Delete','মুছুন')+'">'+svg('trash')+'</button></div></div>'}).join(''):'<div class="nt-em"><div>'+svg('bell')+'</div><b>'+L('No notifications','কোনো নোটিফিকেশন নেই')+'</b><p>'+L('Create one, or change an order status to generate automatic notifications.','নতুন তৈরি করুন, অথবা অর্ডার স্ট্যাটাস বদলে অটো নোটিফিকেশন তৈরি করুন।')+'</p></div>')+'</div>';
if(keep){var i=$('anq');i.focus();i.setSelectionRange(i.value.length,i.value.length)}}
function dstParse(u){if(!u)return['',''];if(/^https?:/i.test(u))return['custom',u];var p=u.split(':'),k=p[0],a=p.slice(1).join(':');if(['order','product'].indexOf(k)>-1)return[k,a];if(k=='support')return['support',''];return[k,'']}
function rForm(){var host=$('an-form');if(!host)return;var e=N.edit?D.items.filter(function(x){return x.id==N.edit})[0]:null;if(N.edit&&!e){N.edit=null}
var dp=e?dstParse(e.url):['',''],us=admUsers(),t=e?e.type:'offer_flash';
N.img=e?e.img||'':N.img;if(e){N.aud=e.aud.mode=='all'?'all':(e.aud.ids.length==1?'one':'selected');N.sel=e.aud.ids.slice();N.sc=atOf(e)>Date.now()}
var ft=$('an-ft');if(ft)ft.textContent=e?L('Edit','এডিট'):L('Create','তৈরি করুন');
var sdt=e&&atOf(e)>Date.now()?new Date(atOf(e)-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,16):'';
var dtv=(function(){var d=new Date(Date.now()+36e5);d.setMinutes(0,0,0);return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,16)})();
host.innerHTML='<div class="an-fw"><div class="an-fc"><h3>'+(e?L('Edit notification','নোটিফিকেশন এডিট করুন'):L('Create notification','নতুন নোটিফিকেশন'))+'</h3>'
+'<label for="anty">'+L('Notification type','ধরন')+'</label><select id="anty">'+GRP.map(function(g){return '<optgroup label="'+L(g[1],g[2])+'">'+Object.keys(TY).filter(function(k){return TY[k].cat==g[0]}).map(function(k){return '<option value="'+k+'"'+(k==t?' selected':'')+'>'+L(TY[k].en,TY[k].bn)+'</option>'}).join('')+'</optgroup>'}).join('')+'</select>'
+'<label>'+L('Send to','কাকে পাঠাবেন')+'</label><div class="an-seg" role="radiogroup">'+[['all','All customers','সব কাস্টমার'],['selected','Selected customers','নির্বাচিত'],['one','Specific customer','একজন']].map(function(a){return '<button type="button" role="radio" aria-checked="'+(N.aud==a[0])+'" class="'+(N.aud==a[0]?'on':'')+'" data-an="aud" data-v="'+a[0]+'">'+L(a[1],a[2])+'</button>'}).join('')+'</div>'
+'<div id="anaw" style="display:'+(N.aud=='all'?'none':'')+'">'+(N.aud=='one'?'<select id="anone">'+us.map(function(u){return '<option value="'+u.id+'"'+(N.sel[0]==u.id?' selected':'')+'>'+esc(u.name)+' · '+esc(u.mobile||u.email)+'</option>'}).join('')+'</select>':'<input id="anus" type="search" placeholder="'+L('Search customers…','কাস্টমার খুঁজুন…')+'"><div class="an-us" id="anul">'+us.map(function(u){return '<label><input type="checkbox" value="'+u.id+'"'+(N.sel.indexOf(u.id)>-1?' checked':'')+'> <span>'+esc(u.name)+'</span><small>'+esc(u.mobile||u.email)+'</small></label>'}).join('')+'</div>')+'</div>'
+'<label for="ant">'+L('Title','শিরোনাম')+'</label><input id="ant" maxlength="80" placeholder="'+L('e.g. Flash Sale – up to 50% off','যেমন: ফ্ল্যাশ সেল – ৫০% পর্যন্ত ছাড়')+'" value="'+esc(e?T2(e.title):'')+'">'
+'<label for="anm">'+L('Message','বার্তা')+' <small id="anmc"></small></label><textarea id="anm" rows="3" maxlength="240" placeholder="'+L('Short message shown to the customer','কাস্টমারকে যে ছোট বার্তা দেখানো হবে')+'">'+esc(e?T2(e.msg):'')+'</textarea>'
+'<label>'+L('Image / icon (optional)','ছবি / আইকন (ঐচ্ছিক)')+'</label><div class="an-im"><span class="an-ip" id="anip">'+(N.img?'<img src="'+esc(N.img)+'" alt="">':svg('img'))+'</span><button type="button" data-an="img">'+L('Upload image','ছবি আপলোড')+'</button><button type="button" class="ghost" data-an="imgx" id="anix" style="display:'+(N.img?'':'none')+'">'+L('Remove','সরান')+'</button><input type="file" id="anfile" accept="image/*" hidden></div>'
+'<div class="an-two"><div><label for="anbl">'+L('Action button label','অ্যাকশন বাটনের লেখা')+'</label><input id="anbl" maxlength="24" placeholder="'+L('e.g. Shop now','যেমন: এখনই কিনুন')+'" value="'+esc(e?T2(e.btn):'')+'"></div><div><label for="ands">'+L('Destination page','গন্তব্য পেজ')+'</label><select id="ands">'+DST.map(function(d){return '<option value="'+d[0]+'"'+(d[0]==dp[0]?' selected':'')+'>'+L(d[1],d[2])+'</option>'}).join('')+'</select></div></div>'
+'<div id="andx"></div>'
+'<label>'+L('When to send','কখন পাঠাবেন')+'</label><div class="an-seg"><button type="button" class="'+(N.sc?'':'on')+'" data-an="when" data-v="0">'+L('Send now','এখনই পাঠান')+'</button><button type="button" class="'+(N.sc?'on':'')+'" data-an="when" data-v="1">'+svg('cal')+L('Schedule','শিডিউল')+'</button></div><div id="anscw" style="display:'+(N.sc?'':'none')+'"><input type="datetime-local" id="ansc" value="'+(sdt||dtv)+'"></div>'
+'<div class="an-er" id="aner" role="alert"></div><div class="an-bt">'+(e?'<button type="button" class="ghost" data-an="cancel">'+L('Cancel','বাতিল')+'</button>':'')+'<button type="button" class="pri" data-an="save" id="ansv"></button></div></div>'
+'<aside class="an-pv"><h4>'+L('Customer preview','কাস্টমারের প্রিভিউ')+'</h4><div class="an-pc" id="anpv"></div><p class="an-hint">'+L('Unread notifications show a blue dot and the bell badge count updates instantly.','অপঠিত নোটিফিকেশনে নীল ডট থাকে এবং বেলের ব্যাজ সংখ্যা সাথে সাথে বদলায়।')+'</p></aside></div>';
dstExtra(dp);anPrev()}
function dstExtra(dp){var s=$('ands'),x=$('andx');if(!s||!x)return;var k=s.value,dp=dp||['',''];
x.innerHTML=k=='order'?'<label for="anx">'+L('Order ID','অর্ডার আইডি')+'</label><input id="anx" list="anol" placeholder="NBM-482915" value="'+esc(dp[0]=='order'?dp[1]:'')+'"><datalist id="anol">'+(window.ORD_DEMO||[]).map(function(o){return '<option value="'+o.id+'">'}).join('')+'</datalist>':k=='product'?'<label for="anx">'+L('Product','পণ্য')+'</label><select id="anx">'+catalog().map(function(n){return '<option'+(dp[0]=='product'&&dp[1]==n?' selected':'')+'>'+esc(n)+'</option>'}).join('')+'</select>':k=='custom'?'<label for="anx">URL</label><input id="anx" placeholder="https://" value="'+esc(dp[0]=='custom'?dp[1]:'')+'">':''}
function anUrl(){var k=$('ands').value,x=$('anx')?$('anx').value.trim():'';if(!k)return'';if(k=='order')return x?'order:'+x.toUpperCase():'';if(k=='product')return x?'product:'+x:'';if(k=='custom')return x;if(k=='support')return 'support:';return k}
function anPrev(){var p=$('anpv');if(!p)return;var ty=$('anty').value,fake={id:'pv',type:ty,title:$('ant').value||L('Notification title','নোটিফিকেশনের শিরোনাম'),msg:$('anm').value||L('Your short message appears here.','আপনার ছোট বার্তা এখানে দেখা যাবে।'),img:N.img,btn:$('anbl').value.trim(),aud:{mode:'all'},created:Date.now()};p.innerHTML=itemH(fake,{noact:true,when:L('Just now','এখনই')}).replace('nt-i','nt-i un');var c=$('anmc');if(c)c.textContent=$('anm').value.length+'/240';var sv=$('ansv');if(sv)sv.textContent=N.edit?L('Save changes','পরিবর্তন সেভ করুন'):N.sc?L('Schedule notification','শিডিউল করুন'):L('Send notification','নোটিফিকেশন পাঠান')}
function anSave(){var E=function(t){$('aner').textContent=t;return false},title=$('ant').value.trim(),m=$('anm').value.trim(),bl=$('anbl').value.trim(),url=anUrl(),k=$('ands').value;
if(title.length<2)return E(L('Please enter a title','শিরোনাম লিখুন'));if(m.length<2)return E(L('Please enter a message','বার্তা লিখুন'));
var ids=[];if(N.aud=='one'){ids=[$('anone')?$('anone').value:''];if(!ids[0])return E(L('Select a customer','একজন কাস্টমার বেছে নিন'))}else if(N.aud=='selected'){document.querySelectorAll('#anul input:checked').forEach(function(c){ids.push(c.value)});if(!ids.length)return E(L('Select at least one customer','অন্তত একজন কাস্টমার বেছে নিন'))}
if(k=='order'&&!url)return E(L('Enter an order ID','অর্ডার আইডি দিন'));if(k=='custom'&&!/^https?:\/\/[^\s]+\.[^\s]+/i.test(url))return E(L('Enter a valid URL starting with http(s)://','http(s):// দিয়ে শুরু সঠিক URL দিন'));if(bl&&!url)return E(L('Choose a destination for the action button','অ্যাকশন বাটনের জন্য গন্তব্য বেছে নিন'));
var sendAt=0;if(N.sc){var d=new Date($('ansc').value).getTime();if(!d||d<Date.now()+30000)return E(L('Choose a future date and time','ভবিষ্যতের তারিখ ও সময় দিন'));sendAt=d}
var aud=N.aud=='all'?{mode:'all',ids:[]}:{mode:'users',ids:ids},e=N.edit?D.items.filter(function(x){return x.id==N.edit})[0]:null;
if(e){e.type=$('anty').value;e.title=title;e.msg=m;e.img=N.img;e.btn=bl;e.url=url;e.aud=aud;e.sendAt=sendAt;e.edited=Date.now();save()}
else create({type:$('anty').value,title:title,msg:m,img:N.img,btn:bl,url:url,aud:aud,sendAt:sendAt,by:'admin'});
msg(e?L('Notification updated','নোটিফিকেশন আপডেট হয়েছে'):sendAt?L('Notification scheduled','নোটিফিকেশন শিডিউল হয়েছে'):L('Notification sent','নোটিফিকেশন পাঠানো হয়েছে'));N.edit=null;N.img='';N.sub='list';N.sel=[];N.aud='all';N.sc=false;rForm();rSub();adList()}
function rOrders(){var host=$('an-orders');if(!host)return;var os=window.ORD_DEMO||[],keep=host.querySelector('#aoo')?host.querySelector('#aoo').value:'';
var ST=[['placed','Order placed','অর্ডার হয়েছে'],['confirmed','Confirmed','কনফার্মড'],['processing','Processing','প্রসেসিং'],['shipped','Shipped','শিপড'],['out','Out for delivery','ডেলিভারির পথে'],['delivered','Delivered','ডেলিভারড'],['cancelled','Cancelled','বাতিল'],['pay_ok','Payment successful (notify only)','পেমেন্ট সফল (শুধু নোটিফিকেশন)'],['pay_fail','Payment failed (notify only)','পেমেন্ট ব্যর্থ (শুধু নোটিফিকেশন)'],['refund','Refund processed (notify only)','রিফান্ড (শুধু নোটিফিকেশন)']];
function cur(o){return o.s=='d'?L('Delivered','ডেলিভারড'):o.s=='c'?L('Cancelled','বাতিল'):L('In progress','চলমান')+' · '+['Placed','Packed','On the way','Delivered'][o.step||0]}
host.innerHTML='<div class="an-fw one"><div class="an-fc"><h3>'+L('Order status → automatic notification','অর্ডার স্ট্যাটাস → অটো নোটিফিকেশন')+'</h3><p class="an-hint">'+L('Changing an order status updates the customer\'s Orders page and creates a notification for the order owner automatically. On a live backend this runs on the server whenever the status changes.','অর্ডার স্ট্যাটাস বদলালে কাস্টমারের অর্ডার পেজ আপডেট হয় এবং অর্ডারের মালিকের জন্য নিজে থেকেই নোটিফিকেশন তৈরি হয়। আসল ব্যাকএন্ডে স্ট্যাটাস বদলালেই সার্ভারে এটি চলবে।')+'</p><label for="aoo">'+L('Order','অর্ডার')+'</label><select id="aoo">'+os.map(function(o){return '<option value="'+o.id+'"'+(o.id==keep?' selected':'')+'>#'+o.id+' · '+'Minutes'+' · '+cur(o)+'</option>'}).join('')+'</select><label for="aos">'+L('New status / event','নতুন স্ট্যাটাস / ইভেন্ট')+'</label><select id="aos">'+ST.map(function(s){return '<option value="'+s[0]+'">'+L(s[1],s[2])+'</option>'}).join('')+'</select><div class="an-er" id="aoe" role="status"></div><div class="an-bt"><button type="button" class="pri" data-an="ordgo">'+L('Apply & notify customer','প্রয়োগ করে কাস্টমারকে জানান')+'</button></div></div></div>'}
/* admin events */
document.addEventListener('click',function(e){var t=e.target.closest('[data-an]');if(!t||!t.closest('#admv'))return;var a=t.dataset.an;
if(a=='sub'){N.sub=t.dataset.s;if(N.sub=='list')adList();if(N.sub=='orders')rOrders();rSub()}
else if(a=='new'){N.edit=null;N.img='';N.aud='all';N.sel=[];N.sc=false;N.sub='form';rForm();rSub()}
else if(a=='flt'){N.f=t.dataset.f;adList()}
else if(a=='edit'){N.edit=t.dataset.id;N.sub='form';rForm();rSub()}
else if(a=='cancel'){N.edit=null;N.sub='list';rForm();rSub();adList()}
else if(a=='del'){if(t.dataset.arm){var i=t.dataset.id;D.items=D.items.filter(function(x){return x.id!=i});save();msg(L('Notification deleted','নোটিফিকেশন মুছে ফেলা হয়েছে'))}else{t.dataset.arm=1;t.classList.add('arm');t.title=L('Click again to confirm','নিশ্চিত করতে আবার ক্লিক করুন');t.innerHTML=svg('trash')+'<em>'+L('Confirm?','নিশ্চিত?')+'</em>';setTimeout(function(){if(t.isConnected){delete t.dataset.arm;t.classList.remove('arm');t.innerHTML=svg('trash')}},3000)}}
else if(a=='aud'){N.aud=t.dataset.v;N.sel=N.aud=='one'?N.sel.slice(0,1):N.sel;var s0=[];document.querySelectorAll('#anul input:checked').forEach(function(c){s0.push(c.value)});if(s0.length)N.sel=s0;rForm2()}
else if(a=='when'){N.sc=t.dataset.v=='1';var w=$('anscw');w.style.display=N.sc?'':'none';document.querySelectorAll('[data-an=when]').forEach(function(b){b.classList.toggle('on',b===t)});anPrev()}
else if(a=='img')$('anfile').click();
else if(a=='imgx'){N.img='';$('anip').innerHTML=svg('img');$('anix').style.display='none';anPrev()}
else if(a=='save')anSave();
else if(a=='ordgo'){var id=$('aoo').value,ev=$('aos').value,r=orderEvent(id,ev);rOrders();$('aoo').value=id;var er=$('aoe');er.className='an-er ok';er.textContent=r?L('Done. Customer notified: ','হয়েছে। কাস্টমারকে জানানো হয়েছে: ')+T2(r.title):''}});
function rForm2(){var keep={ty:$('anty').value,t:$('ant').value,m:$('anm').value,bl:$('anbl').value,ds:$('ands').value,x:$('anx')?$('anx').value:'',sc:$('ansc').value};var ed=N.edit;N.edit=null;var im=N.img;rForm();N.edit=ed;N.img=im;$('anty').value=keep.ty;$('ant').value=keep.t;$('anm').value=keep.m;$('anbl').value=keep.bl;$('ands').value=keep.ds;dstExtra([keep.ds,keep.x]);if($('anx')&&keep.x)$('anx').value=keep.x;$('ansc').value=keep.sc;$('anip').innerHTML=im?'<img src="'+esc(im)+'" alt="">':svg('img');$('anix').style.display=im?'':'none';anPrev();if(ed){$('ansv').textContent=L('Save changes','পরিবর্তন সেভ করুন');var h3=$('an-form').querySelector('h3');if(h3)h3.textContent=L('Edit notification','নোটিফিকেশন এডিট করুন')}}
document.addEventListener('change',function(e){if(!e.target.closest('#admv'))return;if(e.target.id=='ands'){dstExtra();anPrev()}else if(e.target.id=='anty')anPrev();
else if(e.target.id=='anfile'){var f=e.target.files[0];e.target.value='';if(!f||!/^image\//.test(f.type))return;var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,160/Math.max(im.width,im.height)),cv=document.createElement('canvas');cv.width=Math.max(1,Math.round(im.width*s));cv.height=Math.max(1,Math.round(im.height*s));cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);N.img=cv.toDataURL('image/jpeg',.82);$('anip').innerHTML='<img src="'+N.img+'" alt="">';$('anix').style.display='';anPrev()};im.src=r.result};r.readAsDataURL(f)}});
document.addEventListener('input',function(e){if(!e.target.closest('#admv'))return;var id=e.target.id;if(id=='anq'){N.q=e.target.value;adList()}else if(['ant','anm','anbl','anx'].indexOf(id)>-1)anPrev();else if(id=='anus'){var q=e.target.value.toLowerCase();document.querySelectorAll('#anul label').forEach(function(l){l.style.display=l.textContent.toLowerCase().indexOf(q)>-1?'':'none'})}});
window.NBN={push:create,toUser:toUser,orderEvent:orderEvent,orderPlaced:function(id){return orderEvent(id,'placed')},account:account,userIn:userIn,support:support,supportResolved:supportResolved,readKey:readKey,refresh:function(){refresh()},adRender:adRender,adList:function(){if(N.sub=='list'&&$('anroot'))adList()},open:openNP,data:function(){return D},go:go};
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',init);else init();
if(location.hash=='#notifications')setTimeout(openNP,80);
})();

/* ===== SELLER (SHOP) PROFILE ===== */
(function(){
var SL={name:'',cat:'all',n:24,q:''},cache=null,nameCat=null;
var TE={food:'🍛',grocery:'🛒',med:'💊',elec:'🔌',fish:'🐟',meat:'🥩'};
var DESC={food:['Freshly cooked meals, biryani, snacks and more - prepared hot and delivered fast to your door.','টাটকা রান্না করা খাবার, বিরিয়ানি, স্ন্যাক্স ও আরও অনেক কিছু - গরম গরম দ্রুত আপনার দরজায়।'],
grocery:['Your neighbourhood store for fresh vegetables, fruits and daily groceries at fair prices.','সতেজ সবজি, ফল ও নিত্যপ্রয়োজনীয় মুদি পণ্য - ন্যায্য দামে আপনার পাড়ার দোকান।'],
med:['Genuine medicines and health essentials from a licensed pharmacy. Prescription advice available.','লাইসেন্সপ্রাপ্ত ফার্মেসি থেকে আসল ঔষধ ও স্বাস্থ্য সামগ্রী।'],
elec:['Phones, accessories, home electricals and gadgets with warranty and after-sales support.','ফোন, অ্যাক্সেসরিজ, ইলেকট্রিক্যাল সামগ্রী ও গ্যাজেট - ওয়ারেন্টিসহ।'],
fish:['Fresh river and sea fish, cleaned and cut on request. Delivered chilled.','নদী ও সমুদ্রের তাজা মাছ, চাইলে কেটে-ধুয়ে ঠান্ডা অবস্থায় পৌঁছে দেওয়া হয়।'],
meat:['Hygienic beef, mutton and chicken, cut the way you like and delivered fresh.','স্বাস্থ্যসম্মত গরু, খাসি ও মুরগির মাংস - পছন্দমতো কেটে তাজা পৌঁছে দেওয়া হয়।']};
var AREAS=['Mirpur 10, Dhaka','Dhanmondi, Dhaka','Uttara Sector 7, Dhaka','Mohammadpur, Dhaka','Gulshan 1, Dhaka','Banani, Dhaka','Badda, Dhaka','Rampura, Dhaka'];
function shop(n){return SH.filter(function(s){return s[0]==n})[0]||null}
function mi(){return CDS.min.en}
function catOf(p){var i=CEM.indexOf(p[0]);if(i>-1)return i;var n=enName(p[1]).toLowerCase(),nm=/onion|potato|tomato|carrot|spinach|brinjal|eggplant|gourd|cucumber|chili|garlic|ginger/.test(n)?'Vegetables':/apple|mango|grape|banana|orange|guava|jackfruit|papaya|fruit/.test(n)?'Fruits':'Grocery Store';var r=0;mi().forEach(function(c,j){if(c.n==nm)r=j});return r}
function typeOf(ci){var n=mi()[ci].n,r='grocery';Object.keys(SKC).forEach(function(t){if(SKC[t].indexOf(n)>-1)r=t});return r}
function all(){if(!cache){cache=catalog('min','all');nameCat={};cache.forEach(function(x){nameCat[enName(x.p[1])]=catOf(x.p)})}return cache}
var oldPd=window.pdShop;
window.pdShop=function(en,h){if(LSHOP[en])return LSHOP[en];if(LIVEONLY)return 'NurBuy';all();var ci=nameCat[en],t=ci==null?null:typeOf(ci);if(!t)return oldPd(en,h);var l=SH.filter(function(x){return x[2]==t});if(!l.length)l=SH;return l[h%l.length][0]};
function items(s){if(LIVEONLY)return liveItems(s,'min');var out=[];all().forEach(function(x){var en=enName(x.p[1]),ci=nameCat[en];if(typeOf(ci)!=s[2])return;if(window.pdShop(en,hs(en))==s[0]||hsh(en+s[0])%100<40)out.push({p:x.p,f:x.f,k:x.k,ci:ci})});return out}
function B(){return lang=='bn'}
function info(s){var h=hs(s[0]),nm=s[0];return{followers:800+h%9200,joined:2021+h%4,area:AREAS[h%AREAS.length],open:['7:00 AM – 11:00 PM','8:00 AM – 10:00 PM','9:00 AM – 11:30 PM','24 hours'][h%4],orders:(2+h%40)*100+h%97}}
function kfmt(n){return n>=1000?(n/1000).toFixed(1).replace(/\.0$/,'')+'k':String(n)}
var ICO={back:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',share:'<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.600 13.500l6.800 4M15.400 6.500l-6.800 4"/></svg>',heart:'<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.200-8-11a4.500 4.500 0 018-2.700A4.500 4.500 0 0120 10c0 5.800-8 11-8 11z"/></svg>',star:'<svg viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><path d="M12 2l3 6.500 7 .8-5.200 4.800 1.400 7L12 17.500 5.800 21l1.400-7L2 9.300l7-.8z"/></svg>',clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',pin:'<svg viewBox="0 0 24 24"><path d="M12 22s7-6.500 7-12a7 7 0 00-14 0c0 5.500 7 12 7 12z"/><circle cx="12" cy="10" r="2.500"/></svg>',truck:'<svg viewBox="0 0 24 24"><path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',box:'<svg viewBox="0 0 24 24"><path d="M4 8l8-5 8 5v10l-8 4-8-4zM4 8l8 4 8-4M12 12v10"/></svg>',users:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6s7 2 7 6M17 4a4 4 0 010 8M22 21c0-3-1.500-5-4-5.700"/></svg>',chk:'<svg viewBox="0 0 24 24"><path d="M5 12.500l4.500 4.500L19 7.500"/></svg>',srch:'<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>'};
function render(){var v=$('sellv');if(!v||!document.body.classList.contains('vl'))return;var s=shop(SL.name);if(!s)return;var b=B(),k=SK[s[2]],inf=info(s),its=items(s),LS=LIVE&&LSTO[s[0]],fav=LS?flOn(s[0]):!!FAV[s[0]],h=hs(s[0]),cst=shSt(s[0]),lfee=LS&&locBase('min')!=null?locBase('min'):s[7];
var cats=[];its.forEach(function(x){var f=cats.filter(function(c){return c.i==x.ci})[0];if(f)f.n++;else cats.push({i:x.ci,n:1})});cats.sort(function(a,b2){return b2.n-a.n});
var q=SL.q.trim().toLowerCase(),list=its.filter(function(x){return (SL.cat=='all'||x.ci==SL.cat)&&(!q||(enName(x.p[1])+' '+tx(x.p[1])).toLowerCase().indexOf(q)>-1)}),sh=list.slice(0,SL.n);
var covImg=IMG[s[0]+' Cover'],pat='';for(var i=0;i<16;i++){var r=(h>>(i%10))+i*37;pat+='<i style="left:'+((i*6.6+r%5)%98)+'%;top:'+(8+(r*7)%70)+'%;font-size:'+(26+r%26)+'px;transform:rotate('+((r%50)-25)+'deg);opacity:'+(.1+(r%10)/60).toFixed(2)+'">'+TE[s[2]]+'</i>'}
v.innerHTML='<div class="sl"><div class="sl-cv t-'+s[2]+'">'+(covImg?'<img class="sl-ci" src="'+esc(tU(covImg,960))+'" data-o="'+esc(covImg)+'" alt="" onerror="var o=this.dataset.o;if(o&&this.src!=o){this.src=o;return}this.remove()">':'<div class="sl-pat" aria-hidden="true">'+pat+'</div>')+'<div class="sl-sh"></div><button type="button" class="sl-bk" data-sl="back" aria-label="'+L('Back','পেছনে')+'">'+ICO.back+'</button><button type="button" class="sl-sb" data-sl="share" aria-label="'+L('Share','শেয়ার')+'">'+ICO.share+'</button></div>'
+'<div class="sl-hd"><div class="sl-av t-'+s[2]+'">'+PIC(IMG[s[0]],s[8],s[0])+'</div><div class="sl-in"><h1>'+esc(s[0])+'</h1><div class="sl-ow">'+L('Owner','মালিক')+': '+esc(s[1])+'</div><div class="sl-ch"><span class="sl-pl"><svg viewBox="0 0 24 24">'+k[2]+'</svg>'+(b?k[1]:k[0])+'</span>'+(LS?'<span class="sl-on'+(cst.open?'':' off')+'"><i></i>'+(cst.open?L('Open now','এখন খোলা'):shClosedLbl(cst))+'</span>':'<span class="sl-on"><i></i>'+L('Online','অনলাইন')+'</span>')+'<span class="sl-hm">'+L('Home Delivery','হোম ডেলিভারি')+'</span></div></div><div class="sl-ac"><button type="button" class="sl-fl'+(fav?' on':'')+'" data-sl="follow"'+(LS?' data-fln="'+esc(s[0])+'"':'')+' aria-pressed="'+fav+'">'+ICO.heart+'<span>'+(fav?L('Following','ফলো করছেন'):L('Follow','ফলো করুন'))+'</span></button></div></div>'
+'<div class="sl-st">'+(LIVEONLY?'':'<div><b>'+ICO.star+s[3].toFixed(1)+'</b><small>'+s[4]+' '+L('reviews','রিভিউ')+'</small></div>')+'<div><b>'+ICO.clock+(LS?'≤'+bnN(window.v2Eta?v2Eta():59):s[5])+'</b><small>'+L('minutes','মিনিট')+'</small></div>'+(LIVEONLY?'':'<div><b>'+ICO.pin+s[6]+'</b><small>'+L('km away','কিমি দূরে')+'</small></div>')+'<div><b>'+ICO.truck+'৳'+lfee+'</b><small>'+L('delivery fee','ডেলিভারি ফি')+'</small></div><div><b>'+ICO.box+its.length+'</b><small>'+L('products','পণ্য')+'</small></div>'+(LS?'<div><b>'+ICO.users+'<span data-flc="'+esc(s[0])+'">'+bnN(flCount(s[0]))+'</span></b><small>'+L('followers','ফলোয়ার')+'</small></div>':LIVEONLY?'':'<div><b>'+ICO.users+kfmt(inf.followers+(fav?1:0))+'</b><small>'+L('followers','ফলোয়ার')+'</small></div>')+'</div>'
+'<div class="sl-ab"><div class="sl-abt"><h3>'+L('About the shop','দোকান সম্পর্কে')+'</h3><p>'+(LIVEONLY?esc(LSABT[s[0]]||''):DESC[s[2]][b?1:0])+'</p></div>'+(LS?'<ul><li>'+ICO.clock+'<span>'+L('Today','আজ')+': '+esc(hrsToday(LSTO[s[0]].h))+'</span></li>'+(LSTO[s[0]].since?'<li>'+ICO.users+'<span>'+L('On NurBuy since ','NurBuy-তে আছেন ')+bnN(new Date(LSTO[s[0]].since*1000).getFullYear())+'</span></li>':'')+'</ul>':'')+(LIVEONLY?'':'<ul><li>'+ICO.clock+'<span>'+L('Open','খোলা')+': '+inf.open+'</span></li><li>'+ICO.pin+'<span>'+inf.area+'</span></li><li>'+ICO.users+'<span>'+L('On NurBuy since ','NurBuy-তে আছেন ')+inf.joined+'</span></li><li>'+ICO.box+'<span>'+inf.orders.toLocaleString('en-US')+'+ '+L('orders delivered','অর্ডার ডেলিভারি')+'</span></li></ul>')+'</div>'
+(cst.open?'':'<div class="sl-cb">'+ICO.clock+'<div><b>'+shClosedLbl(cst)+'</b><span>'+(cst.nx?esc(cst.nx)+'. ':'')+L('You can look at the products, but ordering opens again automatically when the shop opens.','পণ্য দেখতে পারবেন, দোকান খুললে আবার নিজে থেকেই অর্ডার নেওয়া শুরু হবে।')+'</span></div></div>')+'<div class="sl-pr"><div class="sl-pt"><h2>'+L('Products','পণ্য')+' <small>'+list.length+'</small></h2><label class="sl-q">'+ICO.srch+'<input id="slq" type="search" placeholder="'+L('Search in this shop','এই দোকানে খুঁজুন')+'" value="'+esc(SL.q)+'" aria-label="'+L('Search in this shop','এই দোকানে খুঁজুন')+'"></label></div>'
+'<div class="sl-cats" role="tablist" aria-label="'+L('Categories','ক্যাটাগরি')+'"><button type="button" role="tab" aria-selected="'+(SL.cat=='all')+'" class="'+(SL.cat=='all'?'on':'')+'" data-sl="cat" data-c="all">'+L('All Categories','সব ক্যাটাগরি')+'<i>'+its.length+'</i></button>'+cats.map(function(c){return '<button type="button" role="tab" aria-selected="'+(SL.cat===c.i)+'" class="'+(SL.cat===c.i?'on':'')+'" data-sl="cat" data-c="'+c.i+'">'+CDS.min[lang][c.i].n+'<i>'+c.n+'</i></button>'}).join('')+'</div>'
+(sh.length?'<div class="ag sl-g" id="slg">'+sh.map(function(x){return card(x.p,x.f,x.k)}).join('')+'</div>'+(list.length>sh.length?'<div class="am"><button type="button" data-sl="more">'+L('Load More','আরও দেখুন')+' ('+Math.min(list.length-sh.length,24)+')</button></div>':''):'<div class="sl-em"><div>'+uic('bag')+'</div><p>'+L('No products found','কোনো পণ্য পাওয়া যায়নি')+'</p></div>')+'</div></div>';
if(SL.keep){var i2=$('slq');if(i2){i2.focus();i2.setSelectionRange(i2.value.length,i2.value.length)}SL.keep=0}}

function open(n,noPush,pk){var s=shop(n);if(!s)return;var fromPD=pk||document.body.classList.contains('vd')&&typeof PDS!='undefined'?PDS.k:null;closeAll();closeProf();closeOrd();closePD();if(window.cpS&&cpS.o)closeCP();['closeWish','closeCart','closeAuth','closeAdm','closeNtfP'].forEach(function(f){if(window[f])window[f]()});
SL={name:s[0],cat:'all',n:24,q:'',from:fromPD};document.body.classList.add('vl');render();if(!noPush){try{history.pushState({l:1},'','#shop/'+encodeURIComponent(s[0]))}catch(e){}}window.scrollTo(0,0)}
function toPD(f){if(typeof PDS!='undefined'&&PDS.k==f){document.body.classList.add('vd');renderPD();window.scrollTo(0,0)}else if(window.openPD)openPD(f)}
function close(){if(document.body.classList.contains('vl')){SL.back=SL.from;SL.from=null;setTimeout(function(){SL.back=null},0)}document.body.classList.remove('vl')}
window.openSeller=open;window.closeSeller=close;window.renderSeller=render;
document.addEventListener('click',function(e){
var t=e.target.closest('#sellv [data-sl]');
if(t){var a=t.dataset.sl;
if(a=='back'){NAV.back()}
else if(a=='follow'){if(LIVE&&LSTO[SL.name]){flToggle(SL.name);return}FAV[SL.name]=!FAV[SL.name];render();msg(FAV[SL.name]?L('You are now following ','এখন ফলো করছেন ')+SL.name:L('Unfollowed','ফলো বাদ দিয়েছেন'))}
else if(a=='share'){var u=location.href.split('#')[0]+'#shop/'+encodeURIComponent(SL.name);try{if(navigator.share){navigator.share({title:SL.name+' - NurBuy',url:u});return}}catch(x){}try{navigator.clipboard.writeText(u).then(function(){msg(L('Link copied','লিংক কপি হয়েছে'))},function(){msg(u)})}catch(x){msg(u)}}
else if(a=='cat'){SL.cat=t.dataset.c=='all'?'all':+t.dataset.c;SL.n=24;render();var c=document.querySelector('#sellv .sl-pr');if(c){var y=c.getBoundingClientRect().top+scrollY-(innerWidth<900?8:80);if(scrollY>y)window.scrollTo({top:y,behavior:'smooth'})}}
else if(a=='more'){SL.n+=24;render()}
return}
if(e.target.closest('.hr,#sellv'))return;
var sc=e.target.closest('.shop');if(sc){var nm=sc.dataset.sn;if(nm){e.preventDefault();open(nm)}}});
document.addEventListener('keydown',function(e){if((e.key=='Enter'||e.key==' ')&&e.target.classList&&e.target.classList.contains('shop')&&e.target.dataset.sn){e.preventDefault();open(e.target.dataset.sn)}});
document.addEventListener('input',function(e){if(e.target.id=='slq'){SL.q=e.target.value;SL.n=24;SL.keep=1;render()}});
window.addEventListener('popstate',function(){if(document.body.classList.contains('vl')&&!(history.state&&history.state.l))close()});
var m=location.hash.match(/^#shop\/(.+)$/);if(m)setTimeout(function(){try{open(decodeURIComponent(m[1]),true)}catch(e){}},120);
})();


/* ===== BROWSING HISTORY PAGE ===== */
(function(){
var n=60;
function kv(k){return k.indexOf('new')==0?'new':'min'}
function render(){var v=$('histv');if(!v||!document.body.classList.contains('vh'))return;
var list=H;
v.innerHTML='<div class="hv"><div class="hv-top"><button type="button" class="hv-bk" data-hv="back" aria-label="'+L('Back','পেছনে')+'"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><h1>'+L('Browsing History','ব্রাউজিং হিস্টরি')+'<small>'+H.length+'</small></h1>'+(H.length?'<button type="button" class="hv-cl" data-hv="clear">'+L('Clear all','সব মুছুন')+'</button>':'')+'</div>'
+(list.length?'<div class="ag" id="hvg">'+list.slice(0,n).map(function(o){return card(o.p,0,kv(o.k))}).join('')+'</div>':'<div class="hv-em"><div>'+uic('clock')+'</div><p>'+(H.length?L('Nothing here yet','এখানে কিছু নেই'):L('No browsing history yet. Products you view will appear here.','এখনো কোনো ব্রাউজিং হিস্টরি নেই। আপনি যে পণ্য দেখবেন তা এখানে জমা হবে।'))+'</p><button type="button" data-hv="shop">'+L('Start shopping','কেনাকাটা শুরু করুন')+'</button></div>')+'</div>'}
function open(){closeAll();closeProf();closeOrd();closePD();if(window.cpS&&cpS.o)closeCP();['closeWish','closeCart','closeAuth','closeAdm','closeNtfP','closeSeller'].forEach(function(f){if(window[f])window[f]()});
document.body.classList.add('vh');render();try{history.pushState({h:1},'','#history')}catch(e){}window.scrollTo(0,0)}
function close(){document.body.classList.remove('vh')}
window.openHist=open;window.closeHist=close;window.renderHist=render;
document.addEventListener('click',function(e){var b=e.target.closest('#histv [data-hv]');if(!b)return;
var a=b.dataset.hv;if(a=='back')NAV.back();else if(a=='clear'){H=[];saveH();histR();render();msg(L('History cleared','হিস্টরি মুছে ফেলা হয়েছে'))}else if(a=='shop'){close();goHome()}});
window.addEventListener('popstate',function(){if(document.body.classList.contains('vh')&&!(history.state&&history.state.h))close()});
var os=window.setLang;
if(location.hash=='#history')setTimeout(open,120);
})();

/* ===== ALL CATEGORIES PAGE ===== */
(function(){
var CS={i:null},AL={'Beauty & Fragrance':'Beauty','Home & Kitchen':'Home Appliances','Grocery':'Grocery Store'};
function B(){return document.body.classList.contains('vc')}
function img(i){var en=CDS[view].en[i].n,em=CEM[i],u;
if(view=='min'){var c=V.min.cats[i];u=c&&(c[2]||IMG[enName(c[1])])}u=u||IMG[en]||IMG[AL[en]||''];return PIC(u,em,en)}
function render(){var v=$('catsv');if(!v||!B())return;var A=CDS[view][lang]||CDS[view].en,n=A.length;
var bk='<button type="button" class="cv-bk" data-cv="back" aria-label="'+L('Back','পেছনে')+'"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>';
if(CS.i==null||!A[CS.i]){v.innerHTML='<div class="cv"><div class="cv-top">'+bk+'<h1>'+L('All Categories','সব ক্যাটাগরি')+'<small>'+n+'</small></h1></div><div class="cv-g">'+A.map(function(c,i){return '<button type="button" class="cv-t" data-cv="cat" data-i="'+i+'"><s>'+img(i)+'</s>'+c.n+'</button>'}).join('')+'</div></div>';return}
var c=A[CS.i];v.innerHTML='<div class="cv"><div class="cv-top">'+bk+'<h1>'+c.n+'</h1></div><div class="cv-sub"><div class="cv-hd"><s>'+img(CS.i)+'</s><div><b>'+c.n+'</b><small>'+c.g.length+' '+L('sub-categories','সাব-ক্যাটাগরি')+'</small></div></div><button type="button" class="cv-all" data-cv="all">'+L('View all in ','সব দেখুন: ')+c.n+' ›</button><div class="cv-grps">'
+c.g.map(function(g,gi){return '<div class="cv-grp"><button type="button" class="cv-gt" data-cv="grp" data-g="'+gi+'">'+g[0]+'<i>'+L('View all','সব দেখুন')+' ›</i></button><div class="cv-it">'+g[1].map(function(t,ti){return '<button type="button" data-cv="item" data-g="'+gi+'" data-t="'+ti+'">'+t+'</button>'}).join('')+'</div></div>'}).join('')+'</div></div></div>'}
function open(i){closeAll();closeProf();closeOrd();closePD();if(window.cpS&&cpS.o)closeCP();['closeWish','closeCart','closeAuth','closeAdm','closeNtfP','closeSeller','closeHist'].forEach(function(f){if(window[f])window[f]()});
CS.i=(i==null||i<0)?null:i;document.body.classList.add('vc');render();try{history.pushState({c:1},'','#categories')}catch(e){}window.scrollTo(0,0)}
function close(){document.body.classList.remove('vc');CS.i=null}
window.openCats=open;window.closeCats=close;window.renderCats=render;window.catsLevel=function(){return CS.i};
document.addEventListener('click',function(e){var b=e.target.closest('#catsv [data-cv]');if(!b)return;var a=b.dataset.cv;
if(a=='back')NAV.back();
else if(a=='cat'){CS.i=+b.dataset.i;render();window.scrollTo(0,0);try{history.pushState({c:2},'','#categories')}catch(x){}}
else if(a=='all')openCat(CS.i);else if(a=='grp')openCat(CS.i,+b.dataset.g);else if(a=='item')openCat(CS.i,+b.dataset.g,+b.dataset.t)});
window.addEventListener('popstate',function(){if(B()&&!(history.state&&history.state.c))close()});
if(location.hash=='#categories')setTimeout(function(){open()},120);
})();

/* ===== WEBSITE PAGES (About, Privacy, Return, Shipping): a full page of their own, not a popup ===== */
(function(){
var K=null;
function T(k){var P=POL[k];return P?P[0][lang=='bn'?1:0]:''}
function bodyHtml(k){var P=POL[k],t=P?String(P[1][lang=='bn'?1:0]||''):'';if(!t.trim())return '';return window.NBRich&&NBRich.isHtml(t)?NBRich.clean(t):'<p style="white-space:pre-line">'+esc(t)+'</p>'}
function render(){var v=$('polv');if(!v||!document.body.classList.contains('vpo'))return;
var h=bodyHtml(K);
var bd=K=='following'?folHtml():(h?'<article class="pgv-b nbrich">'+h+'</article>':'<div class="pgv-e">'+L('This page has no content yet.','এই পেজে এখনো কিছু লেখা হয়নি।')+'</div>');
v.innerHTML='<div class="pgv"><div class="pgv-hd"><button type="button" data-po="back" aria-label="'+L('Back','পেছনে')+'"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><h1>'+esc(T(K))+'</h1></div>'+bd+'</div>';
document.title=T(K)+' – '+((window.brandName&&brandName())||'NurBuy')}
/* Following: the shops this customer follows, each opens the shop */
function folHtml(){var ns=Object.keys(LSTO||{}).filter(function(n){return window.flOn&&flOn(n)});
if(!ns.length)return '<div class="pgv-e">'+L('You are not following any shop yet. Open a shop and tap Follow.','আপনি এখনো কোনো দোকান ফলো করেননি। কোনো দোকানে গিয়ে Follow চাপুন।')+'</div>';
return '<div class="fol-l">'+ns.map(function(n){var s=LSTO[n],st=window.shSt?shSt(n):{open:true},lg=LSLG&&LSLG[n];
return '<div class="fol-i" data-fs="'+esc(n)+'" role="link" tabindex="0"><span class="fol-lg">'+(lg?'<img src="'+esc(lg)+'" alt="" onerror="this.outerHTML=\''+esc(n.charAt(0))+'\'">':esc(n.charAt(0)))+'</span><div class="fol-t"><b>'+esc(n)+'</b><small>'+(s.cat?esc(s.cat)+' · ':'')+(st.open?L('Open now','এখন খোলা'):L('Closed','বন্ধ'))+' · '+bnN(+s.fl||0)+' '+L('followers','ফলোয়ার')+'</small></div><button type="button" class="fol-u" data-fu="'+esc(n)+'">'+L('Unfollow','আনফলো')+'</button></div>'}).join('')+'</div>'}
document.addEventListener('click',function(e){if(K!=='following')return;var u=e.target.closest('#polv [data-fu]');if(u){e.stopPropagation();flToggle(u.dataset.fu);return}var v=e.target.closest('#polv [data-fs]');if(v){var n=v.dataset.fs;close();openSeller(n)}},true);
document.addEventListener('keydown',function(e){if(K!=='following'||e.key!=='Enter')return;var v=e.target.closest&&e.target.closest('#polv [data-fs]');if(v){var n=v.dataset.fs;close();openSeller(n)}});
var _fp=window.flPaint;if(typeof _fp=='function')window.flPaint=function(){var r=_fp.apply(this,arguments);try{if(K==='following'&&document.body.classList.contains('vpo'))render()}catch(e){}return r};
var title0=document.title;
function open(k,noPush){if(!POL[k])return false;closeAll();closeProf();closeOrd();closePD();if(window.cpS&&cpS.o)closeCP();['closeWish','closeCart','closeAuth','closeAdm','closeNtfP','closeSeller','closeHist','closeCats'].forEach(function(f){if(window[f])window[f]()});
try{pmClose()}catch(e){}
K=k;if(k=='following'&&window.flMine)flMine();document.body.classList.add('vpo');render();if(!noPush){try{history.pushState({po:1},'','/page/'+k)}catch(e){}}window.scrollTo(0,0);return true}
function close(){if(!document.body.classList.contains('vpo'))return;document.body.classList.remove('vpo');K=null;document.title=title0}
window.openPolPage=open;window.closePolPage=close;window.renderPol=render;window.polKey=function(){return K};
document.addEventListener('click',function(e){var b=e.target.closest('#polv [data-po]');if(b&&b.dataset.po=='back')NAV.back()});
window.addEventListener('popstate',function(){var B=document.body.classList;if(B.contains('vpo')&&!(history.state&&history.state.po))close()});
var _sl2=setLang;setLang=function(){var r=_sl2.apply(this,arguments);try{render()}catch(e){}return r};
})();

/* ===== SEARCH: live suggestions + results page ===== */
(function(){
var inp=document.querySelector('.search input'),box=document.querySelector('.search'),btn=box&&box.querySelector('button'),dd=null,items=[],act=-1;
if(!inp)return;inp.id='hq';inp.setAttribute('autocomplete','off');inp.setAttribute('enterkeyhint','search');inp.setAttribute('role','combobox');inp.setAttribute('aria-expanded','false');inp.setAttribute('aria-controls','sgd');
var mode='p',shs=[];
function hay(p){var en=enName(p[1]),bn=typeof p[1]=='object'?p[1].bn:p[1];return (en+' '+bn+' '+(p[18]||'')).toLowerCase()}
function findShops(q){q=q.trim().toLowerCase();return SH.filter(function(x){return !q||String(x[0]).toLowerCase().indexOf(q)>-1}).sort(function(a,b){var A=String(a[0]).toLowerCase().indexOf(q)==0?0:1,B2=String(b[0]).toLowerCase().indexOf(q)==0?0:1;return A-B2})}
function tabs(){return '<div class="sg-m" role="tablist"><button type="button" role="tab" aria-selected="'+(mode=='p')+'" class="'+(mode=='p'?'on':'')+'" data-s="m" data-m="p">'+L('Search Product','প্রোডাক্ট সার্চ')+'</button><button type="button" role="tab" aria-selected="'+(mode=='s')+'" class="'+(mode=='s'?'on':'')+'" data-s="m" data-m="s">'+L('Search Shop','শপ সার্চ')+'</button></div>'}
function shRows(q){shs=findShops(q);var h='';shs.slice(0,8).forEach(function(x,i){var lg=window.LSLG&&LSLG[x[0]];h+='<button type="button" class="sg-p sg-s'+(i==act?' on':'')+'" data-s="sh" data-i="'+i+'" role="option"><span class="sg-i">'+(lg?'<img src="'+esc(lg)+'" alt="" style="width:100%;height:100%;object-fit:cover">':'<span style="font-size:20px">'+(x[8]||'🏪')+'</span>')+'</span><span class="sg-t">'+esc(x[0])+'</span><b>›</b></button>'});if(!shs.length)h+='<div class="sg-e">'+L('No shops found','কোনো শপ পাওয়া যায়নি')+'</div>';return h}
function setPh(){inp.placeholder=mode=='s'?L('Search shops by name','শপের নাম লিখে খুঁজুন'):(inp.getAttribute('data-ph0')||inp.placeholder)}
function find(q){q=q.trim().toLowerCase();if(!q)return [];var t=q.split(/\s+/);var out=[];catalog(view,'all').forEach(function(x){var h=hay(x.p);if(t.every(function(w){return h.indexOf(w)>-1}))out.push({x:x,s:(enName(x.p[1]).toLowerCase().indexOf(q)==0?0:1)})});out.sort(function(a,b){return a.s-b.s});return out.map(function(o){return o.x})}
window.searchItems=function(q){return find(q||'')};
function cats(q){q=q.trim().toLowerCase();if(!q||!window.CDS)return [];var A=CDS[view].en,Bn=CDS[view][lang],r=[];A.forEach(function(c,i){var n=(c.n+' '+Bn[i].n).toLowerCase();if(n.indexOf(q)>-1)r.push({i:i,gi:null,t:Bn[i].n});c.g.forEach(function(g,gi){var gn=(g[0]+' '+(Bn[i].g[gi]?Bn[i].g[gi][0]:'')).toLowerCase();if(gn.indexOf(q)>-1&&r.length<4)r.push({i:i,gi:gi,t:Bn[i].n+' › '+(Bn[i].g[gi]?Bn[i].g[gi][0]:g[0])})})});return r.slice(0,3)}
function ensure(){if(dd)return;dd=document.createElement('div');dd.id='sgd';dd.className='sgd';dd.setAttribute('role','listbox');box.appendChild(dd);
dd.addEventListener('mousedown',function(e){e.preventDefault()});
dd.addEventListener('click',function(e){var t=e.target.closest('[data-s]');if(!t)return;var a=t.dataset.s;
if(a=='p'){var o=items[+t.dataset.i];PMAP[o.k+(typeof o.p[1]=='object'?o.p[1].en:o.p[1])]=o.p;hide();openPD(o.k+(typeof o.p[1]=='object'?o.p[1].en:o.p[1]))}
else if(a=='c'){hide();var c=cc[+t.dataset.i];openCat(c.i,c.gi)}
else if(a=='all'){go()}
else if(a=='m'){mode=t.dataset.m;act=-1;setPh();show();inp.focus()}
else if(a=='sh'){var sx=shs[+t.dataset.i];if(sx){hide();inp.blur();if(window.openSeller)openSeller(sx[0])}}})}
var cc=[];
function show(){var q=inp.value.trim();ensure();if(mode=='s'){dd.innerHTML=tabs()+shRows(q);dd.classList.add('o');inp.setAttribute('aria-expanded','true');return}if(!q){dd.innerHTML=tabs();dd.classList.add('o');inp.setAttribute('aria-expanded','true');return}items=find(q);cc=cats(q);var h=tabs();
cc.forEach(function(c,i){h+='<button type="button" class="sg-c" data-s="c" data-i="'+i+'" role="option"><span class="sg-i">'+uic('grid')+'</span><span class="sg-t">'+L('in ','এতে ')+'<b>'+c.t+'</b></span></button>'});
items.slice(0,6).forEach(function(x,i){var p=x.p,en=enName(p[1]);h+='<button type="button" class="sg-p'+(i==act?' on':'')+'" data-s="p" data-i="'+i+'" role="option"><span class="sg-i">'+PIC(imgOf(p),p[0],'')+'</span><span class="sg-t">'+(lang=='en'?en:tx(p[1]))+'</span><b>৳ '+p[3].toLocaleString('en-US')+'</b></button>'});
h+=items.length||cc.length?'<button type="button" class="sg-a" data-s="all">'+L('See all results for ','সব ফলাফল দেখুন: ')+'"'+q.replace(/</g,'&lt;')+'" ('+items.length+') ›</button>':'<div class="sg-e">'+L('No products found','কোনো পণ্য পাওয়া যায়নি')+'</div>';
dd.innerHTML=h;dd.classList.add('o');inp.setAttribute('aria-expanded','true')}
function hide(){if(dd)dd.classList.remove('o');inp.setAttribute('aria-expanded','false');act=-1}
function go(){var q=inp.value.trim();if(mode=='s'){shs=findShops(q);var sx=shs[act>=0?act:0];if(sx){hide();inp.blur();if(window.openSeller)openSeller(sx[0])}return}if(!q)return;hide();inp.blur();openAll('search',{q:q})}
inp.addEventListener('input',function(){act=-1;show()});
inp.setAttribute('data-ph0',inp.placeholder);inp.addEventListener('focus',function(){show()});
inp.addEventListener('keydown',function(e){if(e.key=='Enter'){e.preventDefault();go()}else if(e.key=='Escape'){hide()}else if(e.key=='ArrowDown'||e.key=='ArrowUp'){var n=mode=='s'?Math.min(shs.length,8):Math.min(items.length,6);if(!n)return;e.preventDefault();act=(act+(e.key=='ArrowDown'?1:-1)+n+1)%(n+1)-1;show();if(act>=0){var b=dd.querySelector('.sg-p.on');if(b&&b.scrollIntoView)b.scrollIntoView({block:'nearest'})}}
if(e.key=='Enter'&&act>=0&&items[act]){}});
if(btn)btn.addEventListener('click',function(e){e.preventDefault();go()});
document.addEventListener('click',function(e){if(!e.target.closest('.search'))hide()});
})();
/*GEO-START*/var NBGEO={"d":[[28,"Bagerhat","বাগেরহাট"],[11,"Bandarban","বান্দরবান"],[35,"Barguna","বরগুনা"],[33,"Barisal","বরিশাল"],[34,"Bhola","ভোলা"],[14,"Bogura","বগুড়া"],[3,"Brahmanbaria","ব্রাহ্মণবাড়িয়া"],[6,"Chandpur","চাঁদপুর"],[18,"Chapainawabganj","চাঁপাইনবাবগঞ্জ"],[8,"Chattogram","চট্টগ্রাম"],[24,"Chuadanga","চুয়াডাঙ্গা"],[1,"Comilla","কুমিল্লা"],[9,"Coxsbazar","কক্সবাজার"],[47,"Dhaka","ঢাকা"],[54,"Dinajpur","দিনাজপুর"],[52,"Faridpur","ফরিদপুর"],[2,"Feni","ফেনী"],[57,"Gaibandha","গাইবান্ধা"],[41,"Gazipur","গাজীপুর"],[51,"Gopalganj","গোপালগঞ্জ"],[38,"Habiganj","হবিগঞ্জ"],[63,"Jamalpur","জামালপুর"],[20,"Jashore","যশোর"],[30,"Jhalakathi","ঝালকাঠি"],[29,"Jhenaidah","ঝিনাইদহ"],[17,"Joypurhat","জয়পুরহাট"],[10,"Khagrachhari","খাগড়াছড়ি"],[27,"Khulna","খুলনা"],[45,"Kishoreganj","কিশোরগঞ্জ"],[60,"Kurigram","কুড়িগ্রাম"],[25,"Kushtia","কুষ্টিয়া"],[7,"Lakshmipur","লক্ষ্মীপুর"],[55,"Lalmonirhat","লালমনিরহাট"],[50,"Madaripur","মাদারীপুর"],[26,"Magura","মাগুরা"],[46,"Manikganj","মানিকগঞ্জ"],[22,"Meherpur","মেহেরপুর"],[37,"Moulvibazar","মৌলভীবাজার"],[48,"Munshiganj","মুন্সিগঞ্জ"],[62,"Mymensingh","ময়মনসিংহ"],[19,"Naogaon","নওগাঁ"],[23,"Narail","নড়াইল"],[43,"Narayanganj","নারায়ণগঞ্জ"],[40,"Narsingdi","নরসিংদী"],[16,"Natore","নাটোর"],[64,"Netrokona","নেত্রকোণা"],[56,"Nilphamari","নীলফামারী"],[5,"Noakhali","নোয়াখালী"],[13,"Pabna","পাবনা"],[53,"Panchagarh","পঞ্চগড়"],[31,"Patuakhali","পটুয়াখালী"],[32,"Pirojpur","পিরোজপুর"],[49,"Rajbari","রাজবাড়ী"],[15,"Rajshahi","রাজশাহী"],[4,"Rangamati","রাঙ্গামাটি"],[59,"Rangpur","রংপুর"],[21,"Satkhira","সাতক্ষীরা"],[42,"Shariatpur","শরীয়তপুর"],[61,"Sherpur","শেরপুর"],[12,"Sirajganj","সিরাজগঞ্জ"],[39,"Sunamganj","সুনামগঞ্জ"],[36,"Sylhet","সিলেট"],[44,"Tangail","টাঙ্গাইল"],[58,"Thakurgaon","ঠাকুরগাঁও"]],"u":{"20":[[172,"Abhaynagar","অভয়নগর"],[173,"Bagherpara","বাঘারপাড়া"],[174,"Chougachha","চৌগাছা"],[177,"Jessore Sadar","যশোর সদর"],[175,"Jhikargacha","ঝিকরগাছা"],[176,"Keshabpur","কেশবপুর"],[171,"Manirampur","মণিরামপুর"],[178,"Sharsha","শার্শা"]],"14":[[127,"Adamdighi","আদমদিঘি"],[123,"Bogra Sadar","বগুড়া সদর"],[130,"Dhunot","ধুনট"],[126,"Dupchanchia","দুপচাচিঁয়া"],[131,"Gabtali","গাবতলী"],[122,"Kahaloo","কাহালু"],[128,"Nondigram","নন্দিগ্রাম"],[125,"Shajahanpur","শাজাহানপুর"],[124,"Shariakandi","সারিয়াকান্দি"],[132,"Sherpur","শেরপুর"],[133,"Shibganj","শিবগঞ্জ"],[129,"Sonatala","সোনাতলা"]],"55":[[421,"Aditmari","আদিতমারী"],[419,"Hatibandha","হাতীবান্ধা"],[418,"Kaliganj","কালীগঞ্জ"],[417,"Lalmonirhat Sadar","লালমনিরহাট সদর"],[420,"Patgram","পাটগ্রাম"]],"33":[[255,"Agailjhara","আগৈলঝাড়া"],[251,"Babuganj","বাবুগঞ্জ"],[250,"Bakerganj","বাকেরগঞ্জ"],[253,"Banaripara","বানারীপাড়া"],[249,"Barisal Sadar","বরিশাল সদর"],[254,"Gournadi","গৌরনদী"],[258,"Hizla","হিজলা"],[256,"Mehendiganj","মেহেন্দিগঞ্জ"],[257,"Muladi","মুলাদী"],[252,"Wazirpur","উজিরপুর"]],"38":[[294,"Ajmiriganj","আজমিরীগঞ্জ"],[293,"Bahubal","বাহুবল"],[295,"Baniachong","বানিয়াচং"],[297,"Chunarughat","চুনারুঘাট"],[298,"Habiganj Sadar","হবিগঞ্জ সদর"],[296,"Lakhai","লাখাই"],[299,"Madhabpur","মাধবপুর"],[292,"Nabiganj","নবীগঞ্জ"]],"3":[[29,"Akhaura","আখাউড়া"],[28,"Ashuganj","আশুগঞ্জ"],[31,"Bancharampur","বাঞ্ছারামপুর"],[32,"Bijoynagar","বিজয়নগর"],[24,"Brahmanbaria Sadar","ব্রাহ্মণবাড়িয়া সদর"],[25,"Kasba","কসবা"],[30,"Nabinagar","নবীনগর"],[26,"Nasirnagar","নাসিরনগর"],[27,"Sarail","সরাইল"]],"17":[[150,"Akkelpur","আক্কেলপুর"],[154,"Joypurhat Sadar","জয়পুরহাট সদর"],[151,"Kalai","কালাই"],[152,"Khetlal","ক্ষেতলাল"],[153,"Panchbibi","পাঁচবিবি"]],"24":[[193,"Alamdanga","আলমডাঙ্গা"],[192,"Chuadanga Sadar","চুয়াডাঙ্গা সদর"],[194,"Damurhuda","দামুড়হুদা"],[195,"Jibannagar","জীবননগর"]],"52":[[391,"Alfadanga","আলফাডাঙ্গা"],[395,"Bhanga","ভাঙ্গা"],[392,"Boalmari","বোয়ালমারী"],[396,"Charbhadrasan","চরভদ্রাসন"],[390,"Faridpur Sadar","ফরিদপুর সদর"],[397,"Madhukhali","মধুখালী"],[394,"Nagarkanda","নগরকান্দা"],[393,"Sadarpur","সদরপুর"],[398,"Saltha","সালথা"]],"11":[[98,"Alikadam","আলীকদম"],[97,"Bandarban Sadar","বান্দরবান সদর"],[101,"Lama","লামা"],[99,"Naikhongchhari","নাইক্ষ্যংছড়ি"],[100,"Rowangchhari","রোয়াংছড়ি"],[102,"Ruma","রুমা"],[103,"Thanchi","থানচি"]],"35":[[266,"Amtali","আমতলী"],[269,"Bamna","বামনা"],[267,"Barguna Sadar","বরগুনা সদর"],[268,"Betagi","বেতাগী"],[270,"Pathorghata","পাথরঘাটা"],[271,"Taltali","তালতলি"]],"8":[[72,"Anwara","আনোয়ারা"],[70,"Banshkhali","বাঁশখালী"],[71,"Boalkhali","বোয়ালখালী"],[73,"Chandanaish","চন্দনাইশ"],[77,"Fatikchhari","ফটিকছড়ি"],[76,"Hathazari","হাটহাজারী"],[79,"Karnafuli","কর্ণফুলী"],[75,"Lohagara","লোহাগাড়া"],[67,"Mirsharai","মীরসরাই"],[68,"Patiya","পটিয়া"],[65,"Rangunia","রাঙ্গুনিয়া"],[78,"Raozan","রাউজান"],[69,"Sandwip","সন্দ্বীপ"],[74,"Satkania","সাতকানিয়া"],[66,"Sitakunda","সীতাকুন্ড"]],"43":[[328,"Araihazar","আড়াইহাজার"],[329,"Bandar","বন্দর"],[330,"Narayanganj Sadar","নারায়নগঞ্জ সদর"],[331,"Rupganj","রূপগঞ্জ"],[332,"Sonargaon","সোনারগাঁ"]],"21":[[179,"Assasuni","আশাশুনি"],[180,"Debhata","দেবহাটা"],[181,"Kalaroa","কলারোয়া"],[185,"Kaliganj","কালিগঞ্জ"],[182,"Satkhira Sadar","সাতক্ষীরা সদর"],[183,"Shyamnagar","শ্যামনগর"],[184,"Tala","তালা"]],"13":[[118,"Atghoria","আটঘরিয়া"],[117,"Bera","বেড়া"],[115,"Bhangura","ভাঙ্গুড়া"],[119,"Chatmohar","চাটমোহর"],[121,"Faridpur","ফরিদপুর"],[114,"Ishurdi","ঈশ্বরদী"],[116,"Pabna Sadar","পাবনা সদর"],[120,"Santhia","সাঁথিয়া"],[113,"Sujanagar","সুজানগর"]],"64":[[485,"Atpara","আটপাড়া"],[482,"Barhatta","বারহাট্টা"],[483,"Durgapur","দুর্গাপুর"],[488,"Kalmakanda","কলমাকান্দা"],[484,"Kendua","কেন্দুয়া"],[487,"Khaliajuri","খালিয়াজুরী"],[486,"Madan","মদন"],[489,"Mohongonj","মোহনগঞ্জ"],[491,"Netrokona Sadar","নেত্রকোণা সদর"],[490,"Purbadhala","পূর্বধলা"]],"19":[[166,"Atrai","আত্রাই"],[161,"Badalgachi","বদলগাছী"],[163,"Dhamoirhat","ধামইরহাট"],[165,"Manda","মান্দা"],[160,"Mohadevpur","মহাদেবপুর"],[168,"Naogaon Sadar","নওগাঁ সদর"],[164,"Niamatpur","নিয়ামতপুর"],[162,"Patnitala","পত্নিতলা"],[169,"Porsha","পোরশা"],[167,"Raninagar","রাণীনগর"],[170,"Sapahar","সাপাহার"]],"53":[[402,"Atwari","আটোয়ারী"],[401,"Boda","বোদা"],[400,"Debiganj","দেবীগঞ্জ"],[399,"Panchagarh Sadar","পঞ্চগড় সদর"],[403,"Tetulia","তেতুলিয়া"]],"45":[[355,"Austagram","অষ্টগ্রাম"],[354,"Bajitpur","বাজিতপুর"],[347,"Bhairab","ভৈরব"],[349,"Hossainpur","হোসেনপুর"],[345,"Itna","ইটনা"],[353,"Karimgonj","করিমগঞ্জ"],[346,"Katiadi","কটিয়াদী"],[352,"Kishoreganj Sadar","কিশোরগঞ্জ সদর"],[351,"Kuliarchar","কুলিয়ারচর"],[356,"Mithamoin","মিঠামইন"],[357,"Nikli","নিকলী"],[350,"Pakundia","পাকুন্দিয়া"],[348,"Tarail","তাড়াইল"]],"59":[[443,"Badargonj","বদরগঞ্জ"],[441,"Gangachara","গংগাচড়া"],[446,"Kaunia","কাউনিয়া"],[444,"Mithapukur","মিঠাপুকুর"],[447,"Pirgacha","পীরগাছা"],[445,"Pirgonj","পীরগঞ্জ"],[440,"Rangpur Sadar","রংপুর সদর"],[442,"Taragonj","তারাগঞ্জ"]],"16":[[146,"Bagatipara","বাগাতিপাড়া"],[145,"Baraigram","বড়াইগ্রাম"],[148,"Gurudaspur","গুরুদাসপুর"],[147,"Lalpur","লালপুর"],[149,"Naldanga","নলডাঙ্গা"],[143,"Natore Sadar","নাটোর সদর"],[144,"Singra","সিংড়া"]],"28":[[216,"Bagerhat Sadar","বাগেরহাট সদর"],[223,"Chitalmari","চিতলমারী"],[215,"Fakirhat","ফকিরহাট"],[221,"Kachua","কচুয়া"],[217,"Mollahat","মোল্লাহাট"],[222,"Mongla","মোংলা"],[220,"Morrelganj","মোড়েলগঞ্জ"],[219,"Rampal","রামপাল"],[218,"Sarankhola","শরণখোলা"]],"15":[[139,"Bagha","বাঘা"],[142,"Bagmara","বাগমারা"],[137,"Charghat","চারঘাট"],[135,"Durgapur","দুর্গাপুর"],[140,"Godagari","গোদাগাড়ী"],[136,"Mohonpur","মোহনপুর"],[134,"Paba","পবা"],[138,"Puthia","পুঠিয়া"],[141,"Tanore","তানোর"]],"4":[[36,"Baghaichari","বাঘাইছড়ি"],[37,"Barkal","বরকল"],[40,"Belaichari","বিলাইছড়ি"],[41,"Juraichari","জুরাছড়ি"],[34,"Kaptai","কাপ্তাই"],[35,"Kawkhali","কাউখালী"],[38,"Langadu","লংগদু"],[42,"Naniarchar","নানিয়ারচর"],[39,"Rajasthali","রাজস্থলী"],[33,"Rangamati Sadar","রাঙ্গামাটি সদর"]],"36":[[272,"Balaganj","বালাগঞ্জ"],[273,"Beanibazar","বিয়ানীবাজার"],[274,"Bishwanath","বিশ্বনাথ"],[275,"Companiganj","কোম্পানীগঞ্জ"],[283,"Dakshinsurma","দক্ষিণ সুরমা"],[276,"Fenchuganj","ফেঞ্চুগঞ্জ"],[277,"Golapganj","গোলাপগঞ্জ"],[278,"Gowainghat","গোয়াইনঘাট"],[279,"Jaintiapur","জৈন্তাপুর"],[280,"Kanaighat","কানাইঘাট"],[284,"Osmaninagar","ওসমানী নগর"],[281,"Sylhet Sadar","সিলেট সদর"],[282,"Zakiganj","জকিগঞ্জ"]],"58":[[439,"Baliadangi","বালিয়াডাঙ্গী"],[438,"Haripur","হরিপুর"],[436,"Pirganj","পীরগঞ্জ"],[437,"Ranisankail","রাণীশংকৈল"],[435,"Thakurgaon Sadar","ঠাকুরগাঁও সদর"]],"49":[[379,"Baliakandi","বালিয়াকান্দি"],[377,"Goalanda","গোয়ালন্দ"],[380,"Kalukhali","কালুখালী"],[378,"Pangsa","পাংশা"],[376,"Rajbari Sadar","রাজবাড়ী সদর"]],"37":[[285,"Barlekha","বড়লেখা"],[291,"Juri","জুড়ী"],[286,"Kamolganj","কমলগঞ্জ"],[287,"Kulaura","কুলাউড়া"],[288,"Moulvibazar Sadar","মৌলভীবাজার সদর"],[289,"Rajnagar","রাজনগর"],[290,"Sreemangal","শ্রীমঙ্গল"]],"1":[[2,"Barura","বরুড়া"],[3,"Brahmanpara","ব্রাহ্মণপাড়া"],[16,"Burichang","বুড়িচং"],[4,"Chandina","চান্দিনা"],[5,"Chauddagram","চৌদ্দগ্রাম"],[11,"Comilla Sadar","কুমিল্লা সদর"],[6,"Daudkandi","দাউদকান্দি"],[1,"Debidwar","দেবিদ্বার"],[7,"Homna","হোমনা"],[8,"Laksam","লাকসাম"],[17,"Lalmai","লালমাই"],[12,"Meghna","মেঘনা"],[13,"Monohargonj","মনোহরগঞ্জ"],[9,"Muradnagar","মুরাদনগর"],[10,"Nangalkot","নাঙ্গলকোট"],[14,"Sadarsouth","সদর দক্ষিণ"],[15,"Titas","তিতাস"]],"44":[[333,"Basail","বাসাইল"],[334,"Bhuapur","ভুয়াপুর"],[335,"Delduar","দেলদুয়ার"],[344,"Dhanbari","ধনবাড়ী"],[336,"Ghatail","ঘাটাইল"],[337,"Gopalpur","গোপালপুর"],[343,"Kalihati","কালিহাতী"],[338,"Madhupur","মধুপুর"],[339,"Mirzapur","মির্জাপুর"],[340,"Nagarpur","নাগরপুর"],[341,"Sakhipur","সখিপুর"],[342,"Tangail Sadar","টাঙ্গাইল সদর"]],"31":[[234,"Bauphal","বাউফল"],[237,"Dashmina","দশমিনা"],[236,"Dumki","দুমকি"],[240,"Galachipa","গলাচিপা"],[238,"Kalapara","কলাপাড়া"],[239,"Mirzaganj","মির্জাগঞ্জ"],[235,"Patuakhali Sadar","পটুয়াখালী সদর"],[241,"Rangabali","রাঙ্গাবালী"]],"5":[[45,"Begumganj","বেগমগঞ্জ"],[50,"Chatkhil","চাটখিল"],[44,"Companiganj","কোম্পানীগঞ্জ"],[46,"Hatia","হাতিয়া"],[48,"Kabirhat","কবিরহাট"],[43,"Noakhali Sadar","নোয়াখালী সদর"],[49,"Senbug","সেনবাগ"],[51,"Sonaimori","সোনাইমুড়ী"],[47,"Subarnachar","সুবর্ণচর"]],"40":[[311,"Belabo","বেলাবো"],[312,"Monohardi","মনোহরদী"],[313,"Narsingdi Sadar","নরসিংদী সদর"],[314,"Palash","পলাশ"],[315,"Raipura","রায়পুরা"],[316,"Shibpur","শিবপুর"]],"12":[[104,"Belkuchi","বেলকুচি"],[105,"Chauhali","চৌহালি"],[106,"Kamarkhand","কামারখন্দ"],[107,"Kazipur","কাজীপুর"],[108,"Raigonj","রায়গঞ্জ"],[109,"Shahjadpur","শাহজাদপুর"],[110,"Sirajganj Sadar","সিরাজগঞ্জ সদর"],[111,"Tarash","তাড়াশ"],[112,"Ullapara","উল্লাপাড়া"]],"62":[[464,"Bhaluka","ভালুকা"],[467,"Dhobaura","ধোবাউড়া"],[462,"Fulbaria","ফুলবাড়ীয়া"],[471,"Gafargaon","গফরগাঁও"],[470,"Gouripur","গৌরীপুর"],[469,"Haluaghat","হালুয়াঘাট"],[472,"Iswarganj","ঈশ্বরগঞ্জ"],[465,"Muktagacha","মুক্তাগাছা"],[466,"Mymensingh Sadar","ময়মনসিংহ সদর"],[473,"Nandail","নান্দাইল"],[468,"Phulpur","ফুলপুর"],[474,"Tarakanda","তারাকান্দা"],[463,"Trishal","ত্রিশাল"]],"32":[[246,"Bhandaria","ভান্ডারিয়া"],[244,"Kawkhali","কাউখালী"],[247,"Mathbaria","মঠবাড়ীয়া"],[243,"Nazirpur","নাজিরপুর"],[248,"Nesarabad","নেছারাবাদ"],[242,"Pirojpur Sadar","পিরোজপুর সদর"],[245,"Zianagar","জিয়ানগর"]],"42":[[326,"Bhedarganj","ভেদরগঞ্জ"],[327,"Damudya","ডামুড্যা"],[325,"Gosairhat","গোসাইরহাট"],[323,"Naria","নড়িয়া"],[322,"Shariatpur Sadar","শরিয়তপুর সদর"],[324,"Zajira","জাজিরা"]],"25":[[201,"Bheramara","ভেড়ামারা"],[200,"Daulatpur","দৌলতপুর"],[198,"Khoksa","খোকসা"],[197,"Kumarkhali","কুমারখালী"],[196,"Kushtia Sadar","কুষ্টিয়া সদর"],[199,"Mirpur","মিরপুর"]],"34":[[259,"Bhola Sadar","ভোলা সদর"],[260,"Borhan Sddin","বোরহান উদ্দিন"],[261,"Charfesson","চরফ্যাশন"],[262,"Doulatkhan","দৌলতখান"],[265,"Lalmohan","লালমোহন"],[263,"Monpura","মনপুরা"],[264,"Tazumuddin","তজুমদ্দিন"]],"18":[[158,"Bholahat","ভোলাহাট"],[155,"Chapainawabganj Sadar","চাঁপাইনবাবগঞ্জ সদর"],[156,"Gomostapur","গোমস্তাপুর"],[157,"Nachol","নাচোল"],[159,"Shibganj","শিবগঞ্জ"]],"60":[[450,"Bhurungamari","ভুরুঙ্গামারী"],[456,"Charrajibpur","চর রাজিবপুর"],[454,"Chilmari","চিলমারী"],[448,"Kurigram Sadar","কুড়িগ্রাম সদর"],[449,"Nageshwari","নাগেশ্বরী"],[451,"Phulbari","ফুলবাড়ী"],[452,"Rajarhat","রাজারহাট"],[455,"Rowmari","রৌমারী"],[453,"Ulipur","উলিপুর"]],"54":[[407,"Birampur","বিরামপুর"],[405,"Birganj","বীরগঞ্জ"],[415,"Birol","বিরল"],[409,"Bochaganj","বোচাগঞ্জ"],[416,"Chirirbandar","চিরিরবন্দর"],[412,"Dinajpur Sadar","দিনাজপুর সদর"],[411,"Fulbari","ফুলবাড়ী"],[406,"Ghoraghat","ঘোড়াঘাট"],[413,"Hakimpur","হাকিমপুর"],[410,"Kaharol","কাহারোল"],[414,"Khansama","খানসামা"],[404,"Nawabganj","নবাবগঞ্জ"],[408,"Parbatipur","পার্বতীপুর"]],"39":[[302,"Bishwambarpur","বিশ্বম্ভরপুর"],[303,"Chhatak","ছাতক"],[310,"Derai","দিরাই"],[307,"Dharmapasha","ধর্মপাশা"],[305,"Dowarabazar","দোয়ারাবাজার"],[304,"Jagannathpur","জগন্নাথপুর"],[308,"Jamalganj","জামালগঞ্জ"],[493,"Madhyanagar","মধ্যনগর"],[309,"Shalla","শাল্লা"],[301,"South Sunamganj","দক্ষিণ সুনামগঞ্জ"],[300,"Sunamganj Sadar","সুনামগঞ্জ সদর"],[306,"Tahirpur","তাহিরপুর"]],"63":[[481,"Bokshiganj","বকশীগঞ্জ"],[478,"Dewangonj","দেওয়ানগঞ্জ"],[477,"Islampur","ইসলামপুর"],[475,"Jamalpur Sadar","জামালপুর সদর"],[480,"Madarganj","মাদারগঞ্জ"],[476,"Melandah","মেলান্দহ"],[479,"Sarishabari","সরিষাবাড়ী"]],"27":[[212,"Botiaghata","বটিয়াঘাটা"],[213,"Dakop","দাকোপ"],[208,"Digholia","দিঘলিয়া"],[211,"Dumuria","ডুমুরিয়া"],[207,"Fultola","ফুলতলা"],[214,"Koyra","কয়রা"],[206,"Paikgasa","পাইকগাছা"],[209,"Rupsha","রূপসা"],[210,"Terokhada","তেরখাদা"]],"9":[[81,"Chakaria","চকরিয়া"],[80,"Coxsbazar Sadar","কক্সবাজার সদর"],[492,"Eidgaon","ঈদগাঁও"],[82,"Kutubdia","কুতুবদিয়া"],[84,"Moheshkhali","মহেশখালী"],[85,"Pekua","পেকুয়া"],[86,"Ramu","রামু"],[87,"Teknaf","টেকনাফ"],[83,"Ukhiya","উখিয়া"]],"6":[[55,"Chandpur Sadar","চাঁদপুর সদর"],[59,"Faridgonj","ফরিদগঞ্জ"],[52,"Haimchar","হাইমচর"],[57,"Hajiganj","হাজীগঞ্জ"],[53,"Kachua","কচুয়া"],[58,"Matlab North","মতলব উত্তর"],[56,"Matlab South","মতলব দক্ষিণ"],[54,"Shahrasti","শাহরাস্তি\t"]],"2":[[18,"Chhagalnaiya","ছাগলনাইয়া"],[23,"Daganbhuiyan","দাগনভূঞা"],[19,"Feni Sadar","ফেনী সদর"],[21,"Fulgazi","ফুলগাজী"],[22,"Parshuram","পরশুরাম"],[20,"Sonagazi","সোনাগাজী"]],"50":[[494,"Dasar","ডাসার"],[383,"Kalkini","কালকিনি"],[381,"Madaripur Sadar","মাদারীপুর সদর"],[384,"Rajoir","রাজৈর"],[382,"Shibchar","শিবচর"]],"47":[[9001,"Mirpur (Dhaka City)","মিরপুর (ঢাকা সিটি)"],[9002,"Dhanmondi (Dhaka City)","ধানমন্ডি (ঢাকা সিটি)"],[9003,"Uttara (Dhaka City)","উত্তরা (ঢাকা সিটি)"],[9004,"Gulshan (Dhaka City)","গুলশান (ঢাকা সিটি)"],[9005,"Banani (Dhaka City)","বনানী (ঢাকা সিটি)"],[9006,"Mohammadpur (Dhaka City)","মোহাম্মদপুর (ঢাকা সিটি)"],[9007,"Badda (Dhaka City)","বাড্ডা (ঢাকা সিটি)"],[9008,"Rampura (Dhaka City)","রামপুরা (ঢাকা সিটি)"],[9009,"Motijheel (Dhaka City)","মতিঝিল (ঢাকা সিটি)"],[9010,"Tejgaon (Dhaka City)","তেজগাঁও (ঢাকা সিটি)"],[9011,"Khilgaon (Dhaka City)","খিলগাঁও (ঢাকা সিটি)"],[9012,"Old Dhaka (Dhaka City)","পুরান ঢাকা (ঢাকা সিটি)"],[366,"Dhamrai","ধামরাই"],[369,"Dohar","দোহার"],[367,"Keraniganj","কেরাণীগঞ্জ"],[368,"Nawabganj","নবাবগঞ্জ"],[365,"Savar","সাভার"]],"10":[[89,"Dighinala","দিঘীনালা"],[96,"Guimara","গুইমারা"],[88,"Khagrachhari Sadar","খাগড়াছড়ি সদর"],[91,"Laxmichhari","লক্ষীছড়ি"],[93,"Manikchari","মানিকছড়ি"],[95,"Matiranga","মাটিরাঙ্গা"],[92,"Mohalchari","মহালছড়ি"],[90,"Panchari","পানছড়ি"],[94,"Ramgarh","রামগড়"]],"56":[[424,"Dimla","ডিমলা"],[423,"Domar","ডোমার"],[425,"Jaldhaka","জলঢাকা"],[426,"Kishorganj","কিশোরগঞ্জ"],[427,"Nilphamari Sadar","নীলফামারী সদর"],[422,"Syedpur","সৈয়দপুর"]],"46":[[363,"Doulatpur","দৌলতপুর"],[361,"Gior","ঘিওর"],[358,"Harirampur","হরিরামপুর"],[360,"Manikganj Sadar","মানিকগঞ্জ সদর"],[359,"Saturia","সাটুরিয়া"],[362,"Shibaloy","শিবালয়"],[364,"Singiar","সিংগাইর"]],"57":[[429,"Gaibandha Sadar","গাইবান্ধা সদর"],[432,"Gobindaganj","গোবিন্দগঞ্জ"],[430,"Palashbari","পলাশবাড়ী"],[434,"Phulchari","ফুলছড়ি"],[428,"Sadullapur","সাদুল্লাপুর"],[431,"Saghata","সাঘাটা"],[433,"Sundarganj","সুন্দরগঞ্জ"]],"48":[[374,"Gajaria","গজারিয়া"],[373,"Louhajanj","লৌহজং"],[370,"Munshiganj Sadar","মুন্সিগঞ্জ সদর"],[372,"Sirajdikhan","সিরাজদিখান"],[371,"Sreenagar","শ্রীনগর"],[375,"Tongibari","টংগীবাড়ি"]],"22":[[188,"Gangni","গাংনী"],[187,"Meherpur Sadar","মেহেরপুর সদর"],[186,"Mujibnagar","মুজিবনগর"]],"41":[[320,"Gazipur Sadar","গাজীপুর সদর"],[318,"Kaliakair","কালিয়াকৈর"],[317,"Kaliganj","কালীগঞ্জ"],[319,"Kapasia","কাপাসিয়া"],[321,"Sreepur","শ্রীপুর"]],"51":[[385,"Gopalganj Sadar","গোপালগঞ্জ সদর"],[386,"Kashiani","কাশিয়ানী"],[388,"Kotalipara","কোটালীপাড়া"],[389,"Muksudpur","মুকসুদপুর"],[387,"Tungipara","টুংগীপাড়া"]],"29":[[226,"Harinakundu","হরিণাকুন্ডু"],[224,"Jhenaidah Sadar","ঝিনাইদহ সদর"],[227,"Kaliganj","কালীগঞ্জ"],[228,"Kotchandpur","কোটচাঁদপুর"],[229,"Moheshpur","মহেশপুর"],[225,"Shailkupa","শৈলকুপা"]],"30":[[230,"Jhalakathi Sadar","ঝালকাঠি সদর"],[231,"Kathalia","কাঠালিয়া"],[232,"Nalchity","নলছিটি"],[233,"Rajapur","রাজাপুর"]],"61":[[461,"Jhenaigati","ঝিনাইগাতী"],[458,"Nalitabari","নালিতাবাড়ী"],[460,"Nokla","নকলা"],[457,"Sherpur Sadar","শেরপুর সদর"],[459,"Sreebordi","শ্রীবরদী"]],"23":[[191,"Kalia","কালিয়া"],[190,"Lohagara","লোহাগড়া"],[189,"Narail Sadar","নড়াইল সদর"]],"7":[[61,"Kamalnagar","কমলনগর"],[60,"Lakshmipur Sadar","লক্ষ্মীপুর সদর"],[62,"Raipur","রায়পুর"],[64,"Ramganj","রামগঞ্জ"],[63,"Ramgati","রামগতি"]],"26":[[204,"Magura Sadar","মাগুরা সদর"],[205,"Mohammadpur","মহম্মদপুর"],[202,"Shalikha","শালিখা"],[203,"Sreepur","শ্রীপুর"]]},"n":{"160":[["1nomohadevpur","মহাদেবপুর"],["Chandas","চাঁন্দাশ"],["Cheragpur","চেরাগপুর"],["Enayetpur","এনায়েতপুর"],["Hatur","হাতুড়"],["Khajur","খাজুর"],["Roygon","রাইগাঁ"],["Sofapur","সফাপুর"],["Uttargram","উত্তরগ্রাম"],["Vimpur","ভীমপুর"]],"225":[["Abaipur","আবাইপুর"],["Bogura","বগুড়া"],["Dhaloharachandra","ধলহরাচন্দ্র"],["Dignagore","দিগনগর"],["Dudshar","দুধসর"],["Fulhari","ফুলহরি"],["Hakimpur","হাকিমপুর"],["Kancherkol","কাঁচেরকোল"],["Manoharpur","মনোহরপুর"],["Mirzapur","মির্জাপুর"],["Nityanandapur","নিত্যানন্দপুর"],["Sarutia","সারুটিয়া"],["Tribeni","ত্রিবেনী"],["Umedpur","উমেদপুর"]],"261":[["Abdullahpur","আবদুল্লাহ"],["Abubakarpur","আবুবকরপুর"],["Aminabad","আমিনাবাদ"],["Aslampur","আছলামপুর"],["Awajpur","আওয়াজপুর"],["Awajpur","আওয়াজপুর"],["Charkolmi","চরকলমী"],["Charmadraj","চরমাদ্রাজ"],["Charmanika","চরমানিকা"],["Dalchar","ঢালচর"],["Hazarigonj","হাজারীগঞ্জ"],["Jahanpur","জাহানপুর"],["Kukrimukri","কুকরীমূকরী"],["Mujibnagar","মুজিব নগর"],["Nazrulnagar","নজরুল নগর"],["Nilkomol","নীলকমল"],["Nurabad","নুরাবাদ"],["Osmangonj","ওসমানগঞ্জ"],["Rasulpur","রসুলপুর"],["Zinnagor","জিন্নাগড়"]],"77":[["Abdullapur","আবদুল্লাপুর"],["Baganbazar","বাগান বাজার"],["Bhujpur","ভূজপুর"],["Bokhtapur","বক্তপুর"],["Dantmara","দাঁতমারা"],["Daulatpur","দৌলতপুর"],["Dharmapur","ধর্মপুর"],["Harualchari","হারুয়ালছড়ি"],["Jafathagar","জাফতনগর"],["Kanchannagor","কাঞ্চনগর"],["Lelang","লেলাং"],["Nanupur","নানুপুর"],["Narayanhat","নারায়নহাট"],["Paindong","পাইনদং"],["Roshangiri","রোসাংগিরী"],["Samitirhat","সমিতির হাট"],["Suabil","সুয়াবিল"],["Sunderpur","সুনদরপুর"]],"375":[["Abdullapur","আব্দুল্লাপুর"],["Arial Baligaon","আড়িয়ল বালিগাঁও"],["Autshahi","আউটশাহী"],["Betka","বেতকা"],["Dhipur","ধীপুর"],["Dighirpar","দিঘীরপাড়"],["Hasailbanari","হাসাইল বানারী"],["Joslong","যশলং"],["Kamarkhara","কামারখাড়া"],["Kathadia Shimolia","কাঠাদিয়া শিমুলিয়া"],["Panchgaon","পাঁচগাও"],["Sonarong Tongibari","সোনারং টংগীবাড়ী"]],"196":[["Abdulpur","আব্দালপুর"],["Ailchara","আইলচারা"],["Alampur","আলামপুর"],["Barkhada","বারখাদা"],["Bottail","বটতৈল"],["Goswami Durgapur","গোস্বামী দুর্গাপুর"],["Harinarayanpur","হরিনারায়নপুর"],["Hatash Haripur","হাটশ হরিপুর"],["Jhaudia","ঝাউদিয়া"],["Mazampur","মজমপুর"],["Monohardia","মনোহরদিয়া"],["Patikabari","পাটিকাবাড়ী"],["Ujangram","উজানগ্রাম"],["Ziaraakhi","জিয়ারাখী"]],"416":[["Abdulpur","আব্দুলপুর"],["Alokdihi","আলোকডিহি"],["Amarpur","অমরপুর"],["Auliapukur","আউলিয়াপুকুর"],["Fatejangpur","ফতেজংপুর"],["Isobpur","ইসবপুর"],["Nashratpur","নশরতপুর"],["Punotti","পুনট্টি"],["Saitara","সাইতারা"],["Satnala","সাতনালা"],["Tetulia","তেতুলিয়া"],["Viail","ভিয়াইল"]],"473":[["Achargaon","আচারগাঁও"],["Batagoir","বেতাগৈর"],["Chandipasha","চন্ডীপাশা"],["Gangail","গাংগাইল"],["Jahangirpur","জাহাঙ্গীরপুর"],["Kharua","খারুয়া"],["Muajjempur","মোয়াজ্জেমপুর"],["Mushulli","মুশুল্লী"],["Nandail","নান্দাইল"],["Rajgati","রাজগাতী"],["Sherpur","শেরপুর"],["Singroil","সিংরইল"]],"470":[["Achintapur","অচিন্তপুর"],["Bhangnamari","ভাংনামারী"],["Bokainagar","বোকাইনগর"],["Douhakhola","ডৌহাখলা"],["Gouripur","গৌরীপুর"],["Mailakanda","মইলাকান্দা"],["Maoha","মাওহা"],["Ramgopalpur","রামগোপালপুর"],["Sahanati","সহনাটি"],["Sidhla","সিধলা"]],"346":[["Acmita","আচমিতা"],["Banagram","বনগ্রাম"],["Chandpur","চান্দপুর"],["Jalalpur","জালালপুর"],["Kargaon","কারগাঁও"],["Lohajuree","লোহাজুরী"],["Mosua","মসূয়া"],["Mumurdia","মুমুরদিয়া"],["Shahasram Dhuldia","সহশ্রাম ধুলদিয়া"]],"200":[["Adabaria","ড়ীয়া"],["Aria","আড়িয়া"],["Boalia","বোয়ালি"],["Chilmary","চিলমারী"],["Daulatpur","দৌলতপুর"],["Hogolbaria","হোগলবাড়ীয়া"],["Khalishakundi","খলিশাকুন্ডি"],["Moricha","মরিচা"],["Mothurapur","মথুরাপুর"],["Philipnagor","ফিলিপনগর"],["Piarpur","পিয়ারপুর"],["Pragpur","প্রাগপুর"],["Ramkrishnopur","রামকৃষ্ণপুর"],["Refaitpur","রিফাইতপুর"]],"234":[["Adabaria","আদাবারিয়া"],["Bauphal","বাউফল"],["Boga","বগা"],["Daspara","দাস পাড়া"],["Dhulia","ধুলিয়া"],["Kachipara","কাছিপাড়া"],["Kalaiya","কালাইয়া"],["Kalisuri","কালিশুরী"],["Kanakdia","কনকদিয়া"],["Keshabpur","কেশবপুর"],["Madanpura","মদনপুরা"],["Najirpur","নাজিরপুর"],["Nawmala","নওমালা"],["Shurjamoni","সূর্য্যমনি"]],"127":[["Adamdighi","আদমদিঘি"],["Chapapur","চাঁপাপুর"],["Chhatiangram","ছাতিয়ানগ্রাম"],["Kundagram","কুন্দগ্রাম"],["Nasaratpur","নশরতপুর"],["Shantahar","সান্তাহার"]],"286":[["Adampur","আদমপুর"],["Alinagar","আলী নগর"],["Islampur","ইসলামপুর"],["Kamalgonj","কমলগঞ্জ"],["Madhabpur","মাধবপুর"],["Munshibazar","মুন্সিবাজার"],["Patanushar","পতনঊষার"],["Rahimpur","রহিমপুর"],["Shamshernagar","শমশেরনগর"]],"355":[["Adampur","আদমপুর"],["Austagram Sadar","অষ্টগ্রাম সদর"],["Bangalpara","বাঙ্গালপাড়া"],["Dewghar","দেওঘর"],["Kalma","কলমা"],["Kastul","কাস্তুল"],["Khyerpur-Abdullahpur","খয়েরপুর-আব্দুল্লাপুর"],["Purba Austagram","পূর্ব অষ্টগ্রাম"]],"299":[["Adaoir","আদাঐর"],["Andiura","আন্দিউড়া"],["Bagashura","বাঘাসুরা"],["Bahara","বহরা"],["Bulla","বুল্লা"],["Chhatiain","ছাতিয়াইন"],["Choumohani","চৌমুহনী"],["Dharmaghar","ধর্মঘর"],["Jagadishpur","জগদীশপুর"],["Noapara","নোয়াপাড়া"],["Shahjahanpur","শাহজাহানপুর"]],"480":[["Adarvita","আদারভিটা"],["Balijuri","বালিজুড়ী"],["Char Pakerdah","চর পাকেরদহ"],["Gunaritala","গুনারীতলা"],["Jorekhali","জোড়খালী"],["Karaichara","কড়ইচড়া"],["Sidhuli","সিধুলী"]],"2":[["Adda","আড্ডা"],["Adra","আদ্রা"],["Aganagar","আগানগর"],["Bhabanipur","ভবানীপুর"],["Bhaukshar","ভাউকসার"],["Chitodda","চিতড্ডা"],["Galimpur","গালিমপুর"],["Jhalam","ঝলম"],["Laxmipur","লক্ষীপুর"],["North Khoshbas","উত্তর খোশবাস"],["North Shilmuri","উত্তর শিলমুড়ি"],["Payalgacha","পয়ালগাছা"],["Shakpur","শাকপুর"],["South Khoshbas","দক্ষিন খোশবাস"],["South Shilmuri","দক্ষিন শিলমুড়ি"]],"161":[["Adhaipur","আধাইপুর"],["Badalgachi","বদলগাছী"],["Balubhara","বালুভরা"],["Bilashbari","বিলাশবাড়ী"],["Kola","কোলা"],["Mithapur","মিঠাপুর"],["Mothurapur","মথুরাপুর"],["Paharpur","পাহারপুর"]],"370":[["Adhara","আধারা"],["Bajrajogini","বজ্রযোগিনী"],["Banglabazar","বাংলাবাজার"],["Charkewar","চরকেওয়ার"],["Mohakali","মহাকালী"],["Mollakandi","মোল্লাকান্দি"],["Panchashar","পঞ্চসার"],["Rampal","রামপাল"],["Shiloy","শিলই"]],"75":[["Adhunagar","আধুনগর"],["Amirabad","আমিরাবাদ"],["Barahatia","বড়হাতিয়া"],["Charamba","চরম্বা"],["Chunati","চুনতি"],["Kalauzan","কলাউজান"],["Lohagara","লোহাগাড়া"],["Padua","পদুয়া"],["Putibila","পুটিবিলা"]],"315":[["Adiabad","আদিয়াবাদ"],["Alipura","অলিপুরা"],["Amirganj","আমিরগঞ্জ"],["Banshgari","বাঁশগাড়ী"],["Chanderkandi","চান্দেরকান্দি"],["Chanpur","চানপুর"],["Chararalia","চরআড়ালিয়া"],["Charmadhua","চরমধুয়া"],["Charsubuddi","চরসুবুদ্দি"],["Daukarchar","ডৌকারচর"],["Hairmara","হাইরমারা"],["Maheshpur","মহেষপুর"],["Marjal","মরজাল"],["Mirzanagar","মির্জানগর"],["Mirzarchar","মির্জারচর"],["Musapur","মুছাপুর"],["Nilakhya","নিলক্ষ্যা"],["Palashtali","পলাশতলী"],["Paratali","পাড়াতলী"],["Roypura","রায়পুরা"],["Sreenagar","শ্রীনগর"],["Uttar Bakharnagar","উত্তর বাখরনগর"]],"10":[["Adra","আদ্রা"],["Bangadda","বাঙ্গড্ডা"],["Boxgonj","বক্সগঞ্জ"],["Dhalua","ঢালুয়া"],["Doulkha","দৌলখাঁড়"],["Heshakhal","হেসাখাল"],["Judda","জোড্ডা"],["Makrabpur","মক্রবপুর"],["Mokara","মোকরা"],["Paria","পেরিয়া"],["Raykot","রায়কোট"],["Satbaria","সাতবাড়ীয়া"]],"476":[["Adra","আদ্রা"],["Charbani Pakuria","চরবানী পাকুরিয়া"],["Durmot","দুরমুট"],["Fulkucha","ফুলকোচা"],["Ghuserpara","ঘোষেরপাড়া"],["Jhaugara","ঝাউগড়া"],["Kulia","কুলিয়া"],["Mahmudpur","মাহমুদপুর"],["Nangla","নাংলা"],["Nayanagar","নয়ানগর"],["Shuampur","শ্যামপুর"]],"347":[["Aganagar","আগানগর"],["Gajaria","গজারিয়া"],["Kalika Prashad","কালিকা প্রসাদ"],["Sadekpur","সাদেকপুর"],["Shibpur","শিবপুর"],["Shimulkandi","শিমুলকান্দি"],["Sreenagar","শ্রীনগর"]],"367":[["Aganagar","আগানগর"],["Basta","বাস্তা"],["Hazratpur","হযরতপুর"],["Kalatia","কলাতিয়া"],["Kalindi","কালিন্দি"],["Konda","কোন্ডা"],["Ruhitpur","রোহিতপুর"],["Sakta","শাক্তা"],["Suvadda","শুভাঢ্যা"],["Taghoria","তেঘরিয়া"],["Taranagar","তারানগর"],["Zinzira","জিনজিরা"]],"182":[["Agardari","আগরদাড়ী"],["Alipur","আলিপুর"],["Baikari","বৈকারী"],["Balli","বল্লী"],["Banshdaha","বাঁশদহ"],["Bhomra","ভোমরা"],["Brahmarajpur","ব্রক্ষ্মরাজপুর"],["Dhulihar","ধুলিহর"],["Fingri","ফিংড়ি"],["Ghona","ঘোনা"],["Jhaudanga","ঝাউডাঙ্গা"],["Kuskhali","কুশখালী"],["Labsa","লাবসা"],["Shibpur","শিবপুর"]],"490":[["Agia","আগিয়া"],["Bairaty","বৈরাটী"],["Bishkakuni","বিশকাকুনী"],["Dhalamulgaon","ধলামুলগাঁও"],["Ghagra","ঘাগড়া"],["Gohalakanda","গোহালাকান্দা"],["Hogla","হোগলা"],["Jaria","জারিয়া"],["Khalishaur","খলিশাউড়"],["Narandia","নারান্দিয়া"],["Purbadhala","পূর্বধলা"]],"368":[["Agla","আগলা"],["Bakshanagar","বক্সনগর"],["Bandura","বান্দুরা"],["Barrah","বাহ্রা"],["Baruakhali","বারুয়াখালী"],["Churain","চুড়াইন"],["Galimpur","গালিমপুর"],["Jantrail","যন্ত্রাইল"],["Joykrishnapur","জয়কৃষ্ণপুর"],["Kailail","কৈলাইল"],["Kalakopa","কলাকোপা"],["Nayansree","নয়নশ্রী"],["Shikaripara","শিকারীপাড়া"],["Sholla","শোল্লা"]],"163":[["Agradigun","আগ্রাদ্বিগুন"],["Alampur","আলমপুর"],["Aranagar","আড়ানগর"],["Dhamoirhat","ধামইরহাট"],["Isabpur","ইসবপুর"],["Jahanpur","জাহানপুর"],["Khelna","খেলনা"],["Umar","উমার"]],"297":[["Ahammadabad","আহম্মদাবাদ"],["Chunarughat","চুনারুঘাট"],["Deorgach","দেওরগাছ"],["Gazipur","গাজীপুর"],["Mirashi","মিরাশী"],["Paikpara","পাইকপাড়া"],["Ranigaon","রাণীগাঁও"],["Shankhala","শানখলা"],["Shatiajuri","সাটিয়াজুরী"],["Ubahata","উবাহাটা"]],"113":[["Ahammadpur","আহম্মদপুর"],["Dulai","দুলাই"],["Hatkhali","হাটখালী"],["Manikhat","মানিকহাট"],["Nazirganj","নাজিরগঞ্জ"],["Raninagar","রাণীনগর"],["Sagorkandi","সাগরকান্দি"],["Satbaria","সাতবাড়ীয়া"],["Tantibonda","তাঁতিবন্দ"],["Vaina","ভায়না"]],"151":[["Ahammedabad","আহম্মেদাবাদ"],["Matrai","মাত্রাই"],["Punot","পুনট"],["Udaipur","উদয়পুর"],["Zindarpur","জিন্দারপুর"]],"435":[["Ahcha","আকচা"],["Akhanagar","আখানগর"],["Auliapur","আউলিয়াপুর"],["Balia","বালিয়া"],["Baragaon","বড়গাঁও"],["Begunbari","বেগুনবাড়ী"],["Chilarang","চিলারং"],["Debipur","দেবীপুর"],["Dholarhat","ঢোলারহাট"],["Gareya","গড়েয়া"],["Jagannathpur","জগন্নাথপুর"],["Jamalpur","জামালপুর"],["Mohammadpur","মোহাম্মদপুর"],["Nargun","নারগুন"],["Rahimanpur","রহিমানপুর"],["Rajagaon","রাজাগাঁও"],["Roypur","রায়পুর"],["Ruhea","রুহিয়া"],["Ruhia Pashchim","রুহিয়া পশ্চিম"],["Salandar","সালন্দর"],["Sukhanpukhari","শুখানপুকুরী"]],"71":[["Ahla Karaldenga","আহল্লা করলডেঙ্গা"],["Amuchia","আমুচিয়া"],["Charandwi","চরনদ্বীপ"],["Kandhurkhil","কধুরখীল"],["Pashchim Gamdandi","পশ্চিম গোমদন্ডী"],["Popadia","পোপাদিয়া"],["Purba Gomdandi","পুর্ব গোমদন্ডী"],["Sakpura","শাকপুরা"],["Saroatali","সারোয়াতলী"],["Sreepur-Kharandwi","শ্রীপুর-খরন্দীপ"]],"166":[["Ahsanganj","আহসানগঞ্জ"],["Bhonpara","ভোঁপড়া"],["Bisha","বিশা"],["Hatkalupara","হাটকালুপাড়া"],["Kalikapur","কালিকাপুর"],["Maniary","মনিয়ারী"],["Panchupur","পাঁচুপুর"],["Shahagola","শাহাগোলা"]],"209":[["Aichgati","আইচগাতী"],["Ghatvog","ঘাটভোগ"],["Noihati","নৈহাটি"],["Srifoltola","শ্রীফলতলা"],["Tsb","টিএসবি"]],"170":[["Aihai","আইহাই"],["Goala","গোয়ালা"],["Patari","পাতাড়ী"],["Sapahar","সাপাহার"],["Shironti","শিরন্টী"],["Tilna","তিলনা"]],"193":[["Ailhash","আইলহাঁস"],["Baradi","বাড়াদী"],["Belgachi","বেলগাছি"],["Bhangbaria","ভাংবাড়ীয়া"],["Chitla","চিৎলা"],["Dauki","ডাউকী"],["Gangni","গাংনী"],["Hardi","হারদী"],["Jamjami","জামজামি"],["Jehala","জেহালা"],["Kalidashpur","কালিদাসপুর"],["Kashkorara","খাসকররা"],["Khadimpur","খাদিমপুর"],["Kumari","কুমারী"],["Nagdah","নাগদাহ"]],"37":[["Aimachara","আইমাছড়া"],["Barkal","বরকল"],["Borohorina","বড় হরিণা"],["Bushanchara","ভূষনছড়া"],["Subalong","সুবলং"]],"339":[["Ajgana","আজগানা"],["Anaitara","আনাইতারা"],["Bahuria","বহুরিয়া"],["Banail","বানাইল"],["Baora","ভাওড়া"],["Bastail","বাঁশতৈল"],["Bhatram","ভাতগ্রাম"],["Fatepur","ফতেপুর"],["Gorai","গোড়াই"],["Jamurki","জামুর্কী"],["Latifpur","লতিফপুর"],["Mahera","মহেড়া"],["Tarafpur","তরফপুর"],["Warshi","ওয়ার্শী"]],"210":[["Ajgora","আজগড়া"],["Barasat","বারাসাত"],["Chagladoho","ছাগলাদহ"],["Modhupur","মধুপুর"],["Sochiadaho","সাচিয়াদাহ"],["Terokhada","তেরখাদা"]],"294":[["Ajmiriganj Sadar","আজমিরীগঞ্জ সদর"],["Badolpur","বদলপুর"],["Jolsuka","জলসুখা"],["Kakailsao","কাকাইলছেও"],["Shibpasha","শিবপাশা"]],"162":[["Akbarpur","আকবরপুর"],["Amair","আমাইড়"],["Dibar","দিবর"],["Ghasnagar","ঘষনগর"],["Krishnapur","কৃষ্ণপুর"],["Matindar","মাটিন্দর"],["Nazipur","নজিপুর"],["Nirmail","নিমইল"],["Patichrara","পাটিচড়া"],["Patnitala","পত্নীতলা"],["Shihara","শিহারা"]],"288":[["Akhailkura","আখাইলকুড়া"],["Amtail","আমতৈল"],["Apar Kagabala","আপার কাগাবলা"],["Chadnighat","চাঁদনীঘাট"],["Ekatuna","একাটুনা"],["Giasnagar","গিয়াসনগর"],["Kamalpur","কামালপুর"],["Khalilpur","খলিলপুর"],["Konokpur","কনকপুর"],["Monumukh","মনুমুখ"],["Mostafapur","মোস্তফাপুর"],["Nazirabad","নাজিরাবাদ"]],"29":[["Akhauran","আখাউড়া (উঃ)"],["Akhauras","আখাউড়া (দঃ)"],["Dharkhar","ধরখার"],["Mogra","মোগড়া"],["Monionda","মনিয়ন্দ"]],"393":[["Akoter Char","আকোটের চর"],["Bhashanchar","ভাষানচর"],["Char Bisnopur","চর বিষ্ণুপুর"],["Char Manair","চর মানাইর"],["Char Nasirpur","চর নাসিরপুর"],["Dhaukhali","ঢেউখালী"],["Krishnapur","কৃষ্ণপুর"],["Narikel Bariya","নারিকেল বাড়িয়া"],["Sadarpur","সদরপুর"]],"9":[["Akubpur","আকুবপুর"],["Andicot","আন্দিকোট"],["Babutipara","বাবুটিপাড়া"],["Bangara (East)","বাঙ্গরা (পূর্ব)"],["Bangara (West)","বাঙ্গরা (পশ্চিম)"],["Camalla","কামাল্লা"],["Chapitala","চাপিতলা"],["Damgar","ধামঘর"],["Darura","দারোরা"],["Jahapur","জাহাপুর"],["Jatrapur","যাত্রাপুর"],["Muradnagar Sadar","মুরাদনগর সদর"],["Nobipur (East)","নবীপুর (পুর্ব)"],["Nobipur (West)","নবীপুর (পশ্চিম)"],["Paharpur","পাহাড়পুর"],["Purbadair (East)","পুর্বধৈইর (পুর্ব)"],["Purbadair (West)","পুর্বধৈইর (পশ্চিম)"],["Ramachandrapur (North)","রামচন্দ্রপুর (উত্তর)"],["Ramachandrapur (South)","রামচন্দ্রপুর (দক্ষিন)"],["Salikandi","ছালিয়াকান্দি"],["Sreekil","শ্রীকাইল"],["Tanki","টনকী"]],"411":[["Aladipur","আলাদিপুর"],["Aloary","এলুয়াড়ী"],["Bethdighi","বেতদিঘী"],["Daulatpur","দৌলতপুর"],["Kagihal","কাজীহাল"],["Khairbari","খয়েরবাড়ী"],["Shibnagor","শিবনগর"]],"441":[["Alambiditor","আলমবিদিতর"],["Betgari","বেতগাড়ী"],["Borobil","বড়বিল"],["Gojoghonta","গজঘন্টা"],["Gongachora","গংগাচড়া"],["Kholeya","খলেয়া"],["Kolcondo","কোলকোন্দ"],["Lakkhitari","লক্ষীটারী"],["Morneya","মর্ণেয়া"],["Nohali","নোহালী"]],"337":[["Alamnagor","আলমনগর"],["Dhopakandi","ধোপাকান্দি"],["Hadera","হাদিরা"],["Hemnagor","হেমনগর"],["Jhawail","ঝাওয়াইল"],["Mirzapur","মির্জাপুর"],["Nagdashimla","নগদাশিমলা"]],"152":[["Alampur","আলমপুর"],["Borail","বড়াইল"],["Boratara","বড়তারা"],["Mamudpur","মামুদপুর"],["Tulshiganga"," তুলশীগংগা"]],"442":[["Alampur","আলমপুর"],["Hariarkuthi","হাড়িয়ারকুঠি"],["Ikorchali","ইকরচালী"],["Kurshatara","কুর্শা"],["Soyar","সয়ার"]],"274":[["Alankari","অলংকারী"],["Bishwanath","বিশ্বনাথ"],["Daulatpur","দৌলতপুর"],["Dewkalash","দেওকলস"],["Doshghar","দশঘর"],["Khajanchi","খাজাঞ্চী"],["Lamakazi","লামাকাজী"],["Rampasha","রামপাশা"]],"325":[["Alaolpur","আলাওলপুর"],["Edilpur","ইদিলপুর"],["Goshairhat","গোসাইরহাট"],["Kodalpur","কোদালপুর"],["Kuchipatti","কুচাইপট্টি"],["Nager Para","নাগের পাড়া"],["Nalmuri","নলমুড়ি"],["Samontasar","সামন্তসার"]],"155":[["Alatuli","আলাতুলী"],["Baliadanga","বালিয়াডাঙ্গা"],["Baroghoria","বারঘরিয়া"],["Char Anupnagar","চর অনুপনগর"],["Charbagdanga","চরবাগডাঙ্গা"],["Debinagar","দেবীনগর"],["Gobratola","গোবরাতলা"],["Islampur","ইসলামপুর"],["Jhilim","ঝিলিম"],["Moharajpur","মহারাজপুর"],["Narayanpur","নারায়নপুর"],["Ranihati","রানীহাটি"],["Shahjahanpur","শাহজাহানপুর"],["Sundarpur","সুন্দরপুর"]],"100":[["Alekyong","আলেক্ষ্যং"],["Nawapotong","নোয়াপতং"],["Rowangchari Sadar","রোয়াংছড়ি সদর"],["Taracha","তারাছা"]],"391":[["Alfadanga","আলফাডাঙ্গা"],["Bana","বানা"],["Buraich","বুড়াইচ"],["Gopalpur","গোপালপুর"],["Panchuria","পাঁচুড়িয়া"],["Tagarbanda","টগরবন্দ"]],"395":[["Algi","আলগী"],["Azimnagor","আজিমনগর"],["Chandra","চান্দ্রা"],["Chumurdi","চুমুরদী"],["Gharua","ঘারুয়া"],["Hamirdi","হামিরদী"],["Kalamridha","কালামৃধা"],["Kawlibera","কাউলিবেড়া"],["Manikdha","মানিকদহ"],["Nasirabad","নাছিরাবাদ"],["Nurullagonj","নুরুল্যাগঞ্জ"],["Tujerpur","তুজারপুর"]],"52":[["Algidurgapur (North)","আলগী দুর্গাপুর (উত্তর)"],["Algidurgapur (South)","আলগী দুর্গাপুর (দক্ষিণ)"],["Charbhairabi","চরভৈরবী"],["Gazipur","গাজীপুর"],["Haimchar","হাইমচর"],["Nilkamal","নীলকমল"]],"82":[["Ali Akbar Deil","আলি আকবর ডেইল"],["Baragho","বড়ঘোপ"],["Dakshi Dhurung","দক্ষিণ ধুরুং"],["Kaiyarbil","কৈয়ারবিল"],["Lemsikhali","লেমসিখালী"],["Uttar Dhurung","উত্তর ধুরুং"]],"390":[["Aliabad","আলিয়াবাদ"],["Ambikapur","অম্বিকাপুর"],["Charmadbdia","চরমাধবদিয়া"],["Decreerchar","ডিক্রিরচর"],["Greda","গেরদা"],["Ishangopalpur","ঈশানগোপালপুর"],["Kaijuri","কৈজুরী"],["Kanaipur","কানাইপুর"],["Krishnanagar","কৃষ্ণনগর"],["Majchar","মাচ্চর"],["Uttarchannel","নর্থচ্যানেল"]],"413":[["Alihat","আলীহাট"],["Boalder","বোয়ালদার"],["Khattamadobpara","খট্টামাধবপাড়া"]],"98":[["Alikadam Sadar","আলীকদম সদর"],["Chwekhyong","চৈক্ষ্যং"]],"256":[["Alimabad","আলিমাবাদ"],["Andarmanik","আন্দারমানিক"],["Bhashanchar","ভাষানচর"],["Biddanandapur","বিদ্যানন্দনপুর"],["Chandpur","চানপুর"],["Charakkorea","চরএককরিয়া"],["Chargopalpur","চরগোপালপুর"],["Darirchar Khajuria","দড়িরচর খাজুরিয়া"],["Gobindapur","গোবিন্দপুর"],["Jangalia","জাঙ্গালিয়া"],["Lata","লতা"],["Mehendigong","মেহেন্দিগঞ্জ"],["Ulania","উলানিয়া"]],"156":[["Alinagar","আলীনগর"],["Bangabari","বাঙ্গাবাড়ী"],["Boalia","বোয়ালিয়া"],["Chowdala","চৌডালা"],["Gomostapur","গোমস্তাপুর"],["Parbotipur","পার্বতীপুর"],["Radhanagar","রাধানগর"],["Rahanpur","রহনপুর"]],"273":[["Alinagar","আলীনগর"],["Charkhai","চরখাই"],["Dubag","দুবাগ"],["Kurarbazar","কুড়ারবাজার"],["Lauta","লাউতা"],["Mathiura","মাথিউরা"],["Mullapur","মোল্লাপুর"],["Muria","মুড়িয়া"],["Sheola","শেওলা"],["Tilpara","তিলপাড়া"]],"383":[["Alinagar","আলীনগর"],["Baligram","বালীগ্রাম"],["Basgari","বাঁশগাড়ী"],["Chardoulatkhan","চরদৌলতখান"],["Dashar","ডাসার"],["Enayetnagor","এনায়েতনগর"],["Gopalpur","গোপালপুর"],["Kazibakai","কাজীবাকাই"],["Koyaria","কয়ারিয়া"],["Laxmipur","লক্ষীপুর"],["Nabogram","নবগ্রাম"],["Ramjanpur","রমজানপুর"],["Shahebrampur","সাহেবরামপুর"],["Shikarmongol","শিকারমঙ্গল"]],"259":[["Alinagor","আলীনগর"],["Bapta","বাপ্তা"],["Charshamya","চরসামাইয়া"],["Dhania","ধনিয়া"],["Ilisha","ইলিশা"],["Kachia","কাচিয়া"],["North Digholdi","উত্তর দিঘলদী"],["Razapur","রাজাপুর"],["Shibpur","শিবপুর"],["South Digholdi","দক্ষিণ দিঘলদী"],["Vheduria","ভেদুরিয়া"],["Vhelumia"," ভেলুমিয়া"],["Westilisa","পশ্চিম ইলিশা"]],"237":[["Alipur","আলীপুর"],["Baharampur","বহরমপুর"],["Bashbaria","বাঁশবাড়ীয়া"],["Betagi Shankipur","বেতাগী সানকিপুর"],["Dashmina","দশমিনা"],["Rangopaldi","রণগোপালদী"]],"376":[["Alipur","আলীপুর"],["Banibaha","বানীবহ"],["Basantapur","বসন্তপুর"],["Borat","বরাট"],["Chandoni","চন্দনী"],["Dadshee","দাদশী"],["Khangonj","খানগঞ্জ"],["Khankhanapur","খানখানাপুর"],["Mijanpur","মিজানপুর"],["Mulghar","মুলঘর"],["Panchuria","পাঁচুরিয়া"],["Ramkantapur","রামকান্তপুর"],["Shahidwahabpur","শহীদওহাবপুর"],["Sultanpur","সুলতানপুর"]],"278":[["Alirgaon","আলীরগাঁও"],["Daubari","ডৌবাড়ী"],["Fothepur","ফতেপুর"],["Lengura","লেঙ্গুড়া"],["Nandirgaon","নন্দিরগাঁও"],["Paschim Jaflong","পশ্চিম জাফলং"],["Purba Jaflong","পূর্ব জাফলং"],["Rustampur","রুস্তমপুর"],["Towakul","তোয়াকুল"]],"330":[["Alirtek","আলিরটেক"],["Baktaboli","বক্তাবলী"],["Enayetnagor","এনায়েত নগর"],["Gognagar","গোগনগর"],["Kashipur","কাশীপুর"],["Kutubpur","কুতুবপুর"]],"5":[["Alkara","আলকরা"],["Batisha","বাতিসা"],["Cheora","চিওড়া"],["Ghulpasha","ঘোলপাশা"],["Goonabati","গুনবতী"],["Jagannatdighi","জগন্নাথদিঘী"],["Kalikapur","কালিকাপুর"],["Kankapait","কনকাপৈত"],["Kashinagar","কাশিনগর"],["Moonshirhat","মুন্সীরহাট"],["Shuvapur","শুভপুর"],["Sreepur","শ্রীপুর"]],"334":[["Aloa","আলোয়া"],["Arjuna","অর্জুনা"],["Falda","ফলদা"],["Gabshara","গাবসারা"],["Gobindashi","গোবিন্দাসী"],["Nikrail","নিকরাইল"]],"313":[["Alokbali","আলোকবালী"],["Amdia","আমদিয়া ২"],["Chardighaldi","চরদিঘলদী"],["Chinishpur","চিনিশপুর"],["Hajipur","হাজীপুর"],["Karimpur","করিমপুর"],["Khathalia","কাঠালিয়া"],["Mahishasura","মহিষাশুড়া"],["Meherpara","মেহেড়পাড়া"],["Nazarpur","নজরপুর"],["Nuralapur","নূরালাপুর"],["Paikarchar","পাইকারচর"],["Panchdona","পাঁচদোনা"],["Silmandi","শিলমান্দী"]],"338":[["Alokdia","আলোকদিয়া"],["Aronkhola","অরণখোলা"],["Aushnara","আউশনারা"],["Golabari","গোলাবাড়ী"],["Mirjabari","মির্জাবাড়ী"],["Sholakuri","শোলাকুড়ি"]],"414":[["Alokjhari","আলোকঝাড়ী"],["Angarpara","আঙ্গারপাড়া"],["Bhabki","ভাবকী"],["Bherbheri","ভেড়ভেড়ী"],["Goaldihi","গোয়ালডিহি"],["Khamarpara","খামারপাড়া"]],"345":[["Alonjori","এলংজুরী"],["Badla","বাদলা"],["Boribari","বড়িবাড়ি"],["Chawganga","চৌগাংগা"],["Dhonpur","ধনপুর"],["Itna","ইটনা"],["Joysiddi","জয়সিদ্ধি"],["Mriga","মৃগা"],["Raytoti","রায়টুটি"]],"402":[["Alowakhowa","আলোয়াখোয়া"],["Balarampur","বলরামপুর"],["Dhamor","ধামোর"],["Mirgapur","মির্জাপুর"],["Radhanagar","রাধানগর"],["Toria","তোড়িয়া"]],"192":[["Alukdia","আলুকদিয়া"],["Begumpur","বেগমপুর"],["Kutubpur","কুতুবপুর"],["Mominpur","মোমিনপুর"],["Padmabila","পদ্মবিলা"],["Shankarchandra","শংকরচন্দ্র"],["Titudah","তিতুদাহ"]],"63":[["Alxendar","আলেকজান্ডার"],["Borokheri","বড়খেড়ী"],["Char Abdullah","চর আবদুল্যাহ"],["Char Algi","চর আলগী"],["Char Poragacha","চর পোড়াগাছা"],["Char Ramiz","চর রমিজ"],["Charbadam","চর বাদাম"],["Chargazi","চরগাজী"]],"45":[["Alyearpur","আলাইয়ারপুর"],["Amanullapur","আমানউল্ল্যাপুর"],["Begumganj","বেগমগঞ্জ"],["Chayani","ছয়ানী"],["Durgapur","দূর্গাপুর"],["Eklashpur","একলাশপুর"],["Gopalpur","গোপালপুর"],["Hajipur","হাজীপুর"],["Jirtali","জিরতলী"],["Kadirpur","কাদিরপুর"],["Kutubpur","কুতবপুর"],["Mirwarishpur","মিরওয়ারিশপুর"],["Narottampur","নরোত্তমপুর"],["Rajganj","রাজগঞ্জ"],["Rasulpur","রসুলপুর"],["Sharifpur","শরীফপুর"]],"214":[["Amadi","আমাদি"],["Bagali","বাগালী"],["Koyra","কয়রা"],["Moharajpur","মহারাজপুর"],["Moheswaripur","মহেশ্বরীপুর"],["North Bedkashi","উত্তর বেদকাশী"],["South Bedkashi","দক্ষিণ বেদকাশী"]],"203":[["Amalshar","আমলসার"],["Dariapur","দ্বারিয়াপুর"],["Goyespur","গয়েশপুর"],["Kadirpara","কাদিরপাড়া"],["Nakol","নাকোল"],["Shobdalpur","সব্দালপুর"],["Sreekol","শ্রীকোল"],["Sreepur","শ্রীপুর"]],"69":[["Amanullah","আমানউল্যা"],["Azimpur","আজিমপুর"],["Bauria","বাউরিয়া"],["Gachhua","গাছুয়া"],["Haramia","হারামিয়া"],["Harispur","হরিশপুর"],["Kalapania","কালাপানিয়া"],["Magdhara","মগধরা"],["Maitbhanga","মাইটভাঙ্গা"],["Musapur","মুছাপুর"],["Rahmatpur","রহমতপুর"],["Santoshpur","সন্তোষপুর"],["Sarikait","সারিকাইত"],["Urirchar","উড়িরচর"]],"399":[["Amarkhana","অমরখানা"],["Chaklahat","চাকলাহাট"],["Dhakkamara","ধাক্কামারা"],["Garinabari","গরিনাবাড়ী"],["Hafizabad","হাফিজাবাদ"],["Haribhasa","হাড়িভাসা"],["Kamat Kajol Dighi","কামাত কাজল দীঘি"],["Magura","মাগুরা"],["Panchagarh Sadar","পঞ্চগড় সদর"],["Satmara","সাতমেরা"]],"198":[["Ambaria","আমবাড়ীয়া"],["Bethbaria","বেতবাড়ীয়া"],["Gopgram","গোপগ্রাম"],["Janipur","জানিপুর"],["Joyntihazra","জয়ন্তীহাজরা"],["Khoksa","খোকসা"],["Osmanpur","ওসমানপুর"],["Shimulia","শিমুলিয়া"],["Shomospur","শোমসপুর"]],"199":[["Ambaria","আমবাড়ীয়া"],["Amla","আমলা"],["Bahalbaria","বহলবাড়ীয়া"],["Baruipara","বারুইপাড়া"],["Chhatian","ছাতিয়ান"],["Chithalia","চিথলিয়া"],["Dhubail","ধূবইল"],["Fulbaria","ফুলবাড়ীয়া"],["Kursha","কুর্শা"],["Malihad","মালিহাদ"],["Poradaha","পোড়াদহ"],["Sadarpur","সদরপুর"],["Talbaria","তালবাড়ীয়া"]],"51":[["Ambarnagor","অম্বরনগর"],["Amishapara","আমিশাপাড়া"],["Bajra","বজরা"],["Barogaon","বারগাঁও"],["Chashirhat","চাষীরহাট"],["Deoti","দেওটি"],["Joyag","জয়াগ"],["Nateshwar","নাটেশ্বর"],["Nodona","নদনা"],["Sonapur","সোনাপুর"]],"187":[["Amdah","আমদহ"],["Amjhupi","আমঝুপি"],["Buripota","বুড়িপোতা"],["Kutubpur","কতুবপুর"],["Pirojpur","পিরোজপুর"]],"154":[["Amdai","আমদই"],["Bamb","বম্বু"],["Bhadsha","ভাদসা"],["Chakborkat","চকবরকত"],["Dhalahar","ধলাহার"],["Dogachi","দোগাছি"],["Jamalpur","জামালপুর"],["Mohammadabad","মোহাম্মদাবাদ"],["Puranapail","পুরানাপৈল"]],"438":[["Amgaon","আমগাঁও"],["Bakua","বকুয়া"],["Bhaturia","ভাতুরিয়া"],["Dangipara","ডাঙ্গীপাড়া"],["Gedura","গেদুড়া"],["Haripur","হরিপুর"]],"384":[["Amgram","আমগ্রাম"],["Badarpasa","বদরপাশা"],["Bajitpur","বাজিতপুর"],["Haridasdi-Mahendrodi","হরিদাসদী-মহেন্দ্রদী"],["Hosenpur","হোসেনপুর"],["Ishibpur","ইশিবপুর"],["Kabirajpur","কবিরাজপুর"],["Kadambari","কদমবাড়ী"],["Khaliya","খালিয়া"],["Paikpara","পাইকপাড়া"],["Rajoir","রাজৈর"]],"74":[["Amilaisi","আমিলাইশ"],["Bazalia","বাজালিয়া"],["Charati","চরতী"],["Dhemsa","ঢেমশা"],["Eochiai","এওচিয়া"],["Kaliais","কালিয়াইশ"],["Kanchana","কাঞ্চনা"],["Keochia","কেঁওচিয়া"],["Khagaria","খাগরিয়া"],["Madarsa","মাদার্শা"],["Nalua","নলুয়া"],["Paschim Dhemsa","পশ্চিম ঢেমশা"],["Puranagar","পুরানগড়"],["Sadaha","ছদাহা"],["Satkania","সাতকানিয়া"],["Sonakania","সোনাকানিয়া"]],"365":[["Aminbazar","আমিনবাজার"],["Ashulia","আশুলিয়া"],["Birulia","বিরুলিয়া"],["Bongaon","বনগাঁও"],["Dhamsona","ধামসোনা"],["Kaundia","কাউন্দিয়া"],["Pathalia","পাথালিয়া"],["Savar","সাভার"],["Shimulia","শিমুলিয়া"],["Tetuljhora","তেঁতুলঝোড়া"],["Vakurta","ভাকুর্তা"],["Yearpur","ইয়ারপুর"]],"20":[["Amirabad","আমিরাবাদ"],["Bogadana","বগাদানা"],["Chardorbesh","চরদরবেশ"],["Charmozlishpur","চরমজলিশপুর"],["Chorchandia","চরচান্দিয়া"],["Mongolkandi","মঙ্গলকান্দি"],["Motigonj","মতিগঞ্জ"],["Nababpur","নবাবপুর"],["Sonagazi","সোনাগাজী"]],"463":[["Amirabari","আমিরাবাড়ী"],["Bailor","বৈলর"],["Balipara","বালিপাড়া"],["Dhanikhola","ধানীখোলা"],["Harirampur","হরিরামপুর"],["Kanihari","কানিহারী"],["Kanthal","কাঁঠাল"],["Mathbari","মঠবাড়ী"],["Mokshapur","মোক্ষপুর"],["Rampur","রামপুর"],["Sakhua","সাখুয়া"],["Trishal","ত্রিশাল"]],"212":[["Amirpur","আমিরপুর"],["Baliadanga","বালিয়াডাঙ্গা"],["Botiaghata","বটিয়াঘাটা"],["Gongarampur","গঙ্গারামপুর"],["Jolma","জলমা"],["Surkhali","সুরখালী"],["Vandarkot","ভান্ডারকোট"]],"439":[["Amjankhore","আমজানখোর"],["Borobari","বড়বাড়ী"],["Boropalashbari","বড়পলাশবাড়ী"],["Charol","চারোল"],["Dhontola","ধনতলা"],["Duosuo","দুওসুও"],["Paria","পাড়িয়া"],["Vanor","ভানোর"]],"240":[["Amkhola","আমখোলা"],["Bakulbaria","বকুলবাড়ীয়া"],["Charbiswas","চরবিশ্বাস"],["Charkajol","চরকাজল"],["Chiknikandi","চিকনিকান্দী"],["Dakua","ডাকুয়া"],["Galachipa","গলাচিপা"],["Gazalia","গজালিয়া"],["Golkhali","গোলখালী"],["Kalagachhia","কলাগাছিয়া"],["Panpatty","পানপট্টি"],["Ratandi Taltali","রতনদী তালতলী"]],"311":[["Amlaba","আমলাব"],["Bajnaba","বাজনাব"],["Belabo","বেলাব"],["Binnabayd","বিন্নাবাইদ"],["Charuzilab","চরউজিলাব"],["Diara","দেয়ারা মডেল"],["Naraynpur","নারায়নপুর"],["Patuli","পাটুলী"],["Sallabad","সল্লাবাদ"]],"239":[["Amragachia","আমড়াগাছিয়া"],["Deuli Subidkhali","দেউলী সুবিদখালী"],["Kakrabunia","কাকড়াবুনিয়া"],["Madhabkhali","মাধবখালী"],["Majidbaria","মজিদবাড়িয়া"],["Mirzaganj","মির্জাগঞ্জ"]],"247":[["Amragachia","আমড়াগাছিয়া"],["Baramasua","বড়মাছুয়া"],["Betmor Rajpara","বেতমোর রাজপাড়া"],["Daudkhali","দাউদখালী"],["Dhanisafa","ধানীসাফা"],["Haltagulishakhali","হলতাগুলিশাখালী"],["Mathbaria","মঠবাড়িয়া"],["Mirukhali","মিরুখালী"],["Shapleza","শাপলেজা"],["Tikikata","টিকিকাটা"],["Tuskhali","তুষখালী"]],"11":[["Amratoli","আমড়াতলী"],["Jagannatpur","জগন্নাথপুর"],["Kalirbazer","কালীর বাজার"],["North Durgapur","উত্তর দুর্গাপুর"],["Panchthubi","পাঁচথুবী"],["South Durgapur","দক্ষিন দুর্গাপুর"]],"244":[["Amrazuri","আমড়াজুড়ি"],["Chirapara","চিরাপাড়া"],["Kawkhali Sadar","কাউখালি সদর"],["Sayna Rogunathpur","সয়না রঘুনাথপুর"],["Shialkhathi","শিয়ালকাঠী"]],"125":[["Amrul","আমরুল"],["Aria","আড়িয়া"],["Asekpur","আশেকপুর"],["Chopinagar","চোপিনগর"],["Gohail","গোহাইল"],["Kharna","খরনা"],["Khottapara","খোট্টাপাড়া"],["Madla","মাদলা"],["Majhira","মাঝিড়া"]],"366":[["Amta","আমতা"],["Baisakanda","বাইশাকান্দা"],["Balia","বালিয়া"],["Chauhat","চৌহাট"],["Dhamrai","ধামরাই"],["Gangutia","গাংগুটিয়া"],["Jadabpur","যাদবপুর"],["Kulla","কুল্লা"],["Kushura","কুশুরা"],["Nannar","নান্নার"],["Rowail","রোয়াইল"],["Sanora","সানোড়া"],["Sombhag","সোমভাগ"],["Suapur","সুয়াপুর"],["Sutipara","সূতিপাড়া"],["Vararia","ভাড়ারিয়া"]],"36":[["Amtali","আমতলী"],["Baghaichari","বাঘাইছড়ি"],["Bongoltali","বঙ্গলতলী"],["Khedarmara","খেদারমারা"],["Marisha","মারিশ্যা"],["Rupokari","রুপকারী"],["Sajek","সাজেক"],["Sharoyatali","সারোয়াতলী"]],"95":[["Amtali","আমতলি"],["Balchari","বেলছড়ি"],["Barnal","বর্ণাল"],["Gomti","গোমতি"],["Guimara","গুইমারা"],["Matiranga","মাটিরাঙ্গা"],["Tabalchari","তবলছড়ি"],["Taindong","তাইন্দং"]],"266":[["Amtali","আমতলী"],["Arpangasia","আড়পাঙ্গাশিয়া"],["Athrogasia","আঠারগাছিয়া"],["Chotobogi","ছোটবগী"],["Chowra","চাওড়া"],["Gulishakhali","গুলিশাখালী"],["Haldia","হলদিয়া"],["Kukua","কুকুয়া"]],"469":[["Amtoil","আমতৈল"],["Bhubankura","ভূবনকুড়া"],["Bildora","বিলডোরা"],["Dhara","ধারা"],["Dhurail","ধুরাইল"],["Gazirbhita","গাজিরভিটা"],["Haluaghat","হালুয়াঘাট"],["Jugli","জুগলী"],["Kaichapur","কৈচাপুর"],["Narail","নড়াইল"],["Sakuai","শাকুয়াই"],["Swadeshi","স্বদেশী"]],"491":[["Amtola","আমতলা"],["Chollisha","চল্লিশা"],["Dokkhin Bishiura","দক্ষিণ বিশিউড়া"],["Kailati","কাইলাটি"],["Kaliara Babragati","কালিয়ারা গাবরাগাতি"],["Lokkhiganj","লক্ষীগঞ্জ"],["Medni","মেদনী"],["Modonpur","মদনপুর"],["Mougati","মৌগাতি"],["Rouha","রৌহা"],["Singher Bangla","সিংহের বাংলা"],["Thakurakona","ঠাকুরাকোণা"]],"388":[["Amtoli","আমতলী"],["Bandhabari","বান্ধাবাড়ী"],["Ghaghor","ঘাঘর"],["Hiron","হিরণ"],["Kandi","কান্দি"],["Kolabari","কলাবাড়ী"],["Kushla","কুশলা"],["Pinjuri","পিঞ্জুরী"],["Radhaganj","রাধাগঞ্জ"],["Ramshil","রামশীল"],["Sadullapur","সাদুল্লাপুর"]],"231":[["Amua","আমুয়া"],["Awrabunia","আওরাবুনিয়া"],["Chenchrirampur","চেঁচরীরামপুর"],["Kanthalia","কাঠালিয়া"],["Patikhalghata","পাটিখালঘাটা"],["Shaulajalia","শৌলজালিয়া"]],"21":[["Amzadhat","আমজাদহাট"],["Anandopur","আনন্দপুর"],["Dorbarpur","দরবারপুর"],["Fulgazi","ফুলগাজী"],["Gmhat","জি,এম, হাট"],["Munshirhat","মুন্সিরহাট"]],"43":[["Andarchar","আন্ডারচর"],["Ashwadia","অশ্বদিয়া"],["Aujbalia","এওজবালিয়া"],["Binodpur","বিনোদপুর"],["Charmatua","চরমটুয়া"],["Dadpur","দাদপুর"],["Dharmapur","ধর্মপুর"],["East Charmatua","পূর্ব চরমটুয়া"],["Kadirhanif","কাদির হানিফ"],["Kaladara","কালাদরপ"],["Newajpur","নিয়াজপুর"],["Noakhali","নোয়াখালী"],["Noannoi","নোয়ান্নই"]],"450":[["Andharirjhar","আন্ধারীরঝাড়"],["Bangasonahat","বঙ্গসোনাহাট"],["Bhurungamari","ভূরুঙ্গামারী"],["Boldia","বলদিয়া"],["Char-Bhurungamari","চর-ভূরুঙ্গামারী"],["Joymonirhat","জয়মনিরহাট"],["Paikarchara","পাইকেরছড়া"],["Pathordubi","পাথরডুবি"],["Shilkhuri","শিলখুড়ি"],["Tilai","তিলাই"]],"195":[["Andulbaria","আন্দুলবাড়ীয়া"],["Banka","বাঁকা"],["Hasadah","হাসাদাহ"],["Raypur","রায়পুর"],["Shimanto","সীমান্ত"],["Uthali","উথলী"]],"336":[["Anehola","আনেহলা"],["Deopara","দেওপাড়া"],["Deulabari","দেউলাবাড়ী"],["Dhalapara","ধলাপাড়া"],["Digar","দিগড়"],["Dighalkandia","দিঘলকান্দি"],["Ghatail","ঘাটাইল"],["Jamuria","জামুরিয়া"],["Lokerpara","লোকেরপাড়া"],["Rasulpur","রসুলপুর"],["Sandhanpur","সন্ধানপুর"]],"236":[["Angaria","আংগারিয়া"],["Labukhali","লেবুখালী"],["Muradia","মুরাদিয়া"],["Pangasia","পাংগাশিয়া"],["Sreerampur","শ্রীরামপুর"]],"322":[["Angaria","আংগারিয়া"],["Binodpur","বিনোদপুর"],["Chandrapur","চন্দ্রপুর"],["Chikondi","চিকন্দি"],["Chitolia","চিতলয়া"],["Domshar","ডোমসার"],["Mahmudpur","মাহমুদপুর"],["Palong","পালং"],["Rudrakar","রুদ্রকর"],["Shulpara","শৌলপাড়া"],["Tulasar","তুলাসার"]],"447":[["Annodanagar","অন্নদানগর"],["Itakumari","ইটাকুমারী"],["Kandi","কান্দি"],["Koikuri","কৈকুড়ী"],["Kollyani","কল্যাণী"],["Parul","পারুল"],["Pirgacha","পীরগাছা"],["Saula","ছাওলা"],["Tambulpur","তাম্বুলপুর"]],"179":[["Anulia","আনুলিয়া"],["Assasuni","আশাশুনি"],["Baradal","বড়দল"],["Budhhata","বুধহাটা"],["Durgapur","দরগাহপুর"],["Kadakati","কাদাকাটি"],["Khajra","খাজরা"],["Kulla","কুল্যা"],["Pratapnagar","প্রতাপনগর"],["Sobhnali","শোভনালী"],["Sreeula","শ্রীউলা"]],"72":[["Anwara","আনোয়ারা"],["Barasat","বারশত"],["Baroakhan","বারখাইন"],["Barumchara","বরম্নমচড়া"],["Battali","বটতলী"],["Boirag","বৈরাগ"],["Chatari","চাতরী"],["Haildhar","হাইলধর"],["Juidandi","জুঁইদন্ডী"],["Paraikora","পরৈকোড়া"],["Raipur","রায়পুর"]],"153":[["Aolai","আওলাই"],["Atapur","আটাপুর"],["Aymarasulpur","আয়মারসুলপুর"],["Bagjana","বাগজানা"],["Balighata","বালিঘাটা"],["Dharanji","ধরঞ্জি"],["Kusumba","কুসুম্বা"],["Mohammadpur","মোহাম্মদপুর"]],"479":[["Aona","আওনা"],["Bhatara","ভাটারা"],["Doail","ডোয়াইল"],["Kamrabad","কামরাবাদ"],["Mahadan","মহাদান"],["Pingna","পিংনা"],["Pogaldigha","পোগলদিঘা"],["Satpoa","সাতপোয়া"]],"300":[["Aptabnagar","আপ্তাবনগর"],["Gourarang","গৌরারং"],["Jahangirnagar","জাহাঙ্গীরনগর"],["Kathair","কাঠইর"],["Laxmansree","লক্ষণশ্রী"],["Mohonpur","মোহনপুর"],["Mollapara","মোল্লাপাড়া"],["Rangarchar","রংগারচর"],["Surma","সুরমা"]],"466":[["Aqua","আকুয়া"],["Austadhar","অষ্টধার"],["Bororchar","বোররচর"],["Boyra","বয়ড়া"],["Char Ishwardia","চর ঈশ্বরদিয়া"],["Charnilaxmia","চরনিলক্ষিয়া"],["Dapunia","দাপুনিয়া"],["Ghagra","ঘাগড়া"],["Khagdohor","খাগডহর"],["Kushtia","কুষ্টিয়া"],["Paranganj","পরানগঞ্জ"],["Sirta","সিরতা"],["Vabokhali","ভাবখালী"]],"120":[["Ar-Ataikula","আর-আতাইকুলা"],["Bhulbaria","ভুলবাড়ীয়া"],["Dhopadaha","ধোপাদহ"],["Dhulauri","ধুলাউড়ি"],["Gaurigram","গৌরীগ্রাম"],["Karamja","করমজা"],["Kashinathpur","কাশিনাথপুর"],["Khetupara","ক্ষেতুপাড়া"],["Nagdemra","নাগডেমড়া"],["Nandanpur","নন্দনপুর"]],"177":[["Arabpur","আরবপুর"],["Basundia","বসুন্দিয়া"],["Chanchra","চাঁচড়া"],["Churamankati","চূড়ামনকাটি"],["Dearamodel","দেয়ারা মডেল"],["Fathehpur","ফতেপুর"],["Haibatpur","হৈবতপুর"],["Ichhali","ইছালী"],["Kachua","কচুয়া"],["Kashimpur","কাশিমপুর"],["Lebutala","লেবুতলা"],["Narendrapur","নরেন্দ্রপুর"],["Noapara","নওয়াপাড়া"],["Ramnagar","রামনগর"],["Upasahar","উপশহর"]],"349":[["Araibaria","আড়াইবাড়িয়া"],["Gobindapur","গোবিন্দপুর"],["Jinari","জিনারী"],["Pumdi","পুমদি"],["Sahedal","সাহেদল"],["Sidhla","সিদলা"]],"28":[["Araishidha","আড়াইসিধা"],["Ashuganj","আশুগঞ্জ সদর"],["Charchartala","চরচারতলা"],["Durgapur","দুর্গাপুর"],["Lalpur","লালপুর"],["Sarifpur","শরীফপুর"],["Talshaharw","তালশহর(পঃ)"],["Tarua","তারুয়া"]],"139":[["Arani","আড়ানী"],["Bajubagha","বাজুবাঘা"],["Bausa","বাউসা"],["Gorgori","গড়গড়ি"],["Monigram","মনিগ্রাম"],["Pakuria","পাকুড়িয়া"]],"147":[["Arbab","আড়বাব"],["Arjunpur","অর্জুনপুর বরমহাটী"],["Bilmaria","বিলমাড়িয়া"],["Chongdhupoil","চংধুপইল"],["Duaria","দুয়ারিয়া"],["Durduria","দুড়দুরিয়া"],["Iswardi","ঈশ্বরদী"],["Kadimchilan","কদিমচিলান"],["Lalpur","লালপুর"],["Oalia","ওয়ালিয়া"]],"49":[["Arjuntala","অর্জুনতলা"],["Bejbagh","বিজবাগ"],["Chhatarpaia","ছাতারপাইয়া"],["Dumurua","ডুমুরুয়া"],["Kabilpur","কাবিলপুর"],["Kadra","কাদরা"],["Kesharpar","কেশরপাড়া"],["Mohammadpur","মোহাম্মদপুর"],["Nabipur","নবীপুর"]],"208":[["Aronghata","আড়ংঘাটা"],["Barakpur","বারাকপুর"],["Digholia","দিঘলিয়া"],["Gajirhat","গাজীরহাট"],["Jogipol","যোগীপোল"],["Senhati","সেনহাটি"]],"202":[["Arpara","আড়পাড়া"],["Bunagati","বুনাগাতী"],["Dhaneshwargati","ধনেশ্বরগাতী"],["Gongarampur","গঙ্গারামপুর"],["Shalikha","শালিখা"],["Shatakhali","শতখালী"],["Talkhari","তালখড়ি"]],"326":[["Arsinagar","আরশিনগর"],["Charkumaria","চরকুমারিয়া"],["Charsensas","চরসেনসাস"],["Charvaga","চরভাগা"],["D.M Khali","ডি.এম খালি"],["Kachikata","কাচিকাঁটা"],["Mahisar","মহিষার"],["Narayanpur","নারায়নপুর"],["North Tarabunia","উত্তর তারাবুনিয়া"],["Ramvadrapur","রামভদ্রপুর"],["Sakhipur","সখিপুর"],["Saygaon","ছয়গাঁও"],["South Tarabunia","দক্ষিন তারাবুনিয়া"]],"362":[["Aruoa","আরুয়া"],["Mohadebpur","মহাদেবপুর"],["Shibaloy","শিবালয়"],["Shimulia","শিমুলিয়া"],["Teota","তেওতা"],["Ulayel","উলাইল"],["Utholi","উথলী"]],"7":[["Asadpur","আছাদপুর"],["Chanderchor","চান্দেরচর"],["Dulalpur","দুলালপুর"],["Gagutiea","ঘাগুটিয়া"],["Garmora","ঘারমোড়া"],["Joypur","জয়পুর"],["Mathabanga","মাথাভাঙ্গা"],["Nilokhi","নিলখী"],["Vashania","ভাষানিয়া"]],"140":[["Asariadaha","আষাড়িয়াদহ"],["Basudebpur","বাসুদেবপুর"],["Dewpara","দেওপাড়া"],["Godagari","গোদাগাড়ী"],["Gogram","গোগ্রাম"],["Matikata","মাটিকাটা"],["Mohonpur","মোহনপুর"],["Pakri","পাকড়ী"],["Risikul","রিশিকুল"]],"304":[["Asharkandi","আশারকান্দি"],["Chilaura Holdipur","চিলাউড়া হলদিপুর"],["Kolkolia","কলকলিয়া"],["Mirpur","মীরপুর"],["Pailgaon","পাইলগাঁও"],["Patli","পাটলী"],["Raniganj","রানীগঞ্জ"],["Syedpur Shaharpara","সৈয়দপুর শাহাড়পাড়া"]],"290":[["Ashidron","আশিদ্রোন"],["Bhunabir","ভূনবীর"],["Kalapur","কালাপুর"],["Kalighat","কালীঘাট"],["Mirzapur","মির্জাপুর"],["Rajghat","রাজঘাট"],["Satgaon","সাতগাঁও"],["Sindurkhan","সিন্দুরখান"],["Sreemangal","শ্রীমঙ্গল"]],"55":[["Ashikati","আশিকাটি"],["Baghadi","বাগাদী"],["Balia","বালিয়া"],["Bishnapur","বিষ্ণপুর"],["Chandra","চান্দ্রা"],["Hanarchar","হানারচর"],["Ibrahimpur","ইব্রাহীমপুর"],["Kalyanpur","কল্যাণপুর"],["Laxmipur Model","লক্ষীপুর মডেল"],["Maishadi","মৈশাদী"],["Rajrajeshwar","রাজরাজেশ্বর"],["Rampur","রামপুর"],["Shahmahmudpur","শাহ্‌ মাহমুদপুর"],["Tarpurchandi","তরপুচন্ডী"]],"53":[["Ashrafpur","আসরাফপুর"],["Bitara","বিতারা"],["Gohat (North)","গোহাট (উত্তর)"],["Gohat (South)","গোহাট (দক্ষিণ)"],["Kachua (North)","কচুয়া (উত্তর)"],["Kachua (South)","কচুয়া (দক্ষিণ)"],["Kadla","কাদলা"],["Koroia","কড়ইয়া"],["Pathair","পাথৈর"],["Sachar","সাচার"],["Shohodebpur (East)","সহদেবপুর (পূর্ব)"],["Shohodebpur (West)","সহদেবপুর (পশ্চিম)"]],"115":[["Ashtamanisha","অষ্টমণিষা"],["Bhangura","ভাঙ্গুড়া"],["Dilpasar","দিলপাশার"],["Khanmarich","খানমরিচ"],["Parbhangura","পারভাঙ্গুড়া"]],"68":[["Asia","আশিয়া"],["Bara Uthan","বড় উঠান"],["Baralia","বরলিয়া"],["Bhatikhain","ভাটিখাইন"],["Chanhara","ছনহরা"],["Char Lakshya","চর লক্ষ্যা"],["Char Patharghata","চর পাথরঘাটা"],["Dakkhin Bhurshi","দক্ষিণ ভূর্ষি"],["Dhalghat","ধলঘাট"],["Habilasdwi","হাবিলাসদ্বীপ"],["Haidgaon","হাইদগাঁও"],["Janglukhain","জঙ্গলখাইন"],["Jiri","জিরি"],["Juldha","জুলধা"],["Kachuai","কাচুয়াই"],["Kasiais","কাশিয়াইশ"],["Kelishahar","কেলিশহর"],["Kharana","খরনা"],["Kolagaon","কোলাগাঁও"],["Kusumpura","কুসুমপুরা"],["Sikalbaha","শিকলবাহা"],["Sobhandandi","শোভনদন্ডী"]],"462":[["Asimpatuli","আছিমপাটুলী"],["Bakta","বাক্তা"],["Balian","বালিয়ান"],["Deukhola","দেওখোলা"],["Enayetpur","এনায়েতপুর"],["Fulbaria","ফুলবাড়ীয়া"],["Kaladaha","কালাদহ"],["Kushmail","কুশমাইল"],["Naogaon","নাওগাঁও"],["Putijana","পুটিজানা"],["Radhakanai","রাধাকানাই"],["Rangamatia","রাঙ্গামাটিয়া"],["Vobanipur","ভবানীপুর"]],"412":[["Askorpur","আস্করপুর"],["Auliapur","আউলিয়াপুর"],["Chealgazi","চেহেলগাজী"],["Fazilpur","ফাজিলপুর"],["Kamalpur","কমলপুর"],["Sankarpur","শংকরপুর"],["Shashora","শশরা"],["Shekpura","শেখপুরা"],["Sundorbon","সুন্দরবন"],["Uthrail","উথরাইল"]],"482":[["Asma","আসমা"],["Barhatta","বারহাট্টা"],["Baushi","বাউশী"],["Chhiram","চিরাম"],["Raypur","রায়পুর"],["Sahata","সাহতা"],["Singdha","সিংধা"]],"484":[["Asujia","আশুজিয়া"],["Bolaishimul","বলাইশিমুল"],["Chirang","চিরাং"],["Dalpa","দলপা"],["Gonda","গণ্ডা"],["Goraduba","গড়াডোবা"],["Kandiura","কান্দিউড়া"],["Maska","মাসকা"],["Muzafarpur","মোজাফরপুর"],["Noapara","নওপাড়া"],["Paikura","পাইকুড়া"],["Roailbari Amtala","রোয়াইলবাড়ী আমতলা"],["Sandikona","সান্দিকোনা"]],"318":[["Atabaha","আটাবহ"],["Boali","বোয়ালী"],["Chapair","চাপাইর"],["Dhaliora","ঢালজোড়া"],["Fulbaria","ফুলবাড়ীয়া"],["Madhyapara","মধ্যপাড়া"],["Mouchak","মৌচাক"],["Srifaltali","শ্রীফলতলী"],["Sutrapur","সূত্রাপুর"]],"116":[["Ataikula","আতাইকুলা"],["Bharara","ভাঁড়ারা"],["Chartarapur","চরতারাপুর"],["Dapunia","দাপুনিয়া"],["Dogachi","দোগাছী"],["Gayeshpur","গয়েশপুর"],["Hemayetpur","হেমায়েতপুর"],["Malanchi","মালঞ্চি"],["Maligachha","মালিগাছা"],["Sadullahpur","সাদুল্লাপুর"]],"38":[["Atarakchara","আটারকছড়া"],["Bogachattar","বগাচতর"],["Gulshakhali","গুলশাখালী"],["Kalapakujja","কালাপাকুজ্যা"],["Langad","লংগদু"],["Maeinimukh","মাইনীমুখ"],["Vasannadam","ভাসান্যাদম"]],"309":[["Atgaon","আটগাঁও"],["Bahara","বাহারা"],["Habibpur","হবিবপুর"],["Shalla Sadar","শাল্লা সদর"]],"409":[["Atgaon","আটগাঁও"],["Eshania","ঈশানিয়া"],["Murshidhat","মুর্শিদহাট"],["Nafanagar","নাফানগর"],["Rongaon","রনগাঁও"],["Shatail","ছাতইল"]],"398":[["Atghar","আটঘর"],["Ballabhdi","বল্লভদী"],["Bhawal","ভাওয়াল"],["Gatti","গট্টি"],["Jadunandi","যদুনন্দী"],["Mazadia","মাঝারদিয়া"],["Ramkantapur","রামকান্তপুর"],["Sonapur","সোনাপুর"]],"248":[["Atghorkuriana","আটঘর কুড়িয়ানা"],["Boldia","বলদিয়া"],["Doyhary","দৈহারী"],["Guarekha","গুয়ারেখা"],["Jolabari","জলাবাড়ী"],["Sarengkathi","সারেংকাঠী"],["Shorupkathi","স্বরুপকাঠী"],["Sohagdal","সোহাগদল"],["Somudoykathi","সমুদয়কাঠী"],["Sutiakathi","সুটিয়াকাঠী"]],"472":[["Atharabari","আঠারবাড়ী"],["Barahit","বড়হিত"],["Iswarganj","ঈশ্বরগঞ্জ"],["Jatia","জাটিয়া"],["Magtula","মগটুলা"],["Maijbagh","মাইজবাগ"],["Rajibpur","রাজিবপুর"],["Sarisha","সরিষা"],["Sohagi","সোহাগী"],["Tarundia","তারুন্দিয়া"],["Uchakhila","উচাখিলা"]],"204":[["Atharokhada","আঠারখাদা"],["Baroilpolita","বেরইল পলিতা"],["Bogia","বগিয়া"],["Chawlia","চাউলিয়া"],["Gopalgram","গোপালগ্রাম"],["Hazipur","হাজীপুর"],["Hazrapur","হাজরাপুর"],["Jagdal","জগদল"],["Kosundi","কছুন্দী"],["Kuchiamora","কুচিয়ামো"],["Moghi","মঘী"],["Raghobdair","রাঘবদাইড়"],["Satrijitpur","শত্রুজিৎপুর"]],"335":[["Atia","আটিয়া"],["Delduar","দেলদুয়ার"],["Deuli","দেউলী"],["Dubail","ডুবাইল"],["Elasin","এলাসিন"],["Fazilhati","ফাজিলহাটি"],["Lauhati","লাউহাটি"],["Patharail","পাথরাইল"]],"360":[["Atigram","আটিগ্রাম"],["Betila-Mitara","বেতিলা-মিতরা"],["Dighi","দিঘী"],["Garpara","গড়পাড়া"],["Hatipara","হাটিপাড়া"],["Jagir","জাগীর"],["Krishnapur","কৃঞ্চপুর"],["Nbogram","নবগ্রাম"],["Putile","পুটাইল"],["Vararia","ভাড়ারিয়া"]],"217":[["Atjuri","আটজুড়ী"],["Chunkhola","চুনখোলা"],["Gangni","গাংনী"],["Gaola","গাওলা"],["Kodalia","কোদালিয়া"],["Kulia","কুলিয়া"],["Udoypur","উদয়পুর"]],"211":[["Atlia","আটলিয়া"],["Dhamalia","ধামালিয়া"],["Dumuria","ডুমুরিয়া"],["Ghutudia","গুটুদিয়া"],["Khornia","খর্ণিয়া"],["Magurghona","মাগুরাঘোনা"],["Magurkhali","মাগুরখালি"],["Raghunathpur","রঘুনাথপুর"],["Rongpur","রংপুর"],["Rudaghora","রুদাঘরা"],["Sahos","সাহস"],["Shorafpur","শরাফপুর"],["Shovna","শোভনা"],["Vandarpara","ভান্ডারপাড়া"]],"133":[["Atmul","আটমূল"],["Bihar","বিহার"],["Buriganj","বুড়িগঞ্জ"],["Deuly","দেউলি"],["Kichok","কিচক"],["Majhihatta","মাঝিহট্ট"],["Moidanhatta","ময়দানহাট্টা"],["Mokamtala","মোকামতলা"],["Pirob","পিরব"],["Raynagar","রায়নগর"],["Sayedpur","সৈয়দপুর"],["Shibganj","শিবগঞ্জ"]],"371":[["Atpara","আটপাড়া"],["Bagra","বাঘড়া"],["Baraikhali","বাড়েখাল"],["Birtara","বাড়তারা"],["Hashara","হাসাড়া"],["Kolapara","কুলাপাড়া"],["Kukutia","কুকুটিয়া"],["Patabhog","পাঢাভোগ"],["Rarikhal","রাঢ়ীখাল"],["Shamshiddi","শ্যামসিদ্দি"],["Shologhor","ষোলঘর"],["Sreenagar","শ্রীনগর"],["Tantor","তন্তর"],["Vaggakol","ভাগ্যকুল"]],"207":[["Atra Gilatola","আটরা গিলাতলা"],["Damodar","দামোদর"],["Fultola","ফুলতলা"],["Jamira","জামিরা"]],"183":[["Atulia","আটুলিয়া"],["Bhurulia","ভুরুলিয়া"],["Burigoalini","বুড়িগোয়ালিনী"],["Gabura","গাবুরা"],["Ishwaripur","ঈশ্বরীপুর"],["Kaikhali","কৈখালী"],["Kashimari","কাশিমাড়ী"],["Munshiganj","মুন্সীগজ্ঞ"],["Nurnagar","নুরনগর"],["Padmapukur","পদ্মপুকুর"],["Ramjannagar","রমজাননগর"],["Shyamnagar","শ্যামনগর"]],"142":[["Auchpara","আউচপাড়া"],["Basupara","বাসুপাড়া"],["Borobihanoli","বড়বিহানলী"],["Dippur","দ্বীপপুর"],["Ganipur","গণিপুর"],["Gobindopara","গোবিন্দপাড়া"],["Gualkandi","গোয়ালকান্দি"],["Hamirkutsa","হামিরকুৎসা"],["Jogipara","যোগিপাড়া"],["Kacharikoalipara","কাচাড়ী কোয়লিপাড়া"],["Mariaup","মাড়িয়া"],["Nordas","নরদাস"],["Sonadanga","সোনাডাঙ্গা"],["Sreepur","শ্রীপুর"],["Suvodanga","শুভডাঙ্গা"],["Zhikara","ঝিকড়া"]],"235":[["Auliapur","আউলিয়াপুর"],["Badarpur","বদরপুর"],["Borobighai","বড় বিঘাই"],["Chotobighai","ছোট বিঘাই"],["Itbaria","ইটবাড়ীয়া"],["Jainkathi","জৈনকাঠী"],["Kalikapur","কালিকাপুর"],["Kamalapur","কমলাপুর"],["Laukathi","লাউকাঠী"],["Lohalia","লোহালিয়া"],["Madarbunia","মাদারবুনিয়া"],["Marichbunia","মরিচবুনিয়া"]],"27":[["Auraol","অরুয়াইল"],["Chunta","চুন্টা"],["Kalikaccha","কালীকচ্ছ"],["Noagoun","নোয়াগাঁও"],["Pakshimuul","পাকশিমুল"],["Panishor","পানিশ্বর"],["Sarail","সরাইল সদর"],["Shahajadapur","শাহজাদাপুর"],["Shahbazpur","শাহবাজপুর"]],"189":[["Auria","আউড়িয়া"],["Bashgram","বাশগ্রাম"],["Bhadrabila","ভদ্রবিলা"],["Bisali","বিছালী"],["Chandiborpur","চন্ডিবরপুর"],["Habokhali","হবখালী"],["Kalora","কলোড়া"],["Maijpara","মাইজপাড়া"],["Mulia","মুলিয়া"],["Shahabad","শাহাবাদ"],["Sheikhati","সেখহাটী"],["Singasholpur","সিঙ্গাশোলপুর"],["Tularampur","তুলারামপুর"]],"292":[["Aushkandi","আউশকান্দি"],["Barabhakoir Paschim","বড় ভাকৈর (পশ্চিম)"],["Barabhakoir Purba","বড় ভাকৈর (পূর্ব)"],["Bausha","বাউসা"],["Debparra","দেবপাড়া"],["Digholbak","দীঘলবাক"],["Gaznaipur","গজনাইপুর"],["Inatganj","ইনাতগঞ্জ"],["Kaliarbhanga","কালিয়ারভাংগা"],["Kargoan","করগাঁও"],["Kurshi","কুর্শি"],["Nabiganj Sadar","নবীগঞ্জ সদর"],["Paniumda","পানিউমদা"]],"454":[["Austomirchar","অষ্টমীর চর"],["Chilmari","চিলমারী"],["Nayarhat","নয়ারহাট"],["Ramna","রমনা"],["Ranigonj","রাণীগঞ্জ"],["Thanahat","থানাহাট"]],"31":[["Ayabpur","আইয়ুবপুর"],["Bancharampur","বাঞ্ছারামপুর"],["Dariadulat","দরিয়াদৌলত"],["Darikandi","দড়িকান্দি"],["Fardabad","ফরদাবাদ"],["Manikpur","মানিকপুর"],["Pahariya Kandi","পাহাড়িয়া কান্দি"],["Rupushdi","রুপসদী পশ্চিম"],["Saifullyakandi","ছয়ফুল্লাকান্দি"],["Salimabad","ছলিমাবাদ"],["Sonarampur","সোনারামপুর"],["Tazkhali","তেজখালী"],["Ujanchar","উজানচর পূর্ব"]],"267":[["Ayla Patakata","আয়লা পাতাকাটা"],["Barguna","বরগুনা"],["Bodorkhali","বদরখালী"],["Burirchor","বুড়িরচর"],["Dhalua","ঢলুয়া"],["Fuljhuri","ফুলঝুড়ি"],["Gowrichanna","গৌরিচন্না"],["Keorabunia","কেওড়াবুনিয়া"],["M. Baliatali","এম. বালিয়াতলী"],["Noltona","নলটোনা"]],"316":[["Ayubpur","আয়ুবপুর"],["Baghabo","বাঘাব"],["Chakradha","চক্রধা"],["Dulalpur","দুলালপুর"],["Joshar","যোশর"],["Joynagar","জয়নগর"],["Masimpur","মাছিমপুর"],["Putia","পুটিয়া"],["Sadharchar","সাধারচর"]],"229":[["Azampur","আজমপুর"],["Banshbaria","বাঁশবাড়ীয়া"],["Fatepur","ফতেপুর"],["Jadabpur","যাদবপুর"],["Kazirber","কাজীরবেড়"],["Manderbaria","মান্দারবাড়ীয়া"],["Natima","নাটিমা"],["Nepa","নেপা"],["Panthapara","পান্থপাড়া"],["Sbk","এস, বি, কে"],["Shyamkur","শ্যামকুড়"],["Swaruppur","স্বরুপপুর"]],"8":[["Azgora","আজগরা"],["Bakoi","বাকই"],["Gobindapur","গোবিন্দপুর"],["Kandirpar","কান্দিরপাড়"],["Laksam Purba","লাকসাম পুর্ব"],["Mudafargonj","মুদাফফর গঞ্জ"],["Uttarda","উত্তরদা"]],"358":[["Azimnagar","আজিমনগর"],["Baira","বয়রা"],["Balla","বাল্লা"],["Blara","বলড়া"],["Chala","চালা"],["Dhulsura","ধূলশুড়া"],["Gala","গালা"],["Gopinathpur","গোপীনাথপুর"],["Harukandi","হারুকান্দি"],["Kanchanpur","কাঞ্চনপুর"],["Lacharagonj","লেছড়াগঞ্জ"],["Ramkrishnapur","রামকৃঞ্চপুর"],["Sutalorie","সুতালড়ী"]],"415":[["Azimpur","আজিমপুর"],["Bhandra","ভান্ডারা"],["Bijora","বিজোড়া"],["Birol","বিরল"],["Dhamoir","ধামইর"],["Dharmapur","ধর্মপুর"],["Farakkabad","ফরাক্কাবাদ"],["Mongalpur","মঙ্গলপুর"],["Rajarampur","রাজারামপুর"],["Ranipukur","রাণীপুকুর"],["Shohorgram","শহরগ্রাম"]],"101":[["Aziznagar","আজিজনগর"],["Fasiakhali","ফাসিয়াখালী"],["Fythong","ফাইতং"],["Gajalia","গজালিয়া"],["Lama Sadar","লামা সদর"],["Rupushipara","রূপসীপাড়া"],["Sarai","সরই"]],"191":[["Babrahasla","বাবরা-হাচলা"],["Baioshona","বাঐসোনা"],["Boronaleliasabad","বড়নাল-ইলিয়াছাবাদ"],["Chacuri","চাচুড়ী"],["Hamidpur","হামিদপুর"],["Jaynagor","জয়নগর"],["Kalabaria","কলাবাড়ীয়া"],["Khashial","খাসিয়াল"],["Mauli","মাউলী"],["Pahordanga","পহরডাঙ্গা"],["Panchgram","পাঁচগ্রাম"],["Peroli","পেড়লী"],["Purulia","পুরুলিয়া"],["Salamabad","সালামাবাদ"]],"89":[["Babuchara","বাবুছড়া"],["Boalkhali","বোয়ালখালী"],["Dighinala","দিঘীনালা"],["Kabakhali","কবাখালী"],["Merung","মেরুং"]],"205":[["Babukhali","বাবুখালী"],["Balidia","বালিদিয়া"],["Binodpur","বিনোদপুর"],["Digha","দীঘা"],["Mohammadpur","মহম্মদপুর"],["Nohata","নহাটা"],["Palashbaria","পলাশবাড়ীয়া"],["Rajapur","রাজাপুর"]],"378":[["Babupara","বাবুপাড়া"],["Bahadurpur","বাহাদুরপুর"],["Habashpur","হাবাসপুর"],["Jashai","যশাই"],["Kalimahar","কলিমহর"],["Kasbamajhail","কসবামাজাইল"],["Machhpara","মাছপাড়া"],["Mourat","মৌরাট"],["Patta","পাট্টা"],["Sarisha","সরিষা"]],"363":[["Bachamara","বাচামারা"],["Baghutia","বাঘুটিয়া"],["Chakmirpur","চকমিরপুর"],["Charkataree","চরকাটারী"],["Dhamswar","ধামশ্বর"],["Khalshi","খলশী"],["Klia","কলিয়া"],["Zionpur","জিয়নপুর"]],"437":[["Bachor","বাচোর"],["Dhormogarh","ধর্মগড়"],["Hosengaon","হোসেনগাঁও"],["Kashipur","কাশিপুর"],["Lehemba","লেহেম্বা"],["Nekmorod","নেকমরদ"],["Nonduar","নন্দুয়ার"],["Ratore","রাতোর"]],"306":[["Badaghat","বাদাঘাট"],["Balijuri","বালিজুরী"],["Bordal North","বড়দল উত্তর"],["Bordal South","বড়দল দক্ষিণ"],["Sreepur North","শ্রীপুর উত্তর"],["Sreepur South","শ্রীপুর দক্ষিণ"],["Tahirpur Sadar","তাহিরপুর সদর"]],"302":[["Badaghat South","বাদাঘাট দক্ষিণ"],["Dhanpur","ধনপুর"],["Fatepur","ফতেপুর"],["Palash","পলাশ"],["Solukabad","সলুকাবাদ"]],"25":[["Badair","বাদৈর"],["Bayek","বায়েক"],["Benauty","বিনাউটি"],["Gopinathpur","গোপীনাথপুর"],["Kasbaw","কসবা"],["Kayempur","কাইমপুর"],["Kharera","খাড়েরা"],["Kuti","কুটি"],["Mehari","মেহারী"],["Mulagram","মূলগ্রাম"]],"50":[["Badalkot","বাদলকোট"],["Hat-Pukuria Ghatlabag","হাট-পুকুরিয়া ঘাটলাবাগ"],["Khilpara","খিলপাড়া"],["Mohammadpur","মোহাম্মদপুর"],["Noakhala","নোয়াখলা"],["Panchgaon","পাঁচগাঁও"],["Porokote","পরকোট"],["Ramnarayanpur","রামনারায়নপুর"],["Sahapur","সাহাপুর"]],"81":[["Badarkhali","বদরখালী"],["Bamobil Chari","বামু বিলছড়ি"],["Baraitali","বড়ইতলী"],["Bheola Manik Char","ভেওলা মানিক চর"],["Chiringa","চিরিঙ্গা"],["Demusia","ঢেমুশিয়া"],["Dulahazara","ডুলাহাজারা"],["Fashiakhali","ফাঁসিয়াখালী"],["Harbang","হারবাঙ্গ"],["Kaiar Bil","কাইয়ার বিল"],["Kakhara","কাকারা"],["Khuntakhali","খুটাখালী"],["Konakhali","কোনাখালী"],["Paschim Bara Bheola","পশ্চিম বড় ভেওলা"],["Saharbil","শাহারবিল"],["Surajpur Manikpur","সুরজপুর মানিকপুর"]],"265":[["Badarpur","বদরপুর"],["Charbhuta","চরভূতা"],["Dholigour Nagar","ধলীগৌর নগর"],["Farajgonj","ফরাজগঞ্জ"],["Kalma"," কালমা"],["Lalmohan","লালমোহন"],["Lord Hardinge","লর্ড হার্ডিঞ্জ"],["Paschim Char Umed","পশ্চিম চর উমেদ"],["Ramagonj","রমাগঞ্জ"]],"141":[["Badhair","বাধাইড়"],["Chanduria","চান্দুড়িয়া"],["Kalma","কলমা"],["Kamargaon","কামারগাঁ"],["Panchandar","পাঁচন্দর"],["Saranjai","সরঞ্জাই"],["Talondo","তালন্দ"]],"221":[["Badhal","বাধাল"],["Dhopakhali","ধোপাখালী"],["Gojalia","গজালিয়া"],["Gopalpur","গোপালপুর"],["Kachua","কচুয়া"],["Moghia","মঘিয়া"],["Raripara","রাড়ীপাড়া"]],"429":[["Badiakhali","বাদিয়াখালী"],["Ballamjhar","বল্লমঝাড়"],["Boali","বোয়ালী"],["Ghagoa","ঘাগোয়া"],["Gidari","গিদারী"],["Kamarjani","কামারজানি"],["Kholahati","খোলাহাটী"],["Kuptola","কুপতলা"],["Laxmipur","লক্ষ্মীপুর"],["Malibari","মালীবাড়ী"],["Mollarchar","মোল্লারচর"],["Ramchandrapur","রামচন্দ্রপুর"],["Shahapara","সাহাপাড়া"]],"178":[["Bagachra","বাগআচড়া"],["Bahadurpur","বাহাদুরপুর"],["Benapole","বেনাপোল"],["Dihi","ডিহি"],["Goga","গোগা"],["Kayba","কায়বা"],["Lakshmanpur","লক্ষণপুর"],["Nizampur","নিজামপুর"],["Putkhali","পুটখালী"],["Sharsha","শার্শা"],["Ulshi","উলশী"]],"481":[["Bagarchar","বগারচর"],["Bakshigonj","বকসীগঞ্জ"],["Battajore","বাট্রাজোড়"],["Danua","ধানুয়া"],["Merurchar","মেরুরচর"],["Nilakhia","নিলক্ষিয়া"],["Shadurpara","সাধুরপাড়া"]],"397":[["Bagat","বাগাট"],["Dumain","ডুমাইন"],["Gazna","গাজনা"],["Jahapur","জাহাপুর"],["Kamarkhali","কামারখালী"],["Madhukhali","মধুখালী"],["Megchami","মেগচামী"],["Nowpara","নওপাড়া"],["Raipur","রায়পুর"]],"146":[["Bagatipara","বাগাতিপাড়া"],["Dayarampur","দয়ারামপুর"],["Faguardiar","ফাগুয়ারদিয়াড়"],["Jamnagor","জামনগর"],["Panka","পাঁকা"]],"110":[["Bagbati","বাগবাটি"],["Bohuli","বহুলী"],["Kaliahoripur","কালিয়াহরিপুর"],["Khokshabari","খোকশাবাড়ী"],["Kowakhola","কাওয়াখোলা"],["Mesra","মেছড়া"],["Ratankandi","রতনকান্দি"],["Sheyalkol","শিয়ালকোল"],["Songacha","ছোনগাছা"],["Soydabad","সয়দাবাদ"]],"458":[["Bagber","বাঘবেড়"],["Juganiya","যোগনীয়া"],["Kakorkandhi","কাকরকান্দি"],["Koloshpar","কলসপাড়"],["Morichpuran","মরিচপুরাণ"],["Nalitabari","নালিতাবাড়ী"],["Nayabil","নয়াবীল"],["Nonni","নন্নী"],["Puraga","পোড়াগাও"],["Rajnogor","রাজনগর"],["Ramchondrokura","রামচন্দ্রকুড়া"],["Rupnarayankura","রূপনারায়নকুড়া"]],"255":[["Bagdha","বাগধা"],["Bakal","বাকাল"],["Goila","গৈলা"],["Rajihar","রাজিহার"],["Ratnapur","রত্নপুর"]],"467":[["Baghber","বাঘবেড়"],["Dakshin Maijpara","দক্ষিণ মাইজপাড়া"],["Dhobaura","ধোবাউড়া"],["Gamaritola","গামারীতলা"],["Ghoshgaon","ঘোষগাঁও"],["Goatala","গোয়াতলা"],["Porakandulia","পোড়াকান্দুলিয়া"]],"342":[["Baghil","বাঘিল"],["Dyenna","দাইন্যা"],["Gala","গালা"],["Gharinda","ঘারিন্দা"],["Hugra","হুগড়া"],["Kakua","কাকুয়া"],["Karatia","করটিয়া"],["Katuli","কাতুলী"],["Mahamudnagar","মাহমুদনগর"],["Mogra","মগড়া"],["Porabari","পোড়াবাড়ী"],["Silimpur","ছিলিমপুর"]],"105":[["Baghutia","বাঘুটিয়া"],["Gharjan","ঘোরজান"],["Khaskaulia","খাসকাউলিয়া"],["Khaspukuria","খাসপুকুরিয়া"],["Omarpur","উমারপুর"],["Sadia Chandpur","সদিয়া চাঁদপুর"],["Sthal","স্থল"]],"172":[["Baghutia","বাঘুটিয়া"],["Chalishia","চলিশিয়া"],["Payra","পায়রা"],["Prambag","প্রেমবাগ"],["Siddhipasha","সিদ্দিপাশা"],["Sreedharpur","শ্রীধরপুর"],["Subharara","শুভরাড়া"],["Sundoli","সুন্দলী"]],"14":[["Bagmara (North)","বাগমারা (উত্তর)"],["Bagmara (South)","বাগমারা (দক্ষিন)"],["Baropara","বারপাড়া"],["Belgor (North)","বেলঘর (উত্তর)"],["Belgor (South)","বেলঘর (দক্ষিন)"],["Bhuloin (North)","ভূলইন (উত্তর)"],["Bhuloin (South)","ভূলইন (দক্ষিন)"],["Bijoypur","বিজয়পুর"],["Chuwara","চৌয়ারা"],["Goliara","গলিয়ারা"],["Jorkanoneast","জোড়কানন (পুর্ব)"],["Jorkanonwest","জোড়কানন (পশ্চিম)"],["Perul (North)","পেরুল (উত্তর)"],["Perul (South)","পেরুল (দক্ষিন)"]],"17":[["Bagmara (North)","বাগমারা (উত্তর)"],["Bagmara (South)","বাগমারা (দক্ষিন)"],["Belgor (North)","বেলঘর (উত্তর)"],["Belgor (South)","বেলঘর (দক্ষিন)"],["Bhuloin (North)","ভূলইন (উত্তর)"],["Bhuloin (South)","ভূলইন (দক্ষিন)"],["Perul (North)","পেরুল (উত্তর)"],["Perul (South)","পেরুল (দক্ষিন)"]],"78":[["Bagoan","বাগোয়ান"],["Binajuri","বিনাজুরী"],["Chikdair","চিকদাইর"],["Dabua","ডাবুয়া"],["Gohira","গহিরা"],["Holdia","হলদিয়া"],["Kodolpur","কদলপূর"],["Noapara","নোয়াপাড়া"],["Nowajushpur","নওয়াজিশপুর"],["Pahartali","পাহাড়তলী"],["Paschim Gujra","পশ্চিম গুজরা"],["Purbagujra","পূর্ব গুজরা"],["Raozan","রাউজান"],["Urkirchar","উড়কিরচর"]],"186":[["Bagowan","বাগোয়ান"],["Dariapur","দারিয়াপুর"],["Mohajanpur","মহাজনপুর"],["Monakhali","মোনাখালী"]],"197":[["Bagulat","বাগুলাট"],["Chadpur","চাঁদপুর"],["Chapra","চাপড়া"],["Charsadipur","চরসাদীপুর"],["Jaduboyra","যদুবয়রা"],["Jagonnathpur","জগন্নাথপুর"],["Kaya","কয়া"],["Nandolalpur","নন্দলালপুর"],["Panti","পান্টি"],["Sadki","সদকী"],["Shelaidah","শিলাইদহ"]],"478":[["Bahadurabad","বাহাদুরাবাদ"],["Char Amkhawa","চর আমখাওয়া"],["Chikajani","চিকাজানী"],["Chukaibari","চুকাইবাড়ী"],["Dewangonj","দেওয়ানগঞ্জ"],["Dungdhara","ডাংধরা"],["Hatibanga","হাতীভাঙ্গা"],["Parram Rampur","পাররাম রামপুর"]],"164":[["Bahadurpur","বাহাদুরপুর"],["Bhabicha","ভাবিচা"],["Chandannagar","চন্দননগর"],["Hajinagar","হাজীনগর"],["Niamatpur","নিয়ামতপুর"],["Paroil","পাড়ইল"],["Rasulpur","রসুলপুর"],["Sremantapur","শ্রীমন্তপুর"]],"201":[["Bahadurpur","বাহাদুরপুর"],["Bahirchar","বাহিরচর"],["Chandgram","চাঁদগ্রাম"],["Dharampur","ধরমপুর"],["Juniadah","জুনিয়াদহ"],["Mukarimpur","মোকারিমপুর"]],"381":[["Bahadurpur","বাহাদুরপুর"],["Chilarchar","ছিলারচর"],["Dhurail","ধুরাইল"],["Dudkhali","দুধখালী"],["Ghatmajhi","ঘটমাঝি"],["Jhaoudi","ঝাউদী"],["Kalikapur","কালিকাপুর"],["Kandua","কেন্দুয়া"],["Khoajpur","খোয়াজপুর"],["Kunia","কুনিয়া"],["Mastofapur","মস্তফাপুর"],["Panchkhola","পাঁচখোলা"],["Peyarpur","পেয়ারপুর"],["Rasti","রাস্তি"],["Sirkhara","শিড়খাড়া"]],"317":[["Bahadursadi","বাহাদুরশাদী"],["Baktarpur","বক্তারপুর"],["Jamalpurnew","জামালপুর"],["Jangalia","জাঙ্গালিয়া"],["Moktarpur","মোক্তারপুর"],["Nagari","নাগরী"],["Tumulia","তুমুলিয়া"]],"426":[["Bahagili","বাহাগিলি"],["Barabhita","বড়ভিটা"],["Chandkhana","চাঁদখানা"],["Garagram","গাড়াগ্রাম"],["Kishoreganj","কিশোরগঞ্জ"],["Magura","মাগুরা"],["Nitai","নিতাই"],["Putimari","পুটিমারী"],["Ranachandi","রনচন্ডি"]],"341":[["Baharatoil","বহেড়াতৈল"],["Dariapur","দরিয়াপুর"],["Gajaria","গজারিয়া"],["Hatibandha","হাতীবান্ধা"],["Jaduppur","যাদবপুর"],["Kakrajan","কাকড়াজান"],["Kalia","কালিয়া"],["Kalmegha","কালমেঘা"]],"220":[["Baharbunia","বহরবুনিয়া"],["Balaibunia","বলইবুনিয়া"],["Banagram","বনগ্রাম"],["Baraikhali","বারইখালী"],["Chingrakhali","চিংড়াখালী"],["Daibagnyahati","দৈবজ্ঞহাটি"],["Hoglabunia","হোগলাবুনিয়া"],["Hoglapasha","হোগলাপাশা"],["Jiudhara","জিউধরা"],["Khaulia","খাউলিয়া"],["Morrelganj","মোড়েলগঞ্জ"],["Nishanbaria","নিশানবাড়িয়া"],["Panchakaran","পঞ্চকরণ"],["Putikhali","পুটিখালী"],["Ramchandrapur","রামচন্দ্রপুর"],["Teligati","তেলিগাতী"]],"87":[["Baharchara","বাহারছড়া"],["Hnila","হ্নীলা"],["Saintmartin","সেন্ট মার্টিন"],["Subrang","সাবরাং"],["Teknaf Sadar","টেকনাফ সদর"],["Whykong","হোয়াইক্যং"]],"70":[["Baharchhara","বাহারছড়া"],["Bailchhari","বৈলছড়ি"],["Chambal","চাম্বল"],["Chhanua","ছনুয়া"],["Gandamara","গন্ডামারা"],["Kalipur","কালীপুর"],["Katharia","কাথরিয়া"],["Khankhanabad","খানখানাবাদ"],["Puichhari","পুঁইছড়ি"],["Pukuria","পুকুরিয়া"],["Sadhanpur","সাধনপুর"],["Saral","সরল"],["Sekherkhil","শেখেরখীল"],["Silk","শীলকুপ"]],"379":[["Baharpur","বহরপুর"],["Baliakandi","বালিয়াকান্দি"],["Islampur","ইসলামপুর"],["Jamalpur","জামালপুর"],["Janjal","জঙ্গল"],["Narua","নারুয়া"],["Nawabpur","নবাবপুর"]],"382":[["Baheratala North","বহেরাতলা উত্তর"],["Bahertala South","বহেরাতলা দক্ষিণ"],["Bandarkhola","বন্দরখোলা"],["Baskandi","বাঁশকান্দি"],["Charjanazat","চরজানাজাত"],["Dattapara","দত্তপাড়া"],["Ditiyakhando","দ্বিতীয়খন্ড"],["Kadirpur","কাদিরপুর"],["Kathalbari","কাঁঠালবাড়ী"],["Kutubpur","কুতুবপুর"],["Madbarerchar","মাদবরেরচর"],["Nilokhe","নিলখি"],["Panchar","পাঁচচর"],["Sannasirchar","সন্যাসিরচর"],["Shibchar","শিবচর"],["Shiruail","শিরুয়াইল"],["Umedpur","উমেদপুর"],["Vhadrasion","ভদ্রাসন"],["Vhandarikandi","ভান্ডারীকান্দি"]],"215":[["Bahirdia-Mansa","বাহিরদিয়া-মানসা"],["Betaga","বেতাগা"],["Fakirhat","ফকিরহাট"],["Lakhpur","লখপুর"],["Mulghar","মূলঘর"],["Naldha-Mouvhog","নলধা-মৌভোগ"],["Piljanga","পিলজংগ"],["Suvhadia","শুভদিয়া"]],"293":[["Bahubal Sadar","বাহুবল সদর"],["Bhadeshwar","ভাদেশ্বর"],["Lamatashi","লামাতাশী"],["Mirpur","মিরপুর"],["Putijuri","পুটিজুরী"],["Satkapon","সাতকাপন"],["Snanghat","স্নানঘাট"]],"332":[["Baidyerbazar","বৈদ্যেরবাজার"],["Baradi","বারদী"],["Jampur","জামপুর"],["Kanchpur","কাচপুর"],["Mograpara","মোগরাপাড়া"],["Noagaon","নোয়াগাঁও"],["Pirojpur","পিরোজপুর"],["Sadipur","সাদীপুর"],["Shambhupura","শম্ভুপুরা"],["Sonmandi","সনমান্দি"]],"73":[["Bailtali","বৈলতলী"],["Barama","বরমা"],["Barkal","বরকল"],["Dhopachhari","ধোপাছড়ী"],["Dohazari","দোহাজারী"],["Hashimpur","হাশিমপুর"],["Joara","জোয়ারা"],["Kanchanabad","কাঞ্চনাবাদ"],["Satbaria","সাতবাড়িয়া"]],"219":[["Baintala","বাইনতলা"],["Bastoli","বাঁশতলী"],["Gouramva","গৌরম্ভা"],["Hurka","হুড়কা"],["Mollikerbar","মল্লিকেরবেড়"],["Perikhali","পেড়িখালী"],["Rajnagar","রাজনগর"],["Rampal","রামপাল"],["Uzzalkur","উজলকুড়"],["Vospatia","ভোজপাতিয়া"]],"372":[["Bairagadi","বয়রাগাদি"],["Baluchar","বালুচর"],["Basail","বাসাইল"],["Chitracoat","চিত্রকোট"],["Ichhapura","ইছাপুরা"],["Joyinshar","জৈনসার"],["Keyain","কেয়াইন"],["Kola","কোলা"],["Latabdi","লতাব্দী"],["Madhypara","মধ্যপাড়া"],["Malkhanagar","মালখানগর"],["Rajanagar","রাজানগর"],["Rasunia","রশুনিয়া"],["Sekhornagar","শেখরনগার"]],"356":[["Bairati","বৈরাটি"],["Dhaki","ঢাকী"],["Ghagra","ঘাগড়া"],["Gopdighi","গোপদিঘী"],["Katkhal","কাটখাল"],["Keoarjore","কেওয়ারজোর"],["Mithamoin","মিঠামইন"]],"436":[["Bairchuna","বৈরচুনা"],["Bhomradaha","ভোমরাদহ"],["Daulatpur","দৌলতপুর"],["Hajipur","হাজীপুর"],["Jabarhat","জাবরহাট"],["Khangaon","খনগাঁও"],["Kosharaniganj","কোষারাণীগঞ্জ"],["Pirganj","পীরগঞ্জ"],["Saidpur","সৈয়দপুর"],["Sengaon","সেনগাঁও"]],"99":[["Baishari","বাইশারী"],["Duwchari","দোছড়ি"],["Gumdhum","ঘুমধুম"],["Naikhyongchari Sadar","নাইক্ষ্যংছড়ি সদর"],["Sonaychari","সোনাইছড়ি"]],"253":[["Baishari","বাইশারী"],["Banaripara","বানারিপাড়া"],["Bisharkandi","বিশারকান্দি"],["Chakhar","চাখার"],["Illuhar","ইলুহার"],["Saliabakpur","সলিয়াবাকপুর"],["Sayedkathi","সৈয়দকাঠী"],["Udykhati","উদয়কাঠী"]],"13":[["Baishgaon","বাইশগাঁও"],["Bipulashar","বিপুলাসার"],["Hasnabad","হাসনাবাদ"],["Jholam (North)","ঝলম (উত্তর)"],["Jholam (South)","ঝলম (দক্ষিন)"],["Khela","খিলা"],["Lokkhanpur","লক্ষনপুর"],["Moishatua","মৈশাতুয়া"],["Natherpetua","নাথেরপেটুয়া"],["Shoroshpur","সরসপুর"],["Uttarhowla","উত্তর হাওলা"]],"457":[["Bajitkhila","বাজিতখিলা"],["Balairchar","বলাইরচর"],["Betmari Ghughurakandi","বেতমারি ঘুঘুরাকান্দি"],["Chor Mochoriya","চর মোচারিয়া"],["Chorpokhimari","চর পক্ষীমারি"],["Chorsherpur","চরশেরপুর"],["Dhola","ধলা"],["Gajir Khamar","গাজির খামার"],["Kamararchor","কামারের চর"],["Kamariya","কামারিয়া"],["Losmonpur","লছমনপুর"],["Pakuriya","পাকুরিয়া"],["Rouha","রৌহা"],["Vatshala","ভাতশালা"]],"213":[["Bajua","বাজুয়া"],["Banishanta","বানিশান্তা"],["Dakop","দাকোপ"],["Kamarkhola","কামারখোলা"],["Koilashgonj","কৈলাশগঞ্জ"],["Laudoba","লাউডোব"],["Pankhali","পানখালী"],["Sutarkhali","সুতারখালী"],["Tildanga","তিলডাঙ্গা"]],"483":[["Bakaljora","বাকলজোড়া"],["Birisiri","বিরিশিরি"],["Chandigarh","চণ্ডিগড়"],["Durgapur","দূর্গাপুর"],["Gawkandia","গাঁওকান্দিয়া"],["Kakoirgora","কাকৈরগড়া"],["Kullagora","কুল্লাগড়া"]],"57":[["Bakila","বাকিলা"],["Barkul (East)","বড়কুল (পূর্ব)"],["Barkul (West)","বড়কুল (পশ্চিম)"],["Gandharbapur (North)","গন্ধর্ব্যপুর (উত্তর)"],["Gandharbapur (South)","গন্ধর্ব্যপুর (দক্ষিণ)"],["Hajiganj Sadar","হাজীগঞ্জ সদর"],["Hatila (East)","হাটিলা (পূর্ব)"],["Hatila (West)","হাটিলা (পশ্চিম)"],["Kalocho (North)","কালচোঁ (উত্তর)"],["Kalocho (South)","কালচোঁ (দক্ষিণ)"],["Rajargaon (North)","রাজারগাঁও (উত্তর)"]],"16":[["Bakshimul","বাকশীমূল"],["Burichang Sadar","বুড়িচং সদর"],["Mokam","মোকাম"],["Moynamoti","ময়নামতি"],["Pirjatrapur","পীরযাত্রাপুর"],["Rajapur","রাজাপুর"],["Sholonal","ষোলনল"],["Varella","ভারেল্লা"]],"136":[["Baksimoil","বাকশিমইল"],["Dhuroil","ধুরইল"],["Ghasigram","ঘষিগ্রাম"],["Jahanabad","জাহানাবাদ"],["Mougachi","মৌগাছি"],["Raighati","রায়ঘাটি"]],"168":[["Baktiarpur","বক্তারপুর"],["Barshail","বর্ষাইল"],["Boalia","বোয়ালিয়া"],["Bolihar","বলিহার"],["Chandipur","চন্ডিপুর"],["Dubalhati","দুবলহাটী"],["Hapaniya","হাপানিয়া"],["Hashaigari","হাঁসাইগাড়ী"],["Kritipur","কির্ত্তিপুর"],["Shailgachhi","শৈলগাছী"],["Shekerpur","শিকারপুর"],["Tilakpur","তিলোকপুর"]],"272":[["Balaganj","বালাগঞ্জ"],["Boaljur","বোয়ালজুর"],["Dewanbazar","দেওয়ান বাজার"],["East Gouripur","পূর্ব গৌরীপুর"],["East Poilanpur","পূর্ব পৈলনপুর"],["West Gouripur","পশ্চিম গৌরীপুর"]],"425":[["Balagram","বালাগ্রাম"],["Dharmapal","ধর্মপাল"],["Douabari","ডাউয়াবাড়ী"],["Golmunda","গোলমুন্ডা"],["Golna","গোলনা"],["Kaimari","কৈমারী"],["Kathali","কাঠালী"],["Khutamara","খুটামারা"],["Mirganj","মীরগঞ্জ"],["Shaulmari","শৌলমারী"],["Simulbari","শিমুলবাড়ী"]],"424":[["Balapara","বালাপাড়া"],["Dimla Sadar","ডিমলা সদর"],["Gayabari","গয়াবাড়ী"],["Jhunagach Chapani","ঝুনাগাছ চাপানী"],["Khalisha Chapani","খালিশা চাপানী"],["Khogakharibari","খগা খড়িবাড়ী"],["Noutara","নাউতারা"],["Paschim Chhatnay","পশ্চিম ছাতনাই"],["Purba Chhatnay","পুর্ব ছাতনাই"],["Tepa Khribari","টেপা খরীবাড়ী"]],"446":[["Balapara","বালাপাড়া"],["Haragach","হারাগাছ"],["Kurshaupk","কুর্শা"],["Sarai","সারাই"],["Shahidbag","শহীদবাগ"],["Tepamodhupur","টেপামধুপুর"]],"444":[["Balarhat","বালারহাট"],["Baluya Masimpur","বালুয়া মাসিমপুর"],["Boro Hazratpur","বড় হযরতপুর"],["Borobala","বড়বালা"],["Chengmari","চেংমারী"],["Durgapur","দূর্গাপুর"],["Imadpur","ইমাদপুর"],["Kafrikhal","কাফ্রিখাল"],["Khoragach","খোরাগাছ"],["Latibpur","লতিবপুর"],["Mgopalpur","গোপালপুর"],["Milonpur","মিলনপুর"],["Mirzapur","মির্জাপুর"],["Moyenpur","ময়েনপুর"],["Payrabond","পায়রাবন্দ"],["Ranipukur","রাণীপুকুর"],["Vangni","ভাংনী"]],"364":[["Baldhara","বলধারা"],["Buyra","বায়রা"],["Chandhar","চান্দহর"],["Charigram","চারিগ্রাম"],["Dhalla","ধল্লা"],["Jamirta","জার্মিতা"],["Joymonto","জয়মন্টপ"],["Shayesta","শায়েস্তা"],["Singiar","সিংগাইর"],["Talebpur","তালেবপুর"],["Zamsha","জামশা"]],"468":[["Balia","বালিয়া"],["Baola","বওলা"],["Payari","পয়ারী"],["Phulpur","ফুলপুর"],["Rahimganj","রহিমগঞ্জ"],["Rambhadrapur","রামভদ্রপুর"],["Rupasi","রূপসী"],["Singheshwar","সিংহেশ্বর"],["Sondhara","ছনধরা"],["Vaitkandi","ভাইটকান্দি"]],"131":[["Baliadighi","বালিয়া দিঘী"],["Dakshinpara","দক্ষিণপাড়া"],["Durgahata","দুর্গাহাটা"],["Gabtali","গাবতলি"],["Kagail","কাগইল"],["Mahishaban","মহিষাবান"],["Naruamala","নাড়ুয়ামালা"],["Nasipur","নশিপুর"],["Nepaltali","নেপালতলী"],["Rameshwarpur","রামেশ্বরপুর"],["Sonarai","সোনারায়"]],"238":[["Baliatali","বালিয়াতলী"],["Chakamaia","চাকামইয়া"],["Champapur","চম্পাপুর"],["Dalbugonj","ডালবুগঞ্জ"],["Dhankhali","ধানখালী"],["Dulaser","ধুলাসার"],["Lalua","লালুয়া"],["Latachapli","লতাচাপলী"],["Mahipur","মহিপুর"],["Mithagonj","মিঠাগঞ্জ"],["Nilgonj","নীলগঞ্জ"],["Tiakhali","টিয়াখালী"]],"19":[["Baligaon","বালিগাঁও"],["Chonua","ছনুয়া"],["Dholia","ধলিয়া"],["Dhormapur","ধর্মপুর"],["Fazilpur","ফাজিলপুর"],["Forhadnogor","ফরহাদনগর"],["Kalidah","কালিদহ"],["Kazirbag","কাজিরবাগ"],["Lemua","লেমুয়া"],["Motobi","মোটবী"],["Panchgachia","পাঁচগাছিয়া"],["Sarishadi","শর্শদি"]],"474":[["Balikha","বালিখা"],["Banihala","বানিহালা"],["Biska","বিস্কা"],["Dhakua","ঢাকুয়া"],["Galagaon","গালাগাঁও"],["Kakni","কাকনী"],["Kamargaon","কামারগাঁও"],["Kamaria","কামারিয়া"],["Rampur","রামপুর"],["Tarakanda","তারাকান্দা"]],"103":[["Balipara","বলিপাড়া"],["Remakre","রেমাক্রী"],["Thanchi Sadar","থানচি সদর"],["Tind","তিন্দু"]],"245":[["Balipara","বালিপাড়া"],["Parerhat","পাড়েরহাট"],["Pattashi","পত্তাশি"]],"59":[["Balithuba (East)","বালিথুবা (পূর্ব)"],["Balithuba (West)","বালিথুবা (পশ্চিম)"],["Chardukhia (East)","চরদুখিয়া (পূর্ব)"],["Chardukhia (West)","চরদুঃখিয়া (পশ্চিম)"],["Faridgonj (South)","ফরিদ্গঞ্জ (দক্ষিণ)"],["Gobindapur (North)","গবিন্দপুর (উত্তর)"],["Gobindapur (South)","গবিন্দপুর (দক্ষিণ)"],["Gupti (East)","গুপ্তি (পূর্ব)"],["Gupti (West)","গুপ্তি (পশ্চিম)"],["Paikpara (North)","পাইকপাড়া (উত্তর)"],["Paikpara (South)","পাইকপাড়া (দক্ষিণ)"],["Rupsha (North)","রুপসা (উত্তর)"],["Rupsha (South)","রুপসা (দক্ষিণ)"],["Subidpur (East)","সুবিদপুর (পূর্ব)"],["Subidpur (West)","সুবিদপুর (পশ্চিম)"]],"361":[["Baliyakhora","বালিয়াখোড়া"],["Baniazuri","বানিয়াজুড়ী"],["Bartia","বড়টিয়া"],["Gior","ঘিওর"],["Nalee","নালী"],["Paila","পয়লা"],["Shingzuri","সিংজুড়ী"]],"359":[["Baliyati","বালিয়াটি"],["Baried","বরাইদ"],["Dargram","দড়গ্রাম"],["Dhankora","ধানকোড়া"],["Dighulia","দিঘুলিয়া"],["Fukurhati","ফুকুরহাটি"],["Hargaj","হরগজ"],["Saturia","সাটুরিয়া"],["Tilli","তিল্লী"]],"343":[["Balla","বল্লা"],["Bangra","বাংড়া"],["Birbashinda","বীরবাসিন্দা"],["Dashokia","দশকিয়া"],["Durgapur","দুর্গাপুর"],["Gohaliabari","গোহালিয়াবাড়ী"],["Kokdahara","কোকডহরা"],["Nagbari","নাগবাড়ী"],["Narandia","নারান্দিয়া"],["Paikora","পাইকড়া"],["Parkhi","পারখী"],["Salla","সল্লা"],["Shahadebpur","সহদেবপুর"]],"15":[["Balorampur","বলরামপুর"],["Jagatpur","জগতপুর"],["Kalakandi","কলাকান্দি"],["Karikandi","কড়িকান্দি"],["Majidpur","মজিদপুর"],["Narayandia","নারান্দিয়া"],["Satani","সাতানী"],["Vitikandi","ভিটিকান্দি"],["Zearkandi","জিয়ারকান্দি"]],"129":[["Balua","বালুয়া"],["Digdair","দিগদাইড়"],["Madhupur","মধুপুর"],["Pakulla","পাকুল্ল্যা"],["Sonatala","সোনাতলা"],["Tekani Chukinagar","তেকানী চুকাইনগর"],["Zorgacha","জোড়গাছা"]],"374":[["Baluakandi","বালুয়াকান্দী"],["Baushia","বাউশিয়া"],["Gajaria","গজারিয়া"],["Guagachia","গুয়াগাছিয়া"],["Hosendee","হোসেন্দী"],["Imampur","ইমামপুর"],["Tengarchar","টেংগারচর"],["Vaberchar","ভবেরচর"]],"228":[["Baluhar","বলুহর"],["Dora","দোড়া"],["Elangi","এলাঙ্গী"],["Kushna","কুশনা"],["Sabdalpur","সাবদালপুর"]],"33":[["Balukhali","বালুখালী"],["Bandukbhanga","বন্দুকভাঙ্গা"],["Jibtali","জীবতলি"],["Kutukchari","কুতুকছড়ি"],["Mogban","মগবান"],["Sapchari","সাপছড়ি"]],"269":[["Bamna","বামনা"],["Bukabunia","বুকাবুনিয়া"],["Doutola","ডৌয়াতলা"],["Ramna","রামনা"]],"62":[["Bamni","বামনী"],["Char Mohana","চর মোহনা"],["Charpata","চর পাতা"],["Keora","কেরোয়া"],["North Char Ababil","উত্তর চর আবাবিল"],["North Char Bangshi","উত্তর চর বংশী"],["Raipur","রায়পুর"],["Sonapur","সোনাপুর"],["South Char Ababil","দক্ষিন চর আবাবিল"],["South Char Bangshi","দক্ষিন চর বংশী"]],"296":[["Bamoi","বামৈ"],["Bulla","বুল্লা"],["Karab","করাব"],["Lakhai","লাখাই"],["Murakari","মোড়াকরি"],["Muriauk","মুড়িয়াউক"]],"433":[["Bamondanga","বামনডাঙ্গা"],["Belka","বেলকা"],["Chandipur","চন্ডিপুর"],["Chaporhati","ছাপরহাটী"],["Dhopadanga","ধোপাডাঙ্গা"],["Dohbond","দহবন্দ"],["Haripur","হরিপুর"],["Kapasia","কাপাসিয়া"],["Konchibari","কঞ্চিবাড়ী"],["Ramjibon","রামজীবন"],["Shantiram","শান্তিরাম"],["Sonaroy","সোনারায়"],["Sorbanondo","সর্বানন্দ"],["Sreepur","শ্রীপুর"],["Tarapur","তারাপুর"]],"449":[["Bamondanga","বামনডাঙ্গা"],["Berubari","বেরুবাড়ী"],["Bhitorbond","ভিতরবন্দ"],["Bollobherkhas","বল্লভেরখাস"],["Hasnabad","হাসনাবাদ"],["Kachakata","কঁচাকাঁটা"],["Kaligonj","কালীগঞ্জ"],["Kedar","কেদার"],["Narayanpur","নারায়নপুর"],["Newyashi","নেওয়াশী"],["Noonkhawa","নুনখাওয়া"],["Raigonj","রায়গঞ্জ"],["Ramkhana","রামখানা"],["Sontaspur","সন্তোষপুর"]],"188":[["Bamondi","বামন্দী"],["Dhankolla","ধানখোলা"],["Kathuli","কাথুলী"],["Kazipur","কাজিপুর"],["Motmura","মটমুড়া"],["Raipur","রায়পুর"],["Shaharbati","সাহারবাটী"],["Sholotaka","ষোলটাকা"],["Tentulbaria","তেঁতুলবাড়ীয়া"]],"216":[["Bamorta","বেমরতা"],["Baruipara","বারুইপাড়া"],["Bishnapur","বিষ্ণুপুর"],["Dema","ডেমা"],["Gotapara","গোটাপাড়া"],["Jatharapur","যাত্রাপুর"],["Karapara","কাড়াপাড়া"],["Khanpur","খানপুর"],["Rakhalgachi","রাখালগাছি"],["Shaitgomboj","ষাটগুম্বজ"]],"252":[["Bamrail","বামরাইল"],["Barakhota","বরাকোঠা"],["Gouthia","গুঠিয়া"],["Harta","হারতা"],["Jalla","জল্লা"],["Otra","ওটরা"],["Shatla","সাতলা"],["Shikerpur Wazirpur","শিকারপুর উজিরপুর"],["Sholok","শোলক"]],"423":[["Bamunia","বামুনীয়া"],["Bhogdaburi","ভোগডাবুড়ী"],["Boragari","বোড়াগাড়ী"],["Domar","ডোমার"],["Gomnati","গোমনাতি"],["Harinchara","হরিণচরা"],["Jorabari","জোড়াবাড়ী"],["Ketkibari","কেতকীবাড়ী"],["Panga Motukpur","পাংগা মটকপুর"],["Sonaray","সোনারায়"]],"41":[["Banajogichara","বনযোগীছড়া"],["Dumdumya","দুমদুম্যা"],["Juraichari","জুরাছড়ি"],["Moidong","মৈদং"]],"173":[["Bandabilla","বন্দবিলা"],["Basuari","বাসুয়াড়ী"],["Darajhat","দরাজহাট"],["Dhalgram","ধলগ্রাম"],["Dohakula","দোহাকুলা"],["Jaharpur","জহুরপুর"],["Jamdia","জামদিয়া"],["Narikelbaria","নারিকেলবাড়ীয়া"],["Roypur","রায়পুর"]],"329":[["Bandar","বন্দর"],["Dhamgar","ধামগর"],["Kolagathia"," কলাগাছিয়া"],["Modonpur","মদনপুর"],["Musapur","মুছাপুর"]],"97":[["Bandarban Sadar","বান্দরবান সদর"],["Kuhalong","কুহালং"],["Rajbila","রাজবিলা"],["Suwalok","সুয়ালক"],["Tongkaboty","টংকাবতী"]],"460":[["Baneshwardi","বানেশ্বর্দী"],["Chandrakona","চন্দ্রকোনা"],["Choraustadhar","চরঅষ্টধর"],["Gonopoddi","গণপদ্দী"],["Gourdwar","গৌড়দ্বার"],["Nokla","নকলা"],["Pathakata","পাঠাকাটা"],["Talki","টালকী"],["Urpha","উরফা"]],"138":[["Baneswar","বানেশ্বর"],["Belpukuria","বেলপুকুরিয়া"],["Jewpara","জিউপাড়া"],["Puthia","পুঠিয়া"],["Shilmaria","শিলমাড়িয়া"],["Valukgachi","ভালুক গাছি"]],"60":[["Bangakha","বাঙ্গাখাঁ"],["Basikpur","বশিকপুর"],["Chandrogonj","চন্দ্রগঞ্জ"],["Charramoni Mohon","চররমনী মোহন"],["Charruhita","চররুহিতা"],["Charshahi","চরশাহী"],["Dalalbazar","দালাল বাজার"],["Dattapara","দত্তপাড়া"],["Digli","দিঘলী"],["Hamsadi (North)","হামছাদী (উত্তর)"],["Hamsadi (South)","হামছাদী (দক্ষিন)"],["Hazirpara","হাজিরপাড়া"],["Kusakhali","কুশাখালী"],["Laharkandi","লাহারকান্দি"],["Nourthjoypur","উত্তর জয়পুর"],["Parbotinagar","পার্বতীনগর"],["Sakchor","শাকচর"],["Tearigonj","তেয়ারীগঞ্জ"],["Tumchor","টুমচর"],["Vobanigonj","ভবানীগঞ্জ"]],"112":[["Bangala","বাঙ্গালা"],["Borohor","বড়হর"],["Boropangashi","বড়পাঙ্গাসী"],["Durga Nagar","দুর্গা নগর"],["Hatikumrul","হটিকুমরুল"],["Mohonpur","মোহনপুর"],["Ponchocroshi","পঞ্চক্রোশী"],["Purnimagati","পূর্ণিমাগাতী"],["Ramkrisnopur","রামকৃষ্ণপুর"],["Salanga","সলঙ্গা"],["Salo","সলপ"],["Udhunia","উধুনিয়া"],["Ullapara Sadar","উল্লাপাড়া সদর"]],"39":[["Bangalhalia","বাঙ্গালহালিয়া"],["Gaindya","গাইন্দ্যা"],["Ghilachari","ঘিলাছড়ি"]],"422":[["Bangalipur","বাঙ্গালীপুর"],["Botlagari","বোতলাগাড়ী"],["Kamarpukur","কামারপুকুর"],["Kasiram Belpukur","কাশিরাম বেলপুকুর"],["Khata Madhupur","খাতা মধুপুর"]],"58":[["Banganbari","বাগানবাড়ী"],["Durgapur","দূর্গাপুর"],["Eklaspur","এখলাছপুর"],["Farajikandi","ফরাজীকান্দি"],["Fatehpur (East)","ফতেহপুর (পূর্ব)"],["Fatehpur (West)","ফতেহপুর (পশ্চিম)"],["Gazra","গজরা"],["Islamabad","ইসলামাবাদ"],["Jahirabad","জহিরাবাদ"],["Kalakanda","কালাকান্দা"],["Mohanpur","মোহনপুর"],["Sadullapur","সাদুল্ল্যাপুর"],["Satnal","ষাটনল"],["Sultanabad","সুলতানাবাদ"]],"401":[["Banghari","বেংহারী"],["Boda","বোদা"],["Boroshoshi","বড়শশী"],["Chandanbari","চন্দনবাড়ী"],["Jholaishal Shiri","ঝলইশাল শিরি"],["Kajoldighi Kaligonj","কাজলদীঘি কালিগঞ্জ"],["Marea Bamonhat","মাড়েয়া বামনহাট"],["Moidandighi","ময়দান দীঘি"],["Pachpir","পাচপীর"],["Sakoa","সাকোয়া"]],"403":[["Banglabandha","বাংলাবান্ধা"],["Bhojoanpur","ভজনপুর"],["Bhojoanpur","ভজনপুর"],["Buraburi","বুড়াবুড়ী"],["Debnagar","দেবনগর"],["Salbahan","শালবাহান"],["Tentulia","তেতুলিয়া"],["Timaihat","তিমাইহাট"]],"305":[["Banglabazar","বাংলাবাজার"],["Boglabazar","বোগলাবাজার"],["Dohalia","দোহালিয়া"],["Dowarabazar","দোয়ারাবাজার"],["Laxmipur","লক্ষীপুর"],["Mannargaon","মান্নারগাঁও"],["Norsingpur","নরসিংহপুর"],["Pandargaon","পান্ডারগাঁও"],["Surma","সুরমা"]],"295":[["Baniachong North East","বানিয়াচং উত্তর পূর্ব"],["Baniachong North West","বানিয়াচং উত্তর পশ্চিম"],["Baniachong South East","বানিয়াচং দক্ষিণ পূর্ব"],["Baniachong South West","বানিয়াচং দক্ষিণ পশ্চিম"],["Baraiuri","বড়ইউড়ি"],["Daulatpur","দৌলতপুর"],["Kagapasha","কাগাপাশা"],["Khagaura","খাগাউড়া"],["Makrampur","মক্রমপুর"],["Mandari","মন্দরী"],["Muradpur","মুরাদপুর"],["Pailarkandi","পৈলারকান্দি"],["Pukra","পুকড়া"],["Subidpur","সুবিদপুর"],["Sujatpur","সুজাতপুর"]],"344":[["Baniajan","বানিয়াজান"],["Birtara","বীরতারা"],["Bolibodrow","বলিভদ্র"],["Dhopakhali","ধোপাখালী"],["Jadunathpur","যদুনাথপুর"],["Mushuddi","মুশুদ্দি"],["Paiska","পাইস্কা"]],"485":[["Baniyajan","বানিয়াজান"],["Duoj","দুওজ"],["Lunesshor","লুনেশ্বর"],["Shormushia","স্বরমুশিয়া"],["Shunoi","শুনই"],["Sukhari","সুখারী"],["Teligati","তেলিগাতী"]],"175":[["Bankra","বাঁকড়া"],["Gadkhali","গদখালী"],["Gangananda","গংগানন্দপুর"],["Hajirbagh","হাজিরবাগ"],["Jhikargachha","ঝিকরগাছা"],["Magura","মাগুরা"],["Nabharan","নাভারন"],["Nibaskhola","নির্বাসখোলা"],["Panisara","পানিসারা"],["Shankarpur","শংকরপুর"],["Shimulia","শিমুলিয়া"]],"66":[["Banshbaria","বাঁশবারীয়া"],["Barabkunda","বারবকুন্ড"],["Bariadyala","বাড়িয়াডিয়ালা"],["Bhatiari","ভাটিয়ারী"],["Kumira","কুমিরা"],["Muradpur","মুরাদপুর"],["Saidpur","সাঈদপুর"],["Salimpur","সালিমপুর"],["Sonaichhari","সোনাইছড়ি"]],"389":[["Banshbaria","বাশঁবাড়িয়া"],["Batikamari","বাটিকামারী"],["Bohugram","বহুগ্রাম"],["Dignagar","দিগনগর"],["Gobindopur","গোবিন্দপুর"],["Gohala","গোহালা"],["Jalirpar","জলিরপাড়"],["Kashalia","কাশালিয়া"],["Khandarpara","খান্দারপাড়া"],["Mochna","মোচনা"],["Moharajpur","মহারাজপুর"],["Nanikhir","ননীক্ষীর"],["Poshargati","পশারগাতি"],["Raghdi","রাঘদী"],["Ujani","উজানী"],["Vabrashur","ভাবড়াশুর"]],"121":[["Banwarinagar","বনওয়ারীনগর"],["Brilahiribari","বৃলাহিড়ীবাড়ী"],["Demra","ডেমড়া"],["Faridpur","ফরিদপুর"],["Hadal","হাদল"],["Pungali","পুঙ্গুলি"]],"271":[["Barabagi","বড়বগি"],["Chhotabagi","ছোটবগি"],["Karibaria","কড়ইবাড়ীয়া"],["Nishanbaria","নিশানবাড়ীয়া"],["Panchakoralia","পচাকোড়ালিয়া"],["Sarikkhali","শারিকখালি"],["Sonakata","সোনাকাটা"]],"85":[["Barabakia","বড় বাকিয়া"],["Magnama","মগনামা"],["Pekua","পেকুয়া"],["Rajakhali","রাজাখালী"],["Shilkhali","শীলখালী"],["Taitong","টাইটং"],["Ujantia","উজানটিয়া"]],"227":[["Barabazar","বারবাজার"],["Jamal","জামাল"],["Kashtabhanga","কাষ্টভাঙ্গা"],["Kola","কোলা"],["Maliat","মালিয়াট"],["Niamatpur","নিয়ামতপুর"],["Rakhalgachhi","রাখালগাছি"],["Raygram","রায়গ্রাম"],["Simla-Rokonpur","শিমলা-রোকনপুর"],["Sundarpurdurgapur","সুন্দরপুর-দূর্গাপুর"],["Trilochanpur","ত্রিলোচনপুর"]],"312":[["Barachapa","বড়চাপা"],["Chalakchar","চালাকচর"],["Chandanbari","চন্দনবাড়ী"],["Charmandalia","চরমান্দালিয়া"],["Dawlatpur","দৌলতপুর"],["Ekduaria","একদুয়ারিয়া"],["Gotashia","গোতাশিয়া"],["Kanchikata","কাচিকাটা"],["Khidirpur","খিদিরপুর"],["Krisnopur","কৃষ্ণপুর"],["Labutala","লেবুতলা"],["Shukundi","শুকুন্দি"]],"280":[["Barachotul","বড়চতুল"],["Dakhin Banigram","দক্ষিন বানিগ্রাম"],["Digirpar Purbo","দিঘিরপার পূর্ব"],["Jinghabari","ঝিঙ্গাবাড়ী"],["Kanaighat","কানাইঘাট"],["Lakshiprashad Pashim","লক্ষীপ্রাসাদ পশ্চিম"],["Lakshiprashad Purbo","লক্ষীপ্রাসাদ পূর্ব"],["Rajagonj","রাজাগঞ্জ"],["Satbakh","সাতবাক"]],"104":[["Baradhul","বড়ধুল"],["Belkuchi Sadar","বেলকুচি সদর"],["Bhangabari","ভাঙ্গাবাড়ী"],["Dhukuriabera","ধুকুরিয়া বেড়া"],["Doulatpur","দৌলতপুর"],["Rajapur","রাজাপুর"]],"143":[["Barahorispur","বড়হরিশপুর"],["Biprobelghoria","বিপ্রবেলঘড়িয়া"],["Brahmapur","ব্রহ্মপুর"],["Chhatni","ছাতনী"],["Dighapatia","দিঘাপতিয়া"],["Halsa","হালসা"],["Kaphuria","কাফুরিয়া"],["Khajura","খাজুরা"],["Luxmipurkholabaria","লক্ষীপুর খোলাবাড়িয়া"],["Madhnagar","মাধনগর"],["Piprul","পিপরুল"],["Tebaria","তেবাড়িয়া"]],"233":[["Baraia","বড়ইয়া"],["Galua","গালুয়া"],["Mathbari","মঠবাড়ী"],["Rajapur","রাজাপুর"],["Saturia","সাতুরিয়া"],["Suktagarh","শুক্তাগড়"]],"145":[["Baraigram","বড়াইগ্রাম"],["Chandai","চান্দাই"],["Gopalpur","গোপালপুর"],["Joari","জোয়াড়ী"],["Majgoan","মাঝগাও"],["Nagor","নগর"],["Zonail","জোনাইল"]],"30":[["Barail","বড়াইল"],["Barikandi","বড়িকান্দি"],["Biddayakut","বিদ্যাকুট"],["Birgaon","বীরগাঁও"],["Bitghar","বিটঘর"],["Ibrahimpur","ইব্রাহিমপুর"],["Jinudpur","জিনোদপুর"],["Kaitala (North)","কাইতলা (উত্তর)"],["Kaitala (South)","কাইতলা (দক্ষিন)"],["Krishnanagar","কৃষ্ণনগর"],["Laurfatehpur","লাউরফতেপুর"],["Nabinagare","নবীনগর (পূর্ব)"],["Nabinagarw","নবীনগর(পশ্চিম)"],["Nathghar","নাটঘর"],["Rasullabad","রসুল্লাবাদ"],["Ratanpur","রতনপুর"],["Salimganj","ছলিমগঞ্জ"],["Satmura","সাতমোড়া"],["Shamogram","শ্যামগ্রাম"],["Shibpur","শিবপুর"],["Sreerampur","শ্রীরামপুর"]],"12":[["Barakanda","বড়কান্দা"],["Chalibanga","চালিভাঙ্গা"],["Chandanpur","চন্দনপুর"],["Govindapur","গোবিন্দপুর"],["Luterchar","লুটেরচর"],["Manikarchar","মানিকারচর"],["Radanagar","রাধানগর"],["Vaorkhola","ভাওরখোলা"]],"285":[["Baralekha","বড়লেখা"],["Borni","বর্ণি"],["Dakkhin Shahbajpur","দক্ষিণ শাহবাজপুর"],["Dakshinbhag Dakkhin","দক্ষিণভাগ (দক্ষিণ)"],["Dakshinbhag Uttar","দক্ষিণভাগ (উত্তর)"],["Dasherbazar","দাসেরবাজার"],["Nizbahadurpur","নিজবাহাদুরপুর"],["Sujanagar","সুজানগর"],["Talimpur","তালিমপুর"],["Talimpur","তালিমপুর"],["Uttar Shahbajpur","উত্তর শাহবাজপুর"]],"287":[["Baramchal","বরমচাল"],["Bhatera","ভাটেরা"],["Bhukshimail","ভূকশিমইল"],["Brammanbazar","ব্রাহ্মণবাজার"],["Hazipur","হাজীপুর"],["Joychandi","জয়চন্ডি"],["Kadipur","কাদিপুর"],["Kormodha","কর্মধা"],["Kulaura","কুলাউড়া"],["Prithimpassa","পৃথিমপাশা"],["Rauthgaon","রাউৎগাঁও"],["Sharifpur","শরীফপুর"],["Tilagaon","টিলাগাঁও"]],"79":[["Barauthan","বড় উঠান"],["Char Lakshya","চর লক্ষ্যা"],["Char Patharghata","চর পাথরঘাটা"],["Juldha","জুলধা"],["Sikalbaha","শিকলবাহা"]],"451":[["Baravita","বড়ভিটা"],["Bhangamor","ভাঙ্গামোড়"],["Kashipur","কাশিপুর"],["Nawdanga","নাওডাঙ্গা"],["Phulbari","ফুলবাড়ী"],["Shimulbari","শিমুলবাড়ী"]],"4":[["Barera","বাড়েরা"],["Bataghashi","বাতাঘাসি"],["Borcarai","বরকরই"],["Borcoit","বরকইট"],["Dollai Nowabpur","দোল্লাই নবাবপুর"],["Etberpur","এতবারপুর"],["Gollai","গল্লাই"],["Joag","জোয়াগ"],["Keronkhal","কেরণখাল"],["Madhaiya","মাধাইয়া"],["Maijkhar","মাইজখার"],["Mohichial","মহিচাইল"],["Shuhilpur","সুহিলপুর"]],"320":[["Baria","বাড়ীয়া"],["Basan","বাসন"],["Gachha","গাছা"],["Kashimpur","কাশিমপুর"],["Kayaltia","কাউলতিয়া"],["Konabari","কোনাবাড়ী"],["Mirzapur","মির্জাপুর"],["Pubail","পূবাইল"]],"430":[["Barisal","বরিশাল"],["Betkapa","বেতকাপা"],["Harinathpur","হরিণাথপুর"],["Hosenpur","হোসেনপুর"],["Kishoregari","কিশোরগাড়ী"],["Mohdipur","মহদীপুর"],["Monohorpur","মনোহরপুর"],["Palashbari","পলাশবাড়ী"],["Pobnapur","পবনাপুর"]],"319":[["Barishaba","বারিষাব"],["Chandpur","চাঁদপুর"],["Durgapur","দূর্গাপুর"],["Ghagotia","ঘাগটিয়া"],["Kapasia","কাপাসিয়া"],["Karihata","কড়িহাতা"],["Rayed","রায়েদ"],["Sinhasree","সিংহশ্রী"],["Sonmania","সনমানিয়া"],["Targoan","তরগাঁও"],["Tokh","টোক"]],"258":[["Barjalia","বড়জালিয়া"],["Dhulkhola","ধুলখোলা"],["Guabaria","গুয়াবাড়িয়া"],["Harinathpur","হরিনাথপুর"],["Hizla Gourabdi","হিজলা গৌরাব্দি"],["Memania","মেমানিয়া"]],"1":[["Barkamta","বরকামতা"],["Boroshalghor","বড়শালঘর"],["Dhampti","ধামতী"],["Elahabad","এলাহাবাদ"],["Fatehabad","ফতেহাবাদ"],["Jafargonj","জাফরগঞ্জ"],["Mohanpur","মোহনপুর"],["North Gunaighor","উত্তর গুনাইঘর"],["Rajameher","রাজামেহার"],["Rasulpur","রসুলপুর"],["South Gunaighor","দক্ষিণ গুনাইঘর"],["Subil","সুবিল"],["Sultanpur","সুলতানপুর"],["Vani","ভানী"],["Yousufpur","ইউসুফপুর"]],"91":[["Barmachari","বর্মাছড়ি"],["Dullyatali","দুল্যাতলী"],["Laxmichhari","লক্ষীছড়ি"]],"321":[["Barmi","বরমী"],["Gazipur","গাজীপুর"],["Gosinga","গোসিংগা"],["Kaoraid","কাওরাইদ"],["Maona","মাওনা"],["Prahladpur","প্রহলাদপুর"],["Rajabari","রাজাবাড়ী"],["Telihati","তেলিহাটী"]],"264":[["Baro Molongchora","বড় মলংচড়া"],["Chadpur","চাঁদপুর"],["Chanchra","চাচঁড়া"],["Shambupur","শম্ভুপুর"],["Sonapur","সোনাপুর"]],"241":[["Barobaisdia","বড়বাইশদিয়া"],["Chalitabunia","চালিতাবুনিয়া"],["Charmontaz","চরমোন্তাজ"],["Chattobaisdia","ছোটবাইশদিয়া"],["Rangabali","রাঙ্গাবালী"]],"417":[["Barobari","বড়বাড়ী"],["Gokunda","গোকুন্ডা"],["Harati","হারাটি"],["Khuniagachh","খুনিয়াগাছ"],["Kulaghat","কুলাঘাট"],["Mogolhat","মোগলহাট"],["Mohendranagar","মহেন্দ্রনগর"],["Panchagram","পঞ্চগ্রাম"],["Rajpur","রাজপুর"]],"223":[["Barobaria","বড়বাড়িয়া"],["Charbaniri","চরবানিয়ারী"],["Chitalmari","চিতলমারী"],["Hizla","হিজলা"],["Kalatala","কলাতলা"],["Shantoshpur","সন্তোষপুর"],["Shibpur","শিবপুর"]],"471":[["Barobaria","বারবারিয়া"],["Charalgi","চরআলগী"],["Dotterbazar","দত্তেরবাজার"],["Gafargaon","গফরগাঁও"],["Josora","যশরা"],["Longair","লংগাইর"],["Moshakhali","মশাখালী"],["Niguari","নিগুয়ারী"],["Paithol","পাইথল"],["Panchbagh","পাঁচবাগ"],["Raona","রাওনা"],["Rasulpur","রসুলপুর"],["Saltia","সালটিয়া"],["Tangabo","টাংগাব"],["Usthi","উস্থি"]],"353":[["Barogharia","বারঘড়িয়া"],["Dehunda","দেহুন্দা"],["Gujadia","গুজাদিয়া"],["Gunodhar","গুনধর"],["Joyka","জয়কা"],["Kadirjangal","কাদিরজঙ্গল"],["Kiraton","কিরাটন"],["Niamatpur","নিয়ামতপুর"],["Noabad","নোয়াবাদ"],["Sutarpara","সুতারপাড়া"],["Zafrabad","জাফরাবাদ"]],"324":[["Barogopalpur","বড়গোপালপুর"],["Barokandi","বড়কান্দি"],["Bilaspur","বিলাসপুর"],["Bknagar","বি. কে. নগর"],["Jaynagor","জয়নগর"],["Kundarchar","কুন্ডেরচর"],["Mulna","মূলনা"],["Nawdoba","নাওডোবা"],["Palerchar","পালেরচর"],["Purba Nawdoba","পুর্ব নাওডোবা"],["Shenerchar","সেনেরচর"],["Zajira Sadar","জাজিরা সদর"]],"282":[["Barohal","বারহাল"],["Barothakuri","বারঠাকুরী"],["Birorsri","বিরশ্রী"],["Kajalshah","কাজলশার"],["Kaskanakpur","কসকনকপুর"],["Kolachora","কলাছড়া"],["Manikpur","মানিকপুর"],["Sultanpur","সুলতানপুর"],["Zakiganj","জকিগঞ্জ"]],"419":[["Barokhata","বড়খাতা"],["Dawabari","ডাউয়াবাড়ী"],["Fakirpara","ফকিরপাড়া"],["Goddimari","গড্ডিমারী"],["Gotamari","গোতামারী"],["Nowdabas","নওদাবাস"],["Paticapara","পাটিকাপাড়া"],["Shaniajan","সানিয়াজান"],["Sindurna","সিন্দুর্ণা"],["Singimari","সিংগীমারী"],["Tongvhanga","টংভাঙ্গা"],["Vhelaguri","ভেলাগুড়ি"]],"6":[["Baropara","বারপাড়া"],["Betessor","বিটেশ্বর"],["Daudkandi","দাউদকান্দি"],["Doulotpur","দৌলতপুর"],["East Mohammadpur","পুর্ব মোহাম্মদপুর"],["Goalmari","গোয়ালমারী"],["Gouripur","গৌরীপুর"],["Maruka","মারুকা"],["North Eliotgonj","উত্তর ইলিয়টগঞ্জ"],["Podua","পদুয়া"],["South Eliotgonj","দক্ষিন ইলিয়টগঞ্জ"],["Sundolpur","সুন্দলপুর"],["West Mohammadpur","পশ্চিম মোহাম্মদপুর"],["West Passgacia","পশ্চিম পাচঁগাছিয়া"],["Zinglatoli","জিংলাতলী"]],"254":[["Barthi","বার্থী"],["Batajore","বাটাজোর"],["Chandshi","চাঁদশী"],["Khanjapur","খাঞ্জাপুর"],["Mahilara","মাহিলারা"],["Nalchira","নলচিড়া"],["Sarikal","সরিকল"]],"111":[["Baruhas","বারুহাস"],["Deshigram","দেশীগ্রাম"],["Madhainagar","মাধাইনগর"],["Magura Binod","মাগুড়া বিনোদ"],["Naogaon","নওগাঁ"],["Soguna","সগুনা"],["Talam","তালম"],["Tarash Sadar","তাড়াশ সদর"]],"333":[["Basail","বাসাইল"],["Fulki","ফুলকি"],["Habla","হাবলা"],["Kanchanpur","কাঞ্চনপুর"],["Kashil","কাশিল"],["Kauljani","কাউলজানী"]],"230":[["Basanda","বাসন্ডা"],["Binoykati","বিনয়কাঠী"],["Gabharamchandrapur","গাভারামচন্দ্রপুর"],["Gabkhandhansiri","গাবখান ধানসিঁড়ি"],["Keora","কেওড়া"],["Kirtipasha","কীর্তিপাশা"],["Nabagram","নবগ্রাম"],["Nathullabad","নথুলল্লাবাদ"],["Ponabalia","পোনাবালিয়া"],["Sekherhat","শেখেরহাট"]],"465":[["Basati","বাশাটি"],["Borogram","বড়গ্রাম"],["Daogaon","দাওগাঁও"],["Dulla","দুল্লা"],["Ghoga","ঘোগা"],["Kashimpur","কাশিমপুর"],["Kheruajani","খেরুয়াজানী"],["Kumargata","কুমারগাতা"],["Mankon","মানকোন"],["Tarati","তারাটি"]],"475":[["Bashchara","বাশঁচড়া"],["Digpait","দিগপাইত"],["Ghorada","ঘোড়াধাপ"],["Itail","ইটাইল"],["Kendua","কেন্দুয়া"],["Laxirchar","লক্ষীরচর"],["Mesta","মেষ্টা"],["Narundi","নরুন্দী"],["Ranagacha","রানাগাছা"],["Rashidpur","রশিদপুর"],["Shahbajpur","শাহবাজপুর"],["Sharifpur","শরিফপুর"],["Sheepur","শ্রীপুর"],["Titpalla","তিতপল্লা"],["Tolshirchar","তুলশীরচর"]],"24":[["Basudeb","বাসুদেব"],["Bodhal","বুধল"],["Machihata","মাছিহাতা"],["Majlishpur","মজলিশপুর"],["Natai","নাটাই (দক্ষিন)"],["Natai","নাটাই (উত্তর)"],["Ramrail","রামরাইল"],["Sadekpur","সাদেকপুর"],["Shuhilpur","সুহিলপুর"],["Sultanpur","সুলতানপুর"],["Talsahar","তালশহর"]],"257":[["Batamara","বাটামারা"],["Charkalekha","চরকালেখা"],["Gaschua","গাছুয়া"],["Kazirchar","কাজিরচর"],["Muladi","মুলাদী"],["Nazirpur","নাজিরপুর"],["Safipur","সফিপুর"]],"93":[["Batnatali","বাটনাতলী"],["Jogyachola","যোগ্যছোলা"],["Manikchari","মানিকছড়ি"],["Tintahari","তিনটহরী"]],"48":[["Batoiya","বাটইয়া"],["Chaprashirhat","চাপরাশিরহাট"],["Dhanshalik","ধানশালিক"],["Dhanshiri","ধানসিঁড়ি"],["Ghoshbag","ঘোষবাগ"],["Narottampur","নরোত্তমপুর"],["Sundalpur","সুন্দলপুর"]],"373":[["Baultoli","বৌলতলী"],["Bejgaon","বেজগাঁও"],["Gaodia","গাওদিয়া"],["Haldia","হলদিয়া"],["Kalma","কলমা"],["Kanaksar","কনকসার"],["Khidirpara","খিদিরপাড়া"],["Kumarbhog","কুমারভোগ"],["Lohajang-Teotia","লৌহজং-তেওটিয়া"],["Medinimandal","মেদিনীমন্ডল"]],"420":[["Baura","বাউড়া"],["Burimari","বুড়িমারী"],["Dahagram","দহগ্রাম"],["Jagatber","জগতবেড়"],["Jongra","জোংড়া"],["Kuchlibari","কুচলিবাড়ী"],["Patgram","পাটগ্রাম"],["Sreerampur","শ্রীরামপুর"]],"453":[["Bazra","বজরা"],["Begumgonj","বেগমগঞ্জ"],["Buraburi","বুড়াবুড়ী"],["Daldalia","দলদলিয়া"],["Dhamsreni","ধামশ্রেণী"],["Dharanibari","ধরণীবাড়ী"],["Durgapur","দুর্গাপুর"],["Gunaigas","গুনাইগাছ"],["Hatia","হাতিয়া"],["Pandul","পান্ডুল"],["Shahabiar Alga","সাহেবের আলগা"],["Thetrai","থেতরাই"],["Tobockpur","তবকপুর"]],"308":[["Beheli","বেহেলী"],["Bhimkhali","ভীমখালী"],["Fenerbak","ফেনারবাক"],["Jamalganj Sadar","জামালগঞ্জ সদর"],["Sachnabazar","সাচনাবাজার"]],"340":[["Bekrah Atgram","বেকরা আটগ্রাম"],["Bhadra","ভাদ্রা"],["Bharra","ভারড়া"],["Dhuburia","ধুবড়িয়া"],["Doptior","দপ্তিয়র"],["Goyhata","গয়হাটা"],["Mamudnagor","মামুদনগর"],["Mokna","মোকনা"],["Nagorpur","নাগরপুর"],["Pakutia","পাকুটিয়া"],["Sahabathpur","সহবতপুর"],["Solimabad","সলিমাবাদ"]],"408":[["Belaichandi","বেলাইচন্ডি"],["Chandipur","চন্ডীপুর"],["Habra","হাবড়া"],["Hamidpur","হামিদপুর"],["Harirampur","হরিরামপুর"],["Mominpur","মোমিনপুর"],["Monmothopur","মন্মথপুর"],["Mostofapur","মোস্তফাপুর"],["Polashbari","পলাশবাড়ী"],["Rampur","রামপুর"]],"40":[["Belaichari","বিলাইছড়ি"],["Farua","ফারুয়া"],["Kengrachari","কেংড়াছড়ি"]],"448":[["Belgacha","বেলগাছা"],["Bhogdanga","ভোগডাঙ্গা"],["Ghogadhoh","ঘোগাদহ"],["Holokhana","হলোখানা"],["Jatrapur","যাত্রাপুর"],["Kanthalbari","কাঁঠালবাড়ী"],["Mogolbasa","মোগলবাসা"],["Panchgachi","পাঁচগাছি"]],"477":[["Belghacha","বেলগাছা"],["Chargualini","চরগোয়ালীনি"],["Charputimari","চরপুটিমারী"],["Chinaduli","চিনাডুলী"],["Gaibandha","গাইবান্ধা"],["Gualerchar","গোয়ালেরচর"],["Islampur","ইসলামপুর"],["Kulkandi","কুলকান্দি"],["Noarpara","নোয়ারপাড়া"],["Palabandha","পলবান্ধা"],["Partharshi","পাথশী"],["Shapdari","সাপধরী"]],"109":[["Beltail","বেলতৈল"],["Gala","গালা"],["Garadah","গাড়াদহ"],["Habibullah Nagar","হাবিবুল্লাহ নগর"],["Jalalpur","জালালপুর"],["Kayempure","কায়েমপুর"],["Khukni","খুকনী"],["Koizuri","কৈজুরী"],["Narina","নরিনা"],["Porzona","পোরজনা"],["Potazia","পোতাজিয়া"],["Rupbati","রূপবাটি"],["Sonatoni","সোনাতনী"]],"65":[["Betagi","বেতাগী"],["Chandraghona","চন্দ্রঘোনা"],["Hosnabad","হোছনাবাদ"],["Islampur","ইসলামপুর"],["Kodala","কোদালা"],["Lalanagar","লালানগর"],["Mariumnagar","মরিয়মনগর"],["Parua","পারুয়া"],["Pomra","পোমরা"],["Rajanagar","রাজানগর"],["Sharafbhata","সরফভাটা"],["Shilok","শিলক"],["South Rajanagar","দক্ষিণ রাজানগর"],["Swanirbor Rangunia","স্বনির্ভর রাঙ্গুনিয়া"]],"268":[["Betagi","বেতাগী"],["Bibichini","বিবিচিন"],["Buramajumder","বুড়ামজুমদার"],["Hosnabad","হোসনাবাদ"],["Kazirabad","কাজীরাবাদ"],["Mokamia","মোকামিয়া"],["Sarisamuri","সরিষামুড়ী"]],"35":[["Betbunia","বেতবুনিয়া"],["Fatikchari","ফটিকছড়ি"],["Ghagra","ঘাগড়া"],["Kalampati","কলমপতি"]],"386":[["Bethuri","বেথুড়ী"],["Fukura","ফুকরা"],["Hatiara","হাতিয়াড়া"],["Kashiani","কাশিয়ানী"],["Maheshpur","মহেশপুর"],["Mamudpur","মাহমুদপুর"],["Nijamkandi","নিজামকান্দি"],["Orakandia","ওড়াকান্দি"],["Parulia","পারুলিয়া"],["Puisur","পুইশুর"],["Rajpat","রাজপাট"],["Ratail","রাতইল"],["Sajail","সাজাইল"],["Singa","সিংগা"]],"132":[["Bhabanipur","ভবানীপুর"],["Bishalpur","বিশালপুর"],["Garidaha","গাড়িদহ"],["Khamarkandi","খামারকান্দি"],["Khanpur","খানপুর"],["Kusumbi","কুসুম্বী"],["Mirzapur","মির্জাপুর"],["Shahbondegi","শাহবন্দেগী"],["Shimabari","সীমাবাড়ি"],["Sughat","সুঘাট"]],"421":[["Bhadai","ভাদাই"],["Bhelabari","ভেলাবাড়ী"],["Durgapur","দূর্গাপুর"],["Kamlabari","কমলাবাড়ী"],["Mohishkhocha","মহিষখোচা"],["Palashi","পলাশী"],["Saptibari","সাপ্টিবাড়ী"],["Sarpukur","সারপুকুর"]],"277":[["Bhadeshwar","ভাদেশ্বর"],["Budhbaribazar","বুধবারীবাজার"],["Dhakadakshin","ঢাকাদক্ষিন"],["Fulbari","ফুলবাড়ী"],["Golapganj","গোলাপগঞ্জ"],["Lakshanaband","লক্ষনাবন্দ"],["Lakshmipasha","লক্ষ্মীপাশা"],["Sharifganj","শরিফগঞ্জ"],["Uttar Badepasha","উত্তর বাদেপাশা"],["West Amura","পশ্চিম আমুরা"]],"106":[["Bhadraghat","ভদ্রঘাট"],["Jamtail","জামতৈল"],["Jhawail","ঝাঐল"],["Roydaulatpur","রায়দৌলতপুর"]],"64":[["Bhadur","ভাদুর"],["Bhatra","ভাটরা"],["Bholakot","ভোলাকোট"],["Chandipur","চন্ডিপুর"],["Darbeshpur","দরবেশপুর"],["Ichhapur","ইছাপুর"],["Kanchanpur","কাঞ্চনপুর"],["Karpara","করপাড়া"],["Lamchar","লামচর"],["Noagaon","নোয়াগাঁও"]],"404":[["Bhaduria","ভাদুরিয়া"],["Binodnagar","বিনোদনগর"],["Daudpur","দাউদপুর"],["Golapgonj","গোলাপগঞ্জ"],["Joypur","জয়পুর"],["Kushdaha","কুশদহ"],["Mahmudpur","মাহামুদপুর"],["Putimara","পুটিমারা"],["Shalkhuria","শালখুরিয়া"]],"92":[["Bhaibonchara","ভাইবোনছড়া"],["Kayanghat","ক্যায়াংঘাট"],["Mahalchari","মহালছড়ি"],["Maischari","মাইসছড়ি"],["Mobachari","মুবাছড়ি"]],"26":[["Bhalakut","ভলাকুট"],["Burishwar","বুড়িশ্বর"],["Chapartala","চাপৈরতলা"],["Chatalpar","চাতলপাড়"],["Dharnondol","ধরমন্ডল"],["Fandauk","ফান্দাউক"],["Goalnagar","গোয়ালনগর"],["Gokarna","গোকর্ণ"],["Goniauk","গুনিয়াউক"],["Haripur","হরিপুর"],["Kunda","কুন্ডা"],["Nasirnagar","নাসিরনগর"],["Purbabhag","পূর্বভাগ"]],"464":[["Bhaluka","ভালুকা"],["Birunia","বিরুনিয়া"],["Dakatia","ডাকাতিয়া"],["Dhitpur","ধীতপুর"],["Habirbari","হবিরবাড়ী"],["Kachina","কাচিনা"],["Mallikbari","মল্লিকবাড়ী"],["Meduari","মেদুয়ারী"],["Rajoi","রাজৈ"],["Uthura","উথুরা"],["Varadoba","ভরাডোবা"]],"130":[["Bhandarbari","ভান্ডারবাড়ী"],["Chikashi","চিকাশী"],["Chowkibari","চৌকিবাড়ী"],["Dhunat Sadar","ধুনট সদর"],["Elangi","এলাঙ্গী"],["Gopalnagar","১গোপালনগর"],["Gossainbari","গোসাইবাড়ী"],["Kalerpara","কালেরপাড়া"],["Mothurapur","মথুরাপুর"],["Nimgachi","নিমগাছি"]],"232":[["Bharabpasha","ভৈরবপাশা"],["Dapdapia","দপদপিয়া"],["Kulkathi","কুলকাঠী"],["Kusanghal","কুশঙ্গল"],["Magar","মগর"],["Mollahat","মোল্লারহাট"],["Nachanmohal","নাচনমহল"],["Ranapasha","রানাপাশা"],["Siddhakati","সিদ্ধকাঠী"],["Subidpur","সুবিদপুর"]],"185":[["Bharasimla","ভাড়াশিমলা"],["Bishnupur","বিষ্ণুপুর"],["Champaphul","চাম্পাফুল"],["Dakshin Sreepur","দক্ষিণ শ্রীপুর"],["Dhalbaria","ধলবাড়িয়া"],["Krishnanagar","কৃষ্ণনগর"],["Kushlia","কুশুলিয়া"],["Mathureshpur","মথুরেশপুর"],["Mautala","মৌতলা"],["Nalta","নলতা"],["Ratanpur","রতনপুর"],["Tarali","তারালী"]],"250":[["Bharpasha","ভরপাশা"],["Charade","চরাদি"],["Charamaddi","চরামদ্দি"],["Darial","দাড়িয়াল"],["Dudhal","দুধল"],["Durgapasha","দুর্গাপাশা"],["Faridpur","ফরিদপুর"],["Garuria","গারুরিয়া"],["Kabai","কবাই"],["Kalashkathi","কলসকাঠী"],["Nalua","নলুয়া"],["Niamoti","নিয়ামতি"],["Padreeshibpur","পাদ্রিশিবপুর"],["Rangasree","রঙ্গশ্রী"]],"303":[["Bhatgaon","ভাতগাঁও"],["Chhaila Afjalabad","ছৈলা আফজলাবাদ"],["Chhatak Sadar","ছাতক সদর"],["Chormohalla","চরমহল্লা"],["Dolarbazar","দোলারবাজার"],["Gobindganj-Syedergaon","গোবিন্দগঞ্জ-সৈদেরগাঁও"],["Islampur","ইসলামপুর"],["Jauwabazar","জাউয়া বাজার"],["Kalaruka","কালারুকা"],["Khurma North","খুরমা উত্তর"],["Khurma South","খুরমা দক্ষিণ"],["Noarai","নোয়ারাই"],["Singchapair","সিংচাপইড়"]],"128":[["Bhatgram","ভাটগ্রাম"],["Bhatra","ভাটরা"],["Burail","বুড়ইল"],["Nandigram","নন্দিগ্রাম"],["Thalta Majhgram","থালতা মাঝগ্রাম"]],"310":[["Bhatipara","ভাটিপাড়া"],["Charnarchar","চরনারচর"],["Derai Sarmangal","দিরাই সরমঙ্গল"],["Jagddol","জগদল"],["Karimpur","করিমপুর"],["Kulanj","কুলঞ্জ"],["Rafinagar","রফিনগর"],["Rajanagar","রাজানগর"],["Taral","তাড়ল"]],"226":[["Bhayna","ভায়না"],["Chandpur","চাঁদপুর"],["Daulatpur","দৌলতপুর"],["Falsi","ফলসী"],["Joradah","জোড়াদহ"],["Kapashatia","কাপাশহাটিয়া"],["Raghunathpur","রঘুনাথপুর"],["Taherhuda","তাহেরহুদা"]],"124":[["Bhelabari","ভেলাবাড়ী"],["Bohail","বোহাইল"],["Chaluabari","চালুয়াবাড়ী"],["Chandanbaisha","চন্দনবাইশা"],["Hatfulbari","হাটফুলবাড়ী"],["Hatsherpur","হাটশেরপুর"],["Kamalpur","কামালপুর"],["Karnibari","কর্ণিবাড়ী"],["Kazla","কাজলা"],["Kutubpur","কুতুবপুর"],["Narchi","নারচী"],["Sariakandi Sadar","সারিয়াকান্দি সদর"]],"459":[["Bhelua","ভেলুয়া"],["Garjaripa","গড়জরিপা"],["Gosaipur","গোশাইপুর"],["Kakilakura","কাকিলাকুড়া"],["Kharia Kazirchar","খড়িয়া কাজিরচর"],["Kurikahonia","কুড়িকাহনিয়া"],["Ranishimul","রানীশিমুল"],["Singabaruna","সিংগাবরুনা"],["Sreebordi","শ্রীবরদী"],["Tatihati","তাতীহাটি"]],"405":[["Bhognagar","ভোগনগর"],["Mohammadpur","মোহাম্মদপুর"],["Mohonpur","মোহনপুর"],["Moricha","মরিচা"],["Nijpara","নিজপাড়া"],["Paltapur","পাল্টাপুর"],["Polashbari","পলাশবাড়ী"],["Sator","সাতোর"],["Shatagram","শতগ্রাম"],["Shibrampur","শিবরামপুর"],["Sujalpur","সুজালপুর"]],"171":[["Bhojgati","ভোজগাতি"],["Chaluahati","চালুয়াহাটি"],["Dhakuria","ঢাকুরিয়া"],["Durbadanga","দুর্বাডাংগা"],["Haridaskati","হরিদাসকাটি"],["Hariharnagar","হরিহরনগর"],["Jhanpa","ঝাঁপা"],["Kashimnagar","কাশিমনগর"],["Khanpur","খানপুর"],["Khedapara","খেদাপাড়া"],["Kultia","কুলটিয়া"],["Manirampur","মনিরামপুর"],["Manoharpur","মনোহরপুর"],["Maswimnagar","মশ্মিমনগর"],["Nehalpur","নেহালপুর"],["Rohita","রোহিতা"],["Shyamkur","শ্যামকুড়"]],"158":[["Bholahat","ভোলাহাট"],["Daldoli","দলদলী"],["Gohalbari","গোহালবাড়ী"],["Jambaria","জামবাড়িয়া"]],"331":[["Bholobo","ভোলাব"],["Bhulta","ভূলতা"],["Daudpur","দাউদপুর"],["Golakandail","গোলাকান্দাইল"],["Kayetpara","কায়েতপাড়া"],["Murapara","মুড়াপাড়া"],["Rupganj","রূপগঞ্জ"]],"418":[["Bhotmari","ভোটমারী"],["Cholbola","চলবলা"],["Chondropur","চন্দ্রপুর"],["Dologram","দলগ্রাম"],["Goral","গোড়ল"],["Kakina","কাকিনা"],["Modati","মদাতী"],["Tushbhandar","তুষভান্ডার"]],"32":[["Bhudanty","বুধন্তি"],["Bishupor","বিষ্ণুপুর"],["Champaknagar","চম্পকনগর"],["Chandura","চান্দুরা"],["Charislampur","চর-ইসলামপুর"],["Harashpur","হরষপুর"],["Ichapura","ইছাপুরা"],["Paharpur","পাহাড়পুর"],["Pattan","পত্তন"],["Singerbil","সিংগারবিল"]],"148":[["Biaghat","বিয়াঘাট"],["Chapila","চাপিলা"],["Dharabarisha","ধারাবারিষা"],["Khubjipur","খুবজীপুর"],["Moshindha","মসিন্দা"],["Nazirpur","নাজিরপুর"]],"452":[["Biddanondo","বিদ্যানন্দ"],["Chakirpashar","চাকিরপশার"],["Chinai","ছিনাই"],["Gharialdanga","ঘড়িয়ালডাঙ্গা"],["Nazimkhan","নাজিমখাঁন"],["Rajarhat","রাজারহাট"],["Umarmajid","উমর মজিদ"]],"176":[["Bidyanandakati","বিদ্যানন্দকাটি"],["Gaurighona","গৌরিঘোনা"],["Keshabpur","কেশবপুর"],["Majidpur","মজিদপুর"],["Mongolkot","মঙ্গলকোর্ট"],["Panjia","পাজিয়া"],["Sagardari","সাগরদাড়ী"],["Sufalakati","সুফলাকাটি"],["Trimohini","ত্রিমোহিনী"]],"323":[["Bijari","বিঝারি"],["Charatra","চরআত্রা"],["Dingamanik","ডিংগামানিক"],["Fategongpur","ফতেজংপুর"],["Garishar","ঘড়িষার"],["Japsa","জপসা"],["Kedarpur","কেদারপুর"],["Moktererchar","মোত্তারেরচর"],["Nashason","নশাসন"],["Nowpara","নওপাড়া"],["Rajnagar","রাজনগর"],["Vojeshwar","ভোজেশ্বর"],["Vumkhara","ভূমখাড়া"]],"369":[["Bilaspur","বিলাসপুর"],["Kusumhathi","কুসুমহাটি"],["Mahmudpur","মাহমুদপুর"],["Muksudpur","মুকসুদপুর"],["Narisha","নারিশা"],["Nayabari","নয়াবাড়ী"],["Raipara","রাইপাড়া"],["Sutarpara","সুতারপাড়া"]],"119":[["Bilchalan","বিলচলন"],["Chhaikola","ছাইকোলা"],["Danthia Bamangram","দাতিয়া বামনগ্রাম"],["Failjana","ফৈলজানা"],["Gunaigachha","গুনাইগাছা"],["Handial","হান্ডিয়াল"],["Haripur","হরিপুর"],["Mothurapur","মথুরাপুর"],["Mulgram","মুলগ্রাম"],["Nimaichara","নিমাইচড়া"],["Parshadanga","পার্শ্বডাঙ্গা"]],"407":[["Binail","বিনাইল"],["Dior","দিওড়"],["Jatbani","জোতবানী"],["Katla","কাটলা"],["Khanpur","খানপুর"],["Mukundopur","মুকুন্দপুর"],["Poliproyagpur","পলিপ্রয়াগপুর"]],"352":[["Binnati","বিন্নাটি"],["Bowlai","বৌলাই"],["Chowddoshata","চৌদ্দশত"],["Danapatuli","দানাপাটুলী"],["Joshodal","যশোদল"],["Karshakarial","কর্শাকড়িয়াইল"],["Latibabad","লতিবাবাদ"],["Maizkhapan","মাইজখাপন"],["Maria","মারিয়া"],["Mohinanda","মহিনন্দ"],["Rashidabad","রশিদাবাদ"]],"159":[["Binodpur","বিনোদপুর"],["Chakkirti","চককির্তী"],["Chatrajitpur","ছত্রাজিতপুর"],["Daipukuria","দাইপুকুরিয়া"],["Dhainagar","ধাইনগর"],["Durlovpur","দুর্লভপুর"],["Ghorapakhia","ঘোড়াপাখিয়া"],["Kansat","কানসাট"],["Mobarakpur","মোবারকপুর"],["Monakasha","মনাকষা"],["Noyalavanga","নয়ালাভাঙ্গা"],["Panka","পাঁকা"],["Shahabajpur","শাহাবাজপুর"],["Shyampur","শ্যামপুর"],["Ujirpur","উজিরপুর"]],"122":[["Birkedar","বীরকেদার"],["Durgapur","দূর্গাপুর"],["Jamgaon","জামগ্রাম"],["Kahaloo","কাহালু"],["Kalai","কালাই"],["Malancha","মালঞ্চা"],["Murail","মুরইল"],["Narhatta","নারহট্ট"],["Paikar","পাইকড়"]],"328":[["Bishnandi","বিশনন্দী"],["Brahammandi","ব্রা‏হ্মন্দী"],["Duptara","দুপ্তারা"],["Fatepur","ফতেপুর"],["Highjadi","হাইজাদী"],["Kagkanda","খাগকান্দা"],["Kalapaharia","কালাপাহাড়িয়া"],["Mahmudpur","মাহমুদপুর"],["Satgram","সাতগ্রাম"],["Uchitpura","উচিৎপুরা"]],"443":[["Bishnapur","বিষ্ণপুর"],["Damodorpur","দামোদরপুর"],["Gopalpur","গোপালপুর"],["Gopinathpur","গোপীনাথপুর"],["Kalupara","কালুপাড়া"],["Kutubpur","কুতুবপুর"],["Lohanipara","লোহানীপাড়া"],["Modhupur","মধুপুর"],["Radhanagar","রাধানগর"],["Ramnathpurupb","রামনাথপুর"]],"165":[["Bisnopur","বিষ্ণপুর"],["Goneshpur","গনেশপুর"],["Kalikapur","কালিকাপুর"],["Kashopara","কাঁশোকাপুর"],["Koshob","কশব"],["Kosomba","কুসুম্বা"],["Manda","মান্দা"],["Moinom","মৈনম"],["Nurullabad","নূরুল্যাবাদ"],["Paranpur","পরানপুর"],["Proshadpur","প্রসাদপুর"],["Tetulia","তেঁতুলিয়া"],["Valain","ভালাইন"],["Varsho","ভারশো"]],"380":[["Boalia","বোয়ালিয়া"],["Kalikapur","কালিকাপুর"],["Kalukhali","কালুখালী"],["Madapur","মদাপুর"],["Majbari","মাজবাড়ী"],["Mrigi","মৃগী"],["Ratandia","রতনদিয়া"],["Shawrail","সাওরাইল"]],"392":[["Boalmari","বোয়ালমারী"],["Chandpur","চাঁদপুর"],["Chatul","চতুল"],["Dadpur","দাদপুর"],["Ghoshpur","ঘোষপুর"],["Gunbaha","গুনবহা"],["Moyna","ময়না"],["Parameshwardi","পরমেশ্বরদী"],["Rupapat","রূপাপাত"],["Satair","সাতৈর"],["Shekhar","শেখর"]],"354":[["Boliardi","বলিয়ার্দী"],["Dighirpar","দিঘীরপাড়"],["Dilalpur","দিলালপুর"],["Gazirchar","গাজীরচর"],["Halimpur","হালিমপুর"],["Hilochia","হিলচিয়া"],["Homypur","হুমাইপর"],["Kailag","কৈলাগ"],["Maijchar9","মাইজচর"],["Pirijpur","পিরিজপুর"],["Sararchar","সরারচর"]],"431":[["Bonarpara","বোনারপাড়া"],["Ghuridah","ঘুরিদহ"],["Holdia","হলদিয়া"],["Jumarbari","জুমারবাড়ী"],["Kachua","কচুয়া"],["Kamalerpara","কামালেরপাড়া"],["Muktinagar","মুক্তিনগর"],["Padumsahar","পদুমশহর"],["Saghata","সাঘাটা"],["Varotkhali","ভরতখালী"]],"455":[["Bondober","বন্দবেড়"],["Dadevanga","দাঁতভাঙ্গা"],["Jadurchar","যাদুরচর"],["Rowmari","রৌমারী"],["Shoulemari","শৌলমারী"]],"428":[["Bongram","বনগ্রাম"],["Damodorpur","দামোদরপুর"],["Dhaperhat","ধাপেরহাট"],["Faridpur","ফরিদপুর"],["Idilpur","ইদিলপুর"],["Jamalpur","জামালপুর"],["Kamarpara","কামারপাড়া"],["Khodkomor","খোদকোমরপুর"],["Noldanga","নলডাঙ্গা"],["Rasulpur","রসুলপুর"],["Vatgram","ভাতগ্রাম"]],"307":[["Bongshikunda North","বংশীকুন্ডা উত্তর"],["Bongshikunda South","বংশীকুন্ডা দক্ষিণ"],["Chamordani","চামরদানী"],["Dharmapasha Sadar","ধর্মপাশা সদর"],["Joyasree","জয়শ্রী"],["Madhyanagar","মধ্যনগর"],["Paikurati","পাইকুরাটী"],["Selbarash","সেলবরষ"],["Sukhair Rajapur North","সুখাইড় রাজাপুর উত্তর"],["Sukhair Rajapur South","সুখাইড় রাজাপুর দক্ষিণ"]],"385":[["Borashi","বোড়াশী"],["Boultali","বৌলতলী"],["Chandradighalia","চন্দ্রদিঘলিয়া"],["Durgapur","দুর্গাপুর"],["Gobra","গোবরা"],["Gopinathpur","গোপীনাথপুর"],["Horidaspur","হরিদাসপুর"],["Jalalabad","জালালাবাদ"],["Kajulia","কাজুলিয়া"],["Karpara","করপাড়া"],["Kati","কাঠি"],["Lotifpur","লতিফপুর"],["Majhigati","মাঝিগাতী"],["Nizra","নিজড়া"],["Paikkandi","পাইককান্দি"],["Roghunathpur","রঘুনাথপুর"],["Sahapur","সাহাপুর"],["Satpar","সাতপাড়"],["Shuktail","শুকতাইল"],["Ulpur","উলপুর"],["Urfi","উরফি"]],"134":[["Borgachi","বড়্গাছি"],["Damkura","দামকুড়া"],["Darsanpara","দর্শনপাড়া"],["Harian","হরিয়ান"],["Horipur","হরিপুর"],["Horogram","হড়গ্রাম"],["Hujuripara","হুজুরী পাড়া"],["Parila","পারিলা"]],"167":[["Borgoca","বরগাছা"],["Ekdala","একডালা"],["Gona","গোনা"],["Kaligram","কালিগ্রাম"],["Kashimpur","কাশিমপুর"],["Khatteshawr","খট্টেশ্বর রাণীনগর"],["Mirat","মিরাট"],["Paroil","পারইল"]],"387":[["Borni","বর্ণি"],["Dumaria","ডুমরিয়া"],["Gopalpur","গোপালপুর"],["Kushli","কুশলী"],["Patgati","পাটগাতী"]],"445":[["Boro Alampur","বড় আলমপুর"],["Borodargah","বড়দরগাহ"],["Chattra","চতরা"],["Chattracol","চৈত্রকোল"],["Kabilpur","কাবিলপুর"],["Kumedpur","কুমেদপুর"],["Mithipur","মিঠিপুর"],["Modankhali","মদনখালী"],["Pachgachi","পাঁচগাছী"],["Pirgonj","পীরগঞ্জ"],["Ramnathpur","রামনাথপুর"],["Raypur","রায়পুর"],["Shanerhat","শানেরহাট"],["Tukuria","টুকুরিয়া"],["Vendabari","ভেন্ডাবাড়ী"]],"84":[["Boro Moheshkhali","বড় মহেশখালী"],["Choto Moheshkhali","ছোট মহেশখালী"],["Dhalghata","ধলঘাটা"],["Hoanak","হোয়ানক"],["Kalarmarchhara","কালারমারছড়া"],["Kutubjum","কুতুবজোম"],["Matarbari","মাতারবাড়ী"],["Shaplapur","শাপলাপুর"]],"283":[["Boroikandi","বড়ইকান্দি"],["Daudpur","দাউদপুর"],["Jalalpur","জালালপুর"],["Kamalbazar","কামালবাজার"],["Kuchai","কুচাই"],["Lalabazar","লালাবাজার"],["Moglabazar","মোগলাবাজার"],["Mollargaon","মোল্লারগাঁও"],["Silam","সিলাম"],["Tetli","তেতলী"]],"489":[["Borokashia Birampur","বড়কাশিয়া বিরামপুর"],["Borotoli Banihari","বড়তলী বানিহারী"],["Gaglajur","গাগলাজুর"],["Maghan Siadar","মাঘান সিয়াদার"],["Somaj Sohildeo","সমাজ সহিলদেও"],["Suair","সুয়াইর"],["Tetulia","তেতুলিয়া"]],"488":[["Borokhapon","বড়খাপন"],["Kharnoi","খারনৈ"],["Koilati","কৈলাটী"],["Kolmakanda","কলমাকান্দা"],["Lengura","লেংগুরা"],["Najirpur","নাজিরপুর"],["Pogla","পোগলা"],["Rongchati","রংছাতি"]],"260":[["Boromanika","বড় মানিকা"],["Deula","দেউলা"],["Kachia","কাচিয়া"],["Kutuba","কুতুবা"],["Pakshia","পক্ষিয়া"]],"22":[["Boxmahmmud","বক্সমাহমুদ"],["Ctholia","চিথলিয়া"],["Mizanagar","মির্জানগর"]],"3":[["Brahmanpara Sadar","ব্রাহ্মনপাড়া সদর"],["Chandla","চান্দলা"],["Dulalpur","দুলালপুর"],["Madhabpur","মাধবপুর"],["Malapara","মালাপাড়া"],["Shahebabad","সাহেবাবাদ"],["Shashidal","শশীদল"],["Shidli","শিদলাই"]],"108":[["Brommogacha","ব্রহ্মগাছা"],["Chandaikona","চান্দাইকোনা"],["Dhamainagar","ধামাইনগর"],["Dhangora","ধানগড়া"],["Dhubil","ধুবিল"],["Ghurka","ঘুড়কা"],["Nalka","নলকা"],["Pangashi","পাঙ্গাসী"],["Sonakhara","সোনাখাড়া"]],"76":[["Budirchar","বুডিরশ্চর"],["Chikondandi","চিকনদন্ডী"],["Chipatali","ছিপাতলী"],["Dakkin Madrasha","দক্ষিন মাদার্শা"],["Dhalai","ধলই"],["Farhadabad","ফরহাদাবাদ"],["Fathepur","ফতেপুর"],["Garduara","গড়দুয়ারা"],["Gomanmordan","গুমানমর্দ্দন"],["Hathazari","হাটহাজারী"],["Mekhal","মেখল"],["Mirjapur","মির্জাপুর"],["Nangolmora","নাঙ্গলমোরা"],["Sikarpur","শিকারপুর"],["Uttar Madrasha","উত্তর মাদার্শা"]],"406":[["Bulakipur","বুলাকীপুর"],["Ghoraghat","ঘোড়াঘাট"],["Palsha","পালশা"],["Singra","সিংড়া"]],"42":[["Burighat","বুড়িঘাট"],["Ghilachhari","ঘিলাছড়ি"],["Naniarchar","নানিয়ারচর"],["Sabekkhong","সাবেক্ষ্যং"]],"46":[["Burirchar","বুড়িরচর"],["Charishwar","চরঈশ্বর"],["Charking","চরকিং"],["Jahajmara","জাহাজমারা"],["Nijhumdwi","নিঝুমদ্বীপ"],["Nolchira","নলচিরা"],["Sonadiya","সোনাদিয়া"],["Sukhchar","সুখচর"],["Tomoroddi","তমরদ্দি"]],"222":[["Burrirdangga","বুড়িরডাঙ্গা"],["Chadpai","চাঁদপাই"],["Chila","চিলা"],["Mithakhali","মিঠাখালী"],["Sonailtala","সোনাইলতলা"],["Sundarban","সুন্দরবন"]],"350":[["Burudia","বুড়ুদিয়া"],["Chandipasha","চান্দিপাশা"],["Charfaradi","চারফারাদি"],["Egarasindur","ইজারাসিন্দুর"],["Hosendi","হোসেনদি"],["Jangalia","জাঙ্গালিয়া"],["Narandi","নারান্দি"],["Pakundia","পাকন্দিয়া"],["Patuavabga","পটুয়াভাঙ্গা"],["Shukhia","সুখিয়া"]],"284":[["Burungabazar","বুরুঙ্গাবাজার"],["Doyamir","দয়ামীর"],["Goalabazar","গোয়ালাবাজার"],["Sadipur","সাদিরপুর"],["Tazpur","তাজপুর"],["Umorpur","উমরপুর"],["Usmanpur","উসমানপুর"],["West Poilanpur","পশ্চিম পৈলনপুর"]],"117":[["Chakla","চাকলা"],["Dhalar Char","ঢালার চর"],["Haturia Nakalia","হাটুরিয়া নাকালিয়া"],["Jatsakhini","জাতসাখিনি"],["Koitola","কৈটোলা"],["Masumdia","মাসুমদিয়া"],["Notun Varenga","নতুন ভারেঙ্গা"],["Puran Varenga","পুরান ভারেঙ্গা"],["Ruppur","রূপপুর"]],"86":[["Chakmarkul","চাকমারকুল"],["Dakkhin Mithachhari","দক্ষিণ মিঠাছড়ি"],["Eidghar","ঈদগড়"],["Fotekharkul","ফতেখাঁরকুল"],["Garjoniya","গর্জনিয়া"],["Jouarianala","জোয়ারিয়া নালা"],["Kacchapia","কচ্ছপিয়া"],["Kauwarkho","কাউয়ারখোপ"],["Khuniapalong","খুনিয়াপালং"],["Rajarkul","রাজারকুল"],["Rashidnagar","রশীদনগর"]],"487":[["Chakua","চাকুয়া"],["Gazipur","গাজীপুর"],["Khaliajuri","খালিয়াজুরী"],["Krishnapur","কৃষ্ণপুর"],["Mendipur","মেন্দিপুর"],["Nogor","নগর"]],"107":[["Chalitadangha","চালিতাডাঙ্গা"],["Chargirish","চরগিরিশ"],["Gandail","গান্ধাইল"],["Kazipur Sadar","কাজিপুর সদর"],["Khasrajbari","খাসরাজবাড়ী"],["Maijbari","মাইজবাড়ী"],["Monsur Nagar","মনসুর নগর"],["Natuarpara","নাটুয়ারপাড়া"],["Nishchintapur","নিশ্চিন্তপুর"],["Sonamukhi","সোনামুখী"],["Subhagacha","শুভগাছা"],["Tekani","তেকানী"]],"144":[["Chamari","চামারী"],["Chaugram","চৌগ্রাম"],["Chhatardighi","ছাতারদিঘী"],["Dahia","ডাহিয়া"],["Hatiandaha","হাতিয়ানদহ"],["Italy","ইটালী"],["Kalam","কলম"],["Lalore","লালোর"],["Ramanandakhajura","রামান্দখাজুরা"],["Sherkole","শেরকোল"],["Sukash","শুকাশ"],["Tajpur","তাজপুর"]],"126":[["Chamrul","চামরুল"],["Dupchanchia","দুপচাঁচিয়া"],["Gobindapur","গোবিন্দপুর"],["Gunahar","গুনাহার"],["Talora","তালোড়া"],["Zianagar","জিয়ানগর"]],"440":[["Chandanpat","চন্দনপাট"],["Dorshona","দর্শানা"],["Horidebpur","হরিদেবপুর"],["Mominpur","মমিনপুর"],["Porshuram","পরশুরাম"],["Rajendrapur","রাজেন্দ্রপুর"],["Sadwapuskoroni","সদ্যপুস্করনী"],["Satgara","সাতগারা"],["Tampat","তামপাট"],["Topodhan","তপোধন"],["Uttam","উত্তম"]],"181":[["Chandanpur","চন্দনপুর"],["Deara","দেয়ারা"],["Helatala","হেলাতলা"],["Jallabad","জালালাবাদ"],["Jogikhali","যুগিখালী"],["Joynagar","জয়নগর"],["Kaila","কয়লা"],["Keragachhi","কেঁড়াগাছি"],["Keralkata","কেরালকাতা"],["Kushadanga","কুশোডাংগা"],["Langaljhara","লাঙ্গলঝাড়া"],["Sonabaria","সোনাবাড়িয়া"]],"118":[["Chandba","চাঁদভা"],["Debottar","দেবোত্তর"],["Ekdanta","একদন্ত"],["Laxshmipur","লক্ষীপুর"],["Majhpara","মাজপাড়া"]],"486":[["Chandgaw","চানগাঁও"],["Fathepur","ফতেপুর"],["Gobindasree","গেবিন্দশ্রী"],["Kytail","কাইটাল"],["Madan","মদন"],["Magan","মাঘান"],["Nayekpur","নায়েকপুর"],["Teosree","তিয়শ্রী"]],"206":[["Chandkhali","চাঁদখালী"],["Deluti","দেলুটি"],["Godaipur","গদাইপুর"],["Goroikhali","গড়ইখালী"],["Horidhali","হরিঢালী"],["Kopilmuni","কপিলমুনি"],["Loskor","লস্কর"],["Lota","লতা"],["Raruli","রাড়ুলী"],["Soladana","সোলাদানা"]],"251":[["Chandpasha","চাঁদপাশা"],["Deherhoti","দেহেরগতি"],["Jahangir Nagar","জাহাঙ্গীর নগর"],["Kaderpur","কেদারপুর"],["Madhbpasha","মাধবপাশা"],["Rahamtpur","রহমতপুর"]],"249":[["Chandpura","চাঁদপুরা"],["Chandramohan","চন্দ্রমোহন"],["Charbaria","চরবাড়িয়া"],["Charcowa","চরকাউয়া"],["Charmonai","চরমোনাই"],["Kashipur","কাশীপুর"],["Raipasha Karapur","রায়পাশা কড়াপুর"],["Shyastabad","সায়েস্তাবাদ"],["Tungibaria","টুঙ্গীবাড়িয়া"],["Zagua","জাগুয়া"]],"34":[["Chandraghona","চন্দ্রঘোনা"],["Chitmorom","চিৎমরম"],["Kaptai","কাপ্তাই"],["Raikhali","রাইখালী"],["Wagga","ওয়াজ্ঞা"]],"90":[["Changi","চেংগী"],["Latiban","লতিবান"],["Logang","লোগাং"],["Panchari","পানছড়ি"]],"427":[["Chaora Bargacha","চওড়া বড়গাছা"],["Chapra Sarnjami","চাপড়া সরঞ্জানী"],["Charaikhola","চড়াইখোলা"],["Gorgram","গোড়গ্রাম"],["Itakhola","ইটাখোলা"],["Kachukata","কচুকাটা"],["Khoksabari","খোকসাবাড়ী"],["Kundapukur","কুন্দপুকুর"],["Lakshmicha","লক্ষ্মীচাপ"],["Palasbari","পলাশবাড়ী"],["Panchapukur","পঞ্চপুকুর"],["Ramnagar","রামনগর"],["Sonaray","সোনারায়"],["Songalsi","সংগলশী"],["Tupamari","টুপামারী"]],"396":[["Char Bhadrasan","চর ভদ্রাসন"],["Char Harirampur","চর হরিরামপুর"],["Char Jahukanda","চর ঝাউকান্দা"],["Gazirtek","গাজীরটেক"]],"61":[["Char Folcon","চর ফলকন"],["Char Kadira","চর কাদিরা"],["Char Martin","চর মার্টিন"],["Charkalkini","চর কালকিনি"],["Charlorench","চর লরেঞ্চ"],["Hajirhat","হাজিরহাট"],["Patarirhat","পাটারীরহাট"],["Shaheberhat","সাহেবেরহাট"],["Torabgonj","তোরাবগঞ্জ"]],"262":[["Char Khalipa","চর খলিফা"],["Charpata","চরপাতা"],["Hazipur","হাজীপুর"],["Madanpur","মদনপুর"],["Madua","মেদুয়া"],["North Joy Nagar","উত্তর জয়নগর"],["Sayedpur","সৈয়দপুর"],["South Joy Nagar","দক্ষিন জয়নগর"],["Vhovanipur","ভবানীপুর"]],"47":[["Charaman Ullah","চরআমান উল্যা"],["Charbata","চরবাটা"],["Charclerk","চরক্লার্ক"],["Charjabbar","চরজাব্বার"],["Charjubilee","চরজুবলী"],["Charwapda","চরওয়াপদা"],["East Charbata","পূর্ব চরবাটা"],["Mohammadpur","মোহাম্মদপুর"]],"270":[["Charduany","চরদুয়ানী"],["Kakchira","কাকচিঢ়া"],["Kalmegha","কালমেঘা"],["Kathaltali","কাঠালতলী"],["Nachnapara","নাচনাপাড়া"],["Patharghata","পাথরঘাটা"],["Raihanpur","রায়হানপুর"]],"44":[["Charelahi","চরএলাহী"],["Charfakira","চরফকিরা"],["Charhazari","চরহাজারী"],["Charkakra","চরকাঁকড়া"],["Charparboti","চরপার্বতী"],["Musapur","মুসাপুর"],["Rampur","রামপুর"],["Sirajpur","সিরাজপুর"]],"137":[["Charghat","চারঘাট"],["Nimpara","নিমপাড়া"],["Sardah","সরদহ"],["Solua","শলুয়া"],["Vialuxmipur","ভায়ালক্ষ্মীপুর"],["Yousufpur","ইউসুফপুর"]],"279":[["Charikatha","চারিকাটা"],["Chiknagul","চিকনাগুল"],["Darbast","দরবস্ত"],["Fatehpur","ফতেপুর"],["Jaintapur","জৈন্তাপুর"],["Nijpat","নিজপাট"]],"394":[["Charjashordi","চরযশোরদী"],["Dangi","ডাঙ্গী"],["Fulsuti","ফুলসুতি"],["Kaichail","কাইচাইল"],["Kodalia Shohidnagar","কোদালিয়া শহিদনগর"],["Laskardia","লস্করদিয়া"],["Purapara","পুরাপাড়া"],["Ramnagar","রামনগর"],["Talma","তালমা"]],"314":[["Charsindur","চরসিন্দুর"],["Danga","ডাংঙ্গা"],["Gazaria","গজারিয়া"],["Jinardi","জিনারদী"]],"357":[["Chatirchar","ছাতিরচর"],["Dampara","দামপাড়া"],["Guroi","গুরই"],["Jaraitala","জারইতলা"],["Karpasa","কারপাশা"],["Nikli Sadar","নিকলী সদর"],["Singpur","সিংপুর"]],"400":[["Chengthi Hazra Danga","চেংঠী হাজরা ডাঙ্গা"],["Chilahati","চিলাহাটি"],["Dandopal","দন্ডপাল"],["Debiduba","দেবীডুবা"],["Debiganj Sadar","দেবীগঞ্জ সদর"],["Pamuli","পামুলী"],["Shaldanga","শালডাঙ্গা"],["Sonahar Mollikadaha","সোনাহার মল্লিকাদহ"],["Sundardighi","সুন্দরদিঘী"],["Tepriganj","টেপ্রীগঞ্জ"]],"169":[["Chhaor","ছাওড়"],["Ganguria","গাঙ্গুরিয়া"],["Ghatnagar","ঘাটনগর"],["Moshidpur","মশিদপুর"],["Nitpur","নিতপুর"],["Tetulia","তেঁতুলিয়া"]],"351":[["Chhaysuti","ছয়সূতী"],["Faridpur","ফরিদপুর"],["Gobaria Abdullahpur","গোবরিয়া আব্দুল্লাহপুর"],["Osmanpur","উছমানপুর"],["Ramdi","রামদী"],["Salua","সালুয়া"]],"54":[["Chitoshi (East)","চিতষী (পূর্ব)"],["Chitoshiwest","চিতষী (পশ্চিম)"],["Meher (North)","মেহের (উত্তর)"],["Meher (South)","মেহের (দক্ষিণ)"],["Raysree (North)","রায়শ্রী (উত্তর)"],["Raysree (South)","রায়শ্রী (দক্ষিন)"],["Suchipara (North)","সুচিপাড়া (উত্তর)"],["Suchipara (South)","সুচিপাড়া (দক্ষিণ)"],["Tamta (North)","টামটা (উত্তর)"],["Tamta (South)","টামটা (দক্ষিণ)"]],"377":[["Chotovakla","ছোটভাকলা"],["Debugram","দেবগ্রাম"],["Doulatdia","দৌলতদিয়া"],["Uzancar","উজানচর"]],"174":[["Chougachha","চৌগাছা"],["Dhuliani","ধুলিয়ানী"],["Fulsara","ফুলসারা"],["Hakimpur","হাকিমপুর"],["Jagadishpur","জগদীশপুর"],["Narayanpur","নারায়নপুর"],["Pashapole","পাশাপোল"],["Patibila","পাতিবিলা"],["Singhajhuli","সিংহঝুলি"],["Sukpukhuria","সুখপুকুরিয়া"],["Swarupdaha","সরুপদাহ"]],"80":[["Chowfaldandi","চৌফলদন্ডী"],["Eidgaon","ঈদগাঁও"],["Islamabad","ইসলামাবাদ"],["Islampur","ইসলামপুর"],["Jalalabad","জালালাবাদ"],["Jhilongjha","ঝিলংঝা"],["Khurushkhul","খুরুশকুল"],["Pmkhali","পিএমখালী"],["Pokkhali","পোকখালী"],["Varuakhali","ভারুয়াখালী"]],"410":[["Dabor","ডাবোর"],["Mukundapur","মুকুন্দপুর"],["Ramchandrapur","রামচন্দ্রপুর"],["Rasulpur","রসুলপুর"],["Sundarpur","সুন্দরপুর"],["Targao","তারগাঁও"]],"23":[["Daganbhuiyan","দাগনভূঞা"],["Jayloskor","জায়লস্কর"],["Matubhuiyan","মাতুভূঞা"],["Purbachandrapur","পূর্বচন্দ্রপুর"],["Rajapur","রাজাপুর"],["Ramnagar","রামনগর"],["Sindurpur","সিন্দুরপুর"],["Yeakubpur","ইয়াকুবপুর"]],"275":[["Dakkin Ronikhai","দক্ষিন রনিখাই"],["Isakalas","ইসাকলস"],["Islampur Paschim","ইসলামপুর পশ্চিম"],["Islampur Purba","ইসলামপুর পূর্ব"],["Telikhal","তেলিখাল"],["Uttor Ronikhai","উত্তর রনিখাই"]],"348":[["Damiha","দামিহা"],["Dhola","ধলা"],["Digdair","দিগদাইর"],["Jawar","জাওয়ার"],["Rauti","রাউতি"],["Taljanga","তালজাঙ্গা"],["Tarail-Sachail","তাড়াইল-সাচাইল"]],"194":[["Damurhuda","দামুড়হুদা"],["Hawli","হাওলী"],["Juranpur","জুড়ানপুর"],["Karpashdanga","কার্পাসডাঙ্গা"],["Kurulgachhi","কুড়ালগাছী"],["Natipota","নতিপোতা"],["Perkrishnopur Madna","পারকৃষ্ণপুর মদনা"]],"327":[["Dankati","ধানকাটি"],["Darulaman","দারুল আমান"],["Islampur","ইসলামপুর"],["Kaneshar","কনেস্বর"],["Purba Damudya","পুর্ব ডামুড্যা"],["Shidulkura","শিধলকুড়া"],["Sidya","সিড্যা"]],"461":[["Dansail","ধানশাইল"],["Gouripur","গৌরিপুর"],["Hatibandha","হাতিবান্দা"],["Jhenaigati","ঝিনাইগাতী"],["Kansa","কাংশা"],["Malijhikanda","মালিঝিকান্দা"],["Nolkura","নলকুড়া"]],"301":[["Dargapasha","দরগাপাশা"],["Joykalash","জয়কলস"],["Paschim Birgaon","পশ্চিম বীরগাঁও"],["Paschim Pagla","পশ্চিম পাগলা"],["Patharia","পাথারিয়া"],["Purba Birgaon","পূর্ব বীরগাঁও"],["Purba Pagla","পূর্ব পাগলা"],["Shimulbak","শিমুলবাক"]],"114":[["Dashuria","দাশুরিয়া"],["Luxmikunda","লক্ষীকুন্ডা"],["Muladuli","মুলাডুলি"],["Pakshi","পাকশী"],["Sahapur","সাহাপুর"],["Sara","সাঁড়া"],["Silimpur","ছলিমপুর"]],"243":[["Daulbari Dobra","দেউলবাড়ী দোবড়া"],["Dirgha","দীর্ঘা"],["Kolardoania","কলারদোয়ানিয়া"],["Malikhali","মালিখালী"],["Mativangga","মাটিভাংগা"],["Nazirpur Sadar","নাজিরপুর সদর"],["Shakharikathi","শাখারীকাঠী"],["Shakhmatia","সেখমাটিয়া"],["Sriramkathi","শ্রীরামকাঠী"]],"180":[["Debhata","দেবহাটা"],["Kulia","কুলিয়া"],["Noapara","নওয়াপাড়া"],["Parulia","পারুলিয়া"],["Sakhipur","সখিপুর"]],"135":[["Deluabari","দেলুয়াবাড়ী"],["Jhaluka","ঝালুকা"],["Joynogor","জয়নগর"],["Kismatgankoir","কিসমতগণকৈড়"],["Maria","মাড়িয়া"],["Naopara","নওপাড়া"],["Pananagar","পানানগর"]],"184":[["Dhandia","ধানদিয়া"],["Islamkati","ইসলামকাটি"],["Jalalpur","জালালপুর"],["Khalilnagar","খলিলনগর"],["Khalishkhali","খলিশখালী"],["Khesra","খেশরা"],["Kumira","কুমিরা"],["Magura","মাগুরা"],["Nagarghata","নগরঘাটা"],["Sarulia","সরুলিয়া"],["Tala","তালা"],["Tentulia","তেতুলিয়া"]],"218":[["Dhanshagor","ধানসাগর"],["Khontakata","খোন্তাকাটা"],["Rayenda","রায়েন্দা"],["Southkhali","সাউথখালী"]],"246":[["Dhaoa","ধাওয়া"],["Ekree","ইকড়ী"],["Gouripur","গৌরীপুর"],["Nodmulla","নদমূলা শিয়ালকাঠী"],["Telikhali","তেলিখালী"],["Vandaria Sadar","ভান্ডারিয়া সদর"],["Vitabaria","ভিটাবাড়িয়া"]],"67":[["Dhoom","ধুম"],["Durgapur","দূর্গাপুর"],["Haitkandi","হাইতকান্দি"],["Hinguli","হিংগুলি"],["Ichakhali","ইছাখালী"],["Jorarganj","জোরারগঞ্জ"],["Katachhara","কাটাছরা"],["Khaiyachhara","খৈয়াছরা"],["Korerhat","করেরহাট"],["Maghadia","মঘাদিয়া"],["Mayani","মায়ানী"],["Mirsharai","মীরসরাই"],["Mithanala","মিঠানালা"],["Osmanpur","ওসমানপুর"],["Saherkhali","সাহেরখালী"],["Wahedpur","ওয়াহেদপুর"]],"190":[["Digholia","দিঘলিয়া"],["Itna","ইতনা"],["Joypur","জয়পুর"],["Kashipur","কাশিপুর"],["Kotakol","কোটাকোল"],["Lahuria","লাহুড়িয়া"],["Lakshmipasha","লক্ষীপাশা"],["Lohagora","লোহাগড়া"],["Mallikpur","মল্লিকপুর"],["Naldi","নলদী"],["Noagram","নোয়াগ্রাম"],["Salnagar","শালনগর"]],"224":[["Dogachhi","দোগাছি"],["Furshondi","ফুরসন্দি"],["Ganna","গান্না"],["Ghorshal","ঘোড়শাল"],["Halidhani","হলিধানী"],["Harishongkorpur","হরিশংকরপুর"],["Kalicharanpur","কালীচরণপুর"],["Kumrabaria","কুমড়াবাড়ীয়া"],["Maharazpur","মহারাজপুর"],["Modhuhati","মধুহাটী"],["Naldanga","নলডাঙ্গা"],["Padmakar","পদ্মাকর"],["Paglakanai","পাগলাকানাই"],["Porahati","পোড়াহাটী"],["Sadhuhati","সাধুহাটী"],["Saganna","সাগান্না"],["Surat","সুরাট"]],"432":[["Dorbosto","দরবস্ত ইয়নিয়ন"],["Gumaniganj","গুমানীগঞ্জ"],["Harirampur","হরিরামপুর"],["Kamardoho","কামারদহ"],["Kamdia","কামদিয়া"],["Katabari","কাটাবাড়ী"],["Kochasahar","কোচাশহর"],["Mahimaganj","মহিমাগঞ্জ"],["Nakai","নাকাই"],["Phulbari","ফুলবাড়ী"],["Rajahar","রাজাহার"],["Rakhalburuj","রাখালবুরুজ"],["Sapmara","সাপমারা"],["Shakhahar","শাখাহার"],["Shalmara","শালমারা"],["Shibpur","শিবপুর"],["Talukkanupur","তালুককানুপুর"]],"242":[["Durgapur","দূর্গাপুর"],["Kodomtala","কদমতলা"],["Kolakhali","কলাখালী"],["Shankorpasa","শংকরপাশা"],["Shariktola","শরিকতলা"],["Shikder Mallik","শিকদার মল্লিক"],["Tona","টোনা"]],"291":[["Eastjuri","পুর্ব জুড়ী"],["Fultola","ফুলতলা"],["Gualbari","গোয়ালবাড়ী"],["Jafornagar","জায়ফরনগর"],["Sagornal","সাগরনাল"],["West Juri","পশ্চিম জুড়ী"]],"434":[["Erendabari","এরেন্ডাবাড়ী"],["Fazlupur","ফজলুপুর"],["Gazaria","গজারিয়া"],["Kanchipara","কঞ্চিপাড়া"],["Phulchari","ফুলছড়ি"],["Udakhali","উদাখালী"],["Uria","উড়িয়া"]],"123":[["Erulia","এরুলিয়া"],["Fapore","ফাঁপোর"],["Gokul","গোকুল"],["Lahiripara","লাহিড়ীপাড়া"],["Namuja","নামুজা"],["Nishindara","নিশিন্দারা"],["Noongola","নুনগোলা"],["Rajapur","রাজাপুর"],["Sekherkola","শেখেরকোলা"],["Shabgram","সাবগ্রাম"],["Shakharia","শাখারিয়া"]],"276":[["Fenchuganj","ফেঞ্চুগঞ্জ"],["Ghilachora","ঘিলাছড়া"],["Maijgaon","মাইজগাঁও"],["Uttar Fenchuganj","উত্তর ফেঞ্চুগঞ্জ"],["Uttar Kushiara","উত্তর কুশিয়ারা"]],"157":[["Fhotepur","ফতেপুর"],["Kosba","কসবা"],["Nachol","নাচোল"],["Nezampur","নেজামপুর"]],"289":[["Fotepur","ফতেপুর"],["Kamarchak","কামারচাক"],["Munsibazar","মুন্সিবাজার"],["Munsurnagar","মনসুরনগর"],["Panchgaon","পাঁচগাঁও"],["Rajnagar","রাজনগর"],["Tengra","টেংরা"],["Uttorbhag","উত্তরভাগ"]],"102":[["Galanggya","গ্যালেংগ্যা"],["Paind","পাইন্দু"],["Ramakreprangsa","রেমাক্রীপ্রাংসা"],["Ruma Sadar","রুমা সদর"]],"88":[["Golabari","গোলাবাড়ী"],["Kamalchari","কমলছড়ি"],["Khagrachhari Sadar","খাগরাছড়ি সদর"],["Parachara","পেরাছড়া"]],"18":[["Gopal","ঘোপাল"],["Mohamaya","মহামায়া"],["Pathannagar","পাঠাননগর"],["Radhanagar","রাধানগর"],["Subhapur","শুভপুর"]],"298":[["Gopaya","গোপায়া"],["Laskerpur","লস্করপুর"],["Lukra","লুকড়া"],["Nijampur","নিজামপুর"],["Nurpur","নুরপুর"],["Poil","পইল"],["Rajiura","রাজিউড়া"],["Richi","রিচি"],["Shayestaganj","শায়েস্তাগঞ্জ"],["Teghoria","তেঘরিয়া"]],"150":[["Gopinathpur","গোপীনাথপুর"],["Raikali","রায়কালী"],["Rukindipur","রুকিন্দীপুর"],["Sonamukhi","সোনামূখী"],["Tilakpur","তিলকপুর"]],"94":[["Hafchari","হাফছড়ি"],["Patachara","পাতাছড়া"],["Ramgarh","রামগড়"]],"281":[["Hatkhula","হাটখোলা"],["Jalalabad","জালালাবাদ"],["Kandigaon","কান্দিগাও"],["Khadimnagar","খাদিমনগর"],["Khadimpara","খাদিমপাড়া"],["Mugolgaon","মোগলগাও"],["Tukerbazar","টুকেরবাজার"],["Tultikor","টুলটিকর"]],"263":[["Hazirhat","হাজীর হাট"],["Monpura","মনপুরা"],["North Sakuchia","উত্তর সাকুচিয়া"],["South Sakuchia","দক্ষিন সাকুচিয়া"]],"83":[["Holdiapalong","হলদিয়াপালং"],["Jaliapalong","জালিয়াপালং"],["Palongkhali","পালংখালী"],["Rajapalong","রাজাপালং"],["Ratnapalong","রত্নাপালং"]],"56":[["Khadergaon","খাদেরগাঁও"],["Narayanpur","নারায়নপুর"],["Nayergaon (North)","নায়েরগাঁও (উত্তর)"],["Nayergaon (South)","নায়েরগাঁও (দক্ষিন)"],["Upadi (North)","উপাদী (উত্তর)"],["Upadi (South)","উপাদী (দক্ষিণ)"]],"456":[["Kodalkati","কোদালকাটি"],["Mohongonj","মোহনগঞ্জ"],["Rajibpur","রাজিবপুর"]],"9001":[["Mirpur 1","মিরপুর ১"],["Mirpur 2","মিরপুর ২"],["Mirpur 10","মিরপুর ১০"],["Mirpur 11","মিরপুর ১১"],["Mirpur 12","মিরপুর ১২"],["Mirpur 14","মিরপুর ১৪"],["Pallabi","পল্লবী"],["Kafrul","কাফরুল"],["Shewrapara","শেওড়াপাড়া"]],"9002":[["Dhanmondi R/A","ধানমন্ডি আবাসিক"],["Kalabagan","কলাবাগান"],["Lalmatia","লালমাটিয়া"],["Jigatola","জিগাতলা"],["Hazaribagh","হাজারীবাগ"],["New Market","নিউমার্কেট"]],"9003":[["Uttara Sector 3","উত্তরা সেক্টর ৩"],["Uttara Sector 4","উত্তরা সেক্টর ৪"],["Uttara Sector 7","উত্তরা সেক্টর ৭"],["Uttara Sector 10","উত্তরা সেক্টর ১০"],["Uttara Sector 13","উত্তরা সেক্টর ১৩"],["Azampur","আজমপুর"],["Dakshinkhan","দক্ষিণখান"],["Abdullahpur","আবদুল্লাহপুর"]],"9004":[["Gulshan 1","গুলশান ১"],["Gulshan 2","গুলশান ২"],["Baridhara","বারিধারা"],["Niketan","নিকেতন"],["Shahjadpur","শাহজাদপুর"]],"9005":[["Banani","বনানী"],["Mohakhali","মহাখালী"],["Kakoli","কাকলী"],["Kawran Bazar","কারওয়ান বাজার"]],"9006":[["Adabor","আদাবর"],["Shyamoli","শ্যামলী"],["Tajmahal Road","তাজমহল রোড"],["Beribadh","বেড়িবাঁধ"],["Katasur","কাটাসুর"]],"9007":[["Merul Badda","মেরুল বাড্ডা"],["Uttar Badda","উত্তর বাড্ডা"],["Satarkul","সাতারকুল"],["Gulshan Link Road","গুলশান লিংক রোড"]],"9008":[["Banasree","বনশ্রী"],["Malibagh","মালিবাগ"],["Rampura Bazar","রামপুরা বাজার"],["Hatirjheel","হাতিরঝিল"]],"9009":[["Dilkusha","দিলকুশা"],["Arambagh","আরামবাগ"],["Shantinagar","শান্তিনগর"],["Fakirapool","ফকিরাপুল"]],"9010":[["Farmgate","ফার্মগেট"],["Tejgaon I/A","তেজগাঁও শিল্পাঞ্চল"],["Panthapath","পান্থপথ"],["Nakhalpara","নাখালপাড়া"]],"9011":[["Khilgaon","খিলগাঁও"],["Basabo","বাসাবো"],["Mugdapara","মুগদাপাড়া"],["Goran","গোড়ান"]],"9012":[["Lalbagh","লালবাগ"],["Chawkbazar","চকবাজার"],["Sutrapur","সূত্রাপুর"],["Gendaria","গেণ্ডারিয়া"],["Wari","ওয়ারী"]]}};/*GEO-END*/
/* ===== LOCATION PICKER (demo without a server; the live site uses the admin's areas below) ===== */
(function(){if(LIVE)return;
var KEY='nb_geo',S={d:null,u:null,n:null,v:'',step:1,q:'',dv:0},root=null,last=null;
function B(){return lang=='bn'}
function nm(a){return a?(B()?a[2]:a[1]):''}
function nn(a){return a?(B()?a[1]:(a[2]||a[0])):''}
function ld(){try{var o=JSON.parse(localStorage.getItem(KEY)||'null');if(!o)return;var d=NBGEO.d.filter(function(x){return x[0]==o.d})[0];if(!d)return;S.d=d;var u=(NBGEO.u[d[0]]||[]).filter(function(x){return x[0]==o.u})[0];S.u=u||null;var n=u&&(NBGEO.n[u[0]]||[]).filter(function(x){return x[0]==o.n})[0];S.n=n||null;S.v=o.v||''}catch(e){}}
function sv(){try{localStorage.setItem(KEY,JSON.stringify({d:S.d&&S.d[0],u:S.u&&S.u[0],n:S.n&&S.n[0],v:S.v}))}catch(e){}}
function lbl(){if(!S.d)return '';var a=S.n?nn(S.n):S.u?nm(S.u).replace(/\s*\(.*\)$/,''):'';return (a?a+', ':'')+nm(S.d)}
function geoLabel(){var e=document.getElementById('lcn');if(e&&S.d&&S.u)e.textContent=lbl()}
window.geoLabel=geoLabel;
window.geoFull=function(){if(!S.d||!S.u)return null;var area=[S.n?nn(S.n):'',nm(S.u).replace(/\s*\(.*\)$/,''),nm(S.d)].filter(Boolean).join(', ');var v=(S.v||'').trim();return {v:v,area:area,text:(v?v+', ':'')+area}};
function items(){if(S.step==1)return S.dv?NBGEO.d.filter(function(x){return x[3]==S.dv}):NBGEO.d;if(S.step==2)return NBGEO.u[S.d[0]]||[];return NBGEO.n[S.u[0]]||[]}
function name(x){return S.step==3?nn(x):nm(x)}
function build(){if(root)return;root=document.createElement('div');root.id='geom';root.className='geo';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','geot');document.body.appendChild(root);
root.addEventListener('click',function(e){if(e.target===root){close();return}var t=e.target.closest('[data-g]');if(!t)return;var a=t.dataset.g;
if(a=='x')close();
else if(a=='step'){var s=+t.dataset.s;if(s==2&&!S.d||s==3&&!S.u)return;S.step=s;S.q='';R(1)}
else if(a=='pick'){var it=items()[+t.dataset.i];if(S.step==1){S.d=it;S.u=null;S.n=null;S.step=2}else if(S.step==2){S.u=it;S.n=null;S.step=3}else{S.n=it}S.q='';R(1)}
else if(a=='dv'){S.dv=+t.dataset.s||0;S.q='';R()}
else if(a=='go'){go()}});
root.addEventListener('relang',function(){R()});
root.addEventListener('input',function(e){if(e.target.id=='geoq'){S.q=e.target.value;L2()}else if(e.target.id=='geov'){S.v=e.target.value}});
root.addEventListener('keydown',function(e){if(e.key=='Escape'){close()}else if(e.key=='Enter'&&e.target.id=='geov'){e.preventDefault();if(ok())go()}})}
function saved(){return ok()}
function ok(){return !!(S.d&&S.u&&(S.n||!(NBGEO.n[S.u[0]]||[]).length))}
function L2(){var l=root.querySelector('.geo-l');if(!l)return;var q=S.q.trim().toLowerCase(),sel=S.step==1?S.d:S.step==2?S.u:S.n,h='';
items().forEach(function(x,i){var en=S.step==3?(x[2]||x[0]):x[1],bn=S.step==3?x[1]:x[2];if(q&&(en+' '+bn).toLowerCase().indexOf(q)<0)return;var on=sel&&(S.step==3?sel[0]==x[0]:sel[0]==x[0]);h+='<button type="button" class="geo-i'+(on?' on':'')+'" data-g="pick" data-i="'+i+'" role="option" aria-selected="'+!!on+'">'+(on?'<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>':'')+'<span>'+(B()?bn:en)+'</span></button>'});
l.innerHTML=h||'<div class="geo-e">'+(S.step==3&&!items().length?L('No union list for this area. Add your village / road below and continue.','এই এলাকার জন্য ইউনিয়ন তালিকা নেই। নিচে আপনার গ্রাম / রাস্তা লিখে এগিয়ে যান।'):L('Nothing found','কিছু পাওয়া যায়নি'))+'</div>'}
function R(focus){if(!root)return;var T=[[1,L('District','জেলা'),S.d&&nm(S.d)],[2,L('Thana / Upazila','থানা / উপজেলা'),S.u&&nm(S.u)],[3,L('Union / Area','ইউনিয়ন / এলাকা'),S.n&&nn(S.n)]];
var ttl=[L('Select your district','আপনার জেলা বাছুন'),L('Select your thana / upazila','আপনার থানা / উপজেলা বাছুন'),L('Select your union / area','আপনার ইউনিয়ন / এলাকা বাছুন')][S.step-1];
root.innerHTML='<div class="geo-b"><div class="geo-h"><div class="geo-bz">'+uic('bolt')+'</div><div><h2 id="geot">'+L('Where should we deliver?','কোথায় ডেলিভারি দেবো?')+'</h2><p>'+L('Minutes delivery depends on your area. Choose it to continue.','মিনিটস ডেলিভারি আপনার এলাকার ওপর নির্ভর করে। এগিয়ে যেতে এলাকা বাছুন।')+'</p></div><button type="button" class="geo-x" data-g="x" aria-label="'+L('Close','বন্ধ করুন')+'"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'
+'<div class="geo-st">'+T.map(function(t){var dis=t[0]==2&&!S.d||t[0]==3&&!S.u;return '<button type="button" class="'+(S.step==t[0]?'on':'')+(t[2]?' done':'')+'" data-g="step" data-s="'+t[0]+'"'+(dis?' disabled':'')+'><i>'+(t[2]?'✓':t[0])+'</i><span><small>'+t[1]+'</small><b>'+(t[2]||'—')+'</b></span></button>'}).join('')+'</div>'
+'<div class="geo-m"><div class="geo-t">'+ttl+'</div>'+(S.step==1&&NBGEO.v&&NBGEO.v.length>1?'<div class="geo-dv" role="group" aria-label="'+L('Division','বিভাগ')+'">'+[[0,'All','সব']].concat(NBGEO.v).map(function(x){return '<button type="button" data-g="dv" data-s="'+x[0]+'" class="'+(S.dv==x[0]?'on':'')+'">'+(B()?x[2]:x[1])+'</button>'}).join('')+'</div>':'')+'<label class="geo-q"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="geoq" type="search" autocomplete="off" placeholder="'+L('Search','খুঁজুন')+'" value="'+(S.q||'').replace(/"/g,'&quot;')+'" aria-label="'+L('Search','খুঁজুন')+'"></label><div class="geo-l" role="listbox"></div></div>'
+(S.step==3?'<label class="geo-v"><span>'+L('Village / Para / Road (optional)','গ্রাম / পাড়া / রাস্তা (ঐচ্ছিক)')+'</span><input id="geov" type="text" maxlength="80" placeholder="'+L('e.g. Baniapara, Road 5','যেমন: বানিয়াপাড়া, রোড ৫')+'" value="'+(S.v||'').replace(/"/g,'&quot;')+'"></label>':'')
+'<div class="geo-f"><div class="geo-s">'+(S.d?uic('pin')+' '+[S.v,S.n&&nn(S.n),S.u&&nm(S.u),nm(S.d)].filter(Boolean).join(', '):L('No area selected yet','এখনো এলাকা বাছা হয়নি'))+'</div><button type="button" class="geo-go" data-g="go"'+(ok()?'':' disabled')+'>'+L('Continue to Minutes','মিনিটসে যান')+' ›</button></div></div>';
L2();if(focus){var q=document.getElementById('geoq');if(q&&innerWidth>700)q.focus()}}
var PF=0;
function open(pf){build();ld();PF=pf===true?1:0;S.step=!S.d?1:!S.u?2:3;S.q='';S.dv=0;last=document.activeElement;root.classList.add('o');document.body.classList.add('geo-o');R(1)}
function close(){if(!root)return;root.classList.remove('o');document.body.classList.remove('geo-o');if(last&&last.focus)try{last.focus()}catch(e){}}
function go(){if(!ok())return;sv();geoLabel();close();if(PF){PF=0;if(window.renderProf&&document.body.classList.contains('vp'))renderProf();if(window.msg)msg(L('Delivery area updated','ডেলিভারি এলাকা আপডেট হয়েছে'));return}window.__geoOK=1;try{render()}catch(e){}if(window.msg)msg(L('Delivering to ','ডেলিভারি এলাকা: ')+lbl())}
window.openGeo=open;window.geoText=function(){ld();return ok()?lbl():''};
ld();geoLabel();
/* live: only the areas NurBuy admin has switched on (Division > District > Upazila/Thana > Village/Area) */
var lcn0=(document.getElementById('lcn')||{}).textContent;
if(LIVE)nbApi('GET','/geo').then(function(g){if(!g||!g.v||!g.v.length||!g.d)return;var had=null;try{had=localStorage.getItem(KEY)}catch(e){}
NBGEO=g;S.d=S.u=S.n=null;S.v='';ld();
if(had&&!ok()){try{localStorage.removeItem(KEY)}catch(e){}S.d=S.u=S.n=null;S.v='';var e=document.getElementById('lcn');if(e&&lcn0)e.textContent=lcn0;if(view=='min'&&!(root&&root.classList.contains('o')))open()}
else geoLabel();if(root&&root.classList.contains('o'))R()}).catch(function(){});
})();

/* ===== LIVE SHOP STATE: opening hours, followers, order limits, delivery areas (all from the server) ===== */
/* Bangladesh time (UTC+6, no daylight saving): [weekday 0=Sunday, minutes since midnight] */
function dhNow(){var d=new Date(Date.now()+6*36e5);return [d.getUTCDay(),d.getUTCHours()*60+d.getUTCMinutes()]}
function hrsOpen(h){if(!h||!h.d)return true;var n=dhNow(),td=h.d[n[0]],m=n[1];if(td&&m>=td[0]&&(td[1]>td[0]?m<td[1]:true))return true;var yd=h.d[(n[0]+6)%7];return !!(yd&&yd[1]<=yd[0]&&m<yd[1])}
function hrsNext(h){var n=dhNow();for(var k=0;k<8;k++){var dw=(n[0]+k)%7,t=h.d[dw];if(!t)continue;if(k==0&&t[0]<=n[1])continue;return {k:k,dw:dw,m:t[0]}}return null}
function hmTxt(m){m=((m%1440)+1440)%1440;var h=Math.floor(m/60),mi=m%60,t=(h%12||12)+':'+(mi<10?'0':'')+mi;if(lang=='bn'){var p=h<4?'রাত':h<6?'ভোর':h<12?'সকাল':h<15?'দুপুর':h<18?'বিকাল':h<20?'সন্ধ্যা':'রাত';return p+' '+bnN(t)}return t+' '+(h<12?'AM':'PM')}
function hrsToday(h){if(!h||!h.d)return L('Open 24 hours','২৪ ঘণ্টা খোলা');var t=h.d[dhNow()[0]];return t?hmTxt(t[0])+' – '+hmTxt(t[1]):L('Closed today','আজ বন্ধ')}
function shSt(name){var s=LSTO[name];if(!LIVE||!s||!s.h)return {open:true,food:s?s.food:0};if(hrsOpen(s.h))return {open:true,food:s.food};var nx=hrsNext(s.h),t='';
if(nx)t=nx.k==0?L('Opens today at '+hmTxt(nx.m),'আজ '+hmTxt(nx.m)+'-এ খুলবে'):nx.k==1?L('Opens tomorrow at '+hmTxt(nx.m),'আগামীকাল '+hmTxt(nx.m)+'-এ খুলবে'):L('Opens '+DWN[nx.dw][0]+' at '+hmTxt(nx.m),DWN[nx.dw][1]+' '+hmTxt(nx.m)+'-এ খুলবে');
return {open:false,food:s.food,nx:t}}
function shClosedLbl(st){return st.food?L('Restaurant Closed','রেস্টুরেন্ট বন্ধ'):L('Closed','বন্ধ')}
/* Minutes product whose shop is closed right now (null when open or not a live shop) */
function pClosed(en){if(!LIVE)return null;var sn=LSHOP[en];if(!sn)return null;var st=shSt(sn);return st.open?null:st}
function shSig(){return Object.keys(LSTO).map(function(n){return hrsOpen(LSTO[n].h)?1:0}).join('')}
function shRefresh(){var B=document.body.classList;try{if(B.contains('vl')&&window.renderSeller)renderSeller()}catch(e){}try{if(B.contains('vd')&&window.PDS&&PDS.p)renderPD()}catch(e){}try{if(B.contains('vk'))renderCart()}catch(e){}try{if(B.contains('vs'))renderShv()}catch(e){}try{if(!document.body.className.replace('vx','').trim())render(view)}catch(e){}}
setInterval(function(){if(!LIVE)return;var g=shSig();if(g===SHSIG)return;SHSIG=g;shRefresh()},30000);

/* ---- followers (real count, real follow on the server) ---- */
function flCount(n){var s=LSTO[n];return s?(+s.fl||0):0}
function flOn(n){var s=LSTO[n];return !!(AU.uid&&s&&s.id&&FOLS[s.id])}
function flPaint(){document.querySelectorAll('[data-flc]').forEach(function(e){var s=LSTO[e.getAttribute('data-flc')];if(s)e.textContent=bnN(+s.fl||0)});
document.querySelectorAll('[data-fln]').forEach(function(b){var n=b.getAttribute('data-fln'),on=flOn(n);b.classList.toggle('on',on);b.classList.toggle('f',on);b.setAttribute('aria-pressed',on?'true':'false');var sp=b.querySelector('span');if(sp)sp.textContent=on?L('Following','ফলো করছেন'):L('Follow','ফলো করুন')})}
function flToggle(n){var s=LSTO[n];if(!s||!s.id)return;if(!AU.uid){msg(L('Log in to follow this shop','দোকান ফলো করতে লগইন করুন'));openAuth('login');return}if(s.busy)return;s.busy=1;var on=!FOLS[s.id];
nbApi('POST','/follows/'+encodeURIComponent(s.id),{on:on}).then(function(r){s.busy=0;if(r.on)FOLS[s.id]=1;else delete FOLS[s.id];s.fl=+r.count||0;flPaint();msg(r.on?L('You are now following ','এখন ফলো করছেন ')+n:L('Unfollowed','ফলো বাদ দিয়েছেন'))}).catch(function(e){s.busy=0;msg(liveErr(e))})}
function flMine(){if(!LIVE||!AU.uid)return;nbApi('GET','/follows').then(function(r){FOLS={};(r.stores||[]).forEach(function(i){FOLS[i]=1});flPaint()}).catch(function(){})}
function flPoll(){if(!LIVE||document.hidden||!document.querySelector('[data-flc]'))return;var ids=[];Object.keys(LSTO).forEach(function(n){var i=LSTO[n].id;if(i&&ids.indexOf(i)<0)ids.push(i)});if(!ids.length)return;
nbApi('GET','/follows/counts?ids='+encodeURIComponent(ids.slice(0,200).join(','))).then(function(r){var c=r.counts||{};Object.keys(LSTO).forEach(function(n){var s=LSTO[n];if(s.id&&!s.busy)s.fl=+(c[s.id]||0)});flPaint()}).catch(function(){})}
setInterval(flPoll,15000);

/* ---- per order limits: optional seller limit, then stock ---- */
function pLim(en,st){st=Math.max(0,+st||0);var m=LIVE?Math.min(99,st):Math.min(5,st),mx=+LMX[en]||0;if(mx>0)m=Math.min(m,mx);return Math.max(1,m)}
function cLim(k){var p=findP(k);if(!p)return 99;var en=enName(p[1]),v=VAR[k],st=v&&v.stock!=null?+v.stock:(LST[en]!=null?LST[en]:99);if(!LIVE)return (v&&v.stock!=null)?Math.max(1,v.stock):99;return pLim(en,st)}
function mxNote(en){var mx=+LMX[en]||0;return mx>0?L('Max '+mx+' per order','প্রতি অর্ডারে সর্বোচ্চ '+bnN(mx)+'টি'):''}

/* ---- delivery areas (NurBuy Minutes) ---- */
function locRead(s){try{var o=JSON.parse(localStorage.getItem('nb_loc_'+s)||'null');return o&&o.p&&o.p.length?o:null}catch(e){return null}}
function locWrite(s,o){LSEL[s]=o;try{if(o)localStorage.setItem('nb_loc_'+s,JSON.stringify(o));else localStorage.removeItem('nb_loc_'+s)}catch(e){}try{if(window.__LASTC&&Object.keys(LCOV).length){LCUP=-1;applyCatalog(window.__LASTC)}}catch(e){}}
function locNodes(s,path){var D=LOCD[s],p=path||(LSEL[s]&&LSEL[s].p)||[];if(!D)return [];var out=[],list=D.d||[];for(var i=0;i<p.length;i++){var f=null;for(var j=0;j<list.length;j++){if(list[j][0]==p[i]){f=list[j];break}}if(!f)break;out.push(f);list=(D.c&&D.c[f[0]])||[]}return out}
function locOk(s){var D=LOCD[s];return !!D&&locNodes(s).length>=D.need}
function locId(s){var n=locNodes(s);return locOk(s)?n[n.length-1][0]:0}
function locNm(x){return x?(lang=='bn'?(x[2]||x[1]):x[1]):''}
function locText(s){return locNodes(s).slice().reverse().map(locNm).join(', ')}
function locBase(s){var D=LOCD[s];if(!D)return null;var x=locNodes(s)[2];return x&&x[3]!=null?+x[3]:+D.def}
var CFREE=499;
function locFree(s){var D=LOCD[s];return D&&D.free!=null?+D.free:CFREE}
function FREEMIN(){return LIVE?locFree('min'):CFREE}
function locFee(s,sub,n){if(sub>=locFree(s))return 0;var b=locBase(s);if(b==null)b=30;return Math.round(b*Math.max(1,n||1)*100)/100}
function MSHOP(){return L('You have ordered from multiple shops, so additional time may be required to collect products from different shops and complete your delivery. Estimated delivery time is up to 59 minutes.','আপনি একাধিক দোকান থেকে অর্ডার করেছেন, তাই বিভিন্ন দোকান থেকে পণ্য সংগ্রহ করে ডেলিভারি সম্পন্ন করতে অতিরিক্ত সময় লাগতে পারে। আনুমানিক ডেলিভারি সময় সর্বোচ্চ ৫৯ মিনিট।')}
function mshopHtml(){return '<div class="msn">'+uic('clock')+'<span>'+MSHOP()+'</span></div>'}

/* ---- live area picker (same look as the classic one) ---- */
(function(){if(!LIVE)return;
var root=null,last=null,GATE=0,S={sys:'min',p:[],v:'',step:0,q:'',cb:null,pf:0};
function D(){return LOCD[S.sys]}
function LVL(){return [L('District','জেলা'),L('Thana / Upazila','থানা / উপজেলা'),L('Village / Area','গ্রাম / এলাকা')]}
function nodes(){return locNodes(S.sys,S.p)}
function listAt(i){var d=D();if(!d)return [];if(i==0)return d.d||[];var n=nodes();return n[i-1]?((d.c&&d.c[n[i-1][0]])||[]):[]}
function ok(){var d=D();return !!d&&nodes().length>=d.need}
function fee(){var d=D();if(!d||!ok())return null;var x=nodes()[2];return x&&x[3]!=null?+x[3]:+d.def}
function build(){if(root)return;root=document.createElement('div');root.id='locm';root.className='geo';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','loct');document.body.appendChild(root);
root.addEventListener('click',function(e){if(e.target===root){if(!GATE)close();return}var t=e.target.closest('[data-g]');if(!t)return;var a=t.dataset.g;
if(a=='x'){if(!GATE)close()}
else if(a=='step'){var s=+t.dataset.s;if(s>nodes().length)return;S.step=s;S.q='';R(1)}
else if(a=='pick'){var it=listAt(S.step)[+t.dataset.i];if(!it)return;S.p=S.p.slice(0,S.step).concat([it[0]]);var nx=S.step+1;if(nx<LVL().length&&listAt(nx).length)S.step=nx;S.q='';R(1)}
else if(a=='go')go()});
root.addEventListener('input',function(e){if(e.target.id=='locq'){S.q=e.target.value;L2()}else if(e.target.id=='locv'){S.v=e.target.value}});
root.addEventListener('keydown',function(e){if(e.key=='Escape'){if(!GATE)close()}else if(e.key=='Enter'&&e.target.id=='locv'){e.preventDefault();if(ok())go()}})}
function L2(){var l=root.querySelector('.geo-l');if(!l)return;var q=S.q.trim().toLowerCase(),sel=S.p[S.step],h='',its=listAt(S.step);
its.forEach(function(x,i){if(q&&(x[1]+' '+x[2]).toLowerCase().indexOf(q)<0)return;var on=sel==x[0];h+='<button type="button" class="geo-i'+(on?' on':'')+'" data-g="pick" data-i="'+i+'" role="option" aria-selected="'+on+'">'+(on?'<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>':'')+'<span>'+esc(locNm(x))+'</span></button>'});
var d=D(),none=!d||!(d.d||[]).length;
l.innerHTML=h||'<div class="geo-e">'+(none?L('NurBuy Minutes is not available in any area yet. Please check back soon.','NurBuy Minutes এখনো কোনো এলাকায় চালু হয়নি। কিছুদিন পর আবার দেখুন।'):!its.length&&S.step>0?L('No list here. You can continue.','এখানে কোনো তালিকা নেই। আপনি এগিয়ে যেতে পারেন।'):L('Nothing found','কিছু পাওয়া যায়নি'))+'</div>'}
function R(focus){if(!root)return;var lv=LVL(),n=nodes(),f=fee(),free=locFree(S.sys);
var T=lv.map(function(t,i){var dis=i>n.length||(i>0&&!listAt(i).length&&!n[i]);return '<button type="button" class="'+(S.step==i?'on':'')+(n[i]?' done':'')+'" data-g="step" data-s="'+i+'"'+(dis?' disabled':'')+'><i>'+(n[i]?'✓':(i+1))+'</i><span><small>'+t+('')+'</small><b>'+(n[i]?esc(locNm(n[i])):'—')+'</b></span></button>'}).join('');
root.innerHTML='<div class="geo-b"><div class="geo-h"><div class="geo-bz">'+uic('bolt')+'</div><div><h2 id="loct">'+(GATE?L('Welcome to NurBuy! Choose your area','NurBuy-তে স্বাগতম! আপনার এলাকা বাছুন'):L('Where should we deliver?','কোথায় ডেলিভারি দেবো?'))+'</h2><p>'+(GATE?L('Select your District, Thana / Upazila and Village / Area to start shopping.','কেনাকাটা শুরু করতে আপনার জেলা, থানা / উপজেলা ও গ্রাম / এলাকা বাছুন।'):L('NurBuy Minutes delivers only in active areas. Choose your area to continue.','NurBuy Minutes শুধু চালু এলাকায় ডেলিভারি দেয়। এগিয়ে যেতে এলাকা বাছুন।'))+'</p></div>'+(GATE?'':'<button type="button" class="geo-x" data-g="x" aria-label="'+L('Close','বন্ধ করুন')+'"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>')+'</div>'
+'<div class="geo-st geo-s'+lv.length+'">'+T+'</div>'
+'<div class="geo-m"><div class="geo-t">'+L('Select ','বাছুন: ')+lv[S.step]+'</div><label class="geo-q"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="locq" type="search" autocomplete="off" placeholder="'+L('Search','খুঁজুন')+'" value="'+esc(S.q||'')+'" aria-label="'+L('Search','খুঁজুন')+'"></label><div class="geo-l" role="listbox"></div></div>'
+(ok()?'<label class="geo-v"><span>'+L('House / road / landmark (optional)','বাসা / রাস্তা / চিহ্ন (ঐচ্ছিক)')+'</span><input id="locv" type="text" maxlength="80" placeholder="'+L('e.g. House 12, near the mosque','যেমন: বাসা ১২, মসজিদের পাশে')+'" value="'+esc(S.v||'')+'"></label>':'')
+'<div class="geo-f"><div class="geo-s">'+(n.length?uic('pin')+' '+esc(n.slice().reverse().map(locNm).join(', ')):L('No area selected yet','এখনো এলাকা বাছা হয়নি'))+(f!=null?'<br><b>'+L('Delivery charge: ','ডেলিভারি চার্জ: ')+pdMoney(f)+'</b> · '+L('free over ','ফ্রি: ')+pdMoney(free)+L('',' এর বেশি অর্ডারে'):'')+'</div><button type="button" class="geo-go" data-g="go"'+(ok()?'':' disabled')+'>'+(S.cb?L('Use this area','এই এলাকা নিন'):L('Continue to Minutes','Minutes-এ যান'))+' ›</button></div></div>';
L2();if(focus){var q=document.getElementById('locq');if(q&&innerWidth>700)q.focus()}}
function open(sys,cb,pf){if(window.NBZ&&NBZ.want&&NBZ.want(sys||'min',cb,pf))return;build();S.sys=sys||'min';S.cb=cb||null;S.pf=pf?1:0;var o=LSEL[S.sys];S.p=o?o.p.slice():[];S.v=o?(o.v||''):'';var n=nodes();S.p=n.map(function(x){return x[0]});S.step=Math.min(n.length,LVL().length-1);if(n.length&&!listAt(S.step).length)S.step=n.length-1;S.q='';last=document.activeElement;root.style.zIndex=cb?'3300':'';root.classList.add('o');document.body.classList.add('geo-o');R(1)}
function close(){if(!root)return;root.classList.remove('o');document.body.classList.remove('geo-o');if(last&&last.focus)try{last.focus()}catch(e){}}
function go(){if(!ok())return;GATE=0;locWrite(S.sys,{p:nodes().map(function(x){return x[0]}),v:(S.v||'').trim().slice(0,80)});lbl();close();var cb=S.cb;S.cb=null;
if(cb){cb();return}if(S.pf){if(window.renderProf&&document.body.classList.contains('vp'))renderProf();msg(L('Delivery area updated','ডেলিভারি এলাকা আপডেট হয়েছে'));return}
if(S.sys=='min'){window.__geoOK=1;try{render()}catch(e){}msg(L('Delivering to ','ডেলিভারি এলাকা: ')+locText('min'))}}
function lbl(){if(window.NBZ&&NBZ.label&&NBZ.label())return;var e=document.getElementById('lcn'),s='min';if(!e||!LOCD[s])return;var n=locNodes(s);e.textContent=n.length&&locOk(s)?(n.length>1?locNm(n[n.length-1])+', ':'')+locNm(n[0]):L('Choose area','এলাকা বাছুন')}
var _sl=setLang;setLang=function(){var r=_sl.apply(this,arguments);try{lbl();if(root&&root.classList.contains('o'))R()}catch(e){}return r};
window.locPick=open;window.locLabel=lbl;
window.openGeo=function(pf){open('min',null,pf===true)};
window.geoLabel=lbl;
window.geoFull=function(){if(!locOk('min'))return null;var n=locNodes('min'),v=((LSEL.min&&LSEL.min.v)||'').trim(),area=n.slice().reverse().map(locNm).join(', ');return {v:v,area:area,text:(v?v+', ':'')+area}};
window.geoText=function(){return locOk('min')?locText('min'):''};
var lcn0=(document.getElementById('lcn')||{}).textContent;
function load(first){return nbApi('GET','/geo').then(function(g){if(!g||!g.min)return;LOCD={min:g.min};
['min'].forEach(function(s){var o=locRead(s);LSEL[s]=o;if(o&&!locOk(s)){locWrite(s,null);if(s=='min'&&first){var e=document.getElementById('lcn');if(e&&lcn0)e.textContent=lcn0}}});
try{if(window.__LASTC&&Object.keys(LCOV).length){LCUP=-1;applyCatalog(window.__LASTC)}}catch(e){}
if(first&&!locOk('min')&&(g.min.d||[]).length&&!(root&&root.classList.contains('o'))){GATE=1;open('min')}
lbl();if(root&&root.classList.contains('o'))R();try{if(ATC&&ATC.step>=2)atcRender()}catch(e){}try{if(document.body.classList.contains('vk'))renderCart()}catch(e){}}).catch(function(){})}
load(1);setInterval(function(){if(!document.hidden)load(0)},180000);
})();

/* ===== VISITOR ANALYTICS, PRIVACY CHOICES, RESTRICTED-ACCESS PAGE AND PERSONAL SUGGESTIONS ===== */
(function(){if(!LIVE)return;
var CK='nb_consent',RK='nb_recent',NBX={info:null,ready:false,q:[],seeded:false};
function rid(){var c='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',r='';for(var i=0;i<20;i++)r+=c[Math.floor(Math.random()*c.length)];return r}
var VID='',SI='';try{VID=localStorage.getItem('nb_vid')||'';if(!/^[A-Za-z0-9]{8,40}$/.test(VID)){VID=rid();localStorage.setItem('nb_vid',VID)}}catch(e){VID=rid()}
try{SI=sessionStorage.getItem('nb_sid')||'';if(!SI){SI=rid();sessionStorage.setItem('nb_sid',SI)}}catch(e){SI=rid()}
var U=NBAPI+(window.NB_API_PRETTY===false?'/index.php':'');
function cget(){try{var v=localStorage.getItem(CK);return v==='1'?1:v==='0'?0:null}catch(e){return null}}
/** True when optional tracking and personal suggestions may be used: the server allows it and the visitor agreed (or no notice is required). */
function allow(){var i=NBX.info;if(!i||!+i.personalization)return false;var c=cget();return c===1||(c===null&&!+i.consent_required)}
function send(o){try{var j=JSON.stringify(o);if(o.c&&TOKN&&window.fetch){fetch(U+'/t',{method:'POST',body:j,keepalive:true,credentials:'omit',headers:{Authorization:'Bearer '+TOKN}}).catch(function(){});return}if(navigator.sendBeacon)navigator.sendBeacon(U+'/t',j)}catch(x){}}
function T(e,pid,x){var o={v:VID,s:SI,e:e,w:view,c:allow()?1:0};if(pid)o.p=String(pid).slice(0,40);if(x)for(var k in x)o[k]=x[k];if(!NBX.ready){NBX.q.push(o);return}send(o)}
window.nbTrack=T;
function ready(){if(NBX.ready)return;NBX.ready=true;NBX.q.splice(0).forEach(function(o){o.c=allow()?1:0;send(o)});banner();seed();recoPaint()}
nbApi('GET','/access/info').then(function(i){NBX.info=i},function(){}).then(ready);setTimeout(ready,3000);
var vs=0;try{vs=sessionStorage.getItem('nb_vs')?1:0;sessionStorage.setItem('nb_vs','1')}catch(e){}if(!vs)T('visit');
setInterval(function(){if(!document.hidden)T('ping')},60000);
var pid=function(k){var p=window.findP&&findP(k);return p&&p[9]?p[9]:''};
function nm(p){return String(enName(p[1])).replace(/​/g,'')}
/* ---- page and click events ---- */
function pgKey(){var c=document.body.classList;if(c.contains('vd'))return 'product';if(c.contains('vk'))return 'cart';if(c.contains('vo'))return 'orders';if(c.contains('vp')||c.contains('vu'))return 'account';if(c.contains('vpo'))return 'policy';
if(c.contains('va'))return typeof allS!='undefined'&&allS&&allS.src=='search'?'search':'category';if(c.contains('vc'))return 'category';if(c.contains('vs')||c.contains('vl'))return 'shop';return 'home'}
var lastPg='';function pgTick(){var k=pgKey();if(k===lastPg)return;lastPg=k;T('page',null,{pg:k});if(k==='home')recoPaint()}
try{new MutationObserver(pgTick).observe(document.body,{attributes:true,attributeFilter:['class']})}catch(e){}pgTick();
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.cat[data-cn]');if(b&&b.dataset.cn)T('click',null,{cat:b.dataset.cn.slice(0,80),pg:'category'})},true);
/* ---- last two products viewed (kept in this browser, only with permission) ---- */
function recent(){if(!allow())return [];try{var a=JSON.parse(localStorage.getItem(RK)||'[]');return Array.isArray(a)?a.slice(0,2):[]}catch(e){return []}}
function rsave(a){try{localStorage.setItem(RK,JSON.stringify(a.slice(0,2)))}catch(e){}}
function ent(p){return {id:String(p[9]),c:String(p[12]||''),sb:String(p[13]||''),tg:String(p[18]||''),n:nm(p).slice(0,120)}}
function remember(p){if(p[8]!=='L'||!allow())return;var a=recent().filter(function(x){return x.id!==String(p[9])});a.unshift(ent(p));rsave(a)}
if(window.openPD){var oPD=openPD;openPD=function(k){var r=oPD.apply(this,arguments);if(PDS&&PDS.k==k){var p=PDS.p;T('view',pid(k),{pn:nm(p).slice(0,120),cat:String(p[12]||'').slice(0,80)});remember(p)}return r}}
if(window.atcOpen){var oA=atcOpen;atcOpen=function(k,mode){var r=oA.apply(this,arguments);if(mode=='buy'&&window.ATC&&ATC.k==k)T('checkout',pid(k));return r}}
if(window.cartCheckout){var oC=cartCheckout;cartCheckout=function(){var r=oC.apply(this,arguments);if(window.ATC&&ATC.k=='cart')T('checkout');return r}}
if(window.cnt){var tot=function(){var n=0;for(var k in cart)n+=+cart[k]||0;return n},last=tot(),oN=cnt;cnt=function(){var r=oN.apply(this,arguments),n=tot();if(n>last)T('cart');last=n;return r}}
/* ---- suggestions: stock, popularity, offers and the last two products viewed ---- */
function pool(){var seen=[],out=[];V.min.hot.concat(V.min.best).forEach(function(p){if(p[8]==='L'&&seen.indexOf(p)<0){seen.push(p);out.push(p)}});return out}
function avail(p){if(p[8]!=='L')return false;var s=window.LST?LST[nm(p)]:null;return s==null||s>0}
function tags(s){return String(s||'').toLowerCase().split(/[,\s]+/).filter(function(x){return x.length>1})}
function tagHit(a,b){var t=tags(a),n=0;tags(b).forEach(function(x){if(t.indexOf(x)>-1)n++});return n}
function base(p){var d=p[4]>p[3]?(p[4]-p[3])/p[4]:0;return Math.min(d,.6)*5+Math.log(1+(+p[19]||0))*.8}
function sc(p,R){var s=base(p);R.forEach(function(r,i){if(p[12]&&p[12]===r.c)s+=i?4:6;if(p[13]&&r.sb&&p[13]===r.sb)s+=2;s+=Math.min(3,tagHit(r.tg,p[18]))});return s}
function sortBy(arr,f){var ix=arr.map(function(p,i){return [p,i,f(p)]});ix.sort(function(a,b){return b[2]-a[2]||a[1]-b[1]});for(var i=0;i<ix.length;i++)arr[i]=ix[i][0]}
function recoApply(){var R=recent(),f=function(p){return (avail(p)?0:-1000)+sc(p,R)};if(R.length){sortBy(V.min.hot,f);sortBy(V.min.best,f)}else sortBy(V.min.best,function(p){return (avail(p)?0:-1000)+Math.log(1+(+p[19]||0))})}
function row(src,f){return catalog('min',src).slice(0,12).map(function(x){return card(x.p,f,x.k)}).join('')}
function recSec(){var sec=$('recsec');if(!sec)return;var R=recent(),ids={};R.forEach(function(r){ids[r.id]=1});
var c=pool().filter(function(p){return avail(p)&&!ids[String(p[9])]});sortBy(c,function(p){return sc(p,R)});var top=c.slice(0,10);
if(top.length<2){sec.style.display='none';return}$('recttl').textContent=R.length?L('Recommended for You','আপনার জন্য সুপারিশ'):L('Popular right now','এখন জনপ্রিয়');$('recr').innerHTML=top.map(function(p){return card(p,0,'min')}).join('');$('recr').scrollLeft=0;sec.style.display=''}
function recoPaint(){try{if(!window.CDS||!$('hotr'))return;recoApply();$('hotr').innerHTML=row('hot',0);$('bestr').innerHTML=row('best',1);$('hotr').scrollLeft=0;$('bestr').scrollLeft=0;recSec()}catch(e){}}
function relPaint(){var el=$('pdrel');if(!el||!window.PDS||!PDS.p)return;var p=PDS.p;if(p[8]!=='L'){el.innerHTML='';return}var R=recent(),cur=String(p[9]);
var c=pool().filter(function(q){return q!==p&&String(q[9])!==cur&&avail(q)&&(q[12]===p[12]||(p[13]&&q[13]===p[13])||tagHit(p[18],q[18])>0)});
sortBy(c,function(q){return (q[12]===p[12]?6:0)+(q[13]&&q[13]===p[13]?3:0)+tagHit(p[18],q[18])*1.5+base(q)+(R.length?sc(q,R)*.3:0)});var top=c.slice(0,8);
el.innerHTML=top.length?'<div class="sh"><h3>'+L('Related Products','সম্পর্কিত পণ্য')+'</h3></div><div class="row" id="relr">'+top.map(function(q){return card(q,0,'min')}).join('')+'</div>':''}
if(window.renderPD){var oRP=renderPD;renderPD=function(){var r=oRP.apply(this,arguments);try{relPaint()}catch(e){}return r}}
if(window.applyCatalog){var oAC=applyCatalog;applyCatalog=function(){var r=oAC.apply(this,arguments);try{seed();recoPaint()}catch(e){}return r}}
if(window.setLang){var oSL=setLang;setLang=function(){var r=oSL.apply(this,arguments);try{recSec();relPaint()}catch(e){}return r}}
/** A signed-in customer who opened products on another device: ask the server for the last two. */
function seed(){if(NBX.seeded||!NBX.ready||!allow()||recent().length||!pool().length)return;NBX.seeded=true;if(!TOKN)return;
nbApi('GET','/reco/recent?v='+VID).then(function(r){var a=[];((r&&r.recent)||[]).forEach(function(x){pool().forEach(function(p){if(String(p[9])===String(x.id)&&a.length<2)a.push(ent(p))})});if(a.length){rsave(a);recoPaint()}}).catch(function(){})}
/* ---- cookie and privacy notice ---- */
function setConsent(v){var prev=cget();try{localStorage.setItem(CK,v?'1':'0')}catch(e){}var b=$('ckb');if(b)b.remove();
if(!v){try{localStorage.removeItem(RK)}catch(e){}if(prev===1)nbApi('POST','/privacy/forget',{v:VID}).catch(function(){})}
else{lastPg='';pgTick();seed()}recoPaint();try{relPaint()}catch(e){}}
function banner(){var i=NBX.info;if(!i||!+i.personalization||!+i.consent_required||cget()!==null||$('ckb'))return;var d=document.createElement('div');d.id='ckb';d.setAttribute('role','dialog');d.setAttribute('aria-label',L('Privacy and cookies','প্রাইভেসি ও কুকি'));
d.innerHTML='<p>'+L('We use cookies to keep the site working and to count visits. If you agree, we also remember the products you view to show better suggestions and to help prevent fake orders.','সাইট চালু রাখতে ও ভিজিট গুনতে আমরা কুকি ব্যবহার করি। আপনি রাজি হলে, ভালো সাজেশন দেখাতে ও ভুয়া অর্ডার ঠেকাতে আপনার দেখা পণ্যও মনে রাখি।')+' <a href="#" data-ck="pol">'+L('Privacy Policy','প্রাইভেসি পলিসি')+'</a></p><div><button type="button" data-ck="ess">'+L('Essential only','শুধু জরুরি')+'</button><button type="button" class="pri" data-ck="all">'+L('Accept all','সব গ্রহণ করুন')+'</button></div>';document.body.appendChild(d)}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-ck]');if(!b)return;e.preventDefault();var a=b.dataset.ck;if(a=='all')setConsent(1);else if(a=='ess')setConsent(0);else if(a=='pol'&&window.openPolPage)openPolPage('privacy');
else if(a=='erase'){nbApi('POST','/privacy/forget',{v:VID}).then(function(){try{localStorage.removeItem(RK)}catch(x){}recoPaint();pmOpen(L('Done','হয়ে গেছে'),'<p>'+L('Your stored activity has been erased.','আপনার জমা থাকা অ্যাক্টিভিটি মুছে ফেলা হয়েছে।')+'</p>')}).catch(function(x){pmOpen(L('Error','ত্রুটি'),'<p>'+esc(liveErr(x))+'</p>')})}});
document.addEventListener('change',function(e){var t=e.target;if(t&&t.id=='ckpers')setConsent(t.checked?1:0)});
function polBox(){var v=$('polv');if(!v||!document.body.classList.contains('vpo')||!window.polKey||polKey()!=='privacy'||v.querySelector('.nbpc')||!v.firstElementChild)return;var i=NBX.info,on=cget()===1||(cget()===null&&i&&!+i.consent_required);
var d=document.createElement('div');d.className='nbpc';d.innerHTML='<h3>'+L('Your privacy choices','আপনার প্রাইভেসি পছন্দ')+'</h3>'+(i&&+i.personalization?'<label><input type="checkbox" id="ckpers"'+(on?' checked':'')+'> <span>'+L('Allow activity tracking and personalised suggestions','অ্যাক্টিভিটি ট্র্যাকিং ও ব্যক্তিগত সাজেশন অনুমোদন করুন')+'</span></label>':'<p>'+L('Optional tracking is switched off on this website.','এই ওয়েবসাইটে ঐচ্ছিক ট্র্যাকিং বন্ধ আছে।')+'</p>')+'<button type="button" data-ck="erase">'+L('Erase my stored activity','আমার জমা অ্যাক্টিভিটি মুছুন')+'</button>';v.firstElementChild.appendChild(d)}
try{new MutationObserver(polBox).observe($('polv'),{childList:true})}catch(e){}
/* ---- access-restricted page (the server enforces the restriction; this only explains it) ---- */
function bkErr(m){var n=$('blkerr');if(n)n.textContent=m||''}
function nbBlocked(b){b=b||{};var o=$('blkv');if(o)o.remove();o=document.createElement('div');o.id='blkv';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');
var msg=(lang=='bn'&&b.message_bn)?b.message_bn:(b.message||''),ph=String(b.phone||'').trim(),tel='tel:'+ph.replace(/[^\d+]/g,''),P=window.PROF||{};
var ex='';if(b.expires){try{ex=new Date(b.expires*1000).toLocaleDateString(lang=='bn'?'bn-BD':'en-GB',{day:'numeric',month:'long',year:'numeric'})}catch(e){}}
o.innerHTML='<div class="blk"><div class="blk-ic"><svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.500-3.400 8-8 9-4.600-1-8-4.500-8-9V6z"/><path d="M12 8v5M12 16.500v.01"/></svg></div><h1>'+esc(b.title||L('Access restricted','অ্যাক্সেস সীমিত'))+'</h1><p class="blk-m">'+esc(msg)+'</p>'
+(ex?'<p class="blk-x">'+L('This restriction ends on ','এই রেস্ট্রিকশন শেষ হবে ')+esc(ex)+'</p>':'')+(b.ref?'<p class="blk-r">'+L('Reference','রেফারেন্স')+': <b>'+esc(b.ref)+'</b></p>':'')
+'<div class="blk-c"><span>'+L('NurBuy Customer Care','NurBuy কাস্টমার কেয়ার')+'</span>'+(ph?'<a class="blk-ph" href="'+esc(tel)+'">'+esc(ph)+'</a>'+(b.hours?'<small>'+esc(b.hours)+'</small>':''):'<small>'+L('Please contact NurBuy Customer Care.','অনুগ্রহ করে NurBuy কাস্টমার কেয়ারে যোগাযোগ করুন।')+'</small>')+'</div>'
+(ph?'<a class="blk-b" href="'+esc(tel)+'">'+L('Call Customer Care','কাস্টমার কেয়ারে কল করুন')+'</a>':'')
+(+b.appeal?'<button type="button" class="blk-b alt" data-bk="ap">'+L('Request a review','রিভিউয়ের অনুরোধ করুন')+'</button><div id="blkap" hidden><p class="blk-n">'+esc(b.appeal_note||'')+'</p>'
+'<input id="blkn" placeholder="'+L('Your name','আপনার নাম')+'" value="'+esc(P.name||'')+'" autocomplete="name"><input id="blkm" inputmode="tel" placeholder="'+L('Mobile number used on NurBuy (01XXXXXXXXX)','NurBuy-তে ব্যবহৃত মোবাইল (01XXXXXXXXX)')+'" value="'+esc(P.mobile||'')+'" autocomplete="tel"><textarea id="blkt" rows="3" maxlength="1000" placeholder="'+L('Why should the restriction be reviewed?','কেন রেস্ট্রিকশন রিভিউ করা উচিত?')+'"></textarea>'
+'<div class="blk-e" id="blkerr" role="alert"></div><button type="button" class="blk-b" data-bk="send">'+L('Send review request','রিভিউ রিকোয়েস্ট পাঠান')+'</button><button type="button" class="blk-k" data-bk="st">'+L('Already sent a request? Check its status','আগে পাঠিয়েছেন? অবস্থা দেখুন')+'</button></div>'
+'<div id="blkst" hidden><input id="blkr" placeholder="'+L('Reference (APXXXXXX)','রেফারেন্স (APXXXXXX)')+'"><input id="blksm" inputmode="tel" placeholder="'+L('Mobile number','মোবাইল নম্বর')+'" value="'+esc(P.mobile||'')+'"><div class="blk-e" id="blkse" role="alert"></div><div class="blk-ok" id="blkso"></div><button type="button" class="blk-b" data-bk="chk">'+L('Check status','অবস্থা দেখুন')+'</button></div>':'')
+'<button type="button" class="blk-l" data-bk="close">'+L('Back to browsing','ব্রাউজিংয়ে ফিরুন')+'</button></div>';document.body.appendChild(o);document.body.classList.add('blkopen')}
window.nbBlocked=nbBlocked;
function bkClose(){var o=$('blkv');if(o)o.remove();document.body.classList.remove('blkopen')}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#blkv [data-bk]');if(!b)return;var a=b.dataset.bk;
if(a=='close')bkClose();
else if(a=='ap'){var f=$('blkap');f.hidden=!f.hidden;$('blkst').hidden=true;b.hidden=!f.hidden}
else if(a=='st'){$('blkap').hidden=true;$('blkst').hidden=false}
else if(a=='send'){bkErr('');var d={name:$('blkn').value.trim(),mobile:$('blkm').value.trim(),message:$('blkt').value.trim()};b.disabled=true;
nbApi('POST','/appeals',d).then(function(r){$('blkap').innerHTML='<div class="blk-ok">'+L('Your request was sent. Keep this reference: ','আপনার অনুরোধ পাঠানো হয়েছে। এই রেফারেন্সটি রাখুন: ')+'<b>'+esc(r.ref)+'</b><br>'+L('Our team will reply after checking your orders. You can check the reply here with the reference and your mobile number.','আপনার অর্ডার দেখে আমাদের টিম উত্তর দেবে। রেফারেন্স ও মোবাইল নম্বর দিয়ে এখানেই উত্তর দেখতে পারবেন।')+'</div>'}).catch(function(x){b.disabled=false;bkErr(liveErr(x))})}
else if(a=='chk'){$('blkse').textContent='';$('blkso').textContent='';b.disabled=true;
nbApi('GET','/appeals/status?ref='+encodeURIComponent($('blkr').value.trim())+'&mobile='+encodeURIComponent($('blksm').value.trim())).then(function(r){b.disabled=false;var s=r.status=='open'?L('Under review','রিভিউ চলছে'):r.status=='approved'?L('Approved','অনুমোদিত'):L('Not approved','অনুমোদিত হয়নি');$('blkso').innerHTML='<b>'+s+'</b>'+(r.reply?'<br>'+esc(r.reply):'')}).catch(function(x){b.disabled=false;$('blkse').textContent=liveErr(x)})}});
var oApi=nbApi;nbApi=function(){return oApi.apply(this,arguments).catch(function(e){window.nbBlkHandle(e);throw e})};
/* ---- styles for the notice, the restricted page and the suggestion rows ---- */
var st=document.createElement('style');st.textContent='#ckb{position:fixed;left:50%;transform:translateX(-50%);bottom:16px;width:min(760px,calc(100% - 24px));background:#fff;border:1px solid #e3e3e8;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.18);padding:14px 16px;z-index:2900;display:flex;gap:14px;align-items:center;flex-wrap:wrap;font-size:13.5px;line-height:1.5;color:#222}#ckb p{margin:0;flex:1 1 320px}#ckb a{color:#111;font-weight:700;text-decoration:underline}#ckb div{display:flex;gap:8px;flex:0 0 auto}#ckb button{border:1.5px solid #111;background:#fff;color:#111;border-radius:22px;padding:8px 16px;font-weight:700;font-size:13px;cursor:pointer}#ckb button.pri{background:#111;color:#fff}@media(max-width:820px){#ckb{bottom:74px}}'
+'.nbpc{margin:22px 0 8px;padding:16px;border:1px solid #e3e3e8;border-radius:14px;background:#f8f8fa}.nbpc h3{margin:0 0 10px;font-size:16px}.nbpc label{display:flex;gap:10px;align-items:flex-start;margin-bottom:12px;cursor:pointer}.nbpc input{margin-top:3px}.nbpc button{border:1.5px solid #111;background:#fff;border-radius:22px;padding:8px 16px;font-weight:700;cursor:pointer}'
+'#blkv{position:fixed;inset:0;z-index:100000;background:#f4f5f8;overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:24px 14px}.blk{background:#fff;border-radius:22px;box-shadow:0 12px 50px rgba(0,0,0,.12);width:100%;max-width:480px;padding:30px 24px;text-align:center;margin:auto 0}.blk-ic{width:64px;height:64px;border-radius:50%;background:#fde8ec;color:#be123c;margin:0 auto 14px;display:flex;align-items:center;justify-content:center}.blk-ic svg{width:32px;height:32px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.blk h1{font-size:22px;margin:0 0 10px;color:#111}.blk-m{color:#444;line-height:1.6;margin:0 0 10px;white-space:pre-line}.blk-x,.blk-r{color:#666;font-size:13px;margin:4px 0}.blk-c{background:#f6f7fb;border-radius:14px;padding:14px;margin:16px 0 12px}.blk-c span{display:block;color:#666;font-size:12.5px;font-weight:600;margin-bottom:4px}.blk-ph{display:block;font-size:24px;font-weight:800;color:#111;text-decoration:none;letter-spacing:.3px}.blk-c small{color:#666}'
+'.blk-b{display:block;width:100%;box-sizing:border-box;border:0;background:#111;color:#fff;border-radius:26px;padding:13px;font-weight:700;font-size:15px;cursor:pointer;text-decoration:none;margin:8px 0}.blk-b.alt{background:#fff;color:#111;border:1.5px solid #111}.blk-b[disabled]{opacity:.6}.blk-l,.blk-k{background:none;border:0;color:#555;font-size:13.5px;margin-top:8px;cursor:pointer;text-decoration:underline}#blkap,#blkst{text-align:left;margin-top:10px}#blkap input,#blkap textarea,#blkst input{display:block;width:100%;box-sizing:border-box;border:1.5px solid #dcdce2;border-radius:12px;padding:11px 12px;font:inherit;margin:8px 0}.blk-n{color:#555;font-size:13px;line-height:1.55;margin:0 0 6px}.blk-e{color:#be123c;font-size:13px;min-height:16px}.blk-ok{background:#e3f6ea;color:#14532d;border-radius:12px;padding:12px;font-size:13.5px;line-height:1.55;margin:8px 0}.blk-ok:empty{display:none}body.blkopen{overflow:hidden}'
+'#recsec .sh,#pdrel .sh{margin-top:6px}main #recr,main #relr{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:14px;padding:4px 2px 16px;margin-right:0}';
document.head.appendChild(st);
})();

/* ===== NAV: remembers where each page was opened from, so Back returns to the exact previous page ===== */
(function(){
var B=document.body,PAGES={0:{d:{t:'home'},p:0,sy:0}},ENT=[0],ent=0,cur=0,NID=0,NR=0,lastY=0;
window.addEventListener('scroll',function(){lastY=window.pageYOffset||0},{passive:true});
function has(c){return B.classList.contains(c)}
function base(){var d;
if(has('vl')){var h=document.querySelector('#sellv h1');d={t:'seller',n:h?h.textContent:''}}
else if(has('vpo'))d={t:'pol',k:window.polKey?polKey():null};else if(has('vh'))d={t:'hist'};else if(has('vc'))d={t:'cats',i:window.catsLevel?catsLevel():null};else if(has('vn'))d={t:'ntf'};else if(has('vm'))d={t:'adm'};
else if(has('vu'))d={t:'auth',mode:(typeof AUT!='undefined'&&AUT.mode)||'login'};
else if(has('vk'))d={t:'cart'};else if(has('vw'))d={t:'wish'};else if(has('vo'))d={t:'ord'};else if(has('vp'))d={t:'prof'};else if(has('vs'))d={t:'shops'};
else if(has('va')&&allS){var a={};Object.keys(allS).forEach(function(k){if(k!='shown'&&k!='pushed')a[k]=allS[k]});d={t:'all',a:a,sh:allS.shown}}
else d={t:'home'};
d.v=view;return d}
function page(){if(has('vd')&&typeof PDS!='undefined'&&PDS.k){var d={t:'pd',k:PDS.k,v:view};if(has('vr'))d.vr=1;return d}return base()}
function key(d){var c=JSON.parse(JSON.stringify(d));delete c.sh;delete c.vr;return JSON.stringify(c)}
function reset(){if(typeof goHome=='function')goHome();B.classList.remove('vd','vr');if(typeof closeD=='function'){try{closeD()}catch(e){}}}
function restore(d,sy){NR=1;try{
if(d.t=='pd'){if(has('vd')&&typeof PDS!='undefined'&&PDS.k==d.k){B.classList.remove('vr')}else{reset();openPD(d.k)}if(d.vr&&!has('vr'))openRP()}
else if(key(base())==key(d)){B.classList.remove('vd','vr')}
else{reset();
switch(d.t){case 'prof':openProf();break;case 'ord':openOrd();break;case 'shops':openShops();break;case 'wish':openWish();break;case 'cart':openCart();break;case 'auth':openAuth(d.mode);break;case 'adm':if(window.NBChat)NBChat.openAdm();break;case 'ntf':if(window.NBN)NBN.open();break;case 'hist':openHist();break;case 'pol':if(d.k&&window.openPolPage)openPolPage(d.k,true);break;case 'cats':openCats(d.i);break;case 'seller':openSeller(d.n,true);break;case 'all':openAll(d.a.src,Object.assign({},d.a,{shown:d.sh}));break;default:if(typeof setTab=='function')setTab(0)}}
}catch(e){try{console.error(e)}catch(x){}}
NR=0;var y=sy||0;setTimeout(function(){window.scrollTo(0,y)},30);setTimeout(function(){if(Math.abs((window.pageYOffset||0)-y)>2)window.scrollTo(0,y)},180)}
function go(n){var nd=PAGES[n];if(!nd){n=0;nd=PAGES[0]}cur=n;restore(nd.d,nd.sy)}
var ps=history.pushState;
history.pushState=function(st,t,u){if(NR)return;
var par=cur;if(PAGES[par])PAGES[par].sy=lastY;
var d=page();if(PAGES[par]&&PAGES[par].d.t=='auth'&&d.t!='auth')par=PAGES[par].p;
var n=++NID;PAGES[n]={d:d,p:par,sy:0};
var ci=ENT.indexOf(ent);if(ci>-1)ENT.length=ci+1;ENT.push(n);cur=n;ent=n;
return ps.call(history,Object.assign({},st,{nid:n}),t,u)};
window.addEventListener('popstate',function(){var n=(history.state&&history.state.nid)||0;ent=n;go(n)});
new MutationObserver(function(){if(!NR&&page().t=='home'){cur=0}}).observe(B,{attributes:true,attributeFilter:['class']});
function back(){var nd=PAGES[cur];if(!nd||cur==0){go(0);return}var c=cur,pe=ENT[ENT.indexOf(ent)-1];
if(ent===c&&pe===nd.p&&history.state&&history.state.nid===c){history.back();setTimeout(function(){if(cur===c)go(nd.p)},300)}else go(nd.p)}
window.NAV={back:back,go:go,page:page,state:function(){return{cur:cur,PAGES:PAGES,ENT:ENT}}};
})();
/* ===== Website pages and the bottom bar =====
 * 1) A Website page (About, Privacy, ...) hides every other page while it is open, so whatever opens next must close it first.
 * 2) The bottom bar lights up the icon of the page you are really on (nothing inside a product or a Website page). */
(function(){
var B=document.body,VW=['vk','vo','vp','vu','va','vc','vs','vl','vh','vn','vm','vw','vq'];
function polOn(){return B.classList.contains('vpo')}
function leave(){if(polOn()&&window.closePolPage)closePolPage()}
document.addEventListener('click',function(e){if(!polOn())return;var t=e.target;if(!t||!t.closest)return;
var a=t.closest('header a,header button,header .cat,.bn a,.dbar a,.dbar button');
var f=t.closest('footer a[data-ft],footer button[data-ft]');
if(a||(f&&!/^(about|privacy|return|shipping)$/.test(f.getAttribute('data-ft')||'')))leave()},true);
function tabNow(){var c=B.classList,n=-1;
if(c.contains('vd')||c.contains('vpo'))n=-1;
else if(c.contains('wo')||c.contains('vq'))n=2;
else if(c.contains('vk'))n=3;else if(c.contains('vo'))n=4;else if(c.contains('vp'))n=5;
else if(c.contains('vc')||(c.contains('va')&&window.allS&&allS.src=='cat')||(window.cpS&&cpS.o))n=1;
else if(VW.some(function(x){return c.contains(x)}))n=-1;else n=0;
return n}
function sync(){var n=tabNow();document.querySelectorAll('.bn a').forEach(function(x,i){x.classList.toggle('on',i===n)})}
window.setTab=function(){sync()};window.syncTab=sync;
try{new MutationObserver(function(){if(polOn()&&VW.some(function(x){return B.classList.contains(x)}))leave();sync()}).observe(B,{attributes:true,attributeFilter:['class']})}catch(e){}
var _gh=window.goHome;window.goHome=function(){leave();return _gh.apply(this,arguments)};
var _oc=window.openCP,_cc=window.closeCP;window.openCP=function(){var r=_oc.apply(this,arguments);sync();return r};window.closeCP=function(){var r=_cc.apply(this,arguments);sync();return r};
sync();
})();
/*NBV2:BEGIN*/
/* ===== NurBuy Minutes v2 (customer site) =====
 * Inlined into nurbuy-home.html by shared/sync.py (between the NBV2 markers). Edit this file, not the copy.
 *  - Minutes only
 *  - every page has its own address: /p/<name>-<id>, /c/<category>/<sub>/..., /shop/<name>-sl<id>, /orders/<id>, /wallet ...
 *  - product Share (phone share sheet, WhatsApp, Messenger, Facebook, copy link)
 *  - category tree of any depth (from the admin's category list)
 *  - delivery time of the chosen village, live countdown on orders, extra-time notes, wallet bonus state
 *  - Sponsored carousel (seller boosts, Minutes only, max 4) with view/click counting
 *  - server notifications + Web Push, notification links open the right page (after login if needed)
 *  - Home icon chosen in admin, favicon with cache version, crop editor for photo uploads
 */
(function () {
var W = window, B = document.body;
W.NB_SW = '/sw.js';
function isBn() { return lang == 'bn'; }
function nB(n) { return typeof bnN == 'function' ? bnN(n) : String(n); }
var V2 = { tree: [], node: {}, par: {}, slug: {}, pc: {}, ads: [], set: {}, seen: {}, pend: null, booted: false, ntfAt: 0, skew: 0 };
W.NBV2 = V2;

/* ---------- styles ---------- */
(function () {
  var css = ''
  + '.v2bc{display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-size:13px;color:#667;margin:2px 0 8px}.v2bc a{color:#1d2fe0;cursor:pointer;text-decoration:none}.v2bc a:hover{text-decoration:underline}.v2bc i{font-style:normal;color:#aab}'
  + '#ach .v2up{background:#eef1fb;color:#1d2fe0}'
  + '.v2sp{position:relative;height:100%;display:flex;flex-direction:column;background:#fff;border:1px solid #e7eaf3;border-radius:14px;padding:10px;box-sizing:border-box;min-height:0}'
  + '.v2sp-h{display:flex;align-items:center;justify-content:space-between;margin:0 2px 8px;font-size:13px;color:#556}.v2sp-h b{font-weight:600;color:#1a1f36;display:flex;align-items:center;gap:6px}.v2sp-h b svg{width:15px;height:15px;fill:none;stroke:#f59e0b;stroke-width:2}'
  + '.v2sp-d{display:flex;gap:5px}.v2sp-d i{width:7px;height:7px;border-radius:50%;background:#d5dbea;transition:all .3s}.v2sp-d i.on{background:#1d2fe0;width:16px;border-radius:4px}'
  + '.v2sp-v{overflow-x:auto;overflow-y:hidden;flex:1;min-height:0;border-radius:10px;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}.v2sp-v::-webkit-scrollbar{display:none}.v2sp-t{display:flex;height:100%;width:100%}.v2sp-c{scroll-snap-align:start}'
  + '.v2sp-c{flex:0 0 100%;box-sizing:border-box;display:flex;flex-direction:column;text-decoration:none;color:inherit;cursor:pointer;min-width:0;padding:0 4px}'
  + '.v2sp-i{position:relative;flex:1;min-height:90px;border-radius:10px;overflow:hidden;background:linear-gradient(135deg,#eef2ff,#fdf2f8);display:grid;place-items:center;font-size:44px}'
  + '.v2sp-i img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.v2sp-i em{position:absolute;left:8px;top:8px;background:rgba(17,24,39,.72);color:#fff;font-style:normal;font-size:11px;padding:2px 8px;border-radius:20px}'
  + '.v2sp-b{padding:8px 2px 0;min-width:0}.v2sp-n{font-size:14px;line-height:1.3;color:#1a1f36;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.6em}'
  + '.v2sp-p{display:flex;align-items:baseline;gap:6px;margin-top:4px}.v2sp-p b{font-size:16px;color:#1d2fe0}.v2sp-p del{font-size:12px;color:#99a}.v2sp-s{display:block;font-size:12px;color:#778;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
  + '#spm .v2sp{height:auto;width:100%;max-width:100%;overflow:hidden}#spm .v2sp-c{flex-basis:50%}#spm .v2sp-i{flex:none;aspect-ratio:1.15;min-height:0}'
  + '#sp .v2sp-c{flex-basis:50%}#sp .v2sp-n{font-size:13px}#sp .v2sp-p b{font-size:15px}#sp .v2sp-i{min-height:70px}'
  + '@media(min-width:600px){#spm .v2sp-c{flex-basis:25%}}'
  + '@media(min-width:900px){.hw.v2nosp{grid-template-columns:1fr}}'
  + '.v2eta{margin:10px 0 2px;padding:10px 12px;border-radius:12px;background:#f2f5ff;border:1px solid #dfe5fb}'
  + '.v2eta-r{display:flex;align-items:center;justify-content:space-between;gap:10px}.v2eta-r small{color:#556;font-size:13px}.v2eta-r b{font-size:18px;color:#1d2fe0;font-variant-numeric:tabular-nums;letter-spacing:.5px}'
  + '.v2eta-bar{height:6px;border-radius:4px;background:#dfe5fb;margin-top:8px;overflow:hidden}.v2eta-bar i{display:block;height:100%;background:linear-gradient(90deg,#1d2fe0,#22c55e);border-radius:4px;transition:width 1s linear}'
  + '.v2eta.late{background:#fff7ed;border-color:#fed7aa}.v2eta.late .v2eta-r b{color:#c2410c;font-size:15px}.v2eta.ok{background:#ecfdf5;border-color:#bbf7d0;color:#166534;font-size:14px;display:flex;align-items:center;gap:8px}.v2eta.ok svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.4}'
  + '.v2dl{margin-top:8px;font-size:13px;color:#9a3412;background:#fff7ed;border-radius:8px;padding:6px 9px}'
  + '.v2bo{margin-top:6px;font-size:13px;color:#475569;display:flex;align-items:center;gap:6px}.v2bo svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2}.v2bo.g{color:#15803d}.v2bo.r{color:#b91c1c}'
  + '.v2sh-o{position:fixed;inset:0;z-index:9000;background:rgba(10,15,40,.45);display:none;align-items:flex-end;justify-content:center}.v2sh-o.o{display:flex}'
  + '.v2sh{background:#fff;width:100%;max-width:440px;border-radius:18px 18px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom));box-sizing:border-box;animation:v2up .22s ease-out}'
  + '@media(min-width:700px){.v2sh-o{align-items:center}.v2sh{border-radius:18px}}@keyframes v2up{from{transform:translateY(30px);opacity:.4}to{transform:none;opacity:1}}'
  + '.v2sh-p{display:flex;gap:12px;align-items:center;padding-bottom:12px;border-bottom:1px solid #eef0f6}.v2sh-p img,.v2sh-p .e{width:56px;height:56px;border-radius:10px;object-fit:cover;background:#f3f4f8;display:grid;place-items:center;font-size:28px;flex:none}'
  + '.v2sh-p b{display:block;font-size:15px;line-height:1.3;color:#1a1f36;font-weight:600}.v2sh-p small{color:#1d2fe0;font-size:14px}'
  + '.v2sh-g{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:14px 0 10px}.v2sh-g button{background:none;border:0;display:flex;flex-direction:column;align-items:center;gap:6px;font:inherit;font-size:12.5px;color:#334;cursor:pointer;padding:4px 0}'
  + '.v2sh-g span{width:50px;height:50px;border-radius:50%;display:grid;place-items:center;color:#fff}.v2sh-g svg{width:24px;height:24px;fill:currentColor}'
  + '.v2sh-u{display:flex;gap:8px;align-items:center;background:#f4f6fb;border-radius:10px;padding:8px 10px;font-size:12.5px;color:#556}.v2sh-u code{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:inherit}'
  + '.v2sh-x{width:100%;margin-top:10px;background:#eef0f6;border:0;border-radius:10px;padding:11px;font:inherit;font-size:14px;cursor:pointer;color:#334}'
  + '.v2pb{display:flex;align-items:center;gap:10px;background:#eef2ff;border:1px solid #dbe3ff;border-radius:12px;padding:10px 12px;margin:8px 10px;font-size:13px;color:#334}.v2pb svg{width:20px;height:20px;flex:none;fill:none;stroke:#1d2fe0;stroke-width:2}'
  + '.v2pb span{flex:1}.v2pb button{background:#1d2fe0;color:#fff;border:0;border-radius:8px;padding:7px 12px;font:inherit;font-size:13px;cursor:pointer;white-space:nowrap}.v2pb button.x{background:none;color:#778;padding:4px}'
  + '.bn a .v2hi{width:24px;height:24px;object-fit:contain;display:block;margin:0 auto 2px}';
  var s = document.createElement('style'); s.id = 'v2css'; s.textContent = css; document.head.appendChild(s);
})();

/* ---------- small helpers ---------- */
function slug(s) {
  s = String(s == null ? '' : s);
  if (s.normalize) s = s.normalize('NFKD').replace(/[̀-ͯ]/g, '');
  return s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/, '');
}
function vid() {
  var v = ''; try { v = localStorage.getItem('nb_vid') || ''; } catch (e) {}
  if (!/^[A-Za-z0-9]{12,40}$/.test(v)) {
    var c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; v = '';
    for (var i = 0; i < 20; i++) v += c[Math.floor(Math.random() * c.length)];
    try { localStorage.setItem('nb_vid', v); } catch (e) {}
  }
  return v;
}
function liveAll() { return V.min.hot.concat(V.min.best).filter(function (p) { return p[8] === 'L'; }); }
function byId(id) { id = String(id).toLowerCase(); var r = null; liveAll().some(function (p) { if (String(p[9]).toLowerCase() === id) { r = p; return true; } }); return r; }
function pKey(p) { var k = 'min' + enName(p[1]); PMAP[k] = p; return k; }
function pName(p) { return (lang == 'en' && typeof p[1] == 'string') ? enName(p[1]) : tx(p[1]); }
function money(n) { n = Math.round(+n * 100) / 100; return '৳ ' + (n % 1 ? n.toFixed(2) : String(n)); }

/* ---------- 2. delivery time of the chosen village ---------- */
function eta() {
  try { if (W.NBZ && NBZ.on) { var zz = NBZ.zoneOfPin(); var ze = zz && +zz.eta > 0 ? +zz.eta : (+NBZ.def.eta > 0 ? +NBZ.def.eta : 0); if (ze) return ze; } } catch (e) {}
  try { var n = locNodes('min')[3]; if (n && n[4] != null && +n[4] > 0) return +n[4]; if (LOCD.min && +LOCD.min.eta > 0) return +LOCD.min.eta; } catch (e) {}
  return +V2.set.eta > 0 ? +V2.set.eta : 59;
}
W.v2Eta = eta;
W.v2EtaL = function () { var e = eta(); return L(e + ' mins', nB(e) + ' মিনিট'); };
function stripTxt() { var e = eta(); return L('Delivery in ' + e + ' minutes in your area', 'আপনার এলাকায় ' + nB(e) + ' মিনিটে ডেলিভারি'); }
var lastEta = 0;
setInterval(function () { var e = eta(); if (e !== lastEta) { lastEta = e; try { V.min.strip = stripTxt(); var s = $('strip'); if (s && !s._bs) s.textContent = V.min.strip; else if (s) bsStrip(); } catch (x) {} if (!B.className.replace(/\b(nbw|vx)\b/g, '').trim()) { try { render('min'); } catch (x) {} }
  try { if (allS && B.classList.contains('va')) renderAll(); if (B.classList.contains('vl') && W.renderSeller) renderSeller(); } catch (x) {} } }, 2500);

/* ---------- 3. catalog: category tree, product categories, boosts, settings ---------- */
function setTree(cs) {
  V2.tree = Array.isArray(cs) ? cs : []; V2.node = {}; V2.par = {}; V2.slug = {};
  (function walk(l, pid) { (l || []).forEach(function (x) { if (!x || !x.id) return; V2.node[x.id] = x; V2.par[x.id] = pid; V2.slug[x.slug] = x; walk(x.subs, x.id); }); })(V2.tree, 0);
}
function path(x) { var o = []; var g = 0; while (x && g++ < 40) { o.unshift(x); x = V2.node[V2.par[x.id]]; } return o; }
function nodeName(x) { return x ? (isBn() ? (x.b || x.n) : x.n) : ''; }
var _ac = applyCatalog;
applyCatalog = function (c) {
  try {
    V2.set = (c && c.settings) || {}; setTree(c && c.cats); V2.pc = {};
    ((c && c.products) || []).forEach(function (x) { if (x && x.id != null && Array.isArray(x.cpath) && x.cpath.length) V2.pc[String(x.id)] = x.cpath; });
    V2.ads = (c && Array.isArray(c.ads)) ? c.ads.slice(0, 4) : [];
    V.min.strip = stripTxt();
  } catch (e) { try { console.error(e); } catch (x) {} }
  var r = _ac.apply(this, arguments);
  try { if (LIVEONLY) SH.forEach(function (x) { x[5] = String(eta()); }); spR(); homeIcon(); favicon(V2.set); bootRoute(); } catch (e) { try { console.error(e); } catch (x) {} }
  return r;
};

/* ---------- 4. categories of any depth ---------- */
var BAGI = '<svg class="v2ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="width:46%;height:46%;color:#1d2fe0"><path d="M6 7h12l1 14H5zM9 7a3 3 0 016 0"/></svg>';
if (typeof liveCats == 'function') { var _lc = liveCats; liveCats = function (c) {
  var r = _lc.apply(this, arguments);
  try { if (LIVEONLY) { ((c && c.cats) || []).forEach(function (x) { if (x && !x.img && x.icon && /^https?:\/\//.test(x.icon)) { IMG[x.n] = x.icon; IMG[x.b || x.n] = x.icon; } });
    (V.min.cats || []).forEach(function (k) { if (k[0] === '\ud83d\udecd') k[0] = BAGI; }); } } catch (e) {}
  return r; }; }
/* ---------- category circle names: one language at a time ---------- */
var CGL = {"Electronics":"ইলেকট্রনিক্স","Beauty":"বিউটি","Home":"হোম","Kitchen":"কিচেন","Grocery":"গ্রোসারি","Fashion":"ফ্যাশন","Women's":"নারীদের","Womens":"নারীদের","Men's":"পুরুষের","Mens":"পুরুষের","Fragrance":"সুগন্ধি","Toys":"খেলনা","Sports":"স্পোর্টস","Mother":"মা","Baby":"শিশু","Health":"স্বাস্থ্য","Books":"বই","Mobile":"মোবাইল","Fruits":"ফল","Vegetables":"সবজি","Fish":"মাছ","Meat":"মাংস","Food":"খাবার","Medicine":"ঔষধ","Gadgets":"গ্যাজেট","Kids":"শিশু","&":"ও"};
function hasBn(t) { return /[\u0980-\u09FF]/.test(t); }
function hasEn(t) { return /[A-Za-z]/.test(t); }
W.v2CatL = function (c) {
  var bn = String(c[1] || ''), en = String(c[3] || bn), en2;
  if (lang == 'bn') {
    if (hasBn(bn) && !hasEn(bn)) return bn;
    var t = bn; Object.keys(CGL).forEach(function (k) { t = t.replace(new RegExp('(^|[^A-Za-z])' + k.replace(/'/g, "['’]?") + '(?![A-Za-z])', 'g'), function (m, a) { return a + CGL[k]; }); });
    return t.replace(/\s+/g, ' ').trim();
  }
  if (!hasBn(en)) return en;
  if (!hasBn(bn)) return bn;
  var R = {}; Object.keys(CGL).forEach(function (k) { if (!/^(Womens|Mens|Kids)$/.test(k)) R[CGL[k]] = k; });
  en2 = en.split(/\s+/).map(function (w) { return R[w] || w; }).join(' ');
  if (hasBn(en2)) { try { en2 = conv(en2); } catch (e) {} }
  return String(en2).replace(/\s+(ও|এবং)\s+/g, ' & ').replace(/\s+/g, ' ').trim();
};
function catNode(S) {
  if (!S || !V2.tree.length) return null;
  if (S.cid && V2.node[S.cid]) return V2.node[S.cid];
  var t = V2.tree[S.i]; if (!t) return null;
  if (S.gi != null && t.subs && t.subs[S.gi]) return t.subs[S.gi];
  return t;
}
function legacyIn(p, nd) { var pa = path(nd); if (pa.length > 2) return false; return p[12] === pa[0].n && (pa.length < 2 || p[13] === pa[1].n); }
var _ci = catItems;
catItems = function (S) {
  var nd = LIVEONLY ? catNode(S) : null; if (!nd) return _ci(S);
  var out = [], seen = {};
  liveAll().forEach(function (p) {
    var cp = V2.pc[String(p[9])], ok = cp ? cp.indexOf(nd.id) > -1 : legacyIn(p, nd);
    if (!ok) return; var k = 'min' + enName(p[1]); if (seen[k]) return; seen[k] = 1;
    out.push({ p: p, f: V.min.hot.indexOf(p) > -1 ? 0 : 1, k: 'min' });
  });
  return out;
};
var _ct = catTitle;
catTitle = function () { var nd = allS && catNode(allS); return nd ? nodeName(nd) : _ct(); };
var _ra = renderAll;
renderAll = function () {
  var r = _ra.apply(this, arguments);
  try {
    if (!allS || allS.src != 'cat') { var o = $('v2bc'); if (o) o.remove(); return r; }
    var nd = catNode(allS); if (!nd) return r;
    var pa = path(nd), base = (nd.subs && nd.subs.length) ? nd : (V2.node[V2.par[nd.id]] || nd), ac = $('ach');
    var h = '';
    var up = V2.node[V2.par[base.id]];
    if (up) h += '<button type="button" class="v2up" data-cid="' + up.id + '">‹ ' + esc(nodeName(up)) + '</button>';
    h += '<button type="button" data-cid="' + base.id + '" class="' + (nd.id == base.id ? 'on' : '') + '">' + (base === nd || !(base.subs && base.subs.length) ? L('All', 'সব') : L('All ', 'সব ') + esc(nodeName(base))) + '</button>';
    (base.subs || []).forEach(function (s) { h += '<button type="button" data-cid="' + s.id + '" class="' + (s.id == nd.id ? 'on' : '') + '">' + esc(nodeName(s)) + '</button>'; });
    if (ac) ac.innerHTML = h;
    var bc = $('v2bc'); if (!bc) { bc = document.createElement('div'); bc.id = 'v2bc'; bc.className = 'v2bc'; var ah = document.querySelector('#allv .ah'); if (ah && ah.parentNode) ah.parentNode.insertBefore(bc, ah.nextSibling); }
    bc.innerHTML = '<a data-cid="0">' + L('Home', 'হোম') + '</a>' + pa.map(function (x, i) { return '<i>›</i>' + (i == pa.length - 1 ? '<span>' + esc(nodeName(x)) + '</span>' : '<a data-cid="' + x.id + '">' + esc(nodeName(x)) + '</a>'); }).join('');
  } catch (e) { try { console.error(e); } catch (x) {} }
  return r;
};
function openNode(nd, push) {
  var pa = path(nd), top = V2.tree.indexOf(pa[0]), gi = pa.length > 1 && pa[0].subs ? pa[0].subs.indexOf(pa[1]) : -1;
  var ex = { v: 'min', i: top < 0 ? 0 : top, gi: gi < 0 ? null : gi, ti: null, cid: nd.id };
  if (push === false && allS && allS.src == 'cat') { Object.assign(allS, ex, { shown: BATCH }); renderAll(); sync(); window.scrollTo(0, 0); return; }
  try { if (typeof hideM == 'function') hideM(); } catch (e) {}
  openAll('cat', ex);
}
document.addEventListener('click', function (e) {
  var t = e.target.closest('#ach [data-cid],#v2bc [data-cid]'); if (!t) return;
  e.preventDefault(); e.stopPropagation();
  var id = +t.dataset.cid; if (!id) { if (typeof NAV != 'undefined') goHome(); return; }
  var nd = V2.node[id]; if (nd) openNode(nd, false);
}, true);

if (typeof pdSpecL == 'function') { var _psl = pdSpecL; pdSpecL = function (p, shop) {
  var cp = p && V2.pc[String(p[9])]; if (!cp) return _psl.apply(this, arguments);
  var nm = cp.map(function (id) { return nodeName(V2.node[id]); }).filter(Boolean).join(' › '), q = p.slice(); q[12] = nm; q[13] = '';
  return _psl.call(this, q, shop);
}; }

/* ---------- 5. page addresses ---------- */
function pUrl(p) { return p && p[8] === 'L' ? '/p/' + (slug(enName(p[1]).replace(/​/g, '')) || 'product') + '-' + String(p[9]).toLowerCase() : null; }
function shopUrl(n) { var s = LSTO && LSTO[n], id = s && s.id ? String(s.id).toLowerCase() : ''; return '/shop/' + (slug(n) || 'shop') + (id ? '-' + id : ''); }
function urlOf() {
  if (typeof NAV == 'undefined') return null;
  var d = NAV.page();
  var wo = $('wto'); if (B.classList.contains('vq') || (wo && wo.classList.contains('o'))) return '/wallet';
  switch (d.t) {
    case 'pd': return pUrl(findP(d.k)) || '/';
    case 'all': var a = d.a || {};
      if (a.src == 'cat') { var nd = catNode(a); return nd ? '/c/' + path(nd).map(function (x) { return x.slug; }).join('/') : '/categories'; }
      if (a.src == 'search') return '/search?q=' + encodeURIComponent(a.q || '');
      return '/' + ({ hot: 'hot', best: 'best', 'new': 'new' }[a.src] || 'all');
    case 'seller': return d.n ? shopUrl(d.n) : '/shops';
    case 'ord': return V2.ordQ ? '/orders/' + encodeURIComponent(V2.ordQ) : '/orders';
    case 'cats': return '/categories';
    case 'shops': return '/shops';
    case 'wish': return '/wishlist';
    case 'cart': return '/cart';
    case 'prof': return '/account';
    case 'ntf': return '/notifications';
    case 'hist': return '/history';
    case 'pol': return d.k ? '/page/' + d.k : '/';
    case 'auth': return null;
    case 'adm': return null;
    default: return '/';
  }
}
var _ps = history.pushState, _rs = history.replaceState;
function sync() {
  if (!V2.booted) return;
  var u = null; try { u = urlOf(); } catch (e) {}
  if (u == null) return;
  if (u !== location.pathname + location.search || location.hash) { try { _rs.call(history, history.state, '', u); } catch (e) {} }
}
history.pushState = function () { var r = _ps.apply(history, arguments); try { sync(); } catch (e) {} return r; };
history.replaceState = function (st, t, u) { if (V2.booted && typeof u == 'string' && u.charAt(0) == '#') u = urlOf() || undefined; return _rs.call(history, st, t, u); };
var syncT = 0;
['openWallet', 'closeWallet'].forEach(function (f) { var o = W[f]; if (typeof o == 'function') W[f] = function () { var r = o.apply(this, arguments); setTimeout(sync, 0); return r; }; });
new MutationObserver(function () { clearTimeout(syncT); syncT = setTimeout(sync, 40); }).observe(B, { attributes: true, attributeFilter: ['class'] });
// the orders page remembers which order a link opened
if (typeof openOrd == 'function') { var _oo = openOrd; openOrd = function () { V2.ordQ = V2.ordNext || null; V2.ordNext = null; return _oo.apply(this, arguments); }; }

/** Opens the page for an address. Returns false when it has to wait (catalog or login not ready yet). */
function route(u, boot) {
  var U; try { U = new URL(u, location.origin); } catch (e) { return true; }
  if (U.origin !== location.origin) { window.open(U.href, '_blank', 'noopener'); return true; }
  var p = U.pathname.replace(/\/+$/, '') || '/', m, seg;
  try { p = decodeURIComponent(p); } catch (e) {}
  var need = function () { return !!(LIVE && !LCUP); };
  var login = function () {
    if (AU.uid) return true;
    if (LIVE && TOKN && !V2.meDone) return false;
    AU.next = 'v2:' + p + U.search; openAuth('login'); return null;
  };
  if (p == '/' || p == '/index.html' || p == '/index.php') { if (!boot) goHome(); return true; }
  if ((m = p.match(/^\/p\/([^\/]+)$/))) {
    if (need()) return false;
    seg = m[1]; var id = seg.slice(seg.lastIndexOf('-') + 1), pr = byId(id);
    if (!pr) { goHome(); msg(L('This product is not available right now', 'এই পণ্যটি এখন পাওয়া যাচ্ছে না')); return true; }
    var k = pKey(pr); if (typeof addHist == 'function') addHist(k); openPD(k); return true;
  }
  if ((m = p.match(/^\/c\/(.+)$/))) {
    if (need()) return false;
    var parts = m[1].split('/').filter(Boolean), nd = V2.slug[parts[parts.length - 1]];
    if (!nd) { if (W.openCats) openCats(); else goHome(); return true; }
    openNode(nd); return true;
  }
  if ((m = p.match(/^\/shop\/([^\/]+)$/))) {
    if (need()) return false;
    seg = m[1].toLowerCase(); var nm = null;
    Object.keys(LSTO || {}).some(function (n) { var sid = String(LSTO[n].id || '').toLowerCase(); if ((sid && seg.slice(-sid.length - 1) === '-' + sid) || slug(n) === seg) { nm = n; return true; } });
    if (nm && W.openSeller) { openSeller(nm); return true; }
    if (W.openShops) openShops(); return true;
  }
  if ((m = p.match(/^\/orders(?:\/([^\/]+))?$/))) {
    var lg = login(); if (lg !== true) return lg === null;
    if (m[1]) openOrder(m[1]); else openOrd();
    return true;
  }
  if (p == '/wallet') { var lw = login(); if (lw !== true) return lw === null; openWallet(); return true; }
  if (p == '/account') { var la = login(); if (la !== true) return la === null; openProf(); return true; }
  if (p == '/notifications') { if (W.NBN) NBN.open(); return true; }
  if (p == '/cart') { openCart(); return true; }
  if (p == '/wishlist') { openWish(); return true; }
  if (p == '/shops') { if (need()) return false; openShops(); return true; }
  if (p == '/categories') { if (need()) return false; if (W.openCats) openCats(); return true; }
  if (p == '/history') { if (W.openHist) openHist(); return true; }
  if ((m = p.match(/^\/page\/(about|privacy|return|shipping)$/))) { if (W.openPolPage) openPolPage(m[1], true); return true; }
  if (p == '/login') { if (!AU.uid) openAuth('login'); return true; }
  if (p == '/search') { if (need()) return false; openAll('search', { q: U.searchParams.get('q') || '' }); return true; }
  if ((m = p.match(/^\/(hot|best|new|all)$/))) { if (need()) return false; openAll(m[1]); return true; }
  return true;
}
function openOrder(id) {
  V2.ordNext = id; openOrd();
  var go = function () { try { ORS.tab = 'all'; ORS.rng = 0; ORS.q = id; var q = $('ordq'); if (q) q.value = id; var rr = $('ordr'); if (rr) rr.value = '0'; renderOrdList(); } catch (e) {} };
  if ((ORD || []).some(function (o) { return o.id == id; })) go(); else liveOrders().then(go);
}
W.v2Route = function (u) { return route(u, false); };
function bootRoute() {
  if (V2.booted && !V2.pend) return;
  if (!V2.booted) { V2.booted = true; var h = location.pathname + location.search; if (h !== '/' && !/^\/index\.(html|php)$/.test(location.pathname)) V2.pend = h; }
  if (!V2.pend) { sync(); return; }
  var r = route(V2.pend, true);
  if (r !== false) { V2.pend = null; setTimeout(sync, 60); }
}
// first visit with no saved catalog, or the API is down: still open simple pages
setTimeout(function () { if (!V2.booted) bootRoute(); }, LIVE ? 2500 : 50);
setTimeout(function () { if (V2.pend) { V2.meDone = true; bootRoute(); } }, 6000);

/* after login: go back to the page the link pointed at */
var _aa = afterAuth;
afterAuth = function () {
  var n = AU.next;
  if (typeof n == 'string' && n.indexOf('v2:') === 0) { AU.next = null; closeAuth(); route(n.slice(3), false); return; }
  return _aa.apply(this, arguments);
};
var _am = applyMe;
applyMe = function () {
  var r = _am.apply(this, arguments); V2.meDone = true;
  setTimeout(function () { try { if (V2.pend) bootRoute(); ntfLoad(); if (W.NBPush && LIVE) NBPush.sync(NBAPI, TOKN); } catch (e) {} }, 0);
  return r;
};
if (!TOKN) V2.meDone = true;
var _le = liveExpired; liveExpired = function () { V2.meDone = true; var r = _le.apply(this, arguments); if (V2.pend) bootRoute(); return r; };

/* ---------- 6. Share ---------- */
var SHI = {
  wa: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.8 11.9 11.9 0 004.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2s.2-1.1.1-1.2-.2-.2-.5-.3z"/></svg>',
  ms: '<svg viewBox="0 0 24 24"><path d="M12 2C6.4 2 2 6.1 2 11.6c0 2.9 1.2 5.4 3.2 7.1V22l3-1.7c1.2.3 2.4.5 3.8.5 5.6 0 10-4.1 10-9.6S17.6 2 12 2zm1 12.8l-2.5-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7z"/></svg>',
  fb: '<svg viewBox="0 0 24 24"><path d="M14 8V6.3c0-.8.2-1.3 1.4-1.3H17V2.1A21 21 0 0014.6 2C12.2 2 10.6 3.4 10.6 6v2H8v3.2h2.6V22H14V11.2h2.7L17 8z"/></svg>',
  cp: '<svg viewBox="0 0 24 24"><path d="M10.6 13.4a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1.3 1.3 1.4 1.4 1.3-1.3a2 2 0 012.9 2.9l-3 3a2 2 0 01-2.9 0zm2.8-2.8a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1.3-1.3-1.4-1.4-1.3 1.3a2 2 0 01-2.9-2.9l3-3a2 2 0 012.9 0z"/></svg>',
  mo: '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
};
function mobile() { return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || ''); }
function copy(t) {
  var ok = function () { msg(L('Link copied', 'লিংক কপি হয়েছে')); };
  try { if (navigator.clipboard && W.isSecureContext !== false) { navigator.clipboard.writeText(t).then(ok, function () { old(); }); return; } } catch (e) {}
  old();
  function old() { var a = document.createElement('textarea'); a.value = t; a.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) {} a.remove(); ok(); }
}
W.v2Share = function (p) {
  if (!p) return;
  var url = location.origin + (pUrl(p) || location.pathname), nm = pName(p), pr = +p[3];
  var about = String((isBn() ? (p[15] || p[10]) : (p[10] || p[15])) || '').replace(/\s+/g, ' ').trim();
  if (about.length > 110) about = about.slice(0, 107) + '...';
  var site = (V2.set && V2.set.name) || 'NurBuy';
  var text = nm + ' — ' + money(pr) + (about ? '\n' + about : '') + '\n' + site + ' Minutes: ' + L('order now, delivered to your door in minutes.', 'এখনই অর্ডার করুন, কয়েক মিনিটে ঘরে পৌঁছে যাবে।');
  var o = $('v2sho');
  if (!o) {
    o = document.createElement('div'); o.id = 'v2sho'; o.className = 'v2sh-o'; document.body.appendChild(o);
    o.addEventListener('click', function (e) {
      if (e.target === o || e.target.closest('[data-sh=x]')) { o.classList.remove('o'); return; }
      var b = e.target.closest('[data-sh]'); if (!b) return; var S = o._s, k = b.dataset.sh, enc = encodeURIComponent;
      if (k == 'wa') window.open('https://wa.me/?text=' + enc(S.text + '\n' + S.url), '_blank', 'noopener');
      else if (k == 'fb') window.open('https://www.facebook.com/sharer/sharer.php?u=' + enc(S.url), '_blank', 'noopener,width=640,height=560');
      else if (k == 'ms') { if (mobile()) location.href = 'fb-messenger://share/?link=' + enc(S.url); else { copy(S.url); window.open('https://www.messenger.com/', '_blank', 'noopener'); } }
      else if (k == 'cp') copy(S.url);
      else if (k == 'mo' && navigator.share) navigator.share({ title: S.title, text: S.text, url: S.url }).catch(function () {});
      o.classList.remove('o');
      try { if (W.nbTrack) nbTrack('share', p[9]); } catch (x) {}
    });
  }
  o._s = { url: url, text: text, title: nm };
  var im = imgOf(p);
  o.innerHTML = '<div class="v2sh" role="dialog" aria-modal="true" aria-label="' + L('Share', 'শেয়ার') + '">'
    + '<div class="v2sh-p">' + (im ? '<img src="' + esc(im) + '" alt="">' : '<span class="e">' + (p[0] || '') + '</span>') + '<div><b>' + esc(nm) + '</b><small>' + money(pr) + '</small></div></div>'
    + '<div class="v2sh-g">'
    + '<button type="button" data-sh="wa"><span style="background:#25d366">' + SHI.wa + '</span>WhatsApp</button>'
    + '<button type="button" data-sh="ms"><span style="background:linear-gradient(135deg,#0695ff,#a334fa,#ff6968)">' + SHI.ms + '</span>Messenger</button>'
    + '<button type="button" data-sh="fb"><span style="background:#1877f2">' + SHI.fb + '</span>Facebook</button>'
    + (navigator.share ? '<button type="button" data-sh="mo"><span style="background:#64748b">' + SHI.mo + '</span>' + L('More', 'আরও') + '</button>' : '<button type="button" data-sh="cp"><span style="background:#334155">' + SHI.cp + '</span>' + L('Copy link', 'লিংক কপি') + '</button>')
    + '</div><div class="v2sh-u"><code>' + esc(url) + '</code><button type="button" data-sh="cp" style="background:#1d2fe0;color:#fff;border:0;border-radius:8px;padding:6px 12px;font:inherit;cursor:pointer">' + L('Copy', 'কপি') + '</button></div>'
    + '<button type="button" class="v2sh-x" data-sh="x">' + L('Close', 'বন্ধ করুন') + '</button></div>';
  o.classList.add('o');
};
document.addEventListener('keydown', function (e) { if (e.key == 'Escape') { var o = $('v2sho'); if (o) o.classList.remove('o'); } });

/* ---------- 7. Sponsored carousel (seller boosts) ---------- */
var _spR = spR, SPT = [];
function adItems() {
  var out = [];
  V2.ads.forEach(function (a) { var p = a && byId(a.p); if (p && out.length < 4) out.push({ c: +a.c, p: p, k: pKey(p) }); });
  return out;
}
spR = function () {
  if (!LIVEONLY) return _spR();
  SPT.forEach(clearInterval); SPT = [];
  /* Banner Studio "Sponsored" banners (placement sponsored) fill the box while one is live */
  var SBs = bsFor(['sponsored']), hw0 = document.querySelector('.hw');
  if (SBs.length) {
    if (hw0) hw0.classList.remove('v2nosp');
    ['sp', 'spm'].forEach(function (id) { var el = $(id); if (!el) return; el.style.display = ''; el.classList.add('bsp'); bsRot(el, SBs, SPT, false, false); });
    return;
  }
  ['sp', 'spm'].forEach(function (id) { var el = $(id); if (el && el.classList.contains('bsp')) { el.classList.remove('bsp', 'bsr'); el.style.aspectRatio = ''; el.innerHTML = ''; } });
  var it = adItems(), hw = document.querySelector('.hw');
  if (hw) hw.classList.toggle('v2nosp', !it.length);
  ['sp', 'spm'].forEach(function (id) {
    var el = $(id); if (!el) return;
    if (!it.length) { el.innerHTML = ''; el.style.display = 'none'; return; }
    el.style.display = '';
    var cards = it.map(function (x) {
      var p = x.p, im = imgOf(p), sh = LSHOP[enName(p[1])] || '', od = +p[4], pr = +p[3];
      return '<a class="v2sp-c" href="' + esc(pUrl(p) || '#') + '" data-adc="' + x.c + '" data-k="' + esc(x.k) + '"><span class="v2sp-i">' + (im ? '<img src="' + esc(im) + '" alt="" fetchpriority="high" decoding="async">' : (p[0] || '')) + '<em>' + L('Sponsored', 'স্পন্সরড') + '</em></span>'
        + '<span class="v2sp-b"><span class="v2sp-n">' + esc(pName(p)) + '</span><span class="v2sp-p"><b>' + money(pr) + '</b>' + (od > pr ? '<del>' + money(od) + '</del>' : '') + '</span>' + (sh ? '<span class="v2sp-s">' + esc(sh) + '</span>' : '') + '</span></a>';
    }).join('');
    el.innerHTML = '<div class="v2sp"><div class="v2sp-h"><b><svg viewBox="0 0 24 24"><path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.5 5.8 21l1.4-7L2 9.3l7-.8z"/></svg>' + L('Sponsored', 'স্পন্সরড') + '</b><span class="v2sp-d"></span></div><div class="v2sp-v"><div class="v2sp-t">' + cards + '</div></div></div>';
    carousel(el, it.length);
  });
  watchAds();
};
function perView(el) { if (el.id == 'sp') return 2; return window.innerWidth >= 600 ? 4 : 2; }
function carousel(el, n) {
  var v = el.querySelector('.v2sp-v'), d = el.querySelector('.v2sp-d'), hold = 0, tm = 0;
  function pw() { var c = v.firstChild && v.firstChild.firstChild; return c ? c.getBoundingClientRect().width : v.clientWidth; }
  function steps() { return Math.max(1, n - perView(el) + 1); }
  function cur() { var w = pw(); return w ? Math.min(steps() - 1, Math.round(v.scrollLeft / w)) : 0; }
  function dots() { if (!d) return; var s = steps(); if (d.children.length != s) d.innerHTML = s > 1 ? new Array(s + 1).join('<i></i>') : ''; var c = cur(); [].forEach.call(d.children, function (x, j) { x.classList.toggle('on', j == c); }); }
  function go(i) { v.scrollTo({ left: i * pw(), behavior: 'smooth' }); }
  v.addEventListener('scroll', function () { clearTimeout(tm); tm = setTimeout(dots, 60); }, { passive: true });
  el.onmouseenter = function () { hold = 1; }; el.onmouseleave = function () { hold = 0; };
  v.addEventListener('touchstart', function () { hold = 1; clearTimeout(el._h); el._h = setTimeout(function () { hold = 0; }, 6000); }, { passive: true });
  if (d) d.onclick = function (e) { var x = e.target.closest('i'); if (!x) return; go([].indexOf.call(d.children, x)); };
  dots();
  SPT.push(setInterval(function () { if (hold || document.hidden || steps() < 2) return; go((cur() + 1) % steps()); }, 3500));
}
var adIO = null;
function adSend(c, k) {
  if (!LIVE) return;
  try { nbApi('POST', '/ads/ev', { c: c, k: k, v: vid() }).catch(function () {}); } catch (e) {}
}
function watchAds() {
  if (!('IntersectionObserver' in W)) return;
  if (!adIO) adIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting || e.intersectionRatio < 0.6 || document.hidden) return;
      var c = +e.target.dataset.adc, now = Date.now(); if (!c) return;
      if (V2.seen[c] && now - V2.seen[c] < 30 * 60000) return;
      V2.seen[c] = now; adSend(c, 'i');
    });
  }, { threshold: [0.6] });
  adIO.disconnect();
  document.querySelectorAll('.v2sp-c[data-adc]').forEach(function (x) { adIO.observe(x); });
}
document.addEventListener('click', function (e) {
  var a = e.target.closest('.v2sp-c'); if (!a) return;
  e.preventDefault(); e.stopPropagation();
  var c = +a.dataset.adc; if (c) { if (!V2.seen[c]) { V2.seen[c] = Date.now(); adSend(c, 'i'); } setTimeout(function () { adSend(c, 'c'); }, 150); }
  var k = a.dataset.k; if (k && findP(k)) { if (typeof addHist == 'function') addHist(k); openPD(k); }
}, true);

/* ---------- 8. orders: delivery time, countdown, extra time, bonus ---------- */
function hm(ms) {
  var d = new Date(ms), h = d.getHours(), m = d.getMinutes(), h12 = h % 12 || 12, mm = (m < 10 ? '0' : '') + m;
  if (!isBn()) return h12 + ':' + mm + (h < 12 ? ' AM' : ' PM');
  var w = h < 4 ? 'রাত' : h < 6 ? 'ভোর' : h < 12 ? 'সকাল' : h < 15 ? 'দুপুর' : h < 18 ? 'বিকেল' : h < 20 ? 'সন্ধ্যা' : 'রাত';
  return w + ' ' + nB(h12 + ':' + mm);
}
var _mo = mapOrd;
mapOrd = function (o) {
  var r = _mo.apply(this, arguments);
  try {
    if (o.eta && o.view == 'min') {
      r.v2 = o.eta; V2.skew = (+o.eta.now || Date.now()) - Date.now();
      if (r.s == 'p') { var t = hm(o.eta.due); r.eta = { en: 'Arriving by ' + t + ' (within ' + (o.eta.mins + o.eta.extra) + ' min)', bn: t + '-এর মধ্যে পৌঁছাবে (' + nB(o.eta.mins + o.eta.extra) + ' মিনিট)' }; }
    }
    if (o.bonus) r.v2b = o.bonus;
    r.v2s = o.status;
  } catch (e) {}
  return r;
};
var CK = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/></svg>', GI = '<svg viewBox="0 0 24 24"><path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>';
function bonusH(o) {
  var b = o.v2b; if (!b || !(b.amount > 0)) return '';
  if (b.state == 'credited') return '<div class="v2bo g">' + GI + L(money(b.amount) + ' bonus added to your wallet', money(b.amount) + ' বোনাস ওয়ালেটে যোগ হয়েছে') + '</div>';
  if (b.state == 'pending') return '<div class="v2bo">' + GI + L('You get ' + money(b.amount) + ' wallet bonus when this order is delivered', 'অর্ডার ডেলিভারি হলে ' + money(b.amount) + ' ওয়ালেট বোনাস পাবেন') + '</div>';
  return '<div class="v2bo r">' + GI + L('No bonus: the order was cancelled', 'অর্ডার বাতিল হওয়ায় বোনাস দেওয়া হয়নি') + '</div>';
}
function delayH(e) {
  if (!e || !e.delays || !e.delays.length) return '';
  return e.delays.map(function (d) { return '<div class="v2dl">' + L('Your order is running a little late. ' + d.mins + ' more minutes needed. Reason: ' + d.label + '.', 'আপনার অর্ডারটি সামান্য বিলম্বিত হচ্ছে। আরও ' + nB(d.mins) + ' মিনিট সময় প্রয়োজন। কারণ: ' + d.label + '।') + '</div>'; }).join('');
}
function etaH(o) {
  var e = o.v2; if (!e) return bonusH(o) ? '<div class="v2eta" style="background:none;border:0;padding:0">' + bonusH(o) + '</div>' : '';
  if (o.s == 'd' || e.done) { var took = e.done ? Math.max(1, Math.round((e.done - e.start) / 60000)) : 0; return '<div class="v2eta ok">' + CK + '<span>' + L('Delivered' + (took ? ' in ' + took + ' min' : ''), 'ডেলিভারি সম্পন্ন' + (took ? ' · ' + nB(took) + ' মিনিটে' : '')) + '</span></div>' + bonusH(o); }
  if (o.s != 'p') return bonusH(o);
  return '<div class="v2eta" data-due="' + e.due + '" data-st="' + e.start + '"><div class="v2eta-r"><small>' + L('Delivery in', 'ডেলিভারি হতে বাকি') + '</small><b class="v2cd">--:--</b></div><div class="v2eta-bar"><i></i></div>' + delayH(e) + bonusH(o) + '</div>';
}
function tick() {
  var now = Date.now() + V2.skew;
  document.querySelectorAll('.v2eta[data-due]').forEach(function (el) {
    var due = +el.dataset.due, st = +el.dataset.st, rem = Math.round((due - now) / 1000), b = el.querySelector('.v2cd'), bar = el.querySelector('.v2eta-bar i');
    if (bar) bar.style.width = Math.max(2, Math.min(100, (now - st) * 100 / Math.max(1, due - st))) + '%';
    if (rem <= 0) { el.classList.add('late'); var lt = L('Almost there, slightly late', 'সামান্য দেরি হচ্ছে, শিগগিরই পৌঁছাবে'); if (b && b.textContent !== lt) b.textContent = lt; return; }
    el.classList.remove('late');
    var h = Math.floor(rem / 3600), m = Math.floor(rem % 3600 / 60), s = rem % 60, p2 = function (x) { return (x < 10 ? '0' : '') + x; };
    var tm = h * 60 + m, t = tm ? L(tm + ' min ' + s + ' sec', nB(tm) + ' মিনিট ' + nB(s) + ' সেকেন্ড') : L(s + ' sec', nB(s) + ' সেকেন্ড');
    if (b && b.textContent !== t) b.textContent = t;
  });
}
setInterval(tick, 1000);
W.v2Tick = tick;
/* live countdown box for the order-placed screen and the tracking popup; e = the order's eta {start,mins,extra,due,now,delays} */
W.v2EtaBox = function (e, head) {
  if (!e || !e.due) return '';
  V2.skew = (+e.now || Date.now()) - Date.now();
  var m = (+e.mins || 0) + (+e.extra || 0);
  setTimeout(tick, 30); setTimeout(tick, 300);
  return (head && m ? '<p class="ad-sb2">' + L('Estimated delivery time: ' + m + ' minutes', 'আনুমানিক ডেলিভারি সময়: ' + nB(m) + ' মিনিট') + '</p>' : '') +
    '<div class="v2eta" data-due="' + e.due + '" data-st="' + e.start + '"><div class="v2eta-r"><small>' + L('Delivery in', 'ডেলিভারি হতে বাকি') + '</small><b class="v2cd">...</b></div><div class="v2eta-bar"><i></i></div>' + delayH(e) + '</div>';
};
function decorate() {
  var added = 0;
  document.querySelectorAll('#ordv .ord-c').forEach(function (c) {
    if (c.querySelector('.v2eta,.v2bo')) return;
    var em = c.querySelector('.ord-id em'); if (!em) return;
    var id = em.textContent.trim(), o = (ORD || []).filter(function (x) { return x.id == id; })[0]; if (!o || o.t != 'm') return;
    var h = etaH(o); if (!h) return;
    var hd = c.querySelector('.ord-ch'), d = document.createElement('div'); d.innerHTML = h;
    added++;
    while (d.firstChild) (hd && hd.nextSibling ? c.insertBefore(d.firstChild, hd.nextSibling) : c.appendChild(d.firstChild));
  });
  if (added) tick();
}
var _rol = renderOrdList;
renderOrdList = function () { var r = _rol.apply(this, arguments); try { decorate(); } catch (e) {} return r; };
var oMO = new MutationObserver(function (ms) { if (ms.every(function (m) { return m.target.closest && m.target.closest('.v2eta'); })) return; try { decorate(); } catch (e) {} });
var om = $('ordv'); if (om) oMO.observe(om, { childList: true, subtree: true });
setInterval(function () { if (!LIVE || !AU.uid || document.hidden || !B.classList.contains('vo')) return; if ((ORD || []).some(function (o) { return o.s == 'p'; })) liveOrders(); }, 20000);

/* ---------- 9. notifications from the server + Web Push ---------- */
function nType(n) {
  var t = String(n.title || '');
  if (n.kind == 'order') return /বাতিল|ফেরত/.test(t) ? 'order_cancelled' : /ডেলিভারি হয়েছে/.test(t) ? 'order_delivered' : /পথে|বিলম্ব|দেরি/.test(t) ? 'order_out' : /প্যাক/.test(t) ? 'order_processing' : 'order_confirmed';
  if (n.kind == 'wallet') return /ফেরত|reversed/i.test(t) ? 'acc_alert' : 'refund';
  if (n.kind == 'admin') return 'offer_campaign';
  return 'acc_alert';
}
function ntfLoad() {
  if (!LIVE || !AU.uid || !W.NBN) return;
  V2.ntfAt = Date.now();
  nbApi('GET', '/me/notifications').then(function (r) {
    var L2 = (r.notifications || []).slice().reverse(), D = NBN.data(), ch = false;
    L2.forEach(function (n) {
      var key = 'srv' + n.id, ex = D.items.filter(function (i) { return i.key == key; })[0];
      if (!ex) {
        var u = n.url || ''; try { var U = new URL(u, location.origin); if (U.origin === location.origin || /^\//.test(u)) u = U.pathname + U.search; } catch (e) {}
        ex = NBN.toUser(AU.uid, { type: nType(n), title: n.title, msg: n.body || '', img: n.img || '', url: u, key: key, sendAt: n.at, btn: u ? { en: 'Open', bn: 'দেখুন' } : '' });
        ch = true;
      }
      if (ex && n.read) NBN.readKey(key, AU.uid);
    });
    if (ch) NBN.refresh();
  }).catch(function () {});
}
setInterval(function () { if (!document.hidden && AU.uid && Date.now() - V2.ntfAt > 55000) ntfLoad(); }, 15000);
document.addEventListener('visibilitychange', function () { if (!document.hidden && AU.uid && Date.now() - V2.ntfAt > 20000) ntfLoad(); });
function srvRead(ids) { if (LIVE && AU.uid) nbApi('POST', '/me/notifications/read', ids ? { ids: ids } : {}).catch(function () {}); }
document.addEventListener('click', function (e) {
  if (!W.NBN) return;
  var host = e.target.closest('#ntfd,#notifv'); if (!host) return;
  var t = e.target.closest('[data-nt]');
  if (t && t.dataset.nt == 'all') { srvRead(null); return; }
  var it = e.target.closest('.nt-i'); if (!it) return;
  var n = NBN.data().items.filter(function (x) { return x.id == it.dataset.nid; })[0];
  if (!n || String(n.key || '').indexOf('srv') !== 0) return;
  var sid = +String(n.key).slice(3);
  if (t && t.dataset.nt == 'read') { srvRead([sid]); return; }
  if (t && t.dataset.nt != 'go') return;
  srvRead([sid]);
  if (n.url && n.url.charAt(0) == '/') {
    e.preventDefault(); e.stopImmediatePropagation();
    NBN.readKey(n.key); NBN.go('');
    route(n.url, false);
  }
}, true);
/* ask for push permission inside the notification list (only when logged in and not decided yet) */
function pushBar() {
  if (!W.NBPush || !NBPush.supported() || NBPush.permission() !== 'default' || !AU.uid || !LIVE) return '';
  try { if (+localStorage.getItem('nb_pushno') > Date.now()) return ''; } catch (e) {}
  return '<div class="v2pb"><svg viewBox="0 0 24 24"><path d="M6 8a6 6 0 1112 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 003.4 0"/></svg><span>' + L('Turn on notifications to get order updates and offers right away.', 'অর্ডারের আপডেট ও অফারের খবর সাথে সাথে পেতে নোটিফিকেশন চালু করুন।') + '</span><button type="button" data-v2p="on">' + L('Turn on', 'চালু করুন') + '</button><button type="button" class="x" data-v2p="no" aria-label="' + L('Not now', 'এখন না') + '">✕</button></div>';
}
function pushBars() {
  ['ntfd', 'notifv'].forEach(function (id) {
    var h = $(id); if (!h) return; var x = h.querySelector('.v2pb'), want = pushBar();
    if (!want) { if (x) x.remove(); return; }
    if (x) return;
    var tgt = id == 'ntfd' ? h.querySelector('.nt-l,.nt-list') || h.firstElementChild : h.firstElementChild;
    var d = document.createElement('div'); d.innerHTML = want;
    if (tgt && tgt.parentNode) tgt.parentNode.insertBefore(d.firstChild, tgt.nextSibling); else h.insertBefore(d.firstChild, h.firstChild);
  });
}
new MutationObserver(function () { clearTimeout(pushBars.t); pushBars.t = setTimeout(pushBars, 50); }).observe(B, { childList: true, subtree: false, attributes: true, attributeFilter: ['class'] });
['ntfd', 'notifv'].forEach(function (id) { var h = $(id); if (h) new MutationObserver(function () { clearTimeout(pushBars.t); pushBars.t = setTimeout(pushBars, 50); }).observe(h, { childList: true }); });
document.addEventListener('click', function (e) {
  var b = e.target.closest('[data-v2p]'); if (!b) return; e.preventDefault(); e.stopPropagation();
  if (b.dataset.v2p == 'no') { try { localStorage.setItem('nb_pushno', String(Date.now() + 7 * 864e5)); } catch (x) {} pushBars(); return; }
  NBPush.enable(NBAPI, TOKN).then(function (r) {
    msg(r == 'on' ? L('Notifications are on', 'নোটিফিকেশন চালু হয়েছে') : r == 'denied' ? L('Notifications are blocked in this browser', 'এই ব্রাউজারে নোটিফিকেশন বন্ধ করা আছে') : L('Could not turn on notifications', 'নোটিফিকেশন চালু করা যায়নি'));
    pushBars();
  });
}, true);
if (W.NBPush) NBPush.onClick(function (u) { ntfLoad(); route(u, false); });

/* ---------- 10. Home icon (admin) + favicon ---------- */
var HICO = { house: 'M12 3L2 12h3v8h6v-6h2v6h6v-8h3z', store: 'M4 4h16l1 5a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0zM5 12v8h14v-8h-2v6H7v-6z', bag: 'M6 7h12l1 14H5zM9 7a3 3 0 016 0v2h-2V7a1 1 0 00-2 0v2H9z',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z', cart: 'M3 3h3l2.5 11h10.5l2-8H7M9 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z', grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  leaf: 'M20 4C9 4 4 9 4 15c0 2 1 4 3 5 6 0 13-3 13-16z', heart: 'M12 21s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 6-8 11-8 11z' };
function homeIcon() {
  var a = document.querySelector('.bn a'); if (!a) return;
  var h = V2.set.homeIcon || { t: 'lib', v: 'house' }, sig = h.t + '|' + h.v; if (a.dataset.v2hi === sig) return;
  var old = a.querySelector('svg,img.v2hi'), el;
  if (h.t == 'img' && /^https?:\/\//.test(h.v)) { el = document.createElement('img'); el.className = 'v2hi'; el.alt = ''; el.src = h.v; el.onerror = function () { a.dataset.v2hi = ''; V2.set.homeIcon = { t: 'lib', v: 'house' }; homeIcon(); }; }
  else { var d = HICO[h.v] || HICO.house, t = document.createElement('div'); t.innerHTML = '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; el = t.firstChild; }
  if (old) old.replaceWith(el); else a.insertBefore(el, a.firstChild);
  a.dataset.v2hi = sig;
}
function hs8(s) { var h = 0; s = String(s); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h.toString(36); }
function favicon(S) {
  var f = S && S.favicon; if (!f) return;
  var u = f + (f.indexOf('?') < 0 ? '?' : '&') + 'v=' + hs8(f);
  [['icon', ''], ['shortcut icon', ''], ['apple-touch-icon', '180x180']].forEach(function (x) {
    var l = document.querySelector('link[rel="' + x[0] + '"]');
    if (!l) { l = document.createElement('link'); l.rel = x[0]; if (x[1]) l.sizes = x[1]; document.head.appendChild(l); }
    if (l.getAttribute('href') !== u) l.href = u;
  });
}

/* ---------- 11. crop editor for profile photo / cover ---------- */
if (W.NBCrop) NBCrop.auto(function (inp) {
  if (inp.id == 'pfile') return { preset: 'profile', lang: lang };
  if (inp.id == 'pcfile') return { preset: 'cover', lang: lang };
  return false;
});

/* ---------- start ---------- */
try { V.min.strip = stripTxt(); var st0 = $('strip'); if (st0 && !st0._bs) st0.textContent = V.min.strip; } catch (e) {}
try { if (!LIVE) { V2.booted = false; } homeIcon(); } catch (e) {}
})();

/*NBV2:END*/
/*NBGM:BEGIN*/
/* NurBuy Google Maps module (shared by customer, seller, rider and admin sites).
 * Source of truth: shared/nb-gmap.js. Every site inlines a copy (run shared/sync-gmap.sh).
 *
 *   NBMap.ready()                 -> Promise<google>  (the global `google` object, libraries loaded)  (rejects with Error('nokey'|'load'|'auth') when the map cannot be used)
 *   NBMap.picker(box, opts)       -> controller; map + search + pin + "my location" inside `box`
 *   NBMap.viewer(box, opts)       -> controller; read-only map with markers (rider / admin)
 *   NBMap.locate(opts)            -> Promise<{lat,lng,acc}>  (browser geolocation)
 *   NBMap.watch(cb, errCb)        -> stop() ; live position updates
 *   NBMap.geocode(lat,lng,lang)   -> Promise<geo>  ; reverse geocode into {full,area,city,post,postcode,landmark,district,country}
 *   NBMap.inService(lat,lng)      -> true for Bangladesh or the UAE
 *   NBMap.zoneEditor(box, opts)   -> admin: draw / edit / test delivery zones (polygons) on the map
 *   NBMap.zoneAt(zones, lat, lng) -> the zone (smallest wins) that contains a pin; same rule as the server
 *   NBMap.polyProblem(poly)       -> null | 'few' | 'crossing' | 'small' | 'many' | 'outside'
 *   picker opts.zones / ctl.setZones(list) draw read-only zone outlines on the customer's picker
 *
 * The API key is never stored in a page: it is fetched from GET <NB_API>/public/maps (the server keeps it in .env).
 */
(function (W) {
  'use strict';
  if (W.NBMap) return;
  var D = document, GM = null, P = null, CFG = null;

  // pages whose language lives in a closure (seller, rider, admin) set NBMap.getLang = function () { return 'en' | 'bn'; }
  function lang() { try { if (W.NBMap && W.NBMap.getLang) return W.NBMap.getLang() === 'en' ? 'en' : 'bn'; return (W.lang === 'en' || W.S && W.S.lang === 'en') ? 'en' : 'bn'; } catch (e) { return 'bn'; } }
  function T(en, bn) { return lang() === 'en' ? en : bn; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function api() { return String(W.NB_API || '').replace(/\/+$/, ''); }

  function inService(lat, lng) {
    lat = +lat; lng = +lng;
    return (lat >= 20.3 && lat <= 26.8 && lng >= 87.9 && lng <= 92.8) || (lat >= 22.4 && lat <= 26.3 && lng >= 51.0 && lng <= 56.6);
  }

  /* ---------- loader ---------- */
  function loadConfig() {
    if (CFG) return CFG;
    CFG = fetch(api() + (W.NB_API_PRETTY === false ? '/index.php' : '') + '/public/maps').then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.key) throw new Error('nokey');
      return j;
    });
    CFG.catch(function () { CFG = null; });
    return CFG;
  }
  function ready() {
    if (GM) return Promise.resolve(GM);
    if (P) return P;
    P = loadConfig().then(function (c) {
      return new Promise(function (res, rej) {
        W.gm_authFailure = function () { P = null; GM = null; rej(new Error('auth')); try { D.dispatchEvent(new CustomEvent('nbmap-auth')); } catch (e) {} };
        W.__nbGmCb = function () {
          var g = W.google && W.google.maps;
          if (!g || !g.importLibrary) { P = null; return rej(new Error('load')); }
          Promise.all([g.importLibrary('maps'), g.importLibrary('places'), g.importLibrary('geocoding'), g.importLibrary('core')]).then(function () { GM = W.google; res(GM); }, function () { P = null; rej(new Error('load')); });
        };
        var s = D.createElement('script');
        s.async = true; s.defer = true;
        s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(c.key) + '&v=weekly&loading=async&libraries=places,geocoding&language=' + lang() + '&region=BD&callback=__nbGmCb';
        s.onerror = function () { P = null; rej(new Error('load')); };
        D.head.appendChild(s);
      });
    });
    P.catch(function () { P = null; });
    return P;
  }

  /* ---------- styles (own namespace nbm-) ---------- */
  function css() {
    if (D.getElementById('nbm-css')) return;
    var st = D.createElement('style'); st.id = 'nbm-css';
    st.textContent =
      '.nbm{position:relative;width:100%;height:100%;min-height:260px;background:#e9edf5;border-radius:inherit;overflow:hidden;font-family:inherit}' +
      '.nbm-map{position:absolute;inset:0}' +
      '.nbm-top{position:absolute;left:10px;right:10px;top:10px;z-index:3}' +
      '.nbm-in{display:flex;align-items:center;gap:8px;background:#fff;border-radius:12px;padding:0 12px;height:46px;box-shadow:0 2px 10px rgba(21,26,45,.18)}' +
      '.nbm-in svg{flex:none;width:20px;height:20px;stroke:#6b7390;fill:none;stroke-width:2;stroke-linecap:round}' +
      '.nbm-in input{flex:1;min-width:0;border:0;outline:0;background:transparent;font:inherit;font-size:15px;color:#151a2d;height:100%}' +
      '.nbm-in button{border:0;background:transparent;color:#6b7390;font-size:22px;line-height:1;cursor:pointer;padding:4px}' +
      '.nbm-sg{margin-top:6px;background:#fff;border-radius:12px;box-shadow:0 6px 18px rgba(21,26,45,.22);overflow:hidden;display:none;max-height:260px;overflow-y:auto}' +
      '.nbm-sg.o{display:block}' +
      '.nbm-sg button{display:flex;gap:10px;align-items:flex-start;width:100%;text-align:left;border:0;background:#fff;padding:10px 12px;cursor:pointer;font:inherit;color:#151a2d;border-bottom:1px solid #eef0f6}' +
      '.nbm-sg button:last-child{border-bottom:0}' +
      '.nbm-sg button:hover,.nbm-sg button.f{background:#f1f4fa}' +
      '.nbm-sg svg{flex:none;width:18px;height:18px;margin-top:2px;stroke:#1d2fe0;fill:none;stroke-width:2}' +
      '.nbm-sg b{display:block;font-weight:600;font-size:14px}' +
      '.nbm-sg small{display:block;color:#6b7390;font-size:12.5px}' +
      '.nbm-sg .nbm-em{padding:12px;color:#6b7390;font-size:13.5px}' +
      '.nbm-me{position:absolute;right:10px;bottom:22px;z-index:3;display:flex;align-items:center;gap:8px;border:0;background:#fff;color:#1d2fe0;height:44px;padding:0 14px;border-radius:22px;box-shadow:0 2px 10px rgba(21,26,45,.25);font:inherit;font-size:14px;cursor:pointer}' +
      '.nbm-me svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round}' +
      '.nbm-me[disabled]{opacity:.6}' +
      '.nbm-hint{position:absolute;left:10px;bottom:22px;z-index:3;max-width:calc(100% - 190px);background:rgba(21,26,45,.82);color:#fff;border-radius:10px;padding:7px 10px;font-size:12.5px;line-height:1.35}' +
      '.nbm-err{position:absolute;inset:0;z-index:4;display:flex;align-items:center;justify-content:center;padding:18px;text-align:center;color:#151a2d;background:#f1f4fa;font-size:14px;line-height:1.5}' +
      '.nbm-cp{position:absolute;left:50%;top:50%;width:34px;height:44px;margin:-44px 0 0 -17px;z-index:4;pointer-events:none;transition:transform .15s}.nbm-cp img{width:34px;height:44px;display:block}.nbm-cp i{position:absolute;left:11px;bottom:-3px;width:12px;height:5px;border-radius:50%;background:rgba(0,0,0,.28);z-index:-1}.nbm-cp.up{transform:translateY(-8px)}' +
      '.nbm-spin{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:2}' +
      '.nbm-spin i{width:30px;height:30px;border-radius:50%;border:3px solid #cfd6ea;border-top-color:#1d2fe0;animation:nbmr .8s linear infinite}' +
      'html[lang=bn] .nbm b,html[lang=bn] .nbm-sg b{font-weight:400!important}' + // site rule: Bengali text is never bold
      '@keyframes nbmr{to{transform:rotate(360deg)}}';
    D.head.appendChild(st);
  }
  var IC = {
    search: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"/><path d="M15.5 15.5L21 21"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 22s7-6.5 7-12a7 7 0 00-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    me: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="8"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/></svg>'
  };

  /* ---------- marker icons (inline SVG data URLs: no image files, no emoji) ---------- */
  function svgIcon(fill, inner) {
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 36 48"><path d="M18 1C9 1 2 8 2 17c0 12 16 29 16 29s16-17 16-29C34 8 27 1 18 1z" fill="' + fill + '" stroke="#fff" stroke-width="2"/>' + (inner || '<circle cx="18" cy="17" r="6" fill="#fff"/>') + '</svg>';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(s);
  }
  var KIND = {
    pick: { fill: '#ff6a00', inner: '<path d="M10 14h16l-1.6 9H11.6z M13 14l1-4h8l1 4" fill="#fff"/>' },
    drop: { fill: '#1d2fe0', inner: '<path d="M18 9l7 6v8h-4.500v-5h-5v5H11v-8z" fill="#fff"/>' },
    live: { fill: '#16a34a', inner: '<circle cx="18" cy="17" r="6" fill="#fff"/><circle cx="18" cy="17" r="3" fill="#16a34a"/>' },
    pin: { fill: '#e5254b' }
  };
  function mk(g, map, p, kind) {
    var k = KIND[kind] || KIND.pin;
    return new g.maps.Marker({ map: map, position: { lat: +p.lat, lng: +p.lng }, title: p.label || '', icon: { url: svgIcon(k.fill, k.inner), scaledSize: new g.maps.Size(34, 44), anchor: new g.maps.Point(17, 44) }, draggable: !!p.draggable, optimized: false });
  }

  /* ---------- geocoding ---------- */
  function comp(list, types) {
    for (var i = 0; i < types.length; i++) for (var j = 0; j < list.length; j++) if (list[j].types.indexOf(types[i]) > -1) return list[j];
    return null;
  }
  function parse(result, lat, lng) {
    var c = result.address_components || [], g = { lat: +(+lat).toFixed(7), lng: +(+lng).toFixed(7), full: result.formatted_address || '' };
    var a = comp(c, ['sublocality_level_1', 'sublocality', 'neighborhood', 'administrative_area_level_4', 'administrative_area_level_3']);
    var city = comp(c, ['locality', 'administrative_area_level_2', 'postal_town']);
    var dist = comp(c, ['administrative_area_level_2', 'administrative_area_level_1']);
    var pc = comp(c, ['postal_code']), po = comp(c, ['postal_town', 'sublocality_level_2']);
    var lm = comp(c, ['point_of_interest', 'premise', 'establishment', 'subpremise']);
    var ct = comp(c, ['country']);
    var th = comp(c, ['administrative_area_level_3', 'sublocality_level_1']);
    if (th) g.thana = th.long_name;
    if (a) g.area = a.long_name;
    if (city) g.city = city.long_name;
    if (dist) g.district = dist.long_name;
    if (po) g.post = po.long_name;
    if (pc) g.postcode = pc.long_name;
    if (lm) g.landmark = lm.long_name;
    if (ct) g.country = ct.short_name;
    if (!g.post && g.area) g.post = g.area; // Bangladesh post offices are usually named after the area
    return g;
  }
  function geocode(lat, lng, lg) {
    return ready().then(function (g) {
      return new g.maps.Geocoder().geocode({ location: { lat: +lat, lng: +lng }, language: lg || lang() });
    }).then(function (r) {
      var res = (r && r.results) || [];
      if (!res.length) return { lat: +lat, lng: +lng, full: '' };
      // prefer a street-level result for the readable address, but read components from the most detailed one
      var best = res[0], g0 = parse(best, lat, lng);
      for (var i = 1; i < res.length && i < 6; i++) { var x = parse(res[i], lat, lng); ['area', 'city', 'district', 'thana', 'post', 'postcode', 'landmark', 'country'].forEach(function (k) { if (!g0[k] && x[k]) g0[k] = x[k]; }); }
      return g0;
    }, function () { return { lat: +lat, lng: +lng, full: '' }; });
  }

  /* ---------- geolocation ---------- */
  function locate(o) {
    o = o || {};
    return new Promise(function (res, rej) {
      if (!navigator.geolocation) return rej(new Error('unsupported'));
      navigator.geolocation.getCurrentPosition(function (p) { res({ lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy || 0) }); },
        function (e) { rej(new Error(e && e.code === 1 ? 'denied' : 'failed')); }, { enableHighAccuracy: o.high !== false, timeout: o.timeout || 15000, maximumAge: o.maxAge || 0 });
    });
  }
  function watch(cb, errCb) {
    if (!navigator.geolocation) { if (errCb) errCb(new Error('unsupported')); return function () {}; }
    var id = navigator.geolocation.watchPosition(function (p) { cb({ lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy || 0) }); },
      function (e) { if (errCb) errCb(new Error(e && e.code === 1 ? 'denied' : 'failed')); }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
    return function () { try { navigator.geolocation.clearWatch(id); } catch (e) {} };
  }

  function failMsg(e) {
    var m = e && e.message;
    if (m === 'nokey') return T('The map is not set up yet (Google Maps key is missing on the server).', 'ম্যাপ এখনো চালু করা হয়নি (সার্ভারে Google Maps কী বসানো নেই)।');
    if (m === 'auth') return T('Google rejected the map key. Check the key restrictions in Google Cloud.', 'Google ম্যাপের কী গ্রহণ করেনি। Google Cloud-এ কী-এর সীমাবদ্ধতা দেখুন।');
    return T('The map could not load. Check your internet and try again.', 'ম্যাপ লোড হয়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।');
  }
  function locMsg(e) {
    var m = e && e.message;
    if (m === 'denied') return T('Location permission was denied. Allow location in your browser, or search / move the pin.', 'লোকেশনের অনুমতি দেওয়া হয়নি। ব্রাউজারে অনুমতি দিন, অথবা ঠিকানা খুঁজুন / পিন সরান।');
    if (m === 'unsupported') return T('Your browser cannot share location.', 'আপনার ব্রাউজার লোকেশন দিতে পারে না।');
    return T('Could not get your location. Search or move the pin instead.', 'লোকেশন পাওয়া যায়নি। ঠিকানা খুঁজুন বা পিন সরান।');
  }

  function center0(c, o) {
    if (o && o.lat != null && o.lng != null) return { lat: +o.lat, lng: +o.lng, zoom: o.zoom || 17, set: true };
    var list = (c && c.centers) || [{ lat: 23.8103, lng: 90.4125, zoom: 13 }];
    var pick = o && o.center ? list.filter(function (x) { return x.id === o.center; })[0] : null;
    pick = pick || list[0];
    return { lat: pick.lat, lng: pick.lng, zoom: pick.zoom || 13, set: false };
  }

  /* ---------- picker ---------- */
  function picker(box, o) {
    o = o || {};
    css();
    box.innerHTML = '';
    var root = D.createElement('div'); root.className = 'nbm'; box.appendChild(root);
    var mapEl = D.createElement('div'); mapEl.className = 'nbm-map'; root.appendChild(mapEl);
    root.insertAdjacentHTML('beforeend', '<div class="nbm-spin"><i></i></div>');
    var ctl = { map: null, marker: null, geo: null, dead: false, token: null, sgn: 0 }, cfgP = loadConfig();
    // delivery zones drawn on the map (read-only), so the customer can see where we deliver
    ctl.zones = o.zones || []; ctl.zoneShapes = [];
    function drawZones() {
      if (!ctl.map || !GM) return;
      ctl.zoneShapes.forEach(function (x) { x.setMap(null); }); ctl.zoneShapes = [];
      (ctl.zones || []).forEach(function (z) {
        if (!z.poly || z.poly.length < 3) return;
        ctl.zoneShapes.push(new GM.maps.Polygon({ map: ctl.map, paths: z.poly.map(function (p) { return { lat: +p[0], lng: +p[1] }; }), strokeColor: z.color || '#1d2fe0', strokeOpacity: 0.85, strokeWeight: 2, fillColor: z.color || '#1d2fe0', fillOpacity: 0.09, clickable: false, zIndex: 1 }));
      });
    }
    ctl.setZones = function (list) { ctl.zones = list || []; drawZones(); };
    ctl.zoneAt = function (lat, lng) { return zoneAt(ctl.zones, lat, lng); };
    ctl.fitZones = function () {
      if (!ctl.map || !GM || !ctl.zones.length) return;
      var b = new GM.maps.LatLngBounds(); ctl.zones.forEach(function (z) { (z.poly || []).forEach(function (p) { b.extend({ lat: +p[0], lng: +p[1] }); }); });
      if (!b.isEmpty()) ctl.map.fitBounds(b, 40);
    };

    function bye(e) { var s = root.querySelector('.nbm-spin'); if (s) s.remove(); root.insertAdjacentHTML('beforeend', '<div class="nbm-err"><div>' + esc(failMsg(e)) + '</div></div>'); if (o.onFail) o.onFail(e); }

    Promise.all([ready(), cfgP]).then(function (a) {
      if (ctl.dead) return;
      var g = a[0], c = a[1], c0 = center0(c, o), sp = root.querySelector('.nbm-spin'); if (sp) sp.remove();
      var map = ctl.map = new g.maps.Map(mapEl, { center: { lat: c0.lat, lng: c0.lng }, zoom: c0.zoom, mapTypeControl: false, streetViewControl: false, fullscreenControl: false, clickableIcons: false, gestureHandling: 'greedy', zoomControl: true, mapId: c.map_id || undefined });
      drawZones();
      root.insertAdjacentHTML('beforeend',
        '<div class="nbm-top"><div class="nbm-in">' + IC.search + '<input type="text" autocomplete="off" spellcheck="false" aria-label="' + esc(T('Search address', 'ঠিকানা খুঁজুন')) + '" placeholder="' + esc(o.placeholder || T('Search your address, building or area', 'আপনার ঠিকানা, ভবন বা এলাকা খুঁজুন')) + '"><button type="button" class="nbm-x" aria-label="Clear" style="display:none">&times;</button></div><div class="nbm-sg" role="listbox"></div></div>' +
        '<button type="button" class="nbm-me">' + IC.me + '<span>' + esc(o.meText || T('My current location', 'আমার বর্তমান অবস্থান')) + '</span></button>' +
        '<div class="nbm-hint">' + esc(o.hint || T('Move the map so the pin is on your exact spot', 'ম্যাপ সরিয়ে পিনটি ঠিক জায়গায় বসান')) + '</div>');
      var inp = root.querySelector('input'), sg = root.querySelector('.nbm-sg'), xb = root.querySelector('.nbm-x'), me = root.querySelector('.nbm-me'), hint = root.querySelector('.nbm-hint');
      var countries = c.countries && c.countries.length ? c.countries : ['bd', 'ae'];

      function setHint(t) { hint.textContent = t; hint.style.display = t ? '' : 'none'; }
      function place(lat, lng, opt) {
        opt = opt || {};
        if (!inService(lat, lng)) { setHint(T('This place is outside our delivery countries (Bangladesh, UAE).', 'এই জায়গা আমাদের ডেলিভারি দেশের বাইরে (বাংলাদেশ, আরব আমিরাত)।')); if (o.onOutside) o.onOutside(lat, lng); return; }
        var pos = { lat: +lat, lng: +lng };
        // the pin stays fixed in the middle of the map; the map moves under it
        if (opt.pan !== false) { ctl.mv = false; map.panTo(pos); if (map.getZoom() < 17) map.setZoom(opt.zoom || 17); }
        resolve(lat, lng, opt);
      }
      var seq = 0;
      function resolve(lat, lng, opt) {
        var my = ++seq;
        ctl.geo = { lat: +(+lat).toFixed(7), lng: +(+lng).toFixed(7), full: (opt && opt.full) || '' };
        if (opt && opt.acc != null) ctl.geo.acc = opt.acc;
        if (opt && opt.place_id) ctl.geo.place_id = opt.place_id;
        setHint(T('Finding the address...', 'ঠিকানা খোঁজা হচ্ছে...'));
        if (o.onMove) o.onMove(ctl.geo);
        geocode(lat, lng).then(function (d) {
          if (my !== seq || ctl.dead) return;
          if (opt && opt.name && !d.landmark && opt.src === 'search') d.landmark = opt.name;
          var geo = ctl.geo; Object.keys(d).forEach(function (k) { if (d[k] !== '' && d[k] != null && k !== 'lat' && k !== 'lng') geo[k] = d[k]; });
          if (opt && opt.full && !d.full) geo.full = opt.full;
          setHint(geo.full ? '' : T('Address not found here. You can type it yourself.', 'এখানে ঠিকানা পাওয়া যায়নি। নিজে লিখে দিতে পারেন।'));
          if (o.onChange) o.onChange(geo, opt || {});
        });
      }
      ctl.setPos = function (lat, lng, opt) { place(lat, lng, opt || {}); };

      // fixed centre pin: whatever is under the pin when the map stops moving is the chosen place
      root.insertAdjacentHTML('beforeend', '<div class="nbm-cp" aria-hidden="true"><img alt="" src="' + svgIcon((KIND.pin || {}).fill, (KIND.pin || {}).inner) + '"><i></i></div>');
      var cpEl = root.querySelector('.nbm-cp');
      map.addListener('dragstart', function () { ctl.mv = true; if (cpEl) cpEl.classList.add('up'); });
      map.addListener('idle', function () {
        if (cpEl) cpEl.classList.remove('up');
        if (!ctl.mv || ctl.dead) return; ctl.mv = false;
        var c1 = map.getCenter(); if (!c1) return;
        if (!inService(c1.lat(), c1.lng())) { setHint(T('This place is outside our delivery countries (Bangladesh, UAE).', 'এই জায়গা আমাদের ডেলিভারি দেশের বাইরে (বাংলাদেশ, UAE)।')); return; }
        resolve(c1.lat(), c1.lng(), { src: 'drag' });
      });
      map.addListener('click', function (e) { ctl.mv = true; map.panTo(e.latLng); });

      /* autocomplete (Places API New) */
      var timer = 0, last = '';
      function sgEmpty(t) { sg.innerHTML = '<div class="nbm-em">' + esc(t) + '</div>'; sg.classList.add('o'); }
      function sgClose() { sg.classList.remove('o'); sg.innerHTML = ''; }
      function suggest(q) {
        var P2 = g.maps.places;
        if (!ctl.token) ctl.token = new P2.AutocompleteSessionToken();
        var b = map.getCenter();
        var req = { input: q, sessionToken: ctl.token, includedRegionCodes: countries, language: lang(), region: 'bd', locationBias: { center: { lat: b.lat(), lng: b.lng() }, radius: 40000 } };
        P2.AutocompleteSuggestion.fetchAutocompleteSuggestions(req).then(function (r) {
          if (q !== inp.value.trim()) return;
          var list = (r.suggestions || []).filter(function (s) { return s.placePrediction; }).slice(0, 6);
          if (!list.length) return sgEmpty(T('No result found', 'কোনো ফলাফল পাওয়া যায়নি'));
          sg.innerHTML = '';
          list.forEach(function (s) {
            var pp = s.placePrediction, b2 = D.createElement('button'); b2.type = 'button';
            var main = pp.mainText ? pp.mainText.text : pp.text.text, sec = pp.secondaryText ? pp.secondaryText.text : '';
            b2.innerHTML = IC.pin + '<span><b>' + esc(main) + '</b><small>' + esc(sec) + '</small></span>';
            b2.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
            b2.addEventListener('click', function () { choose(pp, main); });
            sg.appendChild(b2);
          });
          sg.classList.add('o');
        }, function () { sgEmpty(T('Search is not available right now', 'এখন সার্চ করা যাচ্ছে না')); });
      }
      function choose(pp, main) {
        sgClose(); inp.value = pp.text ? pp.text.text : main; xb.style.display = '';
        var place0 = pp.toPlace();
        place0.fetchFields({ fields: ['location', 'formattedAddress', 'displayName', 'id'] }).then(function () {
          ctl.token = null; // a session ends when a place is picked
          var l = place0.location; if (!l) return;
          place(l.lat(), l.lng(), { src: 'search', full: place0.formattedAddress || '', name: place0.displayName || main, place_id: place0.id });
        }, function () { setHint(T('Could not open this place. Try another.', 'এই জায়গা খোলা যায়নি। অন্যটি চেষ্টা করুন।')); });
      }
      inp.addEventListener('input', function () {
        var q = inp.value.trim(); xb.style.display = q ? '' : 'none'; clearTimeout(timer);
        if (q.length < 2) { sgClose(); return; }
        timer = setTimeout(function () { if (q !== last) last = q; suggest(q); }, 260);
      });
      inp.addEventListener('focus', function () { if (inp.value.trim().length >= 2 && !sg.classList.contains('o')) suggest(inp.value.trim()); });
      inp.addEventListener('blur', function () { setTimeout(sgClose, 180); });
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { sgClose(); inp.blur(); }
        if (e.key === 'Enter') { e.preventDefault(); var f = sg.querySelector('button'); if (f) f.click(); }
      });
      xb.addEventListener('click', function () { inp.value = ''; xb.style.display = 'none'; sgClose(); inp.focus(); });

      /* current location */
      ctl.locate = function () {
        me.disabled = true; ctl.locating = true; setHint(T('Getting your location...', 'আপনার লোকেশন নেওয়া হচ্ছে...'));
        return locate().then(function (p) {
          me.disabled = false; ctl.locating = false;
          if (!inService(p.lat, p.lng)) { setHint(T('Your location is outside our delivery countries (Bangladesh, UAE).', 'আপনার লোকেশন আমাদের ডেলিভারি দেশের বাইরে (বাংলাদেশ, আরব আমিরাত)।')); return null; }
          place(p.lat, p.lng, { src: 'gps', acc: p.acc, zoom: 18 }); return p;
        }, function (e) { me.disabled = false; ctl.locating = false; setHint(locMsg(e)); if (o.onError) o.onError(e); return null; });
      };
      me.addEventListener('click', function () { ctl.locate(); });

      if (c0.set) place(c0.lat, c0.lng, { src: 'init', pan: false, noEmit: true });
      else if (o.autoLocate) ctl.locate();
      if (o.onReady) o.onReady(ctl);
      // nothing chosen yet: after the map settles, take the spot under the fixed pin so the address boxes fill at once
      setTimeout(function () { if (ctl.dead || ctl.geo || ctl.locating) return; var c1 = map.getCenter(); if (c1 && inService(c1.lat(), c1.lng())) resolve(c1.lat(), c1.lng(), { src: 'init' }); }, 1300);
      setTimeout(function () { try { g.maps.event.trigger(map, 'resize'); } catch (e) {} }, 250);
    }, function (e) { if (!ctl.dead) bye(e); }).catch(function (e) { if (!ctl.dead) bye(e); });

    ctl.destroy = function () { ctl.dead = true; box.innerHTML = ''; };
    ctl.resize = function () { if (ctl.map && GM) GM.maps.event.trigger(ctl.map, 'resize'); };
    return ctl;
  }

  /* ---------- viewer (rider / admin) ---------- */
  function viewer(box, o) {
    o = o || {};
    css();
    box.innerHTML = '';
    var root = D.createElement('div'); root.className = 'nbm'; box.appendChild(root);
    var mapEl = D.createElement('div'); mapEl.className = 'nbm-map'; root.appendChild(mapEl);
    root.insertAdjacentHTML('beforeend', '<div class="nbm-spin"><i></i></div>');
    var ctl = { map: null, ms: {}, dead: false, pending: o.points || [] };

    function draw(points, fit) {
      var g = GM; if (!g || !ctl.map) { ctl.pending = points; return; }
      var seen = {}, b = new g.maps.LatLngBounds(), n = 0;
      (points || []).forEach(function (p) {
        if (p == null || p.lat == null || p.lng == null) return;
        var id = p.id || (p.kind + n); seen[id] = 1; n++;
        var pos = { lat: +p.lat, lng: +p.lng };
        if (ctl.ms[id]) { ctl.ms[id].setPosition(pos); ctl.ms[id].setTitle(p.label || ''); }
        else {
          var m = ctl.ms[id] = mk(g, ctl.map, p, p.kind);
          if (p.onClick) m.addListener('click', p.onClick);
        }
        b.extend(pos);
      });
      Object.keys(ctl.ms).forEach(function (k) { if (!seen[k]) { ctl.ms[k].setMap(null); delete ctl.ms[k]; } });
      if (fit !== false && n) { if (n === 1) { ctl.map.setCenter(b.getCenter()); ctl.map.setZoom(16); } else ctl.map.fitBounds(b, 48); }
    }
    ready().then(function (g) {
      if (ctl.dead) return;
      var s = root.querySelector('.nbm-spin'); if (s) s.remove();
      ctl.map = new g.maps.Map(mapEl, { center: { lat: 23.8103, lng: 90.4125 }, zoom: 12, mapTypeControl: false, streetViewControl: false, fullscreenControl: false, clickableIcons: false, gestureHandling: 'cooperative' });
      draw(ctl.pending, true);
      if (o.onReady) o.onReady(ctl);
    }).catch(function (e) { var s = root.querySelector('.nbm-spin'); if (s) s.remove(); root.insertAdjacentHTML('beforeend', '<div class="nbm-err"><div>' + esc(failMsg(e)) + '</div></div>'); if (o.onFail) o.onFail(e); });
    ctl.update = function (points, fit) { draw(points, fit); };
    ctl.destroy = function () { ctl.dead = true; box.innerHTML = ''; };
    return ctl;
  }

  /* ---------- delivery zone geometry (mirrors the server: backend/api/lib/handlers_zones.php) ---------- */
  function zxy(lat, lng, lat0, lng0) { return [(lng - lng0) * 111320 * Math.cos(lat0 * Math.PI / 180), (lat - lat0) * 110574]; }
  function zoneArea(poly) {
    var n = poly.length, la = 0, ln = 0, i;
    if (n < 3) return 0;
    for (i = 0; i < n; i++) { la += +poly[i][0]; ln += +poly[i][1]; }
    la /= n; ln /= n;
    var s = 0, prev = zxy(+poly[n - 1][0], +poly[n - 1][1], la, ln);
    for (i = 0; i < n; i++) { var c = zxy(+poly[i][0], +poly[i][1], la, ln); s += prev[0] * c[1] - c[0] * prev[1]; prev = c; }
    return Math.abs(s) / 2 / 1e6; // km2
  }
  function zoneContains(poly, lat, lng) {
    var n = poly.length; if (n < 3) return false;
    var pts = poly.map(function (p) { return zxy(+p[0], +p[1], lat, lng); }), inside = false, i, j;
    for (i = 0, j = n - 1; i < n; j = i++) {
      var a = pts[i], b = pts[j], dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
      var t = l2 > 0 ? Math.max(0, Math.min(1, -(a[0] * dx + a[1] * dy) / l2)) : 0, qx = a[0] + t * dx, qy = a[1] + t * dy;
      if (qx * qx + qy * qy <= 64) return true; // within 8 m of the edge
      if ((a[1] > 0) !== (b[1] > 0)) { var xAt = a[0] + (0 - a[1]) * (b[0] - a[0]) / (b[1] - a[1]); if (xAt > 0) inside = !inside; }
    }
    return inside;
  }
  /** The zone that serves a pin; with overlapping zones the smallest one wins. zones = [{id, poly:[[lat,lng]...]}] */
  function zoneAt(zones, lat, lng) {
    var best = null, ba = 0;
    (zones || []).forEach(function (z) {
      if (!z.poly || !zoneContains(z.poly, +lat, +lng)) return;
      var a = zoneArea(z.poly);
      if (!best || a < ba || (a === ba && z.id < best.id)) { best = z; ba = a; }
    });
    return best;
  }
  function orient(a, b, c) { var v = (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1]); return v > 1e-12 ? 1 : (v < -1e-12 ? -1 : 0); }
  function segCross(p1, p2, p3, p4) {
    var o1 = orient(p1, p2, p3), o2 = orient(p1, p2, p4), o3 = orient(p3, p4, p1), o4 = orient(p3, p4, p2);
    return o1 !== 0 && o2 !== 0 && o3 !== 0 && o4 !== 0 && o1 !== o2 && o3 !== o4;
  }
  /** null when the outline is fine, else 'few' | 'crossing' | 'small' | 'many' | 'outside' */
  function polyProblem(poly, max) {
    var n = poly.length, i, j;
    if (n < 3) return 'few';
    if (n > (max || 300)) return 'many';
    for (i = 0; i < n; i++) if (!inService(poly[i][0], poly[i][1])) return 'outside';
    var xy = poly.map(function (p) { return zxy(+p[0], +p[1], +poly[0][0], +poly[0][1]); });
    for (i = 0; i < n; i++) for (j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      if (segCross(xy[i], xy[(i + 1) % n], xy[j], xy[(j + 1) % n])) return 'crossing';
    }
    if (zoneArea(poly) < 0.0001) return 'small';
    return null;
  }

  /* ---------- zone editor (admin): draw, edit and test delivery zones on the map ---------- */
  function zoneEditor(box, o) {
    o = o || {};
    css();
    box.innerHTML = '';
    var root = D.createElement('div'); root.className = 'nbm'; box.appendChild(root);
    var mapEl = D.createElement('div'); mapEl.className = 'nbm-map'; root.appendChild(mapEl);
    root.insertAdjacentHTML('beforeend', '<div class="nbm-spin"><i></i></div>');
    var ctl = { map: null, dead: false, mode: 'view', zones: o.zones || [], sel: null, shapes: {}, labels: {}, draft: [], draftShape: null, draftDots: [], testMark: null }, GMr = null;

    function path(poly) { return poly.map(function (p) { return { lat: +p[0], lng: +p[1] }; }); }
    function readPath(shape) { var out = []; shape.getPath().forEach(function (ll) { out.push([+ll.lat().toFixed(6), +ll.lng().toFixed(6)]); }); return out; }
    function clearShapes() {
      Object.keys(ctl.shapes).forEach(function (k) { ctl.shapes[k].setMap(null); }); ctl.shapes = {};
      Object.keys(ctl.labels).forEach(function (k) { ctl.labels[k].setMap(null); }); ctl.labels = {};
    }
    function centroid(poly) { var a = 0, b = 0; poly.forEach(function (p) { a += +p[0]; b += +p[1]; }); return { lat: a / poly.length, lng: b / poly.length }; }
    function style(z, selected, bad) {
      var col = bad ? '#e11d48' : (z.color || '#4a52c8'), off = z.active === false;
      return { strokeColor: col, strokeOpacity: off ? 0.5 : 0.95, strokeWeight: selected ? 3 : 2, fillColor: col, fillOpacity: selected ? 0.2 : (off ? 0.04 : 0.12), zIndex: selected ? 5 : 2, clickable: ctl.mode !== 'draw' };
    }
    function emitEdit(z, shape) {
      var poly = readPath(shape), bad = polyProblem(poly, o.maxPoints);
      shape.setOptions(style(z, true, !!bad));
      if (o.onEdit) o.onEdit(z.id, poly, bad);
    }
    function build() {
      if (!ctl.map || !GMr) return;
      clearShapes();
      var b = new GMr.maps.LatLngBounds(), any = false;
      ctl.zones.forEach(function (z) {
        if (!z.poly || z.poly.length < 3) return;
        var sel = ctl.sel === z.id;
        var sh = new GMr.maps.Polygon(Object.assign({ map: ctl.map, paths: path(z.poly), editable: sel && ctl.mode !== 'draw' }, style(z, sel, false)));
        ctl.shapes[z.id] = sh;
        sh.addListener('click', function (e) { if (ctl.mode === 'test') return testAt(e.latLng); if (ctl.mode === 'view' && o.onSelect) o.onSelect(z.id); });
        if (sel) {
          var p = sh.getPath(), fire = function () { emitEdit(z, sh); };
          p.addListener('set_at', fire); p.addListener('insert_at', fire); p.addListener('remove_at', fire);
          sh.addListener('contextmenu', function (e) { if (e.vertex != null && p.getLength() > 3) p.removeAt(e.vertex); }); // right-click a corner to remove it
        }
        ctl.labels[z.id] = new GMr.maps.Marker({ map: ctl.map, position: centroid(z.poly), clickable: false, zIndex: 3, icon: { path: GMr.maps.SymbolPath.CIRCLE, scale: 0 }, label: { text: z.name, color: '#151a2d', fontSize: '12px', fontWeight: '600' } });
        z.poly.forEach(function (q) { b.extend({ lat: +q[0], lng: +q[1] }); }); any = true;
      });
      ctl._bounds = any ? b : null;
    }
    function testAt(ll) {
      if (ctl.testMark) ctl.testMark.setPosition(ll);
      else ctl.testMark = mk(GMr, ctl.map, { lat: ll.lat(), lng: ll.lng(), label: T('Test pin', 'টেস্ট পিন') }, 'drop');
      if (o.onTest) o.onTest(+ll.lat().toFixed(6), +ll.lng().toFixed(6));
    }

    /* drawing a new zone: click the map to add corners */
    function draftRender() {
      var pts = ctl.draft.map(function (p) { return { lat: p[0], lng: p[1] }; });
      if (!ctl.draftShape) ctl.draftShape = new GMr.maps.Polygon({ map: ctl.map, paths: pts, strokeColor: '#4a52c8', strokeWeight: 2, strokeOpacity: 0.95, fillColor: '#4a52c8', fillOpacity: 0.12, clickable: false, zIndex: 6 });
      else ctl.draftShape.setPath(pts);
      var bad = ctl.draft.length >= 3 && polyProblem(ctl.draft, o.maxPoints);
      ctl.draftShape.setOptions({ strokeColor: bad ? '#e11d48' : '#4a52c8', fillColor: bad ? '#e11d48' : '#4a52c8' });
      ctl.draftDots.forEach(function (d) { d.setMap(null); }); ctl.draftDots = [];
      ctl.draft.forEach(function (p, i) {
        var d = new GMr.maps.Marker({ map: ctl.map, position: { lat: p[0], lng: p[1] }, zIndex: 7, clickable: i === 0 && ctl.draft.length >= 3,
          icon: { path: GMr.maps.SymbolPath.CIRCLE, scale: i === 0 ? 7 : 5, fillColor: i === 0 ? '#16a34a' : '#fff', fillOpacity: 1, strokeColor: '#4a52c8', strokeWeight: 2 } });
        if (i === 0) d.addListener('click', function () { ctl.finishDraw(); }); // click the first corner to close the shape
        ctl.draftDots.push(d);
      });
      if (o.onDraft) o.onDraft(ctl.draft.length, bad || null);
    }
    function draftClear() {
      ctl.draft = []; if (ctl.draftShape) { ctl.draftShape.setMap(null); ctl.draftShape = null; }
      ctl.draftDots.forEach(function (d) { d.setMap(null); }); ctl.draftDots = [];
    }

    ready().then(function (g) {
      if (ctl.dead) return;
      GMr = g;
      var s = root.querySelector('.nbm-spin'); if (s) s.remove();
      return loadConfig().then(function (c) {
        if (ctl.dead) return;
        var c0 = center0(c, {});
        ctl.map = new g.maps.Map(mapEl, { center: { lat: c0.lat, lng: c0.lng }, zoom: c0.zoom, mapTypeControl: true, mapTypeControlOptions: { position: g.maps.ControlPosition.TOP_RIGHT }, streetViewControl: false, fullscreenControl: true, clickableIcons: false, gestureHandling: 'greedy' });
        ctl.cfg = c;
        root.insertAdjacentHTML('beforeend',
          '<div class="nbm-top" style="right:auto;width:min(380px,calc(100% - 20px))"><div class="nbm-in">' + IC.search + '<input type="text" autocomplete="off" spellcheck="false" placeholder="' + esc(T('Search a place to jump there', 'যেকোনো জায়গা খুঁজে সেখানে যান')) + '"><button type="button" class="nbm-x" style="display:none" aria-label="' + esc(T('Clear', 'মুছুন')) + '">×</button></div><div class="nbm-sg"></div></div>');
        var inp = root.querySelector('input'), sg = root.querySelector('.nbm-sg'), xb = root.querySelector('.nbm-x'), timer = 0, token = null;
        function sgClose() { sg.classList.remove('o'); sg.innerHTML = ''; }
        function suggest(q) {
          var P2 = g.maps.places; if (!token) token = new P2.AutocompleteSessionToken();
          var b = ctl.map.getCenter();
          P2.AutocompleteSuggestion.fetchAutocompleteSuggestions({ input: q, sessionToken: token, includedRegionCodes: (c.countries && c.countries.length) ? c.countries : ['bd', 'ae'], language: lang(), region: 'bd', locationBias: { center: { lat: b.lat(), lng: b.lng() }, radius: 50000 } }).then(function (r) {
            if (q !== inp.value.trim()) return;
            var list = (r.suggestions || []).filter(function (x) { return x.placePrediction; }).slice(0, 6);
            sg.innerHTML = '';
            if (!list.length) { sg.innerHTML = '<div class="nbm-em">' + esc(T('No result found', 'কোনো ফলাফল পাওয়া যায়নি')) + '</div>'; sg.classList.add('o'); return; }
            list.forEach(function (x) {
              var pp = x.placePrediction, main = pp.mainText ? pp.mainText.text : pp.text.text, sec = pp.secondaryText ? pp.secondaryText.text : '', b2 = D.createElement('button'); b2.type = 'button';
              b2.innerHTML = IC.pin + '<span><b>' + esc(main) + '</b><small>' + esc(sec) + '</small></span>';
              b2.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
              b2.addEventListener('click', function () {
                sgClose(); inp.value = pp.text ? pp.text.text : main; xb.style.display = '';
                var pl = pp.toPlace();
                pl.fetchFields({ fields: ['location', 'viewport'] }).then(function () { token = null; if (pl.viewport) ctl.map.fitBounds(pl.viewport); else if (pl.location) { ctl.map.setCenter(pl.location); ctl.map.setZoom(15); } });
              });
              sg.appendChild(b2);
            });
            sg.classList.add('o');
          }, function () { });
        }
        inp.addEventListener('input', function () { var q = inp.value.trim(); xb.style.display = q ? '' : 'none'; clearTimeout(timer); if (q.length < 2) { sgClose(); return; } timer = setTimeout(function () { suggest(q); }, 260); });
        inp.addEventListener('blur', function () { setTimeout(sgClose, 180); });
        xb.addEventListener('click', function () { inp.value = ''; xb.style.display = 'none'; sgClose(); });

        ctl.map.addListener('click', function (e) {
          if (ctl.mode === 'draw') {
            if (ctl.draft.length >= (o.maxPoints || 300)) return;
            ctl.draft.push([+e.latLng.lat().toFixed(6), +e.latLng.lng().toFixed(6)]); draftRender();
          } else if (ctl.mode === 'test') testAt(e.latLng);
          else if (ctl.mode === 'view' && o.onSelect) o.onSelect(null);
        });
        build(); ctl.fit();
        if (o.onReady) o.onReady(ctl);
        setTimeout(function () { try { g.maps.event.trigger(ctl.map, 'resize'); } catch (e) { } }, 250);
      });
    }).catch(function (e) { var s = root.querySelector('.nbm-spin'); if (s) s.remove(); root.insertAdjacentHTML('beforeend', '<div class="nbm-err"><div>' + esc(failMsg(e)) + '</div></div>'); if (o.onFail) o.onFail(e); });

    ctl.setZones = function (list, keepView) { ctl.zones = list || []; build(); if (!keepView) ctl.fit(); };
    ctl.select = function (id, fit) { ctl.sel = id; build(); if (fit && id != null) ctl.fit(id); };
    ctl.fit = function (id) {
      if (!ctl.map || !GMr) return;
      var b = null;
      if (id != null) { var z = ctl.zones.filter(function (x) { return x.id === id; })[0]; if (z && z.poly) { b = new GMr.maps.LatLngBounds(); z.poly.forEach(function (q) { b.extend({ lat: +q[0], lng: +q[1] }); }); } }
      else b = ctl._bounds;
      if (b && !b.isEmpty()) ctl.map.fitBounds(b, 60);
    };
    ctl.goTo = function (lat, lng, zoom) { if (ctl.map) { ctl.map.setCenter({ lat: +lat, lng: +lng }); ctl.map.setZoom(zoom || 14); } };
    ctl.setMode = function (m) {
      ctl.mode = m;
      if (m !== 'draw') draftClear();
      if (m !== 'test' && ctl.testMark) { ctl.testMark.setMap(null); ctl.testMark = null; }
      if (ctl.map) ctl.map.setOptions({ draggableCursor: (m === 'draw' || m === 'test') ? 'crosshair' : null });
      build();
    };
    ctl.undo = function () { if (ctl.mode === 'draw' && ctl.draft.length) { ctl.draft.pop(); draftRender(); } };
    ctl.draftPoly = function () { return ctl.draft.slice(); };
    ctl.finishDraw = function () {
      if (ctl.mode !== 'draw') return null;
      var poly = ctl.draft.slice(), bad = poly.length >= 3 ? polyProblem(poly, o.maxPoints) : 'few';
      if (o.onDraw) o.onDraw(poly, bad);
      return poly;
    };
    ctl.cancelDraw = function () { draftClear(); if (o.onDraft) o.onDraft(0, null); };
    ctl.destroy = function () { ctl.dead = true; box.innerHTML = ''; };
    ctl.resize = function () { if (ctl.map && GMr) GMr.maps.event.trigger(ctl.map, 'resize'); };
    return ctl;
  }

  W.NBMap = { ready: ready, picker: picker, viewer: viewer, zoneEditor: zoneEditor, zoneAt: zoneAt, zoneArea: zoneArea, polyProblem: polyProblem, locate: locate, watch: watch, geocode: geocode, inService: inService, locMsg: locMsg, failMsg: failMsg };
})(window);

/* Customer site: Google Maps location picker, pin on addresses, live location share.
 * Source file. It is inlined into nurbuy-home.html (after shared/nb-gmap.js) by shared/sync-gmap.sh.
 * It hooks the existing order sheet (ATC), profile and order list; the old drawn map stays as a fallback
 * when no Google key is set on the server. No emojis (site rule). */
(function () {
  'use strict';
  if (!window.NBMap || window.__nbgm) return;
  window.__nbgm = 1;
  var D = document, M = window.NBMap, G = null;
  function T(en, bn) { return window.lang === 'en' ? en : bn; }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function Q(id) { return D.getElementById(id); }

  /* ---------- styles ---------- */
  var st = D.createElement('style');
  st.textContent =
    '.gmo{position:fixed;inset:0;z-index:3300;background:rgba(10,14,30,.6);display:none;place-items:center}.gmo.o{display:grid}' +
    '.gmc{width:min(900px,96vw);height:min(760px,94vh);background:#fff;color:#151a2d;border-radius:14px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)}' +
    '.gmh{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #e3e7f2}' +
    '.gmh h2{flex:1;margin:0;font-size:16.5px;font-weight:600}' +
    '.gmh button{border:0;background:#f1f4fa;width:36px;height:36px;border-radius:50%;cursor:pointer;color:#151a2d;display:grid;place-items:center}' +
    '.gmh svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}' +
    '.gmb{flex:1;min-height:240px;position:relative}' +
    '.gmf{padding:12px 14px 14px;border-top:1px solid #e3e7f2;background:#fff;max-height:46%;overflow-y:auto}' +
    '.gmch{display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap}' +
    '.gmch button{border:1px solid #cfd5e6;background:#fff;border-radius:18px;padding:6px 12px;font:inherit;font-size:13px;color:#2a5fd6;cursor:pointer}' +
    '.gmsum{display:flex;gap:10px;align-items:flex-start;margin-bottom:10px}' +
    '.gmsum i{flex:none;width:34px;height:34px;border-radius:50%;background:#e6ebfc;color:#1d2fe0;display:grid;place-items:center}' +
    '.gmsum svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2}' +
    '.gmsum b{display:block;font-weight:600;font-size:14.5px;line-height:1.35}.gmsum small{color:#6b7390;font-size:12.5px}' +
    '.gmg{margin-bottom:10px}.gmsel{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:8px}.gmsel[hidden]{display:none}' +
    '.gmg label{display:block;font-size:12px;color:#6b7390;margin-bottom:3px}' +
    '.gmg select{width:100%;box-sizing:border-box;border:1px solid #cfd5e6;border-radius:10px;padding:9px 8px;font:inherit;font-size:14px;outline:none;background:#fff;color:#111}.gmg select:focus{border-color:#1d2fe0}.gmg select:disabled{background:#f1f4fa;color:#98a0b8}.gmg select.bad{border-color:#e5254b}' +
    '.gmg input{width:100%;box-sizing:border-box;border:1px solid #cfd5e6;border-radius:10px;padding:9px 10px;font:inherit;font-size:14px;outline:none}.gmg input:focus{border-color:#1d2fe0}' +
    '.gmg .w{grid-column:1/-1}' +
    '.gmok{width:100%;border:0;background:#1d2fe0;color:#fff;border-radius:12px;height:46px;font:inherit;font-size:15px;cursor:pointer}.gmok[disabled]{background:#b9bfe6;cursor:default}' +
    '@media(max-width:700px){.gmc{width:100vw;height:100dvh;border-radius:0}.gmf{max-height:52%}.gmg input,.gmg select{padding:8px 9px;font-size:13.5px}.gmsel{grid-template-columns:1fr 1fr}.gmsel>div:last-child{grid-column:1/-1}}' +
    /* order sheet extras */
    '.gm-pf{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0 4px}.gm-pf .w{grid-column:1/-1}' +
    '.gm-pf label{display:block;font-size:12px;color:#6b7390;margin:0 0 3px}' +
    '.gm-pf input{width:100%;box-sizing:border-box;border:1px solid #cfd5e6;border-radius:10px;padding:9px 10px;font:inherit;font-size:14px;outline:none}.gm-pf input:focus{border-color:#1d3fe0}' +
    '.gm-pn{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;color:#16a34a;margin-top:4px}.gm-pn svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}' +
    '.gm-mb{display:inline-flex;align-items:center;gap:6px;border:1px solid #cfd5e6;background:#fff;color:#1d2fe0;border-radius:10px;padding:8px 12px;font:inherit;font-size:13px;cursor:pointer;margin-top:8px}.gm-mb svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}' +
    '.gm-lv{margin:10px 0;padding:12px;border-radius:12px;background:#f1f4fa;display:flex;gap:10px;align-items:center}' +
    '.gm-lv .t{flex:1;min-width:0}.gm-lv b{display:block;font-weight:600;font-size:13.5px}.gm-lv small{display:block;color:#6b7390;font-size:12px;line-height:1.35;margin-top:2px}' +
    '.gm-lv button{flex:none;border:0;background:#1d2fe0;color:#fff;border-radius:10px;padding:9px 13px;font:inherit;font-size:13px;cursor:pointer}' +
    '.gm-lv button.on{background:#16a34a}.gm-lv button[disabled]{opacity:.6}' +
    '.gmzs{display:flex;gap:9px;align-items:flex-start;margin-bottom:10px;padding:9px 11px;border-radius:10px;background:#f1f4fa;color:#2a3150;font-size:13px;line-height:1.4}' +
    '.gmzs svg{flex:none;width:18px;height:18px;margin-top:1px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
    '.gmzs.ok{background:#e8f7ee;color:#136c36}.gmzs.no{background:#fdecee;color:#b3202f}.gmzs[hidden]{display:none}' +
    'html[lang=bn] .gmzs b,html[lang=bn] .gmo b,html[lang=bn] .gmo h2,html[lang=bn] .gm-lv b,html[lang=bn] .gm-pn{font-weight:400!important}';
  D.head.appendChild(st);

  var ICX = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICB = '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>';
  var ICP = '<svg viewBox="0 0 24 24"><path d="M12 22s7-6.5 7-12a7 7 0 00-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  var ICK = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>';

  /* ---------- the map sheet ---------- */
  var gm = null; // {geo, ctl, done, dirty}
  function build() {
    if (Q('gmo')) return;
    var o = D.createElement('div'); o.className = 'gmo'; o.id = 'gmo';
    o.innerHTML = '<div class="gmc" role="dialog" aria-modal="true"><div class="gmh"><button type="button" id="gmback" aria-label="Back">' + ICB + '</button><h2 id="gmtt"></h2><button type="button" id="gmx" aria-label="Close">' + ICX + '</button></div>' +
      '<div class="gmb" id="gmbox"></div>' +
      '<div class="gmf"><div class="gmch" id="gmch" hidden></div><div class="gmzs" id="gmzs" hidden></div><div class="gmsum"><i>' + ICP + '</i><div><b id="gmfull"></b><small id="gmsub"></small></div></div>' +
      '<div class="gmg"><div class="gmsel" id="gmsel" hidden><div><label for="gmdi"></label><select id="gmdi"></select></div><div><label for="gmth"></label><select id="gmth"></select></div><div><label for="gmar"></label><select id="gmar"></select></div></div>' +
      '<div class="w"><label for="gmlm"></label><input id="gmlm" data-k="landmark" maxlength="120" autocomplete="off"></div></div>' +
      '<button type="button" class="gmok" id="gmok"></button></div></div>';
    D.body.appendChild(o);
    o.addEventListener('mousedown', function (e) { if (e.target === o) gmClose(); });
    Q('gmx').onclick = Q('gmback').onclick = gmClose;
    D.addEventListener('keydown', function (e) { if (e.key === 'Escape' && gm) gmClose(); });
    o.querySelector('#gmsel').addEventListener('change', function (e) {
      if (!gm) return; var id = e.target.id, v = +e.target.value || 0, i = id === 'gmdi' ? 0 : id === 'gmth' ? 1 : 2;
      gm.sel = gm.sel.slice(0, i); if (v) gm.sel[i] = v; selRender();
    });
    o.querySelector('.gmg').addEventListener('input', function (e) { var k = e.target.getAttribute('data-k'); if (!k || !gm) return; gm.dirty[k] = 1; if (gm.geo) gm.geo[k] = e.target.value.trim(); });
    Q('gmok').onclick = function () {
      if (!gm || !gm.geo || !gm.geo.lat) return;
      if (gm.zones && !gm.zone) return;
      var g = JSON.parse(JSON.stringify(gm.geo)), cb = gm.done, zn = gm.zone;
      var cu = (Q('gmlm') || {}).value; cu = (cu || '').trim();
      g.landmark = cu; g.cust = cu; g.city = '';
      var nn = selNodes(); if (nn[0]) g.district = nn[0]; if (nn[1]) g.thana = nn[1]; if (nn[2]) g.area = nn[2];
      if (gm.sync && !gm.zones && tree() && gm.sel.length >= (+tree().need || 3) && window.locWrite) { try { locWrite('min', { p: gm.sel.slice(), v: cu.slice(0, 80) }); if (window.locLabel) locLabel(); } catch (e) { } }
      gmClose(true); if (cb) cb(g, zn);
    };
  }
  /* district / thana / village lists come from the areas the admin switched on (same lists as the area picker) */
  function tree() { var d = window.LOCD && window.LOCD.min; return d && (d.d || []).length ? d : null; }
  function nm(x) { return window.locNm ? locNm(x) : x[1]; }
  function selNodes() { var t = tree(); if (!t || !gm) return []; return (window.locNodes ? locNodes('min', gm.sel) : []).map(nm); }
  function selRender() {
    var t = tree(), box = Q('gmsel'); if (!box) return;
    if (!t || !gm) { box.hidden = true; return; }
    box.hidden = false;
    var lists = [t.d || [], gm.sel[0] ? ((t.c && t.c[gm.sel[0]]) || []) : [], gm.sel[1] ? ((t.c && t.c[gm.sel[1]]) || []) : []];
    var ph = [T('Select district', 'জেলা বাছুন'), T('Select thana / upazila', 'থানা / উপজেলা বাছুন'), T('Select village / area', 'গ্রাম / এলাকা বাছুন')];
    ['gmdi', 'gmth', 'gmar'].forEach(function (id, i) {
      var el = Q(id), h = '<option value="">' + E(ph[i]) + '</option>';
      lists[i].forEach(function (x) { h += '<option value="' + x[0] + '"' + (gm.sel[i] == x[0] ? ' selected' : '') + '>' + E(nm(x)) + '</option>'; });
      el.innerHTML = h; el.disabled = i > 0 && !gm.sel[i - 1]; el.classList.remove('bad');
    });
  }
  function addrText(g) {
    var out = '';
    [g.cust || '', g.full || '', g.area || '', g.thana || '', g.district || ''].forEach(function (p) {
      p = String(p).trim(); if (!p) return;
      if (out.toLowerCase().indexOf(p.toLowerCase()) < 0) out += (out ? ', ' : '') + p;
    });
    return out.slice(0, 480);
  }
  function labels() {
    Q('gmtt').textContent = (gm && gm.title) || T('Choose delivery location', 'ডেলিভারি লোকেশন বেছে নিন');
    Q('gmok').textContent = T('Confirm this location', 'এই লোকেশন নিশ্চিত করুন');
    var L2 = { gmdi: T('District', 'জেলা'), gmth: T('Thana / Upazila', 'থানা / উপজেলা'), gmar: T('Village / Area', 'গ্রাম / এলাকা'), gmlm: T('Custom address (house, road, building no.)', 'নিজের লেখা ঠিকানা (বাড়ি, রাস্তা, বিল্ডিং নম্বর)') };
    if (Q('gmlm')) Q('gmlm').placeholder = T('e.g. House 12, Road 3, near the mosque', 'যেমন: বাসা ১২, রাস্তা ৩, মসজিদের পাশে');
    Object.keys(L2).forEach(function (id) { var l = D.querySelector('label[for=' + id + ']'); if (l) l.textContent = L2[id]; });
  }
  function fill(geo, force) {
    var el = Q('gmlm'); if (el && (force || !gm.dirty.landmark)) el.value = gm.custom || ''; else if (el) gm.custom = el.value.trim();
    Q('gmfull').textContent = geo.full || T('Address not found here. Type the details below.', 'এখানে ঠিকানা পাওয়া যায়নি। নিচে নিজে লিখুন।');
    var pc = geo.postcode ? T('Postcode ', 'পোস্টকোড ') + geo.postcode + ' · ' : '';
    Q('gmsub').textContent = pc + (+geo.lat).toFixed(5) + ', ' + (+geo.lng).toFixed(5);
    Q('gmok').disabled = false;
  }
  /* delivery zones: tell the person whether the pin is inside a zone, and block "confirm" when it is not */
  function zst(geo) {
    var b = Q('gmzs'); if (!b) return;
    if (!gm || !gm.zones) { b.hidden = true; b.className = 'gmzs'; return; }
    var z = null;
    if (geo && geo.lat != null && gm.ctl && gm.ctl.zoneAt) z = gm.ctl.zoneAt(+geo.lat, +geo.lng);
    gm.zone = z;
    b.hidden = false;
    if (z) {
      b.className = 'gmzs ok'; b.innerHTML = ICK + '<div><b>' + E(T('We deliver here', 'এখানে ডেলিভারি আছে')) + '</b><br>' + E(window.NBZ ? NBZ.line(z) : '') + '</div>';
      Q('gmok').disabled = false;
    } else if (geo && geo.lat != null) {
      b.className = 'gmzs no'; b.innerHTML = ICX + '<div><b>' + E(T('Sorry, no delivery here yet', 'দুঃখিত, এখানে এখনো ডেলিভারি নেই')) + '</b><br>' + E(T('Move the pin inside a coloured delivery area on the map.', 'ম্যাপের রঙিন ডেলিভারি এলাকার ভেতরে পিন সরিয়ে নিন।')) + '</div>';
      Q('gmok').disabled = true;
    } else {
      b.className = 'gmzs'; b.innerHTML = ICP + '<div>' + E(T('We deliver only inside the coloured areas. Place the pin inside one.', 'আমরা শুধু রঙিন এলাকাগুলোর ভেতরে ডেলিভারি দিই। এর ভেতরে পিন বসান।')) + '</div>';
    }
  }
  function gmOpen(o) {
    o = o || {}; build();
    if (gm) return;
    gm = { done: o.done, title: o.title, geo: o.geo || null, dirty: {}, sync: !!o.syncArea, sel: [], custom: (o.geo && o.geo.cust) || '', zones: (window.NBZ && NBZ.on && !o.nozones) ? NBZ.zones : null, zone: null };
    try { var sv = window.LSEL && LSEL.min && LSEL.min.p; if (tree() && sv && window.locNodes) gm.sel = locNodes('min', sv).map(function (x) { return x[0]; }); } catch (e) { gm.sel = []; }
    labels(); selRender(); zst(null);
    var ov = Q('gmo'); ov.classList.add('o'); D.body.style.overflow = 'hidden';
    Q('gmok').disabled = true; Q('gmfull').textContent = T('Move the pin or search to choose your location', 'পিন সরান বা সার্চ করে লোকেশন বেছে নিন'); Q('gmsub').textContent = '';
    Q('gmlm').value = gm.custom;
    // quick jump to the two default cities
    var chips = Q('gmch'); chips.innerHTML = '';
    var Zs = gm.zones;
    var box = Q('gmbox'), ctl = null, failed = false;
    ctl = gm.ctl = M.picker(box, {
      lat: o.geo && o.geo.lat, lng: o.geo && o.geo.lng, center: o.center, zones: Zs || undefined,
      onChange: function (geo) {
        if (!gm) return;
        var keep = gm.geo; gm.geo = geo;
        // a changed pin resets the typed landmark only if the person never edited it
        fill(geo, false);
        if (keep && keep.lat && Math.abs(keep.lat - geo.lat) + Math.abs(keep.lng - geo.lng) > 0.0008) { gm.dirty = {}; fill(geo, true); }
        zst(geo);
      },
      onMove: function (geo) { if (!gm) return; gm.geo = geo; Q('gmok').disabled = false; zst(geo); },
      onFail: function (e) { failed = true; if (o.fallback) { var fb = o.fallback; gmClose(true); fb(e); } },
      onReady: function (c) {
        if (Zs) {
          if (!(o.geo && o.geo.lat) && !o.auto && c.fitZones) c.fitZones();
        }
        if (o.auto) c.locate();
        else if (o.geo && o.geo.lat) { fill(o.geo, true); zst(o.geo); }
      }
    });
  }
  function gmClose(quiet) {
    var ov = Q('gmo'); if (!ov) return;
    ov.classList.remove('o'); D.body.style.overflow = '';
    if (gm && gm.ctl) gm.ctl.destroy();
    gm = null;
  }
  window.gmOpen = gmOpen;

  /* ---------- helpers for the order sheet ---------- */
  function locTxt(g) { return (+g.lat).toFixed(7) + ', ' + (+g.lng).toFixed(7); }
  function compose(A) {
    var base = (A.newA || '').trim(), f = A.f || {}, low = base.toLowerCase();
    var add = [];
    if (f.area && low.indexOf(String(f.area).toLowerCase()) < 0) add.push(f.area);
    if (f.thana && low.indexOf(String(f.thana).toLowerCase()) < 0) add.push(f.thana);
    if (f.district && low.indexOf(String(f.district).toLowerCase()) < 0) add.push(f.district);
    var out = base + (add.length ? (base ? ', ' : '') + add.join(', ') : '');
    return out.slice(0, 480);
  }
  var _atcAddr = window.atcAddr;
  if (typeof _atcAddr === 'function') window.atcAddr = function (A) { return A && A.ai == -1 && A.f ? compose(A) : _atcAddr(A); };

  // pin + details -> the order sheet
  function applyGeo(A, g) {
    A.geo = g; A.loc = locTxt(g); A.ai = -1;
    A.f = { area: g.area || '', thana: g.thana || '', district: g.district || '', landmark: g.landmark || '' };
    A.newA = addrText(g) || A.newA || '';
  }
  window.__nbApplyGeo = applyGeo;
  function useSaved(A, i) {
    var L2 = (window.PROF && PROF.addrLoc && PROF.addrLoc[i]) || null;
    if (L2 && L2.lat) { A.geo = L2; A.loc = locTxt(L2); }
    else { A.geo = null; A.loc = (Q('lcn') || {}).textContent || ''; }
  }

  // wrap the sheet renderer: show the pin state and the editable detail fields
  var _ar = window.atcRender;
  if (typeof _ar === 'function') window.atcRender = function () {
    var r = _ar.apply(this, arguments), A = window.ATC;
    try {
      if (!A || A.step !== 2 || !window.LIVE) return r;
      var lc = D.querySelector('#atcs .ad-lc .ad-lt');
      if (lc) {
        if (A.geo && A.geo.lat) {
          lc.innerHTML = '<b>' + E(A.geo.area || A.geo.city || T('Pin saved', 'পিন সেভ হয়েছে')) + '</b><small>' + E(A.geo.full || locTxt(A.geo)) + '</small><span class="gm-pn"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>' + E(T('Rider will navigate to this pin', 'রাইডার এই পিনে নেভিগেট করবেন')) + '</span>';
        } else lc.querySelector('small').textContent = T('Choose your exact spot on the map so the rider can reach you', 'রাইডার যেন সহজে পৌঁছায় সেজন্য ম্যাপে আপনার সঠিক জায়গা বেছে নিন');
      }
      var ta = Q('atca');
      /* the three area lists and the custom address are chosen on the map sheet; no extra fields here */
    } catch (e) { /* the sheet must never break because of the map */ }
    return r;
  };

  // capture the map buttons before the old drawn-map handlers see them
  D.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('#atcs [data-at=amap],#atcs [data-at=agps],#atcs [data-at=asel]') : null;
    if (!t || !window.ATC) return;
    var a = t.getAttribute('data-at'), A = window.ATC;
    if (a === 'asel') { var i = +t.getAttribute('data-i'); if (i >= 0) setTimeout(function () { if (window.ATC === A) { useSaved(A, i); if (window.atcRender) atcRender(); } }, 0); return; }
    if (!window.LIVE) return;
    e.stopPropagation(); e.preventDefault();
    var old = a === 'amap' ? function () { A.map = 1; Q('mo').style.zIndex = 3200; window.__nbOldOpenMap(); } : null;
    gmOpen({ syncArea: true, title: T('Choose delivery location', 'ডেলিভারি লোকেশন বেছে নিন'), geo: A.geo, auto: a === 'agps' && !(A.geo && A.geo.lat), fallback: a === 'amap' ? old : function () { /* browser location fallback */
      if (!navigator.geolocation) return; navigator.geolocation.getCurrentPosition(function (p) { if (window.ATC === A) { A.loc = p.coords.latitude.toFixed(7) + ', ' + p.coords.longitude.toFixed(7); atcRender(); } }, function () {}, { timeout: 8000 }); },
      done: function (g, zn) { if (window.NBZ && NBZ.on && zn) NBZ.set(g, zn); if (window.ATC !== A) return; applyGeo(A, g); atcRender(); var ta = Q('atca'); if (ta) { ta.value = A.newA; } if (window.atcErrUpd) atcErrUpd(); } });
  }, true);
  D.addEventListener('input', function (e) {
    var k = e.target && e.target.getAttribute && e.target.getAttribute('data-gk');
    if (!k || !window.ATC) return;
    (ATC.f || (ATC.f = {}))[k] = e.target.value.trim();
    if (window.atcErrUpd) atcErrUpd();
  });

  // the order itself: send the pin details with it (the server turns them into the rider's navigation target)
  var _nb = window.nbApi;
  if (typeof _nb === 'function') window.nbApi = function (m, p, b) {
    try {
      if (m === 'POST' && p === '/orders' && b && window.ATC && ATC.geo && ATC.geo.lat) {
        b.extra = b.extra || {};
        var f = ATC.f || {}, g = Object.assign({}, ATC.geo, { area: f.area || ATC.geo.area, city: f.city || ATC.geo.city, post: '', landmark: f.landmark || ATC.geo.landmark });
        b.extra.geo = g; b.extra.loc = locTxt(g);
      }
    } catch (e) { }
    return _nb.apply(this, arguments);
  };

  /* ---------- profile: saved addresses with a pin, and "Current location" ---------- */
  window.__nbOldOpenMap = window.openMap;
  var _om = window.openMap;
  window.openMap = function () {
    if (!window.LIVE) return _om.apply(this, arguments);
    var calledFromSheet = !!(window.ATC && ATC.map);
    gmOpen({ nozones: true, title: T('My current location', 'আমার বর্তমান লোকেশন'), geo: window.PROF && PROF.geo, fallback: function () { _om(); },
      done: function (g) { window.PROF.geo = g; PROF.locI = -3; if (window.saveProf) saveProf(); if (window.renderProf && D.body.classList.contains('vp')) renderProf(); } });
  };
  var _ln = window.locName;
  if (typeof _ln === 'function') window.locName = function () { var P = window.PROF; if (P && P.locI == -3 && P.geo) return P.geo.area || P.geo.city || T('Current location', 'বর্তমান লোকেশন'); return _ln(); };

  // keep PROF.addrLoc in step with PROF.addr
  D.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-pa]') : null; if (!t) return;
    var a = t.getAttribute('data-pa'), i = +t.getAttribute('data-i'), P = window.PROF; if (!P) return;
    if (a === 'adel' && P.addrLoc) { P.addrLoc.splice(i, 1); }
    if (a === 'gmap' && P.geo && P.locI == -3) { e.stopPropagation(); window.open('https://www.google.com/maps/search/?api=1&query=' + P.geo.lat + ',' + P.geo.lng, '_blank', 'noopener'); return; }
    if (a === 'aadd' || a === 'aedit') {
      var idx = a === 'aadd' ? P.addr.length : i;
      setTimeout(function () {
        var b = Q('pmb'); if (!b || b.querySelector('.gm-mb')) return;
        var ta = b.querySelector('#f1'); if (!ta) return;
        var cur = (P.addrLoc && P.addrLoc[idx]) || null; window.__gmPend = cur ? { idx: idx, geo: cur } : null;
        var bt = D.createElement('button'); bt.type = 'button'; bt.className = 'gm-mb';
        bt.innerHTML = ICP + E(T('Choose on map', 'ম্যাপে বেছে নিন'));
        bt.onclick = function () {
          gmOpen({ nozones: true, title: T('Choose address on map', 'ম্যাপে ঠিকানা বেছে নিন'), geo: window.__gmPend && window.__gmPend.geo, fallback: function () { bt.disabled = true; },
            done: function (g) {
              window.__gmPend = { idx: idx, geo: g };
              ta.value = addrText(g);
              bt.innerHTML = ICK + E(T('Pin saved. Change', 'পিন সেভ হয়েছে। বদলান'));
            } });
        };
        ta.insertAdjacentElement('afterend', bt);
        if (cur) bt.innerHTML = ICK + E(T('Pin saved. Change', 'পিন সেভ হয়েছে। বদলান'));
      }, 0);
    }
  }, true);
  var pms = Q('pms');
  if (pms && pms.onclick) {
    var _ps = pms.onclick;
    pms.onclick = function () {
      var P = window.PROF, pend = window.__gmPend, before = P ? P.addr.length : 0, snap = P ? JSON.stringify(P.addr) : '';
      var r = _ps.apply(this, arguments);
      try {
        if (pend && P && JSON.stringify(P.addr) !== snap) {
          P.addrLoc = P.addrLoc || []; while (P.addrLoc.length < P.addr.length) P.addrLoc.push(null);
          P.addrLoc[pend.idx] = pend.geo; if (window.saveProf) saveProf();
        }
      } catch (e) { }
      window.__gmPend = null; return r;
    };
  }

  /* ---------- live location share (WhatsApp style) ---------- */
  var LV = { oid: '', stop: null, last: 0, st: '' };
  try { LV.saved = localStorage.getItem('nb_live') || ''; } catch (e) { LV.saved = ''; }
  function lvSave(v) { try { if (v) localStorage.setItem('nb_live', v); else localStorage.removeItem('nb_live'); } catch (e) { } }
  function lvStop(quiet) {
    if (LV.stop) { LV.stop(); LV.stop = null; }
    var oid = LV.oid; LV.oid = ''; lvSave('');
    if (oid && !quiet && window.LIVE && window.nbApi) nbApi('POST', '/orders/' + encodeURIComponent(oid) + '/live', { off: true }).catch(function () { });
    lvPaint();
  }
  function lvStart(oid, silent) {
    if (LV.oid && LV.oid !== oid) lvStop();
    if (LV.stop) return;
    LV.oid = oid; LV.last = 0; lvSave(oid); lvPaint();
    LV.stop = M.watch(function (p) {
      var now = Date.now(); if (now - LV.last < 8000) return; LV.last = now;
      if (!M.inService(p.lat, p.lng)) return;
      nbApi('POST', '/orders/' + encodeURIComponent(oid) + '/live', { lat: p.lat, lng: p.lng, acc: p.acc }).catch(function (e) {
        if (e && e.data && (e.data.code === 'order_closed')) lvStop(true);
      });
    }, function (e) {
      // a timeout / "position unavailable" is temporary (tunnel, weak GPS): keep the share on and wait for the next fix
      if (e && (e.message === 'denied' || e.message === 'unsupported')) { lvStop(true); alert_(M.locMsg(e)); }
    });
    if (!silent) alert_(T('Live location is on. Keep this page open while the rider comes.', 'লাইভ লোকেশন চালু হয়েছে। রাইডার আসার সময় এই পেজ খোলা রাখুন।'));
  }
  function alert_(t) {
    var n = Q('gmtoast');
    if (!n) { n = D.createElement('div'); n.id = 'gmtoast'; n.style.cssText = 'position:fixed;left:50%;bottom:84px;transform:translateX(-50%);max-width:88vw;background:rgba(21,26,45,.92);color:#fff;border-radius:12px;padding:10px 14px;font-size:13.5px;line-height:1.4;z-index:3600;display:none;text-align:center'; D.body.appendChild(n); }
    n.textContent = t; n.style.display = 'block'; clearTimeout(alert_.t); alert_.t = setTimeout(function () { n.style.display = 'none'; }, 4200);
  }
  function lvPaint() {
    D.querySelectorAll('[data-lv]').forEach(function (b) {
      var on = LV.oid && b.getAttribute('data-lv') === LV.oid;
      b.classList.toggle('on', !!on); b.textContent = on ? T('Stop sharing', 'শেয়ার বন্ধ করুন') : T('Share live location', 'লাইভ লোকেশন দিন');
    });
  }
  function lvBox(o) {
    var on = LV.oid === o.id;
    return '<div class="gm-lv"><div class="t"><b>' + E(T('Live location for the rider', 'রাইডারের জন্য লাইভ লোকেশন')) + '</b><small>' + E(T('The rider can follow your location on the map until the order is delivered.', 'অর্ডার ডেলিভারি না হওয়া পর্যন্ত রাইডার ম্যাপে আপনার লোকেশন দেখে আসতে পারবেন।')) + '</small></div><button type="button" data-lv="' + E(o.id) + '"' + (on ? ' class="on"' : '') + '>' + E(on ? T('Stop sharing', 'শেয়ার বন্ধ করুন') : T('Share live location', 'লাইভ লোকেশন দিন')) + '</button></div>';
  }
  // Order card (oCard): put the live-location box above the item list
  function wrapCard(name, marker) {
    var orig = window[name];
    if (typeof orig !== 'function') return;
    window[name] = function (o) {
      var h = orig.apply(this, arguments);
      try {
        if (window.LIVE && window.AU && AU.uid && o && o.s === 'p') { var i = h.indexOf(marker); if (i > 0) h = h.slice(0, i) + lvBox(o) + h.slice(i); }
      } catch (e) { }
      return h;
    };
  }
  wrapCard('oCard', '<div class="ord-it">');
  wrapCard('oCardX', '<div class="oxb2">');
  D.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-lv]') : null; if (!b) return;
    e.stopPropagation(); var oid = b.getAttribute('data-lv');
    if (LV.oid === oid) lvStop(); else lvStart(oid, false);
  }, true);
  // come back after a reload: only if location was already allowed (no prompt on page load)
  setTimeout(function () {
    if (!LV.saved || !window.LIVE || !window.AU || !AU.uid) return;
    if (navigator.permissions && navigator.permissions.query) navigator.permissions.query({ name: 'geolocation' }).then(function (r) { if (r.state === 'granted') lvStart(LV.saved, true); else lvSave(''); }, function () { });
  }, 4000);
  // an order that is no longer active ends the share
  var _lo = window.liveOrders;
  if (typeof _lo === 'function') window.liveOrders = function () {
    var r = _lo.apply(this, arguments);
    return Promise.resolve(r).then(function (x) { try { var cur = LV.oid && window.ORD ? ORD.filter(function (o) { return o.id === LV.oid; })[0] : null; if (cur && cur.s !== 'p') lvStop(true); } catch (e) { } return x; });
  };
})();

/* Customer site: delivery zones for NurBuy Minutes (30-minute delivery).
 * Source file. It is inlined into nurbuy-home.html after customer/pgm.js by shared/sync-gmap.sh.
 *
 * When the admin has drawn at least one active delivery zone, the customer's map pin decides everything:
 *   - the pin must be inside a zone (outside = no delivery, the pin cannot be confirmed),
 *   - the zone sets the delivery charge, time, free-delivery amount and minimum order,
 *   - the old District > Thana > Village picker is not used for the map flow.
 * When no zone is active the old area system works exactly as before (every function below hands over to it).
 * The server stays the authority: it re-checks the pin and recomputes the charge when the order is placed.
 * No emojis (site rule). */
(function () {
  'use strict';
  if (window.__nbz || !window.LIVE || !window.NBMap) return;
  window.__nbz = 1;
  var D = document, W = window;
  function T(en, bn) { return W.lang === 'en' ? en : bn; }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function N(n) { return W.bnN ? bnN(n) : String(n); }
  function M(n) { return W.pdMoney ? pdMoney(n) : '৳ ' + n; }
  function zName(z) { return z ? (W.lang === 'en' ? z.name : (z.bn || z.name)) : ''; }

  var Z = W.NBZ = { on: false, loaded: false, zones: [], def: { fee: 30, eta: null, free: 499 }, sel: null };
  var waiters = [], cache = {}, bypass = 0;

  /* ---------- selection (kept in this browser) ---------- */
  function saveSel() { try { if (Z.sel) localStorage.setItem('nb_zsel', JSON.stringify(Z.sel.geo)); else localStorage.removeItem('nb_zsel'); } catch (e) { } }
  function readSel() {
    try {
      var g = JSON.parse(localStorage.getItem('nb_zsel') || 'null');
      if (g && isFinite(g.lat) && isFinite(g.lng)) { var z = Z.zoneAt(+g.lat, +g.lng); if (z) return { geo: g, zone: z }; }
    } catch (e) { }
    return null;
  }
  Z.zoneAt = function (lat, lng) { return NBMap.zoneAt(Z.zones, +lat, +lng); };
  Z.set = function (geo, zone) {
    var z = Z.zoneAt(geo.lat, geo.lng) || zone;
    Z.sel = z ? { geo: geo, zone: z } : null; saveSel(); paintLabel();
  };
  /* the pin that counts right now: the order sheet's pin (a saved address can carry its own), else the chosen one */
  Z.pin = function () {
    var A = W.ATC;
    if (A && A.step >= 2 && A.geo && A.geo.lat != null) return A.geo;
    return Z.sel && Z.sel.geo;
  };
  Z.zoneOfPin = function () { var g = Z.pin(); return g ? Z.zoneAt(g.lat, g.lng) : null; };

  /* ---------- wording ---------- */
  Z.line = function (z) {
    var p = [], fee = z.fee != null ? +z.fee : +Z.def.fee, eta = z.eta != null ? +z.eta : Z.def.eta, free = z.free_over != null ? +z.free_over : +Z.def.free;
    p.push(T('Delivery ', 'ডেলিভারি ') + M(fee));
    if (z.per_km != null && +z.per_km > 0) p.push('+ ' + M(z.per_km) + T(' per km', ' প্রতি কিমি') + (+z.km_free > 0 ? ' (' + N(z.km_free) + T(' km free', ' কিমি ফ্রি') + ')' : ''));
    if (eta) p.push(T('about ', 'প্রায় ') + N(eta) + T(' min', ' মিনিট'));
    p.push(T('free over ', 'ফ্রি: ') + M(free) + T('', ' এর বেশি অর্ডারে'));
    if (z.min_order != null && +z.min_order > 0) p.push(T('minimum order ', 'সর্বনিম্ন অর্ডার ') + M(z.min_order));
    return p.join(' · ');
  };

  /* ---------- the charge (same rule as the server: base x shops + per-km, free over the amount) ---------- */
  function itemIds() {
    var A = W.ATC, out = [];
    function add(p, k) { var id = (p && p[9]) || k, sh = ''; try { sh = (W.LSHOP && p && LSHOP[enName(p[1])]) || ''; } catch (e) { } if (id) out.push({ id: String(id), shop: sh }); }
    try {
      if (A && A.step >= 2) { if (A.cart) A.cart.forEach(function (o) { add(o.p, o.k); }); else add(A.p, A.k); }
      else if (D.body.classList.contains('vk') && W.cItems) cItems().forEach(function (o) { add(o.p, o.k); });
    } catch (e) { }
    return out;
  }
  function distCharge() {
    var g = Z.pin(), z = Z.zoneOfPin();
    if (!g || !z || !(+z.per_km > 0)) return 0;
    var its = itemIds(); if (!its.length) return 0;
    var key = (+g.lat).toFixed(5) + ',' + (+g.lng).toFixed(5) + '|' + its.map(function (x) { return x.id; }).sort().join(',');
    var c = cache[key];
    if (c) return c.busy ? 0 : c.d;
    cache[key] = { busy: 1, d: 0 };
    nbApi('POST', '/public/zones/check', { lat: +g.lat, lng: +g.lng, sub: 0, items: its }).then(function (r) { cache[key] = { d: +r.distance_charge || 0 }; repaint(); }, function () { delete cache[key]; });
    return 0;
  }
  function repaint() {
    try { if (W.ATC && ATC.step >= 2 && W.atcRender) atcRender(); } catch (e) { }
    try { if (D.body.classList.contains('vk') && W.renderCart) renderCart(); } catch (e) { }
  }

  /* ---------- hand over to the old area system when zones are off ---------- */
  function over(name, fn) {
    var o = W[name]; if (typeof o !== 'function') return;
    W[name] = function (s) { return (Z.on && s === 'min') ? fn.apply(this, arguments) : o.apply(this, arguments); };
  }
  over('locOk', function () { return !!Z.zoneOfPin(); });
  over('locId', function () { return 0; });
  over('locBase', function () { var z = Z.zoneOfPin(); return z && z.fee != null ? +z.fee : +Z.def.fee; });
  over('locFree', function () { var z = Z.zoneOfPin(); return z && z.free_over != null ? +z.free_over : +Z.def.free; });
  over('locFee', function (s, sub, n) {
    var z = Z.zoneOfPin(), base = z && z.fee != null ? +z.fee : +Z.def.fee, free = z && z.free_over != null ? +z.free_over : +Z.def.free;
    if (sub >= free) return 0;
    return Math.round((base * Math.max(1, n || 1) + distCharge()) * 100) / 100;
  });
  over('locText', function () {
    var g = Z.pin(), z = Z.zoneOfPin(); if (!z) return '';
    var a = g && (g.area || g.city) || ''; return (a && a !== zName(z) ? a + ', ' : '') + zName(z);
  });
  function selText() {
    var g = Z.sel && Z.sel.geo; if (!g) return null;
    var zn = zName(Z.sel.zone), a = g.area || g.city || '';
    return { v: (g.landmark || '').trim(), area: [a && a !== zn ? a : '', zn].filter(Boolean).join(', ') || zn, text: g.full || [a, zn].filter(Boolean).join(', ') };
  }
  var _gf = W.geoFull; W.geoFull = function () { return Z.on ? selText() : (_gf ? _gf.apply(this, arguments) : null); };
  var _gt = W.geoText; W.geoText = function () { if (!Z.on) return _gt ? _gt.apply(this, arguments) : ''; var s = selText(); return s ? s.area : ''; };

  /* header label ("Choose area" / "Mirpur, Dhaka zone"); the picker's own label code asks us first */
  function paintLabel() {
    var e = D.getElementById('lcn'); if (!e || !Z.on) return false;
    var s = selText();
    e.textContent = s ? s.area : T('Choose area', 'এলাকা বাছুন');
    return true;
  }
  Z.label = function () { return Z.on ? paintLabel() : false; };

  /* ---------- the map picker ---------- */
  function whenLoaded(f) { if (Z.loaded) f(); else waiters.push(f); }
  Z.openMap = function (cb, pf) {
    if (!W.gmOpen) { if (W.msg) msg(T('The map is not available right now. Please try again.', 'ম্যাপ এখন পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।')); return; }
    gmOpen({
      title: T('Choose delivery location', 'ডেলিভারি লোকেশন বেছে নিন'), geo: Z.sel && Z.sel.geo,
      fallback: function () { if (W.msg) msg(T('The map could not load. Please check your connection and try again.', 'ম্যাপ লোড হয়নি। ইন্টারনেট দেখে আবার চেষ্টা করুন।')); },
      done: function (g, zn) {
        Z.set(g, zn);
        var A = W.ATC;
        if (A && A.step >= 2 && W.__nbApplyGeo) { __nbApplyGeo(A, g); }
        if (cb) { cb(); return; }
        if (pf) { if (W.renderProf && D.body.classList.contains('vp')) renderProf(); if (W.msg) msg(T('Delivery location updated', 'ডেলিভারি লোকেশন আপডেট হয়েছে')); return; }
        W.__geoOK = 1;
        try { render(); } catch (e) { }
        if (W.msg) msg(T('Delivering to ', 'ডেলিভারি এলাকা: ') + zName(Z.sel && Z.sel.zone));
      }
    });
  };
  /* called first thing by the old picker's open(); true = we took over */
  Z.want = function (sys, cb, pf) {
    if (sys !== 'min' || bypass) return false;
    if (!Z.loaded) {
      whenLoaded(function () {
        if (Z.on) Z.openMap(cb, pf);
        else { bypass = 1; try { W.locPick('min', cb, pf); } finally { bypass = 0; } }
      });
      return true;
    }
    if (Z.on) { Z.openMap(cb, pf); return true; }
    return false;
  };

  /* ---------- order sheet: prefill the pin, show the zone, explain a "no" ---------- */
  var _ar = W.atcRender;
  if (typeof _ar === 'function') W.atcRender = function () {
    var A = W.ATC;
    try { if (Z.on && A && A.step >= 2 && !(A.geo && A.geo.lat != null) && Z.sel && W.__nbApplyGeo) { var ai = A.ai; __nbApplyGeo(A, Z.sel.geo); if (ai === -2 || ai >= 0) A.ai = ai; } } catch (e) { }
    var r = _ar.apply(this, arguments);
    try {
      if (Z.on && A && A.step === 2) {
        var ab = D.querySelector('#atclc .ad-t small');
        if (ab && !Z.zoneOfPin()) ab.textContent = T('Pin your location on the map', 'ম্যাপে আপনার লোকেশন পিন করুন');
        var lc = D.querySelector('#atcs .ad-lc'), old = D.getElementById('nbzst');
        if (old) old.remove();
        if (lc) {
          var g = Z.pin(), z = Z.zoneOfPin(), d = D.createElement('div'); d.id = 'nbzst';
          d.style.cssText = 'margin:8px 0 2px;padding:9px 11px;border-radius:10px;font-size:13px;line-height:1.4;' + (z ? 'background:#e8f7ee;color:#136c36' : 'background:#fdecee;color:#b3202f');
          if (z) d.textContent = zName(z) + ' · ' + Z.line(z);
          else if (g) d.textContent = T('We do not deliver to this pin yet. Choose a location inside a delivery area.', 'এই পিনে এখনো ডেলিভারি নেই। ডেলিভারি এলাকার ভেতরে লোকেশন বেছে নিন।');
          else d.textContent = T('Pin your location on the map to see the delivery charge and time.', 'ডেলিভারি চার্জ ও সময় দেখতে ম্যাপে লোকেশন পিন করুন।');
          lc.insertAdjacentElement('afterend', d);
        }
      }
    } catch (e) { }
    return r;
  };
  /* a saved address that has no pin cannot be delivered to in a zone: ask for the pin (the sheet already shows the map buttons) */

  /* the cart page: show the zone's minimum order next to the delivery line */
  var _rc = W.renderCart;
  if (typeof _rc === 'function') W.renderCart = function () {
    var r = _rc.apply(this, arguments);
    try {
      if (Z.on) {
        var z = Z.zoneOfPin(), sm = D.querySelector('.ct-bn.m small'), bt = D.querySelector('.ct-bn.m b'), ze = z ? (+z.eta > 0 ? +z.eta : +Z.def.eta) : 0;
        if (bt && ze > 0) bt.textContent = T('Delivery in about ' + ze + ' minutes', 'প্রায় ' + N(ze) + ' মিনিটে ডেলিভারি');
        if (sm && z && z.min_order != null && +z.min_order > 0) sm.textContent += ' · ' + T('minimum order ', 'সর্বনিম্ন অর্ডার ') + M(z.min_order);
        else if (sm && !z) sm.textContent = T('Choose your delivery location to see charges', 'চার্জ দেখতে ডেলিভারি লোকেশন বেছে নিন');
      }
    } catch (e) { }
    return r;
  };

  /* ---------- friendly messages for the server's "no" ---------- */
  var _le = W.liveErr;
  W.liveErr = function (e) {
    var c = e && e.data && e.data.code;
    if (c === 'outside_zone') return T('Sorry, we do not deliver to this location yet. Please choose a pin inside a delivery area.', 'দুঃখিত, এই লোকেশনে এখনো ডেলিভারি নেই। ডেলিভারি এলাকার ভেতরে পিন বেছে নিন।');
    if (c === 'pin_required') return T('Please pin your delivery location on the map.', 'ম্যাপে আপনার ডেলিভারি লোকেশন পিন করুন।');
    if (c === 'min_order') {
      var z = Z.zoneOfPin(), m = z && z.min_order != null ? ' ' + M(z.min_order) : '';
      return T('The minimum order for this area is', 'এই এলাকায় সর্বনিম্ন অর্ডার') + m + T('. Please add more items.', '। আরও পণ্য যোগ করুন।');
    }
    return _le ? _le.apply(this, arguments) : ((e && e.message) || 'Error');
  };

  /* ---------- load ---------- */
  function done() { Z.loaded = true; var w = waiters; waiters = []; w.forEach(function (f) { try { f(); } catch (e) { } }); }
  function load() {
    return nbApi('GET', '/public/zones').then(function (r) {
      Z.zones = (r.zones || []).filter(function (z) { return z.poly && z.poly.length >= 3; });
      Z.on = !!r.active && Z.zones.length > 0;
      Z.def = { fee: r.default_fee != null ? +r.default_fee : 30, eta: r.default_eta || null, free: r.free_over != null ? +r.free_over : 499 };
      if (Z.on) { var cur = Z.sel && Z.zoneAt(Z.sel.geo.lat, Z.sel.geo.lng); Z.sel = cur ? { geo: Z.sel.geo, zone: cur } : readSel(); if (!cur) saveSel(); }
      else Z.sel = null;
      cache = {};
      done(); paintLabel(); repaint();
    }, function () { done(); });
  }
  load();
  setInterval(function () { if (!D.hidden) load(); }, 180000);
  var _rn = W.render; if (typeof _rn === 'function') W.render = function () { var r = _rn.apply(this, arguments); try { paintLabel(); } catch (e) { } return r; };
  /* the header location button: in zones mode (Minutes) it opens the delivery-zone map */
  var lt = D.getElementById('lt');
  if (lt && lt.onclick) {
    var _lt = lt.onclick;
    lt.onclick = function (e) { if (Z.on) { e.stopPropagation(); Z.openMap(); return; } return _lt.apply(this, arguments); };
  }
})();

/*NBGM:END*/