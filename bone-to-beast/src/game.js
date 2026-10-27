// ======================= survivors game =======================
var G=null,keys={},tch={},hi=store.get('hi',0),dex=store.get('dex',{}),last=performance.now(),lastStarter='bone',TOUCH=matchMedia('(pointer:coarse)').matches,stick=null;
function refreshSkillBtns(){}
function hop(){var p=G.p;if(!G||G.state!=='play'||p.hopT>0)return;p.hopT=0.5;p.inv=Math.max(p.inv,0.5);snd('jump');var ml=Math.hypot(p.vx,p.vy)||1;p.vx*=1.35;p.vy*=1.35;}
function setBanner(t){G.banner=t;G.bannerT=2.2;}
function newGame(st){G={ug:0,ult2:0,t:0,state:'play',starter:st,ult:null,form:null,stage:1,el:null,fin:false,score:0,kills:0,en:[],shots:[],eshots:[],orbs:[],fx:[],texts:[],blood:{},need:10,reb:0,
  skills:[starterSkill(st)],parts:{},wave:1,spawnT:1,bossAt:4,shake:0,flash:0,banner:'',bannerT:0,history:[],cam:{x:0,y:0},
  p:{x:0,y:0,vx:0,vy:0,face:1,ground:true,hp:STARTERS[st].hp,max:STARTERS[st].hp,inv:0,atkT:0,swing:0,walk:0,dash:0,dx:0,dy:0,hit:[],cds:[0,0,0,0],landT:0}};
  setBanner(LANG==='ja'?'生き残れ！':'Survive!');}
function nearest(R,x,y){var b=null,bd=R||1e9;x=x==null?G.p.x:x;y=y==null?G.p.y:y;G.en.forEach(function(e){var d=Math.hypot(e.x-x,e.y-y);if(d<bd){bd=d;b=e;}});return b;}
// ----- enemies -----
var EKIND={slime:{spd:55,r:16},wolf:{spd:120,r:16},bat:{spd:105,r:14,fly:1},goblin:{spd:70,r:15,shoot:1},golem:{spd:38,r:26,slam:1},plant:{spd:30,r:16,shoot:3},drake:{spd:85,r:18,shoot:2}};
function spawnEnemy(sp,boss){var E=ENEMY[sp],a=Math.random()*6.283,R=Math.hypot(W,H)/Z*0.55+40,hm=1+(G.wave-1)*0.22+G.reb*0.4,b=boss?2.4:1;
  G.en.push({sp:sp,x:G.p.x+Math.cos(a)*R,y:G.p.y+Math.sin(a)*R,vx:0,vy:0,w:E.w*b,h:E.h*b,hp:E.hp*hm*(boss?14:1),max:E.hp*hm*(boss?14:1),dmg:E.dmg*(1+(G.wave-1)*0.07+G.reb*0.15)*(boss?1.5:1),
    spd:EKIND[sp].spd*(boss?0.8:1)*(0.9+Math.random()*0.2),boss:!!boss,t:Math.random()*3,cd:1.5+Math.random()*2,hit:0,stun:0,burn:0,face:1,ground:true,aim:0});}
function pool(){var w=G.wave,p=['slime','bat'];if(w>=1)p.push('goblin');if(w>=2)p.push('wolf','plant');if(w>=3)p.push('golem');if(w>=4)p.push('drake');return p;}
function hurtEnemy(e,dmg,kx,ky,quiet){if(e.dead)return;var cr=!quiet&&Math.random()<0.12;if(cr)dmg*=2;e.hp-=dmg;e.hit=0.1;if(!e.boss){e.vx+=kx||0;e.vy+=ky||0;}
  if(!quiet&&(G.fin||G.legacy)&&!G.ult2)G.ug=Math.min(100,(G.ug||0)+2);if(!quiet){G.texts.push({x:e.x+(Math.random()-0.5)*14,y:e.y-e.h-18,t:(cr?(LANG==='ja'?'会心 ':'CRIT '):'')+Math.round(dmg),l:cr?0.8:0.55,L:cr?0.8:0.55,c:cr?'#ffd34f':'#fff',z:cr?21:15});snd('hit');for(var si=0;si<(cr?8:3);si++)G.fx.push({x:e.x,y:e.y-e.h*0.55,vx:(Math.random()-0.5)*380,vy:(Math.random()-0.5)*380,l:0.2,c:cr?'#ffd34f':'#fff3c8',s:1.5+Math.random()*1.8});if(cr)G.hs=Math.max(G.hs||0,0.03);}var s=stat();if(s.life&&!quiet)G.p.hp=Math.min(G.p.max,G.p.hp+dmg*s.life);if(e.hp<=0)kill(e);}
function kill(e){e.dead=true;G.kills++;G.score+=Math.round(ENEMY[e.sp].pts*(e.boss?10:1)*(1+G.wave*0.1));snd('kill');G.shake=Math.max(G.shake,e.boss?14:3);if(e.boss)G.hs=0.5;
  for(var i=0;i<12;i++)G.fx.push({x:e.x,y:e.y-e.h/2,vx:(Math.random()-0.5)*360,vy:(Math.random()-0.5)*360,l:0.5,c:i%2?COL[e.sp]:'#d6334a',s:2+Math.random()*3});
  var n=e.boss?15:1;for(var k=0;k<n;k++)G.orbs.push({el:ELOF[e.sp],x:e.x+(Math.random()-0.5)*(e.boss?60:6),y:e.y+(Math.random()-0.5)*(e.boss?60:6),t:0,mag:false});}
function hurtHero(d,from){var p=G.p,s=stat();if(p.inv>0||p.dash>0)return;p.hp-=d*s.armor;p.inv=0.5;G.shake=8;G.flash=0.2;snd('hurt');
  if(!s.noKB&&from){var a=Math.atan2(p.y-from.y,p.x-from.x);p.kx=Math.cos(a)*260;p.ky=Math.sin(a)*260;}if(p.hp<=0){p.hp=0;over();}}
