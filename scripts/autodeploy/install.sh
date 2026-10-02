#!/usr/bin/env bash
# Instala el despliegue automático como timer de systemd del usuario actual (cada 30 s).
# Ejecutar en la máquina que despliega, desde la copia del repo:  bash scripts/autodeploy/install.sh
# Desinstalar:  systemctl --user disable --now alumhost-autodeploy.timer
set -euo pipefail
repo="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
node_bin="$(dirname "$(command -v node)")" || { echo "node no está en el PATH" >&2; exit 1; }
units="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
envfile="${XDG_CONFIG_HOME:-$HOME/.config}/alumhost-autodeploy.env"
mkdir -p "$units"

cat > "$units/alumhost-autodeploy.service" <<UNIT
[Unit]
Description=AlumHost: despliega origin/main si ha cambiado

[Service]
Type=oneshot
WorkingDirectory=$repo
Environment=PATH=$node_bin:/usr/local/bin:/usr/bin:/bin
Environment=REPO_DIR=$repo
EnvironmentFile=-$envfile
ExecStart=$repo/scripts/autodeploy/autodeploy.sh
TimeoutStartSec=15min
UNIT

cat > "$units/alumhost-autodeploy.timer" <<UNIT
[Unit]
Description=AlumHost: comprobar main cada 30 s

[Timer]
OnBootSec=1min
OnUnitInactiveSec=30s
AccuracySec=5s

[Install]
WantedBy=timers.target
UNIT

if [ ! -e "$envfile" ]; then
  umask 077
  printf '# Token de Cloudflare para desplegar sin `wrangler login` (ver scripts/autodeploy/README.md)\n#CLOUDFLARE_API_TOKEN=\n#CLOUDFLARE_ACCOUNT_ID=\n' > "$envfile"
fi

systemctl --user daemon-reload
systemctl --user enable --now alumhost-autodeploy.timer
# Sin linger, los timers de usuario se paran al cerrar la sesión SSH.
loginctl enable-linger "$USER" 2>/dev/null || sudo loginctl enable-linger "$USER"
echo "Instalado. Estado:  systemctl --user list-timers alumhost-autodeploy.timer"
echo "Log:               journalctl --user -u alumhost-autodeploy -f   (o ~/.local/state/alumhost-autodeploy/autodeploy.log)"
