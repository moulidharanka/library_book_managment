/**
 * Smart Library Management System
 * Educational College DSA Demonstrator (Explanation → Input → Mechanics → Output)
 * Hand-crafted Data Structure Engine (Linked List, Hash Table, Queue, Stack, BST, Custom Sorting & Searching)
 */

import React, { useState } from 'react';
import { LibraryProvider } from './context/LibraryContext';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { IssueModal, ReturnModal } from './components/common/IssueReturnModals';
import { AddEditBookModal } from './components/common/AddEditBookModal';
import { BookManagementPage } from './components/pages/BookManagementPage';
import { FastSearchPage } from './components/pages/FastSearchPage';
import { ReservationsPage } from './components/pages/ReservationsPage';
import { RecentlyReturnedPage } from './components/pages/RecentlyReturnedPage';
import { SortedBooksBstPage } from './components/pages/SortedBooksBstPage';
import { SearchingPage } from './components/pages/SearchingPage';
import { SortingPage } from './components/pages/SortingPage';
import { Book } from './types/library';

function LibraryApp() {
  const [currentPage, setCurrentPage] = useState<PageId>('books');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedBookForAction, setSelectedBookForAction] = useState<string | undefined>(undefined);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  // Modal openers
  const handleOpenIssue = (bookId?: string) => {
    setSelectedBookForAction(bookId);
    setIsIssueModalOpen(true);
  };

  const handleOpenReturn = (bookId?: string) => {
    setSelectedBookForAction(bookId);
    setIsReturnModalOpen(true);
  };

  const handleOpenAddBook = () => {
    setBookToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditBook = (book: Book) => {
    setBookToEdit(book);
    setIsAddEditModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#1E293B]">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentPage={currentPage}
          onSelectPage={setCurrentPage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAddBookModal={handleOpenAddBook}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {(currentPage === 'books' || currentPage === 'linked-list' || currentPage === 'overview' || currentPage === 'dashboard') && (
            <BookManagementPage
              onOpenAddModal={handleOpenAddBook}
              onOpenEditModal={handleOpenEditBook}
              onOpenIssueModal={handleOpenIssue}
              onOpenReturnModal={handleOpenReturn}
            />
          )}

          {(currentPage === 'fast-search' || currentPage === 'hash-table') && (
            <FastSearchPage
              onOpenIssueModal={handleOpenIssue}
              onOpenReturnModal={handleOpenReturn}
            />
          )}

          {(currentPage === 'reservations' || currentPage === 'queue') && (
            <ReservationsPage />
          )}

          {(currentPage === 'recently-returned' || currentPage === 'stack') && (
            <RecentlyReturnedPage onOpenReturnModal={() => handleOpenReturn()} />
          )}

          {(currentPage === 'sorted-bst' || currentPage === 'bst') && (
            <SortedBooksBstPage
              onOpenIssueModal={handleOpenIssue}
              onOpenAddModal={handleOpenAddBook}
            />
          )}

          {currentPage === 'searching' && <SearchingPage />}

          {(currentPage === 'sorting' || currentPage === 'dsa-lab') && (
            <SortingPage />
          )}
        </main>
      </div>

      {/* Modals */}
      <IssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        preselectedBookId={selectedBookForAction}
      />

      <ReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        preselectedBookId={selectedBookForAction}
      />

      <AddEditBookModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setBookToEdit(null);
        }}
        bookToEdit={bookToEdit}
      />

      {/* Floating Alerts */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <LibraryProvider>
      <LibraryApp />
    </LibraryProvider>
  );
}
