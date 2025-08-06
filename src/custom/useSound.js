// src/custom/useSound.js
export const useSound = (src) => {
  const play = () => {
    const audio = new Audio(src);
    audio.volume = 0.4;
    audio.play();
  };
  return play;
};
