// Two-set Venn diagram — used for set operations (union, intersection, difference, complement).
let vennCounter = 0;

function renderVennSVG(cfg){
  const uid = 'venn' + (vennCounter++);
  const labelU = cfg.labelU || 'U';
  const labelA = cfg.labelA || 'A';
  const labelB = cfg.labelB || 'B';
  const shade = cfg.shade || 'none';

  // circle geometry (shared across all shade cases)
  const ax = 118, ay = 100, ar = 68;
  const bx = 198, ay2 = 100, br = 68;
  const by = ay2;

  let defsContent = '';   // goes inside <defs>...</defs>
  let overlayGroup = '';  // the actual shaded shape, painted AFTER the panel background

  if(shade === 'intersection'){
    // nested clip-path = geometric AND of the two circles
    defsContent = `
      <clipPath id="clipA-${uid}"><circle cx="${ax}" cy="${ay}" r="${ar}"/></clipPath>
      <clipPath id="clipB-${uid}"><circle cx="${bx}" cy="${by}" r="${br}"/></clipPath>`;
    overlayGroup = `
      <g clip-path="url(#clipA-${uid})">
        <g clip-path="url(#clipB-${uid})">
          <rect x="0" y="0" width="320" height="200" fill="var(--gold)" opacity="0.55"/>
        </g>
      </g>`;
  } else if(shade !== 'none'){
    // mask-based paint/subtract: white = show overlay, black = hide
    let maskContent = '';
    if(shade === 'union'){
      maskContent = `<rect width="320" height="200" fill="black"/>
        <circle cx="${ax}" cy="${ay}" r="${ar}" fill="white"/>
        <circle cx="${bx}" cy="${by}" r="${br}" fill="white"/>`;
    } else if(shade === 'onlyA'){
      maskContent = `<rect width="320" height="200" fill="black"/>
        <circle cx="${ax}" cy="${ay}" r="${ar}" fill="white"/>
        <circle cx="${bx}" cy="${by}" r="${br}" fill="black"/>`;
    } else if(shade === 'onlyB'){
      maskContent = `<rect width="320" height="200" fill="black"/>
        <circle cx="${bx}" cy="${by}" r="${br}" fill="white"/>
        <circle cx="${ax}" cy="${ay}" r="${ar}" fill="black"/>`;
    } else if(shade === 'complementA'){
      maskContent = `<rect width="320" height="200" fill="white"/>
        <circle cx="${ax}" cy="${ay}" r="${ar}" fill="black"/>`;
    } else if(shade === 'complementB'){
      maskContent = `<rect width="320" height="200" fill="white"/>
        <circle cx="${bx}" cy="${by}" r="${br}" fill="black"/>`;
    }
    defsContent = `<mask id="mask-${uid}">${maskContent}</mask>`;
    overlayGroup = `
      <g mask="url(#mask-${uid})">
        <rect x="0" y="0" width="320" height="200" fill="var(--gold)" opacity="0.55"/>
      </g>`;
  }

  const svg = `
    <svg width="300" height="188" viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">
      <defs>${defsContent}</defs>
      <rect x="4" y="4" width="312" height="192" rx="12" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/>
      ${overlayGroup}
      <circle cx="${ax}" cy="${ay}" r="${ar}" fill="none" stroke="#5FD4C4" stroke-width="2"/>
      <circle cx="${bx}" cy="${by}" r="${br}" fill="none" stroke="#E8B84B" stroke-width="2"/>
      <text x="16" y="24" font-family="JetBrains Mono, monospace" font-size="13" fill="#9FA3C4">${labelU}</text>
      <text x="${ax-46}" y="${ay+5}" font-family="JetBrains Mono, monospace" font-size="15" fill="#5FD4C4">${labelA}</text>
      <text x="${bx+34}" y="${by+5}" font-family="JetBrains Mono, monospace" font-size="15" fill="#E8B84B">${labelB}</text>
    </svg>`;

  return `
    <div class="diagram-wrap">
      ${svg}
      ${cfg.caption ? `<span class="diagram-caption">${cfg.caption}</span>` : ''}
    </div>`;
}
