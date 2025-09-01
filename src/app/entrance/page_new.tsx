"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const Entrance = () => {
  const [studentProgress, setStudentProgress] = useState({
    selected: 0,
    total: 32,
  });
  const [leaderProgress, setLeaderProgress] = useState({
    selected: 0,
    total: 29,
  });

  // 清除版本選擇，讓用戶重新選擇，並載入進度
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("versionType");

      // 載入學員版進度
      const studentSelected = localStorage.getItem(
        "student_selectedScriptures"
      );
      if (studentSelected) {
        const selectedCount = JSON.parse(studentSelected).length;
        setStudentProgress({ selected: selectedCount, total: 32 });
      }

      // 載入領袖版進度
      const leaderSelected = localStorage.getItem("leader_selectedScriptures");
      if (leaderSelected) {
        const selectedCount = JSON.parse(leaderSelected).length;
        setLeaderProgress({ selected: selectedCount, total: 29 });
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-mobile-bg lg:bg-desktop-bg bg-cover bg-left-bottom lg:bg-center">
      <div className="text-center mb-12">
        <h1
          className="text-5xl font-serif font-black text-black mb-4"
          style={{
            textShadow:
              "0 0 4px white, 0 0 8px white, 0 0 12px white, 1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white",
          }}
        >
          勇士班經文
        </h1>
        <p
          className="text-xl text-black"
          style={{
            textShadow:
              "0 0 4px white, 0 0 8px white, 1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white",
          }}
        >
          請選擇您的版本
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full px-6">
        {/* 學員版 */}
        <Link href="/student">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-emerald-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">學員版</h2>
              <p className="text-gray-600 text-sm mb-4">基礎經文學習</p>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-700 mb-2">
                  進度 {studentProgress.selected}/{studentProgress.total}
                </div>
                {studentProgress.selected > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (studentProgress.selected / studentProgress.total) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* 領袖版 */}
        <Link href="/leader">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2Z" />
                  <path d="M3.09 15.74L12 22L20.91 15.74" />
                  <path d="M3.09 12L12 18.26L20.91 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">領袖版</h2>
              <p className="text-gray-600 text-sm mb-4">進階經文指導</p>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-700 mb-2">
                  進度 {leaderProgress.selected}/{leaderProgress.total}
                </div>
                {leaderProgress.selected > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (leaderProgress.selected / leaderProgress.total) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Entrance;
