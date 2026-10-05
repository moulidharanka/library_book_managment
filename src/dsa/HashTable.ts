/**
 * Hash Table with Separate Chaining (Hand-crafted from scratch)
 *
 * Used in Smart Library Management System for instant O(1) average lookup by Book ID / ISBN.
 *
 * Characteristics:
 * - Fixed bucket array size = 11 (as required)
 * - Custom polynomial rolling hash function
 * - Separate chaining collision resolution using custom linked chain nodes
 * - Transparent step-by-step logs of calculation for visualizer
 *
 * Complexity Analysis:
 * - Insert: Average O(1), Worst O(n) (when all keys collide into 1 bucket)
 * - Search: Average O(1), Worst O(n)
 * - Delete: Average O(1), Worst O(n)
 * - Space Complexity: O(m + n) where m = 11 buckets and n = number of books
 */

export class HashNode<K, V> {
  key: K;
  value: V;
  next: HashNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

export interface HashCalculationDetails {
  key: string;
  charCalculations: Array<{ char: string; charCode: number; weight: number; termValue: number }>;
  rawSum: number;
  bucketIndex: number;
  tableSize: number;
  formula: string;
}

export interface HashLookupResult<V> {
  value: V | null;
  bucketIndex: number;
  comparisons: number;
  chainLength: number;
  chainKeys: string[];
  steps: string[];
  calculation: HashCalculationDetails;
}

export class HashTable<V> {
  readonly capacity: number = 11; // Fixed-size bucket array of 11
  private buckets: Array<HashNode<string, V> | null>;
  private _size: number = 0;

  constructor(capacity: number = 11) {
    this.capacity = capacity;
    // Initialize bucket array with nulls
    this.buckets = new Array<HashNode<string, V> | null>(this.capacity);
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = null;
    }
  }

  get size(): number {
    return this._size;
  }

  get loadFactor(): number {
    return Number((this._size / this.capacity).toFixed(2));
  }

  /**
   * Custom Hash Function:
   * Uses weighted polynomial rolling hash:
   * sum = (sum + charCode * 31^i) % LargePrime
   * bucketIndex = sum % 11
   * Provides full calculation trace for education & visualization.
   */
  computeHash(key: string): HashCalculationDetails {
    let rawSum = 0;
    const charCalculations: HashCalculationDetails['charCalculations'] = [];
    const prime = 31;

    for (let i = 0; i < key.length; i++) {
      const char = key.charAt(i);
      const charCode = key.charCodeAt(i);
      // Small weighted factor to keep arithmetic clean and demonstrate polynomial hashing
      const weight = Math.pow(prime, i % 4); 
      const termValue = charCode * weight;
      rawSum += termValue;

      charCalculations.push({
        char,
        charCode,
        weight,
        termValue,
      });
    }

    const bucketIndex = Math.abs(rawSum) % this.capacity;
    const formula = `Hash("${key}") = (∑ charCode[i] × 31^(i mod 4)) % ${this.capacity} = ${rawSum} % ${this.capacity} = ${bucketIndex}`;

    return {
      key,
      charCalculations,
      rawSum,
      bucketIndex,
      tableSize: this.capacity,
      formula,
    };
  }

  /**
   * Inserts or updates a key-value pair.
   * If key already exists in bucket chain, updates its value.
   * Otherwise appends to the collision chain.
   */
  insert(key: string, value: V): { bucketIndex: number; collision: boolean; chainLength: number; log: string } {
    const calc = this.computeHash(key);
    const index = calc.bucketIndex;
    let head = this.buckets[index];

    // Case 1: Bucket is empty
    if (!head) {
      this.buckets[index] = new HashNode<string, V>(key, value);
      this._size++;
      return {
        bucketIndex: index,
        collision: false,
        chainLength: 1,
        log: `Inserted key "${key}" into empty bucket #${index}`,
      };
    }

    // Case 2: Bucket has existing chain (Collision or update)
    let current: HashNode<string, V> | null = head;
    let chainLength = 1;

    while (current !== null) {
      if (current.key === key) {
        current.value = value;
        return {
          bucketIndex: index,
          collision: true,
          chainLength,
          log: `Updated existing key "${key}" at bucket #${index}`,
        };
      }
      if (current.next === null) {
        break;
      }
      current = current.next;
      chainLength++;
    }

    // Append to end of chain
    current.next = new HashNode<string, V>(key, value);
    this._size++;
    chainLength++;

    return {
      bucketIndex: index,
      collision: true,
      chainLength,
      log: `Collision detected! Appended "${key}" to bucket #${index} chain (depth: ${chainLength})`,
    };
  }

