'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

function boardTexture(color: string, back = false) {
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=2048;
 const c=canvas.getContext('2d')!;
 c.fillStyle=back?color:'#161b1d';c.fillRect(0,0,512,2048);
 if(!back){
  c.strokeStyle='#343a3c';c.lineWidth=1;
  for(let y=-500;y<2300;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(512,y+420);c.stroke();}
  c.fillStyle=color;c.beginPath();c.moveTo(0,0);c.lineTo(512,0);c.lineTo(512,660);c.lineTo(0,1030);c.fill();
  c.fillStyle='#161b1d';c.beginPath();c.moveTo(-100,570);c.lineTo(430,160);c.lineTo(440,420);c.lineTo(-100,835);c.fill();
  c.fillStyle=color;c.fillRect(0,1730,512,18);
 }
 c.save();c.translate(256,back?1090:1460);c.rotate(-Math.PI/2);c.fillStyle=back?'#141a1b':'#eceee4';c.font='900 138px Arial';c.textAlign='center';c.fillText('VANTA',0,45);c.restore();
 c.fillStyle=back?'#141a1b':'#ecf0df';c.font='bold 24px monospace';c.textAlign='center';c.fillText('AM—01',256,back?1700:1670);c.font='16px monospace';c.fillText('ALL MOUNTAIN / 156',256,1820);
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
export default function Snowboard({color,reset}:{color:string;reset:number}){
 const ref=useRef<HTMLDivElement>(null);const groupRef=useRef<THREE.Group|null>(null);const materials=useRef<THREE.MeshPhysicalMaterial[]>([]);const [failed,setFailed]=useState(false);
 useEffect(()=>{
  const host=ref.current!;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{setFailed(true);return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);
  const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(0,0,10.8);
  scene.add(new THREE.AmbientLight(0xffffff,2.2));const key=new THREE.DirectionalLight(0xe4efff,4);key.position.set(-4,5,7);scene.add(key);const rim=new THREE.DirectionalLight(0xd6f5a0,3);rim.position.set(3,-2,-3);scene.add(rim);
  const board=new THREE.Group();scene.add(board);groupRef.current=board;
  const shape=new THREE.Shape();shape.moveTo(0,2.65);shape.bezierCurveTo(.35,2.65,.48,2.5,.47,2.2);shape.bezierCurveTo(.47,1.45,.345,.9,.35,0);shape.bezierCurveTo(.345,-.9,.47,-1.45,.47,-2.2);shape.bezierCurveTo(.48,-2.5,.35,-2.65,0,-2.65);shape.bezierCurveTo(-.35,-2.65,-.48,-2.5,-.47,-2.2);shape.bezierCurveTo(-.47,-1.45,-.345,-.9,-.35,0);shape.bezierCurveTo(-.345,.9,-.47,1.45,-.47,2.2);shape.bezierCurveTo(-.48,2.5,-.35,2.65,0,2.65);
  const geometry=new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:true,bevelThickness:.012,bevelSize:.013,bevelSegments:3,steps:1,curveSegments:50});
  const pos=geometry.attributes.position;const uv=geometry.attributes.uv;for(let i=0;i<pos.count;i++){uv.setXY(i,(pos.getX(i)+.49)/.98,(pos.getY(i)+2.66)/5.32);const y=pos.getY(i);pos.setZ(i,pos.getZ(i)+Math.pow(Math.max(0,Math.abs(y)-1.95),2)*.4);}geometry.computeVertexNormals();
  const face=new THREE.MeshPhysicalMaterial({map:boardTexture(color),roughness:.36,metalness:.25,clearcoat:.7});const edge=new THREE.MeshPhysicalMaterial({color:'#b8bcb1',metalness:.9,roughness:.28});materials.current=[face];board.add(new THREE.Mesh(geometry,[face,edge]));
  const baseGeo=new THREE.ShapeGeometry(shape,50);const bp=baseGeo.attributes.position;const buv=baseGeo.attributes.uv;for(let i=0;i<bp.count;i++){buv.setXY(i,(bp.getX(i)+.49)/.98,(bp.getY(i)+2.66)/5.32);bp.setZ(i,-.014+Math.pow(Math.max(0,Math.abs(bp.getY(i))-1.95),2)*.4);}baseGeo.computeVertexNormals();const baseMat=new THREE.MeshPhysicalMaterial({map:boardTexture(color,true),roughness:.4,side:THREE.BackSide});materials.current.push(baseMat);board.add(new THREE.Mesh(baseGeo,baseMat));
  const screwGeo=new THREE.CylinderGeometry(.018,.018,.008,12);const screwMat=new THREE.MeshStandardMaterial({color:'#7a7e77',metalness:.9,roughness:.3});for(const center of [-.78,.78])for(let row=0;row<6;row++)for(const x of [-.095,.095]){const screw=new THREE.Mesh(screwGeo,screwMat);screw.rotation.x=Math.PI/2;screw.position.set(x,center+(row-2.5)*.105,.07);board.add(screw);}
  board.rotation.set(-.12,-.36,-.38);let dragging=false;let lastX=0,lastY=0;let userMoved=false;let frame=0;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const down=(e:PointerEvent)=>{dragging=true;userMoved=true;lastX=e.clientX;lastY=e.clientY;host.setPointerCapture(e.pointerId);host.classList.add('dragging');};const move=(e:PointerEvent)=>{if(!dragging)return;board.rotation.y+=(e.clientX-lastX)*.012;board.rotation.x+=(e.clientY-lastY)*.006;lastX=e.clientX;lastY=e.clientY;};const up=()=>{dragging=false;host.classList.remove('dragging');};const keyboard=(e:KeyboardEvent)=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();userMoved=true;board.rotation.y+=e.key==='ArrowLeft'?-.2:e.key==='ArrowRight'?.2:0;board.rotation.x+=e.key==='ArrowUp'?-.15:e.key==='ArrowDown'?.15:0;}};
  host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',up);host.addEventListener('keydown',keyboard);
  const observer=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});observer.observe(host);
  let visible=true;const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting});visibility.observe(host);
  const clock=new THREE.Clock();function render(){frame=requestAnimationFrame(render);if(!visible||document.hidden)return;const t=clock.getElapsedTime();if(!reduced){board.position.y=Math.sin(t*.65)*.055;if(!userMoved)board.rotation.y=-.36+Math.sin(t*.4)*.12;}renderer.render(scene,camera);}render();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();visibility.disconnect();host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',up);host.removeEventListener('keydown',keyboard);scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{m.map?.dispose();m.dispose();});}});renderer.dispose();host.removeChild(renderer.domElement);groupRef.current=null;};
 // Board geometry is created once; color is updated independently below.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 useEffect(()=>{materials.current.forEach((m,i)=>{m.map?.dispose();m.map=boardTexture(color,i===1);m.needsUpdate=true;});},[color]);
 useEffect(()=>{if(groupRef.current)gsap.to(groupRef.current.rotation,{x:-.12,y:-.36,z:-.38,duration:window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:.8,ease:'power3.out'});},[reset]);
 return <div ref={ref} className="snowboard-canvas" tabIndex={0} role="img" aria-label="Interactive VANTA snowboard. Drag or use arrow keys to rotate.">{failed&&<div className="webgl-fallback">VANTA AM-01<br/><small>3D preview requires a WebGL-enabled browser.</small></div>}</div>
}
