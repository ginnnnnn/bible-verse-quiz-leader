# Node.js 安全升級與相容性紀錄

查核日期：2026-10-23（Asia/Taipei）。驗證平台：macOS arm64。

## 官方依據與選版

- [2026-10-21 官方安全公告](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)：修補 Node.js 22、24、26 分支的 DNS、TLS、Brotli、HTTP 等問題，最高嚴重度為 High；對應修補版本為 22.23.4、24.22.1、26.12.1。EOL 分支也可能受影響。
- [24.22.1 發行說明](https://nodejs.org/en/blog/release/v24.22.1)：2026-10-21 發布的安全版本；本專案採用 24 分支的修補下限 **24.22.1**。
- [官方支援狀態](https://nodejs.org/en/about/previous-releases)：查核時 Node.js 24 為受支援 LTS。沿用本機已安裝的 24.22.1，無須安裝另一份或更動系統 Node。

## 執行環境與變更

| 項目 | 修補前 | 修補後／驗證目標 |
| --- | --- | --- |
| 專案 Node 版本設定 | 未指定 | `.nvmrc`：24.22.1；`engines.node`：`>=24.22.1 <25` |
| 既有 3000 服務的執行檔 | `/usr/local/bin/node`，該檔案回報 24.15.0 | 既有程序未重啟，仍待切換 |
| 本次 shell 與新版測試 | 已使用 24.22.1 | 沿用 24.22.1；確認 npm scripts 子程序也解析到相同執行檔 |
| `@types/node` | 20.16.5（`^20`） | 24.19.2（`^24.19.2`） |
| `undici-types` | 6.19.8 | 7.24.6，隨 Node 型別更新 |

新版測試執行檔為 `/Users/austinchen/.local/share/nodejs/node-v24.22.1-darwin-arm64/bin/node`，npm 11.19.1；舊版基準使用 `/usr/local/bin/node` 24.15.0、npm 11.12.1。上述本機路徑僅作驗證紀錄，未寫入專案 scripts。

lockfile 的套件版本差異僅有上表兩個型別套件。Next.js 14.2.11、React 與其餘套件維持原版本，未修改業務程式。專案未發現 Docker／Compose、CI 版本設定、獨立 worker 或雲端部署設定。

## 實際測試結果

| 檢查 | Node 24.15.0／原型別 | Node 24.22.1／新型別 |
| --- | --- | --- |
| `npm run lint` | 通過 | 通過 |
| `tsc --noEmit --incremental false` | 通過 | 通過 |
| `npm run build` | 通過，產生 14 個靜態頁面 | 通過，產生 14 個靜態頁面 |
| 建置中的 `verify:scriptures` | 通過 | 通過 |
| 建置中的 `verify:pwa` | 通過 | 通過 |
| `npm start` 的 18 項 HTTP 檢查 | 通過 | 通過，與舊版結果一致 |
| `npm run dev` 的 18 項 HTTP 檢查 | 通過 | 通過，與舊版結果一致 |
| 各模式實際引用的 JS／CSS／字型 | 各 15 個皆 200 且內容非空 | 各 15 個皆 200 且內容非空 |
| 開發模式來源修改後重新編譯 | 未額外測試 | 修改暫存副本的 manifest 後，HTTP 回應反映新內容；測完還原 |

新版先在隔離副本以原套件管理器執行 `npm ci --no-audit --no-fund`，成功安裝 369 個套件，再執行上述檢查。Next.js 的 native SWC 編譯成功。npm 提示可選的 `fsevents` 安裝腳本未獲允許；未批次放行腳本，實測開發服務的檔案監看與重建仍通過。

HTTP 使用技能提供的 `http-smoke.mjs`，只送本機 GET、不跟隨轉址，比對狀態、內容型別與 Location，並檢查關鍵文字及伺服器渲染錯誤標記。涵蓋：

- 首頁 `/`、學員 `/student`、領袖 `/leader`：200，包含預期中文內容／標題。閱讀器的完整互動由瀏覽器執行，HTTP 僅驗證初始回應。
- 六個舊網址：`/student/my-learning`、`/leader/my-learning`、`/entrance`、`/quiz`、`/list-type-1`、`/list-type-2`。
- 不存在的網址：404。
- `/manifest.webmanifest`：200，確認名稱、語系及 standalone 模式。
- 四個主畫面 PNG 圖示與三張背景 JPEG：200，內容型別正確。

舊網址的既有行為：開發模式為 307 並帶預期 Location；正式模式為 307、沒有 Location header，但回應內含預期目標的 `NEXT_REDIRECT;replace;…;307;`。新舊版本一致；此記錄不把正式模式的既有轉址問題判為已修正，也未驗證瀏覽器實際跳轉。

伺服器日誌未發現渲染／執行錯誤。舊版與新版乾淨建置皆提示既有 Browserslist 資料過期，未因此擴大更新依賴。測試服務僅使用 127.0.0.1:3131／3132，結束後均停止。

**在已測範圍未發現 Node.js 升級造成的相容性問題。** 未執行瀏覽器互動、localStorage 狀態還原、遠端音訊播放或實機主畫面安裝；專案沒有登入、session／CSRF、受保護 API 或資料庫流程可測。本次也不代表完成所有 npm 套件的安全稽核。

## 套用與部署待辦

本次保留既有開發服務及其 `node_modules`，避免在運行中替換相依。停止該服務後，在選定的 Node 24.22.1 PATH 下執行：

```bash
node --version
npm ci
npm run lint
npx tsc --noEmit
npm run build
npm start
```

若使用 nvm，可先執行 `nvm install && nvm use`。開發時改用 `npm run dev`；依 README，勿與正式建置共用同一份 `.next` 同時執行。原有終端機、IDE 或啟動管理程序也需確認 PATH，避免再次使用 `/usr/local/bin/node` 24.15.0。

本次驗證未執行雲端部署。雲端平台的建置與實際執行環境需另外更新並取得版本證據；`.nvmrc`、`engines` 或本機驗證成功均不代表雲端已修補。
