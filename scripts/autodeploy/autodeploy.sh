#!/usr/bin/env bash
# Despliegue automático de main a producción (alumhost.dev). Pensado para ejecutarse cada 30 s (timer de systemd).
# Si origin/main no ha cambiado desde el último despliegue, sale sin hacer nada. Si ha cambiado:
#   1. avanza la copia local a origin/main (solo fast-forward; si hay cambios locales, se para)
#   2. mira qué migraciones de migrations/ faltan en la D1 remota; si alguna borra o reescribe datos, se para
#   3. npm ci (si cambió package-lock.json) y npm run build
#   4. aplica las migraciones pendientes (solo aditivas) y despliega los Workers alumhost-web y alumhost-sites
# Un commit que falla no se reintenta cada 30 s: se espera al siguiente commit en main (o a borrar el estado).
#
# Uso: scripts/autodeploy/autodeploy.sh            (normal)
#      DRY_RUN=1 scripts/autodeploy/autodeploy.sh  (hace todo menos migrar y desplegar)
# Variables opcionales: REPO_DIR, BRANCH (main), DB_NAME (alumhost-publish), STATE_DIR.
# Credenciales: CLOUDFLARE_API_TOKEN (y CLOUDFLARE_ACCOUNT_ID) en el entorno, o la sesión de `npx wrangler login`.
set -euo pipefail

REPO_DIR="${REPO_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
BRANCH="${BRANCH:-main}"
DB_NAME="${DB_NAME:-alumhost-publish}"
STATE_DIR="${STATE_DIR:-${XDG_STATE_HOME:-$HOME/.local/state}/alumhost-autodeploy}"
DRY_RUN="${DRY_RUN:-0}"
LOG="$STATE_DIR/autodeploy.log"
export CI=1 WRANGLER_SEND_METRICS=false   # wrangler sin preguntas interactivas

mkdir -p "$STATE_DIR"
log() { printf '%s %s\n' "$(date '+%F %T')" "$*" | tee -a "$LOG"; }
# Ejecuta un comando guardando su salida en el log; si falla, enseña el final.
run() {
  log "\$ $*"
  local out rc=0
  out="$("$@" 2>&1)" || rc=$?
  printf '%s\n' "$out" >> "$LOG"
  if [ "$rc" -ne 0 ]; then printf '%s\n' "$out" | tail -n 30; log "ERROR ($rc): $*"; fi
  return "$rc"
}

# Un solo despliegue a la vez (el timer no solapa, pero alguien puede lanzarlo a mano).
exec 9>"$STATE_DIR/lock"
flock -n 9 || exit 0

cd "$REPO_DIR"
git fetch --quiet origin "$BRANCH"
target="$(git rev-parse "origin/$BRANCH")"
last="$(cat "$STATE_DIR/last-deployed" 2>/dev/null || true)"
[ "$target" = "$last" ] && exit 0
# Commit ya fallido o bloqueado: no se reintenta hasta que llegue otro commit.
[ "$target" = "$(cat "$STATE_DIR/failed" 2>/dev/null || true)" ] && exit 0

short="${target:0:7}"
fail() { log "FALLO en $short: $*. No se despliega; se reintentará con el próximo commit en $BRANCH."; echo "$target" > "$STATE_DIR/failed"; exit 1; }

# Mientras está bloqueado por una migración se comprueba en cada ciclo, pero sin repetir el log.
[ "$target" = "$(cat "$STATE_DIR/blocked" 2>/dev/null || true)" ] || log "== $BRANCH tiene $short: $(git log -1 --format=%s "$target")"

# 1. Copia local = origin/main, sin pisar nada.
[ "$(git rev-parse --abbrev-ref HEAD)" = "$BRANCH" ] || fail "la copia en $REPO_DIR no está en la rama $BRANCH"
if ! git diff --quiet || ! git diff --cached --quiet; then fail "hay cambios locales sin commit en $REPO_DIR"; fi
prev="$(git rev-parse HEAD)"
git merge --quiet --ff-only "origin/$BRANCH" || fail "la rama local se ha separado de origin/$BRANCH (no es fast-forward)"

