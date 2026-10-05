import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Reservation } from '../../types/library';
import { ConceptHeader } from '../common/ConceptHeader';
import { ConceptSection } from '../common/ConceptSection';
import {
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  UserPlus,
  UserMinus,
  Eye,
} from 'lucide-react';

export const ReservationsPage: React.FC = () => {
  const {
    books,
    members,
    getReservationQueue,
    getAllQueuesList,
    enqueueReservation,
    dequeueReservation,
  } = useLibrary();

  // Colors for Queue
  const primaryColor = '#EA580C';
  const lightColor = '#FFF7ED';
  const borderColor = '#FED7AA';

  const activeQueues = getAllQueuesList();
  const defaultBookId = activeQueues.length > 0 ? activeQueues[0].bookId : (books[0]?.id || 'LIB1008');

  const [selectedBookId, setSelectedBookId] = useState<string>(defaultBookId);
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[0]?.id || 'MEM201');
  const [statusMessage, setStatusMessage] = useState<string>('FIFO waitlist ready.');
  const [peekedReservation, setPeekedReservation] = useState<Reservation | null>(null);

  const currentBook = books.find(b => b.id === selectedBookId);
  const currentQueue = getReservationQueue(selectedBookId);
  const queueItems = currentQueue.toArray();

  const handleEnqueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !selectedMemberId) return;
    const member = members.find(m => m.id === selectedMemberId);
    enqueueReservation(selectedBookId, selectedMemberId);
    setStatusMessage(`✓ ${member?.name || 'Patron'} enqueued at the REAR of the waitlist.`);
    setPeekedReservation(null);
  };

  const handleDequeue = () => {
    const dequeued = dequeueReservation(selectedBookId);
    if (dequeued) {
      setStatusMessage(`✓ Dequeued ${dequeued.memberName} from FRONT of queue and issued book.`);
    }
    setPeekedReservation(null);
  };

  const handlePeek = () => {
    const frontItem = currentQueue.peek();
    setPeekedReservation(frontItem);
    if (frontItem) {
      setStatusMessage(`✓ Peeked FRONT patron: ${frontItem.memberName} (Next to receive book).`);
    } else {
      setStatusMessage('Queue is currently empty.');
    }
  };

  return (
    <div className="space-y-6">
      {/* CONCEPT HEADER */}
      <ConceptHeader
        label="QUEUE"
        heading="Reservations"
        description="Manage fair student waitlists using a First-In, First-Out (FIFO) queue."
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
            A Queue processes items in First-In, First-Out (FIFO) order. New elements are added at the REAR and removed from the FRONT.
          </p>

          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="font-semibold text-[#173B57] block mb-1">Library Usage:</span>
            <p className="text-[#64748B]">
              Students wait for out-of-stock books. The first person to reserve is guaranteed to receive the next returned copy, eliminating favoritism or line jumping.
            </p>
          </div>

          {/* Small visual */}
          <div className="flex items-center gap-2 text-xs font-mono font-semibold pt-1">
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#FED7AA] text-[#EA580C]">
              Enqueue at REAR
            </span>
            <ArrowRight className="w-4 h-4 text-[#EA580C]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#FED7AA] text-[#EA580C]">
              FIFO Queue
            </span>
            <ArrowRight className="w-4 h-4 text-[#EA580C]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#FED7AA] text-[#EA580C]">
              Dequeue from FRONT
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
        <form onSubmit={handleEnqueue} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Select Book Title
              </label>
              <select
                value={selectedBookId}
                onChange={e => {
                  setSelectedBookId(e.target.value);
                  setPeekedReservation(null);
                }}
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
              >
                {books.map(b => (
                  <option key={b.id} value={b.id}>
                    [{b.id}] {b.title} ({b.copiesAvailable} available)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Select Student / Patron
              </label>
              <select
                value={selectedMemberId}
                onChange={e => setSelectedMemberId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    [{m.id}] {m.name} ({m.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <button
              type="submit"
              className="h-10 px-6 rounded-lg text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#c2410c] shadow-xs transition-colors cursor-pointer"
            >
              Enqueue Student
            </button>

            <button
              type="button"
              onClick={handlePeek}
              disabled={queueItems.length === 0}
              className="h-10 px-4 rounded-lg text-xs font-semibold text-[#EA580C] bg-white border border-[#FED7AA] hover:bg-[#FFF7ED] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Peek Front</span>
            </button>

            <button
              type="button"
              onClick={handleDequeue}
              disabled={queueItems.length === 0}
              className="h-10 px-4 rounded-lg text-xs font-semibold text-white bg-[#173B57] hover:bg-[#122e44] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <UserMinus className="w-3.5 h-3.5" />
              <span>Dequeue (Serve)</span>
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
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>
              Queue for <strong>{currentBook?.title}</strong>
            </span>
            <span className="font-mono text-[#EA580C] font-semibold">
              Length: {queueItems.length}
            </span>
          </div>

          {/* Clean Horizontal Queue Layout */}
          <div className="p-5 bg-white rounded-lg border border-[#FED7AA] overflow-x-auto">
            {queueItems.length > 0 ? (
              <div className="flex items-center justify-between min-w-max py-2 gap-4">
                {/* FRONT indicator */}
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-[10px] font-mono font-bold text-[#16A34A] uppercase">
                    FRONT
                  </span>
                  <ArrowDown className="w-4 h-4 text-[#16A34A] my-0.5" />
                </div>

                {/* Queue Nodes */}
                <div className="flex items-center gap-3">
                  {queueItems.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      <div
                        className={`p-3 rounded-lg border transition-all text-center min-w-[120px] ${
                          idx === 0
                            ? 'bg-[#F0FDF4] border-[#BBF7D0] ring-2 ring-[#BBF7D0]'
                            : 'bg-white border-[#FED7AA]'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#173B57]">
                          {item.memberName}
                        </div>
                        <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                          {item.memberId}
                        </div>
                        <div className="text-[9px] font-mono px-1 py-0.2 mt-1 rounded bg-[#F8FAFC] text-slate-500 inline-block">
                          pos #{idx + 1}
                        </div>
                      </div>
                      {idx < queueItems.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-[#EA580C]" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* REAR indicator */}
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-[10px] font-mono font-bold text-[#EA580C] uppercase">
                    REAR
                  </span>
                  <ArrowDown className="w-4 h-4 text-[#EA580C] my-0.5" />
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#64748B]">
                Queue is empty. Books are checked out without waitlists.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
            <span className="text-[#16A34A] font-semibold">DEQUEUE → from FRONT</span>
            <span className="text-[#EA580C] font-semibold">ENQUEUE → at REAR</span>
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
              Current Queue Order:
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] font-mono text-xs text-[#1E293B] overflow-x-auto whitespace-nowrap">
              {queueItems.length > 0
                ? queueItems.map(q => q.memberName).join(' → ')
                : 'Empty Queue (No patrons waiting)'}
            </div>
          </div>
        </div>
      </ConceptSection>
    </div>
  );
};
