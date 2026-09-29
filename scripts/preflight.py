"""Pre-flight antes de dar algo por terminado. Uso: npm run preflight  (requiere npm run build antes)
Comprueba: guiones largos en texto, enlaces internos rotos, enlaces a "#", y contraste de tokens."""
import pathlib, re, subprocess, sys

root = pathlib.Path(__file__).resolve().parents[1]
dist = root / "dist"
fail = False

dashes = [f"{f.relative_to(root)}:{i}" for base in ("src", "worker", "dist") for f in (root / base).rglob("*")
          if f.is_file() and f.suffix in {".html", ".ts", ".astro", ".css", ".js"}
          for i, line in enumerate(f.read_text(errors="ignore").splitlines(), 1) if "—" in line or "–" in line]
print("guiones largos:", dashes or "0"); fail |= bool(dashes)

broken, hashes = set(), 0
for f in dist.rglob("*.html"):
    html = f.read_text()
    hashes += html.count('href="#"')
    for h in re.findall(r'href="(/[^"#?]*)', html):
        t = dist / h.lstrip("/")
        if not (t.is_file() or (t / "index.html").is_file()):
            broken.add(h)
print("enlaces rotos:", sorted(broken) or "0", "| href=#:", hashes); fail |= bool(broken) or hashes > 0

fail |= subprocess.run([sys.executable, str(root / "scripts/contrast.py")], capture_output=True).returncode != 0
print("contraste:", "ver scripts/contrast.py")
sys.exit(1 if fail else 0)
