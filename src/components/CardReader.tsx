"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Collection, Scripture } from "@/data/collections";
import {
  readPosition,
  readSelection,
  readStored,
  writeStored,
} from "@/lib/reading-storage";
import ReadingDialog from "./ReadingDialog";
import Icon from "./Icon";

type FontSize = "standard" | "large" | "largest";
type Mode = "read" | "reference" | "verse" | "random";
const modes: { id: Mode; label: string }[] = [
  { id: "read", label: "完整閱讀" },
  { id: "reference", label: "隱藏出處" },
  { id: "verse", label: "隱藏經文" },
  { id: "random", label: "隨機隱藏" },
];
const normalize = (value: string) => value.toLowerCase().replace(/\s/g, "");
const matches = (s: Scripture, query: string) =>
  normalize(`${s.reference}${s.verse}`).includes(normalize(query));

function SelectionDialog({
  collection,
  initial,
  onSave,
  onClose,
}: {
  collection: Collection;
  initial: number[];
  onSave: (ids: number[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(initial);
  const [query, setQuery] = useState("");
  const filtered = collection.scriptures.filter((s) => matches(s, query));
  const toggle = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
    );
  return (
    <ReadingDialog
      title="挑選今天的經文"
      subtitle="勾選想專注的經文；未勾選時，會閱讀整個卡組。"
      onClose={onClose}
      footer={
        <>
          <span className="selection-summary">
            已選 {selected.length} / {collection.scriptures.length} 張
          </span>
          <button
            className="button button-primary"
            onClick={() => onSave(selected)}
          >
            套用閱讀範圍
            <Icon name="check" />
          </button>
        </>
      }
    >
      <label className="search-field">
        <Icon name="search" />
        <input
          placeholder="搜尋出處或經文內容"
          aria-label="搜尋要挑選的經文"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <div className="selection-actions">
        <button
          className="text-button"
          onClick={() => setSelected(collection.scriptures.map((s) => s.id))}
        >
          全部選取
        </button>
        <button className="text-button muted" onClick={() => setSelected([])}>
          清除選取
        </button>
      </div>
      <div className="selection-list">
        {filtered.map((s) => (
          <label
            className={`selection-item ${selected.includes(s.id) ? "is-selected" : ""}`}
            key={s.id}
          >
            <input
              type="checkbox"
              checked={selected.includes(s.id)}
              onChange={() => toggle(s.id)}
            />
            <span>
              <strong>
                {s.reference}
                {s.kind === "supplement" && (
                  <span className="supplement-badge">課程補充</span>
                )}
              </strong>
              <span>{s.verse}</span>
            </span>
          </label>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="empty-message">找不到符合的經文，試試其他關鍵字。</p>
      )}
    </ReadingDialog>
  );
}

export default function CardReader({ collection }: { collection: Collection }) {
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [currentId, setCurrentId] = useState(collection.scriptures[0]?.id);
  const [mode, setMode] = useState<Mode>("read");
  const [randomHidden, setRandomHidden] = useState<"verse" | "reference">(
    "verse",
  );
  const [revealed, setRevealed] = useState(false);
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<
    "selection" | "jump" | "preferences" | null
  >(null);
  const [notice, setNotice] = useState("");
  const [fontSize, setFontSize] = useState<FontSize>("standard");
  const cardRef = useRef<HTMLElement>(null);
  const previousCard = useRef(currentId);
  const restoredPosition = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const ids = readSelection(collection.id, collection.scriptures);
    const available = ids.length
      ? collection.scriptures.filter((s) => ids.includes(s.id))
      : collection.scriptures;
    const position = readPosition(`${collection.id}_readingPosition`);
    const savedMode = readStored<unknown>(
      `${collection.id}_readingMode`,
      "read",
    );
    const savedFont = readStored<unknown>("scripture_fontSize", "standard");
    setFontSize(
      savedFont === "large" || savedFont === "largest" ? savedFont : "standard",
    );
    setSelected(ids);
    setCurrentId(
      available.find((s) => s.id === position?.scriptureId)?.id ??
        available[0]?.id,
    );
    setMode(
      modes.some((m) => m.id === savedMode) ? (savedMode as Mode) : "read",
    );
    setReady(true);
  }, [collection]);

  const scriptures = selected.length
    ? collection.scriptures.filter((s) => selected.includes(s.id))
    : collection.scriptures;
  const index = Math.max(
    0,
    scriptures.findIndex((s) => s.id === currentId),
  );
  const current = scriptures[index];
  const filtered = scriptures.filter((s) => matches(s, query));
  const hidden = mode === "random" ? randomHidden : mode;
  const hasHidden = mode !== "read" && !revealed;

  useEffect(() => {
    if (!ready || !current) return;
    const position = { collectionId: collection.id, scriptureId: current.id };
    writeStored(`${collection.id}_readingPosition`, position);
    writeStored("scripture_lastRead", position);
  }, [ready, current, collection.id]);

  useEffect(() => {
    if (!ready) return;
    writeStored(`${collection.id}_readingMode`, mode);
    writeStored("scripture_fontSize", fontSize);
  }, [ready, mode, collection.id, fontSize]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, [currentId, mode]);

  const goTo = useCallback((id: number) => {
    audioRef.current?.pause();
    setCurrentId(id);
    setRevealed(false);
    setRandomHidden(Math.random() < 0.5 ? "verse" : "reference");
    setNotice("");
  }, []);

  useEffect(() => {
    if (!ready) return;
    const changed = previousCard.current !== currentId;
    previousCard.current = currentId;
    if (!restoredPosition.current) {
      restoredPosition.current = true;
      return;
    }
    if (!ready || !changed || !window.matchMedia("(max-width: 800px)").matches)
      return;
    const frame = window.requestAnimationFrame(() =>
      cardRef.current?.scrollIntoView({ block: "start", behavior: "auto" }),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [currentId, ready]);

  const randomCard = () => {
    const others = scriptures.filter(
      (scripture) => scripture.id !== current.id,
    );
    if (others.length)
      goTo(others[Math.floor(Math.random() * others.length)].id);
  };

  const move = useCallback(
    (direction: number) => {
      const next = scriptures[index + direction];
      if (next) goTo(next.id);
    },
    [scriptures, index, goTo],
  );

  useEffect(() => {
    if (!ready || dialog) return;
    const onKey = (event: KeyboardEvent) => {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        (event.target instanceof HTMLElement &&
          event.target.closest(
            "input, textarea, select, button, a, audio, [contenteditable]",
          ))
      )
        return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
      if (event.code === "Space" && mode !== "read") {
        event.preventDefault();
        setRevealed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, dialog, move, mode]);

  const changeMode = (value: Mode) => {
    audioRef.current?.pause();
    setMode(value);
    setRevealed(false);
    setRandomHidden(Math.random() < 0.5 ? "verse" : "reference");
    setNotice("");
  };

  const jump = (id: number) => {
    goTo(id);
    setDialog(null);
  };
  const saveSelection = (ids: number[]) => {
    setSelected(ids);
    writeStored(`${collection.id}_selectedScriptures`, ids);
    const available = ids.length
      ? collection.scriptures.filter((s) => ids.includes(s.id))
      : collection.scriptures;
    goTo(available.find((s) => s.id === currentId)?.id ?? available[0].id);
    setDialog(null);
  };

  const list = (isDialog: boolean) => (
    <>
      <label className="search-field">
        <Icon name="search" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜尋經文或出處"
          aria-label="搜尋經文或出處"
        />
      </label>
      <div className="catalogue-list">
        {filtered.map((s) => (
          <button
            key={s.id}
            className={`catalogue-item ${s.id === current?.id ? "is-current" : ""}`}
            onClick={() => (isDialog ? jump(s.id) : goTo(s.id))}
            aria-current={s.id === current?.id ? "true" : undefined}
          >
            <span className="catalogue-number">
              {String(
                collection.scriptures.findIndex((item) => item.id === s.id) + 1,
              ).padStart(2, "0")}
            </span>
            <span>
              {!isDialog &&
              s.id === current?.id &&
              hasHidden &&
              hidden === "reference"
                ? "出處已隱藏"
                : s.reference}
            </span>
            {s.id === current?.id && <span className="current-dot" />}
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-message">
          找不到符合的經文。
          <button className="text-button" onClick={() => setQuery("")}>
            清除搜尋
          </button>
        </div>
      )}
    </>
  );

  if (!ready || !current)
    return (
      <main id="main-content" className="reader-loading" aria-busy="true">
        <Icon name="book" width="32" height="32" />
        <p>正在打開經文卡…</p>
      </main>
    );

  return (
    <main
      id="main-content"
      className={`reader-main ${collection.color} reader-font-${fontSize}`}
    >
      <div className="reader-breadcrumb">
        <Link href="/">經文卡收藏</Link>
        <Icon name="right" width="14" height="14" />
        <span>{collection.title}</span>
      </div>
      <div className="reader-title-row">
        <div>
          <div className="eyebrow">{collection.subtitle}</div>
          <h1>
            {collection.title}
            <span className="reader-title-light">經文卡</span>
          </h1>
          <p>{collection.introduction}</p>
        </div>
      </div>

      <div className="reader-workspace">
        <aside className="reader-sidebar" aria-label="經文目錄">
          <div className="sidebar-heading">
            <h2>經文目錄</h2>
            <span>{scriptures.length} 張</span>
          </div>
          {list(false)}
          <button
            className="sidebar-select"
            onClick={() => setDialog("selection")}
          >
            <Icon name="settings" />
            <span>挑選閱讀範圍</span>
            <Icon name="right" width="16" height="16" />
          </button>
        </aside>

        <section className="reader-stage" aria-label="經文卡閱讀區">
          <div className="reading-toolbar">
            <div
              className="mode-switch"
              role="group"
              aria-label="經文卡顯示模式"
            >
              {modes.map((m) => (
                <button
                  key={m.id}
                  aria-pressed={mode === m.id}
                  onClick={() => changeMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="reading-scope">
            <span>
              <span className="scope-dot" />
              {selected.length
                ? `自選 ${selected.length} 張經文卡`
                : `全部 ${scriptures.length} 張經文卡`}
            </span>
            {selected.length > 0 && (
              <button className="text-button" onClick={() => saveSelection([])}>
                閱讀全部
              </button>
            )}
            <div className="reading-utilities">
              <button
                onClick={() => setDialog("preferences")}
                className="reader-utility-button"
                aria-label="調整閱讀字級"
              >
                字級
              </button>
              <button
                onClick={() => setDialog("selection")}
                className="reader-utility-button utility-range"
              >
                <Icon name="settings" width="16" height="16" />
                範圍
              </button>
            </div>
            <span className="card-position">
              {String(index + 1).padStart(2, "0")}
              <span> / {String(scriptures.length).padStart(2, "0")}</span>
            </span>
          </div>

          <p className="mobile-swipe-hint">
            <Icon name="left" width="12" height="12" />
            左右滑動換卡，也能使用下方按鈕
            <Icon name="right" width="12" height="12" />
          </p>
          <article
            ref={cardRef}
            className="scripture-card"
            aria-label={`第 ${index + 1} 張經文卡`}
            onTouchStart={(event) => {
              if (event.touches.length !== 1) {
                touchStart.current = null;
                return;
              }
              touchStart.current = {
                x: event.changedTouches[0].clientX,
                y: event.changedTouches[0].clientY,
              };
            }}
            onTouchCancel={() => {
              touchStart.current = null;
            }}
            onTouchEnd={(event) => {
              if (window.getSelection()?.toString()) {
                touchStart.current = null;
                return;
              }
              if (
                !touchStart.current ||
                (event.target instanceof HTMLElement &&
                  event.target.closest("button, audio"))
              )
                return;
              const dx = event.changedTouches[0].clientX - touchStart.current.x;
              const dy = event.changedTouches[0].clientY - touchStart.current.y;
              if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5)
                move(dx < 0 ? 1 : -1);
              touchStart.current = null;
            }}
          >
            <div className="card-topline">
              <span>
                勇士班 · {collection.title}
                {current.kind === "supplement" ? " · 課程補充" : ""}
              </span>
              <Icon name="leaf" width="19" height="19" />
              <span className="mobile-card-counter">
                {index + 1} / {scriptures.length}
              </span>
            </div>
            <div className="card-content" key={current.id} aria-live="polite">
              <span className="card-quote-mark" aria-hidden="true">
                “
              </span>
              {hasHidden && hidden === "verse" ? (
                <button
                  className="hidden-content hidden-verse"
                  onClick={() => setRevealed(true)}
                >
                  <span className="hidden-icon">
                    <Icon name="eye-off" width="24" height="24" />
                  </span>
                  <strong>
                    {current.kind === "supplement"
                      ? "內容已隱藏"
                      : "經文已隱藏"}
                  </strong>
                  <span>試著在心裡背誦，準備好再揭曉。</span>
                  <span className="reveal-label">
                    {current.kind === "supplement"
                      ? "點一下，顯示內容"
                      : "點一下，顯示經文"}
                    <Icon name="eye" width="16" height="16" />
                  </span>
                </button>
              ) : (
                <p className="scripture-verse" lang="zh-Hant">
                  {current.verse}
                </p>
              )}
              <div className="reference-rule" />
              {hasHidden && hidden === "reference" ? (
                <button
                  className="hidden-reference"
                  onClick={() => setRevealed(true)}
                >
                  <Icon name="eye-off" width="17" height="17" />
                  <span>出處已隱藏 · 點一下揭曉</span>
                </button>
              ) : (
                <p className="scripture-reference" lang="zh-Hant">
                  {current.reference}
                </p>
              )}
            </div>
            <div className="card-bottomline">
              {current.kind === "supplement" ? (
                <span>課程補充文字・非聖經經文</span>
              ) : (
                <a
                  className="scripture-source"
                  href={current.source}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  和合本・繁體神版
                </a>
              )}
              {mode !== "read" && (
                <button
                  className="text-button"
                  onClick={() => setRevealed((prev) => !prev)}
                >
                  <Icon
                    name={revealed ? "eye-off" : "eye"}
                    width="15"
                    height="15"
                  />
                  {revealed ? "再次隱藏" : "揭曉內容"}
                </button>
              )}
            </div>
          </article>

          <div className="card-navigation">
            <button
              className="button button-secondary previous-card"
              onClick={() => move(-1)}
              disabled={index === 0}
            >
              <Icon name="left" />
              <span>上一張</span>
            </button>
            <button
              className="jump-button"
              onClick={() => {
                setQuery("");
                setDialog("jump");
              }}
            >
              <Icon name="grid" width="17" height="17" />
              <span className="desktop-jump-label">快速跳轉</span>
              <span className="mobile-jump-label">目錄</span>
            </button>
            <button
              className="mobile-shuffle-button"
              onClick={randomCard}
              disabled={scriptures.length < 2}
            >
              <Icon name="shuffle" width="19" height="19" />
              <span>隨機</span>
            </button>
            <button
              className="button button-primary next-card"
              onClick={() => move(1)}
              disabled={index === scriptures.length - 1}
            >
              <span>下一張</span>
              <Icon name="right" />
            </button>
          </div>
          <div className="reader-secondary-actions">
            <button
              className="text-button"
              disabled={scriptures.length < 2}
              onClick={randomCard}
            >
              <Icon name="shuffle" width="17" height="17" />
              隨機一張
            </button>
            <span className="keyboard-hint">
              ← → 切換經文{mode !== "read" ? " · 空白鍵揭曉" : ""}
            </span>
            {index === scriptures.length - 1 && (
              <button
                className="text-button"
                onClick={() => goTo(scriptures[0].id)}
              >
                回到第一張
                <Icon name="arrow" width="16" height="16" />
              </button>
            )}
          </div>

          {current.audio && (
            <div className="audio-section">
              <div className="audio-label">
                <Icon name="volume" width="18" height="18" />
                <span>聆聽經文</span>
              </div>
              <audio
                key={current.id}
                ref={audioRef}
                controls
                preload="none"
                src={current.audio}
                aria-label="經文中文朗讀"
                onError={() => setNotice("暫時無法載入朗讀音訊，請稍後再試。")}
              />
              {notice && (
                <p className="audio-notice" role="status">
                  {notice}
                </p>
              )}
            </div>
          )}
          <p className="reader-footnote">不急著背熟，先讓每一句話住進心裡。</p>
        </section>
      </div>
      {dialog === "preferences" && (
        <ReadingDialog
          title="用舒服的字級閱讀"
          subtitle="依照自己的習慣調整，設定會自動保留。"
          onClose={() => setDialog(null)}
          footer={
            <button
              className="button button-primary preferences-done"
              onClick={() => setDialog(null)}
            >
              完成，繼續閱讀
              <Icon name="check" />
            </button>
          }
        >
          <div className="font-options" role="group" aria-label="經文閱讀字級">
            {(
              [
                { id: "standard", name: "標準", size: 22 },
                { id: "large", name: "大字", size: 28 },
                { id: "largest", name: "特大", size: 32 },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                aria-pressed={fontSize === option.id}
                onClick={() => setFontSize(option.id)}
              >
                <span style={{ fontSize: option.size }} aria-hidden="true">
                  字
                </span>
                <strong>{option.name}</strong>
                {fontSize === option.id && (
                  <Icon name="check" width="16" height="16" />
                )}
              </button>
            ))}
          </div>
          <p className={`font-preview reader-font-${fontSize}`}>
            慢慢讀，讓每一句話住進心裡。
          </p>
          <p className="preferences-note">也可以使用雙指縮放畫面。</p>
        </ReadingDialog>
      )}
      {dialog === "selection" && (
        <SelectionDialog
          collection={collection}
          initial={selected}
          onSave={saveSelection}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === "jump" && (
        <ReadingDialog
          title="想讀哪一節？"
          subtitle={`在目前 ${scriptures.length} 張經文卡中快速跳轉。`}
          onClose={() => setDialog(null)}
        >
          {list(true)}
        </ReadingDialog>
      )}
    </main>
  );
}
