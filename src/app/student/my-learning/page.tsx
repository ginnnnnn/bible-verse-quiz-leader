"use client";
import { useState, useEffect } from "react";
import studentScriptures from "@/data/studentScriptures.json";
import BackToRoot from "@/components/backToRoot";
import ScriptureJumpPopup from "@/components/ScriptureJumpPopup";
import { AudioControls } from "@/components/AudioControls";

const StudentLearning = () => {
  const [selectedScriptures, setSelectedScriptures] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEnglish, setIsEnglish] = useState(false); // 用來切換語言

  // 從 localStorage 載入已選擇的經文
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("student_selectedScriptures");
      if (saved) {
        setSelectedScriptures(JSON.parse(saved));
      }
    }
  }, []);

  // 獲取當前顯示的經文數組
  const displayScriptures =
    selectedScriptures.length > 0
      ? studentScriptures.filter((s) => selectedScriptures.includes(s.id))
      : studentScriptures;

  const currentScripture = displayScriptures[currentIndex];

  // 上一個經文
  const previousScripture = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? displayScriptures.length - 1 : prev - 1
    );
  };

  // 下一個經文
  const nextScripture = () => {
    setCurrentIndex((prev) =>
      prev === displayScriptures.length - 1 ? 0 : prev + 1
    );
  };

  // 跳轉到指定經節
  const jumpToScripture = (index: number) => {
    setCurrentIndex(index);
  };

  if (displayScriptures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold px-3 py-1 bg-white rounded">
            請先選擇要學習的經文
          </h2>
          <BackToRoot />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5">
      {/* 切換語言按鈕 */}
      <div className="flex gap-1">
        <button
          className={
            "mb-4 bg-blue-500 text-white px-2 py-1 rounded text-sm w-[45px] " +
            (isEnglish ? " opacity-50" : "")
          }
          onClick={() => setIsEnglish(false)}
        >
          中文
        </button>

        <button
          className={
            "mb-4 bg-blue-600 text-white px-2 py-1 rounded text-sm w-[45px] " +
            (!isEnglish ? " opacity-50" : "")
          }
          onClick={() => setIsEnglish(true)}
        >
          EN
        </button>
      </div>

      {/* 經文出處 */}
      <div className="px-4 py-2 rounded bg-opacity-90 custom-text-shadow">
        <h2 className="text-2xl font-bold custom-text-shadow text-center">
          {isEnglish ? "Scripture Learning" : "經文學習"}
        </h2>
        <p className="mt-4 text-lg lg:text-xl text-center font-black custom-text-shadow font-serif">
          {isEnglish
            ? currentScripture.reference.en
            : currentScripture.reference.zh}
        </p>
      </div>

      {/* 經文內容 */}
      <div className="mt-4 text-base font-bold font-serif max-w-2xl">
        <div className="font-serif">
          <p className="p-1 px-2 rounded font-serif custom-text-shadow text-center">
            {isEnglish ? currentScripture.verse.en : currentScripture.verse.zh}
          </p>
        </div>
      </div>

      {/* 音訊播放控制 */}
      <AudioControls
        scriptures={displayScriptures}
        currentIndex={currentIndex}
        isEnglish={isEnglish}
        onIndexChange={setCurrentIndex}
      />

      {/* 導航按鈕 */}
      <div className="flex gap-4 mt-8">
        <button
          className={`bg-gray-500 text-white px-4 py-2 rounded ${
            currentIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-600"
          }`}
          onClick={previousScripture}
          disabled={currentIndex === 0}
        >
          {isEnglish ? "Previous" : "上一個"}
        </button>

        <ScriptureJumpPopup
          scriptures={displayScriptures}
          currentIndex={currentIndex}
          isEnglish={isEnglish}
          onJump={jumpToScripture}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={nextScripture}
        >
          {isEnglish ? "Next" : "下一個"}
        </button>
      </div>

      {/* 進度顯示 */}
      <div className="mt-4 text-sm text-gray-600 lg:text-white">
        {currentIndex + 1} / {displayScriptures.length}
      </div>
    </div>
  );
};

export default StudentLearning;
