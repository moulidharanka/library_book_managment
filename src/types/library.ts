/**
 * Core domain types for Smart Library Management System
 */

export interface Book {
  id: string; // e.g. "LIB1001"
  title: string;
  author: string;
  category: 'Computer Science' | 'Mathematics' | 'Literature' | 'Physics' | 'Philosophy' | 'Engineering' | 'Economics';
  year: number;
  isbn: string;
  copiesAvailable: number;
  totalCopies: number;
  description: string;
  shelfLocation: string;
  coverAccent: string; // Tailwind color class or hex for nice card aesthetics
}

export interface Member {
  id: string; // e.g. "MEM201"
  name: string;
  email: string;
  department: string;
  role: 'Student' | 'Faculty' | 'Researcher' | 'Librarian';
  phone: string;
  avatarColor: string;
  activeLoansCount: number;
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  requestedAt: string; // ISO string
  priority: number; // 1-indexed queue position
}

export interface ReturnedBookRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  returnedByMemberName: string;
  returnedAt: string;
  condition: 'Mint' | 'Good' | 'Fair';
}

export type DsaType = 'LinkedList' | 'HashTable' | 'Queue' | 'Stack' | 'BST' | 'Sorting' | 'Searching';

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: 'ISSUE' | 'RETURN' | 'RESERVE' | 'ADD_BOOK' | 'DELETE_BOOK' | 'UPDATE_BOOK' | 'FAST_SEARCH' | 'SORT' | 'AUTO_ISSUE';
  title: string;
  description: string;
  dsaUsed: string;
  complexity: string; // e.g., "O(1)", "O(log n)", "O(n)"
  badgeColor: string;
}

export interface SearchStepTrace {
  step: number;
  description: string;
  comparedKey?: string;
  matched: boolean;
  nodeId?: string;
}

export interface SearchBenchmarkResult {
  algorithm: 'Hash Table Lookup' | 'BST Search' | 'Linear Search';
  targetId: string;
  found: boolean;
  item: Book | null;
  comparisons: number;
  timeComplexity: string;
  spaceComplexity: string;
  steps: SearchStepTrace[];
  explanation: string;
}

export type SortField = 'title' | 'author' | 'year' | 'copiesAvailable';
export type SortOrder = 'asc' | 'desc';

export interface SortBenchmarkResult {
  algorithm: 'Merge Sort' | 'Bubble Sort';
  field: SortField;
  order: SortOrder;
  comparisons: number;
  swapsOrMerges: number;
  durationMs: number;
  timeComplexity: string;
  spaceComplexity: string;
  sortedCount: number;
}
