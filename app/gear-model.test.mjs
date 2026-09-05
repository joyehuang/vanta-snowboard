import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {contrastInk,createGoggles} from './gear-model.ts';

test('board branding contrasts with light and dark custom topsheets',()=>{
 assert.equal(contrastInk('#ffffff'),'#15201a');
 assert.equal(contrastInk('#161b1d'),'#f0f3e8');
 assert.notEqual(contrastInk('#000000'),contrastInk('#ffffff'));
});
test('goggle frame, strap and lens are independent materials on valid meshes',()=>{
 const gear=createGoggles('#161b1d','#dbf66c','#5aaef0');
 assert.equal(gear.frame.color.getHexString(),'161b1d');
 assert.equal(gear.strap.color.getHexString(),'dbf66c');
 assert.equal(gear.glass.color.getHexString(),'5aaef0');
 assert.notEqual(gear.frame,gear.strap);
 gear.frame.color.set('#eee7d5');
 assert.equal(gear.strap.color.getHexString(),'dbf66c');
 let meshes=0;
 gear.group.traverse(o=>{
  if(!(o instanceof THREE.Mesh))return;
  meshes++;
  assert.ok(Array.from(o.geometry.attributes.position.array).every(Number.isFinite));
  o.geometry.dispose();
  for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();
 });
 assert.ok(meshes>=6);
});
