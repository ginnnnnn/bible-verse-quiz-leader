"use client";
import { useState, useEffect } from "react";
import scriptures from "@/data/scriptures.json";
import studentScriptures from "@/data/studentScriptures.json";

interface ScriptureSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedIds: number[]) => void;
  initialSelected?: number[];
  dataSource?: "leader" | "student";
}

const ScriptureSelector = ({
  isOpen,
  onClose,
  onSave,
  initialSelected = [],
  dataSource = "leader",
}: ScriptureSelectorProps) => {
  const [selectedScriptures, setSelectedScriptures] =
    useState<number[]>(initialSelected);
  const [language, setLanguage] = useState<"zh" | "en">("zh");

  // 根據數據源選擇經文數據
  const currentScriptures =
    dataSource === "student" ? studentScriptures : scriptures;

  // 當 initialSelected 改變時更新本地狀態
  useEffect(() => {
    setSelectedScriptures(initialSelected);
  }, [initialSelected]);

  // 儲存選擇並關閉彈窗
  const saveSelection = () => {
    onSave(selectedScriptures);
    onClose();
  };

  // 切換經文選擇
  const toggleScripture = (id: number) => {
    setSelectedScriptures((prev) =>
      prev.includes(id)
        ? prev.filter((scriptureId) => scriptureId !== id)
        : [...prev, id]
    );
  };

  // 全選/全不選
  const selectAll = () => {
    if (selectedScriptures.length === currentScriptures.length) {
      setSelectedScriptures([]);
    } else {
      setSelectedScriptures(currentScriptures.map((s) => s.id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] w-full flex flex-col">
        {/* 固定的標題和按鈕區域 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {language === "zh"
                ? "選擇今日預備的經文"
                : "Select Today's Scripture"}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex rounded border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setLanguage("zh")}
                  className={`px-3 py-1 text-sm transition-colors ${
                    language === "zh"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 text-sm transition-colors ${
                    language === "en"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  EN
                </button>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {selectedScriptures.length === currentScriptures.length
                ? language === "zh"
                  ? "全不選"
                  : "Deselect All"
                : language === "zh"
                ? "全選"
                : "Select All"}
            </button>
            <button
              onClick={saveSelection}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {language === "zh"
                ? `確認選擇 (${selectedScriptures.length}/${currentScriptures.length})`
                : `Confirm Selection (${selectedScriptures.length}/${currentScriptures.length})`}
            </button>
          </div>
        </div>

        {/* 可捲動的經文列表區域 */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid gap-3">
            {currentScriptures.map((scripture) => (
              <div
                key={scripture.id}
                className={`border rounded p-3 cursor-pointer transition-colors select-none ${
                  selectedScriptures.includes(scripture.id)
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-50 border-gray-300 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedScriptures.includes(scripture.id)}
                    onChange={() => toggleScripture(scripture.id)}
                    className="mt-1 cursor-pointer"
                  />
                  <div
                    className="flex-1 cursor-pointer select-none"
                    onClick={() => toggleScripture(scripture.id)}
                  >
                    <div className="font-bold text-sm text-blue-600 mb-1 select-none custom-text-shadow">
                      {language === "zh"
                        ? scripture.reference.zh
                        : scripture.reference.en}
                    </div>
                    <div className="text-sm line-clamp-2 select-none custom-text-shadow">
                      {language === "zh"
                        ? scripture.verse.zh
                        : scripture.verse.en}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptureSelector;
