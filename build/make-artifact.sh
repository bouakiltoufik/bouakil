#!/usr/bin/env bash
# Assemble une version mono-fichier de chaque site (CSS + JS inlinés), au format
# attendu par les Artifacts Claude : pas de <!doctype>, <html>, <head> ni <body>.
#
#   ./build/make-artifact.sh          → assemble les deux variantes
#   ./build/make-artifact.sh v1       → assemble uniquement la v1
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$root/dist"

build() {                       # $1 = dossier source ("." ou "v1"), $2 = nom de sortie
  local dir="$root/${1#.}" out="$root/dist/$2.html"
  dir="${dir%/}"
  {
    sed -n 's/.*\(<title>.*<\/title>\).*/\1/p' "$dir/index.html" | head -1
    grep -o '<link rel="stylesheet" href="https://fonts.googleapis.com[^>]*>' "$dir/index.html" | head -1
    echo '<style>'
    cat "$dir/assets/css/style.css"
    echo '</style>'
    sed -n '/ARTIFACT:BODY:START/,/ARTIFACT:BODY:END/p' "$dir/index.html"
    echo '<script>'
    cat "$dir/assets/js/app.js"
    echo '</script>'
  } > "$out"
  echo "→ dist/$2.html ($(wc -c < "$out") octets)"
}

case "${1:-all}" in
  v1)  build "v1" "tbconnect-v1" ;;
  v2)  build "."  "tbconnect-v2" ;;
  all) build "."  "tbconnect-v2"; build "v1" "tbconnect-v1" ;;
  *)   echo "usage: $0 [v1|v2|all]" >&2; exit 1 ;;
esac
