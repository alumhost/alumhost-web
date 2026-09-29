# DESIGN.md: Patio

## Lectura del brief
Web de producto para estudiantes y devs en España que buscan un VPS o web estática barata con ayuda humana.
Astro + CSS nativo, sin librerías. Dials: VARIANCE 8 · MOTION 3 · DENSITY 4.
Regla del cliente (Blas): nada que se lea como "diseño de IA genérico". Ante la duda, se corta lo genérico.

## Por qué hubo un rediseño (v1 → v2)
La v1 (cristal por todas partes, píldoras, bento, tres tarjetas de precio con la del medio "recomendada", eyebrow, palabra
clave en azul) era la plantilla estándar con otra paleta. La v2 parte del vocabulario del sitio, Sevilla, y elimina los
"tells" de IA documentados (ver lista más abajo).

## Concepto: azulejo sevillano
Una web hecha de baldosas: bandas de color a sangre (añil, albero), reglas gruesas como juntas de azulejo, una cenefa
de baldosas que divide secciones, y un estanque de patio (luz cáustica) solo en el hero.
Descartado a propósito: negro con neón, crema con serif y terracota (#D97757 es el acento de Claude, delata), look periódico
de reglas finas, degradados morados/azules, cristal por reflejo.

## Tokens (fuente: `src/styles/tokens.css`)
| Nombre | Día | Noche | Rol |
|---|---|---|---|
| cal | `#EFF1EE` | `#0A1030` | fondo (gris verdoso frío, no crema) |
| cal-hondo | `#E0E4DF` | `#131B48` | panel del formulario |
| tinta | `#0E1740` | `#EEF0FB` | texto y reglas |
| pizarra | `#465078` | `#A6AED0` | texto secundario |
| anil | `#1A2A8C` | `#23369F` | banda principal (hero, pie), botones sobre cal |
| albero | `#E0AE35` | igual | banda secundaria, botón sobre añil, selección |
| almagra | `#A3271C` | `#FF9584` | SOLO lo negado (tachado) y errores |
| pool-* | azules del estanque | | solo dentro del shader del hero |

Colores fijos (no cambian en noche): `--ink`, `--white`, `--albero`. Las bandas `.band-anil` y `.band-albero` redefinen
`--btn-*`, `--link`, `--focus`, `--muted` y `--rule`, así que cualquier botón, enlace o regla dentro funciona sin estilos extra.
Contraste medido por `scripts/contrast.py` (falla el preflight si baja).

## Tipografía
- Display: **Archivo** variable con eje de ancho (`font-stretch` 68 %), peso 800. Titulares enormes, condensados. Es la voz de la web.
- Texto: **IBM Plex Sans** 400/600. Sobrio a propósito: toda la personalidad va en el titular.
- Técnico: **IBM Plex Mono** para specs, correos, scripts.
Escala: `--step-5` (hero, hasta 10,5 rem) a `--step--1`. Autoalojadas con @fontsource.

## Formas
Todo es rectangular: radio 0 en botones, campos, paneles y bandas. Las reglas son de 2 px (`--rule`). Sin sombras.
El botón se invierte al pasar el ratón (relleno ↔ contorno). Los enlaces secundarios son texto subrayado grueso, no botón.

## Firma
1. **El estanque:** shader WebGL propio (luz cáustica) que vive SOLO dentro del hero añil, con los azules del agua.
   Se pausa con pestaña oculta, un solo fotograma con reduced-motion, gradiente CSS si no hay WebGL.
2. **La cenefa:** cinta de baldosas alternas (SVG en línea) que separa el hero del resto y el resto del pie.
El único elemento de cristal de toda la web es el selector de plan, flotando sobre el agua.

## Layout
```
HOME
[nav plano pegado + regla 2px: marca (mayúsculas condensadas) · Planes · Contacto · ES/EN · Reservar plaza]
[HERO añil + agua: H1 a cartel (a sangre) | lead + CTA + estado  ·  selector de plan de cristal]
[cenefa]
[Cómo trabajamos: libro de filas con regla; la primera fila es enorme; scripts reales en la última]
[Así empiezas: banda albero, tres verbos gigantes (Elige / Reserva / Arranca) sin numerar]
[Lo que no te vamos a prometer: rejilla 2x2, cada promesa negada va TACHADA en almagra]
[cierre: titular enorme + CTA]
[cenefa] [pie añil con el nombre gigante]

PLANES
[H1 + lead + interruptor anual/mensual (marco rectangular)]
[una FILA ancha por plan (nombre | specs | precio + CTA); el recomendado va en banda albero a sangre]
[extras: 2 columnas con regla] [preguntas: lista con regla, un <details> por pregunta]

CONTACTO
[izq sticky: H1 enorme + canales como lista con regla | der: formulario cuadrado con Turnstile]
```
Móvil (<768px): todo a una columna, nav a menú desplegable.

## Movimiento
Solo la entrada de los titulares del hero (y cabeceras de página): subida corta con escalonado. Nada de "fade-in-up" en
cada bloque. Hover: inversión de botón, subrayado que engorda. Todo desactivado con `prefers-reduced-motion`.

## Lista anti-IA (comprobar antes de dar por buena cualquier pantalla)
Fuentes: skill frontend-design, avoid-ai-design (funboy322), guías de "AI slop" 2026.
- Tipografía: nada de Inter/Roboto/Space Grotesk/Geist/Bricolage por defecto. Hay un par elegido y con ancho variable.
- Color: sin degradado morado→azul, sin texto con degradado, sin `blue-600`, sin crema+terracota, sin negro+neón.
- Layout: sin hero centrado, sin "hero + 3 tarjetas + CTA", sin bento, sin tres columnas de precio con badge "popular",
  sin footer de 4 columnas. Cada sección usa un tratamiento distinto.
- Componentes: sin `rounded-2xl shadow-lg` en todo, sin cristal por reflejo, sin icono dentro de cuadrado redondeado,
  sin píldora "eyebrow" sobre el titular, sin flechas pegadas a los botones.
- Movimiento: nada de la misma animación en todos los elementos.
- Numeración (01/02/03) solo si el orden importa, y aquí ni así hace falta.
- Copy: sin "eleva / sin fricción / potente". Frases cortas, concretas, con lo que de verdad hay.
