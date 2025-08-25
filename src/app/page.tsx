// pages/index.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import scriptures from "@/data/scriptures.json";
import ScriptureSelector from "@/components/ScriptureSelector";

const Home = () => {
  const [showScriptureSelector, setShowScriptureSelector] = useState(false);
  const [selectedScriptures, setSelectedScriptures] = useState<number[]>([]);

  // 從 localStorage 載入已選擇的經文
  useEffect(() => {
    const saved = localStorage.getItem("selectedScriptures");
    if (saved) {
      setSelectedScriptures(JSON.parse(saved));
    }
  }, []);

  // 處理經文選擇儲存
  const handleSaveSelection = (selectedIds: number[]) => {
    setSelectedScriptures(selectedIds);
    localStorage.setItem("selectedScriptures", JSON.stringify(selectedIds));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl px-3 py-1 bg-opacity-70 font-serif font-black">
        經文背誦測驗
      </h1>
      <h1 className="text-4xl px-3 py-1 bg-opacity-70 font-serif font-black">
        領袖版
      </h1>

      {/* 今日預備經文按鈕 */}
      <button
        onClick={() => setShowScriptureSelector(true)}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        今日預備經文 ({selectedScriptures.length}/{scriptures.length})
      </button>

      <div className="flex gap-1">
        <Link href="/quiz">
          <button className="mt-8 bg-blue-500 text-white px-4 py-2 rounded">
            隨機測驗
          </button>
        </Link>
        <Link href="/list-type-1">
          <button className="mt-8 bg-yellow-900 text-white px-4 py-2 rounded">
            經文測驗
          </button>
        </Link>
        <Link href="/list-type-2">
          <button className="mt-8 bg-red-500 text-white px-4 py-2 rounded">
            出處測驗
          </button>
        </Link>
      </div>

      {/* 經文選擇組件 */}
      <ScriptureSelector
        isOpen={showScriptureSelector}
        onClose={() => setShowScriptureSelector(false)}
        onSave={handleSaveSelection}
        initialSelected={selectedScriptures}
      />
    </div>
  );
};

export default Home;
