// ============================================================
// Club Machtia — Elemento 2: Red de Usuarios (árbol binario 2x15)
// ------------------------------------------------------------
// Reglas implementadas, tal como las describió el cliente:
//
// 1. Cada usuario tiene un Nivel 1 con 2 posiciones (izq/der).
// 2. El llenado de la red es SIEMPRE por niveles y de izquierda
//    a derecha (BFS): se agota un nivel completo antes de pasar
//    al siguiente, dentro de la red del invitador.
// 3. Un usuario común ve hasta 15 niveles a partir de su propia
//    posición. El Administrador ve la red completa (sin límite).
// 4. Cuenta inactiva (no renovó): conserva su posición hasta 2
//    años, después se elimina definitivamente. Al eliminarse,
//    se dispara una "compresión dinámica": el hijo izquierdo del
//    Nivel 1 de esa cuenta sube a ocupar su lugar, y así sucesivamente
//    (se repite el mismo movimiento en la posición que va quedando
//    vacía, siguiendo siempre la rama izquierda).
// 5. Si el Administrador elimina una posición manualmente, la
//    cuenta NO se borra: se marca "Eliminar posición y enviar al
//    fondo" -> se comprime igual que el punto 4, y la cuenta se
//    vuelve a insertar (como si fuera un nuevo invitado, BFS) DENTRO
//    de la red de la persona que originalmente la invitó.
//
// Nota de implementación: el infográfico del cliente no especifica
// qué pasa con el sub-árbol DERECHO del nodo eliminado cuando se
// hace la compresión (solo muestra que el izquierdo sube). Aquí
// asumimos que el sub-árbol derecho se conserva intacto colgado del
// nodo que sube (como hijo derecho, si ese nodo no tenía uno propio).
// Si el nodo promovido YA tenía su propio hijo derecho, el hijo
// derecho original del eliminado se reinserta por BFS normal dentro
// de la misma red, para no perder a nadie. Vale la pena confirmar
// esta regla con el cliente antes de darla por definitiva.
// ============================================================

export type NodeStatus = 'activo' | 'inactivo';

export interface RedNode {
  id: string;
  nombre: string;
  status: NodeStatus;
  invitadoPorId: string | null; // quién lo invitó originalmente (para "enviar al fondo")
  fechaInactivoDesde?: string; // ISO date, si status === 'inactivo'
  left: RedNode | null;
  right: RedNode | null;
}

let idCounter = 1;
function nextId() {
  return `u${idCounter++}`;
}

export function crearRaiz(nombre: string): RedNode {
  return {
    id: nextId(),
    nombre,
    status: 'activo',
    invitadoPorId: null,
    left: null,
    right: null,
  };
}

/**
 * Inserta un nuevo usuario dentro de la red de `invitador`, siguiendo
 * la regla de llenado BFS (izquierda a derecha, nivel por nivel).
 * Devuelve el nodo creado, o null si la red del invitador ya alcanzó
 * el máximo de 15 niveles visibles para un Usuario común.
 */
export function invitar(
  invitador: RedNode,
  nombre: string,
  opts?: { maxNiveles?: number }
): RedNode | null {
  const maxNiveles = opts?.maxNiveles ?? 15;

  const queue: { node: RedNode; nivel: number }[] = [{ node: invitador, nivel: 0 }];

  while (queue.length > 0) {
    const { node, nivel } = queue.shift()!;

    if (nivel >= maxNiveles) continue;

    if (node.left === null) {
      const nuevo: RedNode = {
        id: nextId(),
        nombre,
        status: 'activo',
        invitadoPorId: invitador.id,
        left: null,
        right: null,
      };
      node.left = nuevo;
      return nuevo;
    }
    queue.push({ node: node.left, nivel: nivel + 1 });

    if (node.right === null) {
      const nuevo: RedNode = {
        id: nextId(),
        nombre,
        status: 'activo',
        invitadoPorId: invitador.id,
        left: null,
        right: null,
      };
      node.right = nuevo;
      return nuevo;
    }
    queue.push({ node: node.right, nivel: nivel + 1 });
  }

  return null; // red llena hasta el máximo de niveles visible
}

/** Busca un nodo por id dentro del árbol. */
export function buscarNodo(root: RedNode, id: string): RedNode | null {
  if (root.id === id) return root;
  if (root.left) {
    const found = buscarNodo(root.left, id);
    if (found) return found;
  }
  if (root.right) {
    const found = buscarNodo(root.right, id);
    if (found) return found;
  }
  return null;
}

/** Busca el nodo padre de un id dado, y de qué lado cuelga. */
function buscarPadre(
  root: RedNode,
  id: string
): { padre: RedNode; lado: 'left' | 'right' } | null {
  if (root.left) {
    if (root.left.id === id) return { padre: root, lado: 'left' };
    const found = buscarPadre(root.left, id);
    if (found) return found;
  }
  if (root.right) {
    if (root.right.id === id) return { padre: root, lado: 'right' };
    const found = buscarPadre(root.right, id);
    if (found) return found;
  }
  return null;
}

