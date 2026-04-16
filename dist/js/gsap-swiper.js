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
    // loop: true のとき activeIndex はクローンも含む。
    // slides[activeIndex] で現在表示中のスライド要素（クローン含む）を取得
    var activeSlide = swiper.slides[swiper.activeIndex]
    if (!activeSlide) return
    var title = activeSlide.querySelector('.world-slide-title')
    var desc = activeSlide.querySelector('.world-slide-desc')
    if (!title || !desc) return

    // 前のアニメーションを即座に終了してから開始
    gsap.killTweensOf([title, desc])

    var tl = gsap.timeline()
    tl.fromTo(
      title,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
    ).fromTo(
      desc,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.5 },
      '-=0.3',
    )
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
    var title = activeSlide.querySelector('.slide-title')
    var description = activeSlide.querySelector('.slide-description')

    var tl = gsap.timeline()

    tl.fromTo(
      title,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
    ).fromTo(
      description,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.3',
    )
  }

  new Swiper('.gsap-slider', {
    speed: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    allowTouchMove: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
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
