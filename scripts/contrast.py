"""Mide contrastes WCAG de los tokens de src/styles/tokens.css. Uso: python3 scripts/contrast.py"""
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
ok = True
for name, t in (("día", day), ("noche", night)):
    pairs = [(fg, bg) for fg in ("tinta", "pizarra", "azulejo", "error") for bg in ("cal", "cal-hondo")]
    pairs.append(("sobre-azulejo", "azulejo"))
    for fg, bg in pairs:
        r = ratio(t[fg], t[bg])
        ok &= r >= 4.5
        print(f"{name:6} {fg:14} sobre {bg:10} {r:5.2f} {'OK' if r >= 4.5 else 'FALLA'}")
raise SystemExit(0 if ok else 1)
