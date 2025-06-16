#!/bin/bash

# Open Swagger UI in browser

URL="http://localhost:3001"

echo "🌐 Opening Preffy API Documentation in browser..."
echo "📖 URL: $URL"

# Detect the operating system and open browser accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$URL"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open > /dev/null; then
        xdg-open "$URL"
    elif command -v gnome-open > /dev/null; then
        gnome-open "$URL"
    else
        echo "Please open your browser and go to: $URL"
    fi
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start "$URL"
else
    echo "Please open your browser and go to: $URL"
fi

echo "✅ If the browser didn't open automatically, please visit: $URL"
