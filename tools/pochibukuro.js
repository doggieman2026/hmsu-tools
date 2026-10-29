// 名前入り「おとしだま ぽち袋」PDF（A4よこ・1ページに2枚・切って折って作る展開図）
// node pochibukuro.js "はるとくん,ゆいちゃん" "おばあちゃん" 出力.pdf ["ことしも げんきでね"]
// 1人につき4がら（ひつじ・ふじさん・おもち・こま）。2027年は未（ひつじ）年。
const {chromium}=require('playwright');
const [,,kids='はるとくん',from='おばあちゃん',out='pochi.pdf',msg='ことしも げんきでね']=process.argv;
const K=kids.split(/[,、]/).map(s=>s.trim()).filter(Boolean);
const SW=r=>`stroke="#3a3a3a" stroke-width="${(r/10).toFixed(2)}" stroke-linejoin="round"`;
const sheep=(x,y,r)=>{let w='';for(let i=0;i<9;i++){const a=i/9*6.283;w+=`<circle cx="${(Math.cos(a)*r*.62).toFixed(2)}" cy="${(Math.sin(a)*r*.42).toFixed(2)}" r="${r*.3}" fill="#fff" ${SW(r)}/>`;}
  return `<g transform="translate(${x},${y})"><rect x="${-r*.45}" y="${r*.3}" width="${r*.16}" height="${r*.45}" rx="${r*.06}" fill="#3a3a3a"/><rect x="${r*.25}" y="${r*.3}" width="${r*.16}" height="${r*.45}" rx="${r*.06}" fill="#3a3a3a"/>${w}<ellipse rx="${r*.62}" ry="${r*.42}" fill="#fff"/>
  <ellipse cx="${r*.72}" cy="${-r*.12}" rx="${r*.28}" ry="${r*.24}" fill="#5a4a42" ${SW(r)}/><circle cx="${r*.8}" cy="${-r*.18}" r="${r*.05}" fill="#fff"/><path d="M${r*.52} ${-r*.3}q${-r*.18} ${-r*.05} ${-r*.14} ${r*.14}" fill="#f4a7b9" ${SW(r)}/>
  <circle cx="${-r*.1}" cy="${-r*.05}" r="${r*.1}" fill="#f4a7b9" opacity=".7"/></g>`;};
