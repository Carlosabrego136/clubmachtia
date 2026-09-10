# Club Machtia — Next.js (Etapa 1)

Proyecto migrado de HTML estático a **Next.js 14 + TypeScript + Tailwind**, listo para GitHub + Vercel.

## Qué cambió respecto a la versión anterior
- Login (`/`) ahora tiene el estilo "hero": fondo animado a pantalla completa, tarjeta glass (blur), animaciones de entrada en cascada — con los campos y textos reales de Club Machtia (no es una copia de otro producto).
- Dashboard (`/home`) migrado a componente React con la misma lógica de roles, menú y countdown que ya tenías, ahora con estado real de React en vez de manipular el DOM a mano.
- El selector "Probar como: ..." sigue ahí para probar los 5 roles sin backend.

## Correr en local
```bash
npm install
npm run dev
```
Abre http://localhost:3000

## Subir a GitHub (tu repo ya existe: Carlosabrego136/clubmachtia)
```bash
git init
git add .
git commit -m "Migracion a Next.js - Etapa 1 con estilo hero en login"
git branch -M main
git remote add origin https://github.com/Carlosabrego136/clubmachtia.git
git push -u origin main --force
```
Usa `--force` solo si quieres reemplazar por completo lo que subiste antes en HTML plano. Si quieres conservar el historial anterior, avísame y usamos otra estrategia (branch aparte + merge).

## Desplegar en Vercel
1. Entra a vercel.com → "Add New Project"
2. Importa el repo `clubmachtia`
3. Vercel detecta Next.js automáticamente — no necesitas configurar nada
4. Deploy

## Sobre el video de fondo
El login usa un fondo animado propio (círculos de color con blur, en tonos de Club Machtia) en vez de un video, para no depender de un archivo ajeno. Si quieres un video real:
1. Consigue un video con licencia (Pexels/Envato, o grabado propio) que combine con la marca
2. Colócalo en `/public/videos/tu-video.mp4`
3. En `src/components/HeroBackground.tsx` sigue las instrucciones comentadas para activarlo

## Pendiente (Elementos 2, 3 y 4 de la Etapa 1)
- Backend real de login (por ahora el formulario solo redirige, no valida)
- Sistema de invitación y red real
- Perfil personal editable
- Contenido y evaluación de Cursos/Talleres
