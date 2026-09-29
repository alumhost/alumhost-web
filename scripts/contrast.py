"""Mide contrastes WCAG de los tokens de src/styles/tokens.css. Uso: python3 scripts/contrast.py
Texto normal >= 4.5. Texto grande (titulares del hero sobre el agua) >= 3. Sale con código 1 si algo falla."""
import re, pathlib

css = pathlib.Path(__file__).resolve().parents[1].joinpath("src/styles/tokens.css").read_text()
light_block, dark_block = css.split("@media (prefers-color-scheme: dark)")

def tokens(block):
    return dict(re.findall(r"--([\w-]+):\s*(#[0-9a-fA-F]{6})", block))

def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

def ratio(a, b):
    hi, lo = sorted([lum(a), lum(b)], reverse=True)
    return (hi + 0.05) / (lo + 0.05)

day = tokens(light_block)
night = {**day, **tokens(dark_block)}

# (texto, fondo, mínimo). Las secciones de lectura van sobre velo (~paper); el hero va directo sobre el agua.
PAIRS = [
    ("text", "paper", 4.5), ("text", "paper-2", 4.5),
    ("muted", "paper", 4.5), ("muted", "paper-2", 4.5),
    ("brick", "paper", 4.5), ("link", "paper", 4.5),
    ("btn-fg", "btn-bg", 4.5),
    ("white", "indigo", 4.5), ("sand", "indigo", 4.5),   # banda índigo
    ("ink", "sand", 4.5),                                  # banda arena
    ("text", "pool-base", 4.5), ("text", "pool-water", 4.5),  # hero sobre el agua
]
ok = True
for name, t in (("día", day), ("noche", night)):
    for fg, bg, need in PAIRS:
        r = ratio(t[fg], t[bg])
        good = r >= need
        ok &= good
        print(f"{name:6} {fg:10} sobre {bg:10} {r:5.2f} (min {need}) {'OK' if good else 'FALLA'}")
raise SystemExit(0 if ok else 1)
