# Beast Survivors — CrazyGames 提出キット

CrazyGames の開発者ポータル（https://developer.crazygames.com/ 、本人のアカウントで登録）に、このフォルダの中身をそのままアップロードする。

## ファイル
| ファイル | 使う場所 |
| --- | --- |
| beast-survivors-game.zip | ゲーム本体（HTML5）。index.html と art/ だけ。外部読み込みなし、合計約1.4MB |
| cover-landscape-1920x1080.png | カバー 16:9 |
| cover-portrait-800x1200.png | カバー 2:3 |
| cover-square-800x800.png | カバー 1:1 |
| preview-landscape-1080p.mp4 | プレビュー動画 16:9（18.5秒・無音・最初のコマがカバー） |
| preview-portrait-1080x1620.mp4 | プレビュー動画 2:3（同上） |

## 入力欄（英語でそのまま貼る）
**Title:** Beast Survivors

**Short description:**
Start as a tiny monster, drink the blood of your enemies and evolve into a legend. Dragon, vampire lord, ancient tree — every run grows a different beast.

**Description:**
Beast Survivors is a fast survival action game. Your monster attacks automatically — just move, dodge and collect blood orbs.
- Evolve with blood: each blood type (Wild, Rock, Dark…) leads to a different evolution line.
- Over 70 forms across 8 starter monsters: slimes, skeletons, sprouts, bat pups, hatchlings, pebbles, goblins and beasts.
- Each evolution adds a new skill. Final forms unleash a screen-clearing ultimate automatically.
- Rebirth: become a new monster, keep part of your power and your ultimate, and go further.

**Controls:**
- PC: WASD / Arrow keys to move, Space to jump (dodge). Attacks, skills and the ultimate are automatic.
- Mobile: drag anywhere to move, tap the button to jump (dodge).

**Category:** Action（タグ候補：Survival, Monster, Evolution, Roguelike, Casual）

## 規定との照合（2026-10-28 に公式ドキュメントで確認）
- カバー3種のサイズ・文字はタイトルのみ・枠なし → OK
- 動画 15〜20秒・50MB以下・無音・1080p 横と2:3縦・最初のコマがカバー → OK（18.5秒、約9〜10MB）
- 英語が既定（日本語端末だけ日本語）→ OK
- 外部リンク・独自の全画面ボタンなし → OK
- 初回ダウンロード 20MB 以下（モバイルのトップ掲載の条件）→ OK（約1.4MB）
- SDK：v3 を組み込み済み（2026-10-29）。CrazyGames 上でだけ読み込む（GitHub Pages 版には影響なし）。
  - Gameplay start / stop：プレイ中かどうかが変わるたびに自動で送る（進化を選ぶ画面・ゲームオーバーで stop）
  - midgame 広告：ゲームオーバーのあと（頻度は SDK 側が3分に1回までに制限）。広告中は一時停止・消音
  - rewarded 広告：ゲームオーバー画面の「▶ Watch ad: revive」（1回のプレイで1度だけ、45秒以上生き残ったときだけ）。広告を見終えたときだけHP全回復。ほかのボタンと同じ大きさ
  - 広告が出ない（Basic 期間・広告ブロック）ときは普通にゲームオーバー画面が出て止まらない
  - テスト：URL に ?cg=1 を付けると SDK を読み込む
- 要確認：「最初のクリックは1回まで」→ タイトルでキャラを1つ選ぶだけなので1回。
