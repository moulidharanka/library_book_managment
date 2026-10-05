import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { ReturnedBookRecord } from '../../types/library';
import { ConceptHeader } from '../common/ConceptHeader';
import { ConceptSection } from '../common/ConceptSection';
import {
  CheckCircle2,
  ArrowDown,
  ArrowUp,
  ArrowRight,
  Eye,
} from 'lucide-react';

interface RecentlyReturnedPageProps {
  onOpenReturnModal: () => void;
}

export const RecentlyReturnedPage: React.FC<RecentlyReturnedPageProps> = () => {
  const { books, members, returnStack, returnBook, popRecentlyReturned } = useLibrary();

  // Colors for Stack
  const primaryColor = '#16A34A';
  const lightColor = '#F0FDF4';
  const borderColor = '#BBF7D0';

  const [selectedBookId, setSelectedBookId] = useState<string>(books[0]?.id || 'LIB1008');
  const [selectedMemberName, setSelectedMemberName] = useState<string>(members[0]?.name || 'Alice Walker');
  const [statusMessage, setStatusMessage] = useState<string>('Circulation return stack ready.');
  const [peekedItem, setPeekedItem] = useState<ReturnedBookRecord | null>(null);

  const topItems = returnStack.getTopN(5);
  const allStackItems = returnStack.toArray();

  const handlePushReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !selectedMemberName) return;
    returnBook(selectedBookId, selectedMemberName, 'Good');
    setStatusMessage(`✓ Book [${selectedBookId}] returned and pushed to TOP of stack.`);
    setPeekedItem(null);
  };

  const handlePop = () => {
    if (returnStack.isEmpty()) return;
    const popped = popRecentlyReturned();
    if (popped) {
      setStatusMessage(`✓ Popped and shelved [${popped.bookId}] "${popped.bookTitle}" from TOP of stack.`);
    }
    setPeekedItem(null);
  };

  const handlePeek = () => {
    const top = returnStack.peek();
    setPeekedItem(top);
    if (top) {
      setStatusMessage(`✓ Peeked TOP book: [${top.bookId}] "${top.bookTitle}".`);
    } else {
      setStatusMessage('Return stack is empty.');
    }
  };

  return (
    <div className="space-y-6">
      {/* CONCEPT HEADER */}
      <ConceptHeader
        label="STACK"
        heading="Recently Returned"
        description="Manage circulation desk returns using a Last-In, First-Out (LIFO) stack."
        timeComplexity="O(1)"
        spaceComplexity="O(k)"
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
            A Stack operates on a Last-In, First-Out (LIFO) basis. Elements are pushed onto the top and popped from the top.
          </p>

          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="font-semibold text-[#173B57] block mb-1">Library Usage:</span>
            <p className="text-[#64748B]">
              Returned books are placed on top of the circulation desk pile. The librarian inspects and reshelves them from the top down.
            </p>
          </div>

          {/* Small visual */}
          <div className="flex items-center gap-2 text-xs font-mono font-semibold pt-1">
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#BBF7D0] text-[#16A34A]">
              Push to TOP
            </span>
            <ArrowRight className="w-4 h-4 text-[#16A34A]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#BBF7D0] text-[#16A34A]">
              LIFO Desk Stack
            </span>
            <ArrowRight className="w-4 h-4 text-[#16A34A]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#BBF7D0] text-[#16A34A]">
              Pop from TOP
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
        <form onSubmit={handlePushReturn} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Select Book to Return
              </label>
              <select
                value={selectedBookId}
                onChange={e => setSelectedBookId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
              >
                {books.map(b => (
                  <option key={b.id} value={b.id}>
                    [{b.id}] {b.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Returning Patron / Member
              </label>
              <input
                type="text"
                value={selectedMemberName}
                onChange={e => setSelectedMemberName(e.target.value)}
                placeholder="Alice Walker"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <button
              type="submit"
              className="h-10 px-6 rounded-lg text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] shadow-xs transition-colors cursor-pointer"
            >
              Push Returned Book
            </button>

            <button
              type="button"
              onClick={handlePeek}
              disabled={returnStack.isEmpty()}
              className="h-10 px-4 rounded-lg text-xs font-semibold text-[#16A34A] bg-white border border-[#BBF7D0] hover:bg-[#F0FDF4] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Peek Top</span>
            </button>

            <button
              type="button"
              onClick={handlePop}
              disabled={returnStack.isEmpty()}
              className="h-10 px-4 rounded-lg text-xs font-semibold text-white bg-[#173B57] hover:bg-[#122e44] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Pop & Shelve</span>
            </button>
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
          <div className="text-xs text-[#64748B] flex items-center justify-between">
            <span>Vertical Circulation Desk Stack</span>
            <span className="font-mono text-[#16A34A] font-semibold">
              Depth: {returnStack.size} items
            </span>
          </div>

          {/* Vertical Stack Layout */}
          <div className="p-6 bg-white rounded-lg border border-[#BBF7D0]">
            {!returnStack.isEmpty() ? (
              <div className="max-w-xs mx-auto space-y-2">
                {/* TOP Indicator */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-mono font-bold text-[#16A34A] uppercase">
                    TOP
                  </span>
                  <ArrowDown className="w-4 h-4 text-[#16A34A] my-0.5" />
                </div>

                {/* Stack Nodes */}
                <div className="border-2 border-[#16A34A] rounded-lg overflow-hidden divide-y divide-[#BBF7D0] bg-white">
                  {topItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`p-3 text-center transition-colors ${
                        idx === 0 ? 'bg-[#F0FDF4] font-bold text-[#16A34A]' : 'bg-white text-[#1E293B]'
                      }`}
                    >
                      <div className="font-mono text-xs">[{item.bookId}]</div>
                      <div className="text-xs font-semibold truncate">{item.bookTitle}</div>
                      <div className="text-[10px] text-[#64748B]">by {item.returnedByMemberName}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <div className="h-1.5 rounded-full bg-slate-300 w-3/4 mx-auto" />
                  <div className="text-[10px] text-slate-400 font-mono mt-1">DESK BASE</div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#64748B]">
                Stack is empty. All returned books have been shelved.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
            <span className="text-[#16A34A] font-semibold">PUSH → TOP</span>
            <span className="text-[#16A34A] font-semibold">POP → TOP</span>
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
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#16A34A] bg-[#F0FDF4] p-3 rounded-lg border border-[#BBF7D0]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
            <span>{statusMessage}</span>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#173B57] mb-2">
              Current Stack (Top to Bottom):
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] font-mono text-xs text-[#1E293B] overflow-x-auto whitespace-nowrap">
              {allStackItems.length > 0
                ? allStackItems.map(item => item.bookId).join(' → ')
                : 'Empty Return Stack'}
            </div>
          </div>
        </div>
      </ConceptSection>
    </div>
  );
};
