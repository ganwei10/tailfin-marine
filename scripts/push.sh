#!/usr/bin/env bash
# TailFin Marine — commit all changes and push to GitHub.
# Idempotent: only commits when there are changes; never prompts for creds.
# Usage: ./scripts/push.sh "commit message"
set -e
cd "$(dirname "$0")/.."

export GIT_TERMINAL_PROMPT=0

# Stage everything
git add -A

# Only commit if there is something staged
if git diff --cached --quiet; then
  echo "ℹ️  No changes to commit."
else
  git commit -m "${1:-chore: update TailFin Marine site}"
  echo "✅ Committed."
fi

# Push (works via the WorkBuddy GitHub connector credential)
git push
echo "🚀 Pushed to GitHub (origin/main)."
