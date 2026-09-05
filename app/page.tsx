'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, RotateCcw, MoveUpRight, Plus, Minus, Mountain, MousePointer2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { BoardShape, BoardFinish, BoardView } from './board-geometry';
const Snowboard = dynamic(() => import('./snowboard'), { ssr: false });

const palette = [{name:'Carbon',value:'#161b1d'},{name:'Acid',value:'#dbf66c'},{name:'Glacier',value:'#afdce7'},{name:'Bone',value:'#eee7d5'},{name:'Cobalt',value:'#506fe5'},{name:'Ember',value:'#e58265'},{name:'Alpine',value:'#426858'},{name:'Lilac',value:'#bd9ed9'}];
const schemes=[{name:'Alpine Acid',primary:'#161b1d',accent:'#dbf66c'},{name:'Glacier Blue',primary:'#1d344b',accent:'#afdce7'},{name:'Warm Terrain',primary:'#eee7d5',accent:'#e58265'}];
const lensOptions=[{name:'Silver',value:'#c6d7d4'},{name:'Ice Blue',value:'#5aaef0'},{name:'Sunset',value:'#ea9654'}];
function colorName(hex:string){return palette.find(c=>c.value===hex)?.name||hex.toUpperCase();}
function ColorPicker({label,value,onChange}:{label:string;value:string;onChange:(value:string)=>void}){
 return <div className="color-picker"><div className="color-picker-label"><span>{label}</span><span>{colorName(value)}</span></div><div className="color-picker-controls"><ToggleGroup className="color-palette" value={[value]} onValueChange={v=>{if(v.length)onChange(v[0])}} aria-label={label}>{palette.map(c=><ToggleGroupItem value={c.value} key={c.value} aria-label={`${label}: ${c.name}`} title={c.name} style={{'--swatch':c.value} as React.CSSProperties}><span/></ToggleGroupItem>)}</ToggleGroup><label className="custom-color" title={`Choose a custom ${label.toLowerCase()}`}><input type="color" value={value} onChange={e=>onChange(e.target.value)} aria-label={`Custom ${label.toLowerCase()}`}/><span>Custom ↗</span></label></div></div>;
}


