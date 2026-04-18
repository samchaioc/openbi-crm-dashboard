# Dashboard 部署指南

## GitHub + Cloudflare Pages 部署

### 1. 創建 GitHub Repository

1. 登入 [GitHub](https://github.com)
2. 點擊 **New Repository**
3. 命名：`openbi-crm-dashboard`
4. 選擇 **Public** 或 **Private**
5. 點擊 **Create repository**

### 2. 上傳 Dashboard 檔案

```bash
# 在本地創建 git 倉庫
cd /Users/samchaioc/.openclaw/workspace-antony/output/dashboard

# 初始化 git
git init

# 添加所有檔案
git add .

# 提交
git commit -m "Initial dashboard commit"

# 連接到 GitHub（替換 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/openbi-crm-dashboard.git

# 推送
git branch -M main
git push -u origin main
```

### 3. 部署到 Cloudflare Pages

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 點擊 **Pages** → **Create a project**
3. 選擇 **Connect to Git**
4. 授權 GitHub 並選擇 `openbi-crm-dashboard` 倉庫
5. 配置：
   - **Project name**: `openbi-crm-dashboard`
   - **Production branch**: `main`
   - **Build settings**: 選擇 **None**（純靜態網站）
   - **Root directory**: `/`
6. 點擊 **Save and Deploy**

### 4. 配置環境變數（可選）

如果需要在構建時注入配置：

1. 在 Cloudflare Pages 項目設置中
2. 點擊 **Settings** → **Environment variables**
3. 添加：
   - `CRM_GAS_URL`: 你的 GAS URL
   - `API_KEY`: 你的 API Key

### 5. 更新 Dashboard 配置

編輯 `index.html` 中的 `CONFIG`：

```javascript
const CONFIG = {
  // 生產環境使用相對路徑或環境變數
  CRM_GAS_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  API_KEY: 'your-api-key'
};
```

### 6. 自動部署

每次推送到 GitHub main 分支，Cloudflare Pages 會自動重新部署。

---

## 自訂域名（可選）

1. 在 Cloudflare Pages 項目設置中
2. 點擊 **Custom domains**
3. 添加你的域名
4. 按照指示配置 DNS

---

## 檔案結構

```
openbi-crm-dashboard/
├── index.html          # 主檔案
├── README.md           # 說明文件
└── .gitignore          # Git 忽略檔案
```

---

## 注意事項

1. **API Key 安全**：
   - 前端代碼中的 API Key 是可見的
   - 建議在 GAS 中設置域名白名單
   - 或使用環境變數注入

2. **CORS 設定**：
   - 確保 GAS 允許 Cloudflare Pages 域名
   - 或設置為允許所有域名（`*`）

3. **緩存**：
   - Cloudflare 有 CDN 緩存
   - 更新後可能需要清除緩存

---

## 快速部署腳本

我已為你準備了部署腳本：

```bash
# 執行部署腳本
bash deploy-to-github.sh
```

按照提示輸入 GitHub 用戶名和倉庫名即可。
