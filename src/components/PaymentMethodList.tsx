import React from 'react';
import { CreditCard, ShieldCheck, Globe2, Smartphone, Building } from 'lucide-react';
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover, FaApplePay, FaGooglePay } from 'react-icons/fa';
import { BsBank2 } from 'react-icons/bs';
import { IconType } from 'react-icons';

interface PaymentMethod {
  name: string;
  badge: string;
  note: string;
  BrandIcon: React.ElementType;
}

interface PaymentGroup {
  category: string;
  icon: React.ElementType;
  items: PaymentMethod[];
}

export const PaymentMethodList: React.FC = () => {
  const methods: PaymentGroup[] = [
    {
      category: 'Cards & Networks',
      icon: CreditCard,
      items: [
        { name: 'Visa', badge: 'Global', note: '3D Secure 2.2', BrandIcon: FaCcVisa },
        { name: 'Mastercard', badge: 'Global', note: 'Identity Check', BrandIcon: FaCcMastercard },
        { name: 'American Express', badge: 'Global', note: 'SafeKey', BrandIcon: FaCcAmex },
        { name: 'Discover', badge: 'US & Global', note: 'DCI Network', BrandIcon: FaCcDiscover },
      ],
    },
    {
      category: 'Digital Wallets',
      icon: Smartphone,
      items: [
        { name: 'Apple Pay', badge: 'Biometric', note: 'Tokenized Element', BrandIcon: FaApplePay },
        { name: 'Google Pay', badge: '1-Click', note: 'Google Wallet API', BrandIcon: FaGooglePay },
      ],
    },
    {
      category: 'Local Rails & Direct Bank',
      icon: Building,
      items: [
        { name: 'SEPA Direct', badge: 'EU / EEA', note: 'EUR Clearing', BrandIcon: BsBank2 },
        { name: 'UPI & RuPay', badge: 'India', note: 'NPCI Instant Rail', BrandIcon: BsBank2 },
        { name: 'iDEAL', badge: 'Netherlands', note: 'Bank Redirect', BrandIcon: BsBank2 },
      ],
    },
  ];

  return (
    <div className="fintech-card rounded-xl p-3.5 sm:p-5 border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-surface-inset)] border border-[var(--color-border)] text-[var(--color-text-primary)] flex items-center justify-center shrink-0">
            <Globe2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider font-mono flex flex-wrap items-center gap-2">
              <span>Universal Payment Acceptance</span>
              <span
                className="px-1.5 py-0.5 rounded text-[10px] border font-mono font-medium"
                style={{
                  backgroundColor: 'var(--hover-surface)',
                  color: 'var(--color-text-primary)',
                  borderColor: 'var(--brand-primary)',
                }}
              >
                220+ Countries
              </span>
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">MoR Managed Payouts &amp; Chargeback Defense</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods.map((group, idx) => (
          <div key={idx} className="bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded-lg p-3.5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-border)] pb-2">
              <group.icon className="w-4 h-4 text-[var(--color-text-secondary)] shrink-0" />
              <span>{group.category}</span>
            </div>
            <div className="space-y-2">
              {group.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="flex items-center justify-between py-2 px-2.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-xs gap-2 min-h-[38px] shadow-2xs hover:border-[var(--brand-primary)] hover:bg-[var(--hover-surface)]/40 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <item.BrandIcon className="w-4 h-4 text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors shrink-0" />
                    <span className="font-semibold text-[var(--color-text-primary)] truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0 justify-end">
                    <span className="text-[10px] text-[var(--color-text-muted)] font-mono hidden min-[440px]:inline sm:hidden md:hidden lg:inline truncate">
                      {item.note}
                    </span>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[var(--color-surface-inset)] text-[var(--color-text-primary)] border border-[var(--color-border)] shrink-0 whitespace-nowrap">
                      {item.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodList;
