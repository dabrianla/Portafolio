# Portafolio — menú estilo videojuego

Portafolio personal cuya experiencia central es un menú de juego de pelea:
fondo de acero cepillado en movimiento, formas puntiagudas con aura de "ki", y
una transición de barrido diagonal al confirmar una sección.

**Estado: fase 5.** Las cinco secciones están terminadas: menú, Proyectos,
Currículum, Logros, Sobre mí y Contacto.

## Arranque

```bash
npm run dev
```

En `http://localhost:3000`. Navega con `↑`/`↓` o `W`/`S`, confirma con `Enter`
o `Espacio`, y vuelve con `Escape`. El ratón también funciona: el hover mueve el
mismo cursor que el teclado.

> **No ejecutes `npm run build` con `npm run dev` levantado.** Los dos escriben
> en `.next`: el build sobrescribe los assets que el servidor de desarrollo
> tiene referenciados y la página se queda sin CSS (404 en `layout.css`). Si
> pasa, para el servidor, borra `.next` y vuelve a arrancar.

En un clon nuevo, activa el hook que bloquea secretos antes de commitear:

```bash
git config core.hooksPath .githooks
```

Es un ajuste local, así que no viaja con el repositorio: sin él, `.githooks/`
está ahí pero inerte. Revisa el índice buscando claves —incluido lo que solo es
sensible aquí, como el identificador del proyecto Firebase del cliente— y corta
el commit si encuentra algo. Para saltártelo en un falso positivo,
`git commit --no-verify`.

## Estructura

| Ruta | Qué contiene |
| --- | --- |
| `content/menu.ts` | **Fuente única de verdad del menú.** Añadir, quitar o reordenar secciones se hace solo aquí. |
| `content/cv.ts` | **Fuente única de verdad del currículum.** Alimenta el CV, Sobre mí, Contacto y el nombre del menú. |
| `app/page.tsx` | Menú principal. |
| `app/{proyectos,cv,logros,sobre-mi,contacto}/page.tsx` | Secciones, sobre el armazón compartido `SectionShell`. |
| `components/menu/` | Menú: lista, item y bloque del nombre. |
| `components/cv/` | Currículum con sub-pestañas y medidores de nivel. |
| `components/about/`, `components/contact/` | Ficha de jugador y pantalla de contacto. |
| `content/projects.ts` | **Fuente única de verdad de los proyectos**, incluidas las casillas bloqueadas. |
| `content/achievements.ts` | **Fuente única de verdad de la sala de trofeos.** Deriva del CV y de los proyectos; no duplica ningún dato. |
| `components/achievements/` | Rejilla de logros, marcador de progreso y ficha del logro seleccionado. |
| `components/projects/` | Selector estilo *character select* y la demo empotrada. |
| `public/demos/marcacion/` | Build de Marcación Rosa SpA en modo local (generada, ver abajo). |
| `components/fx/` | Efectos: fondo metálico, grano, aura de ki, barrido diagonal, glitch de texto. |
| `lib/transition/` | Coreografía de la transición entre rutas (GSAP) y cambio de acento. |
| `lib/audio/` | SFX sintetizados con Web Audio y el estado de mute. |
| `lib/hooks/` | Cursor del menú y detección de `prefers-reduced-motion`. |

## Decisiones que conviene conocer antes de tocar el código

**No hay archivos de audio.** Los tres SFX se generan con osciladores en
`lib/audio/sfx.ts`. Para cambiarlos por `.mp3` reales basta con reimplementar
`play()`; la interfaz que consumen los componentes no cambia.

**El acento de color es una variable CSS global.** `applyAccent()`
(`lib/theme/palette.ts`) reescribe `--accent` y `--accent-alt` al navegar, y con
eso se recolorea toda la pantalla. No pases colores como props.

**GSAP debe ser el único dueño de `transform` en los paneles del barrido.** Una
traslación en porcentaje puesta con una clase de Tailwind no se puede fusionar
con `xPercent`: GSAP la conserva como base y suma la suya encima, con lo que el
panel acaba al doble de distancia y el barrido deja de cubrir en el momento
correcto. La posición y el sesgo iniciales se fijan con `gsap.set()`.

