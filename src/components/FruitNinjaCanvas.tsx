import React, { useEffect, useRef, useCallback } from 'react';
import {
  Fruit,
  FruitHalf,
  FruitType,
  GameMode,
  GameState,
  BladeType,
  JuiceParticle,
  WallSplatter,
  ScorePopup,
  BladePoint,
} from '../types';
import { FRUIT_CONFIGS } from '../utils/fruitConfig';
import {
  spawnFruit,
  splitFruitIntoHalves,
  createJuiceParticles,
  createWallSplatter,
  renderBladeTrail,
  lineIntersectsCircle,
  GRAVITY,
} from '../utils/physics';
import { drawFruit, drawFruitHalf } from '../utils/fruitRenderer';
import { soundManager } from '../utils/sound';
import dojoBgPath from '../assets/images/dojo_wood_wall_1791554601622.jpg';

interface Props {
  gameState: GameState;
  gameMode: GameMode;
  bladeType: BladeType;
  onGameOver: (finalScore: number) => void;
  onScoreChange: (score: number) => void;
  onStrikesChange: (strikes: number) => void;
  onTimeChange: (seconds: number) => void;
  onSelectModeFromSlice?: (mode: GameMode) => void;
}

export const FruitNinjaCanvas: React.FC<Props> = ({
  gameState,
  gameMode,
  bladeType,
  onGameOver,
  onScoreChange,
  onStrikesChange,
  onTimeChange,
  onSelectModeFromSlice,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Logical viewport size in CSS pixels
  const viewSizeRef = useRef<{ width: number; height: number }>({ width: 800, height: 600 });

  // Core Game State Refs
  const scoreRef = useRef<number>(0);
  const strikesRef = useRef<number>(0);
  const timeRemainingRef = useRef<number>(60);
  const fruitsRef = useRef<Fruit[]>([]);
  const fruitHalvesRef = useRef<FruitHalf[]>([]);
  const particlesRef = useRef<JuiceParticle[]>([]);
  const splattersRef = useRef<WallSplatter[]>([]);
  const popupsRef = useRef<ScorePopup[]>([]);
  const bladePointsRef = useRef<BladePoint[]>([]);

  // Slicing and Combo tracking
  const currentStrokeFruitsRef = useRef<{ id: string; type: FruitType; x: number; y: number }[]>([]);
  const lastStrokeTimeRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const lastWhooshTimeRef = useRef<number>(0);

  // Arcade special active effects
  const freezeTimerRef = useRef<number>(0);
  const frenzyTimerRef = useRef<number>(0);
  const doublePointsTimerRef = useRef<number>(0);

  // Screen shake & flash
  const screenShakeRef = useRef<number>(0);
  const screenFlashRef = useRef<number>(0);

  // Spawning timer
  const lastSpawnTimeRef = useRef<number>(0);
  const spawnIntervalRef = useRef<number>(1.8);

  // Dojo Background image
  const bgImageRef = useRef<HTMLImageElement | null>(null);

  // Initialize or reset game session
  const resetGame = useCallback(() => {
    scoreRef.current = 0;
    strikesRef.current = 0;
    timeRemainingRef.current = gameMode === 'zen' ? 90 : gameMode === 'arcade' ? 60 : 0;
    fruitsRef.current = [];
    fruitHalvesRef.current = [];
    particlesRef.current = [];
    popupsRef.current = [];
    currentStrokeFruitsRef.current = [];
    freezeTimerRef.current = 0;
    frenzyTimerRef.current = 0;
    doublePointsTimerRef.current = 0;
    screenShakeRef.current = 0;
    screenFlashRef.current = 0;
    spawnIntervalRef.current = gameMode === 'arcade' ? 1.3 : 1.8;
    soundManager.stopBombFuse();

    onScoreChange(0);
    onStrikesChange(0);
    onTimeChange(timeRemainingRef.current);
  }, [gameMode, onScoreChange, onStrikesChange, onTimeChange]);

  // Handle Game State transition
  useEffect(() => {
    if (gameState === 'PLAYING') {
      resetGame();
    }
  }, [gameState, resetGame]);

  // Load Background Image once
  useEffect(() => {
    const img = new Image();
    img.src = dojoBgPath;
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, []);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    // Spawning waves
    const triggerSpawn = (cssW: number, cssH: number, now: number) => {
      if (gameState === 'MENU') {
        // In MENU, spawn only interactive select fruits if none exist
        if (fruitsRef.current.length === 0) {
          const classicFruit = spawnFruit(cssW, cssH, 'watermelon');
          classicFruit.x = cssW * 0.25;
          classicFruit.y = cssH + 40;
          classicFruit.vx = 0;

          const zenFruit = spawnFruit(cssW, cssH, 'apple');
          zenFruit.x = cssW * 0.5;
          zenFruit.y = cssH + 40;
          zenFruit.vx = 0;

          const arcadeFruit = spawnFruit(cssW, cssH, 'banana');
          arcadeFruit.x = cssW * 0.75;
          arcadeFruit.y = cssH + 40;
          arcadeFruit.vx = 0;

          fruitsRef.current.push(classicFruit, zenFruit, arcadeFruit);
        }
        return;
      }

      if (gameState !== 'PLAYING') return;

      const isFrenzy = frenzyTimerRef.current > 0;
      const effectiveInterval = isFrenzy ? 0.35 : spawnIntervalRef.current;

      if (now - lastSpawnTimeRef.current >= effectiveInterval * 1000) {
        lastSpawnTimeRef.current = now;

        // Wave size: 1-4 fruits
        const waveCount = isFrenzy ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 3) + 1;
        const availableTypes: FruitType[] = [
          'watermelon',
          'orange',
          'apple',
          'banana',
          'pineapple',
          'strawberry',
          'coconut',
        ];

        // In Arcade mode, add special bananas
        if (gameMode === 'arcade') {
          if (Math.random() < 0.24) {
            const specials: FruitType[] = ['freeze_banana', 'frenzy_banana', 'double_banana'];
            availableTypes.push(specials[Math.floor(Math.random() * specials.length)]);
          }
        }

        // Bombs in Classic or Arcade mode
        const shouldSpawnBomb =
          (gameMode === 'classic' && Math.random() < Math.min(0.35, 0.14 + (scoreRef.current / 85) * 0.15)) ||
          (gameMode === 'arcade' && Math.random() < 0.2);

        for (let i = 0; i < waveCount; i++) {
          const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
          const f = spawnFruit(cssW, cssH, type, isFrenzy);
          fruitsRef.current.push(f);
        }

        if (shouldSpawnBomb && !isFrenzy) {
          const bomb = spawnFruit(cssW, cssH, 'bomb', false);
          fruitsRef.current.push(bomb);
          soundManager.startBombFuse();
        }

        // Adjust difficulty over time in classic
        if (gameMode === 'classic' && spawnIntervalRef.current > 0.9) {
          spawnIntervalRef.current = Math.max(0.9, 1.8 - (scoreRef.current / 75) * 0.7);
        }
      }
    };

    const render = (time: number) => {
      let dt = (time - lastTime) / 1000;
      lastTime = time;
      dt = Math.min(dt, 0.1);

      // Auto-adapt canvas resolution to match exact container dimensions and screen DPR
      const rect = canvas.getBoundingClientRect();
      const cssW = rect.width;
      const cssH = rect.height;
      viewSizeRef.current = { width: cssW, height: cssH };

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const targetPixelW = Math.round(cssW * dpr);
      const targetPixelH = Math.round(cssH * dpr);

      if (canvas.width !== targetPixelW || canvas.height !== targetPixelH) {
        canvas.width = targetPixelW;
        canvas.height = targetPixelH;
      }

      // Arcade Freeze Slow-Mo
      let timeScale = 1;
      if (freezeTimerRef.current > 0) {
        freezeTimerRef.current -= dt;
        timeScale = 0.42;
      }
      if (frenzyTimerRef.current > 0) {
        frenzyTimerRef.current -= dt;
      }
      if (doublePointsTimerRef.current > 0) {
        doublePointsTimerRef.current -= dt;
      }

      // Handle Timer in Zen and Arcade
      if (gameState === 'PLAYING' && (gameMode === 'zen' || gameMode === 'arcade')) {
        timeRemainingRef.current -= dt;
        if (timeRemainingRef.current <= 0) {
          timeRemainingRef.current = 0;
          onTimeChange(0);
          soundManager.playGameOver();
          onGameOver(scoreRef.current);
          return;
        } else {
          onTimeChange(Math.ceil(timeRemainingRef.current));
        }
      }

      // Physics scaled time
      const physDt = dt * timeScale;

      // Spawn check using exact CSS dimensions
      triggerSpawn(cssW, cssH, time);

      // Clean up stale blade points
      const nowTime = performance.now();
      bladePointsRef.current = bladePointsRef.current.filter(p => nowTime - p.time < 170);

      // Check for combo finalization if blade swipe ended
      if (
        currentStrokeFruitsRef.current.length > 0 &&
        (!isPointerDownRef.current || nowTime - lastStrokeTimeRef.current > 300)
      ) {
        const comboCount = currentStrokeFruitsRef.current.length;
        if (comboCount >= 3) {
          const comboBonus = comboCount;
          const isDouble = doublePointsTimerRef.current > 0;
          const finalBonus = isDouble ? comboBonus * 2 : comboBonus;

          scoreRef.current += finalBonus;
          onScoreChange(scoreRef.current);
          soundManager.playCombo(comboCount);

          let avgX = 0;
          let avgY = 0;
          currentStrokeFruitsRef.current.forEach(f => {
            avgX += f.x;
            avgY += f.y;
          });
          avgX /= comboCount;
          avgY /= comboCount;

          popupsRef.current.push({
            id: `combo_${Date.now()}`,
            x: avgX,
            y: avgY,
            text: `${comboCount}x COMBO! +${finalBonus}`,
            color: '#38bdf8',
            alpha: 1,
            vy: -80,
            scale: 1.4,
          });

          screenShakeRef.current = Math.min(10, comboCount * 2);
        }
        currentStrokeFruitsRef.current = [];
      }

      // START DRAWING IN EXACT CSS COORDINATES
      ctx.save();
      // Transform canvas matrix to CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Apply screen shake
      if (screenShakeRef.current > 0) {
        const shakeMag = screenShakeRef.current;
        const offsetX = (Math.random() - 0.5) * shakeMag * 2;
        const offsetY = (Math.random() - 0.5) * shakeMag * 2;
        ctx.translate(offsetX, offsetY);
        screenShakeRef.current = Math.max(0, screenShakeRef.current - dt * 25);
      }

      // 1. Draw wood dojo wall background
      if (bgImageRef.current && bgImageRef.current.complete) {
        ctx.drawImage(bgImageRef.current, 0, 0, cssW, cssH);
      } else {
        const woodGrad = ctx.createLinearGradient(0, 0, 0, cssH);
        woodGrad.addColorStop(0, '#261208');
        woodGrad.addColorStop(0.5, '#3d1c0e');
        woodGrad.addColorStop(1, '#1b0b05');
        ctx.fillStyle = woodGrad;
        ctx.fillRect(0, 0, cssW, cssH);
      }

      // 2. Draw Wall Juice Splatters
      splattersRef.current = splattersRef.current.filter(splat => {
        splat.alpha -= dt * 0.05;
        if (splat.alpha <= 0) return false;

        ctx.save();
        ctx.fillStyle = splat.color;
        ctx.globalAlpha = Math.min(splat.maxAlpha, splat.alpha);

        splat.dots.forEach(d => {
          ctx.beginPath();
          ctx.arc(splat.x + d.dx, splat.y + d.dy, d.r, 0, Math.PI * 2);
          ctx.fill();
        });

        splat.drips.forEach(drip => {
          if (drip.curLen < drip.maxLen) {
            drip.curLen += dt * 8;
          }
          ctx.beginPath();
          ctx.ellipse(
            splat.x + drip.x,
            splat.y + drip.y + drip.curLen,
            drip.width,
            drip.curLen * 0.5,
            0,
            0,
            Math.PI * 2
          );
          ctx.fill();
        });

        ctx.restore();
        return true;
      });

      // 3. Update & Draw Whole Fruits
      fruitsRef.current = fruitsRef.current.filter(fruit => {
        if (fruit.sliced) return false;

        fruit.vy += GRAVITY * physDt;
        fruit.x += fruit.vx * physDt;
        fruit.y += fruit.vy * physDt;
        fruit.rotation += fruit.vRot * physDt;

        if (fruit.isBomb) {
          fruit.sparkPhase = (fruit.sparkPhase || 0) + physDt * 18;
        }

        drawFruit(
          ctx,
          fruit.type,
          fruit.x,
          fruit.y,
          fruit.radius,
          fruit.rotation,
          fruit.scale,
          fruit.sparkPhase
        );

        // Missed fruit detection (Classic mode)
        if (fruit.y > cssH + fruit.radius + 60 && fruit.vy > 0) {
          if (!fruit.isBomb && gameState === 'PLAYING' && gameMode === 'classic') {
            strikesRef.current += 1;
            onStrikesChange(strikesRef.current);
            soundManager.playStrike();

            popupsRef.current.push({
              id: `strike_${Date.now()}`,
              x: fruit.x,
              y: cssH - 60,
              text: '❌',
              color: '#ef4444',
              alpha: 1,
              vy: -60,
              scale: 1.8,
            });

            if (strikesRef.current >= 3) {
              soundManager.playGameOver();
              onGameOver(scoreRef.current);
            }
          }
          return false;
        }

        return true;
      });

      // Stop bomb fuse hiss if no unsliced bomb is currently on screen
      const hasActiveBomb = fruitsRef.current.some(f => f.isBomb && !f.sliced && f.y < cssH + f.radius + 20);
      if (!hasActiveBomb) {
        soundManager.stopBombFuse();
      }

      // 4. Update & Draw Sliced Fruit Halves
      fruitHalvesRef.current = fruitHalvesRef.current.filter(half => {
        half.vy += GRAVITY * physDt;
        half.x += half.vx * physDt;
        half.y += half.vy * physDt;
        half.rotation += half.vRot * physDt;
        half.alpha -= dt * 0.35;

        drawFruitHalf(ctx, half);

        return half.y < cssH + half.radius + 80 && half.alpha > 0;
      });

      // 5. Update & Draw Juice Particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.vy += (GRAVITY * 0.75) * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.alpha -= dt * p.decay;

        if (p.alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        ctx.beginPath();
        if (p.isSeed) {
          ctx.ellipse(p.x, p.y, p.radius, p.radius * 1.5, Math.PI / 4, 0, Math.PI * 2);
        } else {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();

        return true;
      });

      // 6. Update & Draw Score Popups
      popupsRef.current = popupsRef.current.filter(pop => {
        pop.y += pop.vy * dt;
        pop.alpha -= dt * 0.8;

        if (pop.alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = Math.max(0, pop.alpha);
        ctx.font = `900 ${Math.round(24 * pop.scale)}px 'Shojumaru', sans-serif`;
        ctx.fillStyle = pop.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.textAlign = 'center';
        ctx.strokeText(pop.text, pop.x, pop.y);
        ctx.fillText(pop.text, pop.x, pop.y);
        ctx.restore();

        return true;
      });

      // 7. Draw Blade Trail in exact CSS coordinates
      renderBladeTrail(ctx, bladePointsRef.current, bladeType);

      // 8. Freeze Vignette
      if (freezeTimerRef.current > 0) {
        const freezeVignette = ctx.createRadialGradient(
          cssW * 0.5,
          cssH * 0.5,
          Math.min(cssW, cssH) * 0.35,
          cssW * 0.5,
          cssH * 0.5,
          Math.max(cssW, cssH) * 0.7
        );
        freezeVignette.addColorStop(0, 'rgba(56, 189, 248, 0)');
        freezeVignette.addColorStop(1, 'rgba(56, 189, 248, 0.45)');
        ctx.fillStyle = freezeVignette;
        ctx.fillRect(0, 0, cssW, cssH);
      }

      // 9. Screen Flash
      if (screenFlashRef.current > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${screenFlashRef.current})`;
        ctx.fillRect(0, 0, cssW, cssH);
        screenFlashRef.current = Math.max(0, screenFlashRef.current - dt * 2.5);
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      soundManager.stopBombFuse();
    };
  }, [gameState, gameMode, bladeType, onGameOver, onScoreChange, onStrikesChange, onTimeChange]);

  // Slicing logic: (x1, y1) to (x2, y2) in EXACT CSS coordinates
  const handleSlice = (x1: number, y1: number, x2: number, y2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);

    if (dist < 3) return;

    const sliceAngle = Math.atan2(dy, dx);
    const now = performance.now();

    if (dist > 16 && now - lastWhooshTimeRef.current > 130) {
      soundManager.playSwish(dist / 20);
      lastWhooshTimeRef.current = now;
    }

    // Check intersection with all active fruits
    fruitsRef.current.forEach(fruit => {
      if (fruit.sliced) return;

      const hit = lineIntersectsCircle(x1, y1, x2, y2, fruit.x, fruit.y, fruit.radius);
      if (hit) {
        fruit.sliced = true;
        fruit.sliceAngle = sliceAngle;

        // If Bomb sliced:
        if (fruit.isBomb) {
          soundManager.playBombExplode();
          screenFlashRef.current = 0.9;
          screenShakeRef.current = 24;

          if (gameMode === 'classic') {
            strikesRef.current += 1;
            onStrikesChange(strikesRef.current);
            const livesLeft = Math.max(0, 3 - strikesRef.current);

            popupsRef.current.push({
              id: `bomb_strike_${Date.now()}`,
              x: fruit.x,
              y: fruit.y,
              text: strikesRef.current >= 3 ? 'BOMB BLAST! 💣💀' : `BOMB HIT! -1 LIFE 💣 (${livesLeft} LEFT)`,
              color: '#ef4444',
              alpha: 1,
              vy: -75,
              scale: 1.6,
            });

            if (strikesRef.current >= 3) {
              soundManager.playGameOver();
              onGameOver(scoreRef.current);
            }
          } else if (gameMode === 'arcade') {
            scoreRef.current = Math.max(0, scoreRef.current - 10);
            onScoreChange(scoreRef.current);
            popupsRef.current.push({
              id: `bomb_pen_${Date.now()}`,
              x: fruit.x,
              y: fruit.y,
              text: '-10 BOMB!',
              color: '#ef4444',
              alpha: 1,
              vy: -70,
              scale: 1.5,
            });
          }
          return;
        }

        // If Menu Mode fruit sliced:
        if (gameState === 'MENU' && onSelectModeFromSlice) {
          soundManager.playSplat();
          if (fruit.type === 'watermelon') onSelectModeFromSlice('classic');
          else if (fruit.type === 'apple') onSelectModeFromSlice('zen');
          else if (fruit.type === 'banana') onSelectModeFromSlice('arcade');
          return;
        }

        // Normal Fruit Slice:
        const halves = splitFruitIntoHalves(fruit, sliceAngle);
        fruitHalvesRef.current.push(...halves);

        // Juice particle spray
        const particles = createJuiceParticles(fruit.x, fruit.y, fruit.type, sliceAngle);
        particlesRef.current.push(...particles);

        // Dojo wall splatter
        const wallSplatter = createWallSplatter(fruit.x, fruit.y, fruit.type);
        splattersRef.current.push(wallSplatter);

        // Critical slice chance (5%)
        const isCritical = Math.random() < 0.05;
        const cfg = FRUIT_CONFIGS[fruit.type];
        let slicePoints = isCritical ? 10 : cfg.points;

        if (doublePointsTimerRef.current > 0) {
          slicePoints *= 2;
        }

        scoreRef.current += slicePoints;
        onScoreChange(scoreRef.current);
        soundManager.playSplat(isCritical);

        // 100-pt strike heal in Classic
        if (gameMode === 'classic' && strikesRef.current > 0) {
          const prevScore = scoreRef.current - slicePoints;
          if (Math.floor(scoreRef.current / 100) > Math.floor(prevScore / 100)) {
            strikesRef.current = Math.max(0, strikesRef.current - 1);
            onStrikesChange(strikesRef.current);
            popupsRef.current.push({
              id: `heal_${Date.now()}`,
              x: fruit.x,
              y: fruit.y - 30,
              text: 'STRIKE HEALED! ❤️',
              color: '#22c55e',
              alpha: 1,
              vy: -70,
              scale: 1.3,
            });
          }
        }

        // Arcade special bananas
        if (fruit.type === 'freeze_banana') {
          freezeTimerRef.current = 5.0;
          popupsRef.current.push({
            id: `freeze_${Date.now()}`,
            x: fruit.x,
            y: fruit.y - 30,
            text: '❄️ FREEZE!',
            color: '#38bdf8',
            alpha: 1,
            vy: -75,
            scale: 1.6,
          });
        } else if (fruit.type === 'frenzy_banana') {
          frenzyTimerRef.current = 4.5;
          popupsRef.current.push({
            id: `frenzy_${Date.now()}`,
            x: fruit.x,
            y: fruit.y - 30,
            text: '⚡ FRENZY!',
            color: '#c084fc',
            alpha: 1,
            vy: -75,
            scale: 1.6,
          });
        } else if (fruit.type === 'double_banana') {
          doublePointsTimerRef.current = 6.0;
          popupsRef.current.push({
            id: `double_${Date.now()}`,
            x: fruit.x,
            y: fruit.y - 30,
            text: '⭐ 2X DOUBLE!',
            color: '#facc15',
            alpha: 1,
            vy: -75,
            scale: 1.6,
          });
        }

        popupsRef.current.push({
          id: `pop_${Date.now()}`,
          x: fruit.x,
          y: fruit.y,
          text: isCritical ? `CRITICAL! +${slicePoints}` : `+${slicePoints}`,
          color: isCritical ? '#f59e0b' : '#ffffff',
          alpha: 1,
          vy: -60,
          scale: isCritical ? 1.5 : 1.1,
        });

        currentStrokeFruitsRef.current.push({
          id: fruit.id,
          type: fruit.type,
          x: fruit.x,
          y: fruit.y,
        });
        lastStrokeTimeRef.current = now;
      }
    });
  };

  // 1:1 DIRECT CSS COORDINATES - NO DPR MULTIPLICATION
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    soundManager.activate();
    isPointerDownRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    const coords = getCanvasCoords(e);
    bladePointsRef.current = [{ x: coords.x, y: coords.y, time: performance.now() }];
    currentStrokeFruitsRef.current = [];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) return;
    const coords = getCanvasCoords(e);
    const now = performance.now();

    const lastPoint = bladePointsRef.current[bladePointsRef.current.length - 1];
    if (lastPoint) {
      // Direct 1:1 slice between previous and current touch point
      handleSlice(lastPoint.x, lastPoint.y, coords.x, coords.y);
    }

    bladePointsRef.current.push({ x: coords.x, y: coords.y, time: now });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-black touch-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
};
