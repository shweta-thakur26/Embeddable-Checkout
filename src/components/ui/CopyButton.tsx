import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  textToCopy: string;
  label?: string;
  successLabel?: string;
  iconOnly?: boolean;
  onCopied?: () => void;
  timeoutMs?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label,
  successLabel,
  iconOnly = false,
  onCopied,
  timeoutMs = 2000,
  className = '',
  title = 'Copy to clipboard',
  ...props
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      if (onCopied) onCopied();
      setTimeout(() => setCopied(false), timeoutMs);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copied!' : title}
      aria-label={copied ? 'Copied to clipboard' : title}
      className={`inline-flex items-center gap-1 cursor-pointer transition-colors ${className}`}
      {...props}
    >
      {copied ? (
        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
      ) : (
        <Copy className="w-3 h-3 shrink-0" />
      )}
      {!iconOnly && (
        <span>{copied ? (successLabel || label || 'Copied!') : (label || '')}</span>
      )}
    </button>
  );
};

export default CopyButton;
