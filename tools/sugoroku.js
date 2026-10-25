// 名前入り「おしょうがつ かぞくすごろく」PDF（A4よこ・ボード＋サイコロ＋コマ）
// node sugoroku.js 子どもの名前 くん|ちゃん|さん "パパ,ママ,おばあちゃん" 出力.pdf
const {chromium}=require('playwright');
const [,,cn='はると',suf='くん',fam='パパ,ママ',out='sugoroku.pdf']=process.argv;
const KID=cn+suf,F=fam.split(/[,、]/).map(s=>s.trim()).filter(Boolean),P=(i)=>F[i%F.length]||'おうちのひと';
const EV=[['スタート',0],[`${KID}に ハイタッチ！`,1],['おしょうがつの うたを うたう',0],[`${P(0)}の いいところを 1つ いう`,0],['こまが まわった！',2],[`${P(1)}と じゃんけん。かったら`,3],
 ['おもちを たべすぎた…',-2],[`${KID}の すきな たべものを あてよう`,0],['たこが そらたかく！',2],['いちかい やすみ',0],[`みんなで「あけまして おめでとう」`,1],[`${P(2)}の まねを する`,0],
 ['おとしだまを もらった！',3],['ふくわらいで わらった',0],['ころんで しまった',-3],[`${P(0)}に ことしの めあてを いう`,0],['はつゆめは ふじさん！',2],[`${KID}の ことしの めあては？`,0],
 ['かがみもちを かざった',1],['もういちど サイコロ！',0],[`${P(1)}を ぎゅっと する`,1],['ねぼうした…',-2],['かるたで 1まい とった',1],[`みんなで ${KID}を ほめる`,2],
 ['おせちの くろまめ ぱくっ',0],['スタートへ もどる…？ うそ！',1],[`${P(2)}に「ありがとう」`,1],['ゴール まで あと すこし',0],['ゴール！ おめでとう',0]];
const COLS=8,ROWS=4,N=EV.length;// 29 squares in a snake
const C=['#e8504a','#f2b93b','#4fae6a','#7fb8e8','#f4a7b9'];
let sq='',path='';const pos=[];
for(let i=0;i<N;i++){const r=(i/COLS)|0,c0=i%COLS,c=r%2?COLS-1-c0:c0;const x=11+c*35.5,y=32+r*42;pos.push([x+17,y+17]);}
pos.forEach((p,i)=>{if(i)path+=`L${p[0]} ${p[1]}`;else path+=`M${p[0]} ${p[1]}`;});
EV.forEach((e,i)=>{const [x,y]=pos[i];const st=i===0,gl=i===N-1,col=st?'#4fae6a':gl?'#e8504a':C[i%5];
  const mv=e[1]>0?`<tspan fill="#2f8f4e">${e[1]}すすむ</tspan>`:e[1]<0?`<tspan fill="#d8343e">${-e[1]}もどる</tspan>`:'';
  sq+=`<g><rect x="${x-17}" y="${y-17}" width="34" height="34" rx="5" fill="${st||gl?'#fff3d6':'#fff'}" stroke="${col}" stroke-width="1.6"/>
  <circle cx="${x-12}" cy="${y-12}" r="4" fill="${col}"/><text x="${x-12}" y="${y-10.6}" font-size="4" text-anchor="middle" fill="#fff" font-weight="900">${i}</text>
  <foreignObject x="${x-16}" y="${y-8}" width="32" height="24"><div xmlns="http://www.w3.org/1999/xhtml" class="e">${e[0]}<br/><b>${e[1]>0?`<span class="g">${e[1]}すすむ</span>`:e[1]<0?`<span class="r">${-e[1]}もどる</span>`:''}</b></div></foreignObject></g>`;});
