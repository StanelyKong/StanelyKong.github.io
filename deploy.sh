#!/bin/bash
# ============================================
# 部署脚本 — 推送到 GitHub StanelyKong.github.io
# ============================================
#
# 使用方法：
#   bash /Users/StnaleyKong/WorkBuddy/2026-08-04-16-45-15/site/deploy.sh
#
# ============================================

set -e

SITE_DIR="/Users/StnaleyKong/WorkBuddy/2026-08-04-16-45-15/site"
cd "$SITE_DIR"

echo "=========================================="
echo "  推送作品集网站到 GitHub"
echo "  仓库: StanelyKong/StanelyKong.github.io"
echo "=========================================="
echo ""

# ====== 自动配置 git 代理（解决国内访问 GitHub 不稳定）======
PROXY_URL="http://127.0.0.1:57337"
# 测试代理是否可用
if curl -s -o /dev/null --max-time 5 -x "$PROXY_URL" https://github.com 2>/dev/null; then
  echo "→ 检测到代理可用，自动为 git 配置代理: $PROXY_URL"
  git config http.proxy "$PROXY_URL"
  git config https.proxy "$PROXY_URL"
  # 改完验证一次
  echo "→ 验证 GitHub 连接..."
  if ! git ls-remote https://github.com/StanelyKong/StanelyKong.github.io.git HEAD >/dev/null 2>&1; then
    echo "⚠️  代理配置后仍无法连接 GitHub，请检查代理软件是否正常运行"
    exit 1
  fi
  echo "✓ GitHub 连接正常"
else
  echo "⚠️  代理 $PROXY_URL 不可用，尝试直连 GitHub..."
  git config --unset http.proxy 2>/dev/null || true
  git config --unset https.proxy 2>/dev/null || true
fi

echo ""

# ====== 确认覆盖 ======
echo "⚠️  这将覆盖 GitHub 仓库上的旧版网站（images/ projects/ index.html）"
echo "   旧内容仍可在 GitHub 的 commit 历史中找到。"
echo ""
read -p "确认推送？(y/N) " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "已取消。"
  exit 0
fi

echo ""
echo "→ 推送中...（首次会弹出 GitHub 登录窗口）"
echo ""

# Force push 覆盖远程
git push -u origin main --force

echo ""
echo "=========================================="
echo "  ✅ 推送成功！"
echo "=========================================="
echo ""
echo "  你的网站将在 1-2 分钟后上线："
echo "  https://stanelykong.github.io"
echo ""
echo "  GitHub Pages 设置（如果还没开启）："
echo "  仓库 → Settings → Pages → Source: main 分支"
echo "=========================================="
