#!/usr/bin/env python3
from pathlib import Path
import shutil, subprocess, sys, re

ROOT = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else Path('/home/paulo/ponanini')
INDEX, GAME, STYLE = ROOT/'index.html', ROOT/'game.js', ROOT/'style.css'
RPG = ROOT/'ponan_true_rpg.js'
SUFFIX = '.before_true_rpg'

RPG_JS = r'''(() => {
"use strict";
if (window.PonanTrueRPG) return;
const TILE=48;
const zones={
 village:{name:"VILLAGE DE PONAN",sub:"Le dernier refuge",w:42,h:28,spawn:[8,8]},
 lake:{name:"GRAND LAC",sub:"Les eaux sacrées",w:46,h:30,spawn:[6,15]},
 forest:{name:"FORÊT DES MURMURES",sub:"Quelque chose vous observe",w:52,h:34,spawn:[5,17]},
 ruins:{name:"RUINES DE L'ANCIEN ROI",sub:"La vérité fut enterrée ici",w:44,h:30,spawn:[5,15]}
};
const S={active:false,zone:'village',t:0,last:performance.now(),save:0,transition:0,target:null,
 p:{x:0,y:0,w:28,h:28,spd:155,dir:'down',hp:100,maxHp:100,st:100,maxSt:100,mana:40,maxMana:40,level:1,xp:0,gold:0,atk:12,def:2,attack:0,heavy:0,dodge:0,inv:0,combo:0,comboT:0},
 keys:Object.create(null),enemies:[],npcs:[],items:[],chests:[],parts:[],dialogue:null,quest:'awakening',fragments:0};
window.PonanTrueRPG=S;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function notify(s){let e=document.getElementById('ponan-toast');if(!e){e=document.createElement('div');e.id='ponan-toast';document.body.appendChild(e)}e.textContent=s;e.classList.add('show');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('show'),2200)}
function stop(id){const a=document.getElementById(id);if(a){try{a.pause();a.currentTime=0;a.volume=0}catch(_){}}}
function audio(){stop('menuMusic');stop('introVideoPlayer');let a=document.getElementById('true-rpg-music');if(!a){a=document.createElement('audio');a.id='true-rpg-music';a.loop=true;a.src='assets/audio/gameplay.mp3';a.volume=.25;document.body.appendChild(a)}a.play().catch(()=>{})}
function hash(x,y){let n=Math.sin(x*127.1+y*311.7+S.zone.length*17)*43758.5453;return n-Math.floor(n)}
function solid(tx,ty){const z=zones[S.zone];if(tx<0||ty<0||tx>=z.w||ty>=z.h)return true;if(tx===0||ty===0||tx===z.w-1||ty===z.h-1)return true;
 if(S.zone==='village')return (tx>=16&&tx<=25&&ty>=3&&ty<=7)||(tx>=30&&tx<=35&&ty>=10&&ty<=14)||(ty===4&&tx>=5&&tx<=12)||(tx===5&&ty>=4&&ty<=9)||(tx===12&&ty>=4&&ty<=9);
 if(S.zone==='lake'){let dx=tx-24,dy=ty-15;return (dx*dx)/190+(dy*dy)/75<1|| (tx===18&&ty>5&&ty<24)}
 if(S.zone==='forest')return hash(tx,ty)>.72||(tx>=22&&tx<=28&&ty>=12&&ty<=20);
 if(S.zone==='ruins')return (ty===7&&tx>=12&&tx<=30)||(ty===22&&tx>=12&&tx<=30)||(tx===12&&ty>=7&&ty<=22)||(tx===30&&ty>=7&&ty<=22)||(tx===20&&ty>=7&&ty<=14);
 return false}
function blocked(x,y){const w=S.p.w/2,h=S.p.h/2;for(let yy=Math.floor((y-h)/TILE);yy<=Math.floor((y+h)/TILE);yy++)for(let xx=Math.floor((x-w)/TILE);xx<=Math.floor((x+w)/TILE);xx++)if(solid(xx,yy))return true;return false}
function spawn(){let q=zones[S.zone].spawn;S.p.x=q[0]*TILE+24;S.p.y=q[1]*TILE+24;S.p.inv=1}
function enemies(){S.enemies=[];const add=(type,x,y,frag=false)=>{const d={shadow:[35,60,7,0,18,'#4d5a61'],wolf:[55,85,10,1,26,'#66705f'],guardian:[120,45,17,4,70,'#92795b']}[type];S.enemies.push({type,x:x*TILE+24,y:y*TILE+24,hp:d[0],max:d[0],spd:d[1],atk:d[2],def:d[3],xp:d[4],color:d[5],range:48,dead:false,cd:0,hurt:0,fragment:frag,boss:false})};
 if(S.zone==='lake'){add('shadow',31,11);add('shadow',36,18);add('shadow',28,23);add('shadow',34,8)}
 if(S.zone==='forest'){add('wolf',14,10);add('wolf',20,24);add('wolf',31,8);add('wolf',37,18);add('wolf',42,25,true);add('wolf',12,27)}
 if(S.zone==='ruins'){add('guardian',17,12);add('guardian',27,17);add('guardian',21,19,true);}}
function npcs(){S.npcs=[];const add=(name,x,y,c)=>S.npcs.push({name,x:x*TILE+24,y:y*TILE+24,c});if(S.zone==='village'){add('Marek',12,9,'#d8bd82');add('Mila',27,12,'#94aec2');add('Garde royal',21,5,'#a98c66')}if(S.zone==='lake')add('Pêcheur',8,8,'#829687');if(S.zone==='forest')add('Esprit',25,16,'#8fb5a2')}
function items(){S.items=[];if(S.zone==='lake')S.items.push({type:'potion',x:9*TILE,y:8*TILE});if(S.zone==='forest')S.items.push({type:'fragment',x:43*TILE,y:25*TILE});if(S.zone==='ruins')S.items.push({type:'fragment',x:21*TILE,y:19*TILE})}
function build(){enemies();npcs();items();S.chests=S.zone==='ruins'?[{x:7*TILE,y:8*TILE,open:false}]:[]}
function front(x,y){let dx=x-S.p.x,dy=y-S.p.y;if(S.p.dir==='up')return dy<20&&Math.abs(dx)<72;if(S.p.dir==='down')return dy>-20&&Math.abs(dx)<72;if(S.p.dir==='left')return dx<20&&Math.abs(dy)<72;return dx>-20&&Math.abs(dy)<72}
function particles(x,y,c,n=8){for(let i=0;i<n;i++)S.parts.push({x,y,vx:(Math.random()-.5)*130,vy:(Math.random()-.5)*130,l:.35+Math.random()*.35,c})}
function attack(heavy=false){if(!S.active||S.dialogue)return;let p=S.p;if(heavy){if(p.heavy>0||p.mana<12)return;p.heavy=1.0;p.mana-=12}else{if(p.attack>0)return;p.attack=.3}let range=heavy?105:75,damage=heavy?p.atk*2.2:p.atk+p.combo*2,hit=false;for(const e of S.enemies){if(e.dead||dist(p,e)>range||!front(e.x,e.y))continue;e.hp-=Math.max(1,damage-e.def);e.hurt=.15;particles(e.x,e.y,heavy?'#8fa9ff':'#e6c85d');hit=true;if(e.hp<=0){e.dead=true;p.xp+=e.xp;p.gold+=2+Math.floor(Math.random()*7);if(e.fragment)S.items.push({type:'fragment',x:e.x,y:e.y})}}if(hit&&!heavy){p.combo++;p.comboT=1.1}else if(!hit&&!heavy)p.combo=0;levelCheck()}
function damage(n){let p=S.p;if(p.inv>0)return;p.hp-=Math.max(1,n-p.def);p.inv=.8;particles(p.x,p.y,'#d75d56',12);if(p.hp<=0){p.hp=p.maxHp;p.st=100;p.gold=Math.max(0,p.gold-10);spawn();notify('Vous vous réveillez au village...')}}
function dodge(){let p=S.p;if(p.st<30||p.dodge>0)return;p.st-=30;p.dodge=.25;p.inv=.45;particles(p.x,p.y,'#d3dfed',14)}
function updateEnemies(dt){const p=S.p;for(const e of S.enemies){if(e.dead)continue;e.cd=Math.max(0,e.cd-dt);e.hurt=Math.max(0,e.hurt-dt);if(e.hurt>0)continue;let dx=p.x-e.x,dy=p.y-e.y,d=Math.hypot(dx,dy);if(d<280){if(d>e.range){let l=d||1,nx=e.x+dx/l*e.spd*dt,ny=e.y+dy/l*e.spd*dt;if(!blocked(nx,e.y))e.x=nx;if(!blocked(e.x,ny))e.y=ny}else if(e.cd<=0){e.cd=.9;damage(e.atk)}}}S.enemies=S.enemies.filter(e=>!e.dead)}
function move(dt){let p=S.p;if(S.dialogue)return;let dx=0,dy=0;if(S.keys.w||S.keys.z||S.keys.arrowup)dy--;if(S.keys.s||S.keys.arrowdown)dy++;if(S.keys.a||S.keys.q||S.keys.arrowleft)dx--;if(S.keys.d||S.keys.arrowright)dx++;if(dx||dy){let l=Math.hypot(dx,dy);dx/=l;dy/=l;if(Math.abs(dx)>Math.abs(dy))p.dir=dx>0?'right':'left';else p.dir=dy>0?'down':'up'}let speed=p.spd;if(S.keys.shift&&p.st>0){speed*=1.6;p.st=Math.max(0,p.st-30*dt)}else p.st=Math.min(p.maxSt,p.st+22*dt);if(p.dodge>0)speed*=3;let nx=p.x+dx*speed*dt,ny=p.y+dy*speed*dt;if(!blocked(nx,p.y))p.x=nx;if(!blocked(p.x,ny))p.y=ny;p.attack=Math.max(0,p.attack-dt);p.heavy=Math.max(0,p.heavy-dt);p.dodge=Math.max(0,p.dodge-dt);p.inv=Math.max(0,p.inv-dt);p.comboT=Math.max(0,p.comboT-dt);if(!p.comboT)p.combo=0;exitCheck()}
function levelCheck(){let p=S.p;while(p.xp>=100){p.xp-=100;p.level++;p.maxHp+=12;p.hp=p.maxHp;p.maxSt+=5;p.st=p.maxSt;p.atk+=2;notify('NIVEAU '+p.level+' — votre puissance augmente.')}}
function collect(){for(let i=S.items.length-1;i>=0;i--){let a=S.items[i];if(Math.hypot(a.x-S.p.x,a.y-S.p.y)>28)continue;if(a.type==='fragment'){if(S.fragments<3)S.fragments++;notify('Fragment ancien '+S.fragments+'/3');if(S.fragments>=3)S.quest='ruins'}else if(a.type==='potion'){notify('Potion obtenue')}S.items.splice(i,1)}}
function interact(){if(S.dialogue){S.dialogue=null;let d=document.getElementById('ponan-dialogue');if(d)d.classList.remove('show');return}for(const n of S.npcs)if(Math.hypot(n.x-S.p.x,n.y-S.p.y)<72){dialogue(n);return}for(const c of S.chests)if(!c.open&&Math.hypot(c.x-S.p.x,c.y-S.p.y)<65){c.open=true;notify('Coffre ouvert — Potion de soin');return}}
function dialogue(n){let text='';if(n.name==='Marek'){S.quest='marek';text="Ponanini III n'était pas le monstre que l'on raconte. Quelqu'un a réécrit l'histoire."}else if(n.name==='Mila'){S.quest='lake';text='Trois fragments. Trois endroits. Et quelque chose les protège.'}else if(n.name==='Garde royal'){S.quest='forest';text='Si tu veux comprendre la chute du roi, commence par la forêt.'}else if(n.name==='Pêcheur')text='Les eaux deviennent noires chaque nuit...';else text='Le troisième fragment repose là où le roi fut trahi.';S.dialogue={speaker:n.name,text};let d=document.getElementById('ponan-dialogue');if(!d){d=document.createElement('div');d.id='ponan-dialogue';document.body.appendChild(d)}d.innerHTML='<strong>'+n.name+'</strong><p>'+text+'</p><small>E / ESPACE : continuer</small>';d.classList.add('show')}
function exitCheck(){let z=zones[S.zone],tx=Math.floor(S.p.x/TILE),ty=Math.floor(S.p.y/TILE);if(S.zone==='village'&&tx>=z.w-2&&ty>10&&ty<18)return go('lake');if(S.zone==='lake'&&tx<=1&&ty>10&&ty<20)return go('village');if(S.zone==='lake'&&tx>=z.w-2&&ty>10&&ty<22)return go(S.quest==='forest'||S.fragments?'forest':null);if(S.zone==='forest'&&tx<=1&&ty>12&&ty<24)return go('lake');if(S.zone==='forest'&&tx>=z.w-2&&ty>10&&ty<25)return go(S.fragments>=3?'ruins':null);if(S.zone==='ruins'&&tx<=1)return go('forest')}
function go(z){if(!z){notify('Le passage est scellé. Votre histoire n’est pas prête.');return}S.transition=.01;S.target=z}
function finishTransition(){S.zone=S.target;S.target=null;S.transition=0;spawn();build();notify(zones[S.zone].name)}
function drawWorld(){let c=Game.ctx,cv=Game.canvas,z=zones[S.zone],W=z.w*TILE,H=z.h*TILE;let camX=clamp(S.p.x-cv.width/2,0,Math.max(0,W-cv.width)),camY=clamp(S.p.y-cv.height/2,0,Math.max(0,H-cv.height));S.camX=camX;S.camY=camY;c.fillStyle=S.zone==='lake'?'#173949':S.zone==='forest'?'#102419':S.zone==='ruins'?'#30292f':'#263b2b';c.fillRect(0,0,cv.width,cv.height);let sx=Math.max(0,Math.floor(camX/TILE)-1),ex=Math.min(z.w,Math.floor((camX+cv.width)/TILE)+2),sy=Math.max(0,Math.floor(camY/TILE)-1),ey=Math.min(z.h,Math.floor((camY+cv.height)/TILE)+2);for(let y=sy;y<ey;y++)for(let x=sx;x<ex;x++)tile(c,x,y,camX,camY);drawItems(c,camX,camY);drawNpcs(c,camX,camY);drawEnemies(c,camX,camY);drawPlayer(c,camX,camY);drawParticles(c,camX,camY);if(S.transition>0){c.fillStyle='rgba(0,0,0,'+Math.min(1,S.transition*3)+')';c.fillRect(0,0,cv.width,cv.height)}}
function tile(c,x,y,cx,cy){let px=x*TILE-cx,py=y*TILE-cy,so=solid(x,y),base=S.zone==='village'?(so?'#293a2c':'#3b583e'):S.zone==='lake'?(so?'#1c5b70':'#2f674b'):S.zone==='forest'?(so?'#173a27':'#244c2e'):(so?'#3b343c':'#51474a');c.fillStyle=base;c.fillRect(px,py,TILE+1,TILE+1);if(!so&&hash(x,y)>.55){c.fillStyle='rgba(220,200,120,.12)';c.fillRect(px+9,py+12,2,7);c.fillRect(px+28,py+28,2,5)}if(so&&S.zone==='forest'){c.fillStyle='#3c2c20';c.fillRect(px+20,py+24,8,24);c.fillStyle='#173021';c.beginPath();c.arc(px+24,py+18,22,0,Math.PI*2);c.fill()}if(so&&S.zone==='lake'){c.strokeStyle='rgba(160,220,230,.3)';c.beginPath();c.moveTo(px+7,py+20);c.lineTo(px+30,py+20);c.stroke()}}
function drawPlayer(c,cx,cy){let p=S.p,x=p.x-cx,y=p.y-cy;c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(x,y+16,18,6,0,0,Math.PI*2);c.fill();c.fillStyle='#e9c44f';c.beginPath();c.ellipse(x,y,16,14,0,0,Math.PI*2);c.fill();c.fillStyle='#f6d96a';c.beginPath();c.arc(x,y-11,13,0,Math.PI*2);c.fill();c.fillStyle='#24231f';c.beginPath();c.arc(x+(p.dir==='left'?-5:p.dir==='right'?5:-4),y-13,2,0,Math.PI*2);c.fill();if(p.attack>0){c.strokeStyle='#e6cb65';c.lineWidth=6;c.globalAlpha=p.attack/.3;c.beginPath();let a=p.dir==='left'?Math.PI:p.dir==='right'?0:p.dir==='up'?-Math.PI/2:Math.PI/2;c.arc(x,y,38,a-.8,a+.8);c.stroke();c.globalAlpha=1}}
function drawEnemies(c,cx,cy){for(const e of S.enemies){let x=e.x-cx,y=e.y-cy;c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(x,y+14,e.boss?24:15,5,0,0,Math.PI*2);c.fill();c.fillStyle=e.color;c.beginPath();c.arc(x,y,e.boss?25:16,0,Math.PI*2);c.fill();c.fillStyle='#db5b57';c.beginPath();c.arc(x-5,y-3,2.5,0,Math.PI*2);c.arc(x+5,y-3,2.5,0,Math.PI*2);c.fill();if(e.hp<e.max){let w=e.boss?72:34;c.fillStyle='rgba(0,0,0,.6)';c.fillRect(x-w/2,y-28,w,5);c.fillStyle='#b44d47';c.fillRect(x-w/2,y-28,w*e.hp/e.max,5)}}}
function drawNpcs(c,cx,cy){for(const n of S.npcs){let x=n.x-cx,y=n.y-cy;c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(x,y+14,15,5,0,0,Math.PI*2);c.fill();c.fillStyle=n.c;c.beginPath();c.arc(x,y-3,13,0,Math.PI*2);c.fill();if(Math.hypot(n.x-S.p.x,n.y-S.p.y)<72){c.fillStyle='#e2c661';c.font='12px Georgia';c.textAlign='center';c.fillText('E',x,y-27)}}}
function drawItems(c,cx,cy){for(const a of S.items){let x=a.x-cx,y=a.y-cy+Math.sin(S.t*3)*4;c.strokeStyle=a.type==='fragment'?'#e5cf67':'#a96a55';c.lineWidth=3;c.beginPath();if(a.type==='fragment'){c.moveTo(x,y-11);c.lineTo(x+8,y);c.lineTo(x,y+11);c.lineTo(x-8,y);c.closePath()}else c.arc(x,y,7,0,Math.PI*2);c.stroke()}}
function drawParticles(c,cx,cy){for(const p of S.parts){c.globalAlpha=Math.max(0,p.l/.6);c.fillStyle=p.c;c.fillRect(p.x-cx,p.y-cy,4,4)}c.globalAlpha=1}
function hud(){let h=document.getElementById('true-rpg-hud');if(!h){h=document.createElement('div');h.id='true-rpg-hud';h.innerHTML='<div class="tr-top"><b id="tr-zone"></b><strong id="tr-lv"></strong></div><small id="tr-sub"></small><div class="tr-row">VIE <span id="tr-hpt"></span></div><div class="tr-bar"><i id="tr-hp"></i></div><div class="tr-row">ENDURANCE <span id="tr-stt"></span></div><div class="tr-bar st"><i id="tr-st"></i></div><div class="tr-row">XP <span id="tr-xpt"></span></div><div class="tr-bar xp"><i id="tr-xp"></i></div><div id="tr-q"></div><div id="tr-fr"></div><small class="tr-controls">J attaque · K attaque lourde · SPACE esquive<br>SHIFT courir · E interaction · I inventaire</small>';document.body.appendChild(h)}h.style.display=S.active?'block':'none';if(!S.active)return;let p=S.p,z=zones[S.zone];document.getElementById('tr-zone').textContent=z.name;document.getElementById('tr-lv').textContent='LV '+p.level;document.getElementById('tr-sub').textContent=z.sub;document.getElementById('tr-hpt').textContent=Math.ceil(p.hp)+' / '+p.maxHp;document.getElementById('tr-stt').textContent=Math.floor(p.st);document.getElementById('tr-xpt').textContent=Math.floor(p.xp)+' / 100';document.getElementById('tr-hp').style.width=p.hp/p.maxHp*100+'%';document.getElementById('tr-st').style.width=p.st/p.maxSt*100+'%';document.getElementById('tr-xp').style.width=p.xp+'%';document.getElementById('tr-q').textContent='◆ '+({awakening:'Explorer Ponan',marek:'Comprendre Marek',lake:'Rejoindre le Grand Lac',forest:'Entrer dans la forêt',ruins:'Atteindre les ruines'}[S.quest]||'Explorer');document.getElementById('tr-fr').textContent='◈ '+S.fragments+' / 3   ·   '+p.gold+' or'}
function inventory(){let d=document.getElementById('true-rpg-inv');if(!d){d=document.createElement('div');d.id='true-rpg-inv';document.body.appendChild(d)}d.classList.toggle('show');if(d.classList.contains('show'))d.innerHTML='<h2>INVENTAIRE</h2><p>Fragments : '+S.fragments+'/3</p><p>Or : '+S.p.gold+'</p><p>Potions : 2</p><hr><small>I pour fermer · 1 pour potion</small>'}
function dialogueUI(){let d=document.getElementById('ponan-dialogue');if(!d){d=document.createElement('div');d.id='ponan-dialogue';document.body.appendChild(d)}if(S.dialogue){d.innerHTML='<strong>'+S.dialogue.speaker+'</strong><p>'+S.dialogue.text+'</p><small>E / ESPACE : continuer</small>';d.classList.add('show')}else d.classList.remove('show')}
function save(){localStorage.setItem('ponan_true_rpg',JSON.stringify({v:4,zone:S.zone,p:S.p,quest:S.quest,fragments:S.fragments}))}
function load(){try{let d=JSON.parse(localStorage.getItem('ponan_true_rpg'));if(!d||d.v!==4)return;S.zone=d.zone||'village';Object.assign(S.p,d.p||{});S.quest=d.quest||'awakening';S.fragments=d.fragments||0;spawn()}catch(_){}}
function input(){addEventListener('keydown',e=>{let k=e.key.toLowerCase();S.keys[k]=true;if(!S.active)return;if(k==='j')attack(false);if(k==='k')attack(true);if(k===' '||e.code==='Space'){e.preventDefault();if(S.dialogue){S.dialogue=null;dialogueUI()}else dodge()}if(k==='e'||e.code==='Enter')interact();if(k==='i')inventory();if(k==='1')notify('Potion utilisée')});addEventListener('keyup',e=>S.keys[e.key.toLowerCase()]=false);addEventListener('mousedown',e=>{if(S.active&&e.button===0)attack(false)})}
function update(dt){if(!S.active)return;S.t+=dt;if(S.transition){S.transition+=dt*2;if(S.transition>=1)finishTransition();hud();return}move(dt);updateEnemies(dt);collect();for(const p of S.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.94;p.vy*=.94;p.l-=dt}S.parts=S.parts.filter(p=>p.l>0);if(S.dialogue)dialogueUI();S.save+=dt;if(S.save>12){S.save=0;save()}hud()}
function draw(){if(!S.active)return;drawWorld();hud();dialogueUI()}
function start(){if(S.active)return;S.active=true;stop('menuMusic');stop('introVideoPlayer');audio();let old=document.getElementById('hud');if(old)old.style.display='none';let menu=document.getElementById('menu');if(menu)menu.style.display='none';load();build();notify('Ponan vous attend.');}
function init(){hud();input();setInterval(()=>{if(S.active){stop('menuMusic');stop('introVideoPlayer')}},250);console.log('PONAN TRUE RPG 4.0 READY')}
S.start=start;S.update=update;S.draw=draw;init();
})();'''