**Lo mismo vale para Framer, y ya mordió una vez.** Un `motion` que anima `x`
escribe `transform` en línea, y eso *reemplaza* al `transform` de cualquier
clase de Tailwind en el mismo elemento. Los items del menú llevaban
`-skew-x-12` en la caja y `skew-x-12` en el contenido para enderezarlo: Framer
se comía el primero y sobrevivía solo el segundo, así que las etiquetas del menú
llevaban tiempo renderizándose inclinadas 12°, una cursiva falsa sobre una
condensada pesada. Nadie lo notó porque `clip-blade` —un recorte, que sí
sobrevive— seguía dando a la tarjeta su silueta de filo. Regla práctica: si un
elemento se anima, su geometría estática va por `clip-path`, nunca por una clase
de `transform`.

**El fondo vive en el layout, no en las páginas.** Así no se remonta en cada
navegación y su animación no se reinicia a mitad de una transición.

**Nada de `filter` ni `skew` permanentes sobre texto.** Las dos cosas obligan
al navegador a rasterizar el texto en una capa aparte, que pierde el suavizado
subpíxel; en una pantalla al 125% de escala encima se remuestrea, y el resultado
se lee como texto borroso. Aparecía por dos vías: una transición que entraba
desde `blur(6px)` y dejaba escrito `filter: blur(0px)` para siempre —Framer no
lo retira—, y el patrón `-skew-x-12` en la caja con `skew-x-12` en el texto para
enderezarlo. Ahora el desenfoque vive solo en el tramo de salida de la
animación, y el sesgo se dibuja recortando la silueta: `lib/theme/slant.ts`,
compartido por `Tag`, `TechColumn` y la chapa de Experiencia. Por lo mismo, el
texto real no baja de ~11px (`0.7rem`) y los rótulos de grupo pasan por
`components/ui/PanelHeading.tsx`, que fija ese mínimo en un solo sitio.

Dos trampas de ese mínimo de 11px que ya mordieron:

- **`<kbd>` no respeta el tamaño heredado.** El navegador le pone
  `font-family: monospace`, y eso activa el ajuste de tamaño de fuente
  monoespaciada de Chrome: caía a 9,6px en las cuatro líneas de ayuda del sitio.
  `kbd { font: inherit }` en `globals.css` lo resuelve de una vez.
- **Las casillas de Proyectos en móvil son cuadradas** (`aspect-square`, ~105px):
  su alto lo fija su ancho, así que subir la letra desbordaba el `tagline` por
  abajo. Ahí el `tagline` se oculta y solo se muestra de `lg` en adelante — no
  se pierde nada, porque el del proyecto seleccionado se lee entero justo
  debajo de la rejilla.

**La aberración cromática es un chispazo, no un estado.** `GlitchText` separa el
texto en una copia cian y otra magenta a ±3px. Sobre los titulares del menú eso
se lee como energía; sobre las pestañas del CV, de 16px, era casi un quinto del
ancho de cada letra y dejaba permanentemente desenfocada la palabra que dice
dónde estás. En `CvTabs` dura 220 ms al aterrizar y luego se apaga.

**El orden de `EXPERIENCE` es el orden de la pantalla.** La pestaña Experiencia
es una línea de tiempo descendente, y no ordena nada: dibuja el array de
`cv.ts` tal cual, así que lo más reciente va primero **en el archivo**. La fecha
vive en el raíl, a la izquierda del rombo, y por eso la ficha solo repite el
periodo por debajo de `sm`, donde no hay raíl que lo muestre. El `tag` de cada
puesto hace de etiqueta del proyecto: con dos puestos del mismo cargo para el
mismo cliente, es lo único que los distingue de un vistazo.

**El sitio no tiene ninguna fotografía.** La pestaña de Perfil llevó una figura
de cuerpo entero (`FullFigure`, con `public/cv/figura.webp`) y se retiró por
decisión de Dabrian. El componente y la imagen están borrados, no ocultos; si
alguna vez vuelve una foto, el historial de git conserva cómo estaba resuelta
—recorte con transparencia sobre el acero del fondo, y un halo de acento en CSS
porque el traje oscuro se disolvía contra la página—.

**La columna de Sobre mí reserva la esquina del interruptor de sonido**
(`lg:pr-24 xl:pr-32`). El botón va fijo abajo a la derecha en todas las
secciones y el último dato de la ficha acababa por debajo de él. El hueco crece
con el ancho de la ventana porque el botón está pegado al borde: con un valor
fijo, en 1024 sobraba tanto que la ficha se veía forzada a scrollear.

