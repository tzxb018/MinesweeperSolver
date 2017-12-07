const Node = (data, parent = null) => {
  this.hasMine = data;
  this.parent = parent;
  this.children = [];
};

export default class Tree {
  constructor(numberOfLevels) {
    const node = new Node(true);
    this.root = node;
    this.buildTree(this.root, 1, numberOfLevels);
  }

  buildTree(currentNode, currentLevel, numberOfLevels) {
    if (currentLevel <= numberOfLevels) {
      currentNode.children.push(new Node(true, currentNode));
      this.buildTree(currentNode.children[0], currentLevel + 1, numberOfLevels);
      currentNode.children.push(new Node(false, currentNode));
      this.buildTree(currentNode.children[1], currentLevel + 1, numberOfLevels);
    }
  }

  // traverses the tree by breadth, invoking callback on each node
  traverseBF(callback) {
    const queue = [];
    queue.push(this.root);
    let currentTree = queue.shift();

    while (currentTree) {
      for (let i = 0; i < currentTree.children.length; i++) {
        queue.push(currentTree.children[i]);
      }
      callback(currentTree);
      currentTree = queue.shift();
    }
  }

  // traverses the tree by depth, invoking callback on each node
  traverseDF(callback) {
    const recurse = currentNode => {
      for (let i = 0; i < currentNode.children.length; i++) {
        recurse(currentNode.children[i]);
      }
      callback(currentNode);
    };

    recurse(this.root);
  }
}
