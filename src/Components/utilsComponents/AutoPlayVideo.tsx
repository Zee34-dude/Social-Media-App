import { useEffect, useRef } from 'react';



// Main component
const AutoPlayVideo = ({ src,className }: any) => {
  // Reference to the <video> element in the DOM
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Store observer reference so we can clean it up later
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    // Create an IntersectionObserver to detect if the video is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          //  Play video when 60% or more is in view
          video?.play();
        } else {
          //  Pause and reset video when not visible
          video?.pause();
        }
      },
      { threshold: 0.6 } // 60% of video needs to be visible
    );

    // Start observing the video
    if (video) observer.observe(video);
    observerRef.current = observer;

    // Handle visibility changes (e.g., tab switch, minimize, return)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        //  When returning to tab, check if video is in view
        if (video) {
          const rect = video.getBoundingClientRect();
          const inView =
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth);

          if (inView) {
            video.play();
          }
        }
      } else {
        //  If tab is hidden or minimized, pause and reset
        video?.pause();
        if (video) video.currentTime = 0;
    
      }
    };

    // Handle navigation away from page (e.g., close tab or navigate)
    const handlePageHide = () => {
      video?.pause();
      if (video) video.currentTime = 0;
    };

    // Add browser-level event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('blur', handleVisibilityChange); // Also handle focus loss

    // Cleanup: remove observers and listeners when component unmounts
    return () => {
      if (video && observerRef.current) {
        observerRef.current.unobserve(video);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('blur', handleVisibilityChange);
    };
  }, []);

  // Return the video element with required settings
  return (
    <video
      ref={videoRef} // Connect ref to access DOM node
      src={src} // Video source URL
      playsInline //  Prevents full-screen playback on iOS
      preload="metadata" // Load just enough to get video duration
      autoPlay={true} // Tries to autoplay (won't work unless muted)
      className={className}
      controls
      muted
      style={{ height: '100%' }} // Ensure full height fill
    />
  );
};

export default AutoPlayVideo;