**La pantalla fija sin scroll es solo de escritorio, y a partir de `lg`.** La
regla de "cada sección es una pantalla de juego" —`body { overflow: hidden }`,
`h-dvh`, contenido centrado verticalmente— se sostiene con 900px de alto y se
rompe con 640. En un móvil el contenido no cabe, y al ir centrado lo que sobra
se reparte **arriba y abajo**: lo de abajo se intuye, pero lo de arriba queda
recortado por el `overflow` y con el scroll bloqueado no hay forma de llegar a
ello. Ahí vivía el título de cada sección. Medido a 360×640, el `<h1>` de LOGROS
caía entero fuera de la pantalla y el nombre de la portada perdía 18 de sus
41px; entre las cinco rutas afectadas quedaban 73 elementos con texto fuera de
alcance.

Por debajo de `lg` la página fluye y se scrollea, y el contenido se alinea
arriba en vez de centrarse. De ahí se siguen tres cosas que conviene no
deshacer: los topes de altura de los paneles (CV, Logros, Sobre mí) son
`lg:` y nada más —anidar un scroll dentro de otro en táctil hace impredecible
cuál se mueve—; el interruptor de sonido, que es `fixed`, se reduce al icono,
porque desde que hay scroll se cruza con el texto en lugar de flotar sobre un
hueco; y nada que deba medirse contra la pantalla usa `vh` en móvil, porque esa
altura cambia cada vez que el navegador oculta o muestra su barra.

**Las demos llevan geometría explícita en móvil, no heredada.** Su altura salía
de una cadena de seis flex anidados que en pantallas pequeñas se rompía en
`StagePanel` —su `h-full` daba 415px dentro de un padre de 812— y el `<iframe>`
acababa en 323×150: el 16% de la pantalla, para apps pensadas en 4:3. Esos 150px
no los eligió nadie, son la altura por defecto de un `<iframe>`, la que queda
cuando `height: 100%` no llega a resolver. Por debajo de `lg` el marco usa
proporción 4:3 fija en vista previa y ocupa la pantalla entera al lanzarse; el
botón de volver pasa entonces a `fixed` con `z-60`, porque es la única salida.
En escritorio la demo sigue dentro del panel del rayo, dimensionada por la
cadena de flex.

**Los certificados viven en un solo sitio.** Estuvieron en la pestaña
Formación del currículum y ahora están en LOGROS, no en las dos. `cv.ts` sigue
siendo su dueño —son datos del currículum—; lo que cambió es qué pantalla los
muestra. `content/achievements.ts` los importa, igual que importa el título, la
práctica y las apps con demo: si mañana cambia un dato en `cv.ts` o en
`projects.ts`, el logro correspondiente cambia solo.

**Los objetivos bloqueados son la excepción del sitio.** Todo lo demás sale de
un hecho comprobable —el CV, las demos, el repositorio—. Los cuatro objetivos
"por desbloquear" son afirmaciones sobre lo que Dabrian quiere hacer, así que
se escriben en positivo y no se publica ninguno sin que él lo revise.

**El teléfono personal no entra en el repositorio.** El CV en PDF incluye un
número que se ha dejado fuera a propósito: solo se publica el email. Antes de
cerrar un cambio conviene comprobarlo:

```bash
grep -rn "8808" --exclude-dir=node_modules --exclude-dir=.next --exclude=README.md .
```

Por el mismo motivo no hay ningún PDF en `public/` ni botón de descarga del CV.

**Las demos de Proyectos son las apps reales, no vídeos.** Corren empotradas en
iframes del mismo origen, compiladas en un modo local que no toca Firebase: cada
visitante trabaja sobre su propia copia sembrada en su navegador. Por eso el
botón "reiniciar demo" puede borrar las claves del proyecto y recargar.

Cada app llega a ese modo local de una forma distinta:

- **Marcación Rosa SpA** ya traía la capa de adaptadores de fábrica: basta con
  `useLocalData: true` y ni siquiera inicializa Firebase.
