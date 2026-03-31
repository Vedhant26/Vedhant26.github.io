// interactive-portrait.jsx

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

// Pre-fetch images into Image objects at module level.
const heroOffImg = new window.Image()
heroOffImg.crossOrigin = "anonymous"
heroOffImg.src = "/images/hero-off.webp"

const heroOnImg = new window.Image()
heroOnImg.crossOrigin = "anonymous"
heroOnImg.src = "/images/hero-on.webp"

export default function InteractivePortrait() {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const animationFrameRef = useRef()
  const fallbackRef = useRef(null)
  const [webglReady, setWebglReady] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const isMobile = window.innerWidth < 768
    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1.0) : Math.min(window.devicePixelRatio, 1.25)

    const gu = {
      time: { value: 0 },
      dTime: { value: 0 },
      aspect: { value: width / height },
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 1000)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" })
    renderer.setSize(width, height)
    renderer.setPixelRatio(pixelRatio)
    renderer.domElement.style.opacity = "0"
    renderer.domElement.style.transition = "opacity 0.25s ease-out"

    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    class Blob {
      constructor(renderer) {
        this.renderer = renderer
        
        // PING-PONG BUFFER STRATEGY:
        // Use two render targets instead of copying the framebuffer to a texture.
        // This is much faster as it stays on the GPU.
        this.renderTargetA = new THREE.WebGLRenderTarget(width, height)
        this.renderTargetB = new THREE.WebGLRenderTarget(width, height)
        this.currentRT = this.renderTargetA
        this.prevRT = this.renderTargetB

        this.uniforms = {
          pointer: { value: new THREE.Vector2().setScalar(10) },
          pointerDown: { value: 1 },
          pointerRadius: { value: 0.35 },
          pointerDuration: { value: 2.5 },
        }

        let rafPending = false
        const updatePointer = (clientX, clientY) => {
          if (rafPending) return
          rafPending = true
          requestAnimationFrame(() => {
            const rect = container.getBoundingClientRect()
            this.uniforms.pointer.value.x = ((clientX - rect.left) / width) * 2 - 1
            this.uniforms.pointer.value.y = -((clientY - rect.top) / height) * 2 + 1
            rafPending = false
          })
        }

        const handleMouseMove = (e) => updatePointer(e.clientX, e.clientY)
        const handleTouchMove = (e) => { if (e.touches.length > 0) updatePointer(e.touches[0].clientX, e.touches[0].clientY) }
        const handleMouseLeave = () => this.uniforms.pointer.value.setScalar(10)
        const handleTouchEnd = () => this.uniforms.pointer.value.setScalar(10)

        container.addEventListener("mousemove", handleMouseMove)
        container.addEventListener("mouseleave", handleMouseLeave)
        container.addEventListener("touchmove", handleTouchMove, { passive: true })
        container.addEventListener("touchend", handleTouchEnd)

        this._cleanup = () => {
          container.removeEventListener("mousemove", handleMouseMove)
          container.removeEventListener("mouseleave", handleMouseLeave)
          container.removeEventListener("touchmove", handleTouchMove)
          container.removeEventListener("touchend", handleTouchEnd)
          this.renderTargetA.dispose()
          this.renderTargetB.dispose()
        }

        this.rtScene = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.MeshBasicMaterial({
            color: 0x000000,
            onBeforeCompile: (shader) => {
              shader.uniforms.dTime = gu.dTime
              shader.uniforms.aspect = gu.aspect
              shader.uniforms.pointer = this.uniforms.pointer
              shader.uniforms.pointerDown = this.uniforms.pointerDown
              shader.uniforms.pointerRadius = this.uniforms.pointerRadius
              shader.uniforms.pointerDuration = this.uniforms.pointerDuration
              shader.uniforms.prevBuffer = { value: null } // Updated in render()
              shader.uniforms.time = gu.time
              shader.fragmentShader = `
                uniform float dTime, aspect, pointerDown, pointerRadius, pointerDuration, time;
                uniform vec2 pointer;
                uniform sampler2D prevBuffer;
                float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
                float noise(vec2 p) {
                  vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
                  float a = hash(i); float b = hash(i + vec2(1.,0.)); float c = hash(i + vec2(0.,1.)); float d = hash(i + vec2(1.,1.));
                  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
                }
                ${shader.fragmentShader}
              `.replace(
                `#include <color_fragment>`,
                `#include <color_fragment>
                float rVal = texture2D(prevBuffer, vUv).r;
                rVal -= clamp(dTime / pointerDuration, 0., 0.05);
                rVal = clamp(rVal, 0., 1.);
                float f = 0.;
                if (pointerDown > 0.5) {
                  vec2 uv = (vUv - 0.5) * 2. * vec2(aspect, 1.);
                  vec2 mouse = pointer * vec2(aspect, 1.);
                  vec2 toMouse = uv - mouse;
                  float angle = atan(toMouse.y, toMouse.x);
                  float dist = length(toMouse);
                  float noiseVal = noise(vec2(angle*3. + time*0.5, dist*5.));
                  float noiseVal2 = noise(vec2(angle*5. - time*0.3, dist*3. + time));
                  float radiusVariation = 0.7 + noiseVal*0.5 + noiseVal2*0.3;
                  float organicRadius = pointerRadius * radiusVariation;
                  f = 1. - smoothstep(organicRadius*0.05, organicRadius*1.2, dist);
                  f *= 0.8 + noiseVal*0.2;
                }
                rVal += f * 0.25;
                rVal = clamp(rVal, 0., 1.);
                diffuseColor.rgb = vec3(rVal);
                `,
              )
              this.rtMaterialShader = shader
            },
          }),
        )
        this.rtScene.material.defines = { USE_UV: "" }
        this.rtCamera = new THREE.Camera()
      }

      render() {
        if (this.rtMaterialShader) {
          this.rtMaterialShader.uniforms.prevBuffer.value = this.prevRT.texture
        }
        
        this.renderer.setRenderTarget(this.currentRT)
        this.renderer.render(this.rtScene, this.rtCamera)
        this.renderer.setRenderTarget(null)
        
        // Swap buffers (ping-pong)
        const temp = this.currentRT
        this.currentRT = this.prevRT
        this.prevRT = temp
      }

      get texture() {
        return this.prevRT.texture
      }
    }

    const blob = new Blob(renderer)

    const createTextureFromCachedImage = (preloadedImg, onReady) => {
      const texture = new THREE.Texture(preloadedImg)
      texture.colorSpace = THREE.SRGBColorSpace
      
      const updateTexture = () => {
        texture.needsUpdate = true
        if (onReady) onReady(texture)
      }

      if (preloadedImg.complete && preloadedImg.naturalWidth > 0) {
        updateTexture()
      } else {
        preloadedImg.addEventListener("load", updateTexture, { once: true })
      }
      return texture
    }

    let texturesLoaded = 0
    const onTextureReady = (texture, isBase) => {
      if (isBase && texture.image) {
        const img = texture.image
        const imgAspect = img.width / img.height
        const containerAspect = width / height
        let planeWidth, planeHeight
        if (imgAspect > containerAspect) {
          planeWidth = width; planeHeight = width / imgAspect
        } else {
          planeHeight = height; planeWidth = height * imgAspect
        }
        baseImage.geometry.dispose(); baseImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
        helmetImage.geometry.dispose(); helmetImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
      }
      texturesLoaded++
      if (texturesLoaded >= 2) {
        blob.render()
        renderer.render(scene, camera)
        requestAnimationFrame(() => {
          renderer.domElement.style.opacity = "1"
          setWebglReady(true)
        })
      }
    }

    const baseTexture = createTextureFromCachedImage(heroOffImg, (tex) => onTextureReady(tex, true))
    const helmetTexture = createTextureFromCachedImage(heroOnImg, (tex) => onTextureReady(tex, false))

    const baseImageMaterial = new THREE.MeshBasicMaterial({ map: baseTexture, transparent: true, alphaTest: 0.0 })
    const baseImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), baseImageMaterial)
    scene.add(baseImage)

    const bgPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true })
    bgPlaneMaterial.defines = { USE_UV: "" }
    bgPlaneMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.texBlob = { value: null } // Updated in animate loop
      shader.uniforms.time = gu.time
      let vertexShader = shader.vertexShader.replace("void main() {", "varying vec4 vPosProj;\nvoid main() {")
      vertexShader = vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\nvPosProj = gl_Position;")
      shader.vertexShader = vertexShader
      shader.fragmentShader = `
        uniform sampler2D texBlob; uniform float time; varying vec4 vPosProj;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
        float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);float a=hash(i);float b=hash(i+vec2(1.,0.));float c=hash(i+vec2(0.,1.));float d=hash(i+vec2(1.,1.));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
        float fbm(vec2 p) { float value = 0.0; float amplitude = 0.5; for (int i = 0; i < 4; i++) { value += amplitude * noise(p); p *= 2.1; amplitude *= 0.3; } return value; }
        ${shader.fragmentShader}
      `.replace(`#include <clipping_planes_fragment>`, `
        vec2 blobUV=((vPosProj.xy/vPosProj.w)+1.)*0.5;
        vec4 blobData=texture(texBlob,blobUV);
        if(blobData.r<0.02)discard;
        vec3 colorBg = vec3(1.0); vec3 colorSoftShape = vec3(0.92); vec3 colorLine = vec3(0.8);
        vec2 uv = vUv * 3.5;
        float distortion = fbm(vUv * 2.0 + time * 0.2);
        vec2 warpedUv = uv + (distortion - 0.5) * 0.7;
        float n = fbm(warpedUv);
        float softShapeMix = smoothstep(0.1, 0.9, sin(n * 3.0));
        vec3 baseColor = mix(colorBg, colorSoftShape, softShapeMix);
        float linePattern = fract(n * 15.0);
        float lineMix = 1.0 - smoothstep(0.49, 0.51, linePattern);
        diffuseColor.rgb = mix(baseColor, colorLine, lineMix);
        #include <clipping_planes_fragment>
      `)
      this.bgShader = shader
    }

    const bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), bgPlaneMaterial)
    scene.add(bgPlane)

    const helmetImageMaterial = new THREE.MeshBasicMaterial({ map: helmetTexture, transparent: true, alphaTest: 0.0 })
    helmetImageMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.texBlob = { value: null } // Updated in animate loop
      let vertexShader = shader.vertexShader.replace("void main() {", "varying vec4 vPosProj;\nvoid main() {")
      vertexShader = vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\nvPosProj = gl_Position;")
      shader.vertexShader = vertexShader
      shader.fragmentShader = `uniform sampler2D texBlob; varying vec4 vPosProj;\n${shader.fragmentShader}`.replace(`#include <clipping_planes_fragment>`, `
        vec2 blobUV=((vPosProj.xy/vPosProj.w)+1.)*0.5;
        vec4 blobData=texture(texBlob,blobUV);
        if(blobData.r<0.02)discard;
        #include <clipping_planes_fragment>
      `)
      this.helmetShader = shader
    }

    const helmetImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), helmetImageMaterial)
    scene.add(helmetImage)

    baseImage.position.z = 0; bgPlane.position.z = 0.05; helmetImage.position.z = 0.1

    const clock = new THREE.Clock()
    let t = 0, isVisible = true
    const observer = new IntersectionObserver(([ent]) => {
      isVisible = ent.isIntersecting
      if (isVisible) clock.getDelta()
    }, { threshold: 0 })
    observer.observe(container)

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)
      if (!isVisible) return
      const dt = clock.getDelta(); t += dt
      gu.time.value = t; gu.dTime.value = dt
      blob.render()
      const currentTexture = blob.texture
      if (this.bgShader) this.bgShader.uniforms.texBlob.value = currentTexture
      if (this.helmetShader) this.helmetShader.uniforms.texBlob.value = currentTexture
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const nw = container.clientWidth; const nh = container.clientHeight
      camera.left = nw / -2; camera.right = nw / 2; camera.top = nh / 2; camera.bottom = nh / -2; camera.updateProjectionMatrix()
      renderer.setSize(nw, nh); gu.aspect.value = nw / nh
      if (baseTexture.image) {
        const img = baseTexture.image; const ia = img.width / img.height; const ca = nw / nh
        let pw, ph; if (ia > ca) { pw = nw; ph = nw / ia } else { ph = nh; pw = nh * ia }
        baseImage.geometry.dispose(); baseImage.geometry = new THREE.PlaneGeometry(pw, ph)
        helmetImage.geometry.dispose(); helmetImage.geometry = new THREE.PlaneGeometry(pw, ph)
        bgPlane.geometry.dispose(); bgPlane.geometry = new THREE.PlaneGeometry(nw, nh)
      }
    }
    window.addEventListener("resize", handleResize)

    return () => {
      observer.disconnect(); if (blob._cleanup) blob._cleanup(); window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (rendererRef.current) { container.removeChild(rendererRef.current.domElement); rendererRef.current.dispose() }
      scene.traverse((o) => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()) } })
      baseTexture.dispose(); helmetTexture.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full bg-[#1a1f1a] cursor-crosshair overflow-hidden" style={{ touchAction: "none" }}>
      <img ref={fallbackRef} src="/images/hero-off.webp" alt="" loading="eager" fetchPriority="high" decoding="sync"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', zIndex: 5, opacity: webglReady ? 0 : 1, transition: webglReady ? 'opacity 0.25s ease-out' : 'none' }}
      />
      {!webglReady && <div style={{ position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite' }} />}
      <img src="/images/inspired-by-lando-norris.png" alt="Inspired by Lorenzo" loading="lazy" className="absolute bottom-4 left-4 z-10 pointer-events-none" style={{ maxWidth: "120px", width: "clamp(60px, 15vw, 120px)", height: "auto" }} />
      <style>{` @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } } `}</style>
    </div>
  )
}
