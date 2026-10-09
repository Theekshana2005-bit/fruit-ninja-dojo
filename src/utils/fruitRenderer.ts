import { FruitType, FruitHalf } from '../types';
import { FRUIT_CONFIGS } from './fruitConfig';

/**
 * High-detail procedural canvas renderer for whole fruits, bombs, and sliced halves.
 */

export function drawFruit(
  ctx: CanvasRenderingContext2D,
  type: FruitType,
  x: number,
  y: number,
  radius: number,
  rotation: number,
  scale: number = 1,
  sparkPhase: number = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.rotate(rotation);

  switch (type) {
    case 'watermelon':
      drawWatermelon(ctx, radius);
      break;
    case 'orange':
      drawOrange(ctx, radius);
      break;
    case 'apple':
      drawApple(ctx, radius);
      break;
    case 'banana':
    case 'freeze_banana':
    case 'frenzy_banana':
    case 'double_banana':
      drawBanana(ctx, radius, type);
      break;
    case 'pineapple':
      drawPineapple(ctx, radius);
      break;
    case 'strawberry':
      drawStrawberry(ctx, radius);
      break;
    case 'coconut':
      drawCoconut(ctx, radius);
      break;
    case 'bomb':
      drawBomb(ctx, radius, sparkPhase);
      break;
  }

  ctx.restore();
}