// ----- player attacks (auto) -----
function slash(ang,R,col,w){G.fx.push({slash:1,x:G.p.x,y:G.p.y-20,a:ang,R:R,l:0.18,L:0.18,c:col,w:w||1});}
function attack(){var p=G.p,s=stat();if(p.atkT>0)return;var rng=s.ranged||s.kind==='breath'?300:s.kind==='roots'?s.range:s.range+24,t=nearest(rng);if(!t)return;
  p.atkT=s.rate;p.swing=0.2;var ang=Math.atan2(t.y-p.y,t.x-p.x);p.face=Math.cos(ang)>=0?1:-1;snd('swing');
  if(s.ranged){var sp=s.shot?460:560;G.shots.push({x:p.x,y:p.y,vx:Math.cos(ang)*sp,vy:Math.sin(ang)*sp,dmg:s.dmg,l:1,r:s.shot?9:6,kind:s.shot||'dagger',hitL:[],pierce:s.shot==='fireball'?2:0});return;}
  if(s.kind==='breath'){snd('fire');for(var i=0;i<4;i++){var a=ang+(i-1.5)*0.12;G.shots.push({x:p.x,y:p.y,vx:Math.cos(a)*420,vy:Math.sin(a)*420,dmg:s.dmg*0.6,l:0.5,r:12,kind:'fire',hitL:[],pierce:3});}return;}
  if(s.kind==='roots'){G.en.forEach(function(e){if(Math.hypot(e.x-t.x,e.y-t.y)<60){G.fx.push({spike:1,x:e.x,y:e.y,l:0.4,L:0.4,c:'#7a5a3a'});hurtEnemy(e,s.dmg,0,0);}});return;}
  if(s.kind==='slam'){var R=s.range+10;G.fx.push({ring:1,x:p.x,y:p.y,r:0,R:R,l:0.25,L:0.25,c:'#9be07a'});G.en.forEach(function(e){if(Math.hypot(e.x-p.x,e.y-p.y)<R+e.w/2)hurtEnemy(e,s.dmg,(e.x-p.x)*2,(e.y-p.y)*2);});return;}
  var R2=s.range+24,col=s.heavy?'#ffb070':s.kind==='claw'?'#ff3b5c':s.kind==='bite'?'#ff6b80':s.kind==='whip'?'#7ad15a':'#f4efe6';slash(ang,R2,col,s.heavy?1.7:1);
  G.en.forEach(function(e){var dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(d<R2+e.w/2){var da=Math.abs(((Math.atan2(dy,dx)-ang+9.42)%6.283)-3.14);if(da<1.25||d<30)hurtEnemy(e,s.dmg,dx/d*s.kb*0.6,dy/d*s.kb*0.6);}});
  if(s.burn)G.en.forEach(function(e){if(Math.hypot(e.x-p.x,e.y-p.y)<R2)e.burn=1.5;});}
var SKCD={'Bone Toss':4,'Firebomb':4,'Regrow':9,'Pounce':3.5,'Screech':6,'Fire Breath':5,'Bloom':8,'Ground Slam':5,'Inferno':6,'Bat Swarm':6,'Golden Roll':4,'Sacred Bloom':9,'Roar':8};
var ULTK={dragon:'breath',drEmerald:'breath',drShadow:'breath',vampire:'moon',btLord:'moon',orichalcum:'press',glOri:'press',gbKing:'press',tree:'tree',plWarden:'tree',glTree:'tree',skWraith:'tree',gbDruid:'tree',bsSacred:'tree',btMonarch:'tree',plTreant:'quake',chimera:'quake',btFiend:'quake',skSteel:'quake',drEarth:'quake',slDeath:'abyss',gbDemon:'abyss',glRune:'abyss',plBloom:'abyss'};
var ULTN={breath:['Dragon Storm','ドラゴンストーム'],moon:['Blood Moon','ブラッドムーン'],press:['Golden Crush','黄金の大圧殺'],tree:['World Tree Wrath','世界樹の怒り'],quake:['Earth Splitter','大地割り'],abyss:['Abyss Gate','深淵の門']};
function ultKind(){if(!G.fin&&G.legacy)return G.legacy;return ULTK[G.form]||({grass:'tree',rock:'quake',dark:'abyss'})[G.el]||'quake';}
function ultName(){var n=ULTN[ultKind()];return LANG==='ja'?n[1]:n[0];}
function ultimate(){var p=G.p,s=stat(),k=ultKind(),t=nearest(500);G.ug=0;G.ultK=k;G.ult2=k==='breath'?1.6:k==='abyss'?1.8:k==='moon'?1.4:0.6;p.inv=G.ult2+0.3;snd('awaken');G.shake=20;G.flashU=1;setBanner(ultName()+'！');
  G.ultX=t?t.x:p.x+p.face*150;G.ultY=t?t.y:p.y;
  if(k==='press'){G.fx.push({ring:1,x:p.x,y:p.y,r:0,R:340,l:0.6,L:0.6,c:'#ffd34f'});burst(p.x,p.y,'#ffd34f',70);G.en.forEach(function(e){var d=Math.hypot(e.x-p.x,e.y-p.y);if(d<340){e.stun=2;hurtEnemy(e,s.dmg*6,(e.x-p.x)/d*500,(e.y-p.y)/d*500);}});}
  if(k==='tree'){p.hp=Math.min(p.max,p.hp+p.max*0.5);G.en.forEach(function(e){if(Math.hypot(e.x-p.x,e.y-p.y)<520){G.fx.push({spike:1,x:e.x,y:e.y,l:0.7,L:0.7,c:'#7a5a3a'});hurtEnemy(e,s.dmg*5,0,0);}});G.fx.push({ring:1,x:p.x,y:p.y,r:0,R:420,l:0.7,L:0.7,c:'#9be07a'});}
  if(k==='quake'){for(var q=0;q<8;q++){var qa=q/8*6.283;for(var r=1;r<7;r++)G.fx.push({crack:1,x:p.x+Math.cos(qa)*r*55,y:p.y+Math.sin(qa)*r*55,l:0.9,L:0.9});}G.en.forEach(function(e){if(Math.hypot(e.x-p.x,e.y-p.y)<420){e.stun=3;hurtEnemy(e,s.dmg*5,0,0);}});}
  if(k==='moon')p.hp=Math.min(p.max,p.hp+p.max*0.4);}
