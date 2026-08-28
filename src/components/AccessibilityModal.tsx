import React from 'react';
import { 
  X, 
  Eye, 
  Type, 
  Volume2, 
  Globe, 
  ShieldAlert, 
  Check, 
  Sun, 
  Moon, 
  Layers 
} from 'lucide-react';
import { AccessibilitySettings, LanguageCode } from '../types';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  const languages: { code: LanguageCode; label: string; script: string }[] = [
    { code: 'en', label: 'English', script: 'Plain Indian English' },
    { code: 'hi', label: 'हिन्दी', script: 'Hindi' },
    { code: 'te', label: 'తెలుగు', script: 'Telugu' },
    { code: 'ta', label: 'தமிழ்', script: 'Tamil' },
    { code: 'mr', label: 'मराठी', script: 'Marathi' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Accessibility & Language Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailor your reading, contrast, and audio experience.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 1. Language Selection */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>Language / भाषा</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {languages.map((lang) => {
                const isSelected = settings.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => onUpdateSettings({ language: lang.code })}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-200 font-bold ring-1 ring-indigo-500'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-sm">{lang.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{lang.script}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Font Size Scaling */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <Type className="w-4 h-4 text-indigo-500" />
              <span>Text Size</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'xlarge'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ fontSize: size })}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    settings.fontSize === size
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {size === 'normal' ? 'Normal (100%)' : size === 'large' ? 'Large (120%)' : 'Extra Large (140%)'}
                </button>
              ))}
            </div>
          </div>

          {/* 3. High Contrast Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                High Contrast / Pure Dark Mode
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Enhances text contrast and sharpens visual boundaries for low-vision users.
              </p>
            </div>

            <button
              onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                settings.highContrast ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 4. Simplified Plain Language Mode */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Ultra-Simple Language Mode
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Removes all secondary procedural legal terms for maximum simplicity.
              </p>
            </div>

            <button
              onClick={() => onUpdateSettings({ simplifiedLanguage: !settings.simplifiedLanguage })}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                settings.simplifiedLanguage ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.simplifiedLanguage ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-900 dark:text-amber-200 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Accessibility & Legal Disclaimer</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              NyayaPath provides purely factual, plain-language interpretations of supplied court record entries. It is not legal counsel, advice, or representation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
