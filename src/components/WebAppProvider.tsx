"use client";

import { createContext, useContext, useEffect, useState } from "react";
import ReadingDialog from "./ReadingDialog";
import Icon from "./Icon";
import { readStored, writeStored } from "@/lib/reading-storage";
import {
  getInstallPlatform,
  isEmbeddedBrowser,
  requestInstallation,
  type InstallPlatform,
  type InstallPromptEvent,
} from "@/lib/web-app";

const AppContext = createContext({
  ready: false,
  installed: false,
  open: () => {},
});

export function InstallButton() {
  const app = useContext(AppContext);
  if (!app.ready || app.installed) return null;
  return (
    <button
      className="install-header-button"
      aria-label="加入主畫面"
      onClick={app.open}
    >
      <Icon name="download" width="17" height="17" />
      <span>加入主畫面</span>
    </button>
  );
}

export function InstallBanner() {
  const app = useContext(AppContext);
  const [dismissed, setDismissed] = useState(true);
  useEffect(() => {
    const until = readStored<unknown>("scripture_installDismissedUntil", 0);
    setDismissed(typeof until === "number" && until > Date.now());
  }, []);
  if (!app.ready || app.installed || dismissed) return null;
  return (
    <aside className="install-banner" aria-label="加入手機主畫面提示">
      <span className="install-banner-icon">
        <Icon name="phone" width="26" height="26" />
      </span>
      <div>
        <h2>把經文卡，放進口袋。</h2>
        <p>加入手機主畫面，下次輕點圖示就能接續閱讀。</p>
        <button className="text-button" onClick={app.open}>
          免費加入主畫面
          <Icon name="arrow" width="16" height="16" />
        </button>
      </div>
      <button
        className="install-banner-close icon-button"
        aria-label="暫時關閉安裝提示"
        onClick={() => {
          setDismissed(true);
          writeStored(
            "scripture_installDismissedUntil",
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          );
        }}
      >
        <Icon name="close" width="16" height="16" />
      </button>
    </aside>
  );
}

export default function WebAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<InstallPlatform>("apple");
  const [inApp, setInApp] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const displayMode = window.matchMedia("(display-mode: standalone)");
    const updateInstalled = () =>
      setInstalled(
        displayMode.matches ||
          Boolean(
            (navigator as Navigator & { standalone?: boolean }).standalone,
          ),
      );
    updateInstalled();
    const userAgent = navigator.userAgent;
    setPlatform(getInstallPlatform(navigator));
    setInApp(isEmbeddedBrowser(userAgent));
    const beforeInstall = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    const afterInstall = () => {
      setInstalled(true);
      setOpen(false);
      setPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", afterInstall);
    displayMode.addEventListener("change", updateInstalled);
    setReady(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", afterInstall);
      displayMode.removeEventListener("change", updateInstalled);
    };
  }, []);

  const install = async () => {
    if (!prompt || installing) return;
    setInstalling(true);
    try {
      const outcome = await requestInstallation(prompt);
      if (outcome === "accepted") {
        setInstalled(true);
        setOpen(false);
      } else setStatus("可以之後再安裝，現在也能直接閱讀。");
    } catch {
      setStatus("目前無法開啟安裝視窗，請依照下方步驟加入主畫面。");
    } finally {
      setPrompt(null);
      setInstalling(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ready,
        installed,
        open: () => {
          setStatus("");
          setOpen(true);
        },
      }}
    >
      {children}
      {open && (
        <ReadingDialog
          title="讓經文，離你更近一點"
          subtitle="免費加入主畫面，像應用程式一樣開啟，不必每次找網址。"
          onClose={() => setOpen(false)}
          footer={
            prompt && !inApp ? (
              <button
                className="button button-primary install-native-button"
                disabled={installing}
                onClick={install}
              >
                <Icon name="download" />
                {installing ? "正在開啟安裝視窗…" : "立即安裝"}
              </button>
            ) : (
              <button
                className="button button-primary install-native-button"
                onClick={() => setOpen(false)}
              >
                知道了，繼續閱讀
                <Icon name="check" />
              </button>
            )
          }
        >
          <div className="install-app-preview">
            <span className="install-app-mark">
              <Icon name="book" width="34" height="34" />
            </span>
            <div>
              <strong>勇士班經文</strong>
              <span>學員版・領袖版・隨手默想</span>
            </div>
          </div>
          <div
            className="install-platforms"
            role="group"
            aria-label="選擇裝置類型"
          >
            {(
              [
                { id: "apple", name: "蘋果手機" },
                { id: "android", name: "安卓手機" },
                { id: "desktop", name: "電腦" },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                aria-pressed={platform === item.id}
                onClick={() => setPlatform(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
          {inApp && (
            <p className="install-in-app">
              目前可能是通訊軟體內的瀏覽器。請先使用選單，以手機的系統瀏覽器開啟本頁，再加入主畫面。
            </p>
          )}
          <ol className="install-steps">
            {platform === "apple" ? (
              <>
                <li>
                  <span className="install-step-number">1</span>
                  <div>
                    <strong>在系統瀏覽器開啟本頁</strong>
                    <p>
                      使用手機內建的瀏覽器；舊版系統請選擇指南針圖示的瀏覽器。
                    </p>
                  </div>
                </li>
                <li>
                  <span className="install-step-number">
                    <Icon name="share" />
                  </span>
                  <div>
                    <strong>點選「分享」</strong>
                    <p>尋找方框加上向上箭頭的分享圖示。</p>
                  </div>
                </li>
                <li>
                  <span className="install-step-number">
                    <Icon name="plus" />
                  </span>
                  <div>
                    <strong>選擇「加入主畫面」</strong>
                    <p>向下捲動分享選單找到此項目，最後點選「加入」。</p>
                  </div>
                </li>
              </>
            ) : platform === "android" ? (
              <>
                <li>
                  <span className="install-step-number">1</span>
                  <div>
                    <strong>打開瀏覽器選單</strong>
                    <p>通常在右上角，圖示是三個點。</p>
                  </div>
                </li>
                <li>
                  <span className="install-step-number">
                    <Icon name="download" />
                  </span>
                  <div>
                    <strong>選擇「安裝應用程式」</strong>
                    <p>依瀏覽器版本，也可能顯示「加入主畫面」。</p>
                  </div>
                </li>
                <li>
                  <span className="install-step-number">
                    <Icon name="check" />
                  </span>
                  <div>
                    <strong>確認加入</strong>
                    <p>完成後，就能從手機主畫面打開經文卡。</p>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <span className="install-step-number">
                    <Icon name="download" />
                  </span>
                  <div>
                    <strong>尋找網址列的安裝圖示</strong>
                    <p>
                      也可以在瀏覽器選單中尋找「安裝應用程式」或「加入程式塢」的選項。
                    </p>
                  </div>
                </li>
                <li>
                  <span className="install-step-number">
                    <Icon name="phone" />
                  </span>
                  <div>
                    <strong>手機也能加入主畫面</strong>
                    <p>在手機開啟這個網站，再選擇上方對應裝置查看步驟。</p>
                  </div>
                </li>
              </>
            )}
          </ol>
          {status && (
            <p className="install-status" role="status">
              {status}
            </p>
          )}
          <p className="install-connection-note">
            閱讀經文及播放朗讀時，請保持網路連線。
          </p>
        </ReadingDialog>
      )}
    </AppContext.Provider>
  );
}
