'use client'
import { ConfigProvider, Layout, theme } from 'antd'

import styles from './admin.module.css'

import { AdminHeader } from '@components'

export default function AdminLayout({ children }: { children: React.ReactNode }) {

	return (
		<ConfigProvider
			theme={{
				algorithm: theme.darkAlgorithm,
			}}
		>
			<Layout
				className={styles.page}
			>
				<AdminHeader/>
				{children}
			</Layout>
		</ConfigProvider>
	)
}
