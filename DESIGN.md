# DESIGN.md: Patio

## Lectura del brief
Landing de producto para estudiantes y devs en España que buscan un VPS o web estática barata con ayuda humana.
Lenguaje: liquid glass claro, fluido, cercano. Implementación: Astro + CSS nativo, sin librerías.
Dials (taste-skill): VARIANCE 7 · MOTION 5 · DENSITY 4.

## Concepto
Un patio sevillano a mediodía: paredes encaladas, azulejo cobalto y la luz del agua de la fuente
reflejándose en las paredes. En la web: fondo blanco-cal frío, paneles de cristal que dejan pasar
una luz cáustica animada (la "fuente"), y un único acento azulejo para todo lo que se pulsa.
La metáfora encaja con el producto: un patio es un espacio compartido donde cada vecino tiene su casa
(multi-tenant aislado) y todos se conocen (soporte cercano).

Descartado a propósito: fondo negro con neón, crema con serif y terracota, look periódico con reglas finas.

## Tokens
| Nombre | Claro | Oscuro ("noche") | Rol |
|---|---|---|---|
| cal | `#F2F4F6` | `#0D1620` | fondo |
| cal-hondo | `#E4E9EF` | `#16222E` | superficies secundarias |
| tinta | `#13202C` | `#E7EDF3` | texto principal |
| pizarra | `#4B5B6B` | `#9DACBB` | texto secundario (≥4.5:1) |
| azulejo | `#2447B5` | `#8AA6FF` | acento único: CTAs, enlaces, foco |
| agua | `#8CCBE0` | `#2C6F8C` | solo en la luz cáustica de fondo, nunca en UI |

Cristal: fondo `rgb(255 255 255 / .55)` (oscuro `rgb(20 34 48 / .55)`), `backdrop-filter: blur(18px) saturate(160%)`,
borde 1px blanco translúcido, brillo interior superior, sombra teñida de azul. Sin `backdrop-filter` o con
`prefers-reduced-transparency`: relleno sólido `cal-hondo`.
Nota honesta: Apple Liquid Glass no tiene implementación web oficial; esto es una aproximación con CSS.

## Tipografía
- Display: **Bricolage Grotesque** (variable, opsz). Solo H1, H2 y precios. Tracking negativo.
- Texto: **Geist** (variable).
- Técnico: **Geist Mono** para specs (vCPU, RAM, comandos).
Autoalojadas con @fontsource (sin Google Fonts en producción).

## Radios (regla única)
Paneles de cristal 28px · tarjetas internas 18px · inputs 12px · botones y chips: pill.

## Firma
La luz cáustica animada detrás de los cristales (shader WebGL pequeño, se pausa fuera de pantalla,
con pestaña oculta y con reduced-motion; si no hay WebGL, gradiente estático).
Además, reflejo especular en el cristal que sigue al puntero (variables CSS, sin listeners de scroll).

## Layout
```
HOME
[nav cristal flotante: marca · Planes · Contacto · ES/EN · Reservar plaza]
[hero: H1 + sub + CTA (izq) | selector de plan real en cristal (der)]
[bento 4 celdas asimétricas: soporte humano (grande) · TFG/TFM · correo universitario · en abierto]
[cómo funciona: 3 pasos reales en fila horizontal con verbo]
[lo que no somos: lista honesta en 2 columnas]
[cierre beta: panel de cristal ancho con CTA]
[footer]

PLANES
[cabecera + interruptor anual/mensual]
[3 planes en grid 1fr 1.25fr 1fr, destacado el central]
[add-ons: backup, IPv4 dedicada]
[preguntas: 2 columnas de <details>]

CONTACTO
[izq: canales directos + tiempos de respuesta | der: formulario en cristal con Turnstile]
```
Móvil (<768px): todo a una columna, nav a menú desplegable.

## Movimiento
Entrada del hero escalonada (opacidad + translate). Revelado al entrar en viewport con IntersectionObserver.
Pulsación táctil en botones (`scale(.98)`). Curva `cubic-bezier(.16,1,.3,1)`. Todo desactivado con reduced-motion.