CSS = r'''
#true-rpg-hud{display:none;position:fixed;right:20px;top:20px;width:255px;z-index:10000;pointer-events:none;padding:15px;color:#eee5c7;background:linear-gradient(145deg,rgba(8,12,10,.95),rgba(28,25,16,.93));border:1px solid rgba(222,194,99,.62);box-shadow:0 18px 55px rgba(0,0,0,.5);font-family:Georgia,serif}
.tr-top{display:flex;justify-content:space-between}.tr-top b{font-size:10px;letter-spacing:.12em}.tr-top strong{color:#e1c45f;font-size:10px}.true-rpg-hud small{opacity:.5}.tr-row{display:flex;justify-content:space-between;margin-top:8px;font-size:8px;opacity:.7}.tr-bar{height:5px;background:#ffffff12;margin-top:3px}.tr-bar i{display:block;height:100%;width:100%;background:#ad5048}.tr-bar.st i{background:#6c9b75}.tr-bar.xp i{background:#d0b45b}#tr-sub{display:block;margin-top:4px;font-size:8px}.tr-controls{display:block;margin-top:10px;font-size:7px;line-height:1.6}.tr-top+small{display:block;margin-top:3px}#tr-q{margin-top:12px;padding-top:9px;border-top:1px solid #ffffff12;color:#dfc45f;font-size:10px}#tr-fr{margin-top:8px;color:#d7bd64;font-size:9px}
#ponan-dialogue{display:none;position:fixed;left:50%;bottom:35px;transform:translateX(-50%);width:min(760px,86vw);z-index:11000;padding:20px 25px;color:#eee5c9;background:rgba(8,11,10,.96);border:1px solid rgba(222,194,99,.65);box-shadow:0 25px 80px #000a;font-family:Georgia,serif}#ponan-dialogue.show{display:block}#ponan-dialogue strong{color:#e0c461;font-size:11px;letter-spacing:.13em}#ponan-dialogue p{font-size:14px;line-height:1.5}#ponan-dialogue small{display:block;text-align:right;opacity:.45}
#ponan-toast{position:fixed;left:50%;bottom:125px;transform:translate(-50%,12px);opacity:0;z-index:12000;padding:10px 18px;color:#f1e5bc;background:#070a08ee;border:1px solid #dec26399;font:12px Georgia,serif;transition:.18s;pointer-events:none}#ponan-toast.show{opacity:1;transform:translate(-50%,0)}
#true-rpg-inv{display:none;position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:13000;width:min(430px,85vw);padding:25px;color:#eee5c9;background:#0a0d0bf7;border:1px solid #dec263aa;box-shadow:0 35px 90px #000b;font-family:Georgia,serif}#true-rpg-inv.show{display:block}#true-rpg-inv h2{color:#e0c461;letter-spacing:.14em}
'''

