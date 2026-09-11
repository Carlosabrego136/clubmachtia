'use client';

import { useState } from 'react';

export default function HeroBackground() {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden bg-cm-bg">
      {!videoFailed && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
        />
      )}

      {/* Fondo de respaldo: se ve mientras carga el video, y se queda
          fijo si no se encuentra /public/videos/hero-bg.mp4 */}
      <div className={videoFailed ? '' : 'opacity-0'}>
        <div className="bg-drift absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cm-primary/40 blur-[120px]" />
        <div
          className="bg-drift absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-cm-accent/30 blur-[130px]"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="bg-drift absolute -bottom-40 left-1/4 w-[550px] h-[550px] rounded-full bg-cm-primaryDark/50 blur-[140px]"
          style={{ animationDelay: '6s' }}
        />
      </div>

      {/* Capa oscura leve para que la tarjeta glass siga siendo legible
          sobre cualquier video */}
      <div className="absolute inset-0 bg-black/25" />

      {/*
        Para activar tu video real (el de la licencia de motionsites,
        o cualquier otro con licencia propia):
        1. Descárgalo
        2. Guárdalo exactamente como: public/videos/hero-bg.mp4
        3. Listo — este componente ya lo detecta solo. Si el archivo
           no existe, cae de vuelta a los círculos animados sin romper nada.
      */}
    </div>
  );
}
