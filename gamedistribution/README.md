# GameDistribution 提出キット

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

## ゲーム一覧（32本）
| zip | タイトル | ジャンル | 説明（日本語。英語は itch/README.md） | カバー |
| --- | --- | --- | --- | --- |
| ink-turf.zip | Ink Turf | 陣取り / Territory | スワイプで線を引いて陣地を広げる陣取りゲーム。自分の陣地にもどると囲んだところが自分の色に。線をふまれたらアウト！ | itch/ink-turf-cover.png |
| gulp-hole.zip | Gulp Hole | アクション / Swallow the city | 穴を動かして街のものをのみこもう。大きくなるほど車も家もビルものみこめる。90秒でライバルの穴より大きくなれ！ | itch/gulp-hole-cover.png |
| power-tower.zip | Power Tower | RPG / Tower puzzle | 塔の部屋をタップして勇者を送りこむ。自分より弱い敵をたおすと強さを吸収！順番を考えて塔をからっぽにしよう。 | itch/power-tower-cover.png |
| trick-steps.zip | Trick Steps | アクション / Troll platformer | 旗まで行くだけ…なのに床が落ちる、トゲが出る、旗が逃げる！ステージにだまされながら全8面クリアを目指せ。 | itch/trick-steps-cover.png |
| arrow-hero.zip | Arrow Hero | アクション / Arena shooter | ドラッグで動いて、止まると自動で矢を発射！部屋の敵を全部たおして次へ。2部屋ごとにスキル、5部屋ごとにボス。 | itch/arrow-hero-cover.png |
| deck-delve.zip | Deck Delve | RPG / Card battle | カードで戦うダンジョンRPG。敵の次の行動を読んで攻撃とガードを組み立てよう。勝つたびにカードが増える。10階のボスをたおせ！ | itch/deck-delve-cover.png |
| drift-skyway.zip | Drift Skyway | アクション / One-tap racing | 空の道を走る車。カーブでタップしてドリフト！道から落ちないように、どこまで行ける？ | itch/drift-skyway-cover.png |
| ninja-dash.zip | Ninja Dash | アクション / Slash | スワイプした方向へシュッとダッシュ斬り！せまってくるオニをまとめて斬ってコンボ。手裏剣に注意。 | itch/ninja-dash-cover.png |
| tiny-quest.zip | Tiny Quest | RPG / Dungeon | ダンジョンを進んでモンスターとコマンドバトル。レベルアップ、宝箱の装備、5階ごとのボス！ | itch/tiny-quest-cover.png |
| hoop-flick.zip | Hoop Flick | スポーツ / Basketball | ボールを上にスワイプしてシュート！リングにふれずに入れるとスウィッシュでボーナス。外したらおしまい。 | itch/hoop-flick-cover.png |
| cozy-sudoku.zip | Cozy Sudoku | パズル / Sudoku | 毎回ちがう問題が自動でできるナンプレ。かんたん・ふつう・むずかしいの3段階、メモとヒントつき。 | itch/cozy-sudoku-cover.png |
| snaky-garden.zip | Snaky Garden | アクション / Snake | スワイプでヘビをあやつってリンゴをパクパク。金のリンゴは5点！しっぽにぶつからないように。 | itch/snaky-garden-cover.png |
| cloud-hop.zip | Cloud Hop | アクション / Jumper | うさぎが雲をぴょんぴょん。指を左右に動かして、どこまで高く登れるか。くずれる雲とキノコの大ジャンプ！ | itch/cloud-hop-cover.png |
| bubble-pop.zip | Bubble Pop | パズル / Bubble shooter | ねらって発射、同じ色を3つでパチン！ぶら下がったあわはまとめて落ちる。線まで来たら負け。 | itch/bubble-pop-cover.png |
| tiny-putt.zip | Tiny Putt | スポーツ / Mini golf | 引っぱって打つミニゴルフ。かべで跳ね返し、風車や池をこえてカップへ。全9ホールでパーをめざそう！ | itch/tiny-putt-cover.png |
| swing-pop.zip | Swing Pop | アクション / Swing | おしている間だけ輪にロープをひっかけてブランコ。はなすと空へビューン！海に落ちずにどこまで行ける？ | itch/swing-pop-cover.png |
| spiral-drop.zip | Spiral Drop | アクション / Helix | 塔を左右に回して、すき間からボールを下へ。赤に当たったらアウト！3段つづけて落ちると火の玉に。 | itch/spiral-drop-cover.png |
| color-hop.zip | Color Hop | アクション / One-tap | タップでボールがぴょん。ボールと同じ色のところだけ通れる。回る輪をすりぬけて星を集めよう！ | itch/color-hop-cover.png |
| car-out.zip | Car Out | パズル / Parking jam | 車をタップすると向いている方へ走り出す。ぶつからない順番を考えて、駐車場を空っぽにしよう！ | itch/car-out-cover.png |
| hex-stack.zip | Hex Stack | パズル / Hexa sort | 六角タイルの山をボードに置くと、同じ色がぴょんぴょん集まる。10まいそろえて消そう！ | itch/hex-stack-cover.png |
| pin-spin.zip | Pin Spin | アクション / One-tap | タップでピンを投げて、回るまとに刺そう。ピン同士がぶつかったらアウト！5ステージごとにボス。 | itch/pin-spin-cover.png |
| hoppy-lane.zip | Hoppy Lane | アクション / Road crosser | タップでぴょんと前へ。車をよけて、川は丸太に乗ってわたろう。どこまで進める？ | itch/hoppy-lane-cover.png |
| slime-siege.zip | Slime Siege | ストラテジー / Tower defense | 弓・大砲・氷のタワーを建てて、お城に向かうスライムの行進を止めよう。全20ウェーブ！ | itch/slime-siege-cover.png |
| fruit-slash.zip | Fruit Slash | アクション / Slice | 指でなぞってフルーツをスパッと切ろう。爆弾に注意！いっぺんに切るとコンボ。 | itch/fruit-slash-cover.png |
| neon-bricks.zip | Neon Bricks | アクション / Ball shooter | ねらってボールを発射！数字のブロックを跳ね返りでこわそう。リングでボールが増える。 | itch/neon-bricks-cover.png |
| evolve-2048.zip | Cosmic 2048 | パズル / 2048 | スワイプで同じ星をぶつけて成長させよう。ほしくず→惑星→太陽…めざせ銀河（2048）！ | itch/evolve-2048-cover.png |
| sky-stack.zip | Sky Stack | アクション / Tap stacker | タップでブロックを落として、空まで積み上げよう。ぴったり重ねるとコンボ！ | itch/sky-stack-cover.png |
| bolt-jam.zip | Bolt Jam | パズル / Screw puzzle | ネジを外して同じ色の箱へ。上にのった板から順に外そう。板がぶらんと動く！ | itch/bolt-jam-cover.png |
| monster-match.zip | Sweet Match | パズル / Tile match | 重なったおかしをタップして、同じものを3つそろえて消す。たなが7つうまると負け！ | itch/monster-match-cover.png |
| potion-sort.zip | Potion Sort | パズル / Sort puzzle | フラスコの薬をそそいで、色ごとに1本ずつにそろえよう。レベルはどんどん難しく。 | itch/potion-sort-cover.png |
| rune-blocks.zip | Rune Blocks | パズル / Block puzzle | ブロックを置いて、たて・よこの列をそろえて消す。続けて消すとコンボ！ | itch/rune-blocks-cover.png |
| beast-merge.zip | Beast Merge | パズル / Merge puzzle | 同じモンスターをくっつけると進化！ころいしからドラゴンまで、全11段階。 | itch/beast-merge-cover.png |
