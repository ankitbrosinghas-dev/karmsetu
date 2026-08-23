import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useStore';
import { useAuth } from '../../contexts/AuthContext';
import { ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────────────────── */
const DPR = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
const reduced = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let id: ReturnType<typeof setTimeout>;
  return (...a: Parameters<T>) => { clearTimeout(id); id = setTimeout(() => fn(...a), ms); };
}
function sizeCanvas(c: HTMLCanvasElement) {
  c.width  = Math.round(c.offsetWidth  * DPR);
  c.height = Math.round(c.offsetHeight * DPR);
}

/* ─────────────────────────────────────────────────────────────────
   HERO CANVAS HOOK — WebGL shader + 2D fallback
───────────────────────────────────────────────────────────────── */
function useHeroCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    let raf: number, gl: WebGLRenderingContext | null = null;
    try { gl = cv.getContext('webgl') || cv.getContext('experimental-webgl') as WebGLRenderingContext | null; } catch {}
    const t0 = performance.now();
    const T  = () => (performance.now() - t0) / 1000;

    const doResize = () => {
      cv.width  = Math.round(cv.offsetWidth  * DPR);
      cv.height = Math.round(cv.offsetHeight * DPR);
      if (gl) gl.viewport(0, 0, cv.width, cv.height);
    };
    const onResize = debounce(doResize, 120);
    window.addEventListener('resize', onResize, { passive: true });
    doResize();

    if (gl) {
      const vs = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
      const fs = `precision mediump float;
uniform float T;uniform vec2 R;
float rib(float y,float c,float w){return smoothstep(0.,w,w-abs(y-c));}
void main(){
  vec2 uv=gl_FragCoord.xy/R;
  float t=T*.22,x=uv.x,y=uv.y;
  float r1=rib(y,.50+.13*sin(x*2.1+t)+.055*sin(x*4.4+t*1.8),.058);
  float r2=rib(y,.46+.15*sin(x*1.8+t*.75+2.1)+.065*sin(x*3.6+t*2.2),.058);
  float r3=rib(y,.54+.11*sin(x*2.7+t*1.15+4.2)+.048*sin(x*5.2+t*1.6),.054);
  vec3 c1=vec3(.380,.392,.940),c2=vec3(.58,.28,.96),c3=vec3(.18,.80,.94);
  vec3 col=min(r1*c1+r2*c2+r3*c3,vec3(1.));
  float g=exp(-pow((y-.50)*4.8,2.))*.065;
  col+=vec3(.36,.36,.90)*g;
  gl_FragColor=vec4(col,clamp(r1+r2+r3+g,0.,.80));
}`;
      const mk = (type: number, src: string) => {
        const s = gl!.createShader(type)!;
        gl!.shaderSource(s, src); gl!.compileShader(s); return s;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, mk(gl.VERTEX_SHADER, vs));
      gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(prog); gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
      const aL = gl.getAttribLocation(prog, 'a');
      gl.enableVertexAttribArray(aL);
      gl.vertexAttribPointer(aL, 2, gl.FLOAT, false, 0, 0);
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      const tL = gl.getUniformLocation(prog, 'T'), rL = gl.getUniformLocation(prog, 'R');
      const frame = () => {
        gl!.clearColor(0,0,0,0); gl!.clear(gl!.COLOR_BUFFER_BIT);
        gl!.uniform1f(tL, T()); gl!.uniform2f(rL, cv.width, cv.height);
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    } else {
      const ctx = cv.getContext('2d')!;
      const ribs = [
        { col: 'rgba(99,102,241,',  ph: 0,   fA: 2.1, fB: 4.4, aA: .13, aB: .055, by: .50 },
        { col: 'rgba(148,72,248,',  ph: 2.1, fA: 1.8, fB: 3.6, aA: .15, aB: .065, by: .46 },
        { col: 'rgba(46,206,240,',  ph: 4.2, fA: 2.7, fB: 5.2, aA: .11, aB: .048, by: .54 },
      ];
      const frame = () => {
        const t = T()*.22, W = cv.width, H = cv.height;
        ctx.clearRect(0,0,W,H);
        ribs.forEach(r => {
          ctx.beginPath(); ctx.lineWidth = H*.08; ctx.lineCap = 'round';
          ctx.strokeStyle = r.col + '.38)';
          for (let i = 0; i <= 180; i++) {
            const xn = i/180, x = xn*W;
            const y = (r.by + r.aA*Math.sin(xn*r.fA+t+r.ph) + r.aB*Math.sin(xn*r.fB+t*1.7))*H;
            i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
          }
          ctx.stroke();
        });
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
}

/* ─────────────────────────────────────────────────────────────────
   TILE CANVAS HOOK
───────────────────────────────────────────────────────────────── */
function useTileCanvas(
  ref: React.RefObject<HTMLCanvasElement | null>,
  draw: (ctx: CanvasRenderingContext2D, W: number, H: number, t: number) => void
) {
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const t0 = performance.now();
    let raf: number;
    const onResize = debounce(() => sizeCanvas(cv), 120);
    window.addEventListener('resize', onResize, { passive: true });
    sizeCanvas(cv);
    const frame = () => {
      draw(ctx, cv.width, cv.height, (performance.now()-t0)/1000);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
}

/* ─────────────────────────────────────────────────────────────────
   SPECTRUM CANVAS HOOK
───────────────────────────────────────────────────────────────── */
function useSpectrumCanvas(
  ref: React.RefObject<HTMLCanvasElement | null>,
  sectionRef: React.RefObject<HTMLElement | null>,
  gapRef: React.RefObject<HTMLSpanElement | null>
) {
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const t0 = performance.now();
    const BARS = 72, WS = Math.floor(BARS*.16), WE = Math.floor(BARS*.44);
    let raf: number | null = null;

    const doResize = debounce(() => {
      cv.width  = Math.round(cv.offsetWidth  * DPR);
      cv.height = Math.round(cv.offsetHeight * DPR);
    }, 120);
    window.addEventListener('resize', doResize, { passive: true });
    doResize();

    const frame = () => {
      const t = (performance.now()-t0)/1000, W = cv.width, H = cv.height;
      ctx.clearRect(0,0,W,H);
      const pad = 18*DPR, iW = W-pad*2, iH = H-pad*2;
      const bW = iW/BARS, gap = bW*.18, nW = bW-gap;
      let mx1=Infinity, mx2=-Infinity, my1=Infinity;
      for (let i = 0; i < BARS; i++) {
        const isW = (i >= WS && i < WE);
        const env = Math.sin((i/(BARS-1))*Math.PI);
        const osc = isW ? .90 : env*(.62 + .30*Math.sin(t*1.3+i*.38) + .13*Math.sin(t*2.1+i*.62));
        const bh = isW ? iH*.86 : Math.max(iH*.03, iH*osc);
        const x = pad+i*bW, y = H-pad-bh;
        ctx.fillStyle = isW ? 'rgba(99,102,241,.88)' : `rgba(255,255,255,${.06+.05*Math.sin(t*1.1+i*.42)})`;
        ctx.fillRect(x+gap/2, y, nW, bh);
        if (isW) { mx1=Math.min(mx1,x+gap/2); mx2=Math.max(mx2,x+gap/2+nW); my1=Math.min(my1,y); }
      }
      if (mx1 < Infinity) {
        const mp = 3*DPR, b = H-pad;
        ctx.beginPath(); ctx.rect(mx1-mp, my1-mp, (mx2-mx1)+mp*2, (b-my1)+mp);
        ctx.strokeStyle = 'rgba(99,102,241,.55)'; ctx.lineWidth = DPR; ctx.stroke();
      }
      if (gapRef.current) gapRef.current.textContent = String(38 + Math.round(2*Math.sin(t*.32)));
      raf = requestAnimationFrame(frame);
    };

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { if (!raf) raf = requestAnimationFrame(frame); }
        else { if (raf) { cancelAnimationFrame(raf); raf = null; } }
      });
    }, { threshold: .05 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => { obs.disconnect(); if (raf) cancelAnimationFrame(raf); window.removeEventListener('resize', doResize); };
  }, []);
}

