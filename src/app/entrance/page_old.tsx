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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-6">
        {/* 學員版 */}
        <Link href="/student">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-emerald-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                  <path d="M2 17L12 22L22 17"/>
                  <path d="M2 12L12 17L22 12"/>
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
                          (studentProgress.selected / studentProgress.total) * 100
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
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-blue-400">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="relative p-8 text-center">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                �
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                領袖版
              </h2>
              <p className="text-blue-100 mb-4 text-lg">
                領導他人走向真理之路
              </p>
              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-white font-semibold text-lg">
                  學習進度: {leaderProgress.selected}/{leaderProgress.total}
                </div>
                {leaderProgress.selected > 0 && (
                  <div className="w-full bg-blue-200/30 rounded-full h-3 mt-2">
                    <div
                      className="bg-white h-3 rounded-full transition-all duration-500 shadow-sm"
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
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Entrance;
