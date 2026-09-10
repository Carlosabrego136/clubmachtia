'use client';

import { useMemo, useState } from 'react';
import {
  RedNode,
  crearRaiz,
  invitar,
  eliminarYComprimir,
  eliminarYEnviarAlFondo,
  marcarInactivo,
  aplanarPorNiveles,
  contarActivos,
  contarTotal,
} from '@/lib/network';

// ---------- Semilla: reproduce el ejemplo de la infografía ----------
function crearRedDeEjemplo() {
  const pedro = crearRaiz('Pedro');
  const rosa = invitar(pedro, 'Rosa')!;
  const lupita = invitar(pedro, 'Lupita')!;
  invitar(pedro, 'José'); // se acomoda en espacio izquierdo de Rosa
  invitar(pedro, 'Jorge'); // se acomoda en espacio izquierdo de Lupita
  return pedro;
}

const NODE_COLORS: Record<'activo' | 'inactivo' | 'vacante', string> = {
  activo: 'bg-cm-primary text-white border-cm-primary',
  inactivo: 'bg-amber-100 text-amber-700 border-amber-300',
  vacante: 'bg-white text-[#B8BCC8] border-dashed border-[#D8DCE6]',
};

export default function RedUsuarios() {
  const [version, setVersion] = useState(0); // fuerza re-render tras mutar el árbol
  const [root, setRoot] = useState<RedNode>(() => crearRedDeEjemplo());
  const [selected, setSelected] = useState<RedNode | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [maxNiveles] = useState(15);
  const [log, setLog] = useState<string[]>([]);

  const niveles = useMemo(() => aplanarPorNiveles(root, maxNiveles), [root, version]);
  const totalActivos = useMemo(() => contarActivos(root), [root, version]);
  const totalGeneral = useMemo(() => contarTotal(root), [root, version]);

  function pushLog(msg: string) {
    setLog((l) => [msg, ...l].slice(0, 6));
  }

  function refrescar() {
    setVersion((v) => v + 1);
  }

  function handleInvitar() {
    if (!nuevoNombre.trim()) return;
    const desde = selected ?? root;
    const nuevo = invitar(desde, nuevoNombre.trim(), { maxNiveles });
    if (nuevo) {
      pushLog(`${nuevoNombre.trim()} se unió a la red de ${desde.nombre}.`);
    } else {
      pushLog(`La red de ${desde.nombre} ya alcanzó el máximo de ${maxNiveles} niveles.`);
    }
    setNuevoNombre('');
    refrescar();
  }

  function handleMarcarInactivo() {
    if (!selected || selected.id === root.id) return;
    marcarInactivo(root, selected.id);
    pushLog(`${selected.nombre} quedó inactivo (conserva su posición hasta 2 años).`);
    refrescar();
  }

  function handleEliminarComprimir() {
    if (!selected || selected.id === root.id) return;
    const nombre = selected.nombre;
    eliminarYComprimir(root, selected.id);
    pushLog(`${nombre} fue eliminado definitivamente. Se aplicó compresión dinámica.`);
    setSelected(null);
    refrescar();
  }

  function handleEnviarAlFondo() {
    if (!selected || selected.id === root.id) return;
    const nombre = selected.nombre;
    eliminarYEnviarAlFondo(root, selected.id);
    pushLog(`Administrador movió a ${nombre}: posición liberada y reinsertado al fondo de su red original.`);
    setSelected(null);
    refrescar();
  }

  function handleReset() {
    setRoot(crearRedDeEjemplo());
    setSelected(null);
    setLog([]);
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-[22px] font-semibold mb-1">Red de Usuarios · Árbol binario 2x15</h1>
      <p className="text-[#6B7280] text-[14px] mb-6">
        Simulación funcional del Elemento 2: inserción por invitación (izquierda a
        derecha, nivel por nivel), compresión dinámica y "enviar al fondo" del Administrador.
      </p>

      <div className="grid lg:grid-cols-[1fr_300px] gap-5">
        {/* ---------- Árbol ---------- */}
        <div className="bg-white border border-[#E4E7EE] rounded-2xl p-5 overflow-x-auto">
          <div className="flex items-center gap-4 mb-5 text-[12px] text-[#6B7280]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cm-primary inline-block" /> Activo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-300 inline-block" /> Inactivo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full border border-dashed border-[#B8BCC8] inline-block" /> Vacante
            </span>
          </div>

          <div className="flex flex-col items-center gap-8 min-w-max pb-2">
            {/* raíz */}
            <button
              onClick={() => setSelected(root)}
              className={`px-4 py-2 rounded-xl border-2 text-[13px] font-semibold ${
                selected?.id === root.id ? 'ring-2 ring-cm-accent' : ''
              } ${NODE_COLORS[root.status]}`}
            >
              {root.nombre} · Raíz
            </button>

            {niveles.map((fila, i) => (
              <div key={i} className="flex items-center gap-3">
                {fila.map((nodo, j) =>
                  nodo ? (
                    <button
                      key={nodo.id}
                      onClick={() => setSelected(nodo)}
                      className={`px-3 py-1.5 rounded-lg border-2 text-[12px] font-medium whitespace-nowrap ${
                        selected?.id === nodo.id ? 'ring-2 ring-cm-accent' : ''
                      } ${NODE_COLORS[nodo.status]}`}
                    >
                      {nodo.nombre}
                    </button>
                  ) : (
                    <div
                      key={j}
                      className={`w-[70px] h-[30px] rounded-lg border-2 ${NODE_COLORS.vacante}`}
                    />
                  )
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Panel de control ---------- */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-[#E4E7EE] rounded-2xl p-4">
            <h2 className="text-[13px] font-semibold mb-3">Estado de la red</h2>
            <div className="flex justify-between text-[13px] py-1">
              <span className="text-[#6B7280]">Activos</span>
              <span className="font-semibold">{totalActivos}</span>
            </div>
            <div className="flex justify-between text-[13px] py-1">
              <span className="text-[#6B7280]">Total (incl. inactivos)</span>
              <span className="font-semibold">{totalGeneral}</span>
            </div>
          </div>

          <div className="bg-white border border-[#E4E7EE] rounded-2xl p-4">
            <h2 className="text-[13px] font-semibold mb-1">Invitar nuevo usuario</h2>
            <p className="text-[11px] text-[#6B7280] mb-2">
              Se agrega dentro de la red de: <b>{selected ? selected.nombre : root.nombre}</b> (clic en un nodo para cambiar)
            </p>
            <div className="flex gap-2">
              <input
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Nombre"
                className="flex-1 h-9 px-3 rounded-lg border border-[#E4E7EE] text-[13px]"
              />
              <button
                onClick={handleInvitar}
                className="bg-cm-primary text-white text-[12px] font-semibold px-3 rounded-lg"
              >
                Invitar
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#E4E7EE] rounded-2xl p-4">
            <h2 className="text-[13px] font-semibold mb-1">Nodo seleccionado</h2>
            {selected ? (
              <>
                <p className="text-[13px] mb-3">
                  <b>{selected.nombre}</b> ·{' '}
                  <span className={selected.status === 'activo' ? 'text-cm-primary' : 'text-amber-600'}>
                    {selected.status}
                  </span>
                  {selected.id === root.id && <span className="text-[#6B7280]"> (raíz, no editable)</span>}
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    disabled={selected.id === root.id}
                    onClick={handleMarcarInactivo}
                    className="text-[12px] font-semibold px-3 py-2 rounded-lg border border-amber-300 text-amber-700 disabled:opacity-30"
                  >
                    Marcar inactivo (no renovó)
                  </button>
                  <button
                    disabled={selected.id === root.id}
                    onClick={handleEliminarComprimir}
                    className="text-[12px] font-semibold px-3 py-2 rounded-lg border border-red-300 text-red-600 disabled:opacity-30"
                  >
                    Eliminar definitivo (2 años) + comprimir
                  </button>
                  <button
                    disabled={selected.id === root.id}
                    onClick={handleEnviarAlFondo}
                    className="text-[12px] font-semibold px-3 py-2 rounded-lg border border-[#E4E7EE] disabled:opacity-30"
                  >
                    Admin: enviar al fondo
                  </button>
                </div>
              </>
            ) : (
              <p className="text-[12px] text-[#6B7280]">Selecciona un nodo del árbol.</p>
            )}
          </div>

          <button
            onClick={handleReset}
            className="text-[12px] text-[#6B7280] underline self-start"
          >
            Reiniciar al ejemplo original
          </button>

          {log.length > 0 && (
            <div className="bg-white border border-dashed border-[#E4E7EE] rounded-2xl p-4">
              <h2 className="text-[12px] font-semibold mb-2">Actividad reciente</h2>
              <div className="flex flex-col gap-1.5">
                {log.map((l, i) => (
                  <p key={i} className="text-[11px] text-[#6B7280]">
                    {l}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
