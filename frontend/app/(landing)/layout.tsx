'use client'
import { ConfigProvider, Layout, theme } from 'antd'
import { useState } from 'react'

import { LandingHeaderV2 } from '@components'

export default function LandingLayout({ children }: { children: React.ReactNode }) {
	const [currentTheme, setTheme] = useState<'dark' | 'light'>('dark')

	const handleThemeToggle = () => {
		setTheme(currentTheme === 'dark' ? 'light' : 'dark')
	}
	return (
		<div>
			<ConfigProvider
				theme={{
					algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
				}}
			>
				<Layout
					style={{
						minHeight: '100vh',
					}}
				>
					<LandingHeaderV2
						currentTheme={currentTheme}
						whenThemeToggle={handleThemeToggle}
					/>
					{children}
				</Layout>
			</ConfigProvider>
		</div>
	)
}
