#!/bin/bash
# fetch-stitch.sh <url> <output_path>
# Downloads Stitch design assets, handling Google CDN redirects

set -e

URL="$1"
OUTPUT="$2"

if [ -z "$URL" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: $0 <url> <output_path>"
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT")"

curl -sS -L \
  -H "User-Agent: Mozilla/5.0" \
  -o "$OUTPUT" \
  "$URL"

echo "Downloaded to $OUTPUT ($(wc -c < "$OUTPUT") bytes)"
