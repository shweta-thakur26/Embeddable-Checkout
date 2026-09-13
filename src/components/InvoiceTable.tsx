import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { PaymentSuccessResult } from '../types';
import { InvoiceDesktopRow } from './InvoiceDesktopRow';
import { InvoiceMobileCard } from './InvoiceMobileCard';

export interface TransactionRecord {
  id: string;
  customerEmail: string;
  productName: string;
  amount: number;
  currency: string;
  taxAmount: number;
  taxJurisdiction: string;
  status: 'settled' | 'pending' | 'declined';
  date: string;
  cardBrand: string;
  cardLast4: string;
  morInvoiceId: string;
}

interface InvoiceTableProps {
  recentTransactions?: PaymentSuccessResult[];
}

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx_dodo_8921a4',
    customerEmail: 'sarah.c@cloudscale.io',
    productName: 'Pro Plan Subscription',
    amount: 49.0,
    currency: 'USD',
    taxAmount: 4.17,
    taxJurisdiction: 'US-CA (8.5%)',
    status: 'settled',
    date: 'Today, 10:42 AM',
    cardBrand: 'VISA',
    cardLast4: '4242',
    morInvoiceId: 'INV-2026-08129',
  },
  {
    id: 'tx_dodo_7810b2',
    customerEmail: 'dev@berlin-tech.de',
    productName: 'Enterprise Cloud Fleet',
    amount: 199.0,
    currency: 'EUR',
    taxAmount: 37.81,
    taxJurisdiction: 'DE-VAT (19%)',
    status: 'settled',
    date: 'Yesterday, 04:15 PM',
    cardBrand: 'MASTERCARD',
    cardLast4: '8841',
    morInvoiceId: 'INV-2026-08128',
  },
  {
    id: 'tx_dodo_6509f1',
    customerEmail: 'finance@tokyo-robotics.jp',
    productName: 'Enterprise MoR SLA',
    amount: 899.0,
    currency: 'USD',
    taxAmount: 89.9,
    taxJurisdiction: 'JP-CT (10%)',
    status: 'settled',
    date: 'Sep 10, 2026',
    cardBrand: 'AMEX',
    cardLast4: '0005',
    morInvoiceId: 'INV-2026-08127',
  },
  {
    id: 'tx_dodo_4412c9',
    customerEmail: 'rahul@bangalore-dev.in',
    productName: 'Pro Plan Subscription',
    amount: 49.0,
    currency: 'USD',
    taxAmount: 8.82,
    taxJurisdiction: 'IN-GST (18%)',
    status: 'settled',
    date: 'Sep 09, 2026',
    cardBrand: 'VISA',
    cardLast4: '4242',
    morInvoiceId: 'INV-2026-08126',
  },
];

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ recentTransactions = [] }) => {
  const [search, setSearch] = useState('');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Combine initial mock records with any live transactions completed during session
  const liveRecords: TransactionRecord[] = recentTransactions.map((tx) => ({
    id: tx.sessionId,
    customerEmail: tx.customerEmail,
    productName: 'Live Session Checkout',
    amount: tx.amount,
    currency: tx.currency,
    taxAmount: tx.taxAmount,
    taxJurisdiction: `${tx.country} (Remitted)`,
    status: 'settled',
    date: 'Just now',
    cardBrand: tx.paymentMethod.brand.toUpperCase(),
    cardLast4: tx.paymentMethod.last4,
    morInvoiceId: `INV-${Date.now().toString().slice(-6)}`,
  }));

  const allRecords = [...liveRecords, ...INITIAL_TRANSACTIONS];

  const filtered = allRecords.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.customerEmail.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.morInvoiceId.toLowerCase().includes(q) ||
      r.productName.toLowerCase().includes(q)
    );
  });

  const handleDownloadInvoice = (invoiceId: string) => {
    setDownloadNotice(`MoR Tax Receipt ${invoiceId} generated & dispatched.`);
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="fintech-card rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Table Header Controls */}
      <div className="p-3.5 sm:p-5 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider font-mono">
              Merchant of Record Invoices
            </h3>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border"
              style={{
                backgroundColor: 'var(--hover-surface)',
                color: 'var(--color-text-primary)',
                borderColor: 'var(--brand-primary)',
              }}
            >
              Auto-Remitted
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
            Dodo Payments files and remits sales taxes in 220+ jurisdictions. Zero merchant tax liability.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoice, email, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 sm:py-1.5 bg-[var(--color-surface-inset)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition font-sans"
            />
          </div>
        </div>
      </div>

      {/* Download Toast Notification */}
      {downloadNotice && (
        <div
          className="border-b px-4 py-2 text-xs font-mono flex items-center justify-between animate-fadeIn"
          style={{
            backgroundColor: 'var(--hover-surface)',
            borderColor: 'var(--brand-primary)',
            color: 'var(--color-text-primary)',
          }}
        >
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{downloadNotice}</span>
          </span>
          <span className="text-[10px] opacity-75">Merchant of Record Dodo Payments Inc.</span>
        </div>
      )}

      {/* Responsive Table: Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[640px]">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)] text-[11px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
              <th className="py-2.5 px-4">Invoice &amp; ID</th>
              <th className="py-2.5 px-4">Customer</th>
              <th className="py-2.5 px-4">Plan Description</th>
              <th className="py-2.5 px-4 text-right">Tax Remitted</th>
              <th className="py-2.5 px-4 text-right">Total Net</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)] font-sans">
            {filtered.map((item) => (
              <InvoiceDesktopRow
                key={item.id}
                item={item}
                onDownloadInvoice={handleDownloadInvoice}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Responsive Table: Mobile View (< 768px Adaptive Cards) */}
      <div className="md:hidden divide-y divide-[var(--color-border)]">
        {filtered.map((item) => (
          <InvoiceMobileCard
            key={item.id}
            item={item}
            onDownloadInvoice={handleDownloadInvoice}
          />
        ))}
      </div>
    </div>
  );
};

export default InvoiceTable;
