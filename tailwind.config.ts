import {heroui} from '@heroui/theme';
/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const config: Config = {
	theme: {
		extend: {
			screens: {
				...require('tailwindcss/defaultTheme').screens,
				'3xl': '1920px',
			},
			scrollbar: {
				thin: {
					thumb: "#8B8B8B",
					track: "transparent",
				},
			},
			keyframes: {
				'shine': {
					from: {
						backgroundPosition: '200% 0'
					},
					to: {
						backgroundPosition: '-200% 0'
					}
				}
			},
			animation: {
				'shine': 'shine 8s ease-in-out infinite'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'],
				Kaisei: ['Kaisei HarunoUmi', 'sans-serif'],
				Ovo: ['Ovo', 'sans-serif'],
				Roboto: ['Roboto', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
		},
	},
	content: [
		'./src/app/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/**/*.{js,ts,jsx,tsx}', // optional catch-all routes
		"./node_modules/@heroui/theme/dist/components/(button|ripple|spinner).js"
	],
	plugins: [
		require("tailwindcss-animate"),
		require("tailwind-scrollbar"),
		heroui()
	],
	
};
export default config;
