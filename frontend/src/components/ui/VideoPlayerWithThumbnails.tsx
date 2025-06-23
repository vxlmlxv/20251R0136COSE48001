import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, SkipBack, SkipForward, Download, Camera } from 'lucide-react';
import { VideoThumbnailGenerator, Thumbnail } from '@/lib/thumbnail-generator';
import JSZip from 'jszip';

interface VideoPlayerProps {
  src: string;
  className?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onVideoRef?: (ref: HTMLVideoElement | null) => void;
  keyMoments?: Array<{
    id: string;
    timestamp: number;
    title: string;
    type?: string;
  }>;
  autoGenerateThumbnails?: boolean;
  thumbnailCount?: number;
}

export const VideoPlayerWithThumbnails: React.FC<VideoPlayerProps> = ({
  src,
  className = '',
  onTimeUpdate,
  onVideoRef,
  keyMoments = [],
  autoGenerateThumbnails = true,
  thumbnailCount = 10
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnailGeneratorRef = useRef<VideoThumbnailGenerator | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [keyMomentThumbnails, setKeyMomentThumbnails] = useState<Map<string, Thumbnail>>(new Map());
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const [hoveredTime, setHoveredTime] = useState<number | null>(null);
  const [previewThumbnail, setPreviewThumbnail] = useState<Thumbnail | null>(null);

  // Initialize thumbnail generator
  useEffect(() => {
    thumbnailGeneratorRef.current = new VideoThumbnailGenerator();
    
    return () => {
      thumbnailGeneratorRef.current?.dispose();
    };
  }, []);

  // Pass video ref to parent component
  useEffect(() => {
    onVideoRef?.(videoRef.current);
  }, [onVideoRef]);

  // Generate thumbnails when video loads
  useEffect(() => {
    if (!videoRef.current || !src || !autoGenerateThumbnails) return;

    const generateThumbnails = async () => {
      if (!thumbnailGeneratorRef.current || !duration) return;
      
      setIsLoadingThumbnails(true);
      
      try {
        // Generate interval thumbnails
        const intervalThumbnails = await thumbnailGeneratorRef.current.generateIntervalThumbnails(
          src,
          duration,
          thumbnailCount,
          { width: 160, height: 90 }
        );
        setThumbnails(intervalThumbnails);

        // Generate key moment thumbnails
        if (keyMoments.length > 0) {
          const eventThumbnails = await thumbnailGeneratorRef.current.generateEventThumbnails(
            src,
            keyMoments.map(m => ({ id: m.id, timestamp: m.timestamp })),
            { width: 120, height: 68 }
          );
          setKeyMomentThumbnails(eventThumbnails);
        }
      } catch (error) {
        console.error('Failed to generate thumbnails:', error);
      } finally {
        setIsLoadingThumbnails(false);
      }
    };

    if (duration > 0) {
      generateThumbnails();
    }
  }, [src, duration, autoGenerateThumbnails, thumbnailCount, keyMoments]);

  // Video event handlers
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    onTimeUpdate?.(time);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    
    const newTime = value[0];
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    
    const newVolume = value[0];
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    
    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const jumpToTime = (time: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = time;
    setCurrentTime(time);
    if (!isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const skipForward = () => {
    if (!videoRef.current) return;
    const newTime = Math.min(currentTime + 10, duration);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipBackward = () => {
    if (!videoRef.current) return;
    const newTime = Math.max(currentTime - 10, 0);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Generate preview thumbnail on hover
  const handleSeekBarHover = useCallback(async (event: React.MouseEvent<HTMLDivElement>) => {
    if (!thumbnailGeneratorRef.current || !duration) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    const time = percentage * duration;
    
    setHoveredTime(time);
    
    try {
      const thumbnail = await thumbnailGeneratorRef.current.generateThumbnail(
        src,
        time,
        { width: 160, height: 90 }
      );
      setPreviewThumbnail(thumbnail);
    } catch (error) {
      console.error('Failed to generate preview thumbnail:', error);
    }
  }, [src, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Export functions
  const exportCurrentFrame = async () => {
    if (!thumbnailGeneratorRef.current || !videoRef.current) return;
    
    try {
      const thumbnail = await thumbnailGeneratorRef.current.generateThumbnail(
        src,
        currentTime,
        { width: 1920, height: 1080, quality: 0.9, format: 'png' }
      );
      
      // Create download link
      const link = document.createElement('a');
      link.href = thumbnail.dataUrl;
      link.download = `thumbnail-${Math.floor(currentTime)}s.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export frame:', error);
    }
  };

  const exportAllKeyMoments = async () => {
    if (!thumbnailGeneratorRef.current || keyMoments.length === 0) return;
    
    try {
      const zipFile = new JSZip();
      
      for (const moment of keyMoments) {
        const thumbnail = await thumbnailGeneratorRef.current.generateThumbnail(
          src,
          moment.timestamp,
          { width: 1920, height: 1080, quality: 0.9, format: 'png' }
        );
        
        // Convert data URL to blob
        const response = await fetch(thumbnail.dataUrl);
        const blob = await response.blob();
        
        zipFile.file(`${moment.title || 'moment'}-${Math.floor(moment.timestamp)}s.png`, blob);
      }
      
      const zipBlob = await zipFile.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'key-moments-thumbnails.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Failed to export key moments:', error);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Video Player */}
      <Card>
        <CardContent className="p-0">
          <div className="relative group">
            <video
              ref={videoRef}
              src={src}
              className="w-full aspect-video bg-black rounded-t-lg"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onClick={handlePlayPause}
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Seek Bar */}
              <div className="relative mb-3">
                <div
                  className="relative"
                  onMouseMove={handleSeekBarHover}
                  onMouseLeave={() => {
                    setHoveredTime(null);
                    setPreviewThumbnail(null);
                  }}
                >
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                  
                  {/* Thumbnail Preview on Hover */}
                  {previewThumbnail && hoveredTime !== null && (
                    <div
                      className="absolute bottom-8 transform -translate-x-1/2 pointer-events-none z-10"
                      style={{ left: `${(hoveredTime / duration) * 100}%` }}
                    >
                      <div className="bg-black rounded-lg p-2 shadow-lg">
                        <img
                          src={previewThumbnail.dataUrl}
                          alt={`Preview at ${formatTime(hoveredTime)}`}
                          className="rounded"
                          width={previewThumbnail.width}
                          height={previewThumbnail.height}
                        />
                        <div className="text-white text-xs text-center mt-1">
                          {formatTime(hoveredTime)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipBackward}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipForward}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.1}
                      onValueChange={handleVolumeChange}
                      className="w-20"
                    />
                  </div>
                  
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={exportCurrentFrame}
                    className="text-white hover:bg-white/20"
                    title="Export current frame as image"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  
                  {keyMoments.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={exportAllKeyMoments}
                      className="text-white hover:bg-white/20"
                      title="Export all key moments as ZIP"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
