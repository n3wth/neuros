#!/bin/bash

# Persistent development server using tmux
# Keeps server running even when Claude Code sessions end

SESSION_NAME="supa-dev"
PORT=${1:-3000}

# Check if tmux session exists
if tmux has-session -t $SESSION_NAME 2>/dev/null; then
    echo "📡 Development server already running in tmux session: $SESSION_NAME"
    echo "   Access with: tmux attach -t $SESSION_NAME"
    echo "   View logs: tmux capture-pane -t $SESSION_NAME -p"
    echo "   Stop server: tmux kill-session -t $SESSION_NAME"
else
    echo "🚀 Starting persistent dev server on port $PORT"
    tmux new-session -d -s $SESSION_NAME "cd /Users/oliver/GitHub/supa-template && PORT=$PORT npm run dev"
    echo "✅ Server started in background"
    echo "   Access with: tmux attach -t $SESSION_NAME"
fi

echo ""
echo "📍 Server URL: http://localhost:$PORT"