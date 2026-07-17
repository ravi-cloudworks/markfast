// Coordinate/Argand plane — labelled points on a full four-quadrant plane,
// with optional origin-distance lines (modulus) and point-to-point
// connecting lines (e.g. a complex number and its conjugate).
function renderCoordinatePlane(cfg){
  const points = cfg.points || [];
  const connections = cfg.connections || [];
  const originLines = cfg.originLines || [];

  const xMin = cfg.xMin !== undefined ? cfg.xMin : -6;
  const xMax = cfg.xMax !== undefined ? cfg.xMax : 6;
  const yMin = cfg.yMin !== undefined ? cfg.yMin : -6;
  const yMax = cfg.yMax !== undefined ? cfg.yMax : 6;

  const W = 320, H = 260, pad = 18;
  const plotW = W - pad * 2, plotH = H - pad * 2;

  function toPx(x, y){
    const px = pad + ((x - xMin) / (xMax - xMin)) * plotW;
    const py = pad + plotH - ((y - yMin) / (yMax - yMin)) * plotH;
    return [px, py];
  }

  const pxPoints = points.map(p => {
    const [px, py] = toPx(p.x, p.y);
    return { px, py, label: p.label || `(${p.x},${p.y})` };
  });

  const originLinesSVG = originLines.map(i => {
    const p = pxPoints[i];
    if(!p) return '';
    const [ox, oy] = toPx(0, 0);
    return `<line x1="${ox}" y1="${oy}" x2="${p.px}" y2="${p.py}" stroke="#5FD4C4" stroke-width="1.5" opacity="0.85"/>`;
  }).join('');

  const connectionsSVG = connections.map(([i, j]) => {
    const a = pxPoints[i], b = pxPoints[j];
    if(!a || !b) return '';
    return `<line x1="${a.px}" y1="${a.py}" x2="${b.px}" y2="${b.py}" stroke="#E8B84B" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.85"/>`;
  }).join('');

  const pointsSVG = pxPoints.map(p => `
    <circle cx="${p.px}" cy="${p.py}" r="3.5" fill="#5FD4C4"/>
    <text x="${p.px + 8}" y="${p.py - 6}" font-family="JetBrains Mono, monospace" font-size="12" fill="#EEEFF7">${p.label}</text>`).join('');

  const [ax0, ay0] = toPx(xMin, 0);
  const [ax1, ay1] = toPx(xMax, 0);
  const [bx0, by0] = toPx(0, yMin);
  const [bx1, by1] = toPx(0, yMax);

  const svg = `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="cpArrow" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#9FA3C4"/>
        </marker>
      </defs>
      <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="10" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/>
      <line x1="${ax0}" y1="${ay0}" x2="${ax1}" y2="${ay1}" stroke="#9FA3C4" stroke-width="1.2" marker-end="url(#cpArrow)"/>
      <line x1="${bx0}" y1="${by0}" x2="${bx1}" y2="${by1}" stroke="#9FA3C4" stroke-width="1.2" marker-end="url(#cpArrow)"/>
      ${originLinesSVG}
      ${connectionsSVG}
      ${pointsSVG}
    </svg>`;

  return `
    <div class="diagram-wrap">
      ${svg}
      ${cfg.caption ? `<span class="diagram-caption">${cfg.caption}</span>` : ''}
    </div>`;
}
