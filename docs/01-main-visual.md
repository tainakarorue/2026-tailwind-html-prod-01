# Main Visual - 凍てつく吹雪アニメーション

## 概要

`#section-1` のメインビジュアルに、凍てつく吹雪をテーマにしたアニメーションを実装する。  
ロゴ出現アニメーションはすでに実装済み。本ドキュメントは **Three.js による雪パーティクル** の実装計画を記載する。

---

## 実装済み

### ロゴアニメーション（`dist/js/gsap-sections.js`）

- 初期状態: `filter: blur(20px) brightness(12) saturate(0)` で白飛び表現
- 5秒かけて `blur(0px) brightness(1) saturate(1)` へ遷移
- `scale: 1.06 → 1` で奥からせり出すような演出
- `opacity` は触らない（`opacity` と `brightness` を同時アニメーションするとブラウザ合成で黒フレームが発生するため）

---

## 未実装: 雪パーティクル

### 技術選定

| 項目 | 内容 |
|---|---|
| ライブラリ | Three.js |
| 選定理由 | 将来の3D表現に対応可能・GPUベースで大量パーティクルを高パフォーマンスで描画できる・GSAPとの併用実績が豊富 |
| CDN | `https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.min.js` |

---

## 実装ファイル構成

```
dist/
  js/
    gsap-sections.js     # 既存: ロゴアニメーション
    main-visual-snow.js  # 新規: Three.js 雪パーティクル
dist/index.html          # CDN追加・スクリプト読み込み追加
```

---

## 実装の流れ

### Step 1: CDN追加（`dist/index.html`）

GSAPのCDNより前に追加する。

```html
<!-- Three.js -->
<script src="https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.min.js"></script>
```

### Step 2: スクリプト読み込み追加（`dist/index.html`）

`gsap-sections.js` の直前に追加する。

```html
<script src="js/main-visual-snow.js"></script>
```

### Step 3: Canvas配置（`dist/index.html`）

Three.jsのrendererが生成するcanvasを受け取るコンテナを `.main-visual` 内に配置する。  
ロゴの背面に表示するため `z-index` の管理に注意する。

```html
<section id="section-1" class="section p-4 md:p-5">
  <div class="w-full max-w-[1580px] h-[95vh] flex flex-col items-center justify-center main-visual">
    <!-- Three.js canvas コンテナ（背面レイヤー） -->
    <div id="snow-canvas-container"></div>

    <div>
      <img src="images/logo.png" alt="Logo" class="max-w-[90%] main-logo" />
    </div>
  </div>
</section>
```

### Step 4: CSSでcanvasをオーバーレイ配置

`#snow-canvas-container` および Three.jsが生成する `<canvas>` を `.main-visual` の全面に敷く。  
`.main-visual` に `position: relative` を追加する必要がある。

```css
.main-visual {
  position: relative;
}

#snow-canvas-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

#snow-canvas-container canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

/* ロゴをcanvasの前面に出す */
.main-visual > div:not(#snow-canvas-container) {
  position: relative;
  z-index: 1;
}
```

### Step 5: Three.js シーン構築（`dist/js/main-visual-snow.js`）

#### 5-1. シーン・カメラ・レンダラーの初期化

```js
var container = document.getElementById('snow-canvas-container')
var W = container.offsetWidth
var H = container.offsetHeight

var scene    = new THREE.Scene()
var camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000)
var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })

camera.position.z = 5
renderer.setSize(W, H)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000000, 0) // 透明背景
container.appendChild(renderer.domElement)
```

#### 5-2. パーティクルジオメトリの生成

雪片を `BufferGeometry` + `Points` で表現する。  
数千個でもGPU処理のため軽量。

```js
var FLAKE_COUNT = 3000
var positions   = new Float32Array(FLAKE_COUNT * 3) // x, y, z

for (var i = 0; i < FLAKE_COUNT; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 20  // x: 横方向に広げる
  positions[i * 3 + 1] = (Math.random() - 0.5) * 10  // y: 縦方向に広げる
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10  // z: 奥行き
}

var geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
```

#### 5-3. マテリアルの設定

雪片はサイズ・色・透明度を設定した `PointsMaterial` で描画する。  
テクスチャを使う場合は別途 `TextureLoader` でサークル画像を読み込む。

```js
var material = new THREE.PointsMaterial({
  color: 0xd2ebff,      // 淡い青白色
  size: 0.06,           // パーティクルサイズ（カメラ距離で調整）
  transparent: true,
  opacity: 0.8,
  sizeAttenuation: true, // 奥のパーティクルを小さく見せる
})

var snow = new THREE.Points(geometry, material)
scene.add(snow)
```

#### 5-4. アニメーションループ

各フレームでパーティクルの座標を直接書き換えて落下・風の揺れを表現する。

```js
var posAttr = geometry.attributes.position

function tick() {
  requestAnimationFrame(tick)

  for (var i = 0; i < FLAKE_COUNT; i++) {
    var vy = 0.005 + (i % 5) * 0.001  // 落下速度（粒ごとにばらつき）
    var vx = Math.sin(Date.now() * 0.0005 + i) * 0.002  // 横揺れ（風）

    posAttr.array[i * 3 + 1] -= vy  // y を下げる
    posAttr.array[i * 3 + 0] += vx  // x を風で揺らす

    // 画面下を超えたら上に戻す（ループ）
    if (posAttr.array[i * 3 + 1] < -5) {
      posAttr.array[i * 3 + 1] = 5
      posAttr.array[i * 3 + 0] = (Math.random() - 0.5) * 20
    }
  }

  posAttr.needsUpdate = true
  renderer.render(scene, camera)
}

tick()
```

#### 5-5. リサイズ対応

```js
window.addEventListener('resize', function () {
  var W = container.offsetWidth
  var H = container.offsetHeight
  camera.aspect = W / H
  camera.updateProjectionMatrix()
  renderer.setSize(W, H)
})
```

### Step 6: ロゴアニメーションとの連携（オプション）

ロゴ出現中（約5秒）は吹雪を強め、出現完了後に穏やかにする。  
`gsap-sections.js` 側でGSAPのコールバックから雪の強度を制御する。

```js
// gsap-sections.js 側でSnowControllerを呼び出す例
gsap.to(mainLogo, {
  filter: 'blur(0px) brightness(1) saturate(1)',
  scale: 1,
  duration: 5,
  ease: 'power4.out',
  onComplete: function () {
    // 雪を穏やかにする
    if (window.SnowController) {
      window.SnowController.calm()
    }
  },
})
```

`main-visual-snow.js` 側で `window.SnowController` として制御APIを公開する。

```js
window.SnowController = {
  calm: function () {
    gsap.to(material, { opacity: 0.3, duration: 4, ease: 'power2.out' })
  },
}
```

---

## 注意事項

- Three.jsのcanvasは `pointer-events: none` を必ず設定し、ロゴやナビゲーションの操作を妨げないようにする
- `renderer.setPixelRatio` は `Math.min(window.devicePixelRatio, 2)` に制限し、高解像度端末での過負荷を防ぐ
- パーティクル数（`FLAKE_COUNT`）はモバイルでは減らすことを検討する（`window.innerWidth < 768` で分岐）
- Three.jsは後のセクションでも使い回す想定のため、シーン・レンダラーの初期化処理は共通モジュールとして切り出すことを将来的に検討する
