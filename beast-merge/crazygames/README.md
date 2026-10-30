# Beast Merge — CrazyGames 提出キット（作りかけ）

| ファイル | 中身 |
| --- | --- |
| beast-merge-game.zip | ゲーム本体（index.html と art.webp、合計約95KB、外部読み込みなし） |
| cover-landscape-1920x1080.png / cover-portrait-800x1200.png / cover-square-800x800.png | カバー3種（文字はタイトルだけ） |

まだないもの：プレビュー動画（横・縦）。

## SDK（組み込み済み）
- CrazyGames 上か、URL に ?cg=1 を付けたときだけ読み込む
- gameplayStart / Stop を自動で送る
- ゲームオーバーのあとに midgame 広告
- rewarded 広告：ゲームオーバー画面の「▶ Watch ad: clear the top & continue」。1回のプレイで1度だけ、スコア500以上のときだけ出る。広告を見終えたときだけ、線の近くのモンスターを片付けて続きから遊べる
- 広告が出ないときは、そのまま普通のゲームオーバー画面

## 説明文（英語）
**Title:** Beast Merge
**Short description:** Drop monsters, merge two of a kind and evolve them — from a tiny pebble all the way to a fire-breathing Dragon.
**Controls:** Mouse/touch: tap where to drop. Keyboard: ← → to aim, Space to drop.
**Category:** Puzzle（タグ候補：Merge, Physics, Monster, Casual, Drop）
