
'use client'
import { useEffect, useRef } from 'react'
import { Renderer, Camera, Program, Mesh, Triangle, Vec2 } from 'ogl'

export default function IridescenceOGL(){
  const ref = useRef<HTMLCanvasElement|null>(null)

  useEffect(() => {
    const canvas = ref.current
    if(!canvas) return

    const renderer = new Renderer({ canvas, alpha: true, antialias: true, dpr: Math.min(2, window.devicePixelRatio || 1) })
    const gl = renderer.gl
    gl.clearColor(0,0,0,0)

    const camera = new Camera(gl, { fov: 45 })
    camera.position.z = 1

    const geometry = new Triangle(gl)

    const program = new Program(gl, {
      vertex: /* glsl */`
        attribute vec2 uv;
        attribute vec2 position;
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,
      fragment: /* glsl */`
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;

        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
        float noise(in vec2 p){
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0,0.0));
          float c = hash(i + vec2(0.0,1.0));
          float d = hash(i + vec2(1.0,1.0));
          vec2 u = f*f*(3.0-2.0*f);
          return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
        }

        /* Teal/Blau-Palette wie im Screenshot */
        vec3 palette(float t){
          vec3 a = vec3(0.02, 0.12, 0.18);
          vec3 b = vec3(0.02, 0.40, 0.42);
          vec3 c = vec3(0.00, 0.65, 0.78);
          vec3 d = vec3(0.01, 0.20, 0.35);
          return mix(mix(a,b,t), mix(c,d,t*t), 0.5);
        }

        void main(){
          vec2 uv = vUv - 0.5;
          uv.x += (uMouse.x-0.5) * 0.05;
          uv.y += (uMouse.y-0.5) * 0.03;

          float t = uTime * 0.06;
          float n = 0.0;
          float scale = 1.0;
          for(int i=0;i<4;i++){
            n += noise(uv*3.0*scale + t) / scale;
            scale *= 2.0;
          }
          float stripes = 0.5 + 0.5*sin(10.0*uv.x + 7.0*uv.y + uTime*0.8 + n*1.8);
          vec3 col = palette(stripes);

          float vig = smoothstep(0.95, 0.25, length(uv*1.3));
          col *= vig;

          gl_FragColor = vec4(col, 0.92);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vec2(0.5, 0.5) },
      },
      transparent: true,
    })

    const mesh = new Mesh(gl, { geometry, program })

    function resize(){ renderer.setSize(window.innerWidth, window.innerHeight) }
    resize()
    window.addEventListener('resize', resize)

    const mouse = program.uniforms.uMouse.value as any
    function onPointer(e: PointerEvent){
      mouse.x = e.clientX / window.innerWidth
      mouse.y = 1.0 - (e.clientY / window.innerHeight)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    let raf = 0
    const start = performance.now()
    const loop = () => {
      program.uniforms.uTime.value = (performance.now() - start) / 1000
      renderer.render({ scene: mesh, camera })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      /* OGL Renderer hat kein .dispose(); Kontext sauber freigeben */
      const lose = gl.getExtension('WEBGL_lose_context') as { loseContext?: () => void } | null
      if (lose?.loseContext) lose.loseContext()
    }
  }, [])

  return <canvas ref={ref} className="ogl-bg" aria-hidden="true" />
}