# 2. Migraciones pendientes = archivos de migrations/ que no están en la tabla d1_migrations de la D1 remota.
applied_json="$(npx wrangler d1 execute "$DB_NAME" --remote --json --command "SELECT name FROM d1_migrations" 2>&1)" || {
  if grep -qi "no such table" <<<"$applied_json"; then applied_json='[{"results":[]}]'
  else printf '%s\n' "$applied_json" >> "$LOG"; fail "no se pudo leer d1_migrations de $DB_NAME (¿credenciales de Cloudflare?)"; fi
}
applied="$(node -e '
  const out = JSON.parse(require("fs").readFileSync(0, "utf8"));
  for (const r of out.flatMap(x => x.results || [])) console.log(r.name);
' <<<"$applied_json")" || fail "respuesta inesperada de wrangler al leer d1_migrations"

pending=()
for f in migrations/*.sql; do
  [ -e "$f" ] || continue
  grep -qxF "$(basename "$f")" <<<"$applied" || pending+=("$f")
done

# Solo se aplican solas las migraciones que añaden (CREATE, ALTER TABLE ... ADD, INSERT, índices).
# Cualquier DROP, DELETE, UPDATE, TRUNCATE, REPLACE o RENAME (fuera de comentarios y de ON DELETE/ON UPDATE)
# para el despliegue: esa migración se revisa y se aplica a mano, y en el siguiente ciclo ya no está pendiente.
destructive=()
for f in "${pending[@]}"; do
  if sed -e 's/--.*$//' "$f" | tr '\n' ' ' | sed -E 's#/\*([^*]|\*+[^*/])*\*+/##g; s/\bON[[:space:]]+(DELETE|UPDATE)\b//Ig' \
     | grep -qiE '\b(DROP|DELETE|UPDATE|TRUNCATE|REPLACE|RENAME)\b'; then
    destructive+=("$f")
  fi
done
if [ "${#destructive[@]}" -gt 0 ]; then
  # Se vuelve a mirar en cada ciclo (sin marcar el commit como fallido): en cuanto se aplique a mano, sigue solo.
  git reset --quiet --hard "$prev"
  if [ "$(cat "$STATE_DIR/blocked" 2>/dev/null || true)" != "$target" ]; then
    log "PARADO en $short: migración que puede borrar o cambiar datos: ${destructive[*]}"
    log "  Revísala y aplícala a mano:  npx wrangler d1 migrations apply $DB_NAME --remote"
    echo "$target" > "$STATE_DIR/blocked"
    exit 1
  fi
  exit 0
fi
rm -f "$STATE_DIR/blocked"
[ "${#pending[@]}" -gt 0 ] && log "migraciones pendientes: ${pending[*]}"

# 3. Dependencias y build. Si el build falla, no se toca producción.
if [ ! -d node_modules ] || ! git diff --quiet "$prev" HEAD -- package-lock.json; then
  run npm ci --no-audit --no-fund || fail "npm ci"
fi
run npm run build || fail "npm run build"

if [ "$DRY_RUN" = 1 ]; then
  log "DRY_RUN: build OK; ni migraciones ni despliegue. Se deja la copia local en $short."
  exit 0
fi

# 4. Migraciones (antes que el código nuevo, que puede necesitarlas; al ser aditivas el código viejo sigue bien).
if [ "${#pending[@]}" -gt 0 ]; then
  # Punto de Time Travel de D1 por si hubiera que volver atrás: npx wrangler d1 time-travel restore <db> --bookmark=<...>
  bookmark="$(npx wrangler d1 time-travel info "$DB_NAME" --json 2>/dev/null | node -e '
    try { console.log(JSON.parse(require("fs").readFileSync(0, "utf8")).bookmark || "") } catch { console.log("") }')" || true
  log "bookmark de D1 antes de migrar: ${bookmark:-desconocido}"
  run npx wrangler d1 migrations apply "$DB_NAME" --remote || fail "wrangler d1 migrations apply"
fi

run npx wrangler deploy || fail "wrangler deploy (alumhost-web)"
# El Worker de los sitios solo cambia si cambia sites/ (o en el primer despliegue).
if [ -z "$last" ] || ! git diff --quiet "$last" HEAD -- sites/ 2>/dev/null; then
  run npx wrangler deploy -c sites/wrangler.jsonc || fail "wrangler deploy -c sites/wrangler.jsonc (alumhost-sites)"
fi

echo "$target" > "$STATE_DIR/last-deployed"
rm -f "$STATE_DIR/failed"
log "OK: desplegado $short"
