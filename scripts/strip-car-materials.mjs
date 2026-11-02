/**
 * scripts/strip-car-materials.mjs
 * ─────────────────────────────────
 * Generates car-clean.glb from car-raw.glb:
 *   1. Strips KHR_materials_clearcoat
 *   2. Resets all material base colors to dark
 *   3. Applies meshopt compression (geometry only, no quantization)
 *
 * car-raw.glb works without the silver artifact; this preserves that
 * geometry exactly but reduces file size via meshopt.
 *
 * Run: node scripts/strip-car-materials.mjs
 */

import { NodeIO } from '@gltf-transform/core';
import { KHRMaterialsClearcoat } from '@gltf-transform/extensions';
import { meshopt, prune, dedup } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import { statSync } from 'fs';

await MeshoptEncoder.ready;

const io = new NodeIO().registerExtensions([KHRMaterialsClearcoat]);
const document = await io.read('./public/models/car-raw.glb');
const root = document.getRoot();

// 1. Strip clearcoat + reset base colours
for (const material of root.listMaterials()) {
  const cc = material.getExtension('KHR_materials_clearcoat');
  if (cc) cc.dispose();
  material.setBaseColorFactor([0.04, 0.04, 0.04, 1.0]);
  material.setRoughnessFactor(0.8);
  material.setMetallicFactor(0.0);
  material.setEmissiveFactor([0, 0, 0]);
}

// 2. Clean up orphaned data
await document.transform(dedup(), prune());

// 3. Meshopt compression ONLY — no quantization.
//    Quantization changes vertex positions and can alter how primitives
//    are ordered/visible, which may re-expose the trunk chrome.
await document.transform(meshopt({ encoder: MeshoptEncoder }));

await io.write('./public/models/car-clean.glb', document);

const rawSize   = statSync('./public/models/car-raw.glb').size;
const cleanSize = statSync('./public/models/car-clean.glb').size;
console.log(`\n✓ car-clean.glb written`);
console.log(`  car-raw.glb  : ${(rawSize   / 1024).toFixed(0)} KB`);
console.log(`  car-clean.glb: ${(cleanSize / 1024).toFixed(0)} KB  (${((1 - cleanSize / rawSize) * 100).toFixed(1)}% smaller)`);
