// Design System Theme Color Engine
// Allows changing a single primary color token to transform the entire website and checkout.

export interface ThemePalette {
  mainBg: string;
  secondaryBg: string;
  cardBg: string;
  inputBg: string;
  primaryText: string;
  secondaryText: string;
  mutedText: string;
  primaryBorder: string;
  hoverSurface: string;
  primaryButton: string;
  buttonHover: string;
  buttonText: string;
}

export const DEFAULT_PALETTE: ThemePalette = {
  mainBg: '#FFFFFF',
  secondaryBg: '#F7F7F5',
  cardBg: '#FFFFFF',
  inputBg: '#F5F5F2',
  primaryText: '#171717',
  secondaryText: '#666666',
  mutedText: '#8A8A8A',
  primaryBorder: '#E6E6E1',
  hoverSurface: '#F5FFD6',
  primaryButton: '#B6FF00',
  buttonHover: '#A6E800',
  buttonText: '#111111',
};

export interface ThemePreset {
  id: string;
  name: string;
  color: string;
  hoverColor: string;
  hoverSurface: string;
  buttonText: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'dodo-lime',
    name: 'Dodo Lime (Default)',
    color: '#B6FF00',
    hoverColor: '#A6E800',
    hoverSurface: '#F5FFD6',
    buttonText: '#111111',
  },
  {
    id: 'electric-cyan',
    name: 'Electric Cyan',
    color: '#00F5D4',
    hoverColor: '#00D4B8',
    hoverSurface: '#E6FFFA',
    buttonText: '#111111',
  },
  {
    id: 'vivid-violet',
    name: 'Vivid Violet',
    color: '#A855F7',
    hoverColor: '#9333EA',
    hoverSurface: '#FAF5FF',
    buttonText: '#FFFFFF',
  },
  {
    id: 'amber-gold',
    name: 'Amber Gold',
    color: '#FFB800',
    hoverColor: '#E5A600',
    hoverSurface: '#FFFBEB',
    buttonText: '#111111',
  },
  {
    id: 'hot-coral',
    name: 'Hot Coral',
    color: '#FF4757',
    hoverColor: '#E03645',
    hoverSurface: '#FFF1F2',
    buttonText: '#FFFFFF',
  },
  {
    id: 'electric-blue',
    name: 'Cobalt Blue',
    color: '#2563EB',
    hoverColor: '#1D4ED8',
    hoverSurface: '#EFF6FF',
    buttonText: '#FFFFFF',
  },
];

/**
 * Apply a theme primary color to the root document and any active checkout iframes.
 * Changing this single color rethemes the entire site instantly!
 */
export function applyThemeColor(
  colorHex: string,
  options?: {
    hoverColor?: string;
    hoverSurface?: string;
    buttonText?: string;
  }
) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Derive smart hover shades if not explicitly provided
  const hoverColor = options?.hoverColor || deriveShade(colorHex, -0.10);
  const hoverSurface = options?.hoverSurface || deriveTint(colorHex, 0.92);
  const buttonText = options?.buttonText || getContrastYIQ(colorHex);

  root.style.setProperty('--brand-primary', colorHex);
  root.style.setProperty('--brand-hover', hoverColor);
  root.style.setProperty('--brand-text', buttonText);
  root.style.setProperty('--hover-surface', hoverSurface);
  root.style.setProperty('--color-accent', colorHex);
  root.style.setProperty('--color-accent-strong', hoverColor);
  root.style.setProperty('--color-accent-text', buttonText);
  root.style.setProperty('--color-hover-surface', hoverSurface);
  root.style.setProperty('--color-accent-soft', hexToRgba(colorHex, 0.16));

  // Forward the new brand color to any active checkout iframe (modal or inline)
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    try {
      iframe.contentWindow?.postMessage(
        {
          source: 'dodo-theme-manager',
          type: 'THEME_COLOR_CHANGED',
          themeColor: colorHex,
          hoverColor,
          hoverSurface,
          buttonText,
        },
        '*'
      );
    } catch {
      // Cross-origin fallback is handled gracefully via URL searchParams
    }
  });

  try {
    localStorage.setItem('dodo_theme_color', colorHex);
  } catch {
    // LocalStorage failure tolerated
  }
}

/**
 * Derives a slightly darker or lighter shade of a hex color.
 */
function deriveShade(hex: string, percent: number): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6 && cleanHex.length !== 3) return hex;

  const num = parseInt(cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + Math.round(255 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + Math.round(255 * percent)));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Derives a very light pastel tint suitable for hover surfaces.
 */
function deriveTint(hex: string, mixRatio: number): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6 && cleanHex.length !== 3) return '#F5FFD6';

  const num = parseInt(cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex, 16);
  const r = Math.round((num >> 16) * (1 - mixRatio) + 255 * mixRatio);
  const g = Math.round(((num >> 8) & 0x00ff) * (1 - mixRatio) + 255 * mixRatio);
  const b = Math.round((num & 0x0000ff) * (1 - mixRatio) + 255 * mixRatio);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  const num = parseInt(cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Returns '#111111' or '#FFFFFF' based on WCAG luminance.
 */
function getContrastYIQ(hexcolor: string): string {
  const clean = hexcolor.replace('#', '');
  const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#111111' : '#FFFFFF';
}
