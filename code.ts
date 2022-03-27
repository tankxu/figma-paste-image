function main() {
  const firstSelection = figma.currentPage.selection[0]

  figma.showUI(__html__, {
    width: 10000,
    height: 10000,
  });

  figma.ui.onmessage = (msg) => {
    switch (msg.type) {
      case "paste":
        figma.ui.close();
        const newNode = figma.createRectangle();
        let { image, width, height } = msg.imageObject;

        // console.log(image);

        newNode.fills = [
          {
            imageHash: figma.createImage(image).hash,
            type: "IMAGE",
            scaleMode: "FILL",
          },
        ];

        let nodeParent, nodeIndex, nodeX, nodeY
        if (figma.currentPage.selection.length === 0) {
          nodeParent = figma.currentPage;
        } else {
          nodeParent = firstSelection.parent;
          nodeIndex = nodeParent.children.indexOf(firstSelection) + 1
        }

        nodeX = figma.viewport.center.x - width / 2
        nodeY = figma.viewport.center.y - height / 2

        if (nodeParent.absoluteTransform) {
          nodeX -= nodeParent.absoluteTransform[0][2]
          nodeY -= nodeParent.absoluteTransform[1][2]
        }

        newNode.x = nodeX;
        newNode.y = nodeY;
        newNode.resize(width, height);

        if (nodeIndex) {
          nodeParent.insertChild(nodeIndex, newNode);
        } else {
          nodeParent.appendChild(newNode);
        }
        figma.currentPage.selection = [newNode];
        figma.closePlugin();
        break;
    }
  };
}

main();
