// Reference: https://www.youtube.com/watch?v=y7DxbW9nwmo&ab_channel=CurranKelleher 
const { forceSimulation } = d3;

const graphMessageDisplay = document.getElementById('graphMessage');
const svg = d3.select('#container');
const group = svg.append('g');
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

function normalizeStreamName(streamName) {
  const pos = streamName.indexOf(':command');
  if (pos > -1) {
    const [category, id] = streamName.split(':command');
    return category + id;
  }

  return streamName;
}

function responseDataToGraph(messages) {
  const nodes = [];
  const causationLinks = [];
  const streamLinks = [];
  const globalPositionLookUp = {};
  const streamsLookup = {};

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const {
      stream_name: streamName,
      global_position: globalPosition,
      metadata: { causationMessageGlobalPosition }
    } = message;
    globalPositionLookUp[globalPosition] = i
    const node = messageToNode(message);
    nodes.push(node);

    if (causationMessageGlobalPosition) {
      if (globalPositionLookUp[causationMessageGlobalPosition] === undefined) {
        throw new Error('Failed to build the graph!');
      }
      const target = globalPositionLookUp[causationMessageGlobalPosition];
      causationLinks.push({
        source: i,
        target,
        distance: GRAPH_LINK_DISTANCE,
        stroke: 'black',
        strokeWidth: '2',
      });
    }

    const normalizedStreamName = normalizeStreamName(streamName);

    if (!streamsLookup[normalizedStreamName]) {
      streamsLookup[normalizedStreamName] = [];
    }

    streamsLookup[normalizedStreamName].push(i)
  }

  // Brute force way, iterate over each 'stream name' and build a link manually
  // It would be nice if we only ever had 1 connection between two nodes, regardless of it's type

  Object.keys(streamsLookup).forEach(key => {
    const items = streamsLookup[key];
    console.log({
      key,
      items
    })
    for (let i = items.length - 1; i > 0; i--) {
      streamLinks.push({
        source: items[i],
        target: items[i-1],
        distance: GRAPH_LINK_DISTANCE,
        stroke: 'green',
        strokeDashArray: '4',
        strokeWidth: '2',
      });
    }
  });

  nodes[0].selected = true;

  return [nodes, [
    ...streamLinks,
    ...causationLinks,
  ]];
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
    // .force('charge', d3.forceManyBody().strength(0))
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
        simulation.alpha(.2);
        simulation.restart();
      }
    })
    .on('drag', (event, node) => {
      node.fx = event.x;
      node.fy = event.y;
      simulation.alpha(.2);
      simulation.restart();
    })

  const lines = group 
    .selectAll('line')
    .data(links)
    .enter()
    .append('line')
    .attr('stroke', node => node.stroke)
    .attr('stroke-dasharray', node => node.strokeDashArray || '')
    .attr('stroke-width', node => node.strokeWidth)

  const circles = group
    .selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
    .attr('fill', node => node.fill)
    .attr('r', node => node.size)
    .attr('stroke', green)
    .attr('stroke-width', node => node.selected ? 3 : 0)
    .call(drag);

  const text = group
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

const zoom = d3.zoom()
  .scaleExtent([0.5, 32])
  .on('zoom', zoomed);

function zoomed(zoomEvent) {
  const { transform } = zoomEvent;
  group.attr('transform', transform);
}

svg.call(zoom);