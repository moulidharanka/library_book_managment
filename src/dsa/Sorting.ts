/**
 * Hand-crafted Sorting Algorithms (Merge Sort & Bubble Sort)
 *
 * Implemented from scratch without using Array.prototype.sort or any external library.
 * Tracks comparison counts, swaps/merges, and runtime metrics for educational analysis.
 */

import { Book, SortField, SortOrder, SortBenchmarkResult } from '../types/library';

/**
 * Helper to compare two values based on field and direction
 */
function compareBooks(a: Book, b: Book, field: SortField, order: SortOrder): number {
  let valA: string | number = a[field];
  let valB: string | number = b[field];

  if (typeof valA === 'string' && typeof valB === 'string') {
    valA = valA.toLowerCase();
    valB = valB.toLowerCase();
    if (valA === valB) return 0;
    const cmp = valA < valB ? -1 : 1;
    return order === 'asc' ? cmp : -cmp;
  }

  // Numerical comparison (year, copiesAvailable)
  const numA = Number(valA);
  const numB = Number(valB);
  if (numA === numB) return 0;
  const cmp = numA < numB ? -1 : 1;
  return order === 'asc' ? cmp : -cmp;
}

/**
 * Bubble Sort Implementation (Hand-crafted from scratch)
 *
 * Mechanism: Repeatedly steps through the list, compares adjacent elements,
 * and swaps them if they are in the wrong order. Passes through until sorted.
 *
 * Time Complexity:
 * - Best Case: O(n) (already sorted, with swapped flag optimization)
 * - Average Case: O(n²)
 * - Worst Case: O(n²) (reverse sorted)
 * Space Complexity: O(1) auxiliary (in-place)
 */
export function manualBubbleSort(
  books: Book[],
  field: SortField,
  order: SortOrder = 'asc'
): { sorted: Book[]; metrics: SortBenchmarkResult } {
  const startTime = performance.now();
  // Create shallow clone of items to avoid mutating input array directly
  const arr: Book[] = [];
  for (let i = 0; i < books.length; i++) {
    arr.push(books[i]);
  }

  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      if (compareBooks(arr[j], arr[j + 1], field, order) > 0) {
        // Swap adjacent elements manually
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        swapped = true;
      }
    }
    // If no two elements were swapped by inner loop, array is sorted
    if (!swapped) break;
  }

  const durationMs = Number((performance.now() - startTime).toFixed(3));

  return {
    sorted: arr,
    metrics: {
      algorithm: 'Bubble Sort',
      field,
      order,
      comparisons,
      swapsOrMerges: swaps,
      durationMs: Math.max(durationMs, 0.01),
      timeComplexity: 'O(n²)',
      spaceComplexity: 'O(1)',
      sortedCount: arr.length,
    },
  };
}

/**
 * Merge Sort Implementation (Hand-crafted from scratch)
 *
 * Mechanism: Divide-and-conquer algorithm. Recursively divides the array
 * into two halves until length <= 1, then merges the sorted halves.
 *
 * Time Complexity:
 * - Best Case: O(n log n)
 * - Average Case: O(n log n)
 * - Worst Case: O(n log n)
 * Space Complexity: O(n) auxiliary space for merge buffers
 */
export function manualMergeSort(
  books: Book[],
  field: SortField,
  order: SortOrder = 'asc'
): { sorted: Book[]; metrics: SortBenchmarkResult } {
  const startTime = performance.now();

  let comparisons = 0;
  let merges = 0;

  // Recursive merge sort function
  function mergeSortRec(input: Book[]): Book[] {
    if (input.length <= 1) {
      return input;
    }

    const mid = Math.floor(input.length / 2);
    const left: Book[] = [];
    const right: Book[] = [];

    for (let i = 0; i < mid; i++) {
      left.push(input[i]);
    }
    for (let i = mid; i < input.length; i++) {
      right.push(input[i]);
    }

    const sortedLeft = mergeSortRec(left);
    const sortedRight = mergeSortRec(right);

    return merge(sortedLeft, sortedRight);
  }

  // Hand-crafted merge function
  function merge(left: Book[], right: Book[]): Book[] {
    const merged: Book[] = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
      comparisons++;
      if (compareBooks(left[i], right[j], field, order) <= 0) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        j++;
      }
      merges++;
    }

    // Append remaining elements from left half
    while (i < left.length) {
      merged.push(left[i]);
      i++;
      merges++;
    }

    // Append remaining elements from right half
    while (j < right.length) {
      merged.push(right[j]);
      j++;
      merges++;
    }

    return merged;
  }

  const initialCopy: Book[] = [];
  for (let i = 0; i < books.length; i++) {
    initialCopy.push(books[i]);
  }

  const sorted = mergeSortRec(initialCopy);
  const durationMs = Number((performance.now() - startTime).toFixed(3));

  return {
    sorted,
    metrics: {
      algorithm: 'Merge Sort',
      field,
      order,
      comparisons,
      swapsOrMerges: merges,
      durationMs: Math.max(durationMs, 0.01),
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      sortedCount: sorted.length,
    },
  };
}
