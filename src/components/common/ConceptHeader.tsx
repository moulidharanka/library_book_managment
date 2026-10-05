import React from 'react';

interface ConceptHeaderProps {
  label: string;
  heading: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  primaryColor: string;
  lightColor: string;
  borderColor: string;
}

export const ConceptHeader: React.FC<ConceptHeaderProps> = ({
  label,
  heading,
  description,
  timeComplexity,
  spaceComplexity,
  primaryColor,
  lightColor,
  borderColor,
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1 max-w-2xl">
        <div
          className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded font-mono"
          style={{
            backgroundColor: lightColor,
            color: primaryColor,
            border: `1px solid ${borderColor}`,
          }}
        >
          {label}
        </div>
        <h1 className="text-2xl font-bold text-[#173B57] tracking-tight">
          {heading}
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
          {description}
        </p>
      </div>

      {/* Compact Complexity Card */}
      <div
        className="p-3 rounded-lg border flex flex-col gap-1 min-w-[140px] shrink-0 text-xs font-mono"
        style={{
          backgroundColor: lightColor,
          borderColor: borderColor,
        }}
      >
        <div className="text-[10px] uppercase font-bold tracking-wider" style={{ color: primaryColor }}>
          Complexity
        </div>
        <div className="text-[#1E293B] flex items-center justify-between">
          <span className="text-[#64748B]">Time:</span>
          <span className="font-bold">{timeComplexity}</span>
        </div>
        <div className="text-[#1E293B] flex items-center justify-between">
          <span className="text-[#64748B]">Space:</span>
          <span className="font-bold">{spaceComplexity}</span>
        </div>
      </div>
    </div>
  );
};
