/**
 * GSAP アニメーション名前空間
 */
var GsapAnimations = window.GsapAnimations || {}

/**
 * World Thumbs Gallery（メイン + サムネイル連動スライダー）
 * PC: 左にメインスライダー、右に縦サムネイル
 * SP: 上にメインスライダー、下に横サムネイル
 */
GsapAnimations.worldSlider = function () {
  if (!document.querySelector('.world-slider')) return

  function animateSlide(swiper) {
    var activeSlide = swiper.slides[swiper.activeIndex]
    if (!activeSlide) return

    var content = activeSlide.querySelector('.world-slide-content')
    var title = activeSlide.querySelector('.world-slide-title')
    var titleBg = activeSlide.querySelector('.slide-title-bg')
    var desc = activeSlide.querySelector('.world-slide-desc')
    var descBg = activeSlide.querySelector('.slide-desc-bg')
    var tag = activeSlide.querySelector('.slide-tag')
    var decoLine = activeSlide.querySelector('.slide-deco-line')
    var cornerTl = activeSlide.querySelector('.slide-corner-tl')
    var cornerBr = activeSlide.querySelector('.slide-corner-br')

    if (!title || !desc) return

    gsap.killTweensOf([content, title, titleBg, desc, descBg, tag, decoLine, cornerTl, cornerBr])

    // フィルター初期化
    gsap.set(title, { filter: 'invert(0)' })
    gsap.set(desc, { filter: 'blur(0px) invert(0)' })

    var tl = gsap.timeline()

    // デコライン: 左から右へ伸びる
    if (decoLine) {
      tl.fromTo(
        decoLine,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.65, ease: 'power2.out' },
        0
      )
    }

    // 左上コーナー: 左上から内側へスライドイン
    if (cornerTl) {
      tl.fromTo(
        cornerTl,
        { opacity: 0, x: -12, y: -12 },
        { opacity: 1, x: 0, y: 0, duration: 0.45, ease: 'power2.out' },
        0.15
      )
    }

    // 右下コーナー: 右下から内側へスライドイン（逆方向）
    if (cornerBr) {
      tl.fromTo(
        cornerBr,
        { opacity: 0, x: 12, y: 12 },
        { opacity: 1, x: 0, y: 0, duration: 0.45, ease: 'power2.out' },
        0.25
      )
    }

    // コンテンツ背景: 左から右へ展開（clip-path）
    if (content) {
      tl.fromTo(
        content,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'power3.out' },
        0.3
      )
    }

    // タグ: 左からスライドイン + フェード
    if (tag) {
      tl.fromTo(
        tag,
        { opacity: 0, x: -18 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' },
        0.65
      )
    }

    // タイトル: ネオン点滅（高速・電源投入風）
    tl.set(title, { opacity: 0 }, 0.75)
      .to(title, { opacity: 1, duration: 0.03 }, 0.75)
      .to(title, { opacity: 0.05, duration: 0.02 })
      .to(title, { opacity: 1, duration: 0.03 })
      .to(title, { opacity: 0.08, duration: 0.02 })
      .to(title, { opacity: 1, duration: 0.03 })
      .to(title, { opacity: 0.2, duration: 0.02 })
      .to(title, { opacity: 1, duration: 0.2 })

    // タイトル背景: 左から展開
    if (titleBg) {
      tl.fromTo(
        titleBg,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'power2.inOut' },
        1.15
      )
      // 背景が出揃ったタイミングで filter: invert(1) → 白→黒
      tl.fromTo(
        title,
        { filter: 'invert(0)' },
        { filter: 'invert(1)', duration: 0.2, ease: 'none' },
        1.55
      )
    }

    // 説明文: ブラーを解除しながらフェードイン
    tl.fromTo(
      desc,
      { opacity: 0, y: 18, filter: 'blur(6px) invert(0)' },
      { opacity: 1, y: 0, filter: 'blur(0px) invert(0)', duration: 0.65, ease: 'power2.out' },
      1.35
    )

    // 説明文背景: タイトル背景より0.45s遅れてスライドイン
    if (descBg) {
      tl.fromTo(
        descBg,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.55, ease: 'power2.inOut' },
        1.6
      )
      // 説明文: 背景が出揃った後に invert → 白→黒
      tl.fromTo(
        desc,
        { filter: 'blur(0px) invert(0)' },
        { filter: 'blur(0px) invert(1)', duration: 0.2, ease: 'none' },
        2.15
      )
    }
  }

  var mq = window.matchMedia('(min-width: 768px)')
  var thumbSwiper = null
  var mainSwiper = null

  function initSwipers(isDesktop) {
    // サムネイル：枚数が slidesPerView を超えると自動でスライダーになる
    thumbSwiper = new Swiper('.world-slider-thumbs', {
      direction: isDesktop ? 'vertical' : 'horizontal',
      slidesPerView: 3,
      spaceBetween: 8,
      watchSlidesProgress: true,
    })

    mainSwiper = new Swiper('.world-slider', {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 600,
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      allowTouchMove: false,
      navigation: {
        nextEl: '.world-slider-next',
        prevEl: '.world-slider-prev',
      },
      thumbs: {
        swiper: thumbSwiper,
      },
      on: {
        init: function () {
          animateSlide(this)
        },
        slideChangeTransitionStart: function () {
          animateSlide(this)
        },
      },
    })
  }

  initSwipers(mq.matches)

  // ブレイクポイント変更時に再初期化してサムネイルの direction を切り替え
  mq.addEventListener('change', function (e) {
    if (mainSwiper) mainSwiper.destroy(true, true)
    if (thumbSwiper) thumbSwiper.destroy(true, true)
    initSwipers(e.matches)
  })
}

