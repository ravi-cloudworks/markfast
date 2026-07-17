// X/Y axis + curve plotter for the named real functions in Relations & Functions
// (identity, constant, quadratic, cubic, reciprocal, modulus, signum, greatest-integer)
// plus generic piecewise-quadratic pieces for custom graphs.
let functionGraphCounter = 0;

function renderFunctionGraph(cfg){
  const fnType = cfg.fn || 'identity';
  const xMin = cfg.xMin !== undefined ? cfg.xMin : -5;
  const xMax = cfg.xMax !== undefined ? cfg.xMax : 5;
  const yMin = cfg.yMin !== undefined ? cfg.yMin : -5;
  const yMax = cfg.yMax !== undefined ? cfg.yMax : 5;
  const uid = 'fgraph' + (functionGraphCounter++);

  const W = 300, H = 220, pad = 14;
  const plotW = W - pad * 2, plotH = H - pad * 2;

  function toPx(x, y){
    const clampedY = Math.max(yMin, Math.min(yMax, y));
    const px = pad + ((x - xMin) / (xMax - xMin)) * plotW;
    const py = pad + plotH - ((clampedY - yMin) / (yMax - yMin)) * plotH;
    return [px, py];
  }

  function pathFromPoints(points){
    let d = '';
    points.forEach((p, i) => {
      const [px, py] = toPx(p[0], p[1]);
      d += (i === 0 ? 'M' : 'L') + px.toFixed(1) + ',' + py.toFixed(1) + ' ';
    });
    return `<path d="${d.trim()}" fill="none" stroke="#5FD4C4" stroke-width="2"/>`;
  }

  function sampleCurve(fx, from, to, steps){
    const pts = [];
    for(let i = 0; i <= steps; i++){
      const x = from + (to - from) * i / steps;
      pts.push([x, fx(x)]);
    }
    return pts;
  }

  function dot(x, y, open){
    const [px, py] = toPx(x, y);
    return open
      ? `<circle cx="${px}" cy="${py}" r="3.2" fill="var(--panel)" stroke="#5FD4C4" stroke-width="1.6"/>`
      : `<circle cx="${px}" cy="${py}" r="3.2" fill="#5FD4C4"/>`;
  }

  let curveSVG = '';

  if(fnType === 'identity'){
    curveSVG = pathFromPoints([[xMin, xMin], [xMax, xMax]]);
  } else if(fnType === 'constant'){
    const c = cfg.c !== undefined ? cfg.c : 3;
    curveSVG = pathFromPoints([[xMin, c], [xMax, c]]);
  } else if(fnType === 'quadratic'){
    curveSVG = pathFromPoints(sampleCurve(x => x * x, xMin, xMax, 40));
  } else if(fnType === 'cubic'){
    curveSVG = pathFromPoints(sampleCurve(x => x * x * x, xMin, xMax, 40));
  } else if(fnType === 'reciprocal'){
    curveSVG =
      pathFromPoints(sampleCurve(x => 1 / x, xMin, -0.25, 24)) +
      pathFromPoints(sampleCurve(x => 1 / x, 0.25, xMax, 24));
  } else if(fnType === 'modulus'){
    curveSVG = pathFromPoints([[xMin, Math.abs(xMin)], [0, 0], [xMax, Math.abs(xMax)]]);
  } else if(fnType === 'signum'){
    curveSVG =
      pathFromPoints([[xMin, -1], [-0.001, -1]]) +
      pathFromPoints([[0.001, 1], [xMax, 1]]) +
      dot(0, -1, true) + dot(0, 1, true) + dot(0, 0, false);
  } else if(fnType === 'greatest-integer'){
    const lo = Math.floor(xMin), hi = Math.ceil(xMax);
    for(let n = lo; n < hi; n++){
      const segFrom = Math.max(n, xMin), segTo = Math.min(n + 1, xMax);
      if(segFrom < segTo){
        curveSVG += pathFromPoints([[segFrom, n], [segTo, n]]);
        curveSVG += dot(segFrom, n, false);
        curveSVG += dot(segTo, n, true);
      }
    }
  } else if(fnType === 'piecewise' && Array.isArray(cfg.pieces)){
    cfg.pieces.forEach(p => {
      const a = p.a || 0, b = p.b || 0, c = p.c || 0;
      const fx = x => a * x * x + b * x + c;
      curveSVG += pathFromPoints(sampleCurve(fx, p.from, p.to, 20));
      curveSVG += dot(p.from, fx(p.from), !!p.fromOpen);
      curveSVG += dot(p.to, fx(p.to), !!p.toOpen);
    });
  }

  const [ax0, ay0] = toPx(xMin, 0);
  const [ax1, ay1] = toPx(xMax, 0);
  const [bx0, by0] = toPx(0, yMin);
  const [bx1, by1] = toPx(0, yMax);

  const svg = `
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="axArrow-${uid}" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill="#9FA3C4"/>
        </marker>
      </defs>
      <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="10" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/>
      <line x1="${ax0}" y1="${ay0}" x2="${ax1}" y2="${ay1}" stroke="#9FA3C4" stroke-width="1.2" marker-end="url(#axArrow-${uid})"/>
      <line x1="${bx0}" y1="${by0}" x2="${bx1}" y2="${by1}" stroke="#9FA3C4" stroke-width="1.2" marker-end="url(#axArrow-${uid})"/>
      ${curveSVG}
    </svg>`;

  return `
    <div class="diagram-wrap">
      ${svg}
      ${cfg.caption ? `<span class="diagram-caption">${cfg.caption}</span>` : ''}
    </div>`;
}
