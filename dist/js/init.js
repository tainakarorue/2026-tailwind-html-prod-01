document.addEventListener('DOMContentLoaded', function () {
  // Lenis + ScrollTrigger を初期化
  ScrollNavApp.init()

  // ナビゲーションを初期化（HTML で作成したナビに機能を付与）
  ScrollNavApp.initNav({
    // navSelector: '[data-scroll-target]',  // ナビアイテムのセレクタ（デフォルト）
    // activeClass: 'is-active',             // アクティブ時のクラス（デフォルト）
  })

  // 使用例：ボタンのみ
  // const drawer = new DrawerMenu({ trigger: { button: true, keyboard: false } });

  // 使用例：キーボードのみ（Escキー）
  // const drawer = new DrawerMenu({ trigger: { button: false, keyboard: true, key: 'Escape' } });

  // デフォルト：両方対応
  const drawer = new DrawerMenu({
    trigger: {
      button: true,
      keyboard: true,
      key: 'Escape',
    },
  })

  // モバイル用トグルボタン
  const mobileBtn = document.getElementById('drawer-toggle-mobile')
  mobileBtn.addEventListener('click', () => drawer.toggleDrawer())

  // オーバーレイ：クリックで閉じる
  const overlay = document.getElementById('drawer-overlay')
  overlay.addEventListener('click', () => drawer.close())

  // ナビアイテムクリックでドロワーを閉じる
  document.querySelectorAll('[data-scroll-target]').forEach((btn) => {
    btn.addEventListener('click', () => drawer.close())
  })

  // drawer の開閉に合わせてオーバーレイ・モバイルボタンアイコンを切り替え
  const drawerEl = document.getElementById('drawer')
  new MutationObserver(() => {
    const isOpen = drawerEl.classList.contains('is-open')
    overlay.classList.toggle('is-visible', isOpen)
    mobileBtn.querySelector('.icon-menu').style.display = isOpen
      ? 'none'
      : 'block'
    mobileBtn.querySelector('.icon-close').style.display = isOpen
      ? 'block'
      : 'none'
  }).observe(drawerEl, { attributes: true, attributeFilter: ['class'] })

  // GSAP アニメーションの初期化
  GsapAnimations.worldSlider()
  GsapAnimations.slider()
  GsapAnimations.sections()
})
