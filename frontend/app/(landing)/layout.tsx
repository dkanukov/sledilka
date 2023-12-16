'use client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { LandingFooter, LandingHeader } from '@components'

const inter = Inter({ subsets: ['latin'] })

export default function LandingLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<LandingHeader/>
			{children}
			<LandingFooter/>
		</div>
	)
}
