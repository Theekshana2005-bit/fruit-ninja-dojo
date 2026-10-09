export type FruitType =
  | 'watermelon'
  | 'orange'
  | 'apple'
  | 'banana'
  | 'pineapple'
  | 'strawberry'
  | 'coconut'
  | 'freeze_banana'
  | 'frenzy_banana'
  | 'double_banana'
  | 'bomb';

export type GameMode = 'classic' | 'zen' | 'arcade';
export type BladeType = 'classic' | 'flame' | 'ice' | 'rainbow' | 'shadow';
export type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface FruitConfig {
  nameEn: string;
  nameSi: string;
  radius: number;
  points: number;
  juiceColor: string;
  rindColor: string;
  fleshColor: string;
  seedColor?: string;
  isSpecial?: boolean;
  specialType?: 'freeze' | 'frenzy' | 'double';
}

export interface FruitHalf {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  sliceAngle: number;
  isLeft: boolean;
  type: FruitType;
  radius: number;
  alpha: number;
}

export interface Fruit {
  id: string;
  type: FruitType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  vRot: number;
  sliced: boolean;
  sliceAngle?: number;
  halves?: [FruitHalf, FruitHalf];
  missed?: boolean;
  isBomb: boolean;
  sparkPhase?: number;
  scale: number;
}

export interface BladePoint {
  x: number;
  y: number;
  time: number;
}

export interface JuiceParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  isSeed?: boolean;
}

export interface WallSplatter {
  x: number;
  y: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  dots: { dx: number; dy: number; r: number }[];
  drips: { x: number; y: number; maxLen: number; curLen: number; width: number }[];
}

export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  vy: number;
  scale: number;
}

export interface ComboTracker {
  count: number;
  fruits: FruitType[];
  lastSliceTime: number;
}

export interface GameStats {
  score: number;
  strikes: number;
  timeRemaining: number;
  highScores: Record<GameMode, number>;
  totalSlices: number;
  fruitSliceCounts: Partial<Record<FruitType, number>>;
  bestCombo: number;
}
