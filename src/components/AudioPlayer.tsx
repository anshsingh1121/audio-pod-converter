
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string | null;
  fileName: string;
  isLoading?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, fileName, isLoading = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
      }
      setIsPlaying(false);
      setProgress(0);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
        intervalRef.current = window.setInterval(updateProgress, 1000);
      } else {
        audioRef.current.pause();
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const updateProgress = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handlePlayPause = () => {
    if (audioUrl) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
      setProgress(audioRef.current.currentTime);
    }
  };

  const skipForward = () => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        audioRef.current.currentTime + 10
      );
      setProgress(audioRef.current.currentTime);
    }
  };

  if (!audioUrl && !isLoading) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6 bg-white rounded-lg p-4 shadow-sm animate-slide-up" style={{ animationDelay: '0.5s' }}>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} onLoadedMetadata={updateProgress}>
        <source src={audioUrl || ''} type="audio/mpeg" />
      </audio>
      
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 rounded bg-podcast-medium flex-shrink-0 mr-3 flex items-center justify-center">
          <span className="text-white text-xs">AI</span>
        </div>
        <h3 className="font-medium text-gray-800 truncate">{fileName}</h3>
      </div>
      
      <div className="mb-3">
        <div className="slider-track">
          <div className="slider-range" style={{ width: `${(progress / (duration || 1)) * 100}%` }}></div>
        </div>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={progress}
          onChange={handleProgressChange}
          className="w-full absolute opacity-0 cursor-pointer h-1"
          style={{ marginTop: '-4px' }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-500">{formatTime(progress)}</span>
        <div className="flex items-center gap-4">
          <button 
            onClick={skipBackward} 
            className="audio-control text-gray-600 hover:text-podcast-accent"
            disabled={!audioUrl || isLoading}
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={handlePlayPause} 
            className="audio-control bg-podcast-control hover:bg-podcast-accent"
            disabled={!audioUrl || isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} className="ml-1" />
            )}
          </button>
          
          <button 
            onClick={skipForward} 
            className="audio-control text-gray-600 hover:text-podcast-accent"
            disabled={!audioUrl || isLoading}
          >
            <SkipForward size={20} />
          </button>
        </div>
        <span className="text-xs text-gray-500">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default AudioPlayer;
