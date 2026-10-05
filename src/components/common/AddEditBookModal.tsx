import React, { useState, useEffect } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Book } from '../../types/library';
import { PlusCircle, Edit3, X, BookOpen } from 'lucide-react';

interface AddEditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookToEdit?: Book | null;
}

const CATEGORIES: Book['category'][] = [
  'Computer Science',
  'Mathematics',
  'Literature',
  'Physics',
  'Philosophy',
  'Engineering',
  'Economics',
];

export const AddEditBookModal: React.FC<AddEditBookModalProps> = ({
  isOpen,
  onClose,
  bookToEdit,
}) => {
  const { books, addBook, updateBook } = useLibrary();

  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<Book['category']>('Computer Science');
  const [year, setYear] = useState<number>(2024);
  const [isbn, setIsbn] = useState('');
  const [copiesAvailable, setCopiesAvailable] = useState<number>(2);
  const [totalCopies, setTotalCopies] = useState<number>(2);
  const [shelfLocation, setShelfLocation] = useState('Stack A-01');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookToEdit) {
      setId(bookToEdit.id);
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setCategory(bookToEdit.category);
      setYear(bookToEdit.year);
      setIsbn(bookToEdit.isbn);
      setCopiesAvailable(bookToEdit.copiesAvailable);
      setTotalCopies(bookToEdit.totalCopies);
      setShelfLocation(bookToEdit.shelfLocation);
      setDescription(bookToEdit.description);
      setError('');
    } else {
      const maxNum = books.reduce((max, b) => {
        const num = parseInt(b.id.replace(/\D/g, ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 1020);
      setId(`LIB${maxNum + 1}`);
      setTitle('');
      setAuthor('');
      setCategory('Computer Science');
      setYear(new Date().getFullYear());
      setIsbn(`978-0${Math.floor(100000000 + Math.random() * 900000000)}`);
      setCopiesAvailable(3);
      setTotalCopies(3);
      setShelfLocation(`Stack A-${Math.floor(10 + Math.random() * 20)}`);
      setDescription('');
      setError('');
    }
  }, [bookToEdit, isOpen, books]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = id.trim().toUpperCase();

    if (!cleanId || !title.trim() || !author.trim()) {
      setError('Please fill out all required fields.');
      return;
    }

    if (!bookToEdit) {
      const exists = books.some(b => b.id.toUpperCase() === cleanId);
      if (exists) {
        setError(`A book with ID "${cleanId}" already exists. Please choose a unique ID.`);
        return;
      }
    }

    const bookData: Book = {
      id: cleanId,
      title: title.trim(),
      author: author.trim(),
      category,
      year: Number(year) || 2024,
      isbn: isbn.trim() || '978-0000000000',
      copiesAvailable: Number(copiesAvailable),
      totalCopies: Math.max(Number(totalCopies), Number(copiesAvailable)),
      shelfLocation: shelfLocation.trim() || 'Stack Gen-01',
      description: description.trim() || 'No description provided.',
      coverAccent: 'from-blue-600 to-indigo-900',
    };

    if (bookToEdit) {
      updateBook(bookData);
    } else {
      addBook(bookData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white border border-[#E2E8F0] rounded-xl max-w-xl w-full p-6 shadow-md relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-[#E6F4F4] text-[#159A9C] flex items-center justify-center">
            {bookToEdit ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-[#173B57]">
              {bookToEdit ? 'Edit Book Record' : 'Add New Book to Collection'}
            </h3>
            <p className="text-xs text-[#64748B]">
              Auto-syncs across Singly Linked List, Hash Table, and BST
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1">
                Book ID *
              </label>
              <input
                type="text"
                value={id}
                onChange={e => setId(e.target.value)}
                disabled={!!bookToEdit}
                placeholder="e.g. LIB1021"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-mono font-bold focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none disabled:opacity-60"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#173B57] mb-1">
                ISBN
              </label>
              <input
                type="text"
                value={isbn}
                onChange={e => setIsbn(e.target.value)}
                placeholder="978-0..."
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-mono focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#173B57] mb-1">
              Book Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Concrete Mathematics"
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-medium focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1">
                Author(s) *
              </label>
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="e.g. Donald Knuth"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-medium focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Book['category'])}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-medium focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1">
                Pub. Year
              </label>
              <input
                type="number"
                value={year}
                onChange={e => setYear(Number(e.target.value))}
                min="1800"
                max="2030"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-medium focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1">
                Available Copies
              </label>
              <input
                type="number"
                value={copiesAvailable}
                onChange={e => setCopiesAvailable(Number(e.target.value))}
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-medium focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1">
                Total Copies
              </label>
              <input
                type="number"
                value={totalCopies}
                onChange={e => setTotalCopies(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-medium focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#173B57] mb-1">
              Shelf Location
            </label>
            <input
              type="text"
              value={shelfLocation}
              onChange={e => setShelfLocation(e.target.value)}
              placeholder="e.g. Stack A-14"
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-medium focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#173B57] mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief summary of the book..."
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F7F9FC] text-[#263238] text-xs font-medium focus:ring-2 focus:ring-[#159A9C]/40 focus:border-[#159A9C] focus:outline-none resize-none"
            />
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
              className="px-4 py-2 text-xs font-semibold text-white bg-[#173B57] hover:bg-[#122e44] rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>{bookToEdit ? 'Save Changes' : 'Insert into Collection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
