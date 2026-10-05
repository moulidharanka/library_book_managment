/**
 * Binary Search Tree (Hand-crafted from scratch)
 *
 * Used in Smart Library Management System for ordered storage by Book ID.
 * Supports efficient O(log n) average search, insert, delete, and sorted in-order traversal.
 *
 * Characteristics:
 * - Hand-rolled TreeNode with key, value, left, right references
 * - Strict BST invariant: left.key < node.key < right.key
 * - 3-case deletion (leaf node, 1 child, 2 children using in-order successor)
 * - Traversal algorithms (In-order, Pre-order, Post-order)
 * - Coordinate layout generator for visual SVG rendering
 * - Path tracking for visual search animation
 */

export class BSTNode<T> {
  key: string;
  value: T;
  left: BSTNode<T> | null = null;
  right: BSTNode<T> | null = null;

  constructor(key: string, value: T) {
    this.key = key;
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export interface BSTPathStep {
  key: string;
  direction: 'ROOT' | 'LEFT' | 'RIGHT' | 'FOUND' | 'NOT_FOUND';
  comparison: string;
}

export interface BSTSearchResult<T> {
  item: T | null;
  found: boolean;
  comparisons: number;
  path: BSTPathStep[];
}

export interface VisualBSTNode<T> {
  key: string;
  value: T;
  x: number; // Percentage or absolute px in SVG canvas
  y: number;
  level: number;
  leftKey?: string;
  rightKey?: string;
}

export interface VisualBSTEdge {
  fromKey: string;
  toKey: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  direction: 'left' | 'right';
}

export class BinarySearchTree<T> {
  root: BSTNode<T> | null = null;
  private _size: number = 0;

  get size(): number {
    return this._size;
  }

  /**
   * Helper to compare two Book IDs alphanumeric string wise
   */
  private compare(a: string, b: string): number {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  }

  /**
   * Inserts a key-value pair into the BST.
   * Time Complexity: Average O(log n), Worst O(n)
   */
  insert(key: string, value: T): { success: boolean; comparisons: number } {
    const newNode = new BSTNode<T>(key, value);
    if (!this.root) {
      this.root = newNode;
      this._size++;
      return { success: true, comparisons: 0 };
    }

    let current = this.root;
    let comparisons = 0;

    while (true) {
      comparisons++;
      const cmp = this.compare(key, current.key);

      if (cmp === 0) {
        // Key already exists, update value
        current.value = value;
        return { success: true, comparisons };
      } else if (cmp < 0) {
        if (current.left === null) {
          current.left = newNode;
          this._size++;
          return { success: true, comparisons };
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          this._size++;
          return { success: true, comparisons };
        }
        current = current.right;
      }
    }
  }

  /**
   * Searches for a key in the BST, recording each step of the path.
   * Time Complexity: Average O(log n), Worst O(n)
   */
  search(key: string): BSTSearchResult<T> {
    const path: BSTPathStep[] = [];
    if (!this.root) {
      return {
        item: null,
        found: false,
        comparisons: 0,
        path: [{ key: 'TREE_EMPTY', direction: 'NOT_FOUND', comparison: 'Tree is empty' }],
      };
    }

    let current: BSTNode<T> | null = this.root;
    let comparisons = 0;

    path.push({
      key: current.key,
      direction: 'ROOT',
      comparison: `Started at root node [${current.key}]`,
    });

    while (current !== null) {
      comparisons++;
      const cmp = this.compare(key, current.key);

      if (cmp === 0) {
        path.push({
          key: current.key,
          direction: 'FOUND',
          comparison: `Key [${key}] matches node [${current.key}]! Found book.`,
        });
        return { item: current.value, found: true, comparisons, path };
      } else if (cmp < 0) {
        path.push({
          key: current.key,
          direction: 'LEFT',
          comparison: `Target [${key}] < Node [${current.key}] → Moving LEFT to left child`,
        });
        current = current.left;
      } else {
        path.push({
          key: current.key,
          direction: 'RIGHT',
          comparison: `Target [${key}] > Node [${current.key}] → Moving RIGHT to right child`,
        });
        current = current.right;
      }
    }

    path.push({
      key: 'NULL',
      direction: 'NOT_FOUND',
      comparison: `Reached leaf/null pointer. Target [${key}] not present in BST.`,
    });

    return { item: null, found: false, comparisons, path };
  }

  /**
   * Deletes a key from the BST using standard 3-case deletion:
   * Case 1: Node has no children (leaf) -> set parent pointer to null
   * Case 2: Node has 1 child -> replace node with its child
   * Case 3: Node has 2 children -> replace with in-order successor (min node in right subtree)
   * Time Complexity: Average O(log n), Worst O(n)
   */
  delete(key: string): boolean {
    const initialSize = this._size;
    this.root = this.deleteNode(this.root, key);
    return this._size < initialSize;
  }

  private deleteNode(node: BSTNode<T> | null, key: string): BSTNode<T> | null {
    if (!node) return null;

    const cmp = this.compare(key, node.key);

    if (cmp < 0) {
      node.left = this.deleteNode(node.left, key);
      return node;
    } else if (cmp > 0) {
      node.right = this.deleteNode(node.right, key);
      return node;
    } else {
      // Node found to delete!
      this._size--;

      // Case 1 & 2: Leaf or single child
      if (!node.left) {
        return node.right;
      } else if (!node.right) {
        return node.left;
      }

      // Case 3: Two children
      // Find in-order successor (minimum in right subtree)
      let successor = node.right;
      while (successor.left !== null) {
        successor = successor.left;
      }

      // Copy successor key & value to current node
      node.key = successor.key;
      node.value = successor.value;

      // Note: we increase _size by 1 here because recursive delete will decrement it again
      this._size++;
      node.right = this.deleteNode(node.right, successor.key);

      return node;
    }
  }

  /**
   * In-Order Traversal (Left -> Root -> Right)
   * Guaranteed to yield all books in strictly sorted order by Key (Book ID).
   * Time Complexity: O(n)
   */
  inOrderTraversal(): T[] {
    const result: T[] = [];
    const traverse = (node: BSTNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  /**
   * Pre-Order Traversal (Root -> Left -> Right)
   * Time Complexity: O(n)
   */
  preOrderTraversal(): T[] {
    const result: T[] = [];
    const traverse = (node: BSTNode<T> | null) => {
      if (!node) return;
      result.push(node.value);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  /**
   * Post-Order Traversal (Left -> Right -> Root)
   * Time Complexity: O(n)
   */
  postOrderTraversal(): T[] {
    const result: T[] = [];
    const traverse = (node: BSTNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      result.push(node.value);
    };
    traverse(this.root);
    return result;
  }

  /**
   * Calculates maximum height of tree
   * Time Complexity: O(n)
   */
  getHeight(node: BSTNode<T> | null = this.root): number {
    if (!node) return 0;
    const leftHeight = this.getHeight(node.left);
    const rightHeight = this.getHeight(node.right);
    return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
  }

  /**
   * Computes clean 2D positions for SVG rendering of the tree.
   * Uses in-order traversal for X coordinates so tree never has crossing edges.
   */
  getVisualLayout(canvasWidth: number = 900, canvasHeight: number = 420): {
    nodes: VisualBSTNode<T>[];
    edges: VisualBSTEdge[];
  } {
    const nodes: VisualBSTNode<T>[] = [];
    if (!this.root) return { nodes: [], edges: [] };

    // Step 1: Assign X based on in-order index (0 to n-1)
    let inOrderCounter = 0;
    const xCoordMap: Record<string, number> = {};

    const assignX = (node: BSTNode<T> | null) => {
      if (!node) return;
      assignX(node.left);
      xCoordMap[node.key] = inOrderCounter++;
      assignX(node.right);
    };
    assignX(this.root);

    const totalNodes = inOrderCounter;
    const totalHeight = this.getHeight(this.root);
    const ySpacing = totalHeight > 1 ? (canvasHeight - 90) / Math.max(totalHeight - 1, 1) : 0;
    const xPadding = 45;
    const effectiveWidth = canvasWidth - xPadding * 2;

    const visualEdges: VisualBSTEdge[] = [];

    const buildLayout = (node: BSTNode<T> | null, depth: number) => {
      if (!node) return;

      const normX = totalNodes > 1 ? (xCoordMap[node.key] / (totalNodes - 1)) : 0.5;
      const x = xPadding + normX * effectiveWidth;
      const y = 45 + depth * ySpacing;

      nodes.push({
        key: node.key,
        value: node.value,
        x,
        y,
        level: depth,
        leftKey: node.left?.key,
        rightKey: node.right?.key,
      });

      if (node.left) {
        const leftNormX = (xCoordMap[node.left.key] / (totalNodes - 1));
        const leftX = xPadding + leftNormX * effectiveWidth;
        const leftY = 45 + (depth + 1) * ySpacing;
        visualEdges.push({
          fromKey: node.key,
          toKey: node.left.key,
          x1: x,
          y1: y,
          x2: leftX,
          y2: leftY,
          direction: 'left',
        });
        buildLayout(node.left, depth + 1);
      }

      if (node.right) {
        const rightNormX = (xCoordMap[node.right.key] / (totalNodes - 1));
        const rightX = xPadding + rightNormX * effectiveWidth;
        const rightY = 45 + (depth + 1) * ySpacing;
        visualEdges.push({
          fromKey: node.key,
          toKey: node.right.key,
          x1: x,
          y1: y,
          x2: rightX,
          y2: rightY,
          direction: 'right',
        });
        buildLayout(node.right, depth + 1);
      }
    };

    buildLayout(this.root, 0);

    return { nodes, edges: visualEdges };
  }

  /**
   * Clears the tree
   */
  clear(): void {
    this.root = null;
    this._size = 0;
  }
}
