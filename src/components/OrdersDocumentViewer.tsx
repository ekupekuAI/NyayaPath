import React, { useState } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  Sparkles, 
  Download, 
  Printer, 
  Scale, 
  ChevronRight, 
  Eye, 
  Clock, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Order, Case, AIExplanation, LanguageCode } from '../types';
import { MULTILINGUAL_TRANSLATIONS } from '../data/mockDatabase';

interface OrdersDocumentViewerProps {
  orders: Order[];
  caseData: Case;
  selectedOrder?: Order;
  onSelectOrder: (order: Order) => void;
  onBack: () => void;
  onExplainOrder: (order: Order) => void;
  language: LanguageCode;
}

export const OrdersDocumentViewer: React.FC<OrdersDocumentViewerProps> = ({
  orders,
  caseData,
  selectedOrder,
  onSelectOrder,
  onBack,
  onExplainOrder,
  language
}) => {
  const [activeOrder, setActiveOrder] = useState<Order>(selectedOrder || orders[0]);
  const [isExplaining, setIsExplaining] = useState(false);
  const [orderExplanation, setOrderExplanation] = useState<AIExplanation | null>(null);

  const handleExplain = (order: Order) => {
    setIsExplaining(true);
    // Instant safe explain for order
    setTimeout(() => {
      setOrderExplanation({
        id: `exp-order-${order.id}`,
        eventId: order.id,
        summary: `Court order directing written submissions and setting the next date on 14 September 2026.`,
        what_happened: `The judge heard plaintiff arguments and agreed to give the respondent 2 weeks to file written points.`,
        what_it_means: `Both sides must complete their written arguments before the next hearing date.`,
        what_happens_next: `Final oral arguments will be concluded on 14 September 2026.`,
        action_required: `Ensure your advocate receives and reviews the advance copy of the respondent's written submissions before 08 September.`,
        important_date: `08 September 2026 (Written submission deadline) / 14 September 2026 (Final hearing)`,
        confidence_note: `Grounded directly in text of ${order.title}`,
        disclaimer: 'This is a plain-language explanation of the supplied case information, not legal advice.'
      });
      setIsExplaining(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="back-from-orders-btn"
            onClick={onBack}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Court Orders & Judgments
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {caseData.caseNumber} • {orders.length} Synthetic Order Sheets on Record
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full text-xs font-semibold">
            100% Synthetic Case Records
          </span>
        </div>
      </div>

      {/* Orders Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Order List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Available Order Sheets
          </h3>
          {orders.map((order) => {
            const isSelected = activeOrder?.id === order.id;
            return (
              <div
                key={order.id}
                onClick={() => {
                  setActiveOrder(order);
                  setOrderExplanation(null);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 shadow-sm ring-1 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                    {order.orderDate}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {order.orderType}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-2">
                  {order.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>{order.totalPages} page(s)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-0.5">
                    View Sheet <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Order Document Viewer + AI Explanation (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Action Bar for Selected Order */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {activeOrder.title}
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Dated: {activeOrder.orderDate} • {activeOrder.judgeName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="explain-order-btn"
                onClick={() => handleExplain(activeOrder)}
                disabled={isExplaining}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isExplaining ? 'animate-spin' : ''}`} />
                <span>{isExplaining ? 'Analyzing...' : 'Explain This Order'}</span>
              </button>
            </div>
          </div>

          {/* AI Explanation Accordion (if requested) */}
          {orderExplanation && (
            <div className="p-6 bg-gradient-to-br from-indigo-50/90 via-white to-emerald-50/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-emerald-950/20 rounded-3xl border-2 border-indigo-300 dark:border-indigo-700/80 shadow-md space-y-4">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Citizen Explanation for Order dated {activeOrder.orderDate}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-indigo-100 dark:border-indigo-900/40 space-y-1">
                  <strong className="text-indigo-900 dark:text-indigo-300 font-bold block">What Happened?</strong>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{orderExplanation.what_happened}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                  <strong className="text-emerald-900 dark:text-emerald-300 font-bold block">What It Means?</strong>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{orderExplanation.what_it_means}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-blue-100 dark:border-blue-900/40 space-y-1">
                  <strong className="text-blue-900 dark:text-blue-300 font-bold block">What Happens Next?</strong>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{orderExplanation.what_happens_next}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 space-y-1">
                  <strong className="text-amber-900 dark:text-amber-300 font-bold block">Action Required?</strong>
                  <p className="text-slate-900 dark:text-amber-100 leading-relaxed font-semibold">{orderExplanation.action_required}</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
                <span>{orderExplanation.disclaimer}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Strictly Grounded</span>
              </div>
            </div>
          )}

          {/* Authentic Synthetic Court Order Paper View */}
          <div className="bg-[#fcfaf5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-3xl border border-amber-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-sm font-serif relative">
            <div className="text-center space-y-2 border-b-2 border-slate-900 dark:border-slate-700 pb-6 mb-6">
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-sans font-bold text-slate-600 dark:text-slate-400">
                <Scale className="w-4 h-4" />
                <span>Synthetic Court Record • For Demonstration Only</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide">
                IN THE COURT OF THE PRINCIPAL DISTRICT & SESSIONS JUDGE, HYDERABAD
              </h3>
              <p className="text-xs font-mono font-sans text-slate-600 dark:text-slate-400">
                CNR: {caseData.cnr} | {caseData.caseNumber}
              </p>
            </div>

            <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed font-mono font-normal">
              {activeOrder.officialText}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-800 flex justify-between items-center text-xs font-sans text-slate-500 dark:text-slate-400">
              <span>Digital Order Sheet Copy (Verified Mock)</span>
              <span>Page 1 of {activeOrder.totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
