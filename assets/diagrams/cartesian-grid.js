// Cartesian-product lattice diagram — a grid of dots at (x,y) intersections.
// Used for A × B illustrations (Cartesian Products of Sets).
function renderCartesianGrid(cfg){
  const xs = cfg.labelX || [];
  const ys = cfg.labelY || [];

  const cellW = 56, cellH = 32;
  const padLeft = 44, padTop = 16, padRight = 20, padBottom = 32;
  const width = padLeft + cellW * Math.max(xs.length, 1) + padRight;
  const height = padTop + cellH * Math.max(ys.length, 1) + padBottom;

  const colX = xs.map((_, i) => padLeft + cellW * (i + 0.5));
  const rowY = ys.map((_, i) => height - padBottom - cellH * (i + 0.5));

  let gridLines = '';
  colX.forEach(x => { gridLines += `<line x1="${x}" y1="${padTop}" x2="${x}" y2="${height - padBottom}" stroke="var(--line)" stroke-width="1"/>`; });
  rowY.forEach(y => { gridLines += `<line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="var(--line)" stroke-width="1"/>`; });

  let dots = '';
  colX.forEach(x => { rowY.forEach(y => { dots += `<circle cx="${x}" cy="${y}" r="3" fill="#5FD4C4"/>`; }); });

  const xLabels = xs.map((label, i) => `<text x="${colX[i]}" y="${height - padBottom + 18}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="#9FA3C4">${label}</text>`).join('');
  const yLabels = ys.map((label, i) => `<text x="${padLeft - 10}" y="${rowY[i] + 4}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="12" fill="#9FA3C4">${label}</text>`).join('');

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="10" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/>
      ${gridLines}
      ${dots}
      ${xLabels}
      ${yLabels}
    </svg>`;

  return `
    <div class="diagram-wrap">
      ${svg}
      ${cfg.caption ? `<span class="diagram-caption">${cfg.caption}</span>` : ''}
    </div>`;
}
