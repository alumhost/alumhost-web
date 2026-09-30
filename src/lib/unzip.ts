/**
 * Lector de ZIP mínimo para el navegador (Publish). Sin dependencias: usa DecompressionStream("deflate-raw").
 * Soporta los métodos 0 (sin comprimir) y 8 (deflate), que es lo que generan Windows, macOS y los zip de GitHub.
 * No soporta ZIP64 ni archivos cifrados: devuelve un error claro en ese caso.
 */
export interface ZipEntry {
  path: string;
  size: number;
  read: () => Promise<Blob>;
}

const u16 = (v: DataView, o: number) => v.getUint16(o, true);
const u32 = (v: DataView, o: number) => v.getUint32(o, true);

export async function readZip(file: Blob): Promise<ZipEntry[]> {
  // El directorio central está al final: leemos los últimos 64 KB + 22 bytes para encontrar su registro final.
  const tailLen = Math.min(file.size, 65_557);
  const tail = new DataView(await file.slice(file.size - tailLen).arrayBuffer());
  let eocd = -1;
  for (let i = tailLen - 22; i >= 0; i--) if (u32(tail, i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error("not_zip");
  const count = u16(tail, eocd + 10);
  const cdSize = u32(tail, eocd + 12);
  const cdOffset = u32(tail, eocd + 16);
  if (cdOffset === 0xffffffff || count === 0xffff) throw new Error("zip64");

  const cd = new DataView(await file.slice(cdOffset, cdOffset + cdSize).arrayBuffer());
  const dec = new TextDecoder();
  const out: ZipEntry[] = [];
  let p = 0;
  for (let n = 0; n < count; n++) {
    if (u32(cd, p) !== 0x02014b50) throw new Error("bad_zip");
    const flags = u16(cd, p + 8);
    const method = u16(cd, p + 10);
    const csize = u32(cd, p + 20);
    const size = u32(cd, p + 24);
    const nameLen = u16(cd, p + 28);
    const extraLen = u16(cd, p + 30);
    const commentLen = u16(cd, p + 32);
    const local = u32(cd, p + 42);
    const path = dec.decode(new Uint8Array(cd.buffer, cd.byteOffset + p + 46, nameLen));
    p += 46 + nameLen + extraLen + commentLen;
    if (path.endsWith("/")) continue; // carpeta
    if (flags & 1) throw new Error("encrypted");
    if (method !== 0 && method !== 8) throw new Error("method");
    out.push({
      path,
      size,
      read: async () => {
        const lh = new DataView(await file.slice(local, local + 30).arrayBuffer());
        if (u32(lh, 0) !== 0x04034b50) throw new Error("bad_zip");
        const start = local + 30 + u16(lh, 26) + u16(lh, 28);
        const raw = file.slice(start, start + csize);
        if (method === 0) return raw;
        const stream = raw.stream().pipeThrough(new DecompressionStream("deflate-raw"));
        return new Response(stream).blob();
      },
    });
  }
  return out;
}

/** Quita basura de sistema (macOS, Windows) y, si todo cuelga de una sola carpeta, la quita del principio. */
export function tidyPaths<T extends { path: string }>(items: T[]): T[] {
  const junk = (p: string) => /(^|\/)(__MACOSX|\.DS_Store|Thumbs\.db|desktop\.ini)(\/|$)/i.test(p);
  let list = items.filter((i) => !junk(i.path)).map((i) => ({ ...i, path: i.path.replace(/\\/g, "/").replace(/^\/+/, "") }));
  const tops = new Set(list.map((i) => i.path.split("/")[0]));
  if (tops.size === 1 && list.every((i) => i.path.includes("/")) && !list.some((i) => i.path === "index.html")) {
    const top = [...tops][0] + "/";
    list = list.map((i) => ({ ...i, path: i.path.slice(top.length) }));
  }
  return list;
}