export default function Home() {
 const [primary,setPrimary]=useState('#161b1d');
 const [accent,setAccent]=useState('#dbf66c');
 const [goggles,setGoggles]=useState(true);
 const [lens,setLens]=useState('#c6d7d4');
 const [focus,setFocus]=useState<'Board'|'Kit'|'Goggles'>('Kit');
 const [reset, setReset] = useState(0);
 const [size, setSize] = useState('156');
 const [width,setWidth]=useState('252');
 const [shape,setShape]=useState<BoardShape>('Twin');
 const [finish,setFinish]=useState<BoardFinish>('Satin');
 const [view,setView]=useState<BoardView>('Studio');
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
   <div className="board-stage"><Snowboard color={accent} primary={primary} reset={reset} length={Number(size)} width={Number(width)} shape={shape} finish={finish}/></div>
   <div className="board-marker"><span className="marker-line"/><div><span className="eyebrow">VANTA / AM-01</span><small>One board. No boundaries.</small></div></div>
   <div className="vertical-note">ENGINEERED FOR THE UNEXPECTED — EST. 2026</div>
   <div className="interaction-bar"><MousePointer2 size={14}/><span>DRAG TO EXPLORE</span><span className="divider"/><button onClick={() => setReset(r => r + 1)} aria-label="Reset snowboard rotation"><RotateCcw size={15}/></button></div>
   <div className="hero-bottom"><a href="#board"><span className="scroll-circle"><ArrowDown size={17}/></span>SCROLL INTO THE UNKNOWN</a><span>01 <span className="page-line"/> 03</span><span className="altitude">ALTITUDE IS A STATE OF MIND. <Mountain size={20}/></span></div>
  </section>
  <div className="manifesto-strip"><span>NO TRACKS. NO RULES.</span><span className="strip-star">✳</span><span>JUST YOUR LINE.</span><span className="strip-star">✳</span><span>ALL MOUNTAIN. ALL YOU.</span><span className="strip-star">✳</span></div>
  <section className="product-section" id="board">
   <div className="section-top reveal"><span className="eyebrow">01 / THE BOARD</span><span className="eyebrow muted">BUILT FOR EVERY VERSION OF YOU</span></div>
    <div className="product-heading reveal"><h2>ONE BOARD.<br/><span>WIDE OPEN.</span></h2><p>First chair corduroy. A side hit you can’t resist. That last untouched pocket of powder. The AM-01 makes the whole mountain your playground.</p><div className="terrain"><span>ALL-MOUNTAIN</span><span>FREESTYLE</span><span>{shape.toUpperCase()}</span></div></div>
   <div className="product-grid configurator-grid">
    <div className={`live-preview gear-preview ${focus==='Goggles'?'goggles-focus':''}`}>
     <div className="preview-top"><span className="eyebrow"><span className="live-dot"/> LIVE CONFIGURATION</span><button onClick={()=>setReset(r=>r+1)} aria-label="Reset preview rotation"><RotateCcw size={16}/></button></div>
     <ToggleGroup className="preview-subjects" aria-label="Preview subject" value={[focus]} onValueChange={v=>{if(v.length)setFocus(v[0] as typeof focus)}}><ToggleGroupItem value="Board">Board</ToggleGroupItem><ToggleGroupItem value="Kit" disabled={!goggles}>Full kit</ToggleGroupItem><ToggleGroupItem value="Goggles" disabled={!goggles}>Goggles ↗</ToggleGroupItem></ToggleGroup>
     <div className="config-canvas"><Snowboard color={accent} primary={primary} reset={reset} length={Number(size)} width={Number(width)} shape={shape} finish={finish} view={view} goggles={goggles} lens={lens} focus={focus}/></div>
     <div className="dimension-guide" style={{height:`${65*Number(size)/156}%`}}><span>{size} <small>cm</small></span></div>
     <div className="preview-width">WAIST {width} mm</div>
     <ToggleGroup className="view-options" value={[view]} onValueChange={v=>{if(v.length)setView(v[0] as BoardView)}} aria-label="Preview angle">{(['Studio','Front','Base','Side'] as const).map(v=><ToggleGroupItem value={v} key={v}>{v}</ToggleGroupItem>)}</ToggleGroup>
     <div className="preview-caption"><span>{focus==='Goggles'?'AURA / G-01':`${shape} / ${finish}`}</span><span>↔ DRAG TO ROTATE</span></div>
    </div>
    <div className="configure"><div className="product-title"><div><p className="eyebrow">THE DO-IT-ALL ORIGINAL</p><h3>AM-01 <span>2027</span></h3></div><span className="product-price">$549 <small>USD</small></span></div>
     <div className="choice-row"><span>01 — Make your colorway</span><span>{schemes.find(s=>s.primary===primary&&s.accent===accent)?.name||'Custom mix'}</span></div>
     <div className="scheme-options">{schemes.map(s=><button key={s.name} aria-pressed={s.primary===primary&&s.accent===accent} onClick={()=>{setPrimary(s.primary);setAccent(s.accent)}}><span className="scheme-chip" style={{background:`linear-gradient(135deg,${s.primary} 50%,${s.accent} 50%)`}}/>{s.name}</button>)}</div>
     <ColorPicker label="Primary · Topsheet & frame" value={primary} onChange={setPrimary}/>
     <ColorPicker label="Secondary · Graphics & strap" value={accent} onChange={setAccent}/>
     <button className="swap-colors" onClick={()=>{setPrimary(accent);setAccent(primary)}}>⇄ Swap colors</button>
     <p className="parameter-help">Two colors, your signature. The base echoes your secondary color.</p>
     <div className="choice-row"><span>02 — Board length</span><span>{size} cm</span></div><ToggleGroup className="sizes parameter-options" aria-label="Board length" value={[size]} onValueChange={v=>{if(v.length)setSize(v[0])}}>{['150','153','156','159','162'].map(s=><ToggleGroupItem key={s} value={s}>{s}</ToggleGroupItem>)}</ToggleGroup><p className="parameter-help">True-to-scale length. The camera stays fixed so you can compare.</p>
     <div className="choice-row"><span>03 — Waist width</span><span>{width} mm</span></div>
     <ToggleGroup className="parameter-options" aria-label="Waist width" value={[width]} onValueChange={v=>{if(v.length)setWidth(v[0])}}>{[['244','Narrow'],['252','Regular'],['268','Wide']].map(([v,label])=><ToggleGroupItem key={v} value={v}>{label}<small>{v} mm</small></ToggleGroupItem>)}</ToggleGroup>
     <p className="parameter-help">A wider platform changes the silhouette and gives larger boots more room.</p>
     <div className="choice-row"><span>04 — Shape</span><span>{shape}</span></div>
     <ToggleGroup className="parameter-options" aria-label="Board shape" value={[shape]} onValueChange={v=>{if(v.length)setShape(v[0] as BoardShape)}}>{(['Twin','Directional','Swallowtail'] as const).map(v=><ToggleGroupItem key={v} value={v}>{v}</ToggleGroupItem>)}</ToggleGroup>
     <p className="parameter-help">{shape==='Twin'?'Matching nose and tail for a balanced, freestyle silhouette.':shape==='Directional'?'A tapered tail with a broader nose. Switch to Front to compare.':'A split, V-shaped tail for a distinctly powder-inspired silhouette.'}</p>
     <div className="choice-row"><span>05 — Topsheet finish</span><span>{finish}</span></div>
     <ToggleGroup className="parameter-options" aria-label="Topsheet finish" value={[finish]} onValueChange={v=>{if(v.length)setFinish(v[0] as BoardFinish)}}>{(['Satin','Matte','Gloss'] as const).map(v=><ToggleGroupItem key={v} value={v}>{v}</ToggleGroupItem>)}</ToggleGroup>
     <p className="parameter-help">Rotate the board to see how your finish catches the light.</p>
     <div className="gear-config"><div className="gear-title"><div><span className="eyebrow">06 / COMPLETE YOUR KIT</span><h4>AURA G-01 <span>Goggles</span></h4></div><Switch className="gear-switch" checked={goggles} onCheckedChange={checked=>{setGoggles(checked);setFocus(checked?'Kit':'Board')}} aria-label="Include matching goggles"/></div><p className="parameter-help">A curved mirror lens, a sculpted frame, and a strap in your signature colors.</p>
     {goggles?<><div className="matching-colors"><span style={{background:primary}}/><span style={{background:accent}}/><span>FRAME + STRAP MATCH YOUR BOARD</span></div><div className="choice-row"><span>Mirror lens</span><span>{lensOptions.find(l=>l.value===lens)?.name}</span></div><ToggleGroup className="parameter-options lens-options" value={[lens]} onValueChange={v=>{if(v.length)setLens(v[0])}} aria-label="Goggle lens color">{lensOptions.map(l=><ToggleGroupItem key={l.value} value={l.value}><span className="lens-chip" style={{background:`linear-gradient(135deg,#ecf5f1,${l.value} 45%,#253841)`}}/>{l.name}</ToggleGroupItem>)}</ToggleGroup><button className="inspect-gear" onClick={()=>{setFocus(focus==='Goggles'?'Kit':'Goggles');setReset(r=>r+1)}}>{focus==='Goggles'?'View the full kit':'Inspect goggles in 3D'} <ArrowUpRight size={15}/></button><p className="gear-note">Concept color preview. Lens colors do not indicate light-transmission ratings.</p></>:<p className="parameter-help">Turn on matching goggles to preview the full kit.</p>}</div>
     <div className="configuration-summary" aria-live="polite"><span className="eyebrow">YOUR AM-01</span><p>{size} cm / {width} mm / {shape}</p><span>{colorName(primary)} / {colorName(accent)} · {finish}{goggles?` + AURA G-01 (${lensOptions.find(l=>l.value===lens)?.name})`:""}</span></div>
     <button className="product-button reset-configuration" onClick={()=>{setPrimary('#161b1d');setAccent('#dbf66c');setGoggles(true);setLens('#c6d7d4');setFocus('Kit');setSize('156');setWidth('252');setShape('Twin');setFinish('Satin');setView('Studio');setReset(r=>r+1)}}>Reset configuration <RotateCcw size={17}/></button><p className="concept-note">Explore the 2027 concept. No checkout required.</p>
    </div>
   </div>
   <div className="spec-grid reveal">{[['6 / 10','PLAYFUL, WITH BACKBONE','Medium flex'],[shape==='Swallowtail'?'SPLIT':shape==='Twin'?'TWIN':'TAPER','YOUR CHOSEN SILHOUETTE',shape],['HYBRID','POP MEETS FLOAT','Camber profile'],['360°','FREEDOM, BY DESIGN','All-terrain performance']].map(([a,b,c])=><div key={a}><p className="eyebrow">{b}</p><strong>{a}</strong><span>{c}</span></div>)}</div>
  </section>
  <section className="tech-section" id="technology"><div className="tech-visual reveal"><div className="tech-photo"/><span className="eyebrow">TESTED WHERE IT MATTERS.</span><p>LESS WEIGHT.<br/>MORE <i>FEEL.</i></p><span className="photo-caption">THE ALPS, OUR PROVING GROUND. ↗</span></div><div className="tech-content reveal"><span className="eyebrow">02 / UNDER THE SURFACE</span><h2>NOTHING EXTRA.<br/>EVERYTHING<br/><span>YOU NEED.</span></h2><div className="accordion">{[['01','A lighter kind of powerful.','A responsive poplar and paulownia core keeps the swing weight low and the energy high. Easy to throw around. Ready to hold a line.'],['02','Built to hold. Born to release.','Hybrid camber puts grip underfoot and lift at the tips. Locked-in turns when you need them, effortless float when you don’t.'],['03','Fast from first chair to last.','A sintered base holds wax deep and carries speed across the flats. Durable steel edges keep your next season in mind.']].map(([n,title,body],i)=><div className="accordion-item" key={n}><button aria-expanded={open===i} aria-controls={'detail-'+i} onClick={()=>setOpen(open===i?null:i)}><span>{n}</span>{title}{open===i?<Minus size={18}/>:<Plus size={18}/>}</button><div id={'detail-'+i} hidden={open!==i}><p>{body}</p></div></div>)}</div></div></section>
  <section className="closing" id="out-there"><div className="closing-bg"/><div className="closing-content reveal"><span className="eyebrow">03 / OUT THERE IS WHERE YOU BELONG</span><h2>LEAVE A LINE.<br/><span>NOT A LIMIT.</span></h2><a className="primary-button" href="#board">Find your AM-01 <MoveUpRight size={18}/></a></div><div className="closing-bottom"><span>NO DESTINATION REQUIRED.</span><span>46.5763° N / 7.9904° E</span></div></section>
  <footer><a className="wordmark" href="#top">◭ VANTA<span className="brand-reg">®</span></a><span>INDEPENDENT BY NATURE.</span><small>© 2026 VANTA. Concept design.</small><a href="#top">BACK TO THE TOP ↑</a></footer>
 </main>
}
