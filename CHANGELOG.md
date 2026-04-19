# OpenBI Dashboard v1.1

## 更新日誌

### v1.1 (2026-04-19)
- ✅ **門店選擇器** - 可切換查看單一門店或全部門店
- ✅ **門店全名顯示** - KD → Kota Damansara, SP → Sri Petaling 等
- ✅ **時間範圍選擇** - Bar Chart 支援：一天、一週、一個月、一年、總共
- ✅ **真實數據計算** - 從原始 CSV 計算每日/每週/每月/每年/總共銷售額
- ✅ **Line Chart 趨勢圖** - 月度銷售趨勢改為折線圖，點上方顯示金額
- ✅ **Bar Chart 門店圖** - 門店銷售額改為柱狀圖，固定顯示所有門店

### v1.0 (初始版本)
- 基礎 Dashboard 功能
- OpenBI 數據顯示
- CRM 數據顯示

## 門店對照表
| 代碼 | 全名 |
|------|------|
| KD | Kota Damansara |
| SP | Sri Petaling |
| KP | Kepong |
| PI | Pandan Indah |
| PP | Pearl Point |
| MV | Mid Valley |
| OFK | Old Fatt Kee |
| PVL | PVL |
| SS15 | SS15 |

## 技術架構
- **前端**: 純 HTML + CSS + JavaScript + Chart.js
- **後端**: Cloudflare Worker
- **數據源**: Google Sheets CSV
- **部署**: Cloudflare Workers

## API 端點
- `GET /api/sheet?url=<sheet_url>` - 代理 Google Sheets CSV

## 數據計算邏輯
- **一天**: 所有月份每日銷售的平均值
- **一週**: 最近一個月的最後7天總和
- **一個月**: 最近一個月的總銷售
- **一年**: 所有月份的總和
- **總共**: 所有數據的總和
