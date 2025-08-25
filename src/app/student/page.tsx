"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import studentScriptures from "@/data/studentScriptures.json";
import ScriptureSelector from "@/components/ScriptureSelector";

const StudentHome = () => {
  const [showScriptureSelector, setShowScriptureSelector] = useState(false);
  const [selectedScriptures, setSelectedScriptures] = useState<number[]>([]);

  // 設定版本類型並從 localStorage 載入已選擇的經文
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("versionType", "student");
      const saved = localStorage.getItem("student_selectedScriptures");
      if (saved) {
        setSelectedScriptures(JSON.parse(saved));
      }
    }
  }, []);

  // 處理經文選擇儲存
  const handleSaveSelection = (selectedIds: number[]) => {
    setSelectedScriptures(selectedIds);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "student_selectedScriptures",
        JSON.stringify(selectedIds)
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl px-3 py-1 bg-opacity-70 font-serif font-black">
          經文背誦測驗
        </h1>
        <h2 className="text-3xl px-3 py-1 bg-opacity-70 font-serif font-black text-green-600">
          學員版
        </h2>
      </div>

      {/* 今日預備經文按鈕 */}
      <button
        onClick={() => setShowScriptureSelector(true)}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        今日預備經文 ({selectedScriptures.length}/{studentScriptures.length})
      </button>

      <div className="flex gap-1 mt-8">
        <Link href="/quiz">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            隨機測驗
          </button>
        </Link>
        <Link href="/list-type-1">
          <button className="bg-yellow-900 text-white px-4 py-2 rounded hover:bg-yellow-800">
            經文測驗
          </button>
        </Link>
        <Link href="/list-type-2">
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
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
        dataSource="student"
      />
    </div>
  );
};

export default StudentHome;
