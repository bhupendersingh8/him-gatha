#!/usr/bin/env bash
# Git safety hook - prevents destructive operations
input=$(cat)
command=$(echo "$input" | grep -o '"command":[^}]*' | head -n 1)

if [[ "$command" =~ git\ (push|reset\ --hard|clean\ -f|branch\ -D|restore\ \.) ]]; then
  echo "BLOCKED: Dangerous git command detected. Destructive operations are prohibited." >&2
  exit 2
fi

exit 0
