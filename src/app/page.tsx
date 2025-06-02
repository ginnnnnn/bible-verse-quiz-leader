// pages/index.tsx
import Link from "next/link";

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-4xl px-3 py-1 bg-opacity-70 font-serif font-black">
      經文背誦測驗
    </h1>
    <h1 className="text-4xl px-3 py-1 bg-opacity-70 font-serif font-black">
      領袖版
    </h1>
    <Link href="/quiz">
      <button className="mt-8 bg-blue-500 text-white px-4 py-2 rounded">
        開始測驗
      </button>
    </Link>
  </div>
);

export default Home;
