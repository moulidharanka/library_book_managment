import React from 'react';

interface ConceptSectionProps {
  stepNumber: string; // e.g. "01", "02", "03", "04"
  title: string;
  primaryColor: string;
  lightColor: string;
  borderColor: string;
  children: React.ReactNode;
  tintBackground?: boolean;
}

export const ConceptSection: React.FC<ConceptSectionProps> = ({
  stepNumber,
  title,
  primaryColor,
  lightColor,
  borderColor,
  children,
  tintBackground = false,
}) => {
  return (
    <section
      className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-4"
      style={{
        backgroundColor: tintBackground ? lightColor : '#FFFFFF',
        borderColor: tintBackground ? borderColor : '#E2E8F0',
      }}
    >
      {/* Header Layout */}
      <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center border"
            style={{
              backgroundColor: lightColor,
              color: primaryColor,
              borderColor: borderColor,
            }}
          >
            {stepNumber}
          </span>
          <h2 className="text-base font-bold text-[#173B57] tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div>{children}</div>
    </section>
  );
};
