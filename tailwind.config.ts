import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      // ── Stitch Material You tokens ────────────────────────────────────
      colors: {
        // shadcn/ui tokens (mantienen compatibilidad con componentes existentes)
        background:   'hsl(var(--background))',
        foreground:   'hsl(var(--foreground))',
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },

        // ── Stitch / Material You palette (Precision Commerce) ──────────
        // Superficies
        'surface':                  '#faf8ff',
        'surface-dim':              '#d2d9f4',
        'surface-bright':           '#faf8ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low':    '#f2f3ff',
        'surface-container':        '#eaedff',
        'surface-container-high':   '#e2e7ff',
        'surface-container-highest':'#dae2fd',
        'surface-variant':          '#dae2fd',
        // Texto sobre superficies
        'on-surface':         '#131b2e',
        'on-surface-variant': '#434655',
        'inverse-surface':    '#283044',
        'inverse-on-surface': '#eef0ff',
        // Contornos
        'outline':         '#737686',
        'outline-variant': '#c3c6d7',
        'surface-tint':    '#0053db',
        // Primario — azul corporativo
        'md-primary':             '#004ac6',
        'md-on-primary':          '#ffffff',
        'md-primary-container':   '#2563eb',
        'md-on-primary-container':'#eeefff',
        'md-inverse-primary':     '#b4c5ff',
        'md-primary-fixed':       '#dbe1ff',
        'md-primary-fixed-dim':   '#b4c5ff',
        'md-on-primary-fixed':    '#00174b',
        // Secundario — naranja CTA
        'md-secondary':             '#a73a00',
        'md-on-secondary':          '#ffffff',
        'md-secondary-container':   '#fd651e',
        'md-on-secondary-container':'#571a00',
        'md-secondary-fixed':       '#ffdbce',
        'md-secondary-fixed-dim':   '#ffb599',
        'md-on-secondary-fixed':    '#370e00',
        // Terciario — gris azulado
        'md-tertiary':             '#4b566a',
        'md-on-tertiary':          '#ffffff',
        'md-tertiary-container':   '#636e83',
        'md-on-tertiary-container':'#ecf1ff',
        // Error
        'md-error':             '#ba1a1a',
        'md-on-error':          '#ffffff',
        'md-error-container':   '#ffdad6',
        'md-on-error-container':'#93000a',
        // Background
        'md-background':    '#faf8ff',
        'md-on-background': '#131b2e',
      },

      // ── Stitch spacing tokens ──────────────────────────────────────────
      spacing: {
        'xs':            '4px',
        'sm':            '8px',
        'md':            '16px',
        'lg':            '24px',
        'xl':            '32px',
        '2xl':           '48px',
        'gutter':        '16px',
        'container-max': '1280px',
      },

      // ── Stitch font sizes ──────────────────────────────────────────────
      fontSize: {
        'display-lg':        ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg':       ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-lg-mobile':['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-md':       ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'price-lg':          ['28px', { lineHeight: '1',   fontWeight: '700' }],
        'body-lg':           ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md':           ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-md':          ['14px', { lineHeight: '1.4', fontWeight: '500' }],
        'button-text':       ['16px', { lineHeight: '1',   fontWeight: '500' }],
      },

      // ── Border radius ──────────────────────────────────────────────────
      borderRadius: {
        lg:  'var(--radius)',
        md:  'calc(var(--radius) - 2px)',
        sm:  'calc(var(--radius) - 4px)',
        xl:  '0.75rem',
        '2xl': '1rem',
        full:'9999px',
      },

      // ── Max-width ──────────────────────────────────────────────────────
      maxWidth: {
        'container-max': '1280px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