function ultTick(dt){var p=G.p,s=stat(),k=G.ultK;G.ult2-=dt;
  if(k==='breath'&&Math.random()<dt*40){var t=nearest(500),base=t?Math.atan2(t.y-p.y,t.x-p.x):(p.face>0?0:Math.PI),a=base+(Math.random()-0.5)*0.6;G.shots.push({x:p.x,y:p.y,vx:Math.cos(a)*600,vy:Math.sin(a)*600,dmg:s.dmg*0.9,l:0.7,r:16,kind:'fire',hitL:[],pierce:8});}
  if(k==='moon'&&Math.random()<dt*10)G.en.forEach(function(e){if(Math.hypot(e.x-p.x,e.y-p.y)<520){hurtEnemy(e,s.dmg*0.6,0,0,true);p.hp=Math.min(p.max,p.hp+1);G.fx.push({x:e.x,y:e.y-20,vx:(p.x-e.x)*2,vy:(p.y-e.y)*2,l:0.5,c:'#ff2a4a',s:3});}});
  if(k==='abyss'){var cx=G.ultX,cy=G.ultY;G.en.forEach(function(e){var dx=cx-e.x,dy=cy-e.y,d=Math.hypot(dx,dy)||1;if(d<380){e.x+=dx/d*240*dt;e.y+=dy/d*240*dt;if(Math.random()<dt*6)hurtEnemy(e,s.dmg*0.5,0,0,true);}});
    if(G.ult2<=0){G.shake=24;G.fx.push({ring:1,x:cx,y:cy,r:0,R:300,l:0.6,L:0.6,c:'#a46bff'});burst(cx,cy,'#a46bff',60);G.en.forEach(function(e){if(Math.hypot(cx-e.x,cy-e.y)<280)hurtEnemy(e,s.dmg*6,0,0);});}}
  if(G.ult2<0)G.ult2=0;}
function castSkills(){if(G.fin||G.legacy){if(G.ug<100)G.ug=Math.min(100,G.ug+(G._dt||1/60)*1.5);if(G.ug>=100&&!G.ult2&&nearest(400))ultimate();}if(G.ult2>0)ultTick(G._dt||1/60);var p=G.p;G.skills.forEach(function(n,i){if(p.cds[i]>0)return;if(useSkill(n))p.cds[i]=SKCD[n]||5;});}
function useSkill(n){var p=G.p,s=stat(),t=nearest(340),bst=(G.boost&&G.boost[n])||1;if(bst>1){s=Object.assign({},s);s.dmg*=bst;}
  if(n==='Regrow'){if(p.hp>p.max*0.75)return false;p.hp=Math.min(p.max,p.hp+p.max*0.35);G.fx.push({ring:1,x:p.x,y:p.y,r:0,R:90,l:0.5,L:0.5,c:'#4fcf86'});G.texts.push({x:p.x,y:p.y-60,t:'+HP',l:0.8,c:'#4fcf86'});snd('skill');return true;}
  if(!t)return false;var ang=Math.atan2(t.y-p.y,t.x-p.x);snd('skill');
  if(n==='Bone Toss'){for(var b=0;b<8;b++){var a=b/8*6.283;G.shots.push({x:p.x,y:p.y,vx:Math.cos(a)*380,vy:Math.sin(a)*380,dmg:s.dmg,l:0.9,r:8,kind:'bone',hitL:[],pierce:1});}}
  else if(n==='Firebomb'){G.shots.push({x:p.x,y:p.y,tx:t.x,ty:t.y,vx:0,vy:0,dmg:s.dmg*3,l:0.5,L:0.5,r:9,kind:'bomb',hitL:[]});}
  else if(n==='Pounce'||n==='Golden Roll'){p.dash=n==='Pounce'?0.25:0.4;p.dx=Math.cos(ang)*(n==='Pounce'?900:800);p.dy=Math.sin(ang)*(n==='Pounce'?900:800);p.hit=[];p.face=p.dx>=0?1:-1;}
  else if(n==='Screech'){G.fx.push({ring:1,x:p.x,y:p.y,r:0,R:220,l:0.4,L:0.4,c:'#c9a6ff'});G.en.forEach(function(e){if(Math.hypot(e.x-p.x,e.y-p.y)<220){e.stun=2;hurtEnemy(e,s.dmg*0.6,0,0);}});}
  else if(n==='Fire Breath'){snd('fire');for(var i=0;i<16;i++){var a2=ang+(Math.random()-0.5)*0.7;G.shots.push({x:p.x,y:p.y,vx:Math.cos(a2)*(320+Math.random()*260),vy:Math.sin(a2)*(320+Math.random()*260),dmg:s.dmg*0.5,l:0.6,r:11,kind:'fire',hitL:[],pierce:4,burn:1});}}
  else if(n==='Bloom'){p.hp=Math.min(p.max,p.hp+p.max*0.2);for(var j=0;j<12;j++){var a3=j/12*6.283;G.shots.push({x:p.x,y:p.y,vx:Math.cos(a3)*300,vy:Math.sin(a3)*300,dmg:s.dmg*0.8,l:1,r:6,kind:'seed',hitL:[]});}G.fx.push({ring:1,x:p.x,y:p.y,r:0,R:120,l:0.5,L:0.5,c:'#ff9ad5'});}
  else if(n==='Ground Slam'){G.shake=14;G.fx.push({ring:1,x:p.x,y:p.y,r:0,R:170,l:0.35,L:0.35,c:'#ffb070'});G.en.forEach(function(e){var d=Math.hypot(e.x-p.x,e.y-p.y);if(d<170){e.stun=1.2;hurtEnemy(e,s.dmg*1.6,(e.x-p.x)/d*300,(e.y-p.y)/d*300);}});}
  else if(n==='Inferno'){snd('fire');for(var ip=0;ip<10;ip++){var ia=ip/10*6.283+G.t,ir=60+ip*14;G.shots.push({x:p.x+Math.cos(ia)*ir,y:p.y+Math.sin(ia)*ir,tx:p.x+Math.cos(ia)*ir,ty:p.y+Math.sin(ia)*ir,vx:0,vy:0,dmg:s.dmg*1.2,l:0.15+ip*0.06,L:0.15+ip*0.06,r:10,kind:'meteor',hitL:[]});}}
  else if(n==='Bat Swarm'){for(var v=0;v<12;v++){var a4=v/12*6.283;G.shots.push({x:p.x,y:p.y,vx:Math.cos(a4)*260,vy:Math.sin(a4)*260,dmg:s.dmg*0.8,l:2.5,r:7,kind:'bat',hitL:[],home:1});}}
  else if(n==='Sacred Bloom'){p.hp=Math.min(p.max,p.hp+p.max*0.25);G.en.forEach(function(e){if(Math.hypot(e.x-p.x,e.y-p.y)<420){G.fx.push({spike:1,x:e.x,y:e.y,l:0.5,L:0.5,c:'#7a5a3a'});hurtEnemy(e,s.dmg*1.4,0,0);}});G.fx.push({ring:1,x:p.x,y:p.y,r:0,R:300,l:0.6,L:0.6,c:'#ff9ad5'});}
  else if(n==='Roar'){G.shake=18;G.fx.push({ring:1,x:p.x,y:p.y,r:0,R:360,l:0.5,L:0.5,c:'#ffb347'});G.en.forEach(function(e){var d=Math.hypot(e.x-p.x,e.y-p.y);if(d<360){e.stun=2.4;hurtEnemy(e,s.dmg,(e.x-p.x)/d*200,(e.y-p.y)/d*200);}});}
  return true;}