  /**
   * Look up a key with full step-by-step trace for the visualizer.
   */
  get(key: string): HashLookupResult<V> {
    const calc = this.computeHash(key);
    const index = calc.bucketIndex;
    const steps: string[] = [];
    const chainKeys: string[] = [];

    steps.push(`1. Calculated Hash: ${calc.formula}`);
    steps.push(`2. Inspecting Bucket Index #${index}`);

    let current = this.buckets[index];
    let comparisons = 0;
    let chainLength = 0;

    if (!current) {
      steps.push(`3. Bucket #${index} is NULL (Key not found)`);
      return {
        value: null,
        bucketIndex: index,
        comparisons: 0,
        chainLength: 0,
        chainKeys: [],
        steps,
        calculation: calc,
      };
    }

    while (current !== null) {
      comparisons++;
      chainLength++;
      chainKeys.push(current.key);

      if (current.key === key) {
        steps.push(`3. Checked node ${chainLength} with key "${current.key}": MATCH!`);
        return {
          value: current.value,
          bucketIndex: index,
          comparisons,
          chainLength,
          chainKeys,
          steps,
          calculation: calc,
        };
      } else {
        steps.push(`3. Checked node ${chainLength} with key "${current.key}": No match, traversing chain pointer (next)...`);
      }
      current = current.next;
    }

    steps.push(`4. Reached end of bucket #${index} chain. Key "${key}" does not exist in table.`);
    return {
      value: null,
      bucketIndex: index,
      comparisons,
      chainLength,
      chainKeys,
      steps,
      calculation: calc,
    };
  }

  /**
   * Deletes a key from the Hash Table
   */
  delete(key: string): { removed: boolean; bucketIndex: number; comparisons: number } {
    const calc = this.computeHash(key);
    const index = calc.bucketIndex;
    let head = this.buckets[index];

    if (!head) {
      return { removed: false, bucketIndex: index, comparisons: 0 };
    }

    let comparisons = 1;

    // If head node of chain is the target
    if (head.key === key) {
      this.buckets[index] = head.next;
      this._size--;
      return { removed: true, bucketIndex: index, comparisons };
    }

    // Traverse chain
    let prev: HashNode<string, V> = head;
    let current: HashNode<string, V> | null = head.next;

    while (current !== null) {
      comparisons++;
      if (current.key === key) {
        prev.next = current.next;
        this._size--;
        return { removed: true, bucketIndex: index, comparisons };
      }
      prev = current;
      current = current.next;
    }

    return { removed: false, bucketIndex: index, comparisons };
  }

  /**
   * Returns snapshot of all 11 buckets and their chained nodes for visualizer.
   */
  getAllBuckets(): Array<{
    index: number;
    count: number;
    nodes: Array<{ key: string; value: V }>;
  }> {
    const result: Array<{
      index: number;
      count: number;
      nodes: Array<{ key: string; value: V }>;
    }> = [];

    for (let i = 0; i < this.capacity; i++) {
      const nodes: Array<{ key: string; value: V }> = [];
      let current = this.buckets[i];
      while (current !== null) {
        nodes.push({ key: current.key, value: current.value });
        current = current.next;
      }
      result.push({
        index: i,
        count: nodes.length,
        nodes,
      });
    }

    return result;
  }

  /**
   * Clears table
   */
  clear(): void {
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = null;
    }
    this._size = 0;
  }
}
