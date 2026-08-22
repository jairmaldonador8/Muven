/*
  MuvenLoader — símbolo de carga de Muven.
  La M se traza en bucle (un trazo coral recorre el contorno) hasta que llamas hide();
  entonces el trazo se cierra, la M aparece sólida y el overlay se desvanece.

  Uso:
    <script src="./assets/muven-loader.js"></script>

    MuvenLoader.show();                       // overlay a pantalla completa
    MuvenLoader.show({ target: el });         // cubre solo ese elemento (necesita position: relative)
    await MuvenLoader.hide();                 // cierra el trazo, muestra la M sólida y desvanece
    await MuvenLoader.hide({ solid: 600 });   // cuánto tiempo se ve la M sólida antes de irse (ms)

  Personalización por CSS en el contenedor o en :root:
    --mv-loader-size   (default 72px)
    --mv-loader-color  (default var(--coral) / #ef4444)
    --mv-loader-bg     (fondo del overlay; default crema translúcido según el tema)
*/
(function (global) {
  'use strict';

  const M_PATH = 'M581.26,897.54V182.38c0-19.89,16.12-36.01,36.01-36.01h95.02c20.08,0,36.14,16.64,35.44,36.71-4.55,130.87-2.35,565.91,229.1,547.7,0,0,205.81-11.17,195.07-548.4-.39-19.51,15.25-35.58,34.76-35.63l99.53-.28c17.96-.05,32.55,14.49,32.55,32.45v717c0,20.83-16.88,37.71-37.71,37.71h-93.34c-20.57,0-37.24-16.67-37.24-37.24v-220.8s-63.2,116.42-188.84,129.66c-3.66.39-7.36.09-11.02.35-26.42,1.93-149.3,2.53-221.04-142.62v233.95c0,20.27-16.44,36.71-36.71,36.71h-95.49c-19.93,0-36.09-16.16-36.09-36.09Z';

  const CSS = `
    .mv-loader {
      position: fixed;
      inset: 0;
      z-index: 1500;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--mv-loader-bg, rgba(240, 232, 226, 0.82));
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      opacity: 0;
      transition: opacity 0.35s ease;
      pointer-events: none;
    }
    [data-theme="dark"] .mv-loader { background: var(--mv-loader-bg, rgba(13, 9, 8, 0.82)); }
    .mv-loader.mv-visible { opacity: 1; pointer-events: auto; }
    .mv-loader.mv-target { position: absolute; z-index: 20; }
    .mv-loader svg { width: var(--mv-loader-size, 72px); height: auto; overflow: visible; display: block; }
    .mv-loader path {
      fill: var(--mv-loader-color, var(--coral, #ef4444));
      fill-opacity: 0;
      stroke: var(--mv-loader-color, var(--coral, #ef4444));
      stroke-width: 18;
      stroke-linejoin: round;
      stroke-linecap: round;
    }
    @media (prefers-reduced-motion: reduce) {
      .mv-loader path { fill-opacity: 1; stroke-opacity: 0; }
    }
  `;

  const LOOP_MS = 1400;     // una vuelta completa del trazo
  const DASH_RATIO = 0.28;  // largo del "cometa" respecto al contorno

  let styleInjected = false;
  let current = null;       // { el, path, len, loop, host }

  function injectStyle() {
    if (styleInjected) return;
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    styleInjected = true;
  }

  function prefersReducedMotion() {
    return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function show(opts) {
    opts = opts || {};
    injectStyle();
    if (current) return current.el;

    const el = document.createElement('div');
    el.className = 'mv-loader' + (opts.target ? ' mv-target' : '');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-label', opts.label || 'Cargando');
    el.innerHTML = `<svg viewBox="580 140 760 770" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="${M_PATH}"/></svg>`;
    const host = opts.target || document.body;
    host.appendChild(el);

    const path = el.querySelector('path');
    const len = path.getTotalLength();
    let loop = null;

    if (!prefersReducedMotion()) {
      const dash = len * DASH_RATIO;
      path.style.strokeDasharray = `${dash} ${len}`;
      loop = path.animate(
        [{ strokeDashoffset: dash + len }, { strokeDashoffset: 0 }],
        { duration: LOOP_MS, iterations: Infinity, easing: 'linear' }
      );
    }

    requestAnimationFrame(() => el.classList.add('mv-visible'));
    current = { el, path, len, loop, host };
    return el;
  }

  function hide(opts) {
    opts = opts || {};
    if (!current) return Promise.resolve();
    const { el, path, len, loop } = current;
    current = null;
    const solidMs = opts.solid != null ? opts.solid : 450;

    const finish = () => new Promise(resolve => {
      el.classList.remove('mv-visible');
      setTimeout(() => { el.remove(); resolve(); }, 380);
    });

    if (!loop) return finish();

    // Cierra el trazo desde donde va el cometa hasta cubrir todo el contorno, luego rellena
    const offsetNow = parseFloat(getComputedStyle(path).strokeDashoffset) || 0;
    loop.cancel();
    path.style.strokeDashoffset = offsetNow;
    const close = path.animate(
      [{ strokeDasharray: `${len * DASH_RATIO} ${len}`, strokeDashoffset: offsetNow },
       { strokeDasharray: `${len} 0`, strokeDashoffset: 0 }],
      { duration: 520, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }
    );
    return close.finished
      .then(() => path.animate(
        [{ fillOpacity: 0, strokeOpacity: 1 }, { fillOpacity: 1, strokeOpacity: 0 }],
        { duration: 380, easing: 'ease', fill: 'forwards' }
      ).finished)
      .then(() => new Promise(r => setTimeout(r, solidMs)))
      .then(finish);
  }

  global.MuvenLoader = { show, hide, get active() { return !!current; } };
})(window);
