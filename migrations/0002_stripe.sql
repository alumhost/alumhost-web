-- Stripe (rama de prueba): idempotencia por event.id y por clave de negocio (suscripción).
CREATE TABLE IF NOT EXISTS stripe_events (
  event_id   TEXT PRIMARY KEY,
  type       TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS stripe_provisions (
  subscription_id TEXT PRIMARY KEY,
  first_event     TEXT NOT NULL,
  created_at      INTEGER NOT NULL
);
