/**
 * LIFO Stack (Hand-crafted from scratch)
 *
 * Used in Smart Library Management System for recently returned books.
 * When a patron returns a book to the circulation desk, it is pushed onto the return stack.
 * The librarian inspects and shelves books from the top of the stack (Last In, First Out).
 *
 * Characteristics:
 * - Hand-rolled node-based stack with top pointer
 * - Operations:
 *   - Push (add to top): O(1)
 *   - Pop (remove from top): O(1)
 *   - Peek (view top): O(1)
 *   - isEmpty: O(1)
 *   - toArray: O(n)
 *   - getTopN: O(k)
 */

export class StackNode<T> {
  value: T;
  next: StackNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export class Stack<T> {
  private topNode: StackNode<T> | null = null;
  private _size: number = 0;

  get size(): number {
    return this._size;
  }

  /**
   * Returns true if stack is empty
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Pushes a new item onto the top of the stack.
   * Time Complexity: O(1)
   */
  push(value: T): void {
    const newNode = new StackNode<T>(value);
    newNode.next = this.topNode;
    this.topNode = newNode;
    this._size++;
  }

  /**
   * Removes and returns the item from the top of the stack.
   * Time Complexity: O(1)
   */
  pop(): T | null {
    if (this.isEmpty() || !this.topNode) {
      return null;
    }
    const poppedValue = this.topNode.value;
    this.topNode = this.topNode.next;
    this._size--;
    return poppedValue;
  }

  /**
   * Peeks at the item on top of the stack without removing it.
   * Time Complexity: O(1)
   */
  peek(): T | null {
    return this.topNode ? this.topNode.value : null;
  }

  /**
   * Returns array of items from top to bottom.
   * Time Complexity: O(n)
   */
  toArray(): T[] {
    const items: T[] = [];
    let current = this.topNode;
    while (current !== null) {
      items.push(current.value);
      current = current.next;
    }
    return items;
  }

  /**
   * Returns up to top N items from the stack.
   * Time Complexity: O(k) where k = min(n, size)
   */
  getTopN(n: number): T[] {
    const items: T[] = [];
    let current = this.topNode;
    let count = 0;
    while (current !== null && count < n) {
      items.push(current.value);
      current = current.next;
      count++;
    }
    return items;
  }

  /**
   * Clears stack
   */
  clear(): void {
    this.topNode = null;
    this._size = 0;
  }
}
