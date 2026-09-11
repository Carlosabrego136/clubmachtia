'use client';

import { useMemo, useState } from 'react';
import {
  Slot,
  DatosOcupante,
  generarGrid,
  accionGenerarLink,
  accionResetearInvitacion,
  accionEliminarCuenta,
  accionSimularRegistro,
} from '@/lib/redGeneral';
import { invitar, contarTotal } from '@/lib/network';

const MAX_NIVEL_RESTRINGIDO = 8;

const STATUS_LABEL: Record<Slot['status'], string> = {
  vacio: 'Vacío',
  invitado: 'Invitación enviada',
  ocupado: 'Ocupado',
};

const STATUS_COLOR: Record<Slot['status'], string> = {
  vacio: 'bg-white border-dashed border-[#D8DCE6] text-[#B8BCC8]',
  invitado: 'bg-amber-50 border-amber-300 text-amber-700',
  ocupado: 'bg-cm-primary border-cm-primary text-white',
};

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="text-[11px] font-semibold text-cm-primary border border-cm-primary/30 rounded-md px-2 py-1"
    >
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  );
}

export default function AdminRedGeneral() {
  const [grid, setGrid] = useState<Slot[][]>(() => generarGrid(MAX_NIVEL_RESTRINGIDO));
  const [nivelAbierto, setNivelAbierto] = useState<number | null>(1);
  const [slotSeleccionado, setSlotSeleccionado] = useState<Slot | null>(null);
  const [form, setForm] = useState<DatosOcupante>({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    pais: '',
  });
  const [invitarNombre, setInvitarNombre] = useState('');

  function actualizarSlot(nuevo: Slot) {
    setGrid((prev) =>
      prev.map((fila) =>
        fila.map((s) => (s.id === nuevo.id ? nuevo : s))
      )
    );
    setSlotSeleccionado(nuevo);
  }

  const resumenPorNivel = useMemo(
    () =>
      grid.map((fila) => {
        const total = fila.length;
        const vacios = fila.filter((s) => s.status === 'vacio').length;
        const ocupados = fila.filter((s) => s.status === 'ocupado').length;
        return { nivel: fila[0].nivel, total, vacios, ocupados };
      }),
    [grid]
  );

  const filaAbierta = nivelAbierto ? grid[nivelAbierto - 1] : null;

  function handleGenerarLink(slot: Slot) {
    actualizarSlot(accionGenerarLink(slot));
  }
  function handleResetear(slot: Slot) {
    actualizarSlot(accionResetearInvitacion(slot));
  }
  function handleEliminar(slot: Slot) {
    actualizarSlot(accionEliminarCuenta(slot));
  }
  function handleSimularRegistro(slot: Slot) {
    if (!form.nombre.trim() || !form.apellido.trim()) return;
    actualizarSlot(accionSimularRegistro(slot, form));
    setForm({ nombre: '', apellido: '', correo: '', telefono: '', pais: '' });
  }
  function handleInvitarEnSuRed(slot: Slot) {
    if (!slot.redPropia || !invitarNombre.trim()) return;
    invitar(slot.redPropia, invitarNombre.trim());
    actualizarSlot({ ...slot });
    setInvitarNombre('');
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-[22px] font-semibold mb-1">Red General · Panel de Administrador</h1>
      <p className="text-[#6B7280] text-[14px] mb-6 max-w-2xl">
        Los primeros {MAX_NIVEL_RESTRINGIDO} niveles de la Red General están restringidos: cada
        espacio se llena únicamente generando un link de invitación específico desde aquí. A
        partir de que una persona ocupa un espacio, su propia red hacia abajo funciona con el
        sistema normal de invitación libre.
      </p>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        {/* ---------- Columna izquierda: niveles + slots ---------- */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {resumenPorNivel.map((r) => (
              <button
                key={r.nivel}
                onClick={() => {
                  setNivelAbierto(r.nivel);
                  setSlotSeleccionado(null);
                }}
                className={`text-left bg-white border rounded-xl p-3 transition-colors ${
                  nivelAbierto === r.nivel ? 'border-cm-primary ring-1 ring-cm-primary' : 'border-[#E4E7EE]'
                }`}
              >
                <div className="text-[13px] font-semibold mb-1">Nivel {r.nivel}</div>
                <div className="text-[11px] text-[#6B7280]">
                  {r.total} espacios / {r.vacios} vacío
                </div>
                <div className="text-[11px] text-cm-primary font-medium mt-0.5">
                  {r.ocupados} ocupado{r.ocupados !== 1 ? 's' : ''}
                </div>
              </button>
            ))}
          </div>

          {filaAbierta && (
            <div className="bg-white border border-[#E4E7EE] rounded-2xl p-5">
              <h2 className="text-[14px] font-semibold mb-4">
                Nivel {nivelAbierto} — {filaAbierta.length} espacios
              </h2>
              <div className="flex flex-wrap gap-2">
                {filaAbierta.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSlotSeleccionado(slot)}
                    className={`px-3 py-2 rounded-lg border-2 text-[12px] font-medium whitespace-nowrap ${
                      STATUS_COLOR[slot.status]
                    } ${slotSeleccionado?.id === slot.id ? 'ring-2 ring-cm-accent' : ''}`}
                  >
                    Espacio {slot.posicion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---------- Columna derecha: detalle del slot ---------- */}
        <div className="bg-white border border-[#E4E7EE] rounded-2xl p-5 h-fit sticky top-6">
          {!slotSeleccionado ? (
            <p className="text-[12px] text-[#6B7280]">
              Selecciona un espacio de la lista para ver sus detalles y acciones.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[14px] font-semibold">
                  Nivel {slotSeleccionado.nivel} · Espacio {slotSeleccionado.posicion}
                </h2>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_COLOR[slotSeleccionado.status]}`}
                >
                  {STATUS_LABEL[slotSeleccionado.status]}
                </span>
              </div>

              {/* ----- VACÍO ----- */}
              {slotSeleccionado.status === 'vacio' && (
                <div className="mt-4">
                  <p className="text-[12px] text-[#6B7280] mb-3">
                    Este espacio aún no tiene invitación. Genera un link específico para llenarlo.
                  </p>
                  <button
                    onClick={() => handleGenerarLink(slotSeleccionado)}
                    className="w-full bg-cm-primary text-white text-[13px] font-semibold py-2.5 rounded-lg"
                  >
                    Generar link de invitación
                  </button>
                </div>
              )}

              {/* ----- INVITADO (link generado, pendiente de registro) ----- */}
              {slotSeleccionado.status === 'invitado' && (
                <div className="mt-4 flex flex-col gap-3">
                  <div>
                    <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">
                      Link de invitación
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 text-[12px] bg-[#F4F6FB] rounded-lg px-3 py-2 truncate">
                        {slotSeleccionado.inviteLink}
                      </div>
                      <CopyBtn value={slotSeleccionado.inviteLink!} />
                    </div>
                  </div>

                  <button
                    onClick={() => handleResetear(slotSeleccionado)}
                    className="text-[12px] font-semibold border border-amber-300 text-amber-700 rounded-lg py-2"
                  >
                    Resetear invitación
                  </button>

                  <div className="border-t border-dashed border-[#E4E7EE] pt-3 mt-1">
                    <p className="text-[11px] text-[#6B7280] mb-2">
                      Simular que la persona ya aceptó el link y completó su registro (mientras no
                      haya backend real):
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        placeholder="Nombre"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        className="text-[12px] border border-[#E4E7EE] rounded-lg px-2 py-1.5"
                      />
                      <input
                        placeholder="Apellido"
                        value={form.apellido}
                        onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                        className="text-[12px] border border-[#E4E7EE] rounded-lg px-2 py-1.5"
                      />
                      <input
                        placeholder="Correo"
                        value={form.correo}
                        onChange={(e) => setForm({ ...form, correo: e.target.value })}
                        className="text-[12px] border border-[#E4E7EE] rounded-lg px-2 py-1.5 col-span-2"
                      />
                      <input
                        placeholder="Teléfono"
                        value={form.telefono}
                        onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                        className="text-[12px] border border-[#E4E7EE] rounded-lg px-2 py-1.5"
                      />
                      <input
                        placeholder="País"
                        value={form.pais}
                        onChange={(e) => setForm({ ...form, pais: e.target.value })}
                        className="text-[12px] border border-[#E4E7EE] rounded-lg px-2 py-1.5"
                      />
                    </div>
                    <button
                      onClick={() => handleSimularRegistro(slotSeleccionado)}
                      className="w-full text-[12px] font-semibold bg-[#1C1E2B] text-white rounded-lg py-2"
                    >
                      Simular registro completado
                    </button>
                  </div>
                </div>
              )}

              {/* ----- OCUPADO ----- */}
              {slotSeleccionado.status === 'ocupado' && slotSeleccionado.datos && (
                <div className="mt-4 flex flex-col gap-3">
                  <div className="text-[13px] space-y-1">
                    <p><b>{slotSeleccionado.datos.nombre} {slotSeleccionado.datos.apellido}</b></p>
                    <p className="text-[#6B7280]">{slotSeleccionado.datos.correo}</p>
                    <p className="text-[#6B7280]">{slotSeleccionado.datos.telefono} · {slotSeleccionado.datos.pais}</p>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">
                      Su link de invitación
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 text-[12px] bg-[#F4F6FB] rounded-lg px-3 py-2 truncate">
                        {slotSeleccionado.referralLink}
                      </div>
                      <CopyBtn value={slotSeleccionado.referralLink!} />
                    </div>
                  </div>

                  <div className="border-t border-dashed border-[#E4E7EE] pt-3">
                    <p className="text-[11px] text-[#6B7280] mb-2">
                      Su propia red (fuera de la restricción): {contarTotal(slotSeleccionado.redPropia ?? null) - 1} invitados
                    </p>
                    <div className="flex gap-2">
                      <input
                        placeholder="Nombre a invitar (demo)"
                        value={invitarNombre}
                        onChange={(e) => setInvitarNombre(e.target.value)}
                        className="flex-1 text-[12px] border border-[#E4E7EE] rounded-lg px-2 py-1.5"
                      />
                      <button
                        onClick={() => handleInvitarEnSuRed(slotSeleccionado)}
                        className="text-[12px] font-semibold bg-cm-primary text-white rounded-lg px-3"
                      >
                        Invitar
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleEliminar(slotSeleccionado)}
                    className="text-[12px] font-semibold border border-red-300 text-red-600 rounded-lg py-2 mt-1"
                  >
                    Eliminar cuenta de este espacio
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <p className="text-[11px] text-[#6B7280] mt-6 max-w-2xl">
        Nota: esta pantalla funciona en memoria mientras conectamos la base de datos — al recargar
        la página se reinicia. En cuanto esté lista la base de datos, cada link, invitación y
        registro va a persistir de verdad.
      </p>
    </div>
  );
}
