#!/bin/bash
# ============================================
# 一键推送 — 自动检测代理 + HTTP/1.1 + 安全 Token
# ============================================
#
# 使用方法：
#   bash /Users/StnaleyKong/WorkBuddy/2026-08-04-16-45-15/site/push.sh
#
# Token 生成: https://github.com/settings/tokens/new
#   勾选 repo，有效期选 90 days
#
# ============================================

set -e

SITE_DIR="/Users/StnaleyKong/WorkBuddy/2026-08-04-16-45-15/site"
cd "$SITE_DIR"

echo "=========================================="
echo "  推送作品集到 GitHub"
echo "=========================================="
echo ""

# ====== 自动检测可用代理端口 ======
PROXY_FOUND=""
for port in 7890 57337 1087 8080 1080; do
  result=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 -x "http://127.0.0.1:$port" https://github.com 2>/dev/null)
  if [ "$result" != "000" ] && [ -n "$result" ]; then
    PROXY_FOUND="http://127.0.0.1:$port"
    echo "✓ 检测到可用代理: $PROXY_FOUND"
    break
  fi
done

if [ -n "$PROXY_FOUND" ]; then
  git config http.proxy "$PROXY_FOUND"
  git config https.proxy "$PROXY_FOUND"
else
  echo "⚠ 未检测到可用代理，尝试直连..."
  git config --unset http.proxy 2>/dev/null || true
  git config --unset https.proxy 2>/dev/null || true
fi

# ====== 强制 HTTP/1.1（修复 HTTP/2 framing layer 错误）======
git config http.version HTTP/1.1
echo "→ 已强制 HTTP/1.1"
echo ""

# ====== 安全输入 Token ======
echo "请输入 GitHub Personal Access Token（输入时不显示）："
echo "  生成地址: https://github.com/settings/tokens/new"
echo "  勾选: repo，有效期 90 days"
echo ""
read -s -p "Token: " GH_TOKEN
echo ""
echo ""

if [ -z "$GH_TOKEN" ]; then
  echo "✗ Token 不能为空，已取消。"
  exit 1
fi

# ====== 推送 ======
echo "→ 推送中（可能需要 10-30 秒）..."
echo ""

git push "https://StanelyKong:${GH_TOKEN}@github.com/StanelyKong/StanelyKong.github.io.git" main --force

# 立即清除 token 变量
unset GH_TOKEN

echo ""
echo "=========================================="
echo "  ✅ 推送成功！"
echo "=========================================="
echo ""
echo "  1-2 分钟后访问: https://stanelykong.github.io"
echo ""
echo "  如果没自动上线："
echo "  仓库 → Settings → Pages → Source: main 分支"
echo "=========================================="
