import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface SdkCodeViewerProps {
  isDark?: boolean;
}

export const SdkCodeViewer: React.FC<SdkCodeViewerProps> = ({ isDark = false }) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [lang, setLang] = useState<'ts' | 'html'>('ts');

  const tsCode = `import { DodoCheckout } from '@dodopayments/checkout';

// 1. Trigger the zero-redirect modal or inline embed anywhere on your page
DodoCheckout.open({
  productId: "prod_pro",
  customerEmail: "founder@startup.io",
  onSuccess: ({ sessionId, amount, paymentMethod }) => {
    console.log("Payment completed:", sessionId, amount);
    // Sub-100ms authorization & immediate entitlement provisioning
  },
  onClose: ({ reason }) => {
    console.log("Checkout dismissed:", reason);
  },
  onError: ({ code, message }) => {
    console.error("Payment failed:", code, message);
  }
});`;

  const htmlCode = `<!-- 1. Include the drop-in embed script in your document -->
<script src="https://checkout.dodopayments.com/sdk.js"></script>

<!-- 2. Call the global DodoCheckout instance -->
<button onclick="payWithDodo()">Subscribe to Pro</button>

<script>
  function payWithDodo() {
    window.DodoCheckout.open({
      productId: 'prod_pro',
      onSuccess: ({ sessionId }) => {
        console.log('Payment success! Session:', sessionId);
      },
      onClose: ({ reason }) => {
        console.log('Dismissed:', reason);
      },
      onError: ({ code, message }) => {
        console.error('Error:', message);
      }
    });
  }
</script>`;

  const copyCode = (text: string, tab: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 1800);
  };

  return (
    <div
      className={`rounded-xl overflow-hidden border transition-colors duration-300 ${
        isDark
          ? 'bg-[#121620] border-slate-800 shadow-[0_1px_3px_0_rgba(0,0,0,0.3)]'
          : 'bg-white border-slate-200 shadow-xs'
      }`}
    >
      <div
        className={`p-3.5 sm:p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDark ? 'border-slate-800 bg-[#121620]' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-emerald-400'
                : 'bg-slate-100 border-slate-200 text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3
              className={`font-bold text-xs uppercase tracking-wider font-mono ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Embed Script Integration
            </h3>
            <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              One script, one function call. Zero server compliance requirements.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <div
            className={`flex items-center p-0.5 rounded-lg border text-xs flex-1 sm:flex-initial justify-center ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <button
              onClick={() => setLang('ts')}
              className={`min-h-[36px] sm:min-h-[32px] px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900 flex-1 sm:flex-initial text-center ${
                lang === 'ts'
                  ? isDark
                    ? 'bg-slate-700 text-white font-bold shadow-xs border border-slate-600'
                    : 'bg-slate-900 text-white font-semibold shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TypeScript
            </button>
            <button
              onClick={() => setLang('html')}
              className={`min-h-[36px] sm:min-h-[32px] px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900 flex-1 sm:flex-initial text-center ${
                lang === 'html'
                  ? isDark
                    ? 'bg-slate-700 text-white font-bold shadow-xs border border-slate-600'
                    : 'bg-slate-900 text-white font-semibold shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HTML Script Tag
            </button>
          </div>

          <button
            onClick={() => copyCode(lang === 'ts' ? tsCode : htmlCode, lang)}
            className={`min-h-[36px] px-3 py-1 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer shrink-0 ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
            title="Copy code snippet"
          >
            {copiedTab === lang ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold text-[11px]">Copied</span>
              </>
            ) : (
              <>
                <Copy className={`w-3.5 h-3.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-[#0B0F19] text-slate-100 p-4 font-mono text-xs overflow-x-auto leading-relaxed">
        <pre className="selection:bg-slate-800">
          <code>{lang === 'ts' ? tsCode : htmlCode}</code>
        </pre>
      </div>
    </div>
  );
};

export default SdkCodeViewer;
