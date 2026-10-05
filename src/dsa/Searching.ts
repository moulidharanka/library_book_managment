/**
 * Hand-crafted Searching Algorithms & Benchmarking
 *
 * Implements:
 * 1. Linear Search (for Title, Author, Category, or ID across Linked List / array)
 * 2. Hash Table Lookup (direct key index calculation + collision chain traversal)
 * 3. Binary Search Tree (BST) Search (hierarchical key comparison)
 *
 * Provides side-by-side comparison metrics (comparisons count, time complexity, step trace).
 */

import { Book, SearchBenchmarkResult, SearchStepTrace } from '../types/library';
import { HashTable } from './HashTable';
import { BinarySearchTree } from './BST';
import { SinglyLinkedList } from './LinkedList';

/**
 * Linear Search through book list
 * Searches by Title, Author, Category, or ID.
 * Time Complexity: O(n)
 * Comparisons: Up to N
 */
export function manualLinearSearch(
  books: Book[],
  query: string,
  field: 'title' | 'author' | 'category' | 'id' = 'title'
): { results: Book[]; comparisons: number; steps: SearchStepTrace[] } {
  const normalizedQuery = query.trim().toLowerCase();
  const results: Book[] = [];
  const steps: SearchStepTrace[] = [];
  let comparisons = 0;

  for (let i = 0; i < books.length; i++) {
    comparisons++;
    const book = books[i];
    const targetValue = String(book[field]).toLowerCase();
    const isMatch = targetValue.includes(normalizedQuery);

    steps.push({
      step: i + 1,
      description: `Checked [${book.id}] "${book.title}" (${field}: "${book[field]}")`,
      comparedKey: book.id,
      matched: isMatch,
      nodeId: book.id,
    });

    if (isMatch) {
      results.push(book);
    }
  }

  return { results, comparisons, steps };
}

/**
 * Executes all 3 search algorithms on the same Book ID to provide
 * direct comparative benchmark data for education and visualization.
 */
export function benchmarkIdSearch(
  targetId: string,
  linkedList: SinglyLinkedList<Book>,
  hashTable: HashTable<Book>,
  bst: BinarySearchTree<Book>
): {
  hashResult: SearchBenchmarkResult;
  bstResult: SearchBenchmarkResult;
  linearResult: SearchBenchmarkResult;
} {
  const cleanId = targetId.trim().toUpperCase();

  // 1. Hash Table Lookup
  const hashLookup = hashTable.get(cleanId);
  const hashSteps: SearchStepTrace[] = [];
  hashSteps.push({
    step: 1,
    description: `Hash function computed: ${hashLookup.calculation.formula}`,
    matched: false,
  });
  hashSteps.push({
    step: 2,
    description: `Targeting bucket index #${hashLookup.bucketIndex}`,
    matched: false,
  });

  for (let i = 0; i < hashLookup.chainKeys.length; i++) {
    const key = hashLookup.chainKeys[i];
    const isTarget = key === cleanId;
    hashSteps.push({
      step: 3 + i,
      description: `Chain node #${i + 1} [${key}] ${isTarget ? '== TARGET MATCH' : '!= target'}`,
      comparedKey: key,
      matched: isTarget,
    });
  }

  const hashResult: SearchBenchmarkResult = {
    algorithm: 'Hash Table Lookup',
    targetId: cleanId,
    found: hashLookup.value !== null,
    item: hashLookup.value,
    comparisons: Math.max(hashLookup.comparisons, 1),
    timeComplexity: 'O(1) average',
    spaceComplexity: 'O(1) auxiliary',
    steps: hashSteps,
    explanation: hashLookup.value
      ? `Found via direct mathematical hashing to bucket #${hashLookup.bucketIndex} in ${hashLookup.comparisons} chain comparison(s).`
      : `Key hashed to bucket #${hashLookup.bucketIndex}, but was not found after inspecting the bucket chain.`,
  };

  // 2. BST Search
  const bstSearch = bst.search(cleanId);
  const bstSteps: SearchStepTrace[] = bstSearch.path.map((p, idx) => ({
    step: idx + 1,
    description: p.comparison,
    comparedKey: p.key,
    matched: p.direction === 'FOUND',
    nodeId: p.key,
  }));

  const bstResult: SearchBenchmarkResult = {
    algorithm: 'BST Search',
    targetId: cleanId,
    found: bstSearch.found,
    item: bstSearch.item,
    comparisons: bstSearch.comparisons,
    timeComplexity: 'O(log n) average',
    spaceComplexity: 'O(1) auxiliary',
    steps: bstSteps,
    explanation: bstSearch.found
      ? `Found by traversing the binary search tree hierarchy in ${bstSearch.comparisons} branch decision(s).`
      : `Traversed binary tree branches (${bstSearch.comparisons} comparisons), reached null leaf without match.`,
  };

  // 3. Linear Search through Singly Linked List
  const linearSteps: SearchStepTrace[] = [];
  let curr = linkedList.head;
  let linearComparisons = 0;
  let foundBook: Book | null = null;
  let nodeIdx = 0;

  while (curr !== null) {
    linearComparisons++;
    nodeIdx++;
    const isTarget = curr.value.id.toUpperCase() === cleanId;
    linearSteps.push({
      step: nodeIdx,
      description: `Linear probe node #${nodeIdx} [${curr.value.id}] "${curr.value.title}"`,
      comparedKey: curr.value.id,
      matched: isTarget,
      nodeId: curr.value.id,
    });

    if (isTarget) {
      foundBook = curr.value;
      break;
    }
    curr = curr.next;
  }

  const linearResult: SearchBenchmarkResult = {
    algorithm: 'Linear Search',
    targetId: cleanId,
    found: foundBook !== null,
    item: foundBook,
    comparisons: linearComparisons,
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    steps: linearSteps,
    explanation: foundBook
      ? `Found by sequential scanning from head of Linked List after checking ${linearComparisons} node(s).`
      : `Scanned all ${linearComparisons} nodes in the Linked List from head to tail without finding the target.`,
  };

  return { hashResult, bstResult, linearResult };
}
