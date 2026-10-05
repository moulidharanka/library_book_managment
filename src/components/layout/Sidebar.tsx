import React from 'react';
import {
  BookOpen,
  Zap,
  Users,
  Layers,
  Network,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Sparkles,
} from 'lucide-react';

export type PageId =
  | 'overview'
  | 'dashboard'
  | 'books'
  | 'linked-list'
  | 'fast-search'
  | 'hash-table'
  | 'reservations'
  | 'queue'
  | 'recently-returned'
  | 'stack'
  | 'sorted-bst'
  | 'bst'
  | 'searching'
  | 'sorting'
  | 'dsa-lab';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const isPageActive = (id: PageId) => {
    if (id === 'books' && (currentPage === 'books' || currentPage === 'linked-list')) return true;
    if (id === 'fast-search' && (currentPage === 'fast-search' || currentPage === 'hash-table')) return true;
    if (id === 'reservations' && (currentPage === 'reservations' || currentPage === 'queue')) return true;
    if (id === 'recently-returned' && (currentPage === 'recently-returned' || currentPage === 'stack')) return true;
    if (id === 'sorted-bst' && (currentPage === 'sorted-bst' || currentPage === 'bst')) return true;
    if (id === 'searching' && currentPage === 'searching') return true;
    if (id === 'sorting' && (currentPage === 'sorting' || currentPage === 'dsa-lab')) return true;
    if (id === 'overview' && (currentPage === 'overview' || currentPage === 'dashboard')) return true;
    return currentPage === id;
  };

  const navConcepts = [
    {
      id: 'books' as PageId,
      name: 'Linked List',
      sub: 'Book Storage',
      primaryColor: '#2563EB',
      lightColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'fast-search' as PageId,
      name: 'Hash Table',
      sub: 'Fast Search',
      primaryColor: '#7C3AED',
      lightColor: '#F5F3FF',
      borderColor: '#DDD6FE',
      icon: <Zap className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'reservations' as PageId,
      name: 'Queue',
      sub: 'Reservations',
      primaryColor: '#EA580C',
      lightColor: '#FFF7ED',
      borderColor: '#FED7AA',
      icon: <Users className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'recently-returned' as PageId,
      name: 'Stack',
      sub: 'Recently Returned',
      primaryColor: '#16A34A',
      lightColor: '#F0FDF4',
      borderColor: '#BBF7D0',
      icon: <Layers className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'sorted-bst' as PageId,
      name: 'BST',
      sub: 'Sorted Books',
      primaryColor: '#0891B2',
      lightColor: '#ECFEFF',
      borderColor: '#A5F3FC',
      icon: <Network className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'searching' as PageId,
      name: 'Searching',
      sub: 'Book Search',
      primaryColor: '#4F46E5',
      lightColor: '#EEF2FF',
      borderColor: '#C7D2FE',
      icon: <Search className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'sorting' as PageId,
      name: 'Sorting',
      sub: 'Book Organization',
      primaryColor: '#DB2777',
      lightColor: '#FDF2F8',
      borderColor: '#FBCFE8',
      icon: <ArrowUpDown className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col border-r border-[#E2E8F0] bg-white shadow-xs ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#BFDBFE]">
              <BookMarked className="w-5 h-5 text-[#2563EB]" />
            </div>
            {!isCollapsed && (
              <div className="leading-tight truncate">
                <h1 className="text-sm font-bold text-[#173B57] tracking-tight truncate">
                  Smart Library
                </h1>
                <p className="text-[11px] font-medium text-[#64748B] truncate">
                  DSA Learning Lab
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-[#173B57] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar width"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              DSA Concepts
            </div>
          )}

          {navConcepts.map(c => {
            const isActive = isPageActive(c.id);
            return (
              <button
                key={c.id}
                onClick={() => {
                  onSelectPage(c.id);
                  onCloseMobile();
                }}
                title={`${c.name} - ${c.sub}`}
                style={{
                  backgroundColor: isActive ? c.lightColor : 'transparent',
                  color: isActive ? c.primaryColor : '#1E293B',
                  borderLeft: isActive ? `3px solid ${c.primaryColor}` : '3px solid transparent',
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-r-lg text-xs transition-all cursor-pointer text-left hover:bg-[#F8FAFC]`}
              >
                <div style={{ color: isActive ? c.primaryColor : '#64748B' }}>
                  {c.icon}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold truncate ${isActive ? 'font-bold' : ''}`}>
                      {c.name}
                    </div>
                    <div
                      className="text-[11px] truncate"
                      style={{ color: isActive ? c.primaryColor : '#64748B', opacity: isActive ? 0.9 : 1 }}
                    >
                      {c.sub}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Educational Footnote */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          {!isCollapsed ? (
            <div className="text-center">
              <div className="text-[11px] font-semibold text-[#173B57]">
                Academic Demonstrator
              </div>
              <div className="text-[10px] text-[#64748B]">
                Hand-Crafted Data Structures
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="Pure DSA Architecture">
              <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
