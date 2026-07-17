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

  // Reserve enough width for the longest label on each side — a fixed
  // canvas width clips longer names (e.g. "Chandra") past the SVG edge.
  const charW = 7.6; // ~ JetBrains Mono at font-size 13
  function labelSpace(labels){
    const longest = labels.reduce((m, l) => Math.max(m, String(l).length), 1);
    return longest * charW + 14;
  }
  const leftLabelSpace = labelSpace(left);
  const rightLabelSpace = labelSpace(right);
  const ovalRx = 55, ovalGap = 90;

  const leftCx = leftLabelSpace + ovalRx;
  const rightCx = leftCx + ovalRx + ovalGap + ovalRx;
  const width = rightCx + ovalRx + rightLabelSpace;
  const ovalCy = bodyH / 2;
  const ovalRy = ovalCy - 6;

  // How far a dot can sit from the oval's own centre-line at height y and
  // still be safely inside the ellipse (it narrows away from the centre).
  function safeInset(y, desired){
    const ratio = Math.min(1, Math.abs(y - ovalCy) / ovalRy);
    const localHalfWidth = ovalRx * Math.sqrt(Math.max(0, 1 - ratio * ratio));
    return Math.min(desired, Math.max(localHalfWidth - 10, 6));
  }

  function yFor(i, n){
    if(n <= 1) return ovalCy;
    const span = bodyH - topPad * 2;
    return topPad + (span * i) / (n - 1);
  }

  const dotInset = 16; // how far in from the oval's centre-line each dot sits
  const labelGap = 10; // gap between a dot and its own label

  const leftDots = left.map((label, i) => {
    const y = yFor(i, left.length);
    const x = leftCx - safeInset(y, dotInset);
    return { x, y, label };
  });
  const rightDots = right.map((label, i) => {
    const y = yFor(i, right.length);
    const x = rightCx + safeInset(y, dotInset);
    return { x, y, label };
  });

  const leftDotsSVG = leftDots.map(d => `
    <circle cx="${d.x}" cy="${d.y}" r="3" fill="#5FD4C4"/>
    <text x="${d.x - labelGap}" y="${d.y + 4}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="13" fill="#EEEFF7">${d.label}</text>`).join('');

  const rightDotsSVG = rightDots.map(d => `
    <circle cx="${d.x}" cy="${d.y}" r="3" fill="#E8B84B"/>
    <text x="${d.x + labelGap}" y="${d.y + 4}" font-family="JetBrains Mono, monospace" font-size="13" fill="#EEEFF7">${d.label}</text>`).join('');

  // Each arrow is a plain connecting line, plus a short stub at the
  // midpoint carrying the arrowhead marker — so the arrowhead reads as
  // "pointing along the path" instead of jamming into the destination dot.
  const arrowsSVG = pairs.map(([li, ri]) => {
    const a = leftDots[li], b = rightDots[ri];
    if(!a || !b) return '';
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len, uy = dy / len;
    const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
    const half = 6;
    const stubX1 = midX - ux * half, stubY1 = midY - uy * half;
    const stubX2 = midX + ux * half, stubY2 = midY + uy * half;
    return `
      <line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="#EEEFF7" stroke-width="1.3" opacity="0.85"/>
      <line x1="${stubX1.toFixed(1)}" y1="${stubY1.toFixed(1)}" x2="${stubX2.toFixed(1)}" y2="${stubY2.toFixed(1)}" stroke="#EEEFF7" stroke-width="1.3" marker-end="url(#arrowhead-${uid})"/>`;
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
        <ellipse cx="${leftCx}" cy="${ovalCy}" rx="${ovalRx}" ry="${ovalRy}" fill="var(--panel)" stroke="#5FD4C4" stroke-width="1.5"/>
        <ellipse cx="${rightCx}" cy="${ovalCy}" rx="${ovalRx}" ry="${ovalRy}" fill="var(--panel)" stroke="#E8B84B" stroke-width="1.5"/>
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
