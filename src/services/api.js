import { supabase } from "../lib/supabase";
import { demoActivo, obtenerAsientosDemo, obtenerMayorDemo, crearAsientoDemo } from "./demoStore";

// En Vercel y producción, la API siempre está en /api en el mismo dominio
const API_URL = "/api";

export async function solicitarApi(ruta, opciones = {}) {
    if (demoActivo()) {
        const metodo = String(opciones.method || "GET").toUpperCase();
        const rutaBase = String(ruta).split("?")[0];
        if (rutaBase === "/empresas" && metodo === "GET") return [{ id: 1, nombre_empresa: "Empresa demo", estado: true }];
        if (rutaBase === "/usuario-actual") return { id: 1, empresa_id: 1, nombre: "Administrador Demo", rol: "ADMIN", estado: true };
        if (rutaBase === "/asientos/siguiente-numero") return { siguiente: obtenerAsientosDemo().reduce((m, a) => Math.max(m, Number(a.numero_partida || 0)), 0) + 1 };
        if (rutaBase === "/libro-diario" && metodo === "GET") return obtenerAsientosDemo();
        if (rutaBase === "/kardex" && metodo === "GET") return obtenerAsientosDemo();
        if (rutaBase === "/libro-mayor" && metodo === "GET") return obtenerMayorDemo();
        if (rutaBase === "/asientos" && metodo === "POST") return crearAsientoDemo(...(() => { const body = JSON.parse(opciones.body || "{}"); return [body.asiento || {}, body.detalles || []]; })());
        if (rutaBase === "/balance-general" && metodo === "GET") return { activo: { total: 0 }, pasivo: { total: 0 }, patrimonio: { total: 0 }, demo: true };
        if (rutaBase === "/estado-resultados" && metodo === "GET") return { estado: { ventasNetas: 0, costoVentas: 0, totalGastosOperacion: 0, utilidadBruta: 0, utilidadAntesImpuestos: 0 }, demo: true };
    }
    let token = null;
    if (supabase && supabase.auth) {
        try {
            const { data } = await supabase.auth.getSession();
            token = data?.session?.access_token;
        } catch {
            // Ignorar error al obtener sesión
        }
    }
    const rolGuardado = localStorage.getItem("conta_user_rol");
    const idGuardado = localStorage.getItem("conta_user_id");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(rolGuardado ? { "x-usuario-rol": rolGuardado } : {}),
        ...(idGuardado ? { "x-usuario-id": idGuardado } : {}),
        ...(opciones.headers || {})
    };
    const respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers });
    const cuerpo = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(cuerpo.error || cuerpo.details || "No se pudo completar la operación.");
    }

    return cuerpo;
}

export async function obtenerUsuarioActual() {
    return solicitarApi("/usuario-actual");
}
