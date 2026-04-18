import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Cyberpunk Pulse",
    artist: "AI Gen: Alpha-01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/cyber/400/400"
  },
  {
    id: 2,
    title: "Neon Dreams",
    artist: "AI Gen: Synth-X",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon/400/400"
  },
  {
    id: 3,
    title: "Glitch Drive",
    artist: "AI Gen: Neural-Vox",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/glitch/400/400"
  }
];

interface MusicPlayerProps {
  onPlayStateChange: (isPlaying: boolean) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onPlayStateChange }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.play().catch(() => setIsPlaying(false));
        } else {
            audioRef.current.pause();
        }
    }
    onPlayStateChange(isPlaying);
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(currentProgress) ? 0 : currentProgress);
    }
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-md bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10 p-6 flex flex-col gap-6 relative">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-rose-500 opacity-50"></div>

      <div className="flex items-center gap-4">
        <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-lg"
        >
          <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </motion.div>
        
        <div className="flex-1 overflow-hidden">
          <motion.h3 
            key={`title-${currentTrack.id}`}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-white font-bold leading-tight truncate tracking-tight"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            key={`artist-${currentTrack.id}`}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 0.5 }}
            className="text-white/60 text-xs font-mono uppercase tracking-widest mt-0.5"
          >
            {currentTrack.artist}
          </motion.p>
        </div>
        
        <div className="flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/10">
          <Music className="w-4 h-4 text-purple-400" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={skipBackward} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
              <SkipBack className="w-5 h-5 text-white/50 group-hover:text-white" />
            </button>
            <button 
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <button onClick={skipForward} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
              <SkipForward className="w-5 h-5 text-white/50 group-hover:text-white" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors">
            <Volume2 className="w-4 h-4" />
            <div className="w-16 h-1 bg-white/10 rounded-full relative">
                <div className="absolute top-0 left-0 h-full w-2/3 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visualizer bars */}
      <div className="mt-2 flex items-end justify-between h-4 gap-0.5">
        {[...Array(32)].map((_, i) => (
           <motion.div
             key={i}
             animate={{ 
               height: isPlaying ? [4, Math.random() * 16 + 2, 4] : [4, 4, 4] 
             }}
             transition={{ 
               repeat: Infinity, 
               duration: 0.4 + (i % 5) * 0.1,
               delay: i * 0.05
             }}
             className="flex-1 rounded-t-sm"
             style={{ 
               backgroundColor: `hsl(${(i * 10) + 200}, 70%, 60%)`,
               opacity: isPlaying ? 0.8 : 0.2
             }}
           />
        ))}
      </div>
    </div>
  );
};
