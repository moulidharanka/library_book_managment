import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { ConceptHeader } from '../common/ConceptHeader';
import { ConceptSection } from '../common/ConceptSection';
import {
  CheckCircle2,
  AlertCircle,
  ArrowDown,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface FastSearchPageProps {
  onOpenIssueModal: (bookId: string) => void;
  onOpenReturnModal: (bookId: string) => void;
}

export const FastSearchPage: React.FC<FastSearchPageProps> = () => {
  const { hashTable } = useLibrary();

  // Colors for Hash Table
  const primaryColor = '#7C3AED';
  const lightColor = '#F5F3FF';
  const borderColor = '#DDD6FE';

  const [inputKey, setInputKey] = useState('LIB1008');
  const [searchTarget, setSearchTarget] = useState('LIB1008');

  // Perform lookup on searchTarget
  const lookupResult = hashTable.get(searchTarget.trim().toUpperCase());
  const allBuckets = hashTable.getAllBuckets();
  const isFound = lookupResult.value !== null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    setSearchTarget(inputKey.trim().toUpperCase());
  };

  const handleQuickPick = (id: string) => {
    setInputKey(id);
    setSearchTarget(id);
  };

  return (
    <div className="space-y-6">
      {/* CONCEPT HEADER */}
      <ConceptHeader
        label="HASH TABLE"
        heading="Fast Search"
        description="Direct constant-time book retrieval using a fixed 11-bucket array with separate chaining."
        timeComplexity="O(1) Avg"
        spaceComplexity="O(m + n)"
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
            A Hash Table maps keys directly to bucket indices using a hash function. Colliding keys are stored in separate linked lists at each bucket.
          </p>

          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="font-semibold text-[#173B57] block mb-1">Library Usage:</span>
            <p className="text-[#64748B]">
              Direct lookup of books by Book ID or ISBN at the circulation desk without scanning through thousands of books sequentially.
            </p>
          </div>

          {/* Small visual */}
          <div className="flex items-center gap-2 text-xs font-mono font-semibold pt-1">
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#DDD6FE] text-[#7C3AED]">
              Book ID
            </span>
            <ArrowRight className="w-4 h-4 text-[#7C3AED]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#DDD6FE] text-[#7C3AED]">
              Polynomial Hash (mod 11)
            </span>
            <ArrowRight className="w-4 h-4 text-[#7C3AED]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#DDD6FE] text-[#7C3AED]">
              Bucket Index
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
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
              Book ID / ISBN
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                placeholder="LIB1008"
                className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
              />

              <button
                type="submit"
                className="h-10 px-6 rounded-lg text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6d28d9] shadow-xs transition-colors cursor-pointer shrink-0"
              >
                Compute Hash & Search
              </button>
            </div>
          </div>

          {/* Quick Pick Samples */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="text-[#64748B]">Quick Pick Samples:</span>
            {['LIB1008', 'LIB1001', 'LIB1003', 'LIB1015', 'LIB1019', 'LIB1020'].map(id => (
              <button
                key={id}
                type="button"
                onClick={() => handleQuickPick(id)}
                className={`px-2 py-0.5 rounded border transition-colors font-mono cursor-pointer ${
                  searchTarget === id
                    ? 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE] font-bold'
                    : 'bg-white text-slate-600 border-[#E2E8F0] hover:bg-slate-50'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </form>
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
          {/* Step-by-Step Hash Function Trace Diagram */}
          <div className="p-4 bg-white rounded-lg border border-[#DDD6FE]">
            <div className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider mb-3">
              Hash Function Pipeline
            </div>

            <div className="flex flex-col items-center gap-2 max-w-xs mx-auto py-2 font-mono text-xs">
              <div className="px-4 py-2 rounded-lg bg-[#F5F3FF] border border-[#DDD6FE] font-bold text-[#7C3AED]">
                {searchTarget}
              </div>
              <ArrowDown className="w-4 h-4 text-[#7C3AED]" />
              <div className="px-3 py-1 text-[11px] rounded bg-slate-50 border border-slate-200 text-slate-700">
                hash("{searchTarget}") = {lookupResult.calculation.rawSum}
              </div>
              <ArrowDown className="w-4 h-4 text-[#7C3AED]" />
              <div className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white font-bold">
                INDEX {lookupResult.bucketIndex}
              </div>
              <ArrowDown className="w-4 h-4 text-[#7C3AED]" />

              {/* Bucket Box */}
              <div className="w-full border-2 border-[#7C3AED] rounded-lg overflow-hidden flex bg-white">
                <div className="w-12 bg-[#F5F3FF] text-[#7C3AED] font-bold flex items-center justify-center border-r border-[#DDD6FE]">
                  {lookupResult.bucketIndex}
                </div>
                <div className="p-2 flex-1 font-semibold text-[#1E293B] truncate">
                  {lookupResult.value ? lookupResult.value.title : 'NULL (Key not in bucket)'}
                </div>
              </div>
            </div>
          </div>

          {/* 11 Buckets Visualizer */}
          <div className="p-4 bg-white rounded-lg border border-[#DDD6FE]">
            <div className="text-xs font-bold text-[#173B57] mb-2 flex items-center justify-between">
              <span>All 11 Buckets with Separate Chaining</span>
              <span className="font-mono text-[11px] text-[#7C3AED]">Target: Bucket #{lookupResult.bucketIndex}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
              {allBuckets.map(b => {
                const isTarget = b.index === lookupResult.bucketIndex;
                return (
                  <div
                    key={b.index}
                    className={`p-2 rounded-md border transition-all ${
                      isTarget
                        ? 'bg-[#F5F3FF] border-[#7C3AED] ring-2 ring-[#7C3AED]/30'
                        : 'bg-white border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#173B57] mb-1">
                      <span>[{b.index}]</span>
                      <span className="text-[10px] text-[#64748B] font-normal">{b.count} node(s)</span>
                    </div>

                    {b.nodes.length > 0 ? (
                      <div className="space-y-0.5">
                        {b.nodes.map(n => (
                          <div
                            key={n.key}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono truncate ${
                              n.key === searchTarget
                                ? 'bg-[#7C3AED] text-white font-bold'
                                : 'bg-slate-50 text-slate-700'
                            }`}
                          >
                            {n.key}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono italic">empty</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
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
          {isFound && lookupResult.value ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#16A34A] bg-[#F0FDF4] p-3 rounded-lg border border-[#BBF7D0]">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
                <span>✓ Book found in bucket index {lookupResult.bucketIndex} after {lookupResult.comparisons} comparison(s).</span>
              </div>

              <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[#64748B] block text-[11px]">Book ID & Title</span>
                  <strong className="text-[#173B57]">
                    [{lookupResult.value.id}] {lookupResult.value.title}
                  </strong>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Author & Year</span>
                  <span className="text-[#1E293B]">
                    {lookupResult.value.author} ({lookupResult.value.year})
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Category</span>
                  <span className="text-[#1E293B]">{lookupResult.value.category}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">Available Stock</span>
                  <span className="font-bold text-[#7C3AED]">
                    {lookupResult.value.copiesAvailable} / {lookupResult.value.totalCopies} copies
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Book ID [{searchTarget}] was not found in bucket index #{lookupResult.bucketIndex}.</span>
            </div>
          )}
        </div>
      </ConceptSection>
    </div>
  );
};
