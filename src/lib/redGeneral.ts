// ============================================================
// Club Machtia — Red General restringida (Administrador)
// ------------------------------------------------------------
// Regla del cliente: los primeros 8 niveles de la Red General
// (la que solo ve el Administrador) NO se llenan por invitación
// libre de cualquier usuario. Cada espacio, del Nivel 1 al 8,
// existe como un "slot" que el Administrador debe llenar a mano
// generando un link de invitación específico para ESE espacio.
//
// Una vez que la persona invitada acepta y se registra, el slot
// pasa a "ocupado" con sus datos, y esa persona obtiene su propio
// link de invitación para construir SU red hacia abajo — a partir
// de ahí ya funciona con el motor normal de invitación libre
// (ver network.ts), fuera de la restricción de los primeros 8
// niveles.
// ============================================================

import { RedNode, crearRaiz } from './network';

export type SlotStatus = 'vacio' | 'invitado' | 'ocupado';

export interface DatosOcupante {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  pais: string;
}

export interface Slot {
  id: string; // `${nivel}-${posicion}`
  nivel: number;
  posicion: number; // 1-indexed, izquierda a derecha dentro del nivel
  status: SlotStatus;
  inviteLink?: string;
  datos?: DatosOcupante;
  referralLink?: string;
  redPropia?: RedNode; // su propia red (motor normal), una vez ocupado
}

/** Genera la cuadrícula completa de espacios para los niveles 1..maxNivel, todos vacíos. */
export function generarGrid(maxNivel = 8): Slot[][] {
  const grid: Slot[][] = [];
  for (let nivel = 1; nivel <= maxNivel; nivel++) {
    const totalEnNivel = Math.pow(2, nivel);
    const fila: Slot[] = [];
    for (let pos = 1; pos <= totalEnNivel; pos++) {
      fila.push({ id: `${nivel}-${pos}`, nivel, posicion: pos, status: 'vacio' });
    }
    grid.push(fila);
  }
  return grid;
}

function slugify(nombre: string, apellido: string): string {
  return `${nombre}-${apellido}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function tokenAleatorio(): string {
  return Math.random().toString(36).slice(2, 8);
}

/** Genera (o regenera) el link de invitación específico de un espacio. */
export function accionGenerarLink(slot: Slot): Slot {
  if (slot.status === 'ocupado') return slot; // no se sobreescribe una cuenta ya activa
  return {
    ...slot,
    status: 'invitado',
    inviteLink: `clubmachtia.com/invitacion/n${slot.nivel}-e${slot.posicion}-${tokenAleatorio()}`,
  };
}

/** Limpia una invitación pendiente y deja el espacio vacío otra vez. */
export function accionResetearInvitacion(slot: Slot): Slot {
  if (slot.status !== 'invitado') return slot;
  return { id: slot.id, nivel: slot.nivel, posicion: slot.posicion, status: 'vacio' };
}

/** Elimina la cuenta que ocupa el espacio, dejándolo vacío de nuevo. */
export function accionEliminarCuenta(slot: Slot): Slot {
  if (slot.status !== 'ocupado') return slot;
  return { id: slot.id, nivel: slot.nivel, posicion: slot.posicion, status: 'vacio' };
}

/**
 * Simula el momento en que la persona invitada acepta el link y completa
 * su registro. En una versión con backend real, esto lo dispararía el
 * formulario de registro público, no el Administrador.
 */
export function accionSimularRegistro(slot: Slot, datos: DatosOcupante): Slot {
  return {
    ...slot,
    status: 'ocupado',
    datos,
    inviteLink: undefined,
    referralLink: `clubmachtia.com/r/${slugify(datos.nombre, datos.apellido)}`,
    redPropia: crearRaiz(`${datos.nombre} ${datos.apellido}`),
  };
}
