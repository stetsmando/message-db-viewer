// Reference: https://www.youtube.com/watch?v=y7DxbW9nwmo&ab_channel=CurranKelleher 
const { forceSimulation } = d3;

const graphMessageDisplay = document.getElementById('graphMessage');
const svg = d3.select('#container');
const width = Number.parseInt(svg.attr('width'));
const height = Number.parseInt(svg.attr('height'));
const centerX = width / 2;
const centerY = height / 2;


function messageToNode(message) {
  return {
    data: message,
    size: GRAPH_NODE_SIZE,
    fill: message.stream_name.indexOf(':command') > -1 ? blue : orange,
    selected: null,
  }
}

function responseDataToGraph(messages) {
  const nodes = [];
  const links = [];
  const globalPositionLookUp = {};

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const { global_position, metadata: { causationMessageGlobalPosition } } = message;
    globalPositionLookUp[global_position] = i
    const node = messageToNode(message);
    nodes.push(node);

    if (causationMessageGlobalPosition) {
      if (globalPositionLookUp[causationMessageGlobalPosition] === undefined) {
        throw new Error('Failed to build the graph!');
      }
      const target = globalPositionLookUp[causationMessageGlobalPosition];
      links.push({ source: i, target, distance: GRAPH_LINK_DISTANCE});
    }
  }

  nodes[0].selected = true;

  return [nodes, links];
}

function renderMessagesGraph(messages) {
  if (messages.length === 0)
    return;

  const [nodes, links] = responseDataToGraph(messages);
  graphMessageDisplay.innerText = JSON.stringify(nodes[0], null, 2);

  console.log({
    nodes,
    links
  })

  const simulation = forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-50))
    .force('link', d3.forceLink(links).distance(link => link.distance))
    .force('center', d3.forceCenter(centerX, centerY));

  let clickStart = null;

  const drag = d3.drag()
    .on('start', (event, node) => {
      clickStart = Date.now();
    })
    .on('end', (event, node) => {
      const clickTimeMS = 100;
      const now = Date.now();
      if (now < clickStart + clickTimeMS) {
        // click
        nodes[0].selected = false;
        graphMessageDisplay.innerText = JSON.stringify(node.data, null, 2);
        simulation.alpha(1);
        simulation.restart();
      }
    })
    .on('drag', (event, node) => {
      node.fx = event.x;
      node.fy = event.y;
      simulation.alpha(1);
      simulation.restart();
    })

  const lines = svg
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', 'black')

  const circles = svg
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('fill', node => node.fill)
    .attr('r', node => node.size)
    .attr('stroke', green)
    .attr('stroke-width', node => node.selected ? 3 : 0)
    .call(drag);

  const text = svg
    .selectAll('text')
    .data(nodes)
    .enter()
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('pointer-events', 'none')
    .text(node => `${node.data.type}
    ${node.data.global_position}`)

  simulation.on('tick', () => {
    circles
      .attr('cx', node => node.x)
      .attr('cy', node => node.y);

    text 
      .attr('x', node => node.x)
      .attr('y', node => node.y);

    lines
      .attr('x1', link => link.source.x)
      .attr('y1', link => link.source.y)
      .attr('x2', link => link.target.x)
      .attr('y2', link => link.target.y)
  });
}
