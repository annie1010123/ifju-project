# iFJU 智慧減量循環系統

## 專案簡介
輔仁大學校園智慧廢棄物管理 App，結合感測硬體、GPS 導航、積分回饋與虛擬森林。

## 技術架構
- React 18（純前端，無後端）
- 所有資料目前為 mock data，存在 App.jsx 頂部的常數中

## 畫面結構（SCREENS）
| Screen ID   | 說明               |
|-------------|-------------------|
| LOGIN       | 學號登入頁          |
| HOME        | 首頁（今日數據總覽） |
| MAP         | 校園智慧桶地圖       |
| SCAN        | 掃碼投遞            |
| FOREST      | 我的永續森林         |
| POINTS      | 永續積分            |
| ACCOUNT     | 個人帳號與紀錄       |
| LEADERBOARD | 排行榜（個人/班級）  |
| ANOMALY     | 異常偵測與維運紀錄   |

## 主要資料（可修改）
- `binData`：各站點名稱、容量、感測數值
- `leaderboard`：個人排行榜資料
- `classBoard`：班級排行榜資料
- `anomalyLog`：異常紀錄清單
- `pointsHistory`：積分紀錄（帳號頁用）

## 啟動方式
```bash
npm install
npm start
```

## 未來可擴充的方向
- 接上真實後端 API（Node.js / Firebase）
- 串接 Google Maps SDK 做真實地圖
- 加入推播通知（PWA）
- 串接輔大 SSO 登入系統
