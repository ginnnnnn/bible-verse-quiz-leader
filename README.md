# 勇士班經文

以經文卡為核心的閱讀與默想網站，提供學員版（31 張）與領袖版（29 張），使用 Next.js App Router、React、TypeScript 與 Tailwind CSS。

## 本機開發

使用 Node.js **24.22.1**（`.nvmrc` 指定版本）；`engines.node` 限制為 `>=24.22.1 <25`。若使用 nvm，可先執行 `nvm install && nvm use`；其他環境請確認 `node --version` 符合此範圍，再安裝套件。

```bash
npm ci
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)。

```bash
npm run verify:scriptures
npm run lint
npx tsc --noEmit
npm run build
npm start
```

請勿在同一個 checkout 同時執行多個開發服務，或在開發服務執行時執行正式建置，避免共用 `.next` 產生衝突。

Node.js 安全版本與相容性驗證紀錄見 [安全升級紀錄](docs/nodejs-security-upgrade.md)。部署時也需選用符合上述範圍的建置與執行環境；本機版本設定不代表雲端環境已更新。

## 閱讀流程

- 首頁選擇學員版或領袖版，直接進入經文卡。
- 完整閱讀、隱藏出處、隱藏經文、隨機隱藏四種模式；換卡後重新隱藏。
- 上／下一張、隨機抽取不同的卡，以及可搜尋中文出處與經文內容的快速跳轉。
- 自選閱讀範圍；未選取時閱讀全部。兩個版本的範圍各自保存。
- 中文音訊朗讀、上次閱讀位置還原。
- 頁首可切換深色／淺色主題；首次跟隨裝置設定，手動選擇後記住偏好。首頁、閱讀器、目錄與安裝提示共用主題。
- 電腦可使用左右方向鍵換卡，隱藏模式下使用空白鍵揭曉。手機可在經文區左右滑動換卡。

選取範圍、閱讀位置與偏好保存在目前瀏覽器的 localStorage，未提供帳號或跨裝置同步。舊版的經文選取資料可繼續使用。

音訊沿用經文資料內的遠端來源，僅在使用播放器時下載；無法載入時顯示提示。

## 程式結構

- `src/data/collections.ts`：統一卡組模型與版本資訊，供未來主題擴充。
- `src/data/studentScriptures.json`、`src/data/scriptures.json`：繁體和合本經文、課程補充與中文音訊。
- `src/components/Library.tsx`：首頁與接續閱讀入口。
- `src/components/CardReader.tsx`：共用經文卡閱讀器、目錄與範圍選取。
- `src/components/ReadingDialog.tsx`：原生 modal dialog，提供焦點限制與 Escape 關閉。
- `src/lib/reading-storage.ts`：安全讀寫瀏覽器儲存空間，忽略失效的選取 ID。
- `src/app/globals.css`：全站視覺與響應式版面。

## 網址相容

`/student`、`/leader` 為新版閱讀器。舊 `/student/my-learning` 與 `/leader/my-learning` 轉向對應版本；舊入口與三種測驗網址轉向首頁，不再提供獨立測驗。

## 經文校對

中文固定採用 Bible Gateway 收錄的繁體《和合本》（神版，CUV）電子文本。逐節保留文字、標點與原有括注；僅去除來源頁面的逐字排版空白及節號，跨節直接串接。

- `verification/cuv-passages.json`：57 段來源快照，包含逐節內文、來源網址、擷取時間及雜湊。
- `verification/scripture-audit.json`：60 張卡片的校對前後紀錄。
- `docs/scripture-audit.md`：可閱讀的完整校對表。
- `npm run verify:scriptures`：逐字檢查 58 張聖經卡與首頁經文，並確認兩張課程補充沒有被誤標成聖經。
- `python3 scripts/fetch-cuv-reference.py`：重新下載來源快照，需要網路；不會覆寫網站經文。更新來源後需重新檢查差異。

正式建置會先執行經文驗證，任何一字或標點不符都會中止。課程補充標題及原文保留，無法作和合本核對。音訊沿用原始檔案，本次僅核對文字，未逐字校對錄音。

## 手機體驗與加入主畫面

- 手機閱讀頁底部固定上一張、目錄、隨機與下一張，支援安全區域；長篇經文換卡後回到新卡開頭。
- 提供標準、大字與特大字級，設定儲存在目前瀏覽器。瀏覽器雙指縮放仍可使用。
- 手機目錄、選取範圍及設定以底部抽屜開啟，不自動喚出鍵盤；搜尋輸入使用 16px，避免手機自動放大。
- 首頁與頁首提供加入主畫面入口。支援原生安裝事件時提供直接安裝，否則依蘋果、安卓與電腦顯示手動步驟。
- 以主畫面獨立模式開啟時隱藏安裝提示；關閉首頁提示後七天內不再顯示，頁首入口仍保留。
- `src/app/manifest.ts` 提供名稱、啟動網址、獨立視窗模式及圖示；`public/icons` 提供 192、512、遮罩與蘋果主畫面圖示。
- `npm run verify:pwa` 驗證資訊清單、圖示尺寸、裝置辨識及安裝回應；正式建置時一併執行。
- 圖示源自現有書本標誌，可用 `node scripts/generate-app-icons.mjs` 重新產生。

正式環境須使用 HTTPS；localhost 可用於本機驗證。手機瀏覽器的安裝選項及文案各異，仍需在正式網址以實際裝置確認。此版本不提供離線快取，閱讀及音訊需網路連線。
