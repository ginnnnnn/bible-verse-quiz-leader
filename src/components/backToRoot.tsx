"use client";
import Link from "next/link";
import { FunctionComponent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface BackToRootProps {}

const BackToRoot: FunctionComponent<BackToRootProps> = () => {
  const [homePath, setHomePath] = useState("/entrance");
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const versionType = localStorage.getItem("versionType");
      if (versionType === "student") {
        setHomePath("/student");
      } else if (versionType === "leader") {
        setHomePath("/leader");
      } else {
        // 如果沒有版本類型，默認回到入口頁面
        setHomePath("/entrance");
      }
    }
  }, []);

  // 如果當前已經在版本首頁，就不顯示這個按鈕
  if (pathname === "/leader" || pathname === "/student") {
    return null;
  }

  return (
    <Link
      href={homePath}
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      重新開始
    </Link>
  );
};

export default BackToRoot;
