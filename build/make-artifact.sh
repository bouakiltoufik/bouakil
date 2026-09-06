#!/usr/bin/env bash
# Assemble le site en un fichier unique (CSS + JS inlinés), au format attendu
# par les Artifacts Claude : pas de <!doctype>, <html>, <head> ni <body>.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/dist/tbconnect.html"
mkdir -p "$root/dist"

{
  echo '<title>TBConnect — Location de voiture</title>'
  echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
  echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap">'
  echo '<style>'
  cat "$root/assets/css/style.css"
  echo '</style>'
  sed -n '/ARTIFACT:BODY:START/,/ARTIFACT:BODY:END/p' "$root/index.html"
  echo '<script>'
  cat "$root/assets/js/app.js"
  echo '</script>'
} > "$out"

echo "→ $out ($(wc -c < "$out") octets)"
