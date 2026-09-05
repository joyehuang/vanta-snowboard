import assert from 'node:assert/strict';
import test from 'node:test';
import {createBoardGeometry,createBoardShape,boardScale} from './board-geometry.ts';

test('length and waist width change independently without camera compensation',()=>{
 const short=boardScale(150,252),long=boardScale(162,252),wide=boardScale(156,268);
 assert.ok(Math.abs(long.y/short.y-162/150)<1e-12);
 assert.equal(short.x,long.x);assert.equal(wide.y,1);
 assert.ok(Math.abs(wide.x-268/252)<1e-12);
});
test('all board shapes produce valid, distinct front and base geometries',()=>{
 const signatures=[];
 for(const profile of ['Twin','Directional','Swallowtail']) {
  const front=createBoardGeometry(profile),base=createBoardGeometry(profile,true);
  for(const geometry of [front,base]) {
   const p=geometry.attributes.position;
   assert.ok(p.count>100);
   assert.ok(Array.from(p.array).every(Number.isFinite));
   geometry.computeBoundingBox();
   assert.ok(geometry.boundingBox.max.y>2.64);
   assert.ok(geometry.boundingBox.min.y< -2.64);
   assert.equal(geometry.attributes.uv.count,p.count);
  }
  signatures.push(Array.from(front.attributes.position.array).join(','));
  front.dispose();base.dispose();
 }
 assert.equal(new Set(signatures).size,3);
});
test('swallowtail includes a central notch, twin tail stays rounded',()=>{
 const swallow=createBoardShape('Swallowtail').getPoints(50);
 const twin=createBoardShape('Twin').getPoints(50);
 assert.ok(swallow.some(p=>Math.abs(p.x)<1e-10&&Math.abs(p.y+2.29)<1e-10));
 assert.ok(twin.some(p=>Math.abs(p.x)<1e-10&&Math.abs(p.y+2.65)<1e-10));
});
