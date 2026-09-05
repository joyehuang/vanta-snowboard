import * as THREE from 'three';

export type BoardShape = 'Twin' | 'Directional' | 'Swallowtail';
export type BoardFinish = 'Satin' | 'Matte' | 'Gloss';
export type BoardView = 'Studio' | 'Front' | 'Base' | 'Side';
export function createBoardShape(profile: BoardShape) {
 const s = new THREE.Shape();
 s.moveTo(0,2.65);
 s.bezierCurveTo(.35,2.65,.48,2.5,.47,2.2);
 s.bezierCurveTo(.47,1.45,.345,.9,.35,0);
 const tail = profile === 'Twin' ? .47 : .41;
 s.bezierCurveTo(.345,-.9,tail,-1.45,tail,-2.2);
 if (profile === 'Swallowtail') {
  s.quadraticCurveTo(tail,-2.5,.33,-2.65);
  s.lineTo(0,-2.29);s.lineTo(-.33,-2.65);
  s.quadraticCurveTo(-tail,-2.5,-tail,-2.2);
 } else {
  s.bezierCurveTo(tail,-2.5,.35,-2.65,0,-2.65);
  s.bezierCurveTo(-.35,-2.65,-tail,-2.5,-tail,-2.2);
 }
 s.bezierCurveTo(-tail,-1.45,-.345,-.9,-.35,0);
 s.bezierCurveTo(-.345,.9,-.47,1.45,-.47,2.2);
 s.bezierCurveTo(-.48,2.5,-.35,2.65,0,2.65);
 return s;
}
export function createBoardGeometry(profile: BoardShape, base = false) {
 const shape = createBoardShape(profile);
 const geometry = base ? new THREE.ShapeGeometry(shape,50) : new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:true,bevelThickness:.012,bevelSize:.013,bevelSegments:3,steps:1,curveSegments:50});
 const pos=geometry.attributes.position, uv=geometry.attributes.uv;
 for(let i=0;i<pos.count;i++) {
  uv.setXY(i,(pos.getX(i)+.49)/.98,(pos.getY(i)+2.66)/5.32);
  pos.setZ(i,(base ? -.014 : pos.getZ(i))+Math.pow(Math.max(0,Math.abs(pos.getY(i))-1.95),2)*.4);
 }
 geometry.computeVertexNormals();
 return geometry;
}
export function boardScale(length: number, width: number) {
 return {x:width/252,y:length/156,z:1};
}
