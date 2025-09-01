"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const HomeIcon = () => {
  const [homePath, setHomePath] = useState("/entrance");
  const [showVersionSwitch, setShowVersionSwitch] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const versionType = localStorage.getItem("versionType");
      if (versionType === "student") {
        setHomePath("/student");
      } else if (versionType === "leader") {
        setHomePath("/leader");
      } else {
        setHomePath("/entrance");
      }

      // 只在版本首頁顯示切換版本按鈕
      setShowVersionSwitch(pathname === "/student" || pathname === "/leader");
    }
  }, [pathname]);

  // 在入口頁面和主頁面不顯示任何按鈕
  if (pathname === "/entrance" || pathname === "/") {
    return null;
  }

  // 判斷是否在版本首頁
  const isVersionHomePage = pathname === "/student" || pathname === "/leader";

  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      {/* 回到首頁按鈕 - 只在非版本首頁顯示 */}
      {!isVersionHomePage && (
        <Link
          href={homePath}
          className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          title="回到首頁"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-700"
          >
            <path
              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="9,22 9,12 15,12 15,22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}

      {/* 切換版本按鈕 - 只在版本首頁顯示 */}
      {showVersionSwitch && (
        <Link
          href="/entrance"
          className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          title="切換版本"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-700"
          >
            <path
              d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              x="8"
              y="2"
              width="8"
              height="4"
              rx="1"
              ry="1"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M9 14l2 2 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default HomeIcon;
