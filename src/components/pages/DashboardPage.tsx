import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { PageId } from '../layout/Sidebar';
import { HowItWorks } from '../common/HowItWorks';
import {
  BookOpen,
  Users,
  Clock,
  Layers,
  Search,
  Zap,
  Network,
  Activity,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Database,
  ArrowUpDown,
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  onOpenIssueModal: (bookId?: string) => void;
  onOpenReturnModal: (bookId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenIssueModal,
  onOpenReturnModal,
}) => {
  const {
    books,
    linkedList,
    returnStack,
    getAllQueuesList,
    activityLogs,
    runSearchBenchmark,
  } = useLibrary();

  const [searchTargetId, setSearchTargetId] = useState('LIB1008');
  const [benchmarkResult, setBenchmarkResult] = useState<ReturnType<typeof runSearchBenchmark> | null>(null);

  // Statistics
  const totalBooks = linkedList.length;
  const totalAvailable = books.reduce((acc, b) => acc + b.copiesAvailable, 0);
  const totalCapacity = books.reduce((acc, b) => acc + b.totalCopies, 0);
  const totalIssued = totalCapacity - totalAvailable;
  const queues = getAllQueuesList();
  const totalWaiting = queues.reduce((acc, q) => acc + q.queue.length, 0);
  const returnStackCount = returnStack.size;

  const handleBenchmarkSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTargetId.trim()) {
      const res = runSearchBenchmark(searchTargetId.trim());
      setBenchmarkResult(res);
    }
  };

  // 6 DSA Feature Cards
  const dsaFeatureCards = [
    {
      name: 'Linked List',
      title: 'Book Storage',
      desc: 'Master collection ordered as a pointer-chained singly linked list for dynamic insertion.',
      icon: <BookOpen className="w-4 h-4 text-[#159A9C]" />,
      page: 'books' as PageId,
      complexity: 'Append O(1)',
    },
    {
      name: 'Hash Table',
      title: 'Fast Book Search',
      desc: 'Fixed 11-bucket array with polynomial hashing & chaining for direct constant-time ID retrieval.',
      icon: <Zap className="w-4 h-4 text-[#159A9C]" />,
      page: 'fast-search' as PageId,
      complexity: 'Lookup O(1) Avg',
    },
    {
      name: 'Queue',
      title: 'Reservation / Waiting List',
      desc: 'FIFO queues per unavailable title ensuring strict chronological waitlist service without starvation.',
      icon: <Users className="w-4 h-4 text-[#159A9C]" />,
      page: 'reservations' as PageId,
      complexity: 'FIFO O(1)',
    },
    {
      name: 'Stack',
      title: 'Recently Returned',
      desc: 'LIFO intake pile with top pointer modeling physical circulation desk returns and reshelving.',
      icon: <Layers className="w-4 h-4 text-[#159A9C]" />,
      page: 'recently-returned' as PageId,
      complexity: 'LIFO O(1)',
    },
    {
      name: 'BST',
      title: 'Sorted Book Records',
      desc: 'Binary search tree maintaining alphanumeric ordering with in-order traversal reporting.',
      icon: <Network className="w-4 h-4 text-[#159A9C]" />,
      page: 'sorted-bst' as PageId,
      complexity: 'Search O(log n)',
    },
    {
      name: 'Searching & Sorting',
      title: 'Book Management Operations',
      desc: 'Hand-crafted Merge Sort, Bubble Sort, Linear Search, and empirical runtime comparison.',
      icon: <ArrowUpDown className="w-4 h-4 text-[#159A9C]" />,
      page: 'dsa-lab' as PageId,
      complexity: 'Merge O(n log n)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Educational Architecture Banner */}
      <HowItWorks
        title="Multi-Structure Synchronous Engine"
        dsaName="Linked List + Hash Table (11) + BST + Queue + Stack"
        badge="Full System Sync"
        timeComplexity="O(1) to O(log n)"
        spaceComplexity="O(n)"
        summary="Every book in this library is simultaneously registered in a Singly Linked List (master order), an 11-bucket Hash Table with chaining (instant ID lookup), and a Binary Search Tree (ordered tree search). Reservations are handled by isolated FIFO Queues, and returns are stored on a LIFO Stack."
        details={[
          'Add Book: Appends to Linked List O(1), inserts into Hash Table bucket O(1), and inserts into BST O(log n).',
          'Issue Book: Looks up via Hash Table O(1). If 0 copies remain, enqueues patron into the book’s FIFO waitlist.',
          'Return Book: Pushes onto Return Stack O(1). If queue has waiting students, auto-dequeues O(1) and reissues immediately.',
          'Delete Book: Evicts from Singly Linked List, Hash Table bucket chain, and BST using 3-case node deletion.',
        ]}
        whyChosen="Using distinct specialized data structures rather than a single generic array prevents performance bottlenecks: Hash Table ensures O(1) circulation counter lookups, BST allows ordered range traversal, Queues guarantee fair FIFO borrowing priority, and Stacks model real-world desk return piles."
      />

      {/* 5 Required Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: TOTAL BOOKS */}
        <div
          onClick={() => onNavigate('books')}
          className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#159A9C]/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">TOTAL BOOKS</span>
            <div className="w-7 h-7 rounded-md bg-[#E6F4F4] text-[#159A9C] flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#173B57] font-mono">
            {totalBooks}
          </div>
          <div className="text-[11px] text-[#159A9C] font-medium mt-1 flex items-center gap-1">
            <span>Singly Linked List</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: AVAILABLE */}
        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">AVAILABLE</span>
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">
            {totalAvailable}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Ready for checkout
          </div>
        </div>

        {/* Card 3: ISSUED */}
        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">ISSUED</span>
            <div className="w-7 h-7 rounded-md bg-[#E6F4F4] text-[#173B57] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#173B57] font-mono">
            {totalIssued}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            of {totalCapacity} copies
          </div>
        </div>

        {/* Card 4: RESERVATIONS */}
        <div
          onClick={() => onNavigate('reservations')}
          className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#159A9C]/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">RESERVATIONS</span>
            <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 font-mono">
            {totalWaiting}
          </div>
          <div className="text-[11px] text-[#159A9C] font-medium mt-1 flex items-center gap-1">
            <span>{queues.length} active queue(s)</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 5: RECENTLY RETURNED */}
        <div
          onClick={() => onNavigate('recently-returned')}
          className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#159A9C]/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">RECENTLY RETURNED</span>
            <div className="w-7 h-7 rounded-md bg-slate-100 text-[#173B57] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#173B57] font-mono">
            {returnStackCount}
          </div>
          <div className="text-[11px] text-[#159A9C] font-medium mt-1 flex items-center gap-1">
            <span>TOP: {returnStack.peek()?.bookId || 'Empty'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 6 DSA Feature Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#173B57] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#159A9C]" />
            <span>Core Data Structure Engines</span>
          </h3>
          <span className="text-xs text-[#64748B]">Click any card to inspect implementation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {dsaFeatureCards.map(c => (
            <div
              key={c.name}
              onClick={() => onNavigate(c.page)}
              className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs hover:border-[#159A9C] transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#E6F4F4] flex items-center justify-center text-[#159A9C] group-hover:bg-[#159A9C] group-hover:text-white transition-colors">
                  {c.icon}
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#F7F9FC] text-[#173B57] border border-[#E2E8F0]">
                  {c.complexity}
                </span>
              </div>
              <div className="text-[11px] font-bold text-[#159A9C] uppercase tracking-wider">{c.name}</div>
              <h4 className="text-sm font-bold text-[#173B57] mt-0.5">{c.title}</h4>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Search Benchmark Race */}
      <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#E6F4F4] text-[#173B57] border border-[#159A9C]/30">
                Triple-Algorithm Search Race
              </span>
              <h3 className="text-sm font-bold text-[#173B57]">
                Live Search Benchmark: Hash Table vs BST vs Linear Search
              </h3>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Enter any Book ID to watch the 3 hand-crafted algorithms execute and compare their comparison counts.
            </p>
          </div>

          {/* Quick Book Suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-[#64748B] font-medium">Quick Pick:</span>
            {['LIB1008', 'LIB1001', 'LIB1015', 'LIB1018', 'LIB1020'].map(id => (
              <button
                key={id}
                onClick={() => {
                  setSearchTargetId(id);
                  const res = runSearchBenchmark(id);
                  setBenchmarkResult(res);
                }}
                className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-all cursor-pointer ${
                  searchTargetId === id
                    ? 'bg-[#173B57] text-white font-bold border-[#173B57]'
                    : 'bg-[#F7F9FC] text-[#263238] border-[#E2E8F0] hover:border-[#159A9C]'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleBenchmarkSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#159A9C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTargetId}
              onChange={e => setSearchTargetId(e.target.value)}
              placeholder="Enter Book ID to search (e.g. LIB1008)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-xs font-mono text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#173B57] hover:bg-[#122e44] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Zap className="w-3.5 h-3.5 text-[#159A9C]" />
            <span>Benchmark Search</span>
          </button>
        </form>

        {/* Benchmark Results Display */}
        {benchmarkResult && (
          <div className="mt-4 space-y-3 pt-3.5 border-t border-[#E2E8F0]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Algorithm 1: Hash Table */}
              <div className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#173B57]">
                    <Zap className="w-3.5 h-3.5 text-[#159A9C]" />
                    <span>Hash Table Lookup</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E6F4F4] text-[#173B57] font-bold">
                    O(1) Avg
                  </span>
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-[#173B57]">
                  {benchmarkResult.hashResult.comparisons}{' '}
                  <span className="text-xs font-normal text-[#64748B]">comparisons</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  {benchmarkResult.hashResult.explanation}
                </p>
              </div>

              {/* Algorithm 2: BST Search */}
              <div className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#173B57]">
                    <Network className="w-3.5 h-3.5 text-[#159A9C]" />
                    <span>BST Search</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E6F4F4] text-[#173B57] font-bold">
                    O(log n)
                  </span>
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-[#173B57]">
                  {benchmarkResult.bstResult.comparisons}{' '}
                  <span className="text-xs font-normal text-[#64748B]">comparisons</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  {benchmarkResult.bstResult.explanation}
                </p>
              </div>

              {/* Algorithm 3: Linear Search */}
              <div className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#173B57]">
                    <BookOpen className="w-3.5 h-3.5 text-[#159A9C]" />
                    <span>Linear Search</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-[#173B57] font-bold">
                    O(n)
                  </span>
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-[#173B57]">
                  {benchmarkResult.linearResult.comparisons}{' '}
                  <span className="text-xs font-normal text-[#64748B]">comparisons</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">
                  {benchmarkResult.linearResult.explanation}
                </p>
              </div>
            </div>

            {/* Found Book Card Preview */}
            {benchmarkResult.hashResult.item && (
              <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-[#E6F4F4] text-[#159A9C] flex items-center justify-center font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#173B57]">
                      [{benchmarkResult.hashResult.item.id}] {benchmarkResult.hashResult.item.title}
                    </h4>
                    <p className="text-[11px] text-[#64748B]">
                      by {benchmarkResult.hashResult.item.author} • Category: {benchmarkResult.hashResult.item.category} • Location: {benchmarkResult.hashResult.item.shelfLocation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenIssueModal(benchmarkResult.hashResult.item?.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#159A9C] hover:bg-[#117c7e] rounded-md shadow-xs cursor-pointer"
                  >
                    Issue / Reserve
                  </button>
                  <button
                    onClick={() => onNavigate('fast-search')}
                    className="px-3 py-1.5 text-xs font-semibold text-[#173B57] hover:bg-[#F7F9FC] border border-[#E2E8F0] rounded-md cursor-pointer"
                  >
                    Inspect Hash Pipeline →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Real-Time Activity Log Feed */}
      <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#159A9C]" />
            <h3 className="text-sm font-bold text-[#173B57]">
              Real-Time DSA Operation Stream
            </h3>
          </div>
          <span className="text-xs text-[#64748B]">
            Synchronized Memory and Pointer Operations
          </span>
        </div>

        {activityLogs.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#64748B]">
            No activity logged yet. Issue, return, or add a book to observe the trace.
          </div>
        ) : (
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {activityLogs.map(log => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-xs hover:border-[#159A9C]/40 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#E6F4F4] text-[#173B57]">
                      {log.action}
                    </span>
                    <span className="font-bold text-[#173B57]">
                      {log.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    {log.timestamp}
                  </span>
                </div>

                <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                  {log.description}
                </p>

                <div className="mt-1 flex items-center justify-between text-[10px] text-[#64748B] pt-1 border-t border-slate-200">
                  <span className="font-mono">Engine: {log.dsaUsed}</span>
                  <span className="font-mono font-semibold text-[#159A9C]">
                    Complexity: {log.complexity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
