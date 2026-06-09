import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  streamUrl: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ streamUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    let hls: Hls | null = null;

    // Reset mute state when a new channel loads
    setIsMuted(true);
    video.muted = true;

    if (Hls.isSupported()) {
      hls = new Hls({ debug: false });
      
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.warn("Autoplay blocked:", err));
      });
      
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) console.error("HLS Error:", data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch((err) => console.warn("Autoplay blocked:", err));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl group">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted={isMuted} 
        playsInline
      />
      
      {/* Visual overlay gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
      
      {/* Floating Mute Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 p-3 bg-gray-900/80 hover:bg-blue-600 text-white rounded-full transition-all duration-200 shadow-lg border border-gray-700 hover:border-blue-500 opacity-0 group-hover:opacity-100 focus:opacity-100"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
};