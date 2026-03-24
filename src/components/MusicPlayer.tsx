import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "SECTOR_01.WAV", artist: "UNKNOWN_ENTITY", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "CORRUPT_DATA.MP3", artist: "SYS_ADMIN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "VOID_SIGNAL.FLAC", artist: "NULL_POINTER", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("ERR_AUDIO_PLAY", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const skipForward = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const skipBack = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) setProgress((current / duration) * 100);
    }
  };

  const track = TRACKS[currentTrackIndex];

  return (
    <div className="bg-black border-4 border-[#ff00ff] p-6 w-full max-w-md mx-auto flex flex-col gap-6 relative screen-tear">
      <div className="absolute top-0 right-0 bg-[#ff00ff] text-black px-2 py-1 text-lg font-bold">PID: 4092</div>
      <audio ref={audioRef} src={track.url} onTimeUpdate={handleTimeUpdate} onEnded={skipForward} />
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-[#00ffff] flex items-center justify-center border-2 border-[#ff00ff] shrink-0">
          <Terminal className="text-black w-10 h-10" />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 className="text-[#00ffff] font-bold text-3xl truncate uppercase">{track.title}</h3>
          <p className="text-[#ff00ff] text-xl truncate uppercase">SRC: {track.artist}</p>
        </div>
      </div>

      <div className="w-full bg-black border-2 border-[#00ffff] h-4 relative">
        <div 
          className="bg-[#ff00ff] h-full transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(!isMuted)} className="text-[#00ffff] hover:text-[#ff00ff] hover:bg-[#00ffff] p-1 border-2 border-transparent hover:border-[#ff00ff] transition-colors">
            {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </button>
          <input 
            type="range" min="0" max="1" step="0.01" value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 appearance-none bg-black border-2 border-[#00ffff] h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-[#ff00ff] cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-4">
          <button onClick={skipBack} className="text-[#00ffff] hover:text-black hover:bg-[#00ffff] border-2 border-[#00ffff] p-2 transition-colors">
            <SkipBack size={28} />
          </button>
          <button 
            onClick={togglePlay} 
            className="w-16 h-16 bg-[#ff00ff] hover:bg-[#00ffff] text-black border-2 border-[#00ffff] hover:border-[#ff00ff] flex items-center justify-center transition-all shrink-0"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={skipForward} className="text-[#00ffff] hover:text-black hover:bg-[#00ffff] border-2 border-[#00ffff] p-2 transition-colors">
            <SkipForward size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}