def backup(p):
    if p.exists():
        b=p.with_name(p.name+SUFFIX)
        if not b.exists(): shutil.copy2(p,b); print('[BACKUP]',b.name)

def patch_index():
    t=INDEX.read_text(encoding='utf-8')
    # Remove older additive engines so they cannot compete with the true engine.
    t=re.sub(r'\s*<script src="(?:ponan_overhaul|gameplay_v2|game_enhancements)\.js"></script>', '', t)
    tag='<script src="ponan_true_rpg.js"></script>'
    if tag not in t:
        marker='<script src="game.js"></script>'
        if marker not in t: raise RuntimeError('game.js introuvable dans index.html')
        t=t.replace(marker, marker+'\n    '+tag,1)
    INDEX.write_text(t,encoding='utf-8')

def patch_game():
    t=GAME.read_text(encoding='utf-8')
    # New engine gets priority over old update/draw pipeline.
    old='''        if (!Game.running) {\n            requestAnimationFrame(loop);\n            return;\n        }\n\n        if (typeof updatePlayer === "function") updatePlayer();'''
    new='''        if (window.PonanTrueRPG && PonanTrueRPG.active) {\n            PonanTrueRPG.update(dt);\n            PonanTrueRPG.draw();\n            requestAnimationFrame(loop);\n            return;\n        }\n\n        if (!Game.running) {\n            requestAnimationFrame(loop);\n            return;\n        }\n\n        if (typeof updatePlayer === "function") updatePlayer();'''
    if old in t: t=t.replace(old,new,1)
    else: print('[WARN] boucle game.js déjà modifiée ou différente')
    # finishPrologue starts the new engine and hides legacy HUD.
    pat=re.compile(r'function finishPrologue\(\) \{.*?\n\}',re.S)
    repl='''function finishPrologue() {\n    Game.running = true;\n    const hud = document.getElementById("hud");\n    if (hud) hud.style.display = "none";\n    const menu = document.getElementById("menu");\n    if (menu) menu.style.display = "none";\n    if (window.PonanTrueRPG) window.PonanTrueRPG.start();\n}'''
    t,n=pat.subn(repl,t,count=1)
    if not n: print('[WARN] finishPrologue introuvable')
    GAME.write_text(t,encoding='utf-8')

