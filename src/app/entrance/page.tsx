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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("versionType");
      const studentSelected = localStorage.getItem(
        "student_selectedScriptures"
      );
      if (studentSelected)
        setStudentProgress({
          selected: JSON.parse(studentSelected).length,
          total: 32,
        });
      const leaderSelected = localStorage.getItem("leader_selectedScriptures");
      if (leaderSelected)
        setLeaderProgress({
          selected: JSON.parse(leaderSelected).length,
          total: 29,
        });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-mobile-bg lg:bg-desktop-bg bg-cover bg-left-bottom lg:bg-center">
      <div className="text-center mb-12">
        <h1
          className="text-5xl font-serif font-black text-slate-900 mb-4"
          style={{
            textShadow:
              "0 0 4px white, 0 0 8px white, 0 0 12px white, 1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white",
          }}
        >
          勇士班經文
        </h1>
        <p
          className="text-lg text-slate-700"
          style={{
            textShadow:
              "0 0 4px white, 0 0 8px white, 1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white",
          }}
        >
          請選擇您的版本
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full px-6">
        {/* 學員版：深色半透卡 + 左側綠色彩條 */}
        <Link href="/student">
          <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-200 cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-400" />
            <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/60 p-6 md:p-8 rounded-xl text-white pl-8 md:pl-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-emerald-600/15 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">學員版</h3>
                  <p className="text-sm text-emerald-200/80">基礎經文學習</p>
                </div>
              </div>

              <div className="mt-6 bg-white/5 rounded-md p-3">
                <div className="flex items-center justify-between text-sm text-emerald-200">
                  <div>進度</div>
                  <div className="font-medium">
                    {studentProgress.selected}/{studentProgress.total}
                  </div>
                </div>
                {studentProgress.selected > 0 && (
                  <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (studentProgress.selected / studentProgress.total) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* 領袖版：深色半透卡 + 左側藍色彩條 */}
        <Link href="/leader">
          <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-200 cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
            <div className="bg-gradient-to-b from-slate-900/60 to-slate-800/60 p-6 md:p-8 rounded-xl text-white pl-8 md:pl-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-blue-600/15 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M12 2l9 6-9 6-9-6 9-6z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">領袖版</h3>
                  <p className="text-sm text-blue-200/80">進階經文指導</p>
                </div>
              </div>

              <div className="mt-6 bg-white/5 rounded-md p-3">
                <div className="flex items-center justify-between text-sm text-blue-200">
                  <div>進度</div>
                  <div className="font-medium">
                    {leaderProgress.selected}/{leaderProgress.total}
                  </div>
                </div>
                {leaderProgress.selected > 0 && (
                  <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (leaderProgress.selected / leaderProgress.total) * 100
                        }%`,
                      }}
                    />
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
