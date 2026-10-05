import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { BookOpen, RotateCcw, X, AlertTriangle, Users, CheckCircle2 } from 'lucide-react';

interface IssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedBookId?: string;
}

export const IssueModal: React.FC<IssueModalProps> = ({
  isOpen,
  onClose,
  preselectedBookId,
}) => {
  const { books, members, issueBook, getReservationQueue } = useLibrary();
  const [selectedBookId, setSelectedBookId] = useState<string>(preselectedBookId || (books[0]?.id || ''));
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || '');

  React.useEffect(() => {
    if (preselectedBookId) {
      setSelectedBookId(preselectedBookId);
    } else if (books.length > 0 && !selectedBookId) {
      setSelectedBookId(books[0].id);
    }
  }, [preselectedBookId, books, selectedBookId]);

  if (!isOpen) return null;

  const currentBook = books.find(b => b.id === selectedBookId);
  const queue = currentBook ? getReservationQueue(currentBook.id) : null;
  const isOutOfStock = currentBook ? currentBook.copiesAvailable === 0 : false;

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !selectedMemberId) return;
    issueBook(selectedBookId, selectedMemberId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-xl max-w-lg w-full p-6 shadow-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[#E6F4F4] text-[#159A9C] flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#173B57]">Issue Book / Reservation</h3>
            <p className="text-xs text-[#64748B]">
              Direct O(1) Hash Table checkout or FIFO Queue waitlist
            </p>
          </div>
        </div>

        <form onSubmit={handleIssue} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
              Select Book Title
            </label>
            <select
              value={selectedBookId}
              onChange={e => setSelectedBookId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-medium focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none"
            >
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  [{b.id}] {b.title} — ({b.copiesAvailable}/{b.totalCopies} available)
                </option>
              ))}
            </select>
          </div>

          {currentBook && (
            <div className={`p-3 rounded-lg border text-xs ${
              isOutOfStock
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-[#E6F4F4] border-[#159A9C]/30 text-[#173B57]'
            }`}>
              <div className="flex items-center gap-2 font-semibold">
                {isOutOfStock ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>0 Copies Available — Patron Will Join FIFO Waitlist</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#159A9C] shrink-0" />
                    <span>In Stock: {currentBook.copiesAvailable} copies available for direct checkout</span>
                  </>
                )}
              </div>
              <p className="mt-1 opacity-90 leading-relaxed text-[11px]">
                {isOutOfStock
                  ? `There are currently ${queue?.size || 0} student(s) waiting. Submitting will enqueue patron at the rear (Queue.enqueue O(1)).`
                  : `Shelf Location: ${currentBook.shelfLocation}. Submitting will decrement copies and update Hash Table, Linked List, and BST.`}
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
              Select Member (Patron)
            </label>
            <select
              value={selectedMemberId}
              onChange={e => setSelectedMemberId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-medium focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  [{m.id}] {m.name} ({m.role}, {m.department}) — {m.activeLoansCount} active loans
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#173B57] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-xs font-semibold text-white rounded-lg shadow-xs transition-colors cursor-pointer ${
                isOutOfStock
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-[#159A9C] hover:bg-[#117c7e]'
              }`}
            >
              {isOutOfStock ? 'Join Reservation Queue (FIFO)' : 'Issue Book (O(1))'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedBookId?: string;
}

export const ReturnModal: React.FC<ReturnModalProps> = ({
  isOpen,
  onClose,
  preselectedBookId,
}) => {
  const { books, members, returnBook, getReservationQueue } = useLibrary();
  const [selectedBookId, setSelectedBookId] = useState<string>(preselectedBookId || (books[0]?.id || ''));
  const [memberName, setMemberName] = useState<string>(members[0]?.name || 'Elena Rostova');
  const [condition, setCondition] = useState<'Mint' | 'Good' | 'Fair'>('Good');

  React.useEffect(() => {
    if (preselectedBookId) {
      setSelectedBookId(preselectedBookId);
    } else if (books.length > 0 && !selectedBookId) {
      setSelectedBookId(books[0].id);
    }
  }, [preselectedBookId, books, selectedBookId]);

  if (!isOpen) return null;

  const currentBook = books.find(b => b.id === selectedBookId);
  const queue = currentBook ? getReservationQueue(currentBook.id) : null;
  const hasWaitlist = queue ? queue.size > 0 : false;
  const nextInLine = queue?.peek();

  const handleReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !memberName) return;
    returnBook(selectedBookId, memberName, condition);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-xl max-w-lg w-full p-6 shadow-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[#E6F4F4] text-[#159A9C] flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#173B57]">Process Book Return</h3>
            <p className="text-xs text-[#64748B]">
              Pushes onto LIFO Return Stack & triggers auto-issue if waitlist exists
            </p>
          </div>
        </div>

        <form onSubmit={handleReturn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
              Select Book to Return
            </label>
            <select
              value={selectedBookId}
              onChange={e => setSelectedBookId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-medium focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none"
            >
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  [{b.id}] {b.title} — (Stock: {b.copiesAvailable}/{b.totalCopies})
                </option>
              ))}
            </select>
          </div>

          {hasWaitlist && nextInLine && (
            <div className="p-3 rounded-lg border border-[#159A9C]/30 bg-[#E6F4F4] text-[#173B57] text-xs">
              <div className="flex items-center gap-2 font-semibold">
                <Users className="w-4 h-4 text-[#159A9C] shrink-0" />
                <span>Auto-Issue Trigger: {queue?.size} Student(s) in Waiting Queue</span>
              </div>
              <p className="mt-1 leading-relaxed text-[11px]">
                Returning this book will push to the Return Stack, immediately dequeue front student{' '}
                <strong>{nextInLine.memberName}</strong>, and auto-issue this copy to them!
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
              Returning Member / Patron Name
            </label>
            <input
              type="text"
              value={memberName}
              onChange={e => setMemberName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-medium focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
              Book Condition Assessment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mint', 'Good', 'Fair'] as const).map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCondition(c)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    condition === c
                      ? 'border-[#159A9C] bg-[#E6F4F4] text-[#159A9C]'
                      : 'border-[#E2E8F0] bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#173B57] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#173B57] hover:bg-[#122e44] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Push to Return Stack (LIFO O(1))
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
