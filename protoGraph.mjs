const protoGraph = d3.select('#graph-proto');
const protoGroup = protoGraph.append('g');
const protoWidth = Number.parseInt(protoGraph.attr('width'));
const protoHeight = Number.parseInt(protoGraph.attr('height'));
const protoCenterX = protoWidth / 2;
const protoCenterY = protoHeight / 2;

const protoZoom = d3.zoom()
  .scaleExtent([0.5, 32])
  .on('zoom', protoZoomed);

function protoZoomed(zoomEvent) {
  const { transform } = zoomEvent;
  protoGroup.attr('transform', transform);
}

protoGraph.call(protoZoom);

const protoNodes = [
  {
    data: {
    },
    size: GRAPH_NODE_SIZE,
    fill: blue,
    selected: null,
  },
  {
    data: {
    },
    size: GRAPH_NODE_SIZE,
    fill: blue,
    selected: null,
  },
  {
    data: {
    },
    size: GRAPH_NODE_SIZE,
    fill: blue,
    selected: null,
  },
];
const causationLinks = [
  { source: 1, target: 0, stroke: 'black', distance: 130 },
  { source: 2, target: 1, stroke: 'black', distance: 130 },
];
const streamLinks = [
  { source: 2, target: 0, stroke: 'green', distance: 130 },
];

const protoLinks = [
  ...causationLinks,
  ...streamLinks,
];

const protoDrag = d3.drag()
.on('drag', (event, node) => {
  node.fx = event.x;
  node.fy = event.y;
  protoSimulation.alpha(1);
  protoSimulation.restart();
});

const protoSimulation = forceSimulation(protoNodes)
  .force('charge', d3.forceManyBody().strength(0))
  .force('link', d3.forceLink(protoLinks).distance(link => link.distance))
  .force('center', d3.forceCenter(protoCenterX, protoCenterY));

// const protoLines = protoGraph 
const protoLines = protoGroup
  .selectAll('line')
  .data(protoLinks)
  .enter()
  .append('line')
  .attr('stroke', node => node.stroke)

const protoCircles = protoGroup
  .selectAll('circle')
  .data(protoNodes)
  .enter()
  .append('circle')
  .attr('fill', node => node.fill)
  .attr('r', node => node.size)
  .attr('stroke', green)
  .attr('stroke-width', node => node.selected ? 3 : 0)
  .call(protoDrag);

// const protoCircles = protoGraph
//   .selectAll('circle')
//   .data(protoNodes)
//   .enter()
//   .append('circle')
//   .attr('fill', node => node.fill)
//   .attr('r', node => node.size)
//   .attr('stroke', green)
//   .attr('stroke-width', node => node.selected ? 3 : 0)
//   .attr('transform', node => `translate(${node})`)
//   .call(protoDrag);

// const protoText = protoGraph 
const protoText = protoGroup
  .selectAll('text')
  .data(protoNodes)
  .enter()
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('dominant-baseline', 'middle')
  .style('pointer-events', 'none')
  .text(node => {
    return node.index;
  })


protoSimulation.on('tick', () => {
  protoCircles
    .attr('cx', node => node.x)
    .attr('cy', node => node.y);

  protoText 
    .attr('x', node => node.x)
    .attr('y', node => node.y);

  protoLines
    .attr('x1', link => link.source.x)
    .attr('y1', link => link.source.y)
    .attr('x2', link => link.target.x)
    .attr('y2', link => link.target.y)
});