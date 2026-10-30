"use client";

import { useEffect, useRef, useState } from "react";
import type { Scripture } from "@/data/collections";
import Icon from "./Icon";

export default function ScriptureAudio({
  current,
  scriptures,
  resetKey,
  onAdvance,
  onSelectRange,
}: {
  current: Scripture;
  scriptures: Scripture[];
  resetKey: number;
  onAdvance: (id: number) => void;
  onSelectRange: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playRequest = useRef(0);
  const continuousRef = useRef(false);
  const [continuous, setContinuous] = useState(false);
  const [notice, setNotice] = useState("");
  const playable = scriptures.filter((scripture) => scripture.audio);

  const stop = () => {
    continuousRef.current = false;
    setContinuous(false);
    playRequest.current += 1;
    audioRef.current?.pause();
  };

  // Reuse one media element across automatic advances to preserve the
  // playback permission granted by the user's initial tap on mobile.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || audio.getAttribute("src") === current.audio) return;
    playRequest.current += 1;
    audio.pause();
    if (current.audio) audio.src = current.audio;
    else audio.removeAttribute("src");
    audio.load();
    setNotice("");
  }, [current.id, current.audio]);

  // Manual navigation, range changes and reading-mode changes end the session.
  useEffect(() => {
    continuousRef.current = false;
    setContinuous(false);
    setNotice("");
    const audio = audioRef.current;
    audio?.pause();
    return () => {
      continuousRef.current = false;
      playRequest.current += 1;
      audio?.pause();
    };
  }, [resetKey]);

  const play = (audio: HTMLAudioElement) => {
    const request = ++playRequest.current;
    setNotice("");
    void audio.play().catch((error: unknown) => {
      if (request !== playRequest.current) return;
      if (
        error instanceof DOMException &&
        error.name === "AbortError" &&
        audio.paused
      )
        return;
      stop();
      setNotice("播放未能開始，請按播放器的播放鍵再試一次。");
    });
  };

  const advance = () => {
    const audio = audioRef.current;
    if (!audio || !continuousRef.current || !playable.length) return;
    const index = playable.findIndex((scripture) => scripture.id === current.id);
    const next = playable[(index + 1) % playable.length];
    if (!next.audio) return;
    if (audio.getAttribute("src") !== next.audio) audio.src = next.audio;
    else audio.currentTime = 0;
    // Start the next source directly from the media event, before updating
    // the card, so React does not interrupt an active playback transition.
    play(audio);
    onAdvance(next.id);
  };

  return (
    <section className="audio-section" aria-label="經文朗讀播放器">
      <div className="audio-heading">
        <div className="audio-label">
          <Icon name="volume" width="18" height="18" />
          <span>聆聽經文</span>
        </div>
        <button className="text-button" onClick={onSelectRange}>
          挑選播放範圍
          <Icon name="settings" width="16" height="16" />
        </button>
      </div>
      <audio
        ref={audioRef}
        controls
        preload="none"
        aria-label="經文中文朗讀"
        onEnded={advance}
        onPlay={() => setNotice("")}
        onError={() => {
          if (!audioRef.current?.error) return;
          stop();
          setNotice("暫時無法載入朗讀音訊，已停止連續播放。請稍後再試。");
        }}
      />
      <div className="audio-playback-options">
        <button
          className="audio-continuous-button"
          aria-pressed={continuous}
          disabled={!current.audio}
          onClick={() => {
            if (continuousRef.current) {
              stop();
              return;
            }
            const audio = audioRef.current;
            if (!audio || !current.audio) return;
            continuousRef.current = true;
            setContinuous(true);
            if (audio.error) audio.load();
            play(audio);
          }}
        >
          {continuous && <Icon name="check" width="16" height="16" />}
          {continuous ? "停止連續播放" : "開始連續播放"}
        </button>
        <p className="audio-playback-hint">
          {playable.length === 1
            ? "重複播放所選的這一節經文。"
            : `依序循環播放範圍內的 ${playable.length} 節經文。`}
          {playable.length < scriptures.length && "略過沒有音訊的經文。"}
        </p>
      </div>
      {!current.audio && (
        <p className="audio-notice">這張經文卡尚未提供朗讀音訊。</p>
      )}
      {notice && (
        <p className="audio-notice" role="status">
          {notice}
        </p>
      )}
    </section>
  );
}
