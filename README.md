# OpenBI + CRM Dashboard

統一數據管理平台，整合 OpenBI 報表和 CRM 保單管理。

## 功能

- 📈 **總覽**：KPI 指標、銷售趨勢
- 📊 **OpenBI**：月份對比、店鋪分析
- 📋 **CRM**：保單搜索、列表管理

## 技術

- 純 HTML/CSS/JavaScript
- Chart.js 圖表
- 響應式設計

## 部署

### GitHub + Cloudflare Pages

1. Fork 或上傳到 GitHub
2. 在 Cloudflare Pages 連接 GitHub 倉庫
3. 自動部署

詳見 [DEPLOY.md](DEPLOY.md)

## 配置

編輯 `index.html` 中的 `CONFIG`：

```javascript
const CONFIG = {
  CRM_GAS_URL: '你的 GAS URL',
  API_KEY: '你的 API Key'
};
```

## 開發

本地預覽：

```bash
python -m http.server 8080
```

訪問 http://localhost:8080

## 授權

MIT