/* ─────────────────────────────────────────────────────────────────
   LANDING PAGE COMPONENT
───────────────────────────────────────────────────────────────── */
export function LandingPage() {
  const navigate = useNavigate();
  const goLogin  = () => navigate('/login');

  // Canvas refs
  const heroRef     = useRef<HTMLCanvasElement>(null);
  const cv1Ref      = useRef<HTMLCanvasElement>(null);
  const cv2Ref      = useRef<HTMLCanvasElement>(null);
  const cv3Ref      = useRef<HTMLCanvasElement>(null);
  const cv4Ref      = useRef<HTMLCanvasElement>(null);
  const specRef     = useRef<HTMLCanvasElement>(null);
  const specSecRef  = useRef<HTMLElement>(null);
  const gapRef      = useRef<HTMLSpanElement>(null);

  // Intro stage & headline glyph rise
  const [introState, setIntroState] = useState<'showing' | 'fading' | 'gone'>('showing');
  const [introLineState, setIntroLineState] = useState<'' | 'show' | 'lift'>('');
  const hlRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reduced) {
      setIntroState('gone');
      if (hlRef.current) hlRef.current.textContent = 'from training delivery to competency intelligence';
      return;
    }

    const t1 = setTimeout(() => setIntroLineState('show'), 200);
    const t2 = setTimeout(() => setIntroLineState('lift'), 1500);
    const t3 = setTimeout(() => {
      setIntroState('fading');
      // Trigger glyph build and rise
      const el = hlRef.current;
      if (el) {
        el.innerHTML = '';
        const words = 'from training delivery to competency intelligence'.split(' ');
        let delay = 0;
        words.forEach((word) => {
          const ws = document.createElement('span');
          ws.style.cssText = 'display:inline-block;white-space:nowrap;margin-right:0.28em;';
          word.split('').forEach(ch => {
            const s = document.createElement('span');
            s.className = 'ks-glyph'; s.textContent = ch;
            s.style.transitionDelay = delay + 'ms'; delay += 38;
            ws.appendChild(s);
          });
          el.appendChild(ws);
        });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.querySelectorAll('.ks-glyph').forEach(g => g.classList.add('risen'));
          });
        });
      }
    }, 2000);
    const t4 = setTimeout(() => setIntroState('gone'), 2600);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  // Scroll reveal
  useEffect(() => {
    if (reduced) { document.querySelectorAll('.ks-reveal').forEach(el => el.classList.add('in')); return; }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
    }, { threshold: .14, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.ks-reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Scroll-hint hide
  const hintRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const hide = () => { if (hintRef.current) { hintRef.current.style.opacity = '0'; } };
    window.addEventListener('scroll', hide, { once: true, passive: true });
    return () => window.removeEventListener('scroll', hide);
  }, []);

  // Hero WebGL
  useHeroCanvas(heroRef);

  // Tile 1 — Diagnose: waveform with dip
  useTileCanvas(cv1Ref, (ctx, W, H, t) => {
    ctx.clearRect(0,0,W,H);
    ctx.beginPath();
    for (let i = 0; i <= 140; i++) {
      const xn = i/140, x = xn*W;
      const dip = Math.exp(-Math.pow((xn-.60)*9.5, 2));
      const amp = (0.21 - 0.17*dip)*H;
      const y = H*.5 + amp*Math.sin(xn*11+t*2.5) + amp*.32*Math.sin(xn*19+t*1.6);
      i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.strokeStyle = 'rgba(99,102,241,.78)'; ctx.lineWidth = DPR; ctx.stroke();
    const gx = .60*W;
    ctx.save(); ctx.beginPath(); ctx.moveTo(gx, H*.10); ctx.lineTo(gx, H*.90);
    ctx.strokeStyle = 'rgba(99,102,241,.28)'; ctx.lineWidth = DPR; ctx.setLineDash([3,4]); ctx.stroke(); ctx.restore();
  });

  // Tile 2 — Root Cause: block grid
  useTileCanvas(cv2Ref, (ctx, W, H, t) => {
    ctx.clearRect(0,0,W,H);
    const COLS=8, ROWS=2, DR=1, DC=5;
    const cW=W/COLS, cH=H/ROWS, pad=Math.max(2,cW*.11);
    for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) {
      const dim = (r===DR && c===DC);
      const a = dim ? .09+.04*Math.sin(t*1.2+r*2.1+c*1.3) : .15+.52*(.5+.5*Math.sin(t*2.3+r*1.9+c*1.1));
      ctx.fillStyle = dim ? `rgba(99,102,241,${a})` : `rgba(255,255,255,${a})`;
      ctx.fillRect(c*cW+pad, r*cH+pad, cW-pad*2, cH-pad*2);
    }
  });

  // Tile 3 — Learn: four wavy tracks
  const tracks = [{y:.18,f:8.5,s:1.8,a:.20},{y:.39,f:12,s:2.3,a:.38},{y:.61,f:9.5,s:1.5,a:.60},{y:.82,f:14,s:2.8,a:.84}];
  useTileCanvas(cv3Ref, (ctx, W, H, t) => {
    ctx.clearRect(0,0,W,H);
    tracks.forEach((tr, i) => {
      ctx.beginPath();
      for (let n=0;n<=150;n++) {
        const xn=n/150, x=xn*W;
        const y=tr.y*H + H*.04*Math.sin(xn*tr.f+t*tr.s+i*1.3);
        n===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.strokeStyle=`rgba(99,102,241,${tr.a})`; ctx.lineWidth=DPR; ctx.stroke();
    });
  });

  // Tile 4 — Re-Assess: sweeping arc
  useTileCanvas(cv4Ref, (ctx, W, H, t) => {
    ctx.clearRect(0,0,W,H);
    const cx=W*.5, cy=H*.5, r=Math.min(W,H)*.32;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,255,255,.07)'; ctx.lineWidth=2*DPR; ctx.stroke();
    const sw=(t*.60)%1, sa=-Math.PI/2, ea=sa+sw*Math.PI*2;
    ctx.beginPath(); ctx.arc(cx,cy,r,sa,ea);
    ctx.strokeStyle='rgba(99,102,241,.88)'; ctx.lineWidth=2*DPR; ctx.lineCap='round'; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx+r*Math.cos(ea), cy+r*Math.sin(ea), 2.5*DPR, 0, Math.PI*2);
    ctx.fillStyle='rgb(99,102,241)'; ctx.fill();
    const p=.5+.5*Math.sin(t*2.5);
    ctx.beginPath(); ctx.arc(cx,cy,(2+1.5*p)*DPR,0,Math.PI*2);
    ctx.fillStyle=`rgba(99,102,241,${.5+.5*p})`; ctx.fill();
  });

  // Spectrum
  useSpectrumCanvas(specRef, specSecRef, gapRef);

  /* ── Styles (scoped inline) ─────────────────────────────────── */
  const S = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400&family=JetBrains+Mono:wght@300&display=swap');
    #ks-root{all:initial;display:block;font-family:'Inter',system-ui,sans-serif;font-weight:300;font-size:16px;line-height:1.6;color:#fff;background:#0A0A0A;overflow-x:hidden;-webkit-font-smoothing:antialiased}
    #ks-root *,#ks-root *::before,#ks-root *::after{box-sizing:border-box}
    #ks-root h1,#ks-root h2,#ks-root h3,#ks-root p,#ks-root ul,#ks-root ol{margin:0;padding:0}
    #ks-root{--g:#6366F1;--gp:#4338CA;--h:rgba(255,255,255,.10);--h2:rgba(255,255,255,.06);--mu:#71717A;--gut:clamp(24px,5vw,64px);--cap:1152px}
    .ks-mono{font-family:'JetBrains Mono',monospace;font-weight:300;font-size:10px;letter-spacing:.12em;text-transform:uppercase}
    #ks-root .ks-wrap{width:100%;max-width:var(--cap);margin:0 auto;padding:0 var(--gut);box-sizing:border-box}
    .ks-reveal{opacity:0;transform:translateY(20px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1)}
    .ks-reveal.in{opacity:1;transform:none}
    /* INTRO STAGE */
    #ks-intro{position:fixed;inset:0;z-index:9999;background:#0A0A0A;display:flex;align-items:center;justify-content:center;transition:opacity .6s cubic-bezier(.4,0,.2,1)}
    #ks-intro.fading{opacity:0;pointer-events:none}
    #ks-intro.gone{display:none}
    #ks-intro-line{font-family:'Inter',system-ui,sans-serif;font-size:clamp(2.2rem,6vw,4.5rem);font-weight:300;letter-spacing:-.05em;color:#fff;opacity:0;transform:translateY(14px);transition:opacity .5s ease,transform .5s ease}
    #ks-intro-line.show{opacity:1;transform:none}
    #ks-intro-line.lift{opacity:0;transform:translateY(-12px);transition:opacity .35s ease,transform .35s ease}
    /* NAV */
    #ks-nav{position:fixed;top:0;left:0;right:0;z-index:100;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);background:rgba(10,10,10,.82);border-bottom:1px solid var(--h2);padding:0 var(--gut)}
    #ks-nav-i{max-width:var(--cap);margin:0 auto;height:52px;display:flex;align-items:center;justify-content:space-between;gap:24px}
    .ks-mark{font-family:'Inter',sans-serif;font-weight:400;font-size:16px;letter-spacing:-.02em;color:#fff;text-decoration:none;flex-shrink:0}
    .ks-mark span{color:var(--g)}
    .ks-navlinks{display:flex;align-items:center;gap:clamp(20px,3vw,40px)}
    .ks-nl{font-family:'JetBrains Mono',monospace;font-weight:300;font-size:10px;letter-spacing:.10em;text-transform:uppercase;color:var(--mu);text-decoration:none;transition:color .2s;position:relative;padding-bottom:2px;cursor:pointer}
    .ks-nl::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:1px;background:var(--g);transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.16,1,.3,1)}
    .ks-nl:hover{color:#fff}.ks-nl:hover::after{transform:scaleX(1)}
    /* BUTTONS */
    .ks-btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 24px;font-family:'JetBrains Mono',monospace;font-weight:300;font-size:10px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;cursor:pointer;border:none;border-radius:0;transition:background .2s,color .2s,border-color .2s,transform .15s;white-space:nowrap}
    .ks-btn:active{transform:scale(.97)}
    .ks-bp{background:var(--g);color:#fff;border:1px solid var(--g)}.ks-bp:hover{background:var(--gp);border-color:var(--gp)}
    .ks-bs{background:transparent;color:#fff;border:1px solid var(--h)}.ks-bs:hover{border-color:rgba(255,255,255,.32)}
    /* HERO */
    #ks-hero{position:relative;min-height:100svh;display:flex;flex-direction:column;justify-content:center;padding-top:clamp(80px,12vh,130px);padding-bottom:clamp(40px,6vh,80px);overflow:hidden}
    #ks-hcv{position:absolute;inset:0;width:100%;height:100%;display:block}
    #ks-veil{position:absolute;inset:0;pointer-events:none;background:linear-gradient(to bottom,rgba(10,10,10,0) 0%,rgba(10,10,10,.10) 40%,rgba(10,10,10,.88) 78%,rgba(10,10,10,.97) 100%)}
    #ks-root #ks-hcontent{position:relative;z-index:2;padding:0 var(--gut);max-width:var(--cap);margin:0 auto;width:100%}
    #ks-mbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:24px;border-bottom:1px solid var(--h2);padding-bottom:14px}
    #ks-meta{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:300;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.32);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1}
    #ks-metademo{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:300;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.55);text-decoration:none;border:1px solid rgba(255,255,255,.16);padding:5px 14px;white-space:nowrap;flex-shrink:0;transition:color .2s,border-color .2s;cursor:pointer}
    #ks-metademo:hover{color:#fff;border-color:rgba(255,255,255,.38)}
    #ks-hl{font-size:clamp(2.6rem,6.8vw,5.6rem);line-height:1.05;letter-spacing:-.03em;font-weight:300;margin-bottom:24px;max-width:18ch}
    .ks-glyph{display:inline-block;opacity:0;transform:translateY(.20em);transition:opacity .45s ease,transform .45s cubic-bezier(.16,1,.3,1)}
    .ks-glyph.risen{opacity:1;transform:none}
    #ks-para{max-width:46ch;font-size:15.5px;line-height:1.75;color:rgba(255,255,255,.68);margin-bottom:44px}
    #ks-btns{display:flex;gap:18px;flex-wrap:wrap;align-items:center;margin-top:8px}
    /* SCROLL HINT */
    #ks-hint{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;opacity:0;animation:ksHF 1s .5s forwards;z-index:3;pointer-events:none;transition:opacity .4s}
    #ks-hint span{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.28)}
    #ks-hint svg{width:14px;height:14px;stroke:rgba(255,255,255,.28);animation:ksChev 1.6s ease-in-out infinite}
    @keyframes ksHF{to{opacity:1}}
    @keyframes ksChev{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}
    /* BANDS */
    .ks-band{border-top:1px solid var(--h);padding:clamp(56px,8vw,104px) 0}
    .ks-eyebrow{display:flex;align-items:center;gap:20px;margin-bottom:clamp(32px,4.5vw,56px)}
    .ks-rule{flex:1;height:1px;background:var(--h)}
    .ks-bhead{display:grid;grid-template-columns:1.15fr 1fr;align-items:start;gap:clamp(20px,3.5vw,52px);margin-bottom:clamp(32px,4.5vw,56px)}
    @media(max-width:860px){.ks-bhead{grid-template-columns:1fr;gap:14px}}
    .ks-bhl{font-size:clamp(1.6rem,3.2vw,2.6rem);font-weight:300;letter-spacing:-.03em;line-height:1.2;max-width:20ch;overflow-wrap:break-word}
    .ks-lede{font-size:14.5px;line-height:1.7;color:rgba(255,255,255,.58);max-width:42ch;padding-top:4px;overflow-wrap:break-word}
    /* ENGINE GRID */
    #ks-eg{display:grid;grid-template-columns:repeat(4,1fr);background:var(--h2);gap:1px}
    @media(max-width:1000px){#ks-eg{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:560px){#ks-eg{grid-template-columns:1fr}}
    .ks-tile{background:#0A0A0A;padding:22px 22px 28px;display:flex;flex-direction:column;transition:background .25s}
    .ks-tile:hover{background:#0d0d0f}
    .ks-tcw{width:100%;height:72px;margin-bottom:18px;overflow:hidden;flex-shrink:0}
    .ks-tc{width:100%;height:72px;display:block}
    .ks-thd{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:9px}
    .ks-ttl{font-size:16px;font-weight:400;letter-spacing:-.02em;line-height:1.2}
    .ks-tidx{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.12em;color:var(--mu);margin-top:3px}
    .ks-tbody{font-size:13px;line-height:1.65;color:rgba(255,255,255,.45)}
    /* SPECTRUM */
    #ks-spec{border:1px solid var(--h);height:clamp(180px,30vw,320px);position:relative;overflow:hidden;background:#0F0F11}
    #ks-scv{width:100%;height:100%;display:block}
    .ks-sl{position:absolute;bottom:14px;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.14em;text-transform:uppercase}
    .ks-sl-l{left:18px;color:rgba(255,255,255,.40)}
    .ks-sl-r{right:18px;color:var(--g)}
    /* STATS */
    #ks-sg{display:grid;grid-template-columns:repeat(4,1fr);background:var(--h2);gap:1px}
    @media(max-width:1000px){#ks-sg{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:560px){#ks-sg{grid-template-columns:1fr}}
    .ks-sc{background:#0A0A0A;padding:34px 26px;transition:background .25s}.ks-sc:hover{background:#0d0d0f}
    .ks-sn{font-size:clamp(2rem,4.8vw,3.2rem);font-weight:300;letter-spacing:-.04em;line-height:1;margin-bottom:10px}
    .ks-sn .hi{color:var(--g)}
    .ks-scap{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:var(--mu)}
    /* FAQ */
    .ks-fq{border-top:1px solid var(--h)}.ks-fq:last-child{border-bottom:1px solid var(--h)}
    .ks-fq summary{display:flex;align-items:center;justify-content:space-between;padding:20px 0;cursor:pointer;list-style:none;font-size:15.5px;font-weight:300;color:#fff;transition:color .2s;gap:24px;user-select:none}
    .ks-fq summary::-webkit-details-marker{display:none}
    .ks-fq summary:hover{color:var(--g)}
    .ks-fi{flex-shrink:0;width:14px;height:14px;position:relative}
    .ks-fi::before,.ks-fi::after{content:'';position:absolute;background:currentColor;transition:transform .3s cubic-bezier(.16,1,.3,1),opacity .3s}
    .ks-fi::before{width:14px;height:1px;top:6.5px;left:0}
    .ks-fi::after{width:1px;height:14px;top:0;left:6.5px}
    details[open] .ks-fi::after{transform:scaleY(0);opacity:0}
    .ks-fb{display:grid;grid-template-rows:0fr;transition:grid-template-rows .35s cubic-bezier(.16,1,.3,1)}
    details[open] .ks-fb{grid-template-rows:1fr}
    .ks-fbi{overflow:hidden;font-size:14.5px;line-height:1.78;color:rgba(255,255,255,.55)}
    .ks-fbi p{padding-bottom:22px;max-width:68ch}
    /* CLOSE */
    #ks-close{padding:clamp(80px,10vw,136px) var(--gut);text-align:center;border-top:1px solid var(--h)}
    #ks-chl{font-size:clamp(2.2rem,6.5vw,5rem);font-weight:300;letter-spacing:-.05em;line-height:.92;max-width:16ch;margin:0 auto 36px}
    #ks-cbtns{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;margin-top:12px}
    /* FOOTER */
    #ks-foot{border-top:1px solid var(--h2);padding:24px var(--gut)}
    #ks-footi{max-width:var(--cap);margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
    .ks-flinks{display:flex;gap:22px}
    .ks-fl{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--mu);text-decoration:none;transition:color .2s;cursor:pointer}
    .ks-fl:hover{color:#fff}
    @media(max-width:700px){.ks-nl{display:none}}
    @media(prefers-reduced-motion:reduce){
      #ks-hint{display:none}.ks-glyph{opacity:1!important;transform:none!important;transition:none!important}
      .ks-reveal{opacity:1!important;transform:none!important;transition:none!important}
      .ks-fb{transition:none!important}
      *,*::before,*::after{animation:none!important;transition-duration:.01ms!important}
    }
  `;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="ks-root">
      <style>{S}</style>

      {/* INTRO STAGE */}
      {introState !== 'gone' && (
        <div id="ks-intro" className={introState === 'fading' ? 'fading' : ''} aria-hidden="true">
          <div id="ks-intro-line" className={introLineState}>
            beyond course completion
          </div>
        </div>
      )}

      {/* NAV */}
      <nav id="ks-nav" aria-label="Main navigation">
        <div id="ks-nav-i">
          <a className="ks-mark" href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top:0, behavior:'smooth' }); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.png" alt="KarmSetu Logo" style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 4 }} />
            <span>Karm<span>Setu</span></span>
          </a>
          <div className="ks-navlinks">
            <span className="ks-nl" onClick={() => scrollTo('ks-engine')}>Platform</span>
            <span className="ks-nl" onClick={() => scrollTo('ks-engine')}>The Loop</span>
            <span className="ks-nl" onClick={() => scrollTo('ks-stats')}>For ISS</span>
            <span className="ks-nl" onClick={() => scrollTo('ks-faq')}>Contact</span>
            <button className="ks-btn ks-bp" style={{padding:'8px 18px'}} onClick={goLogin}>Request a Demo</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="ks-hero" aria-label="Hero">
        <canvas id="ks-hcv" ref={heroRef} aria-hidden="true" />
        <div id="ks-veil" aria-hidden="true" />
        <div id="ks-hcontent">
          <div id="ks-mbar">
            <p id="ks-meta">AI-Powered Competency Intelligence &mdash; India&rsquo;s Official Statistical System</p>
            <button id="ks-metademo" onClick={goLogin}>Request a Demo</button>
          </div>
          <h1 id="ks-hl" ref={hlRef} aria-label="from training delivery to competency intelligence" />
          <p id="ks-para">Identify gaps, understand root causes, personalize training, and measure actual capability improvement &mdash; not just course completion.</p>
          <div id="ks-btns">
            <button className="ks-btn ks-bp" onClick={goLogin}>Request a Demo</button>
            <button className="ks-btn ks-bs" onClick={() => scrollTo('ks-engine')}>See How It Works</button>
          </div>
        </div>
        <div id="ks-hint" ref={hintRef} aria-hidden="true">
          <span>Scroll</span>
          <svg viewBox="0 0 14 14" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2,4 7,10 12,4"/>
          </svg>
        </div>
      </section>

      {/* BAND 01 — ENGINE */}
      <section id="ks-engine" aria-labelledby="ks-ehl">
        <div className="ks-wrap">
          <div className="ks-band" style={{borderTop:'none', paddingTop:'clamp(56px,8vw,104px)'}}>
            <div className="ks-eyebrow ks-reveal">
              <span className="ks-mono" style={{color:'var(--mu)'}}>01 &middot; The Loop</span>
              <div className="ks-rule" />
            </div>
            <div className="ks-bhead ks-reveal">
              <h2 id="ks-ehl" className="ks-bhl">Traditional systems record completion.</h2>
              <p className="ks-lede">KarmSetu measures actual competency improvement through an adaptive AI loop that never stops re-checking its own diagnosis.</p>
            </div>
            <div id="ks-eg" className="ks-reveal">
              {[
                { ref: cv1Ref, id: 'cv1', n: '01', title: 'Diagnose Gap',     desc: 'Identify exact weaknesses using adaptive items that converge on the gap boundary.', route: '/learner/why-weak' },
                { ref: cv2Ref, id: 'cv2', n: '02', title: 'Find Root Cause',  desc: 'Map the gap to its missing prerequisite — surface the exact prior-knowledge failure.', route: '/learner/why-weak' },
                { ref: cv3Ref, id: 'cv3', n: '03', title: 'Learn & Practice', desc: 'AI-generated adaptive MCQs target the identified gap, not a pre-built shared question bank.', route: '/learner/practice' },
                { ref: cv4Ref, id: 'cv4', n: '04', title: 'Re-Assess',        desc: 'Update the Competency Passport with verified capability — loop closes only when gap is confirmed closed.', route: '/learner/passport' },
              ].map(tile => (
                <div className="ks-tile" key={tile.id} style={{cursor:'pointer'}} onClick={() => navigate(tile.route)}>
                  <div className="ks-tcw"><canvas className="ks-tc" ref={tile.ref} /></div>
                  <div className="ks-thd">
                    <span className="ks-ttl">{tile.title}</span>
                    <span className="ks-tidx ks-mono">{tile.n}</span>
                  </div>
                  <p className="ks-tbody">{tile.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BAND 02 — SPECTRUM */}
      <section id="ks-spectrum" ref={specSecRef as React.RefObject<HTMLElement>} aria-labelledby="ks-spechl">
        <div className="ks-wrap">
          <div className="ks-band">
            <div className="ks-eyebrow ks-reveal">
              <span className="ks-mono" style={{color:'var(--mu)'}}>02 &middot; Competency Spectrum</span>
              <div className="ks-rule" />
            </div>
            <div className="ks-bhead ks-reveal">
              <h2 id="ks-spechl" className="ks-bhl">See the exact band that&rsquo;s weak.</h2>
              <p className="ks-lede">Not a pass or fail score &mdash; a live map of where capability breaks down inside a single module.</p>
            </div>
            <div id="ks-spec" className="ks-reveal" role="img" aria-label="Competency spectrum: diagnosed weak band in Survey Methodology Module 04">
              <canvas id="ks-scv" ref={specRef} />
              <p className="ks-sl ks-sl-l">Survey Methodology &mdash; Module 04</p>
              <p className="ks-sl ks-sl-r">Gap Score &mdash; <span ref={gapRef}>38</span>%</p>
            </div>
          </div>
        </div>
      </section>

      {/* BAND 03 — STATS */}
      <section id="ks-stats" aria-labelledby="ks-sthl">
        <div className="ks-wrap">
          <div className="ks-band">
            <div className="ks-eyebrow ks-reveal">
              <span className="ks-mono" style={{color:'var(--mu)'}}>03 &middot; Impact</span>
              <div className="ks-rule" />
            </div>
            <div className="ks-bhead ks-reveal">
              <h2 id="ks-sthl" className="ks-bhl">Measured, not assumed.</h2>
              <p className="ks-lede">Numbers from officers who went through the loop &mdash; not course-completion certificates.</p>
            </div>
            <div id="ks-sg" className="ks-reveal">
              {[
                { num: <><span className="hi">12</span>,000+</>, cap: 'Officers assessed' },
                { num: <><span className="hi">86</span>%</>,     cap: 'Root-cause accuracy' },
                { num: <><span className="hi">3</span>.2×</>,    cap: 'Faster competency recovery' },
                { num: <><span className="hi">500</span>+</>,    cap: 'Adaptive MCQ sets' },
              ].map((s, i) => (
                <div className="ks-sc" key={i}>
                  <div className="ks-sn">{s.num}</div>
                  <div className="ks-scap">{s.cap}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BAND 04 — FAQ */}
      <section id="ks-faq" aria-labelledby="ks-fhl">
        <div className="ks-wrap">
          <div className="ks-band">
            <div className="ks-eyebrow ks-reveal">
              <span className="ks-mono" style={{color:'var(--mu)'}}>04 &middot; FAQ</span>
              <div className="ks-rule" />
            </div>
            <div className="ks-bhead ks-reveal">
              <h2 id="ks-fhl" className="ks-bhl">Common questions.</h2>
              <p className="ks-lede">From training heads and ISS officers evaluating the loop.</p>
            </div>
            <div className="ks-reveal">
              {[
                { q: 'How is this different from an LMS?', a: 'An LMS tracks whether a course was completed. KarmSetu diagnoses the specific competency gap, traces it to a missing prerequisite, and only then prescribes practice — then re-checks that the gap actually closed.' },
                { q: 'What does "Competency Passport" mean?', a: 'A living record per officer, updated after every re-assessment cycle, showing verified capability rather than a list of attended sessions.' },
                { q: 'Can it plug into existing training infrastructure?', a: 'Yes. KarmSetu sits alongside existing LMS and HR systems and ingests assessment data through standard integrations, with no disruption to current workflows.' },
                { q: 'Is officer data secure?', a: "Assessment data is handled under government data-security requirements for India's Official Statistical System. Nothing is used outside the assessment loop it was collected for." },
                { q: 'How are the adaptive MCQs generated?', a: "An AI model generates questions targeted at the exact prerequisite gap identified in the root-cause step — not from a fixed question bank, so every set is unique to the officer's diagnosed gap." },
              ].map((item, i) => (
                <details className="ks-fq" key={i}>
                  <summary>{item.q}<span className="ks-fi" aria-hidden="true" /></summary>
                  <div className="ks-fb"><div className="ks-fbi"><p>{item.a}</p></div></div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLOSE */}
      <div id="ks-close" className="ks-reveal">
        <p id="ks-chl">measure competency,<br/>not completion</p>
        <div id="ks-cbtns">
          <button className="ks-btn ks-bp" onClick={goLogin}>Request a Demo</button>
          <button className="ks-btn ks-bs" onClick={() => scrollTo('ks-faq')}>Talk to Us</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer id="ks-foot">
        <div id="ks-footi">
          <span className="ks-mono" style={{color:'var(--mu)'}}>KarmSetu &mdash; AI Competency Intelligence &middot; 2026</span>
          <div className="ks-flinks">
            <span className="ks-fl" onClick={() => scrollTo('ks-faq')}>Privacy</span>
            <span className="ks-fl" onClick={() => scrollTo('ks-faq')}>Terms</span>
            <span className="ks-fl" onClick={() => scrollTo('ks-faq')}>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LOGIN PAGE (unchanged)
───────────────────────────────────────────────────────────────── */
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAppStore();
  const { signInWithGoogle, user } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedRole, setSelectedRole] = React.useState<'LEARNER' | 'MANAGER' | 'ADMIN' | null>(null);
  const [designation, setDesignation] = React.useState<string>('');

  const handleRoleSelect = (role: 'LEARNER' | 'MANAGER' | 'ADMIN') => {
    setSelectedRole(role);
    if (role === 'LEARNER') setDesignation('Statistical Officer');
    if (role === 'MANAGER') setDesignation('Training Manager');
    if (role === 'ADMIN')   setDesignation('System Administrator');
  };

  const handleDemoLogin = async () => {
    if (!selectedRole || isLoading) return;
    try {
      setIsLoading(true); setError(null);
      const openUid = `open-demo-user-${selectedRole.toLowerCase()}`;
      await useAppStore.getState().initializeFromFirestore(openUid, 'Demo User', selectedRole, designation);
      navigate(`/${selectedRole.toLowerCase()}/dashboard`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to sign in. Please try again.');
    } finally { setIsLoading(false); }
  };

  const mono = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, letterSpacing: '.10em', textTransform: 'uppercase' as const };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter', sans-serif" }}>
      <div style={{
        width: '100%', maxWidth: 440, background: '#0F0F11',
        border: '1px solid rgba(255,255,255,.08)',
        boxShadow: '0 24px 64px rgba(0,0,0,.60)',
        overflow: 'hidden', animation: 'fadeIn .4s ease',
      }}>
        {/* Header */}
        <div style={{ background: '#131316', borderBottom: '1px solid rgba(255,255,255,.08)', padding: '36px 32px', textAlign: 'center' }}>
          <img 
            src="/logo.png" 
            alt="KarmSetu Logo" 
            style={{ width: 68, height: 68, objectFit: 'contain', margin: '0 auto 16px', display: 'block' }} 
          />
          <h1 style={{ fontSize: 24, fontWeight: 300, letterSpacing: '-.03em', color: '#fff' }}>KarmSetu</h1>
          <p style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.40)', marginTop: 6 }}>Competency Intelligence Platform</p>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 28px' }}>
          <div style={{ textAlign: 'center', marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,.06)', paddingBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 400, color: '#fff', letterSpacing: '-.01em' }}>Sign in to continue</h2>
            <p style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.35)', marginTop: 4 }}>Select role for SIH 2026 Prototype</p>
          </div>

          {error && (
            <div style={{
              marginBottom: 20, padding: '12px 16px', background: 'rgba(244,63,94,.08)',
              border: '1px solid rgba(244,63,94,.25)', color: '#F43F5E', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          {!selectedRole ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {([
                ['LEARNER', 'Demo Learner', 'Aarav Sharma • Statistical Officer'],
                ['MANAGER', 'Demo Training Manager', 'Department of Statistics'],
                ['ADMIN', 'Demo Admin', 'System & iGOT Integration'],
              ] as const).map(([role, label, sub]) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', background: '#131316',
                    border: '1px solid rgba(255,255,255,.08)',
                    color: '#fff', cursor: 'pointer', textAlign: 'left',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,.40)';
                    e.currentTarget.style.background = 'rgba(99,102,241,.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)';
                    e.currentTarget.style.background = '#131316';
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 400, color: '#fff' }}>{label}</div>
                    <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginTop: 3 }}>{sub}</div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'rgba(255,255,255,.35)' }} />
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.50)', display: 'block', marginBottom: 8 }}>Job Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  placeholder="e.g. Statistical Officer"
                  autoFocus
                  style={{
                    width: '100%', padding: '12px 14px', background: '#131316',
                    border: '1px solid rgba(255,255,255,.12)', color: '#fff',
                    outline: 'none', fontSize: 13, fontFamily: 'inherit',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setSelectedRole(null)}
                  style={{
                    flex: 1, padding: '11px', background: 'transparent',
                    border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.65)',
                    cursor: 'pointer', ...mono, fontSize: 9,
                  }}
                >Back</button>
                <button
                  onClick={handleDemoLogin}
                  disabled={isLoading || !designation.trim()}
                  style={{
                    flex: 2, padding: '11px', background: '#6366F1',
                    border: '1px solid #6366F1', color: '#fff',
                    cursor: 'pointer', ...mono, fontSize: 9,
                    opacity: (isLoading || !designation.trim()) ? 0.5 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Continue'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
