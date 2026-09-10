# Club Machtia — Etapa 1 (Prototipo funcional)

Este prototipo cubre los 4 elementos pedidos para la Etapa 1:

## 1. Interfaz de plataforma, menú y tipos de usuario
- `index.html` → Pantalla de inicio de sesión (1.1): login, recuperar contraseña, botón mostrar/ocultar contraseña.
- `home.html` → Pantalla de inicio (1.2): bienvenida, link de invitación, anuncios, resumen de actividad, menú lateral vertical con submenús colapsables, menú horizontal (Mis Ganancias, Tienda, countdown a la Campaña de Lanzamiento — 20 oct 2027), menú de perfil (datos de cuenta, enlazar Facebook/Instagram, cerrar sesión) y notificaciones.
- Los 5 tipos de cuenta (1.3) están simulados en `assets/js/app.js`. Para probar cada rol, cambia la variable `ROLE_ACTUAL` (líneas ~64) por: `administrador`, `profesor`, `socio`, `usuario` o `asistente`. El menú y las notas de sesión cambian según el rol.

## Cómo verlo
Abre `index.html` en el navegador (doble clic) o súbelo tal cual a Vercel/cualquier hosting estático. El login te lleva directo a `home.html` (no hay backend todavía — es solo la interfaz).

## Lo que falta para el resto de la Etapa 1
- Elemento 2: Red de usuarios, sistema de invitación real y Campaña de Lanzamiento (backend + base de datos).
- Elemento 3: Perfil personal y funcionalidades.
- Elemento 4: Visualización, contenido y evaluación de Cursos y Talleres.

Este entregable es la base visual y de navegación (elemento 1) sobre la que se construyen los siguientes tres.

## Notas técnicas
- HTML + CSS + JS puro, sin dependencias — fácil de migrar a Laravel (Blade) o cualquier framework después.
- Paleta y estilo basados en las capturas que compartió el cliente (azul índigo / celeste, tarjetas blancas).
- Responsive básico incluido (sidebar colapsable en móvil).