const mochi=(x,y,r)=>`<g transform="translate(${x},${y})"><rect x="${-r*.8}" y="${r*.35}" width="${r*1.6}" height="${r*.35}" fill="#d9a441" stroke="#3a3a3a" stroke-width="${r/10}"/><ellipse cy="${r*.15}" rx="${r*.8}" ry="${r*.35}" fill="#fff" stroke="#3a3a3a" stroke-width="${r/10}"/><ellipse cy="${-r*.3}" rx="${r*.6}" ry="${r*.3}" fill="#fff" stroke="#3a3a3a" stroke-width="${r/10}"/><circle cy="${-r*.68}" r="${r*.22}" fill="#ff9a3d" stroke="#3a3a3a" stroke-width="${r/10}"/></g>`;
const fuji=(x,y,r)=>`<g transform="translate(${x},${y})"><circle cx="${r*.45}" cy="${-r*.45}" r="${r*.35}" fill="#e8504a"/><path d="M${-r} ${r*.6}L${-r*.25} ${-r*.35}H${r*.25}L${r} ${r*.6}Z" fill="#7fb8e8" stroke="#3a3a3a" stroke-width="${r/10}"/><path d="M${-r*.25} ${-r*.35}H${r*.25}L${r*.42} ${-r*.08}L${r*.18} 0L0 ${-r*.12}L${-r*.18} 0L${-r*.42} ${-r*.08}Z" fill="#fff" stroke="#3a3a3a" stroke-width="${r/10}"/></g>`;
// dice net + pieces page
const dots={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
const face=(x,y,n)=>`<rect x="${x}" y="${y}" width="30" height="30" fill="#fff" stroke="#3a3a3a" stroke-width=".8"/>`+dots[n].map(d=>`<circle cx="${x+15+d[0]*8}" cy="${y+15+d[1]*8}" r="${n===1?4:2.8}" fill="${n===1?'#e8504a':'#3a3a3a'}"/>`).join('');
const net=[[1,0,1],[0,1,2],[1,1,3],[2,1,4],[3,1,5],[1,2,6]].map(([c,r,n])=>face(30+c*30,40+r*30,n)).join('');
const people=[KID,...F];const pieces=people.map((p,i)=>`<g transform="translate(${170+(i%3)*38},${50+((i/3)|0)*46})"><path d="M-14 22h28l-4-6h-20z" fill="#fff" stroke="#3a3a3a" stroke-width=".7" stroke-dasharray="2 1.5"/><circle r="14" fill="${C[i%5]}" stroke="#3a3a3a" stroke-width="1"/><foreignObject x="-13" y="-7" width="26" height="14"><div xmlns="http://www.w3.org/1999/xhtml" class="pn">${p}</div></foreignObject></g>`).join('');
const html=`<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4 landscape;margin:0}body{margin:0;font-family:"Noto Sans CJK JP",sans-serif}
.p{width:297mm;height:209mm;background:#fff8ee;overflow:hidden;page-break-after:always}svg{display:block;width:297mm;height:209mm}
.e{font-size:3.1px;line-height:1.3;font-weight:700;color:#3b2a1e;text-align:center;word-break:keep-all;overflow-wrap:anywhere;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center}
.g{color:#2f8f4e}.r{color:#d8343e}.pn{font-size:4.2px;font-weight:900;color:#fff;text-align:center;word-break:keep-all;line-height:1.1;height:100%;display:flex;align-items:center;justify-content:center}
</style></head><body>
<section class="p"><svg viewBox="0 0 297 209"><rect x="3" y="3" width="291" height="203" rx="6" fill="none" stroke="#e8504a" stroke-width="2"/>
<text x="148" y="20" font-size="11" text-anchor="middle" fill="#e8504a" font-weight="900">${KID}の おしょうがつ かぞくすごろく</text>
<path d="${path}" stroke="#e0c58f" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>${sq}
${mochi(276,16,7)}${fuji(22,16,8)}<text x="148" y="203" font-size="4" text-anchor="middle" fill="#a08a6a">あそびかた：サイコロを ふって すすもう。マスに かいてあることを やってみよう！</text></svg></section>
<section class="p"><svg viewBox="0 0 297 209"><rect x="3" y="3" width="291" height="203" rx="6" fill="none" stroke="#4fae6a" stroke-width="2"/>
<text x="75" y="30" font-size="8" text-anchor="middle" fill="#3b2a1e" font-weight="900">サイコロ（きって くみたてよう）</text>${net}
<text x="215" y="30" font-size="8" text-anchor="middle" fill="#3b2a1e" font-weight="900">コマ（きって おって たてよう）</text>${pieces}
<text x="148" y="200" font-size="4" text-anchor="middle" fill="#a08a6a">はさみと のりは おうちのひとと いっしょに つかおう。</text></svg></section>
</body></html>`;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();await p.setContent(html);await p.pdf({path:out,width:'297mm',height:'210mm',printBackground:true});await b.close();console.log('ok',out);})();
