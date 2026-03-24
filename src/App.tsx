import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-digital overflow-hidden relative selection:bg-[#ff00ff] selection:text-black">
      {/* CRT Effects */}
      <div className="fixed inset-0 bg-noise opacity-20 z-50 pointer-events-none mix-blend-overlay"></div>
      <div className="fixed inset-0 scanlines z-40 pointer-events-none opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col crt-flicker">
        <header className="mb-8 border-b-4 border-[#ff00ff] pb-4 screen-tear">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase glitch-text" data-text="SYS.OP // SNAKE.EXE">
            SYS.OP // SNAKE.EXE
          </h1>
          <p className="text-[#ff00ff] mt-2 text-2xl tracking-widest uppercase">STATUS: ONLINE // AWAITING INPUT</p>
        </header>

        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24">
          <div className="w-full lg:w-auto flex justify-center order-2 lg:order-1">
            <SnakeGame />
          </div>
          
          <div className="w-full lg:w-96 order-1 lg:order-2 flex flex-col justify-center">
            <div className="mb-4 border-l-4 border-[#00ffff] pl-4">
              <h2 className="text-3xl font-bold text-[#ff00ff] mb-1 flex items-center gap-2 uppercase">
                <span className="w-4 h-4 bg-[#00ffff] animate-ping"></span>
                AUDIO.STREAM // ACTIVE
              </h2>
              <p className="text-[#00ffff] text-xl opacity-80">DECRYPTING FREQUENCIES...</p>
            </div>
            <MusicPlayer />
          </div>
        </main>
        
        <footer className="mt-12 border-t-4 border-[#00ffff] pt-4 text-[#ff00ff] text-xl uppercase tracking-widest flex justify-between">
          <span>TERMINAL_ID: 8X-99</span>
          <span className="animate-pulse">_</span>
        </footer>
      </div>
    </div>
  );
}
