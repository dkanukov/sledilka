'use client'
import { ConfigProvider, Layout, theme } from 'antd'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const [currentTheme, setTheme] = useState<'dark' | 'light'>('dark')

	const handleThemeToggle = () => {
		setTheme(currentTheme === 'dark' ? 'light' : 'dark')
	}

	return (
		<ConfigProvider
			theme={{
			}}
		>
			<Layout
				style={{
					minHeight: '100vh',
				}}
			>
				{children}
			</Layout>
		</ConfigProvider>
	)
}