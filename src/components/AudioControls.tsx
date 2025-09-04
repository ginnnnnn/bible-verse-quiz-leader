"use client";
import { useState, useEffect, useRef } from "react";
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  ForwardIcon,
} from "@heroicons/react/24/solid";

interface Scripture {
  id: number;
  verse: { en: string; zh: string };
  reference: { en: string; zh: string };
  audio?: { zh: string; en: string };
}

interface AudioControlsProps {
  scriptures: Scripture[];
  currentIndex: number;
  isEnglish: boolean;
  onIndexChange: (index: number) => void;
}

export const AudioControls = ({
  scriptures,
  currentIndex,
  isEnglish,
  onIndexChange,
}: AudioControlsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isContinuous, setIsContinuous] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentScripture = scriptures[currentIndex];
  const audioUrl = currentScripture?.audio?.zh;

  useEffect(() => {
    const playAudio = () => {
      if (audioUrl) {
        if (!audioRef.current || audioRef.current.src !== audioUrl) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          audioRef.current = new Audio(audioUrl);
        }

        const audio = audioRef.current;
        audio.play().catch(() => {
          setErrorMessage("音訊播放失敗");
          setIsPlaying(false);
        });

        audio.onended = () => {
          if (isRepeat) {
            audio.currentTime = 0;
            audio.play();
          } else if (isContinuous) {
            const nextIndex = (currentIndex + 1) % scriptures.length;
            onIndexChange(nextIndex);
          } else {
            setIsPlaying(false);
          }
        };

        audio.onerror = () => {
          setErrorMessage("音訊載入失敗");
          setIsPlaying(false);
        };
      }
    };

    if (isPlaying) {
      playAudio();
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [
    isPlaying,
    currentIndex,
    audioUrl,
    isRepeat,
    isContinuous,
    onIndexChange,
    scriptures.length,
  ]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayClick = () => {
    if (!audioUrl) {
      setErrorMessage("此經文沒有音訊檔案");
      return;
    }
    setErrorMessage(null);
    setIsPlaying(!isPlaying);
  };

  const toggleRepeat = () => {
    const newRepeat = !isRepeat;
    setIsRepeat(newRepeat);
    if (newRepeat) {
      setIsContinuous(false);
    }
  };

  const toggleContinuous = () => {
    const newContinuous = !isContinuous;
    setIsContinuous(newContinuous);
    if (newContinuous) {
      setIsRepeat(false);
    }
  };

  if (isEnglish || !audioUrl) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col items-center gap-3">
      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
      <div className="flex items-center gap-4 bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-lg">
        <button
          onClick={handlePlayClick}
          className="w-14 h-14 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 flex items-center justify-center shadow-md"
        >
          {isPlaying ? (
            <PauseIcon className="h-8 w-8" />
          ) : (
            <PlayIcon className="h-8 w-8" />
          )}
        </button>
        <button
          onClick={toggleRepeat}
          className={`p-3 rounded-full transition-colors duration-300 ${
            isRepeat ? "bg-blue-100" : "bg-transparent hover:bg-gray-200"
          }`}
        >
          <ArrowPathIcon
            className={`h-7 w-7 ${isRepeat ? "text-blue-600" : "text-white"}`}
          />
        </button>
        <button
          onClick={toggleContinuous}
          className={`p-3 rounded-full transition-colors duration-300 ${
            isContinuous ? "bg-blue-100" : "bg-transparent hover:bg-gray-200"
          }`}
        >
          <ForwardIcon
            className={`h-7 w-7 ${
              isContinuous ? "text-blue-600" : "text-white"
            }`}
          />
        </button>
      </div>
    </div>
  );
};
