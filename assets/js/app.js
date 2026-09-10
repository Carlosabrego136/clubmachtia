// ============================================================
// Club Machtia — Etapa 1 (prototipo funcional)
// ============================================================

// ---------- 1.1 Mostrar / ocultar contraseña ----------
const togglePass = document.getElementById('togglePass');
if (togglePass) {
  togglePass.addEventListener('click', () => {
    const pass = document.getElementById('pass');
    const isHidden = pass.type === 'password';
    pass.type = isHidden ? 'text' : 'password';
    togglePass.textContent = isHidden ? 'Ocultar' : 'Ver';
  });
}

// ---------- 1.2 Submenús colapsables (sidebar) ----------
document.querySelectorAll('.nav-section[data-section] > .nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.closest('.nav-section');
    section.classList.toggle('open');
  });
});

// ---------- 1.2 Menú de perfil (dropdown) ----------
const profileTrigger = document.getElementById('profileTrigger');
const profileDropdown = document.getElementById('profileDropdown');
if (profileTrigger) {
  profileTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('show');
  });
  document.addEventListener('click', () => profileDropdown.classList.remove('show'));
}

// ---------- Toggle sidebar en móvil ----------
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

// ---------- Copiar link de invitación ----------
const copyInvite = document.getElementById('copyInvite');
if (copyInvite) {
  copyInvite.addEventListener('click', () => {
    navigator.clipboard.writeText('clubmachtia.com/r/stephanie-mh').catch(() => {});
    copyInvite.textContent = '¡Copiado!';
    setTimeout(() => copyInvite.textContent = 'Copiar enlace', 1500);
  });
}

// ---------- 1.2 Countdown a Campaña de Lanzamiento (20 oct 2027) ----------
const countdownText = document.getElementById('countdownText');
if (countdownText) {
  const target = new Date('2027-10-20T00:00:00');
  function updateCountdown() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      countdownText.textContent = '¡Campaña activa!';
      return;
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    countdownText.textContent = `${days}d ${hours}h ${mins}m`;
  }
  updateCountdown();
  setInterval(updateCountdown, 60000);
}

// ============================================================
// 1.3 Tipos de cuenta — lógica de roles
// ------------------------------------------------------------
// En producción esto vendría del backend (sesión autenticada).
// Aquí se simula con una variable para poder probar cada rol
// cambiando ROLE_ACTUAL abajo. Valores posibles:
// 'administrador' | 'profesor' | 'socio' | 'usuario' | 'asistente'
// ============================================================

const ROLE_ACTUAL = 'usuario';
const SUBSCRIPCION_ACTUAL = 'Plus'; // Básica | Plus | Negocios | Niños

const ROLE_LABELS = {
  administrador: 'Administrador',
  profesor: 'Profesor Facilitador',
  socio: 'Socio',
  usuario: `Usuario · ${SUBSCRIPCION_ACTUAL}`,
  asistente: 'Asistente Administrativo'
};

const ROLE_NOTES = {
  administrador: 'Sesión de Administrador: acceso completo a datos, estadísticas, aprobación de registros y envío de notificaciones directas.',
  profesor: 'Sesión de Profesor Facilitador: puedes subir material, editar evaluaciones y moderar el foro de tus cursos.',
  socio: 'Sesión de Socio: puedes crear cursos o talleres dentro de tus Espacios Reservados.',
  usuario: 'Sesión de Usuario: la opción de crear cursos aparece visible pero permanecerá inactiva hasta diciembre de 2026.',
  asistente: 'Sesión de Asistente Administrativo: puedes editar anuncios, revisar contenido y moderar foros.'
};

function aplicarRol(rol) {
  const roleLabel = document.getElementById('userRole');
  const roleNote = document.getElementById('roleNote');
  const adminSection = document.getElementById('adminSection');
  const creatorSection = document.getElementById('creatorSection');

  if (roleLabel) roleLabel.textContent = ROLE_LABELS[rol] || rol;
  if (roleNote) roleNote.textContent = ROLE_NOTES[rol] || '';

  if (adminSection) adminSection.style.display = (rol === 'administrador') ? 'block' : 'none';
  if (creatorSection) creatorSection.style.display = (rol === 'profesor' || rol === 'socio') ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => aplicarRol(ROLE_ACTUAL));
