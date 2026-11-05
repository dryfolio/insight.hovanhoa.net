import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/constants/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        fontFamily: {
            sans: [
                'Inter',
                'Avenir Next',
                'Roboto',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Ubuntu',
                '"Helvetica Neue"',
                'Arial',
                '"Noto Sans"',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
                '"Noto Color Emoji"',
            ],
            mono: [
                'ui-monospace',
                'SFMono-Regular',
                'Menlo',
                'Monaco',
                'Consolas',
                'Liberation Mono',
                'Courier New',
                'monospace',
            ],
        },
        extend: {
            boxShadow: {
                // light
                'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'tremor-card':
                    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'tremor-dropdown':
                    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                // dark
                'dark-tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                'dark-tremor-card':
                    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'dark-tremor-dropdown':
                    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
            borderRadius: {
                'tremor-small': '0.375rem',
                'tremor-default': '0.5rem',
                'tremor-full': '9999px',
            },
            fontSize: {
                'tremor-label': ['0.75rem', { lineHeight: '1rem' }],
                'tremor-default': ['0.875rem', { lineHeight: '1.25rem' }],
                'tremor-title': ['1.125rem', { lineHeight: '1.75rem' }],
                'tremor-metric': ['1.875rem', { lineHeight: '2.25rem' }],
            },
            colors: {
                primary: '#0ea5e9',
                // Tremor tokens resolve to the --rd-* palette, so light and dark
                // both follow globals.css (the .dark class swaps the variables).
                tremor: {
                    brand: {
                        faint: 'var(--rd-accent-bg)',
                        muted: 'var(--rd-accent-bg)',
                        subtle: 'var(--rd-accent)',
                        DEFAULT: 'var(--rd-accent)',
                        emphasis: 'var(--rd-accent-ink)',
                        inverted: 'var(--rd-surface)',
                    },
                    background: {
                        muted: 'var(--rd-bg)',
                        subtle: 'var(--rd-surface-2)',
                        DEFAULT: 'var(--rd-surface)',
                        emphasis: 'var(--rd-text-2)',
                    },
                    border: {
                        DEFAULT: 'var(--rd-border)',
                    },
                    ring: {
                        DEFAULT: 'var(--rd-border)',
                    },
                    content: {
                        subtle: 'var(--rd-text-3)',
                        DEFAULT: 'var(--rd-text-3)',
                        emphasis: 'var(--rd-text-2)',
                        strong: 'var(--rd-text)',
                        inverted: 'var(--rd-surface)',
                    },
                },
                'dark-tremor': {
                    brand: {
                        faint: 'var(--rd-accent-bg)',
                        muted: 'var(--rd-accent-bg)',
                        subtle: 'var(--rd-accent)',
                        DEFAULT: 'var(--rd-accent)',
                        emphasis: 'var(--rd-accent-ink)',
                        inverted: 'var(--rd-surface)',
                    },
                    background: {
                        muted: 'var(--rd-bg)',
                        subtle: 'var(--rd-surface-2)',
                        DEFAULT: 'var(--rd-surface)',
                        emphasis: 'var(--rd-text-2)',
                    },
                    border: {
                        DEFAULT: 'var(--rd-border)',
                    },
                    ring: {
                        DEFAULT: 'var(--rd-border)',
                    },
                    content: {
                        subtle: 'var(--rd-text-3)',
                        DEFAULT: 'var(--rd-text-3)',
                        emphasis: 'var(--rd-text-2)',
                        strong: 'var(--rd-text)',
                        inverted: 'var(--rd-surface)',
                    },
                },
            },
        },
    },
    safelist: [
        {
            pattern:
                /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'data-[selected]'],
        },
        {
            pattern:
                /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'data-[selected]'],
        },
        {
            pattern:
                /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
            variants: ['hover', 'data-[selected]'],
        },
        {
            pattern:
                /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern:
                /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
        {
            pattern:
                /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
        },
    ],
    plugins: [require('@tailwindcss/typography')],
}
export default config
