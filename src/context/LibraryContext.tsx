/**
 * Master Library State Context
 * Synchronizes all hand-crafted DSAs:
 * - SinglyLinkedList (Master books list)
 * - HashTable (O(1) lookup by Book ID, fixed size 11, chaining)
 * - BinarySearchTree (Sorted storage by Book ID, O(log n))
 * - Queue (FIFO reservation waitlist per book)
 * - Stack (LIFO recently returned books with TOP pointer)
 * - Custom Sorting (Merge Sort, Bubble Sort)
 * - Custom Searching (Linear, Hash, BST)
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Book,
  Member,
  Reservation,
  ReturnedBookRecord,
  ActivityLog,
  SortField,
  SortOrder,
  SortBenchmarkResult,
  SearchBenchmarkResult,
} from '../types/library';
import { SinglyLinkedList } from '../dsa/LinkedList';
import { HashTable } from '../dsa/HashTable';
import { BinarySearchTree } from '../dsa/BST';
import { Queue } from '../dsa/Queue';
import { Stack } from '../dsa/Stack';
import { manualBubbleSort, manualMergeSort } from '../dsa/Sorting';
import { benchmarkIdSearch } from '../dsa/Searching';
import {
  INITIAL_BOOKS,
  INITIAL_MEMBERS,
  INITIAL_RESERVATIONS,
  INITIAL_RETURN_STACK,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

interface LibraryContextType {
  // Master Books (extracted from SinglyLinkedList)
  books: Book[];
  members: Member[];
  activityLogs: ActivityLog[];
  toasts: ToastMessage[];
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  toggleDarkMode: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Hand-crafted Data Structure Instances
  linkedList: SinglyLinkedList<Book>;
  hashTable: HashTable<Book>;
  bst: BinarySearchTree<Book>;
  returnStack: Stack<ReturnedBookRecord>;
  getReservationQueue: (bookId: string) => Queue<Reservation>;
  getAllQueuesList: () => Array<{ bookId: string; bookTitle: string; queue: Reservation[] }>;

  // Synchronized Operations
  addBook: (book: Book) => void;
  updateBook: (book: Book) => void;
  deleteBook: (bookId: string) => void;
  issueBook: (bookId: string, memberId: string) => { status: 'issued' | 'reserved'; message: string };
  returnBook: (bookId: string, memberName: string, condition?: 'Mint' | 'Good' | 'Fair') => void;
  popRecentlyReturned: () => ReturnedBookRecord | null;
  enqueueReservation: (bookId: string, memberId: string) => boolean;
  dequeueReservation: (bookId: string) => Reservation | null;

  // Algorithms Runner
  runSort: (field: SortField, algorithm: 'Merge Sort' | 'Bubble Sort', order: SortOrder) => { sorted: Book[]; metrics: SortBenchmarkResult };
  runSearchBenchmark: (bookId: string) => { hashResult: SearchBenchmarkResult; bstResult: SearchBenchmarkResult; linearResult: SearchBenchmarkResult };

  // Counter state to trigger reactive re-renders when DSAs mutate
  mutationVersion: number;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme (clean professional white and blue dashboard)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return false; // Professional white and blue library dashboard
  });

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('library_theme', 'light');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Core Members List
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [mutationVersion, setMutationVersion] = useState<number>(0);

  // References to keep persistent single instances of hand-crafted DSAs
  const linkedListRef = useRef<SinglyLinkedList<Book>>(new SinglyLinkedList<Book>());
  const hashTableRef = useRef<HashTable<Book>>(new HashTable<Book>(11));
  const bstRef = useRef<BinarySearchTree<Book>>(new BinarySearchTree<Book>());
  const returnStackRef = useRef<Stack<ReturnedBookRecord>>(new Stack<ReturnedBookRecord>());
  const reservationQueuesRef = useRef<Record<string, Queue<Reservation>>>({});

  const notifyMutation = useCallback(() => {
    setMutationVersion(v => v + 1);
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addActivityLog = useCallback(
    (action: ActivityLog['action'], title: string, description: string, dsaUsed: string, complexity: string, badgeColor: string) => {
      const newLog: ActivityLog = {
        id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        action,
        title,
        description,
        dsaUsed,
        complexity,
        badgeColor,
      };
      setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]); // keep recent 50
    },
    []
  );

  // Helper to ensure a Queue exists for a given Book ID
  const getReservationQueue = useCallback((bookId: string): Queue<Reservation> => {
    if (!reservationQueuesRef.current[bookId]) {
      reservationQueuesRef.current[bookId] = new Queue<Reservation>();
    }
    return reservationQueuesRef.current[bookId];
  }, []);

  // Initialize data structures on first mount
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // 1. Populate Singly Linked List, Hash Table, and BST with INITIAL_BOOKS
    for (let i = 0; i < INITIAL_BOOKS.length; i++) {
      const book = INITIAL_BOOKS[i];
      linkedListRef.current.append(book);
      hashTableRef.current.insert(book.id, book);
      bstRef.current.insert(book.id, book);
      // Initialize an empty queue for each book
      reservationQueuesRef.current[book.id] = new Queue<Reservation>();
    }

    // 2. Preload Initial Reservations into respective Queues
    for (let i = 0; i < INITIAL_RESERVATIONS.length; i++) {
      const res = INITIAL_RESERVATIONS[i];
      const q = getReservationQueue(res.bookId);
      q.enqueue(res);
    }

    // 3. Preload Initial Return Stack
    for (let i = 0; i < INITIAL_RETURN_STACK.length; i++) {
      returnStackRef.current.push(INITIAL_RETURN_STACK[i]);
    }

    addActivityLog(
      'ADD_BOOK',
      'Library Initialized with 20 Books',
      'Synchronized Singly Linked List, Hash Table (size 11), and Binary Search Tree.',
      'Linked List + Hash Table + BST',
      'O(n)',
      'bg-blue-500/10 text-blue-500 border-blue-500/20'
    );

    notifyMutation();
  }, [addActivityLog, getReservationQueue, notifyMutation]);

  // Books array representation derived purely from SinglyLinkedList traversal!
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const books = useMemo(() => {
    return linkedListRef.current.toArray();
  }, [mutationVersion]);

  // Synchronized: ADD BOOK
  const addBook = useCallback(
    (book: Book) => {
      // 1. Singly Linked List Append: O(1)
      linkedListRef.current.append(book);

      // 2. Hash Table Insert: O(1)
      const hashResult = hashTableRef.current.insert(book.id, book);

      // 3. BST Insert: O(log n)
      const bstResult = bstRef.current.insert(book.id, book);

      // 4. Initialize Reservation Queue
      if (!reservationQueuesRef.current[book.id]) {
        reservationQueuesRef.current[book.id] = new Queue<Reservation>();
      }

      addActivityLog(
        'ADD_BOOK',
        `Book Added: [${book.id}] ${book.title}`,
        `Inserted into Singly Linked List (O(1)), Hash Table bucket #${hashResult.bucketIndex} (O(1)), and BST (O(log n), ${bstResult.comparisons} comparisons).`,
        'Linked List + Hash Table + BST',
        'O(log n)',
        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      );

      addToast({
        type: 'success',
        title: 'Book Cataloged',
        message: `[${book.id}] "${book.title}" synchronized across Linked List, Hash Table, and BST!`,
      });

      notifyMutation();
    },
    [addActivityLog, addToast, notifyMutation]
  );

  // Synchronized: UPDATE BOOK
  const updateBook = useCallback(
    (book: Book) => {
      // 1. Linked list update
      linkedListRef.current.update(b => b.id === book.id, () => book);

      // 2. Hash table update
      hashTableRef.current.insert(book.id, book);

      // 3. BST update
      bstRef.current.insert(book.id, book);

      addActivityLog(
        'UPDATE_BOOK',
        `Updated [${book.id}] "${book.title}"`,
        `Updated in-place in Singly Linked List, Hash Table, and BST.`,
        'All 3 Structures Synced',
        'O(n)',
        'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
      );

      addToast({
        type: 'info',
        title: 'Book Updated',
        message: `Details updated across all data structures.`,
      });

      notifyMutation();
    },
    [addActivityLog, addToast, notifyMutation]
  );

  // Synchronized: DELETE BOOK
  const deleteBook = useCallback(
    (bookId: string) => {
      // 1. Remove from Linked List: O(n)
      const listDel = linkedListRef.current.delete(b => b.id === bookId);

      // 2. Remove from Hash Table: O(1)
      const hashDel = hashTableRef.current.delete(bookId);

      // 3. Remove from BST: O(log n)
      const bstDel = bstRef.current.delete(bookId);

      // 4. Remove reservation queue
      delete reservationQueuesRef.current[bookId];

      const bookTitle = listDel.removed ? listDel.removed.title : bookId;

      addActivityLog(
        'DELETE_BOOK',
        `Book Deleted: [${bookId}]`,
        `Removed from Singly Linked List (${listDel.comparisons} comparisons), Hash Table bucket #${hashDel.bucketIndex}, and BST (3-case node deletion: ${bstDel}).`,
        'Linked List + Hash Table + BST',
        'O(n)',
        'bg-rose-500/10 text-rose-500 border-rose-500/20'
      );

      addToast({
        type: 'warning',
        title: 'Book Deleted',
        message: `Removed [${bookId}] "${bookTitle}" from all data structures.`,
      });

      notifyMutation();
    },
    [addActivityLog, addToast, notifyMutation]
  );

  // Core Logic: ISSUE BOOK
  const issueBook = useCallback(
    (bookId: string, memberId: string): { status: 'issued' | 'reserved'; message: string } => {
      const lookup = hashTableRef.current.get(bookId);
      const book = lookup.value;
      const member = members.find(m => m.id === memberId);

      if (!book) {
        addToast({
          type: 'error',
          title: 'Not Found',
          message: `Book [${bookId}] was not found in the Hash Table.`,
        });
        return { status: 'issued', message: 'Book not found' };
      }

      const memberName = member ? member.name : memberId;

      // Condition 1: Book has available copies
      if (book.copiesAvailable > 0) {
        const updatedBook: Book = {
          ...book,
          copiesAvailable: book.copiesAvailable - 1,
        };

        // Keep all structures in sync
        linkedListRef.current.update(b => b.id === bookId, () => updatedBook);
        hashTableRef.current.insert(bookId, updatedBook);
        bstRef.current.insert(bookId, updatedBook);

        // Update member's loan count
        setMembers(prev =>
          prev.map(m => (m.id === memberId ? { ...m, activeLoansCount: m.activeLoansCount + 1 } : m))
        );

        addActivityLog(
          'ISSUE',
          `Issued Book [${bookId}] to ${memberName}`,
          `Copies remaining: ${updatedBook.copiesAvailable}/${updatedBook.totalCopies}. Handled via Hash Table instant lookup O(1).`,
          'Hash Table + Linked List + BST',
          'O(1)',
          'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
        );

        addToast({
          type: 'success',
          title: 'Book Issued Successfully',
          message: `[${bookId}] "${book.title}" checked out to ${memberName}.`,
        });

        notifyMutation();
        return { status: 'issued', message: `Book issued to ${memberName}` };
      }

      // Condition 2: 0 copies available -> Enqueue into FIFO Reservation Queue!
      const q = getReservationQueue(bookId);
      const newReservation: Reservation = {
        id: 'RES-' + Date.now().toString().slice(-4),
        bookId,
        bookTitle: book.title,
        memberId,
        memberName,
        memberEmail: member?.email || `${memberId.toLowerCase()}@university.edu`,
        requestedAt: new Date().toISOString(),
        priority: q.size + 1,
      };

      q.enqueue(newReservation);

      addActivityLog(
        'RESERVE',
        `Zero Copies Available! Enqueued Reservation for ${memberName}`,
        `Book [${bookId}] has 0 copies. ${memberName} joined FIFO Reservation Queue at position #${newReservation.priority} (Queue.enqueue O(1)).`,
        'Queue (FIFO)',
        'O(1)',
        'bg-amber-500/10 text-amber-500 border-amber-500/20'
      );

      addToast({
        type: 'warning',
        title: 'Book Unavailable - Waitlisted',
        message: `All copies are loaned out. ${memberName} was placed in the FIFO reservation queue (Position #${newReservation.priority}).`,
      });

      notifyMutation();
      return {
        status: 'reserved',
        message: `Book is currently checked out. ${memberName} enqueued at position #${newReservation.priority}.`,
      };
    },
    [addActivityLog, addToast, getReservationQueue, members, notifyMutation]
  );

  // Core Logic: RETURN BOOK
  const returnBook = useCallback(
    (bookId: string, memberName: string, condition: 'Mint' | 'Good' | 'Fair' = 'Good') => {
      const lookup = hashTableRef.current.get(bookId);
      const book = lookup.value;

      if (!book) {
        addToast({
          type: 'error',
          title: 'Error Returning Book',
          message: `Book [${bookId}] does not exist in library records.`,
        });
        return;
      }

      // 1. Push onto Return Stack (LIFO)
      const returnRecord: ReturnedBookRecord = {
        id: 'RET-' + Date.now().toString().slice(-4),
        bookId,
        bookTitle: book.title,
        returnedByMemberName: memberName,
        returnedAt: 'Just now',
        condition,
      };
      returnStackRef.current.push(returnRecord);

      // 2. Check Book's FIFO Reservation Queue
      const queue = getReservationQueue(bookId);

      if (!queue.isEmpty()) {
        // Someone is waiting! Dequeue the first student and auto-issue!
        const nextPatron = queue.dequeue();

        if (nextPatron) {
          addActivityLog(
            'AUTO_ISSUE',
            `Auto-Issued to Reservation Queue: ${nextPatron.memberName}`,
            `Book [${bookId}] was returned by ${memberName} and instantly reassigned to ${nextPatron.memberName} (FIFO Queue.dequeue O(1)). Stack.push O(1) logged.`,
            'Stack (LIFO) + Queue (FIFO)',
            'O(1)',
            'bg-purple-500/10 text-purple-500 border-purple-500/20'
          );

          addToast({
            type: 'info',
            title: 'Auto-Issued from Queue!',
            message: `"${book.title}" was automatically issued to ${nextPatron.memberName} (first in line)!`,
            duration: 6000,
          });

          notifyMutation();
          return;
        }
      }

      // If no one is waiting, increment available copies
      const newCopies = Math.min(book.copiesAvailable + 1, book.totalCopies);
      const updatedBook: Book = {
        ...book,
        copiesAvailable: newCopies,
      };

      linkedListRef.current.update(b => b.id === bookId, () => updatedBook);
      hashTableRef.current.insert(bookId, updatedBook);
      bstRef.current.insert(bookId, updatedBook);

      addActivityLog(
        'RETURN',
        `Returned Book: [${bookId}] ${book.title}`,
        `Pushed onto Return Stack (TOP, O(1)). Copies available increased to ${newCopies}/${book.totalCopies}.`,
        'Stack (LIFO) + BST + Hash Table',
        'O(1)',
        'bg-blue-500/10 text-blue-500 border-blue-500/20'
      );

      addToast({
        type: 'success',
        title: 'Book Returned & Pushed to Stack',
        message: `[${bookId}] added to the Recently Returned Stack. ${newCopies} copies now available.`,
      });

      notifyMutation();
    },
    [addActivityLog, addToast, getReservationQueue, notifyMutation]
  );

  // Pop from Return Stack (Shelved back to stacks)
  const popRecentlyReturned = useCallback((): ReturnedBookRecord | null => {
    const popped = returnStackRef.current.pop();
    if (popped) {
      addActivityLog(
        'RETURN',
        `Shelved from Return Stack: [${popped.bookId}]`,
        `Popped from Top of Return Stack (Stack.pop O(1)). Book has been inspected and returned to shelf.`,
        'Stack (LIFO)',
        'O(1)',
        'bg-slate-500/10 text-slate-500 border-slate-500/20'
      );

      addToast({
        type: 'info',
        title: 'Book Shelved',
        message: `Popped [${popped.bookId}] from Top of Return Stack. Shelved to collection.`,
      });

      notifyMutation();
    }
    return popped;
  }, [addActivityLog, addToast, notifyMutation]);

  // Reservation Queue Operations
  const enqueueReservation = useCallback(
    (bookId: string, memberId: string): boolean => {
      const bookLookup = hashTableRef.current.get(bookId);
      const member = members.find(m => m.id === memberId);
      if (!bookLookup.value || !member) return false;

      const q = getReservationQueue(bookId);
      const res: Reservation = {
        id: 'RES-' + Date.now().toString().slice(-4),
        bookId,
        bookTitle: bookLookup.value.title,
        memberId,
        memberName: member.name,
        memberEmail: member.email,
        requestedAt: new Date().toISOString(),
        priority: q.size + 1,
      };

      q.enqueue(res);

      addActivityLog(
        'RESERVE',
        `Manually Enqueued: ${member.name} for [${bookId}]`,
        `Joined Rear of Queue for "${bookLookup.value.title}" (Queue.enqueue O(1)). Current queue size: ${q.size}.`,
        'Queue (FIFO)',
        'O(1)',
        'bg-amber-500/10 text-amber-500 border-amber-500/20'
      );

      addToast({
        type: 'success',
        title: 'Reservation Enqueued',
        message: `${member.name} joined queue for "${bookLookup.value.title}" at position #${res.priority}.`,
      });

      notifyMutation();
      return true;
    },
    [addActivityLog, addToast, getReservationQueue, members, notifyMutation]
  );

  const dequeueReservation = useCallback(
    (bookId: string): Reservation | null => {
      const q = getReservationQueue(bookId);
      const dequeued = q.dequeue();
      if (dequeued) {
        addActivityLog(
          'RESERVE',
          `Dequeued from Front: ${dequeued.memberName}`,
          `Removed from Front of Reservation Queue for [${bookId}] (Queue.dequeue O(1)).`,
          'Queue (FIFO)',
          'O(1)',
          'bg-rose-500/10 text-rose-500 border-rose-500/20'
        );

        addToast({
          type: 'info',
          title: 'Dequeued from Waitlist',
          message: `${dequeued.memberName} was dequeued from the reservation queue.`,
        });

        notifyMutation();
      }
      return dequeued;
    },
    [addActivityLog, addToast, getReservationQueue, notifyMutation]
  );

  // Helper to get all queues for display
  const getAllQueuesList = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _v = mutationVersion;
    const allBooks = linkedListRef.current.toArray();
    const result: Array<{ bookId: string; bookTitle: string; queue: Reservation[] }> = [];

    for (let i = 0; i < allBooks.length; i++) {
      const b = allBooks[i];
      const q = getReservationQueue(b.id);
      if (q && q.size > 0) {
        result.push({
          bookId: b.id,
          bookTitle: b.title,
          queue: q.toArray(),
        });
      }
    }
    return result;
  }, [getReservationQueue, mutationVersion]);

  // Run Custom Sorting
  const runSort = useCallback(
    (field: SortField, algorithm: 'Merge Sort' | 'Bubble Sort', order: SortOrder) => {
      const currentBooks = linkedListRef.current.toArray();
      let result: { sorted: Book[]; metrics: SortBenchmarkResult };

      if (algorithm === 'Merge Sort') {
        result = manualMergeSort(currentBooks, field, order);
      } else {
        result = manualBubbleSort(currentBooks, field, order);
      }

      addActivityLog(
        'SORT',
        `Executed ${algorithm} on ${result.metrics.sortedCount} Books`,
        `Sorted by "${field}" (${order.toUpperCase()}). Comparisons: ${result.metrics.comparisons}, Operations: ${result.metrics.swapsOrMerges}, Runtime: ${result.metrics.durationMs}ms.`,
        algorithm,
        result.metrics.timeComplexity,
        'bg-violet-500/10 text-violet-500 border-violet-500/20'
      );

      return result;
    },
    [addActivityLog]
  );

  // Run Comparative Search Benchmark
  const runSearchBenchmark = useCallback(
    (bookId: string) => {
      const benchmark = benchmarkIdSearch(
        bookId,
        linkedListRef.current,
        hashTableRef.current,
        bstRef.current
      );

      addActivityLog(
        'FAST_SEARCH',
        `Benchmark Search for [${bookId.toUpperCase()}]`,
        `Hash Table: ${benchmark.hashResult.comparisons} comparisons | BST: ${benchmark.bstResult.comparisons} comparisons | Linear: ${benchmark.linearResult.comparisons} comparisons.`,
        'Hash vs BST vs Linear',
        'O(1) vs O(log n) vs O(n)',
        'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
      );

      return benchmark;
    },
    [addActivityLog]
  );

  const value = {
    books,
    members,
    activityLogs,
    toasts,
    darkMode,
    setDarkMode,
    toggleDarkMode,
    addToast,
    removeToast,
    linkedList: linkedListRef.current,
    hashTable: hashTableRef.current,
    bst: bstRef.current,
    returnStack: returnStackRef.current,
    getReservationQueue,
    getAllQueuesList,
    addBook,
    updateBook,
    deleteBook,
    issueBook,
    returnBook,
    popRecentlyReturned,
    enqueueReservation,
    dequeueReservation,
    runSort,
    runSearchBenchmark,
    mutationVersion,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
