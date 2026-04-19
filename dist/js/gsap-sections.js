/**
 * GSAP アニメーション名前空間
 */
var GsapAnimations = window.GsapAnimations || {}

/**
 * セクションのスクロールアニメーション
 */
GsapAnimations.sections = function () {
  // ========================================
  // セクション見出しブロック: デコ + 背景スライドイン + テキスト
  // ========================================
  gsap.utils.toArray('.section-heading-block').forEach(function (block) {
    var topDeco   = block.querySelector('.section-deco:not(.section-deco--bottom)')
    var botDeco   = block.querySelector('.section-deco--bottom')

    function getDecoEls(deco) {
      if (!deco) return {}
      return {
        corner: deco.querySelector('.sdeco-corner'),
        line:   deco.querySelector('.sdeco-line'),
        gem:    deco.querySelector('.sdeco-gem'),
        dots:   deco.querySelectorAll('.sdeco-dot'),
      }
    }

    var top = getDecoEls(topDeco)
    var bot = getDecoEls(botDeco)

    var h2Bg = block.querySelector('.section-h2-bg')
    var h2   = block.querySelector('.section-title')
    var h3Bg = block.querySelector('.section-h3-bg')
    var h3   = block.querySelector('.section-h3-wrap h3')
    var desc = block.querySelector('.section-description')

    if (h2) gsap.set(h2, { filter: 'invert(0)' })
    if (h3) gsap.set(h3, { filter: 'invert(0)' })

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: 'top 78%',
        toggleActions: 'play none none reverse',
      },
    })

    // ── 上部デコ ──
    if (top.corner) {
      tl.fromTo(top.corner,
        { opacity: 0, x: -20, y: -20 },
        { opacity: 1, x: 0, y: 0, duration: 0.25, ease: 'power3.out' },
        0
      )
    }
    if (top.line) {
      tl.fromTo(top.line,
        { width: 0 },
        { width: '240px', duration: 0.35, ease: 'power3.out' },
        0.05
      )
    }
    if (top.gem) {
      tl.fromTo(top.gem,
        { opacity: 0, scale: 0, rotate: 0 },
        { opacity: 1, scale: 1, rotate: 45, duration: 0.25, ease: 'back.out(2.5)' },
        0.3
      )
    }
    if (top.dots.length) {
      tl.fromTo(top.dots,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.15, stagger: 0.06, ease: 'back.out(3)' },
        0.42
      )
    }

    // ── h2: 背景が左から展開 → テキスト色反転 ──
    if (h2Bg && h2) {
      tl.fromTo(h2Bg,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'power3.out' },
        0.25
      )
      tl.fromTo(h2,
        { filter: 'invert(0)' },
        { filter: 'invert(1)', duration: 0.1, ease: 'none' },
        0.62
      )
    } else if (h2) {
      tl.fromTo(h2,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
        0.25
      )
    }

    // ── h3: 背景が左から展開 → テキスト色反転 ──
    if (h3Bg && h3) {
      tl.fromTo(h3Bg,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.4, ease: 'power2.out' },
        0.6
      )
      tl.fromTo(h3,
        { filter: 'invert(0)' },
        { filter: 'invert(1)', duration: 0.1, ease: 'none' },
        0.92
      )
    } else if (h3) {
      tl.fromTo(h3,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' },
        0.55
      )
    }

    // ── 説明文: opacity + y移動でフェードイン ──
    if (desc) {
      tl.fromTo(desc,
        { opacity: 0.2, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        0.45
      )
    }

    // ── 下部デコ: 説明文のあとに出現（右から左向きにミラー済み） ──
    if (bot.corner) {
      tl.fromTo(bot.corner,
        { opacity: 0, x: -20, y: -20 },
        { opacity: 1, x: 0, y: 0, duration: 0.25, ease: 'power3.out' },
        1.15
      )
    }
    if (bot.line) {
      tl.fromTo(bot.line,
        { width: 0 },
        { width: '240px', duration: 0.35, ease: 'power3.out' },
        1.2
      )
    }
    if (bot.gem) {
      tl.fromTo(bot.gem,
        { opacity: 0, scale: 0, rotate: 0 },
        { opacity: 1, scale: 1, rotate: 45, duration: 0.25, ease: 'back.out(2.5)' },
        1.45
      )
    }
    if (bot.dots.length) {
      tl.fromTo(bot.dots,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.15, stagger: 0.06, ease: 'back.out(3)' },
        1.57
      )
    }
  })

  // ========================================
  // Section-4: イベント画像ギャラリー
  // ========================================

  // 全幅画像 + tokuten画像: ロゴ風ブラーフェードイン
  gsap.utils.toArray('.event-pic-full, .pic-fade-in').forEach(function (wrap) {
    var img = wrap.querySelector('img')
    if (!img) return
    gsap.set(img, { scale: 1.05, filter: 'blur(18px) brightness(8) saturate(0)' })
    gsap.to(img, {
      scale: 1,
      filter: 'blur(0px) brightness(1) saturate(1)',
      duration: 1.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: wrap,
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      },
    })
  })

  // 左右振り分け画像 + デコ
  gsap.utils.toArray('.event-pic-row').forEach(function (row) {
    var img      = row.querySelector('img')
    var deco     = row.querySelector('.event-pic-deco')
    var isRight  = row.classList.contains('event-pic-row--right')

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: 'top 84%',
        toggleActions: 'play none none reverse',
      },
    })

    // 画像: 左右それぞれの方向からワイプイン
    if (img) {
      tl.fromTo(
        img,
        { clipPath: isRight ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0%)', duration: 0.55, ease: 'power3.out' },
        0
      )
    }

    if (deco) {
      var num      = deco.querySelector('.epdeco-num')
      var cornerTl = deco.querySelector('.epdeco-corner--tl')
      var cornerBr = deco.querySelector('.epdeco-corner--br')
      var vline    = deco.querySelector('.epdeco-vline')
      var diamond  = deco.querySelector('.epdeco-diamond')

      // 背景ナンバー: ブラー解除 + 大きくスケールダウンしながら出現
      if (num) {
        tl.fromTo(num,
          { opacity: 0, scale: 2.2, filter: 'blur(32px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out' },
          0.05
        )
      }

      // コーナーブラケット: 大きく外側からスライドイン
      if (cornerTl) {
        tl.fromTo(cornerTl,
          { opacity: 0, x: -30, y: -30 },
          { opacity: 1, x: 0, y: 0, duration: 0.4, ease: 'back.out(2)' },
          0.3
        )
      }
      if (cornerBr) {
        tl.fromTo(cornerBr,
          { opacity: 0, x: 30, y: 30 },
          { opacity: 1, x: 0, y: 0, duration: 0.4, ease: 'back.out(2)' },
          0.38
        )
      }

      // 縦線: 上から下へ伸びる
      if (vline) {
        tl.fromTo(vline,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.5, ease: 'power3.out' },
          0.5
        )
      }

      // ダイヤモンド: 回転しながらポップイン + グロー
      if (diamond) {
        tl.fromTo(diamond,
          { scale: 0, opacity: 0, rotation: -90 },
          { scale: 1, opacity: 1, rotation: 0, duration: 0.45, ease: 'back.out(3)' },
          0.75
        )
      }
    }
  })

  // ========================================
  // パルスリング
  // ========================================
  var pulseRings = document.querySelectorAll('.pulse-ring')
  if (pulseRings.length) {
    gsap.fromTo(
      pulseRings,
      { scale: 0.2, opacity: 0.85 },
      {
        scale: 5,
        opacity: 0,
        duration: 1.5,
        stagger: 0.5,
        ease: 'power2.out',
      },
    )
  }

  // ========================================
  // メインロゴ: 凍てつく吹雪アニメーション
  // ========================================
  var mainLogo = document.querySelector('.main-logo')
  if (mainLogo) {
    gsap.set(mainLogo, {
      scale: 1.06,
      filter: 'blur(20px) brightness(12) saturate(0)',
    })

    gsap.to(mainLogo, {
      filter: 'blur(0px) brightness(1) saturate(1)',
      scale: 1,
      duration: 5,
      ease: 'power4.out',
    })
  }
}
