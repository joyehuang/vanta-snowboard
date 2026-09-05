# VANTA — Beyond the Line

A concept snowboard landing page built with React, TypeScript, Three.js and GSAP on Vinext.

## Development

```sh
npm install
npm run dev
```

## Validation

```sh
npx tsc --noEmit
node --test app/board-geometry.test.mjs app/gear-model.test.mjs
npm run build
```

The snowboard is a procedural Three.js mesh with a curved nose/tail, metallic edge, mounting inserts, and generated topsheet/base textures. Drag horizontally or use arrow keys to inspect; the configurator keeps a live preview sticky beside controls on desktop and above controls on mobile. Length and width independently scale the actual mesh with a fixed camera; shape replaces both front and base geometry, and finish updates the physical materials. Studio, front, base, and side views help compare changes. Reduced-motion settings disable ambient and scrolling animations.

This is a concept collection, not a live store. Size selection configures the product preview; no checkout or payment is connected.

Mountain photography: Alessio Soggetti, Unsplash, “Icy mountain during night time”. https://unsplash.com/photos/icy-mountain-during-night-time-yhlX_ojH-Cs

Primary topsheet and secondary graphics colors can be selected independently or from a preset; custom colors automatically receive contrasting branding. Matching AURA goggles reuse the primary color for the frame and secondary color for strap/trim, with independent mirror-lens colors. The sticky preview can show the board, full kit, or rotatable goggle close-up. Accessories are concept styling, not certified eyewear or a purchasable bundle.
