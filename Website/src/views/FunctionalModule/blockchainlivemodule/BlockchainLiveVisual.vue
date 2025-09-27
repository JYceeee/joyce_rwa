<template>
    <div class="bc-wrap" @mousemove="onMouseMove">
      <div class="matrix-layer" aria-hidden="true"></div>
      <canvas ref="canvasEl" class="bc-canvas"></canvas>
  
      <!-- Tooltip -->
      <div v-show="tooltip.visible" class="tooltip" :style="tooltipStyle">
        <div class="tt-name">{{ tooltip.name }}</div>
        <div class="tt-line">Tx/sec: {{ tooltip.mockTPS }}</div>
        <div class="tt-line">Peers: {{ tooltip.peers }}</div>
      </div>
  
      <div class="bc-title">BLOCK CHAIN</div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, onBeforeUnmount, ref, reactive, computed } from 'vue'
  import * as THREE from 'three'
  import { Line2 } from 'three/examples/jsm/lines/Line2.js'
  import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
  import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
  
  // ---------- 参数 ----------
  const USE_TEXTURE_MAP = true
  const WORLD_MAP_IMG = '/world-map.png'
  const ICONS = ['/icons/cloud.png','/icons/lock.png','/icons/bulb.png']
  const PACKETS_PER_LINE = 3
  const PACKET_SPEED = 0.18
  const LINE_WIDTH_PX = 2.4   // 线宽（像素）
  const canvasEl = ref(null)
  
  // ---------- 数据 ----------
  const nodesLL = [
    { name: 'North America', key: 'NA',   lon: -100, lat: 40 },
    { name: 'Europe',        key: 'EU',   lon:    5, lat: 50 },
    { name: 'China',         key: 'CN',   lon:  105, lat: 35 },
    { name: 'SEA',           key: 'SEA',  lon:  103, lat:  1 },
    { name: 'Australia',     key: 'AUS',  lon:  151, lat: -33 },
    { name: 'Brazil',        key: 'BR',   lon:  -47, lat: -15 },
  ]
  const links = [
    ['NA','EU'], ['EU','CN'], ['CN','AUS'],
    ['NA','BR'], ['EU','SEA'], ['SEA','AUS'], ['NA','CN']
  ]
  
  // ---------- Three ----------
  let renderer, scene, camera, clock, animationId
  let mapMesh
  const nodeSpheres = []     // 真正可拾取的球
  const nodeGroups = []      // 包含球 + 光晕 + 图标
  const lineGroups = []      // { curve, line2, packets, tOffsets }
  const sprites = []         // 图标 sprite 列表
  const raycaster = new THREE.Raycaster()
  const mouseNDC = new THREE.Vector2()
  
  // ---------- Tooltip ----------
  const tooltip = reactive({ visible:false, x:0, y:0, name:'', mockTPS:0, peers:0 })
  const tooltipStyle = computed(() => ({
    left: `${tooltip.x + 14}px`,
    top: `${tooltip.y + 14}px`
  }))
  
  function onMouseMove(e){
    tooltip.x = e.clientX
    tooltip.y = e.clientY
  }
  
  // 经纬度 -> 平面坐标
  function lonLatToXY(lon, lat, width, height){
    return new THREE.Vector3(
      (lon/180)*(width/2),
      (lat/90)*(height/2),
      0
    )
  }
  
  onMounted(() => { init(); animate(); window.addEventListener('resize', onResize) })
  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onResize)
    renderer?.dispose()
  })
  
  function init(){
    const width = canvasEl.value.clientWidth || window.innerWidth
    const height = canvasEl.value.clientHeight || window.innerHeight
  
    renderer = new THREE.WebGLRenderer({ canvas: canvasEl.value, antialias:true, alpha:true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
  
    scene = new THREE.Scene()
    camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, -2000, 2000)
    camera.position.z = 500
    scene.add(new THREE.AmbientLight(0xffffff, 1))
  
    // 背景星点
    addStars(width, height)
  
    // 世界地图
    const mapW = Math.min(width*0.9, 1280)
    const mapH = mapW/2
    const planeGeo = new THREE.PlaneGeometry(mapW, mapH, 2, 2)
    if (USE_TEXTURE_MAP){
      const mapTex = new THREE.TextureLoader().load(WORLD_MAP_IMG)
      const planeMat = new THREE.MeshBasicMaterial({ map: mapTex, transparent:true, opacity:0.48 })
      mapMesh = new THREE.Mesh(planeGeo, planeMat)
    } else {
      const planeMat = new THREE.MeshBasicMaterial({ color: 0x0b2b4d, wireframe:true, transparent:true, opacity:.3 })
      mapMesh = new THREE.Mesh(planeGeo, planeMat)
    }
    scene.add(mapMesh)
  
    // 节点 + 光晕 + 图标
    const sphereGeo = new THREE.SphereGeometry(6, 24, 24)
    nodesLL.forEach((n,i)=>{
      const p = lonLatToXY(n.lon, n.lat, mapW, mapH)
  
      // glow sprite
      const glowTex = makeCircleTexture('#9fd3ff')
      const glowMat = new THREE.SpriteMaterial({ map: glowTex, transparent:true, opacity:.65, depthWrite:false, blending:THREE.AdditiveBlending })
      const glow = new THREE.Sprite(glowMat)
      glow.position.copy(p)
      glow.scale.set(60,60,1)
      scene.add(glow)
  
      // sphere (拾取用)
      const mat = new THREE.MeshBasicMaterial({ color: 0xbfeaff })
      const sp = new THREE.Mesh(sphereGeo, mat)
      sp.position.copy(p)
      sp.userData = { ...n, base:p.clone(), ringScale:1 }
      scene.add(sp)
  
      // icon sprite（随机挑图标）
      const iconTex = new THREE.TextureLoader().load(ICONS[i % ICONS.length])
      const icon = new THREE.Sprite(new THREE.SpriteMaterial({ map: iconTex, transparent:true, opacity:.9, depthWrite:false }))
      icon.position.copy(p).add(new THREE.Vector3(0, 26, 0))
      icon.scale.set(24,24,1)
      scene.add(icon)
  
      nodeGroups.push({ glow, icon, sphere: sp })
      nodeSpheres.push(sp)
      sprites.push(icon)
    })
  
    // 连线 + 数据包（Line2 渐变）
    links.forEach(([ak,bk])=>{
      const a = nodesLL.find(n=>n.key===ak)
      const b = nodesLL.find(n=>n.key===bk)
      const pa = nodeSpheres.find(m=>m.userData.key===ak).position
      const pb = nodeSpheres.find(m=>m.userData.key===bk).position
  
      const mid = pa.clone().add(pb).multiplyScalar(0.5)
      const control = mid.clone(); control.z = 120 + pa.distanceTo(pb)*0.15
      const curve = new THREE.QuadraticBezierCurve3(pa.clone(), control, pb.clone())
  
      // 几何采样
      const samples = 80
      const pts = curve.getPoints(samples)
      const positions = []
      const colors = []
      for (let i=0;i<pts.length;i++){
        const v = pts[i]
        positions.push(v.x, v.y, v.z)
        // 渐变颜色：两端淡、中间亮
        const t = i/(pts.length-1)
        const intensity = 0.35 + 0.65*Math.sin(Math.PI*t)
        colors.push(0.45*intensity, 0.78*intensity, 1.0*intensity) // 近似蓝白
      }
      const lineGeo = new LineGeometry()
      lineGeo.setPositions(positions)
      lineGeo.setColors(colors)
  
      const mat = new LineMaterial({
        linewidth: LINE_WIDTH_PX, vertexColors: true,
        transparent: true, opacity: 0.95,
        depthTest: true, dashed: false
      })
      mat.resolution.set(width, height)
      const line2 = new Line2(lineGeo, mat)
      scene.add(line2)
  
      // 数据包
      const packets = []
      const tOffsets = []
      for (let i=0;i<PACKETS_PER_LINE;i++){
        const pg = new THREE.SphereGeometry(3.2, 12, 12)
        const pm = new THREE.MeshBasicMaterial({ color: 0xffffff })
        const pmsh = new THREE.Mesh(pg, pm)
        pmsh.position.copy(curve.getPoint(i/PACKETS_PER_LINE))
        pmsh.userData = { scaleBase: 1 + Math.random()*0.4 }
        scene.add(pmsh)
        packets.push(pmsh)
        tOffsets.push(Math.random())
      }
  
      lineGroups.push({ curve, line2, packets, tOffsets })
    })
  
    clock = new THREE.Clock()
    onResize()
  
    // 启动拾取节流
    startRaycastLoop()
  }
  
  function addStars(width, height){
    const starGeo = new THREE.BufferGeometry()
    const count = 700
    const pos = new Float32Array(count*3)
    for (let i=0;i<count;i++){
      pos[i*3]   = THREE.MathUtils.randFloatSpread(width)
      pos[i*3+1] = THREE.MathUtils.randFloatSpread(height)
      pos[i*3+2] = THREE.MathUtils.randFloat(-240, -60)
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({ size:1.2, transparent:true, opacity:.45 })
    scene.add(new THREE.Points(starGeo, mat))
  }
  
  // 生成发光圆纹理（用于 glow sprite）
  function makeCircleTexture(color){
    const size = 128
    const cvs = document.createElement('canvas')
    cvs.width = cvs.height = size
    const ctx = cvs.getContext('2d')
    const g = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
    g.addColorStop(0, hexToRgba(color, .9))
    g.addColorStop(0.6, hexToRgba(color, .25))
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0,0,size,size)
    const tex = new THREE.CanvasTexture(cvs)
    tex.needsUpdate = true
    return tex
  }
  function hexToRgba(hex, a=1){
    const c = new THREE.Color(hex)
    return `rgba(${(c.r*255)|0}, ${(c.g*255)|0}, ${(c.b*255)|0}, ${a})`
  }
  
  function animate(){
    const t = clock.getElapsedTime()
  
    // 节点 glow 呼吸 + 图标漂浮
    nodeGroups.forEach((g, idx)=>{
      const s = 0.92 + 0.08 * Math.sin(t*2 + idx)
      g.glow.scale.setScalar(60*s)
      g.sphere.scale.setScalar(1 + 0.06*Math.sin(t*2.1 + idx))
      const bob = 2.5 * Math.sin(t*1.3 + idx)
      g.icon.position.y = g.sphere.position.y + 26 + bob
    })
  
    // 数据包沿曲线流动 + 微闪烁
    lineGroups.forEach(gr=>{
      gr.packets.forEach((p, i)=>{
        const tt = (gr.tOffsets[i] + PACKET_SPEED*(t%100)) % 1
        const pos = gr.curve.getPoint(tt)
        p.position.copy(pos)
        const twinkle = 0.8 + 0.2*Math.sin(t*8 + i)
        p.scale.setScalar(p.userData.scaleBase * twinkle)
        p.material.opacity = 0.7 + 0.3*Math.sin(t*4 + i)
      })
    })
  
    renderer.render(scene, camera)
    animationId = requestAnimationFrame(animate)
  }
  
  function onResize(){
    if(!renderer || !camera) return
    const w = canvasEl.value.parentElement.clientWidth
    const h = canvasEl.value.parentElement.clientHeight
    renderer.setSize(w, h)
    camera.left = -w/2; camera.right = w/2; camera.top = h/2; camera.bottom = -h/2
    camera.updateProjectionMatrix()
    // 更新 LineMaterial 分辨率（否则缩放后线宽异常）
    lineGroups.forEach(g => {
      g.line2.material.resolution.set(w, h)
    })
  }
  
  // --------- 拾取（节流）---------
  let lastPickTime = 0
  function startRaycastLoop(){
    const pick = (now)=>{
      if (now - lastPickTime > 80){ // 约 12.5fps 的拾取频率，节省性能
        lastPickTime = now
        // 转换 NDC
        const rect = renderer.domElement.getBoundingClientRect()
        mouseNDC.x = ((tooltip.x - rect.left) / rect.width) * 2 - 1
        mouseNDC.y = -((tooltip.y - rect.top) / rect.height) * 2 + 1
  
        raycaster.setFromCamera(mouseNDC, camera)
        const hits = raycaster.intersectObjects(nodeSpheres, false)
  
        if (hits.length){
          const obj = hits[0].object
          obj.material.color.set('#ffffff')
          tooltip.visible = true
          tooltip.name = obj.userData.name
          tooltip.mockTPS = (300 + Math.floor(200*Math.sin(perfNow()/700 + obj.id))).toLocaleString()
          tooltip.peers = 5 + (obj.id % 12)
  
          // 其他节点恢复颜色
          nodeSpheres.forEach(s => { if (s!==obj) s.material.color.set(0xbfeaff) })
        } else {
          tooltip.visible = false
          nodeSpheres.forEach(s => s.material.color.set(0xbfeaff))
        }
      }
      requestAnimationFrame(pick)
    }
    requestAnimationFrame(pick)
  }
  const perfNow = () => (typeof performance!=='undefined'? performance.now(): Date.now())
  </script>
  
  <style scoped>
  .bc-wrap{
    position: relative; width:100%; height:100vh; overflow:hidden;
    background: radial-gradient(1200px 600px at 50% 60%, rgba(60,120,200,.16), transparent 70%), #071324;
  }
  
  /* 背景数字雨 */
  .matrix-layer{
    position:absolute; inset:0; pointer-events:none; opacity:.33; filter: blur(.2px);
    background-image:
      linear-gradient(transparent 0 90%, rgba(255,255,255,.15) 92%, transparent 100%),
      repeating-linear-gradient(0deg, rgba(173,216,230,.06) 0 2px, transparent 2px 4px);
    background-size: 2px 24px, 100% 6px;
    animation: fall 12s linear infinite;
  }
  @keyframes fall{
    from { background-position: 0 0, 0 0; }
    to   { background-position: 0 1000px, 0 60px; }
  }
  
  .bc-canvas{ position:absolute; inset:0; width:100%; height:100%; display:block; }
  
  .bc-title{
    position:absolute; left:50%; bottom:4vh; transform:translateX(-50%);
    font-size:clamp(28px,5vw,64px); letter-spacing:.1em; color:#dff0ff;
    text-shadow:0 0 10px rgba(120,200,255,.75), 0 0 26px rgba(120,200,255,.55);
    font-weight:600; user-select:none;
  }
  
  /* Tooltip */
  .tooltip{
    position: fixed; z-index: 10; min-width: 160px;
    padding:10px 12px; border-radius:10px; background:rgba(6,18,36,.88);
    color:#dff0ff; box-shadow:0 6px 22px rgba(0,0,0,.35);
    border:1px solid rgba(120,200,255,.25); backdrop-filter: blur(6px);
  }
  .tt-name{ font-weight:700; margin-bottom:4px; }
  .tt-line{ font-size:12px; opacity:.9; }
  </style>