function drawWatermelon(ctx: CanvasRenderingContext2D, r: number) {
  // Base sphere with shadow
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#4ade80');
  grad.addColorStop(0.7, '#16a34a');
  grad.addColorStop(1, '#14532d');

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Dark green tiger stripes
  ctx.save();
  ctx.clip(); // clip to circle
  ctx.fillStyle = '#052e16';
  ctx.lineWidth = r * 0.14;
  ctx.strokeStyle = '#052e16';
  ctx.lineCap = 'round';

  for (let i = -2; i <= 2; i++) {
    const ox = i * (r * 0.45);
    ctx.beginPath();
    ctx.moveTo(ox, -r);
    ctx.bezierCurveTo(ox + 8, -r * 0.4, ox - 8, r * 0.4, ox, r);
    ctx.stroke();
  }
  ctx.restore();

  // Glossy highlight
  ctx.beginPath();
  ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.28, r * 0.16, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fill();

  // Stem
  ctx.beginPath();
  ctx.arc(0, -r, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#713f12';
  ctx.fill();
}

function drawOrange(ctx: CanvasRenderingContext2D, r: number) {
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#fdba74');
  grad.addColorStop(0.6, '#f97316');
  grad.addColorStop(1, '#c2410c');

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Peel pores / texture
  ctx.fillStyle = 'rgba(194, 65, 12, 0.4)';
  for (let i = 0; i < 18; i++) {
    const angle = (i * 2.3) % (Math.PI * 2);
    const dist = (i * 9) % (r * 0.75);
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * dist, Math.sin(angle) * dist, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Specular shine
  ctx.beginPath();
  ctx.arc(-r * 0.3, -r * 0.3, r * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fill();

  // Stem & leaf
  ctx.beginPath();
  ctx.arc(0, -r, 3, 0, Math.PI * 2);
  ctx.fillStyle = '#15803d';
  ctx.fill();

  // Leaf
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r * 0.4, -r - 12, r * 0.5, -r - 4);
  ctx.quadraticCurveTo(r * 0.3, -r, 0, -r);
  ctx.fillStyle = '#22c55e';
  ctx.fill();
}

function drawApple(ctx: CanvasRenderingContext2D, r: number) {
  // Apple body shape
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.6);
  ctx.bezierCurveTo(r * 0.6, -r * 0.9, r * 1.05, -r * 0.4, r * 0.95, r * 0.4);
  ctx.bezierCurveTo(r * 0.85, r * 0.95, r * 0.2, r * 0.95, 0, r * 0.7);
  ctx.bezierCurveTo(-r * 0.2, r * 0.95, -r * 0.85, r * 0.95, -r * 0.95, r * 0.4);
  ctx.bezierCurveTo(-r * 1.05, -r * 0.4, -r * 0.6, -r * 0.9, 0, -r * 0.6);

  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#f87171');
  grad.addColorStop(0.5, '#dc2626');
  grad.addColorStop(0.9, '#991b1b');
  grad.addColorStop(1, '#450a0a');
  ctx.fillStyle = grad;
  ctx.fill();

  // Stem
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.6);
  ctx.quadraticCurveTo(-4, -r - 8, 4, -r - 10);
  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Leaf
  ctx.beginPath();
  ctx.moveTo(2, -r - 6);
  ctx.quadraticCurveTo(14, -r - 12, 12, -r - 4);
  ctx.quadraticCurveTo(4, -r - 4, 2, -r - 6);
  ctx.fillStyle = '#16a34a';
  ctx.fill();

  // Shine
  ctx.beginPath();
  ctx.ellipse(-r * 0.35, -r * 0.25, r * 0.25, r * 0.15, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fill();
}

function drawBanana(ctx: CanvasRenderingContext2D, r: number, type: FruitType) {
  let mainColor = '#facc15';
  let darkColor = '#ca8a04';
  let tipColor = '#713f12';
  let glowColor = '';

  if (type === 'freeze_banana') {
    mainColor = '#38bdf8';
    darkColor = '#0284c7';
    tipColor = '#0c4a6e';
    glowColor = 'rgba(56, 189, 248, 0.5)';
  } else if (type === 'frenzy_banana') {
    mainColor = '#c084fc';
    darkColor = '#7e22ce';
    tipColor = '#3b0764';
    glowColor = 'rgba(192, 132, 252, 0.5)';
  } else if (type === 'double_banana') {
    mainColor = '#fbbf24';
    darkColor = '#d97706';
    tipColor = '#78350f';
    glowColor = 'rgba(251, 191, 36, 0.6)';
  }

  // Aura glow if special
  if (glowColor) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 18;
  }

  // Banana curved body
  ctx.beginPath();
  ctx.moveTo(-r * 0.9, -r * 0.5);
  ctx.quadraticCurveTo(0, -r * 0.95, r * 0.9, -r * 0.2);
  ctx.quadraticCurveTo(r * 0.7, r * 0.65, 0, r * 0.85);
  ctx.quadraticCurveTo(-r * 0.7, r * 0.4, -r * 0.9, -r * 0.5);

  const grad = ctx.createLinearGradient(-r, -r, r, r);
  grad.addColorStop(0, mainColor);
  grad.addColorStop(0.7, darkColor);
  ctx.fillStyle = grad;
  ctx.fill();

  // Ridge line
  ctx.beginPath();
  ctx.moveTo(-r * 0.85, -r * 0.35);
  ctx.quadraticCurveTo(0, r * 0.2, r * 0.85, -r * 0.15);
  ctx.strokeStyle = darkColor;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Stem & bottom tip
  ctx.fillStyle = tipColor;
  ctx.beginPath();
  ctx.arc(-r * 0.9, -r * 0.5, 4.5, 0, Math.PI * 2);
  ctx.arc(r * 0.9, -r * 0.2, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
}

function drawPineapple(ctx: CanvasRenderingContext2D, r: number) {
  // Oval body
  ctx.save();
  const grad = ctx.createRadialGradient(-r * 0.2, 0, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#fde047');
  grad.addColorStop(0.6, '#eab308');
  grad.addColorStop(1, '#854d0e');

  ctx.beginPath();
  ctx.ellipse(0, r * 0.15, r * 0.75, r * 0.85, 0, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Diamond scales pattern
  ctx.clip();
  ctx.strokeStyle = '#713f12';
  ctx.lineWidth = 1.8;
  for (let i = -4; i <= 4; i++) {
    ctx.beginPath();
    ctx.moveTo(-r, i * 16 - r);
    ctx.lineTo(r, i * 16 + r);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(r, i * 16 - r);
    ctx.lineTo(-r, i * 16 + r);
    ctx.stroke();
  }
  ctx.restore();

  // Spiky crown
  ctx.fillStyle = '#15803d';
  for (let i = -3; i <= 3; i++) {
    const angle = i * 0.18;
    ctx.save();
    ctx.translate(0, -r * 0.65);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(0, -r * 0.75 - Math.abs(i) * 2);
    ctx.lineTo(5, 0);
    ctx.fill();
    ctx.restore();
  }
}

function drawStrawberry(ctx: CanvasRenderingContext2D, r: number) {
  // Strawberry conical heart shape
  ctx.beginPath();
  ctx.moveTo(0, r * 0.9);
  ctx.bezierCurveTo(r * 0.9, r * 0.4, r * 0.9, -r * 0.5, 0, -r * 0.5);
  ctx.bezierCurveTo(-r * 0.9, -r * 0.5, -r * 0.9, r * 0.4, 0, r * 0.9);

  const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.1, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#fb7185');
  grad.addColorStop(0.6, '#e11d48');
  grad.addColorStop(1, '#9f1239');
  ctx.fillStyle = grad;
  ctx.fill();

  // Seeds (yellow dots)
  ctx.fillStyle = '#fef08a';
  for (let y = -r * 0.3; y < r * 0.7; y += 10) {
    const spread = (r - Math.abs(y)) * 0.6;
    for (let x = -spread; x <= spread; x += 11) {
      ctx.beginPath();
      ctx.ellipse(x + (Math.sin(y) * 3), y, 1.2, 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Green leaves (calyx)
  ctx.fillStyle = '#22c55e';
  for (let i = -2; i <= 2; i++) {
    ctx.save();
    ctx.translate(0, -r * 0.5);
    ctx.rotate(i * 0.4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(8, -12, 0, -18);
    ctx.quadraticCurveTo(-8, -12, 0, 0);
    ctx.fill();
    ctx.restore();
  }
}

function drawCoconut(ctx: CanvasRenderingContext2D, r: number) {
  const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#78350f');
  grad.addColorStop(0.7, '#451a03');
  grad.addColorStop(1, '#291002');

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Fibrous lines
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, a, a + 0.3);
    ctx.stroke();
  }

  // 3 coconut eyes
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(-r * 0.2, -r * 0.25, 4, 0, Math.PI * 2);
  ctx.arc(r * 0.2, -r * 0.25, 4, 0, Math.PI * 2);
  ctx.arc(0, -r * 0.5, 4.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawBomb(ctx: CanvasRenderingContext2D, r: number, sparkPhase: number) {
  // Cast iron sphere
  const grad = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#52525b');
  grad.addColorStop(0.5, '#27272a');
  grad.addColorStop(0.9, '#18181b');
  grad.addColorStop(1, '#09090b');

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Metallic rim highlight
  ctx.beginPath();
  ctx.arc(0, 0, r - 1.5, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Specular shine
  ctx.beginPath();
  ctx.arc(-r * 0.35, -r * 0.35, r * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fill();

  // Brass fuse cap
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-6, -r - 4, 12, 6);

  // Curved rope fuse
  const fuseEnd = { x: 12 + Math.sin(sparkPhase) * 2, y: -r - 18 };
  ctx.beginPath();
  ctx.moveTo(0, -r - 2);
  ctx.quadraticCurveTo(8, -r - 10, fuseEnd.x, fuseEnd.y);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Sparkling fuse sparks!
  const sparkGrad = ctx.createRadialGradient(fuseEnd.x, fuseEnd.y, 1, fuseEnd.x, fuseEnd.y, 16);
  sparkGrad.addColorStop(0, '#ffffff');
  sparkGrad.addColorStop(0.3, '#fef08a');
  sparkGrad.addColorStop(0.7, '#f97316');
  sparkGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

  ctx.beginPath();
  ctx.arc(fuseEnd.x, fuseEnd.y, 16, 0, Math.PI * 2);
  ctx.fillStyle = sparkGrad;
  ctx.fill();

  // Individual spark embers
  ctx.fillStyle = '#ffffff';
  for (let s = 0; s < 4; s++) {
    const spAngle = sparkPhase * 3 + s * 1.6;
    const spDist = 6 + (s * 3);
    ctx.beginPath();
    ctx.arc(fuseEnd.x + Math.cos(spAngle) * spDist, fuseEnd.y + Math.sin(spAngle) * spDist, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hazard / Crossbones symbol in center
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(0, -2, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-7, 7);
  ctx.lineTo(7, -7);
  ctx.moveTo(7, 7);
  ctx.lineTo(-7, -7);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();
}

/**
 * Draw a sliced half of fruit.
 * Cut plane is along the y=0 axis after local translation and rotation!
 */
export function drawFruitHalf(ctx: CanvasRenderingContext2D, half: FruitHalf) {
  ctx.save();
  ctx.translate(half.x, half.y);
  ctx.rotate(half.rotation);
  ctx.globalAlpha = Math.max(0, half.alpha);

  const r = half.radius;
  const cfg = FRUIT_CONFIGS[half.type];

  // Clip to half circle (isLeft: top half y <= 0, isRight: bottom half y >= 0)
  ctx.save();
  ctx.beginPath();
  if (half.isLeft) {
    ctx.rect(-r * 1.5, -r * 1.5, r * 3, r * 1.5);
  } else {
    ctx.rect(-r * 1.5, 0, r * 3, r * 1.5);
  }
  ctx.clip();

  // Draw the outer rind
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = cfg.rindColor;
  ctx.fill();

  // Sliced juicy face interior
  drawHalfInterior(ctx, half.type, r, half.isLeft);

  ctx.restore();

  // Flat cut edge outline with subtle wet gleam
  ctx.beginPath();
  ctx.moveTo(-r, 0);
  ctx.lineTo(r, 0);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1.8;
  ctx.stroke();

  ctx.restore();
}

function drawHalfInterior(
  ctx: CanvasRenderingContext2D,
  type: FruitType,
  r: number,
  isLeft: boolean
) {
  const sign = isLeft ? -1 : 1;

  if (type === 'watermelon') {
    // Thin white rind inner layer
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
    ctx.fillStyle = '#ecfccb';
    ctx.fill();

    // Vibrant red watermelon flesh
    const fleshGrad = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 0.85);
    fleshGrad.addColorStop(0, '#f87171');
    fleshGrad.addColorStop(0.7, '#ef4444');
    fleshGrad.addColorStop(1, '#b91c1c');

    ctx.beginPath();
    ctx.arc(0, 0, r * 0.86, 0, Math.PI * 2);
    ctx.fillStyle = fleshGrad;
    ctx.fill();

    // Black seeds
    ctx.fillStyle = '#0f172a';
    const seeds = [
      { x: -r * 0.5, y: sign * r * 0.35 },
      { x: -r * 0.18, y: sign * r * 0.5 },
      { x: r * 0.22, y: sign * r * 0.45 },
      { x: r * 0.52, y: sign * r * 0.3 },
      { x: 0, y: sign * r * 0.25 },
    ];
    seeds.forEach(s => {
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, 2, 3.5, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (type === 'orange') {
    // White pith
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
    ctx.fillStyle = '#ffedd5';
    ctx.fill();

    // Segments
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.84, 0, Math.PI * 2);
    ctx.fill();

    // Radial citrus rays
    ctx.strokeStyle = '#ffedd5';
    ctx.lineWidth = 2;
    for (let a = 0; a < 8; a++) {
      const angle = (a * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * r * 0.84, Math.sin(angle) * r * 0.84);
      ctx.stroke();
    }
  } else if (type === 'apple') {
    // Creamy apple interior
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
    ctx.fillStyle = '#fef3c7';
    ctx.fill();

    // Core star & seeds
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(0, sign * r * 0.25, 2.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'coconut') {
    // Thick white coconut meat
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();

    // Hollow dark center
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#451a03';
    ctx.fill();
  } else {
    // General fruit inner flesh
    const cfg = FRUIT_CONFIGS[type];
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
    ctx.fillStyle = cfg.fleshColor;
    ctx.fill();
  }
}
