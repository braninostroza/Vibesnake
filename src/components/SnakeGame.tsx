import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  isMusicPlaying: boolean;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 60;

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, isMusicPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const lastUpdate = useRef<number>(0);
  const animationFrameId = useRef<number>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food on snake
      const onSnake = currentSnake.some(p => p.x === newFood.x && p.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (gameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  const update = (time: number) => {
    if (gameOver || isPaused) {
      animationFrameId.current = requestAnimationFrame(update);
      return;
    }

    const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - score * SPEED_INCREMENT);
    
    if (time - lastUpdate.current > currentSpeed) {
      lastUpdate.current = time;
      
      setDirection(nextDirection);
      
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y,
        };

        // Check walls
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self
        if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat food
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          if (newScore > highScore) setHighScore(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }

    animationFrameId.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(update);
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameOver, isPaused, food, nextDirection, score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (Subtle)
    ctx.strokeStyle = '#1a1a1a';
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * size);
        ctx.lineTo(canvas.width, i * size);
        ctx.stroke();
    }

    // Food (Neon Purple/Pink)
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#d946ef';
    ctx.fillStyle = '#d946ef';
    ctx.beginPath();
    ctx.arc(food.x * size + size / 2, food.y * size + size / 2, size / 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Snake (Neon Green)
    snake.forEach((p, i) => {
      const alpha = 1 - (i / snake.length) * 0.5;
      ctx.shadowBlur = i === 0 ? 20 : 10;
      ctx.shadowColor = '#22c55e';
      ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
      
      // Rounded snake segments
      const padding = 1;
      ctx.beginPath();
      ctx.roundRect(p.x * size + padding, p.y * size + padding, size - padding * 2, size - padding * 2, 4);
      ctx.fill();
    });

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-black rounded-lg p-2 border border-white/10 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-sm cursor-none"
          onClick={() => { if(!gameOver) setIsPaused(prev => !prev); }}
        />
        
        <AnimatePresence>
          {(isPaused || gameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              {gameOver ? (
                <div className="text-center">
                  <h2 className="text-4xl font-black text-rose-500 mb-2 uppercase tracking-tighter italic">Game Over</h2>
                  <p className="text-zinc-400 font-mono text-sm mb-6 uppercase tracking-widest">Score: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="px-6 py-2 bg-rose-500 text-white font-bold uppercase tracking-widest text-xs hover:bg-rose-600 transition-colors rounded-full"
                  >
                    Resurrect
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h1 className="text-5xl font-black text-green-500 mb-4 uppercase tracking-tighter italic">Neon Snake</h1>
                  <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-8">Press Space or Click to Start</p>
                  <div className="flex gap-8 justify-center items-center">
                    <div className="text-center">
                        <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1 italic">High Score</span>
                        <span className="text-xl font-mono text-white tracking-widest">{highScore}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sync Visualizer overlay when music is playing */}
        {isMusicPlaying && !isPaused && !gameOver && (
            <div className="absolute bottom-4 left-0 right-0 h-1 flex items-end justify-center gap-0.5 px-4 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ height: [4, Math.random() * 20 + 10, 4] }}
                        transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                        className="w-1 bg-green-500/30 rounded-full"
                    />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
