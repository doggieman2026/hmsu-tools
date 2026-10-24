// 名前入り「クリスマスまで よいこミッション」カレンダー PDF
// node advent.js 名前 くん|ちゃん|さん 出力.pdf
const {chromium}=require('playwright');
const [,,name='はると',suf='くん',out='advent.pdf']=process.argv;const NM=name+suf;
const M=['おもちゃを かたづける','「ありがとう」を 3かい いう','くつを そろえる','おさらを はこぶ','はみがきを じぶんで する','えほんを 1さつ よむ',
'おうちのひとの かたを たたく','すききらい しないで たべる','げんきに「おはよう」','ふくを たたむ','おふろそうじを てつだう','ともだちに やさしくする',
'はやねを する','テーブルを ふく','かぞくの えを かく','じぶんで きがえる','せんたくものを はこぶ','「ごめんね」が いえた',
'ゴミを すてる','ごはんの じゅんびを てつだう','サンタさんに てがみを かく','へやを きれいにする','かぞくに「だいすき」','いいこで ねる'];
const C=['#e85a5a','#4fae6a','#f2b93b','#7fb8e8'];
const star=(x,y,r)=>{let p='';for(let i=0;i<10;i++){const a=Math.PI/5*i-Math.PI/2,rr=i%2?r*.45:r;p+=`${x+rr*Math.cos(a)},${y+rr*Math.sin(a)} `;}return `<polygon points="${p}" fill="#fff" stroke="#b8862a" stroke-width="1.2" stroke-linejoin="round"/>`;};
let cells='';M.forEach((m,i)=>{const c=i%4,r=(i/4)|0,x=8+c*48.5,y=62+r*37,col=C[(c+r)%4],last=i===23;
  cells+=`<g><rect x="${x}" y="${y}" width="45" height="34" rx="4" fill="${last?'#fff3d6':'#fff'}" stroke="${col}" stroke-width="1.4"/>
  <circle cx="${x+7}" cy="${y+7}" r="5" fill="${col}"/><text x="${x+7}" y="${y+9}" font-size="5.2" text-anchor="middle" fill="#fff" font-weight="900">${i+1}</text>
  ${star(x+37.5,y+8,5.5)}<foreignObject x="${x+2}" y="${y+14}" width="41" height="19"><div xmlns="http://www.w3.org/1999/xhtml" class="m">${m}${last?' 🎁':''}</div></foreignObject></g>`;});
const html=`<!doctype html><html><head><meta charset="utf-8"><style>@page{size:A4;margin:0}body{margin:0;font-family:"Noto Sans CJK JP",sans-serif}
.p{width:210mm;height:296mm;background:#fffaf0;overflow:hidden}svg{display:block;width:210mm;height:296mm}.m{font-size:4.1px;line-height:1.35;color:#3b2a1e;font-weight:700;text-align:center;word-break:keep-all;overflow-wrap:anywhere;display:flex;align-items:center;justify-content:center;height:100%}
</style></head><body><section class="p"><svg viewBox="0 0 210 297">
<rect x="3" y="3" width="204" height="291" rx="6" fill="none" stroke="#d8343e" stroke-width="2"/>
<text x="105" y="22" font-size="8" text-anchor="middle" fill="#4fae6a" font-weight="900">クリスマスまで まいにち ひとつ！</text>
<text x="105" y="38" font-size="12" text-anchor="middle" fill="#d8343e" font-weight="900">${NM}の よいこミッション</text>
<text x="105" y="48" font-size="4.6" text-anchor="middle" fill="#7a5a3a" font-weight="700">12がつ1にちから まいにち 1つ できたら、ほしに いろを ぬろう。</text><text x="105" y="55" font-size="4.6" text-anchor="middle" fill="#7a5a3a" font-weight="700">ぜんぶ ぬれたら サンタさんに みせよう！</text>
${cells}
<text x="105" y="290" font-size="4" text-anchor="middle" fill="#a08a6a">おうちのひとへ：できた日に ほしを ぬってあげてください。サンタからの手紙セットと いっしょに どうぞ。</text>
</svg></section></body></html>`;
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();await p.setContent(html);await p.pdf({path:out,width:'210mm',height:'297mm',printBackground:true});await b.close();console.log('ok',out);})();
