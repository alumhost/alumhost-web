-- Endurecimiento de Publish (auditoría 30/09/2026).
-- Cada despliegue en curso guarda el correo que lo abrió: así nadie con un enlace para el mismo nombre libre
-- puede usar ni borrar el despliegue de otra persona, y un correo no puede abrir despliegues con varios nombres.
ALTER TABLE deploys ADD COLUMN email TEXT NOT NULL DEFAULT '';
CREATE INDEX deploys_email ON deploys(email, created_at);
CREATE INDEX deploys_name ON deploys(name);
CREATE INDEX deploys_created ON deploys(created_at);
-- Despliegues previos a este cambio (sin correo): se descartan con sus trozos, salvo la versión activa de cada sitio.
DELETE FROM blobs WHERE (site, version) IN (SELECT name, version FROM deploys WHERE email = '')
  AND version != COALESCE((SELECT version FROM sites WHERE sites.name = blobs.site), '');
DELETE FROM deploys WHERE email = '';
