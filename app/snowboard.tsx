'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { contrastInk, createGoggles } from './gear-model';
import { createBoardGeometry, boardScale, type BoardShape, type BoardFinish, type BoardView } from './board-geometry';

function boardTexture(color: string, back = false, length = 156, primary = '#161b1d') {
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=2048;
 const c=canvas.getContext('2d')!;
 c.fillStyle=back?color:primary;c.fillRect(0,0,512,2048);
 if(!back){
  c.strokeStyle=contrastInk(primary)+'25';c.lineWidth=1;
  for(let y=-500;y<2300;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(512,y+420);c.stroke();}
  c.fillStyle=color;c.beginPath();c.moveTo(0,0);c.lineTo(512,0);c.lineTo(512,660);c.lineTo(0,1030);c.fill();
  c.fillStyle=primary;c.beginPath();c.moveTo(-100,570);c.lineTo(430,160);c.lineTo(440,420);c.lineTo(-100,835);c.fill();
  c.fillStyle=color;c.fillRect(0,1730,512,18);
 }
 c.save();c.translate(256,back?1090:1460);c.rotate(-Math.PI/2);c.fillStyle=contrastInk(back?color:primary);c.font='900 138px Arial';c.textAlign='center';c.fillText('VANTA',0,45);c.restore();
 c.fillStyle=contrastInk(back?color:primary);c.font='bold 24px monospace';c.textAlign='center';c.fillText('AM—01',256,back?1700:1670);c.font='16px monospace';c.fillText(`ALL MOUNTAIN / ${length}`,256,1820);
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
export default function Snowboard({color,reset,length=156,width=252,shape='Twin',finish='Satin',view='Studio',primary='#161b1d',goggles=false,lens='#bfd2c7',focus='Board'}:{color:string;reset:number;length?:number;width?:number;shape?:BoardShape;finish?:BoardFinish;view?:BoardView;primary?:string;goggles?:boolean;lens?:string;focus?:'Board'|'Kit'|'Goggles'}){
 const gearRef=useRef<ReturnType<typeof createGoggles>|null>(null);const focusRef=useRef(focus);const draggingRef=useRef<THREE.Group|null>(null);
 const meshes=useRef<THREE.Mesh[]>([]);const ref=useRef<HTMLDivElement>(null);const groupRef=useRef<THREE.Group|null>(null);const materials=useRef<THREE.MeshPhysicalMaterial[]>([]);const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const host=ref.current!;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{setFailed(true);return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();const pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();const camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(0,0,10.8);
  scene.add(new THREE.AmbientLight(0xffffff,2.2));const key=new THREE.DirectionalLight(0xe4efff,4);key.position.set(-4,5,7);scene.add(key);const rim=new THREE.DirectionalLight(0xd6f5a0,3);rim.position.set(3,-2,-3);scene.add(rim);
  const gear=createGoggles(primary,color,lens);gearRef.current=gear;gear.group.visible=goggles;scene.add(gear.group);
  const board=new THREE.Group();scene.add(board);groupRef.current=board;
  const face=new THREE.MeshPhysicalMaterial({map:boardTexture(color,false,length,primary),roughness:.36,metalness:.25,clearcoat:.7});
  const edge=new THREE.MeshPhysicalMaterial({color:'#b8bcb1',metalness:.9,roughness:.28});
  const baseMat=new THREE.MeshPhysicalMaterial({map:boardTexture(color,true,length,primary),roughness:.4,side:THREE.BackSide});
  materials.current=[face,baseMat];
  const frontMesh=new THREE.Mesh(createBoardGeometry(shape),[face,edge]);
  const baseMesh=new THREE.Mesh(createBoardGeometry(shape,true),baseMat);
  meshes.current=[frontMesh,baseMesh];board.add(frontMesh,baseMesh);
  const screwGeo=new THREE.CylinderGeometry(.018,.018,.008,12);const screwMat=new THREE.MeshStandardMaterial({color:'#7a7e77',metalness:.9,roughness:.3});for(const center of [-.78,.78])for(let row=0;row<6;row++)for(const x of [-.095,.095]){const screw=new THREE.Mesh(screwGeo,screwMat);screw.rotation.x=Math.PI/2;screw.position.set(x,center+(row-2.5)*.105,.07);board.add(screw);}
  board.rotation.set(-.12,-.36,-.38);Object.assign(board.scale,boardScale(length,width));let dragging=false;let lastX=0,lastY=0;let frame=0;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const down=(e:PointerEvent)=>{dragging=true;const target=focusRef.current==='Goggles'?gear.group:board;draggingRef.current=target;gsap.killTweensOf(target.rotation);lastX=e.clientX;lastY=e.clientY;host.setPointerCapture(e.pointerId);host.classList.add('dragging');};const move=(e:PointerEvent)=>{if(!dragging)return;const target=draggingRef.current||board;target.rotation.y+=(e.clientX-lastX)*.012;target.rotation.x+=(e.clientY-lastY)*.006;lastX=e.clientX;lastY=e.clientY;};const up=()=>{dragging=false;host.classList.remove('dragging');};const keyboard=(e:KeyboardEvent)=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const target=focusRef.current==='Goggles'?gear.group:board;gsap.killTweensOf(target.rotation);target.rotation.y+=e.key==='ArrowLeft'?-.2:e.key==='ArrowRight'?.2:0;target.rotation.x+=e.key==='ArrowUp'?-.15:e.key==='ArrowDown'?.15:0;}};
  host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',up);host.addEventListener('keydown',keyboard);
  const observer=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});observer.observe(host);
  let visible=true;const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting});visibility.observe(host);
  const started=performance.now();function render(){frame=requestAnimationFrame(render);if(!visible||document.hidden)return;const t=(performance.now()-started)/1000;if(!reduced){board.position.y=Math.sin(t*.65)*.055;}renderer.render(scene,camera);}render();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',up);host.removeEventListener('keydown',keyboard);scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{m.map?.dispose();m.dispose();});}});environment.dispose();gsap.killTweensOf(gear.group.rotation);gsap.killTweensOf(gear.group.position);gsap.killTweensOf(gear.group.scale);gearRef.current=null;renderer.dispose();host.removeChild(renderer.domElement);gsap.killTweensOf(board.rotation);gsap.killTweensOf(board.scale);materials.current.forEach(m=>gsap.killTweensOf(m));groupRef.current=null;materials.current=[];meshes.current=[];};
 // Board geometry is created once; color is updated independently below.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 useEffect(()=>{
  const gear=gearRef.current;if(!gear)return;
  gear.frame.color.set(primary);gear.strap.color.set(color);gear.trim.color.set(color);gear.glass.color.set(lens);
 },[primary,color,lens]);
 useEffect(()=>{
  const gear=gearRef.current,board=groupRef.current;if(!gear||!board)return;
  focusRef.current=focus;gear.group.visible=goggles && focus!=='Board';board.visible=focus!=='Goggles';
  const duration=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:.65;
  const solo=focus==='Goggles';
  const tweens=[gsap.to(gear.group.position,{x:solo?0:1.03,y:solo?0:-1.65,z:solo?0:.4,duration}),gsap.to(gear.group.scale,{x:solo?1.9:.83,y:solo?1.9:.83,z:solo?1.9:.83,duration}),gsap.to(board.position,{x:focus==='Kit'?-.35:0,duration})];
  return()=>tweens.forEach(t=>t.kill());
 },[focus,goggles]);
 useEffect(()=>{if(!gearRef.current)return;const tween=gsap.to(gearRef.current.group.rotation,{x:-.1,y:-.3,z:.08,duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:.6});return()=>{tween.kill()};},[reset]);
 useEffect(()=>{materials.current.forEach((m,i)=>{m.map?.dispose();m.map=boardTexture(color,i===1,length,primary);m.needsUpdate=true;});},[color,length,primary]);
 useEffect(()=>{
  const board=groupRef.current;if(!board)return;
  const tween=gsap.to(board.scale,{...boardScale(length,width),duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:.65,ease:'power2.out'});
  return()=>{tween.kill();};
 },[length,width]);
 useEffect(()=>{meshes.current.forEach((m,i)=>{m.geometry.dispose();m.geometry=createBoardGeometry(shape,i===1);});},[shape]);
 useEffect(()=>{
  const values=finish==='Gloss'?{roughness:.08,metalness:.45,clearcoat:1}:finish==='Matte'?{roughness:.95,metalness:0,clearcoat:0}:{roughness:.36,metalness:.25,clearcoat:.7};
  const tweens=materials.current.map(m=>gsap.to(m,{...values,duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:.5}));
  return()=>tweens.forEach(t=>t.kill());
 },[finish]);
 useEffect(()=>{
  if(!groupRef.current)return;
  const angles=view==='Front'?{x:0,y:0,z:0}:view==='Base'?{x:0,y:Math.PI,z:0}:view==='Side'?{x:0,y:Math.PI/2-.12,z:0}:{x:-.12,y:-.36,z:-.38};
  const tween=gsap.to(groupRef.current.rotation,{...angles,duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:.8,ease:'power3.out'});
  return()=>{tween.kill();};
 },[reset,view]);
 return <div ref={ref} className="snowboard-canvas" tabIndex={0} role="img" aria-label={`Interactive VANTA ${focus.toLowerCase()} preview, ${length} cm, ${width} mm, ${shape}, ${finish}. Drag or use arrow keys to rotate.`}>{failed&&<div className="webgl-fallback">VANTA AM-01<br/><small>3D preview requires a WebGL-enabled browser.</small></div>}</div>
}
