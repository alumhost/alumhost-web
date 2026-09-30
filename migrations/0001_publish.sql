-- Publish gratis (webs estáticas en <nombre>.alumhost.dev). Base de datos D1 "alumhost-publish".
-- Aplicar con: npx wrangler d1 migrations apply alumhost-publish --remote

-- Un sitio por fila. version = versión activa (sus archivos están en la tabla blobs).
CREATE TABLE sites (
  name        TEXT PRIMARY KEY,
  email       TEXT NOT NULL,
  version     TEXT,
  source      TEXT,            -- "zip", "folder" o "github:<owner>/<repo>@<rama>:<carpeta>"
  files       INTEGER NOT NULL DEFAULT 0,
  bytes       INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'active',   -- active | suspended (abuso)
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX sites_email ON sites(email);

-- Enlaces mágicos: solo se guarda el SHA-256 del token, nunca el token.
CREATE TABLE tokens (
  hash        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL
);
CREATE INDEX tokens_email ON tokens(email, created_at);

-- Despliegue en curso: lista de archivos esperados (JSON) hasta que se confirma.
CREATE TABLE deploys (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  version     TEXT NOT NULL,
  source      TEXT NOT NULL,
  manifest    TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);

-- Archivos de las webs, en trozos de 1 MB (D1 admite filas de hasta 2 MB). Sin tarjeta, sin R2.
CREATE TABLE blobs (
  site        TEXT NOT NULL,
  version     TEXT NOT NULL,
  path        TEXT NOT NULL,
  chunk       INTEGER NOT NULL,
  data        BLOB NOT NULL,
  PRIMARY KEY (site, version, path, chunk)
);
