import React from 'react';
import { ShieldCheck, Zap, Globe, Layers, Lock } from 'lucide-react';

interface CheckoutOverviewProps {
  isDark?: boolean;
}

export const CheckoutOverview: React.FC<CheckoutOverviewProps> = ({ isDark = false }) => {
  const steps = [
    {
      step: '01',
      title: 'Merchant Host Surface',
      description: 'Host page initiates checkout via DodoCheckout.open() with zero payment card data touching host DOM or servers.',
      tech: 'Zero Host Access',
      icon: Layers,
    },
    {
      step: '02',
      title: 'Cryptographic Iframe Bus',
      description: 'Isolated cross-origin sandbox establishes bidirectional postMessage handshake with strict origin whitelisting.',
      tech: 'sub-10ms Handshake',
      icon: Lock,
    },
    {
      step: '03',
      title: 'Automated Tax Remittance',
      description: 'Dynamic IP & postal geo-location calculates US Sales Tax, EU VAT, UK VAT, and GST in real time.',
      tech: '220+ Jurisdictions',
      icon: Globe,
    },
    {
      step: '04',
      title: 'Sub-100ms Authorization',
      description: 'Card tokenization passes through direct acquiring rails with 3DS 2.2 biometric fallback authentication.',
      tech: 'Instant Settlement',
      icon: Zap,
    },
  ];

  return (
    <div
      className={`rounded-xl p-3.5 sm:p-5 border transition-colors duration-300 ${
        isDark
          ? 'bg-[#121620] border-slate-800 shadow-[0_1px_3px_0_rgba(0,0,0,0.3)]'
          : 'bg-white border-slate-200 shadow-xs'
      }`}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-xs font-bold uppercase tracking-wider font-mono ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Merchant of Record Architecture Pipeline
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                isDark
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Deterministic Handshake
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            End-to-end flow from client initiation to acquiring settlement and asynchronous webhook dispatch.
          </p>
        </div>

        <div
          className={`flex items-center gap-1.5 text-xs font-mono shrink-0 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Liability Offload to Dodo Payments</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-lg border flex flex-col justify-between space-y-3 ${
              isDark
                ? 'bg-[#0E121B] border-slate-800'
                : 'bg-slate-50/80 border-slate-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span
                  className={`font-mono font-bold text-[11px] ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {item.step}
                </span>
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.2 rounded border ${
                    isDark
                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {item.tech}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 font-semibold text-xs ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                <item.icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isDark ? 'text-emerald-400' : 'text-slate-700'
                  }`}
                />
                <span>{item.title}</span>
              </div>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutOverview;
