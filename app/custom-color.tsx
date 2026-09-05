'use client';
import { useId, useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

type HSV = {h:number;s:number;v:number};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
function toHSV(hex:string):HSV {
 const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
 const [r,g,b]=rgb,max=Math.max(...rgb),min=Math.min(...rgb),d=max-min;
 let h=0;
 if(d)h=max===r?((g-b)/d+6)%6:max===g?(b-r)/d+2:(r-g)/d+4;
 return {h:h*60,s:max?d/max:0,v:max};
}
function toHex({h,s,v}:HSV){
 const f=(n:number)=>{const k=(n+h/60)%6;return Math.round(255*(v-v*s*Math.max(0,Math.min(k,4-k,1)))).toString(16).padStart(2,'0');};
 return `#${f(5)}${f(3)}${f(1)}`;
}
function ColorEditor({value,label,onChange,onClose}:{value:string;label:string;onChange:(value:string)=>void;onClose:()=>void}){
 const [hsv,setHSV]=useState(()=>toHSV(value));
 const [hex,setHex]=useState(value.toUpperCase());
 const id=useId();
 const valid=/^#[0-9a-f]{6}$/i.test(hex);
 function update(next:HSV){setHSV(next);const color=toHex(next);setHex(color.toUpperCase());onChange(color);}
 function pick(e:React.PointerEvent<HTMLDivElement>){const r=e.currentTarget.getBoundingClientRect();update({...hsv,s:clamp((e.clientX-r.left)/r.width),v:1-clamp((e.clientY-r.top)/r.height)});}
 return <>
  <div className="color-studio-header"><div><span className="color-studio-kicker">VANTA / COLOR STUDIO</span><PopoverTitle className="color-studio-title">{label.split(' · ')[0]} color</PopoverTitle></div><button onClick={onClose} className="color-studio-close" aria-label="Close color picker"><X size={17}/></button></div>
  <div className="color-field" style={{backgroundColor:`hsl(${hsv.h} 100% 50%)`}} tabIndex={0} role="group" aria-label="Saturation and brightness" aria-describedby={id+'-help'} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);pick(e)}} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))pick(e)}} onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const step=e.shiftKey?.1:.01;update({...hsv,s:clamp(hsv.s+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0)),v:clamp(hsv.v+(e.key==='ArrowUp'?step:e.key==='ArrowDown'?-step:0))})}}><span className="color-field-cursor" style={{left:`${hsv.s*100}%`,top:`${(1-hsv.v)*100}%`,background:toHex(hsv)}}/></div>
  <div className="hue-label"><span>HUE</span><span>{Math.round(hsv.h)}°</span></div>
  <Slider className="studio-hue" aria-label="Hue" min={0} max={359} step={1} value={[hsv.h]} onValueChange={v=>update({...hsv,h:Array.isArray(v)?v[0]:v})}/>
  <div className="studio-hex-row"><span className="studio-color-preview" style={{background:value}}/><label className="studio-hex-label" htmlFor={id}>HEX<Input id={id} className="studio-hex-input" value={hex} maxLength={7} autoComplete="off" spellCheck={false} aria-invalid={!valid} aria-describedby={!valid?id+'-error':undefined} onChange={e=>{let next=e.target.value;if(!next.startsWith('#'))next='#'+next;setHex(next.toUpperCase());if(/^#[0-9a-f]{6}$/i.test(next)){setHSV(toHSV(next));onChange(next.toLowerCase());}}} onBlur={()=>{if(!valid)setHex(value.toUpperCase())}}/></label><span className="studio-live"><span/>LIVE</span></div>
  {!valid&&<p id={id+'-error'} className="studio-error">Enter a six-digit HEX color.</p>}
  <p id={id+'-help'} className="studio-help">Drag to mix. Arrow keys fine-tune the color.</p>
  <button className="studio-done" onClick={onClose}>Done <ArrowUpRight size={15}/></button>
 </>;
}
export default function CustomColor({value,label,onChange}:{value:string;label:string;onChange:(value:string)=>void}){
 const [open,setOpen]=useState(false);
 return <Popover open={open} onOpenChange={setOpen}><PopoverTrigger className="custom-color-button" aria-label={`Customize ${label.toLowerCase()}`}><span style={{background:value}}/>Custom <ArrowUpRight size={12}/></PopoverTrigger><PopoverContent className="color-studio" align="end" sideOffset={12}><ColorEditor value={value} label={label} onChange={onChange} onClose={()=>setOpen(false)}/></PopoverContent></Popover>;
}
