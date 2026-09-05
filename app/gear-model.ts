import * as THREE from 'three';

export function contrastInk(hex: string) {
 const c = new THREE.Color(hex);
 return .2126*c.r+.7152*c.g+.0722*c.b > .38 ? '#15201a' : '#f0f3e8';
}
export function goggleOutline(scale=1) {
 const s=new THREE.Shape();
 s.moveTo(-.83,.22);s.quadraticCurveTo(-.8,.41,-.52,.43);
 s.quadraticCurveTo(0,.49,.52,.43);s.quadraticCurveTo(.8,.41,.83,.22);
 s.lineTo(.78,-.2);s.quadraticCurveTo(.7,-.4,.33,-.37);
 s.quadraticCurveTo(.16,-.36,.12,-.2);s.quadraticCurveTo(0,-.04,-.12,-.2);
 s.quadraticCurveTo(-.16,-.36,-.33,-.37);s.quadraticCurveTo(-.7,-.4,-.78,-.2);s.closePath();
 if(scale===1)return s;
 return new THREE.Shape(s.getPoints(30).map(p=>p.multiplyScalar(scale)));
}
function frameGeometry(scale=1) {
 const s=goggleOutline(scale);
 s.holes.push(new THREE.Path(goggleOutline(scale*.9).getPoints(30).reverse()));
 return new THREE.ExtrudeGeometry(s,{depth:.12,bevelEnabled:true,bevelSize:.018,bevelThickness:.018,bevelSegments:3,steps:1,curveSegments:30});
}
export function createGoggles(primary:string,secondary:string,lens:string) {
 const group=new THREE.Group();
 const frame=new THREE.MeshPhysicalMaterial({color:primary,roughness:.38,clearcoat:.55});
 const strap=new THREE.MeshStandardMaterial({color:secondary,roughness:.92});
 const trim=new THREE.MeshStandardMaterial({color:secondary,roughness:.35,metalness:.35});
 const glass=new THREE.MeshPhysicalMaterial({color:lens,metalness:.92,roughness:.12,clearcoat:1,iridescence:.5,iridescenceIOR:1.35,side:THREE.DoubleSide});
 const frameMesh=new THREE.Mesh(frameGeometry(),frame);frameMesh.position.z=.32;group.add(frameMesh);
 const foam=new THREE.Mesh(frameGeometry(.98),new THREE.MeshStandardMaterial({color:'#151716',roughness:1}));foam.position.z=.18;group.add(foam);
 const geo=new THREE.ShapeGeometry(goggleOutline(.9),40);const p=geo.attributes.position;
 for(let i=0;i<p.count;i++)p.setZ(i,.46+.14*(1-Math.pow(p.getX(i)/.83,2)));
 geo.computeVertexNormals();group.add(new THREE.Mesh(geo,glass));
 const band=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,.25,64,1,true),strap);band.scale.z=.63;band.position.z=-.12;group.add(band);
 for(const x of [-.83,.83]){const clip=new THREE.Mesh(new THREE.BoxGeometry(.13,.22,.14),trim);clip.position.set(x,.04,.3);group.add(clip);}
 const mark=new THREE.Mesh(new THREE.BoxGeometry(.19,.025,.018),trim);mark.position.set(.49,.37,.47);group.add(mark);
 group.rotation.set(-.1,-.3,.08);
 return {group,frame,strap,trim,glass};
}
