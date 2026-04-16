document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('snow-canvas-container')

  var W = window.innerWidth
  var H = window.innerHeight

  var scene = new THREE.Scene()
  var camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000)
  var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })

  camera.position.z = 5
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  var FLAKE_COUNT = 3000
  var positions = new Float32Array(FLAKE_COUNT * 3)

  for (var i = 0; i < FLAKE_COUNT; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  var geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  // 丸くぼかした雪片テクスチャをCanvasで生成
  var canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  var ctx = canvas.getContext('2d')
  var grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0,   'rgba(210, 235, 255, 1)')
  grad.addColorStop(0.4, 'rgba(210, 235, 255, 0.8)')
  grad.addColorStop(1,   'rgba(210, 235, 255, 0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 64, 64)
  var snowTexture = new THREE.CanvasTexture(canvas)

  var material = new THREE.PointsMaterial({
    size: 0.12,
    map: snowTexture,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    sizeAttenuation: true,
  })

  var snow = new THREE.Points(geometry, material)
  scene.add(snow)

  var posAttr = geometry.attributes.position

  function tick() {
    requestAnimationFrame(tick)

    for (var i = 0; i < FLAKE_COUNT; i++) {
      var vy = 0.005 + (i % 5) * 0.001
      var vx = Math.sin(Date.now() * 0.0005 + i) * 0.002

      posAttr.array[i * 3 + 1] -= vy
      posAttr.array[i * 3 + 0] += vx

      if (posAttr.array[i * 3 + 1] < -5) {
        posAttr.array[i * 3 + 1] = 5
        posAttr.array[i * 3 + 0] = (Math.random() - 0.5) * 20
      }
    }

    posAttr.needsUpdate = true
    renderer.render(scene, camera)
  }

  tick()

  window.addEventListener('resize', function () {
    var W = window.innerWidth
    var H = window.innerHeight
    camera.aspect = W / H
    camera.updateProjectionMatrix()
    renderer.setSize(W, H)
  })
})
