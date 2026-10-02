/**
 * Plantilla HTML común de los correos: misma marca que la web (noche, cinta de módulos, botón ámbar recto) sobre una
 * tarjeta clara para leer. Cada correo se escribe una vez como bloques y de ahí salen la versión HTML y la de texto.
 *
 * Reglas para que llegue a "Principal" y se vea bien en Gmail, Outlook y Apple Mail:
 *   - Tablas y estilos en línea (los clientes de correo ignoran casi todo el CSS). Ancho 560 px.
 *   - Solo dos imágenes (logo y cinta), servidas desde alumhost.dev/email/. Sin fotos ni ilustraciones grandes:
 *     cuanto más se parece a un boletín, más fácil que Gmail lo mande a Promociones.
 *   - Un solo botón por correo. Siempre con versión de texto (textContent) al lado.
 *   - Enlaces en los párrafos con la forma [texto](https://...). Todo lo demás se escapa.
 */
import type { Mail } from "./mail";

export type Lang = "es" | "en";

export interface Block {
  subject: string;
  /** Texto de vista previa que muestran los clientes junto al asunto. */
  preheader: string;
  title: string;
  /** Párrafos antes del botón. */
  body: string[];
  button?: { label: string; url: string };
  /** Párrafos después del botón (avisos, plazos). */
  after?: string[];
  /** Por qué recibe este correo (pie). */
  reason: string;
}

const ASSETS = "https://alumhost.dev/email";
const C = { night: "#0b1122", night2: "#141c36", ink: "#0a0f1e", body: "#2a3350", muted: "#a9b3d1", sand: "#f4b740", cobalt: "#2138ad", line: "#e3e7f2" };
const FONT_BODY = "'IBM Plex Sans',-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const FONT_DISPLAY = "Archivo,'Arial Narrow','Helvetica Neue',Arial,sans-serif";

const SIGN = {
  es: { text: "Un saludo,\nEl equipo de AlumHost\nhttps://alumhost.dev", html: "Un saludo,<br>El equipo de AlumHost" },
  en: { text: "Best,\nThe AlumHost team\nhttps://alumhost.dev", html: "Best,<br>The AlumHost team" },
};
const FOOT = {
  es: { help: "¿Dudas? Responde a este correo y te contesta una persona.", privacy: "Privacidad", privacyUrl: "https://alumhost.dev/privacidad/" },
  en: { help: "Questions? Reply to this email and a person will answer.", privacy: "Privacy", privacyUrl: "https://alumhost.dev/en/privacy/" },
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const LINK = /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g;
const toText = (p: string) => p.replace(LINK, "$1 ($2)");
const toHtml = (p: string) => {
  let out = "";
  let last = 0;
  for (const m of p.matchAll(LINK)) {
    out += esc(p.slice(last, m.index)) + `<a href="${esc(m[2])}" style="color:${C.cobalt};text-decoration:underline">${esc(m[1])}</a>`;
    last = m.index! + m[0].length;
  }
  return (out + esc(p.slice(last))).replace(/\n/g, "<br>");
};

const para = (p: string) =>
  `<p style="margin:0 0 16px;font-family:${FONT_BODY};font-size:16px;line-height:1.6;color:${C.body}">${toHtml(p)}</p>`;

function html(lang: Lang, b: Block): string {
  const f = FOOT[lang];
  const button = b.button
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px"><tr>
<td bgcolor="${C.sand}" style="background:${C.sand}"><a href="${esc(b.button.url)}" style="display:inline-block;padding:14px 26px;font-family:${FONT_BODY};font-size:16px;font-weight:700;color:${C.ink};text-decoration:none">${esc(b.button.label)}</a></td>
</tr></table>
<p style="margin:0 0 20px;font-family:${FONT_BODY};font-size:13px;line-height:1.5;color:#5b6687;word-break:break-all">${lang === "es" ? "Si el botón no funciona, copia este enlace:" : "If the button does not work, copy this link:"}<br><a href="${esc(b.button.url)}" style="color:${C.cobalt}">${esc(b.button.url)}</a></p>`
    : "";
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark"><meta name="supported-color-schemes" content="light dark">
<title>${esc(b.subject)}</title></head>
<body style="margin:0;padding:0;background:${C.night}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.night}">${esc(b.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.night}" style="background:${C.night}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px">
<tr><td style="padding:4px 4px 20px"><a href="https://alumhost.dev" style="text-decoration:none"><img src="${ASSETS}/logo.png" width="196" height="42" alt="AlumHost" style="display:block;border:0;color:#eef1fa;font-family:${FONT_DISPLAY};font-size:24px;font-weight:800"></a></td></tr>
<tr><td><img src="${ASSETS}/strip.png" width="560" height="20" alt="" style="display:block;width:100%;max-width:560px;height:auto;border:0"></td></tr>
<tr><td bgcolor="#ffffff" style="background:#ffffff;padding:32px 32px 16px">
<h1 style="margin:0 0 20px;font-family:${FONT_DISPLAY};font-size:28px;line-height:1.15;font-weight:800;color:${C.ink};letter-spacing:-0.01em">${esc(b.title)}</h1>
${b.body.map(para).join("\n")}
${button}
${(b.after ?? []).map(para).join("\n")}
<p style="margin:8px 0 16px;font-family:${FONT_BODY};font-size:16px;line-height:1.6;color:${C.body}">${SIGN[lang].html}</p>
</td></tr>
<tr><td bgcolor="${C.night2}" style="background:${C.night2};padding:20px 32px;border-top:4px solid ${C.cobalt}">
<p style="margin:0 0 8px;font-family:${FONT_BODY};font-size:14px;line-height:1.5;color:#eef1fa">${esc(f.help)}</p>
<p style="margin:0;font-family:${FONT_BODY};font-size:12px;line-height:1.5;color:${C.muted}">${esc(b.reason)}<br>
<a href="https://alumhost.dev" style="color:${C.muted}">alumhost.dev</a> · <a href="${f.privacyUrl}" style="color:${C.muted}">${f.privacy}</a></p>
</td></tr>
</table></td></tr></table></body></html>`;
}

function text(lang: Lang, b: Block): string {
  const parts = [...b.body.map(toText)];
  if (b.button) parts.push(`${b.button.label}: ${b.button.url}`);
  parts.push(...(b.after ?? []).map(toText), SIGN[lang].text, b.reason);
  return parts.join("\n\n");
}

export const compose = (lang: Lang, b: Block): Mail => ({ subject: b.subject, text: text(lang, b), html: html(lang, b) });
