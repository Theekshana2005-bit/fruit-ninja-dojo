import {
  Fruit,
  FruitHalf,
  FruitType,
  JuiceParticle,
  WallSplatter,
  BladePoint,
  BladeType
} from '../types';
import { FRUIT_CONFIGS } from './fruitConfig';

export const GRAVITY = 720; // pixels / second^2

/**
 * Calculates line-segment to circle distance
 */
export function lineIntersectsCircle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cx: number,
  cy: number,
  r: number
): boolean {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;

  // Add a slight generous hit margin for smooth, responsive finger slicing
  const hitRadius = r + 10;

  if (lenSq === 0) {
    const distSq = (cx - x1) * (cx - x1) + (cy - y1) * (cy - y1);
    return distSq <= hitRadius * hitRadius;
  }

  // Projection parameter t
  let t = ((cx - x1) * dx + (cy - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;

  const distSq = (cx - closestX) * (cx - closestX) + (cy - closestY) * (cy - closestY);
  return distSq <= hitRadius * hitRadius;
}

/**
 * Create a new launched fruit or bomb with realistic arc trajectory auto-adjusted for device screen size
 */
export function spawnFruit(
  width: number,
  height: number,
  type: FruitType,
  frenzyMode: boolean = false
): Fruit {
  const cfg = FRUIT_CONFIGS[type];
  const isBomb = type === 'bomb';

  // Responsive scale according to viewport size
  const minDim = Math.min(width, height);
  const sizeScale = Math.min(1.1, Math.max(0.74, minDim / 580));
  const scaledRadius = Math.round(cfg.radius * sizeScale);

  let startX: number;
  let startY: number;
  let targetApexX: number;
  let targetApexY: number;

  if (frenzyMode) {
    // In frenzy mode, fruits can fly from the left or right screen sides too!
    const fromLeft = Math.random() > 0.5;
    startX = fromLeft ? -40 : width + 40;
    startY = height * (0.35 + Math.random() * 0.45);
    targetApexX = fromLeft ? width * (0.3 + Math.random() * 0.5) : width * (0.2 + Math.random() * 0.5);
    targetApexY = height * (0.16 + Math.random() * 0.28);
  } else {
    // Normal launch from bottom
    const margin = Math.max(25, width * 0.1);
    startX = margin + Math.random() * (width - margin * 2);
    startY = height + scaledRadius + 15;

    // Target apex in the upper 20% to 45% of the screen
    targetApexY = height * (0.20 + Math.random() * 0.26);
    // Drift slightly towards center
    const centerBias = (width * 0.5 - startX) * (0.2 + Math.random() * 0.4);
    targetApexX = Math.max(margin, Math.min(width - margin, startX + centerBias));
  }

  // Calculate physics impulse: v_y = -sqrt(2 * g * deltaY)
  const deltaY = Math.max(50, startY - targetApexY);
  const vy = -Math.sqrt(2 * GRAVITY * deltaY);
  const timeToApex = -vy / GRAVITY;
  const vx = (targetApexX - startX) / (timeToApex || 1);

  // Angular spin
  const vRot = (Math.random() - 0.5) * 5.2;

  return {
    id: `fruit_${Date.now()}_${Math.random()}`,
    type,
    x: startX,
    y: startY,
    vx,
    vy,
    radius: scaledRadius,
    rotation: Math.random() * Math.PI * 2,
    vRot,
    sliced: false,
    isBomb,
    sparkPhase: 0,
    scale: 1,
  };
}

/**
 * Split fruit into two realistic halves flying apart along the cut normal
 */
export function splitFruitIntoHalves(
  fruit: Fruit,
  sliceAngle: number
): [FruitHalf, FruitHalf] {
  // Cut normal perpendicular to slice direction
  const nx = -Math.sin(sliceAngle);
  const ny = Math.cos(sliceAngle);

  // Separation speed impulse
  const pushSpeed = 190 + Math.random() * 70;

  const half1: FruitHalf = {
    x: fruit.x - nx * 10,
    y: fruit.y - ny * 10,
    vx: fruit.vx - nx * pushSpeed + (Math.random() - 0.5) * 60,
    vy: fruit.vy - ny * pushSpeed * 0.6 - 40,
    rotation: sliceAngle,
    vRot: -3.5 - Math.random() * 4.5,
    sliceAngle,
    isLeft: true,
    type: fruit.type,
    radius: fruit.radius,
    alpha: 1,
  };

  const half2: FruitHalf = {
    x: fruit.x + nx * 10,
    y: fruit.y + ny * 10,
    vx: fruit.vx + nx * pushSpeed + (Math.random() - 0.5) * 60,
    vy: fruit.vy + ny * pushSpeed * 0.6 - 40,
    rotation: sliceAngle,
    vRot: 3.5 + Math.random() * 4.5,
    sliceAngle,
    isLeft: false,
    type: fruit.type,
    radius: fruit.radius,
    alpha: 1,
  };

  return [half1, half2];
}

/**
 * Generate splash juice particles on slice
 */
export function createJuiceParticles(
  x: number,
  y: number,
  type: FruitType,
  sliceAngle: number,
  count = 22
): JuiceParticle[] {
  const cfg = FRUIT_CONFIGS[type];
  const particles: JuiceParticle[] = [];

  const nx = -Math.sin(sliceAngle);
  const ny = Math.cos(sliceAngle);

  for (let i = 0; i < count; i++) {
    // Spray primarily along normal directions with spread
    const side = Math.random() > 0.5 ? 1 : -1;
    const spread = (Math.random() - 0.5) * 1.4;
    const speed = 120 + Math.random() * 320;

    const dirX = (nx * side + Math.cos(sliceAngle) * spread);
    const dirY = (ny * side + Math.sin(sliceAngle) * spread);
    const len = Math.hypot(dirX, dirY) || 1;

    const isSeed = (type === 'watermelon' || type === 'apple') && i < 3;
    const color = isSeed ? (cfg.seedColor || '#1c1917') : (i % 3 === 0 ? cfg.rindColor : cfg.fleshColor);

    particles.push({
      x,
      y,
      vx: (dirX / len) * speed,
      vy: (dirY / len) * speed - 60,
      radius: isSeed ? 3 : 2.5 + Math.random() * 4.5,
      color,
      alpha: 1,
      decay: 0.7 + Math.random() * 0.6,
      isSeed,
    });
  }

  return particles;
}

/**
 * Generate a juice splatter stamp on the wooden dojo wall
 */
export function createWallSplatter(
  x: number,
  y: number,
  type: FruitType
): WallSplatter {
  const cfg = FRUIT_CONFIGS[type];
  const dots: { dx: number; dy: number; r: number }[] = [];
  const dotCount = 9 + Math.floor(Math.random() * 8);

  for (let i = 0; i < dotCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * (cfg.radius * 1.35);
    dots.push({
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      r: 3 + Math.random() * 11,
    });
  }

  // Add 1 to 3 dripping streaks running downwards
  const drips: { x: number; y: number; maxLen: number; curLen: number; width: number }[] = [];
  const dripCount = 1 + Math.floor(Math.random() * 2);
  for (let d = 0; d < dripCount; d++) {
    drips.push({
      x: (Math.random() - 0.5) * (cfg.radius * 0.7),
      y: (Math.random() - 0.5) * (cfg.radius * 0.4),
      maxLen: 25 + Math.random() * 45,
      curLen: 3,
      width: 3 + Math.random() * 3.5,
    });
  }

  return {
    x,
    y,
    color: cfg.juiceColor,
    alpha: 0.85,
    maxAlpha: 0.85,
    dots,
    drips,
  };
}

/**
 * Render the blade swipe trail with realistic ribbon interpolation
 */
export function renderBladeTrail(
  ctx: CanvasRenderingContext2D,
  points: BladePoint[],
  bladeType: BladeType
) {
  if (points.length < 2) return;

  ctx.save();

  // Pick blade gradient / colors
  let primaryColor = '#ffffff';
  let auraColor = 'rgba(56, 189, 248, 0.7)';
  let glowBlur = 12;

  switch (bladeType) {
    case 'flame':
      primaryColor = '#fef08a';
      auraColor = 'rgba(239, 68, 68, 0.85)';
      glowBlur = 18;
      break;
    case 'ice':
      primaryColor = '#e0f2fe';
      auraColor = 'rgba(56, 189, 248, 0.85)';
      glowBlur = 15;
      break;
    case 'rainbow': {
      const hue = (Date.now() / 4) % 360;
      primaryColor = '#ffffff';
      auraColor = `hsla(${hue}, 90%, 65%, 0.85)`;
      glowBlur = 16;
      break;
    }
    case 'shadow':
      primaryColor = '#e9d5ff';
      auraColor = 'rgba(147, 51, 234, 0.85)';
      glowBlur = 18;
      break;
    case 'classic':
    default:
      primaryColor = '#ffffff';
      auraColor = 'rgba(186, 230, 253, 0.75)';
      glowBlur = 12;
      break;
  }

  ctx.shadowColor = auraColor;
  ctx.shadowBlur = glowBlur;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw tapered ribbon by segments
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const progress = i / (points.length - 1); // 0 at tail, 1 at cutting tip
    const lineWidth = Math.max(1, progress * 14);

    // Outer glow path
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = auraColor;
    ctx.lineWidth = lineWidth + 5;
    ctx.globalAlpha = Math.min(1, progress * 1.3);
    ctx.stroke();

    // White core blade
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = Math.max(1.5, lineWidth * 0.6);
    ctx.stroke();
  }

  // Draw cutting tip flash
  const tip = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(tip.x, tip.y, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.restore();
}
