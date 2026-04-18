# Slider Animations - スライダーアニメーション実装

## 概要

`section-2`（世界観）と `section-3`（キャラクター）の2つの Swiper スライダーに  
GSAP を用いたリッチなアニメーションを実装した。

---

## 対象ファイル

| ファイル | 役割 |
|---|---|
| `src/index.html` / `dist/index.html` | HTML 構造・装飾要素の追加 |
| `dist/css/gsap-slider.css` | スライダー専用スタイル |
| `dist/js/gsap-swiper.js` | GSAP + Swiper 初期化・アニメーション |

---

## 1. World Slider（世界観スライダー）

### 追加した HTML 要素（各スライド共通）

```html
<div class="world-slide-inner world-img world-0X">
  <div class="slide-deco-line"></div>           <!-- 上部横ライン -->
  <div class="slide-corner slide-corner-tl"></div> <!-- 左上コーナーブラケット -->
  <div class="slide-corner slide-corner-br"></div> <!-- 右下コーナーブラケット -->
  <div class="world-slide-content">
    <span class="slide-tag">FIELD / CAMP / BATTLE</span>
    <div class="slide-title-wrap">
      <div class="slide-title-bg"></div>         <!-- タイトル背景スライドイン用 -->
      <h2 class="world-slide-title">...</h2>
    </div>
    <div class="slide-desc-wrap">
      <div class="slide-desc-bg"></div>          <!-- 説明文背景スライドイン用 -->
      <p class="world-slide-desc">...</p>
    </div>
  </div>
</div>
```

### スライドごとの背景色（`dist/css/gsap-slider.css`）

| スライド | テーマ | 色 |
|---|---|---|
| world-01 | 氷原フィールド | `#1d4ed8`（ブルー） |
| world-02 | キャンプ拠点 | `#d97706`（アンバー） |
| world-03 | バトル | `#dc2626`（レッド） |

背景色は `filter: brightness()` で調整不要の直接指定。  
`mix-blend-mode` は廃止し、GSAP の `filter: invert()` アニメーションに統一。

### アニメーション順序（`GsapAnimations.worldSlider`）

| タイミング | 要素 | アニメーション |
|---|---|---|
| 0s | `.slide-deco-line` | `scaleX: 0 → 1`（左から伸びる） |
| 0.15s | `.slide-corner-tl` | 左上から内側へスライドイン |
| 0.25s | `.slide-corner-br` | 右下から内側へスライドイン |
| 0.3s | `.world-slide-content` | `clip-path` 左→右展開 |
| 0.65s | `.slide-tag` | 左からフェードイン |
| 0.75s | `.world-slide-title` | ネオン点滅（高速・電源投入風） |
| 1.15s | `.slide-title-bg` | `clip-path` 左→右展開 |
| 1.55s | `.world-slide-title` | `filter: invert(0 → 1)`（白→黒） |
| 1.35s | `.world-slide-desc` | ブラー解除 + 下からフェードイン |
| 1.6s | `.slide-desc-bg` | `clip-path` 左→右展開 |
| 2.15s | `.world-slide-desc` | `filter: invert(0 → 1)`（白→黒） |

### ナビゲーションボタン

Swiper デフォルトから SVG アイコン付きカスタムボタン（`.world-slider-prev/next`）に変更。  
半透明黒背景・白ボーダー・ホバーエフェクト付き。

---

## 2. Character Slider（キャラクタースライダー）

### 追加した HTML 要素（各スライド）

