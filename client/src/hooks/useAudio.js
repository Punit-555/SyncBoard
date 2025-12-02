import { useRef, useCallback } from 'react';

const useAudio = () => {
  const audioRefs = useRef({
    send: null,
    receive: null,
  });

  // Initialize audio elements
  const initAudio = useCallback(() => {
    if (!audioRefs.current.send) {
      const sendAudio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAAA=');
      sendAudio.volume = 0.5;
      audioRefs.current.send = sendAudio;
    }
    if (!audioRefs.current.receive) {
      const receiveAudio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAAA=');
      receiveAudio.volume = 0.6;
      audioRefs.current.receive = receiveAudio;
    }
  }, []);

  const playSendSound = useCallback(() => {
    initAudio();
    try {
      const audio = audioRefs.current.send;
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Send sound play failed:', error);
        });
      }
    } catch (error) {
      console.log('Send sound error:', error);
    }
  }, [initAudio]);

  const playReceiveSound = useCallback(() => {
    initAudio();
    try {
      const audio = audioRefs.current.receive;
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Receive sound play failed:', error);
        });
      }
    } catch (error) {
      console.log('Receive sound error:', error);
    }
  }, [initAudio]);

  return { playSendSound, playReceiveSound };
};

export default useAudio;