/**
 * GSAP + Swiper スライダーの初期化
 */
GsapAnimations.slider = function () {
  var sliderEl = document.querySelector('.gsap-slider')
  if (!sliderEl) return

  function animateSlide(swiper) {
    var activeSlide = swiper.slides[swiper.activeIndex]
    if (!activeSlide) return

    var bgNum = activeSlide.querySelector('.chara-bg-num')
    var charaImg = activeSlide.querySelector('img[src*="chara"]')
    var textImg = activeSlide.querySelector('img[src*="slide_text"]')
    var title = activeSlide.querySelector('.slide-title')
    var titleBg = activeSlide.querySelector('.chara-title-bg')
    var description = activeSlide.querySelector('.slide-description')
    var descBg = activeSlide.querySelector('.chara-desc-bg')
    if (!title || !description) return
    var contentBox = titleBg ? titleBg.closest('[class*="bg-"]') : title.parentElement
    var slideBg = activeSlide.querySelector('.chara-slide-bg')
    var decoShapes = gsap.utils.toArray(activeSlide.querySelectorAll('.chara-shape'))
    var elementIcon = activeSlide.querySelector('.chara-element-icon')

    gsap.killTweensOf(
      [slideBg, elementIcon, bgNum, charaImg, textImg, title, titleBg, description, descBg, contentBox].concat(decoShapes)
    )

    var tl = gsap.timeline()

    // スライド背景パネル: 右から左へ展開
    if (slideBg) {
      tl.fromTo(
        slideBg,
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 0.75, ease: 'power3.out' },
        0
      )
    }

    // 装飾リング: 順番にスケールアップしてフェードイン
    decoShapes.forEach(function (shape, i) {
      tl.fromTo(
        shape,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
        0.25 + i * 0.15
      )
    })

    // エレメントアイコン: 回転しながら薄くフェードイン
    if (elementIcon) {
      tl.fromTo(
        elementIcon,
        { opacity: 0, scale: 0.75, rotation: -25 },
        { opacity: 0.13, scale: 1, rotation: 0, duration: 1.0, ease: 'power2.out' },
        0.3
      )
    }

    // 背景数字: ブラー解除しながら浮上
    if (bgNum) {
      tl.fromTo(
        bgNum,
        { scale: 1.5, opacity: 0, filter: 'blur(24px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.0, ease: 'power2.out' },
        0.1
      )
    }

    // キャラ画像: 下から上へ clip-path ワイプ
    if (charaImg) {
      tl.fromTo(
        charaImg,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 0.7, ease: 'power3.out' },
        0.35
      )
    }

    // テキスト画像: スキューしながら左からスライドイン
    if (textImg) {
      tl.fromTo(
        textImg,
        { x: -70, skewX: -10, opacity: 0 },
        { x: 0, skewX: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
        0.7
      )
    }

    // コンテンツボックス: 上から下へ展開
    if (contentBox) {
      tl.fromTo(
        contentBox,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.55, ease: 'power3.out' },
        0.95
      )
    }

    // タイトル背景
    if (titleBg) {
      tl.fromTo(
        titleBg,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'power2.out' },
        1.1
      )
    }

    // タイトル: 右からスライドイン + グリッチ
    tl.fromTo(
      title,
      { opacity: 0, x: 35 },
      { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
      1.2
    )
      .to(title, { x: -6, duration: 0.04 })
      .to(title, { x: 6, duration: 0.04 })
      .to(title, { x: -3, duration: 0.03 })
      .to(title, { x: 2, duration: 0.03 })
      .to(title, { x: 0, duration: 0.03 })

    // 説明文背景
    if (descBg) {
      tl.fromTo(
        descBg,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'power2.out' },
        1.45
      )
    }

    // 説明文: ブラー解除 + フェードイン（invert(1) で白文字維持）
    tl.fromTo(
      description,
      { opacity: 0, y: 20, filter: 'blur(6px) invert(1)' },
      { opacity: 1, y: 0, filter: 'blur(0px) invert(1)', duration: 0.6, ease: 'power2.out' },
      1.55
    )
  }

  new Swiper('.gsap-slider', {
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 600,
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    allowTouchMove: false,
    navigation: {
      nextEl: '.gsap-slider-next',
      prevEl: '.gsap-slider-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    on: {
      init: function () {
        animateSlide(this)
      },
      slideChangeTransitionStart: function () {
        animateSlide(this)
      },
    },
  })
}
