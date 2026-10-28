import pcge from "../src/data/pcge-2019.json" with { type: "json" };

const cuentas = pcge.cuentas;
const errores = [];
const porCodigo = new Map();

for (const cuenta of cuentas) {
  if (porCodigo.has(cuenta.codigo)) errores.push(`Código duplicado: ${cuenta.codigo}`);
  porCodigo.set(cuenta.codigo, cuenta);
  if (!cuenta.nombre?.trim()) errores.push(`Nombre vacío: ${cuenta.codigo}`);
  if (cuenta.padre !== null && !porCodigo.has(cuenta.padre)) {
    errores.push(`Padre ausente antes de la cuenta ${cuenta.codigo}: ${cuenta.padre}`);
  }
  if (cuenta.nivel === "ELEMENTO" && cuenta.permite_movimientos) {
    errores.push(`El elemento ${cuenta.codigo} no puede registrar movimientos`);
  }
}

for (const cuenta of cuentas.filter((item) => item.padre !== null)) {
  if (!cuenta.codigo.startsWith(cuenta.padre)) {
    errores.push(`Relación padre-hijo inválida: ${cuenta.padre} -> ${cuenta.codigo}`);
  }
}

const elementos = new Set(cuentas.filter((item) => item.nivel === "ELEMENTO").map((item) => item.codigo));
for (const codigo of ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
  if (!elementos.has(codigo)) errores.push(`Falta el elemento ${codigo}`);
}

if (errores.length) {
  console.error(errores.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  version: pcge.version,
  total: cuentas.length,
  codigosUnicos: porCodigo.size,
  elementos: [...elementos].sort(),
  duplicadosDetectadosEnFuente: Object.keys(pcge.duplicados_fuente || {})
}, null, 2));