- **MiniApp** hablaba con Firestore directamente. Su modo local está en
  `src/app/demo/`, y `tsconfig.demo.json` mapea `@angular/fire/*` y los plugins
  de cámara y escáner a esos adaptadores. La sustitución ocurre a nivel de
  módulo, así que **ni `inventario.ts` ni las páginas cambian una línea** y la
  demo corre la lógica de negocio de verdad. El escáner se simula con un
  selector de los códigos sembrados, porque la cámara no existe en un iframe.

Para regenerarlas tras cambiar una app:

```bash
cd ../MarcacionRosaSpa && npm run build:demo
```

y copiar su `www-demo/` a `public/demos/<proyecto>/`. **No compiles a `www/`**:
esa carpeta es la que Capacitor empaqueta dentro del APK, y acabaría enviando la
demo con datos falsos a producción.

**El rayo que parte la pantalla de Proyectos es geometría compartida.** Todo sale
de la espina de `lib/theme/bolt.ts` —posición y semiancho en cada altura—: los
dos filos, el recorte de cada panel, el cuerpo relleno y el desplazamiento de
cada fila de casillas. Si tocas la espina, las piezas siguen encajando solas.

Dos cosas que conviene no romper ahí:

- **La amplitud está calibrada.** El filo izquierdo no baja de 42% y el derecho
  no pasa de 71%, que es lo que deja ~40% de ancho a la demo y ~23% a la fila de
  casillas más estrecha. Ensanchar el rayo se los come a los dos a la vez.
- **El rayo es una capa a pantalla completa por encima de todo.** Su envoltorio
  necesita `pointer-events-none` o se traga cada clic de la página, incluidos
  los controles del panel de la izquierda. Solo la ficha expandida recupera el
  puntero.
- **Las filas de casillas salen de los picos del rayo**, no de valores escritos
  a mano: una fila por pico, separadas por el punto medio entre picos
  consecutivos. Cada fila arranca en el punto más a la izquierda que alcanza el
  rayo en su franja, y la primera casilla lleva el filo como borde izquierdo, de
  modo que entra en las concavidades en vez de quedarse en una vertical.
- **Las venas que separan las casillas no se dibujan.** Son el fondo de la fila
  asomando por los huecos que dejan los recortes. Trazarlas aparte habría
  significado mantener dos geometrías en sintonía; así es imposible que se
  descuadren. Ese fondo lleva el degradado del rayo dimensionado al viewport y
  subido lo que baja su fila, de modo que el color continúa de una fila a otra y
  coincide con el del rayo a la misma altura: por eso se leen como ramas suyas.
  El hueco se aplica también contra el filo, y esa vena pegada al cuerpo es la
  que conecta las demás con él.
- **La descarga es una sola.** El pulso del glitch vive en `ProjectsScreen` y se
  reparte al rayo y a las venas: con un `useGlitchPulse` propio en cada
  componente, la interferencia se vería partida en dos sucesos que no llegan a
  la vez. Todo el movimiento errático va con `steps(1)` y solo toca `transform`
  y `opacity`, igual que el aura de ki del menú.
- **Cada casilla tiene su propia caja, no la fila entera.** Si todas ocupasen la
  fila y solo cambiara el recorte, su contenido se centraría respecto a la fila
  y el recorte se lo llevaría por delante.
- **La expansión depende de que los dos estados tengan los mismos vértices.**
  Framer Motion solo interpola un `clip-path` de polígono en ese caso, y se
  cumple porque ambos salen de la misma espina y solo cambia cuánto se engorda.
  El engorde es aditivo, no proporcional: multiplicarlo dejaría las puntas casi
  igual de finas y quedarían esquinas de pantalla sin cubrir.

**`useMenuNavigation` sirve a tres pantallas.** El menú lo usa en vertical, las
pestañas del CV en horizontal y el selector de proyectos en rejilla, vía la
opción `orientation`. En rejilla, `skip` marca las casillas que la navegación
debe atravesar sin detenerse. Omitir `onConfirm` desactiva la captura global de
Enter, necesaria en pantallas que ya tienen botones enfocables.

## Pendiente

- Revisar con Dabrian los cuatro objetivos "por desbloquear" de
  `content/achievements.ts`: son los únicos textos del sitio que no salen de un
  hecho comprobable.
- Llenar la siguiente casilla del selector: hoy quedan 4 *PRÓXIMAMENTE*.
- Inicializar git y publicar el repositorio.
- Deploy en Vercel.
