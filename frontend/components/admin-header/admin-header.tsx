'use client'

import { Layout, Menu, Tabs } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

import styles from './admin-header.module.css'

import { MenuItem } from '@typos'

const { Header } = Layout
export const AdminHeader = () => {
	const path = usePathname()
	const router = useRouter()

	const menuItems: MenuItem[] = [
		{
			label: 'Объекты',
			key: '/admin',
		},
		{
			label: 'Добавить объект',
			key: '/admin/object-create',
		},
	]

	const handleTabClick = (item: MenuItem) => {
		if (!item?.key || typeof item.key !== 'string') {
			return
		}

		router.push(item.key)
	}

	return (
		<Header
			className={styles.header}
		>
			<Menu
				mode={'horizontal'}
				items={menuItems}
				activeKey={path}
				onClick={handleTabClick}
			/>
		</Header>
	)
}
