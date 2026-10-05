/**
 * Singly Linked List Data Structure (Hand-crafted from scratch)
 *
 * Used in Smart Library Management System to store the master book collection.
 * Maintains chronological or linked chain of library books.
 *
 * Complexity Analysis:
 * - Append (Insert at Tail): O(1) with tail pointer (or O(n) without)
 * - Prepend (Insert at Head): O(1)
 * - Traversal (Display All): O(n)
 * - Search by Predicate: O(n)
 * - Delete by Predicate: O(n)
 * - Update by Predicate: O(n)
 */

export class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export class SinglyLinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;
  private _length: number = 0;

  get length(): number {
    return this._length;
  }

  /**
   * Appends a new node to the end of the linked list.
   * Time Complexity: O(1) using maintained tail pointer.
   * Space Complexity: O(1)
   */
  append(value: T): ListNode<T> {
    const newNode = new ListNode<T>(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this._length++;
    return newNode;
  }

  /**
   * Prepends a new node to the beginning of the linked list.
   * Time Complexity: O(1)
   * Space Complexity: O(1)
   */
  prepend(value: T): ListNode<T> {
    const newNode = new ListNode<T>(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this._length++;
    return newNode;
  }

  /**
   * Traverses all nodes and collects their values into a standard array
   * without using native array iteration shortcuts.
   * Time Complexity: O(n)
   */
  toArray(): T[] {
    const result: T[] = [];
    let current: ListNode<T> | null = this.head;
    while (current !== null) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  /**
   * Finds a node using a predicate function, tracking step count.
   * Time Complexity: O(n)
   */
  find(predicate: (item: T) => boolean): { item: T | null; comparisons: number; index: number } {
    let current = this.head;
    let comparisons = 0;
    let index = 0;

    while (current !== null) {
      comparisons++;
      if (predicate(current.value)) {
        return { item: current.value, comparisons, index };
      }
      current = current.next;
      index++;
    }

    return { item: null, comparisons, index: -1 };
  }

  /**
   * Updates an item in place when matched by predicate.
   * Time Complexity: O(n)
   */
  update(predicate: (item: T) => boolean, updater: (prev: T) => T): { updated: boolean; comparisons: number } {
    let current = this.head;
    let comparisons = 0;

    while (current !== null) {
      comparisons++;
      if (predicate(current.value)) {
        current.value = updater(current.value);
        return { updated: true, comparisons };
      }
      current = current.next;
    }

    return { updated: false, comparisons };
  }

  /**
   * Deletes the first node that matches the predicate.
   * Handles head deletion, middle deletion, and tail deletion.
   * Time Complexity: O(n)
   */
  delete(predicate: (item: T) => boolean): { removed: T | null; comparisons: number } {
    if (!this.head) {
      return { removed: null, comparisons: 0 };
    }

    let comparisons = 1;

    // Case 1: Head node matches
    if (predicate(this.head.value)) {
      const removedVal = this.head.value;
      this.head = this.head.next;
      if (!this.head) {
        this.tail = null; // List is now empty
      }
      this._length--;
      return { removed: removedVal, comparisons };
    }

    // Case 2: Middle or tail node matches
    let prev: ListNode<T> = this.head;
    let current: ListNode<T> | null = this.head.next;

    while (current !== null) {
      comparisons++;
      if (predicate(current.value)) {
        const removedVal = current.value;
        prev.next = current.next;
        if (current === this.tail) {
          this.tail = prev;
        }
        this._length--;
        return { removed: removedVal, comparisons };
      }
      prev = current;
      current = current.next;
    }

    return { removed: null, comparisons };
  }

  /**
   * Clears the entire linked list
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this._length = 0;
  }
}
