import React, { useState, useEffect } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Book, SortField, SortOrder, SortBenchmarkResult } from '../../types/library';
import { ConceptHeader } from '../common/ConceptHeader';
import { ConceptSection } from '../common/ConceptSection';
import {
  CheckCircle2,
  ArrowRight,
  ArrowUpDown,
  BarChart3,
} from 'lucide-react';

export const SortingPage: React.FC = () => {
  const { runSort, books } = useLibrary();

  // Colors for Sorting
  const primaryColor = '#DB2777';
  const lightColor = '#FDF2F8';
  const borderColor = '#FBCFE8';

  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [statusMessage, setStatusMessage] = useState<string>('Catalog sorting ready.');

  const [bubbleResult, setBubbleResult] = useState<SortBenchmarkResult | null>(null);
  const [mergeResult, setMergeResult] = useState<SortBenchmarkResult | null>(null);
  const [sortedBooks, setSortedBooks] = useState<Book[]>([]);

  const handleRunSort = () => {
    const bubble = runSort(sortField, 'Bubble Sort', sortOrder);
    const merge = runSort(sortField, 'Merge Sort', sortOrder);

    setBubbleResult(bubble.metrics);
    setMergeResult(merge.metrics);
    setSortedBooks(merge.sorted);
    setStatusMessage(`✓ Catalog sorted by ${sortField.toUpperCase()} (${sortOrder.toUpperCase()}). Merge Sort took ${merge.metrics.comparisons} comparisons; Bubble Sort took ${bubble.metrics.comparisons} comparisons.`);
  };

  useEffect(() => {
    if (books.length > 0) {
      handleRunSort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books, sortField, sortOrder]);

  return (
    <div className="space-y-6">
      {/* CONCEPT HEADER */}
      <ConceptHeader
        label="SORTING"
        heading="Book Organization"
        description="Organize the library catalog dynamically using hand-crafted Merge Sort and Bubble Sort."
        timeComplexity="O(n log n) vs O(n²)"
        spaceComplexity="O(n) vs O(1)"
        primaryColor={primaryColor}
        lightColor={lightColor}
        borderColor={borderColor}
      />

      {/* 01 EXPLANATION */}
      <ConceptSection
        stepNumber="01"
        title="Explanation"
        primaryColor={primaryColor}
        lightColor={lightColor}
        borderColor={borderColor}
      >
        <div className="space-y-4 text-xs sm:text-sm text-[#1E293B]">
          <p className="leading-relaxed">
            Sorting rearranges elements into a specified order. Merge Sort divides the collection in halves recursively (O(n log n)), while Bubble Sort repeatedly swaps adjacent out-of-order pairs (O(n²)).
          </p>

          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="font-semibold text-[#173B57] block mb-1">Library Usage:</span>
            <p className="text-[#64748B]">
              Patrons and librarians browse the catalog ordered alphabetically by Title, grouped by Author, chronologically by Year, or by remaining stock count.
            </p>
          </div>

          {/* Small visual */}
          <div className="flex items-center gap-2 text-xs font-mono font-semibold pt-1">
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#FBCFE8] text-[#DB2777]">
              Unsorted Books
            </span>
            <ArrowRight className="w-4 h-4 text-[#DB2777]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#FBCFE8] text-[#DB2777]">
              Divide & Conquer / Swaps
            </span>
            <ArrowRight className="w-4 h-4 text-[#DB2777]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#FBCFE8] text-[#DB2777]">
              Sorted Catalog
            </span>
          </div>
        </div>
      </ConceptSection>

      {/* 02 USER INPUT */}
      <ConceptSection
        stepNumber="02"
        title="User Input"
        primaryColor={primaryColor}
        lightColor={lightColor}
        borderColor={borderColor}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
              Sort Field
            </label>
            <select
              value={sortField}
              onChange={e => setSortField(e.target.value as SortField)}
              className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777]"
            >
              <option value="title">Book Title (Alphabetical)</option>
              <option value="author">Author Name</option>
              <option value="year">Publication Year</option>
              <option value="copiesAvailable">Copies Available (Stock)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
              Sort Order
            </label>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as SortOrder)}
              className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:border-[#DB2777] focus:ring-1 focus:ring-[#DB2777]"
            >
              <option value="asc">Ascending (A → Z / Lowest First)</option>
              <option value="desc">Descending (Z → A / Highest First)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleRunSort}
              className="w-full h-10 px-6 rounded-lg text-xs font-semibold text-white bg-[#DB2777] hover:bg-[#be185d] shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort Books</span>
            </button>
          </div>
        </div>
      </ConceptSection>

      {/* 03 HOW IT WORKS */}
      <ConceptSection
        stepNumber="03"
        title="How It Works"
        primaryColor={primaryColor}
        lightColor={lightColor}
        borderColor={borderColor}
        tintBackground={true}
      >
        <div className="space-y-4">
          <div className="text-xs text-[#64748B]">
            Side-by-side complexity analysis on {books.length} library books:
          </div>

          {mergeResult && bubbleResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Merge Sort Card */}
              <div className="p-4 rounded-lg bg-white border border-[#FBCFE8]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#173B57]">1. Merge Sort (Divide & Conquer)</span>
                  <span className="font-mono text-[10px] text-[#DB2777] font-bold bg-[#FDF2F8] px-1.5 py-0.5 rounded">
                    O(n log n)
                  </span>
                </div>
                <div className="space-y-1.5 text-[#64748B]">
                  <div className="flex justify-between">
                    <span>Comparisons:</span>
                    <strong className="font-mono text-[#DB2777] font-bold text-sm">
                      {mergeResult.comparisons}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Merge Operations:</span>
                    <strong className="font-mono text-[#173B57]">
                      {mergeResult.swapsOrMerges}
                    </strong>
                  </div>
                  <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#1E293B]">
                    Guaranteed O(n log n) performance regardless of initial key ordering.
                  </div>
                </div>
              </div>

              {/* Bubble Sort Card */}
              <div className="p-4 rounded-lg bg-white border border-[#FBCFE8]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#173B57]">2. Bubble Sort (Adjacent Swaps)</span>
                  <span className="font-mono text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                    O(n²)
                  </span>
                </div>
                <div className="space-y-1.5 text-[#64748B]">
                  <div className="flex justify-between">
                    <span>Comparisons:</span>
                    <strong className="font-mono text-amber-600 font-bold text-sm">
                      {bubbleResult.comparisons}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Adjacent Swaps:</span>
                    <strong className="font-mono text-[#173B57]">
                      {bubbleResult.swapsOrMerges}
                    </strong>
                  </div>
                  <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#1E293B]">
                    Quadratic passes through adjacent elements make it inefficient for large collections.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ConceptSection>

      {/* 04 OUTPUT */}
      <ConceptSection
        stepNumber="04"
        title="Output"
        primaryColor={primaryColor}
        lightColor={lightColor}
        borderColor={borderColor}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#16A34A] bg-[#F0FDF4] p-3 rounded-lg border border-[#BBF7D0]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
            <span>{statusMessage}</span>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#173B57] mb-2">
              Sorted Catalog ({sortedBooks.length} Books):
            </div>
            <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8FAFC] text-[#173B57] border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-2.5 px-3 font-bold">ID</th>
                    <th className="py-2.5 px-3 font-bold">Title</th>
                    <th className="py-2.5 px-3 font-bold">Author</th>
                    <th className="py-2.5 px-3 font-bold text-center">Year</th>
                    <th className="py-2.5 px-3 font-bold text-right">Copies</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-[#1E293B]">
                  {sortedBooks.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 font-mono font-bold text-[#DB2777]">{b.id}</td>
                      <td className="py-2 px-3 font-semibold text-[#173B57]">{b.title}</td>
                      <td className="py-2 px-3 text-[#64748B]">{b.author}</td>
                      <td className="py-2 px-3 font-mono text-center">{b.year}</td>
                      <td className="py-2 px-3 font-mono text-right font-bold text-[#173B57]">
                        {b.copiesAvailable} / {b.totalCopies}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ConceptSection>
    </div>
  );
};
