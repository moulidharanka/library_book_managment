import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Book } from '../../types/library';
import { ConceptHeader } from '../common/ConceptHeader';
import { ConceptSection } from '../common/ConceptSection';
import {
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Trash2,
  Play,
  RotateCcw,
} from 'lucide-react';

interface BookManagementPageProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (book: Book) => void;
  onOpenIssueModal: (bookId: string) => void;
  onOpenReturnModal: (bookId: string) => void;
}

export const BookManagementPage: React.FC<BookManagementPageProps> = () => {
  const { books, addBook, deleteBook } = useLibrary();

  // Color constants for Linked List
  const primaryColor = '#2563EB';
  const lightColor = '#EFF6FF';
  const borderColor = '#BFDBFE';

  // Form input states
  const [newId, setNewId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newYear, setNewYear] = useState('2024');
  const [newCopies, setNewCopies] = useState('3');
  const [statusMessage, setStatusMessage] = useState<string>('Linked list loaded with sample library collection.');

  // Traversal state
  const [isTraversing, setIsTraversing] = useState(false);
  const [activeTraverseIndex, setActiveTraverseIndex] = useState<number | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const idToUse = newId.trim().toUpperCase() || `LIB${1000 + books.length + 1}`;
    const titleToUse = newTitle.trim() || 'New Library Book';
    const authorToUse = newAuthor.trim() || 'Unknown Author';

    const newBook: Book = {
      id: idToUse,
      title: titleToUse,
      author: authorToUse,
      category: 'Computer Science',
      year: parseInt(newYear, 10) || 2024,
      isbn: `978-0-${Math.floor(100000 + Math.random() * 900000)}`,
      copiesAvailable: parseInt(newCopies, 10) || 3,
      totalCopies: parseInt(newCopies, 10) || 3,
      description: 'Educational library catalog entry.',
      shelfLocation: 'CS-Stack-1',
      coverAccent: 'blue',
    };

    addBook(newBook);
    setStatusMessage(`✓ Book [${idToUse}] "${titleToUse}" added successfully to the Linked List.`);
    setNewId('');
    setNewTitle('');
    setNewAuthor('');
  };

  const handleDeleteNode = (id: string) => {
    deleteBook(id);
    setStatusMessage(`✓ Book [${id}] removed from the Linked List.`);
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const handleStartTraversal = () => {
    if (isTraversing || books.length === 0) return;
    setIsTraversing(true);
    let idx = 0;
    setActiveTraverseIndex(0);
    setSelectedNodeId(books[0]?.id || null);

    const interval = setInterval(() => {
      idx++;
      if (idx < books.length) {
        setActiveTraverseIndex(idx);
        setSelectedNodeId(books[idx].id);
      } else {
        clearInterval(interval);
        setIsTraversing(false);
        setActiveTraverseIndex(null);
      }
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* CONCEPT HEADER */}
      <ConceptHeader
        label="LINKED LIST"
        heading="Book Storage"
        description="Store and manage library books using a Singly Linked List."
        timeComplexity="O(n)"
        spaceComplexity="O(n)"
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
            A Linked List stores elements as connected nodes. Each node contains data and a pointer to the next node.
          </p>

          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="font-semibold text-[#173B57] block mb-1">Library Usage:</span>
            <p className="text-[#64748B]">
              Each node represents one book in the library. When books are registered, new nodes are dynamically allocated and appended to the chain without reallocating contiguous memory.
            </p>
          </div>

          {/* Small visual */}
          <div className="flex items-center gap-2 text-xs font-mono font-semibold pt-1">
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#BFDBFE] text-[#2563EB]">
              Book
            </span>
            <ArrowRight className="w-4 h-4 text-[#2563EB]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#BFDBFE] text-[#2563EB]">
              Node
            </span>
            <ArrowRight className="w-4 h-4 text-[#2563EB]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#BFDBFE] text-[#2563EB]">
              Next Node
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
        <form onSubmit={handleAddBook} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Book ID
              </label>
              <input
                type="text"
                value={newId}
                onChange={e => setNewId(e.target.value)}
                placeholder="LIB101"
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Book Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Data Structures"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Author
              </label>
              <input
                type="text"
                value={newAuthor}
                onChange={e => setNewAuthor(e.target.value)}
                placeholder="Mark Allen"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="h-10 px-6 rounded-lg text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1d4ed8] shadow-xs transition-colors cursor-pointer"
            >
              Add Book
            </button>

            <button
              type="button"
              onClick={handleStartTraversal}
              disabled={isTraversing || books.length === 0}
              className="h-10 px-4 rounded-lg text-xs font-semibold text-[#2563EB] bg-white border border-[#BFDBFE] hover:bg-[#EFF6FF] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isTraversing ? 'Traversing Node by Node...' : 'Traverse Pointer Chain'}</span>
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
          <p className="text-xs text-[#64748B]">
            Pointers link each node sequentially. Traversing follows <code className="font-mono text-[#2563EB]">node.next</code> until the pointer equals NULL.
          </p>

          {/* Desktop Horizontal / Mobile Vertical Diagram */}
          <div className="overflow-x-auto p-4 bg-white rounded-lg border border-[#BFDBFE]">
            {/* Desktop Horizontal */}
            <div className="hidden sm:flex items-center gap-3 min-w-max py-2">
              <div className="px-3 py-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] font-mono text-xs font-bold text-[#2563EB]">
                HEAD
              </div>
              <ArrowRight className="w-4 h-4 text-[#2563EB]" />

              {books.slice(0, 7).map((b, idx) => {
                const isTraversed = activeTraverseIndex === idx;
                const isSelected = selectedNodeId === b.id;
                return (
                  <React.Fragment key={b.id}>
                    <div
                      onClick={() => setSelectedNodeId(b.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer min-w-[130px] ${
                        isTraversed
                          ? 'bg-[#EFF6FF] border-[#2563EB] ring-2 ring-[#2563EB]/30'
                          : isSelected
                          ? 'bg-[#EFF6FF] border-[#2563EB]'
                          : 'bg-white border-[#BFDBFE] hover:border-[#2563EB]'
                      }`}
                    >
                      <div className="font-mono text-xs font-bold text-[#2563EB]">{b.id}</div>
                      <div className="text-xs font-semibold text-[#1E293B] truncate max-w-[120px]">
                        {b.title}
                      </div>
                      <div className="text-[10px] font-mono text-[#64748B] mt-1">next →</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#2563EB]" />
                  </React.Fragment>
                );
              })}

              <div className="px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#64748B]">
                {books.length > 7 ? `... (${books.length - 7} more) → NULL` : 'NULL'}
              </div>
            </div>

            {/* Mobile Vertical */}
            <div className="flex sm:hidden flex-col items-center gap-2 py-2">
              <div className="px-4 py-1.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] font-mono text-xs font-bold text-[#2563EB]">
                HEAD
              </div>
              <ArrowDown className="w-4 h-4 text-[#2563EB]" />

              {books.slice(0, 5).map(b => (
                <React.Fragment key={b.id}>
                  <div className="w-full p-2.5 rounded-lg bg-white border border-[#BFDBFE] text-center">
                    <div className="font-mono text-xs font-bold text-[#2563EB]">[{b.id}]</div>
                    <div className="text-xs font-semibold text-[#1E293B] truncate">{b.title}</div>
                    <div className="text-[10px] font-mono text-[#64748B]">next →</div>
                  </div>
                  <ArrowDown className="w-4 h-4 text-[#2563EB]" />
                </React.Fragment>
              ))}

              <div className="px-4 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#64748B]">
                NULL
              </div>
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
          {/* Simple status alert with small success icon */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#16A34A] bg-[#F0FDF4] p-3 rounded-lg border border-[#BBF7D0]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
            <span>{statusMessage}</span>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#173B57] mb-2">
              Current List ({books.length} Nodes):
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] font-mono text-xs text-[#1E293B] overflow-x-auto whitespace-nowrap">
              {books.map(b => b.id).join(' → ')} → NULL
            </div>
          </div>

          {/* Quick deletion affordance on current nodes */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#64748B]">Remove node:</span>
            {books.slice(0, 6).map(b => (
              <button
                key={b.id}
                onClick={() => handleDeleteNode(b.id)}
                className="px-2 py-0.5 rounded border border-[#E2E8F0] bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors font-mono cursor-pointer flex items-center gap-1"
                title={`Delete ${b.id}`}
              >
                <span>{b.id}</span>
                <Trash2 className="w-2.5 h-2.5 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      </ConceptSection>
    </div>
  );
};
