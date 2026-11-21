#!/usr/bin/env python3
"""GameDistribution 用の zip を作る。
    python3 tools/build-gd.py
対象: games/index.html に載っていて、共通テンプレート（cgAd / state / #play / MUTED）で作られたゲーム。
出力: gamedistribution/<名前>.zip（中身は index.html と画像などのファイル）と gamedistribution/README.md の表。

広告のしくみ:
- ゲームID は gamedistribution/ids.json に {"hoppy-lane": "xxxxxxxx..."} の形で書けば、それを使う。
- 書いていなければ、GameDistribution 上で動いているときの URL（html5.gamedistribution.com/<ゲームID>/…）から読み取る。
- PLAY ボタンでプレロール広告、ゲームオーバー時のミッドロール、「広告を見て続ける」でリワード広告。
- 広告中はゲームを止めて音を消す（SDK_GAME_PAUSE / SDK_GAME_START）。報酬は SDK_REWARDED_WATCH_COMPLETE のときだけ。
"""
import os, re, json, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
OUT = 'gamedistribution'
os.makedirs(OUT, exist_ok=True)
ids = {}
if os.path.exists(os.path.join(OUT, 'ids.json')):
    ids = json.load(open(os.path.join(OUT, 'ids.json'), encoding='utf-8'))

HEAD = """<script>
/* GameDistribution SDK (hmsu build) */
(function(){
  var fixed=%s, m=location.pathname.match(/\\/([0-9a-f]{32})\\//i);
  var id=fixed||(m?m[1]:'');
  window.__gd={rew:false,prev:null,ok:!!id};
  window.GD_OPTIONS={gameId:id,onEvent:function(e){
    try{
      if(e.name==='SDK_GAME_PAUSE'){window.MUTED=true;if(window.AC&&AC.suspend)AC.suspend();if(window.state!=='ad'){__gd.prev=window.state;window.state='ad';}}
      else if(e.name==='SDK_GAME_START'){window.MUTED=false;if(window.AC&&AC.resume)AC.resume();if(window.state==='ad'){window.state=__gd.prev||'play';}}
      else if(e.name==='SDK_REWARDED_WATCH_COMPLETE'){__gd.rew=true;}
    }catch(x){}
  }};
  if(!id)return;
  (function(d,s,i){if(d.getElementById(i))return;var js=d.createElement(s),f=d.getElementsByTagName(s)[0];js.id=i;js.src='https://html5.api.gamedistribution.com/main.min.js';f.parentNode.insertBefore(js,f);})(document,'script','gamedistribution-jssdk');
})();
</script>
"""

TAIL = """<script>
/* GameDistribution hooks (hmsu build) */
(function(){
  function sdk(){return typeof gdsdk!=='undefined'&&gdsdk&&typeof gdsdk.showAd==='function';}
  CG={game:{gameplayStart:function(){},gameplayStop:function(){}},ad:{}};
  cgAd=function(kind,done,fail){
    if(!sdk()){if(kind==='rewarded'){if(fail)fail();}else if(done)done();return;}
    if(kind==='rewarded'){__gd.rew=false;gdsdk.showAd('rewarded').then(function(){setTimeout(function(){if(__gd.rew){if(done)done();}else if(fail)fail();},50);}).catch(function(){if(fail)fail();});}
    else{gdsdk.showAd().then(function(){if(done)done();}).catch(function(){if(done)done();});}
  };
  var pb=document.getElementById('play');
  if(pb)pb.addEventListener('click',function(){if(sdk())gdsdk.showAd().catch(function(){});});
  setTimeout(function(){try{if(sdk()&&gdsdk.preloadAd)gdsdk.preloadAd('rewarded').catch(function(){});}catch(e){}},3000);
})();
</script>
"""

hub = open('games/index.html', encoding='utf-8').read()
entries = re.findall(r"\['\.\./([^']*)','([^']*)','([^']*)','([^']*)','([^']*)'", hub)
rows, done = [], []
for path, img, title, genre, desc in entries:
    if not path.endswith('/'):
        continue
    name = path.strip('/')
    page = path + 'index.html'
    html = open(page, encoding='utf-8').read()
    if not ('function cgAd(' in html and re.search(r"var [^;]*\bstate=", html) and re.search(r"id=['\"]play['\"]", html) and 'MUTED' in html):
        continue
    # drop the CrazyGames loader so only one ad SDK is present
    html2 = re.sub(r"\(function\(\)\{var h=location\.hostname,q=location\.search;if\(!/crazygames/[^\n]*\n[^\n]*document\.head\.appendChild\(sc\);\}\)\(\);", "", html, count=1)
    i = html2.index('<script>')
    html2 = html2[:i] + HEAD % json.dumps(ids.get(name, '')) + html2[i:]
    j = html2.rindex('</body>')
    html2 = html2[:j] + TAIL + html2[j:]
    zp = os.path.join(OUT, name + '.zip')
    with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('index.html', html2)
        for f in sorted(os.listdir(name)):
            fp = os.path.join(name, f)
            if os.path.isfile(fp) and f != 'index.html' and not f.endswith(('.md', '.py', '.png')) :
                z.write(fp, f)
    done.append(name)
    itch_cover = os.path.join('itch', name + '-cover.png')
    rows.append('| %s | %s | %s | %s | %s |' % (name + '.zip', title, genre, desc, 'itch/' + name + '-cover.png' if os.path.exists(itch_cover) else '-'))

readme = """# GameDistribution 提出キット

GameDistribution（ゲームサイトにゲームを配って、広告収入を分けてくれるサービス）用の zip です。
`python3 tools/build-gd.py` で作り直せます（新作を足したら毎回）。

## ヒロキさんの手順（1本あたり数分）
1. https://gamedistribution.com/ の Developer で無料登録（初回だけ）
2. 「Add game」→ タイトル・説明・カテゴリを入力（下の表をコピペ）
3. Upload タブで `<名前>.zip` をアップ
4. 同じ画面のプレビューでゲームを開き、PLAY を押して広告（テスト広告）が出ることを確認
5. 「Request Activation」を押す → 審査結果がメールで来る
6. リワード広告（広告を見て続ける）を使うには、ゲームの設定で Rewarded ads をオンにする

※ ゲームIDは自動で読み取る作りです。プレビューで広告が出ないときは、そのゲームのID（Upload タブに出ている英数字）を Claude に送ってください。gamedistribution/ids.json に入れて作り直します。
※ サムネイルは itch/ フォルダのカバー画像（630×500）や games/img/ の画像を使えます。必要なサイズが違えば Claude が作ります。

## 入っている広告
- PLAY ボタン：プレロール広告
- ゲームオーバー：ミッドロール広告（SDK が間隔を自動調整）
- 「広告を見て続ける」：リワード広告（最後まで見たときだけ続行）
- 広告中はゲームを止めて音を消す

## ゲーム一覧（%d本）
| zip | タイトル | ジャンル | 説明（日本語。英語は itch/README.md） | カバー |
| --- | --- | --- | --- | --- |
%s
""" % (len(rows), '\n'.join(rows))
open(os.path.join(OUT, 'README.md'), 'w', encoding='utf-8').write(readme)
print('built', len(done), done)
