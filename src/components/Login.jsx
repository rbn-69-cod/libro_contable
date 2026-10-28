import { useState } from "react";
import { supabase, supabaseConfigurado } from "../lib/supabase";

function Icono({ tipo }) {
    const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
    if (tipo === "user") return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" /></svg>;
    if (tipo === "lock") return <svg {...common}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
    if (tipo === "eye") return <svg {...common}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>;
    return <svg {...common}><path d="M12 3 4 6v5c0 4.8 3.3 8.2 8 10 4.7-1.8 8-5.2 8-10V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
}

function Login({ onDemoLogin }) {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [mostrar, setMostrar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    async function iniciarSesion(evento) {
        evento.preventDefault();
        setError("");
        if (!usuario.trim() || !contrasena) { setError("Ingresa tu usuario y contraseña."); return; }
        setCargando(true);
        try {
            if (!supabaseConfigurado) {
                if (usuario.trim().toLowerCase() !== "admin" || contrasena !== "admin123") throw new Error("Usuario o contraseña incorrectos.");
                onDemoLogin?.();
                return;
            }
            const correo = usuario.includes("@") ? usuario.trim() : `${usuario.trim()}@contacabal.local`;
            const { error: errorSesion } = await supabase.auth.signInWithPassword({ email: correo, password: contrasena });
            if (errorSesion) throw errorSesion;
        } catch (errorInicio) { setError(errorInicio.message || "No se pudo iniciar sesión."); }
        finally { setCargando(false); }
    }

    return (
        <main className="login-page-premium">
            <section className="login-visual-panel"><div className="login-orbit orbit-one" /><div className="login-orbit orbit-two" /><div className="login-visual-content"><div className="login-logo-mark"><span>ML</span></div><p className="login-overline">PLATAFORMA FINANCIERA</p><h1>MI LIBRO<br /><span>CONTABLE</span></h1><p className="login-visual-copy">Claridad para tus números. Control para tus decisiones.</p><div className="login-mini-chart" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div><div className="login-trust"><Icono tipo="shield" /> Datos organizados, decisiones inteligentes</div></div></section>
            <section className="login-form-panel"><div className="login-form-wrap"><div className="login-mobile-brand"><div className="login-logo-mark"><span>ML</span></div><strong>MI LIBRO CONTABLE</strong></div><p className="login-kicker">Bienvenido de nuevo</p><h2>Ingresa a tu espacio</h2><p className="login-subtitle">Administra tus cuentas, asientos y reportes desde un solo lugar.</p><form onSubmit={iniciarSesion} className="login-form-premium"><label className="login-field"><span>Usuario</span><div className="login-input-wrap"><Icono tipo="user" /><input value={usuario} onChange={e => setUsuario(e.target.value)} placeholder="Escribe tu usuario" autoComplete="username" /></div></label><label className="login-field"><span>Contraseña</span><div className="login-input-wrap"><Icono tipo="lock" /><input type={mostrar ? "text" : "password"} value={contrasena} onChange={e => setContrasena(e.target.value)} placeholder="Escribe tu contraseña" autoComplete="current-password" /><button type="button" className="login-eye" onClick={() => setMostrar(v => !v)} aria-label={mostrar ? "Ocultar contraseña" : "Mostrar contraseña"}><Icono tipo="eye" /></button></div></label>{error && <div className="login-error" role="alert">{error}</div>}<button className="login-submit" type="submit" disabled={cargando}>{cargando ? "Verificando…" : "Entrar al sistema"}<span>→</span></button></form>{!supabaseConfigurado && <div className="login-demo-note"><strong>Modo demostración local</strong><span>Usuario: <b>admin</b> · Contraseña: <b>admin123</b></span></div>}<p className="login-footer">MI LIBRO CONTABLE · Contabilidad general</p></div></section>
        </main>
    );
}

export default Login;
