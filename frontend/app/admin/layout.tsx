'use client'
import { ConfigProvider, Layout, theme } from 'antd'

export default function AdminLayout({ children }: { children: React.ReactNode }) {

	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
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
