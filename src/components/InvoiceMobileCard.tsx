import React from 'react';
import { CheckCircle2, Download } from 'lucide-react';
import { TransactionRecord } from './InvoiceTable';

interface InvoiceMobileCardProps {
  item: TransactionRecord;
  onDownloadInvoice: (invoiceId: string) => void;
}

export const InvoiceMobileCard: React.FC<InvoiceMobileCardProps> = ({
  item,
  onDownloadInvoice,
}) => {
  return (
    <div className="p-3.5 sm:p-4 space-y-2 bg-[var(--color-surface)]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="font-mono text-[10px] text-[var(--color-text-muted)] block truncate">{item.id}</span>
          <span className="font-mono font-bold text-xs text-[var(--color-text-primary)]">{item.morInvoiceId}</span>
        </div>
        <div className="text-right shrink-0">
          <span className="font-mono font-bold text-sm text-[var(--color-text-primary)] block">
            ${item.amount.toFixed(2)} {item.currency}
          </span>
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono border"
            style={{
              backgroundColor: 'var(--hover-surface)',
              color: 'var(--color-text-primary)',
              borderColor: 'var(--brand-primary)',
            }}
          >
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            <span>Settled</span>
          </span>
        </div>
      </div>

      <div className="text-xs text-[var(--color-text-primary)] font-medium">
        <span>{item.productName}</span> &bull;{' '}
        <span className="font-normal text-[var(--color-text-secondary)] break-all">{item.customerEmail}</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1.5 border-t border-[var(--color-border)] text-[var(--color-text-muted)] font-mono">
        <span>Tax: +${item.taxAmount.toFixed(2)} ({item.taxJurisdiction})</span>
        <div className="flex items-center gap-2">
          <span>{item.cardBrand} •••• {item.cardLast4}</span>
          <button
            onClick={() => onDownloadInvoice(item.morInvoiceId)}
            className="min-h-[32px] inline-flex items-center gap-1 text-[var(--color-text-primary)] font-semibold px-2 py-0.5 bg-[var(--color-surface-inset)] border border-[var(--color-border)] hover:border-[var(--brand-primary)] hover:bg-[var(--hover-surface)] rounded text-[10px] cursor-pointer"
            aria-label={`Download PDF invoice for ${item.morInvoiceId}`}
          >
            <Download className="w-3 h-3" />
            <span>PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceMobileCard;
