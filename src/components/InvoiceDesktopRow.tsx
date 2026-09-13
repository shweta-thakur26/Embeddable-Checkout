import React from 'react';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { TransactionRecord } from './InvoiceTable';

interface InvoiceDesktopRowProps {
  item: TransactionRecord;
  onDownloadInvoice: (invoiceId: string) => void;
}

export const InvoiceDesktopRow: React.FC<InvoiceDesktopRowProps> = ({
  item,
  onDownloadInvoice,
}) => {
  return (
    <tr className="hover:bg-[var(--hover-surface)]/50 transition-colors">
      <td className="py-3 px-4">
        <div className="font-mono font-semibold text-[var(--color-text-primary)] text-xs">
          {item.morInvoiceId}
        </div>
        <div className="font-mono text-[10px] text-[var(--color-text-muted)] truncate max-w-[120px]">
          {item.id}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="font-medium text-[var(--color-text-primary)]">{item.customerEmail}</div>
        <div className="text-[10px] text-[var(--color-text-muted)] font-mono flex items-center gap-1">
          <span>{item.cardBrand}</span>
          <span>••••</span>
          <span>{item.cardLast4}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="text-[var(--color-text-primary)] font-medium">{item.productName}</div>
        <div className="text-[10px] text-[var(--color-text-muted)] font-mono">{item.date}</div>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="font-mono text-[var(--color-text-secondary)]">
          +${item.taxAmount.toFixed(2)}
        </div>
        <div className="text-[10px] text-[var(--color-text-muted)] font-mono">
          {item.taxJurisdiction}
        </div>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="font-mono font-bold text-[var(--color-text-primary)] text-sm">
          ${item.amount.toFixed(2)} {item.currency}
        </div>
      </td>
      <td className="py-3 px-4">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border"
          style={{
            backgroundColor: 'var(--hover-surface)',
            color: 'var(--color-text-primary)',
            borderColor: 'var(--brand-primary)',
          }}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Settled</span>
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onDownloadInvoice(item.morInvoiceId)}
          className="min-h-[32px] inline-flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs font-mono font-medium px-2 py-1 hover:bg-[var(--hover-surface)] rounded cursor-pointer transition-colors border border-transparent hover:border-[var(--brand-primary)]"
          title="View Tax Invoice"
          aria-label={`View Tax Invoice for ${item.morInvoiceId}`}
        >
          <span>PDF</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </td>
    </tr>
  );
};

export default InvoiceDesktopRow;
