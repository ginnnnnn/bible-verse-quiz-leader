"use client";
import { useState } from "react";

interface Scripture {
  id: number;
  verse: {
    en: string;
    zh: string;
  };
  reference: {
    en: string;
    zh: string;
  };
  audio?: {
    zh: string;
    en: string;
  };
}

interface ScriptureJumpPopupProps {
  scriptures: Scripture[];
  currentIndex: number;
  isEnglish: boolean;
  onJump: (index: number) => void;
  onAudioStop?: () => void; // 可選的音訊停止函數
}

const ScriptureJumpPopup = ({
  scriptures,
  currentIndex,
  isEnglish,
  onJump,
  onAudioStop,
}: ScriptureJumpPopupProps) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleJump = (index: number) => {
    if (onAudioStop) {
      onAudioStop(); // 停止音訊（如果有的話）
    }
    onJump(index);
    setShowPopup(false);
  };

  return (
    <>
      {/* 跳轉按鈕 */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => setShowPopup(true)}
      >
        {isEnglish ? "Jump" : "跳轉"}
      </button>

      {/* 跳轉彈窗 */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-96 flex flex-col relative">
            {/* 固定的標題區域 */}
            <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-200">
              {/* 右上角關閉按鈕 */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>

              <h3 className="text-lg font-bold text-center text-black pr-8">
                {isEnglish ? "Jump to Scripture" : "跳轉到經文"}
              </h3>
            </div>

            {/* 可滾動的經文列表區域 */}
            <div className="flex-1 overflow-y-auto p-6 pt-4">
              <div className="space-y-2">
                {scriptures.map((scripture, index) => (
                  <button
                    key={scripture.id}
                    onClick={() => handleJump(index)}
                    className={`w-full text-left p-3 rounded hover:bg-gray-100 transition-colors ${
                      index === currentIndex
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="text-sm font-semibold text-gray-800">
                      {index + 1}.{" "}
                      {isEnglish
                        ? scripture.reference.en
                        : scripture.reference.zh}
                    </div>
                    <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {isEnglish ? scripture.verse.en : scripture.verse.zh}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScriptureJumpPopup;
