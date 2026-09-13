import React from 'react';
import {
  ShieldCheck,
  Layers,
  GitFork,
  MessageSquareCode,
  Cpu,
  Globe,
  Award,
  CreditCard,
  Sliders,
  AlertTriangle,
  MousePointerClick,
  EyeOff,
} from 'lucide-react';

interface ArchitectureNotesProps {
  isDark?: boolean;
}

export const ArchitectureNotes: React.FC<ArchitectureNotesProps> = ({ isDark = false }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Title block */}
      <div
        className={`rounded-xl p-4 sm:p-6 border transition-colors duration-300 ${
          isDark
            ? 'bg-[#121620] border-slate-800 shadow-[0_1px_3px_0_rgba(0,0,0,0.3)]'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${
              isDark ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-slate-900 text-white'
            }`}
          >
            Frontend Engineering Solution
          </span>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Dodo Payments &bull; Tiny Embeddable Checkout
          </span>
          <span
            className={`sm:ml-auto text-xs font-mono px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isDark
                ? 'text-emerald-300 bg-emerald-950/70 border border-emerald-800'
                : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Host-Isolated Sandbox
          </span>
        </div>
        <h2 className={`text-lg sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          System Architecture, Engineering Decisions &amp; Product Judgment
        </h2>
        <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Technical breakdown addressing the assignment requirements: inter-process communication protocol, security perimeter isolation, trade-off evaluations, the four open calls, and strategic roadmap explorations.
        </p>
      </div>

      {/* Part C: How it runs & how the pieces talk to each other */}
      <div
        className={`rounded-xl p-4 sm:p-6 space-y-4 border transition-colors duration-300 ${
          isDark
            ? 'bg-[#121620] border-slate-800 shadow-[0_1px_3px_0_rgba(0,0,0,0.3)]'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-emerald-400'
                : 'bg-slate-100 border-slate-200 text-slate-900'
            }`}
          >
            <MessageSquareCode className="w-3.5 h-3.5" />
          </div>
          <h3
            className={`font-bold text-sm uppercase tracking-wider font-mono ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Part C: Architecture &amp; Inter-Process Communication
          </h3>
        </div>

        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          The system enforces three physically isolated execution boundaries: the{' '}
          <strong className={isDark ? 'text-white' : 'text-slate-900'}>Merchant Host Application</strong>, the{' '}
          <strong className={isDark ? 'text-white' : 'text-slate-900'}>
            Embeddable SDK Client (<code className={`font-mono font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>DodoCheckout</code>)
          </strong>
          , and the <strong className={isDark ? 'text-white' : 'text-slate-900'}>Sandboxed Checkout Application</strong>.
        </p>

        {/* Handshake Flow Visual Diagram */}
        <div
          className={`rounded-lg p-3 sm:p-4 border font-mono text-xs space-y-3 ${
            isDark ? 'bg-[#0E121B] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="font-semibold mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className={isDark ? 'text-white' : 'text-slate-900'}>Communication Protocol &amp; Event Handshake:</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded ${
                isDark
                  ? 'text-emerald-300 bg-emerald-950/70 border border-emerald-800'
                  : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
              }`}
            >
              Bidirectional postMessage
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2.5">
            <span className={`font-bold shrink-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>1. Host &rarr; SDK:</span>
            <span className="break-words [overflow-wrap:anywhere]">
              Host application calls{' '}
              <code
                className={`px-1 py-0.5 rounded font-mono text-[11px] inline-block max-w-full break-all border ${
                  isDark
                    ? 'text-emerald-300 bg-slate-800 border-slate-700'
                    : 'text-slate-900 bg-white border-slate-200'
                }`}
              >
                DodoCheckout.open(&#123; productId, onSuccess, onClose, onError, onEvent &#125;)
              </code>{' '}
              or{' '}
              <code
                className={`px-1 py-0.5 rounded font-mono text-[11px] inline-block max-w-full break-all border ${
                  isDark
                    ? 'text-emerald-300 bg-slate-800 border-slate-700'
                    : 'text-slate-900 bg-white border-slate-200'
                }`}
              >
                DodoCheckout.embed()
              </code>
              .
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2.5">
            <span className={`font-bold shrink-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>2. SDK &rarr; DOM:</span>
            <span className="break-words [overflow-wrap:anywhere]">
              SDK computes layout shift compensation (
              <code
                className={`px-1 py-0.5 rounded font-mono text-[11px] border ${
                  isDark
                    ? 'text-emerald-300 bg-slate-800 border-slate-700'
                    : 'text-slate-900 bg-white border-slate-200'
                }`}
              >
                scrollbarWidth
              </code>
              ), locks background scroll, and dynamically mounts an accessible dialog overlay (
              <code
                className={`px-1 py-0.5 rounded font-mono text-[11px] border ${
                  isDark
                    ? 'text-emerald-300 bg-slate-800 border-slate-700'
                    : 'text-slate-900 bg-white border-slate-200'
                }`}
              >
                role=&quot;dialog&quot; aria-modal=&quot;true&quot;
              </code>
              ) housing a sandboxed{' '}
              <code
                className={`px-1 py-0.5 rounded font-mono text-[11px] border ${
                  isDark
                    ? 'text-emerald-300 bg-slate-800 border-slate-700'
                    : 'text-slate-900 bg-white border-slate-200'
                }`}
              >
                &lt;iframe&gt;
              </code>{' '}
              targeting{' '}
              <code
                className={`px-1 py-0.5 rounded font-mono text-[11px] inline-block max-w-full break-all border ${
                  isDark
                    ? 'text-emerald-300 bg-slate-800 border-slate-700'
                    : 'text-slate-900 bg-white border-slate-200'
                }`}
              >
                /checkout.html?sessionId=...
              </code>
              .
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2.5">
            <span className={`font-bold shrink-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>3. Iframe &rarr; SDK:</span>
            <span className="break-words [overflow-wrap:anywhere]">
              Iframe initializes and dispatches{' '}
              <code
                className={`px-1 py-0.5 rounded font-mono font-medium text-[11px] border ${
                  isDark
                    ? 'text-emerald-300 bg-emerald-950/70 border-emerald-800'
                    : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                }`}
              >
                DODO_CHECKOUT_READY
              </code>{' '}
              via{' '}
              <code
                className={`px-1 py-0.5 rounded font-mono text-[11px] border ${
                  isDark
                    ? 'text-emerald-300 bg-slate-800 border-slate-700'
                    : 'text-slate-900 bg-white border-slate-200'
                }`}
              >
                window.parent.postMessage()
              </code>
              . The SDK crossfades from skeleton loader to the checkout interface and shifts focus inside the iframe.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2.5">
            <span className={`font-bold shrink-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>4. Customer &rarr; Iframe:</span>
            <span className="break-words [overflow-wrap:anywhere]">
              Customer enters card details directly inside the iframe. All sensitive credit card credentials (PAN, CVC, Expiration) remain strictly inside the isolated iframe sandbox and <strong className={isDark ? 'text-white' : 'text-slate-900'}>NEVER</strong> touch host DOM memory, local storage, or merchant scripts (zero merchant host exposure).
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2.5">
            <span className={`font-bold shrink-0 ${isDark ? 'text-white' : 'text-slate-900'}`}>5. Lifecycle Telemetry &amp; Settlement:</span>
            <span className="break-words [overflow-wrap:anywhere]">
              Throughout interaction, the checkout broadcasts{' '}
              <code
                className={`px-1 py-0.5 rounded font-mono font-medium text-[11px] border ${
                  isDark
                    ? 'text-purple-300 bg-purple-950/70 border-purple-800'
                    : 'text-purple-700 bg-purple-50 border border-purple-200'
                }`}
              >
                DODO_CHECKOUT_EVENT
              </code>{' '}
              (such as <code className="font-mono text-[11px]">payment_processing_started</code> or <code className="font-mono text-[11px]">checkout_closed</code>) triggering the merchant&apos;s{' '}
              <code
                className={`px-1 py-0.5 rounded font-mono text-[11px] border ${
                  isDark
                    ? 'text-purple-300 bg-slate-800 border-slate-700'
                    : 'text-slate-900 bg-white border-slate-200'
                }`}
              >
                onEvent()
              </code>{' '}
              listener. Upon successful authorization, it dispatches{' '}
              <code
                className={`px-1 py-0.5 rounded font-mono font-medium text-[11px] border ${
                  isDark
                    ? 'text-emerald-300 bg-emerald-950/70 border-emerald-800'
                    : 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                }`}
              >
                DODO_CHECKOUT_SUCCESS
              </code>{' '}
              with a sanitized payment receipt delivering to{' '}
              <code
                className={`px-1 py-0.5 rounded font-mono text-[11px] border ${
                  isDark
                    ? 'text-emerald-300 bg-slate-800 border-slate-700'
                    : 'text-slate-900 bg-white border-slate-200'
                }`}
              >
                onSuccess()
              </code>
              , or errors to{' '}
              <code
                className={`px-1 py-0.5 rounded font-mono text-[11px] border ${
                  isDark
                    ? 'text-rose-300 bg-slate-800 border-slate-700'
                    : 'text-slate-900 bg-white border-slate-200'
                }`}
              >
                onError()
              </code>
              .
            </span>
          </div>
        </div>

        {/* Security boundary card */}
        <div
          className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
            isDark
              ? 'bg-[#0E121B] border-slate-800 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Security &amp; Threat Model Defense</span>
          </div>
          <p className="leading-relaxed text-xs">
            All <code className={`font-mono text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`}>postMessage</code> listeners validate{' '}
            <code className={`font-mono text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`}>event.data.source === &apos;dodo-checkout-app&apos;</code> and match against the session-specific <code className={`font-mono text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`}>sessionId</code>. Messages from rogue browser extensions, other iframes, or stale sessions are dropped immediately.
          </p>
        </div>
      </div>

      {/* NEW PART: Answering the 4 Open Calls from the Assignment Prompt */}
      <div
        className={`rounded-xl p-4 sm:p-6 space-y-5 border transition-colors duration-300 ${
          isDark
            ? 'bg-[#121620] border-slate-800 shadow-[0_1px_3px_0_rgba(0,0,0,0.3)]'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-emerald-400'
                : 'bg-slate-100 border-slate-200 text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <h3
            className={`font-bold text-sm uppercase tracking-wider font-mono ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Assignment Decisions: The Four Open Calls (&quot;You Decide&quot;)
          </h3>
        </div>

        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          The brief states: <em>&quot;How much a site can change about the checkout. What the customer sees when a payment fails halfway. What happens if someone hits Buy twice. What the host page should and shouldn&apos;t be able to know. These are your calls. Make them, and tell us why.&quot;</em> Here is our architectural stance on each:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Call 1 */}
          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-[#0E121B] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-500 shrink-0" />
              <h4 className={`font-bold text-xs font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                1. What a Site Can and Cannot Change
              </h4>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Configurable by Host:</strong> Display theme (<code className="font-mono">light</code>, <code className="font-mono">dark</code>, <code className="font-mono">auto</code>), presentation mode (<code className="font-mono">modal</code> overlay vs <code className="font-mono">inline</code> embed), pre-filled customer email and name, currency, and product metadata.
            </p>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <strong className="text-rose-500 font-semibold">Strictly Forbidden:</strong> Host sites cannot inject arbitrary CSS or JavaScript into the iframe, alter the cryptographic session handshake, or bypass card validation. This ensures zero risk of XSS tampering or DOM clickjacking.
            </p>
          </div>

          {/* Call 2 */}
          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-[#0E121B] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <h4 className={`font-bold text-xs font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                2. When Payment Fails Halfway
              </h4>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Zero Lost State:</strong> All entered fields (card number, expiry, CVC, email, country) are preserved in state so the user never re-types details.
            </p>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Diagnostic Clarity:</strong> Differentiates bank declines from transient network timeouts. For gateway drops (<code className="font-mono">0341</code>), provides an instant <strong>&quot;Retry Payment Now&quot;</strong> button that routes through our secondary gateway, reassuring the customer their card was not charged.
            </p>
          </div>

          {/* Call 3 */}
          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-[#0E121B] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-blue-500 shrink-0" />
              <h4 className={`font-bold text-xs font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                3. What Happens If Someone Hits Buy Twice
              </h4>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>SDK Single-Instance Lock:</strong> If a user clicks &quot;Buy&quot; while a modal is already open, the SDK catches the duplicate invocation, suppresses duplicate modal generation, and refocuses the active session.
            </p>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>In-Checkout Idempotency:</strong> Inside the payment form, clicking &quot;Authorize&quot; locks the button immediately, sets <code className="font-mono">isSubmittingRef = true</code>, and displays step progress, preventing duplicate network authorizations.
            </p>
          </div>

          {/* Call 4 */}
          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isDark ? 'bg-[#0E121B] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-emerald-500 shrink-0" />
              <h4 className={`font-bold text-xs font-mono uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                4. What the Host Can and Cannot Know
              </h4>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>What Host Learns:</strong> High-level lifecycle telemetry (<code className="font-mono">checkout_ready</code>, <code className="font-mono">payment_processing_started</code>), final outcome receipt (<code className="font-mono">sessionId</code>, amount, currency, masked brand/last4), or dismissal reason.
            </p>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <strong className="text-rose-500 font-semibold">Strictly Hidden:</strong> Raw 16-digit PAN, CVC security codes, expiration dates, and keystroke events. The host page has zero access to payment credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Part D: Two decisions evaluated */}
      <div
        className={`rounded-xl p-4 sm:p-6 space-y-5 border transition-colors duration-300 ${
          isDark
            ? 'bg-[#121620] border-slate-800 shadow-[0_1px_3px_0_rgba(0,0,0,0.3)]'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-emerald-400'
                : 'bg-slate-100 border-slate-200 text-slate-900'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
          </div>
          <h3
            className={`font-bold text-sm uppercase tracking-wider font-mono ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Part E: Two Decisions I Evaluated Rigorously
          </h3>
        </div>

        {/* Decision 1 */}
        <div className={`space-y-2 border-l-2 pl-3.5 ${isDark ? 'border-emerald-500' : 'border-slate-900'}`}>
          <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Decision 1: In-Page Sandboxed Iframe Modal vs. Hosted Full-Page Redirect
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <strong className={isDark ? 'text-white' : 'text-slate-900'}>The Dilemma:</strong> A hosted redirect provides absolute security isolation by navigating away, but introduces significant funnel drop-off (typically 12-18% loss in SaaS conversion) and completely breaks the state of modern Single Page Applications. Conversely, a native popup window (<code className="font-mono">window.open</code>) is notoriously blocked by mobile Safari and aggressive desktop popup blockers.
          </p>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <strong className="text-emerald-500 font-semibold">The Call:</strong> I implemented an{' '}
            <strong className={isDark ? 'text-white' : 'text-slate-900'}>in-page sandboxed iframe modal overlay</strong> combined with an inline embed mode. The buyer never leaves their shopping context or loses their work, yet the browser&apos;s iframe sandbox ensures zero card credential leakage. To make this feel native, the SDK prevents horizontal layout shifts by calculating scrollbar gutters, traps focus for accessibility, handles Escape key dismissal, and guards against accidental data loss with an exit-confirmation modal.
          </p>
        </div>

        {/* Decision 2 */}
        <div className={`space-y-2 border-l-2 pl-3.5 ${isDark ? 'border-emerald-500' : 'border-slate-900'}`}>
          <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Decision 2: Host Knowledge Boundary (Zero-Trust vs. Telemetry Hooks)
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <strong className={isDark ? 'text-white' : 'text-slate-900'}>The Dilemma:</strong> How much insight should the host merchant site receive about the checkout lifecycle? If we emit granular input keystroke events, a third-party script or tracking pixel on the merchant&apos;s site could potentially perform side-channel timing analysis. Conversely, if we emit only the final <code className="font-mono">onSuccess</code> callback, merchants are blind to customer drop-offs, validation struggles, or gateway timeouts.
          </p>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <strong className="text-emerald-500 font-semibold">The Call:</strong> Strict privacy by design with coarse lifecycle hooks. Sensitive card inputs, raw PAN digits, and CVC codes are 100% walled off. The host page receives high-level lifecycle events (<code className="font-mono">checkout_ready</code>, <code className="font-mono">payment_processing_started</code>, <code className="font-mono">payment_settled</code>, <code className="font-mono">onClose(reason)</code>). This grants merchants full funnel observability without creating any security liability.
          </p>
        </div>
      </div>

      {/* Part F: What you'd explore next */}
      <div
        className={`rounded-xl p-4 sm:p-6 space-y-4 border transition-colors duration-300 ${
          isDark
            ? 'bg-[#121620] border-slate-800 shadow-[0_1px_3px_0_rgba(0,0,0,0.3)]'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-emerald-400'
                : 'bg-slate-100 border-slate-200 text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <h3
            className={`font-bold text-sm uppercase tracking-wider font-mono ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Part F: High-Impact Next Explorations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div
            className={`p-3.5 rounded-lg border space-y-1 ${
              isDark ? 'bg-[#0E121B] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className={`font-semibold text-xs flex items-center gap-1.5 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Globe className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>1. Dynamic Auto-Height Handshake (Implemented &amp; Extended)</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              The applet already implements bidirectional <code className={`font-mono text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`}>DODO_CHECKOUT_RESIZE</code> postMessage telemetry between iframe and host. In next production iterations, upgrade to continuous element-level <code className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>ResizeObserver</code> tracking with spring-physics transitions to smoothly adapt across coupon drawer toggles, validation alert expansions, and 3D Secure modal steps with zero inner scrollbars.
            </p>
          </div>

          <div
            className={`p-3.5 rounded-lg border space-y-1 ${
              isDark ? 'bg-[#0E121B] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className={`font-semibold text-xs flex items-center gap-1.5 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <CreditCard className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>2. Web Payments API (Apple Pay &amp; Google Pay)</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Support <code className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>PaymentRequest</code> natively inside the iframe with <code className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>allow=&quot;payment&quot;</code>, unlocking 1-tap biometric payments on supported iOS, macOS, and Android devices to reduce checkout completion times to &lt;5 seconds.
            </p>
          </div>

          <div
            className={`p-3.5 rounded-lg border space-y-1 ${
              isDark ? 'bg-[#0E121B] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className={`font-semibold text-xs flex items-center gap-1.5 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>3. Cross-Merchant Dodo Passkey Network</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Leverage Dodo Payments&apos; position as Merchant of Record to offer universal one-click checkout across all Dodo-powered SaaS platforms. Buyers authenticate via WebAuthn biometric passkey or email OTP without ever re-entering card numbers.
            </p>
          </div>

          <div
            className={`p-3.5 rounded-lg border space-y-1 ${
              isDark ? 'bg-[#0E121B] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className={`font-semibold text-xs flex items-center gap-1.5 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>4. Automated Geo-IP Tax &amp; Local Payment Rails</span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Dynamically detect customer country from IP geolocation to compute real-time VAT/GST/sales tax compliance across 220+ countries and present local payment methods (iDEAL in Netherlands, UPI in India, Pix in Brazil, SEPA in Europe) automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureNotes;
