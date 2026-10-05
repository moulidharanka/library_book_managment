import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Zap, Database } from 'lucide-react';

interface HowItWorksProps {
  title: string;
  dsaName: string;
  badge: string;
  timeComplexity: string;
  spaceComplexity: string;
  summary: string;
  details: string[];
  whyChosen: string;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  title,
  dsaName,
  badge,
  timeComplexity,
  spaceComplexity,
  summary,
  details,
  whyChosen,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E6F4F4] text-[#159A9C] flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#159A9C]">
                DSA Architecture
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded font-mono font-medium bg-[#E6F4F4] text-[#173B57] border border-[#159A9C]/30">
                {badge}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-slate-50 text-[#173B57] border border-[#E2E8F0]">
                Time: {timeComplexity}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-slate-50 text-[#64748B] border border-[#E2E8F0]">
                Space: {spaceComplexity}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#173B57] mt-1">
              {title} ({dsaName})
            </h4>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-semibold text-[#159A9C] hover:text-[#117c7e] px-2.5 py-1.5 rounded-lg bg-[#E6F4F4] transition-colors cursor-pointer shrink-0"
        >
          {expanded ? 'Hide Details' : 'Explain DSA'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <p className="text-xs text-[#64748B] mt-2.5 leading-relaxed">
        {summary}
      </p>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-[#E2E8F0] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#173B57]">
              <Zap className="w-3.5 h-3.5 text-[#159A9C]" />
              <span>Internal Mechanics</span>
            </div>
            <ul className="space-y-1 list-disc list-inside text-[#64748B] pl-1">
              {details.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#173B57]">
              <Database className="w-3.5 h-3.5 text-[#173B57]" />
              <span>Design Rationale</span>
            </div>
            <p className="text-[#64748B] leading-relaxed bg-[#F7F9FC] p-2.5 rounded-lg border border-[#E2E8F0]">
              {whyChosen}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
