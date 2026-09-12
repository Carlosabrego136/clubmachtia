'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

function capitalizar(slug: string): string {
  return slug
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

// Solo letras (incluye acentos/ñ) y espacios — sin números ni caracteres especiales.
const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function InvitacionLanding({ invitadorSlug }: { invitadorSlug: string }) {
  const router = useRouter();
  const nombreInvitador = capitalizar(invitadorSlug);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDisponible, setVideoDisponible] = useState(true);
  const [reproduciendo, setReproduciendo] = useState(false);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [errorNombre, setErrorNombre] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');
  const [enviado, setEnviado] = useState(false);

  // Reproduce automáticamente el video al entrar en la pantalla (scroll).
  useEffect(() => {
    if (!videoRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.play().then(() => setReproduciendo(true)).catch(() => {});
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(videoRef.current);
    return () => obs.disconnect();
  }, []);

  function toggleVideo() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setReproduciendo(true);
    } else {
      videoRef.current.pause();
      setReproduciendo(false);
    }
  }

  function validarNombre(valor: string) {
    setNombre(valor);
    if (valor.trim() && !SOLO_LETRAS.test(valor)) {
      setErrorNombre('Solo se permiten letras y espacios, sin números ni símbolos.');
    } else {
      setErrorNombre('');
    }
  }

  function validarCorreo(valor: string) {
    setCorreo(valor);
    if (valor.trim() && !CORREO_VALIDO.test(valor)) {
      setErrorCorreo('El formato del correo no es válido.');
    } else {
      setErrorCorreo('');
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nombreOk = nombre.trim() && SOLO_LETRAS.test(nombre);
    const correoOk = correo.trim() && CORREO_VALIDO.test(correo);
    if (!nombreOk) setErrorNombre('Escribe tu nombre y apellido (solo letras).');
    if (!correoOk) setErrorCorreo('Escribe un correo válido.');
    if (!nombreOk || !correoOk) return;

    // Fase 2 (correo de confirmación + formulario completo) depende de
    // que ya estén conectados Brevo y la base de datos. Por ahora se
    // simula el paso siguiente para poder revisar el flujo completo.
    setEnviado(true);
  }

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white">
      <div className="max-w-xl mx-auto px-6 py-14 sm:py-20">
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cm-accent to-cm-primary" />
          <span className="font-semibold text-[16px]">Club Machtia</span>
        </div>

        {!enviado ? (
          <>
            <h1 className="text-[28px] sm:text-[34px] font-semibold leading-tight mb-3">
              Bienvenido al espacio de {nombreInvitador}
            </h1>
            <p className="text-white/70 text-[15px] leading-relaxed mb-8">
              Quiero que conozcas cómo puedes aprender, ayudar y ganar junto a otras personas.
              <br />
              ¿Estás listo?
            </p>

            {/* Video de presentación */}
            <div
              onClick={toggleVideo}
              className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 mb-6 cursor-pointer aspect-video"
            >
              {videoDisponible ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  src="/videos/presentacion.mp4"
                  playsInline
                  muted
                  loop
                  onError={() => setVideoDisponible(false)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40 text-[13px]">
                  Video de presentación próximamente
                </div>
              )}
              {!reproduciendo && videoDisponible && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                      <path d="M5 3l12 7-12 7V3z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full h-11 rounded-lg border border-white/25 text-[14px] font-medium mb-10 hover:bg-white/5 transition-colors"
            >
              Conoce más en nuestro sitio
            </button>

            {/* Preregistro */}
            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-6">
              <p className="text-[13px] font-semibold text-white/60 uppercase tracking-wide mb-1">
                Comienza tu registro aquí
              </p>
              <h2 className="text-[18px] font-semibold mb-5">Preregistro</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[13px] text-white/70 mb-1.5">Nombre y Apellido</label>
                  <input
                    value={nombre}
                    onChange={(e) => validarNombre(e.target.value)}
                    placeholder="Ej. María López"
                    className="w-full h-11 px-3 rounded-lg bg-white/[0.06] border border-white/15 text-white text-[14px] outline-none focus:border-cm-accent"
                  />
                  {errorNombre && <p className="text-red-400 text-[12px] mt-1">{errorNombre}</p>}
                </div>

                <div>
                  <label className="block text-[13px] text-white/70 mb-1.5">Correo electrónico</label>
                  <input
                    value={correo}
                    onChange={(e) => validarCorreo(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full h-11 px-3 rounded-lg bg-white/[0.06] border border-white/15 text-white text-[14px] outline-none focus:border-cm-accent"
                  />
                  {errorCorreo && <p className="text-red-400 text-[12px] mt-1">{errorCorreo}</p>}
                </div>

                <button
                  type="submit"
                  className="h-11 rounded-lg bg-white text-cm-primaryDark text-[14px] font-semibold mt-1"
                >
                  Continuar
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-cm-accent/20 flex items-center justify-center mx-auto mb-4">
              ✉️
            </div>
            <h2 className="text-[18px] font-semibold mb-2">Revisa tu correo</h2>
            <p className="text-white/70 text-[14px] leading-relaxed">
              Te enviamos un correo de confirmación a <b>{correo}</b>. Al confirmarlo, vas a poder
              completar tu registro con tus datos, elegir tu suscripción y subir tu comprobante de pago.
            </p>
            <p className="text-white/40 text-[12px] mt-5">
              (Simulado: el envío real de este correo depende de conectar Brevo y la base de datos)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
