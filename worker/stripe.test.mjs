// Prueba del verificador en Node (misma API Web Crypto que Workers):  node --experimental-strip-types worker/stripe.test.mjs
import { verifyStripeSignature } from "./stripe-signature.ts";
import { createHmac } from "node:crypto";

const secret = "whsec_test";
const body = '{"id":"evt_1","type":"invoice.paid"}';
const sign = (t, b, s = secret) => createHmac("sha256", s).update(`${t}.${b}`).digest("hex");
const now = Math.floor(Date.now() / 1000);
const cases = [
  ["firma válida", body, `t=${now},v1=${sign(now, body)}`, secret, true],
  ["cuerpo alterado", body + " ", `t=${now},v1=${sign(now, body)}`, secret, false],
  ["secreto incorrecto", body, `t=${now},v1=${sign(now, body, "otro")}`, secret, false],
  ["timestamp de hace 16 min", body, `t=${now - 960},v1=${sign(now - 960, body)}`, secret, false],
  ["sin v1", body, `t=${now},v0=${sign(now, body)}`, secret, false],
  ["basura", body, "hola", secret, false],
  ["dos v1 (rotación), la 2ª válida", body, `t=${now},v1=${"0".repeat(64)},v1=${sign(now, body)}`, secret, true],
  ["v1 no hex", body, `t=${now},v1=zz`, secret, false],
];
let bad = 0;
for (const [name, b, h, s, want] of cases) {
  const got = await verifyStripeSignature(b, h, s);
  if (got !== want) bad++;
  console.log(got === want ? "OK  " : "FALLA", name);
}
process.exit(bad ? 1 : 0);
