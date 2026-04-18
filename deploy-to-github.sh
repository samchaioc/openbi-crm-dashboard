#!/bin/bash
# Dashboard 部署腳本 - GitHub + Cloudflare Pages

set -e

DASHBOARD_DIR="/Users/samchaioc/.openclaw/workspace-antony/output/dashboard"

echo "🚀 Dashboard GitHub 部署腳本"
echo ""

# 檢查是否在正確目錄
cd "$DASHBOARD_DIR"

# 詢問 GitHub 信息
echo "請輸入 GitHub 信息："
read -p "GitHub 用戶名: " USERNAME
read -p "倉庫名稱 (預設: openbi-crm-dashboard): " REPO_NAME
REPO_NAME=${REPO_NAME:-openbi-crm-dashboard}

echo ""
echo "📋 部署信息："
echo "  用戶名: $USERNAME"
echo "  倉庫: $REPO_NAME"
echo "  目錄: $DASHBOARD_DIR"
echo ""
read -p "確認部署? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "❌ 已取消"
    exit 1
fi

# 初始化 git
echo ""
echo "🔧 初始化 Git..."

if [ -d ".git" ]; then
    echo "  Git 已初始化"
else
    git init
    echo "  ✅ Git 初始化完成"
fi

# 添加所有檔案
echo ""
echo "📦 添加檔案..."
git add .
echo "  ✅ 檔案已添加"

# 提交
echo ""
echo "💾 提交更改..."
git commit -m "Initial dashboard deployment

- Dashboard 首頁
- OpenBI 報表區塊
- CRM 保單管理
- 響應式設計" || echo "  無更改需要提交"

# 設置遠程倉庫
echo ""
echo "🔗 連接 GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git"
echo "  ✅ 遠程倉庫已設置"

# 推送
echo ""
echo "📤 推送到 GitHub..."
git branch -M main
git push -u origin main -f
echo "  ✅ 推送完成"

echo ""
echo "🎉 部署完成！"
echo ""
echo "下一步："
echo "1. 訪問 https://github.com/$USERNAME/$REPO_NAME"
echo "2. 在 Cloudflare Pages 連接此倉庫"
echo "3. 參考 DEPLOY.md 完成配置"
echo ""
