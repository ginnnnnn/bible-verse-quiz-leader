# Next.js 安全升級紀錄

完成日期：2026-10-28（Asia/Taipei）。隔離分支：`codex/next-security-upgrade-15-5-28`。

## 官方工具與目標

專案原版 Next.js 14.2.11 不支援 `next upgrade --agent=security`。依[官方流程](https://nextjs.org/docs/app/guides/upgrading/agent-upgrade)，改由目前的 CLI 產生升級指示：

```bash
npx --yes next@canary upgrade --agent=security
```

工具版本為 16.5.0-canary.28，security 政策選定的**應用程式穩定版**為 **15.5.28**。工具使用 canary 不代表專案使用 canary。依工具要求直接執行一次：

```bash
npx --yes @next/codemod@16.5.0-canary.28 upgrade 15.5.28 --yes --skip-adoption
```

[15.5.28 官方發行說明](https://github.com/vercel/next.js/releases/tag/v15.5.28)列出圖片最佳化的未驗證遠端程式執行及 App Router Server Actions 阻斷服務修補。未啟用 Future Defaults。

修改前檢查了本機／遠端分支與提交、專案內的升級標記，以及 GitHub 開啟中的 PR（0 筆），未發現等同工作。

## 變更與遷移清單

| 項目 | 結果 |
| --- | --- |
| Next.js／eslint-config-next | 14.2.11 → 15.5.28，與工具目標完全一致 |
| React／React DOM | 18.3.1 → 19.3.1；App Router 使用 React 19 |
| React 型別 | 升至 19.3.0；保留 codemod 的一致版本 overrides |
| ESLint | 8 → 9.39.5；`next lint` 改為 `eslint .` |
| lint 設定 | 修正 codemod 無法自動完成的轉換；使用 FlatCompat 載入 Next.js 15 的舊格式規則，移除 `.eslintrc.json` |
| 開發服務 | codemod 將 `dev` 改為 `next dev --turbopack`，已驗證 |
| TypeScript | 保留原設定，加入 Next.js 15 建議的 `target: ES2017` |
| 平滑捲動 | 根 `<html>` 加入 `data-scroll-behavior="smooth"`，修正新版路由器的[相容性警告](https://nextjs.org/docs/messages/missing-data-scroll-behavior) |
| Node.js | 沿用 24.22.1，既有版本限制不變 |
| `experimental.agentUpgrade` | **略過**：15.5.28 的 config schema／型別不支援此選項，依工具指示不加入無效設定 |
| `next/font` | 原本已使用內建的 `next/font/local`，無須修改 |
| 非同步 Request APIs | 無 `cookies`、`headers`、`draftMode`、動態 params／searchParams 使用處；codemod 無需修改 |
| 舊設定與 runtime | 無 `experimental-edge`、舊版 external packages 設定、`NextRequest.geo/ip` 或 Speed Insights 自動整合可遷移 |
| React 19 codemods | 元件與型別 codemods 均完成，沒有待處理標記或 `UnsafeUnwrapped` cast |

新版 lint 也涵蓋 scripts，移除經文驗證 script 原有但未使用的 import，驗證邏輯保持不變。

## 相依安全修補

codemod 安裝後 `npm audit` 回報 10 項相依漏洞。以既有相容範圍更新被指出的 glob／minimatch、nanoid、picomatch、PostCSS 解析與 sourcemap、yaml 等套件，未使用 `npm audit fix --force`。

Next.js 15 固定引用的舊 PostCSS 仍受影響，因此將直接相依下限設為 `^8.5.32`，並以 `"postcss": "$postcss"` override 統一 Next.js、Tailwind 與專案的解析器。此版本高於[公告修補下限 8.5.23](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp)。另將 `brace-expansion@1` 限制為 `^1.1.21`，修補 lint 工具保留的舊版本。

最終 `npm audit`：**0 項漏洞**。這是 2026-10-28 registry 公告檢查結果，不是未來或全部應用程式漏洞的保證。保留的 ESLint 9／glob 10 有上游 deprecated 提示；本次未跨越 Next.js 15 相容範圍升級其主版本。

## 實際驗證

| 檢查 | 升級前 | 最終版本 |
| --- | --- | --- |
| lint／TypeScript | 通過 | 通過，無 lint 警告 |
| 經文校對與 PWA 驗證 | 通過 | 通過 |
| 正式建置 | 通過，14 個靜態頁面 | 通過，14 個靜態頁面 |
| 原套件管理器乾淨安裝 | 既有 lockfile 基準 | `npm ci` 成功，安裝 391 個套件 |
| 正式模式 HTTP | 18 項通過，15 個引用資產可讀 | 18 項通過，15 個引用資產可讀 |
| 開發模式 HTTP | 18 項通過，15 個引用資產可讀 | 18 項通過，21 個引用資產可讀；使用 Turbopack |
| sharp 0.35.5 | 未使用 | PNG 解碼、縮放、重新編碼、尺寸檢查通過 |
| 現有 `next/og` 圖示產生 script | 未重跑 | 在暫存副本產生四個 PNG 與 favicon，尺寸全部正確 |

HTTP 案例包含首頁、兩版閱讀器、六個舊轉址、404、manifest、四個 PNG 圖示與三張背景 JPEG。新舊狀態、正規化內容型別與轉址目標一致；新版正式服務另修復舊版缺少 Location header 的行為，六個舊網址均回傳正確的 307 Location。檢查 HTML 錯誤標記及服務日誌，未發現 SSR 錯誤。

桌面瀏覽器在新版 Turbopack 服務實際操作通過：首頁與兩版閱讀器、深淺主題切換及保存、換卡、隱藏／揭曉經文、範圍選取與套用、重新整理還原、搜尋與跳轉、首頁接續上次閱讀。修正平滑捲動屬性後重載並再次路由跳轉，沒有新的瀏覽器警告或錯誤。修改 layout 時的開發重建正常。

未放行 npm 提示的可選 `fsevents`／`unrs-resolver` lifecycle scripts；乾淨安裝、lint、native 圖片處理、Turbopack、檔案重建皆已實測。未驗證遠端音訊實際播放、手機實機安裝、跨瀏覽器或正式雲端環境。

本次啟動的 3141／3142／3143 暫時服務均已停止。其他專案服務及原 main checkout 保持原狀；本機成功不代表正式環境已部署或已換版。
