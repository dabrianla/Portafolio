/**
 * Geometría del rayo que parte la pantalla de proyectos.
 *
 * El rayo tiene cuerpo, no es una línea: se define con una espina —posición del
 * centro y semiancho en cada altura— de la que se derivan sus dos filos. De esos
 * filos sale todo lo demás:
 *
 *   - el recorte del panel de la demo, contra el filo izquierdo;
 *   - el recorte de la rejilla, contra el filo derecho;
 *   - el polígono relleno del propio rayo;
 *   - el desplazamiento de cada fila de casillas, para que queden pegadas al
 *     zigzag a distancia constante.
 *
 * Derivarlo todo de la misma espina es lo que garantiza que las piezas encajen
 * a cualquier proporción de ventana. Los valores son porcentajes de la caja del
 * elemento, igual que los `clip-path` que los consumen.
 */

export type SpineNode = {
  /** Altura, de 0 (arriba) a 100 (abajo). */
  y: number;
  /** Centro del rayo a esa altura. */
  x: number;
  /** Semiancho: la mitad del grosor del rayo ahí. */
  w: number;
};

export type Point = { x: number; y: number };

/**
 * Las puntas se salen del viewport a propósito (`y` fuera de 0–100) para que el
 * rayo sangre por arriba y por abajo en vez de terminar en seco contra el borde.
 * El semiancho casi nulo en los extremos es lo que las afila.
 */
export const SPINE: SpineNode[] = [
  { y: -3, x: 64, w: 2 },
  { y: 13, x: 57, w: 6 },
  { y: 26, x: 63, w: 8 },
  { y: 41, x: 53, w: 9 },
  { y: 55, x: 60, w: 9 },
  { y: 71, x: 50, w: 8 },
  { y: 87, x: 57, w: 6 },
  { y: 103, x: 48, w: 2 },
];

/**
 * La amplitud del zigzag está calibrada, no elegida a ojo: el filo izquierdo
 * nunca baja de 42 y el derecho nunca pasa de 71, de modo que a la demo le
 * quedan ~40% de ancho y a las casillas ~23% incluso en la fila más estrecha.
 * Ensanchar el rayo se los come a los dos a la vez.
 */

/**
 * Cuánto hay que engordar el rayo para que tape la pantalla entera.
 *
 * El crecimiento es aditivo, no proporcional: multiplicar el semiancho dejaría
 * las puntas casi igual de finas —su `w` es 2— y quedarían esquinas sin cubrir.
 */
export const EXPANDED = 95;

const leftEdge = (grow = 0): Point[] =>
  SPINE.map((node) => ({ x: node.x - (node.w + grow), y: node.y }));

const rightEdge = (grow = 0): Point[] =>
  SPINE.map((node) => ({ x: node.x + (node.w + grow), y: node.y }));

const toPolygon = (points: Point[]) =>
  points.map((p) => `${p.x.toFixed(2)}% ${p.y.toFixed(2)}%`).join(", ");

/** Recorte del panel de la demo: su borde derecho es el filo izquierdo del rayo. */
export function stageClipPath(): string {
  return `polygon(0% 0%, ${toPolygon(leftEdge())}, 0% 100%)`;
}

/** Recorte de la rejilla: su borde izquierdo es el filo derecho del rayo. */
export function gridClipPath(): string {
  const edge = rightEdge();
  const upwards = toPolygon([...edge].reverse());
  return `polygon(${edge[0].x.toFixed(2)}% ${edge[0].y.toFixed(2)}%, 100% 0%, 100% 100%, ${upwards})`;
}

/**
 * El cuerpo del rayo: filo izquierdo bajando y filo derecho subiendo.
 *
 * `grow` es lo que permite animar la expansión. Como los dos estados salen de
 * la misma espina, tienen el mismo número de vértices, y eso es justo lo que
 * Framer Motion necesita para interpolar un `clip-path` de polígono: con
 * distinto número de puntos no podría y habría que recurrir a un `scale`, que
 * deformaría las puntas.
 */
export function boltClipPath(grow = 0): string {
  const points = [...leftEdge(grow), ...[...rightEdge(grow)].reverse()];
  return `polygon(${toPolygon(points)})`;
}

