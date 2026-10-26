// ココナラ出品用ギャラリー画像（2〜5枚目・1200x1200）をサンプルから作る
// node gallery.js 素材フォルダ 出力フォルダ
// 素材: letter.png cert.png maze.png web.png advent.png takara.png
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const [,,src='.',out='.']=process.argv;
const img=f=>'data:image/png;base64,'+fs.readFileSync(path.join(src,f)).toString('base64');
const css=`*{box-sizing:border-box}body{margin:0;font-family:"Noto Sans CJK JP",sans-serif;color:#3b2a1e}
.s{width:1200px;height:1200px;position:relative;overflow:hidden;background:#fdf3e1;padding:70px 60px}
.s:before{content:"";position:absolute;inset:22px;border:10px solid #c8323c;border-radius:36px;box-shadow:inset 0 0 0 6px #fdf3e1,inset 0 0 0 12px #4fae6a}
.no{position:absolute;left:58px;top:56px;background:#c8323c;color:#fff;font-weight:900;font-size:40px;width:84px;height:84px;border-radius:50%;display:flex;align-items:center;justify-content:center}
h1{margin:0 0 10px;text-align:center;font-size:72px;color:#c8323c;font-weight:900;letter-spacing:2px}
.sub{text-align:center;font-size:38px;font-weight:700;color:#5a4030;margin-bottom:36px}
.row{display:flex;gap:30px;justify-content:center;align-items:flex-start}
.card{background:#fff;border-radius:16px;padding:12px;white-space:nowrap;letter-spacing:-1px;box-shadow:0 10px 26px rgba(0,0,0,.18);text-align:center;font-weight:900;font-size:32px}
.card img{display:block;width:100%;border-radius:8px;margin-bottom:10px}
.tag{display:inline-block;background:#4fae6a;color:#fff;border-radius:999px;padding:6px 26px;font-size:34px;font-weight:900}
.foot{position:absolute;left:60px;right:60px;bottom:62px;line-height:1.4;text-align:center;font-size:28px;color:#7a5a3a;font-weight:700}
.step{display:flex;align-items:center;gap:26px;background:#fff;border-radius:22px;padding:26px 34px;margin:0 30px 26px;box-shadow:0 8px 20px rgba(0,0,0,.12)}
.step b{flex:none;width:90px;height:90px;border-radius:50%;background:#c8323c;color:#fff;font-size:48px;display:flex;align-items:center;justify-content:center}
.step div{font-size:40px;font-weight:900;line-height:1.35}.step small{display:block;font-size:28px;font-weight:700;color:#7a5a3a}`;
const S=[
`<div class="s"><div class="no">2</div><h1>セットの なかみ</h1><div class="sub">お名前入りで 3しゅるい とどきます</div>
<div class="row" style="margin-top:20px"><div class="card" style="width:340px"><img src="${img('letter.png')}">サンタからの手紙</div>
<div class="card" style="width:340px;margin-top:80px"><img src="${img('cert.png')}">よいこ しょうめいしょ</div>
<div class="card" style="width:340px"><img src="${img('maze.png')}">クリスマスめいろ</div></div>
<div class="foot">PDFでお届け。おうちのプリンターやコンビニで印刷できます</div></div>`,
`<div class="s"><div class="no">3</div><h1>QRで ひみつのメッセージ</h1><div class="sub">手紙のQRをスマホで読むと…</div>
<div class="row" style="align-items:center"><div class="card" style="width:380px"><img src="${img('letter.png')}">手紙の QRコード</div>
<div style="font-size:120px;color:#c8323c;font-weight:900">→</div>
<div class="card" style="width:360px;padding:10px"><img src="${img('web.png')}" style="height:640px;object-fit:cover;object-position:top">サンタの そりが とぶ！</div></div>
<div class="foot">夜空・雪・鈴の音つき。お子さんの名前で手紙がひらきます</div></div>`,
`<div class="s"><div class="no">4</div><h1>オプション</h1><div class="sub">クリスマスまで もっと たのしく</div>
<div class="row"><div class="card" style="width:460px"><img src="${img('advent.png')}">よいこミッション<br><span class="tag">+300円</span></div>
<div class="card" style="width:460px"><img src="${img('takara.png')}">おうち宝さがしカード<br><span class="tag">+300円</span></div></div>
<div class="foot">12月1日から毎日1つ／プレゼントの隠し場所までヒントでご案内</div></div>`,
`<div class="s"><div class="no">5</div><h1>ご注文の ながれ</h1><div class="sub" style="margin-bottom:60px">むずかしい ことは ありません</div>
<div class="step"><b>1</b><div>お名前・くん/ちゃん・がんばったことを送る<small>ひとことメッセージも入れられます</small></div></div>
<div class="step"><b>2</b><div>PDFをお届け<small>トークルームで受け取り</small></div></div>
<div class="step"><b>3</b><div>印刷して封筒へ。クリスマスの朝に！<small>QRはおうちのかたのスマホで</small></div></div>
<div class="foot">※文面・イラストの作成にAIを使っています。<br>データ商品のため、実物の郵送はありません</div></div>`];
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1200,height:1200}});
for(let i=0;i<S.length;i++){await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${S[i]}</body></html>`);
  const f=path.join(out,`gallery-${i+2}.jpg`);await p.screenshot({path:f,type:'jpeg',quality:88});console.log('ok',f);}
await b.close();})();
