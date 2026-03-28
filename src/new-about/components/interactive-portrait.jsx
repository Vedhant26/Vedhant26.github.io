// interactive-portrait.jsx

import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"

// Preload images eagerly so they're in browser cache before component mounts
if (typeof window !== "undefined") {
  const link1 = document.createElement("link")
  link1.rel = "preload"
  link1.as = "image"
  link1.href = "/images/hero-off.webp"
  document.head.appendChild(link1)

  const link2 = document.createElement("link")
  link2.rel = "preload"
  link2.as = "image"
  link2.href = "/images/hero-on.webp"
  document.head.appendChild(link2)
}

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

    // Detect mobile for lower pixel ratio
    const isMobile = window.innerWidth < 768
    const pixelRatio = isMobile
      ? Math.min(window.devicePixelRatio, 1.0)
      : Math.min(window.devicePixelRatio, 1.25)

    const gu = {
      time: { value: 0 },
      dTime: { value: 0 },
      aspect: { value: width / height },
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)

    const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 1000)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: "high-performance" })
    renderer.setSize(width, height)
    renderer.setPixelRatio(pixelRatio)

    // Start with canvas hidden — fallback image is showing
    renderer.domElement.style.opacity = "0"
    renderer.domElement.style.transition = "opacity 0.6s ease-out"

    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    class Blob {
      constructor(renderer) {
        this.renderer = renderer
        this.fbTexture = { value: new THREE.FramebufferTexture(width, height) }
        this.rtOutput = new THREE.WebGLRenderTarget(width, height)
        this.uniforms = {
          pointer: { value: new THREE.Vector2().setScalar(10) },
          pointerDown: { value: 1 },
          pointerRadius: { value: 0.35 },
          pointerDuration: { value: 2.5 },
        }

        // Throttled mouse/touch handlers using rAF
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

        const handleMouseMove = (event) => {
          updatePointer(event.clientX, event.clientY)
        }

        const handleTouchMove = (event) => {
          if (event.touches.length > 0) {
            const touch = event.touches[0]
            updatePointer(touch.clientX, touch.clientY)
          }
        }

        const handleMouseLeave = () => {
          this.uniforms.pointer.value.setScalar(10)
        }

        const handleTouchEnd = () => {
          this.uniforms.pointer.value.setScalar(10)
        }

        container.addEventListener("mousemove", handleMouseMove)
        container.addEventListener("mouseleave", handleMouseLeave)
        container.addEventListener("touchmove", handleTouchMove, { passive: true })
        container.addEventListener("touchend", handleTouchEnd)

        // Store cleanup references
        this._cleanup = () => {
          container.removeEventListener("mousemove", handleMouseMove)
          container.removeEventListener("mouseleave", handleMouseLeave)
          container.removeEventListener("touchmove", handleTouchMove)
          container.removeEventListener("touchend", handleTouchEnd)
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
              shader.uniforms.fbTexture = this.fbTexture
              shader.uniforms.time = gu.time
              shader.fragmentShader = `
                uniform float dTime, aspect, pointerDown, pointerRadius, pointerDuration, time;
                uniform vec2 pointer;
                uniform sampler2D fbTexture;
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
                float rVal = texture2D(fbTexture, vUv).r;
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
            },
          }),
        )
        this.rtScene.material.defines = { USE_UV: "" }
        this.rtCamera = new THREE.Camera()
      }

      render() {
        this.renderer.setRenderTarget(this.rtOutput)
        this.renderer.render(this.rtScene, this.rtCamera)
        this.renderer.copyFramebufferToTexture(this.fbTexture.value)
        this.renderer.setRenderTarget(null)
      }
    }

    const blob = new Blob(renderer)

    let texturesLoaded = 0
    const totalTextures = 2

    const onTextureReady = () => {
      texturesLoaded++
      if (texturesLoaded >= totalTextures) {
        // Both textures loaded — render one frame, then crossfade
        blob.render()
        renderer.render(scene, camera)

        // Smoothly reveal the WebGL canvas over the fallback
        requestAnimationFrame(() => {
          renderer.domElement.style.opacity = "1"
          setWebglReady(true)
        })
      }
    }

    const textureLoader = new THREE.TextureLoader()
    const baseTexture = textureLoader.load("/images/hero-off.webp", (texture) => {
      const img = texture.image
      const imgAspect = img.width / img.height
      const containerAspect = width / height
      let planeWidth, planeHeight
      if (imgAspect > containerAspect) {
        planeWidth = width
        planeHeight = width / imgAspect
      } else {
        planeHeight = height
        planeWidth = height * imgAspect
      }
      baseImage.geometry.dispose()
      baseImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
      helmetImage.geometry.dispose()
      helmetImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)

      onTextureReady()
    })

    const helmetTexture = textureLoader.load("/images/hero-on.webp", () => {
      onTextureReady()
    })

    baseTexture.colorSpace = THREE.SRGBColorSpace
    helmetTexture.colorSpace = THREE.SRGBColorSpace

    const baseImageMaterial = new THREE.MeshBasicMaterial({ map: baseTexture, transparent: true, alphaTest: 0.0 })
    const baseImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), baseImageMaterial)
    scene.add(baseImage)

    const bgPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x1a1f1a, transparent: true })
    bgPlaneMaterial.defines = { USE_UV: "" }

    bgPlaneMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.texBlob = { value: blob.rtOutput.texture }
      shader.uniforms.time = gu.time

      let vertexShader = shader.vertexShader
      vertexShader = vertexShader.replace("void main() {", "varying vec4 vPosProj;\nvoid main() {")
      vertexShader = vertexShader.replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvPosProj = gl_Position;",
      )
      shader.vertexShader = vertexShader

      shader.fragmentShader = `
        uniform sampler2D texBlob; 
        uniform float time; 
        varying vec4 vPosProj;

        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
        float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);float a=hash(i);float b=hash(i+vec2(1.,0.));float c=hash(i+vec2(0.,1.));float d=hash(i+vec2(1.,1.));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
        
        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 4; i++) {
                value += amplitude * noise(p);
                p *= 2.1;
                amplitude *= 0.3;
            }
            return value;
        }

        ${shader.fragmentShader}
      `.replace(
        `#include <clipping_planes_fragment>`,
        `
        vec2 blobUV=((vPosProj.xy/vPosProj.w)+1.)*0.5;
        vec4 blobData=texture(texBlob,blobUV);
        if(blobData.r<0.02)discard;

        vec3 colorBg = vec3(1.0);
        vec3 colorSoftShape = vec3(0.92);
        vec3 colorLine = vec3(0.8);

        vec2 uv = vUv * 3.5;

        vec2 distortionField = vUv * 2.0;
        float distortion = fbm(distortionField + time * 0.2);

        float distortionStrength = 0.7;
        vec2 warpedUv = uv + (distortion - 0.5) * distortionStrength;
        
        float n = fbm(warpedUv);

        float softShapeMix = smoothstep(0.1, 0.9, sin(n * 3.0));
        vec3 baseColor = mix(colorBg, colorSoftShape, softShapeMix);
        float linePattern = fract(n * 15.0);
        float lineMix = 1.0 - smoothstep(0.49, 0.51, linePattern);
        vec3 finalColor = mix(baseColor, colorLine, lineMix);

        diffuseColor.rgb = finalColor;
        #include <clipping_planes_fragment>
        `,
      )
    }

    const bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), bgPlaneMaterial)
    scene.add(bgPlane)

    const helmetImageMaterial = new THREE.MeshBasicMaterial({ map: helmetTexture, transparent: true, alphaTest: 0.0 })

    helmetImageMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.texBlob = { value: blob.rtOutput.texture }
      let vertexShader = shader.vertexShader
      vertexShader = vertexShader.replace("void main() {", "varying vec4 vPosProj;\nvoid main() {")
      vertexShader = vertexShader.replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvPosProj = gl_Position;",
      )
      shader.vertexShader = vertexShader
      shader.fragmentShader = `
        uniform sampler2D texBlob; varying vec4 vPosProj;
        ${shader.fragmentShader}
      `.replace(
        `#include <clipping_planes_fragment>`,
        `
        vec2 blobUV=((vPosProj.xy/vPosProj.w)+1.)*0.5;
        vec4 blobData=texture(texBlob,blobUV);
        if(blobData.r<0.02)discard;
        #include <clipping_planes_fragment>
        `,
      )
    }

    const helmetImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), helmetImageMaterial)
    scene.add(helmetImage)

    baseImage.position.z = 0.0
    bgPlane.position.z = 0.05
    helmetImage.position.z = 0.1

    const clock = new THREE.Clock()
    let t = 0
    let isVisible = true

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        // Pause/resume clock to avoid huge delta after returning
        if (isVisible) {
          clock.getDelta() // flush accumulated time
        }
      },
      { threshold: 0 }
    )
    observer.observe(container)

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)
      if (!isVisible) return

      const dt = clock.getDelta()
      t += dt
      gu.time.value = t
      gu.dTime.value = dt
      blob.render()
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.left = newWidth / -2
      camera.right = newWidth / 2
      camera.top = newHeight / 2
      camera.bottom = newHeight / -2
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
      gu.aspect.value = newWidth / newHeight
      if (baseTexture.image) {
        const img = baseTexture.image
        const imgAspect = img.width / img.height
        const containerAspect = newWidth / newHeight
        let planeWidth, planeHeight
        if (imgAspect > containerAspect) {
          planeWidth = newWidth
          planeHeight = newWidth / imgAspect
        } else {
          planeHeight = newHeight
          planeWidth = newHeight * imgAspect
        }
        baseImage.geometry.dispose()
        baseImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
        helmetImage.geometry.dispose()
        helmetImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)

        bgPlane.geometry.dispose()
        bgPlane.geometry = new THREE.PlaneGeometry(newWidth, newHeight)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      observer.disconnect()
      if (blob._cleanup) blob._cleanup()
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        }
      })
      baseTexture.dispose()
      helmetTexture.dispose()
      blob.rtOutput.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-[#1a1f1a] cursor-crosshair overflow-hidden"
      style={{ touchAction: "none" }}
    >
      {/* Fallback image: shown IMMEDIATELY at full opacity, fades out once WebGL is ready */}
      <img
        ref={fallbackRef}
        src="/images/hero-off.webp"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          zIndex: 5,
          opacity: webglReady ? 0 : 1,
          transition: webglReady ? 'opacity 0.6s ease-out' : 'none',
        }}
      />
      {/* Loading shimmer overlay — only visible before WebGL is ready */}
      {!webglReady && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 6,
            pointerEvents: 'none',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite',
          }}
        />
      )}
      <img
        src="/images/inspired-by-lando-norris.png"
        alt="Inspired by Lorenzo"
        className="absolute bottom-4 left-4 z-10 pointer-events-none"
        style={{ maxWidth: "120px", width: "clamp(60px, 15vw, 120px)", height: "auto" }}
      />
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