// ----- update -----
function update(dt){var p=G.p,s=stat();G.t+=dt;p.max=maxHp();G.wave=1+Math.floor(G.t/40);
  var mx=(keys.ArrowLeft||keys.KeyA?-1:0)+(keys.ArrowRight||keys.KeyD?1:0),my=(keys.ArrowUp||keys.KeyW?-1:0)+(keys.ArrowDown||keys.KeyS?1:0);
  if(stick){var sx=stick.x-stick.x0,sy=stick.y-stick.y0,sl=Math.hypot(sx,sy);if(sl>8){mx=sx/Math.max(sl,40);my=sy/Math.max(sl,40);}}
  var ml=Math.hypot(mx,my);if(ml>1){mx/=ml;my/=ml;}var spd=s.spd*0.82;
  if(p.dash>0){p.dash-=dt;p.vx=p.dx;p.vy=p.dy;G.en.forEach(function(e){if(p.hit.indexOf(e)<0&&Math.hypot(e.x-p.x,e.y-p.y)<e.w/2+18){p.hit.push(e);hurtEnemy(e,s.dmg*2,p.dx*0.3,p.dy*0.3);}});G.fx.push({x:p.x,y:p.y-20,vx:0,vy:0,l:0.2,c:'rgba(230,220,255,.5)',s:12});}
  else if(p.hopT>0){}else{p.vx+=(mx*spd-p.vx)*Math.min(1,dt*12);p.vy+=(my*spd-p.vy)*Math.min(1,dt*12);if(mx)p.face=mx>0?1:-1;}
  if(p.kx){p.vx+=p.kx;p.vy+=p.ky;p.kx=p.ky=0;}
  p.x+=p.vx*dt;p.y+=p.vy*dt;p.walk+=Math.hypot(p.vx,p.vy)*dt*0.045;
  if(p.hopT>0){p.hopT-=dt;if(p.hopT<=0){p.hopT=0;p.landT=0.14;G.fx.push({ring:1,x:p.x,y:p.y,r:0,R:40,l:0.25,L:0.25,c:'rgba(255,255,255,.5)'});}}if(p.landT>0)p.landT-=dt;if(p.inv>0)p.inv-=dt;if(p.atkT>0)p.atkT-=dt;if(p.swing>0)p.swing-=dt;for(var ci=0;ci<4;ci++)if(p.cds[ci]>0)p.cds[ci]-=dt;if(s.regen)p.hp=Math.min(p.max,p.hp+s.regen*dt);
  attack();G._dt=dt;castSkills();
  // spawning
  G.spawnT-=dt;var alive=G.en.length,cap=Math.min(70,14+G.wave*7);if(G.spawnT<=0&&alive<cap){G.spawnT=Math.max(0.15,0.75-G.wave*0.06);var pl=pool(),n=1+Math.floor(G.wave/2);for(var k=0;k<n;k++)spawnEnemy(pl[(Math.random()*pl.length)|0]);}
  if(G.wave>=G.bossAt){G.bossAt+=4;var bs=['golem','drake','wolf','plant','slime','bat'][(G.bossAt/4-2)%6];spawnEnemy(bs,true);setBanner(LANG==='ja'?'巨大な'+L(bs)+'が現れた！':'A giant '+bs+'!');snd('boss');}
  // enemies
  G.en.forEach(function(e){var K=EKIND[e.sp];e.t+=dt;if(e.hit>0)e.hit-=dt;var dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy)||1;e.face=dx>0?1:-1;
    if(e.burn>0){e.burn-=dt;if(Math.random()<dt*4)hurtEnemy(e,3+G.wave,0,0,true);}
    if(e.aim>0){e.aim-=dt;if(e.aim<=0&&e.stun<=0)G.eshots=G.eshots.concat(e.pend);}
    var want=1;if(K.shoot&&d<230)want=0;if(e.stun>0){e.stun-=dt;want=0;}if(e.aim>0||e.slamT>0)want=0;
    var sp=e.spd*(e.sp==='bat'?1+Math.sin(e.t*3)*0.3:1);e.vx+=((dx/d)*sp*want-e.vx)*Math.min(1,dt*4);e.vy+=((dy/d)*sp*want-e.vy)*Math.min(1,dt*4);
    if(K.shoot&&e.cd<=0&&d<300&&!e.aim&&e.stun<=0){e.cd=2.6;var a=Math.atan2(dy,dx),sh=[],c=e.sp==='drake'?'#ff8c3a':e.sp==='plant'?'#9be07a':'#d9e070';
      for(var q=0;q<K.shoot;q++){var aa=a+(q-(K.shoot-1)/2)*0.25;sh.push({x:e.x,y:e.y,vx:Math.cos(aa)*190,vy:Math.sin(aa)*190,r:e.sp==='drake'?8:6,dmg:e.dmg*0.8,l:2.5,col:c});}e.aim=0.5;e.pend=sh;}
    if(K.slam&&e.cd<=0&&d<90&&!e.slamT){e.cd=2.6;e.slamT=0.6;}if(e.slamT>0){e.slamT-=dt;if(e.slamT<=0){e.slamT=0;var R=90*(e.boss?1.8:1);G.fx.push({ring:1,x:e.x,y:e.y,r:0,R:R,l:0.3,L:0.3,c:'#ffb070'});G.shake=10;if(Math.hypot(p.x-e.x,p.y-e.y)<R)hurtHero(e.dmg,e);}}
    if(e.boss&&e.cd<=0&&!K.slam){e.cd=3;for(var b=0;b<10;b++){var ab=b/10*6.283;G.eshots.push({x:e.x,y:e.y,vx:Math.cos(ab)*170,vy:Math.sin(ab)*170,r:8,dmg:e.dmg*0.5,l:3,col:COL[e.sp]});}}
    e.cd-=dt;e.x+=e.vx*dt;e.y+=e.vy*dt;
    if(e.stun<=0&&d<e.w/2+14)hurtHero(e.dmg,e);
    if(d>Math.hypot(W,H)/Z*0.9&&!e.boss){var a2=Math.atan2(dy,dx)+Math.PI+(Math.random()-0.5);var R2=Math.hypot(W,H)/Z*0.55;e.x=p.x+Math.cos(a2)*R2;e.y=p.y+Math.sin(a2)*R2;}});
  // separation
  for(var i=0;i<G.en.length;i++)for(var j=i+1;j<G.en.length;j++){var a=G.en[i],b2=G.en[j],ddx=b2.x-a.x,ddy=b2.y-a.y,dd=Math.hypot(ddx,ddy)||1,min=(a.w+b2.w)*0.4;if(dd<min){var push=(min-dd)/2/dd;a.x-=ddx*push;a.y-=ddy*push;b2.x+=ddx*push;b2.y+=ddy*push;}}
  G.en=G.en.filter(function(e){return !e.dead;});
  // shots
  G.shots.forEach(function(sh){
    if(sh.kind==='bomb'||sh.kind==='meteor'){sh.l-=dt;if(sh.kind==='bomb'){var k2=1-sh.l/sh.L;sh.x=p.x+(sh.tx-p.x)*k2;sh.y=p.y+(sh.ty-p.y)*k2;}
      if(sh.l<=0){sh.dead=1;var R=sh.kind==='bomb'?100:80;G.fx.push({ring:1,x:sh.tx,y:sh.ty,r:0,R:R,l:0.35,L:0.35,c:'#ff8c3a'});G.shake=Math.max(G.shake,8);snd('fire');
        for(var m=0;m<10;m++)G.fx.push({x:sh.tx,y:sh.ty,vx:(Math.random()-0.5)*400,vy:(Math.random()-0.5)*400,l:0.5,c:m%2?'#ff8c3a':'#ffd34f',s:4});
        G.en.forEach(function(e){if(Math.hypot(e.x-sh.tx,e.y-sh.ty)<R+e.w/2)hurtEnemy(e,sh.dmg,0,0);});}return;}
    if(sh.home){var t=nearest(500,sh.x,sh.y);if(t){var a=Math.atan2(t.y-sh.y,t.x-sh.x);sh.vx+=(Math.cos(a)*460-sh.vx)*dt*3;sh.vy+=(Math.sin(a)*460-sh.vy)*dt*3;}}
    sh.x+=sh.vx*dt;sh.y+=sh.vy*dt;sh.l-=dt;
    for(var k=0;k<G.en.length;k++){var e=G.en[k];if(sh.hitL.indexOf(e)<0&&Math.hypot(e.x-sh.x,e.y-sh.y)<sh.r+e.w/2){sh.hitL.push(e);hurtEnemy(e,sh.dmg,sh.vx*0.15,sh.vy*0.15);if(sh.kind==='fire')e.burn=2;if(!(sh.pierce-->0)){sh.dead=1;break;}}}
    if(sh.l<=0)sh.dead=1;});
  G.shots=G.shots.filter(function(x){return !x.dead;});
  G.eshots.forEach(function(sh){sh.x+=sh.vx*dt;sh.y+=sh.vy*dt;sh.l-=dt;if(Math.hypot(sh.x-p.x,sh.y-p.y)<sh.r+12){sh.dead=1;hurtHero(sh.dmg,sh);}if(sh.l<=0)sh.dead=1;});
  G.eshots=G.eshots.filter(function(x){return !x.dead;});
  // orbs
  var magR=140+(G.stage-1)*30;G.orbs.forEach(function(o){o.t+=dt;var dx=p.x-o.x,dy=p.y-o.y,d=Math.hypot(dx,dy)||1;if(d<magR)o.mag=true;if(o.mag){var sp=380+o.t*120;o.x+=dx/d*sp*dt;o.y+=dy/d*sp*dt;if(d<16){o.dead=1;snd('orb');addBlood(o.el);}}if(o.t>40)o.dead=1;});
  G.orbs=G.orbs.filter(function(o){return !o.dead;});
  G.fx.forEach(function(f){f.l-=dt;if(f.ring)f.r=f.R*(1-f.l/f.L);else if(!f.slash&&!f.spike&&!f.crack){f.x+=(f.vx||0)*dt;f.y+=(f.vy||0)*dt;f.vx*=0.94;f.vy*=0.94;}});G.fx=G.fx.filter(function(f){return f.l>0;});
  G.texts.forEach(function(t){t.l-=dt;t.y-=40*dt;});G.texts=G.texts.filter(function(t){return t.l>0;});
  if(G.bannerT>0)G.bannerT-=dt;G.shake*=Math.pow(0.003,dt);if(G.flash>0)G.flash-=dt;
  G.cam.x+=(p.x-G.cam.x)*Math.min(1,dt*8);G.cam.y+=(p.y-G.cam.y)*Math.min(1,dt*8);}