/** Trazo del contorno para el SVG, en un viewBox de 100×100. */
export function boltOutlinePath(jitter = 0, seed = 1): string {
  const wobble = pseudoRandom(seed);
  const shift = (value: number) => value + (wobble() - 0.5) * 2 * jitter;

  const nodes = SPINE.map((node) => ({
    y: node.y,
    left: shift(node.x - node.w),
    right: shift(node.x + node.w),
  }));

  const down = nodes.map((n, i) => `${i === 0 ? "M" : "L"}${n.left},${n.y}`);
  const up = [...nodes].reverse().map((n) => `L${n.right},${n.y}`);

  return `${down.join(" ")} ${up.join(" ")} Z`;
}

/**
 * Las casillas van pegadas al rayo, sin margen: el filo del rayo es el borde
 * izquierdo de cada fila.
 */
export const GRID_GAP = 0;

/**
 * Franjas de las filas de casillas, derivadas de los picos del rayo.
 *
 * Cada fila contiene exactamente un pico del filo derecho y va delimitada por
 * los valles que lo rodean. Así el borde izquierdo de cada fila queda tangente
 * al rayo justo en su punto más ancho —que es hasta donde puede llegar sin
 * pisarlo— y las tres filas cubren toda la altura sin huecos.
 *
 * Las franjas salen calculadas y no escritas a mano: si se mueve la espina, las
 * filas se recolocan solas en lugar de quedar desalineadas.
 */
export function gridRows(): { top: number; height: number }[] {
  const edge = rightEdge();
  const peaks: number[] = [];

  for (let i = 1; i < edge.length - 1; i++) {
    const isPeak = edge[i].x > edge[i - 1].x && edge[i].x > edge[i + 1].x;
    if (isPeak) peaks.push(edge[i].y);
  }

  // Una fila por pico, separadas por el punto medio entre picos consecutivos.
  // Partir por los valles daba una franja de más —el filo tiene un valle poco
  // profundo cerca del borde superior— y las filas no cubrían toda la altura.
  const bounds = [0];
  for (let i = 1; i < peaks.length; i++) bounds.push((peaks[i - 1] + peaks[i]) / 2);
  bounds.push(100);

  return bounds.slice(0, -1).map((top, i) => ({
    top,
    height: bounds[i + 1] - top,
  }));
}

/**
 * El tramo del filo derecho que recorre una franja, con los extremos
 * interpolados para que empiece y acabe justo en los bordes de la fila.
 *
 * Es lo que permite que el borde izquierdo de la primera casilla siga el
 * zigzag en vez de ser una vertical trazada en el pico: las casillas entran en
 * las concavidades del rayo y quedan encajadas contra él.
 */
export function boltEdgeIn(top: number, height: number): Point[] {
  const bottom = top + height;
  const edge = rightEdge();

  const inside = edge.filter((p) => p.y > top && p.y < bottom);

  return [
    { x: edgeXAt(edge, top), y: top },
    ...inside,
    { x: edgeXAt(edge, bottom), y: bottom },
  ];
}

/**
 * Dónde empieza la caja de una fila: la x mínima que alcanza el filo en su
 * franja. Desde ahí la fila se estira hasta el borde de la pantalla, y el
 * recorte de la primera casilla se encarga de morder la parte que ocupa el rayo.
 */
export function boltRowStart(top: number, height: number): number {
  return Math.min(...boltEdgeIn(top, height).map((p) => p.x)) + GRID_GAP;
}

/** x del filo a una altura concreta, interpolando entre vértices. */
function edgeXAt(edge: Point[], y: number): number {
  if (y <= edge[0].y) return edge[0].x;

  for (let i = 1; i < edge.length; i++) {
    const previous = edge[i - 1];
    const current = edge[i];
    if (y > current.y) continue;

    const ratio = (y - previous.y) / (current.y - previous.y);
    return previous.x + (current.x - previous.x) * ratio;
  }

  return edge[edge.length - 1].x;
}

/**
 * Generador determinista. Las variantes del contorno deben ser irregulares pero
 * estables: con `Math.random()` cambiarían en cada render y el parpadeo se
 * volvería ruido en lugar de leerse como tres fotogramas dibujados.
 */
function pseudoRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => ((state = (state * 1664525 + 1013904223) >>> 0) / 4294967296);
}
