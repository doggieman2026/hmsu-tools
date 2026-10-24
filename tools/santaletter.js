// サンタからの手紙 PDF 生成
// node santaletter.js 名前 くん|ちゃん|さん "がんばったこと" 出力.pdf ["ひとこと"] [めいろ問題数(0=なし)] [easy|normal|hard]
// 例: node santaletter.js はると くん "じてんしゃの れんしゅう" haruto.pdf "" 20 easy
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');const {chromium}=require('playwright');
const QRCode=require('./vendor/QRCode'),QRL=require('./vendor/QRCode/QRErrorCorrectLevel');
const [,,name='はると',suf='くん',good='',out='santa.pdf',msg='',mazeN='0',mazeLv='easy']=process.argv;
const NM=name+suf;
// QR → 秘密のメッセージページ
const data=Buffer.from(JSON.stringify({n:name,s:suf,g:good,m:msg}),'utf8').toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const url='https://doggieman2026.github.io/hmsu-tools/santa/#d='+data;
const q=new QRCode(-1,QRL.M);q.addData(url);q.make();const n=q.getModuleCount();let rects='';
for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))rects+=`M${c+4} ${r+4}h1v1h-1z`;
const qr=`<svg viewBox="0 0 ${n+8} ${n+8}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="${rects}" fill="#222"/></svg>`;
// 飾り（オリジナルの簡単な図形）
const snow=(x,y,r)=>{let s='';for(let i=0;i<6;i++){const a=i*Math.PI/3;s+=`<line x1="${x}" y1="${y}" x2="${x+r*Math.cos(a)}" y2="${y+r*Math.sin(a)}"/>`;}return `<g stroke="#9cc5ff" stroke-width="${r/6}" stroke-linecap="round">${s}</g>`;};
const holly=(x,y,s)=>`<g transform="translate(${x},${y}) scale(${s})"><path d="M0 0c-8-10-22-8-26 2 8-2 12 4 10 10 6-6 14-6 16-12z" fill="#4fae6a" stroke="#2f6b3f" stroke-width="1.5"/><path d="M0 0c8-10 22-8 26 2-8-2-12 4-10 10-6-6-14-6-16-12z" fill="#4fae6a" stroke="#2f6b3f" stroke-width="1.5"/><circle cx="-4" cy="-4" r="5" fill="#d8343e"/><circle cx="5" cy="-5" r="5" fill="#d8343e"/><circle cx="0" cy="3" r="5" fill="#d8343e"/></g>`;
const star=(x,y,r,f)=>{let p='';for(let i=0;i<10;i++){const a=Math.PI/5*i-Math.PI/2,rr=i%2?r*.45:r;p+=`${x+rr*Math.cos(a)},${y+rr*Math.sin(a)} `;}return `<polygon points="${p}" fill="${f}"/>`;};
let deco='';for(let i=0;i<40;i++){const side=i%4,u=((i*53)%100)/100;const x=side===0?5:side===1?205:10+u*190,y=side===2?5:side===3?292:10+u*277;deco+=i%3?snow(x,y,2.2+i%2):star(x,y,2.4,'#f2c14e');}
const lines=['サンタクロースだよ。',`ことしも きたのくにから、${NM}の ことを みていたよ。`,
  good?`${good}、とても がんばったね。サンタは ちゃんと しっているよ。`:'まいにち げんきに すごして、えらかったね。',msg,
  'クリスマスの よるに、プレゼントを もって あいに いくからね。','あったかくして はやく ねて、まっていてね。'].filter(Boolean);
