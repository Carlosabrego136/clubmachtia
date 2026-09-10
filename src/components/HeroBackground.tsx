export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-cm-bg">
      <div className="bg-drift absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cm-primary/40 blur-[120px]" />
      <div
        className="bg-drift absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-cm-accent/30 blur-[130px]"
        style={{ animationDelay: '3s' }}
      />
      <div
        className="bg-drift absolute -bottom-40 left-1/4 w-[550px] h-[550px] rounded-full bg-cm-primaryDark/50 blur-[140px]"
        style={{ animationDelay: '6s' }}
      />
      {/*
        Para usar un video real de fondo (grabado o comprado con licencia
        para Club Machtia), reemplaza este div por:

        <video
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          src="/videos/tu-video.mp4"
          autoPlay loop muted playsInline
        />

        y colócalo en /public/videos/
      */}
    </div>
  );
}
