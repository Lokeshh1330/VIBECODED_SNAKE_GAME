import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Terminal, Play as PlayIcon } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(direction);
  
  const updateDirection = useCallback((newDir: Point) => {
    const currentDir = directionRef.current;
    if (newDir.x !== 0 && currentDir.x !== 0) return;
    if (newDir.y !== 0 && currentDir.y !== 0) return;
    directionRef.current = newDir;
    setDirection(newDir);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (!hasStarted && e.key !== ' ') setHasStarted(true);

      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': updateDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': case 's': case 'S': updateDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': case 'a': case 'A': updateDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': case 'd': case 'D': updateDirection({ x: 1, y: 0 }); break;
        case ' ':
          if (gameOver) resetGame();
          else if (hasStarted) setIsPaused(p => !p);
          else setHasStarted(true);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [updateDirection, gameOver, hasStarted]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setHasStarted(true);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;
    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { x: head.x + directionRef.current.x, y: head.y + directionRef.current.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true); return prevSnake;
        }
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true); return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };

    const speed = Math.max(40, INITIAL_SPEED - Math.floor(score / 50) * 8);
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, hasStarted, score, generateFood]);

  return (
    <div className="flex flex-col items-center w-full max-w-[440px]">
      <div className="mb-4 flex justify-between items-center w-full px-4 py-2 bg-black border-4 border-[#00ffff] relative">
        <div className="absolute -top-4 -left-4 bg-[#ff00ff] text-black px-2 text-lg font-bold">MEM_ADDR: 0x00F</div>
        <div className="text-[#ff00ff] font-digital text-3xl uppercase tracking-widest">SCORE.DAT</div>
        <div className="text-5xl font-black text-[#00ffff] glitch-text" data-text={score.toString().padStart(4, '0')}>
          {score.toString().padStart(4, '0')}
        </div>
      </div>

      <div className="relative p-1 bg-black border-4 border-[#ff00ff]">
        <div 
          className="relative bg-black overflow-hidden"
          style={{ 
            width: `${GRID_SIZE * 20}px`, 
            height: `${GRID_SIZE * 20}px`,
            backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        >
          {/* Food */}
          <div 
            className="absolute bg-[#ff00ff] animate-pulse"
            style={{
              width: '20px', height: '20px',
              left: `${food.x * 20}px`, top: `${food.y * 20}px`,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div 
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute ${isHead ? 'bg-[#ffffff]' : 'bg-[#00ffff]'}`}
                style={{
                  width: '20px', height: '20px',
                  left: `${segment.x * 20}px`, top: `${segment.y * 20}px`,
                  border: '1px solid #000'
                }}
              >
                {isHead && (
                  <div className="w-full h-full relative">
                    <div className="absolute w-2 h-2 bg-[#ff00ff] top-1 left-1" />
                    <div className="absolute w-2 h-2 bg-[#ff00ff] top-1 right-1" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Overlays */}
          {(!hasStarted || gameOver || isPaused) && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
              <div className="text-center p-8 bg-black border-4 border-[#ff00ff] min-w-[280px] screen-tear">
                {!hasStarted ? (
                  <>
                    <h2 className="text-5xl font-black text-[#00ffff] mb-4 glitch-text" data-text="INITIALIZE">INITIALIZE</h2>
                    <p className="text-[#ff00ff] mb-6 font-digital text-2xl">INPUT: WASD // ARROWS</p>
                    <button 
                      onClick={() => setHasStarted(true)}
                      className="group flex items-center justify-center gap-3 w-full px-6 py-3 bg-black border-4 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black font-bold text-3xl transition-none uppercase"
                    >
                      <Terminal className="w-8 h-8" />
                      EXECUTE
                    </button>
                  </>
                ) : gameOver ? (
                  <>
                    <h2 className="text-5xl font-black text-[#ff00ff] mb-2 glitch-text" data-text="FATAL_ERR">FATAL_ERR</h2>
                    <div className="my-6 border-y-2 border-[#00ffff] py-4">
                      <p className="text-[#00ffff] text-xl uppercase tracking-widest mb-1">DATA_COLLECTED</p>
                      <p className="text-7xl font-digital text-white glitch-text" data-text={score.toString().padStart(4, '0')}>
                        {score.toString().padStart(4, '0')}
                      </p>
                    </div>
                    <button 
                      onClick={resetGame}
                      className="group flex items-center justify-center gap-3 w-full px-6 py-3 bg-black border-4 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black font-bold text-3xl transition-none uppercase"
                    >
                      <RotateCcw className="w-8 h-8" />
                      REBOOT
                    </button>
                  </>
                ) : isPaused ? (
                  <>
                    <h2 className="text-5xl font-black text-[#00ffff] mb-6 glitch-text" data-text="SUSPENDED">SUSPENDED</h2>
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="group flex items-center justify-center gap-3 w-full px-6 py-3 bg-black border-4 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black font-bold text-3xl transition-none uppercase"
                    >
                      <PlayIcon className="w-8 h-8" />
                      RESUME_OP
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-[#00ffff] text-xl flex gap-4 uppercase bg-black border-2 border-[#ff00ff] px-4 py-2">
        <span><kbd className="text-[#ff00ff]">WASD</kbd> / <kbd className="text-[#ff00ff]">ARROWS</kbd> : NAVIGATE</span>
        <span><kbd className="text-[#ff00ff]">SPACE</kbd> : HALT</span>
      </div>
    </div>
  );
}
