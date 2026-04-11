#!/usr/bin/env bash

# ── Fixed suffix appended to every submission ──────────────────────────────
# Edit the text below. Leave empty ("") to disable.
SUFFIX='
---
Note: whenever i stop you from running any terminal command with KeyboardInterrupt error or with ctrl+c,
then immediately run ask.sh. at the end of your response, kindly run ask.sh.'
# ────────────────────────────────────────────────────────────────────────────

echo ""
echo "=== Type your question. Type --- on a new line to submit ==="
echo ""

lines=""
while IFS= read -r line; do
  if [[ "$line" == "---" ]]; then
    break
  fi
  if [[ -n "$lines" ]]; then
    lines="$lines"$'\n'"$line"
  else
    lines="$line"
  fi
done

# Append suffix if it's not empty
if [[ -n "${SUFFIX// /}" ]]; then
  lines="$lines"$'\n'"$SUFFIX"
fi

echo ""
echo "=== Submitted. Wait for answer in chat... ==="
echo ""
echo "$lines"


