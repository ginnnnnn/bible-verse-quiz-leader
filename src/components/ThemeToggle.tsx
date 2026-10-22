"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { readStored, writeStored } from "@/lib/reading-storage";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const system = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const saved = readStored<unknown>("scripture_theme", null);
      const next = saved === "dark" || (saved !== "light" && system.matches);
      applyTheme(next);
      setDark(next);
    };
    const storage = (event: StorageEvent) => {
      if (event.key === "scripture_theme" || event.key === null) sync();
    };
    sync();
    system.addEventListener("change", sync);
    window.addEventListener("storage", storage);
    return () => {
      system.removeEventListener("change", sync);
      window.removeEventListener("storage", storage);
    };
  }, []);

  return (
    <button
      className="theme-toggle"
      aria-label="深色主題"
      aria-pressed={dark}
      title={dark ? "切換淺色主題" : "切換深色主題"}
      onClick={() => {
        const next = !dark;
        writeStored("scripture_theme", next ? "dark" : "light");
        applyTheme(next);
        setDark(next);
      }}
    >
      <span className="theme-moon">
        <Icon name="moon" />
      </span>
      <span className="theme-sun">
        <Icon name="sun" />
      </span>
      <span className="theme-toggle-label">{dark ? "淺色" : "深色"}</span>
    </button>
  );
}

function applyTheme(dark: boolean) {
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", dark ? "#111613" : "#f8f7f3");
  });
}
