/**
 * FIFO Queue (Hand-crafted from scratch)
 *
 * Used in Smart Library Management System for book reservations.
 * When all copies of a book are borrowed, students join the book's reservation queue.
 * First in line is the first to receive the book upon return.
 *
 * Characteristics:
 * - Hand-rolled node-based implementation with front (head) and rear (tail) pointers
 * - Operations:
 *   - Enqueue (insert at rear): O(1)
 *   - Dequeue (remove from front): O(1)
 *   - Peek (inspect front): O(1)
 *   - isEmpty: O(1)
 *   - toArray: O(n)
 */

export class QueueNode<T> {
  value: T;
  next: QueueNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export class Queue<T> {
  private frontNode: QueueNode<T> | null = null;
  private rearNode: QueueNode<T> | null = null;
  private _size: number = 0;

  get size(): number {
    return this._size;
  }

  /**
   * Returns true if queue has 0 elements
   */
  isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Adds an element to the rear of the queue.
   * Time Complexity: O(1)
   */
  enqueue(value: T): void {
    const newNode = new QueueNode<T>(value);
    if (this.isEmpty()) {
      this.frontNode = newNode;
      this.rearNode = newNode;
    } else if (this.rearNode) {
      this.rearNode.next = newNode;
      this.rearNode = newNode;
    }
    this._size++;
  }

  /**
   * Removes and returns the element at the front of the queue.
   * Time Complexity: O(1)
   */
  dequeue(): T | null {
    if (this.isEmpty() || !this.frontNode) {
      return null;
    }
    const removedValue = this.frontNode.value;
    this.frontNode = this.frontNode.next;
    this._size--;

    if (this._size === 0) {
      this.rearNode = null;
    }

    return removedValue;
  }

  /**
   * Returns the element at the front of the queue without removing it.
   * Time Complexity: O(1)
   */
  peek(): T | null {
    return this.frontNode ? this.frontNode.value : null;
  }

  /**
   * Returns the element at the rear of the queue without removing it.
   * Time Complexity: O(1)
   */
  peekRear(): T | null {
    return this.rearNode ? this.rearNode.value : null;
  }

  /**
   * Traverses from front to rear and returns an array representation.
   * Time Complexity: O(n)
   */
  toArray(): T[] {
    const elements: T[] = [];
    let current = this.frontNode;
    while (current !== null) {
      elements.push(current.value);
      current = current.next;
    }
    return elements;
  }

  /**
   * Removes a specific item matching a predicate (e.g., student cancels reservation).
   * Time Complexity: O(n)
   */
  removeWhere(predicate: (item: T) => boolean): boolean {
    if (this.isEmpty() || !this.frontNode) return false;

    // Head match
    if (predicate(this.frontNode.value)) {
      this.dequeue();
      return true;
    }

    let prev = this.frontNode;
    let curr = this.frontNode.next;

    while (curr !== null) {
      if (predicate(curr.value)) {
        prev.next = curr.next;
        if (curr === this.rearNode) {
          this.rearNode = prev;
        }
        this._size--;
        return true;
      }
      prev = curr;
      curr = curr.next;
    }

    return false;
  }

  /**
   * Clears queue
   */
  clear(): void {
    this.frontNode = null;
    this.rearNode = null;
    this._size = 0;
  }
}
