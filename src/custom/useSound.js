// src/custom/useSound.js
export const useSound = (src) => {
  const play = () => {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play();
  };
  return play;
};
