import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { HowItWorks } from '../common/HowItWorks';
import { Book, SortField, SortOrder, SortBenchmarkResult } from '../../types/library';
import {
  Zap,
  BookOpen,
  Users,
  Layers,
  Network,
  Play,
  BarChart3,
  Cpu,
} from 'lucide-react';

type DsaLabTab = 'linkedlist' | 'hashtable' | 'queue' | 'stack' | 'bst' | 'sorting';

export const DsaLabPage: React.FC = () => {
  const {
    books,
    linkedList,
    hashTable,
    bst,
    runSort,
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<DsaLabTab>('linkedlist');

  // Sorting Arena States
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [bubbleResult, setBubbleResult] = useState<SortBenchmarkResult | null>(null);
  const [mergeResult, setMergeResult] = useState<SortBenchmarkResult | null>(null);
  const [sortedBooksPreview, setSortedBooksPreview] = useState<Book[]>([]);

  // DSA Lab Operation Log
  const [labLogs, setLabLogs] = useState<
    Array<{ id: string; time: string; operation: string; complexity: string; log: string }>
  >([]);

  const addLabLog = (operation: string, complexity: string, log: string) => {
    setLabLogs(prev => [
      {
        id: Math.random().toString(),
        time: new Date().toLocaleTimeString(),
        operation,
        complexity,
        log,
      },
      ...prev.slice(0, 24),
    ]);
  };

  // Run Sorting Arena Battle
  const handleExecuteSortBattle = () => {
    const bubble = runSort(sortField, 'Bubble Sort', sortOrder);
    const merge = runSort(sortField, 'Merge Sort', sortOrder);

    setBubbleResult(bubble.metrics);
    setMergeResult(merge.metrics);
    setSortedBooksPreview(merge.sorted);

    addLabLog(
      `Sorting Battle (${sortField.toUpperCase()})`,
      'Merge O(n log n) vs Bubble O(n²)',
      `Merge Sort: ${merge.metrics.comparisons} comparisons, ${merge.metrics.durationMs}ms | Bubble Sort: ${bubble.metrics.comparisons} comparisons, ${bubble.metrics.durationMs}ms`
    );
  };

  React.useEffect(() => {
    if (!mergeResult && books.length > 0) {
      handleExecuteSortBattle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books]);

  return (
    <div className="space-y-6">
      {/* Educational Banner */}
      <HowItWorks
        title="Interactive Algorithm Laboratory & Benchmark Suite"
        dsaName="Empirical Complexity Analyzer"
        badge="Pure Algorithms"
        timeComplexity="Variable O(1) to O(n²)"
        spaceComplexity="O(1) to O(n)"
        summary="A sandbox environment to directly test, inspect, and benchmark all 5 core data structures and 2 hand-implemented sorting algorithms (Merge Sort & Bubble Sort) without any abstracted library helpers."
        details={[
          'Sorting Arena: Manually executes Bubble Sort and Merge Sort without Array.prototype.sort, tracking comparison and merge counts.',
          'Live Structure Inspector: Switch between tabs to see real-time state, pointer configurations, and bucket chains.',
          'Empirical Log: Every operation logs precise Big-O, step details, and array or pointer modifications.',
        ]}
        whyChosen="Direct comparison illustrates the concrete difference between polynomial algorithmic complexities (e.g. O(n²) Bubble Sort vs O(n log n) Merge Sort) in tangible execution metrics."
      />

      {/* Required Clean Tabs:
          Selected tab: Navy background with white text
          Unselected: White background with navy text and subtle border
      */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E2E8F0]">
        {[
          { id: 'linkedlist' as DsaLabTab, label: 'Linked List', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'hashtable' as DsaLabTab, label: 'Hash Table', icon: <Zap className="w-4 h-4" /> },
          { id: 'queue' as DsaLabTab, label: 'Queue', icon: <Users className="w-4 h-4" /> },
          { id: 'stack' as DsaLabTab, label: 'Stack', icon: <Layers className="w-4 h-4" /> },
          { id: 'bst' as DsaLabTab, label: 'BST', icon: <Network className="w-4 h-4" /> },
          { id: 'sorting' as DsaLabTab, label: 'Sorting Arena', icon: <BarChart3 className="w-4 h-4" /> },
        ].map(tab => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#173B57] text-white shadow-xs'
                  : 'bg-white text-[#173B57] border border-[#E2E8F0] hover:bg-[#F7F9FC]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Linked List Inspector */}
      {activeTab === 'linkedlist' && (
        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#173B57]">
                Singly Linked List Memory Map
              </h3>
              <p className="text-xs text-[#64748B]">
                Head: <code>{linkedList.head?.value.id || 'null'}</code> • Tail:{' '}
                <code>{linkedList.tail?.value.id || 'null'}</code> • Total Nodes: {linkedList.length}
              </p>
            </div>
            <button
              onClick={() => {
                const searchRes = linkedList.find(b => b.copiesAvailable === 0);
                addLabLog(
                  'LinkedList.find(copies == 0)',
                  'O(n)',
                  `Scanned ${searchRes.comparisons} node(s). Found [${searchRes.item?.id}] at index ${searchRes.index}.`
                );
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#173B57] bg-white border border-[#173B57] hover:bg-[#F7F9FC] rounded-md transition-colors cursor-pointer"
            >
              Test Linear Traversal (O(n))
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9FC] font-mono text-xs text-[#263238] border border-[#E2E8F0] overflow-x-auto space-y-1">
            <div className="text-[#159A9C] font-bold">// Pointer Node Chain in Memory:</div>
            {books.map((b, i) => (
              <div key={b.id} className="flex items-center gap-2 py-0.5">
                <span className="text-[#64748B]">Node_{i}:</span>
                <span className="text-[#173B57] font-bold">[{b.id}]</span>
                <span className="text-[#263238]">"{b.title.slice(0, 30)}"</span>
                <span className="text-[#64748B]">→ next:</span>
                <span className="text-[#159A9C] font-bold">{i < books.length - 1 ? `Node_${i + 1}` : 'NULL'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Hash Table Inspector */}
      {activeTab === 'hashtable' && (
        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#173B57]">
                Hash Table Distribution & Collision Analysis
              </h3>
              <p className="text-xs text-[#64748B]">
                Array Size: 11 • Stored Elements: {hashTable.size} • Current Load Factor λ: {hashTable.loadFactor}
              </p>
            </div>
            <button
              onClick={() => {
                const sample = books[Math.floor(Math.random() * books.length)];
                const lookup = hashTable.get(sample.id);
                addLabLog(
                  `HashTable.get(${sample.id})`,
                  'O(1) Avg',
                  `Hashed to bucket #${lookup.bucketIndex}. Traversed ${lookup.comparisons} chain node(s). Matched "${sample.title}".`
                );
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#173B57] bg-white border border-[#173B57] hover:bg-[#F7F9FC] rounded-md transition-colors cursor-pointer"
            >
              Test Direct Key Lookup (O(1))
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {hashTable.getAllBuckets().map(b => (
              <div
                key={b.index}
                className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-xs"
              >
                <div className="flex items-center justify-between font-mono mb-2">
                  <span className="font-bold text-[#173B57]">Bucket #{b.index}</span>
                  <span className="text-[11px] text-[#64748B]">{b.count} item(s)</span>
                </div>
                {b.nodes.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic">Empty</div>
                ) : (
                  <div className="space-y-1 font-mono text-[11px]">
                    {b.nodes.map((n) => (
                      <div key={n.key} className="flex items-center gap-1.5 truncate">
                        <span className="text-[#159A9C] font-bold">{n.key}</span>
                        <span className="text-slate-400">→</span>
                        <span className="truncate text-[#263238]">{n.value.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Queue Inspector */}
      {activeTab === 'queue' && (
        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#173B57]">
            Queue Mechanics (Head & Tail Tracking)
          </h3>
          <p className="text-xs text-[#64748B]">
            FIFO queue structures enforce strict arrival order for book checkout requests.
          </p>

          <div className="p-4 rounded-xl bg-[#F7F9FC] font-mono text-xs text-[#263238] border border-[#E2E8F0] space-y-2">
            <div className="text-[#159A9C] font-bold">// FIFO Queue Invariant: First In, First Out</div>
            <div className="space-y-1 text-[#173B57]">
              <div>enqueue(x): rearNode.next = newNode; rearNode = newNode; size++ [O(1)]</div>
              <div>dequeue(): val = frontNode.val; frontNode = frontNode.next; size-- [O(1)]</div>
              <div>peek(): return frontNode.val [O(1)]</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Stack Inspector */}
      {activeTab === 'stack' && (
        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#173B57]">
            Stack Mechanics (Top Pointer Tracking)
          </h3>
          <p className="text-xs text-[#64748B]">
            Simulate instantaneous push and pop operations with zero reallocation overhead.
          </p>

          <div className="p-4 rounded-xl bg-[#F7F9FC] font-mono text-xs text-[#263238] border border-[#E2E8F0] space-y-2">
            <div className="text-[#159A9C] font-bold">// LIFO Stack Invariant: Last In, First Out</div>
            <div className="space-y-1 text-[#173B57]">
              <div>push(x): newNode.next = topNode; topNode = newNode; size++ [O(1)]</div>
              <div>pop(): val = topNode.val; topNode = topNode.next; size-- [O(1)]</div>
              <div>peek(): return topNode.val [O(1)]</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: BST Inspector */}
      {activeTab === 'bst' && (
        <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#173B57]">
            Binary Search Tree Properties & Invariants
          </h3>
          <p className="text-xs text-[#64748B]">
            Root: {bst.root?.key || 'None'} • Nodes: {bst.size} • Height: {bst.getHeight()}
          </p>

          <div className="p-4 rounded-xl bg-[#F7F9FC] font-mono text-xs text-[#263238] border border-[#E2E8F0] space-y-2">
            <div className="text-[#159A9C] font-bold">// BST Invariant: Left &lt; Root &lt; Right</div>
            <div className="space-y-1 text-[#173B57]">
              <div>Search(key): Compare with node. If &lt; move left, if &gt; move right [O(log n) avg]</div>
              <div>Insert(key, val): Traverse until null child, attach new node [O(log n) avg]</div>
              <div>InOrder(): Traverse Left → Root → Right produces sorted output [O(n)]</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Sorting Arena */}
      {activeTab === 'sorting' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#173B57] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#159A9C]" />
                  <span>Algorithm Arena: Hand-Crafted Merge Sort vs Bubble Sort</span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Both algorithms are hand-coded with manual comparison counters. No built-in sort is used.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={sortField}
                  onChange={e => setSortField(e.target.value as SortField)}
                  className="px-3 py-1.5 rounded-md border border-[#E2E8F0] bg-[#F7F9FC] text-xs font-semibold focus:outline-none"
                >
                  <option value="title">Sort by Title (Alphabetical)</option>
                  <option value="author">Sort by Author (Alphabetical)</option>
                  <option value="year">Sort by Year (Numerical)</option>
                  <option value="copiesAvailable">Sort by Copies Available</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value as SortOrder)}
                  className="px-3 py-1.5 rounded-md border border-[#E2E8F0] bg-[#F7F9FC] text-xs font-semibold focus:outline-none"
                >
                  <option value="asc">Ascending (A-Z / 0-9)</option>
                  <option value="desc">Descending (Z-A / 9-0)</option>
                </select>

                <button
                  onClick={handleExecuteSortBattle}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#173B57] hover:bg-[#122e44] rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#159A9C]" />
                  <span>Execute Sorting Race</span>
                </button>
              </div>
            </div>

            {/* Side-by-Side Comparison */}
            {mergeResult && bubbleResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#E2E8F0]">
                {/* Merge Sort */}
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#173B57]">
                      Merge Sort (Divide & Conquer)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E6F4F4] text-[#173B57] font-bold">
                      O(n log n)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                    <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                      <div className="text-[10px] text-[#64748B]">Comparisons</div>
                      <div className="font-mono font-bold text-[#173B57] text-base">
                        {mergeResult.comparisons}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                      <div className="text-[10px] text-[#64748B]">Merge Steps</div>
                      <div className="font-mono font-bold text-[#173B57] text-base">
                        {mergeResult.swapsOrMerges}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                      <div className="text-[10px] text-[#64748B]">Duration</div>
                      <div className="font-mono font-bold text-[#173B57] text-base">
                        {mergeResult.durationMs}ms
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bubble Sort */}
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F7F9FC]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-[#173B57]">
                      Bubble Sort (Adjacent Swapping)
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-[#173B57] font-bold">
                      O(n²)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                    <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                      <div className="text-[10px] text-[#64748B]">Comparisons</div>
                      <div className="font-mono font-bold text-[#173B57] text-base">
                        {bubbleResult.comparisons}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                      <div className="text-[10px] text-[#64748B]">Swaps Made</div>
                      <div className="font-mono font-bold text-[#173B57] text-base">
                        {bubbleResult.swapsOrMerges}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0]">
                      <div className="text-[10px] text-[#64748B]">Duration</div>
                      <div className="font-mono font-bold text-[#173B57] text-base">
                        {bubbleResult.durationMs}ms
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sorted Output Preview */}
          <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B57] mb-3">
              Sorted Output Preview ({sortedBooksPreview.length} Books by {sortField.toUpperCase()})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {sortedBooksPreview.map((b, i) => (
                <div
                  key={b.id}
                  className="p-3 rounded-lg border border-[#E2E8F0] bg-white text-xs shadow-xs"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] mb-1">
                    <span>Rank #{i + 1}</span>
                    <span className="text-[#159A9C] font-bold">{b.id}</span>
                  </div>
                  <div className="font-bold text-[#173B57] truncate">
                    {b.title}
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate">
                    by {b.author}
                  </div>
                  <div className="mt-2 text-[10px] font-mono text-[#159A9C] font-semibold bg-[#E6F4F4] px-1.5 py-0.5 rounded border border-[#159A9C]/20 inline-block">
                    {String(b[sortField])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lab Operation Step Log */}
      <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#173B57] mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#159A9C]" />
          <span>Interactive Sandbox Operation Log</span>
        </h4>

        {labLogs.length === 0 ? (
          <div className="p-4 text-center text-xs text-[#64748B]">
            No lab actions executed yet.
          </div>
        ) : (
          <div className="space-y-1.5 text-xs font-mono max-h-48 overflow-y-auto">
            {labLogs.map(l => (
              <div
                key={l.id}
                className="p-2.5 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#64748B] text-[10px]">{l.time}</span>
                  <span className="font-bold text-[#173B57]">{l.operation}</span>
                  <span className="text-[#159A9C]">[{l.complexity}]</span>
                </div>
                <div className="text-[#64748B] text-[11px] truncate max-w-md">
                  {l.log}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
