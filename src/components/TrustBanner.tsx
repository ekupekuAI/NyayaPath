import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs sm:text-sm px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Independent Citizen Prototype:</strong> 100% Synthetic Demo Data. Not an official government service. No legal advice provided.
          </span>
        </div>
      </div>
    </div>
  );
};
