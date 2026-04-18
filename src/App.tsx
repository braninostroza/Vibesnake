/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Trophy, Music, Zap } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Dynamic Background Noise/Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <Zap className="w-6 h-6 text-black fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter italic leading-none">Neon Rhythm</h1>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] mt-1">Arcade x Audio Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
             <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Current Score</span>
             <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-2xl font-black font-mono tracking-tighter text-green-400">{score.toString().padStart(4, '0')}</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-8 max-w-7xl mx-auto w-full">
        {/* Left Column - Stats / Flavor (Desktop only) */}
        <div className="hidden lg:flex flex-col gap-6 w-64">
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 font-bold">System Status</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-mono">NEURAL_LINK</span>
                <span className="text-green-500 font-mono">STABLE</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-mono">AUDIO_SYNC</span>
                <span className={isMusicPlaying ? "text-cyan-400 font-mono" : "text-zinc-600 font-mono"}>
                  {isMusicPlaying ? "ACTIVE" : "STANDBY"}
                </span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-[9px] text-zinc-600 font-mono leading-relaxed">
                  NEON_CORE v2.0.4<br/>
                  GRID_RESOLUTION: 20x20<br/>
                  LATENCY: 2ms
                </p>
            </div>
          </div>
          
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <h4 className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold italic">Controls</h4>
            <ul className="text-[10px] space-y-2 text-zinc-400 font-mono uppercase">
               <li>[Arrows] Steer Snake</li>
               <li>[Space] Pause / Resume</li>
            </ul>
          </div>
        </div>

        {/* Center - Snake Game */}
        <div className="flex-1 flex justify-center">
          <SnakeGame 
            onScoreChange={setScore} 
            isMusicPlaying={isMusicPlaying}
          />
        </div>

        {/* Right - Music Player */}
        <div className="w-full lg:w-auto flex justify-center">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <MusicPlayer onPlayStateChange={setIsMusicPlaying} />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 flex flex-col items-center gap-4 border-t border-white/5">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-[0.3em]">Neural Network Operational</span>
         </div>
         <p className="text-[10px] text-zinc-700">© 2026 NEON RHYTHM AUDIO ARCADE</p>
      </footer>
    </div>
  );
}