/**
 * Compresión dinámica: el hijo izquierdo sube a ocupar la posición
 * que se vacía, en cascada por la rama izquierda. Ver nota sobre el
 * sub-árbol derecho al inicio del archivo.
 */
function comprimir(nodoEliminado: RedNode): RedNode | null {
  if (!nodoEliminado.left) {
    // No hay hijo izquierdo: el derecho (si existe) sube directo.
    return nodoEliminado.right;
  }

  const promovido = nodoEliminado.left;
  // La posición que deja vacante "promovido" se resuelve recursivamente.
  const huecoQueDeja = comprimir(promovido);
  promovido.left = huecoQueDeja;

  // El sub-árbol derecho del eliminado se conserva si el promovido
  // no tenía ya uno propio; si sí tenía, se marca para reinsertar.
  if (!promovido.right) {
    promovido.right = nodoEliminado.right;
  }
  // (la reinserción del sobrante, si la hay, se maneja en eliminarYComprimir)

  return promovido;
}

/**
 * Elimina definitivamente una cuenta (inactividad tras 2 años) y
 * aplica la compresión dinámica. `root` es la raíz de la red completa
 * en la que buscar (para un Usuario común, su propio nodo).
 */
export function eliminarYComprimir(root: RedNode, idAEliminar: string): void {
  if (root.id === idAEliminar) {
    throw new Error('No se puede eliminar el nodo raíz de la red.');
  }
  const rel = buscarPadre(root, idAEliminar);
  if (!rel) return;

  const nodo = rel.padre[rel.lado]!;
  const sobranteDerecho = nodo.right && comprimir(nodo)?.right !== nodo.right ? nodo.right : null;
  const nuevoNodo = comprimir(nodo);
  rel.padre[rel.lado] = nuevoNodo;

  // Si quedó un sub-árbol derecho sin lugar, se reinserta por BFS
  // normal dentro de la red del invitador original (regla 5, adaptada).
  if (sobranteDerecho) {
    reinsertarSubarbol(root, sobranteDerecho);
  }
}

function reinsertarSubarbol(root: RedNode, subarbol: RedNode) {
  const invitadorId = subarbol.invitadoPorId;
  const invitador = invitadorId ? buscarNodo(root, invitadorId) : root;
  invitar(invitador ?? root, subarbol.nombre);
  // Nota: en una implementación con base de datos real, aquí se
  // reinsertarían también los descendientes de `subarbol`, no solo
  // la persona raíz de ese sub-árbol. Se deja marcado como pendiente.
}

/**
 * Acción del Administrador: "Eliminar posición y enviar al fondo".
 * La cuenta sigue activa, pero se comprime su posición actual y se
 * vuelve a insertar (BFS) dentro de la red de quien la invitó originalmente.
 */
export function eliminarYEnviarAlFondo(root: RedNode, idAEliminar: string): RedNode | null {
  const nodo = buscarNodo(root, idAEliminar);
  if (!nodo) return null;
  const nombre = nodo.nombre;
  const invitadoPorId = nodo.invitadoPorId;

  eliminarYComprimir(root, idAEliminar);

  const invitador = invitadoPorId ? buscarNodo(root, invitadoPorId) : root;
  return invitar(invitador ?? root, nombre);
}

/** Marca una cuenta como inactiva (no renovó su suscripción). */
export function marcarInactivo(root: RedNode, id: string): void {
  const nodo = buscarNodo(root, id);
  if (nodo) {
    nodo.status = 'inactivo';
    nodo.fechaInactivoDesde = new Date().toISOString();
  }
}

/** Recorre el árbol nivel por nivel hasta `maxNiveles` (para pintar la UI). */
export function aplanarPorNiveles(root: RedNode, maxNiveles = 15): (RedNode | null)[][] {
  const niveles: (RedNode | null)[][] = [];
  let actual: (RedNode | null)[] = [root];

  for (let n = 1; n <= maxNiveles; n++) {
    const siguiente: (RedNode | null)[] = [];
    for (const nodo of actual) {
      siguiente.push(nodo?.left ?? null, nodo?.right ?? null);
    }
    if (siguiente.every((x) => x === null) && n > 1) break;
    niveles.push(siguiente);
    actual = siguiente;
  }
  return niveles;
}

export function contarActivos(root: RedNode | null): number {
  if (!root) return 0;
  return (root.status === 'activo' ? 1 : 0) + contarActivos(root.left) + contarActivos(root.right);
}

export function contarTotal(root: RedNode | null): number {
  if (!root) return 0;
  return 1 + contarTotal(root.left) + contarTotal(root.right);
}
