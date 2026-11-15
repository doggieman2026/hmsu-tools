# Hoppy Lane — CrazyGames 提出キット

| ファイル | 中身 |
| --- | --- |
| hoppy-lane-game.zip | ゲーム本体（index.html 1枚、画像ファイルなし。フォントだけ Google Fonts から読み込み） |
| cover-landscape-1920x1080.png / cover-portrait-800x1200.png / cover-square-800x800.png | カバー3種（文字はタイトルだけ） |

## 提出のしかた（ヒロキさんのアカウントで）
1. https://developer.crazygames.com にログイン → Submit a game
2. 種類は HTML5、ファイルは hoppy-lane-game.zip
3. 下の英語の説明文とカバー3枚を入れる
4. 前回（Twin Steps）は「全体のクオリティ」で不採用。今回はコイン・キャラ解放・電車・ハスの葉・演出・PC横画面対応まで入れた版

## SDK（組み込み済み）
- CrazyGames 上か、URL に ?cg=1 を付けたときだけ読み込む
- gameplayStart / Stop を自動で送る
- ゲームオーバー2回に1回 midgame 広告
- rewarded 広告：スコア15以上のゲームオーバー時に「▶ Watch ad: continue」。1回のプレイで1度だけ。見終えたら近くの草地から再開
- 広告が出ないときは、そのまま普通のゲームオーバー画面
- 広告中は音を止める

## 説明文（英語）
**Title:** Hoppy Lane

**Short description:** Hop across busy roads, rail tracks and rivers in this endless blocky crossing game. Collect coins and unlock new animal friends!

**Description:**
How far can you hop? Tap to jump forward and swipe to move sideways. Dodge cars and trucks, wait for the train when the warning light flashes, and cross rivers by riding drifting logs or jumping between lily pads. Don't dawdle — the eagle is watching!

Grab coins along the way to unlock 6 characters: Chick, Frog, Pig, Panda, Cat and Robot. Beat your best distance and see the BEST line on the road.

Features:
- Endless, randomly generated lanes: roads, rail tracks, log rivers and lily-pad rivers
- 6 unlockable characters
- Simple one-finger controls, also playable with keyboard
- Works on desktop (landscape) and mobile (portrait)

**Controls:**
- Mouse/touch: tap to hop forward, swipe left/right/down to move sideways or back
- Keyboard: Arrow keys or WASD, Space to hop forward

**Category:** Casual（タグ候補：Arcade, Endless, Animal, Crossing, One Button, Casual）
