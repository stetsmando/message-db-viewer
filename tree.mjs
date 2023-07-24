const treeMessageDisplay = document.getElementById('treeMessage');
const treeSvg = d3.select('#tree');

const treeSVGWidth = Number.parseInt(treeSvg.attr('width'));
const treeSVGHeight = Number.parseInt(treeSvg.attr('height'));

const treeData = {
  type: 'Process',
  fill: blue,
  children: [
    {
      type: 'Processing',
      fill: orange,
      children: [
        {
          type: 'Process',
          fill: blue,
          children: [
            {
              type: 'Processing',
              fill: orange,
            }
          ]
        },
        {
          type: 'Process',
          fill: blue,
          children: [
            {
              type: 'Processing',
              fill: orange,
            }
          ]
        },
        {
          type: 'Processed',
          fill: orange,
        },
      ]
    }
  ]
}

const root = d3.hierarchy(treeData);
const dx = 90;
const dy = treeSVGWidth / (root.height + 1);

// Create a layout
const tree = d3.tree().nodeSize([dx, dy]);

// Sorts alphabetically at each level
root.sort((a, b) => d3.ascending(a.data.type, b.data.type));
tree(root);

let x0 = Infinity;
let x1 = -x0;
root.each(node => {
  if (node.x > x1) x1 = node.x;
  if (node.x < x0) x0 = node.x;
});

// Compute the adjusted height of the tree
const treeHeight = x1 - x0 + dx * 2;

treeSvg
  .attr('viewBox', [-dy / 3, x0 - dx, treeSVGWidth, treeSVGHeight])
  .attr('style', 'font: 12px sans-serif;');

const treeLinks = treeSvg.append('g')
  .attr('fill', 'none')
  .attr('stroke', '#555')
  .attr('stroke-opacity', 0.4)
  .attr('stroke-width', 1.5)
  .selectAll()
    .data(root.links())
    .join('path')
      .attr('d', d3.linkHorizontal()
        .x(node => node.y)
        .y(node => node.x)
      );

const treeNode = treeSvg.append('g')
  .attr('stroke-linejoin', 'round')
  .attr('stroke-width', 3)
  .selectAll()
  .data(root.descendants())
  .join('g')
    .attr('transform', node => `translate(${node.y}, ${node.x})`);

const treeCircles = treeNode.append('circle')
  .attr('fill', node => node.data.fill)
  .attr('r', 10);

treeNode.append('text')
  .attr('dy', '0.31em')
  .attr('x', -10)
  .attr('text-anchor', 'end')
  .attr('text-baseline', 'middle')
  .text(node => node.data.type)
  .clone(true).lower()
  .attr('stroke', 'white');
