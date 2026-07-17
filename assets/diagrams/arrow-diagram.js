// Arrow diagram — two labelled ovals of dots with arrows between them.
// Used for Relations & Functions: "is this a relation/function" style figures.
let arrowDiagramCounter = 0;

function renderArrowDiagram(cfg){
  const uid = 'arrowd' + (arrowDiagramCounter++);
  const labelLeft = cfg.labelLeft || 'P';
  const labelRight = cfg.labelRight || 'Q';
  const left = cfg.left || [];
  const right = cfg.right || [];
  const pairs = cfg.pairs || [];

  const rowH = 28;
  const topPad = 30;
  const rows = Math.max(left.length, right.length, 1);
  const bodyH = topPad * 2 + (rows - 1) * rowH;
  const width = 340;

  const leftCx = 95, rightCx = width - 95;
  const ovalRx = 55, ovalRy = bodyH / 2 - 6;
  const dotLeftX = leftCx + ovalRx - 14;
  const dotRightX = rightCx - ovalRx + 14;

  function yFor(i, n){
    if(n <= 1) return bodyH / 2;
    const span = bodyH - topPad * 2;
    return topPad + (span * i) / (n - 1);
  }

  const leftDots = left.map((label, i) => ({ x: dotLeftX, y: yFor(i, left.length), label }));
  const rightDots = right.map((label, i) => ({ x: dotRightX, y: yFor(i, right.length), label }));

  const leftDotsSVG = leftDots.map(d => `
    <circle cx="${d.x}" cy="${d.y}" r="3" fill="#5FD4C4"/>
    <text x="${leftCx - ovalRx - 8}" y="${d.y + 4}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="13" fill="#EEEFF7">${d.label}</text>`).join('');

  const rightDotsSVG = rightDots.map(d => `
    <circle cx="${d.x}" cy="${d.y}" r="3" fill="#E8B84B"/>
    <text x="${rightCx + ovalRx + 8}" y="${d.y + 4}" font-family="JetBrains Mono, monospace" font-size="13" fill="#EEEFF7">${d.label}</text>`).join('');

  const arrowsSVG = pairs.map(([li, ri]) => {
    const a = leftDots[li], b = rightDots[ri];
    if(!a || !b) return '';
    return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#EEEFF7" stroke-width="1.3" opacity="0.85" marker-end="url(#arrowhead-${uid})"/>`;
  }).join('');

  const height = bodyH + 30;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrowhead-${uid}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#EEEFF7"/>
        </marker>
      </defs>
      <text x="${leftCx}" y="18" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" fill="#5FD4C4">${labelLeft}</text>
      <text x="${rightCx}" y="18" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="13" fill="#E8B84B">${labelRight}</text>
      <g transform="translate(0,24)">
        <ellipse cx="${leftCx}" cy="${bodyH/2}" rx="${ovalRx}" ry="${ovalRy}" fill="var(--panel)" stroke="#5FD4C4" stroke-width="1.5"/>
        <ellipse cx="${rightCx}" cy="${bodyH/2}" rx="${ovalRx}" ry="${ovalRy}" fill="var(--panel)" stroke="#E8B84B" stroke-width="1.5"/>
        ${arrowsSVG}
        ${leftDotsSVG}
        ${rightDotsSVG}
      </g>
    </svg>`;

  return `
    <div class="diagram-wrap">
      ${svg}
      ${cfg.caption ? `<span class="diagram-caption">${cfg.caption}</span>` : ''}
    </div>`;
}
