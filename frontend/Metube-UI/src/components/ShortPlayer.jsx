import React, { useEffect, useRef, useState } from 'react';
import { Heart, MessageSquareText, Share2, MoreHorizontal, Music2, HeadphoneOff } from 'lucide-react';

import Hls from 'hls.js';
import { formatOut } from '../../../../worker_server/src/util/helper.js';
import { useAuth } from '../context/AuthContext.jsx';
import { subscribeChannel, unsubscribeChannel } from '../service/authService.js';
import { useNavigate } from 'react-router-dom';

const ShortPlayer = ({ video, prefix, onVisible }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const uploaderId = video?.userId?._id || video?.userId;
    if (!uploaderId) return setSubscribed(false);
    setSubscribed(!!(user && user.subscriptions && user.subscriptions.includes(uploaderId)));
  }, [user, video]);

  const handleToggleSubscribe = async (e) => {
    e.stopPropagation();
    if (!user) return navigate('/login');
    const uploaderId = video?.userId?._id || video?.userId;
    if (!uploaderId) return;
    try {
      if (!subscribed) {
        await subscribeChannel(uploaderId);
        setSubscribed(true);
        if (setUser) setUser({ ...user, subscriptions: [...(user.subscriptions || []), uploaderId] });
      } else {
        await unsubscribeChannel(uploaderId);
        setSubscribed(false);
        if (setUser) setUser({ ...user, subscriptions: (user.subscriptions || []).filter((id) => id !== uploaderId) });
      }
    } catch (err) {
      console.error('Subscribe toggle failed', err);
    }
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !video) return;

    if (Hls.isSupported()) {
      // prefer higher quality when available; don't strictly cap to player size
      const hls = new Hls({ capLevelToPlayerSize: false });
      hlsRef.current = hls;
      hls.loadSource(`${prefix}/${video.hlsPath}`);
      hls.attachMedia(v);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        try {
          const levels = hls.levels || [];
          console.debug('HLS manifest levels:', levels.map(l => ({ width: l.width, height: l.height, bitrate: l.bitrate })));
          if (levels.length) {
            // force highest quality to avoid blurry upscaling on large card
            hls.currentLevel = levels.length - 1;
          }
        } 
        catch (e) {
          console.warn('HLS level selection failed', e);
        }
        setIsReady(true);
      });
    }
    else {
      v.src = `${prefix}/${video.hlsPath}`;
      setIsReady(true);
    }

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [video, prefix]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (!v.duration) return;
      setProgress((v.currentTime / v.duration) * 100);
    };
    v.addEventListener('timeupdate', onTime);
    return () => v.removeEventListener('timeupdate', onTime);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            try { videoRef.current.play(); } catch {}
            if (onVisible) onVisible(video.videoId);
          } 
          else {
            try { videoRef.current.pause(); } catch {}
          }
        });
      },
      { threshold: [0.25, 0.5, 0.75] },
    );

    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [onVisible, video]);

  const toggleSound = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    // if unmuting, ensure playback continues (user gesture allows audio)
    try { v.play(); } catch {}
  };

  return (
    <div ref={containerRef} className="mt-0 w-3/4 h-[calc(100vh-56px)] snap-start relative flex items-center justify-center">
      <div className="relative w-full h-full rounded-lg overflow-hidden bg-black shadow-xl">
        <video
          ref={videoRef}
          poster={video.thumbnailUrl ? `${prefix}/${video.thumbnailUrl}/thumbnail.jpg` : ''}
          className="w-full h-full object-contain"
          playsInline
          muted={muted}
          controls={false}
          loop
        />

        {!isReady && (
          <div className="absolute text-white">Loading...</div>
        )}
      </div>

      <div className="absolute right-4 top-[65%] transform -translate-y-1/2 flex flex-col items-center gap-3 z-50 pointer-events-auto">
        <div className="flex flex-col items-center">
          <button onClick={(e) => { e.stopPropagation(); setLiked((s) => !s); }} 
            className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-blue-100 shadow-lg">
            <Heart size={24} strokeWidth={2} className={`${liked ? 'text-red-500' : 'text-blue-100'}`} />
          </button>
          <div className="text-xs text-blue-100 font-semibold">{video.likes || 0}</div>
        </div>

        <div className="flex flex-col items-center">
          <button onClick={(e) => e.stopPropagation()} className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-blue-100 shadow-lg">
            <MessageSquareText size={24} strokeWidth={2} className="text-blue-100" />
          </button>
          <div className="text-xs text-blue-100 font-semibold">{video.comments || 0}</div>
        </div>

        <div className="flex flex-col items-center">
          <button onClick={(e) => e.stopPropagation()} className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-blue-100 shadow-lg">
            <Share2 size={24} strokeWidth={2} className="text-blue-100" />
          </button>
          <div className="text-xs text-blue-100 font-semibold">Share</div>
        </div>

        <div className="flex flex-col items-center">
          <button onClick={(e) => e.stopPropagation()} className="w-12 h-12 border-none rounded-full bg-black/50 flex items-center justify-center text-blue-100 shadow-lg">
            <MoreHorizontal size={24} strokeWidth={2} className="text-blue-100" />
          </button>
        </div>

        <div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400 bg-black flex items-center justify-center animate-spin" style={{ animationDuration: '6s' }}>
            <img 
                src={video.thumbnailUrl ? `${prefix}/${video.thumbnailUrl}/thumbnail.jpg` : 'https://tinyurl.com/277pc7ru'} 
                alt="music" 
                className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {!isReady ? null : (
        <div onClick={toggleSound} className="absolute inset-0 flex items-end justify-center pointer-events-auto">
          {muted ? (
            <div className="mb-auto mt-2 px-2 py-2 bg-white/30 text-blue-100 rounded-full cursor-pointer"><HeadphoneOff size={18} strokeWidth={2.5}/></div>
          ) : (
            <div className="mb-auto mt-2 px-2 py-2 bg-white/30 text-blue-100 rounded-full cursor-pointer"><Music2 size={18} strokeWidth={2.5}/></div>
          )}
        </div>
      )}

      <div className="absolute left-2 bottom-6 z-40 text-blue-200 max-w-fit">
        <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <img 
                src={video.uploader?.avatarUrl || video.userId?.avatarUrl || 'https://tinyurl.com/277pc7ru'} 
                alt="uploader"
                className="w-9 h-9 rounded-full object-cover" />
              <div className="flex flex-row items-center gap-2">
              <div className="font-semibold text-md tracking-tight">{formatOut(video.uploader?.name || video.userId?.name || 'Unknown', 21)}</div>
              <button onClick={handleToggleSubscribe} className={`text-sm px-2 py-1 rounded-full font-semibold ${subscribed ? 'bg-gray-200 text-blue-500' : 'bg-neutral-900 text-red-400'}`}>{subscribed ? 'Subscribed' : 'Subscribe'}</button>
            </div>
          </div>

          <div className="mt-2">
            <div className="font-medium text-md line-clamp-2">{formatOut(video.title, 31) || 'Untitled'}</div>
            {video.description && <div className="text-sm text-gray-300 mt-1 line-clamp-2">{formatOut(video.description,31)}</div>}
            {video.music && <div className="text-xs text-white/60 mt-2">♪ {video.music}</div>}
          </div>
        </div>
      </div>

      <div className="absolute left-4 right-4 bottom-2 z-50">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-red-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default ShortPlayer;
