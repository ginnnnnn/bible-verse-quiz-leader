// pages/index.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // 重定向到入口頁面
    router.push("/entrance");
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-serif font-black mb-4">經文背誦測驗</h1>
        <p className="text-gray-600">正在載入...</p>
      </div>
    </div>
  );
};

export default Home;
