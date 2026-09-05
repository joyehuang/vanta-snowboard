'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, RotateCcw, MoveUpRight, Plus, Minus, Mountain, MousePointer2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
const Snowboard = dynamic(() => import('./snowboard'), { ssr: false });

const colors = [{ name: 'Acid / Carbon', value: '#dbf66c' }, { name: 'Glacier / Carbon', value: '#afdce7' }, { name: 'Bone / Carbon', value: '#eee7d5' }];

export default function Home() {
 const [color, setColor] = useState(0);
 const [reset, setReset] = useState(0);
 const [size, setSize] = useState('156');
 const [open, setOpen] = useState<number | null>(0);
 const root = useRef<HTMLElement>(null);
 useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
   const ctx = gsap.context(() => {
    gsap.from('.intro', { y: 35, opacity: 0, duration: 1.1, stagger: .13, ease: 'power3.out' });
    gsap.from('.board-stage', { opacity: 0, y: 60, duration: 1.6, delay: .2, ease: 'power3.out' });
    gsap.to('.mountain-bg', { yPercent: 16, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.utils.toArray<HTMLElement>('.reveal').forEach(el => gsap.from(el, { y: 40, opacity: 0, duration: .9, scrollTrigger: { trigger: el, start: 'top 91%' } }));
   }, root);
   return () => ctx.revert();
  });
  return () => mm.revert();
 }, []);
 return <main ref={root}>
  <section className="hero" id="top">
   <div className="mountain-bg" /><div className="hero-shade" />
   <header className="header">
    <a className="wordmark" href="#top" aria-label="Vanta home"><span className="brand-symbol">◭</span> VANTA<span className="brand-reg">®</span></a>
    <nav aria-label="Main navigation"><a className="nav-active" href="#board">The board</a><a href="#technology">Technology</a><a href="#out-there">Out there</a></nav>
    <a className="nav-cta" href="#board">Find your line <ArrowUpRight size={16}/></a>
   </header>
   <div className="edition intro"><span className="live-dot"/> INDEPENDENT SPIRIT. ALPINE ENGINEERING.<span className="season">WINTER 26 / 27</span></div>
   <div className="hero-copy">
    <p className="eyebrow intro">THE ALL-MOUNTAIN FREESTYLE SERIES</p>
    <h1 className="intro">BEYOND<br/><span>THE LINE.</span></h1>
    <p className="hero-description intro">For the lines that don’t exist yet.<br/>Meet the board that goes wherever you do.</p>
    <a className="primary-button intro" href="#board">Discover the AM-01 <ArrowUpRight size={19}/></a>
    <div className="hero-small intro"><span>DESIGNED TO GO FURTHER</span><span>46°35′ N &nbsp; 07°57′ E</span></div>
   </div>
   <div className="board-stage"><Snowboard color={colors[color].value} reset={reset}/></div>
   <div className="board-marker"><span className="marker-line"/><div><span className="eyebrow">VANTA / AM-01</span><small>One board. No boundaries.</small></div></div>
   <div className="vertical-note">ENGINEERED FOR THE UNEXPECTED — EST. 2026</div>
   <div className="interaction-bar"><MousePointer2 size={14}/><span>DRAG TO EXPLORE</span><span className="divider"/><button onClick={() => setReset(r => r + 1)} aria-label="Reset snowboard rotation"><RotateCcw size={15}/></button></div>
   <div className="hero-bottom"><a href="#board"><span className="scroll-circle"><ArrowDown size={17}/></span>SCROLL INTO THE UNKNOWN</a><span>01 <span className="page-line"/> 03</span><span className="altitude">ALTITUDE IS A STATE OF MIND. <Mountain size={20}/></span></div>
  </section>
  <div className="manifesto-strip"><span>NO TRACKS. NO RULES.</span><span className="strip-star">✳</span><span>JUST YOUR LINE.</span><span className="strip-star">✳</span><span>ALL MOUNTAIN. ALL YOU.</span><span className="strip-star">✳</span></div>
  <section className="product-section" id="board">
   <div className="section-top reveal"><span className="eyebrow">01 / THE BOARD</span><span className="eyebrow muted">BUILT FOR EVERY VERSION OF YOU</span></div>
   <div className="product-grid">
    <div className="product-heading reveal"><h2>ONE BOARD.<br/><span>WIDE OPEN.</span></h2><p>First chair corduroy. A side hit you can’t resist. That last untouched pocket of powder. The AM-01 makes the whole mountain your playground.</p><div className="terrain"><span>ALL-MOUNTAIN</span><span>FREESTYLE</span><span>DIRECTIONAL TWIN</span></div></div>
    <div className="configure reveal"><div className="product-title"><div><p className="eyebrow">THE DO-IT-ALL ORIGINAL</p><h3>AM-01 <span>2027</span></h3></div><span className="product-price">$549 <small>USD</small></span></div>
     <div className="choice-row"><span>01 — Colorway</span><span aria-live="polite">{colors[color].name}</span></div><div className="swatches">{colors.map((c,i)=><button key={c.name} aria-label={c.name} aria-pressed={color===i} className={color===i?'selected':''} onClick={()=>setColor(i)} style={{'--swatch':c.value} as React.CSSProperties}><span/></button>)}<span>Make it yours. Explore it above.</span></div>
     <div className="choice-row"><span>02 — Board length</span><span>{size} cm</span></div><div className="sizes">{['150','153','156','159','162'].map(s=><button key={s} aria-pressed={size===s} className={size===s?'selected':''} onClick={()=>setSize(s)}>{s}</button>)}</div>
     <a href="#top" className="product-button">Explore your {size} <ArrowUpRight size={20}/></a><p className="concept-note">2027 concept collection — made for the next season.</p>
    </div>
   </div>
   <div className="spec-grid reveal">{[['6 / 10','PLAYFUL, WITH BACKBONE','Medium flex'],['TRUE','BALANCE IN EVERY TURN','Directional twin'],['HYBRID','POP MEETS FLOAT','Camber profile'],['360°','FREEDOM, BY DESIGN','All-terrain performance']].map(([a,b,c])=><div key={a}><p className="eyebrow">{b}</p><strong>{a}</strong><span>{c}</span></div>)}</div>
  </section>
  <section className="tech-section" id="technology"><div className="tech-visual reveal"><div className="tech-photo"/><span className="eyebrow">TESTED WHERE IT MATTERS.</span><p>LESS WEIGHT.<br/>MORE <i>FEEL.</i></p><span className="photo-caption">THE ALPS, OUR PROVING GROUND. ↗</span></div><div className="tech-content reveal"><span className="eyebrow">02 / UNDER THE SURFACE</span><h2>NOTHING EXTRA.<br/>EVERYTHING<br/><span>YOU NEED.</span></h2><div className="accordion">{[['01','A lighter kind of powerful.','A responsive poplar and paulownia core keeps the swing weight low and the energy high. Easy to throw around. Ready to hold a line.'],['02','Built to hold. Born to release.','Hybrid camber puts grip underfoot and lift at the tips. Locked-in turns when you need them, effortless float when you don’t.'],['03','Fast from first chair to last.','A sintered base holds wax deep and carries speed across the flats. Durable steel edges keep your next season in mind.']].map(([n,title,body],i)=><div className="accordion-item" key={n}><button aria-expanded={open===i} aria-controls={'detail-'+i} onClick={()=>setOpen(open===i?null:i)}><span>{n}</span>{title}{open===i?<Minus size={18}/>:<Plus size={18}/>}</button><div id={'detail-'+i} hidden={open!==i}><p>{body}</p></div></div>)}</div></div></section>
  <section className="closing" id="out-there"><div className="closing-bg"/><div className="closing-content reveal"><span className="eyebrow">03 / OUT THERE IS WHERE YOU BELONG</span><h2>LEAVE A LINE.<br/><span>NOT A LIMIT.</span></h2><a className="primary-button" href="#board">Find your AM-01 <MoveUpRight size={18}/></a></div><div className="closing-bottom"><span>NO DESTINATION REQUIRED.</span><span>46.5763° N / 7.9904° E</span></div></section>
  <footer><a className="wordmark" href="#top">◭ VANTA<span className="brand-reg">®</span></a><span>INDEPENDENT BY NATURE.</span><small>© 2026 VANTA. Concept design.</small><a href="#top">BACK TO THE TOP ↑</a></footer>
 </main>
}
