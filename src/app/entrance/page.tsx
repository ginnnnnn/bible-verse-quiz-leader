"use client";
import Link from "next/link";
import { useEffect } from "react";

const Entrance = () => {
  // 清除版本選擇，讓用戶重新選擇
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("versionType");
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
          經文背誦測驗
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl w-full px-4">
        {/* 學員版 */}
        <Link href="/student">
          <div className="bg-green-300 bg-opacity-90 rounded-lg shadow-lg p-8 hover:shadow-xl hover:bg-opacity-100 transition-all cursor-pointer border-2 border-green-200 hover:border-green-400">
            <div className="text-center">
              <div className="text-4xl mb-4">📖</div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">學員版</h2>
            </div>
          </div>
        </Link>

        {/* 領袖版 */}
        <Link href="/leader">
          <div className="bg-blue-300 bg-opacity-90 rounded-lg shadow-lg p-8 hover:shadow-xl hover:bg-opacity-100 transition-all cursor-pointer border-2 border-blue-200 hover:border-blue-400">
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-blue-600 mb-4">領袖版</h2>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Entrance;
