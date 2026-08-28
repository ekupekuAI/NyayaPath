import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  return (
    <div className="bg-blue-50 border-b border-blue-100 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 text-xs sm:text-sm px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <ShieldAlert className="w-4 h-4 text-blue-800 dark:text-blue-300 shrink-0" />
          <span>
            <strong>Independent Citizen Prototype:</strong> 100% Synthetic Demo Data. Not an official government service. No legal advice provided.
          </span>
        </div>
      </div>
    </div>
  );
};
