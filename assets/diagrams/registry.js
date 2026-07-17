// Dispatcher: routes a diagram config (by "type") to its renderer.
// Add a new case here whenever a new diagrams/*.js renderer is added.
function renderDiagram(diagram){
  if(!diagram || !diagram.type) return '';
  switch(diagram.type){
    case 'venn-2set':
      return renderVennSVG(diagram);
    case 'arrow-diagram':
      return renderArrowDiagram(diagram);
    case 'cartesian-grid':
      return renderCartesianGrid(diagram);
    case 'function-graph':
      return renderFunctionGraph(diagram);
    default:
      return '';
  }
}
