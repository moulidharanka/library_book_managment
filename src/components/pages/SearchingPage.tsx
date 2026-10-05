import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Book } from '../../types/library';
import { ConceptHeader } from '../common/ConceptHeader';
import { ConceptSection } from '../common/ConceptSection';
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  Search,
  Network,
} from 'lucide-react';

export const SearchingPage: React.FC = () => {
  const { runSearchBenchmark } = useLibrary();

  // Colors for Searching
  const primaryColor = '#4F46E5';
  const lightColor = '#EEF2FF';
  const borderColor = '#C7D2FE';

  const [searchTargetId, setSearchTargetId] = useState('LIB1008');
  const [benchmarkResult, setBenchmarkResult] = useState<ReturnType<
    typeof runSearchBenchmark
  > | null>(() => runSearchBenchmark('LIB1008'));
  const [statusMessage, setStatusMessage] = useState<string>('Triple-search benchmark ready.');

  const handleRunSearch = (idToSearch: string) => {
    const cleanId = idToSearch.trim().toUpperCase();
    setSearchTargetId(cleanId);
    const res = runSearchBenchmark(cleanId);
    setBenchmarkResult(res);
    setStatusMessage(`✓ Search completed for [${cleanId}]. Hash: ${res.hashResult.comparisons} checks · BST: ${res.bstResult.comparisons} checks · Linear: ${res.linearResult.comparisons} checks.`);
  };

  const matchedBook: Book | null = benchmarkResult
    ? benchmarkResult.hashResult.item ||
      benchmarkResult.bstResult.item ||
      benchmarkResult.linearResult.item
    : null;

  return (
    <div className="space-y-6">
      {/* CONCEPT HEADER */}
      <ConceptHeader
        label="SEARCHING"
        heading="Book Search"
        description="Compare search performance across Linear Search, Hash Table Lookup, and BST Search."
        timeComplexity="O(1) to O(n)"
        spaceComplexity="O(1)"
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
            Searching locates a target book in a collection. The choice of underlying data structure fundamentally determines the number of comparisons required.
          </p>

          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="font-semibold text-[#173B57] block mb-1">Library Usage:</span>
            <p className="text-[#64748B]">
              Hash Tables provide instant O(1) ID scans, Binary Search Trees support hierarchical O(log n) lookups, and Linear Search scans unindexed fields in O(n) time.
            </p>
          </div>

          {/* Small visual */}
          <div className="flex items-center gap-2 text-xs font-mono font-semibold pt-1">
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#C7D2FE] text-[#4F46E5]">
              Hash: O(1)
            </span>
            <ArrowRight className="w-4 h-4 text-[#4F46E5]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#C7D2FE] text-[#4F46E5]">
              BST: O(log n)
            </span>
            <ArrowRight className="w-4 h-4 text-[#4F46E5]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#C7D2FE] text-[#4F46E5]">
              Linear: O(n)
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
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
              Enter Book ID to Search
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={searchTargetId}
                onChange={e => setSearchTargetId(e.target.value)}
                placeholder="LIB1008"
                className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
              />

              <button
                type="button"
                onClick={() => handleRunSearch(searchTargetId)}
                className="h-10 px-6 rounded-lg text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338ca] shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Run Search Race
              </button>
            </div>
          </div>

          {/* Quick Pick Samples */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="text-[#64748B]">Quick Pick ID:</span>
            {['LIB1008', 'LIB1001', 'LIB1003', 'LIB1015', 'LIB1019', 'LIB1020'].map(id => (
              <button
                key={id}
                type="button"
                onClick={() => handleRunSearch(id)}
                className={`px-2 py-0.5 rounded border transition-colors font-mono cursor-pointer ${
                  searchTargetId === id
                    ? 'bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE] font-bold'
                    : 'bg-white text-slate-600 border-[#E2E8F0] hover:bg-slate-50'
                }`}
              >
                {id}
              </button>
            ))}
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
            Side-by-side execution trace for key <strong className="font-mono text-[#4F46E5]">[{searchTargetId}]</strong> across 3 data structures:
          </div>

          {benchmarkResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Hash Table Box */}
              <div className="p-4 rounded-lg bg-white border border-[#C7D2FE]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#173B57] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#4F46E5]" />
                    <span>Hash Table</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#4F46E5] font-bold bg-[#EEF2FF] px-1.5 py-0.5 rounded">
                    O(1) Avg
                  </span>
                </div>
                <div className="space-y-1.5 text-[#64748B]">
                  <div>
                    Comparisons:{' '}
                    <strong className="font-mono text-[#4F46E5] font-bold text-sm">
                      {benchmarkResult.hashResult.comparisons}
                    </strong>
                  </div>
                  <div className="text-[11px] text-[#1E293B]">
                    {benchmarkResult.hashResult.explanation}
                  </div>
                </div>
              </div>

              {/* BST Box */}
              <div className="p-4 rounded-lg bg-white border border-[#C7D2FE]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#173B57] flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-[#4F46E5]" />
                    <span>BST Search</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#4F46E5] font-bold bg-[#EEF2FF] px-1.5 py-0.5 rounded">
                    O(log n)
                  </span>
                </div>
                <div className="space-y-1.5 text-[#64748B]">
                  <div>
                    Comparisons:{' '}
                    <strong className="font-mono text-[#173B57] font-bold text-sm">
                      {benchmarkResult.bstResult.comparisons}
                    </strong>
                  </div>
                  <div className="text-[11px] text-[#1E293B]">
                    {benchmarkResult.bstResult.explanation}
                  </div>
                </div>
              </div>

              {/* Linear Search Box */}
              <div className="p-4 rounded-lg bg-white border border-[#C7D2FE]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#173B57] flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Linear Search</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    O(n)
                  </span>
                </div>
                <div className="space-y-1.5 text-[#64748B]">
                  <div>
                    Comparisons:{' '}
                    <strong className="font-mono text-slate-800 font-bold text-sm">
                      {benchmarkResult.linearResult.comparisons}
                    </strong>
                  </div>
                  <div className="text-[11px] text-[#1E293B]">
                    {benchmarkResult.linearResult.explanation}
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

          {matchedBook ? (
            <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#64748B] block text-[11px]">Book Record</span>
                <strong className="text-[#173B57]">
                  [{matchedBook.id}] {matchedBook.title}
                </strong>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Author</span>
                <span className="text-[#1E293B]">{matchedBook.author}</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Category</span>
                <span className="text-[#1E293B]">{matchedBook.category}</span>
              </div>
              <div>
                <span className="text-[#64748B] block text-[11px]">Available Stock</span>
                <span className="font-bold text-[#4F46E5]">
                  {matchedBook.copiesAvailable} / {matchedBook.totalCopies} copies
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
              Book ID [{searchTargetId}] was not found in the library.
            </div>
          )}
        </div>
      </ConceptSection>
    </div>
  );
};
