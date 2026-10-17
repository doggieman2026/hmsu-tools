// めいろドリル PDF 生成: node mazebook.js 名前 出力.pdf 問題数 easy|normal|hard
const fs=require('fs');const { chromium } = require('playwright');
const js=fs.readFileSync('/home/claude/hmsu-tools/meiro/index.html','utf8').split('<script>')[1].split('</script>')[0];
const m={exports:{}};new Function('module',js)(m);const {makeMaze,solve}=m.exports;
const name=process.argv[2]||'はなこ', out=process.argv[3]||'book.pdf', N=Number(process.argv[4]||50), lv=process.argv[5]||'normal';
const P={easy:[4,10,'やさしめ','3〜4さい'],normal:[5,14,'ふつう','5〜6さい'],hard:[8,20,'むずかしめ','しょうがくせい']}[lv];
const levels=Array.from({length:N},(_,i)=>Math.round(P[0]+i*((P[1]-P[0])/(N-1))));
const seedBase=[...name].reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,7)^{easy:1,normal:2,hard:3}[lv]*99991;
const seeds=levels.map((_,i)=>(seedBase+i*7919)>>>0);
const THEME=process.argv[6]||'';const HW=THEME==='halloween';
const C=HW?['#ff8a3d','#9b6bd6','#ffc94d','#7bc96f','#ff8a3d','#b58cff']:['#f4a7b9','#8fd3c1','#ffd166','#9cc5ff','#c9a7f4','#ffb38a'];
// halloween icons (original simple shapes)
const pumpkin=(x,y,r)=>`<g transform="translate(${x},${y})"><ellipse cx="${-r*.45}" cy="0" rx="${r*.55}" ry="${r*.8}" fill="#ff8a3d" stroke="#3a3a3a" stroke-width="${r/10}"/><ellipse cx="${r*.45}" cy="0" rx="${r*.55}" ry="${r*.8}" fill="#ff8a3d" stroke="#3a3a3a" stroke-width="${r/10}"/><ellipse cx="0" cy="0" rx="${r*.55}" ry="${r*.85}" fill="#ffa25a" stroke="#3a3a3a" stroke-width="${r/10}"/><rect x="${-r*.1}" y="${-r*1.15}" width="${r*.2}" height="${r*.35}" rx="${r*.05}" fill="#6b8e3a"/><path d="M${-r*.35} ${-r*.15}l${r*.15} ${-r*.2}l${r*.15} ${r*.2}zM${r*.05} ${-r*.15}l${r*.15} ${-r*.2}l${r*.15} ${r*.2}z" fill="#3a3a3a"/><path d="M${-r*.4} ${r*.25}q${r*.4} ${r*.35} ${r*.8} 0" stroke="#3a3a3a" stroke-width="${r/9}" fill="none" stroke-linecap="round"/></g>`;
const ghost=(x,y,r)=>`<g transform="translate(${x},${y})"><path d="M${-r*.7} ${r*.9}V0a${r*.7} ${r*.7} 0 0 1 ${r*1.4} 0V${r*.9}l${-r*.35} ${-r*.25}l${-r*.35} ${r*.25}l${-r*.35} ${-r*.25}z" fill="#fff" stroke="#3a3a3a" stroke-width="${r/10}" stroke-linejoin="round"/><circle cx="${-r*.25}" cy="${-r*.05}" r="${r*.1}" fill="#3a3a3a"/><circle cx="${r*.25}" cy="${-r*.05}" r="${r*.1}" fill="#3a3a3a"/></g>`;
const bat=(x,y,r)=>`<path transform="translate(${x},${y})" d="M0 ${-r*.2}C${r*.3} ${-r*.6} ${r*.9} ${-r*.5} ${r*1.2} ${-r*.1}C${r*.9} 0 ${r*.7} ${r*.1} ${r*.6} ${r*.35}C${r*.45} ${r*.15} ${r*.25} ${r*.15} 0 ${r*.35}C${-r*.25} ${r*.15} ${-r*.45} ${r*.15} ${-r*.6} ${r*.35}C${-r*.7} ${r*.1} ${-r*.9} 0 ${-r*1.2} ${-r*.1}C${-r*.9} ${-r*.5} ${-r*.3} ${-r*.6} 0 ${-r*.2}z" fill="#5a4a78"/>`;
const star=(x,y,r,f)=>{let p='';for(let i=0;i<10;i++){const a=Math.PI/5*i-Math.PI/2,rr=i%2?r*.45:r;p+=`${x+rr*Math.cos(a)},${y+rr*Math.sin(a)} `;}return `<polygon points="${p}" fill="${f}" stroke="#3a3a3a" stroke-width="${r/9}" stroke-linejoin="round"/>`;};
function maze(cols,seed,ans,cell){const rows=Math.round(cols*1.3),pad=48;const W=cols*cell+pad*2,H=rows*cell+pad*2;const w=makeMaze(cols,rows,seed);let d='';
w.forEach((x,i)=>{const X=pad+(i%cols)*cell,Y=pad+((i/cols)|0)*cell;if(x[0]&&i!==0)d+=`M${X} ${Y}h${cell}`;if(x[1])d+=`M${X+cell} ${Y}v${cell}`;if(x[2]&&i!==cols*rows-1)d+=`M${X} ${Y+cell}h${cell}`;if(x[3])d+=`M${X} ${Y}v${cell}`;});
let s=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><path d="${d}" stroke="#3a3a3a" stroke-width="${cell/8}" stroke-linecap="round" fill="none"/>`;
if(ans){const p=solve(w,cols,rows).map(c=>`${pad+(c%cols)*cell+cell/2},${pad+((c/cols)|0)*cell+cell/2}`);p.unshift(`${pad+cell/2},${pad-14}`);p.push(`${W-pad-cell/2},${H-pad+14}`);s+=`<polyline points="${p.join(' ')}" stroke="#ff8a5c" stroke-width="${cell*0.3}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".85"/>`;}
// スタート：みどりの旗、ゴール：ほし
const sx=pad+cell/2, gx=W-pad-cell/2;
s+=`<g><circle cx="${sx}" cy="${pad-22}" r="15" fill="#8fd3c1" stroke="#3a3a3a" stroke-width="2.5"/><path d="M${sx} ${pad-14}v-18" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M${sx-6} ${pad-24}l6 -8l6 8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="rotate(180 ${sx} ${pad-24})"/></g>`;
s+=`<text x="${sx+22}" y="${pad-16}" font-size="17" font-weight="900" fill="#2f8f78">スタート</text>`;
s+=star(gx,H-pad+24,17,'#ffd166')+`<text x="${gx-24}" y="${H-pad+31}" font-size="17" font-weight="900" fill="#e0703a" text-anchor="end">ゴール</text></svg>`;return s;}
const deco=(n)=>{let s='';const r=(i)=>{let x=Math.sin(seedBase+i*99.7)*10000;return x-Math.floor(x);};for(let i=0;i<n;i++)s+=`<circle cx="${r(i)*100}%" cy="${r(i+50)*100}%" r="${4+r(i+9)*7}" fill="${C[i%6]}" opacity=".55"/>`;return s;};
let pages='';
// 表紙
let dots='';for(let i=0;i<N;i++){dots+=`<div class="dot" style="border-color:${C[(i/10|0)%6]}">${i+1}</div>`;}
pages+=`<section class="p cover"><svg class="bg" width="100%" height="100%">${deco(26)}</svg>${HW?`<svg class="hw" viewBox="0 0 210 297">${pumpkin(30,262,16)+pumpkin(180,265,13)+ghost(178,40,13)+ghost(28,52,10)+bat(105,22,9)+bat(188,132,6)+bat(22,150,6)}</svg>`:''}
<div class="ribbon">${P[2]}・${P[3]}</div>
<div class="nameplate"><span class="nm">${name}</span><span class="no">の</span></div>
<h1 class="big">${HW?'ハロウィンめいろ':'めいろドリル'}</h1>
<div class="stars"><svg viewBox="0 0 300 60" width="300">${star(40,30,24,'#f4a7b9')+star(150,30,28,'#ffd166')+star(260,30,24,'#8fd3c1')}</svg></div>
<p class="howto">できたら ばんごうに いろを ぬろう！</p><div class="dots">${dots}</div>
<p class="cnt">ぜんぶで ${N}もん</p></section>`;
levels.forEach((c,i)=>{const st=1+Math.floor(i*5/N);
pages+=`<section class="p"><header><div class="tag" style="background:${C[i%6]}">${name}の めいろ</div>${HW?`<svg width="16mm" height="14mm" viewBox="-20 -20 40 36">${i%3===0?pumpkin(0,0,14):i%3===1?ghost(0,-2,13):bat(0,0,14)}</svg>`:''}<div class="num">No.${i+1}<span>${'★'.repeat(st)}<i>${'★'.repeat(5-st)}</i></span></div></header>
<div class="m">${maze(c,seeds[i],false,30)}</div>
<footer><div class="date">　　がつ　　にち</div><div class="seal">できたら<br>シールを<br>はろう</div></footer></section>`;});
let ans='';levels.forEach((c,i)=>{if(i%6===0)ans+=(i?'</div></section>':'')+`<section class="p"><header><div class="tag" style="background:#ffd166">こたえ</div></header><div class="g">`;ans+=`<div class="a"><p>No.${i+1}</p>${maze(c,seeds[i],true,30)}</div>`;});
pages+=ans+'</div></section>';
const html=`<html><head><meta charset="utf-8"><style>@page{size:A4;margin:0}
body{font-family:"Noto Sans CJK JP",sans-serif;margin:0;color:#3a3a3a}
.p{page-break-after:always;width:210mm;height:297mm;box-sizing:border-box;padding:12mm 14mm;display:flex;flex-direction:column;align-items:center;gap:5mm;position:relative;overflow:hidden}.p:last-child{page-break-after:auto}
header{width:100%;display:flex;justify-content:space-between;align-items:center}
.tag{font-size:22pt;font-weight:900;padding:2mm 8mm;border-radius:20mm;border:2.5px solid #3a3a3a;color:#3a3a3a}
.num{font-size:15pt;font-weight:900;display:flex;flex-direction:column;align-items:flex-end;line-height:1.2}.num span{color:#ffb000;font-size:13pt;letter-spacing:1px}.num i{color:#ddd;font-style:normal}
.m{flex:1;width:100%;display:flex;justify-content:center;align-items:center;border:3px solid #3a3a3a;border-radius:8mm;padding:4mm;box-sizing:border-box;min-height:0}.m svg{max-height:100%;max-width:100%}
footer{width:100%;display:flex;justify-content:space-between;align-items:center}
.date{font-size:14pt;border-bottom:2px dashed #aaa;padding:0 4mm 1mm}
.seal{width:30mm;height:30mm;border-radius:50%;border:2.5px dashed #f4a7b9;display:flex;align-items:center;justify-content:center;text-align:center;font-size:10pt;font-weight:700;color:#e58aa0;line-height:1.3}
.cover{justify-content:center;gap:7mm;background:${HW?'#fff4e8':'#fffaf0'}}.cover .hw{position:absolute!important;left:0;top:0;width:100%;height:100%}.cover .bg{position:absolute;inset:0}.cover>*{position:relative}
.ribbon{background:#8fd3c1;border:3px solid #3a3a3a;border-radius:20mm;padding:2mm 10mm;font-size:16pt;font-weight:900}
.nameplate{background:#fff;border:4px solid #3a3a3a;border-radius:14mm;padding:6mm 14mm;box-shadow:0 3mm 0 #f4a7b9;display:flex;align-items:baseline;gap:3mm}
.nm{font-size:${name.length>6?40:56}pt;font-weight:900;color:#e0703a}.no{font-size:28pt;font-weight:900}
.big{font-size:52pt;font-weight:900;margin:0;letter-spacing:2px;-webkit-text-stroke:0}
.howto{font-size:14pt;font-weight:700;margin:0}.cnt{font-size:12pt;margin:0;color:#777}
.dots{display:grid;grid-template-columns:repeat(10,13mm);gap:2.5mm;background:#fff;padding:5mm;border-radius:6mm;border:2.5px solid #3a3a3a}
.dot{width:13mm;height:13mm;border-radius:50%;border:2.5px solid;box-sizing:border-box;display:flex;align-items:center;justify-content:center;font-size:10pt;font-weight:700}
.g{display:grid;grid-template-columns:repeat(3,1fr);gap:5mm;width:100%}.a p{margin:0;font-size:10pt;text-align:center;font-weight:700}.a svg{width:100%}</style></head><body>${pages}</body></html>`;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();await p.setContent(html);await p.pdf({path:out,width:'210mm',height:'297mm',printBackground:true});await b.close();console.log('ok')})();
