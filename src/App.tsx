/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, GameState, BladeType } from './types';
import { FruitNinjaCanvas } from './components/FruitNinjaCanvas';
import { GameHUD } from './components/GameHUD';
import { MenuOverlay } from './components/MenuOverlay';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { soundManager } from './utils/sound';

const STORAGE_KEY_HIGHSCORES = 'fn_highscores_v1';
const STORAGE_KEY_BLADE = 'fn_blade_v1';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [bladeType, setBladeType] = useState<BladeType>('classic');

  const [score, setScore] = useState<number>(0);
  const [strikes, setStrikes] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);

  const [highScores, setHighScores] = useState<Record<GameMode, number>>({
    classic: 0,
    zen: 0,
    arcade: 0,
  });

  // Load saved highscores & blade from localStorage
  useEffect(() => {
    try {
      const savedScores = localStorage.getItem(STORAGE_KEY_HIGHSCORES);
      if (savedScores) {
        setHighScores(JSON.parse(savedScores));
      }
      const savedBlade = localStorage.getItem(STORAGE_KEY_BLADE) as BladeType;
      if (savedBlade) {
        setBladeType(savedBlade);
      }
    } catch {
      // localStorage fallback
    }
  }, []);

  // Save High Scores
  const updateHighScore = useCallback((mode: GameMode, finalScore: number) => {
    setHighScores(prev => {
      if (finalScore > (prev[mode] || 0)) {
        const updated = { ...prev, [mode]: finalScore };
        try {
          localStorage.setItem(STORAGE_KEY_HIGHSCORES, JSON.stringify(updated));
        } catch {
          // fallback
        }
        return updated;
      }
      return prev;
    });
  }, []);

  // Handle Blade selection
  const handleSelectBlade = (blade: BladeType) => {
    setBladeType(blade);
    try {
      localStorage.setItem(STORAGE_KEY_BLADE, blade);
    } catch {
      // fallback
    }
  };

  // Toggle Sound FX
  const handleToggleSound = () => {
    const nextState = soundManager.toggleSound();
    setSoundEnabled(nextState);
  };

  // Toggle Background Music
  const handleToggleMusic = () => {
    const nextState = soundManager.toggleMusic();
    setMusicEnabled(nextState);
  };

  // Synchronize background music with game state and visibility
  useEffect(() => {
    if (!musicEnabled) {
      soundManager.pauseMusic();
      return;
    }

    if (gameState === 'PLAYING' || gameState === 'MENU') {
      soundManager.startMusic();
    } else {
      soundManager.pauseMusic();
    }
  }, [gameState, musicEnabled]);

  // Pause music if user switches browser tabs, resume on focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        soundManager.pauseMusic();
      } else if (musicEnabled && (gameState === 'PLAYING' || gameState === 'MENU')) {
        soundManager.startMusic();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [gameState, musicEnabled]);

  // Start Game
  const handleStartGame = (mode: GameMode) => {
    soundManager.activate();
    setGameMode(mode);
    setScore(0);
    setStrikes(0);
    setTimeRemaining(mode === 'zen' ? 90 : mode === 'arcade' ? 60 : 0);
    setGameState('PLAYING');
  };

  // Game Over
  const handleGameOver = (finalScore: number) => {
    updateHighScore(gameMode, finalScore);
    setGameState('GAME_OVER');
  };

  // Pause / Resume
  const handlePauseToggle = () => {
    setGameState(prev => (prev === 'PLAYING' ? 'PAUSED' : prev === 'PAUSED' ? 'PLAYING' : prev));
  };

  // Restart
  const handleRestart = () => {
    soundManager.activate();
    setScore(0);
    setStrikes(0);
    setTimeRemaining(gameMode === 'zen' ? 90 : gameMode === 'arcade' ? 60 : 0);
    setGameState('PLAYING');
  };

  // Return to Menu
  const handleReturnToMenu = () => {
    setGameState('MENU');
  };

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-black select-none touch-none">
      {/* Game Canvas (1:1 responsive coordinates, handles Menu idle slicing or Playing) */}
      <FruitNinjaCanvas
        gameState={gameState}
        gameMode={gameMode}
        bladeType={bladeType}
        onGameOver={handleGameOver}
        onScoreChange={setScore}
        onStrikesChange={setStrikes}
        onTimeChange={setTimeRemaining}
        onSelectModeFromSlice={handleStartGame}
      />

      {/* Heads-Up Display (Score, Strikes/Timer, Audio Controls) */}
      <GameHUD
        gameState={gameState}
        gameMode={gameMode}
        score={score}
        highScore={highScores[gameMode] || 0}
        strikes={strikes}
        timeRemaining={timeRemaining}
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        onToggleSound={handleToggleSound}
        onToggleMusic={handleToggleMusic}
        onPauseToggle={handlePauseToggle}
      />

      {/* Main Menu Screen */}
      {gameState === 'MENU' && (
        <MenuOverlay
          onStartGame={handleStartGame}
          selectedBlade={bladeType}
          onSelectBlade={handleSelectBlade}
          highScores={highScores}
        />
      )}

      {/* Game Over Screen */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          score={score}
          highScore={highScores[gameMode] || 0}
          gameMode={gameMode}
          onPlayAgain={handleRestart}
          onReturnToMenu={handleReturnToMenu}
        />
      )}

      {/* Pause Screen */}
      {gameState === 'PAUSED' && (
        <PauseModal
          gameMode={gameMode}
          score={score}
          onResume={() => setGameState('PLAYING')}
          onRestart={handleRestart}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
    </main>
  );
}
