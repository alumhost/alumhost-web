# Despliegue automático de `main`

Cada 30 s la máquina que despliega (hoy, la de Oracle) mira si `origin/main` ha cambiado. Si ha cambiado:
build, migraciones de D1 que solo añaden, `wrangler deploy` de `alumhost-web` y, si cambió `sites/`, de `alumhost-sites`.
Si no ha cambiado, no hace nada (un `git fetch` y fuera).

## Qué protege
- **Datos**: nunca borra ni resetea la base de datos. Solo aplica sola una migración pendiente si no contiene
  `DROP`, `DELETE`, `UPDATE`, `TRUNCATE`, `REPLACE` ni `RENAME` (se ignoran comentarios y `ON DELETE`/`ON UPDATE`).
  Si una la contiene, se para sin desplegar y lo escribe en el log; se revisa y se aplica a mano
  (`npx wrangler d1 migrations apply alumhost-publish --remote`) y en el siguiente ciclo sigue solo.
  Antes de migrar apunta en el log el *bookmark* de Time Travel de D1 para poder volver atrás.
- **Producción**: si el build falla, no se despliega nada y ese commit no se reintenta cada 30 s; se espera al siguiente.
- **Solapes**: un solo despliegue a la vez (`flock`).
- **La copia local**: si tiene cambios sin commit o se ha separado de `origin/main`, se para en vez de pisarla.

## Instalar (en la máquina que despliega, una vez)
```bash
cd ~/alumhost-web            # la copia del repo que ya se usa para desplegar, en la rama main
git pull
DRY_RUN=1 scripts/autodeploy/autodeploy.sh   # prueba: hace fetch, comprueba migraciones y build, sin desplegar
rm -rf ~/.local/state/alumhost-autodeploy     # olvida la prueba, para que el primer ciclo real despliegue
bash scripts/autodeploy/install.sh            # timer de systemd de usuario, activo desde ya
```
Credenciales: vale la sesión de `npx wrangler login` que ya hay en esa máquina. Si caduca, mejor un token:
crea uno en Cloudflare (My Profile → API Tokens) con *Workers Scripts: Edit*, *Workers Routes: Edit*, *D1: Edit* y
*Zone: Read* para alumhost.dev, y ponlo en `~/.config/alumhost-autodeploy.env` (`CLOUDFLARE_API_TOKEN=` y `CLOUDFLARE_ACCOUNT_ID=`).

## Día a día
```bash
journalctl --user -u alumhost-autodeploy -f          # en directo
tail -f ~/.local/state/alumhost-autodeploy/autodeploy.log
systemctl --user stop alumhost-autodeploy.timer      # pausar (start para reanudar)
systemctl --user disable --now alumhost-autodeploy.timer   # quitarlo
rm ~/.local/state/alumhost-autodeploy/failed         # reintentar ya un commit que falló
```

## Alternativa: GitHub Actions
Un workflow `on: push` a `main` haría lo mismo sin depender de que la máquina de Oracle esté encendida, con el log de
cada despliegue en la pestaña Actions y desplegando al momento (no a los 30 s). Necesita guardar `CLOUDFLARE_API_TOKEN`
y `CLOUDFLARE_ACCOUNT_ID` como secretos del repo. Es la opción más limpia a medio plazo; este script es para seguir
desplegando desde Oracle como hasta ahora.
