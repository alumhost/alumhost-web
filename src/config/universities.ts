/**
 * Universidades admitidas en Publish gratis. ES EL ÚNICO SITIO donde se añaden: el desplegable del formulario
 * (views/PublishView.astro) y la comprobación del Worker (worker/publish.ts) leen esta lista.
 *
 * Para añadir una universidad, copia una línea y cambia los tres campos:
 *   id      identificador corto, sin espacios ni tildes (no se muestra)
 *   name    nombre que sale en el desplegable (nombre propio: igual en español e inglés)
 *   domain  dominio del correo de los ALUMNOS, sin la @ (es lo que se autocompleta tras escribir el usuario)
 *
 * Un dominio por línea. Si una universidad tiene más de un dominio (por ejemplo, uno de alumnos y otro de personal),
 * añade una línea por dominio con un nombre distinto: "Universidad X (alumnos)" y "Universidad X (personal)".
 * Comprueba el dominio con un correo real de alumno antes de añadirlo: un dominio mal puesto bloquea a esa universidad.
 */
export interface University {
  id: string;
  name: string;
  domain: string;
}

export const universities: University[] = [
  { id: "us", name: "Universidad de Sevilla", domain: "alum.us.es" },
  // TODO(verificar): uloyola.es es el dominio institucional (inicio de sesión de Microsoft 365 de la universidad);
  // confirmar con el correo real de un alumno de Loyola que la dirección acaba así.
  { id: "loyola", name: "Universidad Loyola Andalucía", domain: "uloyola.es" },
];