const mochi=(x,y,r)=>`<g transform="translate(${x},${y})"><rect x="${-r*.8}" y="${r*.35}" width="${r*1.6}" height="${r*.35}" fill="#d9a441" ${SW(r)}/><ellipse cy="${r*.15}" rx="${r*.8}" ry="${r*.35}" fill="#fff" ${SW(r)}/><ellipse cy="${-r*.3}" rx="${r*.6}" ry="${r*.3}" fill="#fff" ${SW(r)}/><circle cy="${-r*.68}" r="${r*.22}" fill="#ff9a3d" ${SW(r)}/><path d="M${-r*.05} ${-r*.9}l${r*.25} ${-r*.12}" stroke="#4fae6a" stroke-width="${r/7}"/></g>`;
const fuji=(x,y,r)=>`<g transform="translate(${x},${y})"><circle cx="${r*.45}" cy="${-r*.45}" r="${r*.35}" fill="#e8504a"/><path d="M${-r} ${r*.6}L${-r*.25} ${-r*.35}H${r*.25}L${r} ${r*.6}Z" fill="#7fb8e8" ${SW(r)}/><path d="M${-r*.25} ${-r*.35}H${r*.25}L${r*.42} ${-r*.08}L${r*.18} 0L0 ${-r*.12}L${-r*.18} 0L${-r*.42} ${-r*.08}Z" fill="#fff" ${SW(r)}/></g>`;
const koma=(x,y,r)=>`<g transform="translate(${x},${y})"><path d="M${-r*.8} ${-r*.1}L0 ${-r*.5}L${r*.8} ${-r*.1}L0 ${r*.7}Z" fill="#ffc94d" ${SW(r)}/><path d="M${-r*.8} ${-r*.1}L${r*.8} ${-r*.1}" stroke="#e8504a" stroke-width="${r/6}"/><path d="M0 ${-r*.5}V${-r*.85}" stroke="#3a3a3a" stroke-width="${r/7}"/></g>`;
const D=[{ic:sheep,bg:'#fde7ec',ac:'#e8504a',t:'ひつじどし'},{ic:fuji,bg:'#e6f1fb',ac:'#3a76b8',t:'ふじさん'},{ic:mochi,bg:'#fff4d6',ac:'#d9822b',t:'おもち'},{ic:koma,bg:'#e8f5e9',ac:'#2f8f4e',t:'こままわし'}];
// 展開図：上ぶた(後ろ面から) / 前面+後ろ面 / のりしろ(右) / 下ぶた(前面から)
const PW=56,PH=92,TAB=8,TOP=22,BOT=14;
function net(ox,oy,kid,d){const fx=ox,fy=oy+TOP,bx=fx+PW,g=[];
  const cut=`M${fx} ${fy}V${fy+PH}L${fx+3} ${fy+PH+BOT}H${fx+PW-3}L${fx+PW} ${fy+PH}H${bx+PW}l${TAB} -4V${fy+4}l${-TAB} -4H${fx+PW}C${fx+PW} ${oy+8} ${fx+PW*0.5+10} ${oy} ${fx+PW/2} ${oy}C${fx+PW*0.5-10} ${oy} ${fx} ${oy+8} ${fx} ${fy}Z`;
  g.push(`<rect x="${fx}" y="${fy}" width="${PW}" height="${PH}" fill="${d.bg}"/><rect x="${bx}" y="${fy}" width="${PW}" height="${PH}" fill="#fffdf8"/>`);
  g.push(`<path d="M${fx} ${fy}C${fx} ${oy+8} ${fx+PW*0.5-10} ${oy} ${fx+PW/2} ${oy}C${fx+PW*0.5+10} ${oy} ${fx+PW} ${oy+8} ${fx+PW} ${fy}Z" fill="#f3efe6"/><text x="${fx+PW/2}" y="${oy+14}" font-size="2.6" text-anchor="middle" fill="#a09080">うしろへ おって ふた</text>`);
  g.push(`<path d="M${fx} ${fy+PH}L${fx+3} ${fy+PH+BOT}H${fx+PW-3}L${fx+PW} ${fy+PH}Z" fill="#f3efe6"/><path d="M${bx+PW} ${fy}l${TAB} 4V${fy+PH-4}l${-TAB} 4Z" fill="#f3efe6"/>`);
  // front
  const cx=fx+PW/2;
  g.push(`<rect x="${fx+3}" y="${fy+3}" width="${PW-6}" height="${PH-6}" rx="3" fill="none" stroke="${d.ac}" stroke-width=".8"/>`);
  g.push(`<text x="${cx}" y="${fy+16}" font-size="8.2" text-anchor="middle" fill="${d.ac}" font-weight="900" letter-spacing=".6">おとしだま</text>`);
  g.push(d.ic(cx,fy+44,15));
  g.push(`<rect x="${fx+6}" y="${fy+66}" width="${PW-12}" height="16" rx="8" fill="#fff" stroke="${d.ac}" stroke-width=".7"/>`);
  const fs=Math.min(7,40/(kid.length+1));
  g.push(`<text x="${cx}" y="${fy+76.4}" font-size="${fs}" text-anchor="middle" fill="#3b2a1e" font-weight="900">${kid}へ</text>`);
  g.push(`<text x="${cx}" y="${fy+PH-4.5}" font-size="2.8" text-anchor="middle" fill="${d.ac}" font-weight="700">2027 ${d.t}</text>`);
  // back
  const bcx=bx+PW/2;
  g.push(`<text x="${bcx}" y="${fy+30}" font-size="4.6" text-anchor="middle" fill="#7a5a3a" font-weight="700">${msg}</text>`);
  g.push(d.ic(bcx,fy+50,7));
  g.push(`<text x="${bcx}" y="${fy+74}" font-size="${Math.min(6,40/(from.length+1))}" text-anchor="middle" fill="#3b2a1e" font-weight="900">${from}より</text>`);
  // lines
  g.push(`<path d="${cut}" fill="none" stroke="#9a9a9a" stroke-width=".35"/>`);
  g.push(`<path d="M${bx} ${fy}V${fy+PH}M${fx} ${fy+PH}H${fx+PW}M${fx} ${fy}H${fx+PW}M${bx+PW} ${fy}V${fy+PH}" stroke="#9a9a9a" stroke-width=".35" stroke-dasharray="1.6 1.2"/>`);
  g.push(`<text x="${fx+PW/2}" y="${fy+PH+BOT-3.5}" font-size="2.6" text-anchor="middle" fill="#a09080">のり</text><text x="${bx+PW+TAB/2}" y="${fy+PH/2}" font-size="2.6" text-anchor="middle" fill="#a09080" writing-mode="tb">のり</text>`);
  return g.join('');}
const bags=[];K.forEach(k=>D.forEach(d=>bags.push([k,d])));
let pages='';for(let i=0;i<bags.length;i+=2){let s='';[0,1].forEach(j=>{const b=bags[i+j];if(b)s+=net(14+j*144,30,b[0],b[1]);});
  pages+=`<section class="p"><svg viewBox="0 0 297 210">${s}
  <text x="148.5" y="14" font-size="6" text-anchor="middle" fill="#3b2a1e" font-weight="900">おとしだま ぽち袋</text>
  <text x="148.5" y="200" font-size="3.4" text-anchor="middle" fill="#8a7a6a">つくりかた：①そとの せん（グレー）で きる ②てんせんで おる ③「のり」の ところを はる。はさみは おうちのひとと いっしょに。</text></svg></section>`;}
const html=`<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4 landscape;margin:0}body{margin:0;font-family:"Noto Sans CJK JP",sans-serif}
.p{width:297mm;height:209mm;overflow:hidden;page-break-after:always;background:#fff}svg{display:block;width:297mm;height:209mm}</style></head><body>${pages}</body></html>`;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();await p.setContent(html);await p.pdf({path:out,width:'297mm',height:'210mm',printBackground:true});await b.close();console.log('ok',out,bags.length+'まい');})();
