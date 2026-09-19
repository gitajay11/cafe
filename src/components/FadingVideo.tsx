import { useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type SyntheticEvent,
} from "react";
import { cn } from "../lib/media";

interface FadingVideoProps
  extends Omit<ComponentPropsWithoutRef<"video">, "src" | "autoPlay" | "muted" | "loop" | "playsInline"> {
  /** One clip, or a playlist that advances on `ended`. */
  src: string | string[];
  /** Fade duration in ms (applied to both the fade-in and the fade-out). */
  fadeDuration?: number;
  /** Pause playback while the element is off-screen. */
  pauseWhenHidden?: boolean;
}

/**
 * Muted, autoplaying background video that:
 *  - starts invisible and fades in after `loadeddata`
 *  - fades out shortly before the end and restarts (or advances) cleanly
 *  - pauses when scrolled out of view
 *  - renders only the poster when the user prefers reduced motion
 */
export function FadingVideo({
  src,
  poster,
  fadeDuration = 1200,
  pauseWhenHidden = true,
  preload = "auto",
  className,
  style,
  ...rest
}: FadingVideoProps) {
  const reduce = useReducedMotion();
  const sources = useMemo(() => (Array.isArray(src) ? src : [src]), [src]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const fadingOut = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = sources[index % sources.length];

  const tryPlay = useCallback((video: HTMLVideoElement) => {
    video.muted = true;
    video.defaultMuted = true;
    void video.play().catch(() => {
      /* Autoplay can be refused (data saver etc.) — the poster stays. */
    });
  }, []);

  const handleLoadedData = (event: SyntheticEvent<HTMLVideoElement>) => {
    fadingOut.current = false;
    setVisible(true);
    tryPlay(event.currentTarget);
  };

  const handleTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (fadingOut.current || !Number.isFinite(video.duration)) return;
    if (video.duration - video.currentTime <= fadeDuration / 1000) {
      fadingOut.current = true;
      setVisible(false);
    }
  };

  const handleEnded = (event: SyntheticEvent<HTMLVideoElement>) => {
    if (sources.length > 1) {
      setVisible(false);
      setIndex((i) => i + 1);
      return;
    }
    const video = event.currentTarget;
    video.currentTime = 0;
    fadingOut.current = false;
    setVisible(true);
    tryPlay(video);
  };

  // Pause when off-screen; resume when back.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !pauseWhenHidden || reduce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay(video);
        else video.pause();
      },
      { threshold: 0.05 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [pauseWhenHidden, reduce, tryPlay, current]);

  if (reduce) {
    return poster ? (
      <img src={poster} alt="" aria-hidden="true" className={className} style={style} />
    ) : null;
  }

  return (
    <video
      key={current}
      ref={videoRef}
      src={current}
      poster={poster}
      muted
      autoPlay
      playsInline
      preload={preload}
      disablePictureInPicture
      onLoadedData={handleLoadedData}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      className={cn("transition-opacity ease-out", className)}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transitionDuration: `${fadeDuration}ms`,
      }}
      {...rest}
    />
  );
}
