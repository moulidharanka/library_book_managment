import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { Book } from '../../types/library';
import { ConceptHeader } from '../common/ConceptHeader';
import { ConceptSection } from '../common/ConceptSection';
import {
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  Search,
  Play,
} from 'lucide-react';

interface SortedBooksBstPageProps {
  onOpenIssueModal: (bookId: string) => void;
  onOpenAddModal: () => void;
}

export const SortedBooksBstPage: React.FC<SortedBooksBstPageProps> = () => {
  const { bst, books } = useLibrary();

  // Colors for BST
  const primaryColor = '#0891B2';
  const lightColor = '#ECFEFF';
  const borderColor = '#A5F3FC';

  const [searchTarget, setSearchTarget] = useState('LIB1008');
  const [highlightedKeys, setHighlightedKeys] = useState<string[]>([]);
  const [matchedKey, setMatchedKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('BST sorted catalog active.');
  const [traversalResult, setTraversalResult] = useState<Book[]>(() => bst.inOrderTraversal());

  // SVG layout generator
  const canvasWidth = 860;
  const canvasHeight = 360;
  const layout = bst.getVisualLayout(canvasWidth, canvasHeight);

  const handleSearchBST = (targetKey: string) => {
    const cleanKey = targetKey.trim().toUpperCase();
    setSearchTarget(cleanKey);
    const searchRes = bst.search(cleanKey);

    const visitedKeys: string[] = [];
    for (let i = 0; i < searchRes.path.length; i++) {
      if (searchRes.path[i].key !== 'TREE_EMPTY' && searchRes.path[i].key !== 'NULL') {
        visitedKeys.push(searchRes.path[i].key);
      }
    }

    setHighlightedKeys(visitedKeys);
    setMatchedKey(searchRes.found ? cleanKey : null);
    if (searchRes.found) {
      setStatusMessage(`✓ Key [${cleanKey}] found in ${searchRes.comparisons} comparison(s). Path: ${visitedKeys.join(' → ')}.`);
    } else {
      setStatusMessage(`Key [${cleanKey}] was not found in the BST.`);
    }
  };

  const handleRunInOrder = () => {
    const res = bst.inOrderTraversal();
    setTraversalResult(res);
    setStatusMessage(`✓ In-order traversal completed (${res.length} books in sorted order).`);
    setHighlightedKeys([]);
    setMatchedKey(null);
  };

  return (
    <div className="space-y-6">
      {/* CONCEPT HEADER */}
      <ConceptHeader
        label="BST"
        heading="Sorted Books"
        description="Maintain catalog records in sorted order using a Binary Search Tree."
        timeComplexity="O(log n)"
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
            A Binary Search Tree organizes keys hierarchically. For every node, left child keys are smaller and right child keys are larger.
          </p>

          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="font-semibold text-[#173B57] block mb-1">Library Usage:</span>
            <p className="text-[#64748B]">
              In-order traversal (Left → Root → Right) naturally outputs the entire catalog in sorted alphanumeric order in O(n) time without extra sorting steps.
            </p>
          </div>

          {/* Small visual */}
          <div className="flex items-center gap-2 text-xs font-mono font-semibold pt-1">
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#A5F3FC] text-[#0891B2]">
              Left Child (&lt; Key)
            </span>
            <ArrowRight className="w-4 h-4 text-[#0891B2]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#A5F3FC] text-[#0891B2]">
              Root Node
            </span>
            <ArrowRight className="w-4 h-4 text-[#0891B2]" />
            <span className="px-3 py-1.5 rounded-md bg-white border border-[#A5F3FC] text-[#0891B2]">
              Right Child (&gt; Key)
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#173B57] mb-1.5">
                Search Book ID in Tree
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchTarget}
                  onChange={e => setSearchTarget(e.target.value)}
                  placeholder="LIB1008"
                  className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B] focus:outline-none focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2]"
                />
                <button
                  onClick={() => handleSearchBST(searchTarget)}
                  className="h-10 px-5 rounded-lg text-xs font-semibold text-white bg-[#0891B2] hover:bg-[#0e7490] shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Search Tree
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleRunInOrder}
                className="h-10 px-5 rounded-lg text-xs font-semibold text-[#0891B2] bg-white border border-[#A5F3FC] hover:bg-[#ECFEFF] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run In-Order Traversal (Sorted)</span>
              </button>
            </div>
          </div>

          {/* Quick Select IDs */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
            <span className="text-[#64748B]">Quick Pick Node:</span>
            {['LIB1008', 'LIB1001', 'LIB1003', 'LIB1015', 'LIB1019', 'LIB1020'].map(id => (
              <button
                key={id}
                type="button"
                onClick={() => handleSearchBST(id)}
                className={`px-2 py-0.5 rounded border transition-colors font-mono cursor-pointer ${
                  searchTarget === id
                    ? 'bg-[#ECFEFF] text-[#0891B2] border-[#A5F3FC] font-bold'
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
          <div className="text-xs text-[#64748B] flex items-center justify-between">
            <span>Binary Search Tree Hierarchy</span>
            <span className="font-mono text-[#0891B2] font-semibold">
              Total Nodes: {bst.size} · Depth: {bst.getHeight()}
            </span>
          </div>

          {/* Clean Tree SVG */}
          <div className="p-4 bg-white rounded-lg border border-[#A5F3FC] overflow-x-auto">
            {layout.nodes.length > 0 ? (
              <svg
                viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                className="w-full min-w-[700px] h-[320px]"
              >
                {/* Edges */}
                {layout.edges.map((edge, i) => {
                  const isPathEdge =
                    highlightedKeys.includes(edge.fromKey) && highlightedKeys.includes(edge.toKey);
                  return (
                    <line
                      key={i}
                      x1={edge.x1}
                      y1={edge.y1}
                      x2={edge.x2}
                      y2={edge.y2}
                      stroke={isPathEdge ? '#0891B2' : '#E2E8F0'}
                      strokeWidth={isPathEdge ? 2.5 : 1.5}
                    />
                  );
                })}

                {/* Nodes */}
                {layout.nodes.map(node => {
                  const isMatch = matchedKey === node.key;
                  const isVisited = highlightedKeys.includes(node.key);

                  return (
                    <g
                      key={node.key}
                      transform={`translate(${node.x}, ${node.y})`}
                      className="cursor-pointer"
                      onClick={() => handleSearchBST(node.key)}
                    >
                      <circle
                        r={16}
                        fill={isMatch ? '#0891B2' : isVisited ? '#ECFEFF' : '#FFFFFF'}
                        stroke={isMatch ? '#0891B2' : isVisited ? '#0891B2' : '#CBD5E1'}
                        strokeWidth={isMatch || isVisited ? 2 : 1.5}
                      />
                      <text
                        textAnchor="middle"
                        dy="3.5"
                        className="font-mono font-bold text-[9px]"
                        fill={isMatch ? '#FFFFFF' : '#173B57'}
                      >
                        {node.key.replace('LIB', '')}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div className="py-8 text-center text-xs text-[#64748B]">Tree is empty.</div>
            )}
          </div>

          <div className="text-[11px] text-[#64748B] flex items-center justify-between">
            <span>Numbers on nodes show Book ID suffix</span>
            <span className="text-[#0891B2] font-semibold">Teal circle shows search path</span>
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
              In-Order Traversal List ({traversalResult.length} Books in Alphanumeric Order):
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] font-mono text-xs text-[#1E293B] overflow-x-auto whitespace-nowrap">
              {traversalResult.map(b => b.id).join(' → ')}
            </div>
          </div>
        </div>
      </ConceptSection>
    </div>
  );
};
