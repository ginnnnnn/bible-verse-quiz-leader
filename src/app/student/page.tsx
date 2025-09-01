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
        <h1 className="text-4xl px-3 py-1 font-serif font-black text-slate-900 custom-text-shadow">
          學員版
        </h1>
      </div>

      {/* 我的進度（compact） */}
      <div className="w-full max-w-xs mx-auto mt-3">
        <div
          className="relative rounded-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setShowScriptureSelector(true)}
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-400" />
          <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/60 p-2 rounded-md text-white pl-4">
            <div className="flex items-center justify-between text-sm text-emerald-200">
              <div>進度</div>
              <div className="font-medium">
                {selectedScriptures.length}/{studentScriptures.length}
              </div>
            </div>
            {selectedScriptures.length > 0 && (
              <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (selectedScriptures.length / studentScriptures.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-3xl px-4">
        {/* Card: 我要學習 */}
        <Link href="/student/my-learning">
          <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 duration-200 cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-400" />
            <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/60 p-5 rounded-xl text-white pl-8">
              <div className="text-xl font-semibold">我要學習</div>
              <div className="text-sm text-slate-300 mt-1">完整閱讀經文</div>
            </div>
          </div>
        </Link>

        {/* Card: 隨機測驗 */}
        <Link href="/quiz">
          <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 duration-200 cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
            <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/60 p-5 rounded-xl text-white pl-8">
              <div className="text-xl font-semibold">隨機測驗</div>
              <div className="text-sm text-slate-300 mt-1">混合題型練習</div>
            </div>
          </div>
        </Link>

        {/* Card: 經文測驗 */}
        <Link href="/list-type-1">
          <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 duration-200 cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400" />
            <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/60 p-5 rounded-xl text-white pl-8">
              <div className="text-xl font-semibold">經文測驗</div>
              <div className="text-sm text-slate-300 mt-1">背誦經文內容</div>
            </div>
          </div>
        </Link>

        {/* Card: 出處測驗 */}
        <Link href="/list-type-2">
          <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 duration-200 cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500" />
            <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/60 p-5 rounded-xl text-white pl-8">
              <div className="text-xl font-semibold">出處測驗</div>
              <div className="text-sm text-slate-300 mt-1">記憶經文出處</div>
            </div>
          </div>
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
