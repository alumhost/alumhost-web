# Pruebas de extremo a extremo de Publish y del formulario de contacto

`publish-e2e.mjs` ejecuta los Workers reales (`worker/`, `sites/`) contra un SQLite en memoria con las migraciones
de `migrations/` (misma sintaxis que D1) y simula Turnstile, Brevo y GitHub. Cubre los fallos de la auditoría del
30/09/2026: token de otra persona, carreras en `finish`, despliegues ajenos, suspensión, cuerpos sin content-length,
service workers, tipos de contenido y el correo de contacto.

Node 22 no resuelve imports sin extensión ni `cloudflare:email`, así que se copia el código a una carpeta temporal:

```bash
T=$(mktemp -d); mkdir -p $T/worker $T/sites $T/migrations $T/src/config
cp worker/*.ts $T/worker/; cp sites/index.ts $T/sites/; cp src/config/universities.ts $T/src/config/; cp migrations/*.sql $T/migrations/; cp scripts/tests/publish-e2e.mjs $T/run.mjs
echo 'export class EmailMessage { constructor(f,t,r){this.from=f;this.to=t;this.raw=r;} }' > $T/worker/cf-email.ts
sed -i -E 's#from "(\./[a-z-]+)"#from "\1.ts"#; s#from "(\.\./worker/[a-z-]+)"#from "\1.ts"#; s#from "(\.\./src/config/[a-z-]+)"#from "\1.ts"#; s#from "cloudflare:email"#from "./cf-email.ts"#' $T/worker/*.ts $T/sites/index.ts
(cd $T && node --experimental-strip-types run.mjs)
```

Si la rama tiene migraciones de Stripe, el script solo carga 0001 y 0002 (las de Publish).
