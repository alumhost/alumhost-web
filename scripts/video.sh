#!/usr/bin/env bash
# Prepara el vídeo de la portada (motion graphics) a partir del render original.
# Uso: bash scripts/video.sh ruta/al/render.mp4 [segundo_del_poster]
# Genera public/video/alumhost.{mp4,webm} y alumhost-poster.jpg. Cloudflare Static Assets
# no admite archivos de más de 25 MiB: el script falla si alguno se pasa.
set -euo pipefail
src="${1:?falta el vídeo de origen}"
at="${2:-3}"
out="public/video"
mkdir -p "$out"
# H.264 + AAC para Safari y cualquier navegador; faststart para que empiece antes de bajarlo entero.
ffmpeg -y -loglevel error -i "$src" -vf "scale=-2:1080" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -movflags +faststart "$out/alumhost.mp4"
# VP9 + Opus: más ligero en Chrome y Firefox.
ffmpeg -y -loglevel error -i "$src" -vf "scale=-2:1080" -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 \
  -c:a libopus -b:a 112k "$out/alumhost.webm"
ffmpeg -y -loglevel error -ss "$at" -i "$src" -frames:v 1 -vf "scale=-2:1080" -q:v 4 "$out/alumhost-poster.jpg"
for f in "$out"/alumhost.*; do
  size=$(stat -c %s "$f")
  printf '%-32s %6.1f MiB\n' "$f" "$(echo "$size/1048576" | bc -l)"
  [ "$size" -lt 26214400 ] || { echo "ERROR: $f supera 25 MiB (límite de Static Assets). Sube -crf." >&2; exit 1; }
done
