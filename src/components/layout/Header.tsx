import React from 'react';
import { PageId } from './Sidebar';
import { Menu, Plus } from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  onOpenMobileMenu: () => void;
  onOpenAddBookModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenAddBookModal,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#E2E8F0] bg-white px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Minimal Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-[#173B57]" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base font-bold text-[#173B57] tracking-tight truncate leading-tight">
            Smart Library
          </h1>
          <p className="text-xs text-[#64748B] font-medium truncate">
            DSA Book Management System
          </p>
        </div>
      </div>

      {/* Right: Only [ + Add Book ] */}
      <div className="flex items-center shrink-0">
        <button
          onClick={onOpenAddBookModal}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1d4ed8] rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Book</span>
        </button>
      </div>
    </header>
  );
};
