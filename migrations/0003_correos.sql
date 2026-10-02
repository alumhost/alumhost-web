-- Correos automáticos de Publish (02/10/2026): ciclo de confirmación anual de los Términos y aviso de graduación.
-- Aplicar con: npx wrangler d1 migrations apply alumhost-publish --remote   (ANTES de desplegar el Worker)

-- Idioma de los correos de cada sitio (el que eligió al pedir el enlace).
ALTER TABLE tokens ADD COLUMN lang TEXT NOT NULL DEFAULT 'es';
ALTER TABLE sites ADD COLUMN lang TEXT NOT NULL DEFAULT 'es';

-- Ciclo anual. status pasa a admitir 'inactive' (suspendido por inactividad; 'suspended' sigue siendo por abuso).
--   confirmed_at  última vez que confirmó o abrió su enlace (NULL = nunca; cuenta created_at)
--   notice_at     cuándo se envió el aviso anual en curso (NULL = sin aviso pendiente)
--   reminders     recordatorios enviados del aviso o de la suspensión en curso
--   inactive_at   cuándo se suspendió por inactividad
ALTER TABLE sites ADD COLUMN confirmed_at INTEGER;
ALTER TABLE sites ADD COLUMN notice_at INTEGER;
ALTER TABLE sites ADD COLUMN reminders INTEGER NOT NULL DEFAULT 0;
ALTER TABLE sites ADD COLUMN inactive_at INTEGER;
CREATE INDEX sites_status ON sites(status, notice_at);

-- Enlaces de confirmación: solo sirven para confirmar (no dan acceso al sitio). Se guarda el SHA-256, nunca el token.
CREATE TABLE confirms (
  hash        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  expires_at  INTEGER NOT NULL
);
CREATE INDEX confirms_name ON confirms(name);

-- Registro de correos que no deben repetirse (acuse del formulario una vez al día, aviso de graduación una vez al año).
CREATE TABLE mail_log (
  email    TEXT NOT NULL,
  kind     TEXT NOT NULL,
  ref      TEXT NOT NULL,
  sent_at  INTEGER NOT NULL,
  PRIMARY KEY (email, kind, ref)
);
CREATE INDEX mail_log_sent ON mail_log(sent_at);
