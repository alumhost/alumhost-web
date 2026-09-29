# DESIGN.md: AlumHost

## Brief
Web de producto de un hosting boutique (web estática + VPS) para estudiantes y desarrolladores. Un solo trabajo: que reserven
plaza en la beta. Astro + CSS nativo, sin librerías. Regla del cliente: nada que se lea como "diseño genérico de IA".

## Historia (para no repetirla)
- v1 cristal claro (`design/originalConcept`): gustó el agua, el cristal y el reflejo del ratón; sobraban rasgos de plantilla.
- v2 baldosas (`design/sevillian-tile-ui`): gustaron la estructura, la tipografía y los patrones; era demasiado regional.
- **v3 híbrida (`design/hybrid`, elegida):** lo mejor de las dos.

## Concepto: módulos sobre el agua
La baldosa es una unidad rígida y modular, como un VPS: cada cliente tiene la suya. El agua es lo fluido: la red, la nube.
Lo rígido flota sobre lo fluido. Nada regional: la geometría es abstracta e internacional.

## Capas (de atrás adelante)
1. **Agua** (`Caustics.astro`): shader WebGL propio a pantalla completa, fijo. 0.5x, 30 fps, pausa en pestaña oculta,
   un fotograma con reduced-motion, gradiente CSS sin WebGL.
2. **Hero y cabeceras**: directamente sobre el agua (titular a cartel en `--text`).
3. **Velo** (`.veil`): capa translúcida en las secciones de lectura; el agua se intuye y el texto se lee.
4. **Baldosas** (`.band-indigo`, `.band-sand`): bandas opacas a sangre. Redefinen botones, enlaces y reglas.
5. **Cristal** (`.glass`): SOLO en lo que flota: nav, selector de plan del hero, interruptor anual/mensual y plan
   recomendado. Reflejo que sigue al puntero (script en `Base.astro`). Sólido con reduced-transparency.

## Tokens (fuente: `src/styles/tokens.css`)
| Nombre | Día | Noche | Rol |
|---|---|---|---|
| paper / paper-2 | `#EEF2F6` / `#DFE6EF` | `#0A1030` / `#131B48` | velo y panel del formulario |
| text | `#0D1640` | `#EEF1FB` | texto y reglas |
| muted | `#34406A` | `#B3BBDC` | texto secundario |
| indigo | `#1B2C95` | `#24389F` | banda principal, pie, botón de día |
| sand | `#E6B53E` | igual | banda de cierre, botón de noche, acentos |
| brick | `#A3271C` | `#FF9584` | SOLO lo tachado y los errores |
| pool-* | azules del agua | | solo dentro del shader |
Contraste medido por `scripts/contrast.py` (lo ejecuta `npm run preflight`).

## Tipografía
Archivo variable con eje de ancho (68-78 %, peso 800) para titulares, precios y verbos. IBM Plex Sans para texto,
IBM Plex Mono para specs, correos y scripts. Autoalojadas con @fontsource.

## Formas y patrones
- Baldosas, botones, campos y bandas: esquinas rectas, reglas de 2 px, sin sombras. Cristal: 16 px. Nunca cápsulas.
- `TileStrip`: cinta de módulos (cuarto de círculo y rombo) que separa hero/contenido y contenido/pie; en vertical es el
  canto del plan recomendado. `TileMotif`: textura de cuartos de círculo al 9 % dentro de la banda índigo.
- Regla: el patrón es estructura, no papel pintado. Como máximo uno a la vista por pantalla.

## Layout
```
HOME   nav cristal · hero sobre agua (h1 a cartel | selector de cristal) · cinta · "Cómo trabajamos" (libro de filas,
       velo) · "Así empiezas" (verbos gigantes, banda índigo con textura) · "Lo que no te vamos a prometer" (tachado,
       velo) · cierre (banda arena) · cinta · pie índigo
PLANES cabecera sobre agua + interruptor de cristal · filas (una por plan; la recomendada flota con canto) ·
       "¿Necesitas otra cosa?" (presupuesto por correo) · extras · preguntas
CONTACTO velo: titular y canales | formulario   ·   PRIVACIDAD velo: titular fijo | secciones con regla
```

## Movimiento
Tres firmas: el agua, el reflejo del puntero y la entrada del titular de cada página. Nada más se anima al hacer scroll.

## Lista anti-IA (comprobar antes de dar por buena cualquier pantalla)
- Tipografía: nada de Inter, Roboto, Geist, Space Grotesk o Bricolage por defecto.
- Color: sin degradado morado, sin texto con degradado, sin crema+terracota, sin negro+neón.
- Layout: sin hero centrado, sin bento, sin tres tarjetas de precio con badge "popular", sin footer de 4 columnas.
- Componentes: sin cristal por reflejo (solo lo que flota), sin icono en cuadrado redondeado, sin píldora eyebrow,
  sin flechas pegadas a los botones, sin cápsulas.
- Movimiento: nunca la misma animación en todos los bloques.
- Copy: sin "eleva / sin fricción / potente". Frases cortas y concretas. Nada regional.
