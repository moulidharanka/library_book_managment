import React from 'react';
import { PageId } from '../layout/Sidebar';
import {
  BookOpen,
  Zap,
  Users,
  Layers,
  Network,
  Search,
  ArrowUpDown,
  ArrowRight,
  Code2,
  CheckCircle2,
} from 'lucide-react';

interface OverviewPageProps {
  onNavigate: (page: PageId) => void;
  onOpenIssueModal: (bookId?: string) => void;
  onOpenReturnModal: (bookId?: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const dsaConcepts = [
    {
      step: '1',
      id: 'books' as PageId,
      name: 'Linked List',
      role: 'Book Storage',
      description:
        'Stores the master book collection as a pointer-chained Singly Linked List, allowing dynamic memory allocation and O(1) tail insertion.',
      timeComplexity: 'Append O(1) · Delete O(n)',
      spaceComplexity: 'O(n)',
      icon: <BookOpen className="w-5 h-5 text-[#159A9C]" />,
    },
    {
      step: '2',
      id: 'fast-search' as PageId,
      name: 'Hash Table',
      role: 'Fast Book Search',
      description:
        'Maps Book ID / ISBN directly to a fixed 11-bucket array with polynomial hashing and collision chaining for near instantaneous lookup.',
      timeComplexity: 'Lookup O(1) Avg · Worst O(n)',
      spaceComplexity: 'O(m + n)',
      icon: <Zap className="w-5 h-5 text-[#159A9C]" />,
    },
    {
      step: '3',
      id: 'reservations' as PageId,
      name: 'Queue',
      role: 'Book Reservation / Waiting List',
      description:
        'Maintains a strict First-In, First-Out (FIFO) waitlist per unavailable book, ensuring fair reservation ordering without starvation.',
      timeComplexity: 'Enqueue O(1) · Dequeue O(1)',
      spaceComplexity: 'O(k)',
      icon: <Users className="w-5 h-5 text-[#159A9C]" />,
    },
    {
      step: '4',
      id: 'recently-returned' as PageId,
      name: 'Stack',
      role: 'Recently Returned Books',
      description:
        'Models the physical circulation desk return pile using a Last-In, First-Out (LIFO) stack with top pointer tracking.',
      timeComplexity: 'Push O(1) · Pop O(1) · Peek O(1)',
      spaceComplexity: 'O(k)',
      icon: <Layers className="w-5 h-5 text-[#159A9C]" />,
    },
    {
      step: '5',
      id: 'sorted-bst' as PageId,
      name: 'BST (Binary Search Tree)',
      role: 'Sorted Book Records',
      description:
        'Organizes books in hierarchical order by Book ID; in-order traversal naturally yields an alphanumerically sorted catalog.',
      timeComplexity: 'Search O(log n) · In-order O(n)',
      spaceComplexity: 'O(n)',
      icon: <Network className="w-5 h-5 text-[#159A9C]" />,
    },
    {
      step: '6',
      id: 'searching' as PageId,
      name: 'Searching Operations',
      role: 'Book Search Benchmarks',
      description:
        'Executes and compares Linear Search, Hash Table Lookup, and BST Search side-by-side, tracking exact comparisons and execution steps.',
      timeComplexity: 'Linear O(n) vs Hash O(1) vs BST O(log n)',
      spaceComplexity: 'O(1) auxiliary',
      icon: <Search className="w-5 h-5 text-[#159A9C]" />,
    },
    {
      step: '7',
      id: 'sorting' as PageId,
      name: 'Sorting Operations',
      role: 'Book Management Operations',
      description:
        'Implements Merge Sort and Bubble Sort from scratch to organize the catalog by Title, Author, Year, and Available Copies.',
      timeComplexity: 'Merge Sort O(n log n) vs Bubble Sort O(n²)',
      spaceComplexity: 'Merge O(n) · Bubble O(1)',
      icon: <ArrowUpDown className="w-5 h-5 text-[#159A9C]" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. EXPLANATION: College Project Introduction */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#159A9C] bg-[#E6F4F4] px-2.5 py-0.5 rounded border border-[#159A9C]/20">
            College DSA Demonstrator
          </span>
          <span className="text-[11px] text-[#64748B] font-mono">
            Zero Built-in Map/Set/Sort · 100% Hand-Crafted
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#173B57] tracking-tight">
          Smart Library Management System
        </h1>
        <p className="text-sm text-[#64748B] mt-2 leading-relaxed max-w-4xl">
          This educational web application demonstrates how foundational Data Structures and Algorithms (DSA)
          power real-world library operations. Every data structure—from Singly Linked Lists to Hash Tables,
          Queues, Stacks, Binary Search Trees, and custom sorting/searching algorithms—is implemented from scratch
          in pure TypeScript.
        </p>

        {/* 4-Step Standard Methodology Banner */}
        <div className="mt-5 p-4 rounded-lg bg-[#F7F9FC] border border-[#E2E8F0]">
          <h2 className="text-xs font-bold text-[#173B57] uppercase tracking-wider mb-2">
            Every Concept Follows the Standard 4-Step Educational Pipeline:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-md border border-[#E2E8F0]">
              <span className="font-bold text-[#173B57] block mb-1">1. EXPLANATION</span>
              <p className="text-[#64748B] text-[11px]">
                Theory, real-world library motivation, and formal Time/Space complexity analysis.
              </p>
            </div>
            <div className="p-3 bg-white rounded-md border border-[#E2E8F0]">
              <span className="font-bold text-[#159A9C] block mb-1">2. USER INPUT</span>
              <p className="text-[#64748B] text-[11px]">
                Interactive controls: add/delete items, insert keys, enqueue patrons, and set parameters.
              </p>
            </div>
            <div className="p-3 bg-white rounded-md border border-[#E2E8F0]">
              <span className="font-bold text-[#173B57] block mb-1">3. HOW IT WORKS</span>
              <p className="text-[#64748B] text-[11px]">
                Live visualization of node pointers, bucket hashes, tree branches, and comparisons.
              </p>
            </div>
            <div className="p-3 bg-white rounded-md border border-[#E2E8F0]">
              <span className="font-bold text-[#16A34A] block mb-1">4. OUTPUT</span>
              <p className="text-[#64748B] text-[11px]">
                Direct results, updated data states, and empirical comparison metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 7 DSA CONCEPTS ARCHITECTURE */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#173B57]">
              The 7 Core DSA Concepts in Library Management
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Select any concept below to explore its interactive implementation and live visualizer.
            </p>
          </div>
          <Code2 className="w-5 h-5 text-[#159A9C] hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dsaConcepts.map(c => (
            <div
              key={c.name}
              className="p-4 rounded-lg border border-[#E2E8F0] bg-white hover:border-[#159A9C] hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#E6F4F4] text-[#173B57] font-bold text-xs flex items-center justify-center font-mono">
                    {c.step}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#159A9C] bg-[#E6F4F4] px-2 py-0.5 rounded">
                    {c.name}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#173B57] flex items-center gap-1.5 mb-1">
                  {c.icon}
                  <span>{c.role}</span>
                </h3>

                <p className="text-xs text-[#64748B] leading-relaxed mb-3">
                  {c.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                <div className="text-[10px] font-mono text-[#173B57]">
                  {c.timeComplexity}
                </div>
                <button
                  onClick={() => onNavigate(c.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#159A9C] hover:text-[#117c7e] hover:bg-[#E6F4F4] rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MASTER COMPLEXITY COMPARISON TABLE */}
      <section className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-[#173B57] mb-1">
          Master Complexity & Trade-Off Reference
        </h2>
        <p className="text-xs text-[#64748B] mb-4">
          Theoretical asymptotic boundaries for all 7 hand-crafted data structures and algorithms.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9FC] text-[#173B57] border-b border-[#E2E8F0]">
              <tr>
                <th className="py-2.5 px-3 font-bold">Concept</th>
                <th className="py-2.5 px-3 font-bold">Library Application</th>
                <th className="py-2.5 px-3 font-bold">Best Case</th>
                <th className="py-2.5 px-3 font-bold">Average Case</th>
                <th className="py-2.5 px-3 font-bold">Worst Case</th>
                <th className="py-2.5 px-3 font-bold">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#263238]">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#173B57]">Singly Linked List</td>
                <td className="py-2.5 px-3 text-[#64748B]">Master Book Storage</td>
                <td className="py-2.5 px-3 font-mono">O(1) Append</td>
                <td className="py-2.5 px-3 font-mono">O(n) Traversal</td>
                <td className="py-2.5 px-3 font-mono">O(n) Delete/Search</td>
                <td className="py-2.5 px-3 font-mono">O(n)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#173B57]">Hash Table (M=11)</td>
                <td className="py-2.5 px-3 text-[#64748B]">Instant ID/ISBN Lookup</td>
                <td className="py-2.5 px-3 font-mono">O(1) Direct</td>
                <td className="py-2.5 px-3 font-mono">O(1) Lookup</td>
                <td className="py-2.5 px-3 font-mono">O(n) All Collision</td>
                <td className="py-2.5 px-3 font-mono">O(m + n)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#173B57]">FIFO Queue</td>
                <td className="py-2.5 px-3 text-[#64748B]">Reservation Waitlists</td>
                <td className="py-2.5 px-3 font-mono">O(1) Enqueue</td>
                <td className="py-2.5 px-3 font-mono">O(1) Dequeue</td>
                <td className="py-2.5 px-3 font-mono">O(1) Peek</td>
                <td className="py-2.5 px-3 font-mono">O(k) waitlist</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#173B57]">LIFO Stack</td>
                <td className="py-2.5 px-3 text-[#64748B]">Returned Desk Pile</td>
                <td className="py-2.5 px-3 font-mono">O(1) Push</td>
                <td className="py-2.5 px-3 font-mono">O(1) Pop</td>
                <td className="py-2.5 px-3 font-mono">O(1) Peek</td>
                <td className="py-2.5 px-3 font-mono">O(k) desk pile</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#173B57]">Binary Search Tree</td>
                <td className="py-2.5 px-3 text-[#64748B]">Sorted Catalog Records</td>
                <td className="py-2.5 px-3 font-mono">O(1) Root Match</td>
                <td className="py-2.5 px-3 font-mono">O(log n) Search</td>
                <td className="py-2.5 px-3 font-mono">O(n) Skewed Tree</td>
                <td className="py-2.5 px-3 font-mono">O(n)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#173B57]">Linear Search</td>
                <td className="py-2.5 px-3 text-[#64748B]">Title / Author Query</td>
                <td className="py-2.5 px-3 font-mono">O(1) First Item</td>
                <td className="py-2.5 px-3 font-mono">O(n/2) = O(n)</td>
                <td className="py-2.5 px-3 font-mono">O(n) Last / Miss</td>
                <td className="py-2.5 px-3 font-mono">O(1) Auxiliary</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#173B57]">Merge Sort</td>
                <td className="py-2.5 px-3 text-[#64748B]">Stable Catalog Ordering</td>
                <td className="py-2.5 px-3 font-mono">O(n log n)</td>
                <td className="py-2.5 px-3 font-mono">O(n log n)</td>
                <td className="py-2.5 px-3 font-mono">O(n log n)</td>
                <td className="py-2.5 px-3 font-mono">O(n) Auxiliary</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#173B57]">Bubble Sort</td>
                <td className="py-2.5 px-3 text-[#64748B]">In-Place Pairwise Swap</td>
                <td className="py-2.5 px-3 font-mono">O(n) Sorted</td>
                <td className="py-2.5 px-3 font-mono">O(n²)</td>
                <td className="py-2.5 px-3 font-mono">O(n²) Reverse</td>
                <td className="py-2.5 px-3 font-mono">O(1) In-Place</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