```html
<div class="... chara-slide-inner chara-theme-0X">
  <div class="chara-slide-bg"></div>            <!-- テーマカラー背景パネル -->
  <div class="chara-deco-shapes">
    <div class="chara-shape chara-shape-ring-l"></div> <!-- 大リング -->
    <div class="chara-shape chara-shape-ring-s"></div> <!-- 小リング -->
    <div class="chara-shape chara-shape-line-h"></div> <!-- 水平ライン -->
  </div>
  <img src="images/element_icon_0X.png" class="chara-element-icon" alt="" />
  <div class="chara-bg-num">0X</div>            <!-- 背景ゴースト数字 -->
  <div class="... chara-img-col">              <!-- キャラ画像コンテナ -->
    ...
  </div>
  <div class="... chara-text-col">             <!-- テキストコンテナ -->
    <div class="chara-title-wrap">
      <div class="chara-title-bg"></div>         <!-- タイトル背景（明度+） -->
      <h2 class="slide-title invert-100">...</h2>
    </div>
    <div class="chara-desc-wrap">
      <div class="chara-desc-bg"></div>          <!-- 説明文背景（明度-） -->
      <p class="slide-description text-base invert-100">...</p>
    </div>
  </div>
</div>
```

### テーマカラー（CSS 変数）

| スライド | キャラ属性 | グラデーション |
|---|---|---|
| chara-theme-01 | 水 | `#1e3a8a → #1d4ed8 → #60a5fa` |
| chara-theme-02 | 炎 | `#4c0519 → #9f1239 → #fb7185` |
| chara-theme-03 | 地 | `#022c22 → #065f46 → #34d399` |
| chara-theme-04 | 闇 | `#3b0764 → #701a75 → #e879f9` |
| chara-theme-05 | 風 | `#082f49 → #0c4a6e → #38bdf8` |

### タイトル・説明文の背景色

親要素のテーマ色を基準に `filter: brightness()` で明度調整。

```css
.bg-blue-700 .chara-title-bg { background: #1d4ed8; filter: brightness(1.5); }
.bg-blue-700 .chara-desc-bg  { background: #1d4ed8; filter: brightness(0.65); }
```

### z-index 階層

| レイヤー | z-index | 要素 |
|---|---|---|
| 背景パネル | 0 | `.chara-slide-bg` |
| 装飾・アイコン | 1 | `.chara-deco-shapes`, `.chara-element-icon` |
| 背景数字 | 2 | `.chara-bg-num` |
| コンテンツ | 3 | `.chara-img-col`, `.chara-text-col` |

### アニメーション順序（`GsapAnimations.slider`）

| タイミング | 要素 | アニメーション |
|---|---|---|
| 0s | `.chara-slide-bg` | `clip-path` 右→左展開（背景パネル） |
| 0.1s | `.chara-bg-num` | ブラー解除 + スケールダウン |
| 0.25〜0.55s | `.chara-shape` × 3 | `scale: 0.5 → 1`（`back.out`） |
| 0.3s | `.chara-element-icon` | 回転しながら `opacity: 0 → 0.13` |
| 0.35s | キャラ画像 | `clip-path` 下→上ワイプ |
| 0.7s | テキスト画像 | スキュー付きで左からスライドイン |
| 0.95s | コンテンツボックス | `clip-path` 上→下展開 |
| 1.1s | `.chara-title-bg` | `clip-path` 左→右展開 |
| 1.2s | `.slide-title` | 右からスライドイン → グリッチ（横ブレ） |
| 1.45s | `.chara-desc-bg` | `clip-path` 左→右展開 |
| 1.55s | `.slide-description` | ブラー解除 + 下からフェードイン |

### ナビゲーションボタン

`.gsap-slider-prev/next` — World Slider と同デザイン。  
左右両サイドに `position: absolute` で配置。

---

## 注意事項

- **`invert-100` クラス**：Tailwind カスタムユーティリティ `filter: invert(100%)`。  
  GSAP が `filter` を上書きする箇所では `invert(1)` を含めた完全な filter 文字列を指定すること。  
  例：`filter: 'blur(6px) invert(1)'` → `filter: 'blur(0px) invert(1)'`

- **Swiper `loop: true` 時のクローンスライド**：`swiper.slides[swiper.activeIndex]` でクローンを含む現在スライドを取得する。`activeIndex` はクローン込みの番号のため `realIndex` と異なる場合がある。

- **`clip-path` とコンテンツの重なり**：コンテンツボックスに `clip-path` を適用すると内部の `position: absolute` 要素も一緒にクリップされる。背景 bg 要素はコンテンツボックス内の最初の子として配置し、テキストは `z-index: 1` で前面に。
