import pcge2019 from "../data/pcge-2019.json";

const ASIENTOS_KEY = "contacabal_demo_asientos";

function leer() {
    try { return JSON.parse(localStorage.getItem(ASIENTOS_KEY) || "[]"); } catch { return []; }
}

function guardar(asientos) {
    localStorage.setItem(ASIENTOS_KEY, JSON.stringify(asientos));
}

export function demoActivo() {
    return !import.meta.env.VITE_SUPABASE_URL && Boolean(localStorage.getItem("contacabal_demo_session"));
}

export function obtenerAsientosDemo() { return leer(); }

export function crearAsientoDemo(asiento, detalles) {
    const debe = detalles.reduce((s, d) => s + Number(d.debe || 0), 0);
    const haber = detalles.reduce((s, d) => s + Number(d.haber || 0), 0);
    if (Math.abs(debe - haber) > 0.005) throw new Error("El asiento no cuadra: el debe y el haber deben ser iguales.");
    if (detalles.length < 2) throw new Error("El asiento requiere al menos dos líneas.");
    const cuentas = new Map(pcge2019.cuentas.map(c => [String(c.codigo), c]));
    const numero = leer().reduce((max, a) => Math.max(max, Number(a.numero_partida || 0)), 0) + 1;
    const nuevo = {
        id: `demo-${Date.now()}`,
        empresa_id: 1,
        fecha: asiento.fecha,
        numero_partida: Number(asiento.numero_partida || numero),
        concepto: asiento.concepto,
        estado: "CONTABILIZADO",
        detalle_asientos: detalles.map(d => {
            const cuenta = cuentas.get(String(d.cuenta_id)) || cuentas.get(String(d.cuenta_codigo));
            return { cuenta_id: d.cuenta_id, descripcion: d.descripcion || "", debe: Number(d.debe || 0), haber: Number(d.haber || 0), cuentas: cuenta ? { id: cuenta.codigo, codigo: cuenta.codigo, nombre: cuenta.nombre, cuenta_padre_id: cuenta.padre } : null };
        })
    };
    const actuales = leer();
    actuales.push(nuevo);
    guardar(actuales);
    return { ok: true, asiento: nuevo, mensaje: "Asiento demo registrado y mayorizado." };
}

export function obtenerMayorDemo() {
    const mapa = new Map();
    leer().forEach(asiento => (asiento.detalle_asientos || []).forEach(d => {
        const id = String(d.cuenta_id);
        const fila = mapa.get(id) || { cuenta_id: d.cuenta_id, codigo: d.cuentas?.codigo || "", nombre: d.cuentas?.nombre || "", total_debe: 0, total_haber: 0 };
        fila.total_debe += Number(d.debe || 0); fila.total_haber += Number(d.haber || 0); mapa.set(id, fila);
    }));
    return [...mapa.values()];
}