const html=`<!doctype html><html><head><meta charset="utf-8"><style>
@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:"Noto Sans CJK JP","Noto Sans JP",sans-serif;color:#3b2a1e}
.p{width:210mm;height:297mm;position:relative;overflow:hidden;background:#fffaf0;page-break-after:always;padding:22mm 20mm}
.frame{position:absolute;inset:9mm;border:3mm solid #d8343e;border-radius:6mm;box-shadow:inset 0 0 0 1.5mm #fffaf0,inset 0 0 0 2.4mm #4fae6a}
.deco{position:absolute;inset:0;width:100%;height:100%}
.c{position:relative}
h1{text-align:center;color:#d8343e;font-size:15mm;margin:6mm 0 2mm;letter-spacing:1mm}
.en{text-align:center;color:#4fae6a;font-size:5mm;letter-spacing:1.5mm;margin-bottom:8mm;font-weight:700}
.to{font-size:10mm;font-weight:900;margin:0 0 6mm;border-bottom:1mm dotted #e0b062;display:inline-block;padding:0 3mm 1mm}
.l{font-size:6.8mm;line-height:1.8;margin:0 0 2.2mm;font-weight:500;word-break:keep-all;overflow-wrap:anywhere}
.p:first-child .sign{position:absolute;right:26mm;bottom:82mm;margin:0}.sign{text-align:right;margin-top:8mm;font-size:8mm;font-weight:900;color:#d8343e}
.sign small{display:block;font-size:4.5mm;color:#7a5a3a;font-weight:700;letter-spacing:.5mm}
.stamp{position:absolute;left:24mm;bottom:28mm;width:34mm;height:34mm;border:1.2mm solid #d8343e;border-radius:50%;color:#d8343e;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-12deg);opacity:.8;font-weight:900;font-size:4mm;line-height:1.3;text-align:center}
.qr{position:absolute;right:24mm;bottom:20mm;width:44mm;text-align:center;font-size:3.6mm;font-weight:700;color:#7a5a3a}
.qr svg{width:38mm;height:38mm;border:1mm solid #e0b062;border-radius:2mm}
.cert h1{font-size:13mm;margin-top:14mm}.cert .big{text-align:center;font-size:14mm;font-weight:900;margin:14mm 0 8mm}
.cert .body{text-align:center;font-size:7mm;line-height:2;word-break:keep-all}
.cert .medal{display:block;margin:10mm auto 0;width:44mm}
</style></head><body>
<section class="p"><svg class="deco" viewBox="0 0 210 297">${deco}${holly(18,18,0.7)}${holly(192,18,0.7)}${holly(18,280,0.7)}</svg><div class="frame"></div>
<div class="c"><h1>メリークリスマス</h1><div class="en">MERRY CHRISTMAS</div><div class="to">${NM}へ</div>
${lines.map(l=>`<p class="l">${l}</p>`).join('')}
</div><div class="sign">サンタクロースより<small>from Santa Claus</small></div>
<div class="stamp">NORTH<br>POLE<br>★<br>12.24</div>
<div class="qr">${qr}<div>おうちのひとの スマホで<br>よみとってね。<br>ひみつの メッセージが あるよ</div></div></section>
<section class="p cert"><svg class="deco" viewBox="0 0 210 297">${deco}${holly(18,18,0.7)}${holly(192,18,0.7)}</svg><div class="frame"></div>
<div class="c"><h1>よいこ しょうめいしょ</h1><div class="en">GOOD CHILD CERTIFICATE</div>
<div class="big">${NM}</div><div class="body">あなたは ことし、とても よいこで<br>いたことを ここに しょうめいします。<br>${good?`とくに「${good}」は<br>すばらしかったです。`:''}</div>
<svg class="medal" viewBox="-60 -60 120 140"><path d="M-30 30l-14 50 20-10 10 18 14-48z" fill="#d8343e"/><path d="M30 30l14 50-20-10-10 18-14-48z" fill="#d8343e"/><circle r="48" fill="#f2c14e" stroke="#b8862a" stroke-width="5"/><circle r="36" fill="none" stroke="#fff3c4" stroke-width="3"/>${star(0,0,26,'#fff3c4')}</svg>
<div class="sign">サンタクロース<small>Santa Claus</small></div></div></section>
</body></html>`;
(async()=>{const tmp=out.replace(/\.pdf$/,'')+'.letter.pdf';const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();await p.setContent(html);
  await p.pdf({path:+mazeN>0?tmp:out,width:'210mm',height:'297mm',printBackground:true});await b.close();
  if(+mazeN>0){const mz=out.replace(/\.pdf$/,'')+'.maze.pdf';execFileSync('node',[path.join(__dirname,'mazebook.js'),name,mz,String(mazeN),mazeLv,'christmas'],{stdio:'inherit'});
    execFileSync('pdfunite',[tmp,mz,out]);fs.unlinkSync(tmp);fs.unlinkSync(mz);}
  console.log('ok',out);console.log(url);})();
