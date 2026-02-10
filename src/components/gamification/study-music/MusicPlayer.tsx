'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, X, ChevronUp, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MusicVisualizer } from './MusicVisualizer';
import { useSound } from '@/hooks/gamification/useSound';

interface Track {
  id: string;
  name: string;
  category: string;
  url: string;
  duration: number;
}

const TRACKS: Track[] = [
  {
    id: 'lofi-1',
    name: 'Lofi Study Beat #1',
    category: 'Lo-fi Beats',
    url: '/music/lofi-1.mp3',
    duration: 180,
  },
  {
    id: 'lofi-2',
    name: 'Lofi Study Beat #2',
    category: 'Lo-fi Beats',
    url: '/music/lofi-2.mp3',
    duration: 180,
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    category: 'Ocean Waves',
    url: '/music/ocean-waves.mp3',
    duration: 180,
  },
  {
    id: 'forest',
    name: 'Forest Ambiance',
    category: 'Forest Ambiance',
    url: '/music/forest-ambiance.mp3',
    duration: 180,
  },
  {
    id: 'classical',
    name: 'Classical Focus',
    category: 'Classical Focus',
    url: '/music/classical-focus.mp3',
    duration: 180,
  },
  {
    id: 'ambient',
    name: 'Ambient Space',
    category: 'Ambient Space',
    url: '/music/ambient-space.mp3',
    duration: 180,
  },
];

const CATEGORIES = ['All', ...new Set(TRACKS.map((t) => t.category))];

export const MusicPlayer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState(TRACKS[0].id);
  const [volume, setVolume] = useState(0.5);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [elapsedTime, setElapsedTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { play } = useSound();

  const currentTrack = TRACKS.find((t) => t.id === currentTrackId) || TRACKS[0];
  const filteredTracks =
    selectedCategory === 'All'
      ? TRACKS
      : TRACKS.filter((t) => t.category === selectedCategory);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    // Update audio source but don't play yet
    audioRef.current.src = currentTrack.url;

    // Load the audio
    audioRef.current.load();
  }, [currentTrack.url]);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // MVP: For now, we'll just show the UI
      // In production, this would actually play the audio
      play('navigation');
      setElapsedTime(0);
      // Simulate playing
      const interval = setInterval(() => {
        setElapsedTime((prev) => (prev + 1) % (currentTrack.duration + 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack.duration, play]);

  // Handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (trackId: string) => {
    setCurrentTrackId(trackId);
    setIsPlaying(true);
    setElapsedTime(0);
  };

  const handleSkip = () => {
    const currentIndex = filteredTracks.findIndex((t) => t.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % filteredTracks.length;
    handleTrackSelect(filteredTracks[nextIndex].id);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      {/* Audio Element (MVP - no actual playback) */}
      <audio ref={audioRef} crossOrigin="anonymous" />

      {/* Floating Music Player */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* Compact Mode */
            <motion.button
              key="compact"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-400/50 rounded-full backdrop-blur-sm hover:from-blue-500/40 hover:to-cyan-500/40 transition-all shadow-lg"
            >
              <MusicVisualizer isPlaying={isPlaying} barCount={3} />
              <span className="text-sm font-semibold text-white truncate max-w-xs">
                {currentTrack.name}
              </span>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className="hover:scale-110 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white fill-white" />
                )}
              </motion.button>
            </motion.button>
          ) : (
            /* Expanded Mode */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="w-80 bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-bold text-white">Study Music</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronUp className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Now Playing */}
              <div className="p-4 space-y-3 border-b border-white/10">
                <div className="text-center space-y-2">
                  <p className="text-sm text-white/60 uppercase tracking-widest">Now Playing</p>
                  <p className="font-bold text-white">{currentTrack.name}</p>
                  <p className="text-xs text-white/50">{currentTrack.category}</p>
                </div>

                {/* Visualizer */}
                <div className="flex justify-center py-2">
                  <MusicVisualizer isPlaying={isPlaying} />
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                      animate={{ width: `${(elapsedTime / currentTrack.duration) * 100}%` }}
                      transition={{ duration: 1, ease: 'linear' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{formatTime(elapsedTime)}</span>
                    <span>{formatTime(currentTrack.duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handlePlayPause}
                    className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Play
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSkip}
                    className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip
                  </button>
                </div>
              </div>

              {/* Volume Control */}
              <div className="p-4 border-b border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-white/60" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgb(96, 165, 250) 0%, rgb(96, 165, 250) ${volume * 100}%, rgb(255, 255, 255, 0.1) ${volume * 100}%, rgb(255, 255, 255, 0.1) 100%)`,
                    }}
                  />
                  <span className="text-xs text-white/60 w-8 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>

              {/* Track List */}
              <div className="space-y-2 p-4">
                {/* Category Filter */}
                <div className="flex gap-1 overflow-x-auto pb-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Tracks */}
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {filteredTracks.map((track) => (
                    <motion.button
                      key={track.id}
                      onClick={() => handleTrackSelect(track.id)}
                      className={`w-full text-left px-2 py-2 rounded-lg transition-colors ${
                        currentTrackId === track.id
                          ? 'bg-blue-500/30 border border-blue-400/50 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <p className="text-xs font-medium truncate">{track.name}</p>
                      <p className="text-xs text-white/50">{formatTime(track.duration)}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
