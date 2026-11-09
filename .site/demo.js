// Demo de la landing: simula una aprobacion 2 de 3. No toca ninguna red.
const saldo = document.getElementById('saldo');
const firmas = document.getElementById('firmas');
const estado = document.getElementById('estado');

const INK = '#07140E';
const FACE = {
  feliz: '<path d="M33 52q9-12 18 0M69 52q9-12 18 0M38 72q22 20 44 0" fill="none" stroke="#07140E" stroke-width="7" stroke-linecap="round"/>',
  quieto: '<path d="M33 54h18M69 54h18M44 78h32" fill="none" stroke="#07140E" stroke-width="7" stroke-linecap="round"/>',
  vos: '<text x="60" y="71" text-anchor="middle" font-family="Bagel Fat One, Arial Rounded MT Bold, sans-serif" font-size="32" fill="#07140E">vos</text>',
};

function moneda({ cara, relleno, punteado, salta, etiqueta, nombre }) {
  return `<div class="signer${salta ? ' hop' : ''}">
    <svg role="img" aria-label="${etiqueta}" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="52" fill="${relleno}" stroke="${INK}" stroke-width="8"${punteado ? ' stroke-dasharray="12 11"' : ''}/>
      ${FACE[cara]}
    </svg>
    <span>${nombre}</span>
  </div>`;
}

const VISTAS = {
  abierta: {
    saldo: '$ 18.400',
    tuya: { cara: 'vos', relleno: '#FFFFFF', punteado: true, etiqueta: 'Tu firma, pendiente', nombre: 'Tu firma' },
    html: `<p>1 de 2 firmas. Si aprobás, sale el pago.</p>
      <div class="demo-actions">
        <button type="button" class="press btn btn-solid" data-ir="pagada">Aprobar</button>
        <button type="button" class="press btn btn-ghost" data-ir="frenada">Mejor no</button>
      </div>`,
  },
  pagada: {
    saldo: '$ 14.200',
    tuya: { cara: 'feliz', relleno: '#FFEA00', salta: true, etiqueta: 'Firmaste', nombre: 'Firmaste' },
    html: `<div class="result"><img class="pop" src="vaqui.png" alt="">
      <p>¡Salió! Con dos firmas se pagaron $ 4.200, y el movimiento queda a la vista de todo el grupo.</p></div>
      <button type="button" class="press btn btn-ghost btn-small" data-ir="abierta">Probar de nuevo</button>`,
  },
  frenada: {
    saldo: '$ 18.400',
    tuya: { cara: 'quieto', relleno: '#E4DCCB', etiqueta: 'No firmaste', nombre: 'No firmaste' },
    html: `<p>Con una sola firma, la plata no se mueve. Para descartar la propuesta del todo, dos responsables la reemplazan.</p>
      <button type="button" class="press btn btn-ghost btn-small" data-ir="abierta">Probar de nuevo</button>`,
  },
};

function mostrar(nombre) {
  const vista = VISTAS[nombre];
  saldo.textContent = vista.saldo;
  firmas.innerHTML = [
    moneda({ cara: 'feliz', relleno: '#C6FF1A', etiqueta: 'Otro responsable ya firmó', nombre: 'Ya firmó' }),
    moneda(vista.tuya),
    moneda({ cara: 'quieto', relleno: '#E4DCCB', etiqueta: 'Tercer responsable, sin firmar', nombre: 'Sin firmar' }),
  ].join('');
  estado.innerHTML = vista.html;
}

estado.addEventListener('click', (evento) => {
  const destino = evento.target.closest('[data-ir]');
  if (destino) mostrar(destino.dataset.ir);
});

mostrar('abierta');