// ----- draw -----
function ground(){var vw=W/Z,vh=H/Z,x0=G.cam.x-vw/2-60,y0=G.cam.y-vh/2-60;ctx.fillStyle='#231c29';ctx.fillRect(x0,y0,vw+120,vh+120);
  var T=80;for(var gx=Math.floor(x0/T)*T;gx<x0+vw+120;gx+=T)for(var gy=Math.floor(y0/T)*T;gy<y0+vh+120;gy+=T){var h=((gx*73856093)^(gy*19349663))>>>0,k=h%23;
    if((gx/T+gy/T)%2===0){ctx.fillStyle='rgba(255,255,255,.018)';ctx.fillRect(gx,gy,T,T);}
    var ox=gx+(h>>5)%60+10,oy=gy+(h>>11)%60+10;
    if(k===0){ctx.fillStyle='#3d3046';rr(ctx,ox-9,oy-22,18,24,7);ctx.fill();ctx.fillStyle='#2b2233';ctx.fillRect(ox-1.5,oy-17,3,11);ctx.fillRect(ox-5,oy-13,10,3);}
    else if(k<4){ctx.strokeStyle='#3a5a3a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox-3,oy-8);ctx.moveTo(ox,oy);ctx.lineTo(ox+1,oy-10);ctx.moveTo(ox,oy);ctx.lineTo(ox+4,oy-7);ctx.stroke();}
    else if(k<6){ctx.fillStyle='#3a3142';ctx.beginPath();ctx.ellipse(ox,oy,6+(h%5),4,0,0,7);ctx.fill();}
    else if(k===7){ctx.fillStyle='#e9e4d4';ctx.globalAlpha=0.35;ctx.fillRect(ox-6,oy,12,2.5);ctx.beginPath();ctx.arc(ox-6,oy+1,2,0,7);ctx.arc(ox+6,oy+1,2,0,7);ctx.fill();ctx.globalAlpha=1;}}}
function draw(){ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle='#15111b';ctx.fillRect(0,0,W,H);if(!G)return;
  ctx.save();var sh=G.shake;if(sh>0.5)ctx.translate((Math.random()-0.5)*sh,(Math.random()-0.5)*sh);ctx.translate(W/2,H/2);ctx.scale(Z,Z);ctx.translate(-G.cam.x,-G.cam.y);ground();
  G.fx.forEach(function(f){if(f.crack){var kc=f.l/f.L;ctx.strokeStyle='rgba(255,170,80,'+kc+')';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(f.x-26,f.y);ctx.lineTo(f.x-8,f.y-6);ctx.lineTo(f.x+6,f.y+4);ctx.lineTo(f.x+26,f.y-4);ctx.stroke();return;}if(!f.ring&&!f.spike)return;ctx.globalAlpha=Math.max(0,Math.min(1,f.l*3));if(f.ring){ctx.strokeStyle=f.c;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(f.x,f.y,f.r,f.r*0.62,0,0,7);ctx.stroke();}
    else{var k3=Math.sin((1-f.l/f.L)*Math.PI);ctx.fillStyle=f.c;ctx.beginPath();ctx.moveTo(f.x-12,f.y);ctx.lineTo(f.x-4,f.y-50*k3);ctx.lineTo(f.x+2,f.y-28*k3);ctx.lineTo(f.x+7,f.y-58*k3);ctx.lineTo(f.x+13,f.y);ctx.fill();}ctx.globalAlpha=1;});
  G.orbs.forEach(function(o){var b=Math.sin(o.t*5)*2;ctx.fillStyle='#d6334a';ctx.shadowColor='#ff4060';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(o.x,o.y-6+b,5,0,7);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=EL[o.el].col;ctx.beginPath();ctx.arc(o.x,o.y-6+b,2.6,0,7);ctx.fill();});
  var list=G.en.slice();list.push({hero:1,y:G.p.y});list.sort(function(a,b){return a.y-b.y;});
  list.forEach(function(e){if(e.hero){var p=G.p;if(p.inv>0&&Math.floor(p.inv*20)%2)return;ctx.save();ctx.shadowColor=G.form?fCol(G.form):'rgba(255,230,180,.35)';ctx.shadowBlur=G.fin?18:10;
      var pv=G.pv||(G.pv={});var hy=p.hopT>0?Math.sin((1-p.hopT/0.5)*Math.PI)*46:0;pv.x=p.x;pv.y=p.y-hy;pv.face=p.face;pv.walk=p.walk;pv.swing=p.swing;pv.ground=!(p.hopT>0);pv.vx=Math.hypot(p.vx,p.vy);pv.vy=p.hopT>0.25?-1:1;pv.h=62;pv.landT=p.landT;drawBody(ctx,pv,{},G.starter,G.form);ctx.restore();return;}
    if(e.aim>0){ctx.fillStyle='#ffd34f';ctx.font='900 18px sans-serif';ctx.textAlign='center';ctx.fillText('!',e.x,e.y-e.h-8);}drawEnemy(e);});
  G.shots.forEach(function(s){ctx.save();ctx.translate(s.x,s.y-18);
    if(s.kind==='bone'){ctx.rotate(G.t*14);spr(ctx,'skClub',0,0,9,0.5,0.5);}
    else if(s.kind==='bomb'){ctx.translate(0,-Math.sin((1-s.l/s.L)*Math.PI)*60);ctx.fillStyle='#ff8c3a';ctx.beginPath();ctx.arc(0,0,s.r,0,7);ctx.fill();ctx.fillStyle='#ffd34f';ctx.beginPath();ctx.arc(3,-6,3,0,7);ctx.fill();}
    else if(s.kind==='meteor'){var k=s.l/s.L;ctx.globalAlpha=0.5;ctx.strokeStyle='#ff8c3a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,18,30*(1-k)+8,18*(1-k)+5,0,0,7);ctx.stroke();ctx.globalAlpha=1;ctx.translate(-k*80,-k*260);ctx.rotate(0.8);spr(ctx,'fire',0,0,30,0.6,0.5,0,-1,1);}
    else if(s.kind==='fire'||s.kind==='fireball'){ctx.rotate(Math.atan2(s.vy,s.vx));spr(ctx,'fire',0,0,s.r*2.4,0.6,0.5,0,-1,1);}
    else if(s.kind==='magic'){ctx.fillStyle='#b77bff';ctx.shadowColor='#a46bff';ctx.shadowBlur=14;ctx.beginPath();ctx.arc(0,0,6,0,7);ctx.fill();ctx.shadowBlur=0;}
    else if(s.kind==='seed'){ctx.fillStyle='#9be07a';ctx.beginPath();ctx.ellipse(0,0,5,3,Math.atan2(s.vy,s.vx),0,7);ctx.fill();}
    else if(s.kind==='bat'){ctx.fillStyle='#b3203a';ctx.beginPath();ctx.arc(0,0,4,0,7);ctx.fill();var fw=Math.sin(G.t*30)*0.6;[-1,1].forEach(function(q){ctx.save();ctx.scale(q,1);ctx.rotate(fw);ctx.beginPath();ctx.moveTo(2,0);ctx.lineTo(12,-5);ctx.lineTo(9,3);ctx.fill();ctx.restore();});}
    else{ctx.rotate(Math.atan2(s.vy,s.vx));spr(ctx,'gbKnife',0,0,6,0.5,0.5);}ctx.restore();});
  G.eshots.forEach(function(s){if(s.col==='#ff8c3a'){ctx.save();ctx.translate(s.x,s.y-16);ctx.rotate(Math.atan2(s.vy,s.vx));spr(ctx,'fire',0,0,s.r*2.6,0.6,0.5,0,-1,1);ctx.restore();return;}ctx.fillStyle=s.col;ctx.shadowColor='#ff3b4e';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(s.x,s.y-16,s.r,0,7);ctx.fill();ctx.shadowBlur=0;});
  G.fx.forEach(function(f){if(f.ring||f.spike||f.crack)return;ctx.globalAlpha=Math.max(0,Math.min(1,f.l*3));
    if(f.slash){var k=1-f.l/f.L;ctx.strokeStyle=f.c;ctx.lineWidth=7*f.w;ctx.lineCap='round';ctx.beginPath();ctx.arc(f.x,f.y,f.R*0.75,f.a-1.1+k*0.5,f.a+0.4+k*0.8);ctx.stroke();}
    else{ctx.fillStyle=f.c;ctx.beginPath();ctx.arc(f.x,f.y,f.s,0,7);ctx.fill();}ctx.globalAlpha=1;});
  G.texts.forEach(drawPopText);
  if(G.ult2>0&&G.ultK==='abyss'){var ar=60+Math.sin(G.t*20)*6;ctx.save();ctx.translate(G.ultX,G.ultY);ctx.rotate(G.t*4);var gr=ctx.createRadialGradient(0,0,4,0,0,ar*1.6);gr.addColorStop(0,'#000');gr.addColorStop(0.5,'rgba(70,20,120,.9)');gr.addColorStop(1,'rgba(164,107,255,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(0,0,ar*1.6,0,7);ctx.fill();ctx.strokeStyle='#c9a6ff';ctx.lineWidth=3;for(var q=0;q<3;q++){ctx.beginPath();ctx.arc(0,0,ar*(0.5+q*0.3),q*2,q*2+3.5);ctx.stroke();}ctx.restore();}
  ctx.restore();
  if(G.ult2>0&&G.ultK==='moon'){ctx.fillStyle='rgba(120,0,20,.35)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#ff2a4a';ctx.shadowColor='#ff2a4a';ctx.shadowBlur=40;ctx.beginPath();ctx.arc(W*0.75,H*0.22,Math.min(W,H)*0.1,0,7);ctx.fill();ctx.shadowBlur=0;}
  if(G.ult2>0&&G.ultK==='breath'){ctx.fillStyle='rgba(255,120,30,.12)';ctx.fillRect(0,0,W,H);}
  if(G.flashU>0){G.flashU-=0.04;ctx.fillStyle='rgba(255,240,200,'+(G.flashU*0.6)+')';ctx.fillRect(0,0,W,H);}
  var vg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.35,W/2,H/2,Math.max(W,H)*0.75);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
  if(G.flash>0){ctx.fillStyle='rgba(214,51,74,'+(G.flash*0.8)+')';ctx.fillRect(0,0,W,H);}
  hud();if(stick){ctx.globalAlpha=0.3;ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(stick.x0,stick.y0,50,0,7);ctx.stroke();var sx=stick.x-stick.x0,sy=stick.y-stick.y0,sl=Math.hypot(sx,sy),m=Math.min(1,50/(sl||1));ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(stick.x0+sx*m,stick.y0+sy*m,22,0,7);ctx.fill();ctx.globalAlpha=1;}}
function hud(){var p=G.p,k=Math.max(0.6,Math.min(1,W/520)),x=10,y=10;ctx.save();ctx.scale(k,k);var Wk=W/k;
  ctx.fillStyle='rgba(20,15,26,.8)';rr(ctx,x,y,Wk-20,74,14);ctx.fill();
  ctx.save();rr(ctx,x+6,y+6,62,62,10);ctx.fillStyle='#2a2333';ctx.fill();ctx.clip();ctx.translate(x+37,y+64);var sc=0.85;if(G.form&&!G.ult){var F=FORMS[G.form],fa=ATLAS[F.art];sc=Math.min(54/F.h,54/(fa[2]/fa[3]*F.h));}else if(G.ult)sc=0.5;else if(START_ART[G.starter])sc=Math.min(1.4,50/START_ART[G.starter][1]);ctx.scale(sc,sc);
  drawBody(ctx,{x:0,y:0,face:1,walk:G.t*2,swing:0,ground:true,h:62},{},G.starter,G.form);ctx.restore();
  var bx=x+78,bw=Wk-20-88;ctx.textAlign='left';ctx.fillStyle=G.form?fCol(G.form):'#f4efe6';ctx.font='900 15px Trebuchet MS,sans-serif';ctx.fillText(formName(),bx,y+20);
  ctx.textAlign='right';ctx.fillStyle='#c9bdd4';ctx.font='800 12px Trebuchet MS,sans-serif';var mm=Math.floor(G.t/60),ss=Math.floor(G.t%60);ctx.fillText((LANG==='ja'?'ウェーブ':'Wave')+' '+G.wave+'  '+mm+':'+(ss<10?'0':'')+ss+'  '+G.kills+(LANG==='ja'?'体':' kills'),x+Wk-28,y+20);
  ctx.fillStyle='rgba(255,255,255,.12)';rr(ctx,bx,y+28,bw,12,6);ctx.fill();ctx.fillStyle='#e8445a';rr(ctx,bx,y+28,bw*Math.max(0,p.hp/p.max),12,6);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.font='800 10px Trebuchet MS,sans-serif';ctx.fillText(Math.ceil(p.hp)+' / '+p.max,bx+6,y+38);
  var tot=0;for(var kk in G.blood)tot+=G.blood[kk];ctx.fillStyle='rgba(255,255,255,.12)';rr(ctx,bx,y+45,bw,8,4);ctx.fill();var off=0;Object.keys(G.blood).forEach(function(s){var w2=bw*Math.min(1,G.blood[s]/G.need);ctx.fillStyle=EL[s].col;ctx.fillRect(bx+off,y+45,Math.max(0,Math.min(w2,bw-off)),8);off+=w2;});
  ctx.font='800 10px Trebuchet MS,sans-serif';ctx.fillStyle='#c9bdd4';ctx.fillText((G.fin?(LANG==='ja'?'転生まで ':'REBIRTH '):L('BLOOD')+' ')+tot+'/'+G.need+(G.reb?(LANG==='ja'?'  転生'+G.reb:'  x'+G.reb):''),bx,y+66);
  if(G.fin||G.legacy){ctx.fillStyle='rgba(255,255,255,.12)';rr(ctx,bx,y+56,bw,4,2);ctx.fill();ctx.fillStyle=G.ug>=100?'#ffd34f':'#b8923a';rr(ctx,bx,y+56,bw*G.ug/100,4,2);ctx.fill();}
  ctx.textAlign='right';G.skills.forEach(function(n,i){var c=p.cds[i];ctx.fillStyle=c<=0?'#ffd34f':'#8d8399';ctx.fillText((G.boost&&G.boost[n]?'★':'')+L(n),x+Wk-28-(G.skills.length-1-i)*72,y+66);});
  ctx.restore();
  if(G.bannerT>0){ctx.globalAlpha=Math.min(1,G.bannerT*1.5);ctx.textAlign='center';ctx.font='900 '+Math.round(Math.min(W,H)*0.07)+'px Trebuchet MS,sans-serif';ctx.fillStyle='#f4efe6';ctx.shadowColor=G.form?fCol(G.form):'#d6334a';ctx.shadowBlur=20;ctx.fillText(G.banner,W/2,H*0.28);ctx.shadowBlur=0;ctx.globalAlpha=1;}}
// ----- flow -----
function over(){G.state='dead';if(G.score>hi){hi=G.score;store.set('hi',hi);}
  setTimeout(function(){var mm=Math.floor(G.t/60),ss=Math.floor(G.t%60),tm=mm+':'+(ss<10?'0':'')+ss;$('deadT').textContent=LANG==='ja'?tm+' 生き残った':'Survived '+tm;
    $('deadP').textContent=(LANG==='ja'?'スコア '+G.score+' ・ '+G.kills+'体たおした':'Score '+G.score+' · '+G.kills+' defeated')+(G.score>=hi?' · '+L('New best!'):' · '+L('Best')+' '+hi);
    var el=$('deadForm');el.innerHTML='';var b=card(fCol(G.form),function(g){if(G.form)drawFormFit(g,G.form,62,90);else{var z=START_ART[G.starter]?Math.min(2,52/START_ART[G.starter][1]):1;g.scale(z,z);drawBody(g,{x:0,y:0,face:1,walk:0.6,swing:0,ground:true,h:62},{},G.starter,null);}},
      '<b>'+formName()+'</b><span>'+[STARTERS[G.starter].name].concat(G.history.map(fName)).join(' → ')+'</span>');b.style.pointerEvents='none';el.appendChild(b);$('dead').hidden=false;$('hopBtn').hidden=true;},900);}
function start(k){lastStarter=k;newGame(k);$('title').hidden=true;$('dead').hidden=true;$('hopBtn').hidden=false;last=performance.now();}
function frame(now){var fdt=Math.min(0.05,Math.max(0,(now-last)/1000));last=now;if(G&&G.hs>0){G.hs-=fdt;fdt*=0.12;}if(G&&G.state==='play'){if(fdt>1/50){update(fdt/2);update(fdt/2);}else if(fdt>0)update(fdt);}draw();requestAnimationFrame(frame);}
addEventListener('keydown',function(e){keys[e.code]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].indexOf(e.code)>=0)e.preventDefault();
  var dg=/^Digit[1-8]$/.test(e.code)?+e.code.slice(5):0;if(!$('title').hidden&&dg){start(Object.keys(STARTERS)[dg-1]);return;}
  if(G&&G.state==='graft'&&dg){var b=$('cards').querySelectorAll('button')[dg-1];if(b)b.click();}});
addEventListener('keyup',function(e){keys[e.code]=false;});addEventListener('keydown',function(e){if(e.code==='Space'&&!e.repeat)hop();});
$('hopBtn').addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();hop();});addEventListener('blur',function(){keys={};stick=null;});
cv.addEventListener('pointerdown',function(e){if(!G||G.state!=='play')return;stick={id:e.pointerId,x0:e.clientX,y0:e.clientY,x:e.clientX,y:e.clientY};});
cv.addEventListener('pointermove',function(e){if(!stick||e.pointerId!==stick.id)return;stick.x=e.clientX;stick.y=e.clientY;var dx=stick.x-stick.x0,dy=stick.y-stick.y0,d=Math.hypot(dx,dy);if(d>60){stick.x0=stick.x-dx/d*60;stick.y0=stick.y-dy/d*60;}});
['pointerup','pointercancel'].forEach(function(t){cv.addEventListener(t,function(e){if(stick&&e.pointerId===stick.id)stick=null;});});
$('again').addEventListener('click',function(){start(lastStarter);});$('toTitle').addEventListener('click',function(){$('dead').hidden=true;G=null;buildTitle();$('title').hidden=false;});
$('lang').addEventListener('click',function(){LANG=LANG==='ja'?'en':'ja';store.set('lang',LANG);applyLang();applyKeys();buildTitle();});
function applyKeys(){$('keysP').textContent=LANG==='ja'?(TOUCH?'画面をドラッグして移動。右下のボタンでジャンプ（よけられる）。攻撃と技は自動！':'WASD / 矢印キーで移動、スペースでジャンプ。攻撃と技は自動！'):(TOUCH?'Drag to move, tap the button to jump (dodge). Attacks and skills are automatic!':'Move with WASD / arrows, Space to jump. Attacks and skills are automatic!');}
applyLang();applyKeys();ART.onload=function(){ARTOK=true;buildTitle();};buildTitle();requestAnimationFrame(frame);