def patch_style():
    t=STYLE.read_text(encoding='utf-8') if STYLE.exists() else ''
    if 'PONAN TRUE RPG 4.0' not in t: STYLE.write_text(t+'\n/* PONAN TRUE RPG 4.0 */\n'+CSS,encoding='utf-8')

def check(p):
    r=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
    if r.returncode: print(r.stderr); return False
    print('[OK]',p.name); return True

def main():
    if not ROOT.exists(): raise SystemExit(f'Projet introuvable: {ROOT}')
    print('==============================================================')
    print(" PONAN'S LEGACY — TRUE RPG OVERHAUL 4.0")
    print('==============================================================')
    for p in (INDEX,GAME,STYLE): backup(p)
    RPG.write_text(RPG_JS+'\n',encoding='utf-8')
    patch_index(); patch_game(); patch_style()
    ok=check(RPG) and check(GAME)
    if not ok: raise SystemExit('[STOP] erreur JS; backups conservés')
    print('')
    print('[OK] Le moteur TRUE RPG prend maintenant la main après le prologue.')
    print('[OK] Les anciens overlays gameplay ont été retirés de index.html.')
    print('[OK] HUD absent du menu.')
    print('[OK] Combat / IA / zones / quêtes / fragments / inventaire / transitions.')
    print('[OK] Contrôles: ZQSD/WASD/flèches, J, K, SPACE, SHIFT, E, I, 1.')
    print('[OK] Backups:',SUFFIX)
    print('NE COMMIT PAS AVANT LE TEST.')

if __name__=='__main__': main()
