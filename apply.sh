#!/usr/bin/env bash
set -euo pipefail

# Project root is current dir or provided as first arg
PROJ="${1:-.}"

FILE="$PROJ/components/CountdownSplitReady/index.jsx"

if [ ! -f "$FILE" ]; then
  echo "ERROR: File not found: $FILE"
  echo "Run this script from your project root or pass the path as first argument."
  exit 1
fi

# Make backup once per run
BACKUP="$FILE.backup.$(date +%s)"
cp "$FILE" "$BACKUP"
echo "Backup created: $BACKUP"

# If the file already contains 'use client' in the first 3 lines, do nothing
HEAD3="$(head -n 3 "$FILE" | tr -d '\r')"
if echo "$HEAD3" | grep -q "^'use client';\|^"use client";"; then
  echo "'use client' already present. Nothing to inject."
else
  # Prepend 'use client'; followed by a blank line
  TMP="$(mktemp)"
  printf "'use client';\n\n" > "$TMP"
  cat "$FILE" >> "$TMP"
  mv "$TMP" "$FILE"
  echo "Injected 'use client' at top of: $FILE"
fi

echo "Done."
